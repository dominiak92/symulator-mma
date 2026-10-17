import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { CardSpot, DecisionOption, DecisionPoint, FightOffer, FightReport, GameState, Moment } from '../../engine/types';
import { galaPrefix, SEASON_FORMS, STAGE_LABELS, STAT_LABELS, STYLE_LABELS } from '../../engine/data';
import { acceptAllOffers, acceptOffer, declineBlocked, declineOffer, decide, mainRecord, negotiateChance, negotiateOffer, recStr, seasonNext, seasonSkip, toSummary } from '../../engine/game';
import { activeManager, currentManager } from '../../engine/managers';
import { OUTCOME_LABEL } from '../../engine/fight';
import { money } from '../../format';
import { loadSettings } from '../../storage';
import type { StepProps } from '../Game';
import { GG } from '../brand';
import { Belt, Confetti, Fighter, Medal } from '../Art';
import { clubCrest } from '../Emblem';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Ile trwa „rozegranie” jednej rundy w animacji (ms). */
export const ROUND_MS = 480;

const SPOT: Record<CardSpot, string> = { wstępna: 'karta wstępna', główna: 'karta główna', wieczoru: 'main event' };

const d = (ms: number): CSSProperties => ({ ['--d' as string]: `${Math.max(0, ms)}ms` });

