import type { Rng } from './rng';
import type { Club, Fighter, Peer, StatKey, Stats, Style } from './types';
import {
  CLUB_TEMPLATES,
  FREAK_TYPES,
  INTL_NICKNAMES,
  NAMES_EU,
  NAMES_PL,
  NAMES_WORLD,
  NICKNAMES,
  RANK_SIZE,
  STAT_KEYS,
  STYLE_PROFILE,
  TIER_LEVEL,
  type NamePool,
} from './data';

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const round1 = (v: number) => Math.round(v * 10) / 10;

const OVR_W: Stats = { stand: 0.2, wrest: 0.18, bjj: 0.16, cardio: 0.16, chin: 0.15, iq: 0.15 };

export function ovr(stats: Stats): number {
  let s = 0;
  for (const k of STAT_KEYS) s += stats[k] * OVR_W[k];
  return Math.round(s);
}

export function mapStats(fn: (k: StatKey) => number): Stats {
  return {
    stand: fn('stand'),
    wrest: fn('wrest'),
    bjj: fn('bjj'),
    cardio: fn('cardio'),
    chin: fn('chin'),
    iq: fn('iq'),
  };
}

export function styleOf(stats: Stats): Style {
  const { stand, wrest, bjj, chin, iq } = stats;
  const max = Math.max(stand, wrest, bjj);
  const min = Math.min(stand, wrest, bjj);
  if (max - min < 7) return 'allround';
  if (max === wrest) return 'wrestler';
  if (max === bjj) return 'grappler';
  if (chin > iq + 8) return 'brawler';
  return stand > iq + 4 ? 'kickboxer' : 'boxer';
}

export const uid = (rng: Rng, p = 'f') => `${p}${rng.int(0, 1e9).toString(36)}${rng.int(0, 1e6).toString(36)}`;

function pickPool(rng: Rng, tier: number): NamePool {
  const r = rng.next();
  if (tier <= 1) return NAMES_PL;
  if (tier === 2) return r < 0.82 ? NAMES_PL : rng.pick(NAMES_EU);
  if (tier === 3) return r < 0.3 ? NAMES_PL : rng.pick(NAMES_EU);
  return r < 0.12 ? NAMES_PL : r < 0.35 ? rng.pick(NAMES_EU) : rng.pick(NAMES_WORLD);
}

export function randomName(rng: Rng, pool: NamePool = NAMES_PL) {
  return { firstName: rng.pick(pool.first), lastName: rng.pick(pool.last) };
}

function rankBonus(tier: number, rank: number | null): number {
  if (rank === 0) return 8;
  if (rank === null) return -4;
  const size = RANK_SIZE[tier];
  return ((size - rank) / size) * 8 - 2;
}

export function randomRecord(rng: Rng, tier: number, rank: number | null) {
  const base = [0, 4, 9, 14, 17][tier];
  const spread = [5, 7, 9, 10, 12][tier];
  const quality = rank === 0 ? 1 : rank === null ? 0.3 : 1 - rank / (RANK_SIZE[tier] + 2);
  const w = Math.max(tier === 0 ? 0 : 1, base + rng.int(0, spread) + Math.round(quality * 4));
  const l = Math.max(0, Math.round(rng.int(0, Math.max(1, Math.round(w * 0.45))) * (1.2 - quality)));
  const d = rng.chance(0.15) ? 1 : 0;
  return { w, l, d };
}

export function generateOpponent(
  rng: Rng,
  tier: number,
  rank: number | null,
  hard: boolean,
): Fighter {
  const pool = pickPool(rng, tier);
  const { firstName, lastName } = randomName(rng, pool);
  const style: Style = rng.weighted([
    { item: 'boxer' as Style, w: 16 },
    { item: 'kickboxer' as Style, w: 16 },
    { item: 'wrestler' as Style, w: pool.country === 'Dagestan' ? 60 : 18 },
    { item: 'grappler' as Style, w: pool.country === 'Brazylia' ? 40 : 15 },
    { item: 'brawler' as Style, w: tier <= 1 ? 22 : 10 },
    { item: 'allround' as Style, w: 10 + tier * 4 },
  ]);
  const level = TIER_LEVEL[tier] + rankBonus(tier, rank) + rng.int(-5, 5) + (hard ? 3 : 0);
  const prof = STYLE_PROFILE[style];
  const stats = mapStats((k) => clamp(Math.round(level + prof[k] + rng.int(-5, 5)), 8, 99));
  const nickPool = pool === NAMES_PL ? NICKNAMES : INTL_NICKNAMES;
  return {
    id: uid(rng, 'o'),
    firstName,
    lastName,
    nickname: rng.chance(0.75) ? rng.pick(nickPool) : '',
    country: pool.country,
    flag: pool.flag,
    age: rng.int(20, 34),
    style,
    stats,
    record: randomRecord(rng, tier, rank),
    rank,
  };
}

