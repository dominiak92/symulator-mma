// Raport z wielu karier: powody końca, długość kariery, wyniki wg profilu startowego i trudności.
// Uruchom: npx tsx scripts/careers_report.ts [kariery na wariant]
import * as G from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { STAT_KEYS, START_PROFILES } from '../src/engine/data';
import type { GameState } from '../src/engine/types';

function play(seed: number, start: string, difficulty: 'normal' | 'hard') {
  const rng = createRng(seed);
  let s: GameState = G.newGame({ slot: 1, mode: 'normal', seed, profile: { ...G.randomProfile(rng), start: start as never, difficulty } });
  let guard = 0;
  while (s.phase !== 'ended' && guard++ < 4000) {
    switch (s.phase) {
      case 'training': s = G.doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]); break;
      case 'budget':
        if (s.money + G.budgetBalance(s) < 0 && G.loanOffer(s)) s = G.takeLoan(s);
        if (!G.canStartSeason(s) && G.cheaperClub(s)) s = G.downgradeClub(s);
        s = G.canStartSeason(s) ? G.startSeason(s) : G.takeBreakYear(s);
        break;
      case 'event': s = s.event!.picked !== undefined ? G.continueAfterEvent(s) : G.chooseEvent(s, 0); break;
      case 'season': {
        const run = s.run!; const cur = run.fights[run.fights.length - 1];
        if (run.invite) s = G.acceptInvite(s);
        else if (run.weigh) s = G.weighIn(s, 'pay');
        else if (run.post) s = G.postAnswer(s, run.post.options[0].key);
        else if (run.press) s = G.pressAnswer(s, 'calm');
        else if (run.offer) s = G.acceptOffer(s);
        else if (cur?.sim.pending) s = G.decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
        else if (run.done) s = G.toSummary(s); else s = G.seasonSkip(s);
        break;
      }
      case 'summary': s = G.toMarket(s); break;
      case 'market': {
        const m = s.market!;
        let ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available && c.kind !== 'freak');
        if (ci < 0) ci = 0;
        s = G.pickContract(s, ci);
        let bi = 0, bq = -1;
        m.clubs.forEach((c, i) => { if (G.clubAvailability(s, c).ok && c.quality > bq && c.cost <= Math.max(0, s.money) * 0.5) { bq = c.quality; bi = i; } });
        s = G.pickClub(s, bi); s = G.confirmMarket(s);
        break;
      }
    }
  }
  return s;
}

const N = Number(process.argv[2] ?? 80);
const reasons: Record<string, number> = {};
const ages: number[] = [];
const rows: string[] = [];
for (const start of Object.keys(START_PROFILES)) {
  for (const diff of ['normal', 'hard'] as const) {
    const res = Array.from({ length: N }, (_, i) => play(9000 + i, start, diff));
    for (const s of res) {
      const r = (s.ending?.reason ?? '?').split('.')[0].slice(0, 60);
      reasons[r] = (reasons[r] ?? 0) + 1;
      ages.push(s.age);
    }
    const avg = (f: (s: GameState) => number) => (res.reduce((a, s) => a + f(s), 0) / res.length);
    rows.push(`${start.padEnd(10)} ${diff.padEnd(7)} legacy ${avg((s) => s.ending?.legacy ?? 0).toFixed(0).padStart(5)}  surowe ${avg((s) => G.legacyScore({ ...s, profile: { ...s.profile, start: 'osiedle', difficulty: 'normal' } })).toFixed(0).padStart(5)}  szczebel ${avg((s) => s.peakTier).toFixed(2)}  pasy ${avg((s) => s.belts.length).toFixed(2)}  wiek końca ${avg((s) => s.age).toFixed(1)}  sezony ${avg((s) => s.seasons.length).toFixed(1)}`);
  }
}
console.log(rows.join('\n'));
console.log('\nPowody końca kariery:');
for (const [r, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(5), r);
ages.sort((a, b) => a - b);
console.log('\nWiek końca: mediana', ages[Math.floor(ages.length / 2)], 'min', ages[0], 'max', ages[ages.length - 1]);
