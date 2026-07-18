import Sidebar from './Sidebar';

function AsidePanel() {
  return (
    <aside className='px-10 py-6 fixed h-screen bg-[#151C2C] text-[#94A3B8] border-r-3 border-r-[#232c42] max-[1039px]:w-32 max-[1039px]:px-3 max-[1039px]:py-4 max-[639px]:w-28'>
      <img
        src='/src/shared/assets/icons/async-race-logo.svg'
        className='w-30 h-20 max-[1039px]:h-14 max-[1039px]:w-24 max-[639px]:w-20'
        alt='Logo'
      />
      <Sidebar />
    </aside>
  );
}

export default AsidePanel;
