import { UserType } from '../../types/index.js';

export class CreateUserDto {
  public name: string;
  public mail: string;
  public avatar?: string;
  public userType: UserType;
  public password: string;
}