function FormReel({ g, spinning }: { g: GameState; spinning: boolean }) {
  const form = g.run!.form;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!spinning) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SEASON_FORMS.length), 90);
    return () => clearInterval(id);
  }, [spinning]);
  const label = spinning ? SEASON_FORMS[idx].label : form.label;
  const tone = spinning ? 'neutral' : form.tone;
  return (
    <div className="form-strip">
      <Icon name="flame" size={15} className={`tone-${tone}`} />
      <small>Forma</small>
      <span className={`form-val tone-${tone} ${spinning ? 'spin' : 'lock'}`} aria-live="polite">
        {label}
      </span>
      {!spinning && form.mod !== 0 && (
        <span className={`form-mod ${form.mod > 0 ? 'good' : 'bad'}`}>
          {form.mod > 0 ? '+' : '−'}
          {Math.abs(form.mod)} pkt
        </span>
      )}
    </div>
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

/** Szansa słowami zamiast procentu (procent zostaje w podpowiedzi). */
function chanceWord(p: number) {
  return p >= 72 ? 'prawie pewne' : p >= 56 ? 'raczej wyjdzie' : p >= 42 ? 'pół na pół' : p >= 28 ? 'ryzykowne' : 'rzut na taśmę';
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
        <span className="tag gold">
          <Icon name="target" size={13} />
          Twoja decyzja
        </span>
        <span className="faint">przed rundą {pending.round}</span>
      </div>
      <h3>{pending.title}</h3>
      <p className="decision-text">{pending.text}</p>
      {pending.status && <FightStatus st={pending.status} />}
      <CoachTip id="decision">Prowadzisz? Graj spokojnie. Przegrywasz albo rywal słabnie? Zaryzykuj. Obity? Odpocznij.</CoachTip>
      <div className="choice-list">
        {pending.options.map((o) => (
          <OptionButton key={o.key} o={o} onPick={() => setGame(decide(g, o.key))} />
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
          {f.peer && (
            <span className="tag blue">
              <Icon name="users" size={12} />
              rocznik
            </span>
          )}
        </span>
      </div>

      <div className="vs">
        <div className={`vs-side me ${done && f.result === 'L' && finish ? 'ko' : ''} ${done && won ? 'win' : ''}`} style={d(stampAt)}>
          <Fighter seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={myShorts} size={84} belt={g.rank === 0 && !f.amateur} hurt={done && f.result === 'L' && finish} />
          <b>{g.profile.lastName}</b>
          <small>{recStr(mainRecord(g))}</small>
        </div>
        <div className="vs-mid">
          <span className="vs-word">VS</span>
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
        <div className={`vs-side opp ${done && won && finish ? 'ko' : ''} ${done && f.result === 'L' ? 'win' : ''}`} style={d(stampAt)}>
          <Fighter seed={`${f.opp.firstName}${f.opp.lastName}`} corner="red" size={84} mirror hurt={done && won && finish} />
          <b>{f.opp.lastName}</b>
          <small>
            {f.opp.flag} {f.opp.freak ? f.opp.freak : `${recStr(f.opp.record)} · ${STYLE_LABELS[f.opp.style].toLowerCase()}`}
            {!f.amateur && !f.opp.freak && rankLabel(f.opp.rank) ? ` · ${rankLabel(f.opp.rank)}` : ''}
          </small>
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
            <Fighter seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={96} belt={g.rank === 0 && !f.amateur} />
            <b>{g.profile.lastName}</b>
            <small>{recStr(mainRecord(g))}</small>
          </div>
          <span className="fi-word">VS</span>
          <div className="fi-side opp">
            <Fighter seed={`${o.firstName}${o.lastName}`} corner="red" size={96} mirror />
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

/** Plakat gali zawodowej: nazwa, miasto, hala i cała karta walk. */
function GalaPoster({ g, f, n, total, onGo, paused }: { g: GameState; f: FightReport; n: number; total: number; onGo: () => void; paused: boolean }) {
  const goRef = useGoKeys(onGo);
  const p = f.poster;
  const mineIdx = p ? p.bouts.findIndex((b) => b.tag && b.a === g.profile.lastName && b.b === f.opp.lastName) : -1;
  return (
    <div className="fight-intro poster-modal" role="dialog" aria-modal="true" aria-label={`Gala ${f.gala}`}>
      <div className={`poster ${f.title ? 'title-bout' : ''} ${f.freak ? 'freak' : ''}`}>
        <div className="pst-head">
          <small>{galaPrefix(f.fed)} przedstawia</small>
          <h2>{f.gala}</h2>
          {p && (
            <span className="pst-place">
              <Icon name="pin" size={13} />
              {p.city} · {p.venue}
            </span>
          )}
        </div>
        <div className="pst-vs">
          <div className="fi-side me">
            <Fighter seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={70} belt={g.rank === 0} />
            <b>{g.profile.lastName}</b>
          </div>
          <div className="pst-mid">
            <span className="fi-word">VS</span>
            <small>{f.title ? (f.defense ? 'obrona pasa' : 'walka o pas') : SPOT[f.spot ?? 'wstępna']}</small>
          </div>
          <div className="fi-side opp">
            <Fighter seed={`${f.opp.firstName}${f.opp.lastName}`} corner="red" size={70} mirror />
            <b>{f.opp.lastName}</b>
          </div>
        </div>
        {p && (
          <ol className="pst-card" aria-label="Karta walk">
            {p.bouts.map((b, i) => (
              <li key={i} className={i === mineIdx ? 'me' : ''}>
                <span className="pst-tag">{b.tag}</span>
                <span className="pst-bout">
                  <b>{b.a}</b>
                  <small>{b.ar}</small>
                  <i>vs</i>
                  <b>{b.b}</b>
                  <small>{b.br}</small>
                </span>
              </li>
            ))}
          </ol>
        )}
        <div className="pst-foot faint small">
          Twoja walka {n} z {Math.max(n, total)} w sezonie
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
        <div className="pst-vs">
          <div className="fi-side me">
            <Fighter seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={70} />
            <b>{g.profile.lastName}</b>
          </div>
          <div className="pst-mid">
            <span className="fi-word">VS</span>
            <small>{f.stage ? STAGE_LABELS[f.stage].toLowerCase() : ''}</small>
          </div>
          <div className="fi-side opp">
            <Fighter seed={`${f.opp.firstName}${f.opp.lastName}`} corner="red" size={70} mirror />
            <b>{f.opp.lastName}</b>
          </div>
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

/** Oferta walki (zawodowcy): rywal, gaża i decyzja gracza. */
function OfferCard({ g, o, n, total, setGame }: { g: GameState; o: FightOffer; n: number; total: number; setGame: (s: GameState) => void }) {
  const opp = o.opp;
  const goRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    goRef.current?.focus({ preventScroll: true });
  }, [o.opp.id, o.purse]);
  const mgr = currentManager(g);
  const busy = mgr && !activeManager(g);
  const blocked = declineBlocked(g);
  const neg = negotiateChance(g);
  const notes = g.run?.notes ?? [];
  const lastNote = notes[notes.length - 1];
  const head = o.title ? (o.defense ? 'Obrona pasa' : 'Walka o pas') : `Oferta walki ${n} z ${Math.max(n, total)}`;
  const spot = o.spot ? SPOT[o.spot] : '';
  return (
    <div className="fight-intro offer-modal" role="dialog" aria-modal="true" aria-label={head}>
      <div className={`fi-card ${o.title ? 'title-bout' : ''}`}>
        <div className="fi-top">
          <span className="fi-num">{head}</span>
          <span className="fi-ctx">
            {o.gala}
            {spot ? ` · ${spot}` : ''}
          </span>
        </div>
        {lastNote && !o.note && <p className="ofr-note">{lastNote}</p>}
        <div className="fi-vs">
          <div className="fi-side me">
            <Fighter seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={80} belt={g.rank === 0} />
            <b>{g.profile.lastName}</b>
            <small>{recStr(mainRecord(g))}</small>
          </div>
          <span className="fi-word">VS</span>
          <div className="fi-side opp">
            <Fighter seed={`${opp.firstName}${opp.lastName}`} corner="red" size={80} mirror />
            <b>{opp.lastName}</b>
            <small>
              {opp.flag} {opp.freak ? opp.freak : `${recStr(opp.record)} · ${STYLE_LABELS[opp.style].toLowerCase()}`}
            </small>
          </div>
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
          {!opp.freak && opp.rank === null && <span className="tag">poza rankingiem</span>}
        </div>
        <div className="ofr-pay">
          <div>
            <small>Gaża</small>
            <b>{money(o.purse)}</b>
          </div>
          <div>
            <small>Za wygraną</small>
            <b>+{money(o.winBonus)}</b>
          </div>
          {mgr && (
            <div>
              <small>Menedżer</small>
              <b className="neg">−{Math.round(mgr.cut * 100)}%</b>
            </div>
          )}
        </div>
        {busy && <p className="ofr-note">{mgr!.name} w tym sezonie zajmuje się innymi. Ofertę przyniósł organizator.</p>}
        {o.note && <p className="ofr-note strong">{o.note}</p>}
        <p className="fi-scout">
          <Icon name="target" size={14} />
          {opp.freak ? 'Freak fight. Kamery, hałas i cyrk.' : SCOUT[opp.style]}
        </p>
        <div className="ofr-actions">
          <button ref={goRef} className="btn btn-primary btn-block btn-ico" onClick={() => setGame(acceptOffer(g))}>
            <Icon name="glove" />
            Przyjmuję walkę
          </button>
          <div className="ofr-row">
            <button className="btn btn-ghost btn-small btn-ico" disabled={o.negotiated} onClick={() => setGame(negotiateOffer(g))}>
              <Icon name="coins" size={15} />
              {o.negotiated ? 'Po negocjacjach' : `Chcę więcej · ${chanceWord(neg)}`}
            </button>
            <button className="btn btn-ghost btn-small btn-ico" disabled={!!blocked} title={blocked ?? undefined} onClick={() => setGame(declineOffer(g))}>
              <Icon name="x" size={15} />
              Odrzucam
            </button>
          </div>
          {total - n > 0 && (
            <button className="link-btn ofr-auto" onClick={() => setGame(acceptAllOffers(g))}>
              Przyjmuj też kolejne oferty w tym sezonie
            </button>
          )}
          <p className="faint small ofr-help">{blocked ?? 'Po odmowie przyjdzie inna oferta albo nic. Grymaszenie psuje opinię u promotorów.'}</p>
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
  const [spinning, setSpinning] = useState(animate && run.fights.length === 0);
  const [fast, setFast] = useState(false);
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());
  const gameRef = useRef(g);
  gameRef.current = g;

  const last = run.fights[run.fights.length - 1];
  const waiting = !!last?.sim.pending;
  const anim = animate && !fast;

  // gdy gracz sam przewija albo czyta, gra nie przechodzi dalej sama
  // (na starcie pierwszego sezonu czeka, aż gracz przeczyta podpowiedź trenera)
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
    // każde dotknięcie ekranu (poza sterowaniem sezonem, zapowiedzią i decyzją) zatrzymuje automat
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('.play-ctrl, .fight-intro, .decision, .decision-sheet, .sheet, .icon-btn')) return;
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

  useEffect(() => {
    if (!spinning) return;
    const t = setTimeout(() => setSpinning(false), 1100);
    return () => clearTimeout(t);
  }, [spinning]);

  const advance = () => {
    setPaused(false);
    setGame(seasonNext(gameRef.current));
  };

  // pierwsza walka i kolejne: po wyniku chwila przerwy (albo przycisk „Następna walka”)
  useEffect(() => {
    if (spinning || run.done || waiting || introOpen || run.offer) return;
    if (last && !last.sim.finished) return;
    if (paused && anim) return;
    const delay = !animate ? 0 : fast ? 260 : !last ? 400 : revealMs + NEXT_MS;
    const t = setTimeout(advance, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, run.done, waiting, introOpen, last?.idx, finishedNow, fast, animate, paused, !!run.offer]);

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
        <h2>Sezon {g.season}</h2>
        <div className={`rec-pill ${lastRes === 'W' ? 'up' : lastRes === 'L' ? 'down' : ''}`} key={recKey} title="Bilans w tym sezonie">
          <small>Bilans</small>
          <b>
            {w}-{l}
            {dr ? `-${dr}` : ''}
          </b>
          {lastRes === 'W' && <i>▲</i>}
          {lastRes === 'L' && <i>▼</i>}
        </div>
      </div>
      <FormReel g={g} spinning={spinning} />

      <CoachTip id="season">
        Przed każdą walką zobaczysz rywala (na zawodowstwie z ofertą i gażą, którą możesz przyjąć albo odrzucić). Walka toczy się sama, a w ważnym momencie trener zapyta cię o plan. Po walce przejdziesz dalej przyciskiem na dole.
      </CoachTip>
      {run.intro.length > 0 && (
        <details className="intro-notes">
          <summary>{amateur ? 'Plan sezonu: turnieje' : 'Przed sezonem'}</summary>
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

      {!run.done && !waiting && !introOpen && !run.offer && (
        <div className="play-ctrl" role="group" aria-label="Tempo sezonu">
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
            {nextReady && anim ? '' : fast ? 'Szybko' : 'Szybciej'}
          </button>
          <button
            className="icon-pill"
            aria-label="Pomiń do końca sezonu albo do decyzji"
            onClick={() => {
              setSpinning(false);
              setIntroIdx(null);
              setGame(seasonSkip(gameRef.current));
            }}
          >
            <Icon name="skip" size={14} />
            {nextReady && anim ? '' : 'Pomiń'}
          </button>
        </div>
      )}

      {run.done && (
        <div className="cta-bar float" style={d(anim ? revealMs : 0)}>
          <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(toSummary(g))}>
            <Icon name="chart" />
            Podsumowanie sezonu
          </button>
        </div>
      )}

      {run.offer && !run.done && createPortal(<OfferCard g={g} o={run.offer} n={run.fights.length + 1} total={run.planned} setGame={setGame} />, document.body)}
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
