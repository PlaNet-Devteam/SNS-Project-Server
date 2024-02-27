import { BaseDto } from 'src/core';
import { User } from 'src/modules/user/user.entity';

export class AuthGoogleDto {
  email: string;
  username?: string;
  nickname?: string;
  profileImage?: string;
  socialUniqueId?: string;
}
