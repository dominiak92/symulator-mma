// Trener główny: wybierany przy klubie (od zawodowstwa). Każdy pomaga w czymś innym.
import type { CoachId, GameState, StatKey } from './types';

export interface Coach {
  id: CoachId;
  name: string;
  role: string;
  desc: string;
  /** mnożnik naturalnego rozwoju umiejętności */
  growth: Partial<Record<StatKey, number>>;
  /** premia (pkt %) do każdej decyzji w walce od tej rundy */
  corner?: { from: number; bonus: number };
  /** częściej zaproszenia i gale za granicą */
  contacts?: boolean;
}

export const COACHES: Coach[] = [
  { id: 'club', name: 'Trener klubowy', role: 'w cenie klubu', desc: 'Prowadzi całą grupę. Bez fajerwerków, za to za darmo.', growth: {} },
  { id: 'boks', name: 'Zbigniew „Lewy” Maciąg', role: 'trener boksu', desc: 'Były olimpijczyk. Tarcze, worki i sparingi z bokserami: stójka i szczęka rosną szybciej.', growth: { stand: 1.2, chin: 1.1 } },
  { id: 'parter', name: 'Paulo „Gringo” Souza', role: 'trener BJJ i zapasów', desc: 'Czarny pas z Rio, od lat w Polsce. Zapasy i parter rosną szybciej.', growth: { wrest: 1.2, bjj: 1.3 } },
  { id: 'naroznik', name: 'Ryszard „Profesor” Bielak', role: 'taktyk w narożniku', desc: 'Między rundami mówi trzy zdania i każde trafia. +3% do każdej decyzji od 2. rundy, taktyka rośnie szybciej.', growth: { iq: 1.3 }, corner: { from: 2, bonus: 3 } },
  { id: 'kontakty', name: 'Marek „Paszport” Wilk', role: 'trener z kontaktami', desc: 'Zna promotorów od Dubaju po Tokio. Częściej dostajesz zaproszenia na gale za granicą i turnieje grapplingowe, kondycja rośnie szybciej.', growth: { cardio: 1.2 }, contacts: true },
];

const COACH_COST = [0, 2500, 6000, 14000, 32000];

export function coachOf(s: GameState): Coach {
  if (s.tier < 1 || !s.proDebut) return COACHES[0];
  return COACHES.find((c) => c.id === (s.coach ?? 'club')) ?? COACHES[0];
}

export function coachCost(s: GameState, id?: CoachId): number {
  const c = id ?? coachOf(s).id;
  if (c === 'club' || s.tier < 1) return 0;
  return COACH_COST[s.tier] ?? 0;
}

export function coachGrowth(s: GameState, k: StatKey): number {
  return coachOf(s).growth[k] ?? 1;
}

/** Czy wybór trenera jest już dostępny (zawodowiec, nie freak fighty). */
export function coachOpen(s: GameState): boolean {
  return s.tier >= 1 && !!s.proDebut && s.contract.kind !== 'freak';
}

/** Koszt trenera na danym szczeblu (do rynku, gdy zmieniasz federację). */
export function coachCostAt(tier: number, id: CoachId): number {
  if (id === 'club' || tier < 1) return 0;
  return COACH_COST[tier] ?? 0;
}
