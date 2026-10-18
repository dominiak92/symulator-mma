import { vi } from 'vitest';
vi.setConfig({ testTimeout: 60000 });
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
        s = G2.canStartSeason(s) ? startSeason(s) : G2.takeBreakYear(s);
        break;
      case 'event':
        s = s.event!.picked === undefined ? chooseEvent(s, pickFirst ? 0 : s.event!.choices.length - 1) : continueAfterEvent(s);
        break;
      case 'season': {
        const cur = s.run!.fights[s.run!.fights.length - 1];
        if (s.run!.invite) s = G2.acceptInvite(s);
        else if (s.run!.weigh) s = G2.weighIn(s, guard % 2 ? 'cut' : 'pay');
        else if (s.run!.post) s = G2.postAnswer(s, s.run!.post.options[guard % s.run!.post.options.length].key);
        else if (s.run!.press) s = G2.pressAnswer(s, (['calm', 'provoke', 'insult'] as const)[guard % 3]);
        else if (s.run!.offer) s = G2.acceptOffer(s, (['std', 'rival', 'hard'] as const)[guard % 3]);
        else if (cur?.sim.pending) s = decide(s, cur.sim.pending.options[guard % cur.sim.pending.options.length].key);
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

import * as G2 from '../src/engine/game';
describe('obozy i akademia', () => {
  it('amator nie pojedzie na obóz ani nie otworzy akademii', () => {
    const s = newGame({ slot: 1, mode: 'normal', seed: 7, profile: G2.randomProfile(createRng(7)) });
    expect(G2.campBlocked(s)).not.toBeNull();
    expect(G2.academyNext(s)!.blocked).not.toBeNull();
    const t = doTraining(s, 'stand', 'tajlandia');
    expect(t.money).toBe(s.money);
    expect(t.camp).toBeNull();
  });
  it('obóz kosztuje i podnosi umiejętności, akademia daje przychód', () => {
    const s = newGame({ slot: 1, mode: 'normal', seed: 8, profile: G2.randomProfile(createRng(8)) });
    s.tier = 2;
    s.age = 25;
    s.money = 500000;
    const camp = G2.CAMPS[0];
    const room = s.potential[camp.main] - s.stats[camp.main];
    const t = doTraining(s, 'iq', camp.id);
    expect(t.money).toBe(500000 - G2.campCost(s));
    expect(t.camp).toBe(camp.id);
    if (room > 3) expect(t.stats[camp.main]).toBeGreaterThan(s.stats[camp.main]);
    const before = budgetBalance(t);
    const a = G2.investAcademy(t);
    expect(a.academy).toBe(1);
    expect(a.money).toBe(t.money - G2.ACADEMY_LEVELS[0].cost);
    expect(budgetBalance(a)).toBeGreaterThan(before);
  });
});

describe('zdarzenia', () => {
  it('mają unikalne identyfikatory', async () => {
    const { EVENTS } = await import('../src/engine/events');
    const ids = EVENTS.map((e) => e.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dup).toEqual([]);
  });
});

describe('decyzje w walce', () => {
  it('plan na walkę pada najwyżej raz, a w walce zawodowej zawsze', () => {
    for (let seed = 1; seed <= 6; seed++) {
      const rng = createRng(seed);
      let s = newGame({ slot: 1, mode: 'normal', seed, profile: { ...randomProfile(rng), start: 'osiedle' } });
      for (let guard = 0; guard < 3000 && s.phase !== 'ended'; guard++) {
        if (s.phase === 'training') s = doTraining(s, STAT_KEYS[guard % 6]);
        else if (s.phase === 'budget') s = G2.canStartSeason(s) ? startSeason(s) : G2.takeBreakYear(s);
        else if (s.phase === 'event') s = s.event!.picked === undefined ? chooseEvent(s, 0) : continueAfterEvent(s);
        else if (s.phase === 'season') {
          const run = s.run!;
          const cur = run.fights[run.fights.length - 1];
          if (run.invite) s = G2.acceptInvite(s);
          else if (run.weigh) s = G2.weighIn(s, 'pay');
          else if (run.post) s = G2.postAnswer(s, run.post.options[0].key);
          else if (run.press) s = G2.pressAnswer(s, 'calm');
          else if (run.offer) s = G2.acceptOffer(s);
          else if (cur?.sim.pending) s = decide(s, cur.sim.pending.options[guard % cur.sim.pending.options.length].key);
          else if (run.done) {
            for (const f of run.fights) {
              const plans = f.moments.filter((m) => m.title === 'Plan na walkę').length;
              expect(plans).toBeLessThanOrEqual(1);
              if (f.sim.pro && f.method !== 'Walkower') expect(plans).toBe(1);
            }
            s = toSummary(s);
          } else s = seasonSkip(s);
        } else if (s.phase === 'summary') s = toMarket(s);
        else if (s.phase === 'market') s = confirmMarket(s);
      }
    }
  });
});

describe('szybka kariera', () => {
  it('startuje od kontraktu zawodowego, kończy się najpóźniej w wieku 35 lat i ma niższe LEGACY niż pełna', () => {
    let quickSum = 0;
    let fullSum = 0;
    for (let seed = 1; seed <= 12; seed++) {
      for (const quick of [true, false]) {
        const rng = createRng(seed);
        let s = newGame({ slot: 1, mode: 'normal', seed, quick, profile: { ...randomProfile(rng), start: 'osiedle' } });
        let checkedStart = false;
        for (let guard = 0; guard < 3000 && s.phase !== 'ended'; guard++) {
          if (quick && !checkedStart && s.phase === 'market') {
            expect(s.market!.contracts.every((c) => c.kind === 'promotion')).toBe(true);
            // czysty start: automat nie zostawia obietnic, długów, kontuzji ani osiągnięć z amatorki
            expect(s.age).toBe(18);
            expect(s.promises.length).toBe(0);
            expect(s.loans.length).toBe(0);
            expect(s.injury).toBeNull();
            checkedStart = true;
          }
          if (s.phase === 'training') s = doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]);
          else if (s.phase === 'budget') {
            if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
            s = G2.canStartSeason(s) ? startSeason(s) : G2.takeBreakYear(s);
          } else if (s.phase === 'event') s = s.event!.picked === undefined ? chooseEvent(s, 0) : continueAfterEvent(s);
          else if (s.phase === 'season') {
            const run = s.run!;
            const cur = run.fights[run.fights.length - 1];
            if (run.invite) s = G2.acceptInvite(s);
            else if (run.weigh) s = G2.weighIn(s, 'pay');
            else if (run.post) s = G2.postAnswer(s, run.post.options[0].key);
            else if (run.press) s = G2.pressAnswer(s, 'calm');
            else if (run.offer) s = G2.acceptOffer(s);
            else if (cur?.sim.pending) s = decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
            else if (run.done) s = toSummary(s);
            else s = seasonSkip(s);
          } else if (s.phase === 'summary') s = toMarket(s);
          else if (s.phase === 'market') s = confirmMarket(s);
        }
        expect(s.phase).toBe('ended');
        if (quick) {
          expect(checkedStart).toBe(true);
          expect(s.age).toBeLessThanOrEqual(35);
          quickSum += s.ending!.legacy;
        } else fullSum += s.ending!.legacy;
      }
    }
    expect(quickSum).toBeLessThan(fullSum);
  });
});

