import { useMutation } from '@tanstack/react-query';
import type { Car, CarPayload } from '../../api/garage-crud';
import { updateCar } from '../../api/garage-crud';

type UpdateCarVariables = {
  id: number;
  payload: CarPayload;
};

export const useUpdateCarMutation = () =>
  useMutation<Car, Error, UpdateCarVariables>({
    mutationFn: ({ id, payload }) => updateCar(id, payload),
  });
