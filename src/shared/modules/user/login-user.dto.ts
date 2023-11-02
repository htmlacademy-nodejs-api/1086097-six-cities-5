import { Length, IsEmail, IsString} from 'class-validator';

const CreateUserValidationMessage = {
  mail: {
    invalidFormat: 'Mail must be a valid',
  },
  password: {
    invalidFormat: 'password must be from 6 to 12 characters',
  },
};

export class LoginUserDto {
  @IsEmail({}, {message: CreateUserValidationMessage.mail.invalidFormat})
  public mail: string;

  @IsString()
  @Length(6, 12, { message: CreateUserValidationMessage.password.invalidFormat })
  public password: string;
}
