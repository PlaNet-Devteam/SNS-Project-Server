import { CommentReply } from 'src/modules/comment-reply/comment-reply.entity';
import { Comment } from 'src/modules/comment/comment.entity';
import { FeedImage } from 'src/modules/feed-image/feed-image.entity';
import { FeedLike } from 'src/modules/feed-like/feed-like.entity';
import { Feed } from 'src/modules/feed/feed.entity';
import { MapperUserFollow } from 'src/modules/mapper-user-follow/mapper-user-follow.entity';
import { UserHistory } from 'src/modules/user-history/user-history.entity';
import { UserLoginHistory } from 'src/modules/user-login-history/user-login-history.entity';
import { User } from 'src/modules/user/user.entity';

export const Entities = [
  User,
  UserHistory,
  UserLoginHistory,
  Feed,
  FeedImage,
  FeedLike,
  Comment,
  CommentReply,
  MapperUserFollow,
];
