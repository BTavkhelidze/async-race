import type { SortOrder, WinnerSortField } from '../types/winner.types';

export const winnerQueryKeys = {
  all: ['winners'] as const,
  list: (
    page: number,
    limit: number,
    sortField: WinnerSortField,
    sortOrder: SortOrder,
  ) =>
    [...winnerQueryKeys.all, 'list', page, limit, sortField, sortOrder] as const,
  detail: (id: number) => [...winnerQueryKeys.all, id] as const,
};
