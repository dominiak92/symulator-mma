// Skaner decyzji: w tej samej sytuacji rozgałęzia karierę na każdą opcję i gra do końca
// (wspólne liczby losowe dla wszystkich opcji). Pokazuje, czy któraś opcja wygrywa zawsze
// (klikacz), czy najlepszy wybór zależy od sytuacji.
// Użycie: npx tsx scripts/choice_scan.ts [kariery] [powtórzenia] [typy, np. tickets,weigh]
import * as G from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { STAT_KEYS } from '../src/engine/data';
import type { GameState } from '../src/engine/types';
import { jobAvailable } from '../src/engine/extras';

const CAREERS = Number(process.argv[2] ?? 60);
const K = Number(process.argv[3] ?? 6);
const ONLY = process.argv[4]?.split(',');
const MAX_PER_CAREER = 2;
const OFFSET = Number(process.env.OFFSET ?? 0);
const JSON_OUT = process.env.JSON_OUT;

type Opt = { key: string; apply: (s: GameState) => GameState };
type Point = { type: string; ctx: string; opts: Opt[] };

/** Zwykła gra bota (rozsądna) – jeden krok. */
function step(s: GameState): GameState {
  switch (s.phase) {
    case 'training':
      return G.doTraining(s, [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0]);
    case 'budget':
      // etat w skanerze: wybór tylko na jeden rok, potem wraca domyślny
      if (s.flags.scanJob && s.flags.scanJob !== s.season) {
        s = G.setJob(s, undefined);
        s.flags.scanJob = 0;
      }
      if (s.money + G.budgetBalance(s) < 0 && G.loanOffer(s)) s = G.takeLoan(s);
      if (!G.canStartSeason(s) && G.cheaperClub(s)) s = G.downgradeClub(s);
      return G.canStartSeason(s) ? G.startSeason(s) : G.takeBreakYear(s);
    case 'event': {
      const ev = s.event!;
      if (ev.picked !== undefined) return G.continueAfterEvent(s);
      let best = 0;
      let sc = -1e9;
      ev.choices.forEach((c, i) => {
        const v = (G.choiceChance(s, i) ?? 100) + (c.effects?.money ?? 0) / 1000;
        if (v > sc) {
          sc = v;
          best = i;
        }
      });
      return G.chooseEvent(s, best);
    }
    case 'season': {
      const run = s.run!;
      const cur = run.fights[run.fights.length - 1];
      if (run.invite) return G.declineInvite(s);
      if (run.weigh) return G.weighIn(s, 'pay');
      if (run.post) return G.postAnswer(s, run.post.options[run.post.options.length - 1].key);
      if (run.press) return G.pressAnswer(s, 'calm');
      if (run.offer) {
        if (run.offer.short || run.offer.superfight || run.offer.abroad) return G.declineOffer(s);
        return G.acceptOffer(s, 'std', 'std');
      }
      if (cur?.sim.pending) return G.decide(s, [...cur.sim.pending.options].sort((a, b) => b.chance - a.chance)[0].key);
      if (run.done) return G.toSummary(s);
      return G.seasonNext(s);
    }
    case 'summary':
      return G.toMarket(s);
    case 'market': {
      const m = s.market!;
      let ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion');
      if (ci < 0) ci = m.contracts.findIndex((c) => c.available && c.kind !== 'freak');
      if (ci < 0) ci = 0;
      let y = G.pickContract(s, ci);
      // DROP=1: zawodnik schodzi kategorię niżej, żeby zbadać ważenie
      if (process.env.DROP && y.tier >= 1 && G.weightShift(y) === 0) {
        const lighter = G.divisionOptions(y).find((k) => G.weightShift(G.changeDivision(y, k)) < 0);
        if (lighter) y = G.changeDivision(y, lighter);
      }
      return G.confirmMarket(y);
    }
    default:
      return G.retire(s);
  }
}

function finish(s: GameState): GameState {
  for (let g = 0; g < 5000 && s.phase !== 'ended'; g++) s = step(s);
  return s;
}

const tierName = (t: number) => ['AM', 'REG', 'PL', 'EU', 'ŚW'][t];
const moneyB = (m: number) => (m < 20000 ? 'kasa<20k' : m < 100000 ? 'kasa<100k' : 'kasa>100k');

