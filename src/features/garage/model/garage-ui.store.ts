import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CAR_COLOR } from '../../car-form/model/carForm.schema';

type GarageCreateFormState = {
  name: string;
  color: string;
};

type GarageUpdateFormState = GarageCreateFormState & {
  selectedCarId: number | null;
};

type GarageUiState = {
  currentPage: number;
  createForm: GarageCreateFormState;
  updateForm: GarageUpdateFormState;
  setCurrentPage: (page: number) => void;
  setCreateForm: (values: Partial<GarageCreateFormState>) => void;
  resetCreateForm: () => void;
  setUpdateForm: (values: Partial<GarageUpdateFormState>) => void;
  resetUpdateForm: () => void;
};

const DEFAULT_CREATE_FORM: GarageCreateFormState = {
  name: '',
  color: DEFAULT_CAR_COLOR,
};

const DEFAULT_UPDATE_FORM: GarageUpdateFormState = {
  selectedCarId: null,
  name: '',
  color: DEFAULT_CAR_COLOR,
};

export const useGarageUiStore = create<GarageUiState>()(
  persist(
    (set) => ({
      currentPage: 1,
      createForm: DEFAULT_CREATE_FORM,
      updateForm: DEFAULT_UPDATE_FORM,
      setCurrentPage: (page) => {
        set({ currentPage: Math.max(page, 1) });
      },
      setCreateForm: (values) => {
        set((state) => ({
          createForm: {
            ...state.createForm,
            ...values,
          },
        }));
      },
      resetCreateForm: () => {
        set({ createForm: DEFAULT_CREATE_FORM });
      },
      setUpdateForm: (values) => {
        set((state) => ({
          updateForm: {
            ...state.updateForm,
            ...values,
          },
        }));
      },
      resetUpdateForm: () => {
        set({ updateForm: DEFAULT_UPDATE_FORM });
      },
    }),
    {
      name: 'async-race-garage-ui',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
