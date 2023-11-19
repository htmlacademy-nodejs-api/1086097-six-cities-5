import { MAX_PERCENT_STARS_WIDTH, STARS_COUNT, CityLocation } from './const';
import { Type, Offer, OfferPreview } from './types/types';
import { OfferDto, OfferPreviewDto } from './dto/offer/offer.dto';

export const formatDate = (date: string) => new Intl.DateTimeFormat(
  'en-US',
  {'month':'long','year':'numeric'}
).format( new Date(date) );

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.round(rating)) / STARS_COUNT}%`;

export const getRandomElement = <T>(array: readonly T[]): T => array[Math.floor(Math.random() * array.length)];
export const pluralize = (str: string, count: number) => count === 1 ? str : `${str}s`;
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export class Token {
  private static _name = 'six-cities-auth-token';

  static get() {
    const token = localStorage.getItem(this._name);

    return token ?? '';
  }

  static save(token: string) {
    localStorage.setItem(this._name, token);
  }

  static drop() {
    localStorage.removeItem(this._name);
  }
}

export const getTime = () => {
  const date = new Date();
  return date.toISOString();
};

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.cost,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.premium,
  isFavorite: offer.favourite,
  city: {
    name: offer.city,
    location: CityLocation[offer.city]
  },
  location: offer.coords,
  previewImage: offer.imagePreview,
  type: offer.apartmentType,
  bedrooms: offer.roomCount,
  description: offer.description,
  goods: offer.comfort,
  host: offer.author,
  images: offer.images,
  maxAdults: offer.guestsCount
});


export const adaptOfferPreviewToClient = (offer: OfferPreviewDto): OfferPreview => ({
  id: offer.id,
  price: offer.cost,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.premium,
  isFavorite: offer.favourite,
  city: {
    name: offer.city,
    location: CityLocation[offer.city]
  },
  location: offer.coords,
  previewImage: offer.imagePreview,
  type: offer.apartmentType,
  bedrooms: offer.roomCount,
});

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] => offers.map((offer) => adaptOfferToClient(offer));

export const adaptAvatarToServer =
  (file: File) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export enum ApartmentType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  ROOM = 'room',
  HOTEL = 'hotel',
}

export const adaptHousingTypeToClient = (apartmentType: ApartmentType): Type => {
  switch (apartmentType) {
    case ApartmentType.APARTMENT:
      return 'apartment';
    case ApartmentType.HOTEL:
      return 'hotel';
    case ApartmentType.HOUSE:
      return 'house';
    case ApartmentType.ROOM:
      return 'room';
    default:
      throw new Error(`Unknown type ${apartmentType}`);
  }
};
