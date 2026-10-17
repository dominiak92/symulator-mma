import { useState } from 'react';
import { applyFontScale, FONT_SCALES, loadSettings, saveSettings } from '../storage';

/** Wybór rozmiaru tekstu: Normalny / Większy / Duży. */
export default function TextSize() {
  const [scale, setScale] = useState(() => loadSettings().fontScale);
  return (
    <div className="text-size">
      <span className="text-size-label">Rozmiar tekstu</span>
      <div className="text-size-seg" role="radiogroup" aria-label="Rozmiar tekstu">
        {FONT_SCALES.map((f) => (
          <button
            key={f.value}
            role="radio"
            aria-checked={scale === f.value}
            className={scale === f.value ? 'on' : ''}
            style={{ fontSize: `${0.8 + (f.value - 100) / 160}rem` }}
            onClick={() => {
              saveSettings({ ...loadSettings(), fontScale: f.value });
              applyFontScale(f.value);
              setScale(f.value);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
