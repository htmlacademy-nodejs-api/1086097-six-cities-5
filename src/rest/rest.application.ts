import { Logger } from '../shared/libs/logger/index.js';
import { LoggerMessage } from '../shared/helpers/const.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';

import express, { Express } from 'express';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';


// import { CommentService } from '../shared/modules/comment/index.js';
// import { OfferService } from '../shared/modules/offer/index.js';
// import { UserService } from '../shared/modules/user/index.js';
// import { UserType } from '../shared/types/index.js';

// import { DefaultUserService } from '../shared/modules/user/index.js';

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


    // @inject(Component.OfferService) private readonly offerService: OfferService,
    // @inject(Component.UserService) private readonly UserService: UserService,
    // @inject(Component.CommentService) private readonly commentService: CommentService,
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
    this.express.use(express.json());
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

    // const userNew = {
    //   name: 'Олег Попов',
    //   mail: 'avt@yandex.ru',
    //   avatar: 'avvatar.jpg',
    //   userType: UserType.SIMPLE,
    //   password: '',
    // }

    // const commentNew = {
    //   text: 'Best best best. Uraaaaaaaa fun fun fun',
    //   rating: 5,
    //   author: '65393031ea34f7018af34a94',
    //   offerId: '65393031ea34f7018af34a96',
    // };


    // const user = await this.UserService.findOrCreate(userNew, 'secret')
    // const offer = await this.offerService.find();
    // const comment = await this.commentService.findByOfferId('65393031ea34f7018af34a96');
    // const offer = await this.OfferService.create(newob);
    // console.log(comment);

    // const user = new DefaultUserService();
    // await user.create(us, 'six');

  }
}
