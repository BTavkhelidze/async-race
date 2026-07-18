export const winnerQueryKeys = {
  all: ['winners'] as const,
  list: () => [...winnerQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...winnerQueryKeys.all, id] as const,
};
