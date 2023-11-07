import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, HttpError } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserDto, LoginUserDto, LoggedUserRdo } from './index.js';
import { UserService } from './index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { RequestParams, RequestBody} from '../../types/index.js';
import { ValidateDtoMiddleware, ValidateObjectIdMiddleware, UploadFileMiddleware } from '../../libs/rest/index.js';
import { AuthService } from '../auth/index.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;

@injectable()
export class UserController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) protected readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar')],
    });
  }

  public async create({body}: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.mail);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.mail} exists.`,
        'UserController'
      );
    }

    const salt = this.config.get('SALT');
    const user = await this.userService.create(body, salt);
    this.created(res, fillDTO(UserRdo, user));
    this.logger.info(`Created user ${body.mail}`);
  }

  public async login(req: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(req.body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {mail: user.mail, token,});
    this.ok(res, responseData);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    const user = tokenPayload && await this.userService.findByEmail(tokenPayload.mail);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, user));
  }
}
