import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css'
import App from './App.tsx'
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { queryClient } from './api/helpers/client.ts';
import { Toaster } from './components/ui/sonner.tsx';

window.addEventListener('vite:preloadError', () => {
  window.location.reload()
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)