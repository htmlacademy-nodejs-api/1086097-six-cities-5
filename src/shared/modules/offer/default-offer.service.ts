import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity, CreateOfferDto, UpdateOfferDto, DEFAULT_OFFER_COUNT, PREMIUM_OFFER_LIMIT } from './index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
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

  public authorPipeline = [
    {
      $lookup: {
        from: 'Users',
        localField: 'author',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $addFields: {
        author: { $arrayElemAt: ['$users', 0] },
      },
    },
    {
      $unset: ['users'],
    },
  ];

  public async findDetailed(id: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
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
        { $limit: limit },
        {
          $lookup: {
            from: 'Users',
            localField: 'author',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $addFields: {
            author: { $arrayElemAt: ['$users', 0] },
          },
        },
        {
          $unset: ['users'],
        },
        {
          $match: {$expr: {$eq: ['$id', id]}}
        },
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
        { $unset: ['_id', '__v']},
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

  public async getFavourite(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel.aggregate([
      {
        $lookup: {
          from: 'Users',
          let: { userId: { $toObjectId: userId } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { _id: 0, favoriteOffers: 1 } },
          ],
          as: 'users',
        },
      },
      {
        $addFields: {
          favorites: { $arrayElemAt: ['$users', 0] },
        },
      },
      {
        $unset: ['users'],
      },
      // {
      //   $match: {
      //     $expr: {
      //       $in: ['$_id', '$favorites.favoriteOffers'],
      //     },
      //   }
      // },

      {
        $match: {
          $expr: {
            $in: ['$_id', { $map: { input: '$favorites.favoriteOffers', as: 'favorite', in: { $toObjectId: '$$favorite' } } }],
          },
        }
      },
      {'$set': {favourite : {'$not': '$favourite'}}}
    ]).exec();
    return offers;
  }

  public async getPremiumByCity(city: string, query: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = !query || query > PREMIUM_OFFER_LIMIT ? PREMIUM_OFFER_LIMIT : query;
    return this.offerModel
      .find({city: city, premium: true}, {}, {})
      .limit(limit)
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {commentsCount: 1,}})
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }

  public async isAuthorsOffer(documentId: string, author: string): Promise<boolean> {
    const isAuthor = await this.offerModel.findOne({ _id: documentId, author: author });
    return !!isAuthor;
  }
}
