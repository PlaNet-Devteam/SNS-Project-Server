import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Feed } from '../feed/feed.entity';

@Entity({ name: 'tag' })
export class Tag extends BaseEntity<Tag> {
  constructor(partial?: Partial<Tag>) {
    super();
    Object.assign(this, partial);
  }
  @Column({
    name: 'tag_name',
  })
  tagName: string;

  @Column({
    name: 'search_yn',
    default: YN.Y,
  })
  searchYn?: YN;

  @ManyToMany((type) => Feed, (feed) => feed.tags)
  @JoinTable({
    name: 'mapper_feed_tag',
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'feed_id',
    },
  })
  feeds?: Tag[];
}
