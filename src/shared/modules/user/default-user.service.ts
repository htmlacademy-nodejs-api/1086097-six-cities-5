import { inject, injectable} from 'inversify';
import { UserService } from './index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './index.js';
import { CreateUserDto } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/component.enum.js';

@injectable()
export class DefaultUserService implements UserService {

  constructor (
    @inject(Component.Logger) private logger: Logger,
    @inject(Component.UserModel) private userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.mail}`);
    return result;
  }

  public async findByEmail(mail: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({mail});
  }

  public async findByIdAndAddToFavourite(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, {'$push': {favoriteOffers: offerId}}).exec();
  }

  public async findByIdAndDeleteFromFavourite(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, {'$pull': {favoriteOffers: offerId}}).exec();
  }
}
