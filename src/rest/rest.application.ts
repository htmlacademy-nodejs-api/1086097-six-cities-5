import { Logger } from '../shared/libs/logger/index.js';
import { LoggerMessage } from '../shared/helpers/const.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/database.js';

// import { CommentService } from '../shared/modules/comment/index.js';
import { OfferService } from '../shared/modules/offer/index.js';
// import { UserService } from '../shared/modules/user/index.js';
// import { UserType } from '../shared/types/index.js';

// import { DefaultUserService } from '../shared/modules/user/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    // @inject(Component.UserService) private readonly UserService: UserService,
    // @inject(Component.CommentService) private readonly CommentService: CommentService,
  ) {}

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

  public async init() {
    this.logger.info(LoggerMessage.INITIALIZATION);
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDb();
    this.logger.info('Init database completed');

    //  const newob = {
    //   title: "Sverdlov Hotel",
    //   description: "its may hotel its beautyfull hotel",
    //   postDate: new Date,
    //   city: "Paris",
    //   imagePreview: 'cologne.jpg',
    //   images: ['cologne.jpg', 'cologne.jpg'],
    //   premium: false,
    //   favourite: false,
    //   rating: 1,
    //   apartmentType: "room",
    //   roomCount: 3,
    //   guestsCount: 2,
    //   cost: 80000,
    //   comfort: ['Fridge'],
    //   author: Object('652fb855f1959dc5f13f03fa'),
    //   coords: {
    //     latitude: "48.85661",
    //     longitude: "2.351499",
    //   },
    //   commentsCount: 11,
    //   offerId: '',
    //  }

    // const userNew = {
    //   name: 'Олег Попов',
    //   mail: 'avt@yandex.ru',
    //   avatar: 'avvatar.jpg',
    //   userType: UserType.SIMPLE,
    //   password: '',
    // }

    // const commentNew = {
    //   text: 'sdsdf sdf sdf sdfsdfk kj; sdlrt ,;kl;lk;lk dfjjjjjjjj kkkkkkkkkk',
    //   rating: 5,
    //   author: '652fb855f1959dc5f13f03fa',
    //   offerId: '652fbd1a327d91be7e795baa',
    // }


    // const user = await this.UserService.findOrCreate(userNew, 'secret')
    const offer = await this.offerService.find();
    // const comment = await this.CommentService.create(commentNew);
    // const offer = await this.OfferService.create(newob);
    console.log(offer);
    // console.log(comment);

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
