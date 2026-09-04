import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { applyTheme, getSavedTheme } from './utils/theme';

applyTheme(getSavedTheme());

// Enregistrement du Service Worker pour PWA et mode hors-ligne
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nouvelle version de Prépa Concours disponible.');
  },
  onOfflineReady() {
    console.log('Prépa Concours est prête pour une utilisation hors-ligne.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
