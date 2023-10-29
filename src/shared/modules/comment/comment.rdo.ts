import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
  // @Transform((value) => value)
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: string;

  // @Expose()
  // public offerId: string;

  // @Expose()
  // public author: string;
}
