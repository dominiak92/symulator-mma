// Fuzz: setki karier z losowymi decyzjami. Szuka NaN, „undefined”, nierozwiniętych {n},
// statystyk poza zakresem i wyjątków. Uruchom: npx tsx scripts/fuzz.ts [liczba]
import * as G from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { STAT_KEYS, START_PROFILES } from '../src/engine/data';
import { EVENTS } from '../src/engine/events';
import type { GameState } from '../src/engine/types';

const N = Number(process.argv[2] ?? 300);
const problems = new Map<string, number>();
const note = (k: string) => problems.set(k, (problems.get(k) ?? 0) + 1);
const BAD = /undefined|NaN|\{n\}|\bnull\b|\[object|  +|\s[,.]/;

function checkText(where: string, t: string | undefined) {
  if (!t) return;
  const m = t.match(BAD);
  if (m) note(`${where}: „${m[0]}” w: ${t.slice(0, 90)}`);
}

function checkState(s: GameState, where: string) {
  for (const k of STAT_KEYS) if (!(s.stats[k] >= 1 && s.stats[k] <= 99) || !Number.isFinite(s.stats[k])) note(`${where}: statystyka ${k}=${s.stats[k]}`);
  if (!Number.isFinite(s.money)) note(`${where}: kasa NaN`);
  if (s.rank !== null && (s.rank < 0 || !Number.isInteger(s.rank))) note(`${where}: ranking ${s.rank}`);
  if (s.media < 0 || s.media > 100 || s.rep < 0 || s.rep > 100) note(`${where}: media/rep poza zakresem ${s.media}/${s.rep}`);
  if (s.wear < 0 || s.wear > 100) note(`${where}: zużycie ${s.wear}`);
  if (s.tier === 0 && s.proDebut && s.contract.kind !== 'freak') note(`${where}: zawodowiec w amatorce`);
  // zapis i wczytanie nie gubi danych
  const back = JSON.parse(JSON.stringify(s));
  if (JSON.stringify(back) !== JSON.stringify(s)) note(`${where}: zapis zmienia stan`);
}

for (let i = 0; i < N; i++) {
  const seed = 70000 + i;
  const rng = createRng(seed * 13);
  const start = rng.pick(Object.keys(START_PROFILES) as (keyof typeof START_PROFILES)[]);
  let s = G.newGame({ slot: 1, mode: 'normal', seed, profile: { ...G.randomProfile(rng), start, difficulty: rng.chance(0.3) ? 'hard' : 'normal' } });
  let guard = 0;
  try {
    while (s.phase !== 'ended' && guard++ < 4000) {
      checkState(s, s.phase);
      switch (s.phase) {
        case 'training':
          s = G.doTraining(s, rng.pick(STAT_KEYS));
          break;
        case 'budget':
          if (rng.chance(0.3) && !G.pitchBlocked(s)) s = G.pitchSponsor(s, rng.pick(['spodenki', 'plecy', 'social'] as const));
          if (s.pitch) checkText('sponsor', s.pitch.text);
          for (const l of G.budgetLines(s)) { checkText('budżet', l.label); checkText('budżet', l.sub); if (!Number.isFinite(l.amount)) note('budżet: NaN'); }
          if (s.money + G.budgetBalance(s) < 0 && G.loanOffer(s) && rng.chance(0.7)) s = G.takeLoan(s);
          if (G.canStartSeason(s) && rng.chance(0.97)) s = G.startSeason(s);
          else s = G.takeBreakYear(s);
          break;
        case 'event': {
          const ev = s.event!;
          checkText(`zdarzenie ${ev.id}`, ev.text);
          for (const c of ev.choices) { checkText(`zdarzenie ${ev.id}`, c.label); checkText(`zdarzenie ${ev.id}`, c.desc); }
          if (ev.picked === undefined) s = G.chooseEvent(s, rng.int(0, ev.choices.length - 1));
          else { checkText(`wynik ${ev.id}`, ev.resultText); s = G.continueAfterEvent(s); }
          break;
        }
        case 'season': {
          const run = s.run!;
          const cur = run.fights[run.fights.length - 1];
          if (cur?.sim.pending) {
            checkText('decyzja', cur.sim.pending.text);
            for (const o of cur.sim.pending.options) { checkText('opcja', o.label); checkText('opcja', o.win); checkText('opcja', o.lose); }
            s = G.decide(s, rng.pick(cur.sim.pending.options).key);
          } else if (run.done) {
            for (const f of run.fights) for (const m of f.moments) { checkText(`moment ${m.title}`, m.text); checkText('moment', m.title); }
            s = G.toSummary(s);
            checkText('historia sezonu', s.lastSummary?.story);
          } else s = rng.chance(0.5) ? G.seasonNext(s) : G.seasonSkip(s);
          break;
        }
        case 'summary':
          s = G.toMarket(s);
          break;
        case 'market': {
          const m = s.market!;
          for (const c of m.contracts) { checkText('oferta', c.note); checkText('oferta', c.reason); checkText('oferta', c.fed); }
          const av = m.contracts.map((c, j) => (c.available ? j : -1)).filter((j) => j >= 0);
          if (!av.length) note('rynek: brak dostępnych ofert');
          s = G.pickContract(s, rng.pick(av.length ? av : [0]));
          const cl = m.clubs.map((c, j) => (G.clubAvailability(s, c).ok ? j : -1)).filter((j) => j >= 0);
          s = G.pickClub(s, rng.pick(cl.length ? cl : [0]));
          for (const w of G.marketWarnings(s)) checkText('ostrzeżenie', w);
          if (rng.chance(0.01)) s = G.retire(s);
          else s = G.confirmMarket(s);
          break;
        }
      }
    }
    if (guard >= 4000) note(`pętla bez końca (seed ${seed}, faza ${s.phase})`);
    checkText('koniec', s.ending?.reason);
    checkText('koniec', s.ending?.verdictDesc);
    for (const l of s.log ?? []) checkText('dziennik', typeof l === 'string' ? l : (l as { text: string }).text);
  } catch (e) {
    note(`wyjątek: ${(e as Error).message} (seed ${seed}, faza ${s.phase})`);
  }
}
// zdarzenia: czy każde ma tekst i wybory w różnych stanach
console.log(`${N} karier, ${EVENTS.length} zdarzeń w puli`);
const list = [...problems.entries()].sort((a, b) => b[1] - a[1]);
console.log(list.length ? list.slice(0, 60).map(([k, v]) => `${v}× ${k}`).join('\n') : 'brak problemów');