describe('v45: życie zawodnika', () => {
  // gra botem do pierwszej sytuacji spełniającej warunek
  function until(seed: number, cond: (s: GameState) => boolean, act?: (s: GameState) => GameState | null): GameState | null {
    const rng = createRng(seed);
    let s = newGame({ slot: 1, mode: 'normal', seed, profile: { ...randomProfile(rng), start: 'osiedle' } });
    for (let guard = 0; guard < 4000 && s.phase !== 'ended'; guard++) {
      if (cond(s)) return s;
      const a = act?.(s);
      if (a) {
        s = a;
        continue;
      }
      if (s.phase === 'training') s = doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]);
      else if (s.phase === 'budget') {
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
        s = G2.canStartSeason(s) ? startSeason(s) : G2.takeBreakYear(s);
      } else if (s.phase === 'event') s = s.event!.picked === undefined ? chooseEvent(s, 0) : continueAfterEvent(s);
      else if (s.phase === 'season') {
        const run = s.run!;
        const cur = run.fights[run.fights.length - 1];
        if (run.invite) s = G2.acceptInvite(s);
        else if (run.weigh) s = G2.weighIn(s, 'pay');
        else if (run.post) s = G2.postAnswer(s, run.post.options[run.post.options.length - 1].key);
        else if (run.press) s = G2.pressAnswer(s, 'calm');
        else if (run.offer) s = G2.acceptOffer(s);
        else if (cur?.sim.pending) s = decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
        else if (run.done) s = toSummary(s);
        else s = seasonSkip(s);
      } else if (s.phase === 'summary') s = toMarket(s);
      else if (s.phase === 'market') s = confirmMarket(s);
    }
    return null;
  }

  it('bilety na regionalnej gali: prowizja trafia na konto i do raportu walki', () => {
    let checked = 0;
    for (let seed = 1; seed <= 12 && checked < 3; seed++) {
      const s = until(seed, (x) => x.phase === 'season' && !!x.run?.offer && x.tier === 1 && !x.run.offer.tuneup && !x.run.offer.short && !x.run.offer.opp.freak);
      if (!s) continue;
      const before = s.money;
      const n = G2.acceptOffer(s, 'std', 'push');
      const f = n.run!.fights[n.run!.fights.length - 1] ?? null;
      if (!f) continue; // ważenie albo konferencja: pomijamy
      expect(f.tickets?.plan).toBe('push');
      expect(f.tickets!.sold).toBeGreaterThan(0);
      expect(n.money).toBeGreaterThanOrEqual(before + f.tickets!.cut);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('ważenie czeka na decyzję i po niej walka rusza', () => {
    let checked = 0;
    for (let seed = 1; seed <= 40 && checked < 2; seed++) {
      const s = until(
        seed,
        (x) => x.phase === 'season' && !!x.run?.weigh,
        (x) => (x.phase === 'market' && x.tier >= 1 ? (() => { const y = G2.changeDivision(x, G2.divisionOptions(x)[0]); return y === x ? null : confirmMarket(y); })() : null),
      );
      if (!s) continue;
      expect(G2.seasonNext(s)).toEqual(s);
      const n = G2.weighIn(s, 'pay');
      expect(n.run!.weigh).toBeFalsy();
      const f = n.run!.fights[n.run!.fights.length - 1];
      expect(f.weightMiss).toBe(true);
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('negocjacje kontraktu: jedna próba na rynek', () => {
    const s = until(1, (x) => x.phase === 'market' && x.market!.contracts.some((c) => c.kind !== 'stay' && c.purse > 0));
    expect(s).not.toBeNull();
    const idx = s!.market!.contracts.findIndex((c) => c.kind !== 'stay' && c.purse > 0);
    const a = G2.negotiateContract(G2.pickContract(s!, idx), idx, 'bonus');
    expect(a.market!.negotiated).toBe(true);
    expect(a.market!.contracts[idx].nego).toBeTruthy();
    const b = G2.negotiateContract(a, idx, 'purse');
    expect(b).toBe(a);
  });

  it('mikrofon po wygranej i decyzja przed kolejną walką', () => {
    const s = until(2, (x) => x.phase === 'season' && x.run?.post?.kind === 'mic');
    expect(s).not.toBeNull();
    expect(G2.seasonNext(s!)).toEqual(s);
    const n = G2.postAnswer(s!, 'thanks');
    expect(n.run!.post).toBeFalsy();
    const f = n.run!.fights[n.run!.fights.length - 1];
    expect(f.moments[f.moments.length - 1].title).toBe('Mikrofon');
  });
});

describe('v47: wydarzenia poza federacją', () => {
  it('zaproszenie blokuje rok do decyzji, a start zapisuje wynik', () => {
    let checked = 0;
    for (let seed = 1; seed <= 20 && checked < 3; seed++) {
      const rng = createRng(seed);
      let s = newGame({ slot: 1, mode: 'normal', seed, profile: { ...randomProfile(rng), start: 'osiedle' } });
      for (let guard = 0; guard < 4000 && s.phase !== 'ended'; guard++) {
        if (s.phase === 'season' && s.run?.invite) {
          expect(G2.seasonNext(s)).toEqual(s);
          const a = G2.acceptInvite(s);
          expect(a.run!.invite).toBeFalsy();
          expect(a.run!.sideLog?.length).toBeGreaterThan(0);
          checked++;
          break;
        }
        if (s.phase === 'training') s = doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]);
        else if (s.phase === 'budget') {
          if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
          s = G2.canStartSeason(s) ? startSeason(s) : G2.takeBreakYear(s);
        } else if (s.phase === 'event') s = s.event!.picked === undefined ? chooseEvent(s, 0) : continueAfterEvent(s);
        else if (s.phase === 'season') {
          const run = s.run!;
          const cur = run.fights[run.fights.length - 1];
          if (run.weigh) s = G2.weighIn(s, 'pay');
          else if (run.post) s = G2.postAnswer(s, run.post.options[0].key);
          else if (run.press) s = G2.pressAnswer(s, 'calm');
          else if (run.offer) s = G2.acceptOffer(s);
          else if (cur?.sim.pending) s = decide(s, cur.sim.pending.options[0].key);
          else if (run.done) s = toSummary(s);
          else s = seasonSkip(s);
        } else if (s.phase === 'summary') s = toMarket(s);
        else if (s.phase === 'market') s = confirmMarket(s);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('kontrakt na wyłączność blokuje gale za granicą, ale nie zaproszenia spoza MMA', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const rng = createRng(seed);
      let s = newGame({ slot: 1, mode: 'normal', seed, profile: { ...randomProfile(rng), start: 'osiedle' } });
      for (let guard = 0; guard < 4000 && s.phase !== 'ended'; guard++) {
        if (s.phase === 'season' && s.run?.offer?.abroad) expect(G2.isExclusiveContract(s)).toBe(false);
        if (s.phase === 'training') s = doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]);
        else if (s.phase === 'budget') {
          if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
          s = G2.canStartSeason(s) ? startSeason(s) : G2.takeBreakYear(s);
        } else if (s.phase === 'event') s = s.event!.picked === undefined ? chooseEvent(s, 0) : continueAfterEvent(s);
        else if (s.phase === 'season') {
          const run = s.run!;
          const cur = run.fights[run.fights.length - 1];
          if (run.invite) s = G2.declineInvite(s);
          else if (run.weigh) s = G2.weighIn(s, 'pay');
          else if (run.post) s = G2.postAnswer(s, run.post.options[0].key);
          else if (run.press) s = G2.pressAnswer(s, 'calm');
          else if (run.offer) s = G2.acceptOffer(s);
          else if (cur?.sim.pending) s = decide(s, cur.sim.pending.options[0].key);
          else if (run.done) s = toSummary(s);
          else s = seasonSkip(s);
        } else if (s.phase === 'summary') s = toMarket(s);
        else if (s.phase === 'market') s = confirmMarket(s);
      }
    }
  });
});
