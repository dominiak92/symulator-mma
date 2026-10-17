// Wynik walki, który jest już policzony, ale gracz jeszcze go nie zobaczył (plakat, animacja rund).
// Belka u góry i karty walki pokazują wtedy stan sprzed walki, żeby nie zdradzać wyniku.
import { useSyncExternalStore } from 'react';
import type { GameState } from '../engine/types';
import { mainRecord } from '../engine/game';

export type Hold = { result: 'W' | 'L' | 'D' | null; amateur: boolean; earned: number } | null;
let hold: Hold = null;
const subs = new Set<() => void>();

export function setHudHold(h: Hold) {
  if (JSON.stringify(h) === JSON.stringify(hold)) return;
  hold = h;
  subs.forEach((f) => f());
}
export function useHudHold(): Hold {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => hold,
  );
}
/** Rekord do pokazania (bez wyniku walki, która jeszcze się „toczy” na ekranie). */
export function shownRecord(g: GameState, h: Hold) {
  const r = { ...mainRecord(g) };
  if (!h || !h.result) return r;
  // walka liczy się do rekordu amatorskiego albo zawodowego; pokazujemy ten, który widzi gracz
  const sameBook = h.amateur ? !g.proDebut : !!g.proDebut;
  if (!sameBook) return r;
  if (h.result === 'W') r.w = Math.max(0, r.w - 1);
  else if (h.result === 'L') r.l = Math.max(0, r.l - 1);
  else r.d = Math.max(0, r.d - 1);
  return r;
}
