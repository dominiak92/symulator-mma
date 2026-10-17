import { useState } from 'react';
import type { StatKey } from '../../engine/types';
import { STAT_DESC, STAT_KEYS, STAT_LABELS, STAT_TRAINING_DESC } from '../../engine/data';
import { clubLimits, doTraining, introText, trainingForecast } from '../../engine/game';
import type { StepProps } from '../Game';
import { lat } from '../../format';

export default function Training({ game, setGame }: StepProps) {
  const [pick, setPick] = useState<StatKey | null>(null);
  const g = game;
  const first = g.season === 1;
  const last = g.seasons[g.seasons.length - 1];

  return (
    <section className="step">
      {first ? (
        <p className="lead intro">{introText(g)}</p>
      ) : (
        last && (
          <p className="muted">
            Poprzedni sezon: {last.grade.toLowerCase()}, bilans {last.w}-{last.l}
            {last.d ? `-${last.d}` : ''}. Masz {lat(g.age)}.
          </p>
        )
      )}
      <div className="kicker" style={{ marginTop: first ? 18 : 10 }}>
        Okres przygotowawczy
      </div>
      <h2>Na czym skupiasz się na obozie?</h2>
      <p className="muted" style={{ marginTop: 6 }}>
        Wszystko rośnie trochę samo, z wiekiem i treningami w klubie. To, co wybierzesz, urośnie wyraźnie bardziej.
        {g.age >= 31 ? ' Po trzydziestce organizm bierze już mniej.' : ''}
      </p>
      {clubLimits(g) && (
        <div className="warn">
          {g.club.name} niewiele cię już nauczy. Talent masz na więcej, potrzebujesz lepszego klubu. Zmienisz go na rynku po sezonie.
        </div>
      )}
      <div className="choice-list" style={{ marginTop: 14 }} role="radiogroup" aria-label="Trening">
        {STAT_KEYS.map((k) => {
          const now = g.stats[k];
          const to = trainingForecast(g, k, true);
          const base = trainingForecast(g, k, false);
          return (
            <button key={k} className="choice train-opt" role="radio" aria-checked={pick === k} onClick={() => setPick(k)}>
              <span className="opt-top">
                <span className="opt-label">{STAT_LABELS[k]}</span>
                <span className="train-nums">
                  <span className="cur">{now}</span>
                  <span className="arrow">→</span>
                  <span className="to">{to}</span>
                </span>
              </span>
              <span className="desc">
                {STAT_TRAINING_DESC[k]}
                {k === g.club.specialty ? ' Twój klub jest w tym mocny.' : ''}
              </span>
              <span className="faint small">
                {STAT_DESC[k]}. Bez obozu: {base}.
              </span>
            </button>
          );
        })}
      </div>
      <div className="cta-bar">
        <button className="btn btn-primary btn-block" disabled={!pick} onClick={() => pick && setGame(doTraining(g, pick))}>
          {pick ? `Trenuję: ${STAT_LABELS[pick].toLowerCase()}` : 'Wybierz, co trenujesz'}
        </button>
      </div>
    </section>
  );
}
