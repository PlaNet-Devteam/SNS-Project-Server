import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/core';

export class FeedListDto extends BasePaginationDto<FeedListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  tagName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  userId?: number;
}
