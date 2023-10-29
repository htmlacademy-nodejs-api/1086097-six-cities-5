import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, HttpError } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserDto } from './index.js';
import { UserService } from './index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { RequestParams, RequestBody} from '../../types/index.js';

export type ParamUserMail = {
  mail: string;
} | ParamsDictionary;

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;

@injectable()
export class UserController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) protected readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    // this.addRoute({ path: '/:mail', method: HttpMethod.Get, handler: this.findByEmail });
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
  }

  public async create(req: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(req.body.mail);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${req.body.mail} exists.`,
        'UserController'
      );
    }

    const salt = this.config.get('SALT');
    const user = await this.userService.create(req.body, salt);
    this.created(res, fillDTO(UserRdo, user));
    this.logger.info(`Created user for offer ${req.body.mail}`);
  }

  // public async findByEmail({ params }: Request<ParamUserMail>, res: Response): Promise<void> {
  //   const user = await this.userService.findByEmail(params.mail);
  //   this.ok(res, fillDTO(UserRdo, user));
  //   this.logger.info(`User ${user?.name} finded`);
  // }
}
