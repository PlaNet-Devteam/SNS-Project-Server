import { BaseDto } from 'src/core';
import { Feed } from '../feed.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { Default, FEED_STATUS, YN } from 'src/common';
import { FeedImage } from 'src/modules/feed-image/feed-image.entity';

export class FeedUpdateDto
  extends BaseDto<FeedUpdateDto>
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

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  newFeedImages?: FeedImage[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(YN, { each: true })
  @Default(YN.Y)
  @Expose()
  showLikeCountYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(YN, { each: true })
  @Expose()
  displayYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(FEED_STATUS, { each: true })
  @Expose()
  status?: FEED_STATUS;
}
