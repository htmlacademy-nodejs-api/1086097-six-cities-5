import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public name: string;

  @Expose()
  public mail: string;

  @Expose()
  public avatar?: string;

  @Expose()
  public userType: string;
}
