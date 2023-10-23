import { IsNotEmpty } from 'class-validator';
import { BaseUpdateEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'comment_reply' })
export class CommentReply extends BaseUpdateEntity<CommentReply> {
  @Column({ name: 'comment_id' })
  @IsNotEmpty()
  commentId: number;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'comment',
  })
  @IsNotEmpty()
  comment: string;
}
