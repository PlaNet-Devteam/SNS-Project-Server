import { Comment } from '../comment.entity';
import { User } from 'src/modules/user/user.entity';

export class CommentFindOneVo implements Partial<Comment> {
  id: number;
  feedId: number;
  userId: number;
  user: User;
  comment: string;
  replyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
