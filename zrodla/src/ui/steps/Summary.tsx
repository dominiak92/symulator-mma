import { toMarket } from '../../engine/game';
import { money, signed } from '../../format';
import type { StepProps } from '../Game';
import CareerChart from '../CareerChart';
import { PeersTable } from '../Sheets';

export default function Summary({ game, setGame, onPeers }: StepProps & { onPeers: () => void }) {
  const g = game;
  const s = g.lastSummary!;
  const gradeTone =
    s.beltWon || s.grade === 'Sezon wybitny' ? 'gold' : s.grade === 'Udany sezon' ? 'good' : s.grade === 'Katastrofa' || s.grade === 'Sezon do zapomnienia' ? 'bad' : '';
  const activePeers = g.peers.filter((p) => !p.retired).length;
  const amateur = s.tier === 0;

  return (
    <>
      <section className="step">
        <div className="kicker">
          Sezon {s.season} · {s.year}
        </div>
        <div className={`grade ${gradeTone}`}>{s.beltWon ? (amateur ? 'Mistrz Polski amatorów!' : 'Sezon z pasem!') : s.grade}</div>
        <p className="story">{s.story}</p>

        <div className="stats-strip">
          <div>
            <small>Bilans</small>
            <b>
              {s.w}-{s.l}
              {s.d ? `-${s.d}` : ''}
            </b>
          </div>
          <div>
            <small>{amateur ? 'Medale w sezonie' : 'Ranking'}</small>
            <b>
              {amateur
                ? (g.run?.tourneys ?? []).map((t) => (t.medal === 'gold' ? '🥇' : t.medal === 'silver' ? '🥈' : t.medal === 'bronze' ? '🥉' : '')).join('') || '–'
                : s.rank === 0
                  ? 'Mistrz'
                  : s.rank === null
                    ? '–'
                    : `#${s.rank}`}
            </b>
          </div>
          <div>
            <small>OVR</small>
            <b>
              {s.ovrFrom}→{s.ovrTo}
            </b>
          </div>
          <div>
            <small>Pieniądze</small>
            <b className={s.moneyDelta >= 0 ? 'pos' : 'neg'}>{money(s.moneyDelta, true)}</b>
          </div>
        </div>

        <div className="grade-bars">
          {s.bars.map((b) => (
            <div key={b.label} className="grade-bar">
              <div className="grade-bar-top">
                <span>{b.label}</span>
                {b.note && <span className="faint">{b.note}</span>}
              </div>
              <div className="bar">
                <i style={{ width: `${b.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {g.seasons.length >= 2 && (
          <div style={{ marginTop: 18 }}>
            <div className="panel-title">Kariera w liczbach</div>
            <CareerChart g={g} />
          </div>
        )}

        <div className="ledger" style={{ marginTop: 16 }}>
          <div className="ledger-row">
            <span>Rozwój</span>
            <span>
              OVR {s.ovrFrom} → {s.ovrTo} ({signed(s.ovrTo - s.ovrFrom)})
            </span>
          </div>
          <div className="ledger-row">
            <span>Media i reputacja</span>
            <span>
              media {g.media}/100 · reputacja {g.rep}/100
            </span>
          </div>
        </div>
      </section>

      <section className="step">
        <div className="step-head">
          <h3>Twój rocznik</h3>
          <button className="btn btn-ghost btn-small" onClick={onPeers}>
            Wszyscy
          </button>
        </div>
        <p className="muted" style={{ marginBottom: 10 }}>
          {activePeers} z {g.peers.length} wciąż walczy.
        </p>
        <PeersTable g={{ ...g, peers: g.peers.filter((p) => !p.retired).slice(0, 5) }} />
        <div className="cta-bar">
          <button className="btn btn-primary btn-block" onClick={() => setGame(toMarket(g))}>
            Dalej: oferty na nowy sezon
          </button>
        </div>
      </section>
    </>
  );
}
