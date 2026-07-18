import RaceCar from '../../../shared/assets/icons/car-svgrepo.svg?react';
import { useDeleteWinnerMutation } from '../api/useDeleteWinnerMutation';
import type { WinnerWithCar } from '../types/winner.types';

type WinnersTableRowProps = {
  winner: WinnerWithCar;
  position: number;
  onDeleted: () => void;
};

export function WinnersTableRow({
  winner,
  position,
  onDeleted,
}: WinnersTableRowProps) {
  const deleteWinnerMutation = useDeleteWinnerMutation();

  const handleDelete = () => {
    if (deleteWinnerMutation.isPending) return;

    deleteWinnerMutation.mutate(winner.id, {
      onSuccess: onDeleted,
    });
  };

  return (
    <tr className='border-b border-[#1F293A] last:border-b-0'>
      <td className='px-4 py-3 text-sm text-slate-400'>{position}</td>
      <td className='px-4 py-3'>
        <RaceCar
          aria-label={`${winner.car.name} car`}
          className='h-7 w-12'
          style={{ fill: winner.car.color }}
        />
      </td>
      <td className='max-w-52 truncate px-4 py-3 text-sm font-medium text-slate-100'>
        {winner.car.name}
      </td>
      <td className='px-4 py-3 text-sm text-slate-300'>{winner.wins}</td>
      <td className='px-4 py-3 text-sm text-slate-300'>
        {winner.time.toFixed(2)}s
      </td>
      <td className='px-4 py-3'>
        <div className='flex flex-col items-start gap-1'>
          <button
            type='button'
            onClick={handleDelete}
            disabled={deleteWinnerMutation.isPending}
            className='h-7 min-w-16 rounded-md border border-red-400/70 px-2 text-xs font-semibold text-red-200 transition-colors hover:border-red-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
          >
            {deleteWinnerMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
          {deleteWinnerMutation.isError && (
            <span role='alert' className='text-xs text-red-400'>
              {deleteWinnerMutation.error.message}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}
