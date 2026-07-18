import {
  API_BASE_URL,
  ensureSuccessfulResponse,
} from '../../garage/api/garage-crud';
import type {
  CreateWinnerPayload,
  Winner,
  WinnerPayload,
} from '../types/winner.types';

class WinnerNotFoundError extends Error {
  constructor(id: number) {
    super(`Winner with id ${id} was not found`);
    this.name = 'WinnerNotFoundError';
  }
}

const buildWinnerUrl = (path = ''): string => {
  return new URL(`/winners${path}`, API_BASE_URL).toString();
};

const normalizeRaceTime = (time: number): number => {
  return Number(time.toFixed(2));
};

const isWinnerNotFoundError = (error: unknown): error is WinnerNotFoundError => {
  return error instanceof WinnerNotFoundError;
};

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

export const getWinners = async (): Promise<Winner[]> => {
  const response = await fetch(buildWinnerUrl());

  await ensureSuccessfulResponse(response, 'Failed to fetch winners');

  return response.json() as Promise<Winner[]>;
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
