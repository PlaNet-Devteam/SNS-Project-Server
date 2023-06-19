import { GENDER, USER_STATUS } from 'src/common';
import { User } from '../user.entity';

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
}
