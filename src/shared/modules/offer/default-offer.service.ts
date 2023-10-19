import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';

const DEFAULT_OFFER_COUNT = 60;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['author'])
      .exec();
  }

  public async findDetailed(count: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = !count || count && count > DEFAULT_OFFER_COUNT ? DEFAULT_OFFER_COUNT : count;
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id'},
            pipeline: [
              {$match: {$expr: { $eq: ['$offerId', '$$offerId'] }}},
              {$project: {offerId: 1, rating: 1}},
            ],
            as: 'commentsCount'
          },
        },
        { $addFields:
          { id: {$toString: '$_id'},
            commentsCount: { $size: '$commentsCount'},
            rating: {$avg: '$commentsCount.rating'},
            postDate: '$createdAt',
          }
        },
        { $unset: ['updatedAt', 'createdAt', '_id', '__v']},
        { $limit: limit }
      ])
      .exec();
  }

  public async find(count: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = !count || count && count > DEFAULT_OFFER_COUNT ? DEFAULT_OFFER_COUNT : count;
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id'},
            pipeline: [
              {$match: {$expr: { $eq: ['$offerId', '$$offerId'] }}},
              {$project: {offerId: 1, rating: 1}},
            ],
            as: 'commentsCount'
          },
        },
        { $addFields:
          { id: {$toString: '$_id'},
            commentsCount: { $size: '$commentsCount'},
            rating: {$avg: '$commentsCount.rating'},
            postDate: '$createdAt',

          }
        },
        { $unset: ['roomCount', 'guestsCount', 'coords', 'updatedAt', 'createdAt', 'author', 'images', 'description', '_id', '__v']},
        { $limit: limit }
      ])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['author'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {commentsCount: 1,}})
      .exec();
  }

  public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(count)
      .populate(['author'])
      .exec();
  }

  public async findDiscussed(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ commentCount: SortType.Down })
      .limit(count)
      .populate(['author'])
      .exec();
  }
}
