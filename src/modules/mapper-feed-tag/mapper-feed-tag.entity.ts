import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'mapper_feed_tag' })
export class MapperFeedTag extends BaseEntity<MapperFeedTag> {
  @Column({ name: 'feed_id' })
  feedId: number;

  @Column({ name: 'tag_id' })
  tagId: number;
}
