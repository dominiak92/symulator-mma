// Porównanie strategii gracza — szukanie luk w ekonomii i balansie.
// Uruchom: npx tsx scripts/balance.ts [liczba karier na strategię]
import {
  academyNext,
  campBlocked,
  campCost,
  CAMPS,
  investAcademy,
  budgetBalance,
  canStartSeason,
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
  pitchBlocked,
  pitchChance,
  pitchPay,
  pitchSponsor,
  PITCH_SLOTS,
  randomProfile,
  seasonSkip,
  startSeason,
  takeBreakYear,
  takeLoan,
  toMarket,
  toSummary,
} from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { ovr } from '../src/engine/fighter';
import type { GameState, StatKey } from '../src/engine/types';
import { STAT_KEYS } from '../src/engine/data';

type Policy = {
  name: string;
  train?: (s: GameState) => StatKey;
  club?: 'cheap' | 'best' | 'smart';
  pitch?: boolean;
  events?: 'safe' | 'risky' | 'first';
  contract?: 'promo' | 'stay' | 'freak';
  fightPick?: 'best' | 'risky' | 'smart' | 'normal';
  camps?: boolean;
  academy?: boolean;
};

const weakest = (s: GameState) => [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0];

function play(seed: number, p: Policy) {
  const rng = createRng(seed);
  const profile = { ...randomProfile(rng), start: 'osiedle' as const };
  let s = newGame({ slot: 1, mode: 'normal', seed, profile });
  let guard = 0;
  let breaks = 0;
  let loans = 0;
  let minMoney = 0;
  const moneyAt: Record<number, number> = {};
  while (s.phase !== 'ended' && guard++ < 3000) {
    minMoney = Math.min(minMoney, s.money);
    moneyAt[s.age] = s.money;
    switch (s.phase) {
      case 'training': {
        const k = (p.train ?? weakest)(s);
        let camp: string | null = null;
        if (p.camps && !campBlocked(s) && s.money - campCost(s) + budgetBalance(s) > 20000) {
          const sorted = [...CAMPS].sort((a, b) => s.stats[a.main] - s.stats[b.main]);
          camp = sorted[0].id;
        }
        s = doTraining(s, k, camp);
        break;
      }
      case 'budget': {
        if (p.pitch && !pitchBlocked(s)) {
          const best = [...PITCH_SLOTS].sort((a, b) => pitchChance(s, b.id) * pitchPay(s, b.id) - pitchChance(s, a.id) * pitchPay(s, a.id))[0];
          s = pitchSponsor(s, best.id);
        }
        if (p.academy) {
          const n = academyNext(s);
          if (n && !n.blocked && s.money - n.cost + budgetBalance(s) > 60000) s = investAcademy(s);
        }
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) {
          s = takeLoan(s);
          loans++;
        }
        if (canStartSeason(s)) s = startSeason(s);
        else {
          breaks++;
          s = takeBreakYear(s);
        }
        break;
      }
      case 'event': {
        const ev = s.event!;
        if (ev.picked !== undefined) {
          s = continueAfterEvent(s);
          break;
        }
        let pick = 0;
        if (p.events === 'risky') {
          const i = ev.choices.findIndex((c) => c.chance !== undefined || c.test);
          pick = i >= 0 ? i : 0;
        } else if (p.events !== 'first') {
          let bestScore = -1e9;
          ev.choices.forEach((c, i) => {
            const ch = choiceChance(s, i) ?? 100;
            const sc = ch + (c.effects?.money ?? 0) / 1000;
            if (sc > bestScore) {
              bestScore = sc;
              pick = i;
            }
          });
        }
        s = chooseEvent(s, pick);
        break;
      }
      case 'season': {
        const run = s.run!;
        const cur = run.fights[run.fights.length - 1];
        if (cur?.sim.pending) {
          const opts = [...cur.sim.pending.options];
          const st = cur.sim.pending.status;
          const byKind = (k: string) => opts.filter((x) => x.kind === k).sort((a, b) => b.chance - a.chance)[0];
          let o = opts.sort((a, b) => b.chance - a.chance)[0];
          if (p.fightPick === 'risky') o = byKind('risk') ?? o;
          else if (p.fightPick === 'normal') o = byKind('normal') ?? o;
          else if (p.fightPick === 'smart') {
            // gra pod sytuację: obity → odpoczynek, przegrywa albo rywal słabnie → ryzyko, inaczej najlepsza zwykła
            if (st && (st.hurt >= 35 || st.stam < 40)) o = byKind('safe') ?? o;
            else if (st && ((st.lead ?? 0) < 0 || st.oppHurt >= 35 || st.oppStam < 50)) o = byKind('risk') ?? o;
            else o = [...opts].filter((x) => x.kind !== 'safe').sort((a, b) => b.chance - a.chance)[0] ?? o;
          }
          s = decide(s, o.key);
        } else if (run.done) s = toSummary(s);
        else s = seasonSkip(s);
        break;
      }
      case 'summary':
        s = toMarket(s);
        break;
      case 'market': {
        const m = s.market!;
        let ci = -1;
        if (p.contract === 'freak') ci = m.contracts.findIndex((c) => c.available && c.kind === 'freak');
        if (ci < 0 && p.contract !== 'stay') ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available && c.kind !== 'freak');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available);
        s = pickContract(s, ci);
        let bi = 0;
        let bq = p.club === 'cheap' ? 1e9 : -1;
        m.clubs.forEach((c, i) => {
          if (!clubAvailability(s, c).ok) return;
          if (p.club === 'cheap') {
            if (c.cost < bq) {
              bq = c.cost;
              bi = i;
            }
          } else if (p.club === 'best') {
            if (c.quality > bq) {
              bq = c.quality;
              bi = i;
            }
          } else if (c.quality > bq && c.cost <= Math.max(0, s.money) * 0.5) {
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
  return { s, breaks, loans, minMoney, moneyAt };
}

const ONLY = process.argv[3];
const POLICIES_ALL: Policy[] = [
  { name: 'bazowy (rozsądny)' },
  { name: 'najtańszy klub', club: 'cheap' },
  { name: 'najlepszy klub, kredyty', club: 'best' },
  { name: 'tylko stójka', train: () => 'stand' },
  { name: 'tylko szczęka', train: () => 'chin' },
  { name: 'szuka sponsorów', pitch: true },
  { name: 'ryzykowne wydarzenia', events: 'risky' },
  { name: 'zawsze 1. wybór', events: 'first' },
  { name: 'nie awansuje', contract: 'stay' },
  { name: 'freak fighty', contract: 'freak' },
  { name: 'ryzyko w walce', fightPick: 'risky' },
  { name: 'zwykłe opcje w walce', fightPick: 'normal' },
  { name: 'walka pod sytuację', fightPick: 'smart' },
  { name: 'tylko zapasy', train: () => 'wrest' },
  { name: 'tylko parter', train: () => 'bjj' },
  { name: 'tylko kondycja', train: () => 'cardio' },
  { name: 'tylko taktyka', train: () => 'iq' },
  { name: 'obozy', camps: true },
  { name: 'akademia', academy: true },
  { name: 'obozy+akademia', camps: true, academy: true },
];
const POLICIES = ONLY ? POLICIES_ALL.filter((p) => ONLY.split(',').some((o) => p.name.includes(o))) : POLICIES_ALL;

const N = Number(process.argv[2] ?? 150);
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const fmt = (n: number) => (Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(2) + ' mln' : Math.abs(n) >= 1e3 ? (n / 1e3).toFixed(0) + ' tys.' : n.toFixed(0));
console.log(`${N} karier na strategię\n`);
console.log('strategia'.padEnd(26), 'legacy'.padStart(7), 'zarobki'.padStart(11), 'kasa koniec'.padStart(12), 'max szczebel'.padStart(13), 'pasy'.padStart(5), 'peak OVR'.padStart(9), 'przerwy'.padStart(8), 'kredyty'.padStart(8), 'kasa@25'.padStart(10), 'kasa@30'.padStart(10));
for (const p of POLICIES) {
  const r = Array.from({ length: N }, (_, i) => play(5000 + i, p));
  console.log(
    p.name.padEnd(26),
    avg(r.map((x) => x.s.ending?.legacy ?? 0)).toFixed(0).padStart(7),
    fmt(avg(r.map((x) => x.s.totalEarned))).padStart(11),
    fmt(avg(r.map((x) => x.s.money))).padStart(12),
    avg(r.map((x) => x.s.peakTier)).toFixed(2).padStart(13),
    avg(r.map((x) => x.s.belts.length)).toFixed(2).padStart(5),
    avg(r.map((x) => x.s.peakOvr)).toFixed(1).padStart(9),
    avg(r.map((x) => x.breaks)).toFixed(2).padStart(8),
    avg(r.map((x) => x.loans)).toFixed(2).padStart(8),
    fmt(avg(r.map((x) => x.moneyAt[25] ?? 0))).padStart(10),
    fmt(avg(r.map((x) => x.moneyAt[30] ?? 0))).padStart(10),
  );
}
