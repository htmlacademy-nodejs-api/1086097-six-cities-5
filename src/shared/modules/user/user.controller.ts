import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, HttpError } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserService, CreateUserDto, LoginUserDto, UserRdo, LoggedUserRdo, UploadAvatarRdo, ALLOWED_IMAGE_MIME_TYPES } from './index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { RequestParams, RequestBody} from '../../types/index.js';
import { ValidateDtoMiddleware, PrivateRouteMiddleware, UploadFileMiddleware } from '../../libs/rest/index.js';
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
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar', ALLOWED_IMAGE_MIME_TYPES)],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.ok(res, {});
  }

  public async create({body}: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} exists.`,
        'UserController'
      );
    }

    const salt = this.config.get('SALT');
    const user = await this.userService.create(body, salt);
    this.created(res, fillDTO(UserRdo, user));
    this.logger.info(`Created user ${body.email}`);
  }

  public async login(req: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(req.body);
    const token = await this.authService.authenticate(user);
    // const responseData = fillDTO(LoggedUserRdo, {email: user.email, token,});
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }


  public async uploadAvatar({ tokenPayload, file }: Request, res: Response) {
    const uploadFile = { avatar: file?.filename };
    await this.userService.updateById(tokenPayload.id, uploadFile);
    this.created(res, fillDTO(UploadAvatarRdo, { avatar: uploadFile.avatar }));
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    const user = tokenPayload && await this.userService.findByEmail(tokenPayload.email);

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
