import { createRng, type Rng } from './rng';
import type {
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
  return WEIGHTS[s.profile.weight ?? 'polsrednia'].label;
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
    flags: {},
    seenEvents: [],
    ending: null,
  };
  s.peers = createPeers(rng, 10, 16);
  for (const peer of s.peers) if (peer.lastName === p.lastName) peer.lastName = otherLastName(rng, p.lastName);
  s.rngState = rng.state();
  log(s, `Pierwszy trening: ${club.name}, ${club.city}.`);
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
export function trainingForecast(s: GameState, k: StatKey, focused: boolean): number {
  const room = Math.max(0, s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k]);
  let g = room * growthRate(s) * 0.85;
  if (k === s.club.specialty) g *= 1.25;
  if (focused) g += trainingPreview(s, k);
  return clamp(Math.round(s.stats[k] + g), 1, 99);
}

/** Czy klub ogranicza już rozwój (statystyki blisko sufitu klubu, a talent pozwala na więcej). */
export function clubLimits(s: GameState): boolean {
  if (s.club.quality >= 5) return false;
  const near = STAT_KEYS.filter((k) => s.potential[k] - CLUB_CAP[s.club.quality] - s.stats[k] <= 4 && s.potential[k] - s.stats[k] > 6).length;
  return near >= 2;
}

export function doTraining(s0: GameState, k: StatKey): GameState {
  const s = clone(s0);
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
    // głowa rośnie z doświadczeniem
    if (s.history.length >= 15 && s.age < 34 && rng.chance(0.5)) s.stats.iq = clamp(s.stats.iq + 1, 1, 99);
    s.lastGains = mapStats((key) => s.stats[key] - before[key]);
    s.trainingPick = k;
    s.peakOvr = Math.max(s.peakOvr, ovr(s.stats));
  });
  s.phase = 'budget';
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
        ? { label: 'Opłaty startowe i dojazdy', sub: 'Puchar i Mistrzostwa Polski', amount: -s.contract.entryCost, icon: 'receipt' }
        : { label: 'Badania, licencja, dojazdy', sub: s.contract.fed, amount: -s.contract.entryCost, icon: 'receipt' },
    );
  // zawodowcy na wyższych szczeblach płacą sztab: trenera przygotowania, dietetyka, fizjo
  const staff = [0, 0, 4000, 15000, 50000][s.tier];
  if (staff > 0 && s.contract.kind !== 'freak')
    lines.push({ label: 'Sztab', sub: 'trener przygotowania, dietetyk, fizjoterapeuta', amount: -staff, icon: 'users' });
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
    lines.push({ label: sp.name, sub: `${sp.clause} · ${sp.seasonsLeft === 1 ? 'ostatni sezon' : `jeszcze ${sp.seasonsLeft} ${pl(sp.seasonsLeft, 'sezon', 'sezony', 'sezonów')}`}`, amount: sp.perSeason, logo: { kind: 'sponsor', name: sp.name } });
  if (s.age < 19 && s.relations >= 3) lines.push({ label: 'Rodzice dokładają', sub: 'z trzynastki', amount: 2000 + s.relations * 300, icon: 'heart' });
  return lines;
}

export function budgetBalance(s: GameState) {
  return budgetLines(s).reduce((a, b) => a + b.amount, 0);
}

export function expectedPurses(s: GameState) {
  return (s.contract.purse + s.contract.winBonus * 0.5) * s.contract.fights;
}

/** Ile maksymalnie da bank na danym szczeblu kariery. */
const LOAN_CAP = [20000, 40000, 120000, 300000, 800000];
/** Do ilu złotych na minusie można jeszcze wejść w sezon (debet). */
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

