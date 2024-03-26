import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/modules/user/user.repository';
import { UserPayload } from '../type';
import * as errors from '../../../locales/kr/errors.json';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.userRepository.findOneUser(payload._id);
    if (!user) throw new NotFoundException(errors.user.notFound);

    return user;
  }
}
