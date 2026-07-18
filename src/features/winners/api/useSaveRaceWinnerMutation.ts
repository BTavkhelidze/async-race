import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Winner } from '../types/winner.types';
import { saveRaceWinner } from './winners.api';
import { winnerQueryKeys } from '../model/winnerQueryKeys';

type SaveRaceWinnerVariables = {
  id: number;
  time: number;
};

export const useSaveRaceWinnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Winner, Error, SaveRaceWinnerVariables>({
    mutationFn: ({ id, time }) => saveRaceWinner(id, time),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: winnerQueryKeys.all,
      });
    },
  });
};
