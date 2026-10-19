/**
 * Bęben losowania przy wydarzeniach: jedno okienko, w którym przewijają się możliwe wyniki,
 * zwalniają i zatrzymują na tym, który wylosował silnik. Jak tablica odlotów na lotnisku,
 * nie jak automat: jeden bęben, żadnych symboli kasyna, wynik jest już policzony.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Outcome } from '../engine/types';
import { distFrom } from '../engine/fight';
import { sfxDraw, sfxTick } from './sound';

const ROW: Record<Outcome, { icon: string; text: string }> = {
  super: { icon: '★', text: 'Pełen sukces' },
  success: { icon: '✓', text: 'Udało się' },
  fail: { icon: '✗', text: 'Nie wyszło' },
};
const H = 46;
const N = 26;

export function Drum({ chance, outcome, label, onDone, rows, binary }: { chance: number; outcome: Outcome; label: string; onDone: () => void; rows?: Partial<Record<Outcome, { icon: string; text: string }>>; binary?: boolean }) {
  const R = { ...ROW, ...rows };
  // taśma: losowe wyniki w proporcji do szans, na końcu wylosowany
  const items = useMemo(() => {
    const [sup, suc] = distFrom(chance);
    const out: Outcome[] = [];
    let prev: Outcome | null = null;
    for (let i = 0; i < N - 1; i++) {
      let o: Outcome;
      do {
        const r = Math.random() * 100;
        o = r < sup ? (binary ? 'success' : 'super') : r < sup + suc ? 'success' : 'fail';
      } while (o === prev && Math.random() < 0.6);
      out.push(o);
      prev = o;
    }
    // przedostatni inny niż wynik, żeby zatrzymanie było widać
    if (out[N - 2] === outcome) out[N - 2] = outcome === 'fail' ? 'success' : 'fail';
    out.push(outcome);
    // jeszcze jeden pod spodem, żeby okienko nie było puste po zatrzymaniu
    out.push(outcome === 'fail' ? 'success' : 'fail');
    return out;
  }, [chance, outcome]);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [y, setY] = useState(reduce ? (N - 1) * H : 0);
  const [stopped, setStopped] = useState(!!reduce);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const end = () => {
      setY((N - 1) * H);
      setStopped(true);
      sfxDraw(outcome);
      window.setTimeout(() => done.current(), 1000);
    };
    if (reduce) {
      sfxDraw(outcome);
      const t = window.setTimeout(() => done.current(), 800);
      return () => clearTimeout(t);
    }
    const DUR = 1900;
    const total = (N - 1) * H;
    const t0 = performance.now();
    let raf = 0;
    let last = -1;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / DUR);
      // zwalnia jak bęben z lekkim „przeskokiem” na końcu
      const e = k < 1 ? 1 - Math.pow(1 - k, 3.4) : 1;
      const v = e * total + (k > 0.9 && k < 1 ? Math.sin((k - 0.9) * 31.4) * 4 : 0);
      setY(v);
      const row = Math.floor(v / H);
      if (row !== last) {
        last = row;
        if (k > 0.25) sfxTick(0.8 + k * 0.5);
      }
      if (k < 1) raf = requestAnimationFrame(step);
      else end();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (stopped) return;
    setY((N - 1) * H);
    setStopped(true);
    sfxDraw(outcome);
    window.setTimeout(() => done.current(), 500);
  };

  return (
    <div className={`drum ${stopped ? `stop out-${outcome}` : ''}`} onClick={skip} role="status" aria-live="polite" aria-label={stopped ? R[outcome].text : 'Losowanie wyniku'}>
      <span className="drum-label">{label}</span>
      <div className="drum-win" style={{ height: H * 3 }}>
        <div className="drum-strip" style={{ transform: `translateY(${H - y}px)` }}>
          {items.map((o, i) => (
            <div key={i} className={`drum-row r-${o}`} style={{ height: H }}>
              <i>{R[o].icon}</i>
              {R[o].text}
            </div>
          ))}
        </div>
        <span className="drum-frame" aria-hidden="true" style={{ top: H, height: H }} />
      </div>
      {!stopped && <small className="roul-skip">dotknij, żeby zatrzymać</small>}
    </div>
  );
}
