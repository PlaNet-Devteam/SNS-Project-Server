import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/core';

export class UserListDto extends BasePaginationDto<UserListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  query?: string;
}
