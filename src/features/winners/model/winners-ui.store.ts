import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WinnerSortState } from '../types/winner.types';
import {
  DEFAULT_WINNER_SORT_FIELD,
  DEFAULT_WINNER_SORT_ORDER,
} from './winners.constants';

type WinnersUiState = {
  currentPage: number;
  sortState: WinnerSortState;
  setCurrentPage: (page: number) => void;
  setSortState: (sortState: WinnerSortState) => void;
};

export const useWinnersUiStore = create<WinnersUiState>()(
  persist(
    (set) => ({
      currentPage: 1,
      sortState: {
        sortField: DEFAULT_WINNER_SORT_FIELD,
        sortOrder: DEFAULT_WINNER_SORT_ORDER,
      },
      setCurrentPage: (page) => {
        set({ currentPage: Math.max(page, 1) });
      },
      setSortState: (sortState) => {
        set({ sortState });
      },
    }),
    {
      name: 'async-race-winners-ui',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
