export type StatKey = 'stand' | 'wrest' | 'bjj' | 'cardio' | 'chin' | 'iq';
export type Stats = Record<StatKey, number>;

export type Style = 'boxer' | 'kickboxer' | 'wrestler' | 'grappler' | 'brawler' | 'allround';
export type WeightKey = 'piorkowa' | 'lekka' | 'polsrednia' | 'srednia' | 'polciezka' | 'ciezka';
export type CardSpot = 'wstępna' | 'główna' | 'wieczoru';
export type TourneyStage = 'qf' | 'sf' | 'f' | 'b';
export type StartProfile = 'osiedle' | 'biznes' | 'junior' | 'wybraniec';
export type Difficulty = 'normal' | 'hard';
export type Outcome = 'super' | 'success' | 'fail';
export type TicketPlan = 'none' | 'std' | 'push';
export type JobMode = 'full' | 'half' | 'none';
export type SocialMode = 'off' | 'self' | 'pro';
export type SideKind = 'grappling' | 'boxing' | 'seminar' | 'grapple1' | 'kick' | 'film';

/** Zaproszenie na wydarzenie poza MMA (dozwolone także przy wyłączności). */
export interface SideInvite {
  kind: SideKind;
  title: string;
  place: string;
  fee: number;
  prize: number;
  text: string;
}

/** decyzja po walce: wywołanie przez mikrofon albo reakcja na kontrowersyjny werdykt */
export interface PostFight {
  kind: 'mic' | 'robbed';
  title: string;
  text: string;
  options: { key: string; label: string; desc: string; chance?: number }[];
}

export interface Record3 {
  w: number;
  l: number;
  d: number;
}

// Rywal lub zawodnik z rocznika
export interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  country: string;
  flag: string;
  age: number;
  style: Style;
  stats: Stats;
  record: Record3;
  rank: number | null; // 0 = mistrz
  peer?: boolean; // z rocznika gracza
  freak?: string;
}

export interface Peer extends Fighter {
  tier: number;
  talent: number; // 0..1
  belts: number;
  retired: boolean;
  metCount: number;
  h2h: Record3; // bilans gracza z nim
}

export interface Club {
  id: string;
  name: string;
  city: string;
  quality: number; // 1..5
  strength: number; // 0..100 (odpowiednik siły bolidu)
  cost: number; // zł / rok
  specialty: StatKey;
  injuryMod: number;
  desc: string;
}

export interface Contract {
  id: string;
  tier: number;
  fed: string;
  kind: 'stay' | 'promotion' | 'demotion' | 'freak' | 'side';
  seasons: number;
  fights: number; // walk w roku
  purse: number; // gaża za walkę
  winBonus: number;
  entryCost: number; // koszty startów w roku (amatorka, regionalne)
  startRank: number | null;
  note: string;
  available: boolean; // false = "obserwują cię", nie stać cię
  reason?: string;
  /** kontrakt na wyłączność: wyższa gaża, bez walk na innych galach */
  exclusive?: boolean;
  /** bonus za podpis (jednorazowo, wynegocjowany) */
  signing?: number;
  /** gwiazda niższej ligi: zejście szczebel niżej za lepszą kasę */
  star?: boolean;
  /** wynik negocjacji na kartce */
  nego?: { ask: 'purse' | 'bonus' | 'signing'; ok: boolean; text: string };
}

export interface Sponsor {
  id: string;
  name: string;
  perSeason: number;
  seasonsLeft: number;
  clause: string;
}

export interface Loan {
  installment: number;
  left: number;
}

export interface Promise {
  id: string;
  text: string;
  untilSeason: number;
  kind: 'noPromotion' | 'stayClub' | 'noFreak';
}

export interface Injury {
  name: string;
  seasons: number; // ile lat kary
  penalty: number; // odejmowane od testów (pkt %)
  /** ile pełnych lat zawodnik pauzuje (rehabilitacja zamiast walk) */
  out?: number;
}

// --- Efekty wydarzeń (deklaratywne, żeby dało się pokazać chipy przed wyborem) ---
export interface Effects {
  money?: number;
  media?: number;
  rep?: number;
  relations?: number;
  wear?: number;
  stats?: Partial<Stats>;
  injury?: Injury;
  healInjury?: boolean;
  promise?: Omit<Promise, 'id'>;
  sponsor?: Omit<Sponsor, 'id'>;
  flag?: string;
  form?: number; // bonus do formy w tym roku
  loan?: { amount: number; installment: number; count: number };
  note?: string; // dodatkowy chip tekstowy
}

export interface EventChoice {
  label: string;
  desc: string;
  effects?: Effects;
  chance?: number; // jeśli jest, efekt z szansą
  success?: Effects;
  fail?: Effects;
  successText?: string;
  failText?: string;
  test?: StatKey; // szansa liczona ze statystyki
}

