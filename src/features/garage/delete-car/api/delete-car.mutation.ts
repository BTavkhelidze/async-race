import { useMutation, useQueryClient } from '@tanstack/react-query';
import { winnerQueryKeys } from '../../../winners/model/winnerQueryKeys';
import { carQueryKeys } from '../../cars-list/api/carQueryKeys';
import { deleteCarWithRelatedWinner } from './delete-car-with-winner';

export const useDeleteCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteCarWithRelatedWinner,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: carQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: winnerQueryKeys.all,
        }),
      ]);
    },
  });
};
