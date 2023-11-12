import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto, CreateOfferDto } from './index.js';
import { DocumentExists } from '../../libs/rest/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  findDetailed(id: string, count?: number): Promise<DocumentType<OfferEntity>[] | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateFavourite(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getFavourite(userId: string): Promise<DocumentType<OfferEntity>[]>;
  getPremiumByCity(city: string, query?: number): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  isAuthorsOffer(offerId: string, author: string): Promise<boolean>;
}