/** Czy można wejść w sezon z tym budżetem. */
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
 * Rok przerwy: zamiast sezonu idziesz do pracy. Zarabiasz, spłacasz raty,
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
      const drop = k === 'cardio' ? rng.int(3, 5) : k === 'iq' ? rng.int(0, 1) : rng.int(1, 3);
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
  const p = clamp((s.media + s.rep * 0.3) / 120, 0.08, 0.7) * (s.profile.difficulty === 'hard' ? 0.6 : 1);
  if (!rng.chance(p)) return null;
  const name = rng.pick(SPONSOR_NAMES.filter((n) => !s.sponsors.some((x) => x.name === n)));
  const base = [1500, 4000, 12000, 30000, 80000][s.tier];
  const per = Math.round((base * (0.6 + s.media / 60) * (0.8 + rng.next() * 0.5)) / 500) * 500;
  s.sponsors.push({ id: uid(rng, 's'), name, perSeason: per, seasonsLeft: rng.int(1, 3), clause: rng.pick(SPONSOR_CLAUSES) });
  return name;
}

// ---------------------------------------------------------------------------
// Sponsor na własną rękę: raz na sezon możesz sam napisać do firmy
// ---------------------------------------------------------------------------

export type PitchSlot = 'spodenki' | 'plecy' | 'social';

export const PITCH_SLOTS: { id: PitchSlot; label: string; desc: string; base: number; pay: number; clause: string }[] = [
  { id: 'spodenki', label: 'Logo na spodenkach', desc: 'Najlepiej widać w klatce, firmy płacą najwięcej, ale trudno przekonać.', base: 0.28, pay: 1, clause: 'logo na spodenkach' },
  { id: 'plecy', label: 'Plecy rashguarda na ważeniu', desc: 'Łatwiej się zgodzą, ale zapłacą mniej.', base: 0.45, pay: 0.55, clause: 'logo na plecach na ważeniu i face to face' },
  { id: 'social', label: 'Posty na Instagramie', desc: 'Liczą się zasięgi. Im więcej mediów, tym większa szansa.', base: 0.15, pay: 0.75, clause: 'trzy posty w sezonie z kodem rabatowym' },
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
  if (s.pitch && s.pitch.season === s.season) return 'W tym sezonie już szukałeś. Kolejna próba za rok.';
  if (s.sponsors.length >= sponsorCap(s)) return 'Masz już tylu sponsorów, ilu da się zmieścić na stroju.';
  return null;
}

export function pitchChance(s: GameState, slot: PitchSlot): number {
  const sl = PITCH_SLOTS.find((x) => x.id === slot)!;
  const mediaW = slot === 'social' ? 1 / 70 : 1 / 160;
  let c = sl.base + s.media * mediaW + s.rep / 350 + s.tier * 0.05 - s.sponsors.length * 0.1;
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
      s.pitch = { season: s.season, ok: true, name, slot, text: `${name} się zgadza! ${fmtMoney(per).slice(1)} na sezon za ${sl.clause}.` };
      log(s, `Nowy sponsor: ${name}.`);
    } else {
      s.pitch = { season: s.season, ok: false, name, slot, text: `${name} ${rng.pick(PITCH_FAIL)}` };
    }
  });
  return s;
}

// ---------------------------------------------------------------------------
// Start sezonu: płatności, wydarzenia, forma
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
  }
  if (e.flag) s.flags[e.flag] = (s.flags[e.flag] ?? 0) + 1;
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
  if (e.sponsor) out.push({ text: `sponsor ${fmtMoney(e.sponsor.perSeason).slice(1)} na sezon`, tone: 'good', icon: 'briefcase' });
  if (e.promise) out.push({ text: `obietnica do sezonu ${e.promise.untilSeason}`, tone: 'neutral', icon: 'pen' });
  if (e.loan && e.loan.installment) out.push({ text: `raty ${e.loan.count} × ${fmtMoney(e.loan.installment).slice(1)}`, tone: 'bad', icon: 'card' });
  if (e.note) out.push({ text: e.note, tone: 'neutral' });
  void s;
  return out;
}

