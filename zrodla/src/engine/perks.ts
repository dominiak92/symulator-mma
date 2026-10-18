// Atuty z obozu: dwa wybrane na rok dają premię w pasujących decyzjach walki.
import type { DecisionPoint, GameState, StatKey } from './types';

export interface Perk {
  id: string;
  name: string;
  desc: string;
  req: { stat: StatKey; min: number };
  /** premia (pkt %) dla opcji decyzji */
  bonus: (o: { stat: StatKey; kind?: string }, round: number) => number;
}

export const PERKS: Perk[] = [
  { id: 'sierp', name: 'Prawy sierp', desc: '+9% do ryzykownych akcji w stójce (szukanie nokautu).', req: { stat: 'stand', min: 45 }, bonus: (o) => (o.stat === 'stand' && o.kind === 'risk' ? 9 : 0) },
  { id: 'kombinacje', name: 'Kombinacje', desc: '+6% do zwykłych akcji w stójce.', req: { stat: 'stand', min: 40 }, bonus: (o) => (o.stat === 'stand' && o.kind !== 'risk' ? 6 : 0) },
  { id: 'nogi', name: 'Wejście w nogi', desc: '+7% do wszystkich akcji zapaśniczych.', req: { stat: 'wrest', min: 40 }, bonus: (o) => (o.stat === 'wrest' ? 7 : 0) },
  { id: 'duszenie', name: 'Duszenie zza pleców', desc: '+9% do akcji w parterze.', req: { stat: 'bjj', min: 45 }, bonus: (o) => (o.stat === 'bjj' ? 9 : 0) },
  { id: 'piec', name: 'Płuca jak piec', desc: '+5% do każdej decyzji od 3. rundy.', req: { stat: 'cardio', min: 45 }, bonus: (_o, r) => (r >= 3 ? 5 : 0) },
  { id: 'glowa', name: 'Chłodna głowa', desc: '+7% do bezpiecznych opcji (odpoczynek, trzymanie planu).', req: { stat: 'iq', min: 40 }, bonus: (o) => (o.kind === 'safe' ? 7 : 0) },
];

export const MAX_PERKS = 2;

export function perkUnlocked(s: GameState, p: Perk): boolean {
  return s.stats[p.req.stat] >= p.req.min;
}

/** Aktywne atuty (wybrane i wciąż odblokowane). */
export function activePerks(s: GameState): Perk[] {
  return (s.perks ?? [])
    .map((id) => PERKS.find((p) => p.id === id))
    .filter((p): p is Perk => !!p && perkUnlocked(s, p))
    .slice(0, MAX_PERKS);
}

/** Dolicza premie z atutów do opcji decyzji (i podpisuje opcję nazwą atutu). */
export function applyPerks(dp: DecisionPoint, perks: Perk[], chanceToDist: (c: number) => [number, number, number]) {
  if (!perks.length) return;
  for (const o of dp.options) {
    let b = 0;
    const names: string[] = [];
    for (const p of perks) {
      const v = p.bonus(o, dp.round);
      if (v > 0) {
        b += v;
        names.push(p.name);
      }
    }
    if (b > 0) {
      o.chance = Math.min(95, o.chance + b);
      o.dist = chanceToDist(o.chance);
      o.perk = names.join(', ');
    }
  }
}
