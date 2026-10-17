/** Ilustracje SVG rysowane w kodzie: zawodnik, pas, medal, konfetti. */
import { useEffect, useState, type CSSProperties } from 'react';

const SKINS = ['#f1c7a5', '#e5b18c', '#d39a72', '#b97c55', '#8d5a3b', '#f6d3b8'];
const HAIRS = ['#1d1612', '#3b2a1e', '#6b4a2b', '#a9783f', '#d9b36a', '#2a2a2a'];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export interface FighterLook {
  skin: string;
  hair: string;
  style: 'buzz' | 'bald' | 'mohawk' | 'top' | 'long';
  beard: boolean;
}

export function lookFor(seed: string): FighterLook {
  const h = hash(seed);
  const styles: FighterLook['style'][] = ['buzz', 'bald', 'mohawk', 'top', 'buzz', 'long', 'top'];
  return {
    skin: SKINS[h % SKINS.length],
    hair: HAIRS[(h >>> 3) % HAIRS.length],
    style: styles[(h >>> 6) % styles.length],
    beard: ((h >>> 9) & 3) === 0,
  };
}

/**
 * Zawodnik w gardzie (popiersie z rękawicami).
 * corner: 'blue' = ty, 'red' = rywal. shorts: kolor spodenek (np. kolor klubu).
 */
export function Fighter({
  seed,
  corner = 'blue',
  shorts,
  size = 96,
  mirror,
  belt,
  hurt,
  className,
  style,
}: {
  seed: string;
  corner?: 'blue' | 'red';
  shorts?: string;
  size?: number;
  mirror?: boolean;
  belt?: boolean;
  hurt?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const l = lookFor(seed);
  const glove = corner === 'blue' ? '#01aeee' : '#e11d48';
  const gloveDark = corner === 'blue' ? '#0086b8' : '#a3123a';
  const sh = shorts ?? (corner === 'blue' ? '#1f00fe' : '#3a0d18');
  const shade = 'rgba(0,0,0,.18)';
  return (
    <svg
      className={`fighter-art ${className ?? ''}`}
      style={style}
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      aria-hidden="true"
    >
      <g transform={mirror ? 'translate(100 0) scale(-1 1)' : undefined}>
        {/* tułów */}
        <path d="M24 66 Q50 58 76 66 L70 106 Q50 110 30 106 Z" fill={l.skin} />
        <path d="M50 70 L50 100 M40 84 Q50 87 60 84 M41 94 Q50 97 59 94" stroke={shade} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M33 72 Q41 77 49 72 M51 72 Q59 77 67 72" stroke={shade} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* spodenki */}
        <path d="M29 104 Q50 108 71 104 L73 120 L27 120 Z" fill={sh} />
        <path d="M29 104 Q50 108 71 104" stroke="#fff" strokeOpacity=".75" strokeWidth="2.4" fill="none" />
        {belt && (
          <g>
            <path d="M27 100 Q50 105 73 100 L74 110 Q50 115 26 110 Z" fill="#f5b700" stroke="#a87b00" strokeWidth="1" />
            <ellipse cx="50" cy="107" rx="9" ry="6.5" fill="#ffd54a" stroke="#a87b00" strokeWidth="1.2" />
            <circle cx="50" cy="107" r="2.6" fill="#e11d48" />
          </g>
        )}
        {/* szyja */}
        <rect x="43" y="46" width="14" height="16" rx="4" fill={l.skin} />
        <rect x="43" y="54" width="14" height="5" fill={shade} />
        {/* głowa */}
        <ellipse cx="34.5" cy="36" rx="3" ry="4.5" fill={l.skin} />
        <ellipse cx="65.5" cy="36" rx="3" ry="4.5" fill={l.skin} />
        <ellipse cx="50" cy="34" rx="15" ry="17" fill={l.skin} />
        {l.beard && <path d="M36 36 Q37 52 50 53 Q63 52 64 36 Q60 44 50 45 Q40 44 36 36 Z" fill={l.hair} opacity=".9" />}
        {l.style === 'buzz' && <path d="M35.5 30 Q37 16 50 16 Q63 16 64.5 30 Q58 23 50 23 Q42 23 35.5 30 Z" fill={l.hair} opacity=".85" />}
        {l.style === 'top' && <path d="M35 31 Q34 13 50 13 Q67 13 65 31 Q62 21 55 22 Q50 18 44 22 Q38 21 35 31 Z" fill={l.hair} />}
        {l.style === 'mohawk' && <path d="M45 24 Q46 11 50 9 Q54 11 55 24 Q50 22 45 24 Z" fill={l.hair} />}
        {l.style === 'long' && <path d="M34 38 Q31 13 50 13 Q69 13 66 38 L63 30 Q60 20 50 20 Q40 20 37 30 Z" fill={l.hair} />}
        {/* twarz */}
        <path d="M41 32 L46 33.5 M54 33.5 L59 32" stroke="#2a1d16" strokeWidth="1.8" strokeLinecap="round" />
        {hurt ? (
          <>
            <path d="M42 36 l3 3 m0 -3 l-3 3 M55 36 l3 3 m0 -3 l-3 3" stroke="#2a1d16" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M45 46 Q50 43 55 46" stroke="#2a1d16" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="44" cy="37.5" r="1.7" fill="#2a1d16" />
            <circle cx="56" cy="37.5" r="1.7" fill="#2a1d16" />
            <path d="M46 46 L54 46" stroke="#2a1d16" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {/* ochraniacz zębów */}
        {!l.beard && <path d="M47 45.5 L53 45.5" stroke={glove} strokeWidth="1" strokeOpacity=".7" />}
        {/* ręce */}
        <path d="M27 68 Q16 82 26 90 Q32 92 37 60" stroke={l.skin} strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M73 68 Q84 82 74 90 Q68 92 63 60" stroke={l.skin} strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* rękawice */}
        <g>
          <rect x="29" y="44" width="17" height="19" rx="7" fill={glove} />
          <rect x="29" y="58" width="17" height="6" rx="2" fill="#f4f4f5" />
          <path d="M33 48 Q37 46 42 48" stroke={gloveDark} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
        <g>
          <rect x="54" y="42" width="17" height="19" rx="7" fill={glove} />
          <rect x="54" y="56" width="17" height="6" rx="2" fill="#f4f4f5" />
          <path d="M58 46 Q62 44 67 46" stroke={gloveDark} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/** Pas mistrzowski. */
export function Belt({ size = 120, className }: { size?: number; className?: string }) {
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

export function Medal({ kind, size = 64, className }: { kind: 'gold' | 'silver' | 'bronze'; size?: number; className?: string }) {
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
