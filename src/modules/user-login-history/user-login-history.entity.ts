import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_LOGIN } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_login_history' })
export class UserLoginHistory extends BaseEntity<UserLoginHistory> {
  @Column({
    name: 'user_id',
  })
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'device_id',
  })
  deviceId?: string;

  @Column({
    name: 'action_type',
  })
  @IsEnum(USER_LOGIN)
  actionType?: USER_LOGIN;

  @ManyToOne((type) => User, (user) => user.userLoginHistory)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
