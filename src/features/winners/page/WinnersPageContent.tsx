import { useEffect, useState } from 'react';
import { Pagination } from '../../../shared/ui/pagination';
import { useWinners } from '../model/useWinners';
import {
  DEFAULT_WINNER_SORT_FIELD,
  DEFAULT_WINNER_SORT_ORDER,
  WINNERS_PER_PAGE,
} from '../model/winners.constants';
import { WinnersTable } from '../components/WinnersTable';
import type { WinnerSortField, WinnerSortState } from '../types/winner.types';

export function WinnersPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortState, setSortState] = useState<WinnerSortState>({
    sortField: DEFAULT_WINNER_SORT_FIELD,
    sortOrder: DEFAULT_WINNER_SORT_ORDER,
  });
  const { data, error, isError, isFetching, isPending } = useWinners(
    currentPage,
    WINNERS_PER_PAGE,
    sortState,
  );
  const winners = data?.winners ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(Math.ceil(totalCount / WINNERS_PER_PAGE), 1);
  const shouldShowContent = !isPending && !isError;
  const firstWinnerPosition = (currentPage - 1) * WINNERS_PER_PAGE;

  useEffect(() => {
    if (currentPage <= totalPages) return;

    const timeoutId = window.setTimeout(() => {
      setCurrentPage(totalPages);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentPage, totalPages]);

  const handleSortChange = (field: WinnerSortField) => {
    setCurrentPage(1);
    setSortState((current) => {
      if (current.sortField !== field) {
        return {
          sortField: field,
          sortOrder: 'DESC',
        };
      }

      return {
        sortField: field,
        sortOrder: current.sortOrder === 'DESC' ? 'ASC' : 'DESC',
      };
    });
  };

  const handleWinnerDeleted = () => {
    if (winners.length !== 1 || currentPage === 1) return;

    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <section className='rounded-xl border border-[#1F293A] bg-[#151C2C] p-5 shadow-lg'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h1 className='text-xl font-semibold tracking-wide text-slate-100'>
          Winners ({totalCount})
        </h1>
      </div>

      {isPending && (
        <p className='text-sm text-slate-400'>Loading winners...</p>
      )}

      {isError && (
        <p role='alert' className='text-sm text-red-400'>
          {error.message}
        </p>
      )}

      {shouldShowContent && winners.length === 0 && (
        <p className='text-sm text-slate-400'>
          No winners yet. Start a race to create the first winner.
        </p>
      )}

      {shouldShowContent && winners.length > 0 && (
        <WinnersTable
          winners={winners}
          startIndex={firstWinnerPosition}
          sortField={sortState.sortField}
          sortOrder={sortState.sortOrder}
          onSortChange={handleSortChange}
          onWinnerDeleted={handleWinnerDeleted}
        />
      )}

      {shouldShowContent && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          disabled={isFetching}
          alwaysVisible
        />
      )}
    </section>
  );
}
