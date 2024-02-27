import { BaseVo } from './base.vo';

export class PageInfoResponseVo {
  page: number = 1;
  limit: number = 10;
  isLast: boolean = true;
}
export class PaginateResponseVo<T> {
  items: T[] = [];
  totalCount: number = 0;
  pageInfo: PageInfoResponseVo = new PageInfoResponseVo();
}
