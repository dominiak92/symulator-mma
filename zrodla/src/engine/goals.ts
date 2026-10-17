import type { GameState } from './types';
import { BELT_NAMES } from './data';
import { createRng, hashString } from './rng';

// Cele dnia i wyzwania tygodnia — sprawdzane po zakończeniu kariery
export interface Goal {
  id: string;
  title: string;
  desc: string;
  check: (s: GameState) => boolean;
}

const belt = (s: GameState, t: number) => s.belts.some((b) => b.name.startsWith(BELT_NAMES[t]));
const bestSeason = (s: GameState, fn: (x: GameState['seasons'][0]) => number) => Math.max(0, ...s.seasons.map(fn));

export const DAILY_GOALS: Goal[] = [
  { id: 'd_reg_belt', title: 'Król hali OSiR', desc: 'Zdobądź pas regionalnej gali.', check: (s) => belt(s, 1) },
  { id: 'd_pl_belt', title: 'Mistrz kraju', desc: 'Zdobądź pas polskiej federacji.', check: (s) => belt(s, 2) },
  { id: 'd_eu', title: 'Paszport', desc: 'Stocz walkę w europejskiej federacji.', check: (s) => s.peakTier >= 3 },
  { id: 'd_ko10', title: 'Ciężka ręka', desc: 'Wygraj 10 walk przez KO w jednej karierze.', check: (s) => s.finishes.ko >= 10 },
  { id: 'd_sub8', title: 'Dusiciel', desc: 'Wygraj 8 walk przez poddanie w jednej karierze.', check: (s) => s.finishes.sub >= 8 },
  { id: 'd_perfect', title: 'Sezon bez skazy', desc: 'Wygraj wszystkie walki w jednym sezonie, co najmniej trzy.', check: (s) => s.seasons.some((x) => x.l === 0 && x.d === 0 && x.w >= 3) },
  { id: 'd_positive', title: 'Na plusie', desc: 'Wygraj co najmniej dwa razy więcej walk, niż przegrasz.', check: (s) => s.record.w + s.amRecord.w >= 2 * Math.max(1, s.record.l + s.amRecord.l) },
  { id: 'd_rich', title: 'Pół bańki', desc: 'Zarób w karierze 500 tys. zł.', check: (s) => s.totalEarned >= 500_000 },
  { id: 'd_peer', title: 'Stare porachunki', desc: 'Pokonaj dwóch różnych zawodników z rocznika.', check: (s) => s.peers.filter((p) => p.h2h.w > 0).length >= 2 },
  { id: 'd_defend', title: 'Obrońca', desc: 'Obroń dowolny pas dwa razy.', check: (s) => (s.flags.maxDef ?? 0) >= 2 },
  { id: 'd_freak', title: 'Bocznym torem', desc: 'Wygraj freak fight, a potem zdobądź pas w normalnej federacji.', check: (s) => (s.flags.freakWins ?? 0) >= 1 && s.belts.some((b) => !b.name.startsWith(BELT_NAMES[0])) },
  { id: 'd_streak', title: 'Seria', desc: 'Wygraj 7 walk z rzędu.', check: (s) => (s.flags.bestStreak ?? 0) >= 7 },
  { id: 'd_season4', title: 'Rok życia', desc: 'Wygraj 3 walki w jednym sezonie zawodowym.', check: (s) => bestSeason(s, (x) => (x.tier >= 1 ? x.w : 0)) >= 3 },
  { id: 'd_gold', title: 'Złota jesień', desc: 'Zdobądź złoty medal w turnieju amatorskim.', check: (s) => s.medals.gold >= 1 },
  { id: 'd_debut20', title: 'Szybki start', desc: 'Zadebiutuj zawodowo przed 20. urodzinami.', check: (s) => s.proDebut !== null && s.proDebut.age < 20 },
];

export const WEEKLY_GOALS: Goal[] = [
  { id: 'w_world', title: 'Wielki świat', desc: 'Podpisz kontrakt ze światową federacją.', check: (s) => s.peakTier >= 4 },
  { id: 'w_eu_belt', title: 'Król Europy', desc: 'Zdobądź pas mistrza Europy.', check: (s) => belt(s, 3) },
  { id: 'w_three', title: 'Kolekcjoner', desc: 'Zdobądź pasy na trzech różnych szczeblach.', check: (s) => [0, 1, 2, 3, 4].filter((t) => belt(s, t)).length >= 3 },
  { id: 'w_40', title: 'Emerytura z gablotą', desc: 'Walcz do czterdziestki i zdobądź co najmniej 3 pasy.', check: (s) => s.age >= 40 && s.belts.length >= 3 },
  { id: 'w_hard', title: 'Pod wiatr', desc: 'Na poziomie trudnym zdobądź pas polskiej federacji.', check: (s) => s.profile.difficulty === 'hard' && belt(s, 2) },
];

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${w}`;
}

export function todaysGoals(d = new Date()) {
  const rng = createRng(hashString('cele-' + dayKey(d)));
  const daily = rng.shuffle(DAILY_GOALS).slice(0, 3);
  const wrng = createRng(hashString('wyzwanie-' + weekKey(d)));
  const weekly = wrng.pick(WEEKLY_GOALS);
  return { day: dayKey(d), week: weekKey(d), daily, weekly };
}

/** Do kiedy trwa wyzwanie tygodnia (koniec niedzieli). */
export function weekEndsIn(d = new Date()) {
  const day = d.getDay() || 7;
  const end = new Date(d);
  end.setDate(d.getDate() + (7 - day));
  end.setHours(23, 59, 59, 999);
  const ms = end.getTime() - d.getTime();
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  return { days, hours };
}

export { dayKey, weekKey };
