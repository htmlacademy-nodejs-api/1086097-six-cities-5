import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { Coords, ApartmentType } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'offers'}})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, minlength: [10, 'Min length for title is 10'], maxlength: [100, 'Max length for title is 100'] })
  public title: string;

  @prop({trim: true, required: true, minlength: [20, 'Min length for description is 20'], maxlength: [1024, 'Max length for description is 1024'] })
  public description: string;

  @prop({required: true})
  public postDate: Date;

  @prop({required: true})
  public city: string;

  @prop({required: true})
  public imagePreview: string;

  @prop({required: true, type: [String]})
  public images: string[];

  @prop({required: true})
  public premium: boolean;

  @prop({required: true})
  public favourite!: boolean;

  @prop({required: true, default: 0, min: 0, max: 5})
  public rating: number;

  @prop({required: true, type: () => String, enum: ApartmentType})
  public apartmentType: ApartmentType;

  @prop({required: true, min: 1, max: 8})
  public roomCount: number;

  @prop({required: true, min: 1, max: 10})
  public guestsCount: number;

  @prop({required: true, min: 100, max: 100000})
  public cost: number;

  @prop({required: true, type: [String]})
  public comfort: string[];

  @prop({required: true})
  public coords: Coords;

  @prop({default: 0})
  public commentsCount: number;

  @prop({ref: UserEntity, required: true, _id: false})
  public author: Ref<UserEntity>;

  public offerId: string;
}

export const OfferModel = getModelForClass(OfferEntity);
