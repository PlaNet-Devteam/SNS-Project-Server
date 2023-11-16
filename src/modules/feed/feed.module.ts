import { Module } from '@nestjs/common';
import { feedProviders } from './feed.provider';
import { FeedRepository } from './feed.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.provider';
import { UserBlockModule } from '../user-block/user-block.module';
import { FeedLikeModule } from '../feed-like/feed-like.module';
import { TagModule } from '../tag/tag.module';
import { tagProviders } from '../tag/tag.provider';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    UserBlockModule,
    FeedLikeModule,
    TagModule,
  ],
  controllers: [FeedController],
  providers: [
    ...userProviders,
    ...feedProviders,
    ...tagProviders,
    FeedRepository,
    FeedService,
  ],
  exports: [FeedModule, FeedRepository, FeedService],
})
export class FeedModule {}
