import { Injectable, NotFoundException } from '@nestjs/common';
import { MapperFeedTagRepository } from './mapper-feed-tag.repository';
import { MapperFeedTagCreateDto } from './dto';
import { MapperFeedTag } from './mapper-feed-tag.entity';
import { FeedRepository } from '../feed/feed.repository';
import * as errors from '../../locales/kr/errors.json';

@Injectable()
export class MapperFeedTagService {
  constructor(
    private readonly mappeFeedTagRepository: MapperFeedTagRepository,
    private readonly feedRepository: FeedRepository,
  ) {}

  async createMapperFeedTag(
    mappeFeedTagCreateDto: MapperFeedTagCreateDto,
  ): Promise<MapperFeedTag> {
    const feed = this.feedRepository.findOneFeed(mappeFeedTagCreateDto.feedId);
    if (!feed) throw new NotFoundException(errors.feed.notFound);

    return this.mappeFeedTagRepository.createMapperFeedTag(
      mappeFeedTagCreateDto,
    );
  }
}
