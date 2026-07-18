import { useWinners } from '../model/useWinners';
import { WinnersTable } from '../components/WinnersTable';

export function WinnersPageContent() {
  const { data: winners = [], error, isError, isPending } = useWinners();

  return (
    <section className='rounded-xl border border-[#1F293A] bg-[#151C2C] p-5 shadow-lg'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h1 className='text-xl font-semibold tracking-wide text-slate-100'>
          Winners ({winners.length})
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

      {!isPending && !isError && winners.length === 0 && (
        <p className='text-sm text-slate-400'>
          No winners yet. Start a race to create the first winner.
        </p>
      )}

      {!isPending && !isError && winners.length > 0 && (
        <WinnersTable winners={winners} />
      )}
    </section>
  );
}
