import { BaseDto } from 'src/core';
import { CommentReply } from '../comment-reply.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentReplyUpdateDto
  extends BaseDto<CommentReplyUpdateDto>
  implements Partial<CommentReply>
{
  @ApiProperty()
  @Expose()
  comment: string;
}
