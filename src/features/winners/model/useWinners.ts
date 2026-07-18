import { useQuery } from '@tanstack/react-query';
import { getCarById, type Car } from '../../garage/api/garage-crud';
import { getWinners } from '../api/winners.api';
import type { WinnerWithCar } from '../types/winner.types';
import { winnerQueryKeys } from './winnerQueryKeys';

const DELETED_CAR_COLOR = '#94A3B8';

const createDeletedCarFallback = (id: number): Car => ({
  id,
  name: 'Deleted car',
  color: DELETED_CAR_COLOR,
});

export const useWinners = () => {
  return useQuery<WinnerWithCar[], Error>({
    queryKey: winnerQueryKeys.list(),
    queryFn: async () => {
      const winners = await getWinners();

      return Promise.all(
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
    },
  });
};
