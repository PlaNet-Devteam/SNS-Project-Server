import { IsEnum, IsNotEmpty } from 'class-validator';
import { FEED_STATUS, YN } from 'src/common';
import { BaseUpdateEntity } from 'src/core';
import { Column, Entity, OneToMany } from 'typeorm';
import { FeedImage } from '../feed-image/feed-image.entity';

@Entity({ name: 'feed' })
export class Feed extends BaseUpdateEntity<Feed> {
  constructor(partial?: Partial<Feed>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: number;

  @Column({ name: 'description' })
  description?: string;

  @Column({ name: 'like_count' })
  likeCount: number;

  @Column({ name: 'show_like_count_yn' })
  @IsEnum(YN)
  showLikeCountYn: YN;

  @Column({ name: 'comment_count' })
  commentCount: number;

  @Column({ name: 'display_yn' })
  @IsEnum(YN)
  displayYn: YN;

  @Column({ name: 'status' })
  @IsEnum(FEED_STATUS)
  status: FEED_STATUS;

  @OneToMany((type) => FeedImage, (feedIamge) => feedIamge.feedId)
  images?: FeedImage[];
}