/** Czy w tym stanie jest decyzja do zbadania. */
function pointAt(s: GameState): Point | null {
  if (s.phase === 'budget') {
    // etat i social media: zmiana na stałe od tego roku
    const jm = jobAvailable(s);
    if (jm && s.season % 2 === 0)
      return {
        type: 'job',
        ctx: `${tierName(s.tier)} ${moneyB(s.money)}`,
        opts: (['full', 'half', 'none'] as const).map((k) => ({ key: k, apply: (x) => { const y = G.setJob(x, k); y.flags.scanJob = y.season; return y; } })),
      };
    if (s.season % 2 === 1 && s.tier >= 1)
      return {
        type: 'social',
        ctx: `${tierName(s.tier)} ${moneyB(s.money)}`,
        opts: (['off', 'self', 'pro'] as const).map((k) => ({ key: k, apply: (x) => G.setSocial(x, k) })),
      };
    return null;
  }
  if (s.phase === 'market' && s.market!.contracts.some((c) => c.star && c.available)) {
    const m = s.market!;
    const si = m.contracts.findIndex((c) => c.star && c.available);
    const stay = m.contracts.findIndex((c) => c.kind === 'stay' && c.available);
    if (stay >= 0)
      return {
        type: 'star',
        ctx: `${tierName(s.tier)} rank ${s.rank ?? '—'}`,
        opts: [
          { key: 'gwiazda', apply: (x) => G.confirmMarket(G.pickContract(x, si)) },
          { key: 'zostaję', apply: (x) => G.confirmMarket(G.pickContract(x, stay)) },
        ],
      };
  }
  if (s.phase === 'market' && s.market!.contracts.some((c) => c.available && c.kind === 'promotion' && c.purse > 0) && !s.market!.negotiated) {
    const m = s.market!;
    const ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion');
    return {
      type: 'nego',
      ctx: `${tierName(m.contracts[ci].tier)}`,
      opts: [
        { key: 'brak', apply: (x) => x },
        ...(['purse', 'bonus', 'signing'] as const).map((k) => ({ key: k, apply: (x: GameState) => G.negotiateContract(G.pickContract(x, ci), ci, k) })),
      ],
    };
  }
  if (s.phase !== 'season' || !s.run) return null;
  const run = s.run;
  if (run.invite)
    return {
      type: `invite:${run.invite.kind}`,
      ctx: `${tierName(s.tier)} szansa ${G.inviteChance(s) ?? 100}%`,
      opts: [
        { key: 'startuję', apply: (x) => G.acceptInvite(x) },
        { key: 'odpuszczam', apply: (x) => G.declineInvite(x) },
      ],
    };
  if (run.weigh)
    return { type: 'weigh', ctx: `${tierName(s.tier)} cut ${G.cutChance(s)}%`, opts: (['cut', 'pay'] as const).map((k) => ({ key: k, apply: (x) => G.weighIn(x, k) })) };
  if (run.post)
    return {
      type: run.post.kind === 'mic' ? 'mic' : 'robbed',
      ctx: `${tierName(s.tier)} rank ${s.rank === null ? '—' : s.rank <= 3 ? '1-3' : s.rank <= 6 ? '4-6' : '7+'}`,
      opts: run.post.options.map((o) => ({ key: o.key, apply: (x) => G.postAnswer(x, o.key) })),
    };
  if (run.press) return null;
  const o = run.offer;
  if (!o) return null;
  if (o.short)
    return {
      type: 'short',
      ctx: `${tierName(s.tier)} ${G.weightShift(s) < 0 ? 'zbija' : 'waga ok'}`,
      opts: [
        { key: 'biorę', apply: (x) => G.acceptOffer(x) },
        { key: 'odmawiam', apply: (x) => G.declineOffer(x) },
      ],
    };
  if (o.abroad)
    return { type: 'abroad', ctx: tierName(s.tier), opts: [{ key: 'lecę', apply: (x) => G.acceptOffer(x) }, { key: 'odmawiam', apply: (x) => G.declineOffer(x) }] };
  if (o.superfight)
    return { type: 'super', ctx: tierName(s.tier), opts: [{ key: 'biorę', apply: (x) => G.acceptOffer(x) }, { key: 'odmawiam', apply: (x) => G.declineOffer(x) }] };
  if (o.tuneup) return null;
  if (s.tier === 1 && !o.opp.freak)
    return {
      type: 'tickets',
      ctx: `media ${s.media < 15 ? '<15' : s.media < 30 ? '<30' : '30+'}`,
      opts: (['none', 'std', 'push'] as const).map((k) => ({ key: k, apply: (x) => G.acceptOffer(x, 'std', k) })),
    };
  if (s.tier >= 1 && !o.opp.freak && s.run.fights.length % 2 === 0)
    return {
      type: 'prep',
      ctx: `${tierName(s.tier)}${o.title ? ' pas' : ''}`,
      opts: (['std', 'rival', 'hard'] as const).map((k) => ({ key: k, apply: (x) => G.acceptOffer(x, k) })),
    };
  return null;
}

type Acc = { n: number; cnt: Record<string, number>; sum: Record<string, number>; best: Record<string, number>; byCtx: Record<string, Record<string, number>>; diffs: Record<string, number[]> };
const acc: Record<string, Acc> = {};

