import express, { Express } from 'express';
import cors from 'cors';
import { Logger } from '../shared/libs/logger/index.js';
import { LoggerMessage } from '../shared/helpers/const.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';
import { AuthExceptionFilter } from '../shared/modules/auth/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/index.js';
import { getFullServerPath } from '../shared/helpers/common.js';
import { STATIC_UPLOAD_ROUTE, STATIC_FILES_ROUTE } from './index.js';
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
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter,
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
    this.express.use(STATIC_UPLOAD_ROUTE, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.express.use(STATIC_FILES_ROUTE, express.static(this.config.get('STATIC_DIRECTORY_PATH')));
    this.express.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.express.use(cors());
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
    this.express.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.express.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
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
    this.logger.info(`🚀 Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }
}
