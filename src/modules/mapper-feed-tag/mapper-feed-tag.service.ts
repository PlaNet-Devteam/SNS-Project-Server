import { Injectable, NotFoundException } from '@nestjs/common';
import { MapperFeedTagRepository } from './mapper-feed-tag.repository';
import { MapperFeedTagCreateDto } from './dto';
import { MapperFeedTag } from './mapper-feed-tag.entity';
import { FeedRepository } from '../feed/feed.repository';

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
    if (!feed) throw new NotFoundException('존재하지 않는 피드 입니다');

    return this.mappeFeedTagRepository.createMapperFeedTag(
      mappeFeedTagCreateDto,
    );
  }
}
