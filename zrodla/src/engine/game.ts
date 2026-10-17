import { activeManager, currentManager, managerBlocked, managerById } from './managers';
import { createRng, type Rng } from './rng';
import type {
  FightOffer,
  WeightKey,
  Club,
  Contract,
  Effects,
  Fighter,
  FightReport,
  GameState,
  HistoryEntry,
  Moment,
  Outcome,
  Peer,
  Profile,
  SeasonSummary,
  StatKey,
  Stats,
  Tourney,
  TourneyStage,
  CardSpot,
} from './types';
import {
  AMATEUR_TOURNEYS,
  AMATEUR_TOURNEYS_LOCAL,
  REGION_CITY,
  BAD_FORMS,
  GOOD_FORMS,
  STAGE_LABELS,
  TIER_SHORT,
  TOURNEY_CITIES,
  WEIGHTS,
  WEIGHT_KEYS,
  amateurDivision,
  galaPrefix,
  regionalFedName,
  BELT_NAMES,
  CLUB_TEMPLATES,
  DIFFICULTY,
  FREAK_FEDS,
  HOMETOWNS,
  RANK_SIZE,
  SEASON_FORMS,
  START_PROFILES,
  STAT_KEYS,
  STAT_LABELS,
  STYLE_PROFILE,
  TIER_ENTRY,
  TIER_FEDS,
  FED_NOTES,
  FED_VENUES,
  TUNEUP_GALAS,
  NAMES_TUNEUP,
  TUNEUP_NICKS,
  SHADY_SPONSORS,
  TIER_FIGHTS,
  TIER_LEVEL,
  TIER_NAMES,
  TIER_PURSE,
  VOIVODESHIPS,
  livingCost,
} from './data';
import {
  CLUB_MULT,
  CLUB_CAP,
  ageRate,
  clamp,
  createPeers,
  generateFreak,
  generateOpponent,
  makeClub,
  mapStats,
  ovr,
  progressPeer,
  randomName,
  uid,
} from './fighter';
import { advanceFight, applyDecision, chanceFrom, distFrom, newSim, rollOutcome, type FightCtx } from './fight';
import { EVENTS, eventWeight, findEvent } from './events';

export const SAVE_VERSION = 2;

// ---------------------------------------------------------------------------
// Pomocnicze
// ---------------------------------------------------------------------------

function withRng<T>(s: GameState, fn: (rng: Rng) => T): T {
  const rng = createRng(s.rngState);
  const out = fn(rng);
  s.rngState = rng.state();
  return out;
}

export function clone(s: GameState): GameState {
  return structuredClone(s);
}

export function fullName(s: GameState) {
  return `${s.profile.firstName} ${s.profile.lastName}`;
}

export function displayName(s: GameState) {
  const p = s.profile;
  return p.nickname ? `${p.firstName} „${p.nickname}” ${p.lastName}` : `${p.firstName} ${p.lastName}`;
}

export function fighterName(f: Fighter) {
  return f.nickname ? `${f.firstName} „${f.nickname}” ${f.lastName}` : `${f.firstName} ${f.lastName}`;
}

export function recStr(r: { w: number; l: number; d: number }) {
  return `${r.w}-${r.l}-${r.d}`;
}

/** Rekord, który ma sens pokazać: zawodowy po debiucie, amatorski przed nim. */
export function mainRecord(s: GameState) {
  return s.proDebut ? s.record : s.amRecord;
}

export function mainRecordLabel(s: GameState) {
  return s.proDebut ? 'rekord zawodowy' : 'rekord amatorski';
}

export function totalWins(s: GameState) {
  return s.record.w + s.amRecord.w;
}

export function medalCount(s: GameState) {
  return s.medals.gold + s.medals.silver + s.medals.bronze;
}

export function weightLabel(s: GameState) {
  return WEIGHTS[divisionKey(s)].label;
}
export function divisionKey(s: GameState): WeightKey {
  return s.division ?? s.profile.weight ?? 'polsrednia';
}
/** −1 = zbijasz wagę (kategoria niżej), +1 = walczysz kategorię wyżej. */
export function weightShift(s: GameState): number {
  return WEIGHT_KEYS.indexOf(divisionKey(s)) - WEIGHT_KEYS.indexOf(s.profile.weight ?? 'polsrednia');
}
/** Kategorie, do których można przejść (sąsiednie wokół naturalnej). */
export function divisionOptions(s: GameState): WeightKey[] {
  const n = WEIGHT_KEYS.indexOf(s.profile.weight ?? 'polsrednia');
  return [n - 1, n, n + 1].filter((i) => i >= 0 && i < WEIGHT_KEYS.length).map((i) => WEIGHT_KEYS[i]);
}
/** Szansa, że nie zrobisz wagi przy zbijaniu (%). */
export function weightMissChance(s: GameState): number {
  if (weightShift(s) >= 0) return 0;
  return Math.round(clamp(7 + Math.max(0, s.age - 28) * 1.2 + (s.stats.cardio < 35 ? 4 : 0), 5, 25));
}
export function changeDivision(s0: GameState, key: WeightKey): GameState {
  if (!divisionOptions(s0).includes(key) || key === divisionKey(s0) || s0.tier < 1) return s0;
  const s = clone(s0);
  s.division = key;
  if (s.rank !== null) {
    s.rank = null;
    s.titleDefenses = 0;
  }
  log(s, `Zmiana kategorii: ${WEIGHTS[key].label.toLowerCase()}.`);
  return s;
}

export function rankStr(rank: number | null, tier?: number) {
  if (rank === 0) return 'Mistrz';
  if (rank === null) return 'poza rankingiem';
  return `#${rank}${tier !== undefined ? ` ${TIER_SHORT[tier]}` : ''}`;
}

export function playerOvr(s: GameState) {
  return ovr(s.stats);
}

// Efektywne statystyki w walce (zużycie obniża szczękę i kondycję)
export function effectiveStats(s: GameState): Stats {
  return mapStats((k) => {
    let v = s.stats[k];
    if (k === 'chin') v -= s.wear * 0.3;
    if (k === 'cardio') v -= s.wear * 0.1;
    return Math.max(5, v);
  });
}

function log(s: GameState, text: string) {
  s.timeline.push({ season: s.season, age: s.age, text });
}

function fedFor(rng: Rng, tier: number, region?: string) {
  const base = rng.pick(TIER_FEDS[tier]);
  return tier === 1 && region ? regionalFedName(base, region) : base;
}

export function pl(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const d = n % 10;
  const t = n % 100;
  if (d >= 2 && d <= 4 && (t < 12 || t > 14)) return few;
  return many;
}

// ---------------------------------------------------------------------------
// Nowa gra
// ---------------------------------------------------------------------------

export interface NewGameOpts {
  slot: number;
  mode: 'normal' | 'daily';
  seed: number;
  dailyLabel?: string;
  profile: Profile;
}

export function randomProfile(rng: Rng): Profile {
  const { firstName, lastName } = randomName(rng);
  const region = rng.pick(VOIVODESHIPS);
  return {
    firstName,
    lastName,
    nickname: '',
    region,
    hometown: rng.pick(HOMETOWNS[region]),
    style: rng.pick(['boxer', 'kickboxer', 'wrestler', 'grappler', 'brawler', 'allround'] as const),
    weight: rng.pick(WEIGHT_KEYS),
    start: 'osiedle',
    difficulty: 'normal',
  };
}

export function newGame(opts: NewGameOpts): GameState {
  const rng = createRng(opts.seed);
  const p = opts.profile;
  const sp = START_PROFILES[p.start];
  const talent = sp.talent[0] + rng.next() * (sp.talent[1] - sp.talent[0]);
  const prof = STYLE_PROFILE[p.style];
  const potBase = 50 + talent * 44;
  const potential = mapStats((k) => clamp(Math.round(potBase + prof[k] * 0.8 + rng.int(-5, 5)), 35, 99));
  const startBase = 17 + talent * 9;
  const stats = mapStats((k) => clamp(Math.round(startBase + prof[k] * 0.6 + rng.int(-3, 3)), 6, 60));
  if (p.start === 'wybraniec') for (const k of STAT_KEYS) potential[k] = clamp(potential[k] + 6, 35, 99);
  if (p.start === 'junior') {
    stats.wrest = clamp(stats.wrest + 10, 6, 60);
    potential.wrest = clamp(potential.wrest + 6, 35, 99);
  }
  const wmod = WEIGHTS[p.weight ?? 'polsrednia'].mod;
  for (const [k, v] of Object.entries(wmod) as [StatKey, number][]) {
    stats[k] = clamp(stats[k] + v, 6, 60);
    potential[k] = clamp(potential[k] + v, 35, 99);
  }
  const clubIdx = p.start === 'biznes' ? 1 : 0;
  const club = makeClub(rng, clubIdx, p.hometown);
  const tier = 0;
  const contract: Contract = {
    id: 'c0',
    tier,
    fed: TIER_FEDS[0][0],
    kind: 'stay',
    seasons: 1,
    fights: TIER_FIGHTS[0],
    purse: 0,
    winBonus: 0,
    entryCost: TIER_ENTRY[0],
    startRank: null,
    note: '',
    available: true,
  };
  const s: GameState = {
    v: SAVE_VERSION,
    slot: opts.slot,
    rngState: rng.state(),
    mode: opts.mode,
    dailyLabel: opts.dailyLabel,
    createdAt: Date.now(),
    profile: { ...p },
    stats,
    potential,
    age: 16,
    season: 1,
    year: 2026,
    money: sp.money,
    totalEarned: 0,
    media: p.start === 'biznes' ? 12 : p.start === 'wybraniec' ? 10 : 3,
    rep: p.start === 'junior' ? 30 : 20,
    relations: 5,
    wear: 0,
    injury: null,
    sponsors: [],
    loans: [],
    promises: [],
    brokenPromises: 0,
    tier,
    fed: contract.fed,
    rank: null,
    titleDefenses: 0,
    belts: [],
    peakTier: 0,
    peakRank: null,
    peakOvr: ovr(stats),
    club,
    clubSeasons: 0,
    contract,
    contractSeasonsLeft: 1,
    trainingPick: null,
    lastGains: {},
    record: { w: 0, l: 0, d: 0 },
    amRecord: { w: 0, l: 0, d: 0 },
    medals: { gold: 0, silver: 0, bronze: 0 },
    proDebut: null,
    finishes: { ko: 0, sub: 0, koLosses: 0, subLosses: 0 },
    streak: 0,
    freakFights: 0,
    history: [],
    seasons: [],
    timeline: [],
    peers: [],
    phase: 'training',
    event: null,
    eventQueue: [],
    run: null,
    lastSummary: null,
    market: null,
    // nowa kariera zaczyna się od sparingu kontrolnego u trenera
    flags: { amLevel: 0, tryoutPending: 1 },
    seenEvents: [],
    ending: null,
  };
  s.peers = createPeers(rng, 10, 16);
  for (const peer of s.peers) if (peer.lastName === p.lastName) peer.lastName = otherLastName(rng, p.lastName);
  s.rngState = rng.state();
  log(s, `Pierwszy trening: ${club.name}, ${club.city}.`);
  // kariera zaczyna się od sparingu kontrolnego, dopiero potem obóz przygotowawczy
  const tryout = findEvent('sparing_kontrolny');
  if (tryout) {
    s.phase = 'event';
    s.event = { id: tryout.id, brand: tryout.brand, title: tryout.title ?? 'Sparing kontrolny', text: tryout.text(s), choices: tryout.choices(s) };
  }
  return s;
}

function otherLastName(rng: Rng, avoid: string) {
  for (let i = 0; i < 20; i++) {
    const n = randomName(rng).lastName;
    if (n !== avoid) return n;
  }
  return avoid === 'Nowak' ? 'Kowalski' : 'Nowak';
}

export function introText(s: GameState) {
  // po sparingu kontrolnym trener mówi, gdzie startujesz; stare zapisy dostają wstęp postaci
  if (s.flags.tryout === 2) return 'Po sparingu trener nie ma wątpliwości: jedziesz od razu na Amatorski Puchar Polski. Ale najpierw obóz przygotowawczy, bo tam nikt nie da ci forów.';
  if (s.flags.tryout === 1) return 'Po sparingu trener mówi wprost: na start zawody wojewódzkie, tam się otrzaskasz. Najpierw obóz przygotowawczy, żeby było z czym jechać.';
  return START_PROFILES[s.profile.start].intro;
}

// ---------------------------------------------------------------------------
// Trening zimowy
// ---------------------------------------------------------------------------

export function trainingPreview(s: GameState, k: StatKey): number {
  // sam bonus z obozu (reszta rośnie naturalnie)
  const room = Math.max(0, s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k]);
  let g = room * 0.13 + 2.2;
  if (k === s.club.specialty) g *= 1.15;
  if (s.age >= 33) g *= 0.5;
  if (room <= 0) g = 0.5;
  return Math.max(0.5, Math.round(g * 10) / 10);
}

function growthRate(s: GameState) {
  return ageRate(s.age) * CLUB_MULT[s.club.quality] * (s.flags.debt ? 0.75 : 1) * (s.tier <= 1 && s.age >= 19 ? 0.9 : 1);
}

/** Szacunek: ile wyniesie umiejętność po okresie przygotowawczym, gdy (nie) wybierzesz jej na obóz. */
export function trainingForecast(s: GameState, k: StatKey, focused: boolean, camp?: Camp | null): number {
  const room = Math.max(0, s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k]);
  let g = room * growthRate(s) * 0.85;
  if (k === s.club.specialty) g *= 1.25;
  if (focused) g += trainingPreview(s, k);
  const v = clamp(Math.round(s.stats[k] + g), 1, 99);
  return camp ? clamp(v + Math.max(0, Math.min(campGain(s, camp, k), s.potential[k] - v)), 1, 99) : v;
}

/** Czy klub ogranicza już rozwój (statystyki blisko sufitu klubu, a talent pozwala na więcej). */
export function clubLimits(s: GameState): boolean {
  if (s.club.quality >= 5) return false;
  const near = STAT_KEYS.filter((k) => s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k] <= 4 && s.potential[k] - s.stats[k] > 6).length;
  return near >= 2;
}

// Obozy zagraniczne: droga premia dla zawodowców z wyższych szczebli
export interface Camp {
  id: string;
  name: string;
  place: string;
  desc: string;
  main: StatKey;
  second: StatKey;
}
export const CAMPS: Camp[] = [
  { id: 'tajlandia', name: 'Tajlandia', place: 'obóz muay thai pod Phuketem', desc: 'Dwa treningi dziennie, 35 stopni i łokcie od rana.', main: 'stand', second: 'cardio' },
  { id: 'dagestan', name: 'Dagestan', place: 'sala zapaśnicza w górach', desc: 'Nikt nie mówi po polsku, za to każdy obala.', main: 'wrest', second: 'chin' },
  { id: 'usa', name: 'Floryda', place: 'Top Squad na Florydzie', desc: 'Sparingi z gwiazdami, analiza nagrań i najlepsza dieta.', main: 'bjj', second: 'iq' },
];
const CAMP_COST = [0, 0, 15000, 50000, 120000];
export function campCost(s: GameState) {
  return CAMP_COST[s.tier] ?? 0;
}
/** Powód, dla którego obóz nie jest dostępny (null = można jechać). */
export function campBlocked(s: GameState): string | null {
  if (s.tier < 2) return 'Obozy za granicą od ligi krajowej w górę.';
  if (s.injury) return 'Najpierw wylecz kontuzję.';
  if (s.money < campCost(s)) return `Brakuje pieniędzy: obóz kosztuje ${campCost(s).toLocaleString('pl-PL')} zł.`;
  return null;
}
/** Premia z obozu do danej umiejętności (do granicy talentu). */
export function campGain(s: GameState, camp: Camp | null | undefined, k: StatKey): number {
  if (!camp) return 0;
  const base = k === camp.main ? 2 : k === camp.second ? 1 : 0;
  const g = s.age >= 33 ? Math.ceil(base / 2) : base;
  return Math.max(0, Math.min(g, s.potential[k] - s.stats[k]));
}

export function doTraining(s0: GameState, k: StatKey, campId?: string | null): GameState {
  if (s0.injury?.out) return rehabYear(s0);
  const s = clone(s0);
  const camp = campId && !campBlocked(s0) ? CAMPS.find((c) => c.id === campId) ?? null : null;
  s.flags.ovrStart = ovr(s.stats);
  s.flags.moneyStart = s.money;
  withRng(s, (rng) => {
    const before = { ...s.stats };
    const rate = growthRate(s);
    for (const key of STAT_KEYS) {
      const room = Math.max(0, s.potential[key] - CLUB_CAP[s.club.quality] - s.stats[key]);
      let g = room * rate * 0.85;
      if (key === s.club.specialty) g *= 1.25;
      if (key === k) {
        let focus = room * 0.13 + 2.2 + rng.next() * 0.8 - 0.4;
        if (key === s.club.specialty) focus *= 1.15;
        if (s.age >= 33) focus *= 0.5;
        if (room <= 0) focus = 0.5;
        g += focus;
      }
      s.stats[key] = clamp(Math.round(s.stats[key] + g), 1, 99);
    }
    s.camp = null;
    if (camp) {
      const cost = campCost(s);
      for (const key of [camp.main, camp.second]) s.stats[key] = clamp(s.stats[key] + campGain(s, camp, key), 1, 99);
      s.money -= cost;
      s.media = clamp(s.media + 1, 0, 100);
      s.camp = camp.id;
      log(s, `Obóz: ${camp.name} (${camp.place}), ${cost.toLocaleString('pl-PL')} zł.`);
    }
    // głowa rośnie z doświadczeniem
    if (s.history.length >= 15 && s.age < 34 && rng.chance(0.5)) s.stats.iq = clamp(s.stats.iq + 1, 1, 99);
    s.lastGains = mapStats((key) => s.stats[key] - before[key]);
    s.trainingPick = k;
    s.peakOvr = Math.max(s.peakOvr, ovr(s.stats));
    offerShadyDeal(rng, s);
  });
  s.phase = 'budget';
  return s;
}

/** Menedżer (albo kolega) podsuwa dziwnego sponsora: kasa jest, gorzej z wizerunkiem. */
function offerShadyDeal(rng: Rng, s: GameState) {
  s.shadyDeal = null;
  if (s.tier < 1 || s.contract.kind === 'freak') return;
  if (s.sponsors.some((x) => SHADY_SPONSORS.some((d) => d.name === x.name))) return;
  if (s.sponsors.length >= sponsorCap(s)) return;
  const tight = budgetBalance(s) + s.money < 15000 + s.tier * 10000;
  const mgr = currentManager(s);
  if (!rng.chance(tight ? 0.6 : mgr ? 0.14 : 0.06)) return;
  const d = rng.pick(SHADY_SPONSORS);
  const base = [0, 3500, 11000, 26000, 60000][s.tier];
  const perSeason = Math.round((base * (1 + s.media / 150) * (0.85 + rng.next() * 0.3)) / 500) * 500;
  s.shadyDeal = {
    season: s.season,
    name: d.name,
    product: d.product,
    pitch: d.pitch,
    perSeason,
    seasons: rng.chance(0.5) ? 1 : 2,
    rep: -rng.int(5, 8),
    media: 2,
    from: mgr ? mgr.name : 'Kolega z siłowni',
    status: 'open',
  };
}

export function acceptShadyDeal(s0: GameState): GameState {
  const d = s0.shadyDeal;
  if (!d || d.status !== 'open' || d.season !== s0.season || s0.sponsors.length >= sponsorCap(s0)) return s0;
  const s = clone(s0);
  const x = s.shadyDeal!;
  x.status = 'taken';
  s.sponsors.push({ id: `shady-${s.season}`, name: x.name, perSeason: x.perSeason, seasonsLeft: x.seasons, clause: `reklamujesz: ${x.product}` });
  s.rep = clamp(s.rep + x.rep, 0, 100);
  s.media = clamp(s.media + x.media, 0, 100);
  s.flags.shadyDeals = (s.flags.shadyDeals ?? 0) + 1;
  log(s, `Sponsor: ${x.name} (${x.product}). Kasa jest, środowisko się śmieje.`);
  return s;
}

export function refuseShadyDeal(s0: GameState): GameState {
  if (!s0.shadyDeal || s0.shadyDeal.status !== 'open') return s0;
  const s = clone(s0);
  s.shadyDeal!.status = 'refused';
  return s;
}

