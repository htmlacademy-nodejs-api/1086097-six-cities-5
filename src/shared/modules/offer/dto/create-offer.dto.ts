import {
  CreateOfferValidationMessage,
  CoordinatesDto,
  TITLE_LENGTH,
  DESCRIPTION_LENGTH,
  PRICE, ROOMS, GUESTS,
  OFFER_IMAGES_AMOUNT,
} from '../index.js';
import { Coords, ApartmentType, ComfortType } from '../../../types/index.js';
import { IsArray, ValidateNested, IsDateString, ArrayMinSize, ArrayMaxSize, IsEnum, IsInt, Max, MaxLength, Min, MinLength, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @MinLength(TITLE_LENGTH.MIN, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(TITLE_LENGTH.MAX, {message: CreateOfferValidationMessage.title.maxLength})
  public title: string;

  @MinLength(DESCRIPTION_LENGTH.MIN, {message: CreateOfferValidationMessage.description.minLength})
  @MaxLength(DESCRIPTION_LENGTH.MAX, {message: CreateOfferValidationMessage.description.maxLength})
  public description: string;

  @IsDateString({}, {message: CreateOfferValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  @IsString({message: CreateOfferValidationMessage.city.invalidFormat})
  public city: string;

  @IsString({message: CreateOfferValidationMessage.city.invalidFormat})
  public imagePreview: string;

  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMinSize(OFFER_IMAGES_AMOUNT, { message: CreateOfferValidationMessage.images.invalidSize })
  @ArrayMaxSize(OFFER_IMAGES_AMOUNT, { message: CreateOfferValidationMessage.images.invalidSize })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.premium.invalidFormat })
  public premium: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.favourite.invalidFormat })
  public favourite: boolean;

  public rating: number;

  @IsEnum(ApartmentType, { message: CreateOfferValidationMessage.apartmentType.invalid,})
  public apartmentType: string;

  @IsInt({ message: CreateOfferValidationMessage.roomCount.invalidFormat })
  @Min(ROOMS.MIN, { message: CreateOfferValidationMessage.roomCount.minValue })
  @Max(ROOMS.MAX, { message: CreateOfferValidationMessage.roomCount.maxValue })
  public roomCount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(GUESTS.MIN, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(GUESTS.MAX, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.cost.invalidFormat })
  @Min(PRICE.MIN, { message: CreateOfferValidationMessage.cost.minValue })
  @Max(PRICE.MAX, { message: CreateOfferValidationMessage.cost.maxValue })
  public cost: number;

  @IsArray({message: CreateOfferValidationMessage.comfortType.invalidFormat})
  @IsEnum(ComfortType, {each: true, message: CreateOfferValidationMessage.comfortType.invalid})
  public comfort: string[];

  // @IsMongoId({ message: CreateOfferValidationMessage.author.invalidId })
  public author: string;

  public commentsCount: number;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coords: Coords;
}
