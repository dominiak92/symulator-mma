import { useEffect, useState } from 'react';
import type { StatKey } from '../../engine/types';
import { STAT_KEYS, STAT_LABELS, STAT_TRAINING_DESC } from '../../engine/data';
import { CAMPS, campBlocked, campCost, campGain, clubLimits, DAGESTAN_GAINS, dagestanBlocked, dagestanCost, doTraining, goDagestan, introText, rehabCost, rehabYear, trainingForecast } from '../../engine/game';
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
  const [dagConfirm, setDagConfirm] = useState(false);
  const [dagOpen, setDagOpen] = useState(false);
  const dagLock = dagestanBlocked(g);
  const showDag = g.tier >= 1 && !g.flags.dagestan && g.age <= 30;
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
        <h2>Ten sezon spędzasz u fizjoterapeuty</h2>
        <div className="rehab-card">
          <Icon name="bandage" size={28} />
          <div>
            <b>{g.injury.name}</b>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              Lekarze nie dają zgody na walki przez cały sezon. Umiejętności trochę spadną, ale organizm odpocznie (zużycie spadnie).
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
            Poprzedni sezon: {last.grade.toLowerCase()}, bilans {last.w}-{last.l}
            {last.d ? `-${last.d}` : ''}. Masz {lat(g.age)}.
          </p>
        )
      )}
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
      {clubLimits(g) && <div className="warn">{g.club.name} niewiele cię już nauczy. Lepszy klub wybierzesz na rynku po sezonie.</div>}
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
      {showDag && (
        <section className={`dagestan${dagOpen ? ' open' : ''}${dagLock ? ' locked' : ''}`}>
          <button className="dag-head" aria-expanded={dagOpen} onClick={() => setDagOpen(!dagOpen)}>
            <Icon name="pin" size={15} />
            <b>2-3 years Dagestan and forget</b>
            <span className="dag-teaser">{dagLock ? 'jeszcze nie' : money(dagestanCost(g))}</span>
            <span className="dag-chev" aria-hidden="true">▸</span>
          </button>
          {dagOpen && (
            <>
          <p className="muted small" style={{ margin: 0 }}>
            Trzy sezony w górach zamiast walk. Wracasz o wiele mocniejszy (zwłaszcza zapasy i kondycja), ale starszy o 3 lata, bez rankingu i kontraktu, a kibice o tobie zapominają.
          </p>
          <div className="dag-gains">
            {(Object.keys(DAGESTAN_GAINS) as StatKey[])
              .filter((k) => DAGESTAN_GAINS[k][1] >= 4)
              .map((k) => (
                <span key={k} className="tag good">
                  <Icon name={STAT_ICON[k]} size={12} />
                  {STAT_LABELS[k]} +{DAGESTAN_GAINS[k][0]}–{DAGESTAN_GAINS[k][1]}
                </span>
              ))}
          </div>
          {dagLock ? (
            <p className="faint small" style={{ margin: 0 }}>
              {dagLock}
            </p>
          ) : dagConfirm ? (
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              <span className="small" style={{ flex: '1 1 100%' }}>
                Na pewno? To {money(dagestanCost(g))} i trzy lata bez walk. Wrócisz w wieku {g.age + 3} lat.
              </span>
              <button className="btn btn-small btn-ghost" onClick={() => setDagConfirm(false)}>
                Zostaję
              </button>
              <button className="btn btn-small btn-gold btn-ico" onClick={() => setGame(goDagestan(g))}>
                <Icon name="check" size={15} />
                Lecę w góry
              </button>
            </div>
          ) : (
            <button className="btn btn-small btn-ghost btn-ico" style={{ width: 'fit-content' }} onClick={() => setDagConfirm(true)}>
              <Icon name="pin" size={15} />
              Wyjazd za {money(dagestanCost(g))}
            </button>
          )}
            </>
          )}
        </section>
      )}
      <div className="cta-bar">
        <button className="btn btn-primary btn-block btn-ico" disabled={!pick} onClick={() => pick && setGame(doTraining(g, pick, camp?.id))}>
          {pick && <Icon name={STAT_ICON[pick]} />}
          {pick ? `Trenuję: ${STAT_LABELS[pick].toLowerCase()}${camp ? ` · ${camp.name}` : ''}` : 'Wybierz, co trenujesz'}
        </button>
      </div>
    </section>
  );
}
