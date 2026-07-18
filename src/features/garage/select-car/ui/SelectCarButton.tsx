import { useRaceStore } from '../../../../shared/model/race/race.store';
import type { Car } from '../../api/garage-crud';
import { useGarageUiStore } from '../../model/garage-ui.store';

type SelectCarButtonProps = {
  car: Car;
};

function SelectCarButton({ car }: SelectCarButtonProps) {
  const selectedCarId = useGarageUiStore(
    (state) => state.updateForm.selectedCarId,
  );
  const setUpdateForm = useGarageUiStore((state) => state.setUpdateForm);
  const resetUpdateForm = useGarageUiStore((state) => state.resetUpdateForm);
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const isSelected = selectedCarId === car.id;

  const handleSelectCar = () => {
    if (isRaceRunning) return;

    if (isSelected) {
      resetUpdateForm();
      return;
    }

    setUpdateForm({
      selectedCarId: car.id,
      name: car.name,
      color: car.color,
    });
  };

  return (
    <button
      type='button'
      onClick={handleSelectCar}
      disabled={isRaceRunning}
      className={`h-7 min-w-15 px-2 text-xs font-semibold transition-colors rounded-md border disabled:cursor-not-allowed disabled:opacity-50 ${
        isSelected
          ? 'border-[#FF5722] bg-[#FF5722] text-white'
          : 'border-[#FF5722]/70 text-[#FFB199] hover:border-[#FF5722] hover:text-white'
      }`}
    >
      Select
    </button>
  );
}

export default SelectCarButton;
