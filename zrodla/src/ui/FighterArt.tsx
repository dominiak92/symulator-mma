/**
 * Zawodnik w gardzie (popiersie). Kreska przerysowana warstwami z ilustracji wzorcowej
 * (fighterData.ts), a tu tylko przemalowujemy: skóra, włosy, taśma w kolorze narożnika,
 * do tego fryzura, zarost, budowa wg wagi, tatuaże, blizna, obicia i pas.
 * Wygląd wynika z ziarna, więc jest stały dla danej osoby.
 */
import { useId, type CSSProperties } from 'react';
import { BODY, HAIR, BEARD, FACE_B, type Layer } from './fighterData';

const SKINS = ['#f7d3b8', '#f1b08c', '#e6a27c', '#d48f66', '#bb7650', '#9c5f3d', '#7c4a2f', '#5c3520'];
const HAIRS = ['#1b1512', '#2c211b', '#3d2c22', '#5a3d27', '#7a5232', '#a77a45', '#d8b26c', '#93421f', '#3a3a3e', '#b4aea5'];
const INKS = ['#1f2a44', '#26303f', '#2c2440'];
const OUT = '#381608';

type HairStyle = 'short' | 'bald' | 'fade' | 'slick' | 'curly' | 'mohawk' | 'bun' | 'buzz';
type BeardStyle = 'none' | 'full' | 'goatee';
type Tattoo = 'chest' | 'forearmL' | 'forearmR' | 'shoulder' | 'ribs' | 'cross';

export interface FighterLook {
  skin: string;
  hair: string;
  style: HairStyle;
  beard: BeardStyle;
  build: number;
  tattoos: Tattoo[];
  ink: string;
  ear: boolean;
  scar: boolean;
  age: number;
  /** 0: twarz spokojna, 1: twarz zawadiaki */
  face: number;
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
    ? ['short', 'bald', 'fade', 'curly', 'buzz', 'short', 'curly', 'mohawk', 'fade', 'short']
    : ['short', 'bald', 'fade', 'slick', 'curly', 'mohawk', 'bun', 'buzz', 'short', 'fade', 'slick', 'short', 'curly'];
  const beardRoll = r();
  const beard: BeardStyle = beardRoll < 0.68 ? 'none' : beardRoll < 0.86 ? 'full' : 'goatee';
  const all: Tattoo[] = ['chest', 'forearmL', 'forearmR', 'shoulder', 'ribs', 'cross'];
  const n = r() < 0.4 ? 0 : r() < 0.65 ? 1 : r() < 0.88 ? 2 : 3;
  const tattoos: Tattoo[] = [];
  for (let i = 0; i < n; i++) {
    const t = pick(all);
    if (!tattoos.includes(t) && !(t === 'cross' && tattoos.includes('chest')) && !(t === 'chest' && tattoos.includes('cross'))) tattoos.push(t);
  }
  const age = r() < 0.65 ? 0 : r() < 0.7 ? 1 : 2;
  let hair = dark ? pick(HAIRS.slice(0, 3)) : pick(HAIRS.slice(0, 9));
  if (age === 2 && r() < 0.35) hair = HAIRS[9];
  return {
    skin,
    hair,
    style: pick(styles),
    beard,
    build: Math.floor(r() * 3),
    tattoos,
    ink: pick(INKS),
    ear: r() < 0.28,
    scar: r() < 0.22,
    age,
    face: r() < 0.42 ? 1 : 0,
  };
}

