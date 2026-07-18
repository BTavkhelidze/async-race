import type { Car } from '../../garage/api/garage-crud';

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerSortField = 'wins' | 'time';

export type SortOrder = 'ASC' | 'DESC';

export type WinnerSortState = {
  sortField: WinnerSortField;
  sortOrder: SortOrder;
};

export type GetWinnersParams = {
  page: number;
  limit: number;
  sort: WinnerSortField;
  order: SortOrder;
};

export type GetWinnersResponse = {
  winners: Winner[];
  totalCount: number;
};

export type WinnerPayload = {
  wins: number;
  time: number;
};

export type CreateWinnerPayload = Winner & WinnerPayload;

export type WinnerWithCar = Winner & {
  car: Car;
};

export type GetWinnersWithCarsResponse = {
  winners: WinnerWithCar[];
  totalCount: number;
};
