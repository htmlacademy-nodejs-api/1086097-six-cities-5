import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateCommentDto } from './index.js';
import { CommentService } from './index.js';
import { OfferService } from '../offer/index.js';
// import { StatusCodes } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

export type ParamOfferId = {
  id: string;
} | ParamsDictionary;

@injectable()
export class CommentController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) protected readonly commentService: CommentService,
    @inject(Component.OfferService) protected readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.findCommentsByOfferId });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async create({ body }: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const comment = await this.commentService.create(body);
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
    this.logger.info(`Created comment for offer ${body.offerId}`);
  }

  public async findCommentsByOfferId({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.id);
    this.ok(res, fillDTO(CommentRdo, comments));
    this.logger.info(`Comments for offer with id: ${params.id}`);
  }
}
