import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto, ChangePasswordDto } from './dto';
import { Request, Response } from 'express';
import { BaseResponseVo, RefreshGuard, UserGuard } from 'src/core';
import { AuthTokenVo } from './vo/auth-token.vo';
import { User } from '../user/user.entity';
import { UserInfo } from '../../common';
import { UserFindOneVo } from '../user/vo';
import * as useragent from 'useragent';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   * @param authLoginDto
   * @param response
   * @returns AuthTokenVo
   */
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  public async login(
    @Body() authLoginDto: AuthLoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<BaseResponseVo<AuthTokenVo>> {
    const userAgentString = request.headers['user-agent'];
    const agent = useragent.parse(userAgentString) || null;
    const deviceId =
      agent.device.family === 'Other' ? 'DESKTOP' : agent.device.family;

    const authVo = await this.authService.login(authLoginDto, deviceId);

    // refresh token 쿠키에 설정
    if (authVo) response.cookie('refresh-token', authVo.refreshToken);
    return new BaseResponseVo<AuthTokenVo>(authVo);
  }

  /**
   * 구글 로그인
   * @param code
   * @param response
   * @returns
   */
  @Post('google/login')
  @HttpCode(HttpStatus.ACCEPTED)
  public async googleLogin(
    @Body() token: { token: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const userAgentString = request.headers['user-agent'];
    const agent = useragent.parse(userAgentString) || null;
    const deviceId =
      agent.device.family === 'Other' ? 'DESKTOP' : agent.device.family;

    const authVo = await this.authService.googleLogin(token.token, deviceId);

    if (authVo) response.cookie('refresh-token', authVo.refreshToken);
    return new BaseResponseVo<AuthTokenVo>(authVo);
  }

  /**
   * 로그아웃
   * @param user
   * @returns boolean
   */
  // true일 경우에 로그아웃 시도

  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(new UserGuard({ loggingOut: true }))
  public async logout(
    @UserInfo() user: User,
    @Req() request: Request,
  ): Promise<BaseResponseVo<boolean>> {
    const userAgentString = request.headers['user-agent'];
    const agent = useragent.parse(userAgentString) || null;
    const deviceId =
      agent.device.family === 'Other' ? 'DESKTOP' : agent.device.family;

    return new BaseResponseVo<boolean>(
      await this.authService.logout(user.id, deviceId),
    );
  }

  /**
   * 새로운 토큰 발급받기
   * @param request
   * @returns AuthTokenVo
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Req() request: Request,
  ): Promise<BaseResponseVo<AuthTokenVo>> {
    return new BaseResponseVo(
      await this.authService.refreshUserToken(request.cookies['refresh-token']),
    );
  }

  /**
   * 비밀번호 변경
   * @param changePasswordDto
   * @returns
   */
  @UseGuards(new RefreshGuard())
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @UserInfo() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<BaseResponseVo<UserFindOneVo>> {
    return new BaseResponseVo(
      await this.authService.changePassword(user.email, changePasswordDto),
    );
  }
}
