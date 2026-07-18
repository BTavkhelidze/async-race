import { create } from 'zustand';
import type { Car } from '../../api/garage-crud';

type SelectedCarState = {
  selectedCar: Car | null;
  selectCar: (car: Car) => void;
  clearSelectedCar: () => void;
};

export const useSelectedCarStore = create<SelectedCarState>((set) => ({
  selectedCar: null,
  selectCar: (car) => {
    set({ selectedCar: car });
  },
  clearSelectedCar: () => {
    set({ selectedCar: null });
  },
}));
