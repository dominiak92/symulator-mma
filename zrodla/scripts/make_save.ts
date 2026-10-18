// Tworzy zapis gry na danym etapie (do testów UI): npx tsx scripts/make_save.ts <wiek> <plik.json> [pieniądze]
// Gra botem do zadanego wieku i zatrzymuje się na ekranie treningu.
import * as G from '../src/engine/game';
import { pressAnswer, acceptOffer, budgetBalance, canStartSeason, chooseEvent, clubAvailability, confirmMarket, continueAfterEvent, decide, doTraining, loanOffer, newGame, pickClub, pickContract, randomProfile, seasonSkip, startSeason, takeBreakYear, takeLoan, toMarket, toSummary } from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { STAT_KEYS } from '../src/engine/data';
import { writeFileSync } from 'node:fs';

const AGE = Number(process.argv[2] ?? 26);
const OUT = process.argv[3] ?? 'save.json';
const MONEY = process.argv[4] ? Number(process.argv[4]) : null;
for (let seed = 1; seed < 400; seed++) {
  const rng = createRng(seed);
  let s = newGame({ slot: 1, mode: 'normal', seed, profile: { ...randomProfile(rng), start: 'osiedle' as const, firstName: 'Sebastian', lastName: 'Testowy', nick: 'Bober' } });
  let guard = 0;
  while (s.phase !== 'ended' && guard++ < 3000) {
    if (s.phase === 'training' && s.age >= AGE) break;
    switch (s.phase) {
      case 'training': s = doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]); break;
      case 'budget':
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) s = takeLoan(s);
        s = canStartSeason(s) ? startSeason(s) : takeBreakYear(s);
        break;
      case 'event': s = s.event!.picked !== undefined ? continueAfterEvent(s) : chooseEvent(s, 0); break;
      case 'season': {
        const run = s.run!; const cur = run.fights[run.fights.length - 1];
        if (run.invite) s = G.acceptInvite(s);
        else if (run.weigh) s = G.weighIn(s, 'pay');
        else if (run.post) s = G.postAnswer(s, run.post.options[0].key);
        else if (run.press) s = pressAnswer(s, 'calm');
        else if (run.offer) s = acceptOffer(s);
        else if (cur?.sim.pending) s = decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
        else if (run.done) s = toSummary(s); else s = seasonSkip(s);
        break;
      }
      case 'summary': s = toMarket(s); break;
      case 'market': {
        const m = s.market!;
        let ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available && c.kind !== 'freak');
        if (ci < 0) ci = 0;
        s = pickContract(s, ci);
        let bi = 0, bq = -1;
        m.clubs.forEach((c, i) => { if (clubAvailability(s, c).ok && c.quality > bq && c.cost <= Math.max(0, s.money) * 0.5) { bq = c.quality; bi = i; } });
        s = pickClub(s, bi); s = confirmMarket(s);
        break;
      }
    }
  }
  if (s.phase === 'training' && s.tier >= 2) {
    if (MONEY !== null) s.money = MONEY;
    writeFileSync(OUT, JSON.stringify(s));
    console.log(`seed ${seed}: wiek ${s.age}, szczebel ${s.tier}, kasa ${s.money}`);
    process.exit(0);
  }
}
console.log('nie znaleziono');
