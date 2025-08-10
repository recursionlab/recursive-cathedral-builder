import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Bootstrapping app...');
const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error('Root element not found');
} else {
  createRoot(rootEl).render(<App />);
}
