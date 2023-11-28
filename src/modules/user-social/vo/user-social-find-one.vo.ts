import { SOCIAL_TYPE } from 'src/common';
import { UserSocial } from '../user-social.entity';

export class UserSocialFindOneVo implements Partial<UserSocial> {
  id: number;
  userId: number;
  email: string;
  socialType: SOCIAL_TYPE;
  socialUniqueId?: string;
}
