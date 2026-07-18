import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
} from 'react';
import type { Car } from '../../api/garage-crud';
import { useCarEngineStart } from '../hooks/useCarEngineStart';
import { useCarStartSound } from '../hooks/useCarStartSound';
import { useRaceDrivingSound } from '../hooks/useRaceDrivingSound';
import DeleteCarButton from '../../delete-car/ui/DeleteCarButton';
import SelectCarButton from '../../select-car/ui/SelectCarButton';
import RaceCar from '../../../../shared/assets/icons/car-svgrepo.svg?react';
import { cn } from '../../../../shared/lib/utils';

type StartRaceOptions = {
  playSound?: boolean;
  playDrivingSound?: boolean;
};

export type CarListItemHandle = {
  carId: number;
  startRace: (options?: StartRaceOptions) => void;
  stopRace: () => void;
  stopRaceAtCurrentPosition: () => void;
  resetRace: () => void;
  needsReset: () => boolean;
};

type CarListItemProps = {
  car: Car;
  onDeleted?: () => void;
  onResetStateChange?: (carId: number, needsReset: boolean) => void;
  onRaceFinish?: (winner: {
    carId: number;
    carName: string;
    raceTimeMs: number;
  }) => void;
  onRaceDriveStart?: () => void;
};

const FINISH_LINE_OFFSET_PX = 150;

const CarListItem = forwardRef<CarListItemHandle, CarListItemProps>(
  (
    { car, onDeleted, onResetStateChange, onRaceFinish, onRaceDriveStart },
    ref,
  ) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const carRef = useRef<SVGSVGElement | null>(null);
    const { playStartSound, stopStartSound, waitForMinimumStartDuration } =
      useCarStartSound();
    const { playDrivingSound, stopDrivingSound } = useRaceDrivingSound();

    const {
      isStarting,
      isRacing,
      hasFinished,
      hasRaceStopped,
      hasDriveFailed,
      engineError,
      startCar,
      stopCar,
      stopCarAtCurrentPosition,
      resetCar,
    } = useCarEngineStart({
      carId: car.id,
      carRef,
      trackRef,
      finishLineOffset: FINISH_LINE_OFFSET_PX,
      onRaceFinish: (carId, raceTimeMs) => {
        onRaceFinish?.({
          carId,
          carName: car.name,
          raceTimeMs,
        });
      },
      onDriveStart: onRaceDriveStart,
      onStartSound: playStartSound,
      onStopStartSound: stopStartSound,
      onStartDrivingSound: playDrivingSound,
      onStopDrivingSound: stopDrivingSound,
      onWaitForMinimumStartDuration: waitForMinimumStartDuration,
    });
    const statusText = isStarting
      ? 'Starting engine...'
      : engineError
        ? 'Engine error'
        : isRacing
          ? 'Racing'
          : hasFinished
            ? 'Finished'
            : null;
    const requiresReset =
      isStarting ||
      isRacing ||
      hasFinished ||
      hasRaceStopped ||
      hasDriveFailed ||
      Boolean(engineError);

    const startRace = useCallback(
      (options?: StartRaceOptions) => {
        void startCar({
          playSound: options?.playSound ?? false,
          playDrivingSound: options?.playDrivingSound ?? false,
        });
      },
      [startCar],
    );

    const stopRace = useCallback(() => {
      stopCar();
    }, [stopCar]);

    const stopRaceAtCurrentPosition = useCallback(() => {
      stopCarAtCurrentPosition();
    }, [stopCarAtCurrentPosition]);

    const resetRace = useCallback(() => {
      resetCar();
    }, [resetCar]);

    const needsReset = useCallback(() => requiresReset, [requiresReset]);

    useImperativeHandle(ref, () => ({
      carId: car.id,
      startRace,
      stopRace,
      stopRaceAtCurrentPosition,
      resetRace,
      needsReset,
    }));

    useEffect(() => {
      onResetStateChange?.(car.id, requiresReset);
    }, [car.id, onResetStateChange, requiresReset]);

    return (
      <li className='rounded-lg border border-[#1F293A] bg-[#0A0E17] px-2 py-2 text-sm text-slate-200'>
        <div
          ref={trackRef}
          aria-busy={isStarting}
          className='relative flex justify-between h-20 px-3 bg-[#111827] rounded-md overflow-hidden border border-[#1F293A]'
        >
          <div className='ml-10 flex min-w-0 flex-col justify-center border-l-2 border-dashed border-white pl-6'>
            <span
              className={cn(
                'truncate text-xs font-medium text-[#7e7d7d]',
                engineError && 'text-slate-500 opacity-60',
              )}
            >
              {car.name}
            </span>
            {statusText && (
              <span
                className={cn(
                  'mt-1 text-[11px] text-slate-400',
                  isStarting && 'animate-pulse text-[#FFB199]',
                  engineError && 'text-red-400',
                )}
              >
                {statusText}
              </span>
            )}
          </div>

          <RaceCar
            ref={carRef}
            className={cn(
              'absolute bottom-2 left-0 h-8 w-14',
              isStarting && 'animate-pulse',
              engineError && 'opacity-60',
            )}
            style={{ fill: car.color }}
          />

          <div
            className='absolute top-0 h-full  '
            style={{ right: FINISH_LINE_OFFSET_PX }}
          />
          <div className='absolute top-0 h-full right-48 border-l-2 border-dashed border-[#FF5722]/70' />
          <div className='z-10 my-2 grid grid-cols-2 gap-1 self-center'>
            <button
              type='button'
              onClick={() => void startCar()}
              disabled={
                isStarting ||
                isRacing ||
                hasFinished ||
                hasRaceStopped ||
                hasDriveFailed ||
                Boolean(engineError)
              }
              aria-busy={isStarting}
              className='h-7 min-w-10 px-2 text-xs border border-[#FF5722]/70 rounded-md disabled:opacity-50 transition-colors'
            >
              {isStarting ? 'Starting...' : 'Start'}
            </button>
            <button
              type='button'
              onClick={stopRace}
              disabled={
                !isStarting &&
                !isRacing &&
                !hasDriveFailed &&
                !hasFinished &&
                !engineError
              }
              className='h-7 min-w-10 px-2 text-xs border border-[#FF5722]/70 rounded-md disabled:opacity-50 transition-colors'
            >
              Stop
            </button>
            <SelectCarButton car={car} />
            <DeleteCarButton car={car} onDeleted={onDeleted} />
          </div>
          {engineError && (
            <p
              role='alert'
              className='absolute bottom-1 left-3 text-xs text-red-400'
            >
              {engineError}
            </p>
          )}
        </div>
      </li>
    );
  },
);

CarListItem.displayName = 'CarListItem';

export default CarListItem;
