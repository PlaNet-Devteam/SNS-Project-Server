import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { AuthGoogleDto } from '../dto';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  // refreshToken을 얻고 싶다면 해당 메서드 설정 필수
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    // * STEP 1 : 구글 프로필 정보로 유저 체크
    // const user = this.authService.validateGoogleUser({
    //   email: profile.emails[0].value,
    //   nickname: profile.displayName,
    //   profileImage: profile.photos[0].value,
    //   socialUniqueId: profile.id,
    // });
    // try {
    //   done(null, user, accessToken);
    // } catch (err) {
    //   done(err, false);
    // }
  }
}
