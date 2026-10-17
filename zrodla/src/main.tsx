import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/oswald/latin-500.css';
import '@fontsource/oswald/latin-ext-500.css';
import '@fontsource/oswald/latin-700.css';
import '@fontsource/oswald/latin-ext-700.css';
import '@fontsource-variable/archivo/wdth.css';
import './styles.css';
import App from './App';
import { installTypography } from './typography';

const root = document.getElementById('root')!;
installTypography(root);
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
