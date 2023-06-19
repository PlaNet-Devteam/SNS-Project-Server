import { Module } from '@nestjs/common';
import { feedProviders } from './feed.provider';
import { FeedRepository } from './feed.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [FeedController],
  providers: [...feedProviders, FeedRepository, FeedService],
  exports: [FeedModule, FeedRepository, FeedService],
})
export class FeedModule {}
