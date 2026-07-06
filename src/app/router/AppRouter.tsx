import { Routes, Route, Navigate } from 'react-router-dom';
import { GaragePage } from '../../pages/garage/GaragePage';
import { WinnersPage } from '../../pages/winners/WinnersPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/garage' replace />} />
      <Route path='/garage' element={<GaragePage />} />
      <Route path='/winners' element={<WinnersPage />} />
    </Routes>
  );
}
