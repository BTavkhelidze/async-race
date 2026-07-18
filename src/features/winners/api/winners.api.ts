import {
  API_BASE_URL,
  ensureSuccessfulResponse,
} from '../../garage/api/garage-crud';
import type {
  CreateWinnerPayload,
  GetWinnersParams,
  GetWinnersResponse,
  Winner,
  WinnerPayload,
} from '../types/winner.types';

export class WinnerNotFoundError extends Error {
  constructor(id: number) {
    super(`Winner with id ${id} was not found`);
    this.name = 'WinnerNotFoundError';
  }
}

const buildWinnerUrl = (path = '', params?: URLSearchParams): string => {
  const url = new URL(`/winners${path}`, API_BASE_URL);

  if (params) {
    url.search = params.toString();
  }

  return url.toString();
};

const normalizeRaceTime = (time: number): number => Number(time.toFixed(2));

export const isWinnerNotFoundError = (
  error: unknown,
): error is WinnerNotFoundError => error instanceof WinnerNotFoundError;

export const getWinner = async (id: number): Promise<Winner> => {
  const response = await fetch(buildWinnerUrl(`/${id}`));

  if (response.status === 404) {
    throw new WinnerNotFoundError(id);
  }

  await ensureSuccessfulResponse(
    response,
    `Failed to fetch winner with id ${id}`,
  );

  return response.json() as Promise<Winner>;
};

export const getWinners = async ({
  page,
  limit,
  sort,
  order,
}: GetWinnersParams): Promise<GetWinnersResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set('_page', String(page));
  queryParams.set('_limit', String(limit));
  queryParams.set('_sort', sort);
  queryParams.set('_order', order);

  const response = await fetch(buildWinnerUrl('', queryParams));

  await ensureSuccessfulResponse(response, 'Failed to fetch winners');

  const winners = (await response.json()) as Winner[];
  const totalCountHeader = response.headers.get('X-Total-Count');
  const parsedTotalCount =
    totalCountHeader === null ? Number.NaN : Number(totalCountHeader);
  const totalCount = Number.isNaN(parsedTotalCount)
    ? winners.length
    : parsedTotalCount;

  return {
    winners,
    totalCount,
  };
};

export const createWinner = async (
  winner: CreateWinnerPayload,
): Promise<Winner> => {
  const response = await fetch(buildWinnerUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(winner),
  });

  await ensureSuccessfulResponse(response, 'Failed to create winner');

  return response.json() as Promise<Winner>;
};

export const updateWinner = async (
  id: number,
  payload: WinnerPayload,
): Promise<Winner> => {
  const response = await fetch(buildWinnerUrl(`/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  await ensureSuccessfulResponse(
    response,
    `Failed to update winner with id ${id}`,
  );

  return response.json() as Promise<Winner>;
};

export const deleteWinner = async (id: number): Promise<void> => {
  const response = await fetch(buildWinnerUrl(`/${id}`), {
    method: 'DELETE',
  });

  if (response.status === 404) {
    throw new WinnerNotFoundError(id);
  }

  await ensureSuccessfulResponse(
    response,
    `Failed to delete winner with id ${id}`,
  );
};

export const saveRaceWinner = async (
  id: number,
  time: number,
): Promise<Winner> => {
  const currentRaceTime = normalizeRaceTime(time);

  try {
    const existingWinner = await getWinner(id);

    return updateWinner(id, {
      wins: existingWinner.wins + 1,
      time: Math.min(existingWinner.time, currentRaceTime),
    });
  } catch (error) {
    if (!isWinnerNotFoundError(error)) {
      throw error;
    }

    return createWinner({
      id,
      wins: 1,
      time: currentRaceTime,
    });
  }
};