// ---------------------------------------------------------------------------
// Budżet
// ---------------------------------------------------------------------------

export interface BudgetLine {
  label: string;
  sub?: string;
  amount: number;
  logo?: { kind: 'club' | 'sponsor'; name: string };
  icon?: string;
}

export function budgetLines(s: GameState): BudgetLine[] {
  const lines: BudgetLine[] = [];
  if (s.club.cost > 0) lines.push({ label: 'Składki i trenerzy', sub: s.club.name, amount: -s.club.cost, logo: { kind: 'club', name: s.club.name } });
  if (s.contract.entryCost > 0)
    lines.push(
      s.tier === 0
        ? { label: 'Opłaty startowe i dojazdy', sub: amLevel(s) === 0 ? 'zawody wojewódzkie' : 'Amatorski Puchar i Mistrzostwa Polski', amount: -s.contract.entryCost, icon: 'receipt' }
        : { label: 'Badania, licencja, dojazdy', sub: s.contract.fed, amount: -s.contract.entryCost, icon: 'receipt' },
    );
  // zawodowcy na wyższych szczeblach płacą sztab: trenera przygotowania i dietetyka
  const staff = [0, 0, 2500, 6000, 30000][s.tier];
  if (staff > 0 && s.contract.kind !== 'freak')
    lines.push({ label: 'Sztab', sub: 'trener przygotowania, dietetyk', amount: -staff, icon: 'users' });
  // zaplecze do wyboru
  if (backroomOpen(s)) {
    for (const b of BACKROOM) {
      if (!s.backroom?.[b.id]) continue;
      const c = backroomCost(s, b.id);
      lines.push({ label: b.name, sub: c === 0 ? 'pokrywa Ground Game Labs' : b.short, amount: -c, icon: b.icon });
    }
  }
  const job = s.tier <= 1 && s.age >= 19;
  // na krajówce wielu zawodników dalej dorabia na pół etatu
  const halfJob = s.tier === 2 && s.age >= 19 && (s.rank === null || s.rank > 3) && s.contract.kind !== 'freak';
  const living = Math.round((livingCost(s.age) * (job ? 0.15 : halfJob ? 0.5 : 1)) / 500) * 500 + (s.flags.kid ? 10000 : 0);
  if (living > 0)
    lines.push({
      label: 'Życie',
      sub: job ? 'etat pokrywa większość, trenujesz po pracy' : halfJob ? 'pół etatu pokrywa połowę kosztów' : s.flags.kid ? 'mieszkanie, jedzenie, dziecko' : 'mieszkanie i jedzenie',
      amount: -living,
      icon: 'home',
    });
  for (const l of s.loans) lines.push({ label: 'Rata kredytu', sub: `${l.left === 1 ? 'ostatnia rata' : `zostało ${l.left} ${pl(l.left, 'rata', 'raty', 'rat')}`}`, amount: -l.installment, icon: 'card' });
  for (const sp of s.sponsors)
    lines.push({ label: sp.name, sub: `${sp.clause} · ${sp.seasonsLeft === 1 ? 'ostatni rok' : `jeszcze ${sp.seasonsLeft} ${pl(sp.seasonsLeft, 'rok', 'lata', 'lat')}`}`, amount: sp.perSeason, logo: { kind: 'sponsor', name: sp.name } });
  if (s.academy) lines.push({ label: academyName(s), sub: `twoja akademia · ${ACADEMY_LEVELS[s.academy - 1].name}`, amount: academyIncome(s), icon: 'home' });
  if (s.age < 19 && s.relations >= 3) lines.push({ label: 'Rodzice dokładają', sub: 'z trzynastki', amount: 2000 + s.relations * 300, icon: 'heart' });
  return lines;
}

// Własna akademia: inwestycja na późną karierę (przychód co roku i punkty legacy)
export const ACADEMY_LEVELS = [
  { cost: 150000, income: 10000, name: 'sala w wynajętej hali', note: 'grupy dzieci i amatorów' },
  { cost: 400000, income: 25000, name: 'własny klub z klatką', note: 'sekcja zawodnicza i obozy letnie' },
  { cost: 1000000, income: 50000, name: 'akademia z filiami', note: 'trzy miasta, własna gala amatorska' },
  { cost: 3000000, income: 120000, name: 'sieć akademii w całym kraju', note: 'franczyza, liga juniorów i program w telewizji' },
];
export function academyName(s: GameState) {
  return `${s.profile.lastName} Team`;
}
export function academyIncome(s: GameState) {
  const lvl = s.academy ?? 0;
  if (!lvl) return 0;
  // znane nazwisko ściąga ludzi na zajęcia
  return Math.round((ACADEMY_LEVELS[lvl - 1].income * (0.7 + s.media / 150)) / 500) * 500;
}
/** Następny poziom akademii albo powód, dlaczego jeszcze nie. */
export function academyNext(s: GameState): { cost: number; name: string; note: string; income: number; blocked: string | null } | null {
  const lvl = s.academy ?? 0;
  if (lvl >= ACADEMY_LEVELS.length) return null;
  const L = ACADEMY_LEVELS[lvl];
  let blocked: string | null = null;
  if (s.tier < 2 && lvl === 0) blocked = 'Najpierw zrób nazwisko w lidze krajowej.';
  else if (s.age < 22) blocked = 'Masz za mało lat, żeby ktoś ci powierzył dzieci na treningach.';
  else if (s.loans.length) blocked = 'Bank nie da drugiego zobowiązania, najpierw spłać kredyt.';
  else if (s.money < L.cost) blocked = `Potrzebujesz ${L.cost.toLocaleString('pl-PL')} zł.`;
  const income = Math.round((L.income * (0.7 + s.media / 150)) / 500) * 500;
  return { cost: L.cost, name: L.name, note: L.note, income, blocked };
}
export function investAcademy(s0: GameState): GameState {
  const n = academyNext(s0);
  if (!n || n.blocked) return s0;
  const s = clone(s0);
  s.money -= n.cost;
  s.academy = (s.academy ?? 0) + 1;
  s.rep = clamp(s.rep + 2, 0, 100);
  s.media = clamp(s.media + 2, 0, 100);
  log(s, s.academy === 1 ? `Otwierasz ${academyName(s)}: ${n.name}.` : `${academyName(s)} rośnie: ${n.name}.`);
  return s;
}

// ---------------------------------------------------------------------------
// Zaplecze: fizjoterapeuta, lekarz, suplementy (opcjonalne, od polskiej federacji)
// ---------------------------------------------------------------------------
export type BackroomId = 'physio' | 'doctor' | 'supps';
export const BACKROOM: { id: BackroomId; name: string; short: string; effect: string; icon: string; cost: number[] }[] = [
  { id: 'physio', name: 'Fizjoterapeuta', short: 'masaże, rozluźnianie, taping', effect: 'Organizm wolniej się zużywa, kariera trwa dłużej.', icon: 'heart', cost: [0, 0, 3000, 7000, 20000] },
  { id: 'doctor', name: 'Lekarz sportowy', short: 'badania i opieka przed walką', effect: 'Rzadsze kontuzje, a jeśli już, to lżejsze.', icon: 'bandage', cost: [0, 0, 5000, 12000, 30000] },
  { id: 'supps', name: 'Suplementacja', short: 'odżywki, witaminy, elektrolity', effect: 'Lekko lepsza forma w każdej walce.', icon: 'flame', cost: [0, 0, 1500, 4000, 9000] },
];
export const LABS_SPONSOR = 'Ground Game Labs';
export function hasLabs(s: GameState) {
  return s.sponsors.some((x) => x.name === LABS_SPONSOR);
}
export function backroomOpen(s: GameState) {
  return s.tier >= 2 && s.contract.kind !== 'freak';
}
export function backroomCost(s: GameState, id: BackroomId): number {
  if (id === 'supps' && hasLabs(s)) return 0;
  return BACKROOM.find((b) => b.id === id)!.cost[s.tier] ?? 0;
}
/** Aktywne zaplecze (tylko gdy w ogóle dostępne). */
function hasBackroom(s: GameState, id: BackroomId) {
  return backroomOpen(s) && !!s.backroom?.[id];
}
export function setBackroom(s0: GameState, id: BackroomId, on: boolean): GameState {
  const s = clone(s0);
  s.backroom = { ...(s.backroom ?? {}), [id]: on };
  return s;
}

export function budgetBalance(s: GameState) {
  return budgetLines(s).reduce((a, b) => a + b.amount, 0);
}

export function expectedPurses(s: GameState) {
  return (s.contract.purse + s.contract.winBonus * 0.5) * plannedFights(s) * (1 - (currentManager(s)?.cut ?? 0));
}

/** Ile maksymalnie da bank na danym szczeblu kariery. */
const LOAN_CAP = [20000, 40000, 120000, 300000, 800000];
/** Do ilu złotych na minusie można jeszcze zacząć rok (debet). */
export const OVERDRAFT = 5000;

/** Czemu bank nie da kredytu (null = da). */
export function loanRefusal(s: GameState): string | null {
  const active = s.loans.filter((l) => l.left > 0);
  if (active.length) {
    const left = active.reduce((a, l) => a + l.left, 0);
    return `Bank odmawia: najpierw spłać obecny kredyt (zostało ${left} ${pl(left, 'rata', 'raty', 'rat')}).`;
  }
  if (s.money < -30000) return 'Bank odmawia: masz za duże długi.';
  return null;
}

export function loanOffer(s: GameState) {
  const short = -(s.money + budgetBalance(s));
  if (short <= 0) return null;
  if (loanRefusal(s)) return null;
  const amount = Math.min(LOAN_CAP[s.tier], Math.ceil((short + 2000) / 1000) * 1000);
  const count = 3;
  const installment = Math.ceil((amount * 1.18) / count / 1000) * 1000;
  return { amount, installment, count };
}

export function takeLoan(s0: GameState): GameState {
  const s = clone(s0);
  const o = loanOffer(s);
  if (!o) return s;
  s.money += o.amount;
  s.loans.push({ installment: o.installment, left: o.count });
  log(s, `Kredyt na ${o.amount.toLocaleString('pl-PL')} zł.`);
  return s;
}

/** Tańszy klub na ratunek budżetu: najlepszy, na który cię stać (w ostateczności klub z remizy). */
export function cheaperClub(s: GameState): { idx: number; name: string; cost: number; quality: number } | null {
  if (s.club.cost <= 0) return null;
  const room = s.club.cost + s.money + budgetBalance(s) + OVERDRAFT;
  const cands = CLUB_TEMPLATES.map((t, idx) => ({ t, idx }))
    .filter(({ t }) => t.cost < s.club.cost && t.minTier <= s.tier && t.cost <= Math.max(0, room))
    .sort((a, b) => b.t.quality - a.t.quality || a.t.cost - b.t.cost);
  const pick = cands[0] ?? { t: CLUB_TEMPLATES[0], idx: 0 };
  return { idx: pick.idx, name: pick.t.name, cost: pick.t.cost, quality: pick.t.quality };
}

export function downgradeClub(s0: GameState): GameState {
  const c = cheaperClub(s0);
  if (!c) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const prev = s.club.name;
    s.club = makeClub(rng, c.idx, s.profile.hometown);
    s.clubSeasons = 0;
    log(s, `Na składki w ${prev} nie starcza. Przenosisz się do ${s.club.name}.`);
  });
  return s;
}

/** Ile zostanie po roku z danym klubem (do ostrzeżenia na rynku). */
export function projectedAfter(s: GameState, clubCost: number): number {
  const base = s.money + budgetBalance(s) + s.club.cost - clubCost;
  return base + Math.round(expectedPurses(s) * 0.8);
}

/** Czy można zacząć rok z tym budżetem. */
export function canStartSeason(s: GameState) {
  return s.money + budgetBalance(s) >= -OVERDRAFT;
}

/** Pensja za rok pracy zamiast walk. */
export function jobSalary(age: number) {
  if (age < 19) return 9000;
  if (age < 22) return 42000;
  if (age < 26) return 54000;
  return 60000;
}

/** Co da rok przerwy (podgląd do budżetu). */
export function breakPreview(s: GameState) {
  const installments = s.loans.filter((l) => l.left > 0).reduce((a, l) => a + l.installment, 0);
  const living = livingCost(s.age) + (s.flags.kid ? 10000 : 0);
  const salary = jobSalary(s.age);
  return { salary, living, installments, net: salary - living - installments, after: s.money + salary - living - installments };
}

/**
 * Rok przerwy: zamiast roku idziesz do pracy. Zarabiasz, spłacasz raty,
 * ale efekty obozu przepadają, a umiejętności spadają. Wypadasz z rankingu.
 */
export function takeBreakYear(s0: GameState): GameState {
  const s = clone(s0);
  withRng(s, (rng) => {
    const pv = breakPreview(s);
    const ovrFrom = s.flags.ovrStart ?? ovr(s.stats);
    const moneyFrom = s.money;
    s.money = pv.after;
    for (const l of s.loans) l.left -= 1;
    s.loans = s.loans.filter((l) => l.left > 0);
    // obóz przepada, a forma leci w dół
    for (const k of Object.keys(s.stats) as StatKey[]) {
      const gain = s.lastGains[k] ?? 0;
      const drop = k === 'cardio' ? rng.int(4, 6) : k === 'iq' ? rng.int(0, 1) : k === 'chin' ? rng.int(0, 2) : rng.int(2, 4);
      s.stats[k] = clamp(s.stats[k] - gain - drop, 1, 99);
    }
    s.lastGains = {};
    s.media = clamp(s.media - 6, 0, 100);
    s.rep = clamp(s.rep - 3, 0, 100);
    s.relations += 1;
    const wasRanked = s.tier > 0 && s.rank !== null && s.contract.kind !== 'freak';
    if (s.tier > 0) s.rank = null;
    const job =
      s.age < 19
        ? 'Rok przerwy od turniejów. Weekendy na zmywaku i przy rozładunku, w tygodniu szkoła.'
        : rng.pick([
            'Rok na budowie. Rano szalunki, wieczorem nie masz siły nawet na rozciąganie.',
            'Rok w magazynie na trzy zmiany. Kasa się zgadza, kondycja już nie.',
            'Rok jako ochroniarz w galerii. Stoisz osiem godzin dziennie i tyjesz.',
            'Rok na kurierce. Trzysta paczek dziennie, na salę wpadasz raz w tygodniu.',
          ]);
    const summary: SeasonSummary = {
      season: s.season,
      year: s.year,
      age: s.age,
      tier: s.tier,
      fed: s.fed,
      club: s.club.name,
      w: 0,
      l: 0,
      d: 0,
      rank: s.rank,
      champion: false,
      beltWon: false,
      moneyDelta: s.money - moneyFrom,
      ovrFrom,
      ovrTo: ovr(s.stats),
      form: 'Rok przerwy',
      grade: 'Rok przerwy',
      bars: [
        { label: 'Pieniądze', value: Math.round(clamp(50 + (pv.net / 30000) * 40, 5, 100)), note: fmtK(s.money - moneyFrom) },
        { label: 'Forma fizyczna', value: 15, note: 'umiejętności spadły' },
      ],
      story: `${job} Długi są mniejsze, ale treningi przepadły.${wasRanked ? ' Wypadasz z rankingu.' : ''}`,
    };
    s.seasons.push(summary);
    s.lastSummary = summary;
    s.run = null;
    s.event = null;
    s.eventQueue = [];
    s.flags.breakYears = (s.flags.breakYears ?? 0) + 1;
    log(s, 'Rok przerwy: praca zamiast walk.');
    for (const p of s.peers) progressPeer(rng, p);
  });
  s.phase = 'summary';
  return s;
}

const INJ_MINOR = ['złamany nos', 'rozcięty łuk brwiowy', 'skręcona kostka', 'złamany palec u stopy', 'stłuczone żebro', 'naciągnięty mięsień dwugłowy', 'obity piszczel'];
const INJ_SEVERE = ['pęknięty oczodół', 'złamana ręka', 'pęknięte żebro', 'wybity bark', 'naderwane więzadło w kolanie', 'złamana szczęka'];
const INJ_OUT = ['zerwane więzadło krzyżowe', 'zerwany biceps', 'przepuklina dysku', 'zerwane ścięgno Achillesa'];

/** Koszt roku rehabilitacji (lekarze, fizjo, operacja). */
export function rehabCost(s: GameState) {
  return [3000, 8000, 15000, 30000, 60000][s.tier] + livingCost(s.age) + (s.flags.kid ? 10000 : 0);
}

/** Rok rehabilitacji po ciężkim urazie: bez walk, umiejętności spadają, zużycie organizmu spada. */
export function rehabYear(s0: GameState): GameState {
  if (!s0.injury?.out) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const ovrFrom = ovr(s.stats);
    const moneyFrom = s.money;
    const name = s.injury!.name;
    const installments = s.loans.reduce((a, l) => a + l.installment, 0);
    // bez pieniędzy leczysz się na NFZ: taniej, ale wolniej
    const full = rehabCost(s) + installments;
    const spend = Math.min(full, Math.max(0, s.money + OVERDRAFT));
    const nfz = spend < full;
    s.money -= spend;
    for (const l of s.loans) l.left -= 1;
    s.loans = s.loans.filter((l) => l.left > 0);
    for (const k of STAT_KEYS) {
      const drop = (k === 'cardio' ? rng.int(3, 5) : k === 'iq' ? -rng.int(0, 1) : k === 'chin' ? rng.int(0, 2) : rng.int(1, 3)) + (nfz && k !== 'iq' ? 1 : 0);
      s.stats[k] = clamp(s.stats[k] - drop, 1, 99);
    }
    s.lastGains = {};
    s.wear = clamp(s.wear - 12, 0, 100);
    s.media = clamp(s.media - 5, 0, 100);
    const wasRanked = s.tier > 0 && s.rank !== null;
    if (s.tier > 0) s.rank = null;
    // po powrocie jeszcze chwilę czuć uraz
    s.injury = { name: `${name} (powrót po urazie)`, seasons: 2, penalty: 3 };
    const story = rng.pick([
      'Rok na rowerku stacjonarnym i gumach. Najgorsze są wieczory, kiedy koledzy wrzucają zdjęcia z gal.',
      'Operacja, kule, potem fizjo trzy razy w tygodniu. Oglądasz walki z kanapy i notujesz błędy rywali.',
      'Rehabilitacja idzie wolniej, niż obiecywał lekarz. Za to pierwszy raz od lat nic cię nie boli rano.',
    ]);
    const summary: SeasonSummary = {
      season: s.season, year: s.year, age: s.age, tier: s.tier, fed: s.fed, club: s.club.name,
      w: 0, l: 0, d: 0, rank: s.rank, champion: false, beltWon: false,
      moneyDelta: s.money - moneyFrom, ovrFrom, ovrTo: ovr(s.stats),
      form: 'Rehabilitacja', grade: 'Rok rehabilitacji',
      bars: [
        { label: 'Zdrowie', value: 60, note: 'zużycie organizmu spadło' },
        { label: 'Forma fizyczna', value: 20, note: 'umiejętności spadły' },
      ],
      story: `${name.charAt(0).toUpperCase() + name.slice(1)}. ${nfz ? 'Na prywatną klinikę cię nie stać, więc kolejka na NFZ i ćwiczenia z filmików. ' : ''}${story}${wasRanked ? ' Wypadasz z rankingu.' : ''}`,
    };
    s.seasons.push(summary);
    s.lastSummary = summary;
    s.run = null;
    s.event = null;
    s.eventQueue = [];
    log(s, `Rok rehabilitacji: ${name}.`);
    for (const p of s.peers) progressPeer(rng, p);
  });
  s.phase = 'summary';
  return s;
}

