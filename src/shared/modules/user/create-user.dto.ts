import { UserType } from '../../types/index.js';
import { IsOptional, Length, IsEmail, IsEnum, MaxLength, MinLength, IsString } from 'class-validator';

const CreateUserValidationMessage = {
  name: {
    invalidFormat: 'name must be a valid string date',
    minLength: 'Minimum title length must be 1',
    maxLength: 'Maximum title length must be 15',
  },
  mail: {
    invalidFormat: 'Mail must be a valid',
  },
  userType: {
    invalidFormat: 'userType must be one of: pro or обычный',
  },
  password: {
    invalidFormat: 'password must be from 6 to 12 characters',
  },
};

export class CreateUserDto {
  @IsString({message: CreateUserValidationMessage.name.invalidFormat})
  @MinLength(1, {message: CreateUserValidationMessage.name.minLength})
  @MaxLength(15, {message: CreateUserValidationMessage.name.maxLength})
  public name: string;

  @IsEmail({}, {message: CreateUserValidationMessage.mail.invalidFormat})
  public mail: string;

  @IsOptional()
  public avatar?: string;

  @IsEnum(UserType, { message: CreateUserValidationMessage.userType.invalidFormat })
  public userType: UserType;

  @Length(6, 12, { message: CreateUserValidationMessage.password.invalidFormat })
  public password: string;
}
