export const winnerQueryKeys = {
  all: ['winners'] as const,
  list: (page: number, limit: number) =>
    [...winnerQueryKeys.all, 'list', page, limit] as const,
  detail: (id: number) => [...winnerQueryKeys.all, id] as const,
};
