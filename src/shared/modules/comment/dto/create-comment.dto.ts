import { IsInt, Min, Max, IsMongoId, MaxLength, MinLength } from 'class-validator';
import { RATING, TEXT_LENGTH } from '../index.js';

const CreateCommentValidationMessage = {
  text: {
    invalidFormat: 'text must be a valid string date',
    minLength: 'Minimum title length must be 5',
    maxLength: 'Maximum title length must be 1024',
  },
  rating: {
    invalidFormat: 'rating must be a valid int date',
    min: 'Minimum title length must be 1',
    max: 'Maximum title length must be 5',
  },
  offerId: {
    invalidFormat: 'OfferId field must be a valid id',
  },
};

export class CreateCommentDto {
  @MinLength(TEXT_LENGTH.MIN, {message: CreateCommentValidationMessage.text.minLength})
  @MaxLength(TEXT_LENGTH.MAX, {message: CreateCommentValidationMessage.text.maxLength})
  public text: string;

  @IsInt({ message: CreateCommentValidationMessage.rating.invalidFormat })
  @Min(RATING.MIN, { message: CreateCommentValidationMessage.rating.min })
  @Max(RATING.MAX, { message: CreateCommentValidationMessage.rating.max })
  public rating: number;

  @IsMongoId({ message: CreateCommentValidationMessage.offerId.invalidFormat })
  public offerId: string;

  public author: string;
}