export interface PendingEvent {
  id: string;
  brand?: string; // logo marki Ground Game przy wydarzeniu
  title: string;
  text: string;
  choices: EventChoice[];
  picked?: number;
  resultText?: string;
  resultEffects?: Effects;
  rolled?: Outcome;
}

// --- Walka ---
export interface Moment {
  round: number;
  title: string;
  text: string;
  stat?: StatKey;
  chance?: number; // 0..100
  dist?: [number, number, number]; // super/sukces/porażka %
  outcome?: Outcome;
  effect?: string;
  tone: 'good' | 'bad' | 'neutral' | 'purple';
  decision?: boolean;
  brand?: string;
}

export interface DecisionOption {
  label: string;
  desc: string;
  win: string; // co daje udana próba
  lose: string; // czym grozi nieudana
  stat: StatKey;
  chance: number; // %
  dist: [number, number, number];
  key: string;
  kind?: 'risk' | 'normal' | 'safe';
  /** atut z obozu, który podbija tę opcję */
  perk?: string;
}

export interface DecisionPoint {
  id: string;
  round: number;
  title: string;
  text: string;
  options: DecisionOption[];
  /** stan walki w chwili decyzji (do pokazania graczowi) */
  status?: { lead: number | null; stam: number; hurt: number; oppStam: number; oppHurt: number };
  /** decyzja narożnika w dużej walce */
  corner?: boolean;
}

export type Method =
  | 'KO/TKO'
  | 'Poddanie'
  | 'Decyzja jednogłośna'
  | 'Decyzja niejednogłośna'
  | 'Decyzja większościowa'
  | 'Remis'
  | 'Lekarz'
  | 'Walkower';

export interface FightSide {
  dmg: number;
  stam: number;
}

export interface FightSim {
  round: number; // ostatnia rozegrana runda
  maxRounds: number;
  me: FightSide;
  opp: FightSide;
  momentum: number; // dodatkowy modyfikator dla gracza w następnej rundzie
  cards: [number, number][]; // 3 sędziów: [ja, rywal]
  pending: DecisionPoint | null;
  decisionUsed: boolean;
  finished: boolean;
  /** duża walka (o pas, z rywalem): decyzja w każdej przerwie */
  big?: boolean;
  /** id decyzji już pokazanych w tej walce */
  seen?: string[];
  /** po której rundzie padło ostatnie pytanie narożnika (-1 = jeszcze nie) */
  asked?: number;
  /** walka zawodowa: plan na walkę zawsze przed 1. rundą */
  pro?: boolean;
  /** wybrany plan: ustawia styl walki gracza na całą walkę */
  plan?: 'stand' | 'wrest' | 'bjj';
}

export interface FightReport {
  idx: number;
  amateur?: boolean;
  stage?: TourneyStage;
  tourney?: string;
  gala?: string;
  spot?: CardSpot;
  time?: string; // czas skończenia w rundzie, np. 3:12
  bonus?: string;
  opp: Fighter;
  fed: string;
  title: boolean;
  defense: boolean;
  freak: boolean;
  peer: boolean;
  rankBefore: number | null;
  rankAfter: number | null;
  result: 'W' | 'L' | 'D' | null;
  method: Method | null;
  round: number;
  detail: string;
  moments: Moment[];
  sim: FightSim;
  purse: number;
  earned: number;
  /** ile wziął menedżer */
  mgrCut?: number;
  /** obóz przed walką: zwykły, pod rywala, ciężki */
  prep?: 'std' | 'rival' | 'hard';
  /** nie zrobiłeś wagi */
  weightMiss?: boolean;
  /** kara/premia do formy z ważenia */
  weighMod?: number;
  short?: boolean;
  interim?: boolean;
  unify?: boolean;
  superfight?: string;
  /** sprzedane bilety i prowizja */
  tickets?: { sold: number; cut: number; plan: TicketPlan };
  /** przyrost obserwujących po walce */
  fans?: number;
  abroad?: string;
  /** co zrobiłeś po walce (mikrofon, werdykt) i czy się udało */
  postChoice?: { key: string; ok: boolean };
  /** zmęczenie po wydarzeniu poza federacją */
  tired?: boolean;
  pressMod?: number;
  /** plakat gali: miasto, hala i inne walki w karcie */
  poster?: { city: string; venue: string; bouts: { a: string; ar: string; b: string; br: string; tag: string }[] };
  winBonus?: number;
  rival?: boolean;
  /** walka na odbudowę rekordu (słaby rywal na dziwnej gali) */
  tuneup?: boolean;
  cards?: [number, number][];
  headline?: string;
}

