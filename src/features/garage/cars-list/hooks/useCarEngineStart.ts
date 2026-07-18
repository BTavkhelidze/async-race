import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { useRaceStore } from '../../../../shared/model/race/race.store';
import { driveCar, isEngineApiError, startEngine } from '../api/engine.api';
import { calculateRaceDuration } from '../lib/calculateRaceDuration';
import { calculateTravelDistance } from '../lib/calculateTravelDistance';

type StartCarOptions = {
  playSound?: boolean;
};

type UseCarEngineStartParams = {
  carId: number;
  carRef: RefObject<SVGSVGElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  finishLineOffset: number;
  onRaceFinish?: (carId: number, raceTimeMs: number) => void;
  onStartSound: () => void;
  onStopStartSound: () => void;
  onWaitForMinimumStartDuration: () => Promise<void>;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error ? error.message : fallback;
};

export function useCarEngineStart({
  carId,
  carRef,
  trackRef,
  finishLineOffset,
  onRaceFinish,
  onStartSound,
  onStopStartSound,
  onWaitForMinimumStartDuration,
}: UseCarEngineStartParams) {
  const [isStarting, setIsStarting] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [hasRaceStopped, setHasRaceStopped] = useState(false);
  const [hasDriveFailed, setHasDriveFailed] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const activeRunIdRef = useRef(0);
  const hasRegisteredRaceRef = useRef(false);
  const isMountedRef = useRef(true);
  const registerRaceStart = useRaceStore((state) => state.registerRaceStart);
  const registerRaceEnd = useRaceStore((state) => state.registerRaceEnd);

  const completeRegisteredRace = useCallback(() => {
    if (!hasRegisteredRaceRef.current) return;

    hasRegisteredRaceRef.current = false;
    registerRaceEnd();
  }, [registerRaceEnd]);

  const clearAnimation = useCallback(() => {
    animationRef.current?.cancel();
    animationRef.current = null;
  }, []);

  const resetCarPosition = useCallback(() => {
    const carElement = carRef.current;

    if (!carElement) return;

    carElement.getAnimations().forEach((animation) => {
      animation.cancel();
    });
    carElement.style.removeProperty('transform');
    carElement.style.transform = 'translateX(0px)';
  }, [carRef]);

  const freezeCarPosition = useCallback(() => {
    const carElement = carRef.current;

    if (!carElement) return;

    const currentTransform = window.getComputedStyle(carElement).transform;

    carElement.getAnimations().forEach((animation) => {
      animation.cancel();
    });
    carElement.style.transform =
      currentTransform === 'none' ? 'translateX(0px)' : currentTransform;
    animationRef.current = null;
  }, [carRef]);

  const isCurrentRun = useCallback((runId: number) => {
    return isMountedRef.current && activeRunIdRef.current === runId;
  }, []);

  const startCar = useCallback(
    async ({ playSound = true }: StartCarOptions = {}) => {
      const carElement = carRef.current;
      const trackElement = trackRef.current;

      if (
        isStarting ||
        isRacing ||
        hasFinished ||
        hasRaceStopped ||
        hasDriveFailed ||
        engineError ||
        hasRegisteredRaceRef.current ||
        !carElement ||
        !trackElement
      ) {
        return;
      }

      const runId = activeRunIdRef.current + 1;
      activeRunIdRef.current = runId;

      setIsStarting(true);
      setEngineError(null);
      if (playSound) {
        onStartSound();
      }
      hasRegisteredRaceRef.current = true;
      registerRaceStart();

      try {
        const engineRequestPromise = startEngine(carId);
        const minimumDelayPromise = onWaitForMinimumStartDuration();
        const engine = await engineRequestPromise;

        if (!isCurrentRun(runId)) return;

        await minimumDelayPromise;
        onStopStartSound();
        if (!isCurrentRun(runId)) return;

        setIsStarting(false);
        setEngineError(null);

        const duration = calculateRaceDuration(
          engine.distance,
          engine.velocity,
        );

        if (duration <= 0) {
          throw new Error('Invalid engine response');
        }

        const travelDistance = calculateTravelDistance(
          trackElement.offsetWidth,
          carElement.getBoundingClientRect().width,
          finishLineOffset,
        );

        const drivePromise = driveCar(carId)
          .then(() => null)
          .catch((error: unknown) => error);

        clearAnimation();
        carElement.style.transform = 'translateX(0px)';

        const animation = carElement.animate(
          [
            { transform: 'translateX(0px)' },
            { transform: `translateX(${travelDistance}px)` },
          ],
          { duration, fill: 'forwards', easing: 'linear' },
        );

        animationRef.current = animation;
        setIsRacing(true);

        animation.onfinish = () => {
          if (!isCurrentRun(runId) || animationRef.current !== animation) {
            return;
          }

          carElement.style.transform = `translateX(${travelDistance}px)`;
          animationRef.current = null;
          completeRegisteredRace();
          setIsRacing(false);
          setHasFinished(true);
          onRaceFinish?.(carId, duration);
        };

        const driveError = await drivePromise;

        if (driveError === null) {
          return;
        }

        if (!isCurrentRun(runId) || animationRef.current !== animation) {
          return;
        }

        freezeCarPosition();
        completeRegisteredRace();
        setIsRacing(false);
        setHasDriveFailed(true);
        setEngineError(
          isEngineApiError(driveError) && driveError.status === 500
            ? 'Engine stopped while driving'
            : getErrorMessage(driveError, 'Engine stopped while driving'),
        );
      } catch (error) {
        onStopStartSound();
        if (!isCurrentRun(runId)) return;

        completeRegisteredRace();
        setIsStarting(false);
        setIsRacing(false);
        setEngineError(
          error instanceof Error ? error.message : 'Engine failed to start',
        );
      } finally {
        onStopStartSound();
      }
    },
    [
      carId,
      carRef,
      clearAnimation,
      completeRegisteredRace,
      freezeCarPosition,
      hasDriveFailed,
      hasFinished,
      hasRaceStopped,
      engineError,
      finishLineOffset,
      isCurrentRun,
      isRacing,
      isStarting,
      onStartSound,
      onRaceFinish,
      onStopStartSound,
      onWaitForMinimumStartDuration,
      registerRaceStart,
      trackRef,
    ],
  );

  const stopCar = useCallback(() => {
    activeRunIdRef.current += 1;
    clearAnimation();
    resetCarPosition();
    completeRegisteredRace();
    setIsStarting(false);
    setIsRacing(false);
    setHasFinished(false);
    setHasRaceStopped(false);
    setHasDriveFailed(false);
    setEngineError(null);
    onStopStartSound();
  }, [
    clearAnimation,
    completeRegisteredRace,
    onStopStartSound,
    resetCarPosition,
  ]);

  const stopCarAtCurrentPosition = useCallback(() => {
    activeRunIdRef.current += 1;
    freezeCarPosition();
    completeRegisteredRace();
    setIsStarting(false);
    setIsRacing(false);
    setHasRaceStopped(true);
    onStopStartSound();
  }, [completeRegisteredRace, freezeCarPosition, onStopStartSound]);

  const resetCar = useCallback(() => {
    stopCar();
  }, [stopCar]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearAnimation();
      completeRegisteredRace();
      onStopStartSound();
    };
  }, [clearAnimation, completeRegisteredRace, onStopStartSound]);

  return {
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
    animationRef,
  };
}
