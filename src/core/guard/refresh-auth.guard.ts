import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RESPONSE_STATUS } from 'src/common';
import { UserPayload } from 'src/modules/auth/type';
import * as errors from '../../locales/kr/errors.json';

const jwtService = new JwtService();

@Injectable()
export class RefreshGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(
    err: unknown,
    user: any,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    if (err) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.NO_USER_DETECTED,
        msg: errors.auth.userDetected,
      });
    }
    const accessToken = request.headers['authorization'].split(' ')[1];
    const refreshCookie = request.cookies['refresh-token'];
    if (!refreshCookie) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.NO_REFRESH_TOKEN,
        msg: errors.auth.notFoundRefreshToken,
      });
    }
    try {
      jwtService.verify(refreshCookie, {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.ACCESS_TOKEN_EXP,
        msg: errors.auth.expiredToken,
      });
    }
    try {
      const decodeRefresh = jwtService.decode(refreshCookie) as UserPayload;
      const decodeAccess = jwtService.decode(accessToken) as UserPayload;
      if (decodeAccess._id !== decodeRefresh._id)
        throw new UnauthorizedException({
          error: RESPONSE_STATUS.NOT_YOUR_REFRESH,
          msg: errors.auth.invalidRefreshToken,
        });
    } catch (error) {
      console.log(error);
    }
    return jwtService.verify(refreshCookie, {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
    });
  }
}
