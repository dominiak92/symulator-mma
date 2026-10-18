import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import hallBg from '../../assets/bg/menu.webp';
import { createPortal } from 'react-dom';
import type { CardSpot, DecisionOption, DecisionPoint, FightOffer, FightReport, GameState, Moment, NewsItem, Stats } from '../../engine/types';
import { galaPrefix, SEASON_FORMS, STAGE_LABELS, STAT_LABELS, STYLE_LABELS } from '../../engine/data';
import { currentYearGoal, acceptInvite, declineInvite, inviteChance, cutChance, postAnswer, weighIn, divisionKey, effectiveStats, weightMissChance, PRESS_OPTIONS, pressAnswer, prepCost, acceptAllOffers, acceptOffer, declineBlocked, declineOffer, decide, negotiateChance, negotiateOffer, recStr, seasonNext, seasonSkip, toSummary } from '../../engine/game';
import { activeManager, currentManager } from '../../engine/managers';
import { sfxCash, sfxClick, sfxCrowd, sfxGong, sfxLoss, sfxThud } from '../sound';
import { OUTCOME_LABEL } from '../../engine/fight';
import { money } from '../../format';
import { loadSettings } from '../../storage';
import { ChanceTag } from '../Chance';
import type { StepProps } from '../Game';
import { GG } from '../brand';
import { Belt, Confetti, Fighter, Medal } from '../Art';
import { FedEmblem, clubCrest } from '../Emblem';
import { clubLogo, fedLogo, rivalClub } from '../logos';
import { careerMarks, champTitle } from '../titles';
import { Flag } from '../Flag';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';
import { chanceTone, chanceWord } from '../Chance';
import { setHudHold, shownRecord, useHudHold } from '../hudHold';
import { TICKET_CUT, TICKET_PRICE, TICKET_OPTIONS, fmtFans, ticketForecast, ticketsAvailable } from '../../engine/extras';
import type { PostFight, SideInvite, TicketPlan } from '../../engine/types';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Ile trwa „rozegranie” jednej rundy w animacji (ms). */
export const ROUND_MS = 480;

const SPOT: Record<CardSpot, string> = { wstępna: 'karta wstępna', główna: 'karta główna', wieczoru: 'main event' };

const d = (ms: number): CSSProperties => ({ ['--d' as string]: `${Math.max(0, ms)}ms` });

