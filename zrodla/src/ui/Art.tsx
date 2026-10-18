import beltPolska from '../assets/belts/polska.webp';
import beltEuropa from '../assets/belts/europa.webp';
import beltInterim from '../assets/belts/interim.webp';
import medalGold from '../assets/medals/gold.webp';
import medalSilver from '../assets/medals/silver.webp';
import medalBronze from '../assets/medals/bronze.webp';
import statStand from '../assets/stats/stand.webp';
import statWrest from '../assets/stats/wrest.webp';
import statBjj from '../assets/stats/bjj.webp';
import statCardio from '../assets/stats/cardio.webp';
import statChin from '../assets/stats/chin.webp';
import statIq from '../assets/stats/iq.webp';
import beltAmator from '../assets/belts/amator.webp';
import beltRegional from '../assets/belts/regional.webp';
import beltWorld from '../assets/belts/world.webp';
/** Ilustracje SVG rysowane w kodzie: zawodnik, pas, medal, konfetti. */
import { useEffect, useState } from 'react';

import { Fighter, WEIGHT_BUILD } from './FighterArt';
export { Fighter, lookFor, WEIGHT_BUILD } from './FighterArt';

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Pas mistrzowski. */
const BELT_IMG: Record<number, string> = { 0: beltAmator, 1: beltRegional, 2: beltPolska, 3: beltEuropa, 4: beltWorld };

