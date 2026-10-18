// Stali bywalcy federacji: mistrz i czołówka rankingu trwają przez lata.
// Ranking w tabeli, rywale w ofertach i mistrz w walce o pas to ci sami ludzie.
import type { Fighter, GameState, Roster, RosterFighter } from './types';
import type { Rng } from './rng';
import { RANK_SIZE } from './data';
import { generateOpponent } from './fighter';

export type { Roster, RosterFighter };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function rosterFor(s: GameState): Roster | null {
  if (s.tier < 1 || s.contract.kind === 'freak') return null;
  const r = s.roster;
  if (r && r.fed === s.fed && r.tier === s.tier) return r;
  return null;
}

/** Tworzy skład federacji, gdy go nie ma (nowa federacja, stary zapis). */
export function ensureRoster(rng: Rng, s: GameState): Roster | null {
  if (s.tier < 1 || s.contract.kind === 'freak') return null;
  const have = rosterFor(s);
  if (have) {
    normalize(have, s);
    return have;
  }
  const size = RANK_SIZE[s.tier];
  const list: RosterFighter[] = [];
  for (let r = 0; r <= size; r++) {
    const o = generateOpponent(rng, s.tier, r, s.profile.difficulty === 'hard');
    list.push({ ...o, rank: r, h2h: { w: 0, l: 0, d: 0 }, champSince: r === 0 ? s.season - rng.int(0, 2) : undefined });
  }
  s.roster = { fed: s.fed, tier: s.tier, list };
  normalize(s.roster, s);
  return s.roster;
}

/** Porządkuje rangi: mistrz (jeśli jest) na 0, reszta kolejno 1..n. Gdy mistrzem jest gracz, w składzie nie ma 0. */
export function normalize(r: Roster, s: GameState) {
  const playerChamp = s.rank === 0 && s.tier === r.tier && s.fed === r.fed;
  let champ = r.list.find((f) => f.rank === 0);
  if (playerChamp && champ) champ.rank = 1;
  if (!playerChamp && !champ) {
    // pas wakuje: przejmuje najwyżej notowany
    const best = [...r.list].sort((a, b) => a.rank - b.rank)[0];
    if (best) {
      best.rank = 0;
      best.champSince = s.season;
    }
  }
  champ = playerChamp ? undefined : r.list.find((f) => f.rank === 0);
  const rest = r.list.filter((f) => f !== champ).sort((a, b) => a.rank - b.rank);
  rest.forEach((f, i) => (f.rank = i + 1));
  if (champ) champ.rank = 0;
}

/** Rywal o danym miejscu w rankingu: ze składu federacji (kopia), a gdy go brak, nowy. */
export function rosterOpp(rng: Rng, s: GameState, rank: number, exclude: Set<string>): Fighter {
  const r = ensureRoster(rng, s);
  if (r) {
    const size = RANK_SIZE[s.tier];
    const want = clamp(rank, 0, size);
    const cands = r.list.filter((f) => !exclude.has(f.id));
    const exact = cands.find((f) => f.rank === want);
    const near = exact ?? [...cands].sort((a, b) => Math.abs(a.rank - want) - Math.abs(b.rank - want))[0];
    if (near && (want !== 0 || near.rank === 0)) {
      const { h2h: _h, champSince: _c, ...f } = near;
      void _h;
      void _c;
      return { ...f, stats: { ...near.stats }, record: { ...near.record } };
    }
  }
  return generateOpponent(rng, s.tier, rank, s.profile.difficulty === 'hard');
}

export function rosterFighter(s: GameState, id: string): RosterFighter | undefined {
  return rosterFor(s)?.list.find((f) => f.id === id);
}

/** Po walce gracza: bilans, rekord i przesunięcia w rankingu. */
export function rosterAfterFight(s: GameState, oppId: string, res: 'W' | 'L' | 'D', title: boolean, defense: boolean, rankBefore: number | null) {
  const r = rosterFor(s);
  if (!r) return;
  const f = r.list.find((x) => x.id === oppId);
  if (!f) return;
  const size = RANK_SIZE[s.tier];
  if (res === 'W') {
    f.h2h.w++;
    f.record.l++;
    if (title && !defense) f.rank = 1; // były mistrz zostaje w czołówce
    else f.rank = rankBefore === null ? Math.min(size, f.rank + 3) : Math.max(f.rank, rankBefore);
  } else if (res === 'L') {
    f.h2h.l++;
    f.record.w++;
    if (title && defense) {
      f.rank = 0;
      f.champSince = s.season;
    } else if (!title) f.rank = Math.max(1, f.rank - 1);
  } else {
    f.h2h.d++;
    f.record.d++;
  }
  normalize(r, s);
}

/** Rok w federacji: mistrzowie się zmieniają, czołówka rotuje, weterani odchodzą. Zwraca notkę do podsumowania. */
export function rosterYear(rng: Rng, s: GameState): string | null {
  const r = rosterFor(s);
  if (!r) return null;
  const size = RANK_SIZE[r.tier];
  let note: string | null = null;
  const playerChamp = s.rank === 0;
  for (const f of r.list) {
    f.age += 1;
    const w = rng.int(1, 3);
    const l = rng.int(0, 2);
    f.record.w += w;
    f.record.l += l;
    if (f.rank > 0) f.rank = clamp(f.rank + rng.int(-2, 2), 1, size);
  }
  // mistrz broni pasa albo go traci (gdy mistrzem nie jest gracz)
  const champ = r.list.find((f) => f.rank === 0);
  if (!playerChamp && champ && rng.chance(0.35)) {
    const contenders = r.list.filter((f) => f.rank >= 1 && f.rank <= 3);
    const nc = rng.pick(contenders.length ? contenders : r.list.filter((f) => f !== champ));
    if (nc) {
      champ.rank = rng.int(2, 4);
      nc.rank = 0;
      nc.champSince = s.season + 1;
      note = `W federacji nowy mistrz: ${nc.firstName} ${nc.lastName} odebrał pas ${champ.lastName}.`;
    }
  } else if (!playerChamp && champ) {
    const yrs = s.season + 1 - (champ.champSince ?? s.season);
    if (yrs >= 2) note = `${champ.firstName} ${champ.lastName} dalej trzyma pas, już ${yrs} ${yrs < 5 ? 'lata' : 'lat'} z rzędu.`;
  }
  // weterani kończą kariery, przychodzą nowi
  for (let i = 0; i < r.list.length; i++) {
    const f = r.list[i];
    if (f.rank === 0) continue;
    if ((f.age >= 36 && rng.chance(0.4)) || rng.chance(0.05)) {
      const n = generateOpponent(rng, r.tier, size, s.profile.difficulty === 'hard');
      r.list[i] = { ...n, rank: size + 1, h2h: { w: 0, l: 0, d: 0 } };
    }
  }
  normalize(r, s);
  return note;
}

/** Po każdej walce: mistrz w składzie zgadza się z tym, kto ma pas. */
export function rosterSync(s: GameState) {
  const r = rosterFor(s);
  if (r) normalize(r, s);
}
