import { GENDER, USER_STATUS } from 'src/common';
import { User } from '../user.entity';
import { MapperUserFollow } from 'src/modules/mapper-user-follow/mapper-user-follow.entity';

export class UserFindOneVo implements Partial<User> {
  username: string;
  email: string;
  status: USER_STATUS;
  followerCount?: number;
  followingCount?: number;
  feedCount?: number;
  profileImage?: string;
  bio?: string;
  id: number;
  gender?: GENDER;
  followers?: number[];
  followings?: number[];
}
