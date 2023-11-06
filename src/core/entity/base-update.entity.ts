import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseUpdateEntity<T> extends BaseEntity<T> {
  @Column({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
