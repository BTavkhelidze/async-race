import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRaceStore } from '../../../../shared/model/race/race.store';
import type { Car } from '../../api/garage-crud';
import { carQueryKeys } from '../../cars-list/api/carQueryKeys';
import { useSelectedCarStore } from '../../select-car/model/selected-car.store';
import { useDeleteCarMutation } from '../api/delete-car.mutation';

type DeleteCarButtonProps = {
  car: Car;
  onDeleted?: () => void;
};

function DeleteCarButton({ car, onDeleted }: DeleteCarButtonProps) {
  const queryClient = useQueryClient();
  const selectedCar = useSelectedCarStore((state) => state.selectedCar);
  const clearSelectedCar = useSelectedCarStore(
    (state) => state.clearSelectedCar,
  );
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const deleteCarMutation = useDeleteCarMutation();

  const handleDelete = () => {
    if (isRaceRunning) return;

    deleteCarMutation.mutate(car.id, {
      onSuccess: async () => {
        if (selectedCar?.id === car.id) {
          clearSelectedCar();
        }

        await queryClient.invalidateQueries({
          queryKey: carQueryKeys.all,
        });
        onDeleted?.();
        toast.success('Car deleted successfully');
      },
    });
  };

  return (
    <button
      type='button'
      onClick={handleDelete}
      disabled={deleteCarMutation.isPending || isRaceRunning}
      className='h-7 min-w-10 px-2 text-xs font-semibold transition-colors rounded-md border border-red-400/70 text-red-200 hover:border-red-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
    >
      {deleteCarMutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default DeleteCarButton;
