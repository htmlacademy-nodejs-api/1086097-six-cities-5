import { CreateOfferValidationMessage, CoordinatesDto } from './index.js';
import { IsOptional, IsArray, ValidateNested, IsDateString, ArrayMinSize, ArrayMaxSize, IsEnum, IsInt, Max, MaxLength, Min, MinLength, IsString, IsBoolean} from 'class-validator';
import {User, ApartmentType, СomfortType, Coords } from '../../types/index.js';
import { Type } from 'class-transformer';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: CreateOfferValidationMessage.title.maxLength})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: CreateOfferValidationMessage.description.minLength})
  @MaxLength(1024, {message: CreateOfferValidationMessage.description.maxLength})
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
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.invalidSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.invalidSize })
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
  @Min(1, { message: CreateOfferValidationMessage.roomCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomCount.maxValue })
  public roomCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.cost.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.cost.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.cost.maxValue })
  public cost?: number;

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.comfortType.invalidFormat})
  @IsEnum(СomfortType, {each: true, message: CreateOfferValidationMessage.comfortType.invalid})
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
