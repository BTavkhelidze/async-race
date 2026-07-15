export const carQueryKeys = {
  all: ['cars'] as const,
  list: (page: number, limit: number) =>
    [...carQueryKeys.all, page, limit] as const,
};
