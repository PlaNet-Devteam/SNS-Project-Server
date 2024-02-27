/* eslint-disable @typescript-eslint/ban-types */
import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user);
    console.log('serializeUser', user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.findUser(payload.id);
    console.log('deserializeUser', user);
    return user ? done(null, user) : done(null, null);
  }
}
