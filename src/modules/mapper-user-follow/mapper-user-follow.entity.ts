import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'mapper_user_follow' })
export class MapperUserFollow extends BaseEntity<MapperUserFollow> {
  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @Column({ name: 'following_id' })
  @IsNotEmpty()
  followingId: number;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'following_id' })
  following: User;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  follower: User;
}
