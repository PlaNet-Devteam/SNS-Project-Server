import { Inject, Injectable } from '@nestjs/common';
import { DB_CONST_REPOSITORY } from 'src/config';
import { Repository } from 'typeorm';
import { MapperFeedTagCreateDto } from './dto';
import { MapperFeedTag } from './mapper-feed-tag.entity';

@Injectable()
export class MapperFeedTagRepository {
  constructor(
    @Inject(DB_CONST_REPOSITORY.MAPPER_FEED_TAG)
    private readonly mapperFeedTagRepository: Repository<MapperFeedTag>,
  ) {}

  // INSERTS

  /**
   * FEED TAG MAPPER 생성
   * @param mapperFeedTagCreateDto
   * @returns
   */
  async createMapperFeedTag(
    mapperFeedTagCreateDto: MapperFeedTagCreateDto,
  ): Promise<MapperFeedTag> {
    let newMapper = new MapperFeedTag(mapperFeedTagCreateDto);
    newMapper = await this.mapperFeedTagRepository.save(newMapper);
    return newMapper;
  }
}
