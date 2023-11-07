import { Logger } from '../shared/libs/logger/index.js';
import { LoggerMessage } from '../shared/helpers/const.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';
import { AuthExceptionFilter } from '../shared/modules/auth/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/index.js';

import express, { Express } from 'express';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private express: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.OfferController) private readonly оfferController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: AuthExceptionFilter,
  ) {
    this.express = express();
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.express.listen(port);

  }

  private async _initControllers() {
    this.express.use('/comments', this.commentController.router);
    this.express.use('/offers', this.оfferController.router);
    this.express.use('/users', this.userController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.express.use(express.json());
    this.express.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.express.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    console.log(mongoUri);
    return this.databaseClient.connect(mongoUri);
  }

  private async _initExceptionFilters() {
    this.express.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.express.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info(LoggerMessage.INITIALIZATION);

    this.logger.info('Init database…');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers...');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server...');
    await this._initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
