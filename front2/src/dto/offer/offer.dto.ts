import { Type, CityName, User, Location } from '../../types/types';

export class OfferPreviewDto {
  public id!: string;
  public title!: string;
  public createdAt!: string;
  public city!: CityName;
  public coords!: Location;
  public imagePreview!: string;
  public premium!: boolean;
  public favourite!: boolean;
  public rating!: number;
  public apartmentType!: Type;
  public cost!: number;
  public commentsCount!: number;
  public roomCount!: number;
  public postDate!: Date;
}

export class OfferDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public city!: CityName;
  public imagePreview!: string;
  public images!: string[];
  public premium!: boolean;
  public favourite!: boolean;
  public rating!: number;
  public apartmentType!: Type;
  public roomCount!: number;
  public guestsCount!: number;
  public cost!: number;
  public comfort!: string[];
  public author!: User;
  public commentsCount!: number;
  public coords!: Location;
  public postDate!: Date;
}

