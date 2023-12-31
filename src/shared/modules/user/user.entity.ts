import { User, UserType } from '../../types/index.js';
import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'Users', timestamps: true,} })

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, minlength: [5, 'Min length for name path is 5'], maxlength: [15, 'Max length for name path is 15']})
  public name: string;

  @prop({required: true, unique: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect']})
  public email: string;

  @prop()
  public avatar?: string;

  @prop({default: [], type: [String]})
  public favoriteOffers: string[];

  @prop({required: true, type: () => String, enum: UserType})
  public type: UserType;

  @prop({required: true})
  public password: string;

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData?.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
