import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initStorage } from './lib/db';
import { installGlobalErrorHandlers } from './lib/logger';
import { initInstallPrompt } from './lib/pwa';
import App from './app/App';
import './index.css';

installGlobalErrorHandlers();
initInstallPrompt();

// Open the database first (it may fall back to memory), then render.
void initStorage().then(() => {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
});
