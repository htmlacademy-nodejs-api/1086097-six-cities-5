import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, ValidateObjectIdMiddleware, PrivateRouteMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware, ValidateAuthorsOfferMiddleware, UploadFileMiddleware} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService, CreateOfferDto, OfferRdo, OfferRdoShort, UpdateOfferDto, UploadImagesRdo, UploadPreviewRdo } from './index.js';
import { CommentService } from '../comment/index.js';
import { UserService } from '../user/index.js';
import { RequestParams, RequestBody} from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
export type ParamOfferId = {
  id: string;
} | ParamsDictionary;

export type ParamCity = {
  city: string;
} | ParamsDictionary;

export type RequestQuery = {
  limit?: number;
}

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg'
];

export const OFFER_IMAGES_AMOUNT = 6;

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) protected readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController...');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.indexDetailed, middlewares: [new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')] });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.showPremiumByCity });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(CreateOfferDto)
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
        new ValidateAuthorsOfferMiddleware(this.offerService, 'Offer', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
        new ValidateAuthorsOfferMiddleware(this.offerService, 'Offer', 'id')
      ]
    });
    this.addRoute({ path: '/:id/favorite', method: HttpMethod.Patch, handler: this.addToFavourite, middlewares: [new PrivateRouteMiddleware, new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')]});
    this.addRoute({ path: '/:id/favorite', method: HttpMethod.Delete, handler: this.deleteFromFavourite, middlewares: [new PrivateRouteMiddleware, new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')]});
    this.addRoute({
      path: '/favorite/offers',
      method: HttpMethod.Get,
      handler: this.showFavourite,
      middlewares: [new PrivateRouteMiddleware]
    });
    this.addRoute({
      path: '/:id/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
        new ValidateAuthorsOfferMiddleware(this.offerService, 'Offer', 'id'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'images', ALLOWED_IMAGE_MIME_TYPES, OFFER_IMAGES_AMOUNT),
      ]
    });
    this.addRoute({
      path: '/:id/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
        new ValidateAuthorsOfferMiddleware(this.offerService, 'Offer', 'id'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'imagePreview', ALLOWED_IMAGE_MIME_TYPES),
      ]
    });
  }

  public async uploadImages({ params, files }: Request<ParamOfferId>, res: Response) {
    console.log(files);
    if (!Array.isArray(files)) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'No files were uploaded');
    }

    const updateDto = {images: files.map((file) => file.filename)};
    await this.offerService.updateById(params.id, updateDto);
    this.created(res, fillDTO(UploadImagesRdo, updateDto));
  }

  public async uploadPreview({ params, file }: Request<ParamOfferId>, res: Response) {
    console.log(file);
    const uploadFile = {imagePreview: file?.filename};
    await this.offerService.updateById(params.id, uploadFile);
    this.created(res, fillDTO(UploadPreviewRdo, { imagePreview: uploadFile.imagePreview }));
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.created(res, fillDTO(OfferRdoShort, offers));
  }

  public async indexDetailed({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offers = await this.offerService.findDetailed(params.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body, tokenPayload }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.create({...body, author: tokenPayload.id});
    const result = await this.offerService.findById(offer.id);
    this.created(res, fillDTO(OfferRdo, result));
    this.logger.info(`Created offer ${offer.title} in ${offer.city}`);
  }

  public async update({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.id, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
    this.logger.info('Offer is updated');
  }

  public async addToFavourite({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const favourite = await this.userService.findByIdAndAddToFavourite(params.id, tokenPayload.id);
    this.logger.info(`For user ${tokenPayload.id} add offer ${params.id} to favorite`);
    this.noContent(res, favourite);
  }

  public async deleteFromFavourite({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const favourite = await this.userService.findByIdAndDeleteFromFavourite(params.id, tokenPayload.id);
    this.logger.info(`For user ${tokenPayload.id} delete offer ${params.id} from favorite`);
    this.noContent(res, favourite);
  }

  public async showFavourite({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getFavourite(tokenPayload.id);
    this.created(res, fillDTO(OfferRdoShort, offers));
    this.logger.info(`Favorite offer for ${tokenPayload.id}`);
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
}
