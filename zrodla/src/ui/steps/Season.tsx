import { useEffect, useRef, useState } from 'react';
import type { CardSpot, DecisionOption, FightReport, GameState, Moment } from '../../engine/types';
import { SEASON_FORMS, STAGE_LABELS, STAT_LABELS, STYLE_LABELS } from '../../engine/data';
import { decide, recStr, seasonNext, seasonSkip, toSummary } from '../../engine/game';
import { OUTCOME_LABEL } from '../../engine/fight';
import { money } from '../../format';
import { loadSettings } from '../../storage';
import type { StepProps } from '../Game';
import { GG } from '../brand';
import { Dist } from './EventStep';
import { MethodText, Segs } from '../Sheets';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const SPOT: Record<CardSpot, string> = { wstępna: 'karta wstępna', główna: 'karta główna', wieczoru: 'main event' };

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
    <div className="form-reel">
      <small>Forma w tym sezonie</small>
      <div className="form-reel-row">
        <div className="reel" aria-live="polite">
          <span className={`tone-${tone}`}>{label}</span>
        </div>
        {!spinning && (
          <span className={`form-mod ${form.mod > 0 ? 'good' : form.mod < 0 ? 'bad' : ''}`}>
            {form.mod === 0 ? 'bez wpływu na szanse' : `${form.mod > 0 ? '+' : '−'}${Math.abs(form.mod)} pkt do każdej szansy`}
          </span>
        )}
      </div>
    </div>
  );
}

function MomentView({ m }: { m: Moment }) {
  return (
    <div className={`moment ${m.tone}`}>
      <div className="mt">
        <span className="mt-title">
          {m.brand && GG[m.brand as keyof typeof GG] && <img className="moment-brand" src={GG[m.brand as keyof typeof GG]} alt="" />}
          {m.title}
        </span>
        {m.round > 0 ? <span className="faint mt-round">runda {m.round}</span> : null}
      </div>
      <p>{m.text}</p>
      {m.stat && m.outcome && (
        <div className="test">
          <span className={`tag ${m.outcome === 'fail' ? 'bad' : m.outcome === 'super' ? 'gold' : 'good'}`}>{OUTCOME_LABEL[m.outcome]}</span>
          <span className="faint">
            {STAT_LABELS[m.stat]}
            {m.chance !== undefined ? `, szansa ${m.chance}%` : ''}
          </span>
          {m.effect && <span className="faint">· {m.effect}</span>}
        </div>
      )}
    </div>
  );
}

function rankLabel(r: number | null) {
  if (r === 0) return 'mistrz';
  if (r === null) return 'poza rankingiem';
  return `#${r}`;
}

function contextLine(f: FightReport) {
  if (f.amateur) return `${f.stage ? STAGE_LABELS[f.stage] : 'Turniej'} · ${(f.tourney ?? '').split(' · ')[0].replace(' MMA', '')}`;
  return `${f.gala ?? f.fed}${f.spot ? ` · ${SPOT[f.spot]}` : ''}`;
}

function OptionButton({ o, onPick }: { o: DecisionOption; onPick: () => void }) {
  return (
    <button className={`choice opt opt-${o.kind ?? 'normal'}`} onClick={onPick}>
      <span className="opt-top">
        <span className="opt-label">
          {o.label}
          {o.kind === 'safe' && <span className="tag blue">bezpiecznie</span>}
          {o.kind === 'risk' && <span className="tag red">ryzyko</span>}
        </span>
        <span className="chance-big">{o.chance}%</span>
      </span>
      <span className="desc">{o.desc}</span>
      <span className="opt-out">
        <span className="ok">✓ {o.win}</span>
        <span className="ko">✗ {o.lose}</span>
      </span>
      <Dist dist={o.dist} stat={STAT_LABELS[o.stat]} />
    </button>
  );
}

