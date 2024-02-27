import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_BLOCK } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_block' })
export class UserBlock extends BaseEntity<UserBlock> {
  @Column({
    name: 'user_id',
  })
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'blocked_user_id',
  })
  @IsNotEmpty()
  blockedUserId?: number;

  @Column({
    name: 'action_type',
  })
  @IsEnum(USER_BLOCK)
  actionType?: USER_BLOCK;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUser: User;
}
