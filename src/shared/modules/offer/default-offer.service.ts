import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';
// import { __values } from 'tslib';

const DEFAULT_OFFER_COUNT = 60;
const PREMIUM_OFFER_LIMIT = 3;

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

  public async updateFavourite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findOneAndUpdate({_id: offerId }, [{'$set': {favourite : {'$not': '$favourite'}}}])
      .populate(['author'])
      .exec();
  }

  /////////////////////////////пока не работает
  public async getFavourite(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel.aggregate([
      {
        $lookup: {
          from: 'Users',
          let: { offerId: '$_id'},
          pipeline: [
            {$match: {$expr: { $in: ['$$offerId', '$favoriteOffers'] }}},
            {$project: {_id: 1}}
          ],
          as: 'favorites'
        }
      },
      { $match: { $expr: { $in: [{ _id: { $toObjectId: userId } }, '$favorites'] } } }

    ]).exec();
    return offers;
  }

  // public async addToFavourite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
  //   return this.offerModel
  //     .findOneAndUpdate({_id: offerId }, [{'$set': {favourite : {'$not': '$favourite'}}}])
  //     .populate(['author'])
  //     .exec();
  // }

  public async getPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({city: city, premium: true}, {}, {})
      .limit(PREMIUM_OFFER_LIMIT)
      .sort({ createdAt: SortType.Down })
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
}
