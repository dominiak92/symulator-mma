/** Proste flagi krajów z gry (SVG, bez emoji: emoji flag nie działają na Windowsie). */
import type { CSSProperties, ReactNode } from 'react';
type Spec = { h?: string[]; v?: string[]; extra?: ReactNode };
const C = (cx: number, cy: number, r: number, fill: string) => <circle cx={cx} cy={cy} r={r} fill={fill} />;
const FLAGS: Record<string, Spec> = {
  Polska: { h: ['#ffffff', '#dc143c'] },
  Niemcy: { h: ['#111111', '#dd0000', '#ffce00'] },
  Czechy: { h: ['#ffffff', '#d7141a'], extra: <path d="M0 0 L45 30 L0 60 Z" fill="#11457e" /> },
  Słowacja: { h: ['#ffffff', '#0b4ea2', '#ee1c25'] },
  Francja: { v: ['#0055a4', '#ffffff', '#ef4135'] },
  Irlandia: { v: ['#169b62', '#ffffff', '#ff883e'] },
  Włochy: { v: ['#009246', '#ffffff', '#ce2b37'] },
  Holandia: { h: ['#ae1c28', '#ffffff', '#21468b'] },
  Ukraina: { h: ['#0057b7', '#ffd700'] },
  Dagestan: { h: ['#1e9e48', '#2f6fd1', '#d52b1e'] },
  Czeczenia: { h: ['#2c8a3a', '#ffffff', '#d52b1e'] },
  Kazachstan: { h: ['#00afca'], extra: C(45, 28, 9, '#fec50c') },
  Japonia: { h: ['#ffffff'], extra: C(45, 30, 13, '#bc002d') },
  Nigeria: { v: ['#008751', '#ffffff', '#008751'] },
  Meksyk: { v: ['#006847', '#ffffff', '#ce1126'], extra: C(45, 30, 5, '#8a5a2b') },
  Hiszpania: { h: ['#aa151b', '#f1bf00', '#f1bf00', '#aa151b'] },
  Szwecja: { h: ['#006aa7'], extra: <path d="M0 24h90v12H0zM27 0h12v60H27z" fill="#fecc00" /> },
  Gruzja: { h: ['#ffffff'], extra: <path d="M0 25h90v10H0zM40 0h10v60H40z" fill="#ff0000" /> },
  Anglia: { h: ['#ffffff'], extra: <path d="M0 25h90v10H0zM40 0h10v60H40z" fill="#ce1124" /> },
  Brazylia: { h: ['#009c3b'], extra: <><path d="M45 6 L84 30 L45 54 L6 30 Z" fill="#ffdf00" />{C(45, 30, 11, '#002776')}</> },
  USA: { h: ['#b22234', '#ffffff', '#b22234', '#ffffff', '#b22234', '#ffffff', '#b22234'], extra: <rect width="38" height="30" fill="#3c3b6e" /> },
  Rosja: { h: ['#ffffff', '#0039a6', '#d52b1e'] },
  Emiraty: { h: ['#00732f', '#ffffff', '#111111'], extra: <rect width="24" height="60" fill="#ff0000" /> },
  Arabia: { h: ['#006c35'], extra: <path d="M22 26h46v4H22z" fill="#ffffff" /> },
  Makau: { h: ['#00785e'], extra: C(45, 30, 12, '#ffffff') },
  Australia: { h: ['#012169'], extra: <><path d="M0 0L36 22M36 0L0 22" stroke="#fff" strokeWidth="5" /><path d="M18 0v22M0 11h36" stroke="#c8102e" strokeWidth="4" /></> },
};

export function Flag({ country, className, style }: { country?: string; className?: string; style?: CSSProperties }) {
  const f = country ? FLAGS[country] : undefined;
  if (!f) return null;
  const stripes = f.h ?? f.v ?? [];
  return (
    <svg className={className} style={style} viewBox="0 0 90 60" preserveAspectRatio="none" aria-hidden="true">
      {stripes.map((c, i) =>
        f.h ? <rect key={i} x="0" y={(60 / stripes.length) * i} width="90" height={60 / stripes.length + 0.5} fill={c} /> : <rect key={i} y="0" x={(90 / stripes.length) * i} height="60" width={90 / stripes.length + 0.5} fill={c} />,
      )}
      {f.extra}
    </svg>
  );
}

/** Litery regionalne emoji flagi → kraj z mapy (zamiast emoji, które Windows pokazuje jako dwie litery). */
const CODE: Record<string, string> = { PL: 'Polska', DE: 'Niemcy', CZ: 'Czechy', SK: 'Słowacja', FR: 'Francja', IE: 'Irlandia', IT: 'Włochy', NL: 'Holandia', UA: 'Ukraina', KZ: 'Kazachstan', JP: 'Japonia', NG: 'Nigeria', MX: 'Meksyk', ES: 'Hiszpania', SE: 'Szwecja', GE: 'Gruzja', BR: 'Brazylia', US: 'USA', AU: 'Australia', RU: 'Rosja', AE: 'Emiraty', SA: 'Arabia', MO: 'Makau' };
export function emojiCountry(flag?: string): string | undefined {
  if (!flag) return undefined;
  if (flag.startsWith('🏴')) return 'Anglia';
  const cps = [...flag].map((c) => c.codePointAt(0)! - 0x1f1e6);
  if (cps.length < 2 || cps.some((n) => n < 0 || n > 25)) return undefined;
  return CODE[String.fromCharCode(65 + cps[0], 65 + cps[1])];
}
/** Mała flaga w tekście: najpierw kraj, potem emoji; nieznane → nic. */
export function FlagMark({ country, flag, className = 'flag-ico' }: { country?: string; flag?: string; className?: string }) {
  const c = country && FLAGS[country] ? country : emojiCountry(flag);
  if (!c || !FLAGS[c]) return null;
  return <Flag country={c} className={className} />;
}
