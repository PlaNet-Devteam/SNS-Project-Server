import { BaseVo } from './base.vo';

export class PaginateResponseVo<T> {
  items: T[];
  totalCount: number;
  pageInfo: {
    page: number;
    limit: number;
    isLast: boolean;
  };
}
