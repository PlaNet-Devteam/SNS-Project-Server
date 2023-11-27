import { Module } from '@nestjs/common';
import {
  AuthModule,
  CommentModule,
  CommentReplyModule,
  FeedModule,
  UserModule,
  ChatModule,
  MapperUserFollowModule,
  UserBlockModule,
  TagModule,
  UserSocialModule,
} from './modules';
import { UserLoginHistoryModule } from './modules/user-login-history/user-login-history.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ENVIRONMENT, CacheClusterModule } from './config';
import { MapperFeedTagModule } from './modules/mapper-feed-tag/mapper-feed-tag.module';

@Module({
  imports: [
    // service modules
    AuthModule,
    UserModule,
    UserBlockModule,
    UserLoginHistoryModule,
    // UserSocialModule,
    FeedModule,
    CommentModule,
    CommentReplyModule,
    ChatModule,
    MapperUserFollowModule,
    MapperFeedTagModule,
    TagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
