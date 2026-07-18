import RaceCar from '../../../shared/assets/icons/car-svgrepo.svg?react';
import type { WinnerWithCar } from '../types/winner.types';

type WinnersTableRowProps = {
  winner: WinnerWithCar;
  position: number;
};

export function WinnersTableRow({ winner, position }: WinnersTableRowProps) {
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
    </tr>
  );
}
