import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initStorage } from './lib/db';
import { installGlobalErrorHandlers } from './lib/logger';
import App from './app/App';
import './index.css';

installGlobalErrorHandlers();
void initStorage();

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
