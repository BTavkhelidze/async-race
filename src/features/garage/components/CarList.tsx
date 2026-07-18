import { useCallback, useEffect, useRef, useState } from 'react';
import { Pagination } from '../../../shared/ui/pagination';
import { useRaceStore } from '../../../shared/model/race/race.store';
import { useCarsQuery } from '../cars-list/api/useCarsQuery';
import { useCarStartSound } from '../cars-list/hooks/useCarStartSound';
import { useRaceDrivingSound } from '../cars-list/hooks/useRaceDrivingSound';
import { useSaveRaceWinnerMutation } from '../../winners/api/useSaveRaceWinnerMutation';
import CarListItem, {
  type CarListItemHandle,
} from '../cars-list/ui/CarListItem';
import EmptyGarageState from '../empty-garage-state/ui/EmptyGarageState';
import { useGarageUiStore } from '../model/garage-ui.store';

const CARS_PER_PAGE = 7;
const CONTROL_BUTTON_CLASS =
  'rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-[0_0_15px_rgba(255,87,34,0.18)] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-[#374151] disabled:bg-[#1F293A] disabled:text-slate-500 disabled:shadow-none';

type CarListProps = {
  onGenerateCarsClick?: () => void;
  isGenerateCarsPending?: boolean;
};

type RaceWinner = {
  carId: number;
  carName: string;
  raceTimeMs: number;
};

type WinnerPopup = {
  carName: string;
  raceTimeSeconds: number;
};

