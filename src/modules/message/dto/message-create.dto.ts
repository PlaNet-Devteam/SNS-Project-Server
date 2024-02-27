import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { Message } from '../message.entity';

export class MessageCreateDto extends BaseDto<MessageCreateDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  roomId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  roomUniqueId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  message: string;
}
