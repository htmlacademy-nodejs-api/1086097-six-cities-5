import { Length, IsEmail, IsString} from 'class-validator';
import { PASSWORD_LENGTH } from '../index.js';

const CreateUserValidationMessage = {
  email: {
    invalidFormat: 'Mail must be a valid',
  },
  password: {
    invalidFormat: 'password must be from 6 to 12 characters',
  },
};

export class LoginUserDto {
  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidFormat})
  public email: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, { message: CreateUserValidationMessage.password.invalidFormat })
  public password: string;
}
