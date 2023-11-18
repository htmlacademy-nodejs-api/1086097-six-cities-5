import { UserType } from './types';

export class UserDto {
  public id!: string;

  public email!: string;

  public avatarUrl!: string;

  public name!: string;

  public type!: UserType;
}
