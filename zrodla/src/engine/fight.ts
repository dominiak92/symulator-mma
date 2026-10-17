import type { Rng } from './rng';
import type {
  DecisionOption,
  DecisionPoint,
  Fighter,
  FightReport,
  FightSim,
  Moment,
  Outcome,
  StatKey,
  Stats,
} from './types';
import { STAT_LABELS, WIN_DETAILS } from './data';
import { clamp } from './fighter';

// ---------- Szanse (jawne, pokazywane graczowi) ----------

export function chanceFrom(atk: number, def: number, mod = 0): number {
  // duże przewagi rosną coraz wolniej: specjalista od jednej rzeczy nie wygrywa wszystkiego
  return Math.round(clamp(50 + 46 * Math.tanh((atk - def) / 27) + mod, 5, 95));
}

export function distFrom(p: number): [number, number, number] {
  const sup = Math.round(clamp((p - 30) * 0.22, 2, 28));
  const s = Math.min(sup, p - 1);
  return [s, p - s, 100 - p];
}

export function rollOutcome(rng: Rng, p: number): Outcome {
  const [sup, suc] = distFrom(p);
  const r = rng.next() * 100;
  if (r < sup) return 'super';
  if (r < sup + suc) return 'success';
  return 'fail';
}

export const OUTCOME_LABEL: Record<Outcome, string> = {
  super: 'pełen sukces',
  success: 'udało się',
  fail: 'nie wyszło',
};

// Wymiany w walce mają większy udział mocnych trafień niż testy decyzji
function rollExchange(rng: Rng, p: number): Outcome {
  const sup = clamp((p - 22) * 0.32, 4, 36);
  const r = rng.next() * 100;
  if (r < sup) return 'super';
  if (r < p) return 'success';
  return 'fail';
}

// ---------- Kontekst walki ----------

export interface FightCtx {
  me: Stats; // efektywne statystyki gracza (po zużyciu)
  meName: string;
  opp: Fighter;
  form: number; // modyfikator formy sezonu (pkt %)
  penalty: number; // kontuzja (pkt %)
  allowDecision: boolean;
  decisionChance: number;
}

type Who = 'me' | 'opp';
type Action = 'strike' | 'takedown' | 'sub' | 'clinch';

interface Eff {
  stand: number;
  wrest: number;
  bjj: number;
  cardio: number;
  chin: number;
  iq: number;
}

function eff(base: Stats, dmg: number, stam: number): Eff {
  const dmgF = 1 - dmg / 260;
  const stamF = stam < 35 ? 0.88 + stam / 300 : 1;
  const f = dmgF * stamF;
  return {
    stand: base.stand * f,
    wrest: base.wrest * f,
    bjj: base.bjj * f,
    cardio: base.cardio,
    chin: base.chin * (1 - dmg / 400),
    iq: base.iq * dmgF,
  };
}

function oppName(opp: Fighter) {
  return opp.nickname ? `„${opp.nickname}” ${opp.lastName}` : `${opp.firstName} ${opp.lastName}`;
}

function shortName(opp: Fighter) {
  return opp.lastName;
}

// AI wyboru akcji: styl + gdzie ma przewagę
function pickAction(rng: Rng, a: Eff, d: Eff, style: string, groundBias: number): Action {
  const adv = (x: number, y: number) => Math.max(0.2, 1 + (x - y) / 25);
  const styleW: Record<string, Record<Action, number>> = {
    boxer: { strike: 7, takedown: 1, sub: 0.5, clinch: 1.5 },
    kickboxer: { strike: 7, takedown: 0.7, sub: 0.4, clinch: 2 },
    wrestler: { strike: 2.5, takedown: 6, sub: 1.5, clinch: 3 },
    grappler: { strike: 2, takedown: 4, sub: 5, clinch: 1.5 },
    brawler: { strike: 8, takedown: 1, sub: 0.3, clinch: 1.5 },
    allround: { strike: 4, takedown: 3, sub: 2, clinch: 2 },
  };
  const w = styleW[style] ?? styleW.allround;
  return rng.weighted<Action>([
    { item: 'strike', w: w.strike * adv(a.stand, (d.stand + d.iq) / 2) },
    { item: 'takedown', w: w.takedown * adv(a.wrest, d.wrest) },
    { item: 'sub', w: (w.sub + groundBias) * adv(a.bjj, d.bjj) },
    { item: 'clinch', w: w.clinch * adv((a.wrest + a.cardio) / 2, (d.wrest + d.cardio) / 2) },
  ]);
}

function styleOfStats(s: Stats): string {
  const max = Math.max(s.stand, s.wrest, s.bjj);
  if (max === s.wrest && s.wrest > s.stand + 5) return 'wrestler';
  if (max === s.bjj && s.bjj > s.stand + 5) return 'grappler';
  if (s.stand > s.wrest + 5) return s.chin > s.iq + 6 ? 'brawler' : 'boxer';
  return 'allround';
}

