import { BaseDto } from 'src/core';
import { UserBlock } from '../user-block.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserBlockDeleteDto
  extends BaseDto<UserBlockDeleteDto>
  implements Partial<UserBlock>
{
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  blockedUserId: number;
}
