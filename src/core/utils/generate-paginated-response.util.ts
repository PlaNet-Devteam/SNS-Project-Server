import { PaginateResponseVo } from '../vo';

export const generatePaginatedResponse = <T>(
  items: T[],
  totalCount: number,
  page: number,
  limit: number,
): PaginateResponseVo<T> => {
  const lasPage = Math.ceil(totalCount / limit);

  return {
    items: items,
    totalCount: totalCount,
    pageInfo: {
      page,
      limit,
      isLast: page === lasPage ? true : false,
    },
  };
};
