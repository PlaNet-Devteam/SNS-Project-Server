import { UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseUpdateEntity<T> extends BaseEntity<T> {
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
