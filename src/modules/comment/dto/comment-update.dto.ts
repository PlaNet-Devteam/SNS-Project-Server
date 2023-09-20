import { BaseDto } from 'src/core';
import { Comment } from '../comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentUpdateDto
  extends BaseDto<CommentUpdateDto>
  implements Partial<Comment>
{
  @ApiProperty()
  @Expose()
  comment: string;
}
