import { BaseDto } from 'src/core';
import { MapperUserFollow } from '../mapper-user-follow.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MapperUserFollowDeleteDto
  extends BaseDto<MapperUserFollowDeleteDto>
  implements Partial<MapperUserFollow>
{
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  followingId: number;
}
