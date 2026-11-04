import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './i18n/index.js';
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

migrateLegacyCardHistory();

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
