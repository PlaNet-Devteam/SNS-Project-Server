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
  ): Promise<BaseResponseVo<AuthTokenVo>> {
    const authVo = await this.authService.login(authLoginDto);
    // refresh token 쿠키에 설정
    if (authVo) response.cookie('refresh-token', authVo.refreshToken);
    return new BaseResponseVo<AuthTokenVo>(authVo);
  }

  /**
   * 로그아웃
   * @param user
   * @returns boolean
   */
  // true일 경우에 로그아웃 시도
  @UseGuards(new UserGuard({ loggingOut: true }))
  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  public async logout(
    @UserInfo() user: User,
  ): Promise<BaseResponseVo<boolean>> {
    return new BaseResponseVo<boolean>(await this.authService.logout(user.id));
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
