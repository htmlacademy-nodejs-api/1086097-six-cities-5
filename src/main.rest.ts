import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

import { Component } from './shared/types/component.enum.js';

// import { Logger, PinoLogger } from './shared/libs/logger/index.js';
// import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { RestApplication } from './rest/rest.application.js';
// import { MongoDatabaseClient, DatabaseClient } from './shared/libs/database-client/index.js';

async function bootstrap() {
  // const logger = new PinoLogger();
  // const config = new RestConfig(logger);
  // const app = new RestApplication(logger, config);

  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const app = appContainer.get<RestApplication>(Component.RestApplication);
  await app.init();


}

bootstrap();
