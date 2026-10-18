// Mechaniki „z życia”: etat obok treningów, social media (obserwujący), sprzedaż biletów.
// Czyste funkcje bez losowania stanu gry (rng przekazuje game.ts).
import type { FightOffer, GameState, JobMode, SocialMode, TicketPlan } from './types';

// ---------------------------------------------------------------------------
// Etat
// ---------------------------------------------------------------------------

export const JOB_OPTIONS: { id: JobMode; label: string; short: string; living: number; form: number; desc: string }[] = [
  { id: 'full', label: 'Pełny etat', short: 'etat', living: 0.15, form: -2, desc: 'Praca pokrywa prawie całe życie. Trenujesz po ośmiu godzinach w robocie, więc forma cierpi.' },
  { id: 'half', label: 'Pół etatu', short: 'pół etatu', living: 0.5, form: 0, desc: 'Połowa kosztów z pensji, rano trening, popołudniu praca.' },
  { id: 'none', label: 'Tylko trening', short: 'bez pracy', living: 1, form: 4, desc: 'Żyjesz z walk i oszczędności. Dwa treningi dziennie i regeneracja, ale każda złotówka się liczy.' },
];

/** Czy w tym roku w ogóle wybierasz pracę (pełnoletni, do krajowej federacji). */
export function jobAvailable(s: GameState): boolean {
  return s.age >= 19 && s.tier <= 2 && s.contract.kind !== 'freak';
}

/** Domyślny tryb pracy, gdy gracz nic nie wybrał (tak jak dawniej: etat do regionalnej, pół etatu na krajówce). */
export function defaultJob(s: GameState): JobMode {
  if (s.tier <= 1) return 'full';
  if (s.tier === 2 && (s.rank === null || s.rank > 3)) return 'half';
  return 'none';
}

export function jobMode(s: GameState): JobMode | null {
  // w trakcie roku obowiązuje tryb ustalony na starcie roku
  const jy = s.flags.jobYear ?? 0;
  if (s.phase === 'season' && jy && Math.floor(jy / 10) === s.season) return (['full', 'half', 'none'] as const)[(jy % 10) - 1] ?? null;
  if (!jobAvailable(s)) return null;
  return s.job ?? defaultJob(s);
}

export function jobDef(s: GameState) {
  const m = jobMode(s);
  return m ? JOB_OPTIONS.find((j) => j.id === m)! : null;
}

/** Premia/kara do formy w walkach z pracy. */
export function jobForm(s: GameState): number {
  return jobDef(s)?.form ?? 0;
}

// ---------------------------------------------------------------------------
// Social media
// ---------------------------------------------------------------------------

export const SOCIAL_OPTIONS: { id: SocialMode; label: string; desc: string; gain: number; form: number }[] = [
  { id: 'off', label: 'Wcale', desc: 'Telefon w szafce, pełne skupienie na treningu (forma +1). Obserwujący przybywają tylko po głośnych walkach, a rozpoznawalność sama nie rośnie.', gain: 0.6, form: 1 },
  { id: 'self', label: 'Sam', desc: 'Relacje z treningów i odpowiadanie na komentarze. Co rok rośnie rozpoznawalność, przybywa ludzi, a marki płacą za posty. Kosztuje tylko skupienie, które dałby telefon w szafce.', gain: 1.3, form: 0 },
  { id: 'pro', label: 'Social media manager', desc: 'Ktoś montuje filmy i ogarnia współprace. Płacisz, ale obserwujących przybywa najszybciej, a współprace są lepiej płatne.', gain: 2.1, form: 0 },
];

export const SMM_COST = [3000, 4000, 9000, 24000, 60000];

/** Obserwujący (stare zapisy: wyliczeni z mediów). */
export function followersOf(s: GameState): number {
  if (typeof s.followers === 'number') return s.followers;
  return Math.round(150 + s.media * s.media * 60);
}

export function socialMode(s: GameState): SocialMode {
  return s.social ?? 'off';
}

export function socialDef(s: GameState) {
  return SOCIAL_OPTIONS.find((o) => o.id === socialMode(s))!;
}

