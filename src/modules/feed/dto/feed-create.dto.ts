import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { Feed } from '../feed.entity';
import { Expose } from 'class-transformer';

export class FeedCreateDto
  extends BaseDto<FeedCreateDto>
  implements Partial<Feed>
{
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  description?: string;

  // TODO: 피드 이미지
}
