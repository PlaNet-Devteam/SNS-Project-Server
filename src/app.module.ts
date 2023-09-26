import { Module } from '@nestjs/common';
import {
  AuthModule,
  CommentModule,
  FeedModule,
  UserModule,
  ChatModule,
} from './modules';
import { UserLoginHistoryModule } from './modules/user-login-history/user-login-history.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ENVIRONMENT, CacheClusterModule } from './config';

@Module({
  imports: [
    process.env.NODE_ENV === ENVIRONMENT.PRODUCTION
      ? CacheClusterModule
      : RedisModule.forRoot({
          config: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        }),
    // service modules
    AuthModule,
    UserModule,
    UserLoginHistoryModule,
    FeedModule,
    CommentModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
