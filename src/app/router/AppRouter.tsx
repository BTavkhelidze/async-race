import { Routes, Route, Navigate } from 'react-router-dom';
import { GaragePage } from '../../pages/garage/GaragePage';
import { WinnersPage } from '../../pages/winners/WinnersPage';
import AsidePanel from '../../shared/components/asidePanel/AsidePanel';

export function AppRouter() {
  return (
    <main className='flex relative  h-screen w-screen bg-gray-100 max-[1039px]:w-full max-[1039px]:overflow-x-hidden'>
      <AsidePanel />
      <div className='ml-50 flex-1 bg-[#0A0E17] overflow-x-hidden py-11 px-14 max-[1039px]:ml-32 max-[1039px]:w-[calc(100%-8rem)] max-[1039px]:min-w-0 max-[1039px]:flex-none max-[1039px]:px-3 max-[1039px]:py-6 max-[639px]:ml-28 max-[639px]:w-[calc(100%-7rem)]'>
        <Routes>
          <Route path='/' element={<Navigate to='/garage' replace />} />
          <Route path='/garage' element={<GaragePage />} />
          <Route path='/winners' element={<WinnersPage />} />
        </Routes>
      </div>
    </main>
  );
}
