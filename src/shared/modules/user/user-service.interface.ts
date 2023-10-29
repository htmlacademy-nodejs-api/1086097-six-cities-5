import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './create-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByIdAndAddToFavourite(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null>;
  findByIdAndDeleteFromFavourite(offerId: string, userId: string): Promise<DocumentType<UserEntity> | null>;
}
