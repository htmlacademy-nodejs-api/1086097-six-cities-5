
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
