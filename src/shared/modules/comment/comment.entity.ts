import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'comments'}})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public text: string;

  @prop({ trim: true, required: true })
  public rating: string;

  @prop({ trim: true, required: true })
  public postDate: string;

  @prop({ref: UserEntity, required: true,})
  public author: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
