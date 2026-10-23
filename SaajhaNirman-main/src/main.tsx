import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress Vite HMR WebSocket connection errors inside sandboxed iFrame
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = String(event.reason?.message || event.reason || '');
    if (
      msg.includes('WebSocket') ||
      msg.includes('createWebSocketModuleRunnerTransport') ||
      msg.includes('@vite/client')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = String(event.message || '');
    const filename = String(event.filename || '');
    if (
      msg.includes('WebSocket') ||
      msg.includes('createWebSocketModuleRunnerTransport') ||
      filename.includes('@vite/client')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
