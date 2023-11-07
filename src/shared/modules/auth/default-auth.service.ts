import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { AuthService } from './index.js';
import { Component } from '../../types/index.js';
import { LoginUserDto, UserEntity, UserService } from '../user/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Config, RestSchema} from '../../libs/config/index.js';
import { UserPasswordIncorrectException, UserNotFoundException} from './index.js';
import { TokenPayload } from './index.js';

export const JWT_ALGORITHM = 'HS256';
export const JWT_EXPIRED = '2d';

@injectable()
export class DefaultAuthService implements AuthService {

  constructor (
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.UserService) private readonly userService: UserService,
  ){}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      mail: user.mail,
      name: user.name,
      avatar: user.avatar,
      userType: user.userType,
      id: user._id.toString(),
    };

    this.logger.info(`Create token for ${user.mail}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.mail);
    if (! user) {
      this.logger.warn(`User with ${dto.mail} not found`);
      throw new UserNotFoundException();
    }

    if (! user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.mail}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}