/** Ilustracje SVG rysowane w kodzie: zawodnik, pas, medal, konfetti. */
import { useEffect, useId, useState, type CSSProperties } from 'react';

const SKINS = ['#f6d3b8', '#f1c7a5', '#e8b48f', '#d9a07a', '#c68a62', '#a86d48', '#8a5537', '#6b3f28'];
const HAIRS = ['#1a1310', '#2e2119', '#4a3324', '#6b4a2b', '#9a6a3a', '#c9a15e', '#e6d3a3', '#7a2e1a', '#2b2b2f'];
const INKS = ['#1e2a44', '#24303f', '#2b2340'];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Prosty generator liczb z ziarna (żeby każdy wygląd był stały dla danego nazwiska). */
function seeded(seed: string) {
  let x = hash(seed) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 10000) / 10000;
  };
}

type HairStyle = 'buzz' | 'bald' | 'mohawk' | 'top' | 'long' | 'bun' | 'cornrows' | 'slick' | 'curly' | 'fade';
type BeardStyle = 'none' | 'stubble' | 'full' | 'goatee' | 'stache' | 'chin';
type Tattoo = 'chestEagle' | 'chestScript' | 'sleeveL' | 'sleeveR' | 'tribalShoulder' | 'neck' | 'ribs' | 'forearmBands' | 'star' | 'cross';

export interface FighterLook {
  skin: string;
  hair: string;
  style: HairStyle;
  beard: BeardStyle;
  build: number; // 0 smukły .. 2 ciężki
  tattoos: Tattoo[];
  ink: string;
  ear: boolean; // kalafiorowe ucho
  scar: boolean;
  nose: boolean; // krzywy nos
  chestHair: boolean;
  shortsStyle: 'solid' | 'stripe' | 'panel' | 'split';
  brow: number; // nachylenie brwi
}

export function lookFor(seed: string): FighterLook {
  const r = seeded(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const styles: HairStyle[] = ['buzz', 'bald', 'mohawk', 'top', 'long', 'bun', 'cornrows', 'slick', 'curly', 'fade', 'buzz', 'fade'];
  const beards: BeardStyle[] = ['none', 'none', 'stubble', 'stubble', 'full', 'goatee', 'stache', 'chin'];
  const allTats: Tattoo[] = ['chestEagle', 'chestScript', 'sleeveL', 'sleeveR', 'tribalShoulder', 'neck', 'ribs', 'forearmBands', 'star', 'cross'];
  const tatCount = r() < 0.3 ? 0 : r() < 0.55 ? 1 : r() < 0.8 ? 2 : 3 + Math.floor(r() * 2);
  const tattoos: Tattoo[] = [];
  for (let i = 0; i < tatCount; i++) {
    const t = pick(allTats);
    if (!tattoos.includes(t) && !(t.startsWith('chest') && tattoos.some((x) => x.startsWith('chest')))) tattoos.push(t);
  }
  return {
    skin: pick(SKINS),
    hair: pick(HAIRS),
    style: pick(styles),
    beard: pick(beards),
    build: Math.floor(r() * 3),
    tattoos,
    ink: pick(INKS),
    ear: r() < 0.3,
    scar: r() < 0.25,
    nose: r() < 0.3,
    chestHair: r() < 0.18,
    shortsStyle: pick(['solid', 'stripe', 'panel', 'split'] as const),
    brow: Math.floor(r() * 3),
  };
}

function darken(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

/**
 * Zawodnik w gardzie (popiersie w rękawicach MMA).
 * corner: 'blue' = ty, 'red' = rywal. shorts: kolor spodenek (np. kolor klubu).
 * Wygląd (fryzura, broda, budowa, tatuaże, blizny) wynika z ziarna, więc jest stały dla danej osoby.
 */
/** Budowa ciała wg kategorii wagowej (0 chudy … 3 ciężki z brzuchem). */
const WEIGHT_BUILD: Record<string, number> = { piorkowa: 0, lekka: 0, polsrednia: 1, srednia: 1, polciezka: 2, ciezka: 3 };

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
  weight,
}: {
  seed: string;
  /** kategoria wagowa: piórkowa chuda … ciężka z brzuchem (nadpisuje losową budowę) */
  weight?: string;
  corner?: 'blue' | 'red';
  shorts?: string;
  size?: number;
  mirror?: boolean;
  belt?: boolean;
  hurt?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const base = lookFor(seed);
  const l = weight && WEIGHT_BUILD[weight] !== undefined ? { ...base, build: WEIGHT_BUILD[weight] } : base;
  const belly = l.build >= 3;
  const glove = corner === 'blue' ? '#01aeee' : '#e11d48';
  const gloveDark = corner === 'blue' ? '#0079a8' : '#9b0f33';
  const sh = shorts ?? (corner === 'blue' ? '#1f00fe' : '#3a0d18');
  const skinD = darken(l.skin, 0.82);
  const skinDD = darken(l.skin, 0.68);
  const hairD = darken(l.hair, 0.75);
  const line = 'rgba(40,20,10,.28)';
  const ink = l.ink;
  // poszerzenie barków; przy kategorii wagowej wyraźniejsze różnice (chudy piórkowy, szeroki ciężki)
  const byWeight = !!weight && WEIGHT_BUILD[weight] !== undefined;
  const w = byWeight ? [-6, 0, 5, 9][l.build] : [0, 3, 6, 9][l.build];
  const armW = byWeight ? [8.5, 11, 13, 14][l.build] : 11 + l.build;
  const has = (t: Tattoo) => l.tattoos.includes(t);
  const armL = `M${27 - w} 68 Q${15 - w} 82 26 90 Q32 92 36 64`;
  const armR = `M${73 + w} 68 Q${85 + w} 82 74 90 Q68 92 64 64`;
  const ink2 = { stroke: ink, strokeOpacity: 0.8, fill: 'none', strokeLinecap: 'round' as const };
  return (
    <svg className={`fighter-art ${className ?? ''}`} style={style} width={size} height={size * 1.2} viewBox="0 0 100 120" aria-hidden="true">
      <defs>
        <linearGradient id={`sk${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={skinD} />
          <stop offset=".45" stopColor={l.skin} />
          <stop offset="1" stopColor={skinD} />
        </linearGradient>
        <linearGradient id={`gl${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={glove} />
          <stop offset="1" stopColor={gloveDark} />
        </linearGradient>
      </defs>
      <g transform={mirror ? 'translate(100 0) scale(-1 1)' : undefined}>
        {/* tułów */}
        <path d={`M${24 - w} 66 Q50 ${58 - w / 2} ${76 + w} 66 L${71 + w / 2} 106 Q50 110 ${29 - w / 2} 106 Z`} fill={`url(#sk${uid})`} stroke={skinDD} strokeOpacity=".5" strokeWidth=".8" />
        {/* klatka i brzuch */}
        <path d={`M${33 - w / 2} 72 Q41 78 49 72 M51 72 Q59 78 ${67 + w / 2} 72`} stroke={line} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        {!belly && <path d="M50 74 L50 101" stroke={line} strokeWidth="1.3" fill="none" />}
        {belly ? (
          <g>
            <ellipse cx="50" cy="93" rx="23" ry="15" fill={`url(#sk${uid})`} stroke={skinDD} strokeOpacity=".4" strokeWidth=".8" />
            <path d="M30 95 Q50 114 70 95" stroke={skinDD} strokeOpacity=".5" strokeWidth="1.5" fill="none" />
            <path d="M36 80 Q42 83 47 80 M53 80 Q58 83 64 80" stroke={line} strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M49 96 q1 1.5 0 3" stroke={line} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        ) : l.build < 2 ? (
          <path d="M42 84 Q50 86.5 58 84 M42.5 92 Q50 94.5 57.5 92 M43.5 99 Q50 101 56.5 99" stroke={line} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M40 90 Q50 95 60 90" stroke={line} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        )}
        {l.chestHair && <path d="M46 75 l1 3 m2 -3 l0 3.5 m2 -3.5 l-1 3 M48 84 l1 2 m2 -2 l-1 2 M49 92 l1 2" stroke={hairD} strokeWidth=".9" strokeLinecap="round" opacity=".7" />}
        {/* tatuaże na korpusie */}
        {has('chestEagle') && (
          <g {...ink2} strokeWidth="1.2">
            <path d="M50 74 Q43 68 33 70 Q39 73 42 74 Q37 76 34 80 Q42 79 47 77 M50 74 Q57 68 67 70 Q61 73 58 74 Q63 76 66 80 Q58 79 53 77" strokeWidth="1.5" />
            <path d="M47.5 75 L50 83 L52.5 75 Q50 73 47.5 75 Z" fill={ink} fillOpacity=".7" />
            <circle cx="50" cy="73.2" r="1.6" fill={ink} fillOpacity=".8" />
          </g>
        )}
        {has('chestScript') && <path d="M37 79 q2 -2 4 0 t4 0 t4 0 M52 79 q2 -2 4 0 t4 0 t4 0" {...ink2} strokeWidth="1" />}
        {has('ribs') && <path d="M61 86 l6 -2 M61 89 l6 -1.6 M61.5 92 l5 -1.2" {...ink2} strokeWidth="1" />}
        {has('star') && <path d="M38 87 l1.6 3.4 3.6 .4 -2.7 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.7 -2.4 3.6 -.4 z" fill={ink} fillOpacity=".75" />}
        {has('cross') && <path d="M62 75 v7 M59.5 77.5 h5" {...ink2} strokeWidth="1.4" />}
        {has('tribalShoulder') && <path d={`M${27 - w} 67 q5 -4 9 -2 q-3 2 -2 5 q2 -3 6 -3`} {...ink2} strokeWidth="1.6" strokeOpacity=".6" />}
        {/* spodenki */}
        <path d="M29 104 Q50 108 71 104 L73 120 L27 120 Z" fill={sh} />
        {l.shortsStyle === 'stripe' && <path d="M31 107 L30 120 M69 107 L70 120" stroke="#fff" strokeOpacity=".6" strokeWidth="2.2" />}
        {l.shortsStyle === 'panel' && <path d="M27 112 L40 108 L38 120 L27 120 Z" fill="#fff" fillOpacity=".18" />}
        {l.shortsStyle === 'split' && <path d="M50 107 L50 120" stroke={darken(sh.length === 7 ? sh : '#333333', 0.6)} strokeWidth="2" />}
        <path d="M29 104 Q50 108 71 104" stroke="#111" strokeOpacity=".55" strokeWidth="2.8" fill="none" />
        <path d="M29 104 Q50 108 71 104" stroke="#fff" strokeOpacity=".7" strokeWidth="1.1" fill="none" />
        {belt && (
          <g>
            <path d="M27 100 Q50 105 73 100 L74 110 Q50 115 26 110 Z" fill="#f5b700" stroke="#a87b00" strokeWidth="1" />
            <ellipse cx="50" cy="107" rx="9" ry="6.5" fill="#ffd54a" stroke="#a87b00" strokeWidth="1.2" />
            <circle cx="50" cy="107" r="2.6" fill="#e11d48" />
          </g>
        )}
        {/* szyja (u ciężkich grubsza) */}
        <path d={`M${43 - l.build} 46 L${57 + l.build} 46 L${58 + l.build} 62 L${42 - l.build} 62 Z`} fill={l.skin} />
        <path d={`M${43 - l.build} 54 L${57 + l.build} 54 L${58 + l.build} 59 L${42 - l.build} 59 Z`} fill={skinD} opacity=".7" />
        {has('neck') && <path d="M53 50 q2 1 1.5 3.5 q-1.5 -1 -3 0 q.5 -2 1.5 -3.5 z M47 56 l3 0" {...ink2} strokeWidth="1" />}
        {/* uszy */}
        <ellipse cx="34.5" cy="36" rx="3" ry="4.5" fill={l.skin} />
        <ellipse cx="65.5" cy="36" rx="3" ry="4.5" fill={l.skin} />
        {l.ear && <path d="M33 33 q-1.5 1.5 0 3 q-1.5 1.5 0 3.2" stroke={skinDD} strokeWidth="1.3" fill="none" strokeLinecap="round" />}
        {/* włosy z tyłu (długie, kok) */}
        {l.style === 'long' && <path d="M35 30 Q33 50 38 56 L42 50 Q38 40 40 28 Z M65 30 Q67 50 62 56 L58 50 Q62 40 60 28 Z" fill={l.hair} />}
        {l.style === 'bun' && <circle cx="50" cy="13" r="5.5" fill={l.hair} />}
        {/* głowa */}
        <ellipse cx="50" cy="34" rx={15 + l.build * 0.6} ry={17 + (belly ? 0.8 : 0)} fill={l.skin} />
        {belly && <path d="M41 48 Q50 54 59 48" stroke={skinDD} strokeOpacity=".35" strokeWidth="1.2" fill="none" />}
        <ellipse cx="45" cy="27" rx="7" ry="5" fill="#fff" opacity=".08" />
        {/* zarost */}
        {l.beard === 'stubble' && <path d="M36 37 Q37 52 50 53 Q63 52 64 37 Q60 45 50 46 Q40 45 36 37 Z" fill={l.hair} opacity=".28" />}
        {l.beard === 'full' && <path d="M35.5 35 Q36 54 50 55 Q64 54 64.5 35 Q61 45 50 46 Q39 45 35.5 35 Z" fill={l.hair} opacity=".92" />}
        {l.beard === 'goatee' && <path d="M45 46 Q50 44.5 55 46 L54 52 Q50 54 46 52 Z" fill={l.hair} opacity=".9" />}
        {l.beard === 'chin' && <path d="M44 49 Q50 55 56 49 Q50 52 44 49 Z" fill={l.hair} opacity=".9" />}
        {(l.beard === 'stache' || l.beard === 'goatee' || l.beard === 'full') && <path d="M43.5 44.5 Q50 41.5 56.5 44.5 Q50 43.5 43.5 44.5 Z" stroke={l.hair} strokeWidth="1.8" fill={l.hair} strokeLinejoin="round" />}
        {/* fryzury */}
        {l.style === 'buzz' && <path d="M35.5 30 Q37 16 50 16 Q63 16 64.5 30 Q58 23 50 23 Q42 23 35.5 30 Z" fill={l.hair} opacity=".8" />}
        {l.style === 'fade' && (
          <>
            <path d="M35.5 31 Q37 16 50 16 Q63 16 64.5 31 Q58 24 50 24 Q42 24 35.5 31 Z" fill={l.hair} opacity=".35" />
            <path d="M38 24 Q40 13 50 13 Q60 13 62 24 Q56 19 50 19 Q44 19 38 24 Z" fill={l.hair} />
          </>
        )}
        {l.style === 'top' && <path d="M35 31 Q34 13 50 13 Q67 13 65 31 Q62 21 55 22 Q50 18 44 22 Q38 21 35 31 Z" fill={l.hair} />}
        {l.style === 'slick' && <path d="M35 30 Q34 14 51 14 Q66 15 65 29 Q60 19 48 20 Q41 21 35 30 Z" fill={l.hair} />}
        {l.style === 'curly' && (
          <g fill={l.hair}>
            <circle cx="39" cy="22" r="5" />
            <circle cx="46" cy="17" r="5.5" />
            <circle cx="54" cy="17" r="5.5" />
            <circle cx="61" cy="22" r="5" />
            <circle cx="50" cy="20" r="5" />
          </g>
        )}
        {l.style === 'mohawk' && (
          <>
            <path d="M35.5 30 Q37 18 50 18 Q63 18 64.5 30 Q58 24 50 24 Q42 24 35.5 30 Z" fill={l.hair} opacity=".25" />
            <path d="M45 24 Q46 9 50 7 Q54 9 55 24 Q50 22 45 24 Z" fill={l.hair} />
          </>
        )}
        {l.style === 'cornrows' && (
          <>
            <path d="M35.5 30 Q37 16 50 16 Q63 16 64.5 30 Q58 23 50 23 Q42 23 35.5 30 Z" fill={l.hair} />
            <path d="M42 17.5 Q41 22 40 27 M47 16.3 L46.5 24 M53 16.3 L53.5 24 M58 17.5 Q59 22 60 27" stroke={l.skin} strokeOpacity=".5" strokeWidth=".8" />
          </>
        )}
        {(l.style === 'long' || l.style === 'bun') && <path d="M35 31 Q34 15 50 15 Q66 15 65 31 Q60 21 50 21 Q40 21 35 31 Z" fill={l.hair} />}
        {/* brwi i oczy */}
        <path d={`M40.5 ${31 + (l.brow === 2 ? 1 : 0)} L46.5 ${33.5 - (l.brow === 1 ? 1 : 0)} M53.5 ${33.5 - (l.brow === 1 ? 1 : 0)} L59.5 ${31 + (l.brow === 2 ? 1 : 0)}`} stroke={darken(l.hair, 0.6)} strokeWidth="2" strokeLinecap="round" />
        {l.scar && <path d="M57.5 29.5 L56 35" stroke="#fff" strokeOpacity=".55" strokeWidth=".9" strokeLinecap="round" />}
        {hurt ? (
          <>
            <path d="M42 36 l3 3 m0 -3 l-3 3 M55 36 l3 3 m0 -3 l-3 3" stroke="#2a1d16" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="57" cy="38.5" rx="3.6" ry="2.6" fill="#7c3a6b" opacity=".35" />
            <path d="M45 47 Q50 44 55 47" stroke="#2a1d16" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M42 37.5 Q44 36.2 46 37.5" stroke="#2a1d16" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M54 37.5 Q56 36.2 58 37.5" stroke="#2a1d16" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <circle cx="44" cy="38.2" r="1.3" fill="#2a1d16" />
            <circle cx="56" cy="38.2" r="1.3" fill="#2a1d16" />
            <path d="M46 47 L54 47" stroke="#2a1d16" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {/* nos */}
        <path d={l.nose ? 'M50 37 Q48.5 40 50.5 42 Q49 43.5 47.5 43' : 'M50 37 Q49 40.5 50 42.5 Q48.8 43.4 47.6 43'} stroke={skinDD} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        {/* ochraniacz na zęby */}
        {l.beard !== 'full' && <path d="M47 46.6 L53 46.6" stroke={glove} strokeWidth="1" strokeOpacity=".75" />}
        {/* ręce */}
        <path d={armL} stroke={`url(#sk${uid})`} strokeWidth={armW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={armR} stroke={`url(#sk${uid})`} strokeWidth={armW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {has('sleeveL') && <path d={armL} stroke={ink} strokeOpacity=".62" strokeWidth={armW - 3} strokeDasharray="2.5 1.6 5 2" fill="none" strokeLinecap="butt" />}
        {has('sleeveR') && <path d={armR} stroke={ink} strokeOpacity=".62" strokeWidth={armW - 3} strokeDasharray="4 2 1.5 2" fill="none" strokeLinecap="butt" />}
        {has('forearmBands') && <path d="M30 86 l7 -1 M30.5 83.5 l6.5 -1" stroke={ink} strokeOpacity=".6" strokeWidth="1.4" strokeLinecap="round" />}
        {/* rękawice MMA: wyściółka, otwarte palce, rzep */}
        {[
          { x: 27.5, y: 48 },
          { x: 55.5, y: 46.5 },
        ].map((gp, i) => (
          <g key={i}>
            <rect x={gp.x} y={gp.y} width="17" height="15" rx="6" fill={`url(#gl${uid})`} />
            <path d={`M${gp.x + 2.5} ${gp.y + 3.5} h12 M${gp.x + 2.5} ${gp.y + 6.5} h12`} stroke={gloveDark} strokeOpacity=".7" strokeWidth="1" />
            <path d={`M${gp.x + 3} ${gp.y + 1.2} q2 -1.6 4 0 q2 -1.6 4 0 q2 -1.6 4 0`} stroke={l.skin} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <rect x={gp.x - 0.5} y={gp.y + 13} width="18" height="6" rx="2" fill="#18181b" />
            <rect x={gp.x + 1} y={gp.y + 14.6} width="15" height="2.6" rx="1" fill="#fff" opacity=".85" />
          </g>
        ))}
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

/** Podgląd wyglądów zawodników (adres #zawodnicy). */
export function FighterGallery() {
  const names = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowski', 'Grabowski', 'Nowakowski', 'Pawłowski', 'Michalski', 'Silva', "O'Brien", 'Petrov', 'Magomedov'];
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
