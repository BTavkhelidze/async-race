import { create } from 'zustand';

type RaceState = {
  activeRaceCount: number;
  isRaceRunning: boolean;
  registerRaceStart: () => void;
  registerRaceEnd: () => void;
  resetRaceState: () => void;
};

export const useRaceStore = create<RaceState>((set) => ({
  activeRaceCount: 0,
  isRaceRunning: false,
  registerRaceStart: () => {
    set((state) => {
      const activeRaceCount = state.activeRaceCount + 1;

      return {
        activeRaceCount,
        isRaceRunning: activeRaceCount > 0,
      };
    });
  },
  registerRaceEnd: () => {
    set((state) => {
      const activeRaceCount = Math.max(state.activeRaceCount - 1, 0);

      return {
        activeRaceCount,
        isRaceRunning: activeRaceCount > 0,
      };
    });
  },
  resetRaceState: () => {
    set({
      activeRaceCount: 0,
      isRaceRunning: false,
    });
  },
}));
