import type { Car } from '../../garage/api/garage-crud';

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type GetWinnersParams = {
  page: number;
  limit: number;
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
