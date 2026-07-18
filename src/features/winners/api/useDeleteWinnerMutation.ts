import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWinner } from './winners.api';
import { winnerQueryKeys } from '../model/winnerQueryKeys';

export const useDeleteWinnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteWinner,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: winnerQueryKeys.all,
      });
    },
  });
};
