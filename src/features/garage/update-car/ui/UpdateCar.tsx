import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  carFormSchema,
  DEFAULT_CAR_COLOR,
  type CarFormValues,
} from '../../../car-form/model/carForm.schema';
import { useRaceStore } from '../../../../shared/model/race/race.store';
import { carQueryKeys } from '../../cars-list/api/carQueryKeys';
import { useSelectedCarStore } from '../../select-car/model/selected-car.store';
import { useUpdateCarMutation } from '../api/update-car.mutation';

const UPDATE_CAR_NAME_ERROR_ID = 'update-car-name-error';
const UPDATE_CAR_COLOR_ERROR_ID = 'update-car-color-error';

function UpdateCar() {
  const queryClient = useQueryClient();
  const selectedCar = useSelectedCarStore((state) => state.selectedCar);
  const selectCar = useSelectedCarStore((state) => state.selectCar);
  const clearSelectedCar = useSelectedCarStore(
    (state) => state.clearSelectedCar,
  );
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: '',
      color: DEFAULT_CAR_COLOR,
    },
  });
  const updateCarMutation = useUpdateCarMutation();
  const isFormDisabled =
    !selectedCar || updateCarMutation.isPending || isRaceRunning;
  const selectedColor =
    useWatch({
      control,
      name: 'color',
    }) ?? DEFAULT_CAR_COLOR;

  useEffect(() => {
    if (!selectedCar) {
      reset({
        name: '',
        color: DEFAULT_CAR_COLOR,
      });
      return;
    }

    reset({
      name: selectedCar.name,
      color: selectedCar.color,
    });
  }, [reset, selectedCar]);

  const onSubmit: SubmitHandler<CarFormValues> = (data) => {
    if (isRaceRunning) return;
    if (!selectedCar) return;

    updateCarMutation.mutate(
      {
        id: selectedCar.id,
        payload: data,
      },
      {
        onSuccess: async (updatedCar) => {
          selectCar(updatedCar);
          await queryClient.invalidateQueries({
            queryKey: carQueryKeys.all,
          });
          reset({
            name: '',
            color: DEFAULT_CAR_COLOR,
          });
          clearSelectedCar();
          toast.success('Car updated successfully');
        },
      },
    );
  };

  return (
    <div className='bg-[#151C2C] mt-5 border border-[#1F293A] p-5 rounded-xl flex flex-col justify-between shadow-lg'>
      <div>
        <h3 className='text-lg font-semibold tracking-wide text-slate-200 mb-4'>
          Update Car
        </h3>
        <form
          className='flex flex-col gap-3 mb-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex gap-10'>
            <div className='flex w-[60%] flex-col gap-1'>
              <input
                type='text'
                placeholder='Select a car'
                disabled={isFormDisabled}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? UPDATE_CAR_NAME_ERROR_ID : undefined
                }
                {...register('name')}
                className='w-full bg-[#0A0E17] border border-[#535050] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/30 transition-all text-slate-200 placeholder-slate-600 disabled:cursor-not-allowed disabled:opacity-50'
              />
              {errors.name && (
                <p
                  id={UPDATE_CAR_NAME_ERROR_ID}
                  role='alert'
                  className='text-sm text-red-400'
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <div className='relative rounded-full border-4 w-10 h-10 shrink-0 overflow-hidden border-[#535050] transition-transform active:scale-95'>
                <div
                  className='absolute inset-0 pointer-events-none rounded-lg'
                  style={{ backgroundColor: selectedColor }}
                />
                <input
                  type='color'
                  disabled={isFormDisabled}
                  aria-invalid={Boolean(errors.color)}
                  aria-describedby={
                    errors.color ? UPDATE_CAR_COLOR_ERROR_ID : undefined
                  }
                  {...register('color')}
                  className='absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full disabled:cursor-not-allowed'
                />
              </div>
              {errors.color && (
                <p
                  id={UPDATE_CAR_COLOR_ERROR_ID}
                  role='alert'
                  className='text-sm text-red-400'
                >
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          {updateCarMutation.isError && (
            <p role='alert' className='text-sm text-red-400'>
              {updateCarMutation.error.message}
            </p>
          )}

          <button
            type='submit'
            disabled={isFormDisabled}
            className='w-full bg-[#FF5722] hover:bg-[#E64A19] disabled:cursor-not-allowed disabled:opacity-70 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(255,87,34,0.2)] transition-all duration-200 active:scale-[0.99]'
          >
            {updateCarMutation.isPending ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCar;
