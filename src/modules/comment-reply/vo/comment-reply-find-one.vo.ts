import { CommentReply } from '../comment-reply.entity';
import { User } from 'src/modules/user/user.entity';

export class CommentReplyFindOneVo implements Partial<CommentReply> {
  id: number;
  commentId: number;
  userId: number;
  user: User;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
