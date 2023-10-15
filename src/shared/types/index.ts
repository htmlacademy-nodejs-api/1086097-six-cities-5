export * from './component.enum.js';

export enum UserType {
  PRO = 'pro',
  SIMPLE = 'обычный',
}

export enum SortType {
  Down = -1,
  Up = 1,
}

export enum СomfortType {
  BREAKFAST = 'Breakfast',
  AIR = 'Air conditioning',
  LAPTOR = 'Laptop friendly workspace',
  BABY_SEAT = 'Baby seat',
  WASHER = 'Washer',
  TOWELS = 'Towels',
  FRIDGE = 'Fridge',
}

export enum ApartmentType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  ROOM = 'room',
  HOTEL = 'hotel',
}

export type User = {
  name: string;
  mail: string;
  avatar?: string;
  userType: UserType;
  password: string;
}

export type Comment = {
  text: string;
  postDate: Date;
  rating: number;
  author: User,
}

export type Coords = {
  latitude: string;
  longitude: string;
}

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: string;
  imagePreview: string;
  images: string[];
  premium: boolean;
  favourite: boolean;
  rating: number;
  apartmentType: string;
  roomCount: number;
  guestsCount: number;
  cost: number;
  comfort: string[];
  author: User;
  commentsCount: number;
  coords: Coords;
}

export type MockServerData = {
  categories: string[];
  titles: string[];
  descriptions: string[];
  city: string[];
  imagePreview: string[];
  images: string[];
  premium: string[];
  favourite: string[];
  apartmentType: string[];
  comfort: string[];
  author: string[];
  type: string[];
}
