import type { GetCarsParams } from '../../api/garage-crud';

export const carQueryKeys = {
  all: ['garage', 'cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (params: GetCarsParams) => [...carQueryKeys.lists(), params] as const,
};
