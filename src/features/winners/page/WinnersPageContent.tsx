import { useEffect } from 'react';
import { Pagination } from '../../../shared/ui/pagination';
import { useWinners } from '../model/useWinners';
import { WINNERS_PER_PAGE } from '../model/winners.constants';
import { WinnersTable } from '../components/WinnersTable';
import type { WinnerSortField } from '../types/winner.types';
import { useWinnersUiStore } from '../model/winners-ui.store';

export function WinnersPageContent() {
  const currentPage = useWinnersUiStore((state) => state.currentPage);
  const setCurrentPage = useWinnersUiStore((state) => state.setCurrentPage);
  const sortState = useWinnersUiStore((state) => state.sortState);
  const setSortState = useWinnersUiStore((state) => state.setSortState);
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
  }, [currentPage, setCurrentPage, totalPages]);

  const handleSortChange = (field: WinnerSortField) => {
    setCurrentPage(1);
    setSortState(
      sortState.sortField !== field
        ? {
            sortField: field,
            sortOrder: 'DESC',
          }
        : {
            sortField: field,
            sortOrder: sortState.sortOrder === 'DESC' ? 'ASC' : 'DESC',
          },
    );
  };

  const handleWinnerDeleted = () => {
    if (winners.length !== 1 || currentPage === 1) return;

    setCurrentPage(Math.max(currentPage - 1, 1));
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
