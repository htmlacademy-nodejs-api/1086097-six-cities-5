import { Expose } from 'class-transformer';

export class UploadAvatarRdo {
  @Expose()
  public avatar: string;
}
