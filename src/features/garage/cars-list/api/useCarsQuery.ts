import { useQuery } from '@tanstack/react-query';

import { carQueryKeys } from './carQueryKeys';
import {
  getCars,
  type GetCarsParams,
  type GetCarsResponse,
} from '../../api/garage-crud';

export const useCarsQuery = (params: GetCarsParams) =>
  useQuery<GetCarsResponse, Error>({
    queryKey: carQueryKeys.list(params),
    queryFn: () => getCars(params),
  });
