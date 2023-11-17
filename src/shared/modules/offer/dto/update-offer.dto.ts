import {
  CreateOfferValidationMessage,
  CoordinatesDto,
  TITLE_LENGTH,
  DESCRIPTION_LENGTH,
  PRICE, ROOMS, GUESTS,
  OFFER_IMAGES_AMOUNT,
} from '../index.js';
import { IsOptional, IsArray, ValidateNested, IsDateString, ArrayMinSize, ArrayMaxSize, IsEnum, IsInt, Max, MaxLength, Min, MinLength, IsString, IsBoolean} from 'class-validator';
import {User, ApartmentType, ComfortType, Coords } from '../../../types/index.js';
import { Type } from 'class-transformer';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(TITLE_LENGTH.MIN, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(TITLE_LENGTH.MAX, {message: CreateOfferValidationMessage.title.maxLength})
  public title?: string;

  @IsOptional()
  @MinLength(DESCRIPTION_LENGTH.MIN, {message: CreateOfferValidationMessage.description.minLength})
  @MaxLength(DESCRIPTION_LENGTH.MAX, {message: CreateOfferValidationMessage.description.maxLength})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: CreateOfferValidationMessage.postDate.invalidFormat})
  public postDate?: Date;

  @IsOptional()
  @IsString({message: CreateOfferValidationMessage.city.invalidFormat})
  public city?: string;

  @IsOptional()
  @IsString({message: CreateOfferValidationMessage.city.invalidFormat})
  public imagePreview?: string;

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMinSize(OFFER_IMAGES_AMOUNT, { message: CreateOfferValidationMessage.images.invalidSize })
  @ArrayMaxSize(OFFER_IMAGES_AMOUNT, { message: CreateOfferValidationMessage.images.invalidSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.premium.invalidFormat })
  public premium?: boolean;

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.favourite.invalidFormat })
  public favourite?: boolean;

  @IsOptional()
  public rating?: number;

  @IsOptional()
  @IsEnum(ApartmentType, { message: CreateOfferValidationMessage.apartmentType.invalid,})
  public apartmentType?: string;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.roomCount.invalidFormat })
  @Min(ROOMS.MIN, { message: CreateOfferValidationMessage.roomCount.minValue })
  @Max(ROOMS.MAX, { message: CreateOfferValidationMessage.roomCount.maxValue })
  public roomCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(GUESTS.MIN, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(GUESTS.MAX, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.cost.invalidFormat })
  @Min(PRICE.MIN, { message: CreateOfferValidationMessage.cost.minValue })
  @Max(PRICE.MAX, { message: CreateOfferValidationMessage.cost.maxValue })
  public cost?: number;

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.comfortType.invalidFormat})
  @IsEnum(ComfortType, {each: true, message: CreateOfferValidationMessage.comfortType.invalid})
  public comfort?: string[];

  @IsOptional()
  public author?: User;

  @IsOptional()
  public commentsCount?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coords?: Coords;
}
