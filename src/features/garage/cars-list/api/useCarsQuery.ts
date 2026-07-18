import { useQuery } from '@tanstack/react-query';

import { carQueryKeys } from './carQueryKeys';
import {
  getCars,
  type GetCarsParams,
  type GetCarsResponse,
} from '../../api/garage-crud';

type CarsQueryParams = Required<Pick<GetCarsParams, 'page' | 'limit'>>;

export const useCarsQuery = (params: CarsQueryParams) =>
  useQuery<GetCarsResponse, Error>({
    queryKey: carQueryKeys.list(params.page, params.limit),
    queryFn: () => getCars(params),
  });
