import { BaseDto } from 'src/core';
import { MapperUserFollow } from '../mapper-user-follow.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MapperUserFollowCreateDto
  extends BaseDto<MapperUserFollowCreateDto>
  implements Partial<MapperUserFollow>
{
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  followingId: number;
}
