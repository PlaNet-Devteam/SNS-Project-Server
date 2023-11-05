import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Feed } from '../feed/feed.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'feed_bookmark' })
export class FeedBookmark extends BaseEntity<FeedBookmark> {
  @Column({ name: 'feed_id' })
  @IsNotEmpty()
  feedId: number;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => Feed)
  @JoinColumn({ name: 'feed_id' })
  feed: Feed;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
