import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import type { Car } from '../../api/garage-crud';
import DeleteCarButton from '../../delete-car/ui/DeleteCarButton';
import SelectCarButton from '../../select-car/ui/SelectCarButton';
import RaceCar from '../../../../shared/assets/icons/car-svgrepo.svg?react';

const RACE_DURATION_MS = 3000;

export type CarListItemHandle = {
  startRace: () => void;
  stopRace: () => void;
  resetRace: () => void;
};

type CarListItemProps = {
  car: Car;
};

const CarListItem = forwardRef<CarListItemHandle, CarListItemProps>(
  ({ car }, ref) => {
    const [hasFinished, setHasFinished] = useState(false);
    const [isRacing, setIsRacing] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);

    const getCarElement = () => {
      const carElement = trackRef.current?.querySelector('svg');

      return carElement instanceof SVGElement ? carElement : null;
    };

    const resetCarPosition = () => {
      const carElement = getCarElement();

      if (!carElement) return;

      carElement.getAnimations().forEach((animation) => {
        animation.cancel();
      });
      carElement.style.transform = 'translateX(0px)';
    };

    useImperativeHandle(ref, () => ({
      startRace,
      stopRace,
      resetRace,
    }));

    const startRace = () => {
      if (!trackRef.current || isRacing || hasFinished) return;

      const trackWidth = trackRef.current.offsetWidth;
      const carWidth = 56;
      const distance = Math.max(trackWidth - carWidth - 100, 0);

      animationRef.current?.cancel();
      animationRef.current = null;

      const carEl = getCarElement();
      if (!carEl) return;

      carEl.style.transform = 'translateX(0px)';
      setIsRacing(true);
      setHasFinished(false);

      const animation = carEl.animate(
        [
          { transform: 'translateX(0px)' },
          { transform: `translateX(${distance}px)` },
        ],
        { duration: RACE_DURATION_MS, fill: 'forwards', easing: 'linear' },
      );

      animationRef.current = animation;

      animation.finished
        .then(() => {
          if (animationRef.current !== animation) return;

          carEl.style.transform = `translateX(${distance}px)`;
          animationRef.current = null;
          setIsRacing(false);
          setHasFinished(true);
        })
        .catch(() => {
          if (animationRef.current !== animation) return;

          animationRef.current = null;
          setIsRacing(false);
        });
    };

    const stopRace = () => {
      animationRef.current?.cancel();
      animationRef.current = null;

      resetCarPosition();

      setIsRacing(false);
      setHasFinished(false);
    };

    const resetRace = () => {
      animationRef.current?.cancel();
      animationRef.current = null;

      resetCarPosition();

      setIsRacing(false);
      setHasFinished(false);
    };

    useEffect(() => {
      return () => {
        animationRef.current?.cancel();
      };
    }, []);

    return (
      <li className='rounded-lg border border-[#1F293A] bg-[#0A0E17] px-2 py-2 text-sm text-slate-200'>
        <div
          ref={trackRef}
          className='relative flex justify-between h-20 px-3 bg-[#111827] rounded-md overflow-hidden border border-[#1F293A]'
        >
          <span className='text-xs text-[#7e7d7d] font-medium truncate flex items-center ml-10 border-l-2 border-dashed pl-6 border-white'>
            {car.name}
          </span>

          <RaceCar
            className='absolute bottom-2 left-0 h-8 w-14'
            style={{ fill: car.color }}
          />
          <div className='absolute right-37 top-0 h-full border-l-2 border-dashed border-[#FF5722]/70' />

          <div className='z-10 my-2 grid grid-cols-2 gap-1 self-center'>
            <button
              type='button'
              onClick={startRace}
              disabled={isRacing || hasFinished}
              className='h-7 min-w-10 px-2 text-xs border border-[#FF5722]/70 rounded-md disabled:opacity-50 transition-colors'
            >
              Start
            </button>
            <button
              type='button'
              onClick={stopRace}
              disabled={!isRacing}
              className='h-7 min-w-10 px-2 text-xs border border-[#FF5722]/70 rounded-md disabled:opacity-50 transition-colors'
            >
              Stop
            </button>
            <SelectCarButton car={car} />
            <DeleteCarButton car={car} />
          </div>
        </div>
      </li>
    );
  },
);

CarListItem.displayName = 'CarListItem';

export default CarListItem;
