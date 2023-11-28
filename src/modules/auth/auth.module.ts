import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { HashService } from './hash.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ENVIRONMENT, JwtConfigService } from 'src/config';
import { CacheClusterModule } from 'src/config/cache/cache.config.module';
import { PassportModule } from '@nestjs/passport';
import { UserLoginHistoryModule } from '../user-login-history/user-login-history.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategy';

@Module({
  imports: [
    UserModule,
    RedisModule,
    UserLoginHistoryModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule.register({
      session: true,
    }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AuthController],
  providers: [
    HashService,
    JwtStrategy,
    GoogleStrategy,
    AuthService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
