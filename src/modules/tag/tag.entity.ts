import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

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
}
