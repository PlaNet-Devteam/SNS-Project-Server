import { SOCIAL_TYPE, YN } from 'src/common';
import { BaseUpdateEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_social' })
export class UserSocial extends BaseUpdateEntity<UserSocial> {
  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'email',
  })
  email: string;

  @Column({
    name: 'social_type',
  })
  socialType: SOCIAL_TYPE;

  @Column({
    name: 'social_unique_id',
  })
  socialUniqueId?: string;
}
