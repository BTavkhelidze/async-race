import { cn } from '../../lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  alwaysVisible?: boolean;
};

const PAGINATION_BUTTON_CLASS =
  'min-h-9 min-w-9 rounded-md border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  alwaysVisible = false,
}: PaginationProps) {
  if (!alwaysVisible && totalPages <= 1) return null;

  const pageNumbers = Array.from(
    { length: Math.max(totalPages, 1) },
    (_, index) => index + 1,
  );
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const handlePageClick = (page: number) => {
    if (disabled) return;

    onPageChange(page);
  };

  return (
    <nav className='mt-4' aria-label='Pagination'>
      <div className='flex flex-wrap items-center justify-center gap-2 sm:justify-end'>
        <button
          type='button'
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={disabled || isFirstPage}
          aria-label='Go to previous page'
          className={`${PAGINATION_BUTTON_CLASS} border-[#374151] bg-[#0A0E17] text-slate-200 hover:border-[#FF5722] hover:text-white`}
        >
          Previous
        </button>

        <div className='flex flex-wrap justify-center gap-2'>
          {pageNumbers.map((pageNumber) => {
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type='button'
                onClick={() => handlePageClick(pageNumber)}
                disabled={disabled}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  PAGINATION_BUTTON_CLASS,
                  isActive
                    ? 'border-[#FF5722] bg-[#FF5722] text-white shadow-[0_0_15px_rgba(255,87,34,0.18)]'
                    : 'border-[#374151] bg-[#0A0E17] text-slate-200 hover:border-[#FF5722] hover:text-white',
                )}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          type='button'
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={disabled || isLastPage}
          aria-label='Go to next page'
          className={`${PAGINATION_BUTTON_CLASS} border-[#374151] bg-[#0A0E17] text-slate-200 hover:border-[#FF5722] hover:text-white`}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