// ---------------------------------------------------------------------------
// Sezon
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
  return AMATEUR_TOURNEYS.map((name, i) => ({
    name,
    city: cities[i],
    division: div,
    stage: 'qf' as TourneyStage,
    medal: null,
    place: null,
    championship: i === 1,
  }));
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
      tourneys = makeTourneys(rng, s);
      intro.push(
        `W tym roku dwa turnieje: ${tourneys[0].name} (${tourneys[0].city}) i ${tourneys[1].name} (${tourneys[1].city}). Startujesz ${tourneys[0].division === 'pierwszy krok' ? 'wśród debiutantów' : `jako ${divisionPerson(tourneys[0].division)}`}, w drabince jest ośmiu zawodników.`,
      );
    }
    const sp = maybeAutoSponsor(rng, s);
    if (sp) intro.push(`Nowy sponsor na spodenkach: ${sp}.`);
    if (s.injury) intro.push(`Wchodzisz w sezon z kontuzją: ${s.injury.name}. Każda szansa jest o ${s.injury.penalty} pkt mniejsza.`);
    if (bonus > 0) intro.push(`To, co działo się przed sezonem, dodaje ci pewności: forma +${bonus}.`);
    if (bonus < 0) intro.push(`To, co działo się przed sezonem, siedzi ci w głowie: forma −${Math.abs(bonus)}.`);
    let planned = s.contract.fights;
    if (s.contract.kind === 'freak') planned = 2;
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
  const shift = t.division === 'pierwszy krok' ? -4 : t.division === 'kadeci' ? -2 : t.division === 'seniorzy' ? 2 : 0;
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
  if (peers.length && (wantPeer || rng.chance(0.18))) return peerPick();
  const mine = s.rank ?? size + 2;
  if ((s.flags.grudge ?? 0) > 0) {
    s.flags.grudge = 0;
    const opp = generateOpponent(rng, tier, clamp(mine - rng.int(2, 4), 1, size), hard);
    opp.nickname = opp.nickname || 'Pyskaty';
    return { opp, title: false, defense: false, peer: null, grudge: true };
  }
  let r: number | null = clamp(mine + rng.int(-3, 1), 1, size + 3);
  if (r > size) r = null;
  if (s.rank === null && rng.chance(0.5)) r = null;
  return { opp: generateOpponent(rng, tier, r, hard), title: false, defense: false, peer: null };
}

