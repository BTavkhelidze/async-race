import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCarById, type Car } from '../../garage/api/garage-crud';
import { getWinners } from '../api/winners.api';
import type {
  GetWinnersWithCarsResponse,
  WinnerSortState,
  WinnerWithCar,
} from '../types/winner.types';
import { winnerQueryKeys } from './winnerQueryKeys';

const DELETED_CAR_COLOR = '#94A3B8';

const createDeletedCarFallback = (id: number): Car => ({
  id,
  name: 'Deleted car',
  color: DELETED_CAR_COLOR,
});

export const useWinners = (
  page: number,
  limit: number,
  { sortField, sortOrder }: WinnerSortState,
) =>
  useQuery<GetWinnersWithCarsResponse, Error>({
    queryKey: winnerQueryKeys.list(page, limit, sortField, sortOrder),
    queryFn: async () => {
      const { winners, totalCount } = await getWinners({
        page,
        limit,
        sort: sortField,
        order: sortOrder,
      });
      const winnersWithCars = await Promise.all(
        winners.map(async (winner): Promise<WinnerWithCar> => {
          try {
            const car = await getCarById(winner.id);

            return {
              ...winner,
              car,
            };
          } catch {
            return {
              ...winner,
              car: createDeletedCarFallback(winner.id),
            };
          }
        }),
      );

      return {
        winners: winnersWithCars,
        totalCount,
      };
    },
    placeholderData: keepPreviousData,
  });
