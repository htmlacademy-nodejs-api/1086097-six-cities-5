import { HttpMethod } from './index.js';
import { NextFunction, Response, Request } from 'express';

export interface Route {
  path: string,
  method: HttpMethod,
  handler: (req: Request, res: Response, next: NextFunction) => void
}
