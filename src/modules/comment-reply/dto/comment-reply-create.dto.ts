import { BaseDto } from 'src/core';
import { CommentReply } from '../comment-reply.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentReplyCreateDto
  extends BaseDto<CommentReplyCreateDto>
  implements Partial<CommentReply>
{
  @ApiProperty()
  @Expose()
  comment: string;
}
