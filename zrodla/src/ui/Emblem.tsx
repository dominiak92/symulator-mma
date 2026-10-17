// Herby fikcyjnych klubów, logo fikcyjnych sponsorów i federacji, rysowane w SVG.
import type { CrestSpec, CrestShape } from '../engine/data';
import { CLUB_TEMPLATES } from '../engine/data';
import type { Club } from '../engine/types';
import { GG } from './brand';

// Ikony w polu 24×24. Wypełnione kształty albo linie (stroke).
const ICONS: Record<string, { d: string; stroke?: boolean }[]> = {
  flame: [{ d: 'M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 1.5-5 3-6.5.5 2 1.5 3 3 3.5-.5-3 0-6 0-9z' }],
  eagle: [{ d: 'M1 8l5 2.5L12 6l6 4.5L23 8l-3 7h-4.5L12 20l-3.5-5H4z' }],
  gear: [
    { d: 'M12 4.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15z', stroke: true },
    { d: 'M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8L7 17M17 7l2.8-2.8', stroke: true },
    { d: 'M12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6z' },
  ],
  crown: [{ d: 'M3 18.5h18l1.5-11-5.5 4.5L12 4l-5 8L1.5 7.5z' }, { d: 'M3 20.5h18v2H3z' }],
  bolt: [{ d: 'M14 1L4 14h7l-2 9 11-13h-7z' }],
  wolf: [{ d: 'M3 2l5 6h8l5-6v10l-3 5-6 5-6-5-3-5z' }],
  wave: [
    { d: 'M1 10c3-3 5.5-3 8.5 0s5.5 3 8.5 0 4-2.5 5-2', stroke: true },
    { d: 'M1 16c3-3 5.5-3 8.5 0s5.5 3 8.5 0 4-2.5 5-2', stroke: true },
  ],
  palm: [
    { d: 'M12 10c-1 5-1 9 0 13', stroke: true },
    { d: 'M12 10C9 5 4 5 2 8M12 10c3-5 8-5 10-2M12 10C11 6 8 3 5 3M12 10c1-4 4-7 7-7', stroke: true },
  ],
  sun: [{ d: 'M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10z' }, { d: 'M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2', stroke: true }],
  mountain: [{ d: 'M1 21L9 6l4.5 7 3-4L23 21z' }],
  star: [{ d: 'M12 1.5l3.1 6.6 7.2.8-5.3 5 1.4 7.1L12 17.5 5.6 21l1.4-7.1-5.3-5 7.2-.8z' }],
  drop: [{ d: 'M12 2c4.5 6 7 9.5 7 13a7 7 0 0 1-14 0c0-3.5 2.5-7 7-13z' }],
  mug: [{ d: 'M4 6h12v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z' }, { d: 'M16 9h2a3 3 0 0 1 0 6h-2', stroke: true }],
  wrench: [{ d: 'M14.5 3a5 5 0 0 0-4.6 6.9L3 16.8 6.2 20l6.9-6.9A5 5 0 0 0 20 8.5l-3 3-3-1-1-3 3-3a5 5 0 0 0-1.5-.5z' }],
  wheat: [{ d: 'M12 22V6', stroke: true }, { d: 'M12 8c-3-1-4-4-4-6 3 0 4 3 4 6zM12 8c3-1 4-4 4-6-3 0-4 3-4 6zM12 14c-3-1-4-4-4-6 3 0 4 3 4 6zM12 14c3-1 4-4 4-6-3 0-4 3-4 6z' }],
  coin: [{ d: 'M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20z', stroke: true }, { d: 'M9 8h6l-6 8h6', stroke: true }],
  dumbbell: [{ d: 'M2 9h3v6H2zM19 9h3v6h-3zM5 7h3v10H5zM16 7h3v10h-3z' }, { d: 'M8 11h8v2H8z' }],
  car: [{ d: 'M2 15l2.5-6h15l2.5 6v3H2z' }, { d: 'M5 19a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0zM14 19a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0z' }],
  hammer: [{ d: 'M3 5h11v5H3z' }, { d: 'M10 10h3v12h-3z' }],
  cone: [{ d: 'M7 10h10l-5 13z' }, { d: 'M12 2a5 5 0 0 1 5 6H7a5 5 0 0 1 5-6z' }],
  window: [{ d: 'M3 3h18v18H3z', stroke: true }, { d: 'M12 3v18M3 12h18', stroke: true }],
  tv: [{ d: 'M2 5h20v12H2z', stroke: true }, { d: 'M8 21h8M12 17v4', stroke: true }],
  fuel: [{ d: 'M4 3h10v18H4z' }, { d: 'M14 8h3l2 3v7a2 2 0 0 1-4 0v-4h-1', stroke: true }],
  house: [{ d: 'M2 11L12 3l10 8v10H2z' }],
  kebab: [{ d: 'M12 1v22', stroke: true }, { d: 'M7 5h10l-1 13H8z' }],
  boar: [{ d: 'M3 9l4-5 5 3 5-3 4 5-1 7-4 5H8l-4-5z' }, { d: 'M6 16l-3 3M18 16l3 3', stroke: true }],
  pizza: [{ d: 'M2 4c6-3 14-3 20 0L12 22z' }],
  snake: [{ d: 'M6 21c-3 0-4-3-2-5s10-1.5 11-5.5S12 4 9 6', stroke: true }, { d: 'M9 3.5a3 3 0 1 1 0 5a3 3 0 0 1 0-5z' }],
  fist: [{ d: 'M5 8a2 2 0 0 1 4 0V6a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8H11a6 6 0 0 1-6-6z' }],
};

