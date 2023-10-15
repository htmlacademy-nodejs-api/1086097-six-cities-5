import { Logger } from '../shared/libs/logger/index.js';
import { LoggerMessage } from '../shared/helpers/const.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';

// import { DefaultUserService } from '../shared/modules/user/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    // console.log(mongoUri);
    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info(LoggerMessage.INITIALIZATION);
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDb();


    this.logger.info('Init database completed');

    // const us = {
    //   name: 'Keksik',
    //   mail: 'test@email.ru',
    //   avatar: 'keks.jpg',
    //   userType: 'pro',
    //   password: '123f',
    // };

    // const user = new DefaultUserService();
    // await user.create(us, 'six');


  }
}