function FightCard({ g, f, open, onToggle, setGame }: { g: GameState; f: FightReport; open: boolean; onToggle: () => void; setGame: (s: GameState) => void }) {
  const pending = f.sim.pending;
  const done = f.sim.finished;
  const opp = f.opp;
  const res = done ? (f.result ?? 'X') : 'live';
  const showMoments = open || !!pending;
  const rankMove =
    !f.amateur && !f.freak && done && f.result && f.rankAfter !== f.rankBefore
      ? f.rankAfter === 0
        ? 'nowy mistrz!'
        : f.rankBefore === null
          ? `wchodzisz do rankingu: #${f.rankAfter}`
          : f.rankAfter === null
            ? 'wypadasz z rankingu'
            : `ranking: #${f.rankBefore} → #${f.rankAfter}`
      : null;

  return (
    <article className={`fight ${pending ? 'pending' : ''} ${f.title ? 'title-bout' : ''} reveal`}>
      <button className="fight-sum" onClick={onToggle} aria-expanded={showMoments} disabled={!!pending}>
        <span className={`res-badge ${res}`}>{res === 'live' ? '' : res === 'W' ? 'W' : res === 'L' ? 'P' : res === 'D' ? 'R' : '–'}</span>
        <span className="fight-main">
          <span className="fight-ctx">
            <span>
              <Segs parts={contextLine(f).split(' · ')} />
            </span>
            {f.title && <span className="tag gold">{f.defense ? 'obrona pasa' : 'walka o pas'}</span>}
            {f.peer && <span className="tag blue">z rocznika</span>}
            {f.bonus && <span className="tag gold">bonus</span>}
          </span>
          <span className="fight-opp">
            {opp.flag} {opp.nickname ? `„${opp.nickname}” ` : ''}
            {opp.firstName} {opp.lastName}
          </span>
          <span className="fight-meta">
            {opp.freak ? opp.freak : `${recStr(opp.record)} · ${STYLE_LABELS[opp.style].toLowerCase()}${!f.amateur && opp.rank !== null ? ` · ${rankLabel(opp.rank)}` : ''}`}
          </span>
          <span className={`fight-how ${f.result ?? ''}`}>
            {!done
              ? 'walka trwa…'
              : f.method === 'Walkower'
                ? f.amateur
                  ? 'walkower, przechodzisz dalej'
                  : 'walka odwołana'
                : (
                    <>
                      <MethodText lead={f.result === 'W' ? 'Wygrana' : f.result === 'L' ? 'Porażka' : 'Remis'} h={{ method: f.method!, round: f.round, time: f.time, detail: f.detail }} />
                    </>
                  )}
          </span>
          {done && (f.earned > 0 || rankMove) && (
            <span className="fight-foot">
              {f.earned > 0 && <span className="earned">+{money(f.earned)}</span>}
              {rankMove && <span>{rankMove}</span>}
            </span>
          )}
        </span>
        <span className="fight-side">
          {!pending && f.moments.length > 0 && <span className="chev" aria-hidden="true">{showMoments ? '−' : '+'}</span>}
        </span>
      </button>
      {showMoments && f.moments.length > 0 && (
        <div className="moments">
          {f.moments.map((m, i) => (
            <MomentView key={i} m={m} />
          ))}
        </div>
      )}
      {pending && (
        <div className="decision">
          <div className="decision-head">
            <span className="tag gold">Twoja decyzja</span>
            <span className="faint">przed rundą {pending.round}</span>
          </div>
          <h3>{pending.title}</h3>
          <p className="decision-text">{pending.text}</p>
          {g.history.length < 4 && (
            <p className="hint">
              Procent to szansa, że się uda. Zależy od twoich umiejętności, rywala i formy. Bezpieczny wybór wchodzi częściej, ale daje mniej.
            </p>
          )}
          <div className="choice-list">
            {pending.options.map((o) => (
              <OptionButton key={o.key} o={o} onPick={() => setGame(decide(g, o.key))} />
            ))}
          </div>
        </div>
      )}
    </article>
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
  const endRef = useRef<HTMLDivElement>(null);

  const last = run.fights[run.fights.length - 1];
  const waiting = !!last?.sim.pending;

  useEffect(() => {
    if (!spinning) return;
    const t = setTimeout(() => setSpinning(false), 1300);
    return () => clearTimeout(t);
  }, [spinning]);

  useEffect(() => {
    if (spinning || run.done || waiting) return;
    const delay = !animate ? 0 : fast ? 250 : run.fights.length === 0 ? 500 : 1300;
    const t = setTimeout(() => setGame(seasonNext(gameRef.current)), delay);
    return () => clearTimeout(t);
  }, [spinning, run.done, waiting, run.fights.length, fast, animate, setGame]);

  // przewiń do decyzji albo przycisku końca sezonu
  useEffect(() => {
    if (!(waiting || run.done) || !endRef.current) return;
    const el = waiting ? document.querySelector('.decision') : endRef.current;
    el?.scrollIntoView({ behavior: animate ? 'smooth' : 'auto', block: waiting ? 'start' : 'end' });
  }, [waiting, run.done, animate]);

  const toggle = (i: number) =>
    setOpenIdx((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const w = run.fights.filter((f) => f.result === 'W').length;
  const l = run.fights.filter((f) => f.result === 'L').length;
  const d = run.fights.filter((f) => f.result === 'D').length;
  const amateur = !!run.tourneys;

  // co jeszcze przed nami
  const upcoming: string[] = [];
  if (!run.done) {
    if (amateur) {
      const ts = run.tourneys!;
      for (let i = run.tIdx ?? 0; i < ts.length; i++) {
        const t = ts[i];
        if (!t.stage) continue;
        if (i === (run.tIdx ?? 0) && last && !last.sim.finished) continue;
        upcoming.push(`${STAGE_LABELS[t.stage]} · ${t.name}, ${t.city}`);
      }
    } else {
      const left = Math.max(0, run.planned - run.fights.length);
      for (let i = 0; i < left; i++) upcoming.push(`Walka ${run.fights.length + i + 1} · rywal jeszcze nieznany`);
    }
  }

  return (
    <section className="step">
      <div className="step-head">
        <div>
          <h2>Sezon {g.season}</h2>
          <p className="muted">
            {amateur ? 'Turnieje amatorskie' : g.contract.kind === 'freak' ? g.contract.fed : g.fed} · bilans {w}-{l}
            {d ? `-${d}` : ''}
          </p>
        </div>
        {!run.done && !waiting && (
          <div className="row">
            <button className="btn btn-ghost btn-small" onClick={() => setFast((x) => !x)} aria-pressed={fast}>
              {fast ? 'Wolniej' : 'Szybciej'}
            </button>
            <button
              className="btn btn-ghost btn-small"
              onClick={() => {
                setSpinning(false);
                setGame(seasonSkip(gameRef.current));
              }}
            >
              Pomiń
            </button>
          </div>
        )}
      </div>

      <FormReel g={g} spinning={spinning} />
      {run.intro.length > 0 && (
        <div className="intro-notes">
          {run.intro.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      )}

      <div className="fight-list">
        {run.fights.map((f, i) => (
          <FightCard
            key={i}
            g={g}
            f={f}
            open={i === run.fights.length - 1 ? !openIdx.has(i) : openIdx.has(i)}
            onToggle={() => toggle(i)}
            setGame={setGame}
          />
        ))}
        {upcoming.map((u, i) => (
          <div className="upcoming" key={`u${i}`}>
            {u}
          </div>
        ))}
      </div>

      <div ref={endRef} />
      {run.done && (
        <div className="cta-bar">
          <button className="btn btn-primary btn-block" onClick={() => setGame(toSummary(g))}>
            Podsumowanie sezonu
          </button>
        </div>
      )}
    </section>
  );
}
