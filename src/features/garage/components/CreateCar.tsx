import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { createCar } from '../api/garage-crud';
import { toast } from 'react-toastify';

type Inputs = {
  name: string;
  color: string;
};

const DEFAULT_CAR_COLOR = '#ffffff';
const GARAGE_CARS_QUERY_KEY = ['garage', 'cars'] as const;

function CreateCar() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm<Inputs>({
    defaultValues: {
      name: '',
      color: DEFAULT_CAR_COLOR,
    },
  });
  const selectedColor = watch('color', DEFAULT_CAR_COLOR);

  const createCarMutation = useMutation({
    mutationFn: createCar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: GARAGE_CARS_QUERY_KEY,
      });

      reset({
        name: '',
        color: DEFAULT_CAR_COLOR,
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createCarMutation.mutate(data);
    toast.success('Car added successfully');
  };

  return (
    <div className='bg-[#151C2C] mt-5 border border-[#1F293A] p-5 rounded-xl flex flex-col justify-between shadow-lg'>
      <div>
        <h3 className='text-lg font-semibold tracking-wide text-slate-200 mb-4'>
          Create Car
        </h3>
        <form
          className='flex flex-col  gap-3 mb-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex  gap-10'>
            <input
              type='text'
              placeholder='Car Name'
              {...register('name')}
              className='w-[60%] bg-[#0A0E17] border border-[#1F293A] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/30 transition-all text-slate-200 placeholder-slate-600'
            />

            <div className='relative  rounded-full border-2 w-10 h-10 shrink-0 overflow-hidden  border-white transition-transform active:scale-95'>
              <div
                className='absolute inset-0 pointer-events-none rounded-lg'
                style={{ backgroundColor: selectedColor }}
              />
              <input
                type='color'
                {...register('color', { required: true })}
                className='absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full'
              />
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
            disabled={createCarMutation.isPending}
            className='w-full bg-[#FF5722] hover:bg-[#E64A19] disabled:cursor-not-allowed disabled:opacity-70 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(255,87,34,0.2)] transition-all duration-200 active:scale-[0.99]'
          >
            {createCarMutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCar;
