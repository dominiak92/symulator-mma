// Bot rozgrywający tysiące karier — do balansu i łapania błędów.
// Uruchom: npx tsx scripts/sim.ts [liczba] [profil]
import {
  budgetBalance,
  canStartSeason,
  takeBreakYear,
  choiceChance,
  chooseEvent,
  clubAvailability,
  confirmMarket,
  continueAfterEvent,
  decide,
  doTraining,
  loanOffer,
  newGame,
  pickClub,
  pickContract,
  randomProfile,
  seasonSkip,
  startSeason,
  takeLoan,
  toMarket,
  toSummary,
} from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { ovr } from '../src/engine/fighter';
import type { GameState, StartProfile, StatKey } from '../src/engine/types';
import { STAT_KEYS } from '../src/engine/data';

const N = Number(process.argv[2] ?? 300);
const START = (process.argv[3] ?? 'osiedle') as StartProfile;
const NAIVE = process.argv[4] === 'naive';

function botTrain(s: GameState): StatKey {
  // podkręca najsłabszą z sensownych statystyk
  return [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0];
}

function play(seed: number) {
  const rng = createRng(seed);
  const profile = { ...randomProfile(rng), start: START };
  let s = newGame({ slot: 1, mode: 'normal', seed, profile });
  let guard = 0;
  let decisions = 0;
  let events = 0;
  let breaks = 0;
  while (s.phase !== 'ended' && guard++ < 2000) {
    switch (s.phase) {
      case 'training':
        s = doTraining(s, botTrain(s));
        break;
      case 'budget':
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
        if (canStartSeason(s)) s = startSeason(s);
        else {
          breaks++;
          s = takeBreakYear(s);
        }
        break;
      case 'event': {
        const ev = s.event!;
        if (ev.picked === undefined && NAIVE) {
          events++;
          s = chooseEvent(s, 0);
        } else if (ev.picked === undefined) {
          events++;
          // wybiera bezpieczniejszą opcję z większą szansą
          let best = 0;
          let bestScore = -1;
          ev.choices.forEach((c, i) => {
            const ch = choiceChance(s, i) ?? 100;
            const sc = ch + (c.effects?.money ?? 0) / 1000;
            if (sc > bestScore) {
              bestScore = sc;
              best = i;
            }
          });
          s = chooseEvent(s, best);
        } else s = continueAfterEvent(s);
        break;
      }
      case 'season': {
        const run = s.run!;
        const cur = run.fights[run.fights.length - 1];
        if (cur?.sim.pending && NAIVE) {
          decisions++;
          s = decide(s, cur.sim.pending.options[0].key);
        } else if (cur?.sim.pending) {
          decisions++;
          const best = [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0];
          s = decide(s, best.key);
        } else if (run.done) s = toSummary(s);
        else s = seasonSkip(s);
        break;
      }
      case 'summary':
        s = toMarket(s);
        break;
      case 'market': {
        const m = s.market!;
        if (NAIVE) {
          s = confirmMarket(s);
          break;
        }
        // preferuje awans, potem zostań
        let ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available && c.kind !== 'freak');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available);
        s = pickContract(s, ci);
        // najlepszy klub, na który stać
        let bi = 0;
        let bq = -1;
        m.clubs.forEach((c, i) => {
          if (clubAvailability(s, c).ok && c.quality > bq && c.cost <= Math.max(0, s.money) * 0.5) {
            bq = c.quality;
            bi = i;
          }
        });
        s = pickClub(s, bi);
        s = confirmMarket(s);
        break;
      }
    }
  }
  if (guard >= 2000) throw new Error('pętla bez końca, seed ' + seed + ' faza ' + s.phase);
  return { s, decisions, events, breaks };
}

const t0 = Date.now();
const res = [];
for (let i = 0; i < N; i++) res.push(play(1000 + i));
const ms = Date.now() - t0;

const avg = (f: (x: (typeof res)[0]) => number) => (res.reduce((a, b) => a + f(b), 0) / res.length).toFixed(2);
const dist = (f: (x: (typeof res)[0]) => string) => {
  const m = new Map<string, number>();
  for (const r of res) m.set(f(r), (m.get(f(r)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${((v / res.length) * 100).toFixed(1)}%`).join('\n  ');
};

console.log(`${N} karier (${START}) w ${ms} ms`);
console.log('śr. sezonów', avg((r) => r.s.seasons.length), '| śr. walk', avg((r) => r.s.history.length), '| wiek końca', avg((r) => r.s.age));
console.log('śr. rekord W', avg((r) => r.s.record.w), 'L', avg((r) => r.s.record.l), '| decyzji', avg((r) => r.decisions), '| wydarzeń', avg((r) => r.events));
console.log('śr. peak OVR', avg((r) => r.s.peakOvr), '| końcowe OVR', avg((r) => ovr(r.s.stats)), '| legacy', avg((r) => r.s.ending?.legacy ?? 0));
console.log('śr. zarobki', avg((r) => r.s.totalEarned), '| kasa na koniec', avg((r) => r.s.money), '| pasy', avg((r) => r.s.belts.length));
console.log('rekord amatorski W', avg((r) => r.s.amRecord.w), 'L', avg((r) => r.s.amRecord.l), '| medale', avg((r) => r.s.medals.gold + r.s.medals.silver + r.s.medals.bronze), '| złota', avg((r) => r.s.medals.gold));
const deb = res.filter((r) => r.s.proDebut);
console.log('debiut zawodowy:', ((deb.length / res.length) * 100).toFixed(1) + '%', '| śr. wiek debiutu', (deb.reduce((a, r) => a + r.s.proDebut!.age, 0) / Math.max(1, deb.length)).toFixed(1));
console.log('lat przerwy (praca):', avg((r) => r.breaks), '| karier z przerwą:', ((res.filter((r) => r.breaks > 0).length / res.length) * 100).toFixed(1) + '%', '| śr. aktywnych kredytów na koniec', avg((r) => r.s.loans.length));
console.log('koniec przed 25. rokiem życia:', ((res.filter((r) => r.s.age < 25).length / res.length) * 100).toFixed(1) + '%');
console.log('max szczebel:\n  ' + dist((r) => String(r.s.peakTier)));
console.log('werdykty:\n  ' + dist((r) => r.s.ending?.verdict ?? '?'));
console.log('powód końca:\n  ' + dist((r) => (r.s.ending?.reason ?? '?').slice(0, 50)));
const methods = new Map<string, number>();
let fights = 0;
for (const r of res)
  for (const h of r.s.history) {
    fights++;
    methods.set(h.method, (methods.get(h.method) ?? 0) + 1);
  }
console.log('metody:', [...methods.entries()].map(([k, v]) => `${k} ${((v / fights) * 100).toFixed(1)}%`).join(', '));