export function generateFreak(rng: Rng): Fighter {
  const f = rng.pick(FREAK_TYPES);
  const { firstName, lastName } = randomName(rng);
  const level = rng.int(24, 50);
  const style: Style = rng.pick(['brawler', 'boxer', 'brawler', 'allround', 'wrestler'] as Style[]);
  const prof = STYLE_PROFILE[style];
  return {
    id: uid(rng, 'x'),
    firstName,
    lastName,
    nickname: f.nick,
    country: 'Polska',
    flag: '🇵🇱',
    age: rng.int(22, 44),
    style,
    stats: mapStats((k) => clamp(Math.round(level + prof[k] + rng.int(-6, 6)), 5, 75)),
    record: { w: rng.int(0, 4), l: rng.int(0, 4), d: 0 },
    rank: null,
    freak: f.title,
  };
}

// --- Rocznik (pokolenie) ---
export function createPeers(rng: Rng, n: number, age: number): Peer[] {
  const peers: Peer[] = [];
  for (let i = 0; i < n; i++) {
    const { firstName, lastName } = randomName(rng);
    const style: Style = rng.pick(['boxer', 'kickboxer', 'wrestler', 'grappler', 'brawler', 'allround'] as Style[]);
    const talent = rng.next() ** 1.3;
    const base = 18 + talent * 12 + rng.int(-3, 3);
    const prof = STYLE_PROFILE[style];
    peers.push({
      id: uid(rng, 'p'),
      firstName,
      lastName,
      nickname: rng.chance(0.6) ? rng.pick(NICKNAMES) : '',
      country: 'Polska',
      flag: '🇵🇱',
      age,
      style,
      stats: mapStats((k) => clamp(Math.round(base + prof[k] * 0.6 + rng.int(-3, 3)), 5, 60)),
      record: { w: 0, l: 0, d: 0 },
      rank: null,
      peer: true,
      tier: 0,
      talent,
      belts: 0,
      retired: false,
      metCount: 0,
      h2h: { w: 0, l: 0, d: 0 },
    });
  }
  return peers;
}

export function ageRate(age: number): number {
  if (age <= 19) return 0.16;
  if (age <= 23) return 0.12;
  if (age <= 27) return 0.08;
  if (age <= 30) return 0.045;
  if (age <= 32) return 0.015;
  return 0;
}

export function progressPeer(rng: Rng, p: Peer) {
  if (p.retired) return;
  p.age += 1;
  const pot = 48 + p.talent * 46;
  const rate = ageRate(p.age) * (0.8 + rng.next() * 0.5);
  for (const k of STAT_KEYS) {
    const target = pot + STYLE_PROFILE[p.style][k];
    p.stats[k] = clamp(Math.round(p.stats[k] + Math.max(0, target - p.stats[k]) * rate + rng.int(-1, 1)), 5, 99);
    if (p.age >= 32) p.stats[k] = clamp(p.stats[k] - rng.int(0, 2), 5, 99);
  }
  // rok zawodnika z rocznika
  const fights = [4, 3, 3, 3, 2][p.tier];
  const level = TIER_LEVEL[p.tier];
  const o = ovr(p.stats);
  let w = 0;
  let l = 0;
  for (let i = 0; i < fights; i++) {
    const pw = 1 / (1 + Math.exp(-(o - level) / 5));
    if (rng.chance(pw)) w++;
    else l++;
  }
  p.record.w += w;
  p.record.l += l;
  if (p.tier < 4 && (p.tier > 0 || p.age >= 18) && w >= fights - (p.tier === 0 ? 1 : 0) && o > TIER_LEVEL[p.tier + 1] - 7) {
    if (p.tier === 0) p.record = { w: 0, l: 0, d: 0 }; // rekord zawodowy od zera
    p.tier++;
    p.rank = rng.int(9, RANK_SIZE[p.tier]);
  } else if (p.tier > 0 && l >= Math.ceil(fights * 0.67) && o < level - 3) {
    p.tier--;
    p.rank = null;
  } else {
    const size = RANK_SIZE[p.tier];
    const cur = p.rank ?? size + 2;
    p.rank = clamp(cur - (w - l) * rng.int(1, 3), 0, size + 2);
    if (p.rank > size) p.rank = null;
  }
  // pas w tej federacji ma mistrz ze składu: kolega z rocznika zdobywa pasy gdzie indziej i zostaje w czołówce
  if (p.rank === 0) {
    if (rng.chance(0.6)) p.belts++;
    p.rank = 1;
  }
  if (p.age >= 30 && rng.chance((p.age - 29) * 0.07 + (o < level ? 0.08 : 0))) p.retired = true;
  if (p.age < 24 && o < 30 && rng.chance(0.12)) p.retired = true; // rzucił MMA dla pracy w Niemczech
}

// --- Kluby ---
export function makeClub(rng: Rng, idx: number, home: string): Club {
  const t = CLUB_TEMPLATES[idx];
  const strength = clamp(t.quality * 18 + rng.int(-6, 6), 8, 99);
  return {
    id: `c${idx}`,
    name: t.name,
    city: t.city.replace('{home}', home),
    quality: t.quality,
    strength,
    cost: t.cost,
    specialty: t.specialty,
    injuryMod: t.injuryMod,
    desc: t.desc,
  };
}

export const CLUB_MULT = [0, 0.6, 0.8, 1.0, 1.2, 1.4];
// słaby klub nie wyciągnie z Ciebie pełnego potencjału (jak słaby bolid w oryginale)
export const CLUB_CAP = [0, 16, 10, 5, 1, 0];
