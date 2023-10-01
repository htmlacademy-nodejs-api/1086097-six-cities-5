import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';

const MIN = 1;
const MAX = 5;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem<string>(this.mockData.city);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreview);
    const images = getRandomItem<string>(this.mockData.images);
    const premium = getRandomItem<string>(this.mockData.premium);
    const favourite = getRandomItem<string>(this.mockData.favourite);
    const rating = generateRandomValue(MIN, MAX).toString();
    const apartmentType = getRandomItem<string>(this.mockData.apartmentType);
    const roomCount = generateRandomValue(MIN, MAX).toString();
    const guestsCount = generateRandomValue(MIN, MAX).toString();
    const cost = '150000';
    const comfort = getRandomItems<string>(this.mockData.comfort).join(';');
    const author = getRandomItem<string>(this.mockData.author);
    const commentsCount = generateRandomValue(MIN, MAX).toString();
    const coords = '48.85661;2.351499';

    // const [firstname, lastname] = author.split(' ');
    return [
      title, description, postDate,
      city, imagePreview, images,
      premium, favourite, rating, apartmentType,
      roomCount, guestsCount, cost, comfort,
      author, commentsCount, coords,
    ].join('\t');
  }
}