const KEYWORDS: [RegExp, string][] = [
  [/kebab/i, 'kebab'],
  [/dzik|mięs/i, 'boar'],
  [/myjnia|bąbel/i, 'drop'],
  [/bar|kogut/i, 'mug'],
  [/złom|metal/i, 'gear'],
  [/siłownia|żelazny/i, 'dumbbell'],
  [/komis|auto/i, 'car'],
  [/okna|pcv/i, 'window'],
  [/piekarnia|kłos/i, 'wheat'],
  [/agro|bac/i, 'mountain'],
  [/kantor|euro/i, 'coin'],
  [/jazdy|strzałka/i, 'bolt'],
  [/remont|bud/i, 'hammer'],
  [/pizz/i, 'pizza'],
  [/warsztat|turbo/i, 'wrench'],
  [/lody/i, 'cone'],
  [/studio|telewiz/i, 'tv'],
  [/paliw|stacj/i, 'fuel'],
  [/klub/i, 'house'],
  [/megamass|supl/i, 'dumbbell'],
  [/panel/i, 'window'],
  [/xsw|starcia/i, 'crown'],
  [/fan|absolute/i, 'bolt'],
  [/babel/i, 'crown'],
  [/armada/i, 'eagle'],
  [/grom/i, 'bolt'],
  [/flame/i, 'flame'],
  [/hype/i, 'star'],
  [/worriers/i, 'star'],
  [/hexagon/i, 'crown'],
  [/brava/i, 'eagle'],
  [/thunder/i, 'bolt'],
  [/primo|klout/i, 'star'],
  [/ultimate|ufl/i, 'sun'],
  [/global/i, 'sun'],
];

