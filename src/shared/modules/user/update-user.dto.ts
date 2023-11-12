import { UserType } from '../../types/index.js';

export class UpdateUserDto {
  public avatar?: string;
  public name?: string;
  public userType?: UserType;
}
