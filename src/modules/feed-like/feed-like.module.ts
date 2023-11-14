import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.provider';
import { UserBlockModule } from '../user-block/user-block.module';
import { feedLikeProviders } from '../feed-like/feed-like.provider';
import { FeedLikeRepository } from '../feed-like/feed-like.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...feedLikeProviders, FeedLikeRepository],
  exports: [FeedLikeModule, FeedLikeRepository],
})
export class FeedLikeModule {}
