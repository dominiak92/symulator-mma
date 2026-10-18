import * as G from '../src/engine/game';
// Porównanie strategii gracza — szukanie luk w ekonomii i balansie.
// Uruchom: npx tsx scripts/balance.ts [liczba karier na strategię]
import {
  changeDivision,
  divisionOptions,
  pressAnswer,
  cheaperClub,
  downgradeClub,
  acceptOffer,
  declineBlocked,
  declineOffer,
  fightRange,
  negotiateOffer,
  setManager,
  setWantFights,
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
import { PERKS, perkUnlocked } from '../src/engine/perks';
import { MANAGERS, managerBlocked } from '../src/engine/managers';
import { ovr } from '../src/engine/fighter';
import type { GameState, StatKey } from '../src/engine/types';
import { STAT_KEYS } from '../src/engine/data';

type Policy = {
  name: string;
  coach?: 'boks' | 'parter' | 'naroznik' | 'kontakty';
  train?: (s: GameState) => StatKey;
  club?: 'cheap' | 'best' | 'smart';
  pitch?: boolean;
  events?: 'safe' | 'risky' | 'first';
  contract?: 'promo' | 'stay' | 'freak' | 'cap2';
  fightPick?: 'best' | 'risky' | 'smart' | 'normal' | 'random';
  camps?: boolean;
  academy?: boolean;
  offers?: 'accept' | 'picky' | 'negotiate';
  manager?: 'none' | 'best' | 'cheap';
  fights?: 'min' | 'max';
  prep?: 'std' | 'rival' | 'hard';
  press?: 'calm' | 'provoke' | 'insult';
  division?: -1 | 1;
  exp?: 'dagestan' | 'floryda' | 'trondheim';
  tuneup?: 'always' | 'never';
  backroom?: ('physio' | 'doctor' | 'supps')[];
  shady?: boolean;
  weigh?: 'cut' | 'pay';
  mic?: 'champ' | 'up' | 'thanks' | 'rival';
  job?: 'full' | 'half' | 'none';
  social?: 'off' | 'self' | 'pro';
  tickets?: 'none' | 'std' | 'push';
  short?: 'always' | 'never';
  nego?: 'purse' | 'bonus' | 'signing';
  perks?: boolean;
};

const weakest = (s: GameState) => [...STAT_KEYS].sort((a, b) => s.stats[a] - s.stats[b])[0];

function play(seed: number, p: Policy) {
  const rng = createRng(seed);
  const profile = { ...randomProfile(rng), start: 'osiedle' as const };
  let s = newGame({ slot: 1, mode: 'normal', seed, profile, quick: !!(p as { quick?: boolean }).quick });
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
        if (p.exp) {
          const e = G.EXPEDITIONS.find((x) => x.id === p.exp)!;
          if (!G.expeditionBlocked(s, e) && s.money - G.expeditionCost(s, e) > 30000) {
            s = G.goExpedition(s, e.id);
            break;
          }
        }
        const k = (p.train ?? weakest)(s);
        let camp: string | null = null;
        if (p.camps && !campBlocked(s) && s.money - campCost(s) + budgetBalance(s) > 20000) {
          const sorted = [...CAMPS].sort((a, b) => s.stats[a.main] - s.stats[b.main]);
          camp = sorted[0].id;
        }
        if (p.perks) {
          const un = PERKS.filter((x) => perkUnlocked(s, x)).sort((a, b) => s.stats[b.req.stat] - s.stats[a.req.stat]);
          s = G.setPerks(s, un.slice(0, 2).map((x) => x.id));
        }
        s = doTraining(s, k, camp);
        break;
      }
      case 'budget': {
        if (p.backroom && G.backroomOpen(s)) for (const b of p.backroom) if (!s.backroom?.[b]) s = G.setBackroom(s, b, true);
        if (p.shady && s.shadyDeal?.status === 'open') s = G.acceptShadyDeal(s);
        if (p.job) {
          // rozsądnie: rzuca pracę tylko, gdy go stać
          const prev = s.job;
          s = G.setJob(s, p.job);
          if (s.money + G.budgetBalance(s) < 15000) s = G.setJob(s, prev);
        }
        if (p.social) s = G.setSocial(s, p.social === 'pro' && (s.tier < 2 || s.money + G.budgetBalance(s) < 40000) ? 'self' : p.social);
        if (p.pitch && !pitchBlocked(s)) {
          const best = [...PITCH_SLOTS].sort((a, b) => pitchChance(s, b.id) * pitchPay(s, b.id) - pitchChance(s, a.id) * pitchPay(s, a.id))[0];
          s = pitchSponsor(s, best.id);
        }
        const fr = fightRange(s);
        if (fr && p.fights) s = setWantFights(s, p.fights === 'max' ? fr[1] : fr[0]);
        if (p.academy) {
          const n = academyNext(s);
          if (n && !n.blocked && s.money - n.cost + budgetBalance(s) > 60000) s = investAcademy(s);
        }
        if (s.money + budgetBalance(s) < 0 && loanOffer(s)) {
          s = takeLoan(s);
          loans++;
        }
        if (!canStartSeason(s) && cheaperClub(s)) s = downgradeClub(s);
        if (process.env.GOALS) {
          const opts = G.yearGoalOptions(s);
          if (opts.length) {
            const g = opts[(s.season * 7 + (s.createdAt % 97)) % opts.length];
            s = G.setYearGoal(s, g.id);
          }
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
        if (run.invite) s = G.acceptInvite(s);
        else if (run.weigh) s = G.weighIn(s, p.weigh ?? 'pay');
        else if (run.post) s = G.postAnswer(s, (p.mic && run.post.options.find((x) => x.key === p.mic)?.key) || run.post.options[run.post.options.length - 1].key);
        else if (run.press) s = pressAnswer(s, p.press ?? 'calm');
        else if (run.offer) {
          const o = run.offer;
          // walkę na odbudowę rozsądny gracz bierze tylko, gdy wypadł z rankingu (albo gdy strategia każe)
          if (o.short && p.short !== 'always') s = declineOffer(s);
          else if (o.tuneup && (p.tuneup === 'never' || (p.tuneup !== 'always' && s.rank !== null))) s = declineOffer(s);
          else if (p.offers === 'negotiate' && !o.negotiated) s = negotiateOffer(s);
          else if (p.offers === 'picky' && !declineBlocked(s) && o.purse < s.contract.purse * 0.95 && (run.declines ?? 0) < 2) s = declineOffer(s);
          else s = acceptOffer(s, p.prep ?? 'std', p.tickets ?? 'std');
        } else if (cur?.sim.pending) {
          const opts = [...cur.sim.pending.options];
          const st = cur.sim.pending.status;
          const byKind = (k: string) => opts.filter((x) => x.kind === k).sort((a, b) => b.chance - a.chance)[0];
          let o = opts.sort((a, b) => b.chance - a.chance)[0];
          if (p.fightPick === 'random') o = opts[(s.season * 7 + s.history.length * 3 + opts.length) % opts.length];
          else if (p.fightPick === 'risky') o = byKind('risk') ?? o;
          else if (p.fightPick === 'normal') o = byKind('normal') ?? o;
          else if (p.fightPick === 'smart') {
            // gra pod sytuację: obity → odpoczynek, przegrywa albo rywal słabnie → ryzyko, inaczej najlepsza zwykła
            if (st && (st.hurt >= 35 || st.stam < 40)) o = byKind('safe') ?? o;
            else if (st && ((st.lead ?? 0) < 0 || st.oppHurt >= 35 || st.oppStam < 50)) o = byKind('risk') ?? o;
            else o = [...opts].filter((x) => x.kind !== 'safe').sort((a, b) => b.chance - a.chance)[0] ?? o;
          }
          s = decide(s, o.key);
        } else if (run.done) {
          const gid = s.yearGoal?.season === s.season ? s.yearGoal.id : null;
          s = toSummary(s);
          if (gid && process.env.GOALS) {
            const row = s.lastSummary?.outside?.find((r) => r.label.startsWith('Cel roku'));
            const st = (GOAL_STATS[gid] ??= { n: 0, ok: 0 });
            st.n++;
            if (row && row.icon === 'check') st.ok++;
          }
        }
        else s = seasonSkip(s);
        break;
      }
      case 'summary':
        s = toMarket(s);
        break;
      case 'market': {
        if (p.coach) s = G.setCoach(s, p.coach);
        const m = s.market!;
        let ci = -1;
        if (p.contract === 'freak') ci = m.contracts.findIndex((c) => c.available && c.kind === 'freak');
        if (ci < 0 && p.contract !== 'stay') ci = m.contracts.findIndex((c) => c.available && c.kind === 'promotion' && (p.contract !== 'cap2' || c.tier <= 2));
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available && c.kind !== 'freak');
        if (ci < 0) ci = m.contracts.findIndex((c) => c.available);
        s = pickContract(s, ci);
        if (p.nego && s.market!.contracts[ci]?.kind !== 'stay') s = G.negotiateContract(s, ci, p.nego);
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
        if (p.division && s.tier >= 1) {
          const opts = divisionOptions(s);
          const want = p.division < 0 ? opts[0] : opts[opts.length - 1];
          s = changeDivision(s, want);
        }
        if (p.manager && s.tier >= 1) {
          const av = MANAGERS.filter((mg) => !managerBlocked(s, mg));
          if (p.manager === 'none') s = setManager(s, null);
          else if (av.length) s = setManager(s, (p.manager === 'best' ? [...av].sort((a, b) => b.purse - a.purse)[0] : [...av].sort((a, b) => a.cut - b.cut)[0]).id);
        }
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
  { name: 'zostaje w Polsce', contract: 'cap2' },
  { name: 'ryzyko w walce', fightPick: 'risky' },
  { name: 'zwykłe opcje w walce', fightPick: 'normal' },
  { name: 'walka pod sytuację', fightPick: 'smart' },
  { name: 'walka: losowo', fightPick: 'random' },
  { name: 'SZYBKA: rozsądnie', quick: true } as Policy,
  { name: 'SZYBKA: przeklikanie', quick: true, fightPick: 'random', events: 'first', contract: 'stay' } as Policy,
  { name: 'SZYBKA: losowo w walce', quick: true, fightPick: 'random' } as Policy,
  { name: 'trener: boks', coach: 'boks' },
  { name: 'trener: parter', coach: 'parter' },
  { name: 'trener: narożnik', coach: 'naroznik' },
  { name: 'trener: kontakty', coach: 'kontakty' },
  { name: 'tylko zapasy', train: () => 'wrest' },
  { name: 'tylko parter', train: () => 'bjj' },
  { name: 'tylko kondycja', train: () => 'cardio' },
  { name: 'tylko taktyka', train: () => 'iq' },
  { name: 'stójka+kondycja', train: (s) => (s.season % 2 ? 'stand' : 'cardio') },
  { name: 'stójka+szczęka', train: (s) => (s.season % 2 ? 'stand' : 'chin') },
  { name: 'stójka+parter', train: (s) => (s.season % 2 ? 'stand' : 'bjj') },
  { name: 'oferty: wybredny', offers: 'picky' },
  { name: 'oferty: negocjuje', offers: 'negotiate' },
  { name: 'menedżer: najlepszy', manager: 'best' },
  { name: 'menedżer: najtańszy', manager: 'cheap' },
  { name: 'menedżer: bez', manager: 'none' },
  { name: 'walki: max', fights: 'max' },
  { name: 'walki: min', fights: 'min' },
  { name: 'pełny gracz', manager: 'best', offers: 'negotiate', camps: true, academy: true, fightPick: 'smart' },
  { name: 'obóz pod rywala', prep: 'rival' },
  { name: 'ciężki obóz', prep: 'hard' },
  { name: 'konferencja: ostro', press: 'insult' },
  { name: 'konferencja: riposta', press: 'provoke' },
  { name: 'zbija wagę', division: -1 },
  { name: 'kategoria wyżej', division: 1 },
  { name: 'obozy', camps: true },
  { name: 'odbudowa: zawsze', tuneup: 'always' },
  { name: 'zaplecze: fizjo', backroom: ['physio'] },
  { name: 'zaplecze: lekarz', backroom: ['doctor'] },
  { name: 'zaplecze: suple', backroom: ['supps'] },
  { name: 'zaplecze: wszystko', backroom: ['physio', 'doctor', 'supps', 'sparring'] },
  { name: 'zaplecze: sparing', backroom: ['sparring'] },
  { name: 'odbudowa: nigdy', tuneup: 'never' },
  { name: 'dziwni sponsorzy', shady: true },
  { name: 'wyjazd: Dagestan', exp: 'dagestan' },
  { name: 'wyjazd: Floryda', exp: 'floryda' },
  { name: 'wyjazd: Trondheim', exp: 'trondheim' },
  { name: 'akademia', academy: true },
  { name: 'waga: sauna', division: -1, weigh: 'cut' },
  { name: 'waga: kara', division: -1, weigh: 'pay' },
  { name: 'mikrofon: mistrz', mic: 'champ' },
  { name: 'mikrofon: czołówka', mic: 'up' },
  { name: 'etat: pełny', job: 'full' },
  { name: 'etat: pół', job: 'half' },
  { name: 'etat: bez', job: 'none' },
  { name: 'social: sam', social: 'self' },
  { name: 'social: manager', social: 'pro' },
  { name: 'bilety: odpuszcza', tickets: 'none' },
  { name: 'bilety: kampania', tickets: 'push' },
  { name: 'zastępstwa: zawsze', short: 'always' },
  { name: 'kontrakt: gaża', nego: 'purse' },
  { name: 'kontrakt: premia', nego: 'bonus' },
  { name: 'kontrakt: bonus za podpis', nego: 'signing' },
  { name: 'atuty', perks: true },
  { name: 'obozy+akademia', camps: true, academy: true },
];
const POLICIES = ONLY ? POLICIES_ALL.filter((p) => ONLY.split(',').some((o) => p.name.includes(o))) : POLICIES_ALL;

const N = Number(process.argv[2] ?? 150);
const GOAL_STATS: Record<string, { n: number; ok: number }> = {};
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

if (process.env.GOALS) for (const [k, v] of Object.entries(GOAL_STATS)) console.log(`cel ${k}: ${v.n} lat, zaliczone ${((v.ok / v.n) * 100).toFixed(0)}%`);
