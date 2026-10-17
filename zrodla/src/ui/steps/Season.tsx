import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { CardSpot, DecisionOption, DecisionPoint, FightOffer, FightReport, GameState, Moment } from '../../engine/types';
import { galaPrefix, SEASON_FORMS, STAGE_LABELS, STAT_LABELS, STYLE_LABELS } from '../../engine/data';
import { divisionKey, weightMissChance, PRESS_OPTIONS, pressAnswer, prepCost, acceptAllOffers, acceptOffer, declineBlocked, declineOffer, decide, negotiateChance, negotiateOffer, recStr, seasonNext, seasonSkip, toSummary } from '../../engine/game';
import { activeManager, currentManager } from '../../engine/managers';
import { sfxCash, sfxClick, sfxCrowd, sfxGong, sfxLoss, sfxThud } from '../sound';
import { OUTCOME_LABEL } from '../../engine/fight';
import { money } from '../../format';
import { loadSettings } from '../../storage';
import type { StepProps } from '../Game';
import { GG } from '../brand';
import { Belt, Confetti, Fighter, Medal } from '../Art';
import { Emblem, clubCrest, crestFor } from '../Emblem';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';
import { chanceWord } from '../Chance';
import { setHudHold, shownRecord, useHudHold } from '../hudHold';

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

function MomentView({ m, style, anim }: { m: Moment; style?: CSSProperties; anim?: boolean }) {
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
        {m.round > 0 ? <span className="faint mt-round">R{m.round}</span> : null}
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
  safe: { icon: 'heart', text: 'łapiesz oddech, mniej obrywasz' },
};

