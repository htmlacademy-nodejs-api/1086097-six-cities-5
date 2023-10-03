export * from './component.enum.js';

export type UserType = {
  pro: boolean;
}

export type User = {
  name: string;
  mail: string;
  avatar?: string;
  password: string;
  userType: UserType;
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
  author: string;
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
}
