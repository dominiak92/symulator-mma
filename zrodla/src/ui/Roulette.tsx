/**
 * Losowanie wyniku decyzji: celownik z pasem szans.
 * Środek pasa to pełen sukces, wokół zwykły sukces, brzegi to porażka (szerokości = szanse).
 * Wskazówka przelatuje kilka razy przez pas, zwalnia i staje w polu, które wylosował silnik.
 * Wynik jest już policzony: animacja go tylko pokazuje, nic nie losuje.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Outcome } from '../engine/types';
import { sfxDraw, sfxTick } from './sound';

const LABEL: Record<Outcome, string> = { super: 'Pełen sukces!', success: 'Udało się', fail: 'Nie wyszło' };

type Zone = { kind: Outcome; from: number; to: number };

function zones(dist: [number, number, number]): Zone[] {
  const [sup, suc, fail] = dist;
  const fl = Math.floor(fail / 2);
  const sl = Math.floor(suc / 2);
  const out: Zone[] = [];
  let x = 0;
  const push = (kind: Outcome, w: number) => {
    if (w <= 0) return;
    out.push({ kind, from: x, to: x + w });
    x += w;
  };
  push('fail', fl);
  push('success', sl);
  push('super', sup);
  push('success', suc - sl);
  push('fail', fail - fl);
  return out;
}

// wskazówka odbija się od brzegów: rozwinięta droga u → pozycja na pasie (0..1)
const tri = (u: number) => {
  const m = ((u % 2) + 2) % 2;
  return m < 1 ? m : 2 - m;
};

export function Roulette({ dist, outcome, label, onDone }: { dist: [number, number, number]; outcome: Outcome; label?: string; onDone: () => void }) {
  const zs = useMemo(() => zones(dist), [dist]);
  // punkt zatrzymania: losowe miejsce w jednym z pól z wylosowanym wynikiem (nie przy samej krawędzi)
  const target = useMemo(() => {
    const cand = zs.filter((z) => z.kind === outcome);
    const z = cand[Math.floor(Math.random() * cand.length)] ?? zs[0];
    const pad = Math.min(0.35, (z.to - z.from) * 0.25);
    return (z.from + pad + Math.random() * Math.max(0.01, z.to - z.from - 2 * pad)) / 100;
  }, [zs, outcome]);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [pos, setPos] = useState(reduce ? target : 0);
  const [stopped, setStopped] = useState(!!reduce);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const finish = () => {
      setPos(target);
      setStopped(true);
      sfxDraw(outcome);
      window.setTimeout(() => done.current(), 900);
    };
    if (reduce) {
      sfxDraw(outcome);
      const t = window.setTimeout(() => done.current(), 700);
      return () => clearTimeout(t);
    }
    // dwa pełne przebiegi tam i z powrotem, potem dojazd do celu
    const D = 4 + target;
    const DUR = 2100;
    const t0 = performance.now();
    let raf = 0;
    let lastTick = -1;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / DUR);
      const e = 1 - Math.pow(1 - k, 3.2);
      const p = tri(e * D);
      setPos(p);
      const tick = Math.floor(p * 25);
      if (tick !== lastTick) {
        lastTick = tick;
        if (k > 0.35) sfxTick(1 + k * 0.4);
      }
      if (k < 1) raf = requestAnimationFrame(step);
      else finish();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (stopped) return;
    setPos(target);
    setStopped(true);
    sfxDraw(outcome);
    window.setTimeout(() => done.current(), 450);
  };
  const here = zs.find((z) => pos * 100 >= z.from && pos * 100 <= z.to)?.kind;

  return (
    <div className={`roul ${stopped ? `stop out-${outcome}` : ''}`} onClick={skip} role="status" aria-live="polite" aria-label={stopped ? LABEL[outcome] : 'Losowanie wyniku'}>
      <div className="roul-head">
        <span>{label ?? 'Losowanie'}</span>
        <b className={`roul-res ${stopped ? 'on' : ''}`}>{stopped ? LABEL[outcome] : here ? LABEL[here].replace('!', '') : '…'}</b>
      </div>
      <div className="roul-bar">
        {zs.map((z, i) => (
          <i key={i} className={`roul-z z-${z.kind} ${stopped && z.kind === outcome && pos * 100 >= z.from && pos * 100 <= z.to ? 'hit' : ''}`} style={{ left: `${z.from}%`, width: `${z.to - z.from}%` }} />
        ))}
        <i className="roul-ticks" />
        <span className="roul-needle" style={{ left: `${pos * 100}%` }}>
          <i />
        </span>
      </div>
      <div className="roul-legend" aria-hidden="true">
        <span className="l-fail">nie wyszło</span>
        <span className="l-success">udało się</span>
        <span className="l-super">pełen sukces</span>
      </div>
      {!stopped && <small className="roul-skip">dotknij, żeby zatrzymać</small>}
    </div>
  );
}
