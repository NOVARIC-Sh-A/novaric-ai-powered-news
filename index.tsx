import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Gracefully handle noisy third-party Web3 browser extension injection scripts (e.g. inpage.js)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (reason.includes('MetaMask') || reason.includes('inpage.js') || reason.includes('ethereum')) {
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);