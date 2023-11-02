import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';

export class UserByViewerDto extends BaseDto<UserByViewerDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  viewerId?: number;
}
