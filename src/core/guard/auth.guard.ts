import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import Redis from 'ioredis';
import { RESPONSE_STATUS } from 'src/common';
import * as cacheConvention from '../../modules/_context/cache.convention.json';

const jwtService = new JwtService();

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(isLoggingOut?: { loggingOut: boolean }) {
    // TODO:
    // 여기에 롤들 삽입
    super();
    this.loggingOut = isLoggingOut ? isLoggingOut.loggingOut : false;
  }

  loggingOut = false;

  handleRequest(
    err: unknown,
    user: any,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    let accessToken = request.headers['authorization'];
    const refreshCookie = request.cookies['refresh-token'];
    // REFRESH TOKEN 없을 경우
    if (!refreshCookie) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.NO_REFRESH_TOKEN,
        msg: 'No refresh token detected!',
      });
    }
    if (!accessToken) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.NO_ACCESS_TOKEN,
        msg: 'No access token detected',
      });
    } else {
      accessToken = request.headers['authorization'].split(' ')[1];
    }

    try {
      jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.ACCESS_TOKEN_EXP,
        msg: 'Access token expired.',
      });
    }
    // check refresh and access token user in redis
    if (!this.loggingOut) this.checkRedis(user);
    return user;
  }

  /**
   * 사용자 정보가 케시에 있는지 확인 없으면 로그인 안됨
   * TODO: Cluster module 생성
   * @param user
   * @returns boolean
   */
  private async checkRedis(user: any) {
    const newRedis = new Redis(
      Number(process.env.REDIS_PORT),
      process.env.REDIS_HOST,
    );
    // const cache = await newRedis.get(
    //   `${cacheConvention.user.refreshToken}${user.id}`,
    // );
    // if (!cache)
    //   throw new UnauthorizedException({
    //     error: RESPONSE_STATUS.NO_REFRESH_TOKEN,
    //     msg: 'No refresh token detected!',
    //   });

    return true;
  }
}
