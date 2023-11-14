import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../index.js';
import { jwtVerify } from 'jose';
import { createSecretKey } from 'node:crypto';
import { HttpError } from '../index.js';
import { StatusCodes } from 'http-status-codes';
import { TokenPayload } from '../../../modules/auth/index.js';
import { JWTPayload } from 'jose';

function isTokenPayload(payload: JWTPayload): payload is TokenPayload {
  return (
    typeof payload === 'object' && payload !== null &&
    'email' in payload && typeof payload.email === 'string' &&
    'name' in payload && typeof payload.name === 'string' &&
    'avatar' in payload && typeof payload?.avatar === 'string' &&
    'type' in payload && typeof payload.type === 'string' &&
    'id' in payload && typeof payload.id === 'string'
  );
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }
    // имеет index 1
    const [, token] = authorizationHeader;
    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));
      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      }
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
