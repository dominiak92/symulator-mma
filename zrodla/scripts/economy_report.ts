// Ekonomia: gaże, sponsorzy, koszty i stan konta na każdym szczeblu (v62)
import * as G from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { STAT_KEYS } from '../src/engine/data';
const N = Number(process.argv[2] ?? 200);
const c: Record<string, number> = {};
const inc = (k: string, n = 1) => (c[k] = (c[k] ?? 0) + n);
const acc: Record<string, number[]> = {};
const add = (k: string, v: number) => (acc[k] = acc[k] ?? []).push(v);
let fans = 0;
for (let i = 0; i < N; i++) {
  const rng = createRng(1000 + i);
  let s = G.newGame({ slot: 1, mode: 'normal', seed: 1000 + i, profile: { ...G.randomProfile(rng), start: 'osiedle' } });
  let g = 0;
  while (s.phase !== 'ended' && g++ < 4000) {
    switch (s.phase) {
      case 'training': s = G.doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]); break;
      case 'budget':
        if (s.money + G.budgetBalance(s) < 0 && G.loanOffer(s)) s = G.takeLoan(s);
        s = G.setSocial(s, 'self');
        s = G.canStartSeason(s) ? G.startSeason(s) : G.takeBreakYear(s); break;
      case 'event': s = s.event!.picked !== undefined ? G.continueAfterEvent(s) : G.chooseEvent(s, 0); break;
      case 'season': {
        const run = s.run!; const cur = run.fights[run.fights.length - 1];
        if (run.invite) s = G.acceptInvite(s);
        else if (run.weigh) { inc('ważenie'); s = G.weighIn(s, rng.chance(0.5) ? 'cut' : 'pay'); }
        else if (run.post) { inc(run.post.kind === 'mic' ? 'mikrofon' : 'kontrowersja'); const o = run.post.options; s = G.postAnswer(s, o[0].key); }
        else if (run.press) s = G.pressAnswer(s, 'calm');
        else if (run.offer) {
          const o = run.offer;
          if (o.short) inc('zastępstwo (oferta)');
          if (o.superfight) inc('superfight (oferta)');
          if (o.interim) inc('pas tymczasowy (oferta)');
          if (o.unify) inc('unifikacja (oferta)');
          if (o.rematch) inc('rewanż (oferta)');
          if (o.title && !o.defense) inc(`walka o pas t${s.tier} (oferta)`);
          if (o.defense) inc('obrona pasa (oferta)');
          s = G.acceptOffer(s, 'std', 'std');
        }
        else if (cur?.sim.pending) s = G.decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
        else if (run.done) { for (const f of run.fights) if (f.tickets) inc('bilety'); s = G.toSummary(s); }
        else s = G.seasonSkip(s);
        break;
      }
      case 'summary': {
        const t = s.lastSummary!.tier;
        const fights = (s.run?.fights ?? []).filter((f) => f.result && !f.amateur);
        for (const f of fights) { add(`gaża t${t} ${f.fed.split(' – ')[0]}`, f.purse); }
        add(`bilans roku t${t}`, s.lastSummary!.moneyDelta);
        add(`konto t${t}`, s.money);
        add(`sponsorzy t${t}`, s.sponsors.reduce((a, b) => a + b.perSeason, 0));
        add(`koszty t${t}`, -G.budgetLines(s).filter((l) => l.amount < 0).reduce((a, b) => a + b.amount, 0));
        s = G.toMarket(s); break;
      }
      case 'market': {
        const m = s.market!;
        let ci = m.contracts.findIndex((x) => x.available && x.kind === 'promotion');
        if (ci < 0) ci = m.contracts.findIndex((x) => x.available && x.kind !== 'freak');
        if (ci < 0) ci = 0;
        s = G.pickContract(s, ci);
        if (s.market!.contracts[ci].kind !== 'stay') { s = G.negotiateContract(s, ci, 'bonus'); inc(s.market!.contracts[ci].nego?.ok ? 'negocjacje ok' : 'negocjacje nie'); }
        s = G.confirmMarket(s); break;
      }
      default: s = G.retire(s);
    }
  }
  if (s.flags.doubleChamp) inc('podwójny mistrz');
  inc('pas odebrany', s.flags.stripped ?? 0);
  if (s.flags.breakYear || s.flags.injuryYear) inc('rok przerwy/urazu');
  inc('pas tymczasowy zdobyty', s.flags.interimBelts ?? 0);
  fans += s.followers ?? 0;
}
const med = (a: number[]) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const p90 = (a: number[]) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length * 0.9)]; };
for (const k of Object.keys(acc).sort()) console.log(`  ${k.padEnd(34)} n=${String(acc[k].length).padStart(5)}  mediana ${Math.round(med(acc[k])).toLocaleString('pl-PL').padStart(12)}  p90 ${Math.round(p90(acc[k])).toLocaleString('pl-PL').padStart(12)}`);
console.log(`${N} karier (na karierę):`);
for (const [k, v] of Object.entries(c).sort()) console.log(`  ${k.padEnd(26)} ${(v / N).toFixed(2)}`);
console.log(`  obserwujący na koniec (średnio): ${Math.round(fans / N).toLocaleString('pl-PL')}`);
