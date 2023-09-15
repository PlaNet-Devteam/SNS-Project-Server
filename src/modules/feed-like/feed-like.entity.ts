import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'feed_like' })
export class FeedLike extends BaseEntity<FeedLike> {
  @Column({ name: 'feed_id' })
  @IsNotEmpty()
  feedId: number;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;
}
