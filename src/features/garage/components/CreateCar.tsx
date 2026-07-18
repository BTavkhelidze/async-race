import { forwardRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import {
  carFormSchema,
  DEFAULT_CAR_COLOR,
  type CarFormValues,
} from '../../car-form/model/carForm.schema';
import { useRaceStore } from '../../../shared/model/race/race.store';
import { createCar } from '../api/garage-crud';
import { toast } from 'react-toastify';
import { carQueryKeys } from '../cars-list/api/carQueryKeys';

const CREATE_CAR_NAME_ERROR_ID = 'create-car-name-error';
const CREATE_CAR_COLOR_ERROR_ID = 'create-car-color-error';

const CreateCar = forwardRef<HTMLInputElement>((_, ref) => {
  const queryClient = useQueryClient();
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: '',
      color: DEFAULT_CAR_COLOR,
    },
  });
  const nameInput = register('name');
  const selectedColor = watch('color', DEFAULT_CAR_COLOR);

  const createCarMutation = useMutation({
    mutationFn: createCar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: carQueryKeys.all,
      });

      reset({
        name: '',
        color: DEFAULT_CAR_COLOR,
      });
    },
  });

  const onSubmit: SubmitHandler<CarFormValues> = (data) => {
    if (isRaceRunning) return;

    createCarMutation.mutate(data);
    toast.success('Car added successfully');
  };

  return (
    <div className='bg-[#151C2C] mt-5 border border-[#1F293A] p-5 rounded-xl flex flex-col justify-between shadow-lg max-[1039px]:w-full max-[1039px]:min-w-0 max-[1039px]:p-4'>
      <div>
        <h3 className='text-lg font-semibold tracking-wide text-slate-200 mb-4'>
          Create Car
        </h3>
        <form
          className='flex flex-col  gap-3 mb-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex gap-10 max-[1039px]:min-w-0 max-[1039px]:flex-wrap max-[1039px]:gap-3'>
            <div className='flex w-[60%] flex-col gap-1 max-[1039px]:w-auto max-[1039px]:min-w-0 max-[1039px]:flex-1'>
              <input
                type='text'
                placeholder='Car Name'
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? CREATE_CAR_NAME_ERROR_ID : undefined
                }
                {...nameInput}
                ref={(element) => {
                  nameInput.ref(element);

                  if (typeof ref === 'function') {
                    ref(element);
                    return;
                  }

                  if (ref) {
                    ref.current = element;
                  }
                }}
                className='w-full bg-[#0A0E17] border border-[#535050] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/30 transition-all text-slate-200 placeholder-slate-600'
              />
              {errors.name && (
                <p
                  id={CREATE_CAR_NAME_ERROR_ID}
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
                  aria-invalid={Boolean(errors.color)}
                  aria-describedby={
                    errors.color ? CREATE_CAR_COLOR_ERROR_ID : undefined
                  }
                  {...register('color')}
                  className='absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full'
                />
              </div>
              {errors.color && (
                <p
                  id={CREATE_CAR_COLOR_ERROR_ID}
                  role='alert'
                  className='text-sm text-red-400'
                >
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>
          {createCarMutation.isError && (
            <p role='alert' className='text-sm text-red-400'>
              {createCarMutation.error instanceof Error
                ? createCarMutation.error.message
                : 'Failed to create car'}
            </p>
          )}
          <button
            type='submit'
            disabled={createCarMutation.isPending || isRaceRunning}
            className='w-full bg-[#FF5722] hover:bg-[#E64A19] disabled:cursor-not-allowed disabled:opacity-70 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(255,87,34,0.2)] transition-all duration-200 active:scale-[0.99]'
          >
            {createCarMutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
});

CreateCar.displayName = 'CreateCar';

export default CreateCar;
