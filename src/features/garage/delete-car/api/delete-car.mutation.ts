import { useMutation } from '@tanstack/react-query';
import { deleteCar } from '../../api/garage-crud';

export const useDeleteCarMutation = () =>
  useMutation<void, Error, number>({
    mutationFn: deleteCar,
  });
