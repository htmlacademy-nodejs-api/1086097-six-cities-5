import { CreateOfferValidationMessage, CoordinatesDto } from './index.js';
import { Coords, ApartmentType, СomfortType } from '../../types/index.js';
import { IsArray, ValidateNested, IsDateString, ArrayMinSize, ArrayMaxSize, IsEnum, IsInt, Max, MaxLength, Min, MinLength, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @MinLength(10, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: CreateOfferValidationMessage.title.maxLength})
  public title: string;

  @MinLength(20, {message: CreateOfferValidationMessage.description.minLength})
  @MaxLength(1024, {message: CreateOfferValidationMessage.description.maxLength})
  public description: string;

  @IsDateString({}, {message: CreateOfferValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  @IsString({message: CreateOfferValidationMessage.city.invalidFormat})
  public city: string;

  @IsString({message: CreateOfferValidationMessage.city.invalidFormat})
  public imagePreview: string;

  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.invalidSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.invalidSize })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.premium.invalidFormat })
  public premium: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.favourite.invalidFormat })
  public favourite: boolean;

  public rating: number;

  @IsEnum(ApartmentType, { message: CreateOfferValidationMessage.apartmentType.invalid,})
  public apartmentType: string;

  @IsInt({ message: CreateOfferValidationMessage.roomCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomCount.maxValue })
  public roomCount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.cost.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.cost.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.cost.maxValue })
  public cost: number;

  @IsArray({message: CreateOfferValidationMessage.comfortType.invalidFormat})
  @IsEnum(СomfortType, {each: true, message: CreateOfferValidationMessage.comfortType.invalid})
  public comfort: string[];

  // @IsMongoId({ message: CreateOfferValidationMessage.author.invalidId })
  public author: string;

  public commentsCount: number;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coords: Coords;
}
