// Fuzz: setki karier z losowymi decyzjami. Szuka NaN, „undefined”, nierozwiniętych {n},
// statystyk poza zakresem i wyjątków. Uruchom: npx tsx scripts/fuzz.ts [liczba]
import * as G from '../src/engine/game';
import { createRng } from '../src/engine/rng';
import { STAT_KEYS, START_PROFILES } from '../src/engine/data';
import { EVENTS } from '../src/engine/events';
import { MANAGERS } from '../src/engine/managers';
import type { GameState } from '../src/engine/types';

const N = Number(process.argv[2] ?? 300);
const problems = new Map<string, number>();
const tune = { n: 0, w: 0 };
const shady = { offered: 0 };
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
  if (s.followers !== undefined && (!Number.isFinite(s.followers) || s.followers < 0)) note(`${where}: obserwujący ${s.followers}`);
  if ((s.rosterArchive?.length ?? 0) > 6) note(`${where}: za duże archiwum składów`);
  for (const n of s.run?.news ?? []) checkText('wiadomość', n.text);
  if (s.run && s.run.planned > 6) note(`${where}: za dużo walk w roku (${s.run.planned})`);
  if (s.run && G.isExclusiveContract(s) && s.run.fights.some((f) => f.abroad)) note(`${where}: gala za granicą mimo wyłączności`);
  if ((s.flags.interim ?? 0) > 0 && s.rank === 0) note(`${where}: pas tymczasowy u pełnego mistrza`);
  if (s.roster && s.roster.fed === s.fed && s.roster.tier === s.tier) {
    const ranks = s.roster.list.map((f) => f.rank);
    if (new Set(ranks).size !== ranks.length) note(`${where}: zdublowane miejsca w rankingu składu`);
    const champs = ranks.filter((r) => r === 0).length;
    if (s.rank === 0 && champs > 0) note(`${where}: dwóch mistrzów (gracz i ktoś ze składu)`);
    const nm = s.nemesis;
    if (nm && nm.fed === s.fed && nm.tier === s.tier && (s.roster.div ?? nm.div) === nm.div && !s.roster.list.some((f) => f.id === nm.id) && where !== 'season') note(`${where}: zadra spoza składu`);
    if (s.rank !== 0 && champs !== 1 && s.contract.kind !== 'freak') { note(`${where}: skład bez mistrza (${champs})`); if (process.env.DBG) console.log(where, s.rank, s.tier, s.fed, s.contract.kind, s.phase, JSON.stringify(ranks)); }
  }
  if (s.run && [s.run.offer, s.run.press, s.run.weigh, s.run.post, s.run.invite].filter(Boolean).length > 1) note(`${where}: dwie decyzje naraz`);
  if (s.tier === 0 && s.proDebut && s.contract.kind !== 'freak') note(`${where}: zawodowiec w amatorce`);
  // zapis i wczytanie nie gubi danych
  const back = JSON.parse(JSON.stringify(s));
  if (JSON.stringify(back) !== JSON.stringify(s)) note(`${where}: zapis zmienia stan`);
}

