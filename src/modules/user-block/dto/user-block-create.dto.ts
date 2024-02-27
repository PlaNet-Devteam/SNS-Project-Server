import { BaseDto } from 'src/core';
import { UserBlock } from '../user-block.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { USER_BLOCK } from 'src/common';

export class UserBlockCreateDto
  extends BaseDto<UserBlockCreateDto>
  implements Partial<UserBlock>
{
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  blockedUserId: number;

  @ApiPropertyOptional()
  @Expose()
  actionType?: USER_BLOCK;
}
