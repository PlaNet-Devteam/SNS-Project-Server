import { BaseDto } from 'src/core';
import { Feed } from '../feed.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { FEED_STATUS } from 'src/common';
import { FeedImage } from 'src/modules/feed-image/feed-image.entity';

export class FeedCreateDto
  extends BaseDto<FeedCreateDto>
  implements Partial<Feed>
{
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((value: any) =>
    value.value === '' ? (value.value = null) : value.value,
  )
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  feedImages?: FeedImage[];

  @ApiProperty({ enum: FEED_STATUS })
  @IsEnum(FEED_STATUS, { each: true })
  @Expose()
  status?: FEED_STATUS = FEED_STATUS.ACTIVE;
}
