import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { USER_STATUS, GENDER } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_history' })
export class UserHistory extends BaseEntity<UserHistory> {
  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({
    name: 'profile_image',
    comment: '프로필 이미지',
  })
  profileImage?: string;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column()
  nickname?: string;

  @Column({
    comment: '사용자 상태',
  })
  @IsEnum(USER_STATUS)
  status: USER_STATUS;

  @Column({
    comment: '소개글',
  })
  bio?: string;

  @Column()
  @IsEnum(GENDER)
  gender?: GENDER;

  @ManyToOne((type) => User, (user) => user.userHistory)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
