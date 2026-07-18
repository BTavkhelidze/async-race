import { useEffect, useState } from 'react';
import { Pagination } from '../../../shared/ui/pagination';
import { useWinners } from '../model/useWinners';
import { WINNERS_PER_PAGE } from '../model/winners.constants';
import { WinnersTable } from '../components/WinnersTable';

export function WinnersPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isError, isFetching, isPending } = useWinners(
    currentPage,
    WINNERS_PER_PAGE,
  );
  const winners = data?.winners ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(Math.ceil(totalCount / WINNERS_PER_PAGE), 1);
  const shouldShowContent = !isPending && !isError;
  const firstWinnerPosition = (currentPage - 1) * WINNERS_PER_PAGE;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
        <WinnersTable winners={winners} startIndex={firstWinnerPosition} />
      )}

      {shouldShowContent && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          disabled={isFetching}
        />
      )}
    </section>
  );
}
