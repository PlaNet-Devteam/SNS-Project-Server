import { User } from 'src/modules/user/user.entity';
import { MapperUserFollow } from '../mapper-user-follow.entity';

export class FollowFindOneVo implements Partial<MapperUserFollow> {
  id: number;
  userId: number;
  followingId: number;
  following: User;
  follower: User;
}
