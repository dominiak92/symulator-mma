// Stali bywalcy federacji: mistrz i czołówka rankingu trwają przez lata.
// Ranking w tabeli, rywale w ofertach i mistrz w walce o pas to ci sami ludzie.
import type { Fighter, GameState, NewsItem, Roster, RosterFighter, WeightKey } from './types';
import type { Rng } from './rng';
import { RANK_SIZE } from './data';
import { generateOpponent } from './fighter';

export type { Roster, RosterFighter };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const divOf = (s: GameState): WeightKey => s.division ?? s.profile.weight ?? 'polsrednia';
const matches = (r: Roster, s: GameState) => r.fed === s.fed && r.tier === s.tier && (r.div ?? divOf(s)) === divOf(s);
const ARCHIVE_MAX = 6;

export function rosterFor(s: GameState): Roster | null {
  if (s.tier < 1 || s.contract.kind === 'freak') return null;
  const r = s.roster;
  if (r && matches(r, s)) return r;
  return null;
}

/** Odkłada obecny skład (zmiana federacji albo kategorii), żeby po powrocie zastać tych samych ludzi. */
export function archiveRoster(s: GameState) {
  const r = s.roster;
  if (!r) return;
  if (!r.div) r.div = divOf(s);
  if (r.season === undefined) r.season = s.season;
  const arch = (s.rosterArchive ?? []).filter((x) => !(x.fed === r.fed && x.tier === r.tier && x.div === r.div));
  arch.unshift(r);
  s.rosterArchive = arch.slice(0, ARCHIVE_MAX);
  s.roster = null;
}

/** Tworzy skład federacji, gdy go nie ma (nowa federacja, stary zapis), albo przywraca odłożony. */
export function ensureRoster(rng: Rng, s: GameState): Roster | null {
  if (s.tier < 1 || s.contract.kind === 'freak') return null;
  const have = rosterFor(s);
  if (have) {
    if (!have.div) have.div = divOf(s);
    normalize(have, s);
    return have;
  }
  if (s.roster) archiveRoster(s);
  const ai = (s.rosterArchive ?? []).findIndex((x) => matches(x, s));
  if (ai >= 0) {
    const r = s.rosterArchive!.splice(ai, 1)[0];
    // czas płynął także bez ciebie
    const years = Math.min(4, Math.max(0, s.season - (r.season ?? s.season)));
    for (let y = 0; y < years; y++) tickRoster(rng, r, s, false);
    r.season = s.season;
    s.roster = r;
    normalize(r, s);
    pruneNemesis(s, r);
    return r;
  }
  const size = RANK_SIZE[s.tier];
  const list: RosterFighter[] = [];
  for (let r = 0; r <= size; r++) {
    const o = generateOpponent(rng, s.tier, r, s.profile.difficulty === 'hard');
    list.push({ ...o, rank: r, h2h: { w: 0, l: 0, d: 0 }, champSince: r === 0 ? s.season - rng.int(0, 2) : undefined });
  }
  s.roster = { fed: s.fed, tier: s.tier, div: divOf(s), season: s.season, list };
  normalize(s.roster, s);
  pruneNemesis(s, s.roster);
  return s.roster;
}

/** Porządkuje rangi: mistrz (jeśli jest) na 0, reszta kolejno 1..n. Gdy mistrzem jest gracz, w składzie nie ma 0. */
export function normalize(r: Roster, s: GameState) {
  const playerChamp = s.rank === 0 && matches(r, s);
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
  const note = tickRoster(rng, r, s, s.rank === 0);
  r.season = s.season + 1;
  normalize(r, s);
  // zadra kończy karierę: rewanżu nie będzie
  const n = s.nemesis;
  if (n && n.fed === r.fed && n.tier === r.tier && n.div === r.div && !r.list.some((f) => f.id === n.id)) {
    s.nemesis = null;
    return `${note ? note + ' ' : ''}${n.name} kończy karierę. Rachunku z nim już nie wyrównasz.`;
  }
  return note;
}

