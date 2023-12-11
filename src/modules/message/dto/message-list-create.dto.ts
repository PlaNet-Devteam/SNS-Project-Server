import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { MessageCreateDto } from './message-create.dto';

export class MessageListCreateDto extends BaseDto<MessageListCreateDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  messageList: MessageCreateDto[];
}
