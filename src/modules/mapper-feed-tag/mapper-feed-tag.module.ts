import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config';
import { MapperFeedTagRepository } from './mapper-feed-tag.repository';
import { MapperFeedTagController } from './mapper-feed-tag.controller';
import { MapperFeedTagService } from './mapper-feed-tag.service';
import { mapperFeedTagProviders } from './mapper-feed-tag.provider';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [DatabaseModule, FeedModule],
  controllers: [MapperFeedTagController],
  providers: [
    ...mapperFeedTagProviders,
    MapperFeedTagRepository,
    MapperFeedTagService,
  ],
  exports: [MapperFeedTagModule, MapperFeedTagRepository, MapperFeedTagService],
})
export class MapperFeedTagModule {}
