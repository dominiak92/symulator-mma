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
import { unlockAudio } from './ui/sound';

const root = document.getElementById('root')!;
installTypography(document.body);
// przeglądarki pozwalają grać dźwięk dopiero po pierwszym dotknięciu
const unlock = () => {
  unlockAudio();
  window.removeEventListener('pointerdown', unlock);
  window.removeEventListener('keydown', unlock);
};
window.addEventListener('pointerdown', unlock);
window.addEventListener('keydown', unlock);
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