function OptionButton({ o, onPick }: { o: DecisionOption; onPick: () => void }) {
  const tone = o.chance >= 56 ? 'good' : o.chance >= 42 ? 'mid' : 'bad';
  const dots = o.chance >= 72 ? 5 : o.chance >= 56 ? 4 : o.chance >= 42 ? 3 : o.chance >= 28 ? 2 : 1;
  const kind = o.kind ?? 'normal';
  const st = STAKE[kind];
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
            <MomentView key={i} m={m} />
          ))}
        </div>
      )}
    </article>
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
      <p className="decision-text">{pending.text}</p>
      {pending.status && <FightStatus st={pending.status} />}
      <CoachTip id="decision">Prowadzisz? Graj spokojnie. Przegrywasz albo rywal słabnie? Zaryzykuj. Obity? Odpocznij.</CoachTip>
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
        <div className={`vh-side me ${done && f.result === 'L' && finish ? 'ko' : ''} ${done && won ? 'win' : ''}`} style={d(stampAt)}>
          <div className="vh-art">
            <Fighter weight={divisionKey(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={myShorts} size={80} belt={g.rank === 0 && !f.amateur} hurt={done && f.result === 'L' && finish} />
          </div>
          <div className="vh-plate">
            <small>{g.profile.firstName}</small>
            <b>{g.profile.lastName}</b>
            <span>{recStr(shownRecord(g, hold))}</span>
          </div>
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
            <Fighter weight={f.opp.freak ? undefined : divisionKey(g)} seed={`${f.opp.firstName}${f.opp.lastName}`} corner="red" size={80} mirror hurt={done && won && finish} />
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
              {f.cards && !finish && f.method !== 'Remis' ? ` · ${f.cards.map((c) => (won ? `${c[0]}–${c[1]}` : `${c[1]}–${c[0]}`)).join(', ')}` : ''}
            </span>
          )}
          {(f.earned > 0 || rankMove) && (
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
            </span>
          )}
        </div>
      )}

      {(medal || belt) && (
        <div className="trophy" style={d(stampAt + 350)}>
          {belt ? <Belt size={150} /> : <Medal kind={medal as 'gold' | 'silver' | 'bronze'} size={58} />}
          <span>{belt ? (f.defense ? 'Pas zostaje u ciebie' : 'Nowy mistrz!') : medal === 'gold' ? 'Złoto!' : medal === 'silver' ? 'Srebro' : 'Brąz'}</span>
          {animate && (belt || medal === 'gold') && <Confetti />}
        </div>
      )}

      {f.moments.length > 0 && (
        <div className="moments">
          {f.moments.map((m, i) => {
            const fresh = animate && (m.round > start || (m.round === 0 && start === 0));
            const at = m.round === 0 ? 0 : t(m.round) + ROUND_MS * 0.5;
            return <MomentView key={i} m={m} anim={fresh} style={fresh ? d(at) : undefined} />;
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
            <Fighter weight={divisionKey(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={96} belt={g.rank === 0 && !f.amateur} />
            <b>{g.profile.lastName}</b>
            <small>{recStr(shownRecord(g, hold))}</small>
          </div>
          <span className="fi-word">VS</span>
          <div className="fi-side opp">
            <Fighter weight={o.freak ? undefined : divisionKey(g)} seed={`${o.firstName}${o.lastName}`} corner="red" size={96} mirror />
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
          <Fighter weight={divisionKey(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={size} belt={belt} />
        </div>
        <div className="vh-plate">
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
          <Fighter weight={opp.freak ? undefined : divisionKey(g)} seed={`${opp.firstName}${opp.lastName}`} corner="red" size={size} mirror />
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

/** Plakat gali zawodowej: nazwa, miasto, hala i cała karta walk. */
function GalaPoster({ g, f, n, total, onGo, paused }: { g: GameState; f: FightReport; n: number; total: number; onGo: () => void; paused: boolean }) {
  const goRef = useGoKeys(onGo);
  const p = f.poster;
  const mineIdx = p ? p.bouts.findIndex((b) => b.tag && b.a === g.profile.lastName && b.b === f.opp.lastName) : -1;
  const spotLabel = f.title ? (f.defense ? 'obrona pasa' : 'walka o pas') : SPOT[f.spot ?? 'wstępna'];
  return (
    <div className="fight-intro poster-modal" role="dialog" aria-modal="true" aria-label={`Gala ${f.gala}`}>
      <div className={`poster ${f.title ? 'title-bout' : ''} ${f.freak ? 'freak' : ''}`}>
        <div className="pst-head">
          <div className="pst-brand">
            <Emblem spec={crestFor(f.fed)} size={30} title={f.fed} />
            <small>{galaPrefix(f.fed)} przedstawia</small>
          </div>
          <h2>{f.gala}</h2>
          {p && (
            <span className="pst-place">
              <Icon name="pin" size={13} />
              {p.city} · {p.venue} · sobota, 20:00
            </span>
          )}
        </div>
        <VsHero g={g} opp={f.opp} label={spotLabel} belt={g.rank === 0} size={78} />
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
  return (
    <div className="fight-intro poster-modal" role="dialog" aria-modal="true" aria-label={t?.name ?? 'Turniej'}>
      <div className={`poster amateur ${t?.championship ? 'title-bout' : ''}`}>
        <div className="pst-head">
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
        <VsHero g={g} opp={f.opp} label={f.stage ? STAGE_LABELS[f.stage].toLowerCase() : ''} size={78} />
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
        <blockquote className="press-quote">
          <Icon name="megaphone" size={14} />
          <span>
            „{o.pressQuote}”<small> {o.opp.lastName}</small>
          </span>
        </blockquote>
        <div className="choice-list press-opts">
          {PRESS_OPTIONS.map((p) => (
            <button
              key={p.key}
              className={`choice press-opt press-${p.key}`}
              onClick={() => {
                sfxClick();
                setGame(pressAnswer(g, p.key));
              }}
            >
              <span className="title">{p.label}</span>
              <span className="desc">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
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
  const head = o.tuneup ? 'Walka na odbudowę' : o.title ? (o.defense ? 'Obrona pasa' : 'Walka o pas') : `Oferta walki ${n} z ${Math.max(n, total)}`;
  const spot = o.spot ? SPOT[o.spot] : '';
  return (
    <div className="fight-intro offer-modal" role="dialog" aria-modal="true" aria-label={head}>
      <div className={`fi-card ${o.title ? 'title-bout' : ''} ${o.tuneup ? 'tuneup' : ''} ${asking ? 'asking' : ''} ${fx ? `fx-${fx.kind}` : ''}`}>
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
          {o.rival && (
            <span className="tag red">
              <Icon name="flame" size={12} />
              odwieczny rywal
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
          {o.tuneup && (
            <>
              <span className="tag">
                {opp.flag} {opp.country}, {opp.age} lat
              </span>
              <span className="tag red">bilans {recStr(opp.record)}</span>
            </>
          )}
        </div>
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
        <CoachTip id="offer">Na zawodowstwie każda walka to oferta. Przyjmij ją, spróbuj wynegocjować więcej albo odrzuć i poczekaj na lepszą.</CoachTip>
        <div className="ofr-actions">
          <button ref={goRef} className="btn btn-primary btn-block btn-ico" disabled={!!asking} onClick={() => setGame(acceptOffer(g, prep))}>
            <Icon name="glove" />
            {o.tuneup ? 'Biorę tę walkę' : 'Przyjmuję walkę'}
          </button>
          {o.tuneup ? (
            <button className="btn btn-ghost btn-block btn-ico" disabled={!!asking} onClick={() => call('decline', declineOffer)}>
              <Icon name="x" size={15} />
              {asking === 'decline' ? 'Odmawiasz…' : 'Wolę walkę w federacji'}
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
                'Po negocjacjach'
              ) : (
                `Chcę więcej · ${chanceWord(neg)}`
              )}
            </button>
            <button className="btn btn-ghost btn-small btn-ico" disabled={!!blocked || !!asking} title={blocked ?? undefined} onClick={() => call('decline', declineOffer)}>
              <Icon name="x" size={15} />
              {asking === 'decline' ? 'Odrzucasz…' : 'Odrzucam'}
            </button>
          </div>
          )}
          {total - n > 0 && !o.tuneup && (
            <button className="link-btn ofr-auto" disabled={!!asking} onClick={() => setGame(acceptAllOffers(g, prep))}>
              Przyjmuj też kolejne oferty w tym roku
            </button>
          )}
          <p className="faint small ofr-help">{o.tuneup ? 'Odmowa nic nie kosztuje: federacja da ci zwykłego rywala.' : blocked ?? 'Po odmowie przyjdzie inna oferta albo nic. Grymaszenie psuje opinię u promotorów.'}</p>
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

  useEffect(() => {
    if (introIdx === null || paused || !animate) return;
    const t = setTimeout(() => setIntroIdx(null), introKind === 'fight' ? INTRO_MS : POSTER_MS);
    return () => clearTimeout(t);
  }, [introIdx, paused, introKind, animate]);

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


  const advance = () => {
    setPaused(false);
    setGame(seasonNext(gameRef.current));
  };

  // pierwsza walka i kolejne: po wyniku chwila przerwy (albo przycisk „Następna walka”)
  useEffect(() => {
    if (spinning || run.done || waiting || introOpen || run.offer || run.press) return;
    if (last && !last.sim.finished) return;
    if (paused && anim) return;
    const delay = !animate ? 0 : fast ? 260 : !last ? 1600 : revealMs + NEXT_MS;
    const t = setTimeout(advance, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, run.done, waiting, introOpen, last?.idx, finishedNow, fast, animate, paused, !!run.offer, !!run.press]);

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
        {fightsShown.map((f, i) =>
          i === run.fights.length - 1 ? (
            <LiveCard key={f.idx} g={g} f={f} start={start} animate={anim} setGame={setGame} />
          ) : (
            <FightRow key={f.idx} f={f} open={openIdx.has(i)} onToggle={() => toggle(i)} />
          ),
        )}
        {introOpen && last && (
          <div className="upcoming next-up">
            <span className="res-badge sm X">
              <Icon name="glove" size={14} />
            </span>
            {last.amateur && last.stage ? STAGE_LABELS[last.stage] : `Walka ${run.fights.length}`} · {last.opp.firstName} {last.opp.lastName}
          </div>
        )}
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

      {!run.done && !waiting && !introOpen && !run.offer && !run.press && (
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

      {run.done && (
        <div className="cta-bar float" style={d(anim ? revealMs : 0)}>
          <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(toSummary(g))}>
            <Icon name="chart" />
            Podsumowanie roku
          </button>
        </div>
      )}

      {run.press && !run.done && createPortal(<PressCard g={g} o={run.press} setGame={setGame} />, document.body)}
      {run.offer && !run.done && createPortal(<OfferCard key={run.fights.length} g={g} o={run.offer} n={run.fights.length + 1} total={run.planned} setGame={setGame} />, document.body)}
      {introOpen &&
        last &&
        createPortal(
          introKind === 'gala' ? (
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
