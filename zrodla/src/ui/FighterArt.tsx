/**
 * Zawodnik w gardzie (popiersie), rysowany w kodzie w stylu ilustracji z kart:
 * ciemny kontur, 3–4 płaskie odcienie skóry, czarne rękawice 4 oz z taśmą w kolorze narożnika.
 * Wygląd (twarz, fryzura, zarost, budowa, tatuaże) wynika z ziarna, więc jest stały dla danej osoby.
 */
import { useId, type CSSProperties } from 'react';

const SKINS = ['#f7d7bd', '#f0c8a6', '#e6b48e', '#d9a07a', '#c68a62', '#a86d48', '#8a5537', '#6b3f28'];
const HAIRS = ['#16100c', '#2b1d14', '#4a3222', '#6b4a2b', '#9a6a3a', '#c9a15e', '#e3cc94', '#8a3b1c', '#3a3a40', '#b9b4ab'];
const EYES = ['#3b2a1d', '#4b3424', '#2f4f6b', '#4f6b3a', '#26303b'];
const INKS = ['#1c2840', '#232c3a', '#2a2140'];

type HairStyle = 'buzz' | 'bald' | 'fade' | 'crew' | 'slick' | 'curly' | 'mohawk' | 'long' | 'bun' | 'braids' | 'mullet' | 'spiky' | 'afro';
type BeardStyle = 'none' | 'stubble' | 'full' | 'short' | 'goatee' | 'stache' | 'horseshoe' | 'chinstrap';
type Tattoo = 'chestEagle' | 'chestScript' | 'sleeveL' | 'sleeveR' | 'tribal' | 'neck' | 'ribs' | 'star' | 'cross';

export interface FighterLook {
  skin: string;
  hair: string;
  eye: string;
  style: HairStyle;
  beard: BeardStyle;
  build: number;
  tattoos: Tattoo[];
  ink: string;
  ear: boolean;
  scar: boolean;
  nose: 0 | 1 | 2; // prosty, szeroki, złamany
  face: number; // 0 wąska … 2 szeroka
  jaw: number; // 0 łagodna … 2 kwadratowa
  brow: number; // 0 spokojne … 2 groźne
  eyeGap: number;
  chestHair: boolean;
  age: number; // 0 młody … 2 weteran (zmarszczki, siwizna)
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function seeded(seed: string) {
  let x = hash(seed) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 10000) / 10000;
  };
}

export function lookFor(seed: string): FighterLook {
  const r = seeded(seed);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];
  const skin = pick(SKINS);
  const dark = SKINS.indexOf(skin) >= 5;
  const styles: HairStyle[] = dark
    ? ['buzz', 'bald', 'fade', 'braids', 'afro', 'curly', 'fade', 'buzz', 'crew', 'mohawk']
    : ['buzz', 'bald', 'fade', 'crew', 'slick', 'curly', 'mohawk', 'bun', 'mullet', 'spiky', 'buzz', 'fade', 'crew', 'slick'];
  const beards: BeardStyle[] = ['none', 'none', 'none', 'stubble', 'stubble', 'full', 'short', 'goatee', 'stache', 'horseshoe', 'chinstrap'];
  const allTats: Tattoo[] = ['chestEagle', 'chestScript', 'sleeveL', 'sleeveR', 'tribal', 'neck', 'ribs', 'star', 'cross'];
  const tatCount = r() < 0.35 ? 0 : r() < 0.6 ? 1 : r() < 0.85 ? 2 : 3;
  const tattoos: Tattoo[] = [];
  for (let i = 0; i < tatCount; i++) {
    const t = pick(allTats);
    if (!tattoos.includes(t) && !(t.startsWith('chest') && tattoos.some((x) => x.startsWith('chest')))) tattoos.push(t);
  }
  const age = r() < 0.6 ? 0 : r() < 0.75 ? 1 : 2;
  let hair = dark ? pick(HAIRS.slice(0, 3)) : pick(HAIRS.slice(0, 9));
  if (age === 2 && r() < 0.7) hair = HAIRS[9];
  return {
    skin,
    hair,
    eye: dark ? EYES[0] : pick(EYES),
    style: pick(styles),
    beard: pick(beards),
    build: Math.floor(r() * 3),
    tattoos,
    ink: pick(INKS),
    ear: r() < 0.3,
    scar: r() < 0.25,
    nose: (r() < 0.6 ? 0 : r() < 0.55 ? 1 : 2) as 0 | 1 | 2,
    face: Math.floor(r() * 3),
    jaw: Math.floor(r() * 3),
    brow: Math.floor(r() * 3),
    eyeGap: r() * 1.4,
    chestHair: r() < 0.2,
    age,
  };
}

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}
function tint(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v + (255 - v) * k);
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

/** Budowa ciała wg kategorii wagowej (0 chudy … 3 ciężki z brzuchem). */
export const WEIGHT_BUILD: Record<string, number> = { piorkowa: 0, lekka: 0, polsrednia: 1, srednia: 1, polciezka: 2, ciezka: 3 };

