import { describe, expect, it } from 'vitest';
import {
  budgetBalance,
  chooseEvent,
  confirmMarket,
  continueAfterEvent,
  decide,
  doTraining,
  loanOffer,
  newGame,
  randomProfile,
  seasonSkip,
  startSeason,
  takeLoan,
  toMarket,
  toSummary,
  legacyScore,
} from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { chanceFrom, distFrom } from '../src/engine/fight';
import { STAT_KEYS } from '../src/engine/data';
import type { GameState, StartProfile } from '../src/engine/types';

function play(seed: number, start: StartProfile = 'osiedle', pickFirst = true): GameState {
  const rng = createRng(seed);
  let s = newGame({ slot: 1, mode: 'normal', seed, profile: { ...randomProfile(rng), start } });
  for (let guard = 0; guard < 3000 && s.phase !== 'ended'; guard++) {
    switch (s.phase) {
      case 'training':
        s = doTraining(s, STAT_KEYS[guard % 6]);
        break;
      case 'budget':
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
        s = startSeason(s);
        break;
      case 'event':
        s = s.event!.picked === undefined ? chooseEvent(s, pickFirst ? 0 : s.event!.choices.length - 1) : continueAfterEvent(s);
        break;
      case 'season': {
        const cur = s.run!.fights[s.run!.fights.length - 1];
        if (cur?.sim.pending) s = decide(s, cur.sim.pending.options[guard % cur.sim.pending.options.length].key);
        else if (s.run!.done) s = toSummary(s);
        else s = seasonSkip(s);
        break;
      }
      case 'summary':
        s = toMarket(s);
        break;
      case 'market':
        s = confirmMarket(s);
        break;
    }
  }
  return s;
}

function hasBadNumber(o: unknown): boolean {
  if (typeof o === 'number') return !Number.isFinite(o);
  if (Array.isArray(o)) return o.some(hasBadNumber);
  if (o && typeof o === 'object') return Object.values(o).some(hasBadNumber);
  return false;
}

describe('silnik gry', () => {
  it('ta sama seed i te same decyzje dają identyczną karierę', () => {
    const a = play(42);
    const b = play(42);
    expect(JSON.stringify({ ...a, createdAt: 0 })).toEqual(JSON.stringify({ ...b, createdAt: 0 }));
  });

  it('kariery kończą się dla każdego profilu startowego, bez NaN w stanie', () => {
    for (const start of ['osiedle', 'biznes', 'junior', 'wybraniec'] as StartProfile[]) {
      for (let i = 0; i < 15; i++) {
        const s = play(1000 + i, start, i % 2 === 0);
        expect(s.phase).toBe('ended');
        expect(s.ending).not.toBeNull();
        expect(hasBadNumber(s)).toBe(false);
        expect(s.age).toBeGreaterThanOrEqual(17);
        expect(s.age).toBeLessThanOrEqual(41);
      }
    }
  });

  it('stan gry przeżywa zapis do JSON i odczyt', () => {
    const s = play(7);
    const json = JSON.stringify(s);
    const back = JSON.parse(json);
    expect(JSON.stringify(back)).toBe(json);
    expect(back.phase).toBe('ended');
  });

  it('statystyki mieszczą się w zakresie 1–99', () => {
    for (let i = 0; i < 20; i++) {
      const s = play(500 + i);
      for (const k of STAT_KEYS) {
        expect(s.stats[k]).toBeGreaterThanOrEqual(1);
        expect(s.stats[k]).toBeLessThanOrEqual(99);
      }
    }
  });

  it('rekord zawodowy i amatorski zgadzają się z historią walk', () => {
    const s = play(99);
    const count = (am: boolean) => {
      const hs = s.history.filter((h) => !!h.amateur === am);
      return { w: hs.filter((h) => h.result === 'W').length, l: hs.filter((h) => h.result === 'L').length, d: hs.filter((h) => h.result === 'D').length };
    };
    expect(s.record).toEqual(count(false));
    expect(s.amRecord).toEqual(count(true));
    expect(s.amRecord.d).toBe(0); // w drabince nie ma remisów
  });

  it('turnieje amatorskie dają medale, debiut zawodowy najwcześniej w wieku 18 lat', () => {
    for (let seed = 1; seed < 40; seed++) {
      const s = play(seed);
      if (s.proDebut) expect(s.proDebut.age).toBeGreaterThanOrEqual(18);
      for (const h of s.history) if (h.amateur) expect(h.stage).toBeTruthy();
      // po pierwszej walce zawodowej nie ma już walk amatorskich
      const firstPro = s.history.findIndex((h) => !h.amateur && !h.freak);
      if (firstPro >= 0) expect(s.history.slice(firstPro).some((h) => h.amateur)).toBe(false);
    }
  });

  it('Wybraniec nie dostaje punktów LEGACY', () => {
    const s = play(3, 'wybraniec');
    expect(legacyScore(s)).toBe(0);
  });
});

describe('jawne szanse', () => {
  it('rozkład super/sukces/porażka sumuje się do 100', () => {
    for (let a = 0; a <= 100; a += 7)
      for (let d = 0; d <= 100; d += 9) {
        const p = chanceFrom(a, d);
        const [x, y, z] = distFrom(p);
        expect(x + y + z).toBe(100);
        expect(p).toBeGreaterThanOrEqual(5);
        expect(p).toBeLessThanOrEqual(95);
      }
  });
});

import { polishTypography } from '../src/typography';
describe('typografia', () => {
  it('wiąże jednoliterowe słowa i liczby z jednostkami', () => {
    const t = polishTypography('Mama wyjęła z koperty w szafie 3,8 tys. zł i 16 lat · R2 3:12');
    expect(t).toBe('Mama wyjęła z koperty w szafie 3,8 tys. zł i 16 lat · R2 3:12');
  });
});