/** Losowanie formy: bęben zwalnia jak w automacie i staje na wylosowanej formie. */
function FormReel({ g, spinning, onDone }: { g: GameState; spinning: boolean; onDone: () => void }) {
  const form = g.run!.form;
  const target = Math.max(0, SEASON_FORMS.findIndex((f) => f.label === form.label));
  const [step, setStep] = useState<{ idx: number; ms: number }>({ idx: (target + 2) % SEASON_FORMS.length, ms: 60 });
  const [landed, setLanded] = useState(!spinning);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!spinning) {
      setLanded(true);
      return;
    }
    const N = 18;
    const n = SEASON_FORMS.length;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      const ms = Math.round(55 + 330 * Math.pow(i / N, 3));
      // ostatni krok trafia dokładnie w wylosowaną formę
      const idx = (target - (N - i) + n * 10) % n;
      setStep({ idx, ms });
      if (i < N) t = setTimeout(tick, ms);
      else {
        t = setTimeout(() => {
          setLanded(true);
          t = setTimeout(() => doneRef.current(), 2200);
        }, ms);
      }
    };
    t = setTimeout(tick, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning]);
  const show = landed ? form : SEASON_FORMS[step.idx];
  const tone = landed ? form.tone : 'neutral';
  const reel = (
    <span className="form-window">
      <span
        key={landed ? 'final' : step.idx + '-' + step.ms}
        className={`form-val tone-${tone} ${landed ? 'lock' : 'tick'}`}
        style={{ ['--tick' as string]: `${Math.max(50, step.ms - 10)}ms` }}
        aria-live="polite"
      >
        {show.label}
      </span>
    </span>
  );
  const mod = landed && form.mod !== 0 && (
    <span className={`form-mod ${form.mod > 0 ? 'good' : 'bad'}`}>
      {form.mod > 0 ? '+' : '−'}
      {Math.abs(form.mod)} pkt
    </span>
  );
  const meaning =
    form.mod >= 8
      ? 'Wszystko się układa. Każda walka w tym roku będzie łatwiejsza.'
      : form.mod > 0
        ? 'Organizm dobrze reaguje na treningi. Masz lekką przewagę w walkach.'
        : form.mod === 0
          ? 'Ani lepiej, ani gorzej. O wszystkim zdecyduje klatka.'
          : form.mod <= -8
            ? 'Coś jest nie tak. Każda walka w tym roku będzie trudniejsza.'
            : 'Słabszy rok. Rywale będą mieć lekką przewagę.';
  return (
    <>
      <div className={`form-strip ${landed ? 'landed' : 'rolling'} tone-${tone}`}>
        <Icon name="flame" size={15} className={`tone-${tone}`} />
        <small>Forma</small>
        {reel}
        {mod}
      </div>
      {spinning &&
        createPortal(
          <div
            className={`form-modal ${landed ? 'landed' : 'rolling'} tone-${tone}`}
            role="dialog"
            aria-label="Losowanie formy"
            onClick={() => {
              if (landed) doneRef.current();
              else {
                setLanded(true);
                setTimeout(() => doneRef.current(), 1400);
              }
            }}
          >
            <div className="fm-card">
              <div className="fm-top">
                <Icon name="flame" size={14} />
                <span>Forma w tym roku</span>
              </div>
              <div className={`fm-value tone-${tone}`}>
                <span key={landed ? 'final' : step.idx + '-' + step.ms} className={landed ? 'fm-lock' : 'fm-tick'} style={{ ['--tick' as string]: `${Math.max(50, step.ms - 10)}ms` }}>
                  {show.label}
                </span>
              </div>
              <div className="fm-chip-row">
                {landed && (
                  <span className={`fm-chip ${form.mod > 0 ? 'good' : form.mod < 0 ? 'bad' : ''}`}>
                    {form.mod === 0 ? 'bez premii' : `${form.mod > 0 ? '+' : '−'}${Math.abs(form.mod)} pkt do każdej walki`}
                  </span>
                )}
              </div>
              <p className="fm-text">{landed ? meaning : 'Jak organizm zniesie ten rok?'}</p>
              <span className="fm-hint">{landed ? 'dotknij, żeby przejść dalej' : 'dotknij, żeby pominąć'}</span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function MomentView({ m, style, anim, single }: { m: Moment; style?: CSSProperties; anim?: boolean; single?: boolean }) {
  return (
    <div className={`moment ${m.tone} ${anim ? 'm-anim' : ''}`} style={style}>
      <div className="mt">
        <span className="mt-title">
          {m.brand && GG[m.brand as keyof typeof GG] ? (
            <img className="moment-brand" src={GG[m.brand as keyof typeof GG]} alt="" />
          ) : (
            <Icon name={momentIcon(m)} size={14} className={`mi ${m.tone}`} />
          )}
          {m.title}
        </span>
        {m.round > 0 && !single ? <span className="faint mt-round">R{m.round}</span> : null}
      </div>
      <p>{m.text}</p>
      {m.stat && m.outcome && (
        <div className="test">
          <span className={`tag ${m.outcome === 'fail' ? 'bad' : m.outcome === 'super' ? 'gold' : 'good'}`}>
            {m.outcome === 'fail' && (m.chance ?? 0) >= 70 ? 'pech' : m.outcome !== 'fail' && (m.chance ?? 100) < 30 ? 'udało się wbrew szansom' : OUTCOME_LABEL[m.outcome]}
          </span>
          <span className="faint">
            {STAT_LABELS[m.stat]}
            {m.chance !== undefined ? ` · szansa: ${chanceWord(m.chance)}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}

function momentIcon(m: Moment): string {
  const t = m.title.toLowerCase();
  if (m.decision || t.includes('plan')) return 'target';
  if (t.includes('nokaut') || /\bko\b|tko/.test(t)) return 'bolt';
  if (t.includes('werdykt') || t.includes('sędzi') || t.includes('decyzj')) return 'scale';
  if (t.includes('złot') || t.includes('srebr') || t.includes('brąz') || t.includes('medal')) return 'medal';
  if (t.includes('pas') || t.includes('mistrz')) return 'trophy';
  if (t.includes('kontuzj') || t.includes('rozci') || t.includes('lekarz') || t.includes('obity')) return 'bandage';
  if (t.includes('debiut')) return 'sparkle';
  if (t.includes('cyrk') || t.includes('krew') || t.includes('wypada') || t.includes('walkower')) return 'megaphone';
  if (t.includes('bonus')) return 'coins';
  if (m.tone === 'good') return 'check';
  if (m.tone === 'bad') return 'x';
  if (m.tone === 'purple') return 'star';
  return 'clock';
}

function rankLabel(r: number | null) {
  if (r === 0) return 'mistrz';
  if (r === null) return '';
  return `#${r}`;
}

function contextLine(f: FightReport) {
  if (f.amateur) return `${f.stage ? STAGE_LABELS[f.stage] : 'Turniej'} · ${(f.tourney ?? '').split(' · ')[0].replace(' MMA', '')}`;
  return `${f.gala ?? f.fed}${f.spot ? ` · ${SPOT[f.spot]}` : ''}`;
}

/** Krótki opis sposobu zakończenia do wiersza. */
export function methodShort(f: Pick<FightReport, 'method' | 'round'>) {
  switch (f.method) {
    case 'KO/TKO':
      return `KO · R${f.round}`;
    case 'Lekarz':
      return `TKO · R${f.round}`;
    case 'Poddanie':
      return `poddanie · R${f.round}`;
    case 'Remis':
      return 'remis';
    case 'Walkower':
      return 'walkower';
    case null:
      return '';
    default:
      return 'decyzja';
  }
}

function resWord(f: FightReport) {
  if (f.method === 'Walkower') return f.amateur ? 'Walkower' : 'Odwołana';
  if (f.result === 'W') return f.method === 'KO/TKO' || f.method === 'Lekarz' ? 'Nokaut!' : f.method === 'Poddanie' ? 'Poddał się!' : 'Wygrana';
  if (f.result === 'L') return 'Porażka';
  return 'Remis';
}

function oppName(f: FightReport) {
  const o = f.opp;
  return `${o.firstName} ${o.lastName}`;
}

const STAKE: Record<string, { icon: string; text: string }> = {
  risk: { icon: 'bolt', text: 'może skończyć walkę' },
  normal: { icon: 'trophy', text: 'wygrywasz rundę' },
  safe: { icon: 'heart', text: 'odpoczynek: pomaga, gdy jesteś obity lub zmęczony' },
};

// zwykłe opcje różnią się tym, co dają, a nie tylko szansą
const NORMAL_STAKE: Partial<Record<string, { icon: string; text: string }>> = {
  stand: { icon: 'glove', text: 'obijasz go, łatwiej potem skończyć' },
  wrest: { icon: 'trophy', text: 'pewne punkty, rywal się męczy' },
  cardio: { icon: 'heart', text: 'zajeżdżasz go tempem' },
  iq: { icon: 'trophy', text: 'pewne punkty, mało ryzyka' },
};

function OptionButton({ o, onPick }: { o: DecisionOption; onPick: () => void }) {
  const tone = o.chance >= 56 ? 'good' : o.chance >= 42 ? 'mid' : 'bad';
  const dots = o.chance >= 72 ? 5 : o.chance >= 56 ? 4 : o.chance >= 42 ? 3 : o.chance >= 28 ? 2 : 1;
  const kind = o.kind ?? 'normal';
  const st = kind === 'normal' ? NORMAL_STAKE[o.stat] ?? STAKE.normal : STAKE[kind];
  return (
    <button className={`choice opt opt-${kind}`} onClick={onPick} title={`Szansa: ${o.chance}%`}>
      <span className="opt-top">
        <span className="opt-label">{o.label}</span>
        <span className={`chance-word tone-${tone}`}>
          <span className="dots" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <i key={i} className={i <= dots ? 'on' : ''} />
            ))}
          </span>
          {chanceWord(o.chance)}
        </span>
      </span>
      <span className={`opt-stake stake-${kind}`}>
        <Icon name={st.icon} size={14} />
        <b>{st.text}</b>
      </span>
      <span className="opt-out">
        <span className="ok">✓ {o.win}</span>
        <span className="ko">✗ {o.lose}</span>
      </span>
      <span className="opt-meta">
        <span className="faint test-stat">
          <Icon name={STAT_ICON[o.stat]} size={13} />
          zależy od: {STAT_LABELS[o.stat].toLowerCase()}
        </span>
        {o.perk && (
          <span className="perk-tag" title="Atut z obozu podbija tę opcję">
            <Icon name="bolt" size={12} />
            atut: {o.perk}
          </span>
        )}
      </span>
    </button>
  );
}

function hurtWord(d: number) {
  return d >= 55 ? 'mocno obity' : d >= 30 ? 'obity' : d >= 12 ? 'lekko obity' : 'świeży';
}
function stamWord(v: number) {
  return v >= 70 ? 'pełno sił' : v >= 45 ? 'zmęczony' : 'bez tlenu';
}

function FightStatus({ st }: { st: NonNullable<DecisionPoint['status']> }) {
  const lead = st.lead === null ? null : st.lead > 0 ? 'prowadzisz' : st.lead < 0 ? 'przegrywasz' : 'remis';
  return (
    <div className="fight-status">
      {lead && (
        <span className={`fs ${st.lead! > 0 ? 'good' : st.lead! < 0 ? 'bad' : ''}`}>
          <Icon name="scale" size={13} />
          karty: {lead}
        </span>
      )}
      <span className={`fs ${st.hurt >= 30 || st.stam < 45 ? 'bad' : ''}`}>
        <Icon name="user" size={13} />
        ty: {hurtWord(st.hurt)}, {stamWord(st.stam)}
      </span>
      <span className={`fs ${st.oppHurt >= 30 || st.oppStam < 50 ? 'good' : ''}`}>
        <Icon name="target" size={13} />
        on: {hurtWord(st.oppHurt)}, {stamWord(st.oppStam)}
      </span>
    </div>
  );
}

/** Zwinięty wiersz starszej walki. */
function FightRow({ f, open, onToggle }: { f: FightReport; open: boolean; onToggle: () => void }) {
  const res = f.result ?? 'X';
  return (
    <article className={`frow ${open ? 'open' : ''} ${f.title ? 'title-bout' : ''}`}>
      <button className="frow-btn" onClick={onToggle} aria-expanded={open}>
        <span className={`res-badge sm ${res}`}>{res === 'W' ? 'W' : res === 'L' ? 'P' : res === 'D' ? 'R' : '–'}</span>
        <span className="frow-av" aria-hidden="true">
          <Fighter head seed={`${f.opp.firstName}${f.opp.lastName}`} age={f.opp.age} country={f.opp.country} size={38} hurt={res === 'W' && !!f.method && !/Decyzja|Remis|Walkower/.test(f.method)} />
        </span>
        <span className="frow-main">
          <span className="frow-opp">{oppName(f)}</span>
          <span className="frow-ctx">{contextLine(f)}</span>
        </span>
        <span className={`frow-how ${res}`}>{methodShort(f)}</span>
        <span className="chev" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && f.moments.length > 0 && (
        <div className="moments">
          {f.moments.map((m, i) => (
            <MomentView key={i} m={m} single={f.sim.maxRounds === 1} />
          ))}
        </div>
      )}
    </article>
  );
}

/** Scouting z nagrań: ty kontra rywal w trzech płaszczyznach, do ogarnięcia jednym spojrzeniem. */
function ScoutBars({ me, opp, oppName }: { me: Stats; opp: Stats; oppName: string }) {
  const rows: { k: 'stand' | 'wrest' | 'bjj'; label: string }[] = [
    { k: 'stand', label: 'Stójka' },
    { k: 'wrest', label: 'Zapasy' },
    { k: 'bjj', label: 'Parter' },
  ];
  return (
    <div className="scout" aria-label={`Z nagrań: ty kontra ${oppName}`}>
      <div className="scout-head">
        <span className="me">Ty</span>
        <span className="mid">z nagrań</span>
        <span className="op">{oppName}</span>
      </div>
      {rows.map(({ k, label }) => {
        const a = Math.round(me[k]);
        const b = Math.round(opp[k]);
        const d = a - b;
        const tone = d >= 4 ? 'adv' : d <= -4 ? 'dis' : 'even';
        return (
          <div key={k} className={`scout-row ${tone}`}>
            <span className="sv me">{a}</span>
            <span className="sbar me">
              <i style={{ width: `${Math.min(100, a)}%` }} />
            </span>
            <span className="sl">
              <Icon name={STAT_ICON[k]} size={13} />
              {label}
              <b>{tone === 'adv' ? 'przewaga' : tone === 'dis' ? 'on lepszy' : 'równo'}</b>
            </span>
            <span className="sbar op">
              <i style={{ width: `${Math.min(100, b)}%` }} />
            </span>
            <span className="sv op">{b}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Czy walka zasługuje na osobną scenę wyniku (pas, superfight, zadra, złoto). */
function bigMoment(f: FightReport | undefined): boolean {
  if (!f || !f.sim.finished || !f.result || f.method === 'Walkower') return false;
  if (f.amateur) return f.stage === 'f' && f.result === 'W';
  return !!(f.title || f.superfight || f.unify || f.nemesis);
}

function methodLine(f: FightReport) {
  switch (f.method) {
    case 'KO/TKO':
      return `Nokaut · runda ${f.round}${f.time ? `, ${f.time}` : ''}`;
    case 'Lekarz':
      return `Lekarz przerywa · runda ${f.round}`;
    case 'Poddanie':
      return `Poddanie · runda ${f.round}${f.time ? `, ${f.time}` : ''}`;
    case 'Remis':
      return 'Remis na kartach sędziów';
    default:
      return f.method?.startsWith('Decyzja') ? `${f.method.replace('Decyzja ', '').replace(/^./, (c) => c.toUpperCase())} decyzja sędziów` : '';
  }
}

/** Scena wyniku: jedna, porządna chwila po walce o pas, superfighcie, rewanżu z zadrą albo finale turnieju. */
function ResultReveal({ g, f, onClose }: { g: GameState; f: FightReport; onClose: () => void }) {
  const won = f.result === 'W';
  const draw = f.result === 'D';
  const champ = won && (f.title || f.unify || !!f.superfight);
  const gold = won && f.amateur;
  const headline = draw
    ? 'Remis'
    : !won
      ? f.title && f.defense
        ? 'Pas odchodzi'
        : 'Porażka'
      : f.superfight
        ? 'Podwójny mistrz'
        : f.interim
          ? 'Mistrz tymczasowy'
          : f.title && f.defense
            ? 'Pas zostaje'
            : f.title || f.unify
              ? 'Nowy mistrz'
              : gold
                ? 'Złoto'
                : 'Rachunki wyrównane';
  const winner = draw ? null : won ? `${g.profile.firstName} ${g.profile.lastName}` : `${f.opp.firstName} ${f.opp.lastName}`;
  const goRef = useGoKeys(onClose);
  const fx = loadSettings().animations && !reduced();
  return createPortal(
    <div className={`rv-scene ${won ? 'win' : draw ? 'draw' : 'loss'} ${fx ? 'fx' : ''}`} role="dialog" aria-modal="true" aria-label={headline} onClick={onClose}>
      <div className="rv-hall" aria-hidden="true" style={{ backgroundImage: `url(${hallBg})` }} />
      <div className="rv-light" aria-hidden="true" />
      <div className="rv-body">
        {fedLogo(f.amateur ? f.tourney : f.abroad ? f.gala : f.fed) && <img className="rv-logo" src={fedLogo(f.amateur ? f.tourney : f.abroad ? f.gala : f.fed)!} alt="" aria-hidden="true" />}
        <span className="rv-ctx">{(f.amateur ? contextLine(f) : f.gala ?? f.fed).split(' · ')[0]}</span>
        {(champ || gold) && (
          <div className="rv-prize">
            {champ ? <Belt size={210} tier={f.amateur ? 0 : g.tier} interim={!!f.interim} /> : <Medal kind="gold" size={96} />}
          </div>
        )}
        <h2 className="rv-head">{headline}</h2>
        {winner && (
          <p className="rv-who">
            Wygrywa <b>{winner}</b>
          </p>
        )}
        <p className="rv-how">{methodLine(f)}</p>
        {(f.earned > 0 || (f.fans ?? 0) > 0) && (
          <p className="rv-foot">
            {f.earned > 0 && (
              <span className="rv-money">
                <Icon name="coins" size={16} />+{money(f.earned)}
              </span>
            )}
            {(f.fans ?? 0) > 0 && !f.amateur && (
              <span>
                <Icon name="phone" size={15} />+{fmtFans(f.fans!)} obserwujących
              </span>
            )}
          </p>
        )}
        <button ref={goRef} className="btn btn-primary rv-go" onClick={onClose}>
          Dalej
        </button>
      </div>
      {fx && won && <Confetti count={48} />}
    </div>,
    document.body,
  );
}

/** Bieżąca walka: karta VS z rundami, pieczątką wyniku i decyzją. */
function LiveCard({ g, f, start, animate, setGame }: { g: GameState; f: FightReport; start: number; animate: boolean; setGame: (s: GameState) => void }) {
  const hold = useHudHold();
  const pending = f.sim.pending;
  const done = f.sim.finished;
  const rounds = f.sim.maxRounds;
  const played = done ? f.round : f.sim.round;
  const t = (r: number) => (animate ? (r - start - 1) * ROUND_MS + 200 : 0);
  const stampAt = animate ? (Math.max(played, start) - start) * ROUND_MS + 250 : 0;
  const decisionAt = animate ? (f.sim.round - start) * ROUND_MS + 200 : 0;
  // paski zdrowia i kondycji: przeskakują razem z rundami
  const [barRound, setBarRound] = useState(animate ? start : played);
  useEffect(() => {
    if (!animate) {
      setBarRound(played);
      return;
    }
    const ts: ReturnType<typeof setTimeout>[] = [];
    for (let r = start + 1; r <= played; r++) ts.push(setTimeout(() => setBarRound(r), t(r) + ROUND_MS * 0.45));
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [played, start, animate]);
  const snap = (() => {
    const tr = f.sim.track;
    let v = [100, 100, 100, 100];
    if (tr) for (let r = Math.min(barRound, tr.length - 1); r >= 1; r--) if (tr[r]) { v = [...tr[r]]; break; }
    if (done && barRound >= played && f.method && /KO|Poddanie/.test(f.method)) {
      if (f.result === 'W') v[2] = 0;
      if (f.result === 'L') v[0] = 0;
    }
    return v;
  })();
  const bars = (hp: number, st: number) => (
    <span className="hpbars" aria-label={`zdrowie ${hp}%, kondycja ${st}%`}>
      <i className={`hp ${hp < 30 ? 'low' : hp < 60 ? 'mid' : ''}`} style={{ ['--v' as string]: `${hp}%` } as CSSProperties} />
      <i className="st" style={{ ['--v' as string]: `${st}%` } as CSSProperties} />
    </span>
  );
  const finish = f.method === 'KO/TKO' || f.method === 'Lekarz' || f.method === 'Poddanie';
  const won = f.result === 'W';
  const myShorts = clubCrest(g.club).bg;
  const tourney = f.amateur && g.run?.tourneys?.find((x) => f.tourney?.startsWith(x.name));
  const medal = done && tourney && tourney.stage === null && tourney.medal && (f.stage === 'f' || f.stage === 'b' || f.result === 'L') ? tourney.medal : null;
  const belt = done && f.title && won;
  const rankMove =
    !f.amateur && !f.freak && done && f.result && f.rankAfter !== f.rankBefore
      ? f.rankAfter === 0
        ? 'nowy mistrz!'
        : f.rankBefore === null
          ? `wchodzisz do rankingu: #${f.rankAfter}`
          : f.rankAfter === null
            ? 'wypadasz z rankingu'
            : f.rankBefore === 0
              ? `tracisz pas · #${f.rankAfter}`
              : `ranking #${f.rankBefore} → #${f.rankAfter}`
      : null;

  const sheetMode = typeof window !== 'undefined' && window.innerWidth < 900;
  const decision = pending ? (
    <div className="decision" id="decision">
      <div className="decision-head">
        <span className={`tag ${pending.corner ? 'blue' : 'gold'}`}>
          <Icon name="target" size={13} />
          {pending.corner ? 'Narożnik' : 'Twoja decyzja'}
        </span>
        <span className="faint">
          {f.sim.big ? `runda ${pending.round} z ${f.sim.maxRounds}` : `przed rundą ${pending.round}`}
        </span>
      </div>
      <h3>{pending.title}</h3>
      {pending.id === 'plan' && !f.opp.freak ? (
        <>
          <ScoutBars me={effectiveStats(g)} opp={f.opp.stats} oppName={f.opp.lastName} />
          <p className="decision-text small">Plan ustawia, jak walczysz przez całą walkę. Celuj tam, gdzie masz przewagę.</p>
        </>
      ) : (
        <p className="decision-text">{pending.text}</p>
      )}
      {pending.status && <FightStatus st={pending.status} />}
      {pending.id === 'plan' ? (
        <CoachTip id="plan">Plan ustawia twój styl na całą walkę. Celuj w słaby punkt rywala z nagrań, ale patrz też na szanse: liczą się twoje umiejętności.</CoachTip>
      ) : (
        <CoachTip id="decision">Prowadzisz? Graj spokojnie. Przegrywasz albo rywal słabnie? Zaryzykuj. Obity? Odpocznij.</CoachTip>
      )}
      <div className="choice-list">
        {pending.options.map((o) => (
          <OptionButton
            key={o.key}
            o={o}
            onPick={() => {
              sfxClick();
              setGame(decide(g, o.key));
            }}
          />
        ))}
      </div>
    </div>
  ) : null;

  return (
    <article className={`live ${f.title ? 'title-bout' : ''} ${done ? `done res-${f.result ?? 'X'}` : ''} ${animate ? 'anim' : ''}`} id="live-fight">
      <div className="live-ctx">
        <span className="ctx-ico">
          <Icon name={f.amateur ? 'medal' : 'pin'} size={13} />
          {contextLine(f)}
        </span>
        <span className="row" style={{ gap: 4 }}>
          {f.title && (
            <span className="tag gold">
              <Icon name="trophy" size={12} />
              {f.defense ? 'obrona pasa' : 'o pas'}
            </span>
          )}
          {f.sim.plan && !done && (
            <span className="tag blue" title="Plan na tę walkę">
              <Icon name={f.sim.plan === 'stand' ? 'glove' : f.sim.plan === 'wrest' ? 'takedown' : 'knot'} size={12} />
              plan: {f.sim.plan === 'stand' ? 'stójka' : f.sim.plan === 'wrest' ? 'zapasy' : 'parter'}
            </span>
          )}
          {f.sim.big && !f.title && (
            <span className="tag bad">
              <Icon name="bolt" size={12} />
              walka z rywalem
            </span>
          )}
          {f.peer && !f.sim.big && (
            <span className="tag blue">
              <Icon name="users" size={12} />
              rocznik
            </span>
          )}
        </span>
      </div>

      <div className="vs-hero live-vs">
        {fedLogo(f.amateur ? f.tourney : f.abroad && f.gala ? f.gala : f.fed) && (
          <img className="lv-wm" src={fedLogo(f.amateur ? f.tourney : f.abroad && f.gala ? f.gala : f.fed)!} alt="" aria-hidden="true" />
        )}
        <div className={`vh-side me ${done && f.result === 'L' && finish ? 'ko' : ''} ${done && won ? 'win' : ''}`} style={d(stampAt)}>
          <div className="vh-art">
            {clubLogo(g.club?.name) && <img className="lv-crest" src={clubLogo(g.club?.name)!} alt="" aria-hidden="true" />}
            <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={myShorts} size={80} belt={g.rank === 0 && !f.amateur ? g.tier : false} hurt={done && f.result === 'L' && finish} />
          </div>
          <div className="vh-plate">
            {champTitle(g) && <em className="champ-tag">{champTitle(g)}</em>}
            <small>{g.profile.firstName}</small>
            <b>{g.profile.lastName}</b>
            <span>{recStr(shownRecord(g, hold))}</span>
          </div>
          {bars(snap[0], snap[1])}
        </div>
        <div className="vh-mid live-mid">
          <span className="vh-vs">VS</span>
          <div className="rounds" aria-label={`Runda ${played} z ${rounds}`}>
            {Array.from({ length: rounds }, (_, i) => {
              const r = i + 1;
              const lit = r <= played;
              const end = done && finish && r === f.round;
              return (
                <span key={r} className={`rd ${lit ? (r > start ? 'lit-anim' : 'on') : ''} ${end ? 'end' : ''}`} style={d(t(r))}>
                  {r}
                </span>
              );
            })}
          </div>
        </div>
        <div className={`vh-side opp ${done && won && finish ? 'ko' : ''} ${done && f.result === 'L' ? 'win' : ''}`} style={d(stampAt)}>
          <div className="vh-art">
            {(() => {
              const oc = f.opp.freak ? null : clubLogo(rivalClub(`${f.opp.firstName}${f.opp.lastName}`, f.opp.country, g.club?.name));
              return oc ? <img className="lv-crest" src={oc} alt="" aria-hidden="true" /> : null;
            })()}
            <Fighter weight={f.opp.freak ? undefined : divisionKey(g)} age={f.opp.age} country={f.opp.country} seed={`${f.opp.firstName}${f.opp.lastName}`} corner="red" size={80} mirror hurt={done && won && finish} />
          </div>
          <div className="vh-plate">
            <small>
              {f.opp.flag} {f.opp.nickname ? `„${f.opp.nickname}”` : f.opp.firstName}
            </small>
            <b>{f.opp.lastName}</b>
            <span>
              {f.opp.freak ? f.opp.freak : `${recStr(f.opp.record)} · ${STYLE_LABELS[f.opp.style].toLowerCase()}`}
              {!f.amateur && !f.opp.freak && rankLabel(f.opp.rank) ? ` · ${rankLabel(f.opp.rank)}` : ''}
            </span>
          </div>
          {bars(snap[2], snap[3])}
        </div>
      </div>

      {done && (
        <div className={`stamp ${f.result ?? 'X'} ${finish ? 'finish' : ''}`} style={d(stampAt)}>
          <strong>
            {f.result === 'W' && finish && <Icon name="bolt" size={22} />}
            {resWord(f)}
          </strong>
          {f.method !== 'Walkower' && (
            <span>
              {methodShort(f) === 'decyzja' ? f.method?.replace('Decyzja ', 'decyzja ') : methodShort(f)}
              {finish && f.time ? ` ${f.time}` : ''}
            </span>
          )}
          {(f.earned > 0 || rankMove || (f.fans ?? 0) > 0) && (
            <span className="stamp-foot">
              {f.earned > 0 && (
                <b className="earned">
                  <Icon name="coins" size={14} />+{money(f.earned)}
                </b>
              )}
              {rankMove && (
                <span>
                  <Icon name="trend" size={14} />
                  {rankMove}
                </span>
              )}
              {(f.fans ?? 0) > 0 && !f.amateur && (
                <span className="fans">
                  <Icon name="phone" size={13} />+{fmtFans(f.fans!)} fanów
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {done && f.cards && !finish && f.method !== 'Walkower' && (f.method?.startsWith('Decyzja') || f.method === 'Remis') && (
        <div className="m-anim" style={d(stampAt + 250)}>
          <ScoreCards f={f} />
        </div>
      )}

      {(medal || belt) && (
        <div className="trophy" style={d(stampAt + 350)}>
          {belt ? <Belt size={150} tier={f.amateur ? 0 : g.tier} interim={!!f.interim} /> : <Medal kind={medal as 'gold' | 'silver' | 'bronze'} size={58} />}
          <span>{belt ? (f.defense ? 'Pas zostaje u ciebie' : 'Nowy mistrz!') : medal === 'gold' ? 'Złoto!' : medal === 'silver' ? 'Srebro' : 'Brąz'}</span>
          {animate && (belt || medal === 'gold') && <Confetti />}
        </div>
      )}

      {f.moments.length > 0 && (
        <div className="moments">
          {f.moments.map((m, i) => {
            // odpowiedź z mikrofonu dopisuje się po walce: pokazujemy od razu
            const fresh = animate && m.title !== 'Mikrofon' && m.title !== 'Po werdykcie' && (m.round > start || (m.round === 0 && start === 0));
            const at = m.round === 0 ? 0 : t(m.round) + ROUND_MS * 0.5;
            return <MomentView key={i} m={m} single={f.sim.maxRounds === 1} anim={fresh} style={fresh ? d(at) : undefined} />;
          })}
        </div>
      )}

      {pending &&
        (sheetMode ? (
          createPortal(
            <div className="decision-sheet" style={d(decisionAt)}>
              {decision}
            </div>,
            document.body,
          )
        ) : (
          <div className="m-anim" style={d(decisionAt)}>
            {decision}
          </div>
        ))}
    </article>
  );
}

const INTRO_MS = 3600;
const NEXT_MS = 4000;

const SCOUT: Record<string, string> = {
  boxer: 'Groźny w stójce. Spróbuj sprowadzić go do parteru.',
  kickboxer: 'Kopie z dystansu. Skracaj dystans i wiąż go w klinczu.',
  wrestler: 'Będzie obalał. Pilnuj nóg i wstawaj spod siatki.',
  grappler: 'Szuka poddań. Nie dawaj mu pleców, trzymaj go w stójce.',
  brawler: 'Twarda głowa i ciężka ręka. Nie wdawaj się w otwarte wymiany.',
  allround: 'Bez wyraźnych słabości. Zdecyduje forma dnia.',
};

/** Zapowiedź walki: krótki „plakat” przed każdą walką. */
function FightIntro({ g, f, n, total, onGo, paused }: { g: GameState; f: FightReport; n: number; total: number | null; onGo: () => void; paused: boolean }) {
  const hold = useHudHold();
  const o = f.opp;
  const head = f.amateur ? (f.stage ? STAGE_LABELS[f.stage] : 'Walka') : total ? `Walka ${n} z ${total}` : `Walka ${n}`;
  const goRef = useRef<HTMLButtonElement>(null);
  const goCb = useRef(onGo);
  goCb.current = onGo;
  // klawiatura: fokus na „Do walki!”, Esc też zamyka zapowiedź
  useEffect(() => {
    goRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        goCb.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="fight-intro" role="dialog" aria-modal="true" aria-label={`Zapowiedź: ${head}`} onClick={onGo}>
      <div className={`fi-card ${f.title ? 'title-bout' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="fi-top">
          <span className="fi-num">{head}</span>
          <span className="fi-ctx">{contextLine(f).split(' · ').slice(f.amateur ? 1 : 0).join(' · ')}</span>
        </div>
        {f.title && (
          <div className="fi-belt">
            <Icon name="trophy" size={16} />
            {f.defense ? 'Obrona pasa' : 'Walka o pas'}
          </div>
        )}
        <div className="fi-vs">
          <div className="fi-side me">
            <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={96} belt={g.rank === 0 && !f.amateur ? g.tier : false} />
            <b>{g.profile.lastName}</b>
            <small>{recStr(shownRecord(g, hold))}</small>
          </div>
          <span className="fi-word">VS</span>
          <div className="fi-side opp">
            <Fighter weight={o.freak ? undefined : divisionKey(g)} age={o.age} country={o.country} seed={`${o.firstName}${o.lastName}`} corner="red" size={96} mirror />
            <b>{o.lastName}</b>
            <small>
              {o.flag} {o.freak ? o.freak : `${recStr(o.record)} · ${STYLE_LABELS[o.style].toLowerCase()}`}
            </small>
          </div>
        </div>
        <div className="fi-tags">
          {f.peer && (
            <span className="tag blue">
              <Icon name="users" size={12} />z twojego rocznika
            </span>
          )}
          {!f.amateur && !o.freak && o.rank !== null && (
            <span className="tag">
              <Icon name="trophy" size={12} />
              {o.rank === 0 ? 'mistrz' : `#${o.rank} w rankingu`}
            </span>
          )}
          {f.spot === 'wieczoru' && <span className="tag gold">main event</span>}
        </div>
        <p className="fi-scout">
          <Icon name="target" size={14} />
          {o.freak ? 'Freak fight. Kamery, hałas i cyrk. Nie daj się wyprowadzić z równowagi.' : SCOUT[o.style]}
        </p>
        <button ref={goRef} className="btn btn-primary btn-block btn-ico fi-go" onClick={onGo}>
          <Icon name="glove" />
          Do walki!
          {!paused && <i className="fi-timer" style={{ animationDuration: `${INTRO_MS}ms` }} />}
        </button>
      </div>
    </div>
  );
}

const POSTER_MS = 7000;

function useGoKeys(onGo: () => void) {
  const goRef = useRef<HTMLButtonElement>(null);
  const cb = useRef(onGo);
  cb.current = onGo;
  useEffect(() => {
    goRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cb.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return goRef;
}

/** Wspólny „pojedynek” na plakatach i ofertach: dwaj zawodnicy z tabliczkami nazwisk. */
function VsHero({ g, opp, label, size = 84, belt }: { g: GameState; opp: FightReport['opp']; label?: string; size?: number; belt?: boolean }) {
  const hold = useHudHold();
  return (
    <div className="vs-hero">
      <div className="vh-side me">
        <div className="vh-art">
          <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={size} belt={belt} />
        </div>
        <div className="vh-plate">
          {champTitle(g) && <em className="champ-tag">{champTitle(g)}</em>}
          <small>{g.profile.firstName}</small>
          <b>{g.profile.lastName}</b>
          <span>{recStr(shownRecord(g, hold))}</span>
        </div>
      </div>
      <div className="vh-mid">
        <span className="vh-vs">VS</span>
        {label && <small>{label}</small>}
      </div>
      <div className="vh-side opp">
        <div className="vh-art">
          <Fighter weight={opp.freak ? undefined : divisionKey(g)} age={opp.age} country={opp.country} seed={`${opp.firstName}${opp.lastName}`} corner="red" size={size} mirror />
        </div>
        <div className="vh-plate">
          <small>
            {opp.flag} {opp.nickname ? `„${opp.nickname}”` : opp.firstName}
          </small>
          <b>{opp.lastName}</b>
          <span>{opp.freak ? opp.freak : `${recStr(opp.record)} · ${STYLE_LABELS[opp.style].toLowerCase()}`}</span>
        </div>
      </div>
    </div>
  );
}

/** Scena z plakatu: duzi zawodnicy twarzą w twarz, herby klubów za plecami, logo gali w tle,
 *  pas między nimi przy walce o tytuł, a pod spodem zestawienie jak w telewizji. */
function PosterHero({ g, opp, label, title, interim, fed, medal, abroad }: { g: GameState; opp: FightReport['opp']; label?: string; title?: boolean; interim?: boolean; fed?: string; medal?: boolean; abroad?: boolean }) {
  const hold = useHudHold();
  const myClub = g.club?.name;
  const oppClub = opp.freak ? null : rivalClub(`${opp.firstName}${opp.lastName}`, opp.country, myClub);
  const myCrest = clubLogo(myClub);
  const oppCrest = clubLogo(oppClub);
  const wm = fedLogo(fed);
  const champ = !!title && g.rank === 0;
  // poprzednie spotkania z tym rywalem (bez bieżącej walki)
  const oppName = `${opp.firstName} ${opp.lastName}`;
  const met = g.history.filter((h) => h.opponent === oppName);
  const h2h = { w: met.filter((h) => h.result === 'W').length, l: met.filter((h) => h.result === 'L').length };
  const isPeer = g.peers.some((p) => `${p.firstName} ${p.lastName}` === oppName);
  const isNemesis = !!g.nemesis && g.nemesis.name === oppName;
  const story = isNemesis ? 'zadra' : met.length ? `rewanż · walka nr ${met.length + 1}` : isPeer ? 'chłopak z twojego rocznika' : '';
  return (
    <div className="ph-wrap">
      <div className={`ph ${title ? 'ph-title' : ''}`}>
        {wm && <img className="ph-wm" src={wm} alt="" aria-hidden="true" />}
        <i className="ph-beam l" aria-hidden="true" />
        <i className="ph-beam r" aria-hidden="true" />
        <i className="ph-floor" aria-hidden="true" />
        <div className="ph-side me">
          {myCrest ? <img className="ph-crest" src={myCrest} alt="" aria-hidden="true" /> : <span className="ph-crest ph-flag">🇵🇱</span>}
          <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={150} belt={g.rank === 0 && !title && g.tier > 0 ? g.tier : false} />
        </div>
        <div className="ph-side opp">
          {oppCrest ? <img className="ph-crest" src={oppCrest} alt="" aria-hidden="true" /> : !opp.freak && <span className="ph-crest ph-flag">{opp.flag}</span>}
          <Fighter weight={opp.freak ? undefined : divisionKey(g)} age={opp.age} country={opp.country} seed={`${opp.firstName}${opp.lastName}`} corner="red" size={150} mirror />
        </div>
        {label && <span className="ph-label">{label}</span>}
        {story && <span className={`ph-story ${isNemesis ? 'hot' : ''}`}>{story}</span>}
        <span className="ph-vs">VS</span>
        {title && (
          <div className="ph-belt">
            <Belt size={120} tier={g.tier} interim={interim} />
          </div>
        )}
        {medal && (
          <div className="ph-belt ph-medal">
            <Medal kind="gold" size={54} />
          </div>
        )}
        <div className="ph-plates">
          <div className={`vh-plate ph-plate me ${champ ? 'champ' : ''}`}>
            {abroad && <Flag country="Polska" className="pl-flag" />}
            {champTitle(g) && <em className="champ-tag">{champTitle(g)}</em>}
            <small>{g.profile.firstName}</small>
            <b>{g.profile.lastName}</b>
          </div>
          <div className="vh-plate ph-plate opp">
            {!opp.freak && opp.country && (opp.country !== "Polska" || abroad) && <Flag country={opp.country} className="pl-flag" />}
            <small>
              {!opp.freak && opp.country && (opp.country !== "Polska" || abroad) ? '' : `${opp.flag} `}
              {opp.nickname ? `„${opp.nickname}”` : opp.firstName}
            </small>
            <b>{opp.lastName}</b>
          </div>
        </div>
      </div>
      <dl className="tot" aria-label="Zestawienie zawodników">
        <div>
          <dd>{recStr(shownRecord(g, hold))}</dd>
          <dt>Rekord</dt>
          <dd>{opp.freak ? '—' : recStr(opp.record)}</dd>
        </div>
        {met.length > 0 && (
          <div className="tot-h2h">
            <dd>{h2h.w}</dd>
            <dt>Bilans</dt>
            <dd>{h2h.l}</dd>
          </div>
        )}
        <div>
          <dd>{g.age} lat</dd>
          <dt>Wiek</dt>
          <dd>{opp.age} lat</dd>
        </div>
        <div>
          <dd>{STYLE_LABELS[g.profile.style]}</dd>
          <dt>Styl</dt>
          <dd>{opp.freak ? opp.freak : STYLE_LABELS[opp.style]}</dd>
        </div>
        <div>
          <dd>{myClub ?? '—'}</dd>
          <dt>Klub</dt>
          <dd>{oppClub ?? (opp.freak ? 'influencer' : opp.country)}</dd>
        </div>
      </dl>
    </div>
  );
}

const WALK_MS = 5600;
/** Wejście do klatki: hala gaśnie, spiker zapowiada obu zawodników, na koniec face-off. */
function WalkOut({ g, f, onDone }: { g: GameState; f: FightReport; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, WALK_MS);
    sfxCrowd();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const o = f.opp;
  const head = f.superfight ? 'Superfight' : f.nemesis ? 'Rewanż z zadrą' : f.interim ? 'Walka o pas tymczasowy' : f.unify ? 'Unifikacja pasów' : f.defense ? 'Obrona pasa' : 'Walka o pas';
  const wm = fedLogo(f.abroad && f.gala ? f.gala : f.fed);
  const title = champTitle(g);
  return (
    <div className="wo" role="dialog" aria-modal="true" aria-label={`${head}: wejście zawodników`} onClick={onDone}>
      <div className="wo-hall" style={{ backgroundImage: `url(${hallBg})` }} />
      <i className="wo-beam" />
      <i className="wo-smoke" />
      {wm && <img className="wo-logo" src={wm} alt="" aria-hidden="true" />}
      <div className="wo-head">{head}</div>
      <div className="wo-intro wo-blue">
        <span className="wo-corner">W niebieskim narożniku</span>
        <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={210} belt={g.rank === 0 && g.tier > 0 ? g.tier : false} />
        <div className="wo-name">
          {title && <em className="champ-tag">{title}</em>}
          <small>{g.profile.firstName}{g.profile.nickname ? ` „${g.profile.nickname}”` : ''}</small>
          <b>{g.profile.lastName}</b>
          <span>{recStr(g.record)} · {g.profile.hometown}</span>
        </div>
      </div>
      <div className="wo-intro wo-red">
        <span className="wo-corner">W czerwonym narożniku</span>
        <Fighter weight={o.freak ? undefined : divisionKey(g)} age={o.age} country={o.country} seed={`${o.firstName}${o.lastName}`} corner="red" size={210} mirror />
        <div className="wo-name">
          <small>{o.firstName}{o.nickname ? ` „${o.nickname}”` : ''}</small>
          <b>{o.lastName}</b>
          <span>{o.freak ? o.freak : recStr(o.record)} · {o.country}</span>
        </div>
      </div>
      <div className="wo-face">
        <div className="wo-f me">
          <Fighter weight={divisionKey(g)} age={g.age} country={g.profile.origin} marks={careerMarks(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={190} />
        </div>
        <span className="wo-vs">VS</span>
        <div className="wo-f opp">
          <Fighter weight={o.freak ? undefined : divisionKey(g)} age={o.age} country={o.country} seed={`${o.firstName}${o.lastName}`} corner="red" size={190} mirror />
        </div>
      </div>
      <span className="wo-skip">dotknij, żeby pominąć</span>
    </div>
  );
}

/** Styl plakatu: każda federacja ma swoją identyfikację (parodie), a gale specjalne własny wygląd. */
type PosterTheme = { key: string; ribbon: string; tagline: string; day: string };
const FED_THEMES: [string, Omit<PosterTheme, 'key'> & { key: string }][] = [
  ['Babel', { key: 'babel', ribbon: 'Fight Night', tagline: 'Wieczór, o którym gada całe miasto', day: 'sobota, 19:00' }],
  ['Armada', { key: 'armada', ribbon: 'Armada przedstawia', tagline: 'Pełne burty, pełna hala', day: 'sobota, 19:30' }],
  ['Thunderbolt', { key: 'thunder', ribbon: 'Grzmot nad halą', tagline: 'Szybko, głośno, do końca', day: 'piątek, 20:00' }],
  ['XSW', { key: 'xsw', ribbon: 'Transmisja na żywo · PPV', tagline: 'Ekstremalne starcia wojowników', day: 'sobota, 20:00' }],
  ['FAN', { key: 'fan', ribbon: 'Na żywo w telewizji', tagline: 'Absolutna noc walk', day: 'sobota, 20:00' }],
  ['Cage Worriers', { key: 'cw', ribbon: 'Live from Europe', tagline: 'Where champions are forged', day: 'sobota, 21:00' }],
  ['Hexagon', { key: 'hex', ribbon: 'Six sides of war', tagline: 'Sześć ścian, jeden zwycięzca', day: 'sobota, 21:00' }],
  ['Brava', { key: 'brava', ribbon: 'Brava Combat', tagline: 'Od pustyni po plaże Brazylii', day: 'piątek, 22:00' }],
  ['Oktagram', { key: 'okta', ribbon: 'Vyprodáno · wyprzedane', tagline: 'Pełna hala i trybuny, które śpiewają', day: 'sobota, 19:00' }],
  ['UFL', { key: 'ufl', ribbon: 'PPV · na żywo na całym świecie', tagline: 'Najwięksi z największych', day: 'sobota, 4:00 czasu polskiego' }],
  ['Balettor', { key: 'bal', ribbon: 'Live from the casino', tagline: 'Wszystko na jedną kartę', day: 'piątek, 3:00 czasu polskiego' }],
  ['TWO FC', { key: 'two', ribbon: 'Asian Fight Week', tagline: 'Honor, dyscyplina, nokaut', day: 'piątek, 13:00 czasu polskiego' }],
  ['PLF', { key: 'plf', ribbon: 'Sezon ligowy · play-off', tagline: 'Wygrywasz turniej, bierzesz milion', day: 'czwartek, 2:00 czasu polskiego' }],
];
const FREAK_THEMES: [string, PosterTheme][] = [
  ['Flame', { key: 'f-flame', ribbon: 'Flame · ogień w klatce', tagline: 'Kto się sparzy, ten przegrał', day: 'sobota, 20:00 · PPV' }],
  ['Primo', { key: 'f-primo', ribbon: 'Primo · gala premium', tagline: 'Luksus, dym i złote rękawice', day: 'sobota, 21:00 · PPV' }],
  ['Hype', { key: 'f-hype', ribbon: 'Hype League · live', tagline: 'Wyświetlenia ważniejsze niż rekord', day: 'piątek, 20:00 · PPV' }],
  ['Klout', { key: 'f-klout', ribbon: 'Klout · trending #1', tagline: 'Algorytm wybrał tę walkę', day: 'sobota, 20:00 · PPV' }],
];

function posterTheme(f: FightReport): PosterTheme {
  if (f.freak) {
    const ff = FREAK_THEMES.find(([k]) => f.fed.startsWith(k));
    return ff ? { ...ff[1] } : { key: 'freak', ribbon: 'Hype · show · chaos', tagline: 'Wszyscy oglądają, nikt się nie przyzna', day: 'sobota, 20:00' };
  }
  if (f.abroad === 'Saitama') return { key: 'japan', ribbon: 'Sylwester · Saitama', tagline: 'Noc, w której Japonia nie śpi', day: '31 grudnia, 18:00 czasu lokalnego' };
  if (f.tuneup) return { key: 'cheap', ribbon: 'Wstęp 20 zł · bar czynny', tagline: 'Wielki powrót do formy', day: 'niedziela, 17:00' };
  if (f.abroad) return { key: 'desert', ribbon: `Live from ${f.abroad}`, tagline: 'Pustynia, złoto i noc walk', day: 'piątek, 21:00 czasu lokalnego' };
  const hit = FED_THEMES.find(([k]) => f.fed.startsWith(k) || galaPrefix(f.fed).startsWith(k));
  return hit ? { ...hit[1] } : { key: 'default', ribbon: 'Gala MMA', tagline: '', day: 'sobota, 20:00' };
}

/** Plakat gali zawodowej: nazwa, miasto, hala i cała karta walk. */
function GalaPoster({ g, f, n, total, onGo, paused }: { g: GameState; f: FightReport; n: number; total: number; onGo: () => void; paused: boolean }) {
  const goRef = useGoKeys(onGo);
  const p = f.poster;
  const mineIdx = p ? p.bouts.findIndex((b) => b.tag && b.a === g.profile.lastName && b.b === f.opp.lastName) : -1;
  const spotLabel = f.superfight ? 'superfight' : f.interim ? 'pas tymczasowy' : f.unify ? 'unifikacja' : f.title ? (f.defense ? 'obrona pasa' : 'walka o pas') : SPOT[f.spot ?? 'wstępna'];
  const th = posterTheme(f);
  return (
    <div className="fight-intro poster-modal" role="dialog" aria-modal="true" aria-label={`Gala ${f.gala}`}>
      <div className={`poster th-${th.key} ${f.title || f.superfight ? 'title-bout' : ''} ${f.freak ? 'freak' : ''}`}>
        <span className="pst-ribbon">{th.ribbon}</span>
        <div className="pst-head">
          <div className="pst-brand">
            <FedEmblem name={f.abroad && f.gala ? f.gala : f.fed} size={44} />
          </div>
          <h2>{f.tuneup || f.abroad ? f.gala?.split(' · ')[0] : f.gala}</h2>
          {th.tagline && <span className="pst-tagline">{th.tagline}</span>}
          {p && (
            <span className="pst-place">
              <Icon name="pin" size={13} />
              {p.city} · {p.venue} · {th.day}
            </span>
          )}
        </div>
        <PosterHero g={g} opp={f.opp} label={spotLabel} title={f.title || f.unify || !!f.interim} interim={!!f.interim} fed={f.abroad && f.gala ? f.gala : f.fed} abroad={!!f.abroad} />
        {p && (
          <div className="pst-card-wrap">
            <div className="pst-card-title">Karta walk</div>
            <ol className="pst-card" aria-label="Karta walk">
              {p.bouts.map((b, i) => (
                <li key={i} className={i === mineIdx ? 'me' : ''} style={{ ['--i' as string]: i } as CSSProperties}>
                  <span className="pst-tag">{b.tag}</span>
                  <span className="pst-bout">
                    <span className="pa">
                      <b>{b.a}</b>
                      <small>{b.ar}</small>
                    </span>
                    <i>vs</i>
                    <span className="pb">
                      <b>{b.b}</b>
                      <small>{b.br}</small>
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="pst-foot faint small">
          Twoja walka {n} z {Math.max(n, total)} w tym roku
        </div>
        <button ref={goRef} className="btn btn-primary btn-block btn-ico fi-go" onClick={onGo}>
          <Icon name="glove" />
          Walcz!
          {!paused && <i className="fi-timer" style={{ animationDuration: `${POSTER_MS}ms` }} />}
        </button>
      </div>
    </div>
  );
}

/** Plakat turnieju amatorskiego: nowe miasto, nowa drabinka. */
function TourneyPoster({ g, f, onGo, paused }: { g: GameState; f: FightReport; onGo: () => void; paused: boolean }) {
  const goRef = useGoKeys(onGo);
  const t = g.run?.tourneys?.find((x) => f.tourney?.startsWith(x.name));
  const stages: { k: string; label: string }[] = [
    { k: 'qf', label: 'ćwierćfinał' },
    { k: 'sf', label: 'półfinał' },
    { k: 'f', label: 'finał' },
  ];
  const tk = t?.championship ? 'am-mp' : /Puchar Polski/.test(t?.name ?? '') ? 'am-cup' : 'am-local';
  const ribbon = t?.championship ? 'Mistrzostwa Polski · o tytuł' : /Puchar Polski/.test(t?.name ?? '') ? 'Puchar · ranking krajowy' : 'Zawody amatorskie';
  return (
    <div className="fight-intro poster-modal" role="dialog" aria-modal="true" aria-label={t?.name ?? 'Turniej'}>
      <div className={`poster amateur th-${tk} ${t?.championship ? 'title-bout' : ''}`}>
        <span className="pst-ribbon">{ribbon}</span>
        <div className="pst-head">
          {fedLogo(t?.name) && (
            <div className="pst-brand">
              <img className="fed-logo" src={fedLogo(t?.name)!} alt={t?.name ?? ''} width={68} height={68} />
            </div>
          )}
          <small>{t?.championship ? 'Turniej o tytuł' : 'Turniej amatorski'}</small>
          <h2>{t?.name ?? 'Turniej'}</h2>
          <span className="pst-place">
            <Icon name="pin" size={13} />
            {t?.city} · kategoria: {t?.division}
          </span>
        </div>
        <div className="pst-bracket">
          {stages.map((st, i) => (
            <span key={st.k} className={f.stage === st.k ? 'on' : ''}>
              {i > 0 && <i aria-hidden="true">›</i>}
              {st.label}
            </span>
          ))}
          <span className="medal-goal">
            <Medal kind="gold" size={26} />
          </span>
        </div>
        <p className="pst-text">Ośmiu zawodników w drabince. Trzy wygrane walki dzielą cię od złota{t?.championship ? ' i tytułu mistrza Polski' : ''}.</p>
        <PosterHero g={g} opp={f.opp} label={f.stage ? STAGE_LABELS[f.stage].toLowerCase() : ''} fed={t?.name} medal={f.stage === 'f'} />
        <button ref={goRef} className="btn btn-primary btn-block btn-ico fi-go" onClick={onGo}>
          <Icon name="glove" />
          Walcz!
          {!paused && <i className="fi-timer" style={{ animationDuration: `${POSTER_MS}ms` }} />}
        </button>
      </div>
    </div>
  );
}

/** Konferencja przed dużą galą: rywal rzuca tekst, ty wybierasz odpowiedź. */
function PressCard({ g, o, setGame }: { g: GameState; o: FightOffer; setGame: (s: GameState) => void }) {
  return (
    <div className="fight-intro offer-modal press-modal" role="dialog" aria-modal="true" aria-label="Konferencja przed galą">
      <div className="fi-card">
        <div className="fi-top">
          <span className="fi-num">Konferencja</span>
          <span className="fi-ctx">{o.gala} · face to face</span>
        </div>
        <VsHero g={g} opp={o.opp} label="przed galą" size={64} />
        {o.pressCtx && o.pressCtx.id !== 'default' ? (
          <blockquote className="press-quote">
            <Icon name="megaphone" size={14} />
            <span>{o.pressCtx.question}</span>
          </blockquote>
        ) : (
          <blockquote className="press-quote">
            <Icon name="megaphone" size={14} />
            <span>
              „{o.pressQuote}”<small> {o.opp.lastName}</small>
            </span>
          </blockquote>
        )}
        <div className="choice-list press-opts">
          {PRESS_OPTIONS.map((p) => {
            const lab = o.pressCtx?.labels[p.key];
            const odds = p.key === 'provoke' ? o.pressCtx?.provoke : p.key === 'insult' ? o.pressCtx?.insult : null;
            return (
              <button
                key={p.key}
                className={`choice press-opt press-${p.key}`}
                onClick={() => {
                  sfxClick();
                  setGame(pressAnswer(g, p.key));
                }}
              >
                <span className="opt-top">
                  <span className="title">{lab ? lab[0] : p.label}</span>
                  {odds != null && <ChanceTag p={Math.round(odds * 100)} />}
                </span>
                <span className="desc">{lab ? lab[1] : p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Ważenie: waga nie wyszła. Sauna (szansa na pełną gażę) albo kara z gaży. */
function WeighCard({ g, o, setGame }: { g: GameState; o: FightOffer; setGame: (s: GameState) => void }) {
  const ch = cutChance(g);
  const fine = Math.round((o.purse * 0.25) / 100) * 100;
  return (
    <div className="fight-intro offer-modal weigh-modal" role="dialog" aria-modal="true" aria-label="Ważenie">
      <div className="fi-card">
        <div className="fi-top">
          <span className="fi-num">Ważenie</span>
          <span className="fi-ctx">{o.gala} · dzień przed galą</span>
        </div>
        <div className="weigh-scale" aria-hidden="true">
          <span className="ws-num">
            +1,2<small>kg</small>
          </span>
          <span className="ws-label">ponad limit</span>
        </div>
        <CoachTip id="weigh">Gdy zbijasz wagę, czasem jej nie zrobisz. Sauna daje szansę na całą gażę, ale nieudana kosztuje więcej. Szansa spada z wiekiem i zużyciem, rośnie z lekarzem w zapleczu.</CoachTip>
        <p className="weigh-txt">
          Stajesz na wadze i w sali robi się cicho. Do limitu brakuje ponad kilograma, a do oficjalnego ważenia zostały dwie godziny. {o.opp.lastName} już zrobił wagę i patrzy na ciebie z uśmiechem.
        </p>
        <div className="choice-list press-opts">
          <button
            className="choice"
            onClick={() => {
              sfxClick();
              setGame(weighIn(g, 'cut'));
            }}
          >
            <span className="opt-top">
              <span className="title">Sauna i folie, zbijam do końca</span>
              <ChanceTag p={ch} />
            </span>
            <span className="desc">Uda się: cała gaża, lekko osłabiony. Nie uda się: kara 30% i walka z pustym bakiem.</span>
          </button>
          <button
            className="choice"
            onClick={() => {
              sfxClick();
              setGame(weighIn(g, 'pay'));
            }}
          >
            <span className="opt-top">
              <span className="title">Odpuszczam, płacę karę</span>
              <span className="tag red">−{money(fine)}</span>
            </span>
            <span className="desc">25% gaży idzie do rywala. Wchodzisz do klatki cięższy, ale wysuszony.</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const INVITE_ICON: Record<SideInvite['kind'], string> = { grappling: 'knot', boxing: 'glove', seminar: 'users', grapple1: 'knot', kick: 'glove', film: 'star' };
const INVITE_HEAD: Record<SideInvite['kind'], string> = { grappling: 'Turniej grapplingowy', boxing: 'Walka bokserska', seminar: 'Seminarium', grapple1: 'Superfight grapplingowy', kick: 'Walka kickbokserska', film: 'Propozycja z show-biznesu' };
const INVITE_GOOD: Record<SideInvite['kind'], (inv: SideInvite) => string> = {
  grappling: (inv) => `złoto: parter +2, zapasy +1 i ${money(inv.prize)}; srebro: parter +1`,
  boxing: (inv) => `wygrana: stójka +1, ${money(inv.prize)}, media +2`,
  seminar: (inv) => `${money(inv.prize)}, reputacja +1, media +1, bez ryzyka`,
  grapple1: (inv) => `połowa stawki za wyjście; wygrana: cała ${money(inv.prize)}, parter +1, media i reputacja +2`,
  kick: (inv) => `wygrana: stójka lub kondycja +1, ${money(inv.prize)}, media +2`,
  film: (inv) => `${money(inv.prize)} i media +3, bez walki`,
};
const INVITE_BAD: Record<SideInvite['kind'], (inv: SideInvite) => string> = {
  grappling: (inv) => `wpisowe ${money(inv.fee)}, małe ryzyko urazu, w najbliższej walce forma −2`,
  boxing: () => 'porażka: połowa gaży, zużycie organizmu, w najbliższej walce forma −2',
  seminar: () => 'weekend bez treningu: w najbliższej walce forma −2',
  grapple1: () => 'specjalista na swojej macie, małe ryzyko urazu, w najbliższej walce forma −2',
  kick: () => 'porażka: połowa gaży, zużycie, ryzyko nokautu kopnięciem; w najbliższej walce forma −2',
  film: () => 'reputacja −1 (środowisko się podśmiewa), w najbliższej walce forma −2',
};

/** Zaproszenie na wydarzenie poza MMA: grappling, boks, seminarium. */
type Notice = { head: string; ctx?: string; lines?: string[]; text: string; tone: Moment['tone']; cta: string };

/** Wynik decyzji (zapisany już w stanie gry): pokazujemy go, zanim rok pójdzie dalej. */
function NoticeCard({ n, onClose }: { n: Notice; onClose: () => void }) {
  return (
    <div className="fight-intro offer-modal invite-modal notice-modal" role="dialog" aria-modal="true" aria-label={n.head}>
      <div className="fi-card">
        <div className="fi-top">
          <span className="fi-num">{n.head}</span>
          {n.ctx && <span className="fi-ctx">{n.ctx}</span>}
        </div>
        {n.lines && n.lines.length > 0 && (
          <ol className="inv-lines">
            {n.lines.map((l, i) => (
              <li key={i} style={{ ['--i' as string]: i } as CSSProperties}>
                {l}
              </li>
            ))}
          </ol>
        )}
        <div className={`post-result tone-${n.tone}`}>
          <Icon name={n.tone === 'bad' ? 'x' : n.tone === 'neutral' ? 'megaphone' : 'check'} size={20} />
          <p>{n.text}</p>
        </div>
        <button className="btn btn-primary btn-block btn-ico" autoFocus onClick={onClose}>
          <Icon name="play" />
          {n.cta}
        </button>
      </div>
    </div>
  );
}

function InviteCard({ g, inv, onDone }: { g: GameState; inv: SideInvite; onDone: (s: GameState, n: Notice | null) => void }) {
  const ch = inviteChance(g);
  const excl = g.contract.exclusive;
  return (
    <div className="fight-intro offer-modal invite-modal" role="dialog" aria-modal="true" aria-label={inv.title}>
      <div className="fi-card">
        <div className="fi-top">
          <span className="fi-num">Zaproszenie</span>
          <span className="fi-ctx">poza federacją · {inv.place}</span>
        </div>
        <div className="post-head">
          <span className={`post-ico inv-${inv.kind}`}>
            <Icon name={INVITE_ICON[inv.kind]} size={26} />
          </span>
          <div>
            <b>{inv.title}</b>
            <p>{inv.text}</p>
          </div>
        </div>
        <div className="tuneup-fx">
          <span className="good">
            <Icon name="check" size={13} />
            {INVITE_GOOD[inv.kind](inv)}
          </span>
          <span className="bad">
            <Icon name="x" size={13} />
            {INVITE_BAD[inv.kind](inv)}
          </span>
        </div>
        <CoachTip id="invite">Zaproszenia spoza MMA wolno brać nawet przy kontrakcie na wyłączność. Dają umiejętności, kasę albo rozpoznawalność, ale zabierają kilka dni treningu: w najbliższej walce forma −2.</CoachTip>
        {ch !== null && (
          <p className="inv-chance">
            {inv.kind === 'grappling' ? 'Szansa na złoto' : 'Szansa na wygraną'}: <ChanceTag p={ch} />
          </p>
        )}
        {excl && <p className="faint small inv-excl">To nie jest walka MMA, więc kontrakt na wyłączność na to pozwala.</p>}
        <div className="ofr-actions">
          <button
            className="btn btn-primary btn-block btn-ico"
            autoFocus
            onClick={() => {
              sfxClick();
              const ns = acceptInvite(g);
              const r = ns.run?.sideLog?.[ns.run.sideLog.length - 1];
              if (r && (r.tone === 'good' || r.tone === 'purple')) sfxCrowd(r.tone === 'purple');
              // wynik od razu trafia do zapisu (bez losowania od nowa po przeładowaniu)
              onDone(ns, r ? { head: INVITE_HEAD[inv.kind], ctx: inv.title, lines: r.lines, text: r.text, tone: r.tone, cta: 'Wracam do sezonu' } : null);
            }}
          >
            <Icon name="check" />
            {inv.kind === 'seminar' ? 'Jadę' : inv.kind === 'film' ? 'Biorę rolę' : 'Startuję'}
          </button>
          <button className="btn btn-ghost btn-block btn-ico btn-decline" onClick={() => onDone(declineInvite(g), null)}>
            <Icon name="x" size={15} />
            <span className="ofr-opt">
              <b>Odpuszczam</b>
              <small>skupiam się na MMA</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Po walce: mikrofon w klatce albo reakcja na kontrowersyjny werdykt. */
function PostCard({ g, post, onDone }: { g: GameState; post: PostFight; onDone: (s: GameState, n: Notice | null) => void }) {
  const last = g.run!.fights[g.run!.fights.length - 1];
  return (
    <div className={`fight-intro offer-modal post-modal ${post.kind}`} role="dialog" aria-modal="true" aria-label={post.title}>
      <div className="fi-card">
        <div className="fi-top">
          <span className="fi-num">{post.kind === 'mic' ? 'Mikrofon' : 'Po werdykcie'}</span>
          <span className="fi-ctx">{last?.gala}</span>
        </div>
        <div className="post-head">
          <span className="post-ico">
            <Icon name={post.kind === 'mic' ? 'mic' : 'scale'} size={26} />
          </span>
          <div>
            <b>{post.title}</b>
            <p>{post.text}</p>
          </div>
        </div>
        {post.kind === 'robbed' && last?.cards && <ScoreCards f={last} />}
        {post.kind === 'mic' ? (
          <CoachTip id="mic">Po wygranej możesz kogoś wywołać. Udane wywołanie mistrza z top 3 daje walkę o pas, dalej w rankingu dostaniesz eliminator. Nieudane kosztuje reputację, a podziękowanie jest bezpieczne.</CoachTip>
        ) : (
          <CoachTip id="robbed">Po niejednogłośnej porażce możesz walczyć o rewanż, przyjąć werdykt z klasą (reputacja) albo zrobić szum w internecie (obserwujący kosztem reputacji).</CoachTip>
        )}
        <div className="choice-list press-opts">
          {post.options.map((o) => (
            <button
              key={o.key}
              className="choice"
              onClick={() => {
                sfxClick();
                const ns = postAnswer(g, o.key);
                const f = ns.run?.fights[ns.run.fights.length - 1];
                const m = f?.moments[f.moments.length - 1];
                const ok = m && (m.title === 'Mikrofon' || m.title === 'Po werdykcie');
                if (ok && (m.tone === 'purple' || m.tone === 'good')) sfxCrowd(false);
                onDone(ns, ok ? { head: post.kind === 'mic' ? 'Mikrofon' : 'Po werdykcie', ctx: last?.gala, text: m.text, tone: m.tone, cta: 'Dalej' } : null);
              }}
            >
              <span className="opt-top">
                <span className="title">{o.label}</span>
                {o.chance !== undefined && <ChanceTag p={o.chance} />}
              </span>
              <span className="desc">{o.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const JUDGES = ['Tomasz Wiśniewski', 'Anna Kowalczyk', 'Mark Dolan', 'Piotr Zając', 'Jean Moreau', 'Ewa Lis', 'Sal Romano', 'Marek Duda'];

/** Karty trzech sędziów: kto ile dał i czy był głos odrębny. */
export function ScoreCards({ f }: { f: FightReport }) {
  if (!f.cards || !f.result) return null;
  const won = f.result === 'W';
  // sędzia nie może nazywać się tak samo jak rywal
  const pool = JUDGES.filter((j) => !j.endsWith(` ${f.opp.lastName}`));
  const seed = (f.opp.id.charCodeAt(0) + f.opp.id.length * 7 + f.idx * 3) % pool.length;
  const rows = f.cards.map((c, i) => ({ name: pool[(seed + i * 3) % pool.length], me: c[0], op: c[1] }));
  const mine = rows.filter((r) => r.me > r.op).length;
  const theirs = rows.filter((r) => r.op > r.me).length;
  const split = mine > 0 && theirs > 0;
  return (
    <div className={`scorecards ${split ? 'split' : ''}`} aria-label="Karty sędziów">
      <div className="sc-head">
        <span>Karty sędziów</span>
        <span className="sc-who">
          <b>Ty</b> · {f.opp.lastName}
        </span>
      </div>
      {rows.map((r, i) => {
        const res = r.me > r.op ? 'me' : r.op > r.me ? 'op' : 'eq';
        const odd = split && ((won && res === 'op') || (!won && res === 'me'));
        return (
          <div key={i} className={`sc-row ${res} ${odd ? 'odd' : ''}`}>
            <span className="sc-name">{r.name}</span>
            <span className="sc-score">
              <b className={res === 'me' ? 'win' : ''}>{r.me}</b>
              <i>:</i>
              <b className={res === 'op' ? 'win' : ''}>{r.op}</b>
            </span>
            {odd && <span className="sc-tag">głos odrębny</span>}
          </div>
        );
      })}
    </div>
  );
}

/** Kwota, która płynnie dolicza się do nowej wartości. */
function CountUp({ value, from }: { value: number; from: number | null }) {
  const [v, setV] = useState(from ?? value);
  useEffect(() => {
    if (from === null || from === value) {
      setV(value);
      return;
    }
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setV(Math.round((from + (value - from) * e) / 100) * 100);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, from]);
  return <>{money(v)}</>;
}

type OfferFx = { kind: 'up'; from: number; fromBonus: number } | { kind: 'flat' } | { kind: 'swap' } | null;

/** Oferta walki (zawodowcy): rywal, gaża i decyzja gracza. */
function OfferCard({ g, o, n, total, setGame }: { g: GameState; o: FightOffer; n: number; total: number; setGame: (s: GameState) => void }) {
  const opp = o.opp;
  const goRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    goRef.current?.focus({ preventScroll: true });
  }, [o.opp.id, o.purse]);
  const [prep, setPrep] = useState<'std' | 'rival' | 'hard'>('std');
  const [tix, setTix] = useState<TicketPlan>('std');
  const showTix = ticketsAvailable(g, o);
  const special = !!(o.tuneup || o.short || o.superfight || o.abroad);
  // telefon do organizatora: chwila napięcia, potem widoczny efekt
  const [asking, setAsking] = useState<'neg' | 'decline' | null>(null);
  const [fx, setFx] = useState<OfferFx>(null);
  const prevRef = useRef({ id: o.opp.id, purse: o.purse, bonus: o.winBonus, neg: !!o.negotiated });
  useEffect(() => {
    const p = prevRef.current;
    if (p.id !== o.opp.id) {
      setFx({ kind: 'swap' });
      setPrep('std');
    }
    else if (o.purse > p.purse) {
      setFx({ kind: 'up', from: p.purse, fromBonus: p.bonus });
      sfxCash();
    } else if (o.negotiated && !p.neg) setFx({ kind: 'flat' });
    prevRef.current = { id: o.opp.id, purse: o.purse, bonus: o.winBonus, neg: !!o.negotiated };
  }, [o.opp.id, o.purse, o.winBonus, o.negotiated]);
  // akcja po „telefonie” działa na najświeższym stanie i tylko, jeśli to wciąż ta sama oferta
  const latest = useRef(g);
  latest.current = g;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const call = (kind: 'neg' | 'decline', fn: (x: GameState) => GameState) => {
    if (asking) return;
    sfxClick();
    const slow = loadSettings().animations && !reduced();
    if (!slow) return setGame(fn(g));
    setAsking(kind);
    const id = o.opp.id;
    timer.current = setTimeout(() => {
      timer.current = null;
      setAsking(null);
      const cur = latest.current;
      if (cur.run?.offer?.opp.id !== id) return;
      setGame(fn(cur));
    }, kind === 'neg' ? 1100 : 950);
  };
  const pc = prepCost(g, o);
  const canRival = g.money >= pc;
  const mgr = currentManager(g);
  const busy = mgr && !activeManager(g);
  const blocked = declineBlocked(g);
  const neg = negotiateChance(g);
  const notes = g.run?.notes ?? [];
  const lastNote = notes[notes.length - 1];
  const head = o.abroad
    ? `Gala za granicą · ${o.abroad}`
    : o.tuneup
    ? 'Walka na odbudowę'
    : o.short
      ? 'Zastępstwo · gala za 6 dni'
      : o.superfight
        ? 'Superfight'
        : o.interim
          ? 'Walka o pas tymczasowy'
          : o.unify
            ? 'Unifikacja pasów'
            : o.title
              ? o.defense
                ? 'Obrona pasa'
                : o.rematch
                  ? 'Rewanż o pas'
                  : 'Walka o pas'
              : o.rematch
                ? 'Rewanż'
                : o.nemesis
                  ? 'Rewanż z zadrą'
                  : `Oferta walki ${n} z ${Math.max(n, total)}`;
  const spot = o.spot ? SPOT[o.spot] : '';
  return (
    <div className="fight-intro offer-modal" role="dialog" aria-modal="true" aria-label={head}>
      <div className={`fi-card ${o.title || o.superfight ? 'title-bout' : ''} ${o.tuneup ? 'tuneup' : ''} ${o.short ? 'short-notice' : ''} ${asking ? 'asking' : ''} ${fx ? `fx-${fx.kind}` : ''}`}>
        <div className="fi-top">
          <span className="fi-num">{head}</span>
          <span className="fi-ctx">
            {o.gala}
            {spot ? ` · ${spot}` : ''}
          </span>
        </div>
        {o.tip && (
          <div className="mgr-tip">
            <span className="mgr-tip-ico">
              <Icon name="briefcase" size={16} />
            </span>
            <p>{o.tip}</p>
          </div>
        )}
        {lastNote && !o.note && !o.tip && (
          <p key={`n-${opp.id}`} className={`ofr-note ${fx?.kind === 'swap' ? 'ofr-banner swap' : ''}`}>
            {fx?.kind === 'swap' && (
              <b className="ofr-banner-tag">
                <Icon name="rotate" size={12} />
                Nowa oferta
              </b>
            )}
            <span className="ofr-banner-txt">{lastNote}</span>
          </p>
        )}
        <div key={`vs-${opp.id}`} className={`ofr-vs ${fx?.kind === 'swap' ? 'vs-swap' : ''} ${asking === 'decline' ? 'declining' : ''}`}>
          <VsHero g={g} opp={opp} label={spot || 'walka'} belt={g.rank === 0} size={72} />
          {asking === 'decline' && <span className="ofr-stamp">Odrzucona</span>}
          {fx?.kind === 'swap' && <span className="ofr-stamp new">Nowy rywal</span>}
        </div>
        <div className="fi-tags">
          {o.short && (
            <span className="tag red">
              <Icon name="clock" size={12} />
              bez obozu
            </span>
          )}
          {o.superfight && (
            <span className="tag gold">
              <Icon name="trophy" size={12} />
              mistrz wagi {o.superfight}
            </span>
          )}
          {o.rematch && (
            <span className="tag red">
              <Icon name="rotate" size={12} />
              rewanż
            </span>
          )}
          {o.rival && (
            <span className="tag red">
              <Icon name="flame" size={12} />
              odwieczny rywal
            </span>
          )}
          {o.nemesis && (
            <span className="tag red">
              <Icon name="flame" size={12} />
              zadra · gaża +30%
            </span>
          )}
          {opp.peer && !o.rival && (
            <span className="tag blue">
              <Icon name="users" size={12} />z twojego rocznika
            </span>
          )}
          {!opp.freak && opp.rank !== null && (
            <span className="tag">
              <Icon name="trophy" size={12} />
              {opp.rank === 0 ? 'mistrz' : `#${opp.rank} w rankingu`}
            </span>
          )}
          {!opp.freak && opp.rank === null && !o.tuneup && <span className="tag">poza rankingiem</span>}
          {!opp.freak && (() => {
            // to samo porównanie co w planie na walkę: ty kontra rywal
            const me = effectiveStats(g);
            const ks = ['stand', 'wrest', 'bjj'] as const;
            const nm = { stand: 'stójka', wrest: 'zapasy', bjj: 'parter' };
            const best = ks.reduce((a, b) => (me[b] - opp.stats[b] > me[a] - opp.stats[a] ? b : a), 'stand' as (typeof ks)[number]);
            const d = me[best] - opp.stats[best];
            if (d >= 4)
              return (
                <span className="tag good" title="Twoja największa przewaga nad rywalem">
                  <Icon name="target" size={12} />
                  twoja przewaga: {nm[best]}
                </span>
              );
            if (d <= -4)
              return (
                <span className="tag bad" title="Rywal jest lepszy w każdej płaszczyźnie">
                  <Icon name="target" size={12} />
                  rywal lepszy wszędzie
                </span>
              );
            return null;
          })()}
          {o.tuneup && (
            <>
              <span className="tag">
                {opp.flag} {opp.country}, {opp.age} lat
              </span>
              <span className="tag red">bilans {recStr(opp.record)}</span>
            </>
          )}
        </div>
        {o.abroad && (
          <div className="tuneup-fx">
            <span className="good">
              <Icon name="check" size={13} />
              dwie i pół stawki, wygrana: media +4 i reputacja +2
            </span>
            <span className="bad">
              <Icon name="x" size={13} />
              ranking stoi w miejscu, mocny rywal, dodatkowa walka w roku męczy organizm
            </span>
          </div>
        )}
        {o.short && (
          <div className="tuneup-fx">
            <span className="good">
              <Icon name="check" size={13} />
              ponad półtorej stawki i rywal wyżej w rankingu, a porażka na zastępstwie prawie nie boli
            </span>
            <span className="bad">
              <Icon name="x" size={13} />
              zero obozu: forma −5{weightMissChance(g) > 0 ? ', a waga dużo trudniejsza' : ''}
            </span>
          </div>
        )}
        {o.tuneup && (
          <div className="tuneup-fx">
            <span className="good">
              <Icon name="check" size={13} />
              łatwa wygrana, ładniejszy rekord, ranking w górę
            </span>
            <span className="bad">
              <Icon name="x" size={13} />
              reputacja spada, a porażka byłaby kompromitacją
            </span>
          </div>
        )}
        {o.hook && (
          <p className="ofr-hook">
            <Icon name="bolt" size={14} />
            <span>{o.hook}</span>
          </p>
        )}
        <div className="ofr-pay">
          <div className={fx?.kind === 'up' ? 'pay-up' : ''}>
            <small>Gaża</small>
            <b>
              <CountUp value={o.purse} from={fx?.kind === 'up' ? fx.from : null} />
            </b>
            {fx?.kind === 'up' && <i className="pay-delta">▲ +{money(o.purse - fx.from)}</i>}
          </div>
          <div className={fx?.kind === 'up' ? 'pay-up' : ''}>
            <small>Za wygraną</small>
            <b>
              +<CountUp value={o.winBonus} from={fx?.kind === 'up' ? fx.fromBonus : null} />
            </b>
          </div>
          {mgr && (
            <div>
              <small>Menedżer</small>
              <b className="neg">−{Math.round(mgr.cut * 100)}%</b>
            </div>
          )}
        </div>
        {busy && <p className="ofr-note">{mgr!.name} w tym roku zajmuje się innymi. Ofertę przyniósł organizator.</p>}
        {o.note && (
          <p key={o.note} className={`ofr-note strong ofr-banner ${fx?.kind === 'up' ? 'up' : fx?.kind === 'flat' ? 'flat' : ''}`}>
            <Icon name={fx?.kind === 'up' ? 'trend' : fx?.kind === 'flat' ? 'x' : 'coins'} size={14} />
            <span className="ofr-banner-txt">{o.note}</span>
          </p>
        )}
        {weightMissChance(g) > 0 && !o.opp.freak && (
          <p className={`ofr-note weight-warn ${weightMissChance(g) >= 15 ? 'hot' : ''}`}>
            <Icon name="scale" size={14} />
            <span>
              Waga na granicy: {weightMissChance(g)}% szansy, że nie zrobisz limitu. Wtedy oddajesz 25% gaży i wchodzisz do klatki wysuszony.
            </span>
          </p>
        )}
        {showTix && (
          <div className="prep tix">
            <small className="prep-title">
              Bilety · ok. {ticketForecast(g, tix)} szt.{tix !== 'none' ? ` ≈ ${money(Math.round((ticketForecast(g, tix) * TICKET_PRICE * TICKET_CUT) / 50) * 50)} prowizji` : ''}
            </small>
            <div className="seg prep-seg" role="radiogroup" aria-label="Sprzedaż biletów">
              {TICKET_OPTIONS.map((x) => (
                <button key={x.id} role="radio" aria-checked={tix === x.id} className={tix === x.id ? 'on' : ''} onClick={() => setTix(x.id)}>
                  <b>{x.label}</b>
                  <small>{x.sub}</small>
                </button>
              ))}
            </div>
            <small className="prep-desc">{TICKET_OPTIONS.find((x) => x.id === tix)!.desc}</small>
          </div>
        )}
        {!o.short && (
        <div className="prep">
          <small className="prep-title">Obóz przed walką</small>
          <div className="seg prep-seg" role="radiogroup" aria-label="Obóz przed walką">
            <button role="radio" aria-checked={prep === 'std'} className={prep === 'std' ? 'on' : ''} onClick={() => setPrep('std')}>
              <b>Zwykły</b>
              <small>bez kosztów</small>
            </button>
            <button role="radio" aria-checked={prep === 'rival'} className={prep === 'rival' ? 'on' : ''} disabled={!canRival} onClick={() => setPrep('rival')}>
              <b>Pod rywala</b>
              <small>−{money(pc)}</small>
            </button>
            <button role="radio" aria-checked={prep === 'hard'} className={prep === 'hard' ? 'on' : ''} onClick={() => setPrep('hard')}>
              <b>Ciężki</b>
              <small>ryzyko urazu</small>
            </button>
          </div>
          <small className="prep-desc">
            {prep === 'rival'
              ? `Sparingi z kimś w stylu rywala (${STYLE_LABELS[opp.style].toLowerCase()}). Wyraźnie lepsza forma w tej walce.`
              : prep === 'hard'
                ? 'Dwa treningi dziennie. Lepsza forma za darmo, ale większe zużycie i ryzyko kontuzji.'
                : 'Normalne przygotowania, bez premii i bez ryzyka.'}
          </small>
        </div>
        )}
        <CoachTip id="offer">Na zawodowstwie każda walka to oferta. Przyjmij ją, spróbuj wynegocjować więcej albo odrzuć i poczekaj na lepszą.</CoachTip>
        {showTix && <CoachTip id="tickets">Na galach regionalnych zawodnicy sami sprzedają bilety. Dostajesz 25% prowizji, a kto sprzedaje dużo, dostaje lepsze miejsce w karcie i wyższe stawki. Kampania kosztuje formę, odpuszczenie da formę +1, ale organizator to zapamięta.</CoachTip>}
        {o.short && <CoachTip id="short">Zastępstwo to walka ponad plan roku. Płacą dużo więcej, a rywal jest wyżej w rankingu, ale nie masz obozu. Porażka prawie nie boli, wygrana daje duży skok.</CoachTip>}
        {o.abroad && <CoachTip id="abroad">Gala za granicą to jednorazowa walka poza twoją federacją: duże pieniądze i szum w mediach, ale ranking się nie rusza. Federacja z kontraktem na wyłączność na to nie pozwala.</CoachTip>}
        {o.superfight && <CoachTip id="superfight">Superfight to walka mistrza z mistrzem innej kategorii. Twój pas nie jest stawką, ale porażka kosztuje reputację, a w następnej obronie czeka numer 1.</CoachTip>}
        <div className="ofr-actions">
          <button ref={goRef} className="btn btn-primary btn-block btn-ico" disabled={!!asking} onClick={() => setGame(acceptOffer(g, prep, tix))}>
            <Icon name="glove" />
            {o.tuneup || o.short ? 'Biorę tę walkę' : o.abroad ? 'Lecę'  : o.superfight ? 'Biorę superfight' : 'Przyjmuję walkę'}
          </button>
          {special ? (
            <button className="btn btn-ghost btn-block btn-ico" disabled={!!asking} onClick={() => call('decline', declineOffer)}>
              <Icon name="x" size={15} />
              {asking === 'decline' ? 'Odmawiasz…' : o.abroad ? 'Zostaję w swojej federacji' : o.short ? 'Nie, czekam na swoją walkę' : o.superfight ? 'Zostaję w swojej kategorii' : 'Wolę walkę w federacji'}
            </button>
          ) : (
          <div className="ofr-row">
            <button className={`btn btn-ghost btn-small btn-ico ${asking === 'neg' ? 'is-asking' : ''}`} disabled={o.negotiated || !!asking} onClick={() => call('neg', negotiateOffer)}>
              <Icon name="coins" size={15} />
              {asking === 'neg' ? (
                <span className="calling">
                  Dzwonisz<i>.</i>
                  <i>.</i>
                  <i>.</i>
                </span>
              ) : o.negotiated ? (
                <span className="ofr-opt">
                  <b>Negocjuj gażę</b>
                  <small>już rozmawiałeś</small>
                </span>
              ) : (
                <span className="ofr-opt">
                  <b>Negocjuj gażę</b>
                  <small className={`tone-${chanceTone(neg)}`}>{chanceWord(neg)}</small>
                </span>
              )}
            </button>
            <button className="btn btn-ghost btn-small btn-ico ofr-no" disabled={!!blocked || !!asking} title={blocked ?? undefined} onClick={() => call('decline', declineOffer)}>
              <Icon name="x" size={15} />
              {asking === 'decline' ? (
                'Odrzucasz…'
              ) : (
                <span className="ofr-opt">
                  <b>Odrzucam</b>
                  <small>{blocked ? 'nie teraz' : 'czekasz dalej'}</small>
                </span>
              )}
            </button>
          </div>
          )}
          {total - n > 0 && !special && (
            <button className="link-btn ofr-auto" disabled={!!asking} onClick={() => setGame(acceptAllOffers(g, prep, tix))}>
              Przyjmuj też kolejne oferty w tym roku
            </button>
          )}
          <p className="faint small ofr-help">{o.abroad ? 'Odmowa nic nie kosztuje: to walka ponad plan roku.' : o.short ? 'Odmowa nic nie kosztuje: to walka ponad plan, twoja zaplanowana walka nadal czeka.' : o.superfight ? 'Odmowa nic nie kosztuje, pas zostaje u ciebie.' : o.tuneup ? 'Odmowa nic nie kosztuje: federacja da ci zwykłego rywala.' : blocked ?? 'Po odmowie przyjdzie inna oferta albo nic. Grymaszenie psuje opinię u promotorów.'}</p>
        </div>
      </div>
    </div>
  );
}

export default function Season({ game, setGame }: StepProps) {
  const g = game;
  const run = g.run!;
  const settings = loadSettings();
  const animate = settings.animations && !reduced();
  const [spinning, setSpinning] = useState(animate && run.fights.length === 0 && !run.offer && !run.press && !run.formSeen);
  const [fast, setFast] = useState(false);
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());
  const gameRef = useRef(g);
  gameRef.current = g;

  const last = run.fights[run.fights.length - 1];
  const waiting = !!last?.sim.pending;
  const anim = animate && !fast;

  // gdy gracz sam przewija albo czyta, gra nie przechodzi dalej sama
  // (na starcie pierwszego roku czeka, aż gracz przeczyta podpowiedź trenera)
  const [paused, setPaused] = useState(() => {
    const st = loadSettings();
    return run.fights.length === 0 && st.tips && !st.tipsSeen.includes('season');
  });
  useEffect(() => {
    const stop = () => setPaused(true);
    const onKey = (e: KeyboardEvent) => {
      // spacja na przycisku to kliknięcie, nie przewijanie
      if (e.key === ' ' && (e.target as HTMLElement | null)?.closest?.('button, summary, input')) return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) stop();
    };
    // każde dotknięcie ekranu (poza sterowaniem rokiem, zapowiedzią i decyzją) zatrzymuje automat
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('.play-ctrl, .fight-intro, .decision, .decision-sheet, .sheet, .icon-btn, .form-modal')) return;
      stop();
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // zapowiedź nowej walki: plakat gali (zawodowcy), plakat turnieju (pierwsza walka turnieju), krótka zapowiedź (reszta)
  const seenIntro = useRef(run.fights.length ? run.fights[run.fights.length - 1].idx : -1);
  const [introIdx, setIntroIdx] = useState<number | null>(null);
  const prevF = run.fights[run.fights.length - 2];
  const introKind: 'gala' | 'tourney' | 'fight' | null = !last
    ? null
    : !last.amateur
      ? 'gala'
      : !prevF || prevF.tourney !== last.tourney
        ? 'tourney'
        : 'fight';
  const wantsIntro = introKind !== null && (introKind !== 'fight' || anim);
  const needIntro = !!last && wantsIntro && last.idx > seenIntro.current;
  useLayoutEffect(() => {
    if (!last || last.idx <= seenIntro.current) return;
    seenIntro.current = last.idx;
    if (wantsIntro) setIntroIdx(last.idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last?.idx]);
  const introOpen = !!last && ((introIdx !== null && introIdx === last.idx) || needIntro);
  // wejście do klatki przed wielką walką (pas, superfight, zadra): raz na walkę, tylko z animacjami
  const bigFight = !!last && !last.amateur && !!(last.title || last.superfight || last.unify || last.nemesis);
  const [walkDone, setWalkDone] = useState(() => (last ? last.idx : -1));
  const walkOpen = introOpen && bigFight && anim && !!last && walkDone !== last.idx && introKind === 'gala';

  useEffect(() => {
    if (introIdx === null || paused || !animate || walkOpen) return;
    const t = setTimeout(() => setIntroIdx(null), introKind === 'fight' ? INTRO_MS : POSTER_MS);
    return () => clearTimeout(t);
  }, [introIdx, paused, introKind, animate, walkOpen]);

  // od której rundy animować bieżącą walkę (po decyzji: od miejsca przerwania)
  const prev = useRef<{ idx: number; round: number; fin: boolean } | null>(null);
  const startRef = useRef(0);
  if (last && !introOpen) {
    const p = prev.current;
    if (!p || p.idx !== last.idx) startRef.current = 0;
    else if (p.round !== last.sim.round || p.fin !== last.sim.finished) startRef.current = p.round;
    prev.current = { idx: last.idx, round: last.sim.round, fin: last.sim.finished };
  }
  const start = startRef.current;
  const revealMs = !last ? 0 : last.sim.finished ? (Math.max(last.round, start) - start) * ROUND_MS + 700 : (last.sim.round - start) * ROUND_MS + 300;
  const finishedNow = !!last?.sim.finished;
  const nextReady = finishedNow && !run.done && !introOpen;


  // tryb „mniej pytań”: drobne decyzje rozstrzygają się same, bezpiecznie
  useEffect(() => {
    if (!loadSettings().fewer) return;
    const cur = gameRef.current;
    const r = cur.run;
    if (!r) return;
    const lf = r.fights[r.fights.length - 1];
    const big = !!lf && (lf.sim.big || lf.title || !!lf.superfight);
    if (r.post && !big) return setGame(postAnswer(cur, r.post.kind === 'mic' ? 'thanks' : 'class'));
    if (r.invite) return setGame(declineInvite(cur));
    if (r.offer && (r.offer.short || r.offer.abroad)) return setGame(declineOffer(cur));
    if (r.press && !(r.press.title || r.press.rival || r.press.superfight)) return setGame(pressAnswer(cur, 'calm'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!run.post, !!run.invite, run.offer?.opp.id, !!run.press]);

  // wynik decyzji (mikrofon, zaproszenie) pokazany po zapisaniu stanu
  const [notice, setNotice] = useState<Notice | null>(null);
  const done = (ns: GameState, n: Notice | null) => {
    setGame(ns);
    if (n) setNotice(n);
  };
  const advance = () => {
    setPaused(false);
    setGame(seasonNext(gameRef.current));
  };

  // przewijanie do karty walki (cała karta na ekranie), na koniec do przycisku
  useEffect(() => {
    if (!last || introOpen) return;
    const t = setTimeout(() => document.getElementById('live-fight')?.scrollIntoView({ behavior: animate ? 'smooth' : 'auto', block: 'start' }), 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last?.idx, introOpen]);
  useEffect(() => {
    if (!run.done || paused) return;
    const t = setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: animate ? 'smooth' : 'auto' }), anim ? revealMs : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.done]);

  const toggle = (i: number) =>
    setOpenIdx((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  // bilans aktualizuje się dopiero po „odsłonięciu” wyniku walki
  const lastKey = last ? `${last.idx}-${last.sim.finished}-${introOpen ? 'i' : ''}` : '';
  const [revealedKey, setRevealedKey] = useState(lastKey);
  useEffect(() => {
    if (!anim) {
      setRevealedKey(lastKey);
      return;
    }
    if (introOpen) return;
    const t = setTimeout(() => setRevealedKey(lastKey), revealMs - 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastKey, anim]);
  const counted = revealedKey === lastKey && !introOpen ? run.fights : run.fights.slice(0, -1);
  // scena wyniku po wielkiej walce (raz na walkę; po wczytaniu gry nie wraca)
  const revealSeen = useRef(last?.sim.finished ? last.idx : -1);
  const [revealIdx, setRevealIdx] = useState<number | null>(null);
  const revealOpen = !!last && revealIdx === last.idx;
  // scena wyniku jeszcze przed nami: kolejne okna (oferta, konferencja, ważenie) czekają
  const [revealDone, setRevealDone] = useState(() => (last?.sim.finished ? last.idx : -1));
  const revealBusy = revealOpen || (!!last && bigMoment(last) && last.idx > revealDone);
  useEffect(() => {
    if (!last || !bigMoment(last) || last.idx <= revealSeen.current) return;
    if (revealedKey !== lastKey || introOpen) return;
    revealSeen.current = last.idx;
    const tm = setTimeout(() => setRevealIdx(last.idx), anim ? 500 : 0);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedKey, lastKey, introOpen]);
  // kontuzja po walce: wyraźny komunikat, co to oznacza (zamiast tylko linijki w opisie walki)
  const injSeen = useRef(last?.sim.finished ? last.idx : -1);
  useEffect(() => {
    if (!last || !last.sim.finished || last.idx <= injSeen.current) return;
    if (revealedKey !== lastKey || introOpen || revealBusy || notice) return;
    const m = last.moments.find((x) => x.title === 'Kontuzja' || x.title === 'Poważna kontuzja' || x.title === 'Uraz na rok');
    injSeen.current = last.idx;
    if (!m) return;
    const name = g.injury?.name ?? '';
    const t = setTimeout(
      () =>
        setNotice(
          m.title === 'Kontuzja'
            ? { head: 'Kontuzja', ctx: name, text: 'Możesz walczyć dalej, ale nie na sto procent: do końca roku każda szansa w walce jest o 4 pkt mniejsza. Uraz minie z końcem roku.', lines: ['Kara do każdej akcji: −4 pkt', 'Lekarz sportowy w zapleczu zmniejsza ryzyko kolejnych urazów'], tone: 'bad', cta: 'Rozumiem' }
            : m.title === 'Poważna kontuzja'
              ? { head: 'Poważna kontuzja', ctx: name, text: 'Lekarz skreśla cię do końca roku. Kolejne walki w tym roku przepadają.', lines: ['Ten rok: koniec walk', 'Przyszły rok: kara −5 pkt do każdej akcji', 'Z kontuzją nie przyjdą zaproszenia z zagranicy ani walki na zastępstwo'], tone: 'bad', cta: 'Do podsumowania' }
              : { head: 'Uraz na cały rok', ctx: name, text: 'Operacja i rehabilitacja. Ten rok się kończy, a cały następny spędzasz na leczeniu, bez walk.', lines: ['Ten rok: koniec walk', 'Przyszły rok: rehabilitacja, zero walk', 'Potem powrót z karą −3 pkt przez dwa lata'], tone: 'bad', cta: 'Do podsumowania' },
        ),
      anim ? 700 : 0,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last?.idx, revealedKey, lastKey, introOpen, revealBusy]);

  const injPending = !!last && last.sim.finished && last.idx > injSeen.current && last.moments.some((x) => x.title === 'Kontuzja' || x.title === 'Poważna kontuzja' || x.title === 'Uraz na rok');
  // pierwsza walka i kolejne: po wyniku chwila przerwy (albo przycisk „Następna walka”)
  useEffect(() => {
    if (spinning || revealOpen || run.done || waiting || introOpen || run.offer || run.press || run.weigh || run.post || run.invite || notice) return;
    if (last && !last.sim.finished) return;
    if (paused && anim) return;
    const delay = !animate ? 0 : fast ? 260 : !last ? 1600 : revealMs + NEXT_MS;
    const t = setTimeout(advance, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, revealOpen, run.done, waiting, introOpen, last?.idx, finishedNow, fast, animate, paused, !!run.offer, !!run.press, !!run.weigh, !!run.post, !!run.invite, !!notice]);

  // decyzja po walce (mikrofon) dopiero, gdy gracz zobaczy wynik
  const [postShown, setPostShown] = useState(false);
  const postKey = run.post ? `${last?.idx}-${run.post.kind}` : '';
  useEffect(() => {
    if (!run.post) {
      setPostShown(false);
      return;
    }
    if (revealedKey !== lastKey || introOpen || revealOpen || (bigMoment(last) && last!.idx > revealSeen.current)) return;
    const tm = setTimeout(() => setPostShown(true), anim ? 900 : 0);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postKey, revealedKey, lastKey, introOpen, anim, revealOpen]);
  const w = counted.filter((f) => f.result === 'W').length;
  const l = counted.filter((f) => f.result === 'L').length;
  const dr = counted.filter((f) => f.result === 'D').length;
  const amateur = !!run.tourneys;
  const recKey = `${w}-${l}-${dr}`;
  const lastRes = last?.sim.finished && revealedKey === lastKey && !introOpen ? last.result : null;
  // dopóki wynik nie jest odsłonięty, belka i karty pokazują stan sprzed walki
  const hidden = last && last.sim.finished && !(revealedKey === lastKey && !introOpen) ? last : null;
  useLayoutEffect(() => {
    setHudHold(hidden ? { result: hidden.result, amateur: !!hidden.amateur, earned: hidden.earned ?? 0 } : null);
  }, [hidden?.idx, !!hidden]);
  useEffect(() => () => setHudHold(null), []);

  // dźwięki: gong na start walki, potem wynik (nokaut, doping, porażka)
  const gonged = useRef(run.fights.length ? run.fights[run.fights.length - 1].idx : -1);
  useEffect(() => {
    if (!last || introOpen || last.idx <= gonged.current || last.method === 'Walkower') return;
    gonged.current = last.idx;
    sfxGong();
  }, [last?.idx, introOpen]);
  const scored = useRef(run.fights.length && run.fights[run.fights.length - 1].sim.finished ? run.fights[run.fights.length - 1].idx : -1);
  useEffect(() => {
    if (!last || !lastRes || last.idx <= scored.current) return;
    scored.current = last.idx;
    const ko = last.method === 'KO/TKO' || last.method === 'Lekarz';
    const big = (last.title && lastRes === 'W') || (last.amateur && (last.stage === 'f' || last.stage === 'b') && lastRes === 'W');
    if (lastRes === 'W') {
      if (ko) sfxThud(true);
      setTimeout(() => sfxCrowd(big), ko ? 180 : 0);
    } else if (lastRes === 'L') {
      if (ko) sfxThud(true);
      setTimeout(sfxLoss, ko ? 250 : 0);
    }
  }, [lastRes, last?.idx]);

  // co jeszcze przed nami
  const upcoming: string[] = [];
  if (!run.done) {
    if (amateur) {
      const ts = run.tourneys!;
      for (let i = run.tIdx ?? 0; i < ts.length; i++) {
        const t = ts[i];
        if (!t.stage) continue;
        if (i === (run.tIdx ?? 0) && last && !last.sim.finished) continue;
        upcoming.push(`${STAGE_LABELS[t.stage]} · ${t.name.replace(' MMA', '')}`);
      }
    } else {
      const left = Math.max(0, run.planned - run.fights.length);
      for (let i = 0; i < left; i++) upcoming.push(`Walka ${run.fights.length + i + 1} · ${i === 0 && run.offer ? `oferta: ${run.offer.opp.firstName} ${run.offer.opp.lastName}` : 'rywal jeszcze nieznany'}`);
    }
  }

  const fightsShown = introOpen ? run.fights.slice(0, -1) : run.fights;

  return (
    <section className={`step season-step ${waiting ? 'has-decision' : ''}`}>
      <div className="kicker season-kicker">{amateur ? 'Turnieje amatorskie' : g.contract.kind === 'freak' ? g.contract.fed : g.fed}</div>
      <div className="season-head">
        <h2>Rok {g.season}</h2>
        <div className={`rec-pill ${lastRes === 'W' ? 'up' : lastRes === 'L' ? 'down' : ''}`} key={recKey} title="Bilans w tym roku">
          <small>Bilans</small>
          <b>
            {w}-{l}
            {dr ? `-${dr}` : ''}
          </b>
          {lastRes === 'W' && <i>▲</i>}
          {lastRes === 'L' && <i>▼</i>}
        </div>
      </div>
      <GoalPill g={g} />
      <FormReel g={g} spinning={spinning} onDone={() => {
          setSpinning(false);
          setPaused(true);
          const cur = gameRef.current;
          if (cur.run && !cur.run.formSeen) setGame({ ...cur, run: { ...cur.run, formSeen: true } });
        }} />

      <CoachTip id="season">
        Walka toczy się sama, a w ważnym momencie trener zapyta cię o plan. Dalej przejdziesz przyciskiem na dole.
      </CoachTip>
      {run.intro.length > 0 && (
        <details className="intro-notes">
          <summary>{amateur ? 'Plan roku: turnieje' : 'Przed startem'}</summary>
          {run.intro.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </details>
      )}

      <div className="fight-list">
        {fightsShown.map((f, i) => (
          <Fragment key={f.idx}>
            {i === run.fights.length - 1 ? (
              <LiveCard g={g} f={f} start={start} animate={anim} setGame={setGame} />
            ) : (
              <FightRow f={f} open={openIdx.has(i)} onToggle={() => toggle(i)} />
            )}
            {f.result && <NewsBox items={(run.news ?? []).filter((n) => n.after === i + 1)} />}
          </Fragment>
        ))}
        {introOpen && last && (
          <div className="upcoming next-up">
            <span className="res-badge sm X">
              <Icon name="glove" size={14} />
            </span>
            {last.amateur && last.stage ? STAGE_LABELS[last.stage] : `Walka ${run.fights.length}`} · {last.opp.firstName} {last.opp.lastName}
          </div>
        )}
        {(run.sideLog ?? []).map((x, i) => (
          <div className={`upcoming side-note tone-${x.tone}`} key={`s${i}`}>
            <span className="res-badge sm X">
              <Icon name={x.tone === 'bad' ? 'x' : 'trophy'} size={14} />
            </span>
            <span>
              <b>{x.title}</b> · {x.lines[x.lines.length - 1]}
            </span>
          </div>
        ))}
        {(run.notes ?? []).map((t, i) => (
          <div className="upcoming season-note" key={`n${i}`}>
            <span className="res-badge sm X">
              <Icon name="x" size={14} />
            </span>
            {t}
          </div>
        ))}
        {upcoming.map((u, i) => (
          <div className="upcoming" key={`u${i}`}>
            <span className="res-badge sm X">
              <Icon name="clock" size={14} />
            </span>
            {u}
          </div>
        ))}
      </div>

      {!run.done && !waiting && !introOpen && !run.offer && !run.press && !run.weigh && !run.post && !run.invite && !notice && (
        <div className="play-ctrl" role="group" aria-label="Tempo roku">
                    {!last && paused && anim && !spinning && (
            <button className="icon-pill next" onClick={advance}>
              Pierwsza walka
              <Icon name="play" size={12} />
            </button>
          )}
          {nextReady && anim && (
            <button className="icon-pill next" onClick={advance} style={d(revealMs)}>
              Następna walka
              <Icon name="play" size={12} />
              {!paused && <i className="next-timer" style={{ animationDelay: `${revealMs}ms`, animationDuration: `${NEXT_MS}ms` }} />}
            </button>
          )}
          <button className={`icon-pill ${fast ? 'on' : ''}`} onClick={() => setFast((x) => !x)} aria-pressed={fast} aria-label={fast ? 'Wolniej' : 'Szybciej'}>
            <Icon name="ff" size={16} />
            {(nextReady || (!last && paused && !spinning)) && anim ? '' : fast ? 'Szybko' : 'Szybciej'}
          </button>
          <button
            className="icon-pill"
            aria-label="Pomiń do końca roku albo do decyzji"
            onClick={() => {
              setSpinning(false);
              setIntroIdx(null);
              setGame(seasonSkip(gameRef.current));
            }}
          >
            <Icon name="skip" size={14} />
            {(nextReady || (!last && paused && !spinning)) && anim ? '' : 'Pomiń'}
          </button>
        </div>
      )}

      {run.done && !run.post && !notice && !revealBusy && !injPending && (
        <div className="cta-bar float" style={d(anim ? revealMs : 0)}>
          <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(toSummary(g))}>
            <Icon name="chart" />
            Podsumowanie roku
          </button>
        </div>
      )}

      {run.press && !run.done && !revealBusy && createPortal(<PressCard g={g} o={run.press} setGame={setGame} />, document.body)}
      {revealOpen && last && <ResultReveal g={g} f={last} onClose={() => { setRevealDone(last.idx); setRevealIdx(null); }} />}
      {run.weigh && !revealBusy && createPortal(<WeighCard g={g} o={run.weigh} setGame={setGame} />, document.body)}
      {run.invite && !run.post && !notice && !revealBusy && createPortal(<InviteCard key={run.invite.title} g={g} inv={run.invite} onDone={done} />, document.body)}
      {run.post && postShown && !notice && createPortal(<PostCard key={postKey} g={g} post={run.post} onDone={done} />, document.body)}
      {notice && createPortal(<NoticeCard n={notice} onClose={() => setNotice(null)} />, document.body)}
      {run.offer && !run.done && !revealBusy && createPortal(<OfferCard key={run.fights.length} g={g} o={run.offer} n={run.fights.length + 1} total={run.planned} setGame={setGame} />, document.body)}
      {introOpen &&
        last &&
        createPortal(
          walkOpen ? (
            <WalkOut g={g} f={last} onDone={() => setWalkDone(last.idx)} />
          ) : introKind === 'gala' ? (
            <GalaPoster g={g} f={last} n={run.fights.length} total={run.planned} paused={paused || !animate} onGo={() => setIntroIdx(null)} />
          ) : introKind === 'tourney' ? (
            <TourneyPoster g={g} f={last} paused={paused || !animate} onGo={() => setIntroIdx(null)} />
          ) : (
            <FightIntro g={g} f={last} n={run.fights.length} total={amateur ? null : run.planned} paused={paused} onGo={() => setIntroIdx(null)} />
          ),
          document.body,
        )}
    </section>
  );
}

/** Cel roku: postęp widoczny w trakcie sezonu. */
const NEWS_ICON: Record<NewsItem['kind'], string> = { result: 'glove', title: 'trophy', injury: 'bandage', callout: 'megaphone', nemesis: 'flame', debut: 'star' };

/** Z federacji: co się dzieje w składzie między twoimi walkami. */
function NewsBox({ items }: { items: NewsItem[] }) {
  if (!items.length) return null;
  return (
    <div className="news-box" role="note" aria-label="Wiadomości z federacji">
      <span className="news-kicker">
        <Icon name="megaphone" size={12} />
        Z federacji
      </span>
      {items.map((n, i) => (
        <p key={i} className={`news-item k-${n.kind}`}>
          <Icon name={NEWS_ICON[n.kind]} size={14} />
          <span>{n.text}</span>
        </p>
      ))}
    </div>
  );
}

function GoalPill({ g }: { g: GameState }) {
  const goal = currentYearGoal(g);
  if (!goal || !g.run || g.run.tourneys) return null;
  const cur = Math.min(goal.need, goal.progress(g, g.run.fights));
  const done = cur >= goal.need;
  return (
    <div className={`goal-pill ${done ? 'done' : ''}`}>
      <Icon name={done ? 'check' : 'target'} size={13} />
      <span>Cel roku: {goal.label}</span>
      <b>{goal.id === 'clean' && cur === 0 && g.run.fights.some((f) => f.result === 'L') ? 'nie wyszło' : `${cur}/${goal.need}`}</b>
    </div>
  );
}
