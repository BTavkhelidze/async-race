import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './app/providers/QueryProvider';

import { ToastContainer } from 'react-toastify';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ToastContainer position='bottom-right' />
        <App />
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