/** Budowa ciała wg kategorii wagowej (0 chudy … 3 ciężki). */
export const WEIGHT_BUILD: Record<string, number> = { piorkowa: 0, lekka: 0, polsrednia: 1, srednia: 1, polciezka: 2, ciezka: 3 };

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const css = ([r, g, b]: RGB) => `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
const clamp = (v: number) => Math.max(0, Math.min(255, v));
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/** Kolor z wzorca przeniesiony na inną skórę (zachowuje proporcje kanałów). */
const REF_SKIN: RGB = [241, 176, 140];
const fromRef = (base: RGB, ref: RGB): RGB => [clamp((base[0] * ref[0]) / REF_SKIN[0]), clamp((base[1] * ref[1]) / REF_SKIN[1]), clamp((base[2] * ref[2]) / REF_SKIN[2])];

const CORNER = {
  blue: { strap: '#1f7fe0', strapS: '#1559a8', strapH: '#63b0f5', shorts: '#1b2f86' },
  red: { strap: '#da2e2a', strapS: '#a51f22', strapH: '#f6615b', shorts: '#7c1024' },
};

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
  const S = hex(l.skin);
  const Hc = hex(l.hair);
  const light = Hc[0] + Hc[1] + Hc[2] > 330;
  const c = CORNER[corner];
  const pal: Record<string, string> = {
    skin: css(S),
    skinS: css(fromRef(S, [189, 117, 91])),
    skinH: css(mix(S, [255, 236, 222], 0.42)),
    skinL: css(fromRef(S, [122, 64, 50])),
    hair: css(Hc),
    hairH: css(mix(Hc, light ? [255, 246, 225] : [160, 112, 84], light ? 0.35 : 0.3)),
    brow: css(light ? mix(Hc, [112, 64, 32], 0.55) : mix(Hc, [40, 18, 8], 0.2)),
    glove: '#34322f',
    gloveH: '#6f6c69',
    strap: c.strap,
    strapS: c.strapS,
    strapH: c.strapH,
    white: '#fbf4ee',
    out: OUT,
  };
  const sh = shorts && /^#[0-9a-f]{6}$/i.test(shorts) ? shorts : c.shorts;
  const shD = css(mix(hex(sh), [0, 0, 0], 0.35));
  const ink = l.ink;
  const has = (t: Tattoo) => l.tattoos.includes(t);
  const draw = (layers: Layer[], key: string) => (
    <g key={key}>
      {layers.map(([r, d], i) => (
        <path key={i} d={d} fill={pal[r] ?? '#f0f'} fillRule="evenodd" />
      ))}
    </g>
  );
  const sx = [0.93, 0.98, 1.03, 1.08][l.build] ?? 1;
  const flip = mirror ? -1 : 1;
  const tf = `translate(512 0) scale(${sx * flip} 1) translate(-512 0)`;
  const hairLayers = l.style === 'bald' ? null : HAIR[l.style];

  return (
    <svg className={`fighter-art ${className ?? ''}`} style={style} width={size} height={size * 1.2} viewBox="62 10 900 1080" aria-hidden="true">
      <defs>
        <clipPath id={`sil${uid}`}>
          <path d={BODY[0][1]} />
        </clipPath>
        <filter id={`fo${uid}`} x="-8%" y="-8%" width="116%" height="116%">
          <feMorphology operator="dilate" radius="9" in="SourceAlpha" result="d" />
          <feFlood floodColor="#c9d6ee" floodOpacity=".16" />
          <feComposite in2="d" operator="in" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#fo${uid})`}>
        <g transform={tf}>
          {/* spodenki pod tułowiem */}
          <path d="M312 982 Q512 1012 712 982 L722 1160 L302 1160 Z" fill={sh} stroke={OUT} strokeWidth="9" strokeLinejoin="round" />
          {draw(BODY, 'body')}
          {/* pas spodenek */}
          <path d="M310 994 Q512 1030 714 994 L718 1036 Q512 1072 306 1036 Z" fill={shD} stroke={OUT} strokeWidth="9" strokeLinejoin="round" />
          <path d="M322 1018 Q512 1050 702 1018" stroke="#fff" strokeOpacity=".35" strokeWidth="5" fill="none" />
          <path d="M326 1048 L320 1160 M698 1048 L704 1160" stroke={c.strap} strokeWidth="16" />

          {/* brzuch u ciężkich */}
          {l.build === 3 && (
            <g>
              <path d="M338 780 C318 880 322 960 350 1000 Q512 1040 674 1000 C702 960 706 880 686 780 C600 752 424 752 338 780 Z" fill={pal.skin} />
              <path d="M352 930 C380 1000 644 1000 672 930 C664 978 640 996 512 1004 C384 996 360 978 352 930 Z" fill={pal.skinS} />
              <path d="M360 800 C420 780 604 780 664 800" stroke={pal.skinS} strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M506 900 q8 14 0 26" stroke={OUT} strokeWidth="7" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* tatuaże */}
          <g clipPath={`url(#sil${uid})`}>
          <g fill={ink} fillOpacity=".7" stroke="none">
            {has('chest') && (
              <path
                transform="translate(512 612) scale(6.2) translate(-50 -75)"
                d="M50 70.6 C51.4 70.6 52 72 51.4 73.2 C54 71.8 57.6 70.4 61.4 70.8 C59.4 72 58.6 72.6 58.2 73.4 C59.4 73.2 60.4 73.4 61 74 C59 74.4 57.6 75 56.6 76 C55.2 76.2 53.4 76.6 52.4 77.6 L53.4 80.6 L50 79.2 L46.6 80.6 L47.6 77.6 C46.6 76.6 44.8 76.2 43.4 76 C42.4 75 41 74.4 39 74 C39.6 73.4 40.6 73.2 41.8 73.4 C41.4 72.6 40.6 72 38.6 70.8 C42.4 70.4 46 71.8 48.6 73.2 C48 72 48.6 70.6 50 70.6 Z"
              />
            )}
            {has('cross') && <path d="M634 604 h12 v24 h18 v12 h-18 v40 h-12 v-40 h-18 v-12 h18 Z" />}
          </g>
          <g fill="none" stroke={ink} strokeOpacity=".66" strokeLinecap="round" strokeLinejoin="round">
            {has('forearmL') && (
              <g transform="rotate(14 222 780)">
                <path d="M190 730 q32 -10 64 0 M186 772 q36 -10 72 0 M184 814 q34 -10 68 0" strokeWidth="9" />
                <path d="M200 744 l12 18 l12 -18 l12 18 l12 -18 M198 786 l12 18 l12 -18 l12 18 l12 -18" strokeWidth="5" />
              </g>
            )}
            {has('forearmR') && (
              <g transform="rotate(-14 802 780)">
                <path d="M834 730 q-32 -10 -64 0 M838 772 q-36 -10 -72 0 M840 814 q-34 -10 -68 0" strokeWidth="9" />
                <path d="M824 744 l-12 18 l-12 -18 l-12 18 l-12 -18 M826 786 l-12 18 l-12 -18 l-12 18 l-12 -18" strokeWidth="5" />
              </g>
            )}
            {has('shoulder') && <path d="M160 600 q30 -34 74 -30 q-24 12 -16 38 q18 -22 52 -18 M168 642 q26 -16 56 -10" strokeWidth="11" />}
            {has('ribs') && <path d="M640 800 c6 -14 14 -14 12 0 c-2 8 6 10 10 2 l8 -26 l-2 28 c4 -12 14 -14 14 -2 c0 8 8 8 12 0 c4 -10 12 -12 14 -2" strokeWidth="5" />}
          </g>
          </g>

          {/* pas mistrzowski */}
          {belt && (
            <g>
              <path d="M304 966 Q512 1004 720 966 L724 1044 Q512 1084 300 1044 Z" fill="#17171b" stroke={OUT} strokeWidth="9" strokeLinejoin="round" />
              <path d="M392 948 L632 948 L656 1020 L512 1100 L368 1020 Z" fill="#f2b400" stroke="#6f4f00" strokeWidth="9" strokeLinejoin="round" />
              <path d="M424 972 L600 972 L618 1022 L512 1076 L406 1022 Z" fill="#ffd54a" />
              <path d="M436 982 L512 982 L478 1018 Z" fill="#fff6c9" opacity=".7" />
              <circle cx="512" cy="1020" r="30" fill="#e11d48" stroke="#6f4f00" strokeWidth="7" />
              <circle cx="502" cy="1010" r="9" fill="#fff" opacity=".7" />
            </g>
          )}

          {/* głowa: fryzura, zarost, ślady walk */}
          {l.face === 1 && draw(FACE_B, 'face')}
          {hairLayers && draw(hairLayers, 'hair')}
          {l.beard !== 'none' && draw(BEARD[l.beard], 'beard')}
          {l.ear && (
            <g>
              <path d="M382 262 C362 268 360 292 370 300 C360 312 368 330 384 330 C394 316 396 280 382 262 Z" fill={pal.skinS} stroke={OUT} strokeWidth="7" />
              <path d="M376 282 q-6 8 2 14 M378 306 q-6 6 2 12" stroke={OUT} strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
          )}
          {l.scar && (
            <g stroke={css(mix(S, [255, 240, 232], 0.55))} strokeLinecap="round">
              <path d="M572 214 L556 262" strokeWidth="9" />
              <path d="M552 226 l20 7 M548 244 l20 7" strokeWidth="4" />
            </g>
          )}
          {hurt && (
            <g>
              <ellipse cx="562" cy="268" rx="44" ry="32" fill="#6d2f5c" opacity=".5" />
              <ellipse cx="566" cy="252" rx="30" ry="14" fill="#8a3d70" opacity=".45" />
              <path d="M584 236 l26 18" stroke="#c0162f" strokeWidth="9" strokeLinecap="round" />
              <path d="M538 398 q4 18 -2 30" stroke="#c0162f" strokeWidth="8" strokeLinecap="round" fill="none" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
