import { Routes, Route, Navigate } from 'react-router-dom';
import { GaragePage } from '../../pages/garage/GaragePage';
import { WinnersPage } from '../../pages/winners/WinnersPage';
import AsidePanel from '../../shared/components/asidePanel/AsidePanel';

export function AppRouter() {
  return (
    <main className='flex  h-screen w-screen bg-gray-100'>
      <AsidePanel />
      <div className='flex-1 bg-[#0A0E17] py-11 px-14  '>
        <Routes>
          <Route path='/' element={<Navigate to='/garage' replace />} />
          <Route path='/garage' element={<GaragePage />} />
          <Route path='/winners' element={<WinnersPage />} />
        </Routes>
      </div>
    </main>
  );
}
