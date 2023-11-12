import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public mail: string;

  @Expose()
  public id: string;

  @Expose()
  public avatar: string;
}
