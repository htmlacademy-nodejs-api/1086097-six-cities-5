import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService, CreateOfferDto, OfferRdo, OfferRdoShort, UpdateOfferDto } from './index.js';
import { CommentService } from '../comment/index.js';
import { UserService } from '../user/index.js';
import { RequestParams, RequestBody} from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
export type ParamOfferId = {
  id: string;
} | ParamsDictionary;

export type ParamCity = {
  city: string;
} | ParamsDictionary;

export type ParamUser = {
  _id: string;
} | ParamsDictionary;

export type ParamFavorite = {
  _id: string;
  id: string;
} | ParamsDictionary;

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) protected readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:city', method: HttpMethod.Get, handler: this.getPremiumByCity });
    this.addRoute({ path: '/detailed', method: HttpMethod.Get, handler: this.indexDetailed });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id/:_id', method: HttpMethod.Patch, handler: this.addToFavourite });
    this.addRoute({ path: '/:id/:_id', method: HttpMethod.Delete, handler: this.deleteFromFavourite });
    this.addRoute({ path: '/favorite/:_id', method: HttpMethod.Get, handler: this.getFavourite });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, offers);
  }

  public async indexDetailed(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findDetailed();
    this.ok(res, offers);
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
    this.logger.info(`Created offer ${body.title} in ${body.city}`);
  }

  public async update({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.id, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
    this.logger.info('Offer is updated');
  }

  public async addToFavourite({ params }: Request<ParamFavorite>, res: Response): Promise<void> {
    const favourite = await this.userService.findByIdAndAddToFavourite(params.id, params._id);
    this.logger.info(`User ${params._id} add offer ${params.id} to favorite`);
    this.noContent(res, favourite);
  }

  public async deleteFromFavourite({ params }: Request<ParamFavorite>, res: Response): Promise<void> {
    const favourite = await this.userService.findByIdAndDeleteFromFavourite(params.id, params._id);
    this.logger.info(`User ${params._id} delete offer ${params.id} from favorite`);
    this.noContent(res, favourite);
  }


  ////////////////////

  public async getFavourite({ params }: Request<ParamUser>, res: Response): Promise<void> {
    console.log(params);
    const offers = await this.offerService.getFavourite(params._id);
    this.created(res, fillDTO(OfferRdoShort, offers));
    this.logger.info(`Favorite offers for ${params._id}`);
  }

  // public async updateFavourite({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
  //   const updatedOffer = await this.offerService.updateFavourite(params.id);
  //   this.ok(res, fillDTO(OfferRdoShort, updatedOffer));
  //   this.logger.info('Offer favourite is changed');
  // }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const deletedOffer = await this.offerService.deleteById(params.id);
    await this.commentService.deleteByOfferId(params.id);
    this.noContent(res, deletedOffer);
    this.logger.info('Offer is deleted');
  }

  public async getPremiumByCity({ params }: Request<ParamCity>, res: Response): Promise<void> {
    const offersPremiumByCity = await this.offerService.getPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferRdoShort, offersPremiumByCity));
  }
}
