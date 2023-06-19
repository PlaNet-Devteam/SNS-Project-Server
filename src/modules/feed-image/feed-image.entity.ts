import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'feed_image' })
export class FeedImage extends BaseEntity<FeedImage> {
  @Column({ name: 'feed_id' })
  @IsNotEmpty()
  feedId: number;

  @Column({
    name: 'image',
    comment: '이미지',
  })
  image: string;

  @Column({
    name: 'sort_order',
    comment: '이미지 순서',
  })
  sortOrder: number;
}
