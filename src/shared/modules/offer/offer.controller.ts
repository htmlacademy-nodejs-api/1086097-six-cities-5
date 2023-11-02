import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware} from '../../libs/rest/index.js';
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

export type RequestQuery = {
  limit?: number;
}

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
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.showPremiumByCity });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.indexDetailed, middlewares: [new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')] });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]});
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete, middlewares: [new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')]});
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update, middlewares: [new ValidateObjectIdMiddleware('id'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')] });
    this.addRoute({ path: '/:id/:_id', method: HttpMethod.Patch, handler: this.addToFavourite, middlewares: [new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')]});
    this.addRoute({ path: '/:id/:_id', method: HttpMethod.Delete, handler: this.deleteFromFavourite, middlewares: [new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')]});
    this.addRoute({ path: '/favorite/:_id', method: HttpMethod.Get, handler: this.showFavourite });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.created(res, fillDTO(OfferRdoShort, offers));
  }

  public async indexDetailed({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offers = await this.offerService.findDetailed(params.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    const result = await this.offerService.findById(offer.id);
    this.created(res, fillDTO(OfferRdo, result));
    this.logger.info(`Created offer ${offer.title} in ${offer.city}`);
  }

  public async update({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.id, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
    this.logger.info('Offer is updated');
  }

  public async addToFavourite({ params }: Request<ParamFavorite>, res: Response): Promise<void> {
    const favourite = await this.userService.findByIdAndAddToFavourite(params.id, params._id);
    this.logger.info(`For user ${params._id} add offer ${params.id} to favorite`);
    this.noContent(res, favourite);
  }

  public async deleteFromFavourite({ params }: Request<ParamFavorite>, res: Response): Promise<void> {
    const favourite = await this.userService.findByIdAndDeleteFromFavourite(params.id, params._id);
    this.logger.info(`For user ${params._id} delete offer ${params.id} from favorite`);
    this.noContent(res, favourite);
  }

  public async showFavourite({ params }: Request<ParamUser>, res: Response): Promise<void> {
    const offers = await this.offerService.getFavourite(params._id);
    this.created(res, fillDTO(OfferRdo, offers));
    this.logger.info(`Favorite offer for ${params._id}`);
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

  public async showPremiumByCity({params, query}: Request<ParamCity, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offersPremiumByCity = await this.offerService.getPremiumByCity(params.city, query.limit);
    this.ok(res, fillDTO(OfferRdoShort, offersPremiumByCity));
  }

  // public async getPremiumByCity({ params }: Request<ParamCity>, res: Response): Promise<void> {
  //   const offersPremiumByCity = await this.offerService.getPremiumByCity(params.city);
  //   this.ok(res, fillDTO(OfferRdoShort, offersPremiumByCity));
  // }
}
