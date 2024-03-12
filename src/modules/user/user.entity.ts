import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { GENDER, USER_STATUS, YN } from 'src/common';
import { BaseUpdateEntity } from 'src/core';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { UserHistory } from '../user-history/user-history.entity';
import { UserLoginHistory } from '../user-login-history/user-login-history.entity';
import { Exclude } from 'class-transformer';
import { Room } from '../room/room.entity';

@Entity({ name: 'user' })
export class User extends BaseUpdateEntity<User> {
  constructor(partial?: Partial<User>) {
    super();
    // exclude decorator 적용하기
    Object.assign(this, partial);
  }

  @Column({
    name: 'email',
  })
  @IsNotEmpty({
    message: '이메일은 필수 항목 입니다',
  })
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

  @Column()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  password: string;

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

  @Column({
    name: 'following_count',
  })
  followingCount?: number;

  @Column({
    name: 'feed_count',
  })
  feedCount?: number;

  @Column({
    name: 'follower_count',
  })
  followerCount?: number;

  @Column({
    name: 'last_login_at',
  })
  lastLoginAt?: Date;

  @Column({
    name: 'inactive_at',
  })
  inactiveAt?: Date;

  @Column({
    name: 'del_yn',
    default: YN.N,
  })
  @IsEnum(YN)
  delYn?: YN;

  @OneToMany((type) => UserHistory, (userHistory) => userHistory.user)
  userHistory?: UserHistory[];

  @OneToMany(
    (type) => UserLoginHistory,
    (userLoginHistory) => userLoginHistory.user,
  )
  userLoginHistory?: UserLoginHistory[];

  @ManyToMany((type) => Room, (room) => room.users)
  @JoinTable({
    name: 'mapper_user_room',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'room_id',
    },
  })
  rooms?: Room[];

  // no database

  followingIds?: number[];

  followerIds?: number[];

  isBlockedByViewer?: boolean;
}