for (let i = 0; i < N; i++) {
  const seed = Number(process.env.SEED0 ?? 70000) + i;
  const rng = createRng(seed * 13);
  const start = rng.pick(Object.keys(START_PROFILES) as (keyof typeof START_PROFILES)[]);
  let s = G.newGame({ slot: 1, mode: 'normal', seed, profile: { ...G.randomProfile(rng), start, difficulty: rng.chance(0.3) ? 'hard' : 'normal' } });
  let guard = 0;
  try {
    while (s.phase !== 'ended' && guard++ < 4000) {
      checkState(s, s.phase);
      switch (s.phase) {
        case 'training':
          if (rng.chance(0.1)) {
            const e = rng.pick(G.EXPEDITIONS);
            if (!G.expeditionBlocked(s, e)) s = G.goExpedition(s, e.id);
            else s = G.doTraining(s, rng.pick(STAT_KEYS), null);
          }
          else s = G.doTraining(s, rng.pick(STAT_KEYS), rng.chance(0.5) ? rng.pick(G.CAMPS).id : null);
          break;
        case 'budget':
          if (rng.chance(0.3)) s = G.setJob(s, rng.pick(['full', 'half', 'none'] as const));
          if (rng.chance(0.3)) s = G.setSocial(s, rng.pick(['off', 'self', 'pro'] as const));
          if (rng.chance(0.3) && !G.pitchBlocked(s)) s = G.pitchSponsor(s, rng.pick(['spodenki', 'plecy', 'social'] as const));
          if (s.pitch) checkText('sponsor', s.pitch.text);
          for (const l of G.budgetLines(s)) { checkText('budżet', l.label); checkText('budżet', l.sub); if (!Number.isFinite(l.amount)) note('budżet: NaN'); }
          if (s.shadyDeal && s.shadyDeal.status === 'open') {
            shady.offered++;
            checkText('dziwny sponsor', s.shadyDeal.pitch);
            checkText('dziwny sponsor', s.shadyDeal.product);
            s = rng.chance(0.5) ? G.acceptShadyDeal(s) : G.refuseShadyDeal(s);
          }
          if (G.backroomOpen(s) && rng.chance(0.4)) s = G.setBackroom(s, rng.pick(['physio', 'doctor', 'supps'] as const), rng.chance(0.6));
          for (const l of G.budgetLines(s)) checkText('zaplecze', l.sub);
          if (rng.chance(0.3)) s = G.investAcademy(s);
          { const fr = G.fightRange(s); if (fr && rng.chance(0.5)) s = G.setWantFights(s, rng.int(fr[0], fr[1])); }
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
          if (run.invite) {
            checkText('zaproszenie', run.invite.text);
            checkText('zaproszenie', run.invite.title);
            s = rng.chance(0.6) ? G.acceptInvite(s) : G.declineInvite(s);
            for (const x of s.run?.sideLog ?? []) { checkText('wydarzenie poza MMA', x.text); for (const l of x.lines) checkText('wydarzenie poza MMA', l); }
          }
          else if (run.weigh) {
            s = G.weighIn(s, rng.pick(['cut', 'pay'] as const));
          } else if (run.post) {
            checkText('mikrofon', run.post.text);
            for (const o of run.post.options) { checkText('mikrofon', o.label); checkText('mikrofon', o.desc); }
            s = G.postAnswer(s, rng.pick(run.post.options).key);
          } else if (run.press) {
            checkText('konferencja', run.press.pressQuote);
            s = G.pressAnswer(s, rng.pick(['calm', 'provoke', 'insult'] as const));
          } else if (run.offer) {
            checkText('oferta walki', run.offer.note);
            checkText('podpowiedź menedżera', run.offer.tip);
            checkText('rywal', run.offer.opp.lastName);
            const r = rng.next();
            s = r < 0.15 && !G.declineBlocked(s) ? G.declineOffer(s) : r < 0.3 && !run.offer.negotiated ? G.negotiateOffer(s) : r < 0.4 ? G.acceptAllOffers(s, rng.pick(['std', 'rival', 'hard'] as const)) : G.acceptOffer(s, rng.pick(['std', 'rival', 'hard'] as const), rng.pick(['none', 'std', 'push'] as const));
            for (const n of s.run?.notes ?? []) checkText('notka', n);
          } else if (cur?.sim.pending) {
            checkText('decyzja', cur.sim.pending.text);
            for (const o of cur.sim.pending.options) { checkText('opcja', o.label); checkText('opcja', o.win); checkText('opcja', o.lose); }
            s = G.decide(s, rng.pick(cur.sim.pending.options).key);
          } else if (run.done) {
            for (const f of run.fights) if (f.tuneup) { tune.n++; if (f.result === 'W') tune.w++; }
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
          const pick = rng.pick(av.length ? av : [0]);
          s = G.pickContract(s, pick);
          if (rng.chance(0.4)) {
            s = G.negotiateContract(s, pick, rng.pick(['purse', 'bonus', 'signing'] as const));
            checkText('negocjacje', s.market!.contracts[pick].nego?.text);
          }
          const cl = m.clubs.map((c, j) => (G.clubAvailability(s, c).ok ? j : -1)).filter((j) => j >= 0);
          s = G.pickClub(s, rng.pick(cl.length ? cl : [0]));
          if (rng.chance(0.15)) s = G.changeDivision(s, rng.pick(G.divisionOptions(s)));
          if (rng.chance(0.3)) s = G.setManager(s, rng.chance(0.2) ? null : rng.pick(MANAGERS).id);
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
console.log(`${N} karier, ${EVENTS.length} zdarzeń w puli; walki na odbudowę: ${tune.n} (wygrane ${tune.n ? Math.round((tune.w / tune.n) * 100) : 0}%), dziwni sponsorzy: ${shady.offered}`);
const list = [...problems.entries()].sort((a, b) => b[1] - a[1]);
console.log(list.length ? list.slice(0, 60).map(([k, v]) => `${v}× ${k}`).join('\n') : 'brak problemów');
