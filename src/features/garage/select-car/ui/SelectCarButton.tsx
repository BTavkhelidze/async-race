import { useRaceStore } from '../../../../shared/model/race/race.store';
import type { Car } from '../../api/garage-crud';
import { useSelectedCarStore } from '../model/selected-car.store';

type SelectCarButtonProps = {
  car: Car;
};

function SelectCarButton({ car }: SelectCarButtonProps) {
  const selectedCar = useSelectedCarStore((state) => state.selectedCar);
  const selectCar = useSelectedCarStore((state) => state.selectCar);
  const clearSelectedCar = useSelectedCarStore(
    (state) => state.clearSelectedCar,
  );
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const isSelected = selectedCar?.id === car.id;

  const handleSelectCar = () => {
    if (isRaceRunning) return;

    if (isSelected) {
      clearSelectedCar();
      return;
    }

    selectCar(car);
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