export function socialCost(s: GameState): number {
  return socialMode(s) === 'pro' ? SMM_COST[s.tier] ?? 9000 : 0;
}

/** Roczny przychód ze współprac (posty sponsorowane, kody rabatowe). */
export function socialIncome(s: GameState): number {
  const m = socialMode(s);
  if (m === 'off') return 0;
  const k = followersOf(s) / 1000;
  if (k < 2) return 0;
  return Math.round((k * (m === 'pro' ? 420 : 300)) / 500) * 500;
}

export function socialForm(s: GameState): number {
  return socialDef(s).form;
}

const FAN_BASE = [25, 120, 700, 3500, 22000];

/** Ilu obserwujących przybywa po walce. */
export function fanGain(
  s: GameState,
  r: { result: 'W' | 'L' | 'D'; finish: boolean; title: boolean; freak: boolean; bonus: boolean; tier: number; amateur?: boolean },
  roll: number,
): number {
  const base = FAN_BASE[r.tier] ?? 100;
  let g = r.result === 'W' ? base * (r.finish ? 2.2 : 1) : r.result === 'D' ? base * 0.4 : base * (r.finish ? 0.15 : 0.3);
  if (r.title) g *= 2;
  if (r.bonus) g *= 1.4;
  if (r.freak) g *= 4;
  if (r.amateur) g *= 0.4;
  g *= socialDef(s).gain * (0.75 + roll * 0.5);
  return Math.max(0, Math.round(g));
}

export function addFans(s: GameState, n: number) {
  s.followers = Math.max(0, followersOf(s) + Math.round(n));
}

export function fmtFans(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace('.', ',')} mln`;
  if (n >= 10_000) return `${Math.round(n / 1000)} tys.`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')} tys.`;
  return String(n);
}

// ---------------------------------------------------------------------------
// Bilety (gale regionalne)
// ---------------------------------------------------------------------------

export const TICKET_PRICE = 80;
export const TICKET_CUT = 0.25;

export const TICKET_OPTIONS: { id: TicketPlan; label: string; sub: string; desc: string }[] = [
  { id: 'none', label: 'Odpuszczam', sub: 'forma +1', desc: 'Pełne skupienie na treningu. Ale organizator zapamięta, że nie sprzedałeś ani jednego biletu: gorsze miejsce w karcie i niższe stawki.' },
  { id: 'std', label: 'Znajomi i klub', sub: 'prowizja 25%', desc: 'Rozsyłasz bilety rodzinie, znajomym i ludziom z klubu. Bez wielkiego wysiłku.' },
  { id: 'push', label: 'Kampania', sub: 'forma −2', desc: 'Plakaty, posty, objazd po siłowniach. Sprzedasz dużo więcej, ale tracisz czas na treningu.' },
];

/** Czy przy tej ofercie sprzedajesz bilety (gale regionalne, nie freak i nie walka na odbudowę). */
export function ticketsAvailable(s: GameState, o: FightOffer): boolean {
  return s.tier === 1 && s.contract.kind !== 'freak' && !o.tuneup && !o.short && !o.opp.freak;
}

/** Ile biletów zejdzie (bez losowania: średnia). */
export function ticketForecast(s: GameState, plan: TicketPlan): number {
  if (plan === 'none') return 0;
  const fans = followersOf(s);
  const base = 18 + s.media * 0.7 + Math.min(40, fans / 150) + Math.max(0, s.streak) * 3 + (s.relations >= 3 ? 6 : 0);
  return Math.round(base * (plan === 'push' ? 1.75 : 1));
}

export function ticketSale(s: GameState, plan: TicketPlan, roll: number): { sold: number; cut: number } {
  const sold = Math.round(ticketForecast(s, plan) * (0.75 + roll * 0.5));
  return { sold, cut: Math.round((sold * TICKET_PRICE * TICKET_CUT) / 50) * 50 };
}

/** Uznanie organizatora za bilety: wpływa na miejsce w karcie i gażę na regionalnych galach. */
export function ticketRep(s: GameState): number {
  return s.flags.ticketRep ?? 0;
}