// Wyjazdy na lata: lata treningu zamiast walk (Dagestan, Floryda, Trondheim)
export interface Expedition {
  id: 'dagestan' | 'floryda' | 'trondheim';
  name: string;
  place: string;
  years: number;
  maxAge: number;
  cost: number[]; // wg szczebla
  gains: Record<StatKey, [number, number]>;
  ceiling: Partial<Record<StatKey, number>>; // o ile rośnie limit talentu
  media: number; // zmiana rozpoznawalności
  rep: number;
  wear: number; // regeneracja organizmu
  desc: string;
  minus: string;
  log: string;
  stories: string[];
}
export const EXPEDITIONS: Expedition[] = [
  {
    id: 'dagestan',
    name: '2-3 years Dagestan and forget',
    place: 'Dagestan · sala w górach',
    years: 2,
    maxAge: 30,
    cost: [0, 30000, 70000, 160000, 360000],
    gains: { wrest: [8, 12], cardio: [6, 9], chin: [3, 5], bjj: [3, 6], iq: [2, 4], stand: [0, 2] },
    ceiling: { wrest: 10, cardio: 8, chin: 5, bjj: 4 },
    media: -12,
    rep: 4,
    wear: -10,
    desc: 'Dwa lata w górach (trzeci to powrót do formy). Zapasy pięć razy dziennie, bez internetu i bez cukru.',
    minus: 'Kibice o tobie zapominają, wracasz bez rankingu.',
    log: 'Dwa lata w Dagestanie. Zapasy, góry i cisza.',
    stories: [
      'Wyjeżdżasz w wieku {from} lat, wracasz po dwóch. Bez internetu, bez cukru, z zapasami pięć razy dziennie. W hali nikt nie pamięta twojego nazwiska, za to ty pamiętasz każde obalenie.',
      'Dwie zimy w górach. Stary trener mówił do ciebie tylko „jeszcze raz”. Wracasz twardszy, cichszy i nikt w Polsce nie wie, czego się spodziewać.',
      'Dwa lata, jedna sala i baran na każde święto. Media pytają, czy w ogóle jeszcze walczysz. Zaraz się przekonają.',
    ],
  },
  {
    id: 'floryda',
    name: 'Floryda: Top Squad',
    place: 'USA · stajnia mistrzów',
    years: 2,
    maxAge: 33,
    cost: [0, 45000, 100000, 220000, 460000],
    gains: { stand: [4, 7], wrest: [4, 7], bjj: [4, 7], cardio: [3, 5], iq: [3, 5], chin: [1, 3] },
    ceiling: { stand: 4, wrest: 4, bjj: 4, iq: 2 },
    media: -4,
    rep: 3,
    wear: -6,
    desc: 'Dwa lata w największej amerykańskiej stajni. Sparingi z mistrzami i trenerzy od wszystkiego.',
    minus: 'Najdroższy wyjazd. Wracasz bez rankingu, ale z filmikami z sali.',
    log: 'Dwa lata na Florydzie. Upał, sparingi i trenerzy od wszystkiego.',
    stories: [
      'Dwa lata w Top Squad. Codziennie ktoś z pasem leje cię na sparingu, a ty coraz częściej oddajesz. Wracasz jako zawodnik kompletny.',
      'Upał, aligatory przy parkingu i sparingi z mistrzami. Po dwóch latach trener mówi, że możesz walczyć z każdym. Kibice widzieli tylko twoje filmiki z sali.',
    ],
  },
  {
    id: 'trondheim',
    name: 'Trondheim',
    place: 'Norwegia · sala nad fiordem',
    years: 1,
    maxAge: 36,
    cost: [0, 25000, 55000, 120000, 250000],
    gains: { cardio: [5, 8], stand: [3, 5], chin: [2, 4], iq: [2, 4], wrest: [1, 3], bjj: [1, 2] },
    ceiling: { cardio: 5, chin: 3, stand: 2 },
    media: -2,
    rep: 2,
    wear: -10,
    desc: 'Jeden rok na północy: biegi po śniegu, sauna, przerębel i sparingi z Norwegami, którzy nigdy się nie męczą.',
    minus: 'Rok bez walk i bez gaż. Ranking przepada.',
    log: 'Rok w Trondheim. Śnieg, sauna i kondycja nie z tej ziemi.',
    stories: [
      'Rok w Trondheim. Słońce widziałeś może dwa razy, za to biegałeś po śniegu codziennie. Wracasz z płucami, które nie znają zmęczenia.',
      'Sauna, przerębel, sparing i znowu sauna. Norwegowie mówią mało, ale biją równo przez pięć rund. Teraz ty też tak umiesz.',
    ],
  },
];
export function expeditionById(id: string) {
  return EXPEDITIONS.find((e) => e.id === id) ?? null;
}
export function expeditionCost(s: GameState, e: Expedition) {
  return e.cost[s.tier] ?? 0;
}
function expeditionDone(s: GameState, e: Expedition) {
  return e.id === 'dagestan' ? !!s.flags.dagestan : !!s.flags[`exp_${e.id}`];
}
export function expeditionBlocked(s: GameState, e: Expedition): string | null {
  if (expeditionDone(s, e)) return 'Już tam byłeś.';
  if (s.tier < 1) return 'Najpierw przejdź na zawodowstwo.';
  if (s.age > e.maxAge) return `Do ${e.maxAge} lat. Potem to już za dużo dla organizmu.`;
  if (s.injury) return 'Najpierw wylecz kontuzję.';
  if (s.loans.length) return 'Najpierw spłać kredyt, rat z wyjazdu nie zapłacisz.';
  const c = expeditionCost(s, e);
  if (s.money < c) return `Potrzebujesz ${c.toLocaleString('pl-PL')} zł.`;
  return null;
}
export function goExpedition(s0: GameState, id: Expedition['id']): GameState {
  const e = expeditionById(id);
  if (!e || expeditionBlocked(s0, e)) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const ovrFrom = ovr(s.stats);
    const moneyFrom = s.money;
    const ageFrom = s.age;
    s.money -= expeditionCost(s, e);
    const m = s.age >= 28 ? 0.7 : 1;
    const before = { ...s.stats };
    for (const k of STAT_KEYS) s.potential[k] = clamp(s.potential[k] + (e.ceiling[k] ?? 0), 1, 99);
    for (const k of STAT_KEYS) {
      const [a, b] = e.gains[k];
      const g = Math.round(rng.int(a, b) * m);
      s.stats[k] = clamp(Math.min(s.stats[k] + g, Math.max(s.stats[k], s.potential[k])), 1, 99);
    }
    s.lastGains = mapStats((k) => s.stats[k] - before[k]);
    // wszystkie lata poza ostatnim mijają tutaj, ostatni przy przejściu na rynek
    // życie za granicą też kosztuje: za każdy rok poza ostatnim (ten liczy się przy rynku)
    const livingAbroad = Math.round(livingCost(s.age) / 500) * 500;
    for (let i = 0; i < e.years - 1; i++) {
      ageOneYear(rng, s);
      s.money -= livingAbroad;
    }
    for (let i = 0; i < e.years; i++) for (const p of s.peers) progressPeer(rng, p);
    s.media = clamp(s.media + e.media, 0, 100);
    s.rep = clamp(s.rep + e.rep, 0, 100);
    s.wear = clamp(s.wear + e.wear, 0, 100);
    if (s.tier > 0) s.rank = null;
    s.contractSeasonsLeft = 0;
    if (e.id === 'dagestan') s.flags.dagestan = 1;
    else s.flags[`exp_${e.id}`] = 1;
    s.peakOvr = Math.max(s.peakOvr, ovr(s.stats));
    const lata = e.years === 1 ? 'rok' : `${e.years} lata`;
    const summary: SeasonSummary = {
      season: s.season, year: s.year, age: s.age, tier: s.tier, fed: s.fed, club: s.club.name,
      w: 0, l: 0, d: 0, rank: s.rank, champion: false, beltWon: false,
      moneyDelta: s.money - moneyFrom, ovrFrom, ovrTo: ovr(s.stats),
      form: e.id === 'dagestan' ? 'Dagestan' : e.name, grade: e.name,
      bars: [
        { label: 'Forma fizyczna', value: 95, note: `OVR ${ovrFrom} → ${ovr(s.stats)}` },
        { label: 'Rozpoznawalność', value: Math.max(10, 60 + e.media * 3), note: e.media <= -10 ? 'kibice o tobie zapomnieli' : `${lata} poza klatką` },
      ],
      story: rng.pick(e.stories).replace('{from}', String(ageFrom)),
    };
    s.seasons.push(summary);
    s.lastSummary = summary;
    s.run = null;
    s.event = null;
    s.eventQueue = [];
    log(s, e.log);
  });
  s.phase = 'summary';
  return s;
}

// zgodność wstecz (testy, skrypty)
export const DAGESTAN_GAINS = EXPEDITIONS[0].gains;
export function dagestanCost(s: GameState) {
  return expeditionCost(s, EXPEDITIONS[0]);
}
export function dagestanBlocked(s: GameState): string | null {
  return expeditionBlocked(s, EXPEDITIONS[0]);
}
export function goDagestan(s0: GameState): GameState {
  return goExpedition(s0, 'dagestan');
}

const SPONSOR_NAMES = [
  'Hurtownia Paneli Bogdan-Pol',
  'Myjnia Bąbelek',
  'Bar mleczny Pod Kogutem',
  'Skup złomu Metal-Heniek',
  'Siłownia Żelazny Wiesiek',
  'Auto-komis Igła',
  'Okna PCV Szymon-Plast',
  'Piekarnia Złoty Kłos',
  'Agroturystyka U Bacy',
  'Kantor Euro-Max',
  'Szkoła jazdy Zielona Strzałka',
  'Firma remontowa Panel-Bud',
  'Pizzeria Mamma Grażyna',
  'Warsztat Turbo-Zdzich',
  'Lody Bambino-Bis',
  'Kebab Sułtan Premium',
  'Hurtownia Śrubek Gwint-Pol',
  'Studio Paznokci Diamond',
  'Pralnia Ekspres u Basi',
  'Stolarnia Dąb-Mar',
  'Ubezpieczenia Spokojna Głowa',
  'Sklep Wędkarski Szczupak',
  'Kwiaciarnia Róża Wiatrów',
  'Pizzeria Neapol z Kutna',
  'Agencja Nieruchomości Klucz',
  'Ferma Drobiu Złote Jajo',
  'Hydraulika Kran-Bud',
  'Siłownia Dzik Gym',
  'Solarium Tropikana',
  'Sklep Monopolowy Pod Lipą',
  'Gabinet Weterynaryjny Burek',
  'Autolawety Holownik 24h',
  'Bar Grill Pod Krową',
  'Szkoła Tańca Salsa-Pol',
  'Fryzjer Brzytwa',
  'Warzywniak Pomidorek',
  'Elektro-Mont Zbigniew',
  'Przedszkole Słoneczko',
  'Lodziarnia Polarna',
];
const SPONSOR_CLAUSES = [
  'logo na tyłku spodenek',
  'zdjęcie z szefem po każdej wygranej',
  'pozdrowienia dla prezesa w wywiadzie',
  'darmowe mycie auta za każde KO',
  'koszulka firmowa na ważeniu',
  'wizyta na firmowym grillu',
  'nazwa firmy w walkoutowej piosence',
  'logo na rękawicach do walkout',
  'pozdrowienia dla załogi w wywiadzie',
  'kartonowa figura w sklepie',
  'wizyta na otwarciu nowego punktu',
  'naklejka na kasku na treningach',
  'zdjęcie w firmowej czapce na ważeniu',
  'rabat dla fanów z twoim kodem',
];

function maybeAutoSponsor(rng: Rng, s: GameState): string | null {
  const cap = 1 + s.tier;
  if (s.sponsors.length >= cap) return null;
  const p = clamp((s.media + s.rep * 0.3) / 120 + (currentManager(s)?.sponsor ?? 0) / 100, 0.08, 0.75) * (s.profile.difficulty === 'hard' ? 0.6 : 1);
  if (!rng.chance(p)) return null;
  const name = rng.pick(SPONSOR_NAMES.filter((n) => !s.sponsors.some((x) => x.name === n)));
  const base = [1500, 4000, 12000, 30000, 80000][s.tier];
  const per = Math.round((base * (0.6 + s.media / 60) * (0.8 + rng.next() * 0.5)) / 500) * 500;
  s.sponsors.push({ id: uid(rng, 's'), name, perSeason: per, seasonsLeft: rng.int(1, 3), clause: rng.pick(SPONSOR_CLAUSES) });
  return name;
}

// ---------------------------------------------------------------------------
// Sponsor na własną rękę: raz na rok możesz sam napisać do firmy
// ---------------------------------------------------------------------------

export type PitchSlot = 'spodenki' | 'plecy' | 'social';

export const PITCH_SLOTS: { id: PitchSlot; label: string; desc: string; base: number; pay: number; clause: string }[] = [
  { id: 'spodenki', label: 'Logo na spodenkach', desc: 'Najlepiej widać w klatce, firmy płacą najwięcej, ale trudno przekonać.', base: 0.28, pay: 1, clause: 'logo na spodenkach' },
  { id: 'plecy', label: 'Plecy rashguarda na ważeniu', desc: 'Łatwiej się zgodzą, ale zapłacą mniej.', base: 0.45, pay: 0.55, clause: 'logo na plecach na ważeniu i face to face' },
  { id: 'social', label: 'Posty na Instagramie', desc: 'Liczą się zasięgi. Im więcej mediów, tym większa szansa.', base: 0.15, pay: 0.75, clause: 'trzy posty w roku z kodem rabatowym' },
];

const PITCH_FAIL = [
  'odpisuje, że w tym roku cały budżet poszedł na festyn gminny.',
  'nie odpisuje. Wiadomość wisi z dwoma szarymi ptaszkami.',
  'odpisuje, że „sporty walki to nie ich klimat”.',
  'chce cię wesprzeć, ale tylko barterem: karton batonów proteinowych.',
  'prosi o kontakt za rok, „jak będzie więcej wyników”.',
  'odpisuje, że ich prezes kibicuje twojemu rywalowi.',
  'prosi o portfolio i media kit. Musisz sprawdzić, co to jest.',
  'odpisuje: „a pan to grał w piłkę?”.',
  'chce sponsorować, ale tylko twojego rywala.',
  'wysyła ofertę na 200 zł rocznie i dożywotni rabat 5%.',
  'przeprasza, ale prezes jest na urlopie do września.',
  'odpisuje emotką kciuka w górę. I nic więcej.',
];

export function sponsorCap(s: GameState) {
  return 2 + s.tier;
}

/** Czy można dziś szukać sponsora (null = można). */
export function pitchBlocked(s: GameState): string | null {
  if (s.pitch && s.pitch.season === s.season) return 'W tym roku już szukałeś. Kolejna próba za rok.';
  if (s.sponsors.length >= sponsorCap(s)) return 'Masz już tylu sponsorów, ilu da się zmieścić na stroju.';
  return null;
}

export function pitchChance(s: GameState, slot: PitchSlot): number {
  const sl = PITCH_SLOTS.find((x) => x.id === slot)!;
  const mediaW = slot === 'social' ? 1 / 70 : 1 / 160;
  let c = sl.base + s.media * mediaW + s.rep / 350 + s.tier * 0.05 - s.sponsors.length * 0.1 + (currentManager(s)?.sponsor ?? 0) / 200;
  if ((s.flags.freakStigma ?? 0) > 0 && slot !== 'social') c -= 0.05;
  if (s.profile.difficulty === 'hard') c *= 0.8;
  return Math.round(clamp(c, 0.05, 0.85) * 100);
}

export function pitchPay(s: GameState, slot: PitchSlot): number {
  const sl = PITCH_SLOTS.find((x) => x.id === slot)!;
  const base = [2000, 5000, 12000, 28000, 70000][s.tier];
  return Math.round((base * sl.pay * (0.7 + s.media / 80)) / 500) * 500;
}

export function pitchSponsor(s0: GameState, slot: PitchSlot): GameState {
  const s = clone(s0);
  if (pitchBlocked(s)) return s;
  withRng(s, (rng) => {
    const ch = pitchChance(s, slot) / 100;
    const sl = PITCH_SLOTS.find((x) => x.id === slot)!;
    const free = SPONSOR_NAMES.filter((n) => !s.sponsors.some((x) => x.name === n));
    const name = rng.pick(free.length ? free : SPONSOR_NAMES);
    if (rng.chance(ch)) {
      const per = Math.round((pitchPay(s, slot) * (0.85 + rng.next() * 0.3)) / 500) * 500;
      s.sponsors.push({ id: uid(rng, 's'), name, perSeason: per, seasonsLeft: rng.int(1, 2), clause: sl.clause });
      s.pitch = { season: s.season, ok: true, name, slot, text: `${name} się zgadza! ${fmtMoney(per).slice(1)} na rok za ${sl.clause}.` };
      log(s, `Nowy sponsor: ${name}.`);
    } else {
      s.pitch = { season: s.season, ok: false, name, slot, text: `${name} ${rng.pick(PITCH_FAIL)}` };
    }
  });
  return s;
}

// ---------------------------------------------------------------------------
// Start roku: płatności, wydarzenia, forma
// ---------------------------------------------------------------------------

export function startSeason(s0: GameState): GameState {
  if (!canStartSeason(s0)) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    s.money += budgetBalance(s);
    for (const l of s.loans) l.left -= 1;
    s.loans = s.loans.filter((l) => l.left > 0);
    // wydarzenia przedsezonowe
    s.eventQueue = [];
    const n = rng.chance(0.85) ? 1 : 0;
    const extra = rng.chance(0.18) ? 1 : 0;
    for (let i = 0; i < n + extra; i++) {
      const pool = EVENTS.map((e) => ({ item: e.id, w: eventWeight(e, s) * (s.eventQueue.includes(e.id) ? 0 : 1) })).filter(
        (x) => x.w > 0,
      );
      if (!pool.length) break;
      s.eventQueue.push(rng.weighted(pool));
    }
    if ((s.flags.tryoutPending ?? 0) > 0 && s.tier === 0) s.eventQueue.unshift('sparing_kontrolny');
  });
  return nextEventOrSeason(s);
}

function nextEventOrSeason(s: GameState): GameState {
  const id = s.eventQueue.shift();
  if (id) {
    const def = findEvent(id)!;
    s.seenEvents.push(id);
    s.event = { id, brand: def.brand, title: def.title ?? 'Wydarzenie', text: def.text(s), choices: def.choices(s) };
    s.phase = 'event';
    return s;
  }
  s.event = null;
  beginRun(s);
  return s;
}

export function choiceChance(s: GameState, idx: number): number | null {
  const c = s.event?.choices[idx];
  if (!c) return null;
  if (c.test) return chanceFrom(s.stats[c.test], TIER_LEVEL[s.tier] + 6);
  if (c.chance !== undefined) return c.chance;
  return null;
}

export function chooseEvent(s0: GameState, idx: number): GameState {
  const s = clone(s0);
  const ev = s.event;
  if (!ev || ev.picked !== undefined) return s;
  const c = ev.choices[idx];
  ev.picked = idx;
  withRng(s, (rng) => {
    const ch = choiceChance(s, idx);
    if (ch !== null && (c.success || c.fail)) {
      const out: Outcome = rollOutcome(rng, ch);
      const ok = out !== 'fail';
      ev.rolled = out;
      ev.resultText = ok ? c.successText : c.failText;
      ev.resultEffects = (ok ? c.success : c.fail) ?? {};
    } else {
      ev.resultEffects = c.effects ?? {};
    }
    applyEffects(s, ev.resultEffects, rng);
  });
  return s;
}

export function continueAfterEvent(s0: GameState): GameState {
  const s = clone(s0);
  // po sparingu na starcie kariery idziemy na obóz przygotowawczy, a nie do roku
  if (s0.event?.id === 'sparing_kontrolny' && !s0.run && s0.eventQueue.length === 0 && s0.event.picked !== undefined) {
    s.event = null;
    s.phase = 'training';
    return s;
  }
  return nextEventOrSeason(s);
}

