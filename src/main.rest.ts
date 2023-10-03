import 'reflect-metadata';
import { Container } from 'inversify';

import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { RestApplication } from './rest/rest.application.js';

import { Component } from './shared/types/index.js';

async function bootstrap() {
  // const logger = new PinoLogger();
  // const config = new RestConfig(logger);
  // const app = new RestApplication(logger, config);

  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const app = container.get<RestApplication>(Symbol.for('RestApplication'));
  await app.init();
}

bootstrap();
