import { API_BASE_URL, apiFetch } from '../../../../shared/lib/api-client';
import type {
  DriveResponse,
  EngineStartedResponse,
  EngineStatus,
} from '../model/engine.types';

export class EngineApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'EngineApiError';
    this.status = status;
  }
}

const getResponseErrorDetails = async (response: Response): Promise<string> => {
  const responseText = await response.text();

  return responseText ? ` Response body: ${responseText}` : '';
};

const ensureEngineResponse = async (
  response: Response,
  message: string,
): Promise<void> => {
  if (!response.ok) {
    const errorDetails = await getResponseErrorDetails(response);
    throw new EngineApiError(
      `${message}. Status: ${response.status} ${response.statusText}.${errorDetails}`,
      response.status,
    );
  }
};

export const isEngineApiError = (error: unknown): error is EngineApiError =>
  error instanceof EngineApiError;

const buildEngineUrl = (carId: number, status: EngineStatus): string => {
  const url = new URL('/engine', API_BASE_URL);

  url.searchParams.set('id', String(carId));
  url.searchParams.set('status', status);

  return url.toString();
};

export const startEngine = async (
  carId: number,
): Promise<EngineStartedResponse> => {
  const response = await apiFetch(buildEngineUrl(carId, 'started'), {
    method: 'PATCH',
  });

  await ensureEngineResponse(
    response,
    `Failed to start engine for car with id ${carId}`,
  );

  return response.json() as Promise<EngineStartedResponse>;
};

export const driveCar = async (carId: number): Promise<DriveResponse> => {
  const response = await apiFetch(buildEngineUrl(carId, 'drive'), {
    method: 'PATCH',
  });

  await ensureEngineResponse(response, `Failed to drive car with id ${carId}`);

  const driveResponse = (await response.json()) as DriveResponse;

  if (driveResponse.success !== true) {
    throw new Error(`Unexpected drive response for car with id ${carId}`);
  }

  return driveResponse;
};