const OUT = '#1d130e';

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
  const b = l.build;
  const S = l.skin;
  const SD = shade(S, 0.84); // cień
  const SDD = shade(S, 0.7); // głęboki cień
  const SL = tint(S, SKINS.indexOf(S) >= 5 ? 0.3 : 0.22); // światło
  const H = l.hair;
  const HD = shade(H, 0.7);
  const HL = tint(H, 0.25);
  const corn = corner === 'blue' ? '#1e88e5' : '#e11d48';
  const sh = shorts && /^#[0-9a-f]{6}$/i.test(shorts) ? shorts : corner === 'blue' ? '#1f2a8a' : '#7a1026';
  const ink = l.ink;
  const lw = 1.25; // grubość konturu

  // proporcje
  const hw = 14.4 + l.face * 0.8 + b * 0.45; // pół szerokości czaszki
  const jw = hw - 3.2 + l.jaw * 1.1 + b * 0.5; // pół szerokości żuchwy
  const sw = [24, 27, 30, 33][b]; // pół szerokości barków
  const nw = [7.4, 8.6, 10, 11.4][b]; // pół szerokości szyi
  const wa = [17, 19, 22, 27][b]; // pół szerokości pasa
  const ua = [8.4, 9.6, 11, 12][b]; // grubość ramienia
  const fa = [7.6, 8.6, 9.6, 10.4][b]; // grubość przedramienia
  const belly = b >= 3;
  const has = (t: Tattoo) => l.tattoos.includes(t);
  const L = (x: number) => 50 - x;
  const R = (x: number) => 50 + x;

  const head = `M50 7.5 C${L(hw * 0.74)} 7.5 ${L(hw)} 14.5 ${L(hw)} 25.5 C${L(hw)} 32 ${L(hw - 0.4)} 37.5 ${L(jw)} 43 C${L(jw - 2.2)} 48.6 ${L(6)} 52.6 50 52.6 C${R(6)} 52.6 ${R(jw - 2.2)} 48.6 ${R(jw)} 43 C${R(hw - 0.4)} 37.5 ${R(hw)} 32 ${R(hw)} 25.5 C${R(hw)} 14.5 ${R(hw * 0.74)} 7.5 50 7.5 Z`;
  const half = (X: (x: number) => number) =>
    `C${X(nw + 3)} 56 ${X(sw - 8)} 58 ${X(sw - 3)} 61 C${X(sw + 1)} 62.5 ${X(sw + 1.5)} 68 ${X(sw)} 74 C${X(sw - 1)} 84 ${X(wa + 1)} 98 ${X(wa)} 113`;
  const torso = `M${L(nw)} 46 L${L(nw)} 50 ${half(L)} L${R(wa)} 113 C${R(wa + 1)} 98 ${R(sw - 1)} 84 ${R(sw)} 74 C${R(sw + 1.5)} 68 ${R(sw + 1)} 62.5 ${R(sw - 3)} 61 C${R(sw - 8)} 58 ${R(nw + 3)} 56 ${R(nw)} 50 L${R(nw)} 46 Z`;
  // ręce w gardzie: bark → łokieć → rękawica przy brodzie
  const sL = { x: L(sw - 2.6), y: 70 };
  const eL = { x: L(sw - 3), y: 95 };
  const gL = { x: L(15.2), y: 57 };
  const wL = { x: gL.x + 0.4, y: gL.y + 13.5 };
  const sR = { x: R(sw - 2.6), y: 70 };
  const eR = { x: R(sw - 3), y: 95 };
  const gR = { x: R(15.2), y: 56.5 };
  const wR = { x: gR.x - 0.4, y: gR.y + 13.5 };
  /** Kończyna jako zwężający się kształt z zaokrąglonym końcem (łokciem) w punkcie a. */
  const limb = (a: { x: number; y: number }, c: { x: number; y: number }, wa_: number, wc_: number, key: string, bulge = 0, shadeK = 0.3, tat = false) => {
    const dx = c.x - a.x;
    const dy = c.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const d = { x: dx / len, y: dy / len };
    const n = { x: -d.y, y: d.x };
    const ha = wa_ / 2;
    const hc = wc_ / 2;
    const P = (o: { x: number; y: number }, k: number, m = 0) => `${(o.x + n.x * k - d.x * m).toFixed(2)} ${(o.y + n.y * k - d.y * m).toFixed(2)}`;
    const mid = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };
    const sideA = `M${P(c, hc)} Q${P(mid, (ha + hc) / 2 + bulge)} ${P(a, ha)} `;
    const cap = `C${P(a, ha, ha * 1.33)} ${P(a, -ha, ha * 1.33)} ${P(a, -ha)} `;
    const sideB = `Q${P(mid, -(ha + hc) / 2 - bulge * 0.4)} ${P(c, -hc)}`;
    const shadeSide = shadeK >= 0 ? 1 : -1;
    const sk = Math.abs(shadeK);
    const shadeD = `M${P(c, shadeSide * hc)} L${P(a, shadeSide * ha)} L${P(a, shadeSide * ha * (1 - sk * 2))} L${P(c, shadeSide * hc * (1 - sk * 2))} Z`;
    const cid = `lc${uid}${key}`;
    return (
      <g key={key}>
        <clipPath id={cid}>
          <path d={sideA + cap + sideB + ' Z'} />
        </clipPath>
        <path d={sideA + cap + sideB + ' Z'} fill={S} />
        <g clipPath={`url(#${cid})`}>
          <path d={shadeD} fill={SD} />
          {tat && (
            <g fill="none" stroke={ink} strokeOpacity=".62" strokeLinecap="round" strokeLinejoin="round">
              {[0.18, 0.36, 0.54, 0.72].map((t) => {
                const o = { x: a.x + dx * t, y: a.y + dy * t };
                const k = ha + (hc - ha) * t;
                return <path key={t} d={`M${P(o, -k)} Q${P(o, -k * 0.2, -1.6)} ${P(o, 0, -2.6)} Q${P(o, k * 0.2, -1.6)} ${P(o, k)}`} strokeWidth="1.1" />;
              })}
              <path d={`M${P({ x: a.x + dx * 0.86, y: a.y + dy * 0.86 }, -hc)} L${P({ x: a.x + dx * 0.86, y: a.y + dy * 0.86 }, hc)}`} strokeWidth="1.6" />
            </g>
          )}
          <path d={`M${P(c, -shadeSide * hc * 0.35)} L${P(a, -shadeSide * ha * 0.35)}`} stroke={SL} strokeWidth={Math.min(ha, hc) * 0.5} strokeLinecap="round" opacity=".5" />
        </g>
        <path d={sideA + cap + sideB} fill="none" stroke={OUT} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  };

  /** Bark (deltoid) nakładany na górę ramienia. */
  const delt = (X: (x: number) => number, sgn: number, key: string) => {
    const outer = `M${X(sw - 6.5)} 60.6 C${X(sw)} 59.4 ${X(sw + 3.6)} 63 ${X(sw + 3.4)} 69.4 C${X(sw + 3.2)} 74 ${X(sw + 1.4)} 77.4 ${X(sw - 0.8)} 79`;
    const inner = `C${X(sw - 4)} 76.6 ${X(sw - 6.6)} 71 ${X(sw - 7.6)} 66.6 C${X(sw - 8)} 64 ${X(sw - 7.6)} 61.6 ${X(sw - 6.5)} 60.6`;
    const shadeD = `M${X(sw + 3.5)} 66 C${X(sw + 3.2)} 74 ${X(sw + 1.4)} 77.4 ${X(sw - 0.8)} 79 C${X(sw - 1.4)} 75 ${X(sw - 0.6)} 69 ${X(sw + 1.2)} 64 Z`;
    return (
      <g key={key}>
        <path d={outer + ' ' + inner + ' Z'} fill={S} />
        <path d={shadeD} fill={sgn < 0 ? SD : SD} opacity={sgn < 0 ? 0.85 : 1} />
        <path d={`M${X(sw - 5.4)} 63.2 Q${X(sw - 2.4)} 62.4 ${X(sw - 1)} 64.6`} stroke={SL} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".6" />
        <path d={outer} fill="none" stroke={OUT} strokeWidth={lw} strokeLinecap="round" />
        <path d={`M${X(sw - 0.8)} 79 ${inner}`} fill="none" stroke={OUT} strokeOpacity=".3" strokeWidth=".8" strokeLinecap="round" />
      </g>
    );
  };

  const eyeY = 30.6;
  const ex = 5.6 + l.eyeGap;
  const browY = 26.4 - (l.brow === 2 ? 0 : 0.4);
  const browW = 1.7 + (l.brow === 2 ? 0.5 : 0) + (b >= 2 ? 0.2 : 0);


  /** Linia włosów z bakami: domyka czapkę włosów od prawej skroni do lewej. */
  const hairline = (fy: number, sb = 30, peak = 0.6, start = 22) =>
    `L${R(hw + 0.4)} ${start} L${R(hw - 0.1)} ${sb} L${R(hw - 2.1)} ${sb} L${R(hw - 2.5)} 21 C${R(hw - 3.4)} ${fy + 2.4} ${R(8)} ${fy + 0.6} ${R(4)} ${fy} Q50 ${fy + peak} ${L(4)} ${fy} C${L(8)} ${fy + 0.6} ${L(hw - 3.4)} ${fy + 2.4} ${L(hw - 2.5)} 21 L${L(hw - 2.1)} ${sb} L${L(hw - 0.1)} ${sb} L${L(hw + 0.4)} ${start} Z`;
  const top = (t: number, start = 22, puff = 1) =>
    `M${L(hw + 0.4)} ${start} C${L(hw + puff)} 12 ${L(hw * 0.6)} ${t} 50 ${t} C${R(hw * 0.6)} ${t} ${R(hw + puff)} 12 ${R(hw + 0.4)} ${start}`;
  const renderHair = () => {
    const st = l.style;
    const ol = { stroke: OUT, strokeWidth: lw, strokeLinejoin: 'round' as const };
    const shine = (y: number, w = 7) => <path d={`M${L(w)} ${y + 1.4} Q${L(w * 0.3)} ${y - 0.2} ${R(w * 0.2)} ${y}`} stroke={HL} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".55" />;
    if (st === 'bald') return <ellipse cx={L(4)} cy="12.6" rx="5" ry="2.2" fill="#fff" opacity=".22" />;
    if (st === 'buzz' || st === 'mohawk' || st === 'fade' || st === 'braids') {
      const sideOp = st === 'buzz' ? 0.82 : st === 'braids' ? 1 : 0.42;
      return (
        <g>
          <path d={top(7.4, 22, 0.6) + ' ' + hairline(14.6, 29.6)} fill={H} opacity={sideOp} />
          <path d={`M${L(hw - 2.5)} 21 C${L(hw - 3.4)} 17 ${L(8)} 15.2 ${L(4)} 14.6 Q50 15.2 ${R(4)} 14.6 C${R(8)} 15.2 ${R(hw - 3.4)} 17 ${R(hw - 2.5)} 21`} stroke={HD} strokeWidth=".6" fill="none" opacity={sideOp * 0.8} />
          {st === 'buzz' && shine(10)}
          {st === 'fade' && (
            <>
              <path d={`M${L(hw - 2.8)} 18.6 C${L(hw - 2.2)} 8 ${L(5)} 4.6 50 4.6 C${R(5)} 4.6 ${R(hw - 2.2)} 8 ${R(hw - 2.8)} 18.6 C${R(hw - 4)} 15.6 ${R(6)} 13.8 ${R(2)} 14.6 C${L(3)} 13.2 ${L(8)} 14.6 ${L(hw - 2.8)} 18.6 Z`} fill={H} {...ol} />
              {shine(8.4)}
            </>
          )}
          {st === 'mohawk' && (
            <>
              <path d="M45.6 16.4 C45 9.6 46.6 4.6 50 1.4 C53.4 4.6 55 9.6 54.4 16.4 Q50 14.6 45.6 16.4 Z" fill={H} {...ol} />
              <path d="M50 3.4 Q49 9 50 15" stroke={HL} strokeWidth=".9" fill="none" opacity=".6" />
            </>
          )}
          {st === 'braids' && (
            <g>
              <path d={top(7.4, 22, 0.6)} fill="none" {...ol} />
              {[-9.5, -4.8, 0, 4.8, 9.5].map((dx) => (
                <path key={dx} d={`M${50 + dx * 0.55} ${15.4 - Math.abs(dx) * 0.1} Q${50 + dx * 0.9} 10 ${50 + dx * 0.75} 6.8`} stroke={HD} strokeWidth="1" fill="none" strokeLinecap="round" />
              ))}
              {[-7.2, -2.4, 2.4, 7.2].map((dx) => (
                <path key={dx} d={`M${50 + dx * 0.55} 14.6 Q${50 + dx * 0.9} 10.6 ${50 + dx * 0.8} 8`} stroke={HL} strokeWidth=".7" strokeDasharray="1.2 1" fill="none" opacity=".7" />
              ))}
            </g>
          )}
          {st !== 'braids' && st !== 'fade' && st !== 'mohawk' && <path d={top(7.4, 22, 0.6)} fill="none" stroke={OUT} strokeWidth=".8" opacity=".8" />}
        </g>
      );
    }
    if (st === 'crew' || st === 'spiky' || st === 'slick' || st === 'bun' || st === 'mullet') {
      const sl = st === 'slick' || st === 'bun';
      const t = sl ? 4.4 : 5;
      return (
        <g>
          {st === 'bun' && <circle cx={R(2)} cy="5" r="3.8" fill={H} {...ol} />}
          {st === 'spiky' && (
            <>
              <path d={`M${L(hw - 0.6)} 13 C${L(hw - 1)} 8.6 ${L(hw - 3)} 6.4 ${L(hw - 4.6)} 5.6 L${L(hw - 6.6)} 3.6 L${L(5.4)} 4.8 L${L(2.6)} 2 L${L(0.2)} 4 L${R(3.4)} 1.8 L${R(4.6)} 4.4 L${R(8.6)} 3.2 L${R(hw - 4)} 6.4 C${R(hw - 2)} 7.4 ${R(hw - 0.8)} 9.6 ${R(hw - 0.4)} 13 Z`} fill={H} {...ol} />
              <path d={`M${L(5.4)} 4.6 L${L(3.6)} 8.6 M${L(0.2)} 3.8 L${R(1)} 8 M${R(4.6)} 4.2 L${R(5.4)} 8.4`} stroke={HD} strokeWidth=".7" strokeLinecap="round" />
              {shine(9.6, 6)}
            </>
          )}
          <path d={top(t, 22.5, 1.6) + ' ' + hairline(sl ? 14.2 : 15, 29.4, 0.4, 22.5)} fill={H} {...ol} />
          {(st === 'crew' || st === 'mullet') && (
            <>
              <path d={`M${L(5)} 14.6 Q${L(4)} 11 ${L(1)} 8.6 M${R(1)} 14.8 Q${R(2)} 11.4 ${R(5)} 9.2 M${L(hw - 3)} 18 Q${L(hw - 3.4)} 13 ${L(hw - 6)} 10`} stroke={HD} strokeWidth=".7" fill="none" strokeLinecap="round" opacity=".8" />
              {shine(9)}
            </>
          )}
          {sl && (
            <>
              <path d={`M${L(5)} 5.8 Q${L(5.6)} 10 ${L(5)} 14.4`} stroke={HD} strokeWidth=".8" fill="none" />
              <path d={`M${L(3)} 13.6 Q${R(2)} 8 ${R(hw - 3.2)} 11.6 M${L(1)} 14 Q${R(5)} 10.8 ${R(hw - 3.6)} 15.6 M${L(8)} 14 Q${L(9.6)} 10 ${L(hw - 3)} 13.6`} stroke={HL} strokeWidth=".75" fill="none" opacity=".75" strokeLinecap="round" />
            </>
          )}
        </g>
      );
    }
    if (st === 'curly' || st === 'afro') {
      const bumps: [number, number, number][] =
        st === 'curly'
          ? [[-hw + 1.6, 19.6, 3.6], [-hw + 3.4, 13.6, 4.2], [-7.6, 8.6, 4.6], [-2.6, 6.4, 4.8], [2.8, 6.4, 4.8], [7.8, 8.6, 4.6], [hw - 3.4, 13.6, 4.2], [hw - 1.6, 19.6, 3.6], [-5, 13.4, 4], [0, 12.4, 4.2], [5, 13.4, 4]]
          : [[-hw - 1.4, 19, 4.6], [-hw + 1, 11, 5.4], [-6, 6.4, 5.6], [0.6, 5, 5.8], [7, 6.4, 5.6], [hw - 1, 11, 5.4], [hw + 1.4, 19, 4.6], [-4, 11, 5], [4.4, 11, 5]];
      return (
        <g>
          <path d={top(8, 22, 1) + ' ' + hairline(15.2, 29, 0.4)} fill={H} />
          <g fill={H} stroke={OUT} strokeWidth=".9">
            {bumps.map(([dx, cy, r], i) => (
              <circle key={i} cx={50 + dx} cy={cy} r={r} />
            ))}
          </g>
          <g fill={H}>
            {bumps.slice(1, -1).map(([dx, cy, r], i) => (
              <circle key={i} cx={50 + dx * 0.92} cy={cy + 1} r={r * 0.82} />
            ))}
          </g>
          <g stroke={tint(H, 0.38)} strokeWidth=".75" fill="none" opacity=".75" strokeLinecap="round">
            {bumps.map(([dx, cy, r], i) => (
              <path key={i} d={`M${50 + dx - r * 0.5} ${cy - r * 0.2} q${r * 0.4} ${-r * 0.5} ${r * 0.9} ${-r * 0.2}`} />
            ))}
          </g>
          <path d={`M${L(hw - 2.5)} 21 C${L(hw - 3.4)} 17.6 ${L(8)} 15.8 ${L(4)} 15.2 Q50 15.6 ${R(4)} 15.2 C${R(8)} 15.8 ${R(hw - 3.4)} 17.6 ${R(hw - 2.5)} 21`} stroke={OUT} strokeWidth=".8" fill="none" />
        </g>
      );
    }
    // long, bun, mullet: przedziałek pośrodku, pasma opadają na boki
    return (
      <g>
        <path d={`${top(5.2, 30, 2.4)} L${R(hw + 1)} 36 C${R(hw - 1)} 30 ${R(hw - 2)} 22 ${R(hw - 3.6)} 18.6 C${R(7)} 15 ${R(2)} 14.4 50 10.6 C${L(2)} 14.4 ${L(7)} 15 ${L(hw - 3.6)} 18.6 C${L(hw - 2)} 22 ${L(hw - 1)} 30 ${L(hw + 1)} 36 Z`} fill={H} {...ol} />
        <path d="M50 5.4 L50 10.4" stroke={HD} strokeWidth=".9" />
        <path d={`M${L(2)} 7.4 Q${L(hw - 2)} 10 ${L(hw)} 24 M${R(2)} 7.4 Q${R(hw - 2)} 10 ${R(hw)} 24`} stroke={HL} strokeWidth=".8" fill="none" opacity=".55" strokeLinecap="round" />
      </g>
    );
  };

  const glove = (g: { x: number; y: number }, flip: boolean, k: string) => {
    const x = g.x - 8;
    const y = g.y - 8.6;
    return (
      <g key={k} transform={`translate(${g.x} ${g.y}) scale(${flip ? -1.26 : 1.26} 1.26) translate(${-g.x} ${-g.y})`}>
        {/* taśma (rzep) w kolorze narożnika */}
        <path d={`M${x + 2.4} ${y + 13.4} h11.2 v6.4 q0 1.4 -1.4 1.4 h-8.4 q-1.4 0 -1.4 -1.4 Z`} fill={corn} stroke={OUT} strokeWidth={lw} />
        <path d={`M${x + 3.8} ${y + 16.6} h8.4`} stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" />
        {/* wyściółka knykci */}
        <path d={`M${x + 1} ${y + 7} C${x + 1} ${y + 1.4} ${x + 4} ${y} ${x + 8} ${y} C${x + 12.6} ${y} ${x + 15.4} ${y + 1.6} ${x + 15.4} ${y + 6.6} L${x + 15} ${y + 13.6} Q${x + 8} ${y + 15.2} ${x + 1.6} ${y + 13.6} Z`} fill="#24262c" stroke={OUT} strokeWidth={lw} strokeLinejoin="round" />
        <path d={`M${x + 3} ${y + 3.4} C${x + 5} ${y + 1.6} ${x + 9} ${y + 1.4} ${x + 11} ${y + 2.6}`} stroke="#5a5e68" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* palce i kciuk */}
        <path d={`M${x + 2.4} ${y + 9.6} Q${x + 8} ${y + 11} ${x + 14} ${y + 9.4}`} stroke="#0f1013" strokeWidth=".9" fill="none" />
        <path d={`M${x + 5.6} ${y + 9.8} v3 M${x + 8.8} ${y + 10.2} v3 M${x + 12} ${y + 9.9} v3`} stroke="#0f1013" strokeWidth=".7" />
        <path d={`M${x + 1.4} ${y + 9.2} q-1.6 2.6 .6 4.4 q2.6 .8 4 -.4`} fill="#2c2f36" stroke={OUT} strokeWidth=".9" />
      </g>
    );
  };

  return (
    <svg className={`fighter-art ${className ?? ''}`} style={style} width={size} height={size * 1.2} viewBox="6 0 88 105.6" aria-hidden="true">
      <defs>
        <clipPath id={`hc${uid}`}>
          <path d={head} />
        </clipPath>
        <clipPath id={`tc${uid}`}>
          <path d={torso} />
        </clipPath>
        <filter id={`fo${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology operator="dilate" radius="0.9" in="SourceAlpha" result="d" />
          <feFlood floodColor="#c9d6ee" floodOpacity=".16" />
          <feComposite in2="d" operator="in" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#fo${uid})`}>
      <g transform={mirror ? 'translate(100 0) scale(-1 1)' : undefined} strokeLinejoin="round">
        {/* włosy z tyłu */}
        {l.style === 'long' && <path d={`M${L(hw + 1)} 20 C${L(hw + 4)} 40 ${L(hw + 2)} 54 ${L(nw + 6)} 60 L${R(nw + 6)} 60 C${R(hw + 2)} 54 ${R(hw + 4)} 40 ${R(hw + 1)} 20 Z`} fill={HD} stroke={OUT} strokeWidth={lw} />}
        {l.style === 'mullet' && <path d={`M${L(hw - 1)} 30 C${L(hw + 1.5)} 46 ${L(nw + 3)} 56 ${L(nw + 2)} 58 L${R(nw + 2)} 58 C${R(nw + 3)} 56 ${R(hw + 1.5)} 46 ${R(hw - 1)} 30 Z`} fill={HD} stroke={OUT} strokeWidth={lw} />}
        {l.style === 'afro' && <path d={`M50 2 C${L(hw + 7)} 2 ${L(hw + 8)} 20 ${L(hw + 3.4)} 29 L${R(hw + 3.4)} 29 C${R(hw + 8)} 20 ${R(hw + 7)} 2 50 2 Z`} fill={H} stroke={OUT} strokeWidth={lw} />}

        {/* tułów */}
        <path d={torso} fill={S} stroke={OUT} strokeWidth={lw} />
        <g clipPath={`url(#tc${uid})`}>
          {/* cień boków i pod szyją */}
          <path d={`M${L(sw + 2)} 60 L${L(sw - 5)} 60 L${L(wa - 4)} 114 L${L(wa + 4)} 114 Z`} fill={SD} />
          <path d={`M${R(sw + 2)} 60 L${R(sw - 5)} 60 L${R(wa - 4)} 114 L${R(wa + 4)} 114 Z`} fill={SD} />
          {/* obojczyki */}
          <path d={`M${L(nw + 1)} 60.5 Q${L(sw * 0.5)} 62.5 ${L(sw - 5)} 61.5 M${R(nw + 1)} 60.5 Q${R(sw * 0.5)} 62.5 ${R(sw - 5)} 61.5`} stroke={SDD} strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".8" />
          {/* klatka */}
          <path d={`M${L(sw - 6)} 73 C${L(sw - 7)} 84 ${L(4)} 86.5 ${L(1)} 82 L${L(1)} 70 Z`} fill={SL} opacity=".35" />
          <path d={`M${L(sw - 6.5)} 82 C${L(sw * 0.55)} 88.5 ${L(4)} 87.5 ${L(0.8)} 82.5 M${R(sw - 6.5)} 82 C${R(sw * 0.55)} 88.5 ${R(4)} 87.5 ${R(0.8)} 82.5`} stroke={OUT} strokeOpacity=".55" strokeWidth=".9" fill="none" strokeLinecap="round" />
          <path d={`M${L(sw - 6.5)} 82 C${L(sw * 0.55)} 88.5 ${L(4)} 87.5 ${L(0.8)} 82.5 L${L(0.8)} 85 C${L(5)} 90 ${L(sw * 0.55)} 90.5 ${L(sw - 6.5)} 84 Z M${R(sw - 6.5)} 82 C${R(sw * 0.55)} 88.5 ${R(4)} 87.5 ${R(0.8)} 82.5 L${R(0.8)} 85 C${R(5)} 90 ${R(sw * 0.55)} 90.5 ${R(sw - 6.5)} 84 Z`} fill={SD} />
          <circle cx={L(sw * 0.4)} cy="81.2" r=".7" fill={SDD} />
          <circle cx={R(sw * 0.4)} cy="81.2" r=".7" fill={SDD} />
          {/* brzuch */}
          {belly ? (
            <g>
              <path d={`M${L(wa + 1)} 89 C${L(wa)} 104 ${R(wa)} 104 ${R(wa + 1)} 89 C${R(wa - 4)} 85 ${L(wa - 4)} 85 ${L(wa + 1)} 89 Z`} fill={S} stroke={OUT} strokeOpacity=".5" strokeWidth=".9" />
              <path d={`M${L(wa - 2)} 95 C${L(8)} 102 ${R(8)} 102 ${R(wa - 2)} 95`} stroke={SDD} strokeWidth="1.1" fill="none" opacity=".7" />
              <path d="M49.2 93 q.8 1.3 0 2.4" stroke={OUT} strokeOpacity=".6" strokeWidth=".9" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g stroke={OUT} strokeOpacity={b === 0 ? 0.32 : 0.45} strokeWidth=".85" fill="none" strokeLinecap="round">
              <path d="M50 87.4 L50 99" />
              <path d={`M${L(7.2)} 91 Q${L(3.5)} 92.3 ${L(0.8)} 91.5 M${R(7.2)} 91 Q${R(3.5)} 92.3 ${R(0.8)} 91.5`} />
              <path d={`M${L(6.8)} 95.6 Q${L(3.5)} 96.7 ${L(0.8)} 96 M${R(6.8)} 95.6 Q${R(3.5)} 96.7 ${R(0.8)} 96`} />
              {b >= 1 && <path d={`M${L(8)} 88.6 Q${L(8.3)} 93 ${L(7.4)} 97.6 M${R(8)} 88.6 Q${R(8.3)} 93 ${R(7.4)} 97.6`} />}
              <path d="M49.4 98 q.6 1 0 1.8" />
            </g>
          )}
          {/* tatuaże na korpusie */}
          {has('chestEagle') && (
            <g fill={ink} fillOpacity=".72">
              <path d="M50 70.6 C51.4 70.6 52 72 51.4 73.2 C54 71.8 57.6 70.4 61.4 70.8 C59.4 72 58.6 72.6 58.2 73.4 C59.4 73.2 60.4 73.4 61 74 C59 74.4 57.6 75 56.6 76 C55.2 76.2 53.4 76.6 52.4 77.6 L53.4 80.6 L50 79.2 L46.6 80.6 L47.6 77.6 C46.6 76.6 44.8 76.2 43.4 76 C42.4 75 41 74.4 39 74 C39.6 73.4 40.6 73.2 41.8 73.4 C41.4 72.6 40.6 72 38.6 70.8 C42.4 70.4 46 71.8 48.6 73.2 C48 72 48.6 70.6 50 70.6 Z" />
              <circle cx="50" cy="71.8" r=".45" fill={S} fillOpacity="1" />
            </g>
          )}
          {has('chestScript') && <path d={`M${L(11)} 76.4 c.6 -2.6 1.8 -2.6 1.2 0 c-.2 .8 .6 1 1 .2 l.8 -2.8 l-.2 3 c.4 -1.4 1.4 -1.6 1.4 -.2 c0 .8 .8 .8 1.2 0 c.4 -1 1.2 -1.2 1.4 -.2 c.2 .8 .8 .6 1 0 l.9 -3 l-.3 3.2 c.6 -1 1.4 -1.2 1.6 0 c.2 .8 1 .6 1.2 -.2 c.4 -1.2 1.4 -1 1.4 0 c0 .8 .8 .8 1.2 0 l.6 -2.6 l-.1 2.8 c.5 -1 1.3 -1.1 1.5 0 c.2 .8 1 .6 1.2 -.2 c.3 -1 1.2 -1 1.4 .1`} stroke={ink} strokeOpacity=".72" strokeWidth=".6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          {has('ribs') && <path d={`M${R(wa - 6)} 88 l5 -1.6 M${R(wa - 6)} 91 l5 -1.4 M${R(wa - 5.5)} 94 l4 -1`} stroke={ink} strokeOpacity=".7" strokeWidth=".9" strokeLinecap="round" />}
          {has('star') && <path d={`M${L(12)} 89 l1.4 3 3.2 .4 -2.4 2.1 .7 3.2 -2.9 -1.7 -2.9 1.7 .7 -3.2 -2.4 -2.1 3.2 -.4 z`} fill={ink} fillOpacity=".75" />}
          {has('cross') && <path d={`M${R(11)} 72 v7 M${R(8.7)} 74.2 h4.6`} stroke={ink} strokeOpacity=".8" strokeWidth="1.3" strokeLinecap="round" />}
          {has('tribal') && <path d={`M${L(sw - 1)} 64 q5 -3.5 9 -1 q-3 1.6 -2 4.4 q2 -2.6 6 -2.4`} stroke={ink} strokeOpacity=".7" strokeWidth="1.5" fill="none" strokeLinecap="round" />}
        </g>

        {/* spodenki */}
        <path d={`M${L(wa + 2.2)} 100 Q50 102.6 ${R(wa + 2.2)} 100 L${R(wa + 4)} 121 L${L(wa + 4)} 121 Z`} fill={sh} stroke={OUT} strokeWidth={lw} />
        <path d={`M${L(wa + 2.2)} 100 Q50 102.6 ${R(wa + 2.2)} 100 L${R(wa + 2.5)} 103.6 Q50 106.4 ${L(wa + 2.5)} 103.6 Z`} fill={shade(sh, 0.62)} />
        <path d={`M${L(wa + 2.2)} 101.6 Q50 104.4 ${R(wa + 2.2)} 101.6`} stroke="#fff" strokeOpacity=".35" strokeWidth=".6" fill="none" />
        <path d={`M${L(wa + 0.6)} 104.8 L${L(wa + 1.8)} 121 M${R(wa + 0.6)} 104.8 L${R(wa + 1.8)} 121`} stroke={corn} strokeWidth="1.8" />
        {belt && (
          <g>
            <path d={`M${L(wa + 2.4)} 95 Q50 99.6 ${R(wa + 2.4)} 95 L${R(wa + 2.8)} 103.4 Q50 108 ${L(wa + 2.8)} 103.4 Z`} fill="#141418" stroke={OUT} strokeWidth={lw} />
            <path d="M39 93.6 L61 93.6 L63.2 100.4 L50 107.6 L36.8 100.4 Z" fill="#f5b700" stroke="#7a5600" strokeWidth="1" />
            <path d="M42.4 95.8 L57.6 95.8 L59.2 100.4 L50 105.2 L40.8 100.4 Z" fill="#ffd54a" />
            <path d="M43.6 96.6 L50 96.6 L47 99.6 Z" fill="#fff6c9" opacity=".7" />
            <circle cx="50" cy="100.2" r="2.6" fill="#e11d48" stroke="#7a5600" strokeWidth=".6" />
            <circle cx="49.3" cy="99.4" r=".7" fill="#fff" opacity=".7" />
          </g>
        )}

        {/* szyja */}
        <path d={`M${L(nw)} 44 L${L(nw + 0.3)} 52 C${L(nw + 1.6)} 55.5 ${L(nw + 2.6)} 57 ${L(nw + 3.4)} 58 L${R(nw + 3.4)} 58 C${R(nw + 2.6)} 57 ${R(nw + 1.6)} 55.5 ${R(nw + 0.3)} 52 L${R(nw)} 44 Z`} fill={S} />
        <path d={`M${L(nw)} 44 L${L(nw + 0.3)} 52 C${L(nw + 1.6)} 55.5 ${L(nw + 2.6)} 57 ${L(nw + 3.4)} 58 M${R(nw)} 44 L${R(nw + 0.3)} 52 C${R(nw + 1.6)} 55.5 ${R(nw + 2.6)} 57 ${R(nw + 3.4)} 58`} fill="none" stroke={OUT} strokeWidth={lw} strokeLinecap="round" />
        <path d={`M${L(nw - 2.2)} 49 Q${L(1.6)} 55 ${L(1.2)} 57.6 M${R(nw - 2.2)} 49 Q${R(1.6)} 55 ${R(1.2)} 57.6`} stroke={SDD} strokeWidth=".6" fill="none" strokeLinecap="round" opacity=".3" />
        <path d="M48.6 57.8 Q50 58.8 51.4 57.8" stroke={SDD} strokeWidth=".6" fill="none" strokeLinecap="round" opacity=".45" />
        <path d={`M${L(nw)} 46 Q50 53.5 ${R(nw)} 46 L${R(nw)} 50.5 Q50 57 ${L(nw)} 50.5 Z`} fill={SD} />
        {b >= 2 && <path d={`M${L(nw - 2)} 50 L${L(nw - 3)} 56 M${R(nw - 2)} 50 L${R(nw - 3)} 56`} stroke={SDD} strokeWidth=".8" opacity=".7" />}
        {has('neck') && <path d={`M${R(nw - 3)} 47.5 q2 1 1.6 3.6 q-1.6 -1 -3 0 q.4 -2.2 1.4 -3.6 z`} fill={ink} fillOpacity=".7" />}

        {/* uszy */}
        {[-1, 1].map((sgn) => {
          const x0 = 50 + sgn * (hw - 0.6);
          return (
            <g key={sgn}>
              <path d={`M${x0} 25.5 C${x0 + sgn * 4.6} 23 ${x0 + sgn * 5.4} 34 ${x0 + sgn * 0.6} 37.5 Z`} fill={l.ear && sgn < 0 ? SD : S} stroke={OUT} strokeWidth={lw} />
              <path d={`M${x0 + sgn * 1.2} 28 C${x0 + sgn * 3.4} 27.5 ${x0 + sgn * 3.4} 32.5 ${x0 + sgn * 1.4} 34`} stroke={SDD} strokeWidth=".9" fill="none" strokeLinecap="round" />
              {l.ear && sgn < 0 && <path d={`M${x0 - 2.6} 27.5 q-1 1.6 .2 3 q-1.2 1.6 .2 3.4`} stroke={OUT} strokeWidth=".8" fill="none" strokeLinecap="round" />}
            </g>
          );
        })}

        {/* głowa */}
        <path d={head} fill={S} stroke={OUT} strokeWidth={lw} />
        <g clipPath={`url(#hc${uid})`}>
          {/* cienie twarzy: skronie, policzki, żuchwa */}
          <path d={`M${L(hw)} 20 C${L(hw - 3)} 28 ${L(hw - 2)} 38 ${L(jw - 3)} 46 L${L(hw + 2)} 50 Z`} fill={SD} />
          <path d={`M${R(hw)} 20 C${R(hw - 3)} 28 ${R(hw - 2)} 38 ${R(jw - 3)} 46 L${R(hw + 2)} 50 Z`} fill={SD} opacity=".7" />
          <path d={`M${L(jw - 1)} 45 C${L(6)} 51.5 ${R(6)} 51.5 ${R(jw - 1)} 45 L${R(jw + 2)} 54 L${L(jw + 2)} 54 Z`} fill={SD} opacity=".55" />
          <ellipse cx={L(4)} cy="16" rx="6" ry="3.6" fill={SL} opacity=".55" />
          {l.age === 2 && <path d={`M${L(6)} 20.5 Q50 19.5 ${R(6)} 20.5 M${L(4.5)} 22.6 Q50 21.8 ${R(4.5)} 22.6`} stroke={SDD} strokeWidth=".6" fill="none" opacity=".7" />}
          {l.age === 2 && <path d={`M${L(6.2)} 38.5 Q${L(5.2)} 42 ${L(3.8)} 44.2 M${R(6.2)} 38.5 Q${R(5.2)} 42 ${R(3.8)} 44.2`} stroke={SDD} strokeWidth=".7" fill="none" strokeLinecap="round" />}
          {/* zarost */}
          {l.beard === 'stubble' && <path d={`M${L(jw + 1)} 36 C${L(jw)} 46 ${L(6)} 53 50 53 C${R(6)} 53 ${R(jw)} 46 ${R(jw + 1)} 36 C${R(jw - 3)} 41.5 ${R(4)} 43 50 42.8 C${L(4)} 43 ${L(jw - 3)} 41.5 ${L(jw + 1)} 36 Z`} fill={H} opacity=".3" />}
          {(l.beard === 'full' || l.beard === 'short') && (
            <path d={`M${L(hw)} 30 C${L(jw + 0.5)} 46 ${L(7)} ${l.beard === 'full' ? 57 : 54.5} 50 ${l.beard === 'full' ? 57 : 54.5} C${R(7)} ${l.beard === 'full' ? 57 : 54.5} ${R(jw + 0.5)} 46 ${R(hw)} 30 L${R(hw - 2.6)} 31 C${R(jw - 3)} 40 ${R(5)} 43 50 42.4 C${L(5)} 43 ${L(jw - 3)} 40 ${L(hw - 2.6)} 31 Z`} fill={H} stroke={OUT} strokeWidth=".9" />
          )}
          {l.beard === 'chinstrap' && <path d={`M${L(hw - 0.4)} 32 C${L(jw)} 46 ${L(6)} 53 50 53 C${R(6)} 53 ${R(jw)} 46 ${R(hw - 0.4)} 32 L${R(hw - 1.4)} 32.6 C${R(jw - 1.4)} 45 ${R(6)} 51.6 50 51.6 C${L(6)} 51.6 ${L(jw - 1.4)} 45 ${L(hw - 1.4)} 32.6 Z`} fill={H} opacity={SKINS.indexOf(S) < 3 && HAIRS.indexOf(H) >= 4 ? 0.5 : 0.85} />}
        </g>
        {l.beard === 'goatee' && <path d="M46 46.6 Q50 45.4 54 46.6 L53.2 52 Q50 54 46.8 52 Z" fill={H} stroke={OUT} strokeWidth=".8" />}
        {l.beard === 'horseshoe' && <path d={`M44.4 43.4 Q50 41 55.6 43.4 Q56.4 47.6 55.4 51.6 Q54.6 52 54 51.4 Q54.2 47.4 53.4 45 Q50 44 46.6 45 Q45.8 47.4 46 51.4 Q45.4 52 44.6 51.6 Q43.6 47.6 44.4 43.4 Z`} fill={H} stroke={OUT} strokeWidth=".8" />}
        {/* oczodoły */}
        {[-1, 1].map((sgn) => (
          <path key={'so' + sgn} d={`M${50 + sgn * (ex - 3.6)} ${eyeY - 0.6} Q${50 + sgn * ex} ${browY + 0.6} ${50 + sgn * (ex + 3.8)} ${eyeY - 0.8} Q${50 + sgn * ex} ${eyeY - 2.2} ${50 + sgn * (ex - 3.6)} ${eyeY - 0.6} Z`} fill={SD} opacity=".9" />
        ))}
        {/* oczy */}
        {[-1, 1].map((sgn) => {
          const cx = 50 + sgn * ex;
          const o = sgn; // zewnętrzny kącik
          if (hurt && sgn > 0)
            return (
              <g key={sgn}>
                <ellipse cx={cx} cy={eyeY + 0.4} rx="4.4" ry="3.4" fill="#6d2f5c" opacity=".55" />
                <ellipse cx={cx + 0.4} cy={eyeY - 0.6} rx="3" ry="1.6" fill="#8a3d70" opacity=".5" />
                <path d={`M${cx - 2.8} ${eyeY + 0.2} Q${cx} ${eyeY + 1.3} ${cx + 2.8} ${eyeY + 0.2}`} stroke={OUT} strokeWidth=".95" fill="none" strokeLinecap="round" />
              </g>
            );
          const lid = l.brow === 2 ? 0.5 : 0;
          return (
            <g key={sgn}>
              <path d={`M${cx - 3.1} ${eyeY + 0.2} Q${cx - 0.4} ${eyeY - 2.3 + lid} ${cx + 3.1} ${eyeY - 0.1} Q${cx + 0.2} ${eyeY + 2} ${cx - 3.1} ${eyeY + 0.2} Z`} fill="#f6f1ea" />
              <circle cx={cx + o * 0.1} cy={eyeY - 0.1} r="1.5" fill={l.eye} />
              <circle cx={cx + o * 0.1} cy={eyeY - 0.1} r=".72" fill="#0b0705" />
              <circle cx={cx + o * 0.1 - 0.5} cy={eyeY - 0.65} r=".38" fill="#fff" />
              <path d={`M${cx - 3.3} ${eyeY + 0.3} Q${cx - 0.4} ${eyeY - 2.5 + lid} ${cx + 3.2} ${eyeY - 0.2} ${o > 0 ? 'l.9 -.5' : ''}`} transform={o < 0 ? `translate(${cx * 2} 0) scale(-1 1)` : undefined} stroke={OUT} strokeWidth="1.35" fill="none" strokeLinecap="round" />
              <path d={`M${cx - 2.2} ${eyeY + 1.5} Q${cx} ${eyeY + 2.2} ${cx + 2.4} ${eyeY + 1.2}`} stroke={SDD} strokeWidth=".6" fill="none" strokeLinecap="round" opacity=".85" />
            </g>
          );
        })}
        {/* brwi */}
        {[-1, 1].map((sgn) => {
          const inner = 50 + sgn * 2;
          const outer = 50 + sgn * (ex + 3.9);
          const tilt = l.brow === 2 ? 1.7 : l.brow === 1 ? 0.7 : -0.2;
          const peak = (inner + outer) / 2 + sgn * 0.8;
          return (
            <path
              key={sgn}
              d={`M${inner} ${browY + tilt} C${peak} ${browY - 1.2} ${peak} ${browY - 1.4} ${outer} ${browY + 0.9} C${peak} ${browY - 1.4 + browW} ${peak} ${browY - 1 + browW} ${inner} ${browY + tilt + browW} Z`}
              fill={l.age === 2 && l.hair === HAIRS[9] ? '#8d877d' : shade(H === HAIRS[6] || H === HAIRS[5] ? '#9a6a3a' : H, 0.85)}
              stroke={OUT}
              strokeWidth=".55"
            />
          );
        })}
        {l.scar && (
          <g stroke={tint(S, 0.45)} strokeLinecap="round">
            <path d={`M${R(ex + 1.4)} ${browY - 1.8} L${R(ex - 0.2)} ${browY + 2.6}`} strokeWidth="1" />
            <path d={`M${R(ex + 0.2)} ${browY - 0.7} l1.4 .5 M${R(ex - 0.4)} ${browY + 0.9} l1.4 .5`} strokeWidth=".45" />
          </g>
        )}
        {hurt && <path d={`M${L(ex + 1)} ${browY - 0.6} l2.4 1.6`} stroke="#c0162f" strokeWidth="1.1" strokeLinecap="round" />}
        {/* kości policzkowe, bruzdy */}
        {b === 0 && <path d={`M${L(ex + 3.4)} 36.8 Q${L(ex)} 38.6 ${L(ex - 2.6)} 38.4 M${R(ex + 3.4)} 36.8 Q${R(ex)} 38.6 ${R(ex - 2.6)} 38.4`} stroke={SDD} strokeWidth=".6" fill="none" strokeLinecap="round" opacity=".35" />}
        {l.age >= 1 && <path d={`M${L(4.6)} 40.6 Q${L(5.6)} 42.8 ${L(5)} 45 M${R(4.6)} 40.6 Q${R(5.6)} 42.8 ${R(5)} 45`} stroke={SDD} strokeWidth=".6" fill="none" strokeLinecap="round" opacity={l.age === 2 ? 0.8 : 0.5} />}
        {/* nos */}
        {(() => {
          const nwid = l.nose === 1 ? 4 : 3.1;
          const kink = l.nose === 2;
          return (
            <g>
              <path d={`M50.6 30.8 ${kink ? 'C52.2 32.6 51 34.2 51.4 35.6 C52 37 52.6 37.6 52.4 38.4' : 'C51.6 33.4 52.4 36 52.6 38.2'} L50 39 Z`} fill={SD} opacity=".9" />
              <path d={`M${50 - nwid + 0.2} 38 Q${50 - nwid - 0.9} 40.4 ${50 - nwid + 1.7} 40.8 M${50 + nwid - 0.2} 38 Q${50 + nwid + 0.9} 40.4 ${50 + nwid - 1.7} 40.8`} stroke={OUT} strokeWidth=".85" fill="none" strokeLinecap="round" />
              <path d={`M${50 - nwid + 1.7} 40.8 Q50 41.7 ${50 + nwid - 1.7} 40.8`} stroke={SDD} strokeWidth=".7" fill="none" strokeLinecap="round" />
              <path d={`M${50 - nwid + 1.6} 40.6 q.9 -.9 1.6 -.2 M${50 + nwid - 1.6} 40.6 q-.9 -.9 -1.6 -.2`} stroke={OUT} strokeWidth=".7" fill="none" strokeLinecap="round" />
              <path d={kink ? 'M51.6 32.6 Q50.8 34.4 51.6 35.6 Q52.6 37 52.5 38' : 'M51.4 32.8 Q52.2 35.6 52.5 38'} stroke={SDD} strokeWidth=".7" fill="none" strokeLinecap="round" />
              <ellipse cx="49.4" cy="38.6" rx="1.1" ry=".6" fill={SL} opacity=".8" />
            </g>
          );
        })()}
        {/* wąsy */}
        {(l.beard === 'stache' || l.beard === 'full' || l.beard === 'short' || l.beard === 'goatee' || l.beard === 'horseshoe') && (
          <path d="M44.2 47 C44.2 44.4 46.4 42.2 50 42.9 C53.6 42.2 55.8 44.4 55.8 47 C54.8 45.4 53 45 50 45.4 C47 45 45.2 45.4 44.2 47 Z" fill={HD} stroke={OUT} strokeWidth=".6" />
        )}
        {/* usta */}
        {(() => {
          const c = hurt ? 0.7 : l.brow === 2 ? 0.25 : l.brow === 0 ? -0.3 : 0.05;
          return (
            <g>
              <path d={`M46.6 ${46.2 + c} Q50 ${c < 0 ? 46.9 : 46.1} 53.4 ${46.2 + c}`} stroke={OUT} strokeWidth="1.05" fill="none" strokeLinecap="round" />
              <path d="M47.6 47.6 Q50 49.2 52.4 47.6 Q50 48.2 47.6 47.6 Z" fill={SD} />
              <path d="M48.6 49.4 Q50 49.9 51.4 49.4" stroke={SDD} strokeWidth=".6" fill="none" strokeLinecap="round" opacity=".7" />
            </g>
          );
        })()}
        {l.jaw === 2 && <path d="M50 51 L50 52.2" stroke={SDD} strokeWidth=".6" strokeLinecap="round" />}
        {hurt && <path d="M53.4 47.2 q.4 1.6 -.2 2.8" stroke="#c0162f" strokeWidth=".9" strokeLinecap="round" />}

        {/* fryzury */}
        {renderHair()}

        {/* ręce: ramiona, łokcie, przedramiona */}
        {limb(eL, sL, ua + 0.6, ua + 2.4, 'ual', 1.4, 0.32)}
        {limb(eR, sR, ua + 0.6, ua + 2.4, 'uar', -1.4, -0.32)}
        {delt(L, -1, 'dl')}
        {delt(R, 1, 'dr')}
        {limb(eL, wL, fa + 1.4, fa - 0.6, 'fal', -0.8, -0.22, has('sleeveL'))}
        {limb(eR, wR, fa + 1.4, fa - 0.6, 'far', 0.8, 0.3, has('sleeveR'))}
        {/* rękawice MMA przy brodzie */}
        {glove(gL, false, 'gl')}
        {glove(gR, true, 'gr')}
      </g>
      </g>
    </svg>
  );
}
