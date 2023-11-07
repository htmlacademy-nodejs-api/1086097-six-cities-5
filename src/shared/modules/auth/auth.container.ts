import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { AuthService, DefaultAuthService, AuthExceptionFilter } from './index.js';
import { ExceptionFilter } from '../../libs/rest/index.js';


export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  return authContainer;
}
