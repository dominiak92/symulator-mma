import { activeManager, currentManager, managerBlocked, managerById } from './managers';
import { createRng, type Rng } from './rng';
import type {
  SponsorOffer,
  Style,
  FightOffer,
  WeightKey,
  Club,
  Contract,
  Effects,
  EventChoice,
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
  JobMode,
  PostFight,
  SocialMode,
  TicketPlan,
  CoachId,
  RosterFighter,
} from './types';
import {
  AMATEUR_TOURNEYS,
  AMATEUR_TOURNEYS_LOCAL,
  REGION_CITY,
  BAD_FORMS,
  GOOD_FORMS,
  STAGE_LABELS,
  STYLE_LABELS,
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
  fedPay,
  winRatio,
  VOIVODESHIPS,
  livingCost,
  EXCLUSIVE_BONUS,
  isExclusiveFed,
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
import { buildInvite, resolveInvite, sideChance } from './side';
import { activePerks, MAX_PERKS, PERKS, perkUnlocked, type Perk } from './perks';
import { COACHES, coachCost, coachGrowth, coachOf, coachOpen } from './coaches';
import { archiveRoster, ensureRoster, rosterAfterFight, rosterFighter, rosterFor, rosterNews, rosterOpp, rosterSync, rosterYear } from './roster';
import { addFans, fanGain, fmtFans, followersOf, jobDef, jobForm, socialCost, socialForm, socialIncome, ticketRep, ticketSale, ticketsAvailable } from './extras';

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
  // skład obecnej kategorii czeka na twój powrót
  archiveRoster(s);
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
  quick?: boolean;
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
  if (p.start === 'wybraniec') for (const k of STAT_KEYS) potential[k] = clamp(potential[k] + 3, 35, 99);
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
    quick: opts.quick || undefined,
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
  g *= coachGrowth(s, k);
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
  g *= coachGrowth(s, k);
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
      g *= coachGrowth(s, key);
      if (key === k) {
        let focus = room * 0.13 + 2.2 + rng.next() * 0.8 - 0.4;
        if (key === s.club.specialty) focus *= 1.15;
        focus *= coachGrowth(s, key);
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
    makeSponsorOffers(rng, s);
  });
  s.phase = 'budget';
  if (s.quick && !quickNeedsBudget(s)) return startSeason(s);
  if (s.quick) s.flags.quickBudgetTier = s.tier;
  return s;
}

