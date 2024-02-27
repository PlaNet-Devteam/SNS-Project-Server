import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { HashService } from './hash.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT, dataSource } from 'src/config';
import { UserPayload } from './type';
import * as cacheConvention from '../_context/cache.convention.json';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { AuthGoogleDto, AuthLoginDto, ChangePasswordDto } from './dto';
import { AuthTokenVo } from './vo/auth-token.vo';
import { UserLoginHistory } from '../user-login-history/user-login-history.entity';
import {
  RESPONSE_STATUS,
  SOCIAL_TYPE,
  USER_LOGIN,
  USER_STATUS,
  YN,
} from 'src/common';
import { UserLoginHistoryRepository } from '../user-login-history/user-login-history.repository';
import { UserFindOneVo } from '../user/vo';
import axios from 'axios';
import { UserCreateDto } from '../user/dto';
import { UserSocial } from '../user-social/user-social.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoginHistoryRepository: UserLoginHistoryRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService, // @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * 로그인
   * @param authLoginDto
   * @returns AuthTokenVo
   */
  public async login(
    authLoginDto: AuthLoginDto,
    deviceId: string,
  ): Promise<AuthTokenVo> {
    const user = await this.userRepository.findUserByEmail(authLoginDto.email);
    if (!user) throw new NotFoundException('User not found');

    // * 비번 체크
    await this.userRepository.comparePassword(
      authLoginDto.password,
      user.password,
    );

    const accessToken = await this._sign_in_access_token(user);
    const refreshToken = await this._sign_in_refresh_token(
      user,
      authLoginDto.rememberMe,
    );

    if (user.delYn !== YN.Y) {
      // * 최근 로그인 날짜 업데이트
      await this.userRepository.updateLoginDate(user.id);

      // * 유저 로그인 히스토리 생성
      const newLoginHistory = new UserLoginHistory({
        userId: user.id,
        actionType: USER_LOGIN.LOGIN,
        deviceId: deviceId,
      });

      await this.userLoginHistoryRepository.createLoginHistory(newLoginHistory);
    }

    const data = new AuthTokenVo({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: user,
    });
    return data;
  }

  // * 구글 토큰 받기
  async requestGoogleToken(code: string) {
    const params = {
      code,
      client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
      client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    };
    try {
      const data = await axios.post(
        'https://oauth2.googleapis.com/token',
        params,
      );
      return data.data;
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  // * 구글 유저 정보 by Token
  async requestGoogleUserInfo(accessToken: string) {
    try {
      const data = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data.data;
    } catch (error) {
      console.error(error);
    }
  }

  // * 구글 로그인
  async googleLogin(code: string, deviceId: string): Promise<AuthTokenVo> {
    const { access_token } = await this.requestGoogleToken(code);
    if (!access_token)
      throw new BadRequestException('토큰 요청에 실패했습니다');

    const googleUser = await this.requestGoogleUserInfo(access_token);
    if (!googleUser) throw new NotFoundException('존재하지 않는 유저입니다');

    await this.validateGoogleUser({
      username: `g_${googleUser.email.split('@')[0]}`,
      nickname: googleUser.name,
      profileImage: googleUser.picture,
      email: googleUser.email,
      socialUniqueId: googleUser.sub,
    });

    const user = await this.userRepository.findUserByEmail(googleUser.email);
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다');

    const accessToken = await this._sign_in_access_token(user);
    const refreshToken = await this._sign_in_refresh_token(user, true);

    if (user.delYn !== YN.Y) {
      // * 최근 로그인 날짜 업데이트
      await this.userRepository.updateLoginDate(user.id);

      // * 유저 로그인 히스토리 생성
      const newLoginHistory = new UserLoginHistory({
        userId: user.id,
        actionType: USER_LOGIN.LOGIN,
        deviceId: deviceId,
      });

      await this.userLoginHistoryRepository.createLoginHistory(newLoginHistory);
    }

    const data = new AuthTokenVo({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: user,
    });

    return data;
  }

  // * 유저 validation 로직
  async validateGoogleUser(authGoogleDto: AuthGoogleDto): Promise<UserSocial> {
    return await dataSource.transaction(async (transaction) => {
      // * 이메일로 유저 존재 여부 체크
      let user = await this.userRepository.findUserByEmail(authGoogleDto.email);

      // * 존재 하지 않는 유저일 경우 유저 테이블에 유저 생성
      if (!user) {
        const newUser = new UserCreateDto();
        newUser.username = authGoogleDto.username;
        newUser.nickname = authGoogleDto.nickname;
        newUser.email = authGoogleDto.email;
        newUser.profileImage = authGoogleDto.profileImage;
        newUser.status = USER_STATUS.ACTIVE;

        user = await this.userRepository.createUser(newUser);
      }

      // * 해당 유저가 User Social 테이블에 없을 경우 userId 매핑하여 생성
      let socialUser = await UserSocial.createQueryBuilder('userSocical')
        .where('userSocical.userId = :userId', {
          userId: user.id,
        })
        .getOne();

      if (!socialUser) {
        const newSocialUser = new UserSocial();
        newSocialUser.userId = user.id;
        newSocialUser.email = authGoogleDto.email;
        newSocialUser.socialType = SOCIAL_TYPE.GOOGLE;
        newSocialUser.socialUniqueId = authGoogleDto.socialUniqueId;

        socialUser = await transaction.save(newSocialUser);
      }
      return socialUser;
    });
  }

  /**
   *  유저 찾기
   * @param id
   * @returns
   */
  async findUser(id: number) {
    const user = this.userRepository.findOneUser(id);
    return user;
  }

  /**
   * 로그아웃
   * @param userId
   * @returns boolean
   */
  public async logout(userId: number, deviceId: string): Promise<boolean> {
    const newLogoutHistory = new UserLoginHistory({
      userId: userId,
      actionType: USER_LOGIN.LOGOUT,
      deviceId: deviceId,
    });
    await this.userLoginHistoryRepository.createLoginHistory(newLogoutHistory);

    // await this.redis.del(`${cacheConvention.user.refreshToken}${userId}`);
    return true;
  }

  /**
   * refresh token 새로 발급 받기
   * @param token
   * @returns AuthTokenVo
   */
  public async refreshUserToken(token: string): Promise<AuthTokenVo> {
    try {
      if (!token) throw new UnauthorizedException();
      const verifiedToken = this.jwtService.verify(token, {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
      }) as UserPayload;

      const user = await this.userRepository.findUserByEmail(
        verifiedToken.email,
      );
      // 여기서 사업 로직 녹여도 됨.
      // 예를 들어 케시 존재 다시 확인하거나, 아니면 상태 값 확인해서 차단된 유저인지

      // 케시 확인
      const cacheKey = `${cacheConvention.user.refreshToken}${user.id}`;
      // const cache = await this.redis.get(cacheKey);
      // if (!cache) throw new UnauthorizedException();

      // 새로운 토큰들 발급받기
      const newAccessToken = await this._sign_in_access_token(user);
      const newRefToken = await this._sign_in_refresh_token(user);
      const response = new AuthTokenVo({
        accessToken: newAccessToken,
        refreshToken: newRefToken,
      });

      return response;
    } catch (error) {
      throw new UnauthorizedException({
        error: RESPONSE_STATUS.NO_REFRESH_TOKEN,
        msg: 'Refresh token expired.',
      });
    }
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
          ? '60000s'
          : `${process.env.JWT_EXPIRES_IN}`,
    };

    const accessTokenInfo: UserPayload = {
      _id: user.id,
      email: user.email,
      username: user.username,
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
      username: user.username,
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
    // await this.redis.set(cacheKey, encryptedToken);

    return token;
  }

  /**
   * 비밀번호 변경
   * @param id
   * @param changePasswordDto
   */
  async changePassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserFindOneVo> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new NotFoundException();

    const validPassword = await this.userRepository.comparePassword(
      changePasswordDto.password,
      user.password,
    );
    if (!validPassword)
      throw new BadRequestException('비밀번호가 일치하지 않습니다');

    const newPassword = await this.hashService.hashString(
      changePasswordDto.newPassword,
    );
    await this.userRepository.updatePassword(user.id, newPassword);

    return user;
  }
}
