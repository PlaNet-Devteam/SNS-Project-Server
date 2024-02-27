import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/core';
import { User } from 'src/modules/user/user.entity';

export class MapperUserFollowListDto extends BasePaginationDto<MapperUserFollowListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  query?: string;
}
