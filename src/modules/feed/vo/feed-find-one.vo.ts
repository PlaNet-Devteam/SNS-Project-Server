import { FEED_STATUS, GENDER, USER_STATUS, YN } from 'src/common';
import { Feed } from '../feed.entity';
import { User } from 'src/modules/user/user.entity';

export class FeedFindOneVo implements Partial<Feed> {
  id: number;
  userId: number;
  user: User;
  likeCount: number;
  commentCount: number;
  showLikeCountYn?: YN;
  status?: FEED_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