export interface SeasonForm {
  label: string;
  mod: number; // pkt % do testów
  tone: 'good' | 'bad' | 'neutral' | 'purple';
}

export interface Tourney {
  name: string;
  city: string;
  division: string; // pierwszy krok / kadeci / juniorzy / seniorzy
  stage: TourneyStage | null; // null = turniej zakończony
  medal: 'gold' | 'silver' | 'bronze' | null;
  place: number | null;
  championship: boolean; // Mistrzostwa Polski (złoto = tytuł)
}

export interface SeasonRun {
  tourneys?: Tourney[];
  tIdx?: number;
  form: SeasonForm;
  fights: FightReport[];
  planned: number;
  done: boolean;
  startMoney: number;
  startOvr: number;
  startRank: number | null;
  startMedia: number;
  startFans?: number;
  intro: string[];
  /** oferta kolejnej walki czekająca na decyzję gracza (zawodowcy) */
  offer?: FightOffer | null;
  /** konferencja przed galą czekająca na odpowiedź gracza */
  press?: FightOffer | null;
  /** gracz przyjmuje resztę ofert w roku bez pytania */
  autoAccept?: boolean;
  /** obóz używany przy automatycznie przyjmowanych ofertach */
  autoPrep?: 'std' | 'rival' | 'hard';
  /** odrzucone oferty w tym roku */
  declines?: number;
  /** czy menedżer zajmuje się tobą w tym roku */
  mgrFocus?: boolean;
  /** krótkie notki z roku (odrzucone oferty itp.) */
  notes?: string[];
  exclNote?: boolean;
  /** gracz zobaczył już losowanie formy (po przeładowaniu nie powtarzamy) */
  formSeen?: boolean;
  /** czy w tym roku była już propozycja walki na odbudowę */
  tuneupOffered?: boolean;
  /** czy w tym roku był już telefon z zastępstwem */
  shortOffered?: boolean;
  /** ważenie: nie zrobiłeś limitu, czekamy na decyzję */
  weigh?: FightOffer | null;
  /** decyzja po walce (mikrofon, kontrowersja) */
  post?: PostFight | null;
  /** zaproszenie na wydarzenie poza federacją */
  invite?: SideInvite | null;
  inviteOffered?: boolean;
  abroadOffered?: boolean;
  /** wyniki wydarzeń poza federacją w tym roku */
  sideLog?: { title: string; text: string; tone: 'good' | 'bad' | 'neutral' | 'purple'; lines: string[] }[];
}

export interface FightOffer {
  opp: Fighter;
  title: boolean;
  defense: boolean;
  grudge?: boolean;
  rival?: boolean;
  spot?: CardSpot;
  gala: string;
  purse: number;
  winBonus: number;
  negotiated: boolean;
  prep?: 'std' | 'rival' | 'hard';
  /** wynik konferencji: premia do formy i opis */
  pressMod?: number;
  pressNote?: string;
  /** cytat rywala na konferencji */
  pressQuote?: string;
  /** kontekst konferencji: pytanie i dopasowane odpowiedzi */
  pressCtx?: { id: string; question: string; labels: Record<'calm' | 'provoke' | 'insult', [string, string]>; provoke: number; insult: number };
  /** komunikat po negocjacjach */
  note?: string;
  /** walka na zastępstwo: telefon kilka dni przed galą */
  short?: boolean;
  /** pas tymczasowy (mistrz kontuzjowany) */
  interim?: boolean;
  /** unifikacja: tymczasowy mistrz kontra mistrz */
  unify?: boolean;
  /** superfight: mistrz kontra mistrz kategorii obok */
  superfight?: string;
  /** rewanż wywalczony po kontrowersyjnym werdykcie */
  rematch?: boolean;
  /** sprzedaż biletów (gale regionalne) */
  tickets?: TicketPlan;
  /** wynik ważenia, gdy waga nie wyszła */
  weigh?: 'paid' | 'cut_ok' | 'cut_fail';
  /** jednorazowa gala MMA za granicą (Dubaj itp.), poza rankingiem */
  abroad?: string;
  /** walka na odbudowę rekordu: słaby rywal z ujemnym bilansem na dziwnej gali */
  tuneup?: boolean;
  /** podpowiedź menedżera przy ofercie */
  hook?: string;
  tip?: string;
}

export interface SeasonSummary {
  season: number;
  year: number;
  age: number;
  tier: number;
  fed: string;
  club: string;
  w: number;
  l: number;
  d: number;
  rank: number | null;
  champion: boolean;
  beltWon: boolean;
  moneyDelta: number;
  ovrFrom: number;
  ovrTo: number;
  form: string;
  grade: string;
  bars: { label: string; value: number; note?: string }[];
  story: string;
  /** poza klatką: obserwujący, bilety, wydarzenia spoza MMA, mikrofon */
  outside?: { icon: string; label: string; value: string }[];
}