function tickRoster(rng: Rng, r: Roster, s: GameState, playerChamp: boolean): string | null {
  const size = RANK_SIZE[r.tier];
  let note: string | null = null;
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
  if (!playerChamp && champ && rng.chance(0.3)) {
    const contenders = r.list.filter((f) => f.rank >= 1 && f.rank <= 3);
    const nc = rng.pick(contenders.length ? contenders : r.list.filter((f) => f !== champ));
    if (nc) {
      champ.rank = rng.int(2, 4);
      nc.rank = 0;
      nc.champSince = s.season + 1;
      note = `W federacji nowy mistrz: ${nc.firstName} ${nc.lastName}. Dotychczasowy mistrz, ${champ.firstName} ${champ.lastName}, spada w rankingu.`;
    }
  } else if (!playerChamp && champ) {
    const yrs = s.season + 1 - (champ.champSince ?? s.season);
    if (yrs >= 2) note = `${champ.firstName} ${champ.lastName} dalej trzyma pas, już ${yrs} ${yrs < 5 ? 'lata' : 'lat'} z rzędu.`;
  }
  // weterani kończą kariery, przychodzą nowi (zadra trzyma się dłużej)
  for (let i = 0; i < r.list.length; i++) {
    const f = r.list[i];
    if (f.rank === 0) continue;
    const keep = s.nemesis?.id === f.id ? 0.5 : 1;
    if ((f.age >= 36 && rng.chance(0.4 * keep)) || rng.chance(0.05 * keep)) {
      const n = generateOpponent(rng, r.tier, size, s.profile.difficulty === 'hard');
      r.list[i] = { ...n, rank: size + 1, h2h: { w: 0, l: 0, d: 0 } };
    }
  }
  return note;
}

/** Po każdej walce: mistrz w składzie zgadza się z tym, kto ma pas. */
export function rosterSync(s: GameState) {
  const r = rosterFor(s);
  if (r) {
    normalize(r, s);
    pruneNemesis(s, r);
  }
}

/** Zadra, której nie ma już w składzie (koniec kariery w czasie twojej nieobecności), znika po cichu. */
function pruneNemesis(s: GameState, r: Roster) {
  const n = s.nemesis;
  if (n && n.fed === r.fed && n.tier === r.tier && n.div === (r.div ?? divOf(s)) && !r.list.some((f) => f.id === n.id)) s.nemesis = null;
}

// ---------------------------------------------------------------------------
// Wiadomości z federacji: co się dzieje w składzie między twoimi walkami
// ---------------------------------------------------------------------------

const METHODS = [
  (w: string, l: string, r: number) => `${w} kontra ${l}: nokaut w ${r}. rundzie, górą ${w.split(' ').pop()}`,
  (w: string, l: string, r: number) => `${w} kontra ${l}: duszenie w ${r}. rundzie, wygrywa ${w.split(' ').pop()}`,
  (w: string, l: string) => `${w} kontra ${l}: wojna na trzy rundy, na punkty wygrywa ${w.split(' ').pop()}`,
  (w: string, l: string, r: number) => `${w} kontra ${l}: sędzia przerywa w ${r}. rundzie, wygrywa ${w.split(' ').pop()}`,
  (w: string, l: string) => `${w} kontra ${l}: niejednogłośna decyzja, wygrywa ${w.split(' ').pop()}, hala gwiżdże`,
];
const INJURIES = ['zerwane więzadło w kolanie', 'złamaną rękę', 'kontuzję barku', 'pęknięty oczodół', 'operację łokcia'];
const QUOTES = [
  'mówi, że ma cię na liście i nie zamierza czekać',
  'w podcaście opowiada, że wasza walka była „rozgrzewką”',
  'wrzuca nagranie waszej walki z podpisem „powtórka?”',
  'na konferencji pyta, czemu unikasz rewanżu',
  'twierdzi, że wygrał z tobą na pół gwizdka',
];

