import RaceCar from '../../../../shared/assets/icons/car-svgrepo.svg?react';

type EmptyGarageStateProps = {
  onGenerateCarsClick?: () => void;
  isGenerateCarsPending?: boolean;
};

function EmptyGarageState({
  onGenerateCarsClick,
  isGenerateCarsPending = false,
}: EmptyGarageStateProps) {
  return (
    <div className='flex flex-col items-center justify-center p-6 text-center text-white'>
      <RaceCar className='h-12 w-14 text-white' fill='currentColor' />

      <h4 className='mt-4 text-lg font-semibold'>No cars yet</h4>
      <p className='mt-1 text-sm text-slate-300'>
        You haven&apos;t added any cars to your garage.
      </p>

      <div className='mt-6 flex flex-col gap-3'>
        {onGenerateCarsClick && (
          <button
            type='button'
            onClick={onGenerateCarsClick}
            disabled={isGenerateCarsPending}
            className='text-sm font-medium text-slate-300 underline hover:text-white disabled:opacity-60'
          >
            {isGenerateCarsPending ? 'Generating...' : 'Generate Cars'}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyGarageState;
