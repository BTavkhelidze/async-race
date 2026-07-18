import { toast } from 'react-toastify';
import { useRaceStore } from '../../../../shared/model/race/race.store';
import type { Car } from '../../api/garage-crud';
import { useGarageUiStore } from '../../model/garage-ui.store';
import { useDeleteCarMutation } from '../api/delete-car.mutation';

type DeleteCarButtonProps = {
  car: Car;
  onDeleted?: () => void;
};

function DeleteCarButton({ car, onDeleted }: DeleteCarButtonProps) {
  const selectedCarId = useGarageUiStore(
    (state) => state.updateForm.selectedCarId,
  );
  const resetUpdateForm = useGarageUiStore((state) => state.resetUpdateForm);
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const deleteCarMutation = useDeleteCarMutation();

  const handleDelete = () => {
    if (isRaceRunning) return;

    const shouldDelete = window.confirm(`Delete ${car.name} from Garage?`);

    if (!shouldDelete) return;

    deleteCarMutation.mutate(car.id, {
      onSuccess: async () => {
        if (selectedCarId === car.id) {
          resetUpdateForm();
        }

        onDeleted?.();
        toast.success('Car deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message);
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
