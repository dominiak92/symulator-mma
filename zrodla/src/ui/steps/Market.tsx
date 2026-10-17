import { STAT_LABELS, TIER_LEVEL, TIER_NAMES } from '../../engine/data';
import { ovr } from '../../engine/fighter';
import { clubAvailability, clubLimits, confirmMarket, marketWarnings, pickClub, pickContract, retire } from '../../engine/game';
import type { Contract } from '../../engine/types';
import { lat, money, plural } from '../../format';
import type { StepProps } from '../Game';
import { Emblem, clubCrest, crestFor } from '../Emblem';
import { useState } from 'react';

const KIND: Record<Contract['kind'], { label: string; tone: string }> = {
  stay: { label: 'zostajesz', tone: '' },
  promotion: { label: 'awans', tone: 'good' },
  demotion: { label: 'krok w tył', tone: 'bad' },
  freak: { label: 'freak fight', tone: 'gold' },
  side: { label: 'nowa gala', tone: '' },
};

/** Jak mocni są rywale na danym szczeblu w porównaniu z graczem. */
function rivalsLabel(me: number, tier: number): { text: string; tone: string } {
  const diff = TIER_LEVEL[tier] - me;
  if (diff <= -8) return { text: 'słabsi od ciebie', tone: 'good' };
  if (diff <= -3) return { text: 'raczej słabsi', tone: 'good' };
  if (diff <= 3) return { text: 'na twoim poziomie', tone: '' };
  if (diff <= 8) return { text: 'mocniejsi od ciebie', tone: 'bad' };
  return { text: 'dużo mocniejsi', tone: 'bad' };
}

