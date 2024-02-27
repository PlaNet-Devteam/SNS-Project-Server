import { BaseDto } from 'src/core';
import { MapperFeedTag } from '../mapper-feed-tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class MapperFeedTagCreateDto
  extends BaseDto<MapperFeedTagCreateDto>
  implements Partial<MapperFeedTag>
{
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  feedId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  tagId: number;
}