const t0 = Date.now();
const MERGE = process.env.MERGE?.split(',');
if (MERGE) {
  const fs = await import('node:fs');
  for (const f of MERGE) {
    const part = JSON.parse(fs.readFileSync(f, 'utf8')) as Record<string, Acc>;
    for (const [type, p] of Object.entries(part)) {
      const a = (acc[type] ??= { n: 0, cnt: {}, sum: {}, best: {}, byCtx: {}, diffs: {} });
      a.n += p.n;
      for (const k of Object.keys(p.sum)) {
        a.sum[k] = (a.sum[k] ?? 0) + p.sum[k];
        a.cnt[k] = (a.cnt[k] ?? 0) + p.cnt[k];
        a.best[k] = (a.best[k] ?? 0) + (p.best[k] ?? 0);
        (a.diffs[k] ??= []).push(...p.diffs[k]);
      }
      for (const [ctx, b] of Object.entries(p.byCtx)) for (const [k, v] of Object.entries(b)) (a.byCtx[ctx] ??= {})[k] = ((a.byCtx[ctx] ??= {})[k] ?? 0) + v;
    }
  }
}
for (let c = 0; c < (MERGE ? 0 : CAREERS); c++) {
  const seed = 5000 + OFFSET + c;
  const rng = createRng(seed);
  let s = G.newGame({ slot: 1, mode: 'normal', seed, profile: { ...G.randomProfile(rng), start: 'osiedle' } });
  const done: Record<string, number> = {};
  for (let g = 0; g < 5000 && s.phase !== 'ended'; g++) {
    const p = pointAt(s);
    if (p && (!ONLY || ONLY.includes(p.type)) && (done[p.type] ?? 0) < MAX_PER_CAREER && p.opts.length > 1) {
      done[p.type] = (done[p.type] ?? 0) + 1;
      const a = (acc[p.type] ??= { n: 0, cnt: {}, sum: {}, best: {}, byCtx: {}, diffs: {} });
      const res: Record<string, number> = {};
      for (const o of p.opts) res[o.key] = 0;
      for (let k = 0; k < K; k++) {
        const rs = (seed * 7919 + g * 104729 + k * 15485863) >>> 0;
        for (const o of p.opts) {
          let x: GameState = JSON.parse(JSON.stringify(s));
          x.rngState = rs;
          x = o.apply(x);
          x.rngState = (rs ^ 0x9e3779b9) >>> 0; // wspólne losowanie po decyzji
          x = finish(x);
          res[o.key] += (x.ending?.legacy ?? 0) / K;
        }
      }
      a.n++;
      const keys = Object.keys(res);
      const top = keys.reduce((m, k) => (res[k] > res[m] ? k : m), keys[0]);
      a.best[top] = (a.best[top] ?? 0) + 1;
      (a.byCtx[p.ctx] ??= {})[top] = ((a.byCtx[p.ctx] ??= {})[top] ?? 0) + 1;
      const base = keys[keys.length - 1];
      for (const k of keys) {
        a.sum[k] = (a.sum[k] ?? 0) + res[k];
        a.cnt[k] = (a.cnt[k] ?? 0) + 1;
        (a.diffs[k] ??= []).push(res[k] - res[base]);
      }
    }
    s = step(s);
  }
}

if (JSON_OUT) {
  (await import('node:fs')).writeFileSync(JSON_OUT, JSON.stringify(acc));
  process.exit(0);
}
const sd = (v: number[]) => {
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, v.length - 1));
};
console.log(`${CAREERS} karier × ${K} powtórzeń, ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
for (const [type, a] of Object.entries(acc)) {
  const keys = Object.keys(a.sum);
  const base = keys[keys.length - 1];
  console.log(`== ${type} (${a.n} sytuacji) · różnica względem „${base}” ± błąd`);
  for (const k of keys) {
    const d = a.diffs[k];
    const mean = d.reduce((x, y) => x + y, 0) / d.length;
    const se = sd(d) / Math.sqrt(d.length);
    console.log(`  ${k.padEnd(10)} legacy ${(a.sum[k] / a.cnt[k]).toFixed(0).padStart(5)}  Δ ${mean >= 0 ? '+' : ''}${mean.toFixed(0).padStart(4)} ±${se.toFixed(0).padStart(3)}  najlepsza w ${(((a.best[k] ?? 0) / a.cnt[k]) * 100).toFixed(0)}%  (n=${a.cnt[k]})`);
  }
  for (const [ctx, b] of Object.entries(a.byCtx).sort()) {
    const tot = Object.values(b).reduce((x, y) => x + y, 0);
    if (tot < 3) continue;
    console.log(`    ${ctx.padEnd(20)} ${Object.entries(b).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${Math.round((v / tot) * 100)}%`).join(', ')}  (n=${tot})`);
  }
}
