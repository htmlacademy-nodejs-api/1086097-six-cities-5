import { Expose } from 'class-transformer';

export class OfferRdoShort {
  @Expose()
  public title: string;

  @Expose()
  public city: string;

  @Expose()
  public imagePreview: string;

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
}
