import type { WinnerWithCar } from '../types/winner.types';
import { WinnersTableRow } from './WinnersTableRow';

type WinnersTableProps = {
  winners: WinnerWithCar[];
  startIndex: number;
};

export function WinnersTable({ winners, startIndex }: WinnersTableProps) {
  return (
    <div className='overflow-hidden rounded-lg border border-[#1F293A] bg-[#0A0E17]'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[560px] border-collapse text-left'>
          <thead className='bg-[#111827] text-xs uppercase text-slate-400'>
            <tr>
              <th className='px-4 py-3 font-semibold'>Number</th>
              <th className='px-4 py-3 font-semibold'>Car</th>
              <th className='px-4 py-3 font-semibold'>Name</th>
              <th className='px-4 py-3 font-semibold'>Wins</th>
              <th className='px-4 py-3 font-semibold'>Best time</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <WinnersTableRow
                key={winner.id}
                winner={winner}
                position={startIndex + index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
