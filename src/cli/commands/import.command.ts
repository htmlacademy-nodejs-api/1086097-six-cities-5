import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interface.js';
import { createOffer, getErrorMessage, StatusMessage } from '../../shared/helpers/index.js';
import chalk from 'chalk';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { DefaultUserService, UserService, UserModel } from '../../shared/modules/user/index.js';
// import { DefaultCommentService, CommentService, CommentModel} from '../../shared/modules/comment/index.js';
import { DefaultOfferService, OfferService, OfferModel} from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { getMongoURI } from '../../shared/helpers/index.js';
import { Offer } from '../../shared/types/index.js';

export const DEFAULT_DB_PORT = '27017';
export const DEFAULT_USER_PASSWORD = '123456';

export class ImportCommand implements Command {
  private logger: Logger;
  private databaseClient: DatabaseClient;
  private userService: UserService;
  // private commentService: CommentService;
  private offerService: OfferService;
  private salt: string;

  constructor () {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    // this.commentService = new DefaultCommentService(CommentModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
  }

  public getName(): string {
    return '--import';
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      imagePreview: offer.imagePreview,
      images: offer.images,
      premium: offer.premium,
      favourite: offer.favourite,
      rating: offer.rating,
      apartmentType: offer.apartmentType,
      roomCount: offer.roomCount,
      guestsCount: offer.guestsCount,
      cost: offer.cost,
      comfort: offer.comfort,
      author: user,
      commentsCount: 0,
      coords: offer.coords,
      offerId: ''
    });
  }

  //старая реализация метода onImportedLine
  // private onImportedLine(line: string) {
  //   const offer = createOffer(line);
  //   console.info(offer);
  // }
  /////////////////////

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(chalk.blueBright(`${count} rows imported.`));
    this.databaseClient.disconnect();
  }

  // for (const { name } of offer.categories) {
  //   const existComments = await this.commentService.findByOfferId(name, { name });
  //   categories.push(existComments.id);
  // }


  //старая реализация в файл, первые две строчки
  // public async execute(...parameters: string[]): Promise<void> {
  //   const [filename] = parameters;
  /////////////////////

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;
    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (err) {
      console.error(chalk.red(`${StatusMessage.NOT_IMPORT_FILE} ${filename}`));
      console.error(getErrorMessage(err));
    }
  }
}
