import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer } from '../../types/index.js';
import chalk from 'chalk';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    try {
      this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
    } catch (error: unknown) {
      console.error(chalk.red('Unknown format'));
    }
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error(chalk.red('File was not read'));
    }

    return this.rawData
      .split('\n')
      .filter((row) => row
        .trim().length > 0).map((line) => line
        .split('\t')).map(([title, description, postDate, city, imagePreview, images, premium, favourite, rating, apartmentType, roomCount, guestsCount, cost, comfort, author, commentsCount, latitude, longitude]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city,
        imagePreview,
        images: images.split(';').map((name) => name),
        premium: premium === 'true',
        favourite: favourite === 'false',
        rating: Number.parseInt(rating, 10),
        apartmentType,
        roomCount: Number.parseInt(roomCount, 10),
        guestsCount: Number.parseInt(guestsCount, 10),
        cost: Number.parseInt(cost, 10),
        comfort: comfort.split(';').map((name) => name),
        author,
        commentsCount: Number.parseInt(commentsCount, 10),
        coords: {latitude, longitude},
      }));
  }
}
