import {
  API_BASE_URL,
  ensureSuccessfulResponse,
} from '../../api/garage-crud';
import type { EngineStartResponse } from '../model/engine.types';

const buildEngineUrl = (carId: number, status: 'started' | 'drive'): string => {
  const url = new URL('/engine', API_BASE_URL);

  url.searchParams.set('id', String(carId));
  url.searchParams.set('status', status);

  return url.toString();
};

export const startEngine = async (
  carId: number,
): Promise<EngineStartResponse> => {
  const response = await fetch(buildEngineUrl(carId, 'started'), {
    method: 'PATCH',
  });

  await ensureSuccessfulResponse(
    response,
    `Failed to start engine for car with id ${carId}`,
  );

  return response.json() as Promise<EngineStartResponse>;
};

export const driveCar = async (carId: number): Promise<void> => {
  const response = await fetch(buildEngineUrl(carId, 'drive'), {
    method: 'PATCH',
  });

  await ensureSuccessfulResponse(
    response,
    `Failed to drive car with id ${carId}`,
  );
};
