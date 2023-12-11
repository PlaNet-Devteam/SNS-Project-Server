import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RoomCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  userIds: number[];
}
