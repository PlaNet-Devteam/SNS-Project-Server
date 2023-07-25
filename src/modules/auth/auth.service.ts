import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { HashService } from './hash.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT } from 'src/config';
import { UserPayload } from './type';
import * as cacheConvention from '../_context/cache.convention.json';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { AuthLoginDto } from './dto';
import { AuthTokenVo } from './vo/auth-token.vo';
import { UserLoginHistory } from '../user-login-history/user-login-history.entity';
import { USER_LOGIN } from 'src/common';
import { UserLoginHistoryRepository } from '../user-login-history/user-login-history.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoginHistoryRepository: UserLoginHistoryRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * 로그인
   * @param authLoginDto
   * @returns AuthTokenVo
   */
  public async login(authLoginDto: AuthLoginDto): Promise<AuthTokenVo> {
    const user = await this.userRepository.findUserByEmail(authLoginDto.email);
    if (!user) throw new NotFoundException('User not found');
    // 비번 확인
    await this.userRepository.comparePassword(
      authLoginDto.password,
      user.password,
    );
    const accessToken = await this._sign_in_access_token(user);
    const refreshToken = await this._sign_in_refresh_token(
      user,
      authLoginDto.rememberMe,
    );

    // update login history
    // TODO: device id
    const newLoginHistory = new UserLoginHistory({
      userId: user.id,
      actionType: USER_LOGIN.LOGIN,
    });

    await this.userLoginHistoryRepository.createLoginHistory(newLoginHistory);

    const data = new AuthTokenVo({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: user,
    });
    return data;
  }

  /**
   * 로그아웃
   * @param userId
   * @returns boolean
   */
  public async logout(userId: number): Promise<boolean> {
    const newLogoutHistory = new UserLoginHistory({
      userId: userId,
      actionType: USER_LOGIN.LOGOUT,
    });
    await this.userLoginHistoryRepository.createLoginHistory(newLogoutHistory);

    await this.redis.del(`${cacheConvention.user.refreshToken}${userId}`);
    return true;
  }

  /**
   * refresh token 새로 발급 받기
   * @param token
   * @returns AuthTokenVo
   */
  public async refreshUserToken(token: string): Promise<AuthTokenVo> {
    if (!token) throw new UnauthorizedException();
    const verifiedToken = this.jwtService.verify(token, {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
    }) as UserPayload;

    const user = await this.userRepository.findUserByEmail(verifiedToken.email);
    // 여기서 사업 로직 녹여도 됨.
    // 예를 들어 케시 존재 다시 확인하거나, 아니면 상태 값 확인해서 차단된 유저인지

    // 케시 확인
    const cacheKey = `${cacheConvention.user.refreshToken}${user.id}`;
    const cache = await this.redis.get(cacheKey);
    if (!cache) throw new UnauthorizedException();

    // 새로운 토큰들 발급받기
    const newAccessToken = await this._sign_in_access_token(user);
    const newRefToken = await this._sign_in_refresh_token(user);
    const response = new AuthTokenVo({
      accessToken: newAccessToken,
      refreshToken: newRefToken,
    });

    return response;
  }

  /**
   * JWT ACCESS TOKEN
   * @param user
   * @returns string
   */
  private async _sign_in_access_token(user: User): Promise<string> {
    const options = {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn:
        process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT
          ? '600s'
          : `${process.env.JWT_EXPIRES_IN}`,
    };

    const accessTokenInfo: UserPayload = {
      _id: user.id,
      email: user.email,
      nickname: user.nickname,
      status: user.status,
    };

    return await this.jwtService.signAsync({ ...accessTokenInfo }, options);
  }

  /**
   * JWT REFRESH TOKEN
   * @param user
   * @param rememberMe
   * @returns string
   */
  private async _sign_in_refresh_token(
    user: User,
    rememberMe?: boolean,
  ): Promise<string> {
    const expiresIn = rememberMe
      ? process.env.REFRESH_JWT_EXPIRES_IN
      : process.env.REFRESH_JWT_EXPIRES_IN_DEF;

    const accessTokenInfo: UserPayload = {
      _id: user.id,
      email: user.email,
      nickname: user.nickname,
      status: user.status,
    };

    const token = await this.jwtService.signAsync(accessTokenInfo, {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
      expiresIn: expiresIn,
    });

    // 암호화
    const cacheKey = `${cacheConvention.user.refreshToken}${user.id}`;
    const encryptedToken = await this.hashService.hashString(token);
    await this.redis.set(cacheKey, encryptedToken);

    return token;
  }
}
