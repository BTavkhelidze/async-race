import { useRef, useState } from 'react';
import { Pagination } from '../../../shared/ui/pagination';
import { useRaceStore } from '../../../shared/model/race/race.store';
import { useCarsQuery } from '../cars-list/api/useCarsQuery';
import CarListItem, {
  type CarListItemHandle,
} from '../cars-list/ui/CarListItem';
import EmptyGarageState from '../empty-garage-state/ui/EmptyGarageState';

const CARS_PER_PAGE = 7;
const CONTROL_BUTTON_CLASS =
  'rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-[0_0_15px_rgba(255,87,34,0.18)] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-[#374151] disabled:bg-[#1F293A] disabled:text-slate-500 disabled:shadow-none';

type CarListProps = {
  onGenerateCarsClick?: () => void;
  isGenerateCarsPending?: boolean;
};

function CarList({ onGenerateCarsClick, isGenerateCarsPending }: CarListProps) {
  const carRefs = useRef<(CarListItemHandle | null)[]>([]);
  const [hasRaceStarted, setHasRaceStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const resetRaceState = useRaceStore((state) => state.resetRaceState);

  const startAll = () => {
    if (isRaceRunning) return;

    setHasRaceStarted(true);
    carRefs.current.forEach((carRef) => carRef?.startRace());
  };

  const resetAll = () => {
    carRefs.current.forEach((carRef) => {
      carRef?.resetRace();
    });
    setHasRaceStarted(false);
    resetRaceState();
  };

  const { data, error, isError, isPending } = useCarsQuery({
    page: currentPage,
    limit: CARS_PER_PAGE,
  });

  const totalCars = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCars / CARS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (isRaceRunning) return;

    carRefs.current = [];
    setHasRaceStarted(false);
    setCurrentPage(page);
  };

  const shouldMoveToPreviousPageAfterDelete =
    currentPage > 1 && data?.cars.length === 1;

  return (
    <section className='mt-5 rounded-xl border border-[#1F293A] bg-[#151C2C] p-5 shadow-lg'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h3 className='text-lg font-semibold tracking-wide text-slate-200'>
          Cars
        </h3>
        <span className='text-sm text-slate-400'>Total: {totalCars}</span>
      </div>

      {isPending && <p className='text-sm text-slate-400'>Loading cars...</p>}

      {isError && (
        <p role='alert' className='text-sm text-red-400'>
          {error.message}
        </p>
      )}

      {!isPending && !isError && data.cars.length === 0 && (
        <EmptyGarageState
          onGenerateCarsClick={onGenerateCarsClick}
          isGenerateCarsPending={isGenerateCarsPending}
        />
      )}

      {!isPending && !isError && data.cars.length > 0 && (
        <>
          <div className='mb-4 flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={startAll}
              disabled={hasRaceStarted || isRaceRunning}
              className={`${CONTROL_BUTTON_CLASS} border border-[#FF5722] bg-[#FF5722] text-white hover:bg-[#E64A19]`}
            >
              Race All Cars
            </button>

            <button
              type='button'
              onClick={resetAll}
              disabled={!hasRaceStarted && !isRaceRunning}
              className={`${CONTROL_BUTTON_CLASS} border border-[#FF5722]/70 bg-[#0A0E17] text-[#FFB199] hover:border-[#FF5722] hover:text-white`}
            >
              Reset
            </button>
          </div>
          <ul className='space-y-1'>
            {data.cars.map((car, index) => (
              <CarListItem
                key={car.id}
                car={car}
                onDeleted={
                  shouldMoveToPreviousPageAfterDelete
                    ? () => handlePageChange(currentPage - 1)
                    : undefined
                }
                ref={(el) => {
                  carRefs.current[index] = el;
                }}
              />
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={isRaceRunning}
          />
        </>
      )}
    </section>
  );
}

export default CarList;
