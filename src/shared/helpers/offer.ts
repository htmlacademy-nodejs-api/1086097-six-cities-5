import { Offer } from '../types/index.js';
import { UserType } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    postDate,
    city,
    imagePreview,
    images,
    premium,
    favourite,
    rating,
    apartmentType,
    roomCount,
    guestsCount,
    cost,
    comfort,
    authorName,
    authorMail,
    authorAvatar,
    authorType,
    commentsCount,
    latitude,
    longitude,
  ] = offerData.replace('\n', '').split('\t');

  const author = {
    name: authorName,
    email: authorMail,
    avatar: authorAvatar,
    type: UserType[authorType as 'PRO' | 'SIMPLE'],
    password: '',
  };

  const coords = {latitude, longitude};

  return {
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
    coords,
  };
}
