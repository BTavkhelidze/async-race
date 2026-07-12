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
  const isSelected = selectedCar?.id === car.id;

  return (
    <button
      type='button'
      onClick={() => {
        if (isSelected) {
          clearSelectedCar();
          return;
        }

        selectCar(car);
      }}
      className={`h-7 min-w-15 px-2 text-xs font-semibold transition-colors rounded-md border ${
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
