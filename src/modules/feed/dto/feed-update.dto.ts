import { BaseDto } from 'src/core';
import { Feed } from '../feed.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { GENDER } from 'src/common';

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
}
