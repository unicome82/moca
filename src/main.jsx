import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import i18n from './i18n/index.js';
import { detectLocale } from './i18n/locale.js';
import { hydrateStorage } from './utils/browserStorage.js';
import { migrateLegacyCardHistory } from './utils/cardHistory.js';
import './styles/styles.scss';

// iOS home screen app with a translucent status bar reports viewport units
// short by the status bar height, leaving a gap at the bottom. Use the real
// screen height there instead.
const isStandalone =
  window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

if (isStandalone) {
  const syncAppHeight = () => {
    const portrait = window.innerHeight >= window.innerWidth;
    const screenHeight = portrait
      ? Math.max(window.screen.height, window.screen.width)
      : Math.min(window.screen.height, window.screen.width);
    const height = Math.max(window.innerHeight, screenHeight);
    document.documentElement.style.setProperty('--app-height', `${height}px`);
  };
  syncAppHeight();
  window.addEventListener('resize', syncAppHeight);
  window.addEventListener('orientationchange', syncAppHeight);
}

// The native app loads saved settings asynchronously; render once they are in place.
hydrateStorage().then(() => {
  const locale = detectLocale();
  if (i18n.resolvedLanguage !== locale) i18n.changeLanguage(locale);
  migrateLegacyCardHistory();
  createRoot(document.getElementById('root')).render(
    <React.StrictMode><App /></React.StrictMode>,
  );
});
