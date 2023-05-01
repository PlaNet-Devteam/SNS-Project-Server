import { classToPlain, instanceToPlain } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

export class BaseEntity<T> extends TypeOrmBaseEntity {
  constructor(partial?: Partial<T>) {
    super();
    partial &&
      Object.keys(partial).map((key) => {
        console.log('mapping');
        if (key !== 'id' && partial[key] !== undefined) {
          this[key] = partial[key];
        }
      });
  }

  // Entity mapping
  set(partial: Object): this {
    partial &&
      Object.keys(partial).map((key) => {
        if (key !== 'id' && partial[key] !== undefined) {
          this[key] = partial[key];
        }
        if (partial[key] && partial[key] === '') this[key] = null;
      });
    return this;
  }

  // 공통 컬럼
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'int',
  })
  id: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  toJSON() {
    Object.keys(this).map((key) => {
      if ((this[key] && this[key] === '') || this[key] === null) {
        delete this[key];
      }
    });

    return instanceToPlain(this);
  }
}
