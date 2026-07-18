import { cn } from '../../../shared/lib/utils';
import type {
  SortOrder,
  WinnerSortField,
  WinnerWithCar,
} from '../types/winner.types';
import { WinnersTableRow } from './WinnersTableRow';

type WinnersTableProps = {
  winners: WinnerWithCar[];
  startIndex: number;
  sortField: WinnerSortField;
  sortOrder: SortOrder;
  onSortChange: (field: WinnerSortField) => void;
  onWinnerDeleted: () => void;
};

type SortableHeaderProps = {
  field: WinnerSortField;
  label: string;
  minWidthClass: string;
  sortField: WinnerSortField;
  sortOrder: SortOrder;
  onSortChange: (field: WinnerSortField) => void;
};

const getAriaSort = (
  field: WinnerSortField,
  activeField: WinnerSortField,
  sortOrder: SortOrder,
): 'ascending' | 'descending' | undefined => {
  if (field !== activeField) return undefined;

  return sortOrder === 'ASC' ? 'ascending' : 'descending';
};

const getSortIndicator = (
  field: WinnerSortField,
  activeField: WinnerSortField,
  sortOrder: SortOrder,
): string => {
  if (field !== activeField) return 'sort';

  return sortOrder === 'ASC' ? '\u2191' : '\u2193';
};

const getSortButtonLabel = (
  label: string,
  field: WinnerSortField,
  activeField: WinnerSortField,
  sortOrder: SortOrder,
): string => {
  if (field !== activeField) return `Sort by ${label} descending`;

  return `Sort by ${label} ${sortOrder === 'DESC' ? 'ascending' : 'descending'}`;
};

function SortableHeader({
  field,
  label,
  minWidthClass,
  sortField,
  sortOrder,
  onSortChange,
}: SortableHeaderProps) {
  const isActive = field === sortField;

  return (
    <th
      className='px-4 py-3 font-semibold'
      aria-sort={getAriaSort(field, sortField, sortOrder)}
    >
      <button
        type='button'
        onClick={() => onSortChange(field)}
        aria-label={getSortButtonLabel(label, field, sortField, sortOrder)}
        className={cn(
          'inline-flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-xs font-semibold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5722]/40',
          minWidthClass,
          isActive
            ? 'border-[#FF5722]/70 bg-[#FF5722]/15 text-[#FFB199]'
            : 'border-[#374151] bg-[#0A0E17] text-slate-300 hover:border-[#FF5722]/70 hover:text-white',
        )}
      >
        <span>{label}</span>
        <span
          aria-hidden='true'
          className={cn(
            'text-[10px] normal-case',
            isActive ? 'text-[#FFB199]' : 'text-slate-500',
          )}
        >
          {getSortIndicator(field, sortField, sortOrder)}
        </span>
      </button>
    </th>
  );
}

export function WinnersTable({
  winners,
  startIndex,
  sortField,
  sortOrder,
  onSortChange,
  onWinnerDeleted,
}: WinnersTableProps) {
  return (
    <div className='overflow-hidden rounded-lg border border-[#1F293A] bg-[#0A0E17]'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[560px] border-collapse text-left'>
          <thead className='bg-[#111827] text-xs uppercase text-slate-400'>
            <tr>
              <th className='px-4 py-3 font-semibold'>Number</th>
              <th className='px-4 py-3 font-semibold'>Car</th>
              <th className='px-4 py-3 font-semibold'>Name</th>
              <SortableHeader
                field='wins'
                label='Wins'
                minWidthClass='min-w-20'
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
              <SortableHeader
                field='time'
                label='Best time'
                minWidthClass='min-w-28'
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
              <th className='px-4 py-3 font-semibold'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <WinnersTableRow
                key={winner.id}
                winner={winner}
                position={startIndex + index + 1}
                onDeleted={onWinnerDeleted}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
