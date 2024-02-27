import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MapperFeedTagService } from './mapper-feed-tag.service';
import { ApiTags } from '@nestjs/swagger';
import { MapperFeedTag } from './mapper-feed-tag.entity';
import { UserGuard } from 'src/core';
import { MapperFeedTagCreateDto } from './dto';

@Controller('mapper-feed-tag')
@ApiTags('MPPAER FEED TAG')
@UseGuards(new UserGuard())
export class MapperFeedTagController {
  constructor(private readonly mapperFeedTagService: MapperFeedTagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMapperFeedTag(
    @Body() mapperFeedTagCreateDto: MapperFeedTagCreateDto,
  ): Promise<MapperFeedTag> {
    return await this.mapperFeedTagService.createMapperFeedTag(
      mapperFeedTagCreateDto,
    );
  }
}
