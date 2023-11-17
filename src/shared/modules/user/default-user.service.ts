import { inject, injectable} from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity, UserService, CreateUserDto, UpdateUserDto, DEFAULT_AVATAR_FILE_NAME } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class DefaultUserService implements UserService {

  constructor (
    @inject(Component.Logger) private logger: Logger,
    @inject(Component.UserModel) private userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async updateById(id: string, dto: UpdateUserDto,): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
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