/** Menedżer (albo kolega) podsuwa dziwnego sponsora: kasa jest, gorzej z wizerunkiem. */
function offerShadyDeal(rng: Rng, s: GameState) {
  s.shadyDeal = null;
  if (s.tier < 1 || s.contract.kind === 'freak') return;
  if (s.sponsors.some((x) => SHADY_SPONSORS.some((d) => d.name === x.name))) return;
  if (s.sponsors.length >= sponsorCap(s)) return;
  // dziwny sponsor dzwoni tylko wtedy, gdy kasy brakuje: z pełnym kontem nikt by się nie zgodził
  const tight = budgetBalance(s) + s.money < 5000 + s.tier * 8000;
  const mgr = currentManager(s);
  if (!tight || !rng.chance(0.65)) return;
  const d = rng.pick(SHADY_SPONSORS);
  const base = [0, 2800, 9000, 21000, 48000][s.tier];
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

// ---------------------------------------------------------------------------
// Oferty od marek: co roku 0–3 propozycje różnego typu, bierzesz najwyżej jedną
// ---------------------------------------------------------------------------

const OFFER_KINDS: { kind: SponsorOffer['kind']; title: string; pay: number; seasons: [number, number]; clause: string[]; media?: number; rep?: number; form?: number }[] = [
  { kind: 'image', title: 'Kontrakt wizerunkowy', pay: 1, seasons: [1, 2], clause: ['twoja twarz w kampanii', 'logo na spodenkach i na ważeniu', 'billboardy w twoim mieście'], media: 2 },
  { kind: 'events', title: 'Eventy i sesje zdjęciowe', pay: 1.35, seasons: [1, 1], clause: ['sześć eventów firmowych w roku', 'sesje zdjęciowe w trakcie obozu', 'objazd po salonach firmy'], media: 3, form: -1 },
  { kind: 'ambassador', title: 'Ambasador na lata', pay: 0.8, seasons: [3, 3], clause: ['ambasador marki przez trzy lata', 'twoja linia produktów', 'kod rabatowy z twoim nazwiskiem'] },
  { kind: 'charity', title: 'Kampania społeczna', pay: 0.4, seasons: [1, 2], clause: ['treningi dla dzieciaków z domu dziecka', 'twarz kampanii „Nie hejtuj”', 'zbiórka na szpital dziecięcy'], rep: 3, media: 1 },
];

function makeSponsorOffers(rng: Rng, s: GameState) {
  s.sponsorOffers = null;
  if (s.tier < 1 || s.contract.kind === 'freak') return;
  const room = sponsorCap(s) - s.sponsors.length;
  if (room <= 0) return;
  // im więcej mediów i wyżej w karierze, tym więcej telefonów od marek
  const n = Math.min(3, rng.chance(clamp(0.25 + s.media / 120 + s.tier * 0.08, 0, 0.95)) ? 1 + (rng.chance(s.media / 110) ? 1 : 0) + (s.tier >= 3 && rng.chance(0.4) ? 1 : 0) : 0);
  if (!n) return;
  const kinds = [...OFFER_KINDS].sort(() => rng.next() - 0.5).slice(0, n);
  const list: SponsorOffer[] = kinds.map((k) => {
    const pool = sponsorPoolCapped(s, sponsorPool(rng, s));
    const name = pickSponsorName(rng, s, pool);
    const seasons = rng.int(k.seasons[0], k.seasons[1]);
    const per = Math.max(500, Math.round((poolPay(s, pool) * k.pay * (0.85 + rng.next() * 0.3)) / 500) * 500);
    return { id: uid(rng, 'o'), name, pool, kind: k.kind, title: k.title, perSeason: per, seasons, clause: rng.pick(k.clause), media: k.media, rep: k.rep, form: k.form };
  });
  // jedna marka nie składa dwóch ofert
  s.sponsorOffers = { season: s.season, list: list.filter((o, i) => list.findIndex((x) => x.name === o.name) === i) };
}

export function acceptSponsorOffer(s0: GameState, id: string): GameState {
  const so = s0.sponsorOffers;
  if (!so || so.season !== s0.season || so.picked || s0.sponsors.length >= sponsorCap(s0)) return s0;
  const o = so.list.find((x) => x.id === id);
  if (!o) return s0;
  const s = clone(s0);
  s.sponsorOffers!.picked = id;
  s.sponsors.push({ id: `of-${o.id}`, name: o.name, perSeason: o.perSeason, seasonsLeft: o.seasons, clause: o.clause });
  if (o.media) s.media = clamp(s.media + o.media, 0, 100);
  if (o.rep) s.rep = clamp(s.rep + o.rep, 0, 100);
  if (o.form) s.flags.formBonus = (s.flags.formBonus ?? 0) + o.form;
  log(s, `Nowy sponsor: ${o.name} (${o.title.toLowerCase()}).`);
  return s;
}
export function sponsorPoolOf(name: string): 'local' | 'national' | 'global' {
  return SPONSOR_GLOBAL.includes(name) ? 'global' : SPONSOR_NATIONAL.includes(name) ? 'national' : 'local';
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
  const cc = coachOpen(s) ? coachCost(s) : 0;
  if (cc > 0) lines.push({ label: 'Trener główny', sub: `${coachOf(s).name} · ${coachOf(s).role}`, amount: -cc, icon: 'users' });
  // zaplecze do wyboru
  if (backroomOpen(s)) {
    for (const b of BACKROOM) {
      if (!s.backroom?.[b.id] || !backroomAvailable(s, b.id)) continue;
      const c = backroomCost(s, b.id);
      lines.push({ label: b.name, sub: c === 0 ? 'pokrywa Ground Game Labs' : b.short, amount: -c, icon: b.icon });
    }
  }
  // etat obok treningów: do krajowej federacji wybierasz, ile pracujesz
  const jd = jobDef(s);
  const living = Math.round((livingCost(s.age) * (jd ? jd.living : 1)) / 500) * 500 + (s.flags.kid ? 10000 : 0);
  if (living > 0)
    lines.push({
      label: 'Życie',
      sub: jd?.id === 'full' ? 'etat pokrywa większość, trenujesz po pracy' : jd?.id === 'half' ? 'pół etatu pokrywa połowę kosztów' : s.flags.kid ? 'mieszkanie, jedzenie, dziecko' : 'mieszkanie i jedzenie',
      amount: -living,
      icon: 'home',
    });
  // social media: koszt managera i przychód ze współprac
  const smm = socialCost(s);
  if (smm > 0) lines.push({ label: 'Social media manager', sub: 'montaż filmów i współprace', amount: -smm, icon: 'phone' });
  const si = socialIncome(s);
  if (si > 0) lines.push({ label: 'Współprace w social mediach', sub: `${fmtFans(followersOf(s))} obserwujących`, amount: si, icon: 'phone' });
  for (const l of s.loans) lines.push({ label: 'Rata kredytu', sub: `${l.left === 1 ? 'ostatnia rata' : `zostało ${l.left} ${pl(l.left, 'rata', 'raty', 'rat')}`}`, amount: -l.installment, icon: 'card' });
  for (const sp of s.sponsors)
    lines.push({ label: sp.name, sub: `${sp.clause} · ${sp.seasonsLeft === 1 ? 'ostatni rok' : `jeszcze ${sp.seasonsLeft} ${pl(sp.seasonsLeft, 'rok', 'lata', 'lat')}`}`, amount: sp.perSeason, logo: { kind: 'sponsor', name: sp.name } });
  if (s.academy) lines.push({ label: academyName(s), sub: `twoja akademia · ${ACADEMY_LEVELS[s.academy - 1].name}`, amount: academyIncome(s), icon: 'home' });
  if (s.age < 19 && s.relations >= 3) lines.push({ label: 'Rodzice dokładają', sub: 'z trzynastki', amount: 2000 + s.relations * 300, icon: 'heart' });
  return lines;
}

// Własna akademia: inwestycja na późną karierę (przychód co roku i punkty dorobku)
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
// Zaplecze: fizjoterapeuta, lekarz, suplementy (opcjonalne, od debiutu zawodowego)
// ---------------------------------------------------------------------------
export type BackroomId = 'physio' | 'doctor' | 'supps' | 'sparring' | 'clinic';
export const BACKROOM: { id: BackroomId; name: string; short: string; effect: string; icon: string; cost: number[]; minTier?: number }[] = [
  { id: 'physio', name: 'Fizjoterapeuta', short: 'masaże, rozluźnianie, taping', effect: 'Organizm wolniej się zużywa, kariera trwa dłużej.', icon: 'heart', cost: [0, 1500, 3000, 7000, 20000] },
  { id: 'doctor', name: 'Lekarz sportowy', short: 'badania i opieka przed walką', effect: 'Rzadsze kontuzje, a jeśli już, to lżejsze.', icon: 'bandage', cost: [0, 2000, 4000, 9000, 18000] },
  { id: 'supps', name: 'Suplementacja', short: 'odżywki, witaminy, elektrolity', effect: 'Lekko lepsza forma w każdej walce.', icon: 'flame', cost: [0, 1500, 3000, 5000, 8000] },
  { id: 'sparring', name: 'Elitarni sparingpartnerzy', short: 'sparingpartnerzy z czołówki, ściągani na obóz', effect: 'Wyraźnie lepsza forma w każdej walce. Drogo, ale na tym poziomie liczy się każdy procent.', icon: 'glove', cost: [0, 0, 0, 25000, 45000], minTier: 3 },
  { id: 'clinic', name: 'Klinika regeneracyjna', short: 'kriokomora, osocze, prywatny ortopeda', effect: 'Co roku organizm regeneruje się wyraźnie bardziej (zużycie −4), kariera trwa dłużej. Dla tych, których stać.', icon: 'heart', cost: [0, 0, 0, 30000, 60000], minTier: 3 },
];
export function backroomAvailable(s: GameState, id: BackroomId) {
  return s.tier >= (BACKROOM.find((b) => b.id === id)!.minTier ?? 1);
}
export const LABS_SPONSOR = 'Ground Game Labs';
export function hasLabs(s: GameState) {
  return s.sponsors.some((x) => x.name === LABS_SPONSOR);
}
/** Zaplecze jest dostępne przez całe zawodowstwo (także w roku freak fightów). */
export function backroomOpen(s: GameState) {
  return s.tier >= 1;
}
export function backroomCost(s: GameState, id: BackroomId): number {
  if (id === 'supps' && hasLabs(s)) return 0;
  return BACKROOM.find((b) => b.id === id)!.cost[s.tier] ?? 0;
}
/** Aktywne zaplecze (tylko gdy w ogóle dostępne). */
function hasBackroom(s: GameState, id: BackroomId) {
  return backroomOpen(s) && backroomAvailable(s, id) && !!s.backroom?.[id];
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

/** Pomoc rodziny przy braku kasy: syn biznesmena dzwoni do taty, reszta prosi rodziców o drobne. */
export function familyHelpOffer(s: GameState): { amount: number; who: string; text: string; cost: string } | null {
  const short = -(s.money + budgetBalance(s));
  if (short <= 0) return null;
  const used = s.flags.familyHelp ?? 0;
  if ((s.flags.familyHelpSeason ?? -9) === s.season) return null;
  if (s.profile.start === 'biznes') {
    if (used >= 3) return null;
    const amount = Math.ceil((short + 5000) / 1000) * 1000;
    const cap = [20000, 40000, 120000, 250000, 400000][s.tier] ?? 40000;
    if (amount > cap) return null;
    const text = used === 0
      ? `Tata przeleje ${amount.toLocaleString('pl-PL')} zł. Powie tylko, że „w hurtowni też by się przydał ktoś z charakterem”.`
      : used === 1
        ? `Tata przeleje ${amount.toLocaleString('pl-PL')} zł, ale przy obiedzie wszyscy usłyszą, ile cię kosztuje to „bicie się po klatkach”.`
        : `Ostatni raz. Tata przeleje ${amount.toLocaleString('pl-PL')} zł i jasno mówi, że następnej pomocy nie będzie.`;
    return { amount, who: 'Dzwonisz do taty', text, cost: used === 0 ? 'rodzina −1' : 'rodzina −2, reputacja −2 (syn tatusia)' };
  }
  // pozostali: rodzice pomogą raz, drobną kwotą, jeśli relacje są dobre
  if (used >= 1 || s.relations < 3 || short > 8000) return null;
  const amount = Math.ceil((short + 1000) / 500) * 500;
  return { amount, who: 'Prosisz rodziców o pomoc', text: `Mama wyjmuje kopertę z szafy: ${amount.toLocaleString('pl-PL')} zł. Ojciec udaje, że nic nie widzi.`, cost: 'rodzina −1, tylko raz w karierze' };
}
export function takeFamilyHelp(s0: GameState): GameState {
  const o = familyHelpOffer(s0);
  if (!o) return s0;
  const s = clone(s0);
  const used = s.flags.familyHelp ?? 0;
  s.money += o.amount;
  s.flags.familyHelp = used + 1;
  s.flags.familyHelpSeason = s.season;
  s.relations -= s.profile.start === 'biznes' && used >= 1 ? 2 : 1;
  if (s.profile.start === 'biznes' && used >= 1) s.rep = clamp(s.rep - 2, 0, 100);
  log(s, `${o.who}: ${o.amount.toLocaleString('pl-PL')} zł.`);
  return s;
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
    if (s.tier > 0 && s.rank === 0 && s.contract.kind !== 'freak') {
      s.titleDefenses = 0;
      s.flags.stripped = (s.flags.stripped ?? 0) + 1;
      log(s, 'Federacja odbiera pas: rok przerwy mistrza to za dużo.');
    }
    if (s.tier > 0) s.rank = null;
    s.flags.interim = 0;
    rosterSync(s);
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
    const wasChamp = s.tier > 0 && s.rank === 0 && s.contract.kind !== 'freak';
    if (s.tier > 0) s.rank = wasChamp ? 2 : null;
    s.flags.interim = 0;
    rosterSync(s);
    if (wasChamp) {
      s.titleDefenses = 0;
      s.flags.stripped = (s.flags.stripped ?? 0) + 1;
      log(s, 'Federacja odbiera pas: mistrz nie może pauzować przez cały rok.');
    }
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
      story: `${name.charAt(0).toUpperCase() + name.slice(1)}. ${nfz ? 'Na prywatną klinikę cię nie stać, więc kolejka na NFZ i ćwiczenia z filmików. ' : ''}${story}${wasChamp ? ' Federacja nie może czekać rok: odbiera ci pas i robi walkę o wakat. Wracasz jako numer 2 w rankingu, z prawem do walki o tytuł.' : wasRanked ? ' Wypadasz z rankingu.' : ''}`,
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
    gains: { wrest: [12, 16], cardio: [9, 12], chin: [5, 7], bjj: [5, 8], iq: [3, 5], stand: [1, 3] },
    ceiling: { wrest: 12, cardio: 10, chin: 6, bjj: 6, iq: 2 },
    media: -8,
    rep: 4,
    wear: -10,
    desc: 'Dwa lata w górach (trzeci to powrót do formy). Zapasy pięć razy dziennie, bez internetu i bez cukru.',
    minus: 'Kibice o tobie zapominają, a w rankingu spadasz o kilka miejsc. Za to w pierwszym roku po powrocie jesteś w życiowej formie.',
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
    cost: [0, 35000, 75000, 170000, 360000],
    gains: { stand: [8, 11], wrest: [8, 11], bjj: [8, 11], cardio: [5, 7], iq: [5, 7], chin: [2, 4] },
    ceiling: { stand: 8, wrest: 8, bjj: 8, iq: 4, cardio: 3 },
    media: -4,
    rep: 3,
    wear: -6,
    desc: 'Dwa lata w największej amerykańskiej stajni. Sparingi z mistrzami i trenerzy od wszystkiego.',
    minus: 'Najdroższy wyjazd. W rankingu spadasz o kilka miejsc, ale wracasz w życiowej formie i z filmikami z sali.',
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
    gains: { cardio: [6, 9], stand: [3, 6], chin: [2, 4], iq: [2, 4], wrest: [2, 3], bjj: [1, 3] },
    ceiling: { cardio: 6, chin: 3, stand: 3 },
    media: -2,
    rep: 2,
    wear: -10,
    desc: 'Jeden rok na północy: biegi po śniegu, sauna, przerębel i sparingi z Norwegami, którzy nigdy się nie męczą.',
    minus: 'Rok bez walk i bez gaż, w rankingu spadasz o kilka miejsc.',
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
    // ranking nie przepada całkiem: spadasz o kilka miejsc, organizatorzy pamiętają nazwisko
    if (s.tier > 0 && s.rank !== null) s.rank = s.rank === 0 ? 2 : Math.min(RANK_SIZE[s.tier], s.rank + 3 + e.years);
    s.contractSeasonsLeft = 0;
    s.flags.expBoost = 1;
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
  rosterSync(s);
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

// Sponsorzy poza osiedlem: krajowe marki (od federacji krajowej) i światowe (Europa, świat). Wszystkie fikcyjne.
const SPONSOR_NATIONAL = ['Telekom Vistula', 'Bank Orli', 'Energetyk Grom', 'FitFabryka siłownie', 'Budmax Hurtownie', 'Mleczarnia Krówka Mazurska', 'Kurier Strzała', 'Meble Kowal', 'Napój Turbo Dąb', 'Ubezpieczenia Tarcza', 'Market Bociek', 'Wody Kryniczanka Zdrój'];
const SPONSOR_GLOBAL = ['Volt Rush Energy', 'Kaiju Fightwear', 'Nomad Chrono', 'Apex Fuel Nutrition', 'Stratos Airways', 'Ironclad Trucks', 'Raptor Audio', 'Monarch Motors', 'Helix Smartwatch', 'Titan Grip'];
type SponsorPool = 'local' | 'national' | 'global';
/** Roczna stawka bazowa (zanim dojdą media): pizzeria nie zapłaci jak światowa marka. */
const POOL_BASE: Record<SponsorPool, number[]> = {
  local: [1500, 3000, 6000, 9000, 12000],
  national: [0, 0, 25000, 40000, 50000],
  global: [0, 0, 0, 70000, 120000],
};
function sponsorPool(rng: Rng, s: GameState): SponsorPool {
  const r = rng.next();
  if (s.tier <= 1) return 'local';
  if (s.tier === 2) return r < 0.65 ? 'local' : 'national';
  if (s.tier === 3) return r < 0.15 ? 'local' : r < 0.7 ? 'national' : 'global';
  return r < 0.4 ? 'national' : 'global';
}
function poolNames(pool: SponsorPool) {
  return pool === 'global' ? SPONSOR_GLOBAL : pool === 'national' ? SPONSOR_NATIONAL : SPONSOR_NAMES;
}
function sponsorPoolCapped(s: GameState, pool: SponsorPool): SponsorPool {
  // światowe marki to najwyżej dwie umowy naraz, resztę biorą krajowe
  return pool === 'global' && s.sponsors.filter((x) => SPONSOR_GLOBAL.includes(x.name)).length >= 2 ? 'national' : pool;
}
function pickSponsorName(rng: Rng, s: GameState, pool: SponsorPool) {
  const all = poolNames(pool);
  const free = all.filter((n) => !s.sponsors.some((x) => x.name === n));
  return rng.pick(free.length ? free : all);
}
/** Ile marka z danej puli zapłaci za rok (media podbijają stawkę najwyżej o 70%). */
function poolPay(s: GameState, pool: SponsorPool) {
  return (POOL_BASE[pool][s.tier] ?? 0) * (0.7 + s.media / 100);
}

const SPONSOR_CLAUSES_BIG = ['logo na spodenkach w każdej walce', 'reklama w telewizji śniadaniowej', 'twarz na billboardach w dużych miastach', 'dwa eventy firmowe w roku', 'logo na banerze za tobą na konferencjach', 'kampania w social mediach z kodem rabatowym'];
const SPONSOR_CLAUSES_GLOBAL = ['twarz globalnej kampanii', 'wywiad w magazynie marki', 'sesja zdjęciowa w Los Angeles', 'logo na walkoutowej bluzie', 'ambasador marki na Europę Środkową', 'film reklamowy z gwiazdą sportu'];

function maybeAutoSponsor(rng: Rng, s: GameState): string | null {
  const cap = 1 + s.tier;
  if (s.sponsors.length >= cap) return null;
  const p = clamp((s.media * 0.8 + s.rep * 0.6) / 120 + (currentManager(s)?.sponsor ?? 0) / 100, 0.08, 0.75) * (s.profile.difficulty === 'hard' ? 0.6 : 1);
  if (!rng.chance(p)) return null;
  const pool = sponsorPoolCapped(s, sponsorPool(rng, s));
  const name = pickSponsorName(rng, s, pool);
  const per = Math.max(500, Math.round((poolPay(s, pool) * (0.8 + rng.next() * 0.4)) / 500) * 500);
  const clauses = pool === 'local' ? SPONSOR_CLAUSES : pool === 'national' ? SPONSOR_CLAUSES_BIG : SPONSOR_CLAUSES_GLOBAL;
  s.sponsors.push({ id: uid(rng, 's'), name, perSeason: per, seasonsLeft: rng.int(1, 3), clause: rng.pick(clauses) });
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
  let c = sl.base + s.media * mediaW + (s.rep - 30) / 220 + s.tier * 0.05 - s.sponsors.length * 0.1 + (currentManager(s)?.sponsor ?? 0) / 200;
  if ((s.flags.freakStigma ?? 0) > 0 && slot !== 'social') c -= 0.05;
  if (s.profile.difficulty === 'hard') c *= 0.8;
  return Math.round(clamp(c, 0.05, 0.85) * 100);
}

/** Sam piszesz do firm: na osiedlu lokalne biznesy, w kraju marki krajowe, na świecie globalne. */
function pitchPool(s: GameState): SponsorPool {
  return sponsorPoolCapped(s, s.tier <= 1 ? 'local' : s.tier <= 3 ? 'national' : 'global');
}
export function pitchPay(s: GameState, slot: PitchSlot): number {
  const sl = PITCH_SLOTS.find((x) => x.id === slot)!;
  return Math.max(500, Math.round((poolPay(s, pitchPool(s)) * sl.pay * 0.8) / 500) * 500);
}

export function pitchSponsor(s0: GameState, slot: PitchSlot): GameState {
  const s = clone(s0);
  if (pitchBlocked(s)) return s;
  withRng(s, (rng) => {
    const ch = pitchChance(s, slot) / 100;
    const sl = PITCH_SLOTS.find((x) => x.id === slot)!;
    const name = pickSponsorName(rng, s, pitchPool(s));
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
    ensureRoster(rng, s);
    s.money += budgetBalance(s);
    // prowadzone social media podbijają rozpoznawalność
    if (followersOf(s) >= 2000 && (s.social === 'self' || s.social === 'pro')) s.media = clamp(s.media + 2, 0, 100);
    // tryb pracy obowiązuje cały rok (koszty życia już policzone)
    const jm = jobDef(s);
    s.flags.jobYear = jm ? s.season * 10 + ['full', 'half', 'none'].indexOf(jm.id) + 1 : 0;
    if (jobDef(s)?.id === 'none' && !s.flags.quitJob) {
      s.flags.quitJob = 1;
      log(s, 'Rzucasz etat. Od teraz żyjesz z walk.');
    }
    for (const l of s.loans) l.left -= 1;
    s.loans = s.loans.filter((l) => l.left > 0);
    // wydarzenia przedsezonowe
    s.eventQueue = [];
    const n = rng.chance(s.quick ? 0.5 : 0.85) ? 1 : 0;
    const extra = !s.quick && rng.chance(0.18) ? 1 : 0;
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

/** Odpowiedzi w zdarzeniach w zmiennej kolejności, żeby nie klikało się zawsze pierwszej. */
function shuffleChoices<T>(arr: T[], key: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function nextEventOrSeason(s: GameState): GameState {
  const id = s.eventQueue.shift();
  if (id) {
    const def = findEvent(id)!;
    s.seenEvents.push(id);
    s.event = { id, brand: def.brand, title: def.title ?? 'Wydarzenie', text: def.text(s), choices: shuffleChoices(def.choices(s), `${id}:${s.season}:${s.age}:${s.history.length}`) };
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
    if (s.quick) return quickAmateur(s);
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
  if (e.flag === 'rivalPick' && !s.rivalId) {
    const p = [...s.peers].filter((x) => !x.retired && Math.abs(x.tier - s.tier) <= 1).sort((a, b) => b.talent - a.talent)[0];
    if (p) {
      s.rivalId = p.id;
      log(s, `Rywal na całą karierę: ${p.firstName} ${p.lastName}.`);
    }
  }
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
    rosterSync(s);
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
    const fam = familyForm(s);
    const bonus = (s.flags.formBonus ?? 0) + fam;
    s.flags.formBonus = 0;
    const mod = f.mod + bonus;
    const intro: string[] = [];
    if (fam > 0) intro.push('Rodzina trzyma kciuki i pilnuje, żebyś się wysypiał: forma +1.');
    if (fam < 0) intro.push('W domu ciche dni i kłótnie przy obiedzie. Głowa nie jest tam, gdzie powinna: forma −1.');
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
      startFans: followersOf(s),
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

  const rivalPeer = s.rivalId ? s.peers.find((p) => p.id === s.rivalId && !p.retired && p.tier === tier && tier >= 1 && !metThisSeason.has(p.id)) : undefined;
  const asRival = (p: Peer, rank: number | null): Fighter => ({ ...p, stats: { ...p.stats }, record: { ...p.record }, rank, peer: true });
  // obrona pasa
  if (s.rank === 0) {
    if (rivalPeer && rivalPeer.rank !== null && rivalPeer.rank <= 8 && rng.chance(0.55)) {
      s.flags.superLoss = 0;
      return { opp: asRival(rivalPeer, rivalPeer.rank), title: true, defense: true, peer: rivalPeer };
    }
    const top = (s.flags.superLoss ?? 0) > 0;
    s.flags.superLoss = 0;
    const opp = rosterOpp(rng, s, top ? 1 : rng.int(1, 3), metThisSeason);
    return { opp, title: true, defense: true, peer: null };
  }
  // walka o pas
  const last = idx === run.planned - 1;
  // długa seria wygranych otwiera drogę do pasa szybciej niż sam ranking
  const streak = proStreak(s);
  const streakShot = s.rank !== null && ((streak >= 5 && s.rank <= 4 && (last || rng.chance(0.35))) || (streak >= 8 && s.rank <= 7));
  if (s.rank !== null && (s.rank === 1 || (s.rank === 2 && last) || (s.rank <= 3 && last && rng.chance(0.4)) || streakShot)) {
    if (rivalPeer && rivalPeer.rank === 0) return { opp: asRival(rivalPeer, 0), title: true, defense: false, peer: rivalPeer };
    const opp = rosterOpp(rng, s, 0, metThisSeason);
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
    const opp = rosterOpp(rng, s, 0, metThisSeason);
    return { opp, title: true, defense: false, peer: null };
  }
  if ((s.flags.grudge ?? 0) > 0) {
    s.flags.grudge = 0;
    const opp = rosterOpp(rng, s, clamp(mine - rng.int(2, 4), 1, size), metThisSeason);
    opp.nickname = opp.nickname || 'Pyskaty';
    return { opp, title: false, defense: false, peer: null, grudge: true };
  }
  let r: number | null = clamp(mine + rng.int(-3, 1) - Math.floor(q / 2), 1, size + 3);
  // wywołanie przez mikrofon: ktoś wyraźnie wyżej w rankingu
  if ((s.flags.callUp ?? 0) > 0) {
    s.flags.callUp = 0;
    r = clamp(mine - rng.int(3, 5), 1, size);
    return { opp: rosterOpp(rng, s, r, metThisSeason), title: false, defense: false, peer: null };
  }
  if (r > size) r = null;
  if (s.rank === null && rng.chance(0.5 - q * 0.1)) r = null;
  return { opp: r === null ? generateOpponent(rng, tier, r, hard) : rosterOpp(rng, s, r, metThisSeason), title: false, defense: false, peer: null };
}

/** Premie i kary bieżącej walki: kategoria wagowa, ważenie, obóz pod rywala. */
function fightMods(s: GameState): number {
  const cur = s.run?.fights[s.run.fights.length - 1];
  if (!cur || cur.amateur) return 0;
  const sh = weightShift(s);
  let m = sh < 0 ? 4 : sh > 0 ? -2 : 0;
  m += cur.weighMod ?? 0;
  // zastępstwo: kilka dni na przygotowanie zamiast obozu
  if (cur.short) m -= 5;
  // superfight: rywal z innej kategorii (większy albo szybszy)
  if (cur.superfight) m -= 3;
  if (cur.tickets?.plan === 'push') m -= 2;
  if (cur.tickets?.plan === 'none') m += 1;
  if (cur.tired) m -= 2;
  if (cur.prep === 'rival') m += 4;
  if (cur.prep === 'hard') m += 3;
  m += cur.pressMod ?? 0;
  if (hasBackroom(s, 'supps')) m += 2;
  if (hasBackroom(s, 'sparring')) m += 4;
  return m;
}

function fightCtx(s: GameState, opp: Fighter): FightCtx {
  return {
    me: effectiveStats(s),
    meName: fullName(s),
    opp,
    // czwarta i piąta walka w roku: organizm nie nadąża
    form: s.run!.form.mod + jobForm(s) + socialForm(s) + ((s.flags.expBoost ?? 0) > 0 ? 5 : 0) - Math.max(0, s.run!.fights.length - 3) * 5 + (s.run!.planned < s.contract.fights && s.contract.kind !== 'freak' ? 3 : 0) + fightMods(s),
    penalty: s.injury?.penalty ?? 0,
    perks: [...activePerks(s), ...coachPerks(s)],
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
  // regionalne gale: kto sprzedaje bilety, ten dostaje lepsze stawki
  if (s.tier === 1) p *= 1 + 0.05 * clamp(ticketRep(s), -2, 4);
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
  if (s.contract.star) return 'wieczoru';
  if (s.tier === 1 && ticketRep(s) >= 4 && s.proDebut) return rng.chance(0.5) ? 'wieczoru' : 'główna';
  if (s.tier === 1 && ticketRep(s) >= 2 && s.proDebut) return 'główna';
  if (s.tier === 1 && ticketRep(s) <= -1) return 'wstępna';
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
  if (s.flags.farewell && s.tier > 0 && s.contract.kind !== 'freak') return farewellOffer(rng, s);
  const special = specialOffer(rng, s);
  if (special) return special;
  const picked = pickOpponent(rng, s, idx);
  const { title, defense, grudge, peer } = picked;
  let opp = picked.opp;
  // mistrz kontuzjowany: zamiast walki o pas jest walka o pas tymczasowy
  let interim = false;
  let title2 = title;
  const usedIds = new Set(s.run!.fights.map((f) => f.opp.id));
  if (title && !defense && s.rank !== 0 && opp.rank === 0 && !peer && s.tier >= 1 && !s.flags.interim && rng.chance(0.4)) {
    interim = true;
    opp = rosterOpp(rng, s, rng.int(1, 3), usedIds);
  } else if (!title && !defense && !peer && s.tier >= 1 && s.rank !== null && s.rank >= 1 && s.rank <= 3 && !s.flags.interim && !s.run!.fights.some((f) => f.interim) && rng.chance(0.12)) {
    // mistrz łapie kontuzję w trakcie roku: czołówka walczy o pas tymczasowy
    interim = true;
    title2 = true;
    const r = rng.int(1, 4);
    opp = rosterOpp(rng, s, r === s.rank ? (r === 1 ? 2 : r - 1) : r, usedIds);
  }
  avoidMyName(rng, s, opp);
  const freak = s.contract.kind === 'freak';
  const fed = freak ? s.contract.fed : s.fed;
  const spot = cardSpot(rng, s, title2, opp, freak);
  const rival = !!peer && !!s.rivalId && peer.id === s.rivalId;
  const trilogy = rival && !!peer && peer.h2h.w === 1 && peer.h2h.l === 1;
  let purse = purseFor(s, opp, title2, spot) * (rival ? (trilogy ? 1.3 : 1.15) : 1);
  // organizator raz daje więcej, raz próbuje zaoszczędzić
  purse = Math.round((purse * (0.85 + rng.next() * 0.3)) / 100) * 100;
  return {
    opp,
    title: title2,
    defense,
    grudge,
    rival,
    spot,
    gala: galaName(rng, s, fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * (title2 ? 1.8 : 1)),
    negotiated: false,
    hook: !interim && title2 && !defense && !rival && s.rank !== null && s.rank > 1 && proStreak(s) >= 5
      ? `Seria ${proStreak(s)} wygranych z rzędu. Federacja nie może dłużej udawać, że cię nie widzi: dostajesz walkę o pas, choć w rankingu jesteś #${s.rank}.`
      : interim
      ? `Mistrz ${fedShort(s)} jest kontuzjowany i nie wróci przed końcem roku. Federacja robi walkę o pas tymczasowy. Wygrany zmierzy się z mistrzem w walce unifikacyjnej.`
      : rival && peer
        ? rivalHook(peer, title, defense, trilogy)
        : undefined,
    interim: interim || undefined,
  };
}

/** Walka pożegnalna: ostatni rok kariery z jedną walką w rodzinnym mieście. */
export function farewellAvailable(s: GameState): boolean {
  return s.tier > 0 && s.contract.kind !== 'freak' && !s.flags.farewell && !!s.proDebut && ((s.wear >= 65 && s.age >= 27) || s.age >= 34);
}
export function setFarewell(s0: GameState, on: boolean): GameState {
  const s = clone(s0);
  s.flags.farewell = on ? 1 : 0;
  return s;
}
function farewellOffer(rng: Rng, s: GameState): FightOffer {
  const used = new Set<string>();
  // najlepiej rywal z rocznika albo zadra; inaczej ktoś z czołówki
  const peer = s.rivalId ? s.peers.find((p) => p.id === s.rivalId && !p.retired && p.tier === s.tier) : undefined;
  let opp: Fighter = rosterOpp(rng, s, s.rank === 0 ? 1 : clamp((s.rank ?? 6) - 1, 1, 6), used);
  let hook = `Ostatni raz wchodzisz do klatki. Gala w mieście ${s.profile.hometown}, hala wyprzedana w dwa dni, a w pierwszym rzędzie siedzi cała rodzina.`;
  if (peer) {
    opp = rosterOpp(rng, s, peer.rank ?? 3, used);
    Object.assign(opp, { firstName: peer.firstName, lastName: peer.lastName, nickname: peer.nickname, id: peer.id, peer: true });
    hook = `Na pożegnanie ten, z którym wszystko się zaczęło: ${peer.firstName} ${peer.lastName}. Gala w mieście ${s.profile.hometown}, hala wyprzedana w dwa dni.`;
  }
  avoidMyName(rng, s, opp);
  const champ = s.rank === 0;
  const spot = 'wieczoru' as FightOffer['spot'];
  const purse = Math.round((purseFor(s, opp, champ, spot) * 1.8) / 100) * 100;
  return { opp, title: champ, defense: champ, spot, gala: `Gala pożegnalna · ${s.profile.hometown}`, purse, winBonus: Math.round(s.contract.winBonus * 1.5), negotiated: true, farewell: true, hook };
}

function fedShort(s: GameState) {
  return s.fed.split(' – ')[0];
}

/** Walka wywalczona wcześniej: rewanż po kontrowersji, unifikacja, wywołany mistrz. */
function specialOffer(rng: Rng, s: GameState): FightOffer | null {
  if (s.contract.kind === 'freak' || isAmateurRun(s)) return null;
  const tier = s.tier;
  const mk = (opp: Fighter, extra: Partial<FightOffer>): FightOffer => {
    avoidMyName(rng, s, opp);
    const title = !!extra.title;
    const spot = cardSpot(rng, s, title, opp, false);
    const purse = Math.round((purseFor(s, opp, title, spot) * (0.95 + rng.next() * 0.15) * (extra.rematch ? 1.15 : extra.nemesis ? 1.3 : 1)) / 100) * 100;
    return { opp, title, defense: false, spot, gala: galaName(rng, s, s.fed), purse, winBonus: Math.round(s.contract.winBonus * (title ? 1.8 : 1)), negotiated: false, ...extra };
  };
  // unifikacja: tymczasowy mistrz kontra wracający mistrz
  if ((s.flags.interim ?? 0) > 0 && s.rank !== 0) {
    const opp = rosterOpp(rng, s, 0, new Set());
    return mk(opp, { title: true, unify: true, hook: `Mistrz wrócił po kontuzji. Twój pas tymczasowy kontra jego pas: walka unifikacyjna, zwycięzca zostaje jedynym mistrzem.` });
  }
  // rewanż wywalczony po kontrowersyjnym werdykcie
  const rm = s.rematchOpp;
  if (rm) {
    s.rematchOpp = null;
    // rewanż to z definicji ten sam rywal, więc może przyjść jeszcze w tym samym roku
    if (rm.rank === null || rm.rank <= RANK_SIZE[tier] + 3) {
      const opp: Fighter = { ...rm, stats: { ...rm.stats }, record: { ...rm.record } };
      // mistrz broni pasa w rewanżu; pretendent walczy o pas, jeśli rywal jest mistrzem
      const defense = s.rank === 0;
      if (defense) opp.rank = clamp(opp.rank || 1, 1, RANK_SIZE[tier]);
      const title = defense || (rm.rank === 0 && s.rank !== 0);
      return mk(opp, {
        title,
        defense,
        rematch: true,
        rival: !!s.rivalId && rm.id === s.rivalId,
        hook: `Rewanż, o który się upomniałeś. ${opp.lastName} wie, że pierwsza walka nie przekonała nikogo.${defense ? ' Tym razem bronisz pasa.' : title ? ' Tym razem o pas.' : ''}`,
      });
    }
  }
  // zadra: rewanż raz w roku, częściej gdy rywal zaczepia w mediach
  const nf = nemesisFighter(s);
  if (nf && s.flags.nemesisYear !== s.season && !s.run!.fights.some((f) => f.opp.id === nf.id) && rng.chance((s.flags.nemesisHeat ?? 0) > 0 ? 0.6 : 0.3)) {
    s.flags.nemesisYear = s.season;
    s.flags.nemesisHeat = 0;
    const { h2h, champSince: _c, ...base } = nf;
    void _c;
    const opp: Fighter = { ...base, stats: { ...nf.stats }, record: { ...nf.record } };
    const defense = s.rank === 0;
    if (defense) opp.rank = clamp(opp.rank || 1, 1, RANK_SIZE[tier]);
    const title = defense || (nf.rank === 0 && s.rank !== null && s.rank <= 3);
    return mk(opp, {
      title,
      defense,
      nemesis: true,
      hook: `Zadra. ${opp.firstName} ${opp.lastName} od waszej walki nie daje ci spokoju w mediach. Do tej pory ${h2hWords(h2h.w, h2h.l, h2h.d)}. Organizator dokłada 30% do gaży, bo bilety na tę walkę sprzedadzą się same.${title ? (defense ? ' I tym razem bronisz pasa.' : ' A on ma pas.') : ''}`,
    });
  }
  // wywołany przez mikrofon mistrz przyjmuje wyzwanie
  if ((s.flags.titleCall ?? 0) > 0 && s.rank !== 0 && s.rank !== null) {
    s.flags.titleCall = 0;
    // za daleko w rankingu: zamiast pasa eliminator z kimś z samej czołówki
    if (s.rank > 3) {
      s.flags.callUp = 1;
      return null;
    }
    const opp = rosterOpp(rng, s, 0, new Set());
    return mk(opp, { title: true, hook: `Twoje wezwanie po ostatniej walce obiegło internet. Mistrz odpowiedział: „Chcesz? To masz”. Federacja daje ci walkę o pas.` });
  }
  return null;
}

/** Dopełniacz nazw kategorii: „mistrz wagi półciężkiej”. */
const WEIGHT_GEN: Record<WeightKey, string> = { piorkowa: 'piórkowej', lekka: 'lekkiej', polsrednia: 'półśredniej', srednia: 'średniej', polciezka: 'półciężkiej', ciezka: 'ciężkiej' };

/** Superfight: mistrz kontra mistrz kategorii obok. */
function superDivision(s: GameState): WeightKey {
  const i = WEIGHT_KEYS.indexOf(divisionKey(s));
  return WEIGHT_KEYS[i < WEIGHT_KEYS.length - 1 ? i + 1 : i - 1];
}

function superfightWanted(rng: Rng, s: GameState): boolean {
  if (s.rank !== 0 || s.tier < 3 || s.contract.kind === 'freak' || s.titleDefenses < 1) return false;
  if ((s.flags.superDone ?? 0) >= 2 || s.flags.superYear === s.season) return false;
  if ((s.flags.superCall ?? 0) > 0) return true;
  return rng.chance(0.18);
}

function buildSuperfight(rng: Rng, s: GameState): FightOffer {
  s.flags.superYear = s.season;
  s.flags.superCall = 0;
  const div = superDivision(s);
  const up = WEIGHT_KEYS.indexOf(div) > WEIGHT_KEYS.indexOf(divisionKey(s));
  const opp = generateOpponent(rng, s.tier, 0, s.profile.difficulty === 'hard');
  // większy albo szybszy: rywal ma przewagę warunków
  if (up) {
    opp.stats.chin = clamp(opp.stats.chin + 4, 1, 99);
    opp.stats.stand = clamp(opp.stats.stand + 2, 1, 99);
  } else {
    opp.stats.cardio = clamp(opp.stats.cardio + 4, 1, 99);
  }
  avoidMyName(rng, s, opp);
  const mg = activeManager(s);
  const purse = Math.round((s.contract.purse * 2.6 * (mg?.purse ?? 1) * (0.95 + rng.next() * 0.15)) / 1000) * 1000;
  const label = WEIGHT_GEN[div];
  return {
    opp,
    title: false,
    defense: false,
    spot: 'wieczoru',
    gala: galaName(rng, s, s.fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * 2),
    negotiated: false,
    superfight: label,
    hook: `Superfight: mistrz kontra mistrz. ${opp.firstName} ${opp.lastName} trzyma pas wagi ${label}. ${up ? 'Idziesz kategorię wyżej, rywal będzie cięższy.' : 'Schodzisz kategorię niżej, rywal będzie szybszy.'} Wygrana to drugi pas i miejsce w historii. Twój pas nie jest stawką, ale po porażce reputacja spadnie, a w następnej obronie czeka numer 1 rankingu.`,
  };
}

/** Gala MMA za granicą: jednorazowa walka za duże pieniądze, poza rankingiem i poza federacją. */
const ABROAD = [
  { city: 'Dubaj', venue: 'Arena Pustynna', gala: 'Desert Kings FC', flag: '🇦🇪' },
  { city: 'Rijad', venue: 'Hala Królewska', gala: 'Arabian Warriors', flag: '🇸🇦' },
  { city: 'Makau', venue: 'Cotai Arena', gala: 'Dragon Gate MMA', flag: '🇲🇴' },
  { city: 'Saitama', venue: 'Super Arena', gala: 'Raizen Sylwester', flag: '🇯🇵' },
];

function abroadWanted(rng: Rng, s: GameState): boolean {
  const run = s.run!;
  if (s.tier < 2 || s.contract.kind === 'freak' || run.abroadOffered || run.autoAccept || s.quick) return false;
  if (run.fights.length === 0 || run.planned >= 5) return false;
  // federacja na wyłączność nie puszcza na inne gale MMA
  if (isExclusiveFed(s.contract.fed)) return false;
  if (s.injury && s.injury.penalty >= 5) return false;
  return rng.chance(coachOf(s).contacts ? 0.2 : 0.11);
}

function buildAbroad(rng: Rng, s: GameState): FightOffer {
  s.run!.abroadOffered = true;
  // ostatnia walka roku: zaproszenie na sylwestrową galę w Japonii
  const last = s.run!.fights.length >= s.run!.planned - 1;
  const a = last && rng.chance(0.5) ? ABROAD[3] : rng.pick(ABROAD.slice(0, 3));
  const opp = generateOpponent(rng, s.tier, rng.int(1, 5), s.profile.difficulty === 'hard');
  // rywal z zagranicy: nazwisko i flaga z międzynarodowej puli, poziom z twojego szczebla
  const intl = generateOpponent(rng, 4, null, false);
  Object.assign(opp, { firstName: intl.firstName, lastName: intl.lastName, nickname: intl.nickname, country: intl.country, flag: intl.flag });
  opp.rank = null;
  avoidMyName(rng, s, opp);
  const mg = activeManager(s);
  const purse = Math.round((s.contract.purse * 2.5 * (mg?.purse ?? 1) * (0.95 + rng.next() * 0.15)) / 500) * 500;
  const who = currentManager(s)?.name ?? 'Szejk z dużą gotówką';
  return {
    opp,
    title: false,
    defense: false,
    spot: 'główna',
    gala: `${a.gala} · ${a.city}`,
    purse,
    winBonus: Math.round(s.contract.winBonus * 1.5),
    negotiated: true,
    abroad: a.city,
    tip: `${who}: „${a.gala} robi galę w mieście ${a.city} i chce kogoś z Polski. Płacą dwa i pół raza więcej niż u nas. Ranking się nie ruszy, ale wygrana zrobi szum. Rywal mocny: ${opp.firstName} ${opp.lastName}.”`,
  };
}

/** Zaproszenie na wydarzenie poza MMA (grappling, boks, seminarium): najwyżej raz w roku. */
function inviteWanted(rng: Rng, s: GameState): boolean {
  const run = s.run!;
  if (s.tier < 1 || s.contract.kind === 'freak' || run.inviteOffered || s.quick) return false;
  if (run.fights.length === 0 || run.fights.length >= run.planned) return false;
  if (s.injury && s.injury.penalty >= 5) return false;
  return rng.chance(coachOf(s).contacts ? 0.8 : 0.62);
}

export function isExclusiveContract(s: GameState): boolean {
  return isExclusiveFed(s.contract.fed);
}

export function acceptInvite(s0: GameState): GameState {
  const inv = s0.run?.invite;
  if (!inv) return s0;
  const s = clone(s0);
  withRng(s, (rng) => {
    const res = resolveInvite(rng, s, inv, s.run!.form.mod);
    s.run!.invite = null;
    (s.run!.sideLog ??= []).push({ title: res.title, text: res.text, tone: res.tone, lines: res.lines });
    if (res.win && inv.kind !== 'seminar') log(s, `${inv.kind === 'grappling' ? 'Złoto' : 'Wygrana'}: ${inv.title}.`);
  });
  return s;
}

export function declineInvite(s0: GameState): GameState {
  if (!s0.run?.invite) return s0;
  const s = clone(s0);
  s.run!.invite = null;
  return s;
}

export function inviteChance(s: GameState): number | null {
  const inv = s.run?.invite;
  if (!inv || !['grappling', 'boxing', 'grapple1', 'kick'].includes(inv.kind)) return null;
  const p = sideChance(s, inv.kind, s.run!.form.mod);
  return Math.round((inv.kind === 'grappling' ? p * p * p : p) * 100);
}

/** Telefon z zastępstwem: rywal wypadł, walka za kilka dni. */
function shortWanted(rng: Rng, s: GameState): boolean {
  const run = s.run!;
  if (s.tier < 1 || s.contract.kind === 'freak' || run.shortOffered || run.autoAccept || s.quick) return false;
  if (s.injury && s.injury.penalty >= 5) return false;
  if (run.fights.length === 0 || run.planned >= 5 || s.rank === 0) return false;
  return rng.chance(0.14);
}

function buildShortNotice(rng: Rng, s: GameState): FightOffer {
  s.run!.shortOffered = true;
  const size = RANK_SIZE[s.tier];
  const mine = s.rank ?? size + 2;
  const r = clamp(mine - rng.int(3, 5), 1, size);
  const opp = rosterOpp(rng, s, s.rank === null && rng.chance(0.4) ? rng.int(Math.max(1, size - 3), size) : r, new Set(s.run!.fights.map((f) => f.opp.id)));
  avoidMyName(rng, s, opp);
  const spot: CardSpot = s.tier <= 1 ? 'główna' : rng.chance(0.5) ? 'główna' : 'wieczoru';
  const base = purseFor(s, opp, false, spot);
  const purse = Math.round((base * 1.6 * (0.95 + rng.next() * 0.1)) / 100) * 100;
  const who = currentManager(s)?.name ?? 'Organizator';
  return {
    opp,
    title: false,
    defense: false,
    spot,
    gala: galaName(rng, s, s.fed),
    purse,
    winBonus: Math.round(s.contract.winBonus * 1.3),
    negotiated: true,
    short: true,
    tip: `${who}: „Rywal z karty głównej wypadł, gala za sześć dni. Bierzesz? Płacą ponad półtorej stawki, a ${opp.lastName} jest wyżej w rankingu. Przegrana na zastępstwie mniej boli. Bez obozu, ${weightShift(s) < 0 ? 'wagę trzeba zbić na szybko' : 'ale wagę masz'}.”`,
  };
}

function rivalHook(p: Peer, title: boolean, defense: boolean, trilogy: boolean): string {
  const h = h2hWords(p.h2h.w, p.h2h.l, p.h2h.d);
  if (title && defense) return `Obrona pasa przeciwko odwiecznemu rywalowi. ${p.lastName} czekał na to latami, a ty ${h}.`;
  if (title) return `${p.lastName} ma pas. Twoja walka o tytuł to walka z odwiecznym rywalem, a ty ${h}.`;
  if (trilogy) return `Trylogia. Po jednej wygranej dla każdego, ta walka rozstrzygnie, kto był lepszy. Organizator dokłada 30% do gaży.`;
  if (p.metCount === 0) return `${p.lastName}: rywal, o którym mówią wszyscy. Pierwsze starcie zawodowe, gaża +15%.`;
  return `Odwieczny rywal, ${h}. Organizator dokłada 15% do gaży.`;
}

/** Czy menedżer (albo znajomy promotor) podsunie walkę na odbudowę rekordu. */
function tuneupWanted(rng: Rng, s: GameState, _idx: number): boolean {
  const run = s.run!;
  if (s.tier < 2 || s.contract.kind === 'freak' || run.tuneupOffered || run.autoAccept) return false;
  if (s.rank === 0) return false;
  // kontrakt na wyłączność: walki na obcych galach odpadają
  if (isExclusiveFed(s.contract.fed)) {
    if (s.streak <= -3 && !run.exclNote) {
      run.exclNote = true;
      run.notes = run.notes ?? [];
      run.notes.push(`${s.contract.fed.split(' – ')[0]} trzyma cię na wyłączność. Walki na odbudowę na innych galach nie wchodzą w grę, musisz odbić się u siebie.`);
    }
    return false;
  }
  // trzy porażki z rzędu: menedżer albo promotor zawsze coś podsuwa (najwyżej raz w roku)
  if (s.streak <= -3 && s.flags.lastTuneup !== s.season) {
    s.flags.lastTuneup = s.season;
    return true;
  }
  // nie częściej niż co dwa lata
  if (s.flags.lastTuneup && s.season - s.flags.lastTuneup < 2) return false;
  // tylko prawdziwy dołek: seria porażek albo porażka na dnie rankingu / poza nim
  const lowRank = s.rank === null || s.rank >= RANK_SIZE[s.tier] - 3;
  const slump = s.streak <= -2 || (s.streak <= -1 && lowRank);
  if (!slump) return false;
  // po dobrym roku menedżer nie panikuje po jednej porażce
  const last = s.lastSummary;
  if (last && last.w > last.l && s.streak > -2) return false;
  if (!rng.chance(currentManager(s) ? 0.5 : 0.25)) return false;
  s.flags.lastTuneup = s.season;
  return true;
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
  if (run.offer || run.press || run.weigh || run.post || run.invite) return s; // czeka na ofertę, konferencję, ważenie, decyzję po walce albo zaproszenie
  withRng(s, (rng) => {
    const idx = run.fights.length;
    if (!isAmateurRun(s)) {
      if (superfightWanted(rng, s)) {
        run.offer = buildSuperfight(rng, s);
        return;
      }
      if (shortWanted(rng, s)) {
        run.offer = buildShortNotice(rng, s);
        return;
      }
      if (abroadWanted(rng, s)) {
        run.offer = buildAbroad(rng, s);
        return;
      }
      if (inviteWanted(rng, s)) {
        run.inviteOffered = true;
        const inv = buildInvite(rng, s);
        if (inv) {
          run.invite = inv;
          return;
        }
      }
      if (tuneupWanted(rng, s, idx)) {
        run.tuneupOffered = true;
        run.offer = buildTuneup(rng, s);
        return;
      }
      const o = buildOffer(rng, s, idx);
      // szybka kariera: ofertę widzisz tylko przy walce o pas i z rywalem, resztę narożnik przyjmuje sam
      if (s.quick && !(o.title || o.rival || o.superfight || o.rematch || o.nemesis)) {
        o.prep = 'std';
        if (ticketsAvailable(s, o)) o.tickets = 'std';
        startFight(rng, s, o);
        return;
      }
      if (run.autoAccept) {
        const p = run.autoPrep ?? 'std';
        o.prep = p === 'rival' && s.money < prepCost(s, o) ? 'std' : p;
        if (ticketsAvailable(s, o)) o.tickets = (['none', 'std', 'push'] as const)[s.flags.autoTickets ?? 1];
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
  const ab = rep.abroad ? ABROAD.find((x) => x.city === rep.abroad) : undefined;
  const v = ab
    ? { city: ab.city, venue: ab.venue }
    : rep.freak
    ? { city: rng.pick(['Warszawa', 'Łódź', 'Gliwice']), venue: 'Hala Expo' }
    : tg
      ? { city: tg.city, venue: tg.venue }
      : rng.pick(FED_VENUES[s.fed] ?? VENUES[tier]);
  const tags = ['Walka wieczoru', 'Co-main event', 'Karta główna', 'Karta główna', 'Karta wstępna', 'Karta wstępna'];
  const mine = rep.spot === 'wieczoru' ? 0 : rep.spot === 'główna' ? rng.int(1, 3) : rng.int(4, 5);
  const bouts: NonNullable<FightReport['poster']>['bouts'] = [];
  const used = new Set<string>([s.profile.lastName, rep.opp.lastName]);
  for (let i = 0; i < 6; i++) {
    if (i === mine) {
      bouts.push({ a: s.profile.lastName, ar: recStr(mainRecord(s)), b: rep.opp.lastName, br: rep.opp.freak ? 'debiut' : recStr(rep.opp.record), tag: '' });
      continue;
    }
    const rk = i <= 1 ? rng.int(1, 5) : i <= 3 ? rng.int(4, 12) : null;
    const pt = rep.tuneup ? 1 : rep.abroad ? 4 : tier;
    // nazwiska na plakacie się nie powtarzają
    const fresh = (mk: () => Fighter) => {
      let f = mk();
      for (let k = 0; k < 6 && used.has(f.lastName); k++) f = mk();
      used.add(f.lastName);
      return f;
    };
    const x = fresh(() => (rep.freak ? generateFreak(rng) : generateOpponent(rng, pt, rk, false)));
    const y = fresh(() => (rep.freak ? generateFreak(rng) : generateOpponent(rng, pt, rk === null ? null : rk + rng.int(1, 3), false)));
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
  // ważenie: gdy waga nie wychodzi, gracz decyduje (sauna albo kara z gaży)
  if (!amateur && s.contract.kind !== 'freak' && !o.weigh && weightShift(s) < 0) {
    const p = weightMissChance(s) * (o.short ? 2 : 1) + (o.short ? 10 : 0);
    if (rng.chance(p / 100)) {
      if (s.quick && !(title || o.rival || o.superfight)) o.weigh = 'paid';
      else {
        run.weigh = o;
        return;
      }
    }
  }
  const t = amateur ? run.tourneys![run.tIdx ?? 0] : undefined;
  {
    {
    const freak = s.contract.kind === 'freak';
    const fed = freak ? s.contract.fed : s.fed;
    const stage = t?.stage ?? undefined;
    const rounds = amateur ? (stage === 'qf' || stage === 'sf' ? 1 : 3) : title || o.superfight ? 5 : 3;
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
      nemesis: o.nemesis,
      tuneup: o.tuneup,
      short: o.short,
      interim: o.interim,
      unify: o.unify,
      superfight: o.superfight,
      abroad: o.abroad,
      farewell: o.farewell,
      earned: 0,
    };
    if (o.tuneup || o.abroad) rep.fed = o.gala.split(' · ')[0];
    if (!amateur && !freak && (s.flags.sideTired ?? 0) > 0) {
      s.flags.sideTired = 0;
      rep.tired = true;
    }
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
      if (rep.tired) rep.moments.push({ round: 0, title: 'Weekend poza salą', text: 'Wydarzenie poza federacją zjadło kilka dni treningu. Czujesz to w nogach.', tone: 'neutral' });
      if (o.abroad)
        rep.moments.push({ round: 0, title: `Gala w mieście ${o.abroad}`, text: 'Lot w biznes klasie, hotel z basenem na dachu i hala pełna ludzi, którzy nigdy o tobie nie słyszeli. Dziś mają usłyszeć.', tone: 'purple' });
      if (o.short)
        rep.moments.push({ round: 0, title: 'Zastępstwo', text: `Sześć dni temu oglądałeś tę galę z kanapy. Teraz idziesz w karcie głównej. Bez obozu, bez planu pod rywala, na samej formie z sali.`, tone: 'neutral' });
      if (o.weigh === 'paid') {
        rep.weightMiss = true;
        rep.weighMod = -5;
        const fine = Math.round((rep.purse * 0.25) / 100) * 100;
        rep.purse -= fine;
        s.rep = clamp(s.rep - 2, 0, 100);
        rep.moments.push({ round: 0, title: 'Nie zrobiłeś wagi', text: `Waga pokazuje o 1,2 kg za dużo. ${fine.toLocaleString('pl-PL')} zł z gaży idzie do rywala, a ty wchodzisz do klatki wysuszony.`, tone: 'bad' });
      } else if (o.weigh === 'cut_ok') {
        rep.weighMod = -2;
        s.wear = clamp(s.wear + 2, 0, 100);
        rep.moments.push({ round: 0, title: 'Waga w ostatniej chwili', text: 'Godzina w saunie i dwie w foliach. O szóstej rano waga pokazuje limit co do grama. Gaża cała, ale nogi jak z waty.', tone: 'neutral' });
      } else if (o.weigh === 'cut_fail') {
        rep.weightMiss = true;
        rep.weighMod = -9;
        const fine = Math.round((rep.purse * 0.3) / 100) * 100;
        rep.purse -= fine;
        s.wear = clamp(s.wear + 3, 0, 100);
        s.rep = clamp(s.rep - 3, 0, 100);
        rep.moments.push({ round: 0, title: 'Sauna nie pomogła', text: `Po trzech godzinach zbijania dalej brakuje 600 gramów, a ty ledwo stoisz. ${fine.toLocaleString('pl-PL')} zł kary i walka z pustym bakiem.`, tone: 'bad' });
      }
      if (o.tickets && ticketsAvailable(s, o)) {
        const sale = ticketSale(s, o.tickets, rng.next());
        rep.tickets = { ...sale, plan: o.tickets };
        s.money += sale.cut;
        s.totalEarned += sale.cut;
        const tr = s.flags.ticketRep ?? 0;
        s.flags.ticketRep = clamp(tr + (o.tickets === 'none' ? -1 : sale.sold >= 100 ? 2 : sale.sold >= 55 ? 1 : 0), -2, 5);
        if (o.tickets === 'push') addFans(s, sale.sold * 3);
        s.flags.ticketsSold = (s.flags.ticketsSold ?? 0) + sale.sold;
        rep.moments.push(
          o.tickets === 'none'
            ? { round: 0, title: 'Bilety', text: 'Nie sprzedajesz ani jednego biletu. Organizator nic nie mówi, ale przy następnej gali o tym pamięta.', tone: 'neutral' }
            : {
                round: 0,
                title: 'Bilety',
                text: `Sprzedajesz ${sale.sold} ${pl(sale.sold, 'bilet', 'bilety', 'biletów')}${o.tickets === 'push' ? ' po tygodniu objazdu po siłowniach' : ''}. Prowizja: ${sale.cut.toLocaleString('pl-PL')} zł. ${sale.sold >= 100 ? 'Pół hali przyszło dla ciebie, organizator już dzwoni z kolejną datą.' : sale.sold >= 55 ? 'Organizator zadowolony, będzie lepsze miejsce w karcie.' : 'Mogło być lepiej, ale sektor z twoimi ludźmi słychać.'}`,
                tone: sale.sold >= 55 ? 'good' : 'neutral',
              },
        );
      }
      if (o.superfight)
        rep.moments.push({ round: 0, title: 'Superfight', text: `Mistrz kontra mistrz. Pięć rund w wadze ${o.superfight}. Twój pas zostaje w szatni, stawką jest drugi i miejsce w historii.`, tone: 'purple' });
      if (o.interim)
        rep.moments.push({ round: 0, title: 'Pas tymczasowy', text: 'Mistrz leczy kontuzję, więc federacja robi walkę o pas tymczasowy. Pięć rund jak w walce o tytuł.', tone: 'purple' });
      if (o.farewell)
        rep.moments.push({ round: 0, title: 'Walka pożegnalna', text: `Ostatni obóz, ostatnie ważenie, ostatnie wyjście. W mieście ${s.profile.hometown} na bilbordach twoja twarz, a w szatni stary trener, który pamięta cię jako szesnastolatka.`, tone: 'purple' });
      if (o.unify)
        rep.moments.push({ round: 0, title: 'Unifikacja', text: 'Dwa pasy, jeden mistrz. Ty z tymczasowym, on z prawdziwym. Po tej walce zostanie jeden.', tone: 'purple' });
    }
    if (!amateur && !freak) rep.sim.pro = true;
    if (!amateur && !freak && (title || o.rival || o.superfight)) {
      rep.sim.big = true;
      rep.moments.push({
        round: 0,
        title: title ? 'Wieczór, na który pracowałeś' : 'To nie jest zwykła walka',
        text: `${rounds === 5 ? 'Pięć rund' : 'Trzy rundy'}. W tej walce narożnik pyta cię o decyzję w każdej przerwie. ${title ? 'Każda minuta może zmienić całą karierę.' : 'Wszyscy wiedzą, że tu chodzi o coś więcej niż ranking.'}`,
        tone: 'purple',
      });
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
    quickAutoResolve(rng, s, rep);
    if (rep.sim.finished) finalizeFight(rng, s, rep);
    }
  }
}

/** Szybka kariera: w zwykłych walkach decyzje podejmuje narożnik (wybór z największą szansą). */
function quickAutoResolve(rng: Rng, s: GameState, rep: FightReport) {
  if (!s.quick || rep.sim.big) return;
  for (let i = 0; i < 12 && rep.sim.pending && !rep.sim.finished; i++) {
    const dp = rep.sim.pending;
    const best = [...dp.options].sort((a, b) => b.chance - a.chance)[0];
    const ctx = fightCtx(s, rep.opp);
    applyDecision(rng, ctx, rep.sim, rep, best.key);
    const m = rep.moments[rep.moments.length - 1];
    if (m?.decision) m.text = m.text.replace(/^Wybierasz:/, 'Narożnik decyduje:');
    if (!rep.sim.finished) advanceFight(rng, ctx, rep.sim, rep);
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
    if (!rep.sim.finished) advanceFight(rng, ctx, rep.sim, rep);
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
    if (run.offer || run.press || run.weigh || run.post || run.invite) break;
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
  let c = 28 + (mg?.negotiate ?? 0) + s.media / 4 + repNego(s) + (s.rank !== null && s.rank <= 5 ? 10 : 0) + (o.title ? 10 : 0) + (o.rival ? 8 : 0);
  if (s.tier >= 3 && s.rank === null) c -= 10;
  if (s.contract.kind === 'freak') c += 10;
  return Math.round(clamp(c, 10, 85));
}

export function declineBlocked(s: GameState): string | null {
  const o = s.run?.offer;
  if (!o) return null;
  if (o.farewell) return 'Na własną galę pożegnalną się nie odmawia.';
  if (o.title) return o.defense ? 'Mistrz nie odmawia obrony pasa.' : 'O pas się nie odmawia.';
  return null;
}

/** Przyjmuje tę ofertę i wszystkie kolejne w tym roku. */
export function acceptAllOffers(s0: GameState, prep: 'std' | 'rival' | 'hard' = 'std', tickets: TicketPlan = 'std'): GameState {
  const s = acceptOffer(s0, prep, tickets);
  if (s.run) {
    s.run.autoAccept = true;
    s.run.autoPrep = prep;
    s.flags.autoTickets = tickets === 'none' ? 0 : tickets === 'push' ? 2 : 1;
  }
  return s;
}

// Konferencja przed galą: tylko przy dużych walkach (karta główna, rywal, pas)
export function pressEligible(o: FightOffer) {
  return !o.tuneup && !o.short && !o.abroad && !!(o.title || o.rival || o.superfight || o.spot === 'główna' || o.spot === 'wieczoru' || o.opp.freak);
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

/** Ile rozgłosu daje wybryk: im bardziej jesteś znany, tym mniej robi wrażenie kolejny. */
function mediaGain(s: GameState, base: number): number {
  return Math.max(1, Math.round(base * clamp(1.25 - s.media / 90, 0.3, 1.25)));
}

/** Bilans z rywalem po ludzku: „masz z nim 2 wygrane i 1 porażkę”. */
export function h2hWords(w: number, l: number, d = 0): string {
  const part = (n: number, a: string, b: string, c: string) => `${n} ${pl(n, a, b, c)}`;
  const bits = [w ? part(w, 'wygraną', 'wygrane', 'wygranych') : '', l ? part(l, 'porażkę', 'porażki', 'porażek') : '', d ? part(d, 'remis', 'remisy', 'remisów') : ''].filter(Boolean);
  return bits.length ? `masz z nim ${bits.join(bits.length === 2 ? ' i ' : ', ')}` : 'jeszcze się nie biliście';
}

type PressCtx = NonNullable<FightOffer['pressCtx']>;

/** Konferencja zależna od sytuacji: inne pytanie, inne odpowiedzi i inne ryzyko. Każda sytuacja ma kilka wersji. */
export function pressContext(s: GameState, o: FightOffer, rng?: Rng): PressCtx {
  const n = o.opp.lastName;
  const me = s.profile.lastName;
  const pick = <T,>(arr: T[]): T => (rng ? rng.pick(arr) : arr[(s.season + s.history.length) % arr.length]);
  const peer = o.opp.peer ? s.peers.find((p) => p.id === o.opp.id) : undefined;
  const L = (calm: [string, string], provoke: [string, string], insult: [string, string]) => ({ calm, provoke, insult });
  if (o.opp.freak)
    return pick([
      { id: 'freak', question: `Dziennikarz: „Sportowiec kontra ${o.opp.freak}. Nie wstyd ci?”`, labels: L(['„To też praca”', 'Spokojnie, bez wchodzenia w cyrk. Kibice MMA to docenią.'], ['Grasz w ich grę', 'Riposta pod klipy. Zasięgi pewne, nerwy też.'], ['Robisz show', 'Przewracasz stół i rzucasz butelką. Dokładnie tego chcą organizatorzy.']), provoke: 0.7, insult: 0.65 },
      { id: 'freak', question: `${n}: „Mam więcej obserwujących niż ty kibiców na wszystkich galach razem. Kto tu jest gwiazdą?”`, labels: L(['„Zobaczymy w klatce”', 'Ignorujesz zasięgi, mówisz o walce.'], ['„Policz je po walce”', 'Szybka riposta pod nagranie.'], ['Wylewasz mu wodę na głowę', 'Klip roku albo kara od organizatora.']), provoke: 0.68, insult: 0.62 },
    ]);
  if (peer && peer.metCount > 0)
    return pick([
      { id: 'rematch', question: `Dziennikarz: „Znacie się z klatki: ${h2hWords(peer.h2h.w, peer.h2h.l, peer.h2h.d)}. ${n} mówi, że tym razem nie będzie przypadku. Co ty na to?”`, labels: L(['„Znamy się na pamięć”', 'Szacunek dla historii. Kibice cenią klasę.'], ['Przypominasz wynik', 'Wyciągasz mu wasze poprzednie starcie. Trafi albo go nakręci.'], ['Robisz z tego wojnę', 'Osobiste wycieczki. Hala będzie pełna, a ochrona w gotowości.']), provoke: peer.h2h.w > peer.h2h.l ? 0.7 : 0.45, insult: 0.4 },
      { id: 'rematch', question: `${n}: „Znam ${me} od dzieciaka. Wiem, kiedy się boi. Teraz się boi.”`, labels: L(['„Dorośliśmy obaj”', 'Bez wspominek, z szacunkiem.'], ['Przypominasz mu dawne czasy', 'Historia z szatni, która go zaboli.'], ['Wyciągasz brudy', 'Prywatne sprawy na konferencji. Internet zapłonie, federacja też.']), provoke: 0.55, insult: 0.38 },
    ]);
  if (s.streak <= -2)
    return pick([
      { id: 'losing', question: `Dziennikarz: „${Math.abs(s.streak)} porażki z rzędu. Ludzie mówią, że to już koniec. Po co jeszcze walczysz?”`, labels: L(['Bierzesz to na siebie', '„Zawaliłem, wracam silniejszy.” Kibice lubią szczerość.'], ['Odgryzasz się', 'Ostro do dziennikarza. Po serii porażek łatwo wyjść na sfrustrowanego.'], ['Atakujesz rywala', 'Głośno i agresywnie. Jak przegrasz, internet cię zje.']), provoke: 0.4, insult: 0.25 },
      { id: 'losing', question: `${n}: „Przyszedłem po łatwe zwycięstwo. Po ostatnich walkach ${me} sam to wie.”`, labels: L(['„Oceniaj mnie w sobotę”', 'Bez tłumaczenia się, krótko.'], ['„Łatwe? Sprawdź mój rekord”', 'Pewność siebie wbrew wynikom. Ryzykowne.'], ['Rzucasz się do niego', 'Ochrona was rozdziela. Albo cię to nakręci, albo spali.']), provoke: 0.42, insult: 0.28 },
    ]);
  if (s.streak >= 3)
    return pick([
      { id: 'streak', question: `Dziennikarz: „Seria ${s.streak} wygranych. ${n} twierdzi, że biłeś się z nikim. Czujesz się faworytem?”`, labels: L(['„Każda walka jest inna”', 'Pokora faworyta. Bez fajerwerków.'], ['„Zapytaj moich ostatnich rywali”', 'Pewność siebie na fali. Zwykle działa.'], ['Wyśmiewasz go', 'Arogancja zwycięzcy. Jak się potkniesz, wróci do ciebie.']), provoke: 0.72, insult: 0.5 },
      { id: 'streak', question: `${n}: „Każda seria się kiedyś kończy. Twoja kończy się w sobotę.”`, labels: L(['„Może tak, może nie”', 'Spokój kogoś, kto wie, ile jest wart.'], ['„Ustaw się w kolejce”', 'Lista pokonanych rośnie. Mówisz to z uśmiechem.'], ['Wręczasz mu listę pokonanych', 'Kartka z nazwiskami i jego na końcu. Klip pewny, kara możliwa.']), provoke: 0.7, insult: 0.48 },
    ]);
  if (o.title)
    return pick([
      { id: 'title', question: `Dziennikarz: „${o.defense ? 'Kolejna obrona. Ile jeszcze utrzymasz ten pas?' : 'Walka o pas. Co to dla ciebie znaczy?'}”`, labels: L(['Mówisz o drodze', '„Od pierwszej sali do tego miejsca.” Kibice to kupują.'], ['„Pas już jest mój”', 'Pewność siebie przed największą walką.'], ['Jedziesz po rywalu', 'Wszystko albo nic. Federacja patrzy, kibice też.']), provoke: 0.55, insult: 0.35 },
      { id: 'title', question: `${n} kładzie rękę na pasie na stole: „${o.defense ? 'Pożyczyłeś go tylko na chwilę.' : 'Przyzwyczaj się, że to ja go noszę.'}”`, labels: L(['Zabierasz rękę z uśmiechem', 'Bez słowa, z klasą. Kamery to łapią.'], ['„Zrób sobie z nim zdjęcie”', 'Riposta, po której sala wybucha śmiechem.'], ['Wyrywasz mu pas', 'Przepychanka przy stole. Hit internetu albo kara i nerwy.']), provoke: 0.58, insult: 0.36 },
    ]);
  // bez szczególnej historii: rywal mówi coś o swoim stylu, kraju albo wieku
  const style = o.opp.style;
  const opts: PressCtx[] = [];
  const STYLE_Q: Partial<Record<Style, string>> = {
    wrestler: `Położę ${me} na plecy w pierwszej minucie i będę trzymał do gongu.`,
    grappler: `Niech ${me} poćwiczy obronę duszeń. Będzie mu potrzebna.`,
    boxer: `Jedno trafienie i ${me} zobaczy sufit hali.`,
    kickboxer: `Moje kopnięcia na korpus kończyły już lepszych od ${me}.`,
    brawler: `Nie będę biegał. Staniemy na środku i zobaczymy, kto ma twardszą szczękę.`,
    allround: `Jestem lepszy wszędzie: w stójce, w parterze i w głowie.`,
  };
  if (style && STYLE_Q[style])
    opts.push({ id: 'style', question: `${n}: „${STYLE_Q[style]}”`, labels: L(['„Zobaczymy w klatce”', 'Nie dajesz się wciągnąć w gierki.'], [`Wyśmiewasz jego ${STYLE_LABELS[style].toLowerCase()}`, 'Trafiasz w jego dumę. Może zacząć walczyć na złość.'], ['Zapraszasz go na środek sceny', 'Face to face nos w nos. Sekundanci muszą was rozdzielać.']), provoke: 0.6, insult: 0.42 });
  if (o.opp.country && o.opp.country !== 'Polska')
    opts.push({ id: 'foreign', question: `${n}: „Przyjechałem do Polski zabrać to zwycięstwo do domu. ${me} to tylko przystanek.”`, labels: L(['Witasz go w Polsce', 'Gościnnie, ale stanowczo. Kibice to lubią.'], ['„Bilet powrotny kupiłeś?”', 'Riposta pod polską publikę.'], ['Podgrzewasz kibiców przeciw niemu', 'Hala będzie gwizdać przez całą walkę. Albo go to złamie, albo nakręci.']), provoke: 0.62, insult: 0.45 });
  if (o.opp.age >= 33 && s.age <= 26)
    opts.push({ id: 'veteran', question: `${n}: „Ten dzieciak nosił pieluchy, kiedy ja walczyłem o pierwszy pas.”`, labels: L(['„Szacunek dla doświadczenia”', 'Uczeń mówi o mistrzu. Ładnie wygląda w telewizji.'], ['„Dlatego czas na emeryturę”', 'Przypominasz mu jego wiek. Boli każdego weterana.'], ['Przynosisz mu laskę', 'Rekwizyt na konferencję. Śmiech na sali albo kara.']), provoke: 0.62, insult: 0.42 });
  if (o.opp.age <= 23 && s.age >= 30)
    opts.push({ id: 'young', question: `${n}: „Najlepsze lata ${me} już minęły. Czas zrobić miejsce młodym.”`, labels: L(['„Jeszcze się nauczysz”', 'Spokój weterana. Kibice to szanują.'], ['„Ucz się, dopóki możesz”', 'Lekcja dla młodego. Może go wytrącić z rytmu.'], ['Robisz z niego dzieciaka', 'Poklepujesz go po głowie przy kamerach. Wściekłość gwarantowana.']), provoke: 0.62, insult: 0.44 });
  opts.push({ id: 'default', question: `${n} na face to face: „${o.pressQuote ?? ''}”`, labels: L(['Spokojnie i z klasą', 'Szacunek, zero emocji. Kibice cenią.'], ['Odbijasz piłeczkę', 'Ostra riposta. Może wyprowadzić go z równowagi albo ciebie.'], ['Jedziesz po bandzie', 'Zasięgi gwarantowane. Federacja może ukarać, a nerwy mogą puścić.']), provoke: 0.6, insult: 0.4 });
  return pick(opts);
}

export function pressAnswer(s0: GameState, key: PressAnswer): GameState {
  const s = clone(s0);
  const o = s.run?.press;
  if (!o) return s0;
  s.run!.press = null;
  const ctx = o.pressCtx ?? pressContext(s, o);
  withRng(s, (rng) => {
    if (key === 'calm') {
      s.rep = clamp(s.rep + (ctx.id === 'losing' || ctx.id === 'title' ? 3 : 2), 0, 100);
      o.pressMod = 1;
      o.pressNote = rng.pick(['Spokojnie odpowiadasz, że w sobotę wszystko się wyjaśni. Dziennikarze kiwają głowami.', 'Mówisz o szacunku i ciężkiej pracy. Nudne, ale profesjonalne.']);
    } else if (key === 'provoke') {
      s.media = clamp(s.media + mediaGain(s, 2), 0, 100);
      if (rng.chance(ctx.provoke)) {
        o.pressMod = 3;
        o.pressNote = rng.pick(['Twoja riposta trafia. Rywal czerwienieje i nie wie, co odpowiedzieć. Sala się śmieje.', 'Odbijasz piłeczkę tak, że rywal schodzi ze sceny wściekły. To ty kontrolujesz emocje.']);
      } else {
        o.pressMod = -3;
        o.pressNote = rng.pick(['Rywal ma odpowiedź na wszystko. To ciebie wyprowadził z równowagi.', 'Wdajesz się w przepychankę słowną i przegrywasz ją. Wracasz do hotelu zły.']);
      }
    } else {
      s.media = clamp(s.media + mediaGain(s, ctx.id === 'freak' ? 5 : 3), 0, 100);
      s.rep = clamp(s.rep - (ctx.id === 'freak' ? 1 : ctx.id === 'losing' ? 6 : 4), 0, 100);
      if (rng.chance(ctx.insult)) {
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

/** Szansa, że sauna i folie dowiozą limit. */
export function cutChance(s: GameState): number {
  const o = s.run?.weigh;
  let c = 62 + (hasBackroom(s, 'doctor') ? 10 : 0) - (s.age >= 32 ? 10 : 0) - (o?.short ? 15 : 0) - (weightShift(s) < -1 ? 10 : 0) - Math.round(s.wear / 10);
  return Math.round(clamp(c, 20, 85));
}

/** Ważenie: zbijasz dalej (szansa na pełną gażę) albo płacisz karę. */
export function weighIn(s0: GameState, choice: 'cut' | 'pay'): GameState {
  const s = clone(s0);
  const o = s.run?.weigh;
  if (!o) return s0;
  withRng(s, (rng) => {
    o.weigh = choice === 'pay' ? 'paid' : rng.chance(cutChance(s0) / 100) ? 'cut_ok' : 'cut_fail';
    s.run!.weigh = null;
    startFight(rng, s, o);
  });
  return s;
}

/** Decyzja po walce: mikrofon albo reakcja na kontrowersyjny werdykt. */
export function postAnswer(s0: GameState, key: string): GameState {
  const s = clone(s0);
  const run = s.run;
  const post = run?.post;
  if (!run || !post) return s0;
  const opt = post.options.find((x) => x.key === key);
  if (!opt) return s0;
  run.post = null;
  const rep = run.fights[run.fights.length - 1];
  withRng(s, (rng) => {
    const ok = opt.chance === undefined || rng.chance(opt.chance / 100);
    const fansBase = [40, 200, 1200, 6000, 40000][s.tier] ?? 200;
    let text = '';
    let tone: Moment['tone'] = ok ? 'good' : 'bad';
    switch (key) {
      case 'champ':
        if (ok) {
          s.flags.titleCall = 1;
          if ((s.rank ?? 99) <= 3) s.flags.micTitle = (s.flags.micTitle ?? 0) + 1;
          s.media = clamp(s.media + 4, 0, 100);
          addFans(s, fansBase * 3);
          text = (s.rank ?? 99) <= 3
            ? 'Patrzysz prosto w kamerę i wywołujesz mistrza po nazwisku. Hala wybucha, a po godzinie mistrz odpisuje: „Chcesz? To masz”. Następna walka: o pas.'
            : 'Wywołujesz mistrza po nazwisku. Federacja lubi ten szum, ale na pas jeszcze za wcześnie: dostaniesz eliminator z kimś z samej czołówki.';
          tone = 'purple';
        } else {
          s.media = clamp(s.media + 2, 0, 100);
          s.rep = clamp(s.rep - 4, 0, 100);
          addFans(s, fansBase);
          text = 'Wywołujesz mistrza, a on w wywiadzie tylko się śmieje: „Najpierw niech zasłuży”. Internet ma używanie, w federacji kręcą głowami.';
        }
        break;
      case 'up':
        if (ok) {
          s.flags.callUp = 1;
          s.media = clamp(s.media + 2, 0, 100);
          addFans(s, fansBase * 1.5);
          text = 'Wywołujesz kogoś z czołówki. Federacja kupuje ten pomysł: następny rywal będzie wyżej w rankingu.';
        } else {
          s.media = clamp(s.media + 1, 0, 100);
          addFans(s, fansBase * 0.5);
          text = 'Wywołany zawodnik odpowiada, że ma inne plany. Kibice to zapamiętali, federacja niekoniecznie.';
          tone = 'neutral';
        }
        break;
      case 'rival':
        s.flags.rivalCallout = 1;
        s.media = clamp(s.media + 3, 0, 100);
        addFans(s, fansBase * 2);
        text = 'Mówisz do kamery, że czas wyrównać rachunki z odwiecznym rywalem. Organizator już liczy bilety.';
        tone = 'purple';
        break;
      case 'super':
        if (ok) {
          s.flags.superCall = 1;
          s.media = clamp(s.media + 5, 0, 100);
          addFans(s, fansBase * 4);
          text = 'Z pasem na ramieniu wywołujesz mistrza kategorii obok. Federacja zaciera ręce: superfight jest w planach.';
          tone = 'purple';
        } else {
          s.media = clamp(s.media + 2, 0, 100);
          addFans(s, fansBase);
          text = 'Wywołujesz mistrza kategorii obok, ale jego obóz mówi, że „nie walczy w dół ani w górę”. Może kiedyś.';
          tone = 'neutral';
        }
        break;
      case 'thanks':
        s.rep = clamp(s.rep + 2, 0, 100);
        addFans(s, fansBase * 0.6);
        text = 'Dziękujesz trenerowi, rodzinie i kibicom, którzy przyjechali za tobą. Krótko i z klasą.';
        tone = 'good';
        break;
      case 'rematch':
        if (ok) {
          s.rematchOpp = { ...rep.opp, stats: { ...rep.opp.stats }, record: { ...rep.opp.record }, rank: rep.defense && rep.result === 'L' ? 0 : rep.opp.rank };
          s.media = clamp(s.media + 2, 0, 100);
          addFans(s, fansBase);
          text = 'Federacja ogląda walkę jeszcze raz i przyznaje: należy się rewanż. Wraca przy najbliższej okazji.';
          tone = 'purple';
        } else {
          s.rep = clamp(s.rep - 1, 0, 100);
          text = 'Federacja odpowiada krótko: werdykt jest werdyktem, a ona ma inne plany na tego rywala.';
          tone = 'neutral';
        }
        break;
      case 'class':
        s.rep = clamp(s.rep + 3, 0, 100);
        text = 'Mówisz, że wrócisz silniejszy, i gratulujesz rywalowi. Środowisko to docenia.';
        tone = 'good';
        break;
      case 'rant':
        s.media = clamp(s.media + 3, 0, 100);
        s.rep = clamp(s.rep - 3, 0, 100);
        addFans(s, fansBase * 3);
        text = 'Nagrywasz wściekły film o „skorumpowanych sędziach”. Milion wyświetleń, ale w federacji nikt się nie uśmiecha.';
        tone = 'neutral';
        break;
    }
    if (rep && text) rep.moments.push({ round: rep.round, title: post.kind === 'mic' ? 'Mikrofon' : 'Po werdykcie', text, tone });
    if (rep) rep.postChoice = { key, ok };
  });
  return s;
}

/** Ksywka zależna od tego, jak wygrywasz (raz na karierę). */
function fanNickFor(rng: Rng, s: GameState): string | null {
  const proWins = s.history.filter((h) => !h.amateur && !h.freak && h.result === 'W');
  const ko = proWins.filter((h) => h.method === 'KO/TKO').length;
  const sub = proWins.filter((h) => h.method === 'Poddanie').length;
  const dec = proWins.filter((h) => h.method.startsWith('Decyzja')).length;
  if ((s.flags.shortWins ?? 0) >= 2) return 'Strażak';
  if (ko >= 3 && ko >= sub) return rng.pick(['Młot', 'Kowadło', 'Dynamit', 'Kafar']);
  if (sub >= 3) return rng.pick(['Anakonda', 'Pyton', 'Imadło', 'Dusiciel']);
  if (s.flags.offTheCanvas && s.flags.comeback) return 'Feniks';
  if (dec >= 6 && ko + sub <= 1) return rng.pick(['Profesor', 'Szachista', 'Księgowy']);
  if ((s.flags.grapplingGold ?? 0) >= 2) return 'Kimono';
  return null;
}

/** Po wygranej: mikrofon w klatce. Po kontrowersyjnej porażce: reakcja na werdykt. */
function buildPost(rng: Rng, s: GameState, rep: FightReport): PostFight | null {
  if (rep.amateur || rep.freak || rep.tuneup || rep.abroad || s.tier < 1 || s.contract.kind === 'freak') return null;
  if (s.quick && !rep.sim.big) return null;
  const finish = rep.method === 'KO/TKO' || rep.method === 'Poddanie' || rep.method === 'Lekarz';
  if (rep.result === 'W') {
    if ((s.flags[`mic:${s.season}`] ?? 0) >= 2) return null;
    const p = finish ? 0.85 : rep.spot === 'wstępna' ? 0.25 : 0.5;
    if (!rep.title && !rep.superfight && !rng.chance(p)) return null;
    s.flags[`mic:${s.season}`] = (s.flags[`mic:${s.season}`] ?? 0) + 1;
    const opts: PostFight['options'] = [];
    const rk = s.rank;
    if (rk === 0 && s.tier >= 3 && s.titleDefenses >= 1 && (s.flags.superDone ?? 0) < 2 && !rep.superfight)
      opts.push({ key: 'super', label: 'Wywołaj mistrza kategorii obok', desc: 'Superfight o drugi pas. Wielkie pieniądze, jeśli federacja to kupi.', chance: Math.round(clamp(30 + s.media / 3 + (finish ? 10 : 0), 15, 80)) });
    if (rk !== null && rk !== 0 && rk <= 6 && !(s.flags.interim ?? 0))
      opts.push({ key: 'champ', label: 'Wywołaj mistrza', desc: 'Uda się: następna walka o pas. Nie uda: wyjdziesz na pyszałka.', chance: Math.round(clamp(12 + s.media / 3 + (finish ? 12 : 0) + (rk <= 2 ? 20 : rk <= 4 ? 10 : 0), 8, 80)) });
    if (rk !== 0)
      opts.push({ key: 'up', label: rk === null ? 'Wywołaj kogoś z rankingu' : 'Wywołaj kogoś z czołówki', desc: 'Mocniejszy rywal w następnej walce i większy skok w rankingu po wygranej.', chance: Math.round(clamp(42 + s.media / 4 + (finish ? 10 : 0), 20, 88)) });
    const rival = s.rivalId ? s.peers.find((x) => x.id === s.rivalId && !x.retired && x.tier === s.tier) : undefined;
    if (rival && rival.id !== rep.opp.id && rk !== 0) opts.push({ key: 'rival', label: `Wywołaj rywala: ${rival.lastName}`, desc: 'Pewna walka z odwiecznym rywalem przy najbliższej okazji.' });
    opts.push({ key: 'thanks', label: 'Podziękuj i zejdź z klatki', desc: 'Bez show. Trochę szacunku w środowisku.' });
    const lead = finish ? `${rep.opp.lastName} jeszcze dochodzi do siebie, a ty dostajesz mikrofon.` : 'Ręka w górze. Komentator podaje ci mikrofon.';
    return { kind: 'mic', title: 'Mikrofon jest twój', text: `${lead} Cała hala i transmisja czekają, co powiesz.`, options: opts.slice(0, 4) };
  }
  if (rep.result === 'L' && !rep.superfight && (rep.method === 'Decyzja niejednogłośna' || rep.method === 'Decyzja większościowa')) {
    const chance = Math.round(clamp(35 + s.media / 3 + (rep.title ? 15 : 0) + (rep.opp.peer ? 10 : 0), 15, 85));
    return {
      kind: 'robbed',
      title: 'Kontrowersyjny werdykt',
      text: 'Hala gwiżdże, w internecie wrze. Wielu uważa, że to ty wygrałeś. Co robisz?',
      options: [
        { key: 'rematch', label: 'Domagaj się rewanżu', desc: 'Federacja może dać ci tę samą walkę jeszcze raz.', chance },
        { key: 'class', label: 'Przyjmij werdykt z klasą', desc: 'Reputacja w górę. Idziesz dalej.' },
        { key: 'rant', label: 'Nagraj wściekły film', desc: 'Dużo obserwujących, ale federacja się obrazi.' },
      ],
    };
  }
  return null;
}

export function prepCost(s: GameState, o: FightOffer): number {
  // sparingpartnerzy w stylu rywala i analityk: realnie kilka do kilkudziesięciu tysięcy na obóz
  const cap = [1000, 2500, 8000, 18000, 40000][s.tier] ?? 8000;
  return Math.round(clamp(o.purse * 0.15, 800, cap) / 100) * 100;
}

export function acceptOffer(s0: GameState, prep: 'std' | 'rival' | 'hard' = 'std', tickets: TicketPlan = 'std'): GameState {
  const s = clone(s0);
  const o = s.run?.offer;
  if (!o) return s0;
  // zastępstwo: bez obozu
  o.prep = o.short ? 'std' : prep === 'rival' && s.money < prepCost(s, o) ? 'std' : prep;
  if (ticketsAvailable(s, o)) o.tickets = tickets;
  // zastępstwo to walka ponad plan
  if (o.short || o.abroad) s.run!.planned += 1;
  s.run!.offer = null;
  const bigPress = !!(o.title || o.rival || o.superfight || o.opp.freak || o.nemesis || o.farewell);
  const lastHadPress = s.run!.fights[s.run!.fights.length - 1]?.pressMod !== undefined;
  if (pressEligible(o) && !s.run!.autoAccept && (bigPress || (!lastHadPress && (s.run!.fights.length + s.season) % 2 === 0))) {
    withRng(s, (rng) => {
      o.pressQuote = rng.pick(PRESS_QUOTES).replace('{n}', s.profile.lastName);
      o.pressCtx = pressContext(s, o, rng);
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
  const o0 = s0.run.offer;
  if (o0.tuneup || o0.short || o0.superfight || o0.abroad) {
    const s = clone(s0);
    withRng(s, (rng) => {
      s.run!.notes = s.run!.notes ?? [];
      s.run!.notes.push(
        o0.abroad
          ? `Odmawiasz wyjazdu do miasta ${o0.abroad}. Zostajesz przy swojej federacji.`
          : o0.short
          ? `Odmawiasz zastępstwa (${o0.opp.firstName} ${o0.opp.lastName}). Bez obozu to loteria, czekasz na swoją walkę.`
          : o0.superfight
            ? `Odmawiasz superfightu. Skupiasz się na obronie pasa w swojej kategorii.`
            : `Odmawiasz walki na ${o0.gala.split(' · ')[0]}. Federacja ma dla ciebie normalnego rywala.`,
      );
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
  if (s.flags.farewell) return [1, 1];
  const f = s.contract.fights;
  return [Math.max(1, f - 1), Math.min(5, f + 1)];
}
export function plannedFights(s: GameState): number {
  if (s.flags.farewell && s.tier > 0 && s.contract.kind !== 'freak') return 1;
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
  // gala za granicą: poza rankingiem
  if (rep.abroad) return;
  // superfight: twój pas nie jest stawką, w rankingu nic się nie zmienia
  if (rep.superfight) {
    if (res === 'W') {
      s.flags.superDone = (s.flags.superDone ?? 0) + 1;
      s.flags.doubleChamp = 1;
      // drugi pas trzymasz, dopóki bronisz swojego; po roku federacja każe wybrać kategorię
      s.flags.doubleActive = s.season;
      const name = `${BELT_NAMES[s.tier]} wagi ${rep.superfight} (superfight)`;
      s.belts.push({ name, season: s.season, age: s.age });
      log(s, `👑 Podwójny mistrz! Superfight wygrany z ${opp.firstName} ${opp.lastName} (w wadze ${rep.superfight}).`);
    } else if (res === 'D') {
      s.flags.superDone = (s.flags.superDone ?? 0) + 1;
      log(s, `Remis w superfighcie z ${opp.firstName} ${opp.lastName}.`);
    } else {
      s.flags.superDone = (s.flags.superDone ?? 0) + 1;
      // przegrany superfight podważa pozycję mistrza: następna obrona z numerem 1
      s.flags.superLoss = 1;
      s.rep = clamp(s.rep - 6, 0, 100);
      s.media = clamp(s.media - 2, 0, 100);
      log(s, `Przegrany superfight z ${opp.firstName} ${opp.lastName}. Pas zostaje, ale pozycja mistrza się chwieje.`);
    }
    return;
  }
  // pas tymczasowy: wygrany czeka na unifikację
  if (rep.interim) {
    if (res === 'W') {
      s.flags.interim = 1;
      s.flags.interimBelts = (s.flags.interimBelts ?? 0) + 1;
      s.rank = 1;
      log(s, `Pas tymczasowy (${galaPrefix(rep.fed)}). Pokonany: ${opp.firstName} ${opp.lastName}.`);
    } else s.rank = res === 'D' ? 2 : 3;
    return;
  }
  if (rep.title && !rep.defense) {
    if (rep.unify) s.flags.interim = 0;
    if (res === 'W') {
      s.rank = 0;
      s.titleDefenses = 0;
      const name = `${BELT_NAMES[s.tier]} (${galaPrefix(rep.fed)})`;
      s.belts.push({ name, season: s.season, age: s.age });
      log(s, `🏆 ${name}${rep.unify ? ' po unifikacji' : ''}. Pokonany mistrz: ${opp.firstName} ${opp.lastName}.`);
    } else if (res === 'L') s.rank = 2;
    return;
  }
  if (rep.defense) {
    if (res === 'W' || res === 'D') {
      s.titleDefenses++;
      s.flags.maxDef = Math.max(s.flags.maxDef ?? 0, s.titleDefenses);
      if (res === 'W') log(s, `Obrona pasa nr ${s.titleDefenses} (${opp.lastName}).`);
      // mistrz bez wagi: wygrana na zero, bo federacja i tak odbiera pas
      if (rep.weightMiss) {
        s.rank = 1;
        s.titleDefenses = 0;
        s.flags.stripped = (s.flags.stripped ?? 0) + 1;
        rep.stripped = true;
        rep.moments.push({ round: rep.round, title: 'Pas odebrany', text: 'Wygrywasz, ale mistrz, który nie zrobił wagi, nie może zatrzymać pasa. Federacja ogłasza wakat, a ty spadasz na pierwsze miejsce w rankingu.', tone: 'bad' });
        log(s, 'Federacja odbiera pas: mistrz nie zrobił wagi przed obroną.');
      }
    } else {
      s.rank = 1;
      s.flags.doubleActive = 0;
      log(s, `Pas stracony. Nowy mistrz: ${opp.firstName} ${opp.lastName}.`);
    }
    return;
  }
  // mistrz traci pas tylko w walce o pas
  if (mine === 0) return;
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
    // uratowana gala: organizator i ranking to pamiętają
    if (rep.short) next -= 2;
    s.rank = clamp(next, 1, size + 2);
  } else if (res === 'L') {
    // przegrana na zastępstwie nikogo nie dziwi: w rankingu tylko o jedno miejsce w dół
    s.rank = rep.short ? cur + 1 : cur + 2 + (finish ? 1 : 0);
  }
  if (s.rank !== null && s.rank > size) s.rank = null;
}

/** Zadra: rywal ze składu, który cię pokonał przed czasem albo dwa razy. Rewanż daje rozgłos, wygrana wyrównuje rachunki. */
function nemesisAfterFight(s: GameState, rep: FightReport, rf: RosterFighter, res: 'W' | 'L' | 'D') {
  const opp = rep.opp;
  const nem = s.nemesis;
  if (nem && nem.id === opp.id) {
    rep.nemesis = true;
    if (res === 'W') {
      s.media = clamp(s.media + 4, 0, 100);
      s.rep = clamp(s.rep + 2, 0, 100);
      if (rf.h2h.w >= rf.h2h.l) {
        s.nemesis = null;
        s.flags.nemesisSettled = (s.flags.nemesisSettled ?? 0) + 1;
        rep.moments.push({ round: rep.round, title: 'Rachunki wyrównane', text: `${opp.firstName} ${opp.lastName} leży, a ty patrzysz mu w oczy. Teraz ${h2hWords(rf.h2h.w, rf.h2h.l)}. Zadra wyjęta, kibice to pamiętają.`, tone: 'good' });
      } else
        rep.moments.push({ round: rep.round, title: 'Zadra', text: `Wygrana z rywalem, który zalazł ci za skórę. Teraz ${h2hWords(rf.h2h.w, rf.h2h.l)}, jeszcze jedna i rachunki wyrównane.`, tone: 'good' });
    } else if (res === 'L') {
      s.media = clamp(s.media + 1, 0, 100);
      rep.moments.push({ round: rep.round, title: 'Zadra', text: `${opp.lastName} znowu górą: ${h2hWords(rf.h2h.w, rf.h2h.l)}. W mediach śmieje się, że ma cię „w kieszeni”.`, tone: 'bad' });
    }
    return;
  }
  if (res !== 'L' || nem) return;
  const finish = rep.method === 'KO/TKO' || rep.method === 'Poddanie';
  if (!finish && rf.h2h.l < 2) return;
  s.nemesis = { id: opp.id, name: `${opp.firstName} ${opp.lastName}`, fed: s.fed, tier: s.tier, div: divisionKey(s), since: s.season };
  rep.moments.push({
    round: rep.round,
    title: 'Zadra',
    text: `${opp.lastName} po walce nie podaje ci ręki, a w wywiadzie mówi, że „to było za łatwe”. Od dziś to sprawa osobista. Rewanż z nim da więcej pieniędzy i rozgłosu.`,
    tone: 'bad',
  });
}

/** Zadra z obecnej federacji i kategorii (do oferty rewanżu). */
export function nemesisFighter(s: GameState): RosterFighter | undefined {
  const n = s.nemesis;
  if (!n || n.fed !== s.fed || n.tier !== s.tier || n.div !== divisionKey(s)) return undefined;
  return rosterFighter(s, n.id);
}

function finalizeFight(rng: Rng, s: GameState, rep: FightReport) {
  const opp = rep.opp;
  if (rep.farewell) s.flags.farewellDone = 1;
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
  if (res === 'L' && (rep.method === 'KO/TKO' || rep.method === 'Lekarz')) {
    s.finishes.koLosses++;
    // szczęka słabnie: każdy nokaut zostawia ślad na zawsze, a kolejne przychodzą łatwiej
    const kl = s.finishes.koLosses;
    const drop = rep.amateur ? 0 : kl >= 5 ? 2 : 1;
    s.stats.chin = clamp(s.stats.chin - drop, 1, 99);
    s.potential.chin = Math.max(s.stats.chin, s.potential.chin - drop);
    if (!rep.amateur && (kl === 4 || kl === 7 || kl === 8))
      rep.moments.push({
        round: rep.round,
        title: kl >= 8 ? 'Ostatnie ostrzeżenie' : 'Szczęka słabnie',
        text:
          kl >= 8
            ? `Ósmy nokaut w karierze. Lekarz komisji mówi wprost: przy dziewiątym nie dostaniesz już licencji.`
            : kl === 7
              ? 'Siódmy nokaut. Na sparingach coraz łatwiej cię trafić, a każdy cios w szczękę czujesz bardziej niż kiedyś.'
              : 'Czwarty nokaut w karierze. Neurolog ostrzega: każdy kolejny będzie przychodził łatwiej.',
        tone: 'bad',
      });
  }
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
    s.rep = clamp(s.rep - (rep.freak ? 8 : rep.short ? 0 : 1), 0, 100);
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
  // Wybraniec: każdy chce zrobić sobie nazwisko na tobie, więc wojny są cięższe
  if (s.profile.start === 'wybraniec' && !rep.amateur) s.wear = clamp(s.wear + 0.5 + dmgTaken / 70, 0, 100);
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
  // stały bywalec federacji: przypomnienie bilansu
  const rf = !rep.amateur && !rep.freak && !opp.peer ? rosterFighter(s, opp.id) : undefined;
  if (rf && rf.h2h.w + rf.h2h.l + rf.h2h.d > 0)
    rep.moments.unshift({ round: 0, title: 'Znowu on', text: `${opp.firstName} ${opp.lastName}. Spotykacie się nie pierwszy raz, wasz bilans przed walką: ${rf.h2h.w}-${rf.h2h.l}${rf.h2h.d ? `-${rf.h2h.d}` : ''}.`, tone: 'neutral' });
  updateRank(s, rep);
  rep.rankAfter = s.rank;
  if (rf) rosterAfterFight(s, opp.id, res, rep.title && !rep.interim && !rep.superfight, rep.defense, rep.rankBefore);
  else rosterSync(s);
  if (rf) nemesisAfterFight(s, rep, rf, res);
  // wiadomości z federacji między walkami
  if (!rep.amateur && !rep.freak && s.run && rng.chance(0.75)) {
    const n = rosterNews(rng, s, rep.idx + 1);
    if (n) (s.run.news ??= []).push(n);
  }
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
      if (!s.rivalId && (res === 'L' || p.metCount >= 2)) {
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
          text: `${p.firstName} ${p.lastName}. Przed walką ${h2hWords(p.h2h.w - (res === 'W' ? 1 : 0), p.h2h.l - (res === 'L' ? 1 : 0))}. Hala jest pełna, bo wszyscy wiedzą, że tu nie chodzi tylko o ranking.`,
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
        'Bez fajerwerków, ale pewnie. Sędziowie zgodni co do zwycięzcy.',
        `${n} do końca szukał jednego ciosu. Nie znalazł.`,
        'Trzech sędziów, trzy karty po twojej stronie. Trener kiwa głową, czyli jest zadowolony.',
        `${n} po walce mówi, że następnym razem będzie inaczej. Każdy tak mówi.`,
        'Po werdykcie ktoś z sektora krzyczy, że się spodziewał. To ten sam człowiek, który w drugiej rundzie krzyczał „koniec z tobą”.',
        'Wygrana na kartach. Nie najładniejsza, ale do rekordu się liczy.',
      ],
      'W:Decyzja niejednogłośna': ['Twój trener ogląda ogłoszenie werdyktu z zamkniętymi oczami. Otwiera je dopiero, kiedy słyszy twoje nazwisko.', 'Wyrównana wojna. Dwóch sędziów punktuje dla ciebie, jeden dla niego.', `Część hali gwiżdże, ${n} kręci głową, ale to twoja ręka idzie w górę.`],
      'W:Decyzja większościowa': ['Jeden sędzia dał remis, dwóch ciebie. Wystarczy.', 'Sędzia punktowy numer trzy chyba oglądał inną walkę. Na szczęście pozostali dwaj nie.'],
      'L:Decyzja jednogłośna': ['W szatni mama dzwoni z pytaniem, czy jadłeś. To jedyna dobra wiadomość tego wieczoru.', `${n} był dziś po prostu lepszy. Długa droga do szatni.`, 'Goniłeś go przez całą walkę i nie dogoniłeś.', 'Trener w szatni mówi tylko: „wracamy do roboty”.', `${n} rozbił walkę na kawałki. Trzeba to obejrzeć jeszcze raz i wyciągnąć wnioski.`],
      'L:Decyzja niejednogłośna': [`Sędzia, który punktował dla ciebie, macha ci z trybun. Pozostali dwaj patrzą w telefony.`, 'Jeden sędzia był z tobą, dwóch nie. W szatni cisza.', 'Kibice krzyczą twoje nazwisko, ale sędzia podnosi drugą rękę.', 'Internet pisze o skandalu, ale w rekordzie i tak zostaje porażka.'],
      'L:Decyzja większościowa': ['Remis u jednego sędziego, porażka u dwóch. Boli.'],
      'D:Remis': ['Remis. Babcia przez telefon pyta, kto wygrał. Nie umiesz jej tego wytłumaczyć.', 'Remis. Nikt nie jest zadowolony, wszyscy chcą rewanżu.', 'Remis. Organizator już zaciera ręce na rewanż.'],
    };
    const pool = (lines[`${res}:${rep.method}`] ?? []).filter((t) => rep.sim.maxRounds === 3 || !/Trzy rundy|Każda runda/.test(t));
    if (pool.length && !rep.moments.some((m) => m.title === 'Dogrywka'))
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

  // obserwujący
  const fans = fanGain(
    s,
    { result: res, finish: rep.method === 'KO/TKO' || rep.method === 'Poddanie', title: rep.title || !!rep.superfight, freak: rep.freak, bonus: !!rep.bonus, tier: s.tier, amateur: rep.amateur },
    rng.next(),
  );
  if (fans > 0) {
    rep.fans = fans;
    addFans(s, fans);
  }
  if (rep.short && res === 'W') {
    s.flags.shortWins = (s.flags.shortWins ?? 0) + 1;
    s.rep = clamp(s.rep + 2, 0, 100);
    s.media = clamp(s.media + 2, 0, 100);
    rep.moments.push({ round: rep.round, title: 'Uratowana gala', text: 'Wziąłeś walkę z sześciodniowym wyprzedzeniem i wygrałeś. Organizator nie zapomni, ranking też nie.', tone: 'purple' });
  }
  if (rep.abroad) {
    if (res === 'W') {
      s.media = clamp(s.media + 4, 0, 100);
      s.rep = clamp(s.rep + 2, 0, 100);
      s.flags.abroadWins = (s.flags.abroadWins ?? 0) + 1;
    } else if (res === 'L') {
      s.rep = clamp(s.rep - 1, 0, 100);
    }
  }
  if (rep.superfight && res === 'W') {
    s.media = clamp(s.media + 10, 0, 100);
    s.rep = clamp(s.rep + 8, 0, 100);
    rep.moments.push({ round: rep.round, title: 'Podwójny mistrz', text: `Dwa pasy na dwóch ramionach. Mało komu w historii federacji się to udało.`, tone: 'purple' });
  }
  if (rep.interim && res === 'W')
    rep.moments.push({ round: rep.round, title: 'Tymczasowy mistrz', text: 'Pas tymczasowy jest twój. Teraz czeka cię walka z prawdziwym mistrzem, gdy wróci po kontuzji.', tone: 'purple' });

  // ksywka od kibiców po charakterystycznych walkach
  if (!rep.amateur && !rep.freak && res === 'W' && !s.fanNick) {
    const nick = fanNickFor(rng, s);
    if (nick) {
      s.fanNick = nick;
      const had = !!s.profile.nickname;
      if (!had) s.profile.nickname = nick;
      log(s, `Kibice nazywają cię „${nick}”.`);
      rep.moments.push({ round: rep.round, title: 'Nowa ksywka', text: had ? `Na trybunach ktoś krzyczy „${nick}!” i cała hala to podchwytuje. Oficjalnie dalej jesteś „${s.profile.nickname}”, ale kibice wiedzą swoje.` : `Na trybunach ktoś krzyczy „${nick}!” i cała hala to podchwytuje. Od dziś na plakatach jesteś „${nick}”.`, tone: 'purple' });
    }
  }

  if (rep.amateur) advanceTourney(s, rep, res);
  else if (s.run!.fights.length >= s.run!.planned) s.run!.done = true;
  if (s.flags.injuryStop) {
    s.flags.injuryStop = 0;
    s.run!.done = true;
  }
  if (rep.result) s.run!.post = buildPost(rng, s, rep);
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

const fmtK = (n: number) => {
  const a = Math.abs(n);
  const v = a >= 1e6 ? `${(a / 1e6).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} mln zł` : `${Math.round(a / 1000).toLocaleString('pl-PL')} tys. zł`;
  return `${n >= 0 ? '+' : '−'}${v}`;
};

// ---------------------------------------------------------------------------
// Cel roku od federacji: wybierasz jeden z trzech, nagroda po roku
// ---------------------------------------------------------------------------

export interface YearGoal {
  id: string;
  label: string;
  desc: string;
  /** mnożnik gaży jako nagroda */
  pay: number;
  extra?: string;
  need: number;
  progress: (s: GameState, fights: FightReport[]) => number;
}

const proFights = (fights: FightReport[]) => fights.filter((f) => f.result && !f.amateur && !f.freak);
export const YEAR_GOALS: YearGoal[] = [
  { id: 'wins', label: 'Trzy wygrane', desc: 'Wygraj co najmniej trzy walki w tym roku.', pay: 1.2, need: 3, progress: (_s, f) => proFights(f).filter((x) => x.result === 'W').length },
  { id: 'finish', label: 'Dwa skończenia', desc: 'Skończ dwóch rywali przed czasem.', pay: 1.8, extra: 'media +3', need: 2, progress: (_s, f) => proFights(f).filter((x) => x.result === 'W' && (x.method === 'KO/TKO' || x.method === 'Poddanie')).length },
  { id: 'clean', label: 'Rok bez porażki', desc: 'Co najmniej dwie walki i ani jednej przegranej.', pay: 1.5, extra: 'reputacja +3', need: 2, progress: (_s, f) => (proFights(f).some((x) => x.result === 'L') ? 0 : proFights(f).length) },
  { id: 'top5', label: 'Pokonaj czołówkę', desc: 'Wygraj z kimś z top 5 rankingu.', pay: 0.7, extra: 'media +2', need: 1, progress: (_s, f) => proFights(f).filter((x) => x.result === 'W' && x.opp.rank !== null && x.opp.rank <= 5).length },
  { id: 'bonus', label: 'Bonus wieczoru', desc: 'Zgarnij bonus za walkę, nokaut albo poddanie wieczoru.', pay: 1.4, extra: 'obserwujący', need: 1, progress: (_s, f) => proFights(f).filter((x) => x.bonus).length },
  { id: 'climb', label: 'Skok w rankingu', desc: 'Skończ rok co najmniej trzy miejsca wyżej niż zacząłeś (albo wejdź do rankingu).', pay: 0.7, need: 3, progress: (s) => {
      const st = s.run?.startRank ?? null;
      if (s.rank === null) return 0;
      if (st === null) return 3;
      return Math.max(0, st - s.rank);
    } },
];

/** Trzy cele do wyboru na ten rok (stałe dla danego roku). */
export function yearGoalOptions(s: GameState): YearGoal[] {
  if (!s.proDebut || s.tier < 1 || s.contract.kind === 'freak') return [];
  const rng = createRng((s.createdAt ^ (s.season * 2654435761)) >>> 0);
  const pool = YEAR_GOALS.filter((g) => !(g.id === 'top5' && (s.rank === null || s.rank > 9)) && !(g.id === 'wins' && plannedFights(s) < 3) && !(g.id === 'climb' && s.rank !== null && s.rank <= 3));
  const out: YearGoal[] = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  return out;
}

export function yearGoalReward(s: GameState, g: YearGoal): number {
  return Math.round((s.contract.purse * g.pay) / 500) * 500;
}

export function setYearGoal(s0: GameState, id: string | null): GameState {
  const s = clone(s0);
  s.yearGoal = id ? { season: s.season, id } : null;
  return s;
}

export function currentYearGoal(s: GameState): YearGoal | null {
  if (!s.yearGoal || s.yearGoal.season !== s.season) return null;
  return YEAR_GOALS.find((g) => g.id === s.yearGoal!.id) ?? null;
}

/** Rozliczenie celu roku (w podsumowaniu). */
function settleYearGoal(s: GameState, run: NonNullable<GameState['run']>): { label: string; ok: boolean; reward: number } | null {
  const g = currentYearGoal(s);
  if (!g || run.tourneys) return null;
  const ok = Math.min(g.need, g.progress(s, run.fights)) >= g.need;
  const reward = ok ? yearGoalReward(s, g) : 0;
  if (ok) {
    s.money += reward;
    s.totalEarned += reward;
    if (g.id === 'finish') s.media = clamp(s.media + 3, 0, 100);
    if (g.id === 'clean') s.rep = clamp(s.rep + 3, 0, 100);
    if (g.id === 'top5') s.media = clamp(s.media + 2, 0, 100);
    if (g.id === 'bonus') addFans(s, [0, 300, 1500, 8000, 40000][s.tier] ?? 500);
    s.flags.yearGoals = (s.flags.yearGoals ?? 0) + 1;
  }
  return { label: g.label, ok, reward };
}

/** Co działo się poza klatką w tym roku (do podsumowania). */
function outsideRows(s: GameState, run: NonNullable<GameState['run']>): SeasonSummary['outside'] {
  const rows: NonNullable<SeasonSummary['outside']> = [];
  const yg = settleYearGoal(s, run);
  if (yg) rows.push({ icon: yg.ok ? 'check' : 'x', label: `Cel roku: ${yg.label}`, value: yg.ok ? `zaliczony, premia ${yg.reward.toLocaleString('pl-PL')} zł` : 'nie udało się' });
  const fans = followersOf(s) - (run.startFans ?? followersOf(s));
  if (fans > 0 && !run.tourneys) rows.push({ icon: 'phone', label: 'Obserwujący', value: `+${fmtFans(fans)} (razem ${fmtFans(followersOf(s))})` });
  const tix = run.fights.filter((f) => f.tickets);
  if (tix.length) {
    const sold = tix.reduce((a, f) => a + f.tickets!.sold, 0);
    const cut = tix.reduce((a, f) => a + f.tickets!.cut, 0);
    rows.push({ icon: 'ticket', label: 'Bilety', value: sold ? `${sold} ${pl(sold, 'bilet', 'bilety', 'biletów')}, prowizja ${cut.toLocaleString('pl-PL')} zł` : 'nic nie sprzedałeś' });
  }
  const bonuses = run.fights.filter((f) => f.bonus).length;
  if (bonuses) rows.push({ icon: 'star', label: 'Bonusy wieczoru', value: run.fights.filter((f) => f.bonus).map((f) => f.bonus!.toLowerCase()).join(', ') });
  for (const x of run.sideLog ?? []) rows.push({ icon: x.tone === 'bad' ? 'x' : 'trophy', label: x.title, value: x.lines[x.lines.length - 1] });
  const POST: Record<string, (ok: boolean) => string> = {
    champ: (ok) => (ok ? 'wywołany mistrz przyjął wyzwanie' : 'mistrz wyśmiał wywołanie'),
    up: (ok) => (ok ? 'wywołany zawodnik z czołówki przyjął walkę' : 'wywołanie bez odzewu'),
    rival: () => 'wywołany odwieczny rywal',
    super: (ok) => (ok ? 'superfight w planach' : 'mistrz kategorii obok odmówił'),
    thanks: () => 'podziękowania bez show',
    rematch: (ok) => (ok ? 'wywalczony rewanż' : 'federacja odmówiła rewanżu'),
    class: () => 'werdykt przyjęty z klasą',
    rant: () => 'wściekły film w internecie',
  };
  for (const f of run.fights) {
    if (!f.postChoice) continue;
    const isMic = f.moments.some((mm) => mm.title === 'Mikrofon');
    rows.push({ icon: isMic ? 'mic' : 'scale', label: `${isMic ? 'Mikrofon' : 'Po werdykcie'} · ${f.opp.lastName}`, value: POST[f.postChoice.key]?.(f.postChoice.ok) ?? '' });
  }
  return rows.length ? rows : undefined;
}

export function toSummary(s0: GameState): GameState {
  const s = clone(s0);
  s.flags.sideTired = 0;
  const run = s.run!;
  const fights = run.fights.filter((f) => f.result);
  const w = fights.filter((f) => f.result === 'W').length;
  const l = fights.filter((f) => f.result === 'L').length;
  const d = fights.filter((f) => f.result === 'D').length;
  const total = Math.max(1, w + l + d);
  const moneyDelta = s.money - (s.flags.moneyStart ?? run.startMoney);
  const beltWon = fights.some((f) => ((f.title && !f.defense && !f.interim) || f.superfight) && f.result === 'W') || (run.tourneys ?? []).some((t) => t.championship && t.medal === 'gold');
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
    { label: 'Bilans kasy', value: Math.round(clamp(50 + (moneyDelta / Math.max(5000, TIER_PURSE[s.tier][1] * 2)) * 60, 5, 100)), note: `${fmtK(moneyDelta)} po kosztach` },
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
  if (peerFight) lines.push(`${peerFight.opp.id === s.rivalId ? 'Starcie z odwiecznym rywalem' : 'Pojedynek z kolegą z rocznika'} (${peerFight.opp.firstName} ${peerFight.opp.lastName}): ${peerFight.result === 'W' ? 'wygrany' : peerFight.result === 'L' ? 'przegrany' : 'remis'}.`);
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
    moneyFights: fights.reduce((a, f) => a + (f.earned ?? 0), 0),
    legacyFrom: s.flags.legacyPrev ?? 0,
    legacyTo: legacyScore(s),
    ovrFrom: s.flags.ovrStart ?? run.startOvr,
    ovrTo: ovr(s.stats),
    form: run.form.label,
    grade,
    bars,
    story: lines.join(' '),
    outside: outsideRows(s, run),
  };
  s.seasons.push(summary);
  s.lastSummary = summary;
  s.flags.legacyPrev = summary.legacyTo ?? 0;
  s.phase = 'summary';
  withRng(s, (rng) => {
    for (const p of s.peers) progressPeer(rng, p);
    if (s.flags.expBoost) delete s.flags.expBoost;
    const note = syncRival(rng, s);
    if (note) summary.story = `${summary.story} ${note}`.trim();
    const rn = rosterYear(rng, s);
    if (rn) summary.story = `${summary.story} ${rn}`.trim();
  });

  // cięcie z federacji
  if (s.tier >= 2 && s.rank === null && l >= Math.ceil(total * 0.6) && s.contract.kind !== 'freak') s.flags.cut = 1;
  if (s.tier === 1 && s.rank === null && l >= total && total >= 2) s.flags.cut = 1;
  rosterSync(s);
  return s;
}

// ---------------------------------------------------------------------------
// Upływ czasu
// ---------------------------------------------------------------------------

function ageOneYear(rng: Rng, s: GameState) {
  // podwójny mistrz: po pełnym roku drugi pas zostaje zwolniony (nie da się bronić dwóch kategorii naraz)
  if ((s.flags.doubleActive ?? 0) > 0 && s.season - s.flags.doubleActive >= 1) {
    s.flags.doubleActive = 0;
    log(s, 'Federacja każe wybrać kategorię. Zwalniasz drugi pas, zostajesz przy swoim.');
  }
  if (s.rank !== 0) s.flags.doubleActive = 0;
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
  s.wear = clamp(s.wear - (s.age < 28 ? 3 : 1) - (hasBackroom(s, 'clinic') ? 4 : 0), 0, 100);
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
  if ((s.flags.farewellDone ?? 0) > 0) {
    const h = s.history[s.history.length - 1];
    return h?.result === 'W'
      ? `Walka pożegnalna wygrana przed własną publicznością w mieście ${s.profile.hometown}. Zdejmujesz rękawice na środku klatki i kładziesz je na macie.`
      : h?.result === 'D'
        ? `Walka pożegnalna kończy się remisem. Hala i tak wstaje, a ty kładziesz rękawice na środku klatki.`
        : `Walka pożegnalna przegrana, ale hala w mieście ${s.profile.hometown} skanduje twoje nazwisko długo po werdykcie. Rękawice zostają na macie.`;
  }
  if (s.age >= 40) return 'Czterdziestka na karku. Komisja lekarska nie przedłuża ci licencji.';
  if (s.quick && s.age >= 35) return 'Szybka kariera dobiega końca: 35 lat i czas zawiesić rękawice.';
  if (s.wear >= 100) {
    const pick = <T,>(a: T[]) => a[(s.season * 7 + s.record.w * 3 + s.finishes.ko) % a.length];
    if (s.finishes.koLosses >= 6)
      return pick([
        'Rezonans głowy po ostatniej walce. Neurolog długo milczy, potem odkłada wyniki i mówi tylko: „Wystarczy”. Komisja nie przedłuża licencji.',
        'Po kolejnym nokaucie lekarz komisji kładzie ci rękę na ramieniu. Szczęka i głowa przyjęły już za dużo. Licencja cofnięta.',
      ]);
    if (s.finishes.subLosses >= 4)
      return pick([
        'Bark wyskakuje przy zwykłej rozgrzewce. Trzecia operacja w karierze nie wchodzi w grę, ortopeda skreśla dalsze walki.',
        'Łokieć po dźwigniach nie prostuje się do końca. Lekarze mówią jasno: albo klatka, albo sprawna ręka na resztę życia.',
      ]);
    return pick([
      'Lekarze nie dają ci zgody na kolejne walki. Za dużo przyjętych ciosów.',
      'Kolana, kręgosłup, barki: wyniki badań wyglądają jak u pięćdziesięciolatka. Komisja lekarska nie podpisuje zgody na kolejny sezon.',
      'Okulista wykrywa uszkodzenie siatkówki. Jeden mocny cios i możesz stracić oko. Licencji już nie dostaniesz.',
      'Organizm odmawia posłuszeństwa: obóz zaczyna się od zastrzyków, a kończy na rehabilitacji. Lekarz federacji mówi „dość” i tym razem to nie podlega dyskusji.',
    ]);
  }
  if (s.finishes.koLosses >= 9 && s.proDebut) return 'Dziewiąty nokaut w karierze. Komisja lekarska cofa licencję: szczęka już nie wytrzyma.';
  if ((s.flags.lastSeason ?? 0) > 0) return 'Obiecałeś rodzinie, że to ostatni rok. Dotrzymujesz słowa.';
  if (s.age >= 27 && s.finishes.koLosses >= 5 && s.history.slice(-4).filter((h) => h.result === 'L' && h.method === 'KO/TKO').length >= 3)
    return 'Trzy nokauty w czterech walkach. Trener rzuca ręcznik, tym razem za całą karierę.';
  if (s.money < -80000 && s.age >= 24 && s.tier <= 1) return 'Długi cię przygniotły. Wyjeżdżasz do pracy w Holandii i do klatki już nie wracasz.';
  return null;
}

// ---------------------------------------------------------------------------
// Rynek
// ---------------------------------------------------------------------------

/** Gaża za walkę z kontraktu: szczebel, pozycja w rankingu (rk 0..1, mistrz 1.2), federacja i mnożnik (media, trudność). */
export function contractPurse(tier: number, fed: string, rk: number, mult: number) {
  const [lo, hi] = TIER_PURSE[tier];
  const excl = isExclusiveFed(fed);
  return Math.round(((lo + (hi - lo) * Math.max(0, rk) ** 1.6) * fedPay(fed) * mult * (excl ? EXCLUSIVE_BONUS : 1)) / 500) * 500;
}

function contractFor(rng: Rng, s: GameState, tier: number, kind: Contract['kind'], startRank: number | null): Contract {
  const rk = startRank === null ? 0 : startRank === 0 ? 1.2 : 1 - startRank / (RANK_SIZE[tier] + 1);
  const mediaF = 1 + s.media / 200;
  const hard = s.profile.difficulty === 'hard' ? 0.85 : 1;
  const stigma = kind !== 'freak' && (s.flags.freakStigma ?? 0) > 0 ? 0.8 : 1;
  const fed = tier === s.tier && kind === 'stay' ? s.fed : fedFor(rng, tier, s.profile.region);
  // wyłączność: gala płaci trochę więcej, ale nie puszcza na inne gale
  const excl = kind !== 'freak' && isExclusiveFed(fed);
  const purse = contractPurse(tier, fed, rk, mediaF * hard * stigma);
  return {
    id: uid(rng, 'k'),
    tier,
    fed,
    exclusive: excl || undefined,
    kind,
    seasons: tier >= 2 ? rng.int(1, 2) : 1,
    fights: TIER_FIGHTS[tier],
    purse,
    winBonus: tier === 0 ? 0 : Math.round(purse * winRatio(tier, fed)),
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
  // szybka kariera: zawodowstwo zawsze od 18 lat
  if (s.quick) return { ok: true };
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
        c.winBonus = Math.round(c.purse * winRatio(c.tier, c.fed));
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
      const hot = proStreak(s) >= 6 ? 3 : proStreak(s) >= 4 ? 1 : 0;
      const sr = s.rank === null ? (hot ? RANK_SIZE[s.tier] - 2 * hot : null) : clamp(s.rank + rng.int(-2, 3) - hot, 1, RANK_SIZE[s.tier]);
      const c = contractFor(rng, s, s.tier, 'side', sr === 0 ? 1 : sr);
      const wasExcl = !!c.exclusive;
      void wasExcl;
      c.fed = rng.pick(others);
      c.exclusive = isExclusiveFed(c.fed) || undefined;
      // nowa federacja liczy po swoich stawkach; za przejście dokłada najwyżej kilkanaście procent
      const rkT = sr === null ? 0 : 1 - sr / (RANK_SIZE[s.tier] + 1);
      c.purse = Math.round((contractPurse(s.tier, c.fed, rkT, (1 + s.media / 200) * (s.profile.difficulty === 'hard' ? 0.85 : 1)) * (1 + rng.next() * 0.15)) / 500) * 500;
      c.winBonus = Math.round(c.purse * winRatio(s.tier, c.fed));
      c.note = `Transfer: ${sr === null ? 'zaczynasz bez rankingu' : `startujesz z miejsca #${sr}`}. ${FED_NOTES[c.fed] ?? 'Nowa federacja, nowi rywale.'}`;
      contracts.push(c);
    }
  }

  // gwiazda niższej ligi: szczebel niżej, ale jako główna gwiazda i za lepsze pieniądze
  if (s.tier >= 2 && !cut && s.rank !== 0 && s.contract.kind !== 'freak' && s.proDebut && rng.chance(0.35)) {
    const lower = s.tier - 1;
    const c = contractFor(rng, s, lower, 'demotion', rng.int(1, 2));
    c.star = true;
    c.purse = Math.round((Math.max(s.contract.purse, c.purse) * (1.15 + rng.next() * 0.1)) / 500) * 500;
    c.winBonus = Math.round(c.purse * 0.5);
    c.seasons = 1;
    c.note = `Chcą cię jako gwiazdę: walki wieczoru, więcej niż płacą ci teraz i start z miejsca #${c.startRank}. Ale środowisko powie, że uciekasz od mocnych rywali: reputacja −5, a wygrane niżej liczą się mniej do legacy. Powrót wyżej tylko przez top rankingu.`;
    contracts.push(c);
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
    // gwiazda freak fightów zarabia jak headliner największych gal internetowych (setki tysięcy za walkę);
    // poniżej światowej federacji freak zawsze płaci wyraźnie więcej niż sport, bo inaczej nikt by nie poszedł
    const fans = (s.followers ?? 0) / 1000;
    let purse = (30000 + s.media * s.media * 40 + Math.min(300000, fans * 300) + rng.int(0, 20000)) * fatigue;
    if (s.tier <= 3) purse = Math.max(purse, s.contract.purse * (1.5 + rng.next() * 0.4));
    purse = Math.round(purse / 1000) * 1000;
    const lessThanSport = purse < s.contract.purse;
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
        lessThanSport
          ? 'Raperzy, youtuberzy i celebryci. Płacą mniej niż twoja federacja, więc to raczej zabawa i zasięgi niż interes. Sportowo rok w plecy.'
          : (s.flags.freakSeasons ?? 0) > 0
            ? 'Znowu cyrk. Widownia już cię zna, więc płacą mniej niż ostatnio, ale wciąż więcej niż sport.'
            : 'Raperzy, youtuberzy i celebryci. Płacą dużo więcej niż sport, ale sportowo to rok w plecy.',
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
    rosterSync(s);
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

// Negocjacje kontraktu na kartce (jedna próba na rynek)
export type ContractAsk = 'purse' | 'bonus' | 'signing';
export const CONTRACT_ASKS: { id: ContractAsk; label: string; desc: string }[] = [
  { id: 'purse', label: 'Wyższa gaża', desc: '+15% za każdą walkę' },
  { id: 'bonus', label: 'Premia za wygraną', desc: 'premia ×1,6, płacą za wyniki' },
  { id: 'signing', label: 'Bonus za podpis', desc: 'jednorazowy zastrzyk gotówki' },
];

export function contractNegoChance(s: GameState, c: Contract, ask: ContractAsk): number {
  const mg = currentManager(s);
  let ch = 35 + (mg?.negotiate ?? 0) + s.media / 4 + repNego(s) + Math.max(0, s.streak) * 3 + (followersOf(s) >= 50000 ? 5 : 0) - c.tier * 4;
  if (c.kind === 'promotion' && s.rank !== null && s.rank <= 2) ch += 10;
  if (c.kind === 'freak') ch += 10;
  if (ask === 'bonus') ch += 12;
  if (ask === 'signing') ch -= 5;
  return Math.round(clamp(ch, 10, 80));
}

export function signingAmount(c: Contract): number {
  return Math.max(2000, Math.round((c.purse * 1.2) / 1000) * 1000);
}

export function negotiateContract(s0: GameState, idx: number, ask: ContractAsk): GameState {
  const m0 = s0.market;
  if (!m0 || m0.negotiated || !m0.contracts[idx]) return s0;
  const s = clone(s0);
  const m = s.market!;
  const c = m.contracts[idx];
  withRng(s, (rng) => {
    const ok = rng.chance(contractNegoChance(s0, m0.contracts[idx], ask) / 100);
    m.negotiated = true;
    if (ok) {
      if (ask === 'purse') c.purse = Math.round((c.purse * 1.15) / 100) * 100;
      if (ask === 'bonus') c.winBonus = Math.round((c.winBonus * 1.6) / 100) * 100;
      if (ask === 'signing') c.signing = signingAmount(c);
      const what = ask === 'purse' ? `gaża ${c.purse.toLocaleString('pl-PL')} zł za walkę` : ask === 'bonus' ? `premia za wygraną ${c.winBonus.toLocaleString('pl-PL')} zł` : `bonus za podpis ${c.signing!.toLocaleString('pl-PL')} zł`;
      c.nego = { ask, ok: true, text: `Federacja się zgadza: ${what}. Dopisują to długopisem nad podpisem.` };
    } else if (rng.chance(ask === 'purse' ? 0.4 : ask === 'signing' ? 0.3 : 0.2)) {
      // przeciąganie liny kosztuje: federacja wraca z gorszą wersją
      c.purse = Math.round((c.purse * 0.94) / 100) * 100;
      c.nego = { ask, ok: false, text: `Federacja się obraża: „${ask === 'signing' ? 'Pieniądze za sam podpis? Chyba żartujesz' : ask === 'bonus' ? 'Premie mamy takie same dla wszystkich' : 'Takie stawki to nie u nas'}”. Nowa wersja umowy ma gażę niższą o 6%.` };
    } else {
      c.nego = { ask, ok: false, text: 'Federacja nie ustępuje. Warunki zostają, jakie były.' };
    }
  });
  return s;
}

export function setJob(s0: GameState, job: JobMode | undefined): GameState {
  const s = clone(s0);
  s.job = job;
  return s;
}

// Fundacja: duże pieniądze zamieniasz na dobre imię (reputacja i dorobek), raz na rok
export const DONATIONS = [100000, 300000, 1000000];
export function foundationOpen(s: GameState) {
  return s.tier >= 3 || s.money >= 250000;
}
export function foundationLegacy(s: GameState) {
  return Math.min(450, Math.round((s.flags.donated ?? 0) / 5000));
}
export function donate(s0: GameState, amount: number): GameState {
  if (!foundationOpen(s0) || s0.money < amount || s0.flags.donatedYear === s0.season) return s0;
  const s = clone(s0);
  s.money -= amount;
  s.flags.donated = (s.flags.donated ?? 0) + amount;
  s.flags.donatedYear = s.season;
  s.rep = clamp(s.rep + (amount >= 1000000 ? 5 : amount >= 300000 ? 3 : 2), 0, 100);
  log(s, `Fundacja: przekazujesz ${amount.toLocaleString('pl-PL')} zł na sale treningowe dla dzieci.`);
  return s;
}

/** Atuty na rok: maksymalnie dwa, tylko odblokowane. */
/** Taktyk w narożniku działa jak atut: premia do każdej decyzji od 2. rundy. */
function coachPerks(s: GameState): Perk[] {
  const c = coachOf(s);
  if (!c.corner) return [];
  const { from, bonus } = c.corner;
  return [{ id: 'coach', name: 'Narożnik', desc: '', req: { stat: 'iq', min: 0 }, bonus: (_o, r) => (r >= from ? bonus : 0) }];
}

export function setCoach(s0: GameState, id: CoachId): GameState {
  if (!COACHES.some((c) => c.id === id) || !coachOpen(s0)) return s0;
  const s = clone(s0);
  s.coach = id;
  return s;
}

export function setPerks(s0: GameState, ids: string[]): GameState {
  const s = clone(s0);
  s.perks = ids.filter((id) => PERKS.some((p) => p.id === id && perkUnlocked(s, p))).slice(0, MAX_PERKS);
  return s;
}

export function setSocial(s0: GameState, mode: SocialMode): GameState {
  const s = clone(s0);
  s.social = mode;
  if (s.followers === undefined) s.followers = followersOf(s0);
  return s;
}

/** Wywołania, rewanże i pas tymczasowy dotyczą starej federacji: przy zmianie przepadają. */
function clearCallFlags(s: GameState) {
  s.rematchOpp = null;
  s.flags.titleCall = 0;
  s.flags.callUp = 0;
  s.flags.superCall = 0;
  s.flags.interim = 0;
  s.flags.superLoss = 0;
}

export function confirmMarket(s0: GameState): GameState {
  const s = clone(s0);
  const m = s.market;
  if (!m) return s;
  const c = m.contracts[m.pickedContract];
  const club = m.clubs[m.pickedClub];
  if (!c) return s;
  // pożegnanie robi się w swojej federacji, nie na gali freak fightów
  if (c.kind === 'freak') s.flags.farewell = 0;
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
    if (c.tier !== s.tier || (c.fed !== s.fed && c.kind === 'side')) clearCallFlags(s);
    if (c.tier !== s.tier) {
      s.tier = c.tier;
      s.rank = c.startRank;
      s.titleDefenses = 0;
      if (prevTier === 0) log(s, `Przechodzisz na zawodowstwo: ${c.fed}.`);
      else if (c.tier > prevTier) log(s, `Awans: ${c.fed}.`);
      else if (c.star) {
        s.rep = clamp(s.rep - 5, 0, 100);
        s.flags.starDeals = (s.flags.starDeals ?? 0) + 1;
        log(s, `Gwiazda niższej ligi: ${c.fed}. Lepsze pieniądze, łatwiejsi rywale.`);
      } else log(s, `Krok w tył: ${c.fed}.`);
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
    clearCallFlags(s);
    s.flags.freakSeasons = (s.flags.freakSeasons ?? 0) + 1;
    s.flags.freakStigma = 2;
    if (s.tier > 0 && s.rank !== null) {
      s.rank = null;
      log(s, `${s.fed} skreśla cię z rankingu po przejściu do freak fightów.`);
    }
  }
  if (c.signing) {
    s.money += c.signing;
    s.totalEarned += c.signing;
    log(s, `Bonus za podpis: ${c.signing.toLocaleString('pl-PL')} zł (${c.fed.split(' – ')[0]}).`);
  }
  s.contract = { ...c, signing: undefined, nego: undefined };
  s.contractSeasonsLeft = c.seasons;
  if (s.tier > s.peakTier) {
    s.peakTier = s.tier;
    s.peakRank = s.rank;
  }
  s.flags.cut = 0;
  s.market = null;
  s.run = null;
  s.phase = 'training';
  withRng(s, (rng) => ensureRoster(rng, s));
  return s;
}

// ---------------------------------------------------------------------------
// Koniec kariery
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Szybka kariera
// ---------------------------------------------------------------------------

/** Automat w szybkiej karierze wybiera odpowiedzi bez długów wobec przyszłości:
 * żadnych obietnic, kredytów, ryzyka kontuzji ani hazardu. */
function safeChoice(choices: EventChoice[]): number {
  const score = (c: EventChoice) => {
    const all = [c.effects, c.success, c.fail].filter(Boolean) as Effects[];
    let v = 0;
    for (const e of all) {
      if (e.promise) v -= 1000;
      if (e.loan) v -= 1000;
      if (e.sponsor) v -= 200; // umowy sponsorskie z klauzulami niech wybiera gracz
      if (e.flag) v -= 50;
      if (e.injury) v -= 300;
      if (e.money && e.money < 0) v += e.money / 500;
      if (e.wear) v -= e.wear * 3;
      if (e.rep) v += e.rep;
      if (e.form) v += e.form;
    }
    if (c.chance !== undefined || c.test) v -= 20;
    return v;
  };
  let best = 0;
  choices.forEach((c, i) => {
    if (score(c) > score(choices[best])) best = i;
  });
  return best;
}

/** Amatorka w szybkiej karierze rozgrywa się sama (rozsądny plan), aż pojawi się kontrakt zawodowy. */
export function quickAmateur(s0: GameState): GameState {
  let s = s0;
  const weakest = (x: GameState) => [...STAT_KEYS].sort((a, b) => x.stats[a] - x.stats[b])[0];
  for (let guard = 0; guard < 600 && s.phase !== 'ended'; guard++) {
    if (s.phase === 'market' && s.age >= 18 && s.market?.contracts.some((c) => c.available && c.kind === 'promotion')) break;
    switch (s.phase) {
      case 'training':
        s = doTraining(s, weakest(s));
        break;
      case 'budget':
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
        s = canStartSeason(s) ? startSeason(s) : takeBreakYear(s);
        break;
      case 'event':
        s = s.event!.picked === undefined ? chooseEvent(s, safeChoice(s.event!.choices)) : continueAfterEvent(s);
        break;
      case 'season': {
        const run = s.run!;
        const cur = run.fights[run.fights.length - 1];
        if (run.invite) s = acceptInvite(s);
        else if (run.weigh) s = weighIn(s, 'pay');
        else if (run.post) s = postAnswer(s, run.post.options[0].key);
        else if (run.press) s = pressAnswer(s, 'calm');
        else if (run.offer) s = acceptOffer(s);
        else if (cur?.sim.pending) s = decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
        else if (run.done) s = toSummary(s);
        else s = seasonSkip(s);
        break;
      }
      case 'summary':
        s = toMarket(s);
        break;
      case 'market': {
        const ci = s.market!.contracts.findIndex((c) => c.available && c.kind !== 'freak');
        s = pickContract(s, Math.max(0, ci));
        s = confirmMarket(s);
        break;
      }
    }
  }
  s = clone(s);
  s.flags.quickAm = 1;
  // nic z automatycznej amatorki nie może wiązać rąk graczowi
  s.promises = [];
  s.brokenPromises = 0;
  // czysty start zawodowy: bez kontuzji i długów z amatorki, której gracz nie prowadził
  s.injury = null;
  s.loans = [];
  if (s.money < 1000) s.money = 1000;
  s.wear = Math.min(s.wear, 10);
  // w szybkiej karierze po amatorce zostają tylko kontrakty zawodowe
  if (s.market) {
    const pro = s.market.contracts.filter((c) => c.available && c.kind === 'promotion');
    if (pro.length) {
      s.market.contracts = pro;
      s.market.pickedContract = 0;
    }
  }
  log(s, `Amatorka w skrócie: ${recStr(s.amRecord)}, ${s.medals.gold + s.medals.silver + s.medals.bronze} ${pl(s.medals.gold + s.medals.silver + s.medals.bronze, 'medal', 'medale', 'medali')}.`);
  return s;
}

/** Szybka kariera: ekran budżetu tylko, gdy jest o czym decydować. */
export function quickNeedsBudget(s: GameState): boolean {
  if (!s.quick) return true;
  if (s.shadyDeal?.status === 'open') return true;
  if (!canStartSeason(s) || s.money + budgetBalance(s) < 0) return true;
  // raz na każdym nowym szczeblu: zaplecze, akademia, liczba walk
  if ((s.flags.quickBudgetTier ?? -1) !== s.tier) return true;
  return false;
}

/** Odwieczny rywal idzie za tobą przez karierę: awansuje razem z tobą, a jego rok trafia do podsumowania. */
export function syncRival(rng: Rng, s: GameState): string | null {
  const rv = s.peers.find((p) => p.id === s.rivalId);
  if (!rv) return null;
  if (rv.retired) {
    if (s.flags.rivalGone) return null;
    s.flags.rivalGone = 1;
    log(s, `${rv.firstName} ${rv.lastName} kończy karierę (${h2hWords(rv.h2h.w, rv.h2h.l, rv.h2h.d)}).`);
    return `${rv.lastName} ogłasza koniec kariery. Na zawsze zostaje tak, że ${h2hWords(rv.h2h.w, rv.h2h.l, rv.h2h.d)}.`;
  }
  const before = rv.tier;
  // rywal nie odstaje za bardzo: ten sam rocznik, podobna droga
  const gap = ovr(s.stats) - ovr(rv.stats);
  if (gap > 6) for (const k of STAT_KEYS) rv.stats[k] = clamp(rv.stats[k] + rng.int(1, 3), 5, 99);
  if (rv.tier < s.tier && rng.chance(0.55)) {
    if (rv.tier === 0) rv.record = { w: 0, l: 0, d: 0 };
    rv.tier++;
    rv.rank = rng.int(4, RANK_SIZE[rv.tier]);
  } else if (rv.tier > s.tier && s.tier >= 1 && rv.tier - 1 >= 1 && rng.chance(0.25)) {
    rv.tier--;
    rv.rank = rng.int(1, 6);
  }
  if (rv.tier !== before) {
    const up = rv.tier > before;
    log(s, `Rywal ${rv.lastName}: ${up ? 'awans' : 'spadek'} do poziomu „${TIER_NAMES[rv.tier]}”.`);
    return rv.tier === s.tier
      ? `${rv.lastName} ${up ? 'awansuje' : 'wraca'} do twojej ligi. Prędzej czy później znowu staniecie naprzeciw siebie.`
      : `Twój rywal ${rv.lastName} ${up ? 'awansuje' : 'spada'} na poziom „${TIER_NAMES[rv.tier]}”.`;
  }
  if (rv.tier === s.tier && rv.rank === 0) return `${rv.lastName} jest mistrzem twojej federacji. Jeśli chcesz pasa, musisz przejść przez niego.`;
  if (rv.tier === s.tier && rv.rank !== null && rv.rank <= 5) return `${rv.lastName} jest w czołówce rankingu (#${rv.rank}). Wasza walka wisi w powietrzu.`;
  return null;
}

/** Seria zwycięstw w ostatnich walkach zawodowych (bez freak fightów). */
function proStreak(s: GameState): number {
  let n = 0;
  for (let i = s.history.length - 1; i >= 0; i--) {
    const h = s.history[i];
    if (h.amateur || h.freak) continue;
    if (h.result !== 'W') break;
    n++;
  }
  return n;
}

/** Premia LEGACY za dobrowolne odejście: jako mistrz, na serii albo w zdrowiu. */
export function retireBonus(s: GameState): { title: string; pts: number; lines: string[] } | null {
  // na szczycie odchodzi się pod koniec kariery i z poważnej federacji, a nie po trzech wygranych w wieku 20 lat
  if (!s.proDebut || s.age < 30 || s.tier < 2) return null;
  const lines: string[] = [];
  let pts = 0;
  const champ = s.rank === 0 && s.tier >= 1 && s.contract.kind !== 'freak';
  if (champ) {
    const v = [0, 40, 110, 260, 600][s.tier];
    pts += v;
    lines.push(`Odchodzisz jako panujący mistrz: +${v}`);
  }
  const streak = proStreak(s);
  if (streak >= 3) {
    const v = Math.round(TIER_WIN_PTS[s.tier] * Math.min(streak, 8) * 0.8);
    pts += v;
    lines.push(`Seria ${streak} wygranych na koniec: +${v}`);
  }
  if (s.wear < 60 && s.age < 38 && (champ || streak >= 3)) {
    pts += 40;
    lines.push('Schodzisz zdrowy, zanim zdrowie zdecyduje za ciebie: +40');
  }
  if (!pts) return null;
  const sp = START_PROFILES[s.profile.start].mult ?? 0;
  const diff = DIFFICULTY[s.profile.difficulty].mult;
  const total = Math.round(pts * sp * diff);
  const title = champ && streak >= 3 ? 'Odszedł niepokonany' : champ ? 'Odszedł jako mistrz' : 'Odszedł na szczycie';
  return { title, pts: total, lines };
}

export function retire(s0: GameState): GameState {
  const s = clone(s0);
  const top = retireBonus(s);
  endCareer(s, top ? `${top.title}. Sam decydujesz, że to koniec, i schodzisz z klatki w najlepszym momencie.` : 'Sam decydujesz, że to koniec. Schodzisz z klatki na własnych warunkach.');
  if (top && s.ending) {
    s.ending.top = top;
    s.ending.legacy += top.pts;
    s.ending.verdictDesc += ` ${top.title === 'Odszedł niepokonany' ? 'Nikt nie zdążył zabrać ci pasa ani serii.' : 'Kibice zapamiętają cię u szczytu, a nie na równi pochyłej.'}`;
  }
  return s;
}

const TIER_WIN_PTS = [3, 8, 20, 45, 90];
const BELT_PTS = [40, 120, 320, 700, 1600];

export function legacyScore(s: GameState): number {
  let pts = 0;
  for (const h of s.history) {
    // szybka kariera: amatorkę rozegrał automat, więc nie daje punktów
    if (s.quick && h.amateur) continue;
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
    if (s.quick && t === 0) continue;
    const k = beltCount[t] ?? 0;
    beltCount[t] = k + 1;
    pts += BELT_PTS[t] * (k === 0 ? 1 : t === 0 ? 0.2 : t <= 2 ? 0.25 : 0.6);
  }
  // pas tymczasowy liczy się, ale dużo mniej niż prawdziwy
  pts += (s.flags.interimBelts ?? 0) * (BELT_PTS[Math.min(4, s.peakTier)] ?? 0) * 0.25;
  if (!s.quick) pts += s.medals.gold * 12 + s.medals.silver * 6 + s.medals.bronze * 4;
  // wyjście poza Polskę jest warte więcej niż kolejne pasy w kraju
  pts += [0, 40, 120, 400, 850][s.peakTier] ?? 0;
  pts += Math.min(400, s.totalEarned / 25000);
  pts += s.media * 2;
  // reputacja: jak cię zapamiętają poza zasięgami
  pts += (s.rep - 30) * 2;
  pts -= s.brokenPromises * 20;
  // fundacja: dobre imię zostaje po karierze
  pts += foundationLegacy(s);
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
  // walka pożegnalna: kibice zapamiętają koniec na twoich warunkach
  if ((s.flags.farewellDone ?? 0) > 0) {
    const h = s.history[s.history.length - 1];
    const won = h?.result === 'W';
    const base = [0, 30, 80, 180, 400][s.tier] ?? 30;
    const pts = Math.round((won ? base : base * 0.4) * (START_PROFILES[s.profile.start].mult ?? 0) * DIFFICULTY[s.profile.difficulty].mult);
    s.ending.top = { title: won ? 'Pożegnanie jak z filmu' : 'Pożegnanie z honorem', pts, lines: [won ? `Wygrana walka pożegnalna: +${pts}` : `Walka pożegnalna przed własną publicznością: +${pts}`] };
    s.ending.legacy += pts;
  }
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
  country?: string;
  me?: boolean;
  peer?: boolean;
  /** bilans gracza z tym zawodnikiem (stały skład federacji) */
  met?: string;
}

export function rankingTable(s: GameState): RankRow[] {
  const tier = s.tier;
  if (tier === 0) return [];
  const size = RANK_SIZE[tier];
  const rows: RankRow[] = [];
  const ro = rosterFor(s);
  if (ro) {
    // stały skład federacji; gracz wchodzi na swoje miejsce, reszta przesuwa się w dół
    const list = [...ro.list].sort((a, b) => a.rank - b.rank).map((f) => ({ rank: f.rank, name: `${f.firstName} ${f.lastName}`, record: recStr(f.record), flag: f.flag, country: f.country, met: f.h2h.w + f.h2h.l + f.h2h.d > 0 ? `${f.h2h.w}-${f.h2h.l}` : undefined } as RankRow));
    const mine = s.rank;
    const seq: (RankRow | null)[] = [...list];
    if (mine !== null && mine <= size) seq.splice(mine, 0, null);
    for (let r = 0; r <= size; r++) {
      const x = seq[r];
      if (x) rows.push({ ...x, rank: r });
      else rows.push({ rank: r, name: `${s.profile.firstName} ${s.profile.lastName}`, record: recStr(s.record), flag: '🇵🇱', me: true });
    }
  } else {
    const rng = createRng((s.createdAt ^ (s.season * 7919) ^ (tier * 104729)) >>> 0);
    for (let r = 0; r <= size; r++) {
      const o = generateOpponent(rng, tier, r, false);
      rows.push({ rank: r, name: `${o.firstName} ${o.lastName}`, record: recStr(o.record), flag: o.flag, country: o.country });
    }
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

// ---------------------------------------------------------------------------
// Po karierze: wybór dalszej drogi (epilog, bez powrotu do klatki)
// ---------------------------------------------------------------------------

export interface AfterPath {
  key: string;
  title: string;
  icon: string;
  desc: string;
  /** czemu ta droga jest zamknięta (brak = dostępna) */
  locked?: string;
  epilogue: string;
}

export function afterPaths(s: GameState): AfterPath[] {
  const n = s.profile.lastName;
  const town = s.profile.hometown;
  const champ = s.belts.length > 0;
  const fans = s.followers ?? 0;
  const club = s.club?.name ?? 'swoim klubie';
  const list: AfterPath[] = [
    {
      key: 'coach',
      title: 'Trener',
      icon: 'users',
      desc: `Zostajesz na sali w klubie ${club} i prowadzisz młodych.`,
      epilogue: `Pięć lat później w narożniku stoi trener ${n}. ${champ ? 'Na ścianie wisi twój pas, a pod nim zdjęcie szesnastolatka w za dużych rękawicach.' : 'Uczysz tego, czego sam nauczyłeś się za późno.'} Jeden z twoich chłopaków właśnie podpisał pierwszy zawodowy kontrakt.`,
    },
    {
      key: 'academy',
      title: 'Własna akademia',
      icon: 'home',
      desc: `Otwierasz klub pod swoim nazwiskiem w mieście ${town}.`,
      locked: s.academy || s.totalEarned >= 250000 ? undefined : 'potrzeba 250 tys. zł zarobionych w karierze',
      epilogue: `Akademia ${n} w mieście ${town} ma dziś trzysta osób na zapisach i listę oczekujących na grupę dzieci. ${champ ? 'Rodzice przyprowadzają synów „do tego od pasa”.' : 'Nikt nie pyta o twój rekord, wszyscy pytają o grafik.'}`,
    },
    {
      key: 'commentator',
      title: 'Komentator',
      icon: 'mic',
      desc: 'Siadasz przy stoliku komentatorskim największej federacji w kraju.',
      locked: s.media >= 40 ? undefined : 'potrzeba rozpoznawalności w mediach (40+)',
      epilogue: `„Tu się kończy ta walka!” — twój okrzyk zna cała Polska. ${n} przy stoliku komentatorskim to dziś marka sama w sobie, a zawodnicy proszą cię o rozbiór swoich walk.`,
    },
    {
      key: 'promoter',
      title: 'Promotor gal',
      icon: 'ticket',
      desc: 'Zakładasz własną federację i sam układasz karty walk.',
      locked: s.totalEarned >= 800000 ? undefined : 'potrzeba 800 tys. zł zarobionych w karierze',
      epilogue: `Twoja federacja robi cztery gale rocznie, a na konferencjach to ty uspokajasz zawodników. Czasem łapiesz się na tym, że negocjujesz z kimś dokładnie tak, jak kiedyś negocjowano z tobą.`,
    },
    {
      key: 'creator',
      title: 'Twórca internetowy',
      icon: 'star',
      desc: 'Podcast, kanał i walki pokazowe dla zasięgów.',
      locked: fans >= 80000 ? undefined : 'potrzeba 80 tys. obserwujących',
      epilogue: `Podcast „Po gongu” z ${n} ma milion wyświetleń miesięcznie. Najchętniej oglądany odcinek to ten, w którym opowiadasz, jak w wieku 16 lat mama wyjmowała pieniądze z koperty na pierwsze rękawice.`,
    },
    {
      key: 'firefighter',
      title: 'Straż pożarna',
      icon: 'flame',
      desc: 'Zdajesz testy sprawnościowe i idziesz do jednostki w mieście rodzinnym.',
      epilogue: `Testy sprawnościowe zdajesz z najlepszym wynikiem w historii jednostki w mieście ${town}. Na zmianach koledzy wciąż proszą o pokazanie duszenia, a na akcji spokój z klatki przydaje się bardziej, niż myślałeś.`,
    },
    {
      key: 'normal',
      title: 'Zwykłe życie',
      icon: 'briefcase',
      desc: 'Etat, rodzina, weekendy bez wagi i sauny.',
      epilogue: `Praca od ósmej do szesnastej, obiad w niedzielę u rodziców i pizza bez liczenia kalorii. Galę oglądasz z kanapy, a gdy ktoś w biurze pyta, skąd te uszy, tylko się uśmiechasz.`,
    },
  ];
  return list;
}

export function chooseAfter(s0: GameState, key: string): GameState {
  if (!s0.ending || s0.ending.after) return s0;
  const p = afterPaths(s0).find((x) => x.key === key);
  if (!p || p.locked) return s0;
  const s = clone(s0);
  s.ending!.after = key;
  return s;
}

// ---------------------------------------------------------------------------
// Media, reputacja, rodzina: co realnie dają (silnik i opis na karcie zawodnika)
// ---------------------------------------------------------------------------

/** Reputacja w negocjacjach: promotorzy chętniej dokładają komuś, kogo szanuje środowisko. */
export function repNego(s: GameState): number {
  return Math.round((s.rep - 40) / 4);
}
/** Rodzina: dobre relacje to spokojna głowa na start roku, złe to kłopoty. */
export function familyForm(s: GameState): number {
  return s.relations >= 6 ? 1 : s.relations <= -2 ? -1 : 0;
}

export interface PointEffect {
  key: 'media' | 'rep' | 'family';
  label: string;
  value: number;
  /** pasek 0..100 (rodzina przeskalowana) */
  bar: number;
  lines: string[];
}

export function pointEffects(s: GameState): PointEffect[] {
  const mediaPurse = Math.round((s.media / 200) * 100);
  const sponsorP = Math.round(clamp((s.media * 0.8 + s.rep * 0.6) / 120, 0.08, 0.75) * 100);
  const rn = repNego(s);
  const fam = familyForm(s);
  const media: string[] = [
    `gaże z kontraktów +${mediaPurse}%`,
    `szansa na nowego sponsora co rok: ${sponsorP}%`,
    s.media >= 28 ? 'dostajesz oferty freak fightów' : 'freak fighty od 28 punktów',
    s.media >= 35 ? 'zaproszenia do filmu i reklam' : 'film i reklamy od 35 punktów',
  ];
  const rep: string[] = [
    `negocjacje gaży i kontraktów: ${rn >= 0 ? '+' : ''}${rn} pkt szansy`,
    s.tier >= 2 ? (s.rep >= 18 ? 'Europa i świat chcą cię oglądać (próg 18)' : 'za mała, żeby wyjść do Europy (potrzeba 18)') : 'od 18 punktów otwiera się Europa',
    'razem z mediami przyciąga sponsorów',
  ];
  const family: string[] = [
    fam > 0 ? 'forma +1 na start każdego roku' : fam < 0 ? 'forma −1 na start każdego roku' : 'od 6 punktów: forma +1 na start roku (poniżej −1: kara)',
    s.relations >= 3 ? 'bliscy kupują bilety i ściągają znajomych' : 'od 3 punktów bliscy pomagają sprzedawać bilety',
  ];
  if (s.age < 19) family.push(s.relations >= 3 ? 'rodzice dokładają do budżetu' : 'od 3 punktów rodzice dokładają do budżetu');
  return [
    { key: 'media', label: 'Media', value: s.media, bar: s.media, lines: media },
    { key: 'rep', label: 'Reputacja', value: s.rep, bar: s.rep, lines: rep },
    { key: 'family', label: 'Rodzina', value: s.relations, bar: clamp(50 + s.relations * 5, 0, 100), lines: family },
  ];
}

/** Czy gracz trzyma teraz dwa pasy (po wygranym superfighcie). */
export function isDoubleChamp(s: GameState): boolean {
  return (s.flags.doubleActive ?? 0) > 0 && s.rank === 0 && s.tier > 0;
}
