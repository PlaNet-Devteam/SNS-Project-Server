import { IsEnum, IsNotEmpty } from 'class-validator';
import { FEED_STATUS, YN } from 'src/common';
import { BaseUpdateEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { FeedImage } from '../feed-image/feed-image.entity';
import { Tag } from '../tag/tag.entity';

@Entity({ name: 'feed' })
export class Feed extends BaseUpdateEntity<Feed> {
  constructor(partial?: Partial<Feed>) {
    super();
    // exclude decorator 적용하기
    Object.assign(this, partial);
  }

  @Column({
    name: 'user_id',
  })
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'description',
  })
  description?: string;

  @Column({
    name: 'like_count',
  })
  @IsNotEmpty()
  likeCount: number;

  @Column({
    name: 'show_like_count_yn',
  })
  @IsEnum(YN)
  showLikeCountYn?: YN;

  @Column({
    name: 'comment_count',
  })
  @IsNotEmpty()
  commentCount: number;

  @Column({
    name: 'display_yn',
  })
  @IsEnum(YN)
  displayYn?: YN;

  @Column()
  @IsEnum(FEED_STATUS)
  status?: FEED_STATUS;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany((type) => FeedImage, (feedImages) => feedImages.feed)
  feedImages?: FeedImage[];

  @ManyToMany((type) => Tag, (tag) => tag.feeds)
  @JoinTable({
    name: 'mapper_feed_tag',
    joinColumn: {
      name: 'feed_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
    },
  })
  tags?: Tag[];

  // no database
  likedYn?: boolean;
  bookmarkedYn?: boolean;
}