export function applyEffects(s: GameState, e: Effects, rng: Rng) {
  if (e.money) {
    s.money += e.money;
    if (e.money > 0) s.totalEarned += e.money;
  }
  if (e.media) s.media = clamp(s.media + e.media, 0, 100);
  if (e.rep) s.rep = clamp(s.rep + e.rep, 0, 100);
  if (e.relations) s.relations += e.relations;
  if (e.wear) s.wear = clamp(s.wear + e.wear, 0, 100);
  if (e.stats)
    for (const [k, v] of Object.entries(e.stats) as [StatKey, number][]) s.stats[k] = clamp(s.stats[k] + v, 1, 99);
  if (e.injury) s.injury = { ...e.injury };
  if (e.healInjury) s.injury = null;
  if (e.promise) {
    s.promises.push({ ...e.promise, id: uid(rng, 'pr') });
    s.flags.promisesMade = (s.flags.promisesMade ?? 0) + 1;
  }
  if (e.sponsor) {
    s.sponsors.push({ ...e.sponsor, id: uid(rng, 's') });
    s.flags[`sponsor:${e.sponsor.name}`] = 1;
    if (e.sponsor.name === LABS_SPONSOR && !s.backroom?.supps) {
      s.backroom = { ...(s.backroom ?? {}), supps: true };
      s.flags.labsAutoSupps = 1;
    }
  }
  if (e.flag) s.flags[e.flag] = (s.flags[e.flag] ?? 0) + 1;
  if (e.flag === 'manager') s.manager = 'okulary';
  if (e.flag === 'amTalent' || e.flag === 'amLocal') {
    s.flags.amLevel = e.flag === 'amTalent' ? 1 : 0;
    s.flags.tryoutPending = 0;
    s.flags.tryout = e.flag === 'amTalent' ? 2 : 1;
  }
  if (e.form) s.flags.formBonus = (s.flags.formBonus ?? 0) + e.form;
  if (e.loan) {
    s.money += e.loan.amount;
    s.loans.push({ installment: e.loan.installment, left: e.loan.count });
  }
  if (e.flag === 'banned') {
    s.rank = null;
    s.flags.cut = 1;
    log(s, 'Afera. Federacja rozwiązuje z tobą kontrakt.');
  }
}

export interface Chip {
  text: string;
  tone: 'good' | 'bad' | 'neutral' | 'purple';
  icon?: string;
}

const fmtMoney = (n: number) => {
  const a = Math.abs(n);
  const v = a >= 1000 ? `${(a / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} tys. zł` : `${a} zł`;
  return `${n >= 0 ? '+' : '−'}${v}`;
};

