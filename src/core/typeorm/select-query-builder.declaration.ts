import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { BasePaginationDto } from '../dto';
import { FeedListDto } from 'src/modules/feed/dto';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    Paginate<Entity, T>(
      this: SelectQueryBuilder<Entity>,
      pagination: BasePaginationDto<T>,
    ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.Paginate = function <Entity, T>(
  this: SelectQueryBuilder<Entity>,
  pagination: BasePaginationDto<T>,
): SelectQueryBuilder<Entity> {
  this.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit);
  return this;
};
