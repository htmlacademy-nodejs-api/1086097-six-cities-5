import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto, UpdateUserDto } from './index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(mail: string): Promise<DocumentType<UserEntity> | null>;
  updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  // findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByIdAndAddToFavourite(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null>;
  findByIdAndDeleteFromFavourite(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null>;
}
