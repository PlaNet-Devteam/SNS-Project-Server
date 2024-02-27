import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/core';
import { User } from 'src/modules/user/user.entity';

export class UserBlockListDto extends BasePaginationDto<UserBlockListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  query?: string;
}
