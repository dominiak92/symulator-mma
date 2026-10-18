/** Spójny zestaw ikon liniowych (24×24, kreska 2 px), rysowanych w kodzie. */
import type { CSSProperties, ReactNode } from 'react';
import type { StatKey } from '../engine/types';

const P: Record<string, ReactNode> = {
  coins: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 12h.01M18 12h.01" strokeWidth="2.6" />
    </>
  ),
  glove: (
    <>
      <path d="M8.5 21h8v-3.6c2-1 3.5-3.2 3.5-6V9.5A5.5 5.5 0 0 0 14.5 4h-1A5.5 5.5 0 0 0 8 9.5V12" />
      <path d="M8 12h-.5A2.5 2.5 0 0 0 5 14.5v0A2.5 2.5 0 0 0 7.5 17h3.5a2 2 0 0 0 0-4H9" />
      <path d="M8.5 17.4h8" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 16v5" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a3 3 0 0 0 3 4.5M17 6h3a3 3 0 0 1-3 4.5" />
    </>
  ),
  medal: (
    <>
      <path d="M7.5 3l3 6.5M16.5 3l-3 6.5" />
      <circle cx="12" cy="15" r="5.5" />
      <path d="M12 12.5v5" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 5 10 4.5 10 9s-10 4-10 9M17 3c0 5-10 4.5-10 9s10 4 10 9" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.5 3.3-5 6.5-5s5.7 1.5 6.5 5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.2c2 .6 3.3 2.1 3.8 4.8" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3" />
    </>
  ),
  takedown: (
    <>
      <circle cx="7" cy="4.5" r="2" />
      <circle cx="17" cy="4.5" r="2" />
      <path d="M7.5 8c-1.6 2.2-2.2 4.6-1.6 7.2L4.5 21M16.5 8c1.6 2.2 2.2 4.6 1.6 7.2L19.5 21" />
      <path d="M8 10.5l8 3.5M16 10.5l-8 3.5" />
    </>
  ),
  knot: (
    <>
      <path d="M1.5 9.5h6M16.5 9.5h6" strokeWidth="4" strokeLinecap="butt" />
      <rect x="8" y="5.8" width="8" height="7.4" rx="1.6" />
      <path d="M10 13.4l-4.6 5.8M14 13.4l4.6 5.8" strokeWidth="3.2" />
    </>
  ),
  heart: (
    <>
      <path d="M20.5 8.8A4.8 4.8 0 0 0 12 6a4.8 4.8 0 0 0-8.5 2.8C3.5 14 12 20 12 20s8.5-6 8.5-11.2z" />
      <path d="M4.5 12.5h4l1.5-2.5 2.5 5 1.5-2.5h5" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z" />,
  shieldCheck: (
    <>
      <path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  play: <path d="M7 4.5l12.5 7.5L7 19.5z" />,
  sliders: (
    <>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  museum: (
    <>
      <path d="M3 21h18M4.5 9.5h15M12 3l8.5 5h-17z" />
      <path d="M6.5 9.5V18M10 9.5V18M14 9.5V18M17.5 9.5V18M4 18h16" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.6 2.6 0 1 1 3.6 2.4c-.7.3-1.1.9-1.1 1.6v.4" />
      <path d="M12 17h.01" strokeWidth="2.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  ff: <path d="M3 5.5l8 6.5-8 6.5zM13 5.5l8 6.5-8 6.5z" />,
  skip: (
    <>
      <path d="M5 5.5l10 6.5-10 6.5z" />
      <path d="M19 5v14" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3.5 10v4h3.5l6.5 4.5v-13L7 10z" />
      <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </>
  ),
  ticket: (
    <>
      <path d="M3.5 8V6.5h17V8a2.5 2.5 0 0 0 0 5v4.5h-17V13a2.5 2.5 0 0 0 0-5z" />
      <path d="M14.5 6.5v11" strokeDasharray="1.6 1.8" />
    </>
  ),
  star: <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.9l6-.9z" />,
  home: (
    <>
      <path d="M3 11l9-7.5 9 7.5" />
      <path d="M5.5 9.5V20.5h13V9.5M10 20.5v-5.5h4v5.5" />
    </>
  ),
  flame: <path d="M12 21c-3.9 0-7-2.8-7-6.5 0-3 1.9-5 3.5-6.5.3 1.9 1.4 3 2.5 3.4.2-3.4 1.2-6 3.5-8.4.5 3.2 5.5 5.6 5.5 11.5 0 3.7-3.1 6.5-7 6.5z" />,
  bandage: (
    <>
      <rect x="2.6" y="8.5" width="18.8" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="M10.6 10.6h.01M13.4 13.4h.01M13.4 10.6h.01M10.6 13.4h.01" strokeWidth="2.4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3 12.5h18" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l4-1L19 8l-3-3L5 16z" />
      <path d="M14 7l3 3" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.3-7-11.8a7 7 0 0 1 14 0C19 14.7 12 21 12 21z" />
      <circle cx="12" cy="9.2" r="2.5" />
    </>
  ),
  dumbbell: <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11" />,
  bolt: <path d="M13 2.5L4.5 13.5h6.5l-1 8 8.5-11h-6.5z" />,
  volume: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" />
      <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" />
      <path d="M16 10l4.5 4.5M20.5 10L16 14.5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  chart: <path d="M4 20V11M10 20V4M16 20v-7M3 20.5h18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M7 21h10M5 7h14" />
      <path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" />
    </>
  ),
  door: (
    <>
      <path d="M14 3H5v18h9" />
      <path d="M10 12h11M17.5 8.5L21 12l-3.5 3.5" />
    </>
  ),
  sparkle: <path d="M12 3l2 6.5L20.5 12 14 14l-2 7-2-7-6.5-2L10 9.5z" />,
  share: (
    <>
      <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5" />
      <path d="M5 13v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V13" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7.5 10.5L12 15l4.5-4.5" />
      <path d="M4 20.5h16" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  rotate: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 3.5V8h4.5" />
    </>
  ),
  shirt: <path d="M8 3.5L3 6.5l2 4 2.5-1V21h9V9.5l2.5 1 2-4-5-3c-.5 1.7-2 2.8-4 2.8S8.5 5.2 8 3.5z" />,
  dice: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01" strokeWidth="2.6" />
    </>
  ),
};

export type IconName = keyof typeof P;
export const ICON_NAMES = Object.keys(P);

export function Icon({ name, size = 18, className, style, title }: { name: IconName | string; size?: number; className?: string; style?: CSSProperties; title?: string }) {
  const body = P[name];
  if (!body) return null;
  return (
    <svg
      className={`ico ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {body}
    </svg>
  );
}

export const STAT_ICON: Record<StatKey, IconName> = {
  stand: 'glove',
  wrest: 'takedown',
  bjj: 'knot',
  cardio: 'heart',
  chin: 'shield',
  iq: 'target',
} as Record<StatKey, IconName>;

/** Podgląd wszystkich ikon (adres z #ikony) — do sprawdzania wyglądu. */
export function IconGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8, padding: 12 }}>
      {ICON_NAMES.map((n) => (
        <div key={n} style={{ display: 'grid', justifyItems: 'center', gap: 6, padding: 10, border: '1px solid #333', borderRadius: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#01aeee' }}>
            <Icon name={n} size={48} />
            <Icon name={n} size={18} />
            <Icon name={n} size={13} />
          </div>
          <span style={{ color: '#ddd', fontSize: 12 }}>{n}</span>
        </div>
      ))}
    </div>
  );
}