const nm = (f: RosterFighter) => `${f.firstName} ${f.lastName}`;

/** Jedna wiadomość z federacji po walce gracza; zmienia skład (wyniki, kontuzje), żeby ranking żył. */
export function rosterNews(rng: Rng, s: GameState, after: number): NewsItem | null {
  const r = rosterFor(s);
  if (!r || r.list.length < 4) return null;
  const size = RANK_SIZE[r.tier];
  const nem = s.nemesis && matches(r, s) ? r.list.find((f) => f.id === s.nemesis!.id) : undefined;
  const roll = rng.next();
  // zadra przypomina o sobie
  if (nem && roll < 0.2) {
    s.flags.nemesisHeat = 1;
    return { after, kind: 'nemesis', text: `${nm(nem)} ${rng.pick(QUOTES)}.` };
  }
  const champ = r.list.find((f) => f.rank === 0);
  // obrona pasa w federacji
  const r2 = rng.next();
  if (champ && s.rank !== 0 && r2 < 0.25) {
    const ch = r.list.filter((f) => f.rank >= 1 && f.rank <= 3);
    const c = rng.pick(ch.length ? ch : r.list.filter((f) => f !== champ));
    if (!c) return null;
    const rd = rng.int(1, 5);
    if (rng.chance(0.25)) {
      c.record.w++;
      champ.record.l++;
      c.rank = 0;
      c.champSince = s.season;
      champ.rank = rng.int(2, 4);
      normalize(r, s);
      return { after, kind: 'title', text: `Nowy mistrz! ${rng.pick(METHODS)(nm(c), nm(champ), rd)}. Pas zmienia właściciela.` };
    }
    champ.record.w++;
    c.record.l++;
    c.rank = Math.min(size, c.rank + rng.int(1, 3));
    normalize(r, s);
    return { after, kind: 'title', text: `Obrona pasa. ${rng.pick(METHODS)(nm(champ), nm(c), rd)}.` };
  }
  // kontuzja kogoś z czołówki
  if (r2 < 0.37) {
    const f = rng.pick(r.list.filter((x) => x.rank >= 1 && x.rank <= Math.min(size, 8)));
    if (!f) return null;
    f.rank = size;
    normalize(r, s);
    return { after, kind: 'injury', text: `${nm(f)} ma ${rng.pick(INJURIES)} i wypada z czołówki rankingu.` };
  }
  // wyzwanie: ktoś z czołówki wywołuje gracza
  if (r2 < 0.5 && s.rank !== null && s.rank > 0) {
    const f = rng.pick(r.list.filter((x) => x.rank >= 1 && Math.abs(x.rank - s.rank!) <= 3));
    if (f) {
      return { after, kind: 'callout', text: `${nm(f)} (nr ${f.rank} rankingu) wywołuje cię w wywiadzie: „Niech przyjdzie, jeśli się nie boi”.` };
    }
  }
  // zwykły wynik z czołówki
  const pool = r.list.filter((x) => x.rank >= 1).sort((a, b) => a.rank - b.rank);
  if (pool.length < 2) return null;
  const i = rng.int(0, Math.max(0, pool.length - 2));
  const a = pool[i];
  const b = pool[Math.min(pool.length - 1, i + rng.int(1, 3))];
  const upset = rng.chance(0.4);
  const w = upset ? b : a;
  const l = upset ? a : b;
  w.record.w++;
  l.record.l++;
  if (w.rank > l.rank) {
    const tmp = w.rank;
    w.rank = l.rank;
    l.rank = tmp;
  }
  normalize(r, s);
  const rd = rng.int(1, 3);
  return { after, kind: 'result', text: `${rng.pick(METHODS)(nm(w), nm(l), rd)}${upset ? ' (niespodzianka, był niżej w rankingu)' : ''}.` };
}