export default function Market({ game, setGame }: StepProps) {
  const g = game;
  const m = g.market!;
  const [confirmRetire, setConfirmRetire] = useState(false);
  const warnings = marketWarnings(g);
  const available = m.contracts.filter((c) => c.available);
  const watching = m.contracts.filter((c) => !c.available);
  const picked = m.contracts[m.pickedContract];
  const me = ovr(g.stats);

  return (
    <>
      <section className="step">
        <div className="kicker">Rynek · przed sezonem {g.season}</div>
        <h2>Gdzie walczysz w tym roku?</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Masz {lat(g.age)}. Wybierz, gdzie walczysz, a niżej klub, w którym trenujesz.
        </p>

        <div role="radiogroup" aria-label="Kontrakt" style={{ marginTop: 14 }}>
          {available.map((c) => {
            const idx = m.contracts.indexOf(c);
            const k = KIND[c.kind];
            const debut = g.tier === 0 && c.tier === 1;
            const r = rivalsLabel(me, c.tier);
            return (
              <button key={c.id} className="offer" role="radio" aria-checked={m.pickedContract === idx} onClick={() => setGame(pickContract(g, idx))}>
                <span className="offer-top">
                  <span className="fed-row">
                    {!(c.kind === 'stay' && c.tier === 0) && <Emblem spec={crestFor(c.fed)} size={34} title={c.fed} />}
                    <span className="fed">{c.kind === 'stay' && c.tier === 0 ? 'Amatorka' : c.fed}</span>
                  </span>
                  <span className={`tag ${debut ? 'gold' : k.tone}`}>{debut ? 'debiut zawodowy' : k.label}</span>
                </span>
                {c.note && <span className="offer-note">{c.note}</span>}
                <span className="terms">
                  <span>
                    <small>Gaża</small>
                    <b>{c.purse ? money(c.purse) : 'brak'}</b>
                  </span>
                  {c.winBonus > 0 && (
                    <span>
                      <small>Za wygraną</small>
                      <b>+{money(c.winBonus)}</b>
                    </span>
                  )}
                  <span>
                    <small>Walki</small>
                    <b>{c.tier === 0 && c.kind !== 'freak' ? '2 turnieje' : `${c.fights} ${plural(c.fights, 'walka', 'walki', 'walk')}`}</b>
                  </span>
                  {c.kind !== 'freak' && (
                    <span>
                      <small>Rywale</small>
                      <b className={`tone-${r.tone === 'good' ? 'good' : r.tone === 'bad' ? 'bad' : 'neutral'}`}>{r.text}</b>
                    </span>
                  )}
                  {c.entryCost > 0 && (
                    <span>
                      <small>Koszty startów</small>
                      <b>{money(c.entryCost)}</b>
                    </span>
                  )}
                  {c.kind === 'promotion' && c.tier >= 2 && (
                    <span>
                      <small>Start w rankingu</small>
                      <b>{c.startRank === null ? 'poza' : `#${c.startRank}`}</b>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {watching.length > 0 && (
          <>
            <div className="panel-title" style={{ marginTop: 18 }}>
              Jeszcze nie teraz
            </div>
            {watching.map((c) => (
              <div key={c.id} className="offer locked">
                <span className="offer-top">
                  <span className="fed-row">
                    <Emblem spec={crestFor(c.fed)} size={34} title={c.fed} />
                    <span className="fed">{c.fed}</span>
                  </span>
                  <span className="tag">{g.tier === 0 ? 'zawodowstwo' : TIER_NAMES[c.tier]}</span>
                </span>
                <span className="offer-note">{c.note}</span>
                <span className="offer-note">
                  <b>{c.kind === 'stay' ? 'Powód:' : 'Warunek:'}</b> {c.reason}
                </span>
              </div>
            ))}
          </>
        )}
      </section>

      <section className="step">
        <h3 style={{ marginBottom: 10 }}>Klub</h3>
        <div role="radiogroup" aria-label="Klub">
          {m.clubs.map((c, idx) => {
            const av = clubAvailability(g, c);
            const current = c.id === g.club.id;
            return (
              <button
                key={c.id}
                className="offer"
                role="radio"
                aria-checked={m.pickedClub === idx}
                disabled={!av.ok}
                onClick={() => setGame(pickClub(g, idx))}
              >
                <span className="offer-top">
                  <span className="fed-row">
                    <Emblem spec={clubCrest(c)} size={34} title={c.name} />
                    <span className="fed">{c.name}</span>
                  </span>
                  <span className="tag">{current ? 'twój klub' : `poziom ${c.quality} z 5`}</span>
                </span>
                <span className="offer-note">{av.ok ? c.desc : av.reason}</span>
                <span className="terms">
                  <span>
                    <small>Gdzie</small>
                    <b>{c.city}</b>
                  </span>
                  <span>
                    <small>Składki</small>
                    <b>{c.cost ? `${money(c.cost)} rocznie` : 'za darmo'}</b>
                  </span>
                  <span>
                    <small>Specjalność</small>
                    <b>{STAT_LABELS[c.specialty].toLowerCase()}</b>
                  </span>
                  {current && (
                    <span>
                      <small>Trenujesz tu</small>
                      <b>
                        {g.clubSeasons} {plural(g.clubSeasons, 'sezon', 'sezony', 'sezonów')}
                      </b>
                    </span>
                  )}
                </span>
                {current && clubLimits(g) && <span className="tag bad">ten klub hamuje twój rozwój</span>}
              </button>
            );
          })}
        </div>

        {warnings.map((w, i) => (
          <div className="warn" key={i}>
            {w}
          </div>
        ))}

        <div className="cta-bar">
          <button className="btn btn-primary btn-block" disabled={!picked} onClick={() => setGame(confirmMarket(g))}>
            Podpisuję · sezon {g.season}
          </button>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center' }}>
          {confirmRetire ? (
            <div className="row wrap" style={{ justifyContent: 'center' }}>
              <span className="muted">Na pewno kończysz karierę?</span>
              <button className="btn btn-ghost btn-small" onClick={() => setConfirmRetire(false)}>
                Jeszcze nie
              </button>
              <button className="btn btn-gold btn-small" onClick={() => setGame(retire(g))}>
                Kończę karierę
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-small" onClick={() => setConfirmRetire(true)}>
              Zakończ karierę
            </button>
          )}
        </div>
      </section>
    </>
  );
}
