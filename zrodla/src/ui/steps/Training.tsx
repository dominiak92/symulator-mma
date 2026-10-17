import { useEffect, useState } from 'react';
import type { StatKey } from '../../engine/types';
import { STAT_KEYS, STAT_LABELS, STAT_TRAINING_DESC } from '../../engine/data';
import { clubLimits, doTraining, introText, trainingForecast } from '../../engine/game';
import type { StepProps } from '../Game';
import { lat } from '../../format';
import { Icon, STAT_ICON } from '../Icon';

export default function Training({ game, setGame }: StepProps) {
  const [pick, setPick] = useState<StatKey | null>(null);
  const g = game;
  const first = g.season === 1;
  const last = g.seasons[g.seasons.length - 1];

  // po wyborze przewiń do przycisku na telefonie
  useEffect(() => {
    if (!pick || window.innerWidth > 640) return;
    document.querySelector('.cta-bar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [pick]);

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
      {clubLimits(g) && <div className="warn">{g.club.name} niewiele cię już nauczy. Lepszy klub wybierzesz na rynku po sezonie.</div>}
      <div className="choice-list train-list" style={{ marginTop: 12 }} role="radiogroup" aria-label="Trening">
        {STAT_KEYS.map((k) => {
          const now = g.stats[k];
          const to = trainingForecast(g, k, true);
          const base = trainingForecast(g, k, false);
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
      <div className="cta-bar">
        <button className="btn btn-primary btn-block btn-ico" disabled={!pick} onClick={() => pick && setGame(doTraining(g, pick))}>
          {pick && <Icon name={STAT_ICON[pick]} />}
          {pick ? `Trenuję: ${STAT_LABELS[pick].toLowerCase()}` : 'Wybierz, co trenujesz'}
        </button>
      </div>
    </section>
  );
}
