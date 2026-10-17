import { useEffect } from 'react';
import { choiceChance, chooseEvent, continueAfterEvent, effectChips, type Chip } from '../../engine/game';
import { STAT_LABELS } from '../../engine/data';
import type { StepProps } from '../Game';
import { GG } from '../brand';
import { Icon, STAT_ICON } from '../Icon';
import type { StatKey } from '../../engine/types';
import { CoachTip } from '../Tutorial';
import { ChanceTag, chanceTone } from '../Chance';

export function Chips({ chips }: { chips: Chip[] }) {
  if (!chips.length) return null;
  return (
    <span className="chips">
      {chips.map((c, i) => (
        <span key={i} className={`tag ${c.tone}`}>
          {c.icon && <Icon name={c.icon.startsWith('stat:') ? STAT_ICON[c.icon.slice(5) as StatKey] : c.icon} size={13} />}
          {c.text}
        </span>
      ))}
    </span>
  );
}

export function Dist({ dist, stat }: { dist: [number, number, number]; stat?: string }) {
  return (
    <span className="dist-wrap">
      <span className="dist" aria-hidden="true">
        <i style={{ width: `${dist[0]}%` }} />
        <i style={{ width: `${dist[1]}%` }} />
        <i style={{ width: `${dist[2]}%` }} />
      </span>
      <span className="dist-legend">
        <span>
          <i className="dot gold" />
          pełen sukces {dist[0]}%
        </span>
        <span>
          <i className="dot good" />
          udało się {dist[1]}%
        </span>
        <span>
          <i className="dot bad" />
          nie wyszło {dist[2]}%
        </span>
        {stat && <span className="dist-stat">test: {stat.toLowerCase()}</span>}
      </span>
    </span>
  );
}

export default function EventStep({ game, setGame }: StepProps) {
  const g = game;
  const ev = g.event!;
  const picked = ev.picked;

  useEffect(() => {
    if (picked === undefined) return;
    document.getElementById('event-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [picked]);

  return (
    <section className="step">
      {ev.brand && GG[ev.brand as keyof typeof GG] && <img className="event-brand" src={GG[ev.brand as keyof typeof GG]} alt={ev.title} />}
      <div className="kicker pt-ico">
        <Icon name="calendar" size={14} />
        {ev.id === 'sparing_kontrolny' ? 'Start kariery' : 'Przed startem'}
      </div>
      <h2>{ev.title}</h2>
      <p className="lead" style={{ marginTop: 10, whiteSpace: 'pre-line' }}>
        {ev.text}
      </p>

      {picked === undefined && (
        <CoachTip id="event">
        Wybór z kropkami to ryzyko: ✓ zyskasz, ✗ stracisz. Wybór bez kropek działa na pewno.
      </CoachTip>
      )}
      {picked === undefined ? (
        <div className="choice-list" style={{ marginTop: 16 }}>
          {ev.choices.map((c, i) => {
            const ch = choiceChance(g, i);
            const risky = ch !== null && (c.success || c.fail);
            return (
              <button key={i} className="choice" onClick={() => setGame(chooseEvent(g, i))}>
                <span className="opt-top">
                  <span className="opt-label">{c.label}</span>
                  {risky && <ChanceTag p={ch!} />}
                </span>
                <span className="desc">{c.desc}</span>
                {risky ? (
                  <>
                    <span className="opt-bar" aria-hidden="true">
                      <i className={chanceTone(ch!)} style={{ width: `${ch}%` }} />
                    </span>
                    <span className="ev-out">
                      <span className="ok">✓</span>
                      <Chips chips={effectChips(c.success)} />
                    </span>
                    <span className="ev-out">
                      <span className="ko">✗</span>
                      <Chips chips={effectChips(c.fail)} />
                    </span>
                    {c.test && (
                      <span className="faint small test-stat">
                        <Icon name={STAT_ICON[c.test]} size={13} />
                        test: {STAT_LABELS[c.test].toLowerCase()}
                      </span>
                    )}
                  </>
                ) : (
                  <Chips chips={effectChips(c.effects)} />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className={`event-result reveal res-${ev.rolled ?? 'none'}`} id="event-result">
            <div className="event-result-head">
              <strong>{ev.choices[picked].label}</strong>
              {ev.rolled && (
                <span className={`tag ${ev.rolled === 'fail' ? 'bad' : ev.rolled === 'super' ? 'gold' : 'good'}`}>
                  {ev.rolled === 'super' ? 'pełen sukces' : ev.rolled === 'success' ? 'udało się' : 'nie wyszło'}
                </span>
              )}
            </div>
            <p>{ev.resultText ?? ev.choices[picked].desc}</p>
            <Chips chips={effectChips(ev.resultEffects)} />
          </div>
          <div className="cta-bar float" style={{ ['--d' as string]: '350ms' }}>
            <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(continueAfterEvent(g))}>
              Dalej
              <Icon name="play" size={14} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
