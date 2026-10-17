import { toMarket, divisionKey } from '../../engine/game';
import { moneyShort, signed } from '../../format';
import type { StepProps } from '../Game';
import CareerChart from '../CareerChart';
import { PeersTable } from '../Sheets';
import { Belt, Confetti, CountUp, Fighter, Medal } from '../Art';
import { clubCrest } from '../Emblem';
import { Icon } from '../Icon';
import { CoachTip } from '../Tutorial';

export default function Summary({ game, setGame, onPeers }: StepProps & { onPeers: () => void }) {
  const g = game;
  const s = g.lastSummary!;
  const gradeTone =
    s.beltWon || s.grade === 'Sezon wybitny' ? 'gold' : s.grade === 'Udany sezon' ? 'good' : s.grade === 'Katastrofa' || s.grade === 'Sezon do zapomnienia' ? 'bad' : '';
  const activePeers = g.peers.filter((p) => !p.retired);
  const amateur = s.tier === 0;
  const medals = amateur ? (g.run?.tourneys ?? []).map((t) => t.medal).filter((m): m is 'gold' | 'silver' | 'bronze' => !!m) : [];
  const party = s.beltWon || medals.includes('gold') || s.grade === 'Sezon wybitny';

  return (
    <section className="step summary-step">
      <div className={`sum-hero ${gradeTone}`}>
        {party && <Confetti />}
        <div className="sum-art">
          <Fighter weight={divisionKey(g)} seed={`${g.profile.firstName}${g.profile.lastName}`} corner="blue" shorts={clubCrest(g.club).bg} size={92} belt={s.champion && !amateur} hurt={gradeTone === 'bad'} />
          {(s.beltWon || medals.length > 0) && (
            <div className="sum-trophies">
              {s.beltWon && !amateur ? <Belt size={96} /> : medals.map((m, i) => <Medal key={i} kind={m} size={34} />)}
            </div>
          )}
        </div>
        <div className="sum-head">
          <div className="kicker">
            Sezon {s.season} · {s.year}
          </div>
          <div className={`grade ${gradeTone}`}>{s.beltWon ? (amateur ? 'Mistrz Polski amatorów!' : 'Sezon z pasem!') : s.grade}</div>
          <div className="sum-rec">
            {s.w}-{s.l}
            {s.d ? `-${s.d}` : ''}
            <small>{amateur ? 'bilans amatorski' : s.rank === 0 ? 'mistrz' : s.rank === null ? 'poza rankingiem' : `ranking #${s.rank}`}</small>
          </div>
        </div>
      </div>

      <div className="tiles">
        <div className="tile">
          <small>
            <Icon name="check" size={11} />
            Wygrane
          </small>
          <b>
            <CountUp to={s.w} />
          </b>
        </div>
        <div className="tile">
          <small>
            <Icon name="trend" size={11} />
            OVR
          </small>
          <b>
            {s.ovrTo}
            {s.ovrTo !== s.ovrFrom && <i className={s.ovrTo > s.ovrFrom ? 'pos' : ''}>{signed(s.ovrTo - s.ovrFrom)}</i>}
          </b>
        </div>
        <div className="tile">
          <small>
            <Icon name="coins" size={11} />
            Kasa
          </small>
          <b className={s.moneyDelta >= 0 ? 'pos' : 'neg'}>
            {(() => {
              const [num, unit] = moneyShort(Math.abs(s.moneyDelta)).split(' ');
              return (
                <>
                  {s.moneyDelta >= 0 ? '+' : '−'}
                  {num}
                  <i>{unit ?? 'zł'}</i>
                </>
              );
            })()}
          </b>
        </div>
        <div className="tile">
          <small>
            <Icon name="megaphone" size={11} />
            Media
          </small>
          <b>
            <CountUp to={g.media} />
          </b>
        </div>
      </div>

      <CoachTip id="summary">
        Tak poszedł sezon. Dotknij sekcji na dole, żeby zobaczyć szczegóły.
      </CoachTip>
      <p className="story">{s.story}</p>

      <div className="grade-bars">
        {s.bars.map((b, i) => (
          <div key={b.label} className="grade-bar">
            <div className="grade-bar-top">
              <span>{b.label}</span>
              {b.note && <span className="faint">{b.note}</span>}
            </div>
            <div className="bar">
              <i style={{ width: `${b.value}%`, animationDelay: `${i * 0.12}s` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="acc-list">
        <details className="acc">
          <summary>
            <span>
              <Icon name="dumbbell" size={15} />
              Rozwój
            </span>
            <b className={s.ovrTo > s.ovrFrom ? 'pos' : ''}>
              {s.ovrTo === s.ovrFrom ? `OVR ${s.ovrTo}, bez zmian` : `OVR ${s.ovrFrom} → ${s.ovrTo} (${signed(s.ovrTo - s.ovrFrom)})`}
            </b>
          </summary>
          <div className="acc-body">
            <p className="muted small">
              Media {g.media}/100 · reputacja {g.rep}/100 · forma w sezonie: {s.form.toLowerCase()}
            </p>
            {g.seasons.length >= 2 && <CareerChart g={g} />}
          </div>
        </details>
        <details className="acc">
          <summary>
            <span>
              <Icon name="users" size={15} />
              Twój rocznik
            </span>
            <b>
              {activePeers.length} z {g.peers.length} walczy
            </b>
          </summary>
          <div className="acc-body">
            <PeersTable g={{ ...g, peers: activePeers.slice(0, 5) }} />
            <button className="btn btn-ghost btn-small" style={{ marginTop: 8 }} onClick={onPeers}>
              Cały rocznik
            </button>
          </div>
        </details>
      </div>

      <div className="cta-bar float" style={{ ['--d' as string]: '500ms' }}>
        <button className="btn btn-primary btn-block btn-ico" onClick={() => setGame(toMarket(g))}>
          <Icon name="briefcase" />
          Dalej: rynek
        </button>
      </div>
    </section>
  );
}
