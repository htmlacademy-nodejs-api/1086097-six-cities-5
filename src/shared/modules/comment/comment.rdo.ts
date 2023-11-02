import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../user/index.js';

export class CommentRdo {
  @Expose()
  // @Transform((value) => value)
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: string;

  @Expose({name: 'createdAt'})
  public postDate: string;

  @Expose({ name: 'author'})
  @Type(() => UserRdo)
  public author: UserRdo;
}
