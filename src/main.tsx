import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import App from './app/App';
import { QueryProvider } from './app/providers/QueryProvider';

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