const PALETTE: [string, string][] = [
  ['#b91c1c', '#fef3c7'],
  ['#1d4ed8', '#fde047'],
  ['#065f46', '#d1fae5'],
  ['#7c2d12', '#fed7aa'],
  ['#4c1d95', '#f5f3ff'],
  ['#0f172a', '#01aeee'],
  ['#be185d', '#fce7f3'],
  ['#ca8a04', '#1c1917'],
  ['#15803d', '#fefce8'],
  ['#0e7490', '#ecfeff'],
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function initials(name: string) {
  const acr = name.match(/^([A-ZĄĆĘŁŃÓŚŹŻ]{2,4})\b/);
  if (acr) return acr[1];
  const words = name
    .replace(/\(.*?\)/g, ' ')
    .replace(/[„”"–-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !/^(przy|pod|dla|the)$/i.test(w));
  return words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/** Herb/logo dla dowolnej fikcyjnej nazwy: kolory i ikona wynikają z nazwy, więc są zawsze te same. */
export function crestFor(name: string, shape?: CrestShape): CrestSpec {
  const h = hash(name);
  const [bg, fg] = PALETTE[h % PALETTE.length];
  const kw = KEYWORDS.find(([re]) => re.test(name));
  const iconKeys = Object.keys(ICONS);
  const shapes: CrestShape[] = ['shield', 'circle', 'hex', 'diamond'];
  return {
    shape: shape ?? shapes[(h >>> 4) % shapes.length],
    bg,
    fg,
    icon: kw ? kw[1] : iconKeys[(h >>> 8) % iconKeys.length],
    text: initials(name),
  };
}

export function clubCrest(club: Pick<Club, 'id' | 'name'>): CrestSpec {
  const t = CLUB_TEMPLATES[Number(club.id.slice(1))];
  return t && t.name === club.name ? t.crest : crestFor(club.name);
}

function shapePath(shape: CrestShape) {
  switch (shape) {
    case 'shield':
      return 'M4 3h56v30c0 18-13 30-28 36C17 63 4 51 4 33z';
    case 'circle':
      return 'M32 2a30 30 0 1 1 0 60a30 30 0 0 1 0-60z';
    case 'hex':
      return 'M32 2l27 15v30L32 62 5 47V17z';
    case 'diamond':
      return 'M32 1l31 31-31 31L1 32z';
    case 'badge':
      return 'M10 4h44a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8z';
  }
}

export function Emblem({ spec, size = 40, title }: { spec: CrestSpec; size?: number; title?: string }) {
  const icon = ICONS[spec.icon] ?? ICONS.star;
  const tall = spec.shape === 'shield';
  const vb = tall ? '0 0 64 72' : '0 0 64 64';
  const text = spec.text && spec.text.length <= 3 ? spec.text : '';
  // ikona większa, gdy pod nią nie ma inicjałów
  const sc = text ? 1.05 : 1.4;
  const iconX = 32 - 12 * sc;
  const iconY = text ? (tall ? 11 : 10) : (tall ? 36 : 32) - 12 * sc;
  return (
    <svg className="emblem" width={size} height={tall ? size * 1.125 : size} viewBox={vb} role="img" aria-label={title}>
      {title && <title>{title}</title>}
      <path d={shapePath(spec.shape)} fill={spec.bg} stroke={spec.fg} strokeWidth="2.5" strokeLinejoin="round" />
      <g transform={`translate(${iconX} ${iconY})`} fill={spec.fg} stroke={spec.fg} strokeLinecap="round" strokeLinejoin="round">
        <g transform={`scale(${sc})`}>
          {icon.map((p, i) => (
            <path key={i} d={p.d} fill={p.stroke ? 'none' : spec.fg} strokeWidth={p.stroke ? 2 : 0} />
          ))}
        </g>
      </g>
      {text && (
        <text
          x="32"
          y={tall ? 52 : 50}
          textAnchor="middle"
          fill={spec.fg}
          fontFamily="Oswald, 'Arial Narrow', sans-serif"
          fontWeight="700"
          fontSize={text.length === 3 ? 12 : 14}
          letterSpacing="0.5"
        >
          {text}
        </text>
      )}
    </svg>
  );
}

/** Logo sponsora: Ground Game ma prawdziwe logo Bandy, reszta to fikcyjne odznaki. */
export function SponsorLogo({ name, size = 28 }: { name: string; size?: number }) {
  if (/ground game labs/i.test(name)) return <img className="sponsor-gg" src={GG.labs} alt="Ground Game Labs" style={{ height: size, width: 'auto' }} />;
  if (/ground game/i.test(name)) return <img className="sponsor-gg" src={GG.banda} alt="Ground Game Banda" style={{ height: size, width: 'auto' }} />;
  return <Emblem spec={crestFor(name, 'badge')} size={size} title={name} />;
}

/** Podgląd wszystkich herbów (adres z #herby) — do sprawdzania wyglądu. */
export function EmblemGallery() {
  const names = [
    ...CLUB_TEMPLATES.map((t) => ({ n: t.name, spec: t.crest })),
    ...['XSW – Ekstremalne Starcia Wojowników', 'FAN – Fight Absolute Night', 'Babel MMA Rzeszów', 'Armada Fight Night Katowice', 'Thunderbolt Fight League Łódź', 'Flame MMA', 'Primo MMA', 'Hype League', 'Klout MMA', 'Cage Worriers', 'Hexagon MMA', 'Brava CF', 'UFL – Ultimate Fighting League'].map((n) => ({ n, spec: crestFor(n) })),
    ...['Kebab u Ahmeda', 'ZM „Dzik”', 'MegaMass Polska', 'Stacje „Orlik Paliwa”', 'Studio telewizyjne', 'Twój klub (składki)', 'Hurtownia Paneli Bogdan-Pol', 'Myjnia Bąbelek', 'Bar mleczny Pod Kogutem', 'Skup złomu Metal-Heniek', 'Siłownia Żelazny Wiesiek', 'Auto-komis Igła', 'Okna PCV Szymon-Plast', 'Piekarnia Złoty Kłos', 'Agroturystyka U Bacy', 'Kantor Euro-Max', 'Szkoła jazdy Zielona Strzałka', 'Firma remontowa Panel-Bud', 'Pizzeria Mamma Grażyna', 'Warsztat Turbo-Zdzich', 'Lody Bambino-Bis', 'Ground Game'].map((n) => ({ n, spec: crestFor(n, 'badge') })),
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, padding: 20 }}>
      {names.map(({ n, spec }) => (
        <div key={n} style={{ width: 120, textAlign: 'center', fontSize: 12 }}>
          {n === 'Ground Game' ? <SponsorLogo name={n} size={64} /> : <Emblem spec={spec} size={72} title={n} />}
          <div>{n}</div>
        </div>
      ))}
    </div>
  );
}
