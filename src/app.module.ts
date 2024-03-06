import { Module } from '@nestjs/common';
import {
  AuthModule,
  CommentModule,
  CommentReplyModule,
  FeedModule,
  UserModule,
  // ChatModule,
  MapperUserFollowModule,
  UserBlockModule,
  TagModule,
  HealthCheckModule,
} from './modules';
import { UserLoginHistoryModule } from './modules/user-login-history/user-login-history.module';
// import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ENVIRONMENT, CacheClusterModule } from './config';
import { MapperFeedTagModule } from './modules/mapper-feed-tag/mapper-feed-tag.module';
import { RoomModule } from './modules/room/room.module';
import { MapperUserRoomModule } from './modules/mapper-user-room/mapper-user-room.module';
import { MessageModule } from './modules/message/message.module';
import { BaseGatewayModule } from './gateway/base-gateway.module';

@Module({
  imports: [
    // RedisModule.forRoot({
    //   config: {
    //     host: process.env.REDIS_HOST,
    //     port: Number(process.env.REDIS_PORT),
    //   },
    // }),
    // service modules
    AuthModule,
    UserModule,
    UserBlockModule,
    UserLoginHistoryModule,
    FeedModule,
    CommentModule,
    CommentReplyModule,
    // ChatModule,
    BaseGatewayModule,
    MapperUserFollowModule,
    MapperFeedTagModule,
    MapperUserRoomModule,
    TagModule,
    RoomModule,
    MessageModule,
    HealthCheckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
