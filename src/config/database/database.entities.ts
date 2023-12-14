import { ChatMessage } from 'src/modules/chat/entitys/chat-message.entity';
import { ChatRoom } from 'src/modules/chat/entitys/chat-room.entity';
import { CommentReply } from 'src/modules/comment-reply/comment-reply.entity';
import { Comment } from 'src/modules/comment/comment.entity';
import { FeedBookmark } from 'src/modules/feed-bookmark/feed-bookmark.entity';
import { FeedImage } from 'src/modules/feed-image/feed-image.entity';
import { FeedLike } from 'src/modules/feed-like/feed-like.entity';
import { Feed } from 'src/modules/feed/feed.entity';
import { MapperFeedTag } from 'src/modules/mapper-feed-tag/mapper-feed-tag.entity';
import { MapperUserFollow } from 'src/modules/mapper-user-follow/mapper-user-follow.entity';
import { Tag } from 'src/modules/tag/tag.entity';
import { UserBlock } from 'src/modules/user-block/user-block.entity';
import { UserHistory } from 'src/modules/user-history/user-history.entity';
import { UserLoginHistory } from 'src/modules/user-login-history/user-login-history.entity';
import { UserSocial } from 'src/modules/user-social/user-social.entity';
import { User } from 'src/modules/user/user.entity';

export const Entities = [
  User,
  UserHistory,
  UserLoginHistory,
  UserBlock,
  UserSocial,
  Feed,
  FeedImage,
  FeedLike,
  FeedBookmark,
  Comment,
  CommentReply,
  MapperUserFollow,
  MapperFeedTag,
  Tag,
  ChatRoom,
  ChatMessage,
];
