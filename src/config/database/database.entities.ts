import { FeedImage } from 'src/modules/feed-image/feed-image.entity';
import { Feed } from 'src/modules/feed/feed.entity';
import { UserHistory } from 'src/modules/user-history/user-history.entity';
import { UserLoginHistory } from 'src/modules/user-login-history/user-login-history.entity';
import { User } from 'src/modules/user/user.entity';

export const Entities = [User, UserHistory, UserLoginHistory, Feed, FeedImage];