export interface HistoryEntry {
  amateur?: boolean;
  gala?: string;
  stage?: TourneyStage;
  time?: string;
  season: number;
  age: number;
  tier: number;
  fed: string;
  opponent: string;
  oppNick: string;
  oppRecord: string;
  oppRank: number | null;
  oppFlag: string;
  result: 'W' | 'L' | 'D';
  method: Method;
  round: number;
  detail: string;
  title: boolean;
  freak: boolean;
  peer: boolean;
  earned: number;
}

export type Phase = 'training' | 'budget' | 'event' | 'season' | 'summary' | 'market' | 'ended';

export interface Profile {
  weight: WeightKey;
  firstName: string;
  lastName: string;
  nickname: string;
  hometown: string;
  region: string;
  style: Style;
  start: StartProfile;
  difficulty: Difficulty;
}

export interface Ending {
  reason: string;
  verdict: string;
  verdictDesc: string;
  legacy: number;
  story: string;
  /** premia za odejście na własnych warunkach */
  top?: { title: string; pts: number; lines: string[] };
}

export interface GameState {
  v: number;
  slot: number; // 1..3, 0 = kariera dnia
  rngState: number;
  mode: 'normal' | 'daily';
  /** szybka kariera: start od zawodowstwa, mniejsze walki rozgrywa narożnik */
  quick?: boolean;
  dailyLabel?: string;
  createdAt: number;

  profile: Profile;
  stats: Stats;
  potential: Stats;
  age: number;
  season: number;
  year: number;

  money: number;
  totalEarned: number;
  media: number; // 0..100
  /** obserwujący w social mediach */
  followers?: number;
  /** jak prowadzisz social media */
  social?: SocialMode;
  /** praca obok treningów (początek kariery) */
  job?: JobMode;
  /** ksywka nadana przez kibiców */
  fanNick?: string;
  /** atuty wybrane na ten rok (obóz) */
  perks?: string[];
  /** rywal, z którym wywalczyłeś rewanż (po kontrowersji) */
  rematchOpp?: Fighter | null;
  rep: number; // 0..100
  relations: number; // ukryte
  wear: number; // 0..100
  injury: Injury | null;
  sponsors: Sponsor[];
  /** zaplecze opłacane co roku (od debiutu zawodowego): fizjo, lekarz, suplementy */
  backroom?: { physio?: boolean; doctor?: boolean; supps?: boolean; sparring?: boolean };
  /** wynik ostatniego szukania sponsora na własną rękę */
  pitch?: { season: number; ok: boolean; text: string; name?: string; slot: string } | null;
  /** dziwny sponsor podsunięty przez menedżera (oferta na ten rok) */
  shadyDeal?: { season: number; name: string; product: string; perSeason: number; seasons: number; rep: number; media: number; pitch: string; from: string; status: 'open' | 'taken' | 'refused' } | null;
  loans: Loan[];
  /** kategoria, w której walczysz (domyślnie naturalna z profilu) */
  division?: WeightKey;
  /** menedżer (id) albo null, gdy sam prowadzisz karierę */
  manager?: string | null;
  /** odwieczny rywal z rocznika (id zawodnika) */
  rivalId?: string | null;
  /** poziom własnej akademii (0 = brak) */
  academy?: number;
  /** obóz zagraniczny z ostatniego okresu przygotowawczego */
  camp?: string | null;
  promises: Promise[];
  brokenPromises: number;

  tier: number;
  fed: string;
  rank: number | null;
  titleDefenses: number;
  belts: { name: string; season: number; age: number }[];
  peakTier: number;
  peakRank: number | null;
  peakOvr: number;

  club: Club;
  clubSeasons: number;
  contract: Contract;
  contractSeasonsLeft: number;
  trainingPick: StatKey | null;
  lastGains: Partial<Stats>;

  record: Record3; // rekord zawodowy
  amRecord: Record3; // rekord amatorski
  medals: { gold: number; silver: number; bronze: number };
  proDebut: { season: number; age: number } | null;
  finishes: { ko: number; sub: number; koLosses: number; subLosses: number };
  streak: number;
  freakFights: number;
  history: HistoryEntry[];
  seasons: SeasonSummary[];
  timeline: { season: number; age: number; text: string }[];
  peers: Peer[];

  phase: Phase;
  event: PendingEvent | null;
  eventQueue: string[];
  run: SeasonRun | null;
  lastSummary: SeasonSummary | null;
  market: { contracts: Contract[]; clubs: Club[]; pickedContract: number; pickedClub: number; negotiated?: boolean } | null;
  flags: Record<string, number>;
  seenEvents: string[];
  ending: Ending | null;
}
