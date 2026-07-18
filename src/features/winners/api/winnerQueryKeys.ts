export const winnerQueryKeys = {
  all: ['winners'] as const,
  detail: (id: number) => [...winnerQueryKeys.all, id] as const,
};
