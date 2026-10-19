// Prowadzi zapis botem do wskazanej fazy (np. market, ended): npx tsx scripts/to_phase.ts we.json wy.json faza [zużycie]
import * as G from '../src/engine/game';
import { STAT_KEYS } from '../src/engine/data';
import { readFileSync, writeFileSync } from 'node:fs';
import type { GameState } from '../src/engine/types';
const [IN, OUT, PHASE, WEAR] = process.argv.slice(2);
const raw = JSON.parse(readFileSync(IN, 'utf8'));
let s: GameState = raw.state ?? raw;
if (WEAR) s.wear = Number(WEAR);
let guard = 0;
while (s.phase !== PHASE && guard++ < 4000) {
  switch (s.phase) {
    case 'training': s = G.doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]); break;
    case 'budget': s = G.canStartSeason(s) ? G.startSeason(s) : G.takeBreakYear(s); break;
    case 'event': s = s.event!.picked !== undefined ? G.continueAfterEvent(s) : G.chooseEvent(s, 0); break;
    case 'season': {
      const run = s.run!; const cur = run.fights[run.fights.length - 1];
      if (run.invite) s = G.declineInvite(s);
      else if (run.weigh) s = G.weighIn(s, 'pay');
      else if (run.post) s = G.postAnswer(s, run.post.options[0].key);
      else if (run.press) s = G.pressAnswer(s, 'calm');
      else if (run.offer) s = G.acceptOffer(s, 'std', 'std');
      else if (cur?.sim.pending) s = G.decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
      else if (run.done) s = G.toSummary(s);
      else s = G.seasonSkip(s);
      break;
    }
    case 'summary': s = G.toMarket(s); break;
    case 'market': s = G.confirmMarket(s); if (WEAR) s.wear = Math.max(s.wear, Number(WEAR)); break;
    default: guard = 1e9;
  }
}
writeFileSync(OUT, JSON.stringify(raw.state ? { ...raw, state: s } : s));
console.log('faza', s.phase, 'wiek', s.age, 'zużycie', Math.round(s.wear));