export function Belt({ size = 120, className, tier, interim }: { size?: number; className?: string; tier?: number; interim?: boolean }) {
  const img = interim ? beltInterim : tier !== undefined ? BELT_IMG[tier] : undefined;
  if (img) return <img className={`belt-art belt-img ${className ?? ''}`} src={img} alt="" aria-hidden="true" style={{ width: size * 1.15, height: 'auto' }} />;
  return (
    <svg className={`belt-art ${className ?? ''}`} width={size} height={size * 0.5} viewBox="0 0 120 60" aria-hidden="true">
      <path d="M2 22 Q60 30 118 22 L118 40 Q60 48 2 40 Z" fill="#141416" stroke="#3a3a40" strokeWidth="1.5" />
      <rect x="16" y="20" width="14" height="22" rx="3" fill="#f5b700" stroke="#a87b00" />
      <rect x="90" y="20" width="14" height="22" rx="3" fill="#f5b700" stroke="#a87b00" />
      <ellipse cx="60" cy="31" rx="24" ry="22" fill="#ffd54a" stroke="#a87b00" strokeWidth="2" />
      <ellipse cx="60" cy="31" rx="17" ry="15.5" fill="#f5b700" stroke="#a87b00" strokeWidth="1.2" />
      <path d="M60 19 L63.5 27 L72 27.5 L65.5 33 L67.8 41.5 L60 36.8 L52.2 41.5 L54.5 33 L48 27.5 L56.5 27 Z" fill="#e11d48" stroke="#8a0f2c" strokeWidth=".8" />
      <path d="M44 16 Q52 11 60 11" stroke="#fff" strokeOpacity=".6" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const MEDAL: Record<'gold' | 'silver' | 'bronze', [string, string, string]> = {
  gold: ['#ffd54a', '#f5b700', '#a87b00'],
  silver: ['#f1f1f4', '#c4c4cc', '#7d7d86'],
  bronze: ['#f0a36a', '#c9773d', '#7f4519'],
};

const MEDAL_IMG = { gold: medalGold, silver: medalSilver, bronze: medalBronze };

export function Medal({ kind, size = 64, className }: { kind: 'gold' | 'silver' | 'bronze'; size?: number; className?: string }) {
  if (MEDAL_IMG[kind]) return <img className={`medal-art medal-img ${className ?? ''}`} src={MEDAL_IMG[kind]} alt="" aria-hidden="true" style={{ height: size * 1.25, width: 'auto' }} />;
  const [hi, mid, lo] = MEDAL[kind];
  const n = kind === 'gold' ? '1' : kind === 'silver' ? '2' : '3';
  return (
    <svg className={`medal-art ${className ?? ''}`} width={size} height={size * 1.25} viewBox="0 0 64 80" aria-hidden="true">
      <path d="M18 0 L30 30 L22 32 L8 0 Z" fill="#1f00fe" />
      <path d="M46 0 L34 30 L42 32 L56 0 Z" fill="#01aeee" />
      <circle cx="32" cy="52" r="24" fill={mid} stroke={lo} strokeWidth="2.5" />
      <circle cx="32" cy="52" r="17" fill={hi} stroke={lo} strokeWidth="1.4" />
      <text x="32" y="60" textAnchor="middle" fontFamily="Oswald, Impact, sans-serif" fontWeight="700" fontSize="22" fill={lo}>
        {n}
      </text>
      <path d="M17 42 Q22 33 31 31" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Klatka (oktagon) jako tło/nagłówek. */
export function Cage({ className }: { className?: string }) {
  return (
    <svg className={`cage-art ${className ?? ''}`} viewBox="0 0 200 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="mesh" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 L0 8 M0 0 L8 0" stroke="#fff" strokeOpacity=".09" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="200" height="80" fill="url(#mesh)" />
      <path d="M0 74 L200 74" stroke="#01aeee" strokeOpacity=".5" strokeWidth="2" />
    </svg>
  );
}

const CONF_COLORS = ['#01aeee', '#f5b700', '#e11d48', '#2fd38c', '#ffffff', '#1f00fe'];

/** Konfetti (CSS). Renderuj warunkowo; samo znika po animacji. */
export function Confetti({ count = 36 }: { count?: number }) {
  const bits = Array.from({ length: count }, (_, i) => {
    const h = hash(`c${i}`);
    return {
      left: (h % 1000) / 10,
      delay: ((h >>> 10) % 700) / 1000,
      dur: 1.6 + ((h >>> 4) % 900) / 1000,
      rot: (h >>> 7) % 360,
      color: CONF_COLORS[i % CONF_COLORS.length],
      w: 5 + ((h >>> 12) % 5),
    };
  });
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i
          key={i}
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            background: b.color,
            width: b.w,
            height: b.w * 1.6,
            transform: `rotate(${b.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Liczba, która „dolicza się” od 0 przy pierwszym wyświetleniu. */
export function CountUp({ to, ms = 700, format = (n: number) => String(n) }: { to: number; ms?: number; format?: (n: number) => string }) {
  const [v, setV] = useState(() => (reducedMotion() ? to : 0));
  useEffect(() => {
    if (reducedMotion()) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{format(v)}</>;
}

function reducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Podgląd wyglądów zawodników (adres #zawodnicy). */
export function FighterGallery() {
  const names = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowski', 'Grabowski', 'Nowakowski', 'Pawłowski', 'Michalski', 'Silva', "O'Brien", 'Petrov', 'Magomedov', ...Array.from({ length: 24 }, (_, i) => `Zawodnik${i + 1}`)];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16, background: '#111' }}>
      {Object.keys(WEIGHT_BUILD).map((wk) => (
        <div key={wk} style={{ textAlign: 'center', color: '#aaa', fontSize: 11 }}>
          <Fighter seed="JanKowalski" weight={wk} size={110} />
          <div>{wk}</div>
        </div>
      ))}
      <div style={{ flexBasis: '100%' }} />
      {names.map((n, i) => (
        <div key={n} style={{ textAlign: 'center', color: '#aaa', fontSize: 11 }}>
          <Fighter seed={`Jan${n}`} corner={i % 2 ? 'red' : 'blue'} size={110} mirror={i % 2 === 1} belt={i === 4} hurt={i === 7} />
          <div>{n}</div>
        </div>
      ))}
    </div>
  );
}

const STAT_ART: Record<string, string> = { stand: statStand, wrest: statWrest, bjj: statBjj, cardio: statCardio, chin: statChin, iq: statIq };

/** Ilustracja umiejętności (kafelek), do większych miejsc: obóz, samouczek. */
export function StatArt({ stat, size = 40 }: { stat: string; size?: number }) {
  return <img className="stat-art" src={STAT_ART[stat]} alt="" aria-hidden="true" width={size} height={size} style={{ width: size, height: size }} />;
}
