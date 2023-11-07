import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

import { Component } from './shared/types/component.enum.js';
import { RestApplication } from './rest/rest.application.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const app = appContainer.get<RestApplication>(Component.RestApplication);
  await app.init();
}

bootstrap();
