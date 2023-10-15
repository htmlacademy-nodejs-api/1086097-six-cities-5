import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DefaultUserService, UserService } from './index.js';
import { Component } from '../../types/component.enum.js';
import { UserEntity, UserModel } from './index.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  return userContainer;
}
