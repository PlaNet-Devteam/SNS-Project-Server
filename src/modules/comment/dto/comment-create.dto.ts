import { BaseDto } from 'src/core';
import { Comment } from '../comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentCreateDto
  extends BaseDto<CommentCreateDto>
  implements Partial<Comment>
{
  @ApiProperty()
  @Expose()
  comment: string;
}
