import { Expose, Type } from 'class-transformer';
import { Coords } from '../../types/index.js';
import { UserRdo } from '../user/index.js';

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

  @Expose({ name: 'author'})
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public commentsCount: number;

  @Expose()
  public coords: Coords;

  // @Expose()
  // public favorites?: string[];
}