function CarList({ onGenerateCarsClick, isGenerateCarsPending }: CarListProps) {
  const carRefs = useRef<(CarListItemHandle | null)[]>([]);
  const raceAllSoundRunIdRef = useRef(0);
  const isRaceAllActiveRef = useRef(false);
  const hasRaceAllFinishRef = useRef(false);
  const hasRaceAllDrivingSoundStartedRef = useRef(false);
  const [hasRaceStarted, setHasRaceStarted] = useState(false);
  const [carsNeedingReset, setCarsNeedingReset] = useState<Set<number>>(
    () => new Set(),
  );
  const [winnerPopup, setWinnerPopup] = useState<WinnerPopup | null>(null);
  const currentPage = useGarageUiStore((state) => state.currentPage);
  const setCurrentPage = useGarageUiStore((state) => state.setCurrentPage);
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
  const resetRaceState = useRaceStore((state) => state.resetRaceState);
  const canResetRace = carsNeedingReset.size > 0;
  const {
    playStartSoundForMinimumDuration,
    stopStartSound: stopRaceAllSound,
  } = useCarStartSound();
  const {
    playDrivingSound: playRaceAllDrivingSound,
    playStopSound: playRaceAllStopSound,
    stopAllRaceSounds,
  } = useRaceDrivingSound();
  const { mutate: saveRaceWinner } = useSaveRaceWinnerMutation();

  const playRaceAllSound = () => {
    const runId = raceAllSoundRunIdRef.current + 1;
    raceAllSoundRunIdRef.current = runId;

    void playStartSoundForMinimumDuration().finally(() => {
      if (raceAllSoundRunIdRef.current === runId) {
        stopRaceAllSound();
      }
    });
  };

  const stopRaceAllStartSound = () => {
    raceAllSoundRunIdRef.current += 1;
    stopRaceAllSound();
  };

  const startAll = () => {
    if (isRaceRunning) return;

    isRaceAllActiveRef.current = true;
    hasRaceAllFinishRef.current = false;
    hasRaceAllDrivingSoundStartedRef.current = false;
    playRaceAllSound();
    setHasRaceStarted(true);
    carRefs.current.forEach((carRef) => {
      carRef?.startRace({ playSound: false, playDrivingSound: false });
    });
  };

  const resetAll = () => {
    isRaceAllActiveRef.current = false;
    hasRaceAllFinishRef.current = false;
    hasRaceAllDrivingSoundStartedRef.current = false;
    setWinnerPopup(null);
    stopRaceAllStartSound();
    stopAllRaceSounds();
    carRefs.current.forEach((carRef) => {
      carRef?.resetRace();
    });
    setCarsNeedingReset(new Set());
    setHasRaceStarted(false);
    resetRaceState();
  };

  const { data, error, isError, isPending } = useCarsQuery({
    page: currentPage,
    limit: CARS_PER_PAGE,
  });

  const totalCars = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCars / CARS_PER_PAGE);

  useEffect(() => {
    if (isPending || isError || totalCars === 0) return;
    if (currentPage <= totalPages) return;

    setCurrentPage(totalPages);
  }, [currentPage, isError, isPending, setCurrentPage, totalCars, totalPages]);

  const handlePageChange = (page: number) => {
    if (isRaceRunning) return;

    isRaceAllActiveRef.current = false;
    hasRaceAllFinishRef.current = false;
    hasRaceAllDrivingSoundStartedRef.current = false;
    stopAllRaceSounds();
    carRefs.current = [];
    setCarsNeedingReset(new Set());
    setHasRaceStarted(false);
    setCurrentPage(page);
  };

  const handleResetStateChange = useCallback(
    (carId: number, needsReset: boolean) => {
      setCarsNeedingReset((current) => {
        const next = new Set(current);

        if (needsReset) {
          next.add(carId);
        } else {
          next.delete(carId);
        }

        return next;
      });
    },
    [],
  );

  const handleRaceFinish = useCallback((winner: RaceWinner) => {
    if (!isRaceAllActiveRef.current || hasRaceAllFinishRef.current) return;

    hasRaceAllFinishRef.current = true;
    isRaceAllActiveRef.current = false;
    hasRaceAllDrivingSoundStartedRef.current = false;
    playRaceAllStopSound();
    setHasRaceStarted(true);
    setWinnerPopup({
      carName: winner.carName,
      raceTimeSeconds: winner.raceTimeMs / 1000,
    });
    saveRaceWinner(
      {
        id: winner.carId,
        time: winner.raceTimeMs / 1000,
      },
      {
        onError: () => undefined,
      },
    );

    carRefs.current.forEach((carRef) => {
      if (!carRef || carRef.carId === winner.carId) return;

      carRef.stopRaceAtCurrentPosition();
    });
  }, [playRaceAllStopSound, saveRaceWinner]);

  const handleRaceDriveStart = useCallback(() => {
    if (
      !isRaceAllActiveRef.current ||
      hasRaceAllFinishRef.current ||
      hasRaceAllDrivingSoundStartedRef.current
    ) {
      return;
    }

    hasRaceAllDrivingSoundStartedRef.current = true;
    playRaceAllDrivingSound();
  }, [playRaceAllDrivingSound]);

  useEffect(() => {
    if (!winnerPopup) return;

    const timeoutId = window.setTimeout(() => {
      setWinnerPopup(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [winnerPopup]);

  useEffect(() => {
    if (isRaceRunning || !isRaceAllActiveRef.current) return;

    isRaceAllActiveRef.current = false;
    hasRaceAllDrivingSoundStartedRef.current = false;
    stopAllRaceSounds();
  }, [isRaceRunning, stopAllRaceSounds]);

  const shouldMoveToPreviousPageAfterDelete =
    currentPage > 1 && data?.cars.length === 1;

  return (
    <section className='mt-5 rounded-xl border border-[#1F293A] bg-[#151C2C] p-5 shadow-lg max-[1039px]:min-w-0 max-[1039px]:p-3'>
      <div className='mb-4 flex items-center justify-between gap-4 max-[1039px]:min-w-0 max-[1039px]:flex-wrap'>
        <h3 className='text-lg font-semibold tracking-wide text-slate-200'>
          Cars
        </h3>
        <span className='text-sm text-slate-400'>Total: {totalCars}</span>
      </div>

      {winnerPopup && (
        <div
          role='status'
          className='fixed left-1/2 top-1/2 z-50 w-56 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#FF5722]/60 bg-[#0A0E17] p-3 text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.35)]'
        >
          <div className='flex items-start justify-between gap-3'>
            <div>
              <p className='text-sm font-bold text-[#FFB199]'>🏆 Winner!</p>
              <p className='mt-1 truncate text-sm text-slate-100'>
                {winnerPopup.carName} —{' '}
                {winnerPopup.raceTimeSeconds.toFixed(2)}s
              </p>
            </div>
            <button
              type='button'
              aria-label='Close winner popup'
              onClick={() => setWinnerPopup(null)}
              className='grid h-6 w-6 place-items-center rounded-md border border-[#1F293A] text-sm leading-none text-slate-400 transition-colors hover:border-[#FF5722]/70 hover:text-white'
            >
              x
            </button>
          </div>
        </div>
      )}

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
              disabled={!canResetRace}
              className={`${CONTROL_BUTTON_CLASS} border border-[#FF5722]/70 bg-[#0A0E17] text-[#FFB199] hover:border-[#FF5722] hover:text-white`}
            >
              Reset
            </button>
          </div>
          <ul className='space-y-1 max-[1039px]:min-w-0'>
            {data.cars.map((car, index) => (
              <CarListItem
                key={car.id}
                car={car}
                onDeleted={
                  shouldMoveToPreviousPageAfterDelete
                    ? () => handlePageChange(currentPage - 1)
                    : undefined
                }
                onResetStateChange={handleResetStateChange}
                onRaceFinish={handleRaceFinish}
                onRaceDriveStart={handleRaceDriveStart}
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
