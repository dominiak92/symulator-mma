import { useEffect, useState } from 'react';
import type { StatKey } from '../../engine/types';
import { STAT_KEYS, STAT_LABELS, STAT_TRAINING_DESC } from '../../engine/data';
import { CAMPS, campBlocked, campCost, campGain, clubLimits, doTraining, EXPEDITIONS, expeditionBlocked, expeditionCost, goExpedition, introText, rehabCost, rehabYear, trainingForecast, type Expedition } from '../../engine/game';
import type { GameState } from '../../engine/types';
import { money } from '../../format';
import type { StepProps } from '../Game';
import { lat } from '../../format';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';

export default function Training({ game, setGame }: StepProps) {
  const [pick, setPick] = useState<StatKey | null>(null);
  const [campId, setCampId] = useState<string | null>(null);
  const g = game;
  const showCamps = g.tier >= 2;
  const campLock = campBlocked(g);
  const camp = !campLock ? CAMPS.find((c) => c.id === campId) ?? null : null;
  const exps = EXPEDITIONS.filter((e) => (e.id === 'dagestan' ? !g.flags.dagestan : !g.flags[`exp_${e.id}`]));
  const showExp = g.tier >= 1 && exps.length > 0;
  const expOpen = exps.filter((e) => !expeditionBlocked(g, e)).length;
  const [tab, setTab] = useState<'season' | 'exp'>('season');
  const first = g.season === 1;
  const last = g.seasons[g.seasons.length - 1];

  // po wyborze przewiń do przycisku na telefonie
  useEffect(() => {
    if (!pick || window.innerWidth > 640) return;
    document.querySelector('.cta-bar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [pick]);

  if (g.injury?.out) {
    return (
      <section className="step">
        <div className="kicker pt-ico">
          <Icon name="bandage" size={14} />
          Rehabilitacja
        </div>
        <h2>Ten rok spędzasz u fizjoterapeuty</h2>
        <div className="rehab-card">
          <Icon name="bandage" size={28} />
          <div>
            <b>{g.injury.name}</b>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              Lekarze nie dają zgody na walki przez cały rok. Umiejętności trochę spadną, ale organizm odpocznie (zużycie spadnie).
              {g.tier > 0 ? ' Z rankingu wypadniesz.' : ''}
            </p>
          </div>
        </div>
        <div className="ledger" style={{ marginTop: 12 }}>
          <div className="ledger-row">
            <span>Rehabilitacja i życie</span>
            <span className="amt minus">{money(-rehabCost(g))}</span>
          </div>
          <div className="ledger-row total">
            <span>Zostanie na koncie</span>
            <span className={`amt ${g.money - rehabCost(g) >= 0 ? 'plus' : 'minus'}`}>{money(g.money - rehabCost(g))}</span>
          </div>
        </div>
        <div className="cta-bar">
          <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(rehabYear(g))}>
            <Icon name="bandage" />
            Zaczynam rehabilitację
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="step">
      {first ? (
        <p className="lead intro">{introText(g)}</p>
      ) : (
        last && (
          <p className="muted small">
            Poprzedni rok: {last.grade.toLowerCase()}, bilans {last.w}-{last.l}
            {last.d ? `-${last.d}` : ''}. Masz {lat(g.age)}.
          </p>
        )
      )}
      {showExp && (
        <div className="train-tabs" role="tablist" aria-label="Rodzaj przygotowań">
          <button role="tab" aria-selected={tab === 'season'} className={tab === 'season' ? 'on' : ''} onClick={() => setTab('season')}>
            <Icon name="dumbbell" size={15} />
            Obóz
          </button>
          <button role="tab" aria-selected={tab === 'exp'} className={tab === 'exp' ? 'on' : ''} onClick={() => setTab('exp')}>
            <Icon name="pin" size={15} />
            Wyjazdy na lata
            {expOpen > 0 && <span className="tt-count">{expOpen}</span>}
          </button>
        </div>
      )}
      {tab === 'exp' && showExp ? (
        <ExpeditionTab g={g} exps={exps} setGame={setGame} />
      ) : (
        <>
      <div className="kicker pt-ico" style={{ marginTop: first ? 16 : 8 }}>
        <Icon name="dumbbell" size={14} />
        Okres przygotowawczy
      </div>
      <h2>Co trenujesz na obozie?</h2>
      <p className="muted small" style={{ marginTop: 4 }}>
        Wybrana umiejętność urośnie najbardziej.{g.age >= 31 ? ' Po trzydziestce organizm bierze już mniej.' : ''}
      </p>
      <CoachTip id="training">
        Wybierz umiejętność na obóz. Zielona liczba to wynik po nim. Na belce u góry masz <b>OVR</b> (ogólną siłę), budżet, rekord i wiek. Dotknij ich, żeby zobaczyć szczegóły.
      </CoachTip>
      {clubLimits(g) && <div className="warn">{g.club.name} niewiele cię już nauczy. Lepszy klub wybierzesz na rynku na koniec roku.</div>}
      <div className="choice-list train-list" style={{ marginTop: 12 }} role="radiogroup" aria-label="Trening">
        {STAT_KEYS.map((k) => {
          const now = g.stats[k];
          const to = trainingForecast(g, k, true, camp);
          const base = trainingForecast(g, k, false, camp);
          const on = pick === k;
          return (
            <button key={k} className="choice train-opt" role="radio" aria-checked={on} onClick={() => setPick(k)}>
              <span className="opt-top">
                <span className="opt-label">
                  <span className="stat-ico">
                    <Icon name={STAT_ICON[k]} size={17} />
                  </span>
                  {STAT_LABELS[k]}
                  {k === g.club.specialty && (
                    <span className="tag blue">
                      <Icon name="home" size={12} />
                      klub
                    </span>
                  )}
                </span>
                <span className="train-nums">
                  <span className="cur">{now}</span>
                  <span className="arrow">→</span>
                  <span className="to">{on ? to : base}</span>
                </span>
              </span>
              <span className="train-bar" aria-hidden="true">
                <i className="now" style={{ width: `${now}%` }} />
                <i className="gain" style={{ left: `${now}%`, width: `${Math.max(0, (on ? to : base) - now)}%` }} />
              </span>
              <span className="desc">{STAT_TRAINING_DESC[k]}</span>
            </button>
          );
        })}
      </div>
      {showCamps && (
        <section className="camps">
          <div className="camps-head">
            <Icon name="pin" size={15} />
            <b>Obóz za granicą</b>
            <span className="faint small">{campLock ? '' : `${money(campCost(g))}, opcjonalnie`}</span>
          </div>
          {campLock ? (
            <p className="muted small" style={{ margin: 0 }}>
              {campLock}
            </p>
          ) : (
            <div className="camp-list" role="radiogroup" aria-label="Obóz za granicą">
              {CAMPS.map((c) => {
                const on = campId === c.id;
                const gm = campGain(g, c, c.main);
                const gs = campGain(g, c, c.second);
                return (
                  <button key={c.id} className="choice camp-opt" role="radio" aria-checked={on} onClick={() => setCampId(on ? null : c.id)}>
                    <span className="camp-name">{c.name}</span>
                    <span className="camp-gain">
                      <span className={gm ? '' : 'faint'}>
                        <Icon name={STAT_ICON[c.main]} size={12} />+{gm}
                      </span>
                      <span className={gs ? '' : 'faint'}>
                        <Icon name={STAT_ICON[c.second]} size={12} />+{gs}
                      </span>
                    </span>
                    <span className="desc">{c.desc}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}
      <div className="cta-bar">
        <button className="btn btn-primary btn-block btn-ico" disabled={!pick} onClick={() => pick && setGame(doTraining(g, pick, camp?.id))}>
          {pick && <Icon name={STAT_ICON[pick]} />}
          {pick ? `Trenuję: ${STAT_LABELS[pick].toLowerCase()}${camp ? ` · ${camp.name}` : ''}` : 'Wybierz, co trenujesz'}
        </button>
      </div>
        </>
      )}
    </section>
  );
}

function ExpeditionCard({ g, e, setGame }: { g: GameState; e: Expedition; setGame: StepProps['setGame'] }) {
  const [confirm, setConfirm] = useState(false);
  const lock = expeditionBlocked(g, e);
  const cost = expeditionCost(g, e);
  const m = g.age >= 28 ? 0.7 : 1;
  const gains = (Object.keys(e.gains) as StatKey[]).sort((a, b) => e.gains[b][1] - e.gains[a][1]).slice(0, 4);
  const rng = (k: StatKey) => `+${Math.round(e.gains[k][0] * m)}–${Math.round(e.gains[k][1] * m)}`;
  const seasons = e.years === 1 ? '1 rok' : `${e.years} lata`;
  return (
    <article className={`exp-card exp-${e.id}${lock ? ' locked' : ''}`}>
      <header className="exp-head">
        <span className="exp-ico">
          <Icon name="pin" size={18} />
        </span>
        <div className="exp-title">
          <b>{e.name}</b>
          <small>{e.place}</small>
        </div>
        <span className="exp-years">{seasons}</span>
      </header>
      <p className="exp-desc">{e.desc}</p>
      <div className="exp-gains">
        {gains.map((k) => (
          <span key={k} className="exp-gain">
            <Icon name={STAT_ICON[k]} size={13} />
            <span>{STAT_LABELS[k]}</span>
            <b>{rng(k)}</b>
          </span>
        ))}
      </div>
      <p className="exp-plus">
        <Icon name="trend" size={13} />
        <span>
          Podnosi limit talentu:{' '}
          {(Object.keys(e.ceiling) as StatKey[])
            .map((k) => STAT_LABELS[k].toLowerCase())
            .join(', ')}
          .
        </span>
      </p>
      <p className="exp-minus">
        <Icon name="x" size={13} />
        <span>
          {e.minus} Wracasz w wieku {g.age + e.years} lat.
        </span>
      </p>
      <footer className="exp-foot">
        {lock ? (
          <span className="exp-lock">{lock}</span>
        ) : confirm ? (
          <>
            <span className="exp-q">Na pewno? {money(cost)} i {seasons} bez walk.</span>
            <button className="btn btn-small btn-ghost" onClick={() => setConfirm(false)}>
              Zostaję
            </button>
            <button className="btn btn-small btn-gold btn-ico" onClick={() => setGame(goExpedition(g, e.id))}>
              <Icon name="check" size={15} />
              Jadę
            </button>
          </>
        ) : (
          <>
            <span className="exp-cost">
              <Icon name="coins" size={14} />
              {money(cost)}
            </span>
            <button className="btn btn-small btn-ghost btn-ico" onClick={() => setConfirm(true)}>
              <Icon name="pin" size={15} />
              Wyjeżdżam
            </button>
          </>
        )}
      </footer>
    </article>
  );
}

function ExpeditionTab({ g, exps, setGame }: { g: GameState; exps: Expedition[]; setGame: StepProps['setGame'] }) {
  return (
    <div className="exp-tab">
      <div className="kicker pt-ico" style={{ marginTop: 8 }}>
        <Icon name="pin" size={14} />
        Zamiast walk
      </div>
      <h2>Wyjazd na lata</h2>
      <p className="muted small" style={{ marginTop: 4 }}>
        Kilka lat samego treningu za granicą. Wracasz dużo mocniejszy i w życiowej formie na pierwszy rok, ale starszy, niżej w rankingu i bez kontraktu. Każdy wyjazd raz na karierę.
      </p>
      <div className="exp-list">
        {exps.map((e) => (
          <ExpeditionCard key={e.id} g={g} e={e} setGame={setGame} />
        ))}
      </div>
    </div>
  );
}
