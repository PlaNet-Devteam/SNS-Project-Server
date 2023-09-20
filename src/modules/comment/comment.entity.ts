import { IsNotEmpty } from 'class-validator';
import { BaseUpdateEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'comment' })
export class Comment extends BaseUpdateEntity<Comment> {
  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'feed_id' })
  @IsNotEmpty()
  feedId: number;

  @Column({
    name: 'comment',
  })
  @IsNotEmpty()
  comment: string;

  @Column({
    name: 'reply_count',
  })
  replyCount?: number;
}
