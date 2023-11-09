import { FEED_STATUS, GENDER, USER_STATUS, YN } from 'src/common';
import { Feed } from '../feed.entity';
import { User } from 'src/modules/user/user.entity';
import { FeedImage } from 'src/modules/feed-image/feed-image.entity';
import { Tag } from 'src/modules/tag/tag.entity';

export class FeedFindOneVo implements Partial<Feed> {
  id: number;
  userId: number;
  user: User;
  description?: string;
  feedImages?: FeedImage[];
  likeCount: number;
  commentCount: number;
  showLikeCountYn?: YN;
  tags?: Tag[];
  status?: FEED_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
