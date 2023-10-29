import { Expose } from 'class-transformer';
import { Coords } from '../../types/index.js';

export class OfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: string;

  @Expose()
  public imagePreview: string;

  @Expose()
  public images: string[];

  @Expose()
  public premium: boolean;

  @Expose()
  public favourite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public apartmentType: string;

  @Expose()
  public roomCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public cost: number;

  @Expose()
  public comfort: string[];

  @Expose()
  public author: string;

  @Expose()
  public commentsCount: number;

  @Expose()
  public coords: Coords;
}
