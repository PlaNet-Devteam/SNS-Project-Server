import { FEED_STATUS, YN } from 'src/common';
import { Feed } from '../feed.entity';
import { FeedImage } from 'src/modules/feed-image/feed-image.entity';

export class FeedFindOneVo implements Partial<Feed> {
  id: number;
  description?: string;
  likeCount?: number;
  showLikeCountYn?: YN;
  commentCount?: number;
  displayYn?: YN;
  status: FEED_STATUS;
  images?: FeedImage[];
}
