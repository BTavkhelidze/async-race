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

const CarListItem = forwardRef<CarListItemHandle, CarListItemProps>(
  (
    { car, onDeleted, onResetStateChange, onRaceFinish, onRaceDriveStart },
    ref,
  ) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const finishLineRef = useRef<HTMLDivElement>(null);
    const carRef = useRef<SVGSVGElement | null>(null);
    const { playStartSound, stopStartSound, waitForMinimumStartDuration } =
      useCarStartSound();
    const {
      playDrivingSound,
      stopDrivingSound,
      playStopSound,
      stopAllRaceSounds,
    } = useRaceDrivingSound();

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
      finishLineRef,
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
      onPlayStopSound: playStopSound,
      onStopAllRaceSounds: stopAllRaceSounds,
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
      stopCar(true);
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
      <li className='rounded-lg border border-[#1F293A] bg-[#0A0E17] px-2 py-2 text-sm text-slate-200 max-[1039px]:min-w-0'>
        <div
          ref={trackRef}
          aria-busy={isStarting}
          className='relative flex h-20 justify-between overflow-hidden rounded-md border border-[#1F293A] bg-[#111827] px-3 max-[1039px]:h-auto max-[1039px]:min-h-32 max-[1039px]:min-w-0 max-[1039px]:flex-col max-[1039px]:items-stretch max-[1039px]:justify-start max-[1039px]:gap-2 max-[1039px]:px-2 max-[1039px]:pb-12'
        >
          <div className='ml-10 flex min-w-0 flex-col justify-center border-l-2 border-dashed border-white pl-6 max-[1039px]:ml-0 max-[1039px]:pl-3'>
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
                  'mt-1 text-[11px] text-slate-400 max-[1039px]:truncate',
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
            ref={finishLineRef}
            className='absolute top-0 right-48 h-full border-l-2 border-dashed border-[#FF5722]/70 max-[1039px]:right-3'
          />
          <div className='z-10 my-2 grid grid-cols-2 gap-1 self-center max-[1039px]:my-0 max-[1039px]:grid-cols-4 max-[1039px]:self-start max-[560px]:grid-cols-2'>
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