// ---------- Stan walki ----------

export function newSim(maxRounds: number): FightSim {
  return {
    round: 0,
    maxRounds,
    me: { dmg: 0, stam: 100 },
    opp: { dmg: 0, stam: 100 },
    momentum: 0,
    cards: [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    pending: null,
    decisionUsed: false,
    finished: false,
  };
}

function finishFight(
  rep: FightReport,
  sim: FightSim,
  winner: Who,
  method: 'KO/TKO' | 'Poddanie' | 'Lekarz',
  detail: string,
) {
  sim.finished = true;
  rep.result = winner === 'me' ? 'W' : 'L';
  rep.method = method;
  rep.round = Math.max(1, sim.round);
  rep.detail = detail;
}

function decideOnCards(rep: FightReport, sim: FightSim) {
  sim.finished = true;
  let meW = 0;
  let oppW = 0;
  for (const [a, b] of sim.cards) {
    if (a > b) meW++;
    else if (b > a) oppW++;
  }
  rep.cards = sim.cards.map((c) => [c[0], c[1]] as [number, number]);
  rep.round = sim.maxRounds;
  if (meW === 3 || oppW === 3) {
    rep.result = meW === 3 ? 'W' : 'L';
    rep.method = 'Decyzja jednogłośna';
  } else if (meW === 2 && oppW === 1) {
    rep.result = 'W';
    rep.method = 'Decyzja niejednogłośna';
  } else if (oppW === 2 && meW === 1) {
    rep.result = 'L';
    rep.method = 'Decyzja niejednogłośna';
  } else if (meW === 2 || oppW === 2) {
    rep.result = meW === 2 ? 'W' : 'L';
    rep.method = 'Decyzja większościowa';
  } else if (meW > oppW) {
    rep.result = 'W';
    rep.method = 'Decyzja większościowa';
  } else if (oppW > meW) {
    rep.result = 'L';
    rep.method = 'Decyzja większościowa';
  } else {
    rep.result = 'D';
    rep.method = 'Remis';
  }
  // karty jak na portalach: z perspektywy zwycięzcy (wyższa liczba pierwsza)
  rep.detail = rep.cards.map((c) => (rep.result === 'L' ? `${c[1]}–${c[0]}` : `${c[0]}–${c[1]}`)).join(', ');
}

function addMoment(rep: FightReport, m: Moment) {
  rep.moments.push(m);
}

// ---------- Jedna runda ----------

function simulateRound(rng: Rng, ctx: FightCtx, sim: FightSim, rep: FightReport) {
  sim.round += 1;
  const r = sim.round;
  const opp = ctx.opp;
  const oppStyle = opp.style;
  const meStyle = styleOfStats(ctx.me);
  let pts = { me: 0, opp: 0 };
  const exchanges = 3;
  let groundMe = 0;
  let groundOpp = 0;
  const myMod = ctx.form - ctx.penalty + sim.momentum;

  for (let x = 0; x < exchanges && !sim.finished; x++) {
    const meE = eff(ctx.me, sim.me.dmg, sim.me.stam);
    const opE = eff(opp.stats, sim.opp.dmg, sim.opp.stam);
    const initP = clamp(50 + (meE.iq - opE.iq) * 0.6 + (sim.me.stam - sim.opp.stam) * 0.25 + myMod * 0.6, 15, 85);
    const who: Who = rng.chance(initP / 100) ? 'me' : 'opp';
    const A = who === 'me' ? meE : opE;
    const D = who === 'me' ? opE : meE;
    const aSide = who === 'me' ? sim.me : sim.opp;
    const dSide = who === 'me' ? sim.opp : sim.me;
    const action = pickAction(rng, A, D, who === 'me' ? meStyle : oppStyle, who === 'me' ? groundMe : groundOpp);
    const mod = (who === 'me' ? myMod : -myMod * 0.5) + (aSide.stam - dSide.stam) * 0.15;
    let p: number;
    let defStat: number;
    switch (action) {
      case 'strike': {
        defStat = D.stand * 0.55 + D.iq * 0.45;
        // leżąc pod rywalem trudno bić: kara za uderzanie z dołu
        const underneath = who === 'me' ? groundOpp > 0 : groundMe > 0;
        p = chanceFrom(A.stand, defStat, mod - (underneath ? 14 : 0));
        break;
      }
      case 'takedown':
        defStat = D.wrest * 0.85 + D.cardio * 0.15;
        p = chanceFrom(A.wrest, defStat, mod);
        break;
      case 'sub':
        defStat = D.bjj * 0.8 + D.wrest * 0.2;
        p = chanceFrom(A.bjj, defStat, mod - 6 + (who === 'me' ? groundMe : groundOpp) * 8);
        break;
      default:
        defStat = (D.wrest + D.cardio) / 2;
        p = chanceFrom((A.wrest + A.cardio) / 2, defStat, mod);
    }
    const out = rollExchange(rng, p);
    aSide.stam -= action === 'strike' ? 3 : 5;
    const add = (n: number) => {
      if (who === 'me') pts.me += n;
      else pts.opp += n;
    };

    if (out === 'fail') {
      if (action === 'takedown') {
        aSide.stam -= 4;
        add(-0.5);
      } else if (action === 'strike' && D.wrest > A.wrest + 10 && rng.chance(0.35)) {
        // lepszy zapaśnik schodzi pod ciosem i obala
        aSide.stam -= 5;
        add(-1.5);
        if (who === 'me') {
          groundOpp++;
          groundMe = 0;
        } else {
          groundMe++;
          groundOpp = 0;
        }
      } else if (action === 'strike' && rng.chance(0.35)) {
        aSide.dmg += rng.int(3, 7);
        add(-1);
      } else if (action === 'sub') {
        if (who === 'me') groundMe = 0;
        else groundOpp = 0;
        add(-1);
      }
      continue;
    }

    const big = out === 'super';
    if (action === 'strike') {
      dSide.dmg += big ? rng.int(14, 22) : rng.int(6, 11);
      add(big ? 4 : 2);
      if (big || (dSide.dmg >= 55 && rng.chance(0.45))) {
        // nokdaun - test na skończenie
        const chin = who === 'me' ? D.chin : D.chin; // D to broniący
        const pf = Math.round(clamp(14 + (A.stand - chin) * 0.7 + dSide.dmg * 0.55, 5, 85));
        const fin = rng.chance(pf / 100);
        const d = rng.pick(WIN_DETAILS.KO);
        const detail = d.nom;
        const n = shortName(opp);
        if (who === 'me') {
          addMoment(rep, {
            round: r,
            title: fin ? 'Nokaut!' : 'Rywal leży!',
            text: fin
              ? `Trafiasz go ${d.form} i ${n} pada jak długi. Sędzia od razu przerywa.`
              : `Trafiasz go ${d.form}. ${n} ląduje na macie, ale zdąży się pozbierać, zanim do niego dopadniesz.`,
            stat: 'stand',
            chance: pf,
            outcome: fin ? 'super' : 'success',
            effect: fin ? 'koniec walki' : 'rywal mocno obity',
            tone: fin ? 'purple' : 'good',
          });
        } else {
          addMoment(rep, {
            round: r,
            title: fin ? 'Zgasło światło' : 'Podnosisz się po nokdaunie',
            text: fin
              ? `${n} trafia cię ${d.form}. Budzisz się na stołku w narożniku i pytasz, która runda.`
              : `${n} trafia cię ${d.form} i lądujesz na macie. Szczęka wytrzymała, zbierasz się.`,
            stat: 'chin',
            chance: 100 - pf,
            outcome: fin ? 'fail' : 'success',
            effect: fin ? 'koniec walki' : 'jesteś mocno obity',
            tone: fin ? 'bad' : 'neutral',
          });
        }
        if (fin) {
          finishFight(rep, sim, who, 'KO/TKO', detail);
          break;
        }
      }
    } else if (action === 'takedown') {
      dSide.stam -= big ? 10 : 6;
      dSide.dmg += rng.int(2, 5); // presja z góry
      add(big ? 3 : 2);
      if (who === 'me') {
        groundMe++;
        groundOpp = 0;
      } else {
        groundOpp++;
        groundMe = 0;
      }
      // z góry można kończyć: po mocnym obaleniu zawsze, po zwykłym czasem (im dłużej kontrolujesz, tym częściej)
      const control = who === 'me' ? groundMe : groundOpp;
      const transition = big || rng.chance(0.2 + control * 0.1);
      const tf = big ? 1 : 0.7;
      if (transition && A.bjj > A.stand + 3) {
        // przejście do pleców i duszenie
        const pf = Math.round(clamp((26 + (A.bjj - D.bjj) * 1.5 + (100 - dSide.stam) * 0.3) * tf, 5, 80));
        if (rng.chance(pf / 100)) {
          const detail = 'duszenie zza pleców';
          addMoment(rep, who === 'me'
            ? { round: r, title: 'Plecy i duszenie', text: `Obalasz, bierzesz plecy, haki w środku. ${shortName(opp)} klepie po kilku sekundach.`, stat: 'bjj', chance: pf, outcome: 'super', effect: 'koniec walki', tone: 'purple' }
            : { round: r, title: 'Oddałeś plecy', text: `${shortName(opp)} obala cię i wskakuje na plecy. Duszenie zza pleców, klepiesz.`, stat: 'bjj', chance: 100 - pf, outcome: 'fail', effect: 'koniec walki', tone: 'bad' });
          finishFight(rep, sim, who, 'Poddanie', detail);
          break;
        }
      } else if (transition) {
        // ground and pound
        dSide.dmg += big ? rng.int(8, 15) : rng.int(4, 9);
        const pf = Math.round(clamp((10 + (A.wrest * 1.2 + A.stand * 0.8 - D.chin * 2) * 0.6 + dSide.dmg * 0.45) * tf, 4, 70));
        if (rng.chance(pf / 100)) {
          if (who === 'me') {
            addMoment(rep, {
              round: r,
              title: 'Ground and pound',
              text: `Obalasz, wchodzisz w dosiad i rozbijasz go z góry. ${shortName(opp)} już się nie broni, sędzia odciąga cię od rywala.`,
              stat: 'wrest',
              chance: pf,
              outcome: 'super',
              effect: 'koniec walki',
              tone: 'purple',
            });
          } else {
            addMoment(rep, {
              round: r,
              title: 'Rozbity z góry',
              text: `${shortName(opp)} obala cię, siada w dosiadzie i leje z góry. Sędzia przerywa.`,
              stat: 'wrest',
              chance: 100 - pf,
              outcome: 'fail',
              effect: 'koniec walki',
              tone: 'bad',
            });
          }
          finishFight(rep, sim, who, 'KO/TKO', 'ciosy w parterze');
          break;
        }
      }
    } else if (action === 'sub') {
      dSide.stam -= 6;
      add(big ? 3 : 1.5);
      if (big || rng.chance(dSide.stam < 30 ? 0.5 : 0.3)) {
        const pf = Math.round(clamp((34 + (A.bjj - D.bjj) * 1.6 + (100 - dSide.stam) * 0.35) * (big ? 1 : 0.8), 6, 88));
        const fin = rng.chance(pf / 100);
        const d = rng.pick(WIN_DETAILS.SUB);
        const detail = d.nom;
        const n = shortName(opp);
        if (who === 'me') {
          addMoment(rep, {
            round: r,
            title: fin ? 'Odklepał!' : 'Było blisko',
            text: fin
              ? `Zapinasz ${d.form} i ${n} klepie po kilku sekundach.`
              : `Zapinasz ${d.form}, ale ${n} w ostatniej chwili się wyrywa.`,
            stat: 'bjj',
            chance: pf,
            outcome: fin ? 'super' : 'success',
            effect: fin ? 'koniec walki' : 'rywal słabnie',
            tone: fin ? 'purple' : 'good',
          });
        } else {
          addMoment(rep, {
            round: r,
            title: fin ? 'Klepiesz' : 'Wyrwałeś się',
            text: fin
              ? `${n} zapina ${d.form}. Nie ma wyjścia, klepiesz.`
              : `${n} zapina ${d.form}, ale na spokojnie się wykręcasz.`,
            stat: 'bjj',
            chance: 100 - pf,
            outcome: fin ? 'fail' : 'success',
            effect: fin ? 'koniec walki' : 'przetrwane',
            tone: fin ? 'bad' : 'neutral',
          });
        }
        if (fin) {
          finishFight(rep, sim, who, 'Poddanie', detail);
          break;
        }
      }
    } else {
      dSide.stam -= big ? 9 : 6;
      dSide.dmg += rng.int(2, 6);
      add(big ? 2.5 : 1.5);
    }

    if (dSide.dmg >= 100) {
      finishFight(rep, sim, who, 'KO/TKO', 'ciosy');
      break;
    }
  }

  // zmęczenie rundy
  const drain = (c: number) => 20 - c / 7;
  sim.me.stam = clamp(sim.me.stam - drain(ctx.me.cardio), 0, 100);
  sim.opp.stam = clamp(sim.opp.stam - drain(opp.stats.cardio), 0, 100);
  sim.momentum = Math.round(sim.momentum * 0.4);

  if (sim.finished) return;

  if (sim.me.dmg >= 85 && rng.chance(0.4)) {
    addMoment(rep, {
      round: r,
      title: 'Lekarz przerywa',
      text: 'Rozcięty łuk, krew zalewa oko. Lekarz patrzy dwie sekundy i macha rękami. Koniec.',
      tone: 'bad',
    });
    finishFight(rep, sim, 'opp', 'Lekarz', 'rozcięcie');
    return;
  }

  // punktacja sędziów
  const diff = pts.me - pts.opp;
  for (const card of sim.cards) {
    let meWins: boolean;
    let ten = false;
    const ad = Math.abs(diff);
    if (ad >= 2.5) meWins = diff > 0 ? !rng.chance(0.06) : rng.chance(0.06);
    else if (ad < 0.5 && rng.chance(0.12)) { ten = true; meWins = false; }
    else meWins = rng.chance(clamp(0.5 + diff * 0.17, 0.08, 0.92));
    if (ten) {
      card[0] += 10;
      card[1] += 10;
    } else {
      const eight = ad >= 7 && rng.chance(0.6);
      if (meWins) {
        card[0] += 10;
        card[1] += eight ? 8 : 9;
      } else {
        card[1] += 10;
        card[0] += eight ? 8 : 9;
      }
    }
  }
  sim.me.stam = clamp(sim.me.stam + 12, 0, 100);
  sim.opp.stam = clamp(sim.opp.stam + 12, 0, 100);
}

// ---------- Decyzje ----------

type OptKind = 'risk' | 'normal' | 'safe';

const KIND_OF: Record<string, OptKind> = {};

function option(
  key: string,
  kind: OptKind,
  label: string,
  desc: string,
  stat: StatKey,
  atk: number,
  def: number,
  mod: number,
  win: string,
  lose: string,
): DecisionOption {
  KIND_OF[key] = kind;
  const chance = chanceFrom(atk, def, mod + (kind === 'safe' ? 10 : 0));
  return { key, kind, label, desc, stat, chance, dist: distFrom(chance), win, lose };
}

function cardsLead(sim: FightSim): number {
  let lead = 0;
  for (const [a, b] of sim.cards) lead += Math.sign(a - b);
  return lead;
}

function styleNote(opp: Fighter): string {
  if (opp.freak) return `Rywal to ${opp.freak}. Na papierze nie ma się czego bać.`;
  return (
    {
      boxer: 'Rywal to bokser z szybkimi rękami, ale na plecach się gubi.',
      kickboxer: 'Rywal kopie z dystansu, za to słabo broni obaleń.',
      wrestler: 'Rywal to zapaśnik. Będzie wchodził w nogi od pierwszego gongu.',
      grappler: 'Rywal jest groźny w parterze i tylko czeka, żeby cię tam sprowadzić.',
      brawler: 'Rywal to zadymiarz. Twarda głowa, ciężka ręka, techniki niewiele.',
      allround: 'Rywal jest wszechstronny, bez wyraźnych dziur.',
    } as Record<string, string>
  )[opp.style];
}

function buildDecision(rng: Rng, ctx: FightCtx, sim: FightSim): DecisionPoint | null {
  const dp = buildDecisionRaw(rng, ctx, sim);
  if (dp)
    dp.status = {
      lead: sim.round === 0 ? null : cardsLead(sim),
      stam: Math.round(sim.me.stam),
      hurt: Math.round(sim.me.dmg),
      oppStam: Math.round(sim.opp.stam),
      oppHurt: Math.round(sim.opp.dmg),
    };
  return dp;
}

function buildDecisionRaw(rng: Rng, ctx: FightCtx, sim: FightSim): DecisionPoint | null {
  const me = eff(ctx.me, sim.me.dmg, sim.me.stam);
  const op = eff(ctx.opp.stats, sim.opp.dmg, sim.opp.stam);
  const n = shortName(ctx.opp);
  const next = sim.round + 1;
  const base = ctx.form - ctx.penalty;
  const safe = (key: string, label: string, desc: string, win: string, lose: string, stat: StatKey = 'iq') =>
    option(key, 'safe', label, desc, stat, me[stat], op[stat], base, win, lose);

  if (sim.round === 0) {
    return {
      id: 'plan',
      round: 1,
      title: 'Plan na walkę',
      text: `Dziesięć minut do wyjścia. Trener siada obok i pyta o plan. ${styleNote(ctx.opp)}`,
      options: [
        option('plan_stand', 'normal', 'Bijemy się w stójce', 'Na nogach, szukamy czystych trafień.', 'stand', me.stand, op.stand * 0.6 + op.iq * 0.4, base, 'przewaga w stójce od pierwszej rundy', 'łatwiej nadziać się na kontrę'),
        option('plan_wrest', 'normal', 'Obalamy i dociskamy', 'Zapasy, kontrola z góry, rundy na punkty.', 'wrest', me.wrest, op.wrest, base, 'kontrolujesz rundy z góry', 'tracisz siły na nieudanych wejściach'),
        option('plan_bjj', 'risk', 'Szukamy poddania', 'Sprowadzamy do parteru i polujemy na szyję.', 'bjj', me.bjj, op.bjj * 0.8 + op.wrest * 0.2, base - 4, 'szansa na szybkie poddanie', 'lądujesz pod nim'),
      ],
    };
  }
  if (sim.me.dmg >= 40) {
    return {
      id: 'hurt',
      round: next,
      title: 'Mocno obity',
      text: `Przerwa przed ${next}. rundą. Krew w ustach, nogi jak z waty, a ${n} to widzi. Trener krzyczy, żebyś coś zmienił.`,
      options: [
        option('hurt_wrest', 'normal', 'Klincz i zapasy', 'Wiążesz go przy siatce i kupujesz czas.', 'wrest', me.wrest, op.wrest, base, 'przetrwasz i zabierzesz mu tempo', 'dalej obrywasz'),
        option('hurt_stand', 'risk', 'Wszystko na jedną kartę', 'Stajesz na środku i odpowiadasz bombami.', 'stand', me.stand, op.stand, base - 10, 'szansa na nokaut z niczego', 'możesz zgasnąć'),
        safe('hurt_safe', 'Przeczekujesz rundę', 'Ruch na nogach, garda wysoko, oddech.', 'dochodzisz do siebie', 'runda dla niego', 'chin'),
      ],
    };
  }
  if (sim.opp.stam < 50 || sim.opp.dmg >= 40) {
    return {
      id: 'finish',
      round: next,
      title: 'Rywal siada',
      text: `${n} ciężko dyszy w narożniku i ledwo podnosi ręce. To jest moment, żeby to skończyć.`,
      options: [
        option('fin_stand', 'risk', 'Idziesz po nokaut', 'Ciśniesz od pierwszej sekundy rundy.', 'stand', me.stand, op.chin, base + 4, 'szansa na nokaut', 'zmęczysz się i nadziejesz na kontrę'),
        option('fin_bjj', 'risk', 'Obalasz i szukasz szyi', 'Obalenie, plecy, duszenie.', 'bjj', me.bjj, op.bjj, base + 2, 'szansa na poddanie', 'wyślizgnie ci się i wstanie'),
        safe('fin_safe', 'Wygrywasz na punkty', 'Bez ryzyka, kontrolujesz dystans.', 'pewna runda', 'oddajesz mu inicjatywę'),
      ],
    };
  }
  if (next === sim.maxRounds && sim.maxRounds > 1 && cardsLead(sim) < 0) {
    return {
      id: 'losing',
      round: next,
      title: 'Przegrywasz na kartach',
      text: 'Ostatnia runda. Narożnik mówi wprost: na punkty przegrywamy, trzeba go skończyć albo wyraźnie wygrać tę rundę.',
      options: [
        option('lose_all', 'risk', 'Wszystko albo nic', 'Rzucasz wszystko, co masz.', 'stand', me.stand, op.chin, base - 4, 'szansa na nokaut', 'możesz zostać skontrowany'),
        option('lose_bjj', 'risk', 'Szukasz poddania', 'Ryzykowne przejście do parteru.', 'bjj', me.bjj, op.bjj, base - 4, 'szansa na poddanie', 'stracisz pozycję'),
        option('lose_wrest', 'normal', 'Wygrywasz rundę zapasami', 'Obalenia i kontrola, reszta w rękach sędziów.', 'wrest', me.wrest, op.wrest, base, 'wyraźnie wygrana runda', 'kolejna runda dla niego'),
      ],
    };
  }
  const os = ctx.opp.style;
  if ((os === 'wrestler' || os === 'grappler') && rng.chance(0.6)) {
    return {
      id: 'grounded',
      round: next,
      title: 'Znowu na plecach',
      text: `${n} obala cię co rundę i leży na tobie jak mokry koc. W narożniku: „Musisz coś z tym zrobić!”`,
      options: [
        option('gr_sprawl', 'normal', 'Bronisz obaleń i bijesz', 'Sprawl, odejście od siatki, ciosy na wejściu.', 'wrest', me.wrest, op.wrest, base, 'zostajecie w stójce', 'znowu lądujesz na plecach'),
        option('gr_guard', 'risk', 'Atakujesz z pleców', 'Gilotyna, trójkąt, cokolwiek złapiesz.', 'bjj', me.bjj, op.bjj, base - 6, 'szansa na poddanie z dołu', 'oddajesz mu dosiad'),
        safe('gr_cardio', 'Wstajesz za każdym razem', 'Męczysz go ciągłym wstawaniem.', 'on traci siły szybciej niż ty', 'runda dla niego', 'cardio'),
      ],
    };
  }
  if ((os === 'boxer' || os === 'kickboxer' || os === 'brawler') && rng.chance(0.6)) {
    return {
      id: 'striker',
      round: next,
      title: 'Rozbija cię w stójce',
      text: `${n} trafia cię z dystansu i nie możesz go złapać. Trener krzyczy: „Skróć dystans!”`,
      options: [
        option('st_shot', 'normal', 'Skracasz i obalasz', 'Schodzisz do nóg i sprowadzasz go do parteru.', 'wrest', me.wrest, op.wrest, base + 3, 'przenosisz walkę tam, gdzie mu źle', 'nadziewasz się na kolano'),
        option('st_brawl', 'risk', 'Odpowiadasz ogniem', 'Stajesz z nim na wymianę.', 'stand', me.stand, op.stand, base - 6, 'szansa na nokaut', 'on jest w tym lepszy'),
        safe('st_clinch', 'Klincz i kolana', 'Wiążesz go przy siatce.', 'odbierasz mu dystans', 'runda dla niego', 'cardio'),
      ],
    };
  }
  if (rng.chance(0.5)) {
    return {
      id: 'mid',
      round: next,
      title: 'Narożnik pyta',
      text: `Przerwa przed ${next}. rundą. Wyrównana walka. Trener pyta, gdzie czujesz przewagę.`,
      options: [
        option('mid_stand', 'normal', 'Podkręcasz tempo w stójce', 'Więcej kombinacji, więcej ryzyka.', 'stand', me.stand, op.stand * 0.6 + op.iq * 0.4, base, 'zabierasz mu rundę', 'łapiesz kontrę'),
        option('mid_wrest', 'normal', 'Schodzisz do nóg i obalasz', 'Zapasy i kontrola przy siatce.', 'wrest', me.wrest, op.wrest, base, 'rundy z góry', 'tracisz siły'),
        safe('mid_safe', 'Trzymasz plan', 'Robisz swoje, bez kombinowania.', 'mała przewaga', 'nic się nie zmienia'),
      ],
    };
  }
  return null;
}

const POOL = {
  riskOk: [
    'Wchodzi! {n} cofa się pod siatkę i szuka ratunku.',
    'Trafiasz. {n} pierwszy raz w tej walce wygląda na przestraszonego.',
    'Hala wstaje z miejsc. {n} chwieje się i łapie cię w klincz, żeby przetrwać.',
    'Ryzyko się opłaciło. {n} krwawi z łuku i patrzy na zegar.',
    'Narożnik krzyczy „jeszcze!”. {n} ledwo trzyma gardę.',
  ],
  riskFail: [
    '{n} tylko na to czekał. Łapiesz kontrę i teraz to ty masz problem.',
    'Nie wyszło. Tracisz pozycję i zbierasz kilka mocnych ciosów.',
    'Za szeroko. {n} wchodzi w środek i trafia cię czysto.',
    'Przeszarżowałeś. Ręce opadają, a {n} to widzi.',
  ],
  normalOk: [
    'Plan działa. Ta runda jest twoja.',
    'Robisz swoje, a {n} nie ma na to odpowiedzi.',
    'Spokojnie i konsekwentnie. Sędziowie zapisują rundę dla ciebie.',
    'Trener w przerwie tylko kiwa głową. Tak ma być.',
    '{n} zaczyna się frustrować i szukać pomysłu, którego nie ma.',
  ],
  normalSuper: [
    'Wszystko idzie jak z nut. {n} wygląda, jakby chciał już do domu.',
    'Runda jak z podręcznika. {n} wraca do narożnika ze spuszczoną głową.',
    'Dominacja. Komentator mówi, że „to jest lekcja MMA”.',
  ],
  normalFail: [
    '{n} czyta to bez problemu. Trzeba szukać czegoś innego.',
    'Nie klei się. {n} był na to przygotowany.',
    'Trener w przerwie łapie się za głowę. Plan nie działa.',
    '{n} odpowiada na każdą twoją akcję. Ta runda dla niego.',
  ],
  safeOk: [
    'Spokojnie, bez szaleństw. Zbierasz punkty.',
    'Trzymasz dystans i nie dajesz mu niczego za darmo.',
    'Pracujesz na nogach, kąsasz i odchodzisz. {n} bije powietrze.',
    'Nudno dla kibiców, skutecznie dla sędziów.',
  ],
  safeFail: [
    'Za ostrożnie. Sędziowie widzą, że {n} jest aktywniejszy.',
    'Hala gwiżdże na pasywność. Ta runda raczej dla niego.',
    'Czekasz na swój moment, ale {n} zbiera punkty.',
  ],
};

export function applyDecision(rng: Rng, ctx: FightCtx, sim: FightSim, rep: FightReport, key: string) {
  const dp = sim.pending;
  if (!dp) return;
  const opt = dp.options.find((o) => o.key === key) ?? dp.options[0];
  sim.pending = null;
  sim.decisionUsed = true;
  const out = rollOutcome(rng, opt.chance);
  const n = shortName(ctx.opp);
  const kind: OptKind = opt.kind ?? KIND_OF[opt.key] ?? 'normal';
  const say = (pool: string[]) => rng.pick(pool).replace('{n}', n);
  let text = '';
  let effect = '';
  let tone: Moment['tone'] = out === 'super' ? 'purple' : out === 'success' ? 'good' : 'bad';

  // ryzyko może skończyć walkę także przy zwykłym sukcesie (rywal jest już obity albo zmęczony)
  const finishTry = kind === 'risk' && out === 'success' && rng.chance(0.22 + Math.min(0.3, sim.opp.dmg / 140));
  if ((out === 'super' || finishTry) && kind === 'risk') {
    sim.round = Math.max(sim.round, dp.round);
    let method: 'KO/TKO' | 'Poddanie' = 'KO/TKO';
    let detail: string;
    if (opt.stat === 'bjj') {
      const d = rng.pick(WIN_DETAILS.SUB);
      method = 'Poddanie';
      detail = d.nom;
      text = `Zapinasz ${d.form} i ${n} od razu klepie.`;
    } else if (opt.stat === 'wrest') {
      detail = 'ciosy w parterze';
      text = `Obalasz go i zasypujesz ciosami z góry. Sędzia przerywa.`;
    } else {
      const d = rng.pick(WIN_DETAILS.KO);
      detail = d.nom;
      text = `Wchodzi idealnie. Trafiasz go ${d.form} i ${n} pada.`;
    }
    rep.moments.push({ round: dp.round, title: dp.title, text: `Wybierasz: ${opt.label.charAt(0).toLowerCase() + opt.label.slice(1)}. ${text}`, stat: opt.stat, chance: opt.chance, dist: opt.dist, outcome: out, effect: 'koniec walki', tone: 'purple', decision: true });
    finishFight(rep, sim, 'me', method, detail);
    return;
  }

  if (kind === 'risk') {
    if (out !== 'fail') {
      sim.momentum += 12;
      sim.opp.dmg += 12;
      text = say(POOL.riskOk);
      effect = 'duża przewaga w tej rundzie';
    } else {
      sim.momentum -= 12;
      sim.me.dmg += rng.int(12, 20);
      sim.me.stam = clamp(sim.me.stam - 12, 0, 100);
      text = say(POOL.riskFail);
      effect = 'obrywasz i tracisz rundę';
    }
  } else if (kind === 'normal') {
    if (out === 'super') {
      sim.momentum += 14;
      sim.opp.dmg += 10;
      text = say(POOL.normalSuper);
      effect = 'wyraźna przewaga';
    } else if (out === 'success') {
      sim.momentum += 7;
      sim.opp.dmg += 3;
      text = say(POOL.normalOk);
      effect = 'przewaga w tej rundzie';
    } else {
      sim.momentum -= 5;
      text = say(POOL.normalFail);
      effect = 'runda pod górkę';
    }
  } else {
    // bezpieczny wybór to też odpoczynek: wracają siły, mniej obrywasz
    if (out !== 'fail') {
      sim.momentum += 3;
      sim.me.stam = clamp(sim.me.stam + 18, 0, 100);
      sim.me.dmg = Math.max(0, sim.me.dmg - 8);
      text = say(POOL.safeOk);
      effect = 'łapiesz oddech i małą przewagę';
    } else {
      sim.momentum -= 3;
      sim.me.stam = clamp(sim.me.stam + 8, 0, 100);
      text = say(POOL.safeFail);
      effect = 'runda dla rywala, ale odpocząłeś';
      tone = 'neutral';
    }
  }
  rep.moments.push({ round: dp.round, title: dp.title, text: `Wybierasz: ${opt.label.charAt(0).toLowerCase() + opt.label.slice(1)}. ${text}`, stat: opt.stat, chance: opt.chance, dist: opt.dist, outcome: out, effect, tone, decision: true });
}

// ---------- Główna pętla ----------

// Przesuwa walkę do końca albo do następnej decyzji gracza
export function advanceFight(rng: Rng, ctx: FightCtx, sim: FightSim, rep: FightReport) {
  while (!sim.finished && !sim.pending) {
    if (ctx.allowDecision && !sim.decisionUsed && rng.chance(sim.round === 0 ? ctx.decisionChance * 0.45 : ctx.decisionChance * 0.4)) {
      if (sim.round < sim.maxRounds) {
        const dp = buildDecision(rng, ctx, sim);
        if (dp) {
          sim.pending = dp;
          return;
        }
      }
    }
    if (sim.round >= sim.maxRounds) {
      decideOnCards(rep, sim);
      return;
    }
    simulateRound(rng, ctx, sim, rep);
  }
}

export function statLabel(k: StatKey) {
  return STAT_LABELS[k];
}

export { oppName };
