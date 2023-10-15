import { Coords } from '../../types/index.js';

export class UpdateOfferDto {
    public title?: string;
    public description?: string;
    public postDate?: Date;
    public city?: string;
    public imagePreview?: string;
    public images?: string[];
    public premium?: boolean;
    public favourite?: boolean;
    public rating?: number;
    public apartmentType?: string;
    public roomCount?: number;
    public guestsCount?: number;
    public cost?: number;
    public comfort?: string[];
    public author?: string;
    public commentsCount?: number;
    public coords?: Coords;
  }
  
  