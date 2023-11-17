import { UserType } from '../../../types/index.js';
import { Length, IsEmail, IsEnum, MaxLength, MinLength, IsString } from 'class-validator';
import { NAME_LENGTH, PASSWORD_LENGTH } from '../index.js';

const CreateUserValidationMessage = {
  name: {
    invalidFormat: 'name must be a valid string date',
    minLength: 'Minimum title length must be 1',
    maxLength: 'Maximum title length must be 15',
  },
  email: {
    invalidFormat: 'Mail must be a valid',
  },
  type: {
    invalidFormat: 'userType must be one of: pro or обычный',
  },
  password: {
    invalidFormat: 'password must be from 6 to 12 characters',
  },
};

export class CreateUserDto {
  @IsString({message: CreateUserValidationMessage.name.invalidFormat})
  @MinLength(NAME_LENGTH.MIN, {message: CreateUserValidationMessage.name.minLength})
  @MaxLength(NAME_LENGTH.MAX, {message: CreateUserValidationMessage.name.maxLength})
  public name: string;

  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidFormat})
  public email: string;

  @IsEnum(UserType, { message: CreateUserValidationMessage.type.invalidFormat })
  public type: UserType;

  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, { message: CreateUserValidationMessage.password.invalidFormat })
  public password: string;
}
