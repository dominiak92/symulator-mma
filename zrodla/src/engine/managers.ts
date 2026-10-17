// Menedżerowie: biorą procent od gaż, w zamian lepsze stawki, mocniejsi rywale (szybszy awans
// w rankingu), łatwiejsze negocjacje. Duże stajnie mają jednak też innych zawodników.
import type { GameState } from './types';

export interface Manager {
  id: string;
  name: string;
  desc: string;
  cut: number; // część gaży dla menedżera
  purse: number; // mnożnik gaż (gdy się tobą zajmuje)
  negotiate: number; // pkt % do negocjacji
  quality: number; // o ile wyżej w rankingu są proponowani rywale
  focus: number; // szansa, że w danym sezonie zajmuje się tobą (a nie innymi z jego stajni)
  promo: number; // o ile niższa pozycja w rankingu wystarczy do awansu do lepszej federacji
  sponsor: number; // pkt % do szans na sponsora
  titleShot?: boolean; // potrafi wywalczyć walkę o pas z miejsca 2–3
  stable?: string[]; // inni zawodnicy w stajni (do tekstów)
}

export const MANAGERS: Manager[] = [
  {
    id: 'zdzisiek',
    name: 'Mirek „Telefon” Kaczmarek',
    desc: 'Stara szkoła. Walki załatwia jednym telefonem do kolegi z federacji. Tani i zawsze odbiera.',
    cut: 0.05,
    purse: 1.1,
    negotiate: 5,
    quality: 0,
    focus: 0.95,
    promo: 0,
    sponsor: 3,
  },
  {
    id: 'okulary',
    name: 'Kamil Wroński · KW Fight',
    desc: 'Okulary przeciwsłoneczne o 23:00 i trzy telefony naraz. Twierdzi, że zna wszystkich w federacji.',
    cut: 0.15,
    purse: 1.22,
    negotiate: 10,
    quality: 1,
    focus: 0.65,
    promo: 2,
    sponsor: 0,
    stable: ['jakiegoś rapera, który chce walczyć', 'kuzyna z Łodzi'],
  },
  {
    id: 'spinacz',
    name: 'Agencja Narożnik',
    desc: 'Porządne umowy, Excel i kawa z ekspresu. Sponsorzy ich lubią.',
    cut: 0.1,
    purse: 1.2,
    negotiate: 12,
    quality: 1,
    focus: 0.85,
    promo: 1,
    sponsor: 10,
    stable: ['trzech zawodników z Krakowa', 'dziewczynę, która właśnie dostała kontrakt w Ameryce'],
  },
  {
    id: 'paradygmat',
    name: 'Hype Media Group',
    desc: 'Media i sponsorzy na pierwszym miejscu, walki trochę dalej.',
    cut: 0.12,
    purse: 1.15,
    negotiate: 8,
    quality: 0,
    focus: 0.8,
    promo: 1,
    sponsor: 18,
    stable: ['dwóch youtuberów', 'byłego piłkarza, który zaczyna MMA'],
  },
  {
    id: 'dominacja',
    name: 'Apex Fight Management',
    desc: 'Stajnia mistrzów z Florydy. Wywalczą ci walkę o pas, ale jesteś jednym z czterdziestu.',
    cut: 0.18,
    purse: 1.45,
    negotiate: 25,
    quality: 2,
    focus: 0.5,
    promo: 2,
    sponsor: 8,
    titleShot: true,
    stable: ['trzech mistrzów wagi lekkiej', 'Dagestańczyka, który nie przegrał od siedmiu lat', 'byłego mistrza po zawieszeniu'],
  },
];

export function managerById(id: string | null | undefined): Manager | null {
  if (!id) return null;
  return MANAGERS.find((m) => m.id === id) ?? null;
}

/** Aktualny menedżer (także ten z wydarzenia „Menedżer w okularach”). */
export function currentManager(s: GameState): Manager | null {
  if (s.manager !== undefined) return managerById(s.manager);
  return s.flags.manager ? managerById('okulary') : null;
}

/** Menedżer, który w tym sezonie faktycznie się tobą zajmuje. */
export function activeManager(s: GameState): Manager | null {
  const m = currentManager(s);
  if (!m) return null;
  if (s.run && s.run.mgrFocus === false) return null;
  return m;
}

/** Czy menedżer w ogóle chce z tobą rozmawiać (null = tak). */
export function managerBlocked(s: GameState, m: Manager): string | null {
  if (s.tier < 1) return 'Menedżerowie biorą zawodowców, nie amatorów.';
  if (m.id === 'spinacz' && s.tier < 2 && s.media < 25) return 'Biorą zawodników z ligi krajowej albo z nazwiskiem (media 25+).';
  if (m.id === 'paradygmat' && s.media < 35) return 'Biorą tylko rozpoznawalnych (media 35+).';
  if (m.id === 'dominacja' && !(s.tier >= 4 || (s.tier === 3 && s.rank !== null && s.rank <= 10))) return 'Biorą tylko top 10 w dużej federacji.';
  return null;
}
