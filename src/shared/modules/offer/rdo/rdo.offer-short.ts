import { Expose } from 'class-transformer';
import { Coords } from '../../../types/index.js';

export class OfferRdoShort {
  @Expose()
  public title: string;

  @Expose()
  public city: string;

  @Expose()
  public imagePreview: string;

  @Expose()
  public coords: Coords;

  @Expose()
  public premium: boolean;

  @Expose()
  public favourite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public apartmentType: string;

  @Expose()
  public cost: number;

  @Expose()
  public comfort: string[];

  @Expose()
  public commentsCount: number;

  @Expose()
  public id: string;

  @Expose({ name: 'postDate'})
  public createdAt: string;
}
