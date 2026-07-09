import Sidebar from './Sidebar';

function AsidePanel() {
  return (
    <aside className='px-10 py-6  bg-[#151C2C] text-[#94A3B8] border-r-3 border-r-[#232c42]'>
      <img
        src='/src/shared/assets/icons/async-race-logo.svg'
        className='w-30 h-20'
        alt='Logo'
      />
      <Sidebar />
    </aside>
  );
}

export default AsidePanel;
