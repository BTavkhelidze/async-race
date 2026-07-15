import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { useRaceStore } from '../../../../shared/model/race/race.store';
import { driveCar, startEngine } from '../api/engine.api';
import { calculateRaceDuration } from '../lib/calculateRaceDuration';
import { calculateTravelDistance } from '../lib/calculateTravelDistance';

type StartCarOptions = {
  playSound?: boolean;
};

type UseCarEngineStartParams = {
  carId: number;
  carRef: RefObject<SVGSVGElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  onStartSound: () => void;
  onStopStartSound: () => void;
  onWaitForMinimumStartDuration: () => Promise<void>;
};

export function useCarEngineStart({
  carId,
  carRef,
  trackRef,
  onStartSound,
  onStopStartSound,
  onWaitForMinimumStartDuration,
}: UseCarEngineStartParams) {
  const [isStarting, setIsStarting] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [hasDriveFailed, setHasDriveFailed] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const animationRef = useRef<Animation | null>(null);
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
    carElement.style.transform = 'translateX(0px)';
  }, [carRef]);

  const startCar = useCallback(
    async ({ playSound = true }: StartCarOptions = {}) => {
      const carElement = carRef.current;
      const trackElement = trackRef.current;

      if (
        isStarting ||
        isRacing ||
        hasFinished ||
        hasDriveFailed ||
        engineError ||
        hasRegisteredRaceRef.current ||
        !carElement ||
        !trackElement
      ) {
        return;
      }

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

        await minimumDelayPromise;
        onStopStartSound();
        if (!isMountedRef.current) return;

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
        );

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
          if (animationRef.current !== animation) return;

          carElement.style.transform = `translateX(${travelDistance}px)`;
          animationRef.current = null;
          completeRegisteredRace();
          setIsRacing(false);
          setHasFinished(true);
        };

        try {
          await driveCar(carId);
        } catch (error) {
          if (animationRef.current === animation) {
            animation.pause();
          }

          completeRegisteredRace();
          setIsRacing(false);
          setHasDriveFailed(true);
          setEngineError(
            error instanceof Error
              ? error.message
              : 'Engine stopped while driving',
          );
        }
      } catch (error) {
        onStopStartSound();
        if (!isMountedRef.current) return;

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
      hasDriveFailed,
      hasFinished,
      engineError,
      isRacing,
      isStarting,
      onStartSound,
      onStopStartSound,
      onWaitForMinimumStartDuration,
      registerRaceStart,
      trackRef,
    ],
  );

  const stopCar = useCallback(() => {
    clearAnimation();
    resetCarPosition();
    completeRegisteredRace();
    setIsStarting(false);
    setIsRacing(false);
    setHasFinished(false);
    setHasDriveFailed(false);
    setEngineError(null);
    onStopStartSound();
  }, [
    clearAnimation,
    completeRegisteredRace,
    onStopStartSound,
    resetCarPosition,
  ]);

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
    hasDriveFailed,
    engineError,
    startCar,
    stopCar,
    resetCar,
    animationRef,
  };
}
