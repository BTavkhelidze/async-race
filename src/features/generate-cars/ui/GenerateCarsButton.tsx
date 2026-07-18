import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRaceStore } from '../../../shared/model/race/race.store';
import { createCar, type Car } from '../../garage/api/garage-crud';
import { carQueryKeys } from '../../garage/cars-list/api/carQueryKeys';
import { generateRandomCars } from '../lib/generateRandomCars';
import { RANDOM_CARS_COUNT } from '../model/generateCars.constants';

type GenerateCarsResult = {
  createdCount: number;
};

type CreateCarResult =
  | {
      status: 'fulfilled';
      car: Car;
    }
  | {
      status: 'rejected';
      reason: unknown;
    };

const GENERATE_CARS_BUTTON_CLASS =
  'w-full bg-[#FF5722] hover:bg-[#E64A19] disabled:cursor-not-allowed disabled:opacity-70 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(255,87,34,0.2)] transition-all duration-200 active:scale-[0.99]';

function getRejectedReasonMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'Unknown error';
}

function GenerateCarsButton() {
  const queryClient = useQueryClient();
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);

  const generateCarsMutation = useMutation<GenerateCarsResult, Error>({
    mutationFn: async () => {
      const cars = generateRandomCars(RANDOM_CARS_COUNT);
      const results = await Promise.all(
        cars.map(async (car): Promise<CreateCarResult> => {
          try {
            return {
              status: 'fulfilled',
              car: await createCar(car),
            };
          } catch (error) {
            return {
              status: 'rejected',
              reason: error,
            };
          }
        }),
      );
      const failedResults = results.filter(
        (result) => result.status === 'rejected',
      );
      const createdCount = results.length - failedResults.length;

      if (failedResults.length > 0) {
        const firstError = getRejectedReasonMessage(failedResults[0].reason);

        throw new Error(
          `Generated ${createdCount} cars, ${failedResults.length} failed. First error: ${firstError}`,
        );
      }

      return { createdCount };
    },
    onSuccess: ({ createdCount }) => {
      toast.success(`${createdCount} random cars generated`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: carQueryKeys.all,
      });
    },
  });
  const handleGenerateCarsClick = () => {
    if (isRaceRunning) return;

    generateCarsMutation.mutate();
  };

  return (
    <div className='bg-[#151C2C] mt-5 border border-[#1F293A] p-5 rounded-xl shadow-lg'>
      <h3 className='text-lg font-semibold tracking-wide text-slate-200 mb-4'>
        Random Cars
      </h3>
      <button
        type='button'
        onClick={handleGenerateCarsClick}
        disabled={generateCarsMutation.isPending || isRaceRunning}
        className={GENERATE_CARS_BUTTON_CLASS}
      >
        {generateCarsMutation.isPending ? 'Generating...' : 'Generate 100 Cars'}
      </button>
      {generateCarsMutation.isError && (
        <p role='alert' className='mt-3 text-sm text-red-400'>
          {generateCarsMutation.error.message}
        </p>
      )}
    </div>
  );
}

export default GenerateCarsButton;
