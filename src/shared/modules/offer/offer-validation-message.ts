import {IsLatitude, IsLongitude } from 'class-validator';

export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalidFormat: 'city must be a valid string date',
  },
  imagePreview: {
    invalidFormat: 'imagePreview must be a valid string date',
  },
  images: {
    invalidFormat: 'images must be an array',
    maxLength: 'Too short for field «images»',
    invalidSize: 'Should always be 6 images',
  },
  premium: {
    invalidFormat: 'premium must be a boolean',
  },
  favourite: {
    invalidFormat: 'favourite must be a boolean',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  apartmentType: {
    invalid: 'apartmentType must be one of: apartment, house, room, hotel',
  },
  guests: {
    invalidFormat: 'guestAmount must be an integer',
    minValue: 'Minimum guest amount is 1',
    maxValue: 'Maximum guest amount is 10',
  },
  roomCount: {
    invalidFormat: 'roomAmount must be an integer',
    minValue: 'Minimum room amount is 1',
    maxValue: 'Maximum room amount is 8',
  },
  guestsCount: {
    invalidFormat: 'guestsCount must be an integer',
    minValue: 'Minimum guests amount is 1',
    maxValue: 'Maximum guests amount is 10',
  },
  cost: {
    invalidFormat: 'cost must be an integer',
    minValue: 'Minimum cost amount is 100',
    maxValue: 'Maximum cost amount is 100000',
  },
  comfortType: {
    invalidFormat: 'СomfortType must be an array',
    invalid:
      'Must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  },
  coords: {
    latitude: 'latitude must be a valid date',
    longitude: 'longitude must be a valid date',
  },
  author: {
    invalidId: 'OfferId field must be a valid id',
  },
} as const;

export class CoordinatesDto {
  @IsLatitude({ message: CreateOfferValidationMessage.coords.latitude })
  public latitude: string;

  @IsLongitude({
    message: CreateOfferValidationMessage.coords.longitude,
  })
  public longitude: string;
}
