import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../index.js';
import { Middleware } from './middleware.interface.js';

interface IsAuthorsDocument {
  isAuthorsOffer(offerId: string, author: string): Promise<boolean>;
}

export class ValidateAuthorsOfferMiddleware implements Middleware {
  constructor(
    private readonly service: IsAuthorsDocument,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const offerId = params[this.paramName];

    if (!(await this.service.isAuthorsOffer(offerId, tokenPayload.id))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `No rights for ${this.entityName} with id ${offerId}.`,
        'AuthorValidateMiddleware',
      );
    }

    next();
  }
}
