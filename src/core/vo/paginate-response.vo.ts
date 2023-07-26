import { BaseVo } from './base.vo';

export class PaginateResponseVo<T> {
  items: T[];
  totalCount: number;
  page: number;
}