export function effectChips(e: Effects | undefined, s?: GameState): Chip[] {
  if (!e) return [];
  const out: Chip[] = [];
  const sg = (n: number) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`);
  if (e.money) out.push({ text: fmtMoney(e.money), tone: e.money > 0 ? 'good' : 'bad', icon: 'coins' });
  if (e.stats)
    for (const [k, v] of Object.entries(e.stats) as [StatKey, number][])
      out.push({ text: `${STAT_LABELS[k].toLowerCase()} ${sg(v)}`, tone: v > 0 ? 'good' : 'bad', icon: `stat:${k}` });
  if (e.media) out.push({ text: `media ${sg(e.media)}`, tone: e.media > 0 ? 'good' : 'bad', icon: 'megaphone' });
  if (e.rep) out.push({ text: `reputacja ${sg(e.rep)}`, tone: e.rep > 0 ? 'good' : 'bad', icon: 'star' });
  if (e.relations) out.push({ text: `rodzina ${sg(e.relations)}`, tone: e.relations > 0 ? 'good' : 'bad', icon: 'home' });
  if (e.form) out.push({ text: `forma ${sg(e.form)}`, tone: e.form > 0 ? 'good' : 'bad', icon: 'flame' });
  if (e.wear) out.push({ text: `zużycie ${sg(e.wear)}`, tone: e.wear > 0 ? 'bad' : 'good', icon: 'bandage' });
  if (e.injury) out.push({ text: `kontuzja: ${e.injury.name}`, tone: 'bad', icon: 'bandage' });
  if (e.healInjury) out.push({ text: 'kontuzja wyleczona', tone: 'good', icon: 'heart' });
  if (e.sponsor) out.push({ text: `sponsor ${fmtMoney(e.sponsor.perSeason).slice(1)} na rok`, tone: 'good', icon: 'briefcase' });
  if (e.promise) out.push({ text: `obietnica do roku ${e.promise.untilSeason}`, tone: 'neutral', icon: 'pen' });
  if (e.loan && e.loan.installment) out.push({ text: `raty ${e.loan.count} × ${fmtMoney(e.loan.installment).slice(1)}`, tone: 'bad', icon: 'card' });
  if (e.note) out.push({ text: e.note, tone: 'neutral' });
  void s;
  return out;
}

// ---------------------------------------------------------------------------
// Rok
// ---------------------------------------------------------------------------

function divisionPerson(div: string) {
  return ({ 'pierwszy krok': 'zawodnik pierwszego kroku', kadeci: 'kadet', juniorzy: 'junior', seniorzy: 'senior' } as Record<string, string>)[div] ?? div;
}

export function isAmateurRun(s: GameState) {
  return s.tier === 0 && s.contract.kind !== 'freak';
}

function makeTourneys(rng: Rng, s: GameState): Tourney[] {
  const div = amateurDivision(s.age, s.amRecord.w + s.amRecord.l + s.amRecord.d);
  const cities = rng.shuffle([...TOURNEY_CITIES]);
  const local = amLevel(s) === 0;
  const home = REGION_CITY[s.profile.region] ?? cities[0];
  return (local ? AMATEUR_TOURNEYS_LOCAL : AMATEUR_TOURNEYS).map((name, i) => ({
    name,
    city: local ? (i === 0 ? home : s.profile.hometown || home) : cities[i],
    division: div,
    stage: 'qf' as TourneyStage,
    medal: null,
    place: null,
    championship: !local && i === 1,
  }));
}

/** Poziom zawodów amatorskich: 0 wojewódzkie, 1 ogólnopolskie (stare zapisy: ogólnopolskie). */
export function amLevel(s: GameState) {
  return s.flags.amLevel ?? 1;
}

function plannedAmateur(run: NonNullable<GameState['run']>) {
  const ts = run.tourneys ?? [];
  let left = 0;
  for (let i = run.tIdx ?? 0; i < ts.length; i++) if (ts[i].stage) left++;
  return run.fights.length + left;
}

function beginRun(s: GameState) {
  withRng(s, (rng) => {
    const f = rng.weighted(SEASON_FORMS.map((x) => ({ item: x, w: x.w })));
    const bonus = s.flags.formBonus ?? 0;
    s.flags.formBonus = 0;
    const mod = f.mod + bonus;
    const intro: string[] = [];
    let tourneys: Tourney[] | undefined;
    if (isAmateurRun(s)) {
      // awans z zawodów wojewódzkich: po medalu albo po dwóch latach (jedna walka nie przekreśla kariery)
      if (amLevel(s) === 0 && ((s.flags.amPromote ?? 0) > 0 || (s.flags.amLocalSeasons ?? 0) >= 2)) {
        s.flags.amLevel = 1;
        s.flags.amPromote = 0;
        intro.push('Trener: „Dość zawodów wojewódzkich. W tym roku jedziesz na Amatorski Puchar i Mistrzostwa Polski.”');
      }
      if (amLevel(s) === 0) s.flags.amLocalSeasons = (s.flags.amLocalSeasons ?? 0) + 1;
      tourneys = makeTourneys(rng, s);
      intro.push(
        `${amLevel(s) === 0 ? 'Na początek zawody niższej rangi. ' : ''}W tym roku dwa turnieje amatorskie: ${tourneys[0].name} (${tourneys[0].city}) i ${tourneys[1].name} (${tourneys[1].city}). Startujesz ${tourneys[0].division === 'pierwszy krok' ? 'wśród debiutantów' : `jako ${divisionPerson(tourneys[0].division)}`}, w drabince jest ośmiu zawodników.`,
      );
    }
    const sp = maybeAutoSponsor(rng, s);
    if (sp) intro.push(`Nowy sponsor na spodenkach: ${sp}.`);
    if (s.injury) intro.push(`Zaczynasz rok z kontuzją: ${s.injury.name}. Każda szansa jest o ${s.injury.penalty} pkt mniejsza.`);
    if (bonus > 0) intro.push(`To, co działo się przed startem, dodaje ci pewności: forma +${bonus}.`);
    if (bonus < 0) intro.push(`To, co działo się przed startem, siedzi ci w głowie: forma −${Math.abs(bonus)}.`);
    const planned = plannedFights(s);
    const mgr = currentManager(s);
    const mgrFocus = mgr ? rng.chance(mgr.focus) : undefined;
    if (mgr && s.tier > 0) {
      if (mgrFocus) intro.push(`${mgr.name} załatwia ci walki w tym roku (bierze ${Math.round(mgr.cut * 100)}% gaży).`);
      else intro.push(`${mgr.name} cały rok zajmuje się ${mgr.stable ? rng.pick(mgr.stable) : 'innymi zawodnikami'}. Na ciebie nie ma czasu, ale procent bierze.`);
    }
    if (planned > 3) intro.push(`${planned} walki w roku: więcej gaż, ale pod koniec organizm nie nadąża.`);
    s.run = {
      tourneys,
      tIdx: 0,
      form: { label: f.label, mod, tone: f.tone },
      fights: [],
      planned,
      done: false,
      startMoney: s.money,
      startOvr: ovr(s.stats),
      startRank: s.rank,
      startMedia: s.media,
      intro,
      mgrFocus,
    };
    if (tourneys) s.run.planned = plannedAmateur(s.run);
  });
  s.phase = 'season';
}

function avoidMyName(rng: Rng, s: GameState, opp: Fighter) {
  if (opp.lastName === s.profile.lastName) opp.lastName = otherLastName(rng, s.profile.lastName);
}

function amateurOpponent(rng: Rng, s: GameState, t: Tourney, stage: TourneyStage): Fighter {
  const hard = s.profile.difficulty === 'hard';
  const rank = stage === 'qf' ? null : stage === 'sf' ? rng.int(4, 8) : stage === 'b' ? rng.int(3, 6) : rng.int(1, 3);
  const opp = generateOpponent(rng, 0, rank, hard);
  opp.rank = null;
  opp.country = 'Polska';
  opp.flag = '🇵🇱';
  opp.age = clamp(s.age + rng.int(-1, 2), 16, 34);
  const shift = (t.division === 'pierwszy krok' ? -4 : t.division === 'kadeci' ? -2 : t.division === 'seniorzy' ? 2 : 0) + (amLevel(s) === 0 ? -3 : 0);
  if (shift) opp.stats = mapStats((k) => clamp(opp.stats[k] + shift, 6, 99));
  if (t.division === 'pierwszy krok') opp.record = { w: rng.int(0, 1), l: rng.int(0, 1), d: 0 };
  return opp;
}

function pickOpponent(rng: Rng, s: GameState, idx: number): { opp: Fighter; title: boolean; defense: boolean; peer: Peer | null; grudge?: boolean } {
  const tier = s.tier;
  const size = RANK_SIZE[tier];
  const hard = s.profile.difficulty === 'hard';
  const run = s.run!;
  if (s.contract.kind === 'freak') return { opp: generateFreak(rng), title: false, defense: false, peer: null };

  const metThisSeason = new Set(run.fights.map((f) => f.opp.id));
  const peers = s.peers.filter((p) => !p.retired && p.tier === tier && p.rank !== 0 && !metThisSeason.has(p.id));
  const wantPeer = (s.flags.peerCallout ?? 0) > 0 && peers.length > 0;
  const peerPick = () => {
    if (wantPeer) s.flags.peerCallout = 0;
    const callout = s.peers.find((x) => !x.retired && x.tier === tier && !metThisSeason.has(x.id));
    const p = wantPeer && callout ? callout : rng.pick(peers);
    const opp: Fighter = { ...p, stats: { ...p.stats }, record: { ...p.record }, rank: tier === 0 ? null : p.rank ?? null, peer: true };
    return { opp, title: false, defense: false, peer: p };
  };

  // amatorka: turniej
  if (isAmateurRun(s)) {
    const t = run.tourneys![run.tIdx ?? 0];
    if (peers.length && (wantPeer || rng.chance(0.14))) return peerPick();
    return { opp: amateurOpponent(rng, s, t, t.stage ?? 'qf'), title: false, defense: false, peer: null };
  }

  // obrona pasa
  if (s.rank === 0) {
    const opp = generateOpponent(rng, tier, rng.int(1, 3), hard);
    return { opp, title: true, defense: true, peer: null };
  }
  // walka o pas
  const last = idx === run.planned - 1;
  if (s.rank !== null && (s.rank === 1 || (s.rank === 2 && last) || (s.rank <= 3 && last && rng.chance(0.4)))) {
    const opp = generateOpponent(rng, tier, 0, hard);
    return { opp, title: true, defense: false, peer: null };
  }
  // odwieczny rywal wraca częściej niż inni z rocznika
  const rival = s.rivalId ? peers.find((p) => p.id === s.rivalId) : undefined;
  const rivalCall = (s.flags.rivalCallout ?? 0) > 0 && !!rival;
  if (rivalCall) s.flags.rivalCallout = 0;
  if (rival && !wantPeer && (rivalCall || rng.chance(0.28))) {
    const opp: Fighter = { ...rival, stats: { ...rival.stats }, record: { ...rival.record }, rank: rival.rank ?? null, peer: true };
    return { opp, title: false, defense: false, peer: rival };
  }
  if (peers.length && (wantPeer || rng.chance(0.18))) return peerPick();
  const mine = s.rank ?? size + 2;
  const mg = activeManager(s);
  const q = mg?.quality ?? 0;
  if (mg?.titleShot && s.rank !== null && s.rank <= 3 && last) {
    const opp = generateOpponent(rng, tier, 0, hard);
    return { opp, title: true, defense: false, peer: null };
  }
  if ((s.flags.grudge ?? 0) > 0) {
    s.flags.grudge = 0;
    const opp = generateOpponent(rng, tier, clamp(mine - rng.int(2, 4), 1, size), hard);
    opp.nickname = opp.nickname || 'Pyskaty';
    return { opp, title: false, defense: false, peer: null, grudge: true };
  }
  let r: number | null = clamp(mine + rng.int(-3, 1) - Math.floor(q / 2), 1, size + 3);
  if (r > size) r = null;
  if (s.rank === null && rng.chance(0.5 - q * 0.1)) r = null;
  return { opp: generateOpponent(rng, tier, r, hard), title: false, defense: false, peer: null };
}

/** Premie i kary bieżącej walki: kategoria wagowa, ważenie, obóz pod rywala. */
function fightMods(s: GameState): number {
  const cur = s.run?.fights[s.run.fights.length - 1];
  if (!cur || cur.amateur) return 0;
  const sh = weightShift(s);
  let m = sh < 0 ? 4 : sh > 0 ? -2 : 0;
  if (cur.weightMiss) m -= 5;
  if (cur.prep === 'rival') m += 4;
  if (cur.prep === 'hard') m += 3;
  m += cur.pressMod ?? 0;
  if (hasBackroom(s, 'supps')) m += 2;
  return m;
}

function fightCtx(s: GameState, opp: Fighter): FightCtx {
  return {
    me: effectiveStats(s),
    meName: fullName(s),
    opp,
    // czwarta i piąta walka w roku: organizm nie nadąża
    form: s.run!.form.mod - Math.max(0, s.run!.fights.length - 3) * 5 + (s.run!.planned < s.contract.fights && s.contract.kind !== 'freak' ? 3 : 0) + fightMods(s),
    penalty: s.injury?.penalty ?? 0,
    allowDecision: true,
    decisionChance: 0.55,
  };
}

function purseFor(s: GameState, opp: Fighter, title: boolean, spot: CardSpot | undefined): number {
  const c = s.contract;
  let p = c.purse;
  if (title) p *= 1.8;
  else if (spot === 'główna') p *= 1.15;
  else if (spot === 'wieczoru') p *= 1.35;
  if (opp.peer) p *= 1.1;
  const mg = activeManager(s);
  if (mg) p *= mg.purse;
  return Math.round(p / 100) * 100;
}

function galaName(rng: Rng, s: GameState, fed: string) {
  const key = `gala:${fed}`;
  const n = s.flags[key] ?? rng.int(8, 52);
  s.flags[key] = n + rng.int(1, 2);
  return `${galaPrefix(fed)} ${n}`;
}

function cardSpot(rng: Rng, s: GameState, title: boolean, opp: Fighter, freak: boolean): CardSpot {
  if (title) return 'wieczoru';
  if (freak) return rng.chance(0.4) ? 'wieczoru' : 'główna';
  if (!s.proDebut) return 'wstępna';
  if (s.rank !== null && s.rank <= 3) return rng.chance(0.35) ? 'wieczoru' : 'główna';
  if ((s.rank !== null && s.rank <= 7) || opp.peer || s.media >= 40) return 'główna';
  return 'wstępna';
}

const ROUND_MIN = (rep: FightReport) => (rep.amateur ? (rep.stage === 'qf' || rep.stage === 'sf' ? 4 : 3) : 5);

function finishTime(rng: Rng, rep: FightReport) {
  const total = ROUND_MIN(rep) * 60;
  const sec = rng.int(12, total - 3);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

/** Rozgrywa kolejną walkę roku (albo do decyzji). */
/** Oferta kolejnej walki (zawodowcy): rywal, miejsce w karcie i gaża. */
function buildOffer(rng: Rng, s: GameState, idx: number): FightOffer {
  const { opp, title, defense, grudge, peer } = pickOpponent(rng, s, idx);
  avoidMyName(rng, s, opp);
  const freak = s.contract.kind === 'freak';
  const fed = freak ? s.contract.fed : s.fed;
  const spot = cardSpot(rng, s, title, opp, freak);
  const rival = !!peer && !!s.rivalId && peer.id === s.rivalId;
  let purse = purseFor(s, opp, title, spot) * (rival ? 1.15 : 1);
  // organizator raz daje więcej, raz próbuje zaoszczędzić
  purse = Math.round((purse * (0.85 + rng.next() * 0.3)) / 100) * 100;
  return {
    opp,
    title,
    defense,
    grudge,
    rival,
    spot,
    gala: galaName(rng, s, fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * (title ? 1.8 : 1)),
    negotiated: false,
  };
}

/** Czy menedżer (albo znajomy promotor) podsunie walkę na odbudowę rekordu. */
function tuneupWanted(rng: Rng, s: GameState, idx: number): boolean {
  const run = s.run!;
  if (s.tier < 2 || s.contract.kind === 'freak' || run.tuneupOffered || run.autoAccept) return false;
  if (s.rank === 0) return false;
  const bad = s.streak <= -1 || (s.rank === null && idx > 0) || (s.rank !== null && s.rank >= RANK_SIZE[s.tier] - 3);
  if (!bad) return false;
  return rng.chance(currentManager(s) ? 0.55 : 0.3);
}

export function buildTuneup(rng: Rng, s: GameState): FightOffer {
  const g = rng.pick(TUNEUP_GALAS);
  const pool = rng.chance(0.75) ? NAMES_TUNEUP[0] : NAMES_TUNEUP[1];
  const opp = generateOpponent(rng, 1, null, false);
  opp.firstName = rng.pick(pool.first);
  opp.lastName = rng.pick(pool.last);
  opp.country = pool.country;
  opp.flag = pool.flag;
  opp.nickname = rng.chance(0.7) ? rng.pick(TUNEUP_NICKS) : '';
  opp.age = rng.int(34, 42);
  const lvl = ovr(s.stats) - 8;
  const prof = STYLE_PROFILE[opp.style];
  opp.stats = mapStats((k) => clamp(Math.round(lvl + prof[k] * 0.6 + rng.int(-3, 3)), 8, 99));
  const w = rng.int(5, 12);
  opp.record = { w, l: w + rng.int(8, 16), d: 0 };
  opp.rank = null;
  const purse = Math.round(Math.min(s.contract.purse * (0.6 + rng.next() * 0.15), [0, 0, 25000, 45000, 70000][s.tier] ?? 25000) / 100) * 100;
  const mgr = currentManager(s);
  const who = mgr ? mgr.name : 'Znajomy promotor';
  const skad = pool.country === 'Słowacja' ? 'ze Słowacji' : 'z Czech';
  const tip = `${who}: „Mam dla ciebie gościa ${skad}, ${opp.firstName} ${opp.lastName}, bilans ${recStr(opp.record)}. Wygrasz, odbudujesz rekord, trochę grosza wpadnie. Ludzie pogadają, ale kto by się przejmował.”`;
  return { opp, title: false, defense: false, spot: 'wieczoru', gala: `${g.gala} · ${g.city}`, purse, winBonus: Math.round(purse * 0.3), negotiated: true, tuneup: true, tip };
}

export function seasonNext(s0: GameState): GameState {
  const s = clone(s0);
  const run = s.run;
  if (!run || run.done) return s;
  const cur = run.fights[run.fights.length - 1];
  if (cur && !cur.sim.finished) return s; // czeka na decyzję
  if (run.offer || run.press) return s; // czeka na ofertę albo konferencję
  withRng(s, (rng) => {
    const idx = run.fights.length;
    if (!isAmateurRun(s)) {
      if (tuneupWanted(rng, s, idx)) {
        run.tuneupOffered = true;
        run.offer = buildTuneup(rng, s);
        return;
      }
      const o = buildOffer(rng, s, idx);
      if (run.autoAccept) {
        const p = run.autoPrep ?? 'std';
        o.prep = p === 'rival' && s.money < prepCost(s, o) ? 'std' : p;
        startFight(rng, s, o);
      }
      else run.offer = o;
      return;
    }
    const { opp, title, defense, grudge } = pickOpponent(rng, s, idx);
    avoidMyName(rng, s, opp);
    startFight(rng, s, { opp, title, defense, grudge, gala: '', purse: 0, winBonus: 0, negotiated: false });
  });
  return s;
}

const VENUES: { city: string; venue: string }[][] = [
  [],
  [
    { city: 'Radom', venue: 'Hala MOSiR' },
    { city: 'Zielona Góra', venue: 'Hala CRS' },
    { city: 'Bydgoszcz', venue: 'Hala Łuczniczka' },
    { city: 'Rzeszów', venue: 'Hala Podpromie' },
    { city: 'Olsztyn', venue: 'Hala Urania' },
    { city: 'Kielce', venue: 'Hala Legionów' },
  ],
  [
    { city: 'Łódź', venue: 'Atlas Arena' },
    { city: 'Katowice', venue: 'Spodek' },
    { city: 'Wrocław', venue: 'Hala Stulecia' },
    { city: 'Gdańsk', venue: 'Arena nad morzem' },
    { city: 'Kraków', venue: 'Arena Kraków' },
    { city: 'Warszawa', venue: 'Torwar' },
  ],
  [
    { city: 'Londyn', venue: 'Arena nad Tamizą' },
    { city: 'Paryż', venue: 'Hala Bercy' },
    { city: 'Dublin', venue: 'Arena Liffey' },
    { city: 'Praga', venue: 'Hala na Libni' },
    { city: 'Sztokholm', venue: 'Globe' },
    { city: 'Berlin', venue: 'Arena przy Szprewie' },
  ],
  [
    { city: 'Las Vegas', venue: 'Arena na pustyni' },
    { city: 'Nowy Jork', venue: 'Garden' },
    { city: 'Abu Zabi', venue: 'Arena na wyspie' },
    { city: 'Rio de Janeiro', venue: 'Hala Jeunesse' },
    { city: 'Tokio', venue: 'Saitama Arena' },
    { city: 'Sydney', venue: 'Arena w zatoce' },
  ],
];

function makePoster(rng: Rng, s: GameState, rep: FightReport): FightReport['poster'] {
  const tier = Math.max(1, s.tier);
  const tg = rep.tuneup ? TUNEUP_GALAS.find((x) => rep.gala?.startsWith(x.gala)) : undefined;
  const v = rep.freak
    ? { city: rng.pick(['Warszawa', 'Łódź', 'Gliwice']), venue: 'Hala Expo' }
    : tg
      ? { city: tg.city, venue: tg.venue }
      : rng.pick(FED_VENUES[s.fed] ?? VENUES[tier]);
  const tags = ['Walka wieczoru', 'Co-main event', 'Karta główna', 'Karta główna', 'Karta wstępna', 'Karta wstępna'];
  const mine = rep.spot === 'wieczoru' ? 0 : rep.spot === 'główna' ? rng.int(1, 3) : rng.int(4, 5);
  const bouts: NonNullable<FightReport['poster']>['bouts'] = [];
  for (let i = 0; i < 6; i++) {
    if (i === mine) {
      bouts.push({ a: s.profile.lastName, ar: recStr(mainRecord(s)), b: rep.opp.lastName, br: rep.opp.freak ? 'debiut' : recStr(rep.opp.record), tag: '' });
      continue;
    }
    const rk = i <= 1 ? rng.int(1, 5) : i <= 3 ? rng.int(4, 12) : null;
    const pt = rep.tuneup ? 1 : tier;
    const x = rep.freak ? generateFreak(rng) : generateOpponent(rng, pt, rk, false);
    const y = rep.freak ? generateFreak(rng) : generateOpponent(rng, pt, rk === null ? null : rk + rng.int(1, 3), false);
    bouts.push({ a: x.lastName, ar: x.freak ? 'freak' : recStr(x.record), b: y.lastName, br: y.freak ? 'freak' : recStr(y.record), tag: tags[i] });
  }
  bouts[mine].tag = tags[mine];
  return { city: v.city, venue: v.venue, bouts };
}

function startFight(rng: Rng, s: GameState, o: FightOffer) {
  const run = s.run!;
  const idx = run.fights.length;
  const { opp, title, defense, grudge } = o;
  const amateur = isAmateurRun(s);
  const t = amateur ? run.tourneys![run.tIdx ?? 0] : undefined;
  {
    {
    const freak = s.contract.kind === 'freak';
    const fed = freak ? s.contract.fed : s.fed;
    const stage = t?.stage ?? undefined;
    const rounds = amateur ? (stage === 'qf' || stage === 'sf' ? 1 : 3) : title ? 5 : 3;
    const spot = amateur ? undefined : o.spot;
    const rep: FightReport = {
      idx,
      amateur,
      stage,
      tourney: t ? `${t.name} · ${t.city}` : undefined,
      gala: amateur ? undefined : o.gala,
      spot,
      opp,
      fed,
      title,
      defense,
      freak,
      peer: !!opp.peer,
      rankBefore: s.rank,
      rankAfter: null,
      result: null,
      method: null,
      round: 0,
      detail: '',
      moments: [],
      sim: newSim(rounds),
      purse: amateur ? 0 : o.purse,
      winBonus: amateur ? 0 : o.winBonus,
      rival: o.rival,
      tuneup: o.tuneup,
      earned: 0,
    };
    if (o.tuneup) rep.fed = o.gala;
    if (!amateur) rep.poster = makePoster(rng, s, rep);
    if (!amateur) {
      rep.prep = o.prep ?? 'std';
      if (o.pressNote) {
        rep.pressMod = o.pressMod ?? 0;
        rep.moments.push({ round: 0, title: 'Konferencja', text: o.pressNote, tone: (o.pressMod ?? 0) > 0 ? 'good' : (o.pressMod ?? 0) < 0 ? 'bad' : 'neutral' });
      }
      if (rep.prep === 'rival') {
        const cost = prepCost(s, o);
        s.money -= cost;
        rep.moments.push({ round: 0, title: 'Obóz pod rywala', text: `Sparingpartnerzy w stylu rywala i godziny nagrań. Kosztuje ${cost.toLocaleString('pl-PL')} zł, ale znasz każdy jego nawyk.`, tone: 'good' });
      } else if (rep.prep === 'hard') {
        rep.moments.push({ round: 0, title: 'Ciężki obóz', text: 'Dwa treningi dziennie przez sześć tygodni. Forma jest, ale ciało jest zmęczone.', tone: 'neutral' });
      }
      if (!freak && weightShift(s) < 0 && rng.chance(weightMissChance(s) / 100)) {
        rep.weightMiss = true;
        const fine = Math.round((rep.purse * 0.25) / 100) * 100;
        rep.purse -= fine;
        s.rep = clamp(s.rep - 2, 0, 100);
        rep.moments.push({ round: 0, title: 'Nie zrobiłeś wagi', text: `Waga pokazuje o 1,2 kg za dużo. ${fine.toLocaleString('pl-PL')} zł z gaży idzie do rywala, a ty wchodzisz do klatki wysuszony.`, tone: 'bad' });
      }
    }
    run.fights.push(rep);
    if (!amateur && !freak && !s.proDebut)
      rep.moments.push({
        round: 0,
        title: 'Debiut zawodowy',
        text: `Pierwsza walka za pieniądze. Rekord zawodowy startuje od zera, amatorskie ${recStr(s.amRecord)} zostaje w szufladzie. Bez kasku, bez ochraniaczy na golenie, rundy po pięć minut.`,
        tone: 'purple',
      });
    if (freak) {
      const circus = [
        `Konferencja kończy się bijatyką. Rywal, ${opp.freak}, rzuca w ciebie krzesłem, a internet ma używanie.`,
        `Na face to face ${opp.lastName} przykleja ci gumę do brody. Ochrona ledwo was rozdziela.`,
        `${opp.lastName} od tygodnia nagrywa o tobie dissy. Ostatni ma już milion wyświetleń.`,
        `Ważenie w galerii handlowej. ${opp.lastName} przychodzi w stroju dinozaura.`,
        `${opp.lastName} przyprowadza na konferencję kozę. Nikt nie wie po co, ale wszyscy nagrywają.`,
        `Na face to face ${opp.lastName} czyta wiersz o twojej mamie. Rymy są słabe, wyświetlenia ogromne.`,
        `${opp.lastName} twierdzi w wywiadzie, że trenował z mnichami w Tybecie. Przez dwa tygodnie, na urlopie.`,
        `Ochrona wyprowadza ekipę ${opp.lastName} z hotelu za bitwę na poduszki o trzeciej w nocy.`,
      ];
      rep.moments.push({ round: 0, title: 'Cyrk przed walką', text: rng.pick(circus), tone: 'neutral' });
    }
    if (grudge)
      rep.moments.push({ round: 0, title: 'Zła krew', text: `${opp.lastName} cały tydzień obrażał cię w internecie. Teraz musi to pokazać w klatce.`, tone: 'neutral' });
    // walkower
    if (rng.chance(amateur ? 0.04 : 0.03)) {
      if (amateur) {
        rep.moments.push({ round: 0, title: 'Walkower', text: `${opp.lastName} nie zrobił wagi. Tolerancja jest zerowa, więc przechodzisz dalej bez walki.`, tone: 'neutral' });
        rep.result = null;
        rep.method = 'Walkower';
        rep.sim.finished = true;
        rep.headline = 'Walkower, przechodzisz dalej';
        advanceTourney(s, rep, 'W');
      } else {
        rep.moments.push({ round: 0, title: 'Rywal wypada', text: `${opp.lastName} łapie kontuzję na obozie. Organizator płaci ci połowę gaży za gotowość, ale walki nie będzie.`, tone: 'neutral' });
        rep.result = null;
        rep.method = 'Walkower';
        rep.sim.finished = true;
        rep.earned = Math.round(rep.purse * 0.5);
        s.money += rep.earned;
        s.totalEarned += rep.earned;
        rep.headline = 'Rywal wypadł z gali';
        if (run.fights.length >= run.planned) run.done = true;
      }
      return;
    }
    advanceFight(rng, fightCtx(s, opp), rep.sim, rep);
    if (rep.sim.finished) finalizeFight(rng, s, rep);
    }
  }
}

export function decide(s0: GameState, key: string): GameState {
  const s = clone(s0);
  const run = s.run;
  const rep = run?.fights[run.fights.length - 1];
  if (!rep || !rep.sim.pending) return s;
  withRng(s, (rng) => {
    const ctx = fightCtx(s, rep.opp);
    applyDecision(rng, ctx, rep.sim, rep, key);
    if (!rep.sim.finished) advanceFight(rng, { ...ctx, allowDecision: false }, rep.sim, rep);
    if (rep.sim.finished) finalizeFight(rng, s, rep);
  });
  return s;
}

/** Szybko: rozgrywa wszystko do następnej decyzji albo końca roku. */
export function seasonSkip(s0: GameState): GameState {
  let s = s0;
  for (let i = 0; i < 14; i++) {
    const run = s.run;
    if (!run || run.done) break;
    const cur = run.fights[run.fights.length - 1];
    if (cur && cur.sim.pending) break;
    if (run.offer || run.press) break;
    s = seasonNext(s);
    if (s.run?.offer) break;
  }
  return s;
}

// ---------------------------------------------------------------------------
// Oferty walk: przyjmujesz, negocjujesz albo odrzucasz
// ---------------------------------------------------------------------------

export function negotiateChance(s: GameState): number {
  const o = s.run?.offer;
  if (!o) return 0;
  const mg = activeManager(s);
  let c = 28 + (mg?.negotiate ?? 0) + s.media / 4 + (s.rank !== null && s.rank <= 5 ? 10 : 0) + (o.title ? 10 : 0) + (o.rival ? 8 : 0);
  if (s.tier >= 3 && s.rank === null) c -= 10;
  if (s.contract.kind === 'freak') c += 10;
  return Math.round(clamp(c, 10, 85));
}

export function declineBlocked(s: GameState): string | null {
  const o = s.run?.offer;
  if (!o) return null;
  if (o.title) return o.defense ? 'Mistrz nie odmawia obrony pasa.' : 'O pas się nie odmawia.';
  return null;
}

/** Przyjmuje tę ofertę i wszystkie kolejne w tym roku. */
export function acceptAllOffers(s0: GameState, prep: 'std' | 'rival' | 'hard' = 'std'): GameState {
  const s = acceptOffer(s0, prep);
  if (s.run) {
    s.run.autoAccept = true;
    s.run.autoPrep = prep;
  }
  return s;
}

// Konferencja przed galą: tylko przy dużych walkach (karta główna, rywal, pas)
export function pressEligible(o: FightOffer) {
  return !o.tuneup && !!(o.title || o.rival || o.spot === 'główna' || o.spot === 'wieczoru' || o.opp.freak);
}
const PRESS_QUOTES = [
  'Ten {n} to zawodnik z przypadku. W klatce zobaczy, jak wygląda prawdziwe MMA.',
  'Szanuję każdego rywala. {n} to wyjątek.',
  'Po tej walce {n} wróci do roznoszenia ulotek.',
  'Widziałem jego walki. Zasnąłem w drugiej rundzie, w klatce będzie tak samo, tylko on zaśnie.',
  'Mój trener powiedział, że {n} ma szczękę ze szkła. Sprawdzę.',
  'Niech {n} lepiej przyniesie ręcznik. Przyda się, żeby rzucić go na ring.',
  'Nie wiem nawet, jak on się nazywa. Za tydzień też nikt nie będzie wiedział.',
];
export type PressAnswer = 'calm' | 'provoke' | 'insult';
export const PRESS_OPTIONS: { key: PressAnswer; label: string; desc: string }[] = [
  { key: 'calm', label: 'Spokojnie i z klasą', desc: 'Szacunek, zero emocji. Kibice cenią.' },
  { key: 'provoke', label: 'Odbijasz piłeczkę', desc: 'Ostra riposta. Może wyprowadzić go z równowagi albo ciebie.' },
  { key: 'insult', label: 'Jedziesz po bandzie', desc: 'Zasięgi gwarantowane. Federacja może ukarać, a nerwy mogą puścić.' },
];

export function pressAnswer(s0: GameState, key: PressAnswer): GameState {
  const s = clone(s0);
  const o = s.run?.press;
  if (!o) return s0;
  s.run!.press = null;
  withRng(s, (rng) => {
    if (key === 'calm') {
      s.rep = clamp(s.rep + 2, 0, 100);
      o.pressMod = 1;
      o.pressNote = rng.pick(['Spokojnie odpowiadasz, że w sobotę wszystko się wyjaśni. Dziennikarze kiwają głowami.', 'Mówisz o szacunku i ciężkiej pracy. Nudne, ale profesjonalne.']);
    } else if (key === 'provoke') {
      s.media = clamp(s.media + 2, 0, 100);
      if (rng.chance(0.6)) {
        o.pressMod = 3;
        o.pressNote = rng.pick(['Twoja riposta trafia. Rywal czerwienieje i nie wie, co odpowiedzieć. Sala się śmieje.', 'Odbijasz piłeczkę tak, że rywal schodzi ze sceny wściekły. To ty kontrolujesz emocje.']);
      } else {
        o.pressMod = -3;
        o.pressNote = rng.pick(['Rywal ma odpowiedź na wszystko. To ciebie wyprowadził z równowagi.', 'Wdajesz się w przepychankę słowną i przegrywasz ją. Wracasz do hotelu zły.']);
      }
    } else {
      s.media = clamp(s.media + 3, 0, 100);
      s.rep = clamp(s.rep - 3, 0, 100);
      if (rng.chance(0.4)) {
        o.pressMod = 4;
        o.pressNote = 'Klip z konferencji ma milion wyświetleń. Rywal przez cały tydzień myśli tylko o tobie, a nie o planie na walkę.';
      } else {
        const fine = [0, 1000, 3000, 8000, 20000][s.tier] ?? 3000;
        s.money -= fine;
        o.pressMod = -4;
        o.pressNote = `Przesadzasz. Federacja nakłada ${fine.toLocaleString('pl-PL')} zł kary, a ty przez tydzień nie śpisz z nerwów.`;
      }
    }
    startFight(rng, s, o);
  });
  return s;
}

export function prepCost(_s: GameState, o: FightOffer): number {
  return Math.max(500, Math.round((o.purse * 0.2) / 100) * 100);
}

export function acceptOffer(s0: GameState, prep: 'std' | 'rival' | 'hard' = 'std'): GameState {
  const s = clone(s0);
  const o = s.run?.offer;
  if (!o) return s0;
  o.prep = prep === 'rival' && s.money < prepCost(s, o) ? 'std' : prep;
  s.run!.offer = null;
  if (pressEligible(o) && !s.run!.autoAccept) {
    withRng(s, (rng) => {
      o.pressQuote = rng.pick(PRESS_QUOTES).replace('{n}', s.profile.lastName);
    });
    s.run!.press = o;
    return s;
  }
  withRng(s, (rng) => startFight(rng, s, o));
  return s;
}

/** Odpada oferta: albo przychodzi następna, albo w tym roku będzie jedna walka mniej. */
function offerGone(rng: Rng, s: GameState, lostP: number, text: string) {
  const run = s.run!;
  run.notes = run.notes ?? [];
  if (rng.chance(lostP)) {
    run.planned -= 1;
    run.notes.push(`${text} Innej oferty nie ma, w tym roku jedna walka mniej.`);
    run.offer = null;
    if (run.fights.length >= run.planned) run.done = true;
    else run.offer = buildOffer(rng, s, run.fights.length);
  } else {
    run.notes.push(`${text} Po kilku dniach przychodzi inna propozycja.`);
    run.offer = buildOffer(rng, s, run.fights.length);
  }
}

export function negotiateOffer(s0: GameState): GameState {
  const s = clone(s0);
  const o = s.run?.offer;
  if (!o || o.negotiated) return s0;
  withRng(s, (rng) => {
    const ok = rng.chance(negotiateChance(s0) / 100);
    if (ok) {
      o.purse = Math.round((o.purse * 1.25) / 100) * 100;
      o.winBonus = Math.round((o.winBonus * 1.2) / 100) * 100;
      o.negotiated = true;
      o.note = `Organizator podnosi gażę do ${o.purse.toLocaleString('pl-PL')} zł.`;
    } else if (!o.title && rng.chance(0.35)) {
      offerGone(rng, s, 0, `Organizator nie podniósł stawki i oddał tę walkę komuś innemu (rywal: ${o.opp.firstName} ${o.opp.lastName}).`);
    } else {
      o.negotiated = true;
      o.note = 'Organizator nie da ani złotówki więcej. Bierzesz albo nie.';
    }
  });
  return s;
}

export function declineOffer(s0: GameState): GameState {
  if (declineBlocked(s0) || !s0.run?.offer) return s0;
  if (s0.run.offer.tuneup) {
    const s = clone(s0);
    withRng(s, (rng) => {
      s.run!.notes = s.run!.notes ?? [];
      s.run!.notes.push(`Odmawiasz walki na ${s0.run!.offer!.gala.split(' · ')[0]}. Federacja ma dla ciebie normalnego rywala.`);
      s.run!.offer = buildOffer(rng, s, s.run!.fights.length);
    });
    return s;
  }
  const s = clone(s0);
  const run = s.run!;
  const o = run.offer!;
  run.declines = (run.declines ?? 0) + 1;
  // grymaszenie kosztuje: promotorzy mają długą pamięć
  if (run.declines >= 2) s.rep = clamp(s.rep - 2, 0, 100);
  withRng(s, (rng) => offerGone(rng, s, 0.2 + 0.15 * (run.declines! - 1), `Odrzucasz ofertę (rywal: ${o.opp.firstName} ${o.opp.lastName}).`));
  return s;
}

/** Ile walk chcesz stoczyć w roku (przed startem roku). */
export function fightRange(s: GameState): [number, number] | null {
  if (s.tier === 0 || s.contract.kind === 'freak') return null;
  const f = s.contract.fights;
  return [Math.max(1, f - 1), Math.min(5, f + 1)];
}
export function plannedFights(s: GameState): number {
  const r = fightRange(s);
  if (!r) return s.contract.kind === 'freak' ? 2 : s.contract.fights;
  return clamp(s.flags.wantFights || s.contract.fights, r[0], r[1]);
}
export function setWantFights(s0: GameState, n: number): GameState {
  const s = clone(s0);
  s.flags.wantFights = n;
  return s;
}

export function setManager(s0: GameState, id: string | null): GameState {
  const m = managerById(id);
  if (m && managerBlocked(s0, m)) return s0;
  const s = clone(s0);
  const prev = currentManager(s0);
  s.manager = id;
  if (!id) s.flags.manager = 0;
  if (m && prev?.id !== m.id) log(s, `Nowy menedżer: ${m.name}.`);
  if (!m && prev) log(s, `Rozstajesz się z menedżerem (${prev.name}).`);
  return s;
}

const PLACE_TEXT: Record<number, string> = {
  1: 'złoto',
  2: 'srebro',
  3: 'brąz',
  4: 'czwarte miejsce',
  5: 'odpadłeś w ćwierćfinale',
};

export function tourneyResultText(t: Tourney, short = false) {
  if (t.place === null) return t.stage ? `w grze: ${STAGE_LABELS[t.stage].toLowerCase()}` : 'jeszcze przed tobą';
  if (short && t.place === 5) return 'ćwierćfinał';
  if (short && t.place === 4) return '4. miejsce';
  return PLACE_TEXT[t.place];
}

function advanceTourney(s: GameState, rep: FightReport, res: 'W' | 'L' | 'D') {
  const run = s.run!;
  const t = run.tourneys![run.tIdx ?? 0];
  const won = res === 'W';
  const stage = t.stage;
  if (stage === 'qf') {
    if (won) t.stage = 'sf';
    else {
      t.stage = null;
      t.place = 5;
    }
  } else if (stage === 'sf') t.stage = won ? 'f' : 'b';
  else if (stage === 'f') {
    t.stage = null;
    t.place = won ? 1 : 2;
    t.medal = won ? 'gold' : 'silver';
  } else if (stage === 'b') {
    t.stage = null;
    t.place = won ? 3 : 4;
    t.medal = won ? 'bronze' : null;
  }
  if (t.stage === null) {
    if (t.medal) s.medals[t.medal]++;
    if (!t.championship && amLevel(s) === 0 && (t.medal === 'gold' || t.medal === 'silver')) s.flags.amPromote = 1;
    if (t.medal === 'gold' && t.championship) {
      s.belts.push({ name: BELT_NAMES[0], season: s.season, age: s.age });
      log(s, `🥇 Mistrz Polski amatorów (${t.city}).`);
      rep.moments.push({ round: rep.round, title: 'Mistrz Polski amatorów!', text: `Złoty medal Amatorskich Mistrzostw Polski. Wieszają ci go na szyi, a trener udaje, że coś wpadło mu do oka.`, tone: 'purple' });
    } else if (t.medal) {
      const m = t.medal === 'gold' ? 'Złoto' : t.medal === 'silver' ? 'Srebro' : 'Brąz';
      log(s, `${t.medal === 'gold' ? '🥇' : t.medal === 'silver' ? '🥈' : '🥉'} ${m}: ${t.name} (${t.city}).`);
      rep.moments.push({ round: rep.round, title: `${m}: ${t.name}`, text: t.medal === 'gold' ? 'Cztery godziny czekania na hali i trzy walki. Medal jest twój.' : t.medal === 'silver' ? 'Finał przegrany, ale srebro to srebro. Za rok wracasz po więcej.' : 'Brąz wywalczony w walce o trzecie miejsce. Na podium stoisz z uśmiechem.', tone: 'good' });
    }
    run.tIdx = (run.tIdx ?? 0) + 1;
  }
  if ((run.tIdx ?? 0) >= run.tourneys!.length) run.done = true;
  run.planned = plannedAmateur(run);
}

function updateRank(s: GameState, rep: FightReport) {
  const size = RANK_SIZE[s.tier];
  const res = rep.result;
  const opp = rep.opp;
  const mine = s.rank;
  if (rep.freak || rep.amateur) return;
  if (rep.title && !rep.defense) {
    if (res === 'W') {
      s.rank = 0;
      s.titleDefenses = 0;
      const name = `${BELT_NAMES[s.tier]} (${galaPrefix(rep.fed)})`;
      s.belts.push({ name, season: s.season, age: s.age });
      log(s, `🏆 ${name}. Pokonany mistrz: ${opp.firstName} ${opp.lastName}.`);
    } else if (res === 'L') s.rank = 2;
    return;
  }
  if (rep.defense) {
    if (res === 'W' || res === 'D') {
      s.titleDefenses++;
      s.flags.maxDef = Math.max(s.flags.maxDef ?? 0, s.titleDefenses);
      if (res === 'W') log(s, `Obrona pasa nr ${s.titleDefenses} (${opp.lastName}).`);
    } else {
      s.rank = 1;
      log(s, `Pas stracony. Nowy mistrz: ${opp.firstName} ${opp.lastName}.`);
    }
    return;
  }
  const finish = rep.method === 'KO/TKO' || rep.method === 'Poddanie';
  if (rep.tuneup) {
    // walka poza federacją: lekki ruch w rankingu, za porażkę bolesny
    if (res === 'W') s.rank = mine === null ? size : Math.max(1, mine - 1);
    else if (res === 'L') s.rank = (mine ?? size) + 4;
    if (s.rank !== null && s.rank > size) s.rank = null;
    return;
  }
  const cur = mine ?? size + 2;
  if (res === 'W') {
    let next: number;
    if (opp.rank !== null && opp.rank > 0 && opp.rank < cur) next = opp.rank;
    else next = cur - 1 - (finish ? 1 : 0) - (opp.rank !== null ? 1 : 0);
    // dobry menedżer umie sprzedać zwycięstwo: większy skok w rankingu
    next -= activeManager(s)?.quality ?? 0;
    s.rank = clamp(next, 1, size + 2);
  } else if (res === 'L') {
    s.rank = cur + 2 + (finish ? 1 : 0);
  }
  if (s.rank !== null && s.rank > size) s.rank = null;
}

function finalizeFight(rng: Rng, s: GameState, rep: FightReport) {
  const opp = rep.opp;
  // dogrywka w drabince: remisów nie ma
  if (rep.amateur && rep.result === 'D') {
    const edge = (ovr(s.stats) - ovr(opp.stats)) / 40 + rep.sim.momentum / 100 + (s.run!.form.mod - (s.injury?.penalty ?? 0)) / 100;
    const won = rng.chance(clamp(0.5 + edge, 0.15, 0.85));
    rep.result = won ? 'W' : 'L';
    rep.method = 'Decyzja niejednogłośna';
    rep.detail = 'po dogrywce';
    rep.moments.push({
      round: rep.round,
      title: 'Dogrywka',
      text: won ? 'Po regulaminowym czasie remis, więc dogrywka. Ostatnia minuta należy do ciebie i sędziowie to widzą.' : `Po regulaminowym czasie remis, więc dogrywka. ${opp.lastName} ma więcej paliwa i to jemu sędzia podnosi rękę.`,
      tone: won ? 'good' : 'bad',
    });
  }
  const res = rep.result!;
  if ((rep.method === 'KO/TKO' || rep.method === 'Poddanie' || rep.method === 'Lekarz') && !rep.time) rep.time = finishTime(rng, rep);
  // wynik
  const rec = rep.amateur ? s.amRecord : s.record;
  if (res === 'W') rec.w++;
  else if (res === 'L') rec.l++;
  else rec.d++;
  if (!rep.amateur && !rep.freak && !s.proDebut) {
    s.proDebut = { season: s.season, age: s.age };
    log(s, `Debiut zawodowy na gali ${rep.gala}: ${res === 'W' ? 'wygrana' : res === 'L' ? 'porażka' : 'remis'}, rywal ${opp.firstName} ${opp.lastName}.`);
  }
  s.streak = res === 'W' ? Math.max(0, s.streak) + 1 : res === 'L' ? Math.min(0, s.streak) - 1 : 0;
  s.flags.bestStreak = Math.max(s.flags.bestStreak ?? 0, s.streak);
  if (res === 'W' && rep.moments.some((m) => m.decision && m.title === 'Mocno obity')) s.flags.comeback = 1;
  if (res === 'W' && rep.moments.some((m) => m.title === 'Podnosisz się po nokdaunie')) s.flags.offTheCanvas = 1;
  if (res === 'L' && rep.method === 'Decyzja niejednogłośna') s.flags.splitLoss = (s.flags.splitLoss ?? 0) + 1;
  if (res === 'W' && rep.method === 'KO/TKO' && rep.round === 1) s.flags.koR1 = (s.flags.koR1 ?? 0) + 1;
  if (res === 'W' && opp.peer) s.flags.peerWins = (s.flags.peerWins ?? 0) + 1;
  if (res === 'W' && rep.freak && opp.freak) s.flags.freakWins = (s.flags.freakWins ?? 0) + 1;
  if (res === 'L' && rep.freak) s.flags.freakLoss = 1;
  if (res === 'W' && rep.method === 'KO/TKO') s.finishes.ko++;
  if (res === 'W' && rep.method === 'Poddanie') s.finishes.sub++;
  if (res === 'L' && (rep.method === 'KO/TKO' || rep.method === 'Lekarz')) s.finishes.koLosses++;
  if (res === 'L' && rep.method === 'Poddanie') s.finishes.subLosses++;
  if (rep.freak) s.freakFights++;

  // pieniądze i bonusy
  let earned = rep.amateur ? 0 : rep.purse + (res === 'W' ? rep.winBonus ?? Math.round(s.contract.winBonus * (rep.title ? 1.8 : 1)) : 0);
  if (!rep.amateur && s.tier >= 1) {
    const amount = rep.tuneup ? 1500 : [0, 1500, 10000, 30000, 200000][s.tier];
    let bonus: string | null = null;
    if (res === 'W' && rep.method === 'KO/TKO' && rng.chance(0.3)) bonus = 'Nokaut wieczoru';
    else if (res === 'W' && rep.method === 'Poddanie' && rng.chance(0.35)) bonus = 'Poddanie wieczoru';
    else if (rep.sim.me.dmg > 30 && rep.sim.opp.dmg > 30 && rng.chance(0.4)) bonus = 'Walka wieczoru';
    if (bonus) {
      rep.bonus = bonus;
      earned += amount;
      s.flags.bonuses = (s.flags.bonuses ?? 0) + 1;
      rep.moments.push({
        round: rep.round,
        brand: bonus === 'Nokaut wieczoru' ? 'knockout' : undefined,
        title: `Bonus: ${bonus.toLowerCase()}`,
        text: bonus === 'Walka wieczoru' ? `Organizator docenia wojnę, jaką zafundowaliście kibicom. Dla każdego z was ${amount.toLocaleString('pl-PL')} zł.` : `Organizator dorzuca ${amount.toLocaleString('pl-PL')} zł za najlepsze skończenie gali.`,
        tone: 'purple',
      });
    }
  }
  const mgr = currentManager(s);
  if (mgr && !rep.amateur && earned > 0) {
    const cut = Math.round((earned * mgr.cut) / 100) * 100;
    earned -= cut;
    rep.mgrCut = cut;
  }
  rep.earned = earned;
  s.money += earned;
  s.totalEarned += earned;

  // media i reputacja
  const tierM = [1, 1.5, 2.5, 3, 4][s.tier];
  if (res === 'W') {
    const titleM = [0.5, 1.5, 4, 6, 10][s.tier];
    const capByTier = [35, 55, 80, 95, 100][s.tier];
    const gain = Math.round((rep.method === 'KO/TKO' || rep.method === 'Poddanie' ? 2 : 1) * tierM + (rep.title ? titleM : 0));
    if (s.media < capByTier) s.media = clamp(s.media + gain, 0, capByTier);
    const repCap = [45, 60, 85, 100, 100][s.tier];
    if (!rep.freak && s.rep < repCap) s.rep = clamp(s.rep + Math.round(0.5 + tierM / 2 + (rep.title ? titleM / 2 : 0)), 0, repCap);
    if (rep.freak) s.rep = clamp(s.rep - 4, 0, 100);
  } else if (res === 'L') {
    s.media = clamp(s.media + (rep.freak ? -3 : 0), 0, 100);
    s.rep = clamp(s.rep - (rep.freak ? 8 : 1), 0, 100);
  }
  if (rep.freak) {
    s.media = clamp(s.media + 5, 0, 100);
    s.rep = clamp(s.rep - 3, 0, 100);
  }
  if (rep.tuneup) {
    // obijanie słabeuszy: środowisko widzi, co robisz
    s.rep = clamp(s.rep - (res === 'W' ? 2 : 6), 0, 100);
    if (res !== 'W') s.media = clamp(s.media - 4, 0, 100);
    s.flags.tuneups = (s.flags.tuneups ?? 0) + 1;
  }

  // zużycie i kontuzje
  const dmgTaken = rep.sim.me.dmg;
  s.wear = clamp(s.wear + (dmgTaken / 10) * (rep.amateur ? 0.4 : 1) * (hasBackroom(s, 'physio') ? 0.7 : 1) + (res === 'L' && (rep.method === 'KO/TKO' || rep.method === 'Lekarz') ? (rep.amateur ? 3 : 7) : 0) + (s.age >= 32 ? 1.5 : 0), 0, 100);
  const extra = !rep.amateur && s.run ? Math.max(0, s.run.fights.length - 3) : 0;
  // zbijanie wagi i ciężki obóz męczą organizm
  if (!rep.amateur && weightShift(s) < 0) s.wear = clamp(s.wear + 1, 0, 100);
  if (!rep.amateur && weightShift(s) > 0) s.wear = clamp(s.wear - 1.5, 0, 100);
  if (rep.prep === 'hard') s.wear = clamp(s.wear + 1, 0, 100);
  if (extra) s.wear = clamp(s.wear + 2 * extra, 0, 100);
  const injP = (extra * 0.03 + (rep.prep === 'hard' ? 0.03 : 0) + (dmgTaken > 50 ? 0.22 : dmgTaken > 30 ? 0.07 : 0.02) + s.wear / 600 + (s.age >= 32 ? 0.03 : 0)) * (rep.amateur ? 0.5 : 0.8);
  if (!s.injury && rng.chance(injP * (hasBackroom(s, 'doctor') ? 0.65 : 1))) {
    const roll = rng.next() * (hasBackroom(s, 'doctor') ? 0.8 : 1);
    if (roll < 0.6) {
      s.injury = { name: rng.pick(INJ_MINOR), seasons: 1, penalty: 4 };
      rep.moments.push({ round: rep.round, title: 'Kontuzja', text: `Po walce lekarz ma złe wieści: ${s.injury.name}. Da się walczyć, ale nie na sto procent.`, tone: 'bad' });
    } else if (roll < 0.88 || rep.amateur) {
      s.injury = { name: rng.pick(INJ_SEVERE), seasons: 2, penalty: 5 };
      s.flags.injuryStop = 1;
      rep.moments.push({ round: rep.round, title: 'Poważna kontuzja', text: `Diagnoza: ${s.injury.name}. Lekarz skreśla cię do końca roku.`, tone: 'bad' });
      log(s, `Poważna kontuzja: ${s.injury.name}. Koniec roku.`);
    } else {
      s.injury = { name: rng.pick(INJ_OUT), seasons: 2, penalty: 6, out: 1 };
      s.flags.injuryStop = 1;
      rep.moments.push({ round: rep.round, title: 'Uraz na rok', text: `Diagnoza: ${s.injury.name}. Operacja i cały następny rok rehabilitacji.`, tone: 'bad' });
      log(s, `Uraz na cały rok: ${s.injury.name}.`);
    }
  }

  // ranking
  rep.rankBefore = s.rank;
  updateRank(s, rep);
  rep.rankAfter = s.rank;
  if (s.rank !== null) {
    if (s.tier > s.peakTier || (s.tier === s.peakTier && (s.peakRank === null || s.rank < s.peakRank))) {
      s.peakTier = s.tier;
      s.peakRank = s.rank;
    }
  }

  // rocznik
  if (opp.peer) {
    const p = s.peers.find((x) => x.id === opp.id);
    if (p) {
      p.metCount++;
      if (res === 'W') {
        p.h2h.w++;
        p.record.l++;
        if (s.rivalId === p.id) s.media = clamp(s.media + 3, 0, 100);
      } else if (res === 'L') {
        p.h2h.l++;
        p.record.w++;
      } else {
        p.h2h.d++;
        p.record.d++;
      }
      // narodziny rywalizacji: porażka z kimś z rocznika albo drugie spotkanie
      if (!s.rivalId && !rep.amateur && (res === 'L' || p.metCount >= 2)) {
        s.rivalId = p.id;
        rep.rival = true;
        rep.moments.push({
          round: rep.round,
          title: 'Rywalizacja',
          text:
            res === 'L'
              ? `${p.lastName} po walce rzuca do kamery, że „to był trening”. Od dziś to twój rywal. Jeszcze się spotkacie.`
              : `Drugi raz ${p.lastName}. Kibice już mówią o was jak o serialu. Od dziś to twój rywal.`,
          tone: 'purple',
        });
        log(s, `Rywal na całą karierę: ${p.firstName} ${p.lastName}.`);
      }
      if (rep.rival && p.metCount > 1)
        rep.moments.unshift({
          round: 0,
          title: 'Odwieczny rywal',
          text: `${p.firstName} ${p.lastName}. Wasz bilans przed walką: ${p.h2h.w - (res === 'W' ? 1 : 0)}-${p.h2h.l - (res === 'L' ? 1 : 0)}. Hala jest pełna, bo wszyscy wiedzą, że tu nie chodzi tylko o ranking.`,
          tone: 'purple',
        });
      else if (p.metCount === 1)
        rep.moments.unshift({ round: 0, title: 'Znajoma twarz', text: `${p.firstName} ${p.lastName}. Znacie się z pierwszych turniejów, nieraz jechaliście jednym busem. Dziś koleżeństwo zostaje w szatni.`, tone: 'neutral' });
      else
        rep.moments.unshift({
          round: 0,
          title: 'Rewanż',
          text: `Znowu ${p.lastName}. Przed dzisiejszą walką wasz bilans to ${p.h2h.w - (res === 'W' ? 1 : 0)}-${p.h2h.l - (res === 'L' ? 1 : 0)}.`,
          tone: 'neutral',
        });
    }
  }

  // komentarz do werdyktu
  if ((rep.method && rep.method.startsWith('Decyzja')) || rep.method === 'Remis') {
    const n = opp.lastName;
    const lines: Record<string, string[]> = {
      'W:Decyzja jednogłośna': [
        `Kontrolowałeś walkę od początku do końca. Sędziowie nie mieli wątpliwości, ${n} chyba też nie.`,
        'Bez fajerwerków, ale pewnie. Każda runda twoja.',
        `${n} do końca szukał jednego ciosu. Nie znalazł.`,
        'Trzy rundy, trzy razy 10-9. Trener kiwa głową, czyli jest zadowolony.',
        `${n} po walce mówi, że następnym razem będzie inaczej. Każdy tak mówi.`,
        'Wygrana na kartach. Nie najładniejsza, ale do rekordu się liczy.',
      ],
      'W:Decyzja niejednogłośna': ['Wyrównana wojna. Dwóch sędziów punktuje dla ciebie, jeden dla niego.', `Część hali gwiżdże, ${n} kręci głową, ale to twoja ręka idzie w górę.`],
      'W:Decyzja większościowa': ['Jeden sędzia dał remis, dwóch ciebie. Wystarczy.', 'Sędzia punktowy numer trzy chyba oglądał inną walkę. Na szczęście pozostali dwaj nie.'],
      'L:Decyzja jednogłośna': [`${n} był dziś po prostu lepszy. Długa droga do szatni.`, 'Goniłeś go przez całą walkę i nie dogoniłeś.', 'Trener w szatni mówi tylko: „wracamy do roboty”.', `${n} rozbił walkę na kawałki. Trzeba to obejrzeć jeszcze raz i wyciągnąć wnioski.`],
      'L:Decyzja niejednogłośna': ['Jeden sędzia był z tobą, dwóch nie. W szatni cisza.', 'Kibice krzyczą twoje nazwisko, ale sędzia podnosi drugą rękę.', 'Internet pisze o skandalu, ale w rekordzie i tak zostaje porażka.'],
      'L:Decyzja większościowa': ['Remis u jednego sędziego, porażka u dwóch. Boli.'],
      'D:Remis': ['Remis. Nikt nie jest zadowolony, wszyscy chcą rewanżu.', 'Remis. Organizator już zaciera ręce na rewanż.'],
    };
    const pool = lines[`${res}:${rep.method}`];
    if (pool && !rep.moments.some((m) => m.title === 'Dogrywka'))
      rep.moments.push({ round: rep.round, title: 'Werdykt', text: rng.pick(pool), tone: res === 'W' ? 'good' : res === 'L' ? 'bad' : 'neutral' });
  }

  rep.headline = headlineFor(rep);

  // historia
  const h: HistoryEntry = {
    amateur: rep.amateur,
    gala: rep.gala ?? rep.tourney,
    stage: rep.stage,
    time: rep.time,
    season: s.season,
    age: s.age,
    tier: s.tier,
    fed: rep.fed,
    opponent: `${opp.firstName} ${opp.lastName}`,
    oppNick: opp.nickname,
    oppRecord: recStr(opp.record),
    oppRank: opp.rank,
    oppFlag: opp.flag,
    result: res,
    method: rep.method!,
    round: rep.round,
    detail: rep.detail,
    title: rep.title,
    freak: rep.freak,
    peer: rep.peer,
    earned,
  };
  s.history.push(h);
  if (totalWins(s) === 1 && res === 'W') log(s, `Pierwsze zwycięstwo: ${opp.firstName} ${opp.lastName}.`);
  if (res === 'W' && rep.method === 'KO/TKO' && s.finishes.ko === 1) log(s, `Pierwszy nokaut (${rep.detail}).`);
  if (rep.freak && s.freakFights === 1) log(s, `Pierwszy freak fight (${opp.freak}).`);

  if (rep.amateur) advanceTourney(s, rep, res);
  else if (s.run!.fights.length >= s.run!.planned) s.run!.done = true;
  if (s.flags.injuryStop) {
    s.flags.injuryStop = 0;
    s.run!.done = true;
  }
}

export const METHOD_SHORT: Record<string, string> = {
  'KO/TKO': 'KO/TKO',
  Poddanie: 'poddanie',
  Lekarz: 'TKO (przerwanie przez lekarza)',
  'Decyzja jednogłośna': 'jednogłośna decyzja',
  'Decyzja niejednogłośna': 'niejednogłośna decyzja',
  'Decyzja większościowa': 'decyzja większościowa',
  Remis: 'remis',
  Walkower: 'walkower',
};

function headlineFor(rep: FightReport): string {
  const r = rep.result;
  const m = rep.method!;
  const word = r === 'W' ? 'Wygrana' : r === 'L' ? 'Porażka' : 'Remis';
  if (m === 'Remis') return 'Remis';
  if (m === 'KO/TKO' || m === 'Poddanie' || m === 'Lekarz') return `${word} · ${METHOD_SHORT[m]} · R${rep.round}${rep.time ? ` ${rep.time}` : ''}`;
  return `${word} · ${METHOD_SHORT[m]}`;
}

// ---------------------------------------------------------------------------
// Podsumowanie roku
// ---------------------------------------------------------------------------

const fmtK = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(Math.round(n / 1000)).toLocaleString('pl-PL')} tys. zł`;

export function toSummary(s0: GameState): GameState {
  const s = clone(s0);
  const run = s.run!;
  const fights = run.fights.filter((f) => f.result);
  const w = fights.filter((f) => f.result === 'W').length;
  const l = fights.filter((f) => f.result === 'L').length;
  const d = fights.filter((f) => f.result === 'D').length;
  const total = Math.max(1, w + l + d);
  const moneyDelta = s.money - (s.flags.moneyStart ?? run.startMoney);
  const beltWon = fights.some((f) => f.title && !f.defense && f.result === 'W') || (run.tourneys ?? []).some((t) => t.championship && t.medal === 'gold');
  const amateur = !!run.tourneys;

  const winPct = w / total;
  const expected = 1 / (1 + Math.exp(-(ovr(s.stats) - TIER_LEVEL[s.tier]) / 6));
  const overPct = Math.round(clamp(50 + (winPct - expected) * 120, 5, 100));
  const bars = [
    { label: 'Wyniki', value: Math.round(winPct * 100), note: `${w} z ${w + l + d} ${pl(w + l + d, 'walki', 'walk', 'walk')} wygranych` },
    {
      label: 'Na tle oczekiwań',
      value: overPct,
      note: overPct >= 62 ? 'lepiej, niż wskazywał poziom' : overPct >= 40 ? 'mniej więcej tyle, ile się dało' : 'poniżej możliwości',
    },
    { label: 'Pieniądze', value: Math.round(clamp(50 + (moneyDelta / Math.max(5000, TIER_PURSE[s.tier][1] * 2)) * 60, 5, 100)), note: fmtK(moneyDelta) },
    { label: 'Forma', value: Math.round(clamp(50 + run.form.mod * 5, 5, 100)), note: run.form.label.toLowerCase() },
  ];
  const medalPts = (run.tourneys ?? []).reduce((a, t) => a + (t.medal === 'gold' ? 14 : t.medal === 'silver' ? 8 : t.medal === 'bronze' ? 5 : 0), 0);
  const score = bars[0].value * 0.5 + bars[1].value * 0.3 + bars[2].value * 0.1 + bars[3].value * 0.1 + (beltWon ? 25 : 0) + medalPts;
  const grade =
    score >= 80 ? 'Rok wybitny' : score >= 62 ? 'Udany rok' : score >= 45 ? 'Przeciętny rok' : score >= 28 ? 'Rok do zapomnienia' : 'Katastrofa';

  const finishes = fights.filter((f) => f.result === 'W' && (f.method === 'KO/TKO' || f.method === 'Poddanie')).length;
  const lines: string[] = [];
  const fedShort = galaPrefix(s.fed);
  if (amateur) {
    for (const t of run.tourneys!) lines.push(`${t.name}: ${tourneyResultText(t)}.`);
    if (beltWon) lines.push('Jesteś mistrzem Polski amatorów i w klubie wszyscy już o tym wiedzą.');
  } else if (beltWon) lines.push(`Rok, w którym zdobyłeś pas. ${fedShort} ma nowego mistrza.`);
  else if (w === total && total > 1) lines.push(`Rok bez porażki, ${w} na ${total}.`);
  else if (l === total) lines.push(`Rok do wymazania. ${l} ${pl(l, 'porażka', 'porażki', 'porażek')} i ani jednego powodu do radości.`);
  else lines.push(`Bilans roku: ${w}-${l}${d ? `-${d}` : ''}.`);
  if (!amateur && fights.length === 0) {
    lines.push('Cały rok bez walki. Organizatorzy zapominają nazwiska szybciej, niż myślisz.');
    if (s.rank !== null && s.rank > 0) s.rank = s.rank + 3 > RANK_SIZE[s.tier] ? null : s.rank + 3;
  }
  if (finishes >= 2) lines.push(`${finishes} ${pl(finishes, 'walkę', 'walki', 'walk')} skończyłeś przed czasem.`);
  else if (fights.length >= 2 && fights.every((f) => f.method?.startsWith('Decyzja'))) lines.push('Wszystkie walki do ostatniego gongu, sędziowie mieli co robić.');
  const peerFight = fights.find((f) => f.peer);
  if (peerFight) lines.push(`Pojedynek z kolegą z rocznika (${peerFight.opp.firstName} ${peerFight.opp.lastName}): ${peerFight.result === 'W' ? 'wygrany' : peerFight.result === 'L' ? 'przegrany' : 'remis'}.`);
  const goodForm = GOOD_FORMS.includes(run.form.label);
  const badForm = BAD_FORMS.includes(run.form.label);
  if (goodForm && winPct >= 0.6) lines.push('Forma była i wszystko wychodziło.');
  else if (goodForm) lines.push('Forma była, wyników zabrakło.');
  if (badForm && winPct < 0.5) lines.push('Od pierwszego treningu nic się nie kleiło.');
  else if (badForm) lines.push('Forma nie dopisywała, a mimo to wyniki się zgadzały.');
  if (!amateur && s.rank !== null && s.rank > 0) lines.push(`Kończysz rok na ${s.rank}. miejscu w rankingu.`);

  if (s.contract.kind === 'freak' && !amateur) {
    withRng(s, (rng) => {
      for (const k of ['stand', 'wrest', 'bjj', 'cardio'] as StatKey[]) s.stats[k] = clamp(s.stats[k] - rng.int(1, 3), 1, 99);
    });
    lines.push('Zamiast obozu były konferencje, nagrania i sparingi z youtuberami. Forma sportowa poszła w dół.');
  }
  const summary: SeasonSummary = {
    season: s.season,
    year: s.year,
    age: s.age,
    tier: s.tier,
    fed: s.fed,
    club: s.club.name,
    w,
    l,
    d,
    rank: s.rank,
    champion: s.rank === 0,
    beltWon,
    moneyDelta,
    ovrFrom: s.flags.ovrStart ?? run.startOvr,
    ovrTo: ovr(s.stats),
    form: run.form.label,
    grade,
    bars,
    story: lines.join(' '),
  };
  s.seasons.push(summary);
  s.lastSummary = summary;
  s.phase = 'summary';
  withRng(s, (rng) => {
    for (const p of s.peers) progressPeer(rng, p);
  });

  // cięcie z federacji
  if (s.tier >= 2 && s.rank === null && l >= Math.ceil(total * 0.6) && s.contract.kind !== 'freak') s.flags.cut = 1;
  if (s.tier === 1 && s.rank === null && l >= total && total >= 2) s.flags.cut = 1;
  return s;
}

// ---------------------------------------------------------------------------
// Upływ czasu
// ---------------------------------------------------------------------------

function ageOneYear(rng: Rng, s: GameState) {
  s.age += 1;
  s.season += 1;
  s.year += 1;
  s.clubSeasons += 1;
  // spadek formy z wiekiem
  if (s.age >= 31) {
    const k = s.age - 30;
    s.stats.cardio = clamp(s.stats.cardio - rng.int(1, 2) - Math.floor(k / 3), 1, 99);
    s.stats.stand = clamp(s.stats.stand - (rng.chance(0.5 + k * 0.05) ? 1 : 0), 1, 99);
    s.stats.wrest = clamp(s.stats.wrest - (rng.chance(0.4 + k * 0.05) ? 1 : 0), 1, 99);
    s.stats.chin = clamp(s.stats.chin - rng.int(0, 2), 1, 99);
    if (s.age >= 34) {
      s.stats.stand = clamp(s.stats.stand - rng.int(0, 2), 1, 99);
      s.stats.wrest = clamp(s.stats.wrest - rng.int(0, 1), 1, 99);
      s.stats.bjj = clamp(s.stats.bjj - rng.int(0, 1), 1, 99);
    }
  }
  if (s.age <= 32 && rng.chance(0.35)) s.stats.iq = clamp(s.stats.iq + 1, 1, 99);
  // regeneracja zużycia
  s.wear = clamp(s.wear - (s.age < 28 ? 3 : 1), 0, 100);
  // kontuzje
  if (s.injury) {
    s.injury.seasons -= 1;
    if (s.injury.seasons <= 0) s.injury = null;
  }
  // sponsorzy
  for (const sp of s.sponsors) sp.seasonsLeft -= 1;
  const hadLabs = hasLabs(s);
  s.sponsors = s.sponsors.filter((x) => x.seasonsLeft > 0);
  // koniec umowy z Labs: suplementy włączone przez sponsora wyłączają się same
  if (hadLabs && !hasLabs(s) && s.flags.labsAutoSupps) {
    s.backroom = { ...(s.backroom ?? {}), supps: false };
    s.flags.labsAutoSupps = 0;
  }
  // media wygasają powoli
  s.media = clamp(s.media - (s.media > 40 ? 3 : 1), 0, 100);
  s.contractSeasonsLeft -= 1;
  s.flags.debt = s.money < -15000 ? 1 : 0;
  if ((s.flags.freakStigma ?? 0) > 0) s.flags.freakStigma -= 1;
}

export function checkEnd(s: GameState): string | null {
  if (s.age >= 40) return 'Czterdziestka na karku. Komisja lekarska nie przedłuża ci licencji.';
  if (s.wear >= 100) return 'Lekarze nie dają ci zgody na kolejne walki. Za dużo przyjętych ciosów.';
  if ((s.flags.lastSeason ?? 0) > 0) return 'Obiecałeś rodzinie, że to ostatni rok. Dotrzymujesz słowa.';
  if (s.age >= 27 && s.finishes.koLosses >= 5 && s.history.slice(-4).filter((h) => h.result === 'L' && h.method === 'KO/TKO').length >= 3)
    return 'Trzy nokauty w czterech walkach. Trener rzuca ręcznik, tym razem za całą karierę.';
  if (s.money < -80000 && s.age >= 24 && s.tier <= 1) return 'Długi cię przygniotły. Wyjeżdżasz do pracy w Holandii i do klatki już nie wracasz.';
  return null;
}

// ---------------------------------------------------------------------------
// Rynek
// ---------------------------------------------------------------------------

function contractFor(rng: Rng, s: GameState, tier: number, kind: Contract['kind'], startRank: number | null): Contract {
  const [lo, hi] = TIER_PURSE[tier];
  const rk = startRank === null ? 0 : startRank === 0 ? 1.2 : 1 - startRank / (RANK_SIZE[tier] + 1);
  const mediaF = 1 + s.media / 120;
  const hard = s.profile.difficulty === 'hard' ? 0.85 : 1;
  const stigma = kind !== 'freak' && (s.flags.freakStigma ?? 0) > 0 ? 0.8 : 1;
  const purse = Math.round(((lo + (hi - lo) * Math.max(0, rk) ** 1.6) * mediaF * hard * stigma) / 500) * 500;
  return {
    id: uid(rng, 'k'),
    tier,
    fed: tier === s.tier && kind === 'stay' ? s.fed : fedFor(rng, tier, s.profile.region),
    kind,
    seasons: tier >= 2 ? rng.int(1, 2) : 1,
    fights: TIER_FIGHTS[tier],
    purse,
    winBonus: tier === 0 ? 0 : Math.round(purse * 0.7),
    entryCost: TIER_ENTRY[tier],
    startRank,
    note: '',
    available: true,
  };
}

/** Czy zawodnik może już przejść na zawodowstwo. */
export const AMATEUR_MAX_AGE = 24;

export function debutCheck(s: GameState): { ok: boolean; reason?: string } {
  const a = s.amRecord;
  const medals = medalCount(s);
  if (s.age < 18) return { ok: false, reason: `skończone 18 lat (masz ${s.age})` };
  // po latach w amatorce gala regionalna weźmie każdego, kto ma za sobą walki
  if (s.age >= AMATEUR_MAX_AGE) return { ok: true };
  if ((a.w >= 5 && medals >= 1) || (a.w >= 4 && ovr(s.stats) >= TIER_LEVEL[1] - 2) || a.w >= 10) return { ok: true };
  if (a.w < 5) return { ok: false, reason: `5 wygranych walk amatorskich (masz ${a.w})` };
  return { ok: false, reason: 'medal z turnieju albo wyraźnie lepsze umiejętności' };
}

export function buildMarket(rng: Rng, s: GameState) {
  const contracts: Contract[] = [];
  const size = RANK_SIZE[s.tier];
  const cut = (s.flags.cut ?? 0) > 0;
  const seasonW = s.lastSummary?.w ?? 0;

  // zostajesz
  const stay = contractFor(rng, s, s.tier, 'stay', s.rank);
  stay.note = s.tier === 0 ? (amLevel(s) === 0 && !(s.flags.amPromote ?? 0) && (s.flags.amLocalSeasons ?? 0) < 2 ? 'Jeszcze rok turniejów amatorskich, najpierw zawody wojewódzkie.' : amLevel(s) === 0 ? 'Awans z zawodów wojewódzkich: w tym roku Amatorski Puchar i Mistrzostwa Polski.' : 'Jeszcze rok turniejów amatorskich: Amatorski Puchar i Mistrzostwa Polski.') : s.rank === 0 ? 'Bronisz pasa. Mistrza się nie wypuszcza.' : 'Kolejny rok w tej samej federacji.';
  if (cut) {
    stay.available = false;
    stay.reason = 'federacja nie przedłuża z tobą kontraktu';
  }
  // amatorka ma koniec: po 24. roku życia czas na zawodowstwo
  if (s.tier === 0 && !s.proDebut && s.age >= AMATEUR_MAX_AGE) {
    stay.available = false;
    stay.reason = `w wieku ${s.age} lat nikt już nie zgłasza cię do turniejów amatorskich`;
  }
  contracts.push(stay);

  // debiut zawodowy
  if (s.tier === 0 && s.proDebut) {
    // zapis sprzed poprawki: zawodowiec w amatorce wraca na gale regionalne
    const c = contractFor(rng, s, 1, 'side', null);
    c.note = 'Jesteś już zawodowcem, więc wracasz na gale regionalne.';
    contracts.push(c);
    stay.available = false;
    stay.reason = 'po debiucie zawodowym nie ma powrotu do amatorki';
  }
  if (s.tier === 0 && !s.proDebut) {
    const d = debutCheck(s);
    const c = contractFor(rng, s, 1, 'promotion', null);
    if (d.ok) {
      c.note = 'Debiut zawodowy na gali regionalnej. Pierwsze pieniądze za walkę, rundy po pięć minut, bez kasku.';
      // dobra amatorka procentuje: mistrz Polski amatorów albo medalista dostaje lepsze warunki
      const amChamp = s.belts.some((b) => b.name === BELT_NAMES[0]);
      const medals = medalCount(s);
      const boost = amChamp ? 1.35 : medals >= 3 ? 1.2 : 1;
      if (boost > 1) {
        c.purse = Math.round((c.purse * boost) / 100) * 100;
        c.winBonus = Math.round(c.purse * 0.7);
        c.note += amChamp ? ' Mistrz Polski amatorów: organizator płaci więcej i od razu stawia cię wyżej w karcie.' : ` ${medals} medali w amatorce robi wrażenie: organizator dokłada do gaży.`;
      }
    } else {
      c.available = false;
      c.reason = d.reason;
      c.note = 'Debiut zawodowy. Organizator już cię kojarzy.';
    }
    contracts.push(c);
  }
  // awans
  const eligible =
    s.tier >= 1 &&
    s.tier < 4 &&
    !cut &&
    (s.rank === 0 ||
      (s.rank !== null && s.rank <= (s.tier >= 2 ? 2 : 3)) ||
      ((currentManager(s)?.promo ?? 0) > 0 && s.rank !== null && s.rank <= (s.tier >= 2 ? 2 : 3) + (currentManager(s)?.promo ?? 0)) ||
      (s.tier === 1 && s.media >= 45 && seasonW >= 2) ||
      // wyższa federacja wypatruje wyraźnie lepszych od stawki
      (ovr(s.stats) >= TIER_LEVEL[s.tier + 1] + 4 && seasonW >= 2));
  if (eligible) {
    const nt = s.tier + 1;
    const n = 2;
    const used = new Set<string>();
    for (let i = 0; i < n; i++) {
      const sr = rng.chance(0.3) && s.rank === 0 ? rng.int(6, RANK_SIZE[nt]) : null;
      const c = contractFor(rng, s, nt, 'promotion', sr);
      if (used.has(c.fed)) continue;
      used.add(c.fed);
      c.note = (s.rank === 0 ? 'Chcą sprawdzić, ile jest wart mistrz z niższej półki.' : 'Krok wyżej: mocniejsi rywale i lepsze pieniądze.') + (FED_NOTES[c.fed] ? ` ${FED_NOTES[c.fed]}` : '');
      if (nt >= 3 && s.rep < 18) {
        c.available = false;
        c.reason = 'lepsza reputacja w środowisku';
      }
      contracts.push(c);
    }
  } else if (s.tier >= 1 && s.tier < 4 && !cut) {
    // wyższa federacja patrzy, ale jeszcze nie bierze
    const c = contractFor(rng, s, s.tier + 1, 'promotion', null);
    c.available = false;
    c.reason = s.rank === null ? 'miejsce w rankingu' : `top ${s.tier >= 2 ? 2 : 3} rankingu (teraz jesteś #${s.rank})`;
    c.note = 'Wyższa federacja cię obserwuje.';
    contracts.push(c);
  }

  // transfer do innej federacji na tym samym poziomie (zagranica)
  if (s.tier >= 3 && !cut && rng.chance(s.rank !== null && s.rank <= 8 ? 0.6 : 0.35)) {
    const others = TIER_FEDS[s.tier].filter((f) => f !== s.fed && !contracts.some((c) => c.fed === f));
    if (others.length) {
      const sr = s.rank === null ? null : clamp(s.rank + rng.int(-2, 3), 1, RANK_SIZE[s.tier]);
      const c = contractFor(rng, s, s.tier, 'side', sr === 0 ? 1 : sr);
      c.fed = rng.pick(others);
      c.purse = Math.round((c.purse * (1 + rng.next() * 0.25)) / 500) * 500;
      c.winBonus = Math.round(c.purse * 0.7);
      c.note = `Transfer: ${sr === null ? 'zaczynasz bez rankingu' : `startujesz z miejsca #${sr}`}. ${FED_NOTES[c.fed] ?? 'Nowa federacja, nowi rywale.'}`;
      contracts.push(c);
    }
  }

  // spadek
  if (cut && s.tier > 1) {
    const c = contractFor(rng, s, s.tier - 1, 'demotion', rng.int(4, RANK_SIZE[s.tier - 1]));
    c.note = 'Krok w tył, żeby się odbudować.';
    contracts.push(c);
  }
  if (cut && s.tier === 1) {
    // po debiucie zawodowym nie ma powrotu do amatorki: inna gala regionalna
    let c = contractFor(rng, s, 1, 'side', null);
    for (let i = 0; i < 5 && c.fed === s.fed; i++) c = contractFor(rng, s, 1, 'side', null);
    if (c.fed === s.fed) c.fed = fedFor(rng, 1, rng.pick(VOIVODESHIPS.filter((v) => v !== s.profile.region)));
    c.note = 'Tamta gala cię nie chce, ta da ci jeszcze szansę.';
    contracts.push(c);
  }

  // freak
  if (s.tier >= 1 && (s.media >= 28 || rng.chance(0.1)) && rng.chance(s.freakFights > 0 ? 0.35 : 0.45)) {
    // im więcej freak fightów, tym mniej płacą (widownia się nudzi)
    const fatigue = Math.pow(0.75, s.flags.freakSeasons ?? 0);
    const purse = Math.round(((20000 + s.media * s.media * 28 + rng.int(0, 20000)) * fatigue) / 1000) * 1000;
    contracts.push({
      id: uid(rng, 'k'),
      tier: s.tier,
      fed: rng.pick(FREAK_FEDS),
      kind: 'freak',
      seasons: 1,
      fights: 2,
      purse,
      winBonus: Math.round(purse * 0.3),
      entryCost: 0,
      startRank: null,
      note:
        (s.flags.freakSeasons ?? 0) > 0
          ? 'Znowu cyrk. Widownia już cię zna, więc płacą mniej niż ostatnio.'
          : 'Raperzy, youtuberzy i celebryci. Kasa duża, ale sportowo to rok w plecy.',
      available: true,
    });
  }
  void size;

  // kluby
  // kluby: twój + po jednym–dwóch z każdego poziomu (losowo, żeby rynek się zmieniał)
  const clubs: Club[] = [{ ...s.club }];
  const pool = CLUB_TEMPLATES.map((t, i) => ({ t, i })).filter(({ t, i }) => `c${i}` !== s.club.id && t.minTier <= s.tier + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const perQuality: Record<number, number> = {};
  for (const { t, i } of pool) {
    if (clubs.length >= 7) break;
    const n = perQuality[t.quality] ?? 0;
    if (n >= (t.quality <= 2 ? 1 : 2)) continue;
    perQuality[t.quality] = n + 1;
    clubs.push(makeClub(rng, i, s.profile.hometown));
  }
  clubs.sort((a, b) => (a.id === s.club.id ? -1 : b.id === s.club.id ? 1 : a.quality - b.quality || a.cost - b.cost));
  // domyślnie awans tylko, gdy poziom na to pozwala i nie łamie obietnicy
  const promiseBlocks = s.promises.some((p) => p.kind === 'noPromotion' && p.untilSeason >= s.season - 1);
  const promo = contracts.findIndex(
    (c) => c.available && c.kind === 'promotion' && (ovr(s.stats) >= TIER_LEVEL[c.tier] - 3 || (s.tier === 0 && s.age >= 20)) && !promiseBlocks,
  );
  s.market = { contracts, clubs, pickedContract: promo >= 0 ? promo : contracts.findIndex((c) => c.available), pickedClub: 0 };
}

export function clubAvailability(s: GameState, c: Club): { ok: boolean; reason?: string } {
  if (c.id === s.club.id) return { ok: true };
  const t = CLUB_TEMPLATES[Number(c.id.slice(1))];
  if (t && t.minTier > s.tier && !(t.minTier === s.tier + 1 && s.rank !== null && s.rank <= 3)) return { ok: false, reason: 'jeszcze cię nie przyjmą, za niski poziom' };
  if (c.cost > Math.max(0, s.money) + s.sponsors.reduce((a, b) => a + b.perSeason, 0) + 2000) return { ok: false, reason: 'nie stać cię na składki' };
  return { ok: true };
}

export function toMarket(s0: GameState): GameState {
  const s = clone(s0);
  withRng(s, (rng) => {
    const reason = checkEnd(s);
    if (reason) {
      endCareer(s, reason);
      return;
    }
    ageOneYear(rng, s);
    const reason2 = checkEnd(s);
    if (reason2) {
      endCareer(s, reason2);
      return;
    }
    buildMarket(rng, s);
    s.phase = 'market';
  });
  return s;
}

export function pickContract(s0: GameState, idx: number): GameState {
  const s = clone(s0);
  if (s.market && s.market.contracts[idx]?.available) s.market.pickedContract = idx;
  return s;
}

export function pickClub(s0: GameState, idx: number): GameState {
  const s = clone(s0);
  if (s.market && clubAvailability(s, s.market.clubs[idx]).ok) s.market.pickedClub = idx;
  return s;
}

export function marketWarnings(s: GameState): string[] {
  const out: string[] = [];
  if (!s.market) return out;
  const c = s.market.contracts[s.market.pickedContract];
  const club = s.market.clubs[s.market.pickedClub];
  for (const p of s.promises) {
    if (p.untilSeason < s.season - 1) continue;
    if (p.kind === 'noPromotion' && c?.kind === 'promotion') out.push(`Łamiesz słowo. ${p.text}`);
    if (p.kind === 'stayClub' && club && club.id !== s.club.id) out.push(`Łamiesz słowo. ${p.text}`);
  }
  if (club && club.id !== s.club.id && club.cost > 0) {
    // szacunek: kasa teraz + gaże i sponsorzy − składki i życie w nowym roku
    const living = livingCost(s.age + 1);
    const purses = c ? (c.purse + c.winBonus * 0.5) * c.fights * (1 - (currentManager(s)?.cut ?? 0)) : 0;
    const left = s.money + s.sponsors.reduce((a, b) => a + b.perSeason, 0) + purses - club.cost - living - (c?.entryCost ?? 0) - s.loans.reduce((a, l) => a + l.installment, 0);
    if (left < 0)
      out.push(`Uwaga na budżet: ze składkami ${club.cost.toLocaleString('pl-PL')} zł i kosztami życia na koniec roku zabraknie ci ok. ${Math.round(-left / 1000).toLocaleString('pl-PL')} tys. zł. Grozi kredyt albo rok przerwy.`);
  }
  if (c?.kind === 'freak')
    out.push(
      `Freak fight: duże pieniądze i zasięgi, ale ${s.tier > 0 && s.rank !== null ? 'wypadasz z rankingu federacji, ' : ''}zamiast obozu masz konferencje (umiejętności spadną), a przez dwa lata federacje zapłacą ci mniej.`,
    );
  return out;
}

export function confirmMarket(s0: GameState): GameState {
  const s = clone(s0);
  const m = s.market;
  if (!m) return s;
  const c = m.contracts[m.pickedContract];
  const club = m.clubs[m.pickedClub];
  if (!c) return s;
  // obietnice
  for (const w of marketWarnings(s)) {
    if (w.startsWith('Łamiesz')) {
      s.brokenPromises++;
      s.rep = clamp(s.rep - 6, 0, 100);
      s.relations -= 2;
      log(s, `Złamane słowo. ${w.replace('Łamiesz słowo. ', '')}`);
    }
  }
  s.promises = s.promises.filter((p) => p.untilSeason >= s.season);
  // klub
  if (club && club.id !== s.club.id) {
    s.club = club;
    s.clubSeasons = 0;
    log(s, `Zmiana klubu: ${club.name} (${club.city}).`);
  }
  // kontrakt
  const prevTier = s.tier;
  if (c.kind !== 'freak') {
    if (c.tier !== s.tier) {
      s.tier = c.tier;
      s.rank = c.startRank;
      s.titleDefenses = 0;
      if (prevTier === 0) log(s, `Przechodzisz na zawodowstwo: ${c.fed}.`);
      else if (c.tier > prevTier) log(s, `Awans: ${c.fed}.`);
      else log(s, `Krok w tył: ${c.fed}.`);
    } else if (c.fed !== s.fed && c.kind === 'side') {
      s.rank = c.startRank;
      s.titleDefenses = 0;
      log(s, `Transfer: ${c.fed}.`);
    }
    s.fed = c.fed;
  }
  if (c.kind === 'freak' && !s.flags.freakLogged) {
    s.flags.freakLogged = 1;
  }
  if (c.kind === 'freak') {
    s.flags.freakSeasons = (s.flags.freakSeasons ?? 0) + 1;
    s.flags.freakStigma = 2;
    if (s.tier > 0 && s.rank !== null) {
      s.rank = null;
      log(s, `${s.fed} skreśla cię z rankingu po przejściu do freak fightów.`);
    }
  }
  s.contract = c;
  s.contractSeasonsLeft = c.seasons;
  if (s.tier > s.peakTier) {
    s.peakTier = s.tier;
    s.peakRank = s.rank;
  }
  s.flags.cut = 0;
  s.market = null;
  s.run = null;
  s.phase = 'training';
  return s;
}

// ---------------------------------------------------------------------------
// Koniec kariery
// ---------------------------------------------------------------------------

export function retire(s0: GameState): GameState {
  const s = clone(s0);
  endCareer(s, 'Sam decydujesz, że to koniec. Schodzisz z klatki na własnych warunkach.');
  return s;
}

const TIER_WIN_PTS = [3, 8, 20, 45, 90];
const BELT_PTS = [40, 120, 320, 700, 1600];

export function legacyScore(s: GameState): number {
  let pts = 0;
  for (const h of s.history) {
    if (h.result === 'W') {
      let p = h.freak ? 10 : h.amateur ? 2 : TIER_WIN_PTS[h.tier];
      if (h.method === 'KO/TKO' || h.method === 'Poddanie') p *= 1.3;
      if (h.title) p *= 1.5;
      pts += p;
    } else if (h.result === 'D') pts += TIER_WIN_PTS[h.tier] * 0.3;
    // porażki pod koniec kariery psują wizerunek: lepiej zejść ze sceny w porę
    else if (h.result === 'L' && h.age >= 34 && !h.amateur) pts -= TIER_WIN_PTS[h.tier] * 0.6;
  }
  // kolejne pasy tego samego szczebla są warte mniej (zwłaszcza w amatorce)
  const beltCount: Record<number, number> = {};
  for (const b of s.belts) {
    const t = Math.max(0, BELT_NAMES.findIndex((n) => b.name.startsWith(n)));
    const k = beltCount[t] ?? 0;
    beltCount[t] = k + 1;
    pts += BELT_PTS[t] * (k === 0 ? 1 : t === 0 ? 0.2 : t <= 2 ? 0.35 : 0.6);
  }
  pts += s.medals.gold * 12 + s.medals.silver * 6 + s.medals.bronze * 4;
  // wyjście poza Polskę jest warte więcej niż kolejne pasy w kraju
  pts += [0, 40, 120, 300, 550][s.peakTier] ?? 0;
  pts += Math.min(400, s.totalEarned / 25000);
  pts += s.media * 2;
  pts -= s.brokenPromises * 20;
  // akademia zostaje po karierze: wychowankowie, nazwisko na drzwiach
  pts += [0, 60, 160, 320, 550][s.academy ?? 0];
  // wygrane z odwiecznym rywalem pamięta się dłużej
  const rv = s.peers.find((p) => p.id === s.rivalId);
  if (rv) pts += rv.h2h.w * 15 - rv.h2h.l * 5;
  const sp = START_PROFILES[s.profile.start].mult ?? 0;
  const diff = DIFFICULTY[s.profile.difficulty].mult;
  return Math.max(0, Math.round(pts * sp * diff));
}

export function rawLegacy(s: GameState): number {
  const sp = START_PROFILES[s.profile.start].mult;
  if (!sp) return 0;
  return legacyScore(s);
}

function verdictFor(s: GameState): { verdict: string; desc: string } {
  const worldBelts = s.belts.filter((b) => b.name.startsWith(BELT_NAMES[4])).length;
  const euBelts = s.belts.filter((b) => b.name.startsWith(BELT_NAMES[3])).length;
  const plBelts = s.belts.filter((b) => b.name.startsWith(BELT_NAMES[2])).length;
  const w = s.record.w;
  const l = s.record.l;
  if (worldBelts >= 1 && s.titleDefenses >= 2) return { verdict: 'Legenda światowego MMA', desc: 'Pas światowej federacji i kolejne obrony. O takich karierach kręci się dokumenty.' };
  if (worldBelts >= 1) return { verdict: 'Mistrz świata', desc: 'Byłeś na samym szczycie. Pasa UFL nikt ci już nie zabierze.' };
  if (s.peakTier === 4 && s.peakRank !== null && s.peakRank <= 5) return { verdict: 'Pukał do bram', desc: 'Top 5 na świecie. Zabrakło jednej, może dwóch wygranych.' };
  if (euBelts >= 1) return { verdict: 'Król Europy', desc: 'Pas mistrza Europy. W Polsce poznają cię na każdej stacji benzynowej.' };
  if (s.freakFights >= 4 && s.freakFights > w / 3) return { verdict: 'Król freak fightów', desc: 'Sportowo różnie, ale konto i zasięgi się zgadzają.' };
  if (plBelts >= 2) return { verdict: 'Ikona polskiej klatki', desc: 'Kilka razy mistrz Polski. W twoim mieście ktoś namalował mural.' };
  if (plBelts === 1) return { verdict: 'Mistrz Polski', desc: 'Pas krajowej federacji. Z takiej kariery można być dumnym.' };
  if (s.peakTier >= 3) return { verdict: 'Europejski wyjadacz', desc: 'Biłeś się z najlepszymi w Europie. Niewielu może to o sobie powiedzieć.' };
  if (s.peakTier >= 2 && w > l) return { verdict: 'Solidny zawodnik', desc: 'Pewny punkt krajowych gal. Kibice pamiętają twoje walki.' };
  if (s.peakTier >= 2) return { verdict: 'Wieczny talent', desc: 'Papiery były, ale na najwyższym poziomie czegoś zabrakło.' };
  if (s.peakTier === 1) return { verdict: 'Bohater regionalnych gal', desc: 'Pełne hale OSiR i autografy dla dzieciaków z osiedla.' };
  if (s.belts.length) return { verdict: 'Mistrz Polski amatorów', desc: 'Złoto mistrzostw zostało w gablocie. Na zawodowstwo już nie starczyło.' };
  return { verdict: 'Amator z pasją', desc: 'Nie każdy zostaje zawodowcem. Ale kto spróbował, ten wie, jak to smakuje.' };
}

export function careerStory(s: GameState): string {
  const parts: string[] = [];
  const first = s.history[0];
  const belts = s.belts.length;
  const fights = s.history.length;
  parts.push(`${s.seasons.length} ${pl(s.seasons.length, 'rok', 'lata', 'lat')}, ${fights} ${pl(fights, 'walka', 'walki', 'walk')}.`);
  if (s.amRecord.w + s.amRecord.l + s.amRecord.d > 0) {
    const m = medalCount(s);
    parts.push(`W amatorce ${recStr(s.amRecord)}${m ? ` i ${m} ${pl(m, 'medal', 'medale', 'medali')}` : ''}.`);
  }
  if (s.proDebut) parts.push(`Zawodowo ${recStr(s.record)}, debiut w wieku ${s.proDebut.age} lat.`);
  if (belts) parts.push(`${belts} ${pl(belts, 'tytuł', 'tytuły', 'tytułów')} w gablocie.`);
  if (s.finishes.ko + s.finishes.sub > s.record.w * 0.6 && s.record.w > 5) parts.push('Kończyłeś walki przed czasem jak mało kto.');
  const bestPeer = s.peers.find((p) => p.id === s.rivalId) ?? s.peers.filter((p) => p.metCount > 0).sort((a, b) => b.metCount - a.metCount)[0];
  if (bestPeer) parts.push(`Odwieczny rywal: ${bestPeer.firstName} ${bestPeer.lastName}, bilans ${bestPeer.h2h.w}-${bestPeer.h2h.l}.`);
  const mgr = currentManager(s);
  if (mgr) parts.push(`Menedżer: ${mgr.name}.`);
  if (s.freakFights) parts.push(`Freak fightów: ${s.freakFights}.`);
  if (s.academy) parts.push(`Po karierze zostaje ${academyName(s)}: ${ACADEMY_LEVELS[s.academy - 1].name}.`);
  if (!first) parts.push('Kariera skończyła się, zanim na dobre się zaczęła.');
  return parts.join(' ');
}

function endCareer(s: GameState, reason: string) {
  const v = verdictFor(s);
  s.ending = { reason, verdict: v.verdict, verdictDesc: v.desc, legacy: legacyScore(s), story: careerStory(s) };
  log(s, `Koniec kariery w wieku ${s.age} lat.`);
  s.phase = 'ended';
}

// ---------------------------------------------------------------------------
// Statystyki pomocnicze dla UI
// ---------------------------------------------------------------------------

export function tierLabel(t: number) {
  return TIER_NAMES[t];
}

export function testPreview(stat: StatKey, s: GameState) {
  const p = chanceFrom(s.stats[stat], TIER_LEVEL[s.tier] + 6);
  return { p, dist: distFrom(p) };
}

export function momentTone(m: Moment): Moment['tone'] {
  return m.tone;
}

// ---------------------------------------------------------------------------
// Tabela rankingu (fikcyjni zawodnicy, stabilni w obrębie roku i szczebla)
// ---------------------------------------------------------------------------

export interface RankRow {
  rank: number; // 0 = mistrz
  name: string;
  record: string;
  flag: string;
  me?: boolean;
  peer?: boolean;
}

export function rankingTable(s: GameState): RankRow[] {
  const tier = s.tier;
  if (tier === 0) return [];
  const size = RANK_SIZE[tier];
  const rng = createRng((s.createdAt ^ (s.season * 7919) ^ (tier * 104729)) >>> 0);
  const rows: RankRow[] = [];
  for (let r = 0; r <= size; r++) {
    const o = generateOpponent(rng, tier, r, false);
    rows.push({ rank: r, name: `${o.firstName} ${o.lastName}`, record: recStr(o.record), flag: o.flag });
  }
  for (const p of s.peers) {
    if (p.retired || p.tier !== tier || p.rank === null || p.rank > size) continue;
    rows[p.rank] = { rank: p.rank, name: `${p.firstName} ${p.lastName}`, record: recStr(p.record), flag: '🇵🇱', peer: true };
  }
  if (s.rank !== null && s.rank <= size) {
    rows[s.rank] = { rank: s.rank, name: `${s.profile.firstName} ${s.profile.lastName}`, record: recStr(s.record), flag: '🇵🇱', me: true };
  }
  return rows;
}
