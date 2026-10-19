import { galaPrefix } from '../engine/data';
import { isDoubleChamp } from '../engine/game';
import type { GameState } from '../engine/types';

/** Tytuł przy nazwisku: „mistrz XSW”, „były mistrz Armady”, „mistrz Polski amatorów”. Pusty, gdy brak pasów. */
/** Regionalne federacje skracamy do marki: „Armada Fight Night Opole” → „Armada”. */
const shortFed = (t: string) => t.replace(/ (Fight Night|Fight League|MMA)( [^ ]+)*$/, '');

export function champTitle(g: GameState): string {
  return shortFed(champTitleFull(g));
}

function champTitleFull(g: GameState): string {
  if (isDoubleChamp(g)) return `podwójny mistrz ${galaPrefix(g.fed)}`;
  if (g.tier > 0 && g.rank === 0 && g.contract?.kind !== 'freak') return `mistrz ${galaPrefix(g.fed)}`;
  const pro = [...g.belts].reverse().find((b) => /\(([^)]+)\)$/.test(b.name) && !/superfight/.test(b.name));
  if (pro) return `były mistrz ${pro.name.match(/\(([^)]+)\)$/)![1]}`;
  if (g.belts.some((b) => /superfight/.test(b.name))) return 'zwycięzca superfightu';
  if (g.belts.length) return g.tier === 0 ? 'mistrz Polski amatorów' : 'były mistrz Polski amatorów';
  return '';
}

/** Ślady kariery na twarzy gracza: pojawiają się z liczbą walk i przyjętych nokautów. */
export function careerMarks(g: GameState): { ear?: boolean; scar?: boolean; nose?: boolean } {
  const fights = g.history.length;
  const f = g.finishes;
  return {
    ear: fights >= 14 || f.sub + f.subLosses >= 4,
    scar: f.koLosses >= 1 || g.wear >= 45,
    nose: f.koLosses >= 3 || fights >= 28,
  };
}
