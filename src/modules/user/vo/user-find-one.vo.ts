import { GENDER, USER_STATUS, YN } from 'src/common';
import { User } from '../user.entity';
import { MapperUserFollow } from 'src/modules/mapper-user-follow/mapper-user-follow.entity';

export class UserFindOneVo implements Partial<User> {
  id: number;
  username: string;
  email: string;
  status: USER_STATUS;
  delYn?: YN;
  password?: string;
  followerCount?: number;
  followingCount?: number;
  feedCount?: number;
  profileImage?: string;
  bio?: string;
  gender?: GENDER;
  followers?: number[];
  followings?: number[];
}