function fightCtx(s: GameState, opp: Fighter): FightCtx {
  return {
    me: effectiveStats(s),
    meName: fullName(s),
    opp,
    form: s.run!.form.mod,
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
  if (s.flags.manager) p *= 1.15;
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

/** Rozgrywa kolejną walkę sezonu (albo do decyzji). */
export function seasonNext(s0: GameState): GameState {
  const s = clone(s0);
  const run = s.run;
  if (!run || run.done) return s;
  const cur = run.fights[run.fights.length - 1];
  if (cur && !cur.sim.finished) return s; // czeka na decyzję
  withRng(s, (rng) => {
    const idx = run.fights.length;
    const amateur = isAmateurRun(s);
    const t = amateur ? run.tourneys![run.tIdx ?? 0] : undefined;
    const { opp, title, defense, grudge } = pickOpponent(rng, s, idx);
    avoidMyName(rng, s, opp);
    const freak = s.contract.kind === 'freak';
    const fed = freak ? s.contract.fed : s.fed;
    const stage = t?.stage ?? undefined;
    const rounds = amateur ? (stage === 'qf' || stage === 'sf' ? 1 : 3) : title ? 5 : 3;
    const spot = amateur ? undefined : cardSpot(rng, s, title, opp, freak);
    const rep: FightReport = {
      idx,
      amateur,
      stage,
      tourney: t ? `${t.name} · ${t.city}` : undefined,
      gala: amateur ? undefined : galaName(rng, s, fed),
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
      purse: amateur ? 0 : purseFor(s, opp, title, spot),
      earned: 0,
    };
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
  });
  return s;
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

/** Szybko: rozgrywa wszystko do następnej decyzji albo końca sezonu. */
export function seasonSkip(s0: GameState): GameState {
  let s = s0;
  for (let i = 0; i < 14; i++) {
    const run = s.run;
    if (!run || run.done) break;
    const cur = run.fights[run.fights.length - 1];
    if (cur && cur.sim.pending) break;
    s = seasonNext(s);
  }
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
    if (t.medal === 'gold' && t.championship) {
      s.belts.push({ name: BELT_NAMES[0], season: s.season, age: s.age });
      log(s, `🥇 Mistrz Polski amatorów (${t.city}).`);
      rep.moments.push({ round: rep.round, title: 'Mistrz Polski!', text: `Złoty medal Mistrzostw Polski. Wieszają ci go na szyi, a trener udaje, że coś wpadło mu do oka.`, tone: 'purple' });
    } else if (t.medal) {
      const m = t.medal === 'gold' ? 'Złoto' : t.medal === 'silver' ? 'Srebro' : 'Brąz';
      log(s, `${t.medal === 'gold' ? '🥇' : t.medal === 'silver' ? '🥈' : '🥉'} ${m}: ${t.name} (${t.city}).`);
      rep.moments.push({ round: rep.round, title: `${m} ${t.name.startsWith('Puchar') ? 'Pucharu Polski' : 'Mistrzostw Polski'}`, text: t.medal === 'gold' ? 'Cztery godziny czekania na hali i trzy walki. Medal jest twój.' : t.medal === 'silver' ? 'Finał przegrany, ale srebro to srebro. Za rok wracasz po więcej.' : 'Brąz wywalczony w walce o trzecie miejsce. Na podium stoisz z uśmiechem.', tone: 'good' });
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
  const cur = mine ?? size + 2;
  if (res === 'W') {
    let next: number;
    if (opp.rank !== null && opp.rank > 0 && opp.rank < cur) next = opp.rank;
    else next = cur - 1 - (finish ? 1 : 0) - (opp.rank !== null ? 1 : 0);
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
  let earned = rep.amateur ? 0 : rep.purse + (res === 'W' ? Math.round(s.contract.winBonus * (rep.title ? 1.8 : 1)) : 0);
  if (!rep.amateur && s.tier >= 1) {
    const amount = [0, 1500, 10000, 30000, 200000][s.tier];
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

  // zużycie i kontuzje
  const dmgTaken = rep.sim.me.dmg;
  s.wear = clamp(s.wear + (dmgTaken / 10) * (rep.amateur ? 0.4 : 1) + (res === 'L' && (rep.method === 'KO/TKO' || rep.method === 'Lekarz') ? (rep.amateur ? 3 : 7) : 0) + (s.age >= 32 ? 1.5 : 0), 0, 100);
  if (dmgTaken > 50 && !s.injury && rng.chance(0.25)) {
    s.injury = { name: rng.pick(['złamany nos', 'pęknięty oczodół', 'naderwany biceps', 'skręcona kostka', 'złamany palec u stopy', 'pęknięte żebro', 'rozcięty łuk brwiowy', 'naciągnięte więzadło kolana', 'wybity bark']), seasons: 1, penalty: 4 };
    rep.moments.push({ round: rep.round, title: 'Kontuzja', text: `Po walce lekarz ma złe wieści: ${s.injury.name}.`, tone: 'bad' });
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
      } else if (res === 'L') {
        p.h2h.l++;
        p.record.w++;
      } else {
        p.h2h.d++;
        p.record.d++;
      }
      if (p.metCount === 1)
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
  if (s.injury && s.injury.penalty >= 8) s.run!.done = true;
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
// Podsumowanie sezonu
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
    score >= 80 ? 'Sezon wybitny' : score >= 62 ? 'Udany sezon' : score >= 45 ? 'Przeciętny sezon' : score >= 28 ? 'Sezon do zapomnienia' : 'Katastrofa';

  const finishes = fights.filter((f) => f.result === 'W' && (f.method === 'KO/TKO' || f.method === 'Poddanie')).length;
  const lines: string[] = [];
  const fedShort = galaPrefix(s.fed);
  if (amateur) {
    for (const t of run.tourneys!) lines.push(`${t.name}: ${tourneyResultText(t)}.`);
    if (beltWon) lines.push('Jesteś mistrzem Polski amatorów i w klubie wszyscy już o tym wiedzą.');
  } else if (beltWon) lines.push(`Rok, w którym zdobyłeś pas. ${fedShort} ma nowego mistrza.`);
  else if (w === total && total > 1) lines.push(`Sezon bez porażki, ${w} na ${total}.`);
  else if (l === total) lines.push(`Rok do wymazania. ${l} ${pl(l, 'porażka', 'porażki', 'porażek')} i ani jednego powodu do radości.`);
  else lines.push(`Bilans roku: ${w}-${l}${d ? `-${d}` : ''}.`);
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
  s.sponsors = s.sponsors.filter((x) => x.seasonsLeft > 0);
  // media wygasają powoli
  s.media = clamp(s.media - (s.media > 40 ? 3 : 1), 0, 100);
  s.contractSeasonsLeft -= 1;
  s.flags.debt = s.money < -15000 ? 1 : 0;
  if ((s.flags.freakStigma ?? 0) > 0) s.flags.freakStigma -= 1;
}

export function checkEnd(s: GameState): string | null {
  if (s.age >= 40) return 'Czterdziestka na karku. Komisja lekarska nie przedłuża ci licencji.';
  if (s.wear >= 100) return 'Lekarze nie dają ci zgody na kolejne walki. Za dużo przyjętych ciosów.';
  if ((s.flags.lastSeason ?? 0) > 0) return 'Obiecałeś rodzinie, że to ostatni sezon. Dotrzymujesz słowa.';
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
  stay.note = s.tier === 0 ? 'Jeszcze rok turniejów amatorskich: Puchar i Mistrzostwa Polski.' : s.rank === 0 ? 'Bronisz pasa. Mistrza się nie wypuszcza.' : 'Kolejny sezon w tej samej federacji.';
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
      (s.flags.manager && s.rank !== null && s.rank <= 5) ||
      (s.tier === 1 && s.media >= 45 && seasonW >= 2) ||
      // wyższa federacja wypatruje wyraźnie lepszych od stawki
      (ovr(s.stats) >= TIER_LEVEL[s.tier + 1] + 4 && seasonW >= 2));
  if (eligible) {
    const nt = s.tier + 1;
    const n = nt >= 3 ? 1 : 2;
    const used = new Set<string>();
    for (let i = 0; i < n; i++) {
      const sr = rng.chance(0.3) && s.rank === 0 ? rng.int(6, RANK_SIZE[nt]) : null;
      const c = contractFor(rng, s, nt, 'promotion', sr);
      if (used.has(c.fed)) continue;
      used.add(c.fed);
      c.note = s.rank === 0 ? 'Chcą sprawdzić, ile jest wart mistrz z niższej półki.' : 'Krok wyżej: mocniejsi rywale i lepsze pieniądze.';
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
    pts += BELT_PTS[t] * (k === 0 ? 1 : t === 0 ? 0.2 : 0.6);
  }
  pts += s.medals.gold * 12 + s.medals.silver * 6 + s.medals.bronze * 4;
  pts += s.peakTier * 60;
  pts += Math.min(400, s.totalEarned / 25000);
  pts += s.media * 2;
  pts -= s.brokenPromises * 20;
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
  parts.push(`${s.seasons.length} ${pl(s.seasons.length, 'sezon', 'sezony', 'sezonów')}, ${fights} ${pl(fights, 'walka', 'walki', 'walk')}.`);
  if (s.amRecord.w + s.amRecord.l + s.amRecord.d > 0) {
    const m = medalCount(s);
    parts.push(`W amatorce ${recStr(s.amRecord)}${m ? ` i ${m} ${pl(m, 'medal', 'medale', 'medali')}` : ''}.`);
  }
  if (s.proDebut) parts.push(`Zawodowo ${recStr(s.record)}, debiut w wieku ${s.proDebut.age} lat.`);
  if (belts) parts.push(`${belts} ${pl(belts, 'tytuł', 'tytuły', 'tytułów')} w gablocie.`);
  if (s.finishes.ko + s.finishes.sub > s.record.w * 0.6 && s.record.w > 5) parts.push('Kończyłeś walki przed czasem jak mało kto.');
  const bestPeer = s.peers.filter((p) => p.metCount > 0).sort((a, b) => b.metCount - a.metCount)[0];
  if (bestPeer) parts.push(`Odwieczny rywal: ${bestPeer.firstName} ${bestPeer.lastName}, bilans ${bestPeer.h2h.w}-${bestPeer.h2h.l}.`);
  if (s.freakFights) parts.push(`Freak fightów: ${s.freakFights}.`);
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
// Tabela rankingu (fikcyjni zawodnicy, stabilni w obrębie sezonu i szczebla)
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
