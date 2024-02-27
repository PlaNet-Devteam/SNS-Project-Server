import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Default, FEED_STATUS } from 'src/common';
import { BasePaginationDto } from 'src/core';

export class FeedListDto extends BasePaginationDto<FeedListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  tagName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Default(FEED_STATUS.ACTIVE)
  @Expose()
  status?: FEED_STATUS;
}
