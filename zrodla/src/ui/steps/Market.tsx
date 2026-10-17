import { STAT_LABELS, TIER_LEVEL } from '../../engine/data';
import { ovr } from '../../engine/fighter';
import { clubAvailability, clubLimits, confirmMarket, marketWarnings, pickClub, pickContract, retire } from '../../engine/game';
import type { Contract } from '../../engine/types';
import { lat, money, plural } from '../../format';
import type { StepProps } from '../Game';
import { Emblem, clubCrest, crestFor } from '../Emblem';
import { useState } from 'react';
import { Icon, STAT_ICON } from '../Icon';
import { CoachTip } from '../Tutorial';

const KIND: Record<Contract['kind'], { label: string; tone: string; icon: string }> = {
  stay: { label: 'zostajesz', tone: '', icon: 'home' },
  promotion: { label: 'awans', tone: 'good', icon: 'trend' },
  demotion: { label: 'krok w tył', tone: 'bad', icon: 'rotate' },
  freak: { label: 'freak fight', tone: 'gold', icon: 'megaphone' },
  side: { label: 'nowa gala', tone: '', icon: 'pin' },
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
        <div className="kicker pt-ico">
          <Icon name="briefcase" size={14} />
          Rynek · przed sezonem {g.season}
        </div>
        <h2>Gdzie walczysz w tym roku?</h2>
        <p className="muted small" style={{ marginTop: 4 }}>
          Masz {lat(g.age)}. Wybierz galę, niżej klub.
        </p>

        <CoachTip id="market">
        Wybierz galę na ten rok, a niżej klub. Lepszy klub to szybszy rozwój, ale wyższe składki.
      </CoachTip>
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
                  <span className={`tag ${debut ? 'gold' : k.tone}`}>
                    <Icon name={debut ? 'sparkle' : k.icon} size={12} />
                    {debut ? 'debiut zawodowy' : k.label}
                  </span>
                </span>
                {c.note && <span className="offer-note">{c.note}</span>}
                {c.kind === 'freak' && (
                  <span className="freak-cost">
                    {g.tier > 0 && g.rank !== null && (
                      <span>
                        <Icon name="trophy" size={12} />
                        wypadasz z rankingu
                      </span>
                    )}
                    <span>
                      <Icon name="trend" size={12} style={{ transform: 'scaleY(-1)' }} />
                      forma sportowa w dół
                    </span>
                    <span>
                      <Icon name="coins" size={12} />
                      federacje płacą mniej przez 2 lata
                    </span>
                  </span>
                )}
                <span className="terms">
                  <span>
                    <small>
                      <Icon name="coins" size={11} />
                      Gaża
                    </small>
                    <b>{c.purse ? money(c.purse) : 'brak'}</b>
                  </span>
                  {c.winBonus > 0 && (
                    <span>
                      <small>
                      <Icon name="trophy" size={11} />
                      Za wygraną
                    </small>
                      <b>+{money(c.winBonus)}</b>
                    </span>
                  )}
                  <span>
                    <small>
                      <Icon name="glove" size={11} />
                      Walki
                    </small>
                    <b>{c.tier === 0 && c.kind !== 'freak' ? '2 turnieje' : `${c.fights} ${plural(c.fights, 'walka', 'walki', 'walk')}`}</b>
                  </span>
                  {c.kind !== 'freak' && (
                    <span>
                      <small>
                      <Icon name="users" size={11} />
                      Rywale
                    </small>
                      <b className={`tone-${r.tone === 'good' ? 'good' : r.tone === 'bad' ? 'bad' : 'neutral'}`}>{r.text}</b>
                    </span>
                  )}
                  {c.entryCost > 0 && (
                    <span>
                      <small>
                      <Icon name="receipt" size={11} />
                      Opłaty
                    </small>
                      <b>{money(c.entryCost)}</b>
                    </span>
                  )}
                  {c.kind === 'promotion' && c.tier >= 2 && (
                    <span>
                      <small>
                      <Icon name="chart" size={11} />
                      Start w rankingu
                    </small>
                      <b>{c.startRank === null ? 'poza' : `#${c.startRank}`}</b>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {g.tier === 0 && watching.some((c) => c.tier === 1) && (
          <p className="debut-note">
            <Icon name="sparkle" size={14} />
            <span>
              <b>Debiut zawodowy:</b> {watching.find((c) => c.tier === 1)!.reason}
            </span>
          </p>
        )}
        {watching.length > 0 && (
          <details className="acc" style={{ marginTop: 10 }}>
            <summary>
              <span>
                <Icon name="clock" size={15} />
                Jeszcze nie teraz
              </span>
              <b>{watching.length}</b>
            </summary>
            <div className="acc-body locked-clubs">
              {watching.map((c) => (
                <div key={c.id} className="locked-club">
                  <Emblem spec={crestFor(c.fed)} size={26} title={c.fed} />
                  <span>
                    <b>{c.fed}</b>
                    <small>
                      {c.kind === 'stay' ? 'Powód: ' : 'Warunek: '}
                      {c.reason}
                    </small>
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
      </section>

      <section className="step">
        <h3 className="pt-ico" style={{ marginBottom: 10 }}>
          <Icon name="home" size={18} />
          Klub
        </h3>
        <div role="radiogroup" aria-label="Klub" className="club-pick">
          {m.clubs.map((c, idx) => {
            const av = clubAvailability(g, c);
            if (!av.ok) return null;
            const current = c.id === g.club.id;
            return (
              <button key={c.id} className="offer club-offer" role="radio" aria-checked={m.pickedClub === idx} onClick={() => setGame(pickClub(g, idx))}>
                <span className="offer-top">
                  <span className="fed-row">
                    <Emblem spec={clubCrest(c)} size={34} title={c.name} />
                    <span className="fed">
                      {c.name}
                      <small className="club-sub">
                        <span>
                          <Icon name="pin" size={12} />
                          {c.city}
                        </span>
                        <span>
                          <Icon name="coins" size={12} />
                          {c.cost ? `${money(c.cost)}/rok` : 'za darmo'}
                        </span>
                        <span>
                          <Icon name={STAT_ICON[c.specialty]} size={12} />
                          {STAT_LABELS[c.specialty].toLowerCase()}
                        </span>
                      </small>
                    </span>
                  </span>
                  <span className="lvl" aria-label={`poziom ${c.quality} z 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={i < c.quality ? 'on' : ''} />
                    ))}
                  </span>
                </span>
                <span className="offer-note">{c.desc}</span>
                {current && (
                  <span className="chips">
                    <span className="tag blue">
                      twój klub · {g.clubSeasons} {plural(g.clubSeasons, 'sezon', 'sezony', 'sezonów')}
                    </span>
                    {clubLimits(g) && <span className="tag bad">hamuje twój rozwój</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {m.clubs.some((c) => !clubAvailability(g, c).ok) && (
          <details className="acc" style={{ marginTop: 8 }}>
            <summary>
              <span>Kluby poza zasięgiem</span>
              <b>{m.clubs.filter((c) => !clubAvailability(g, c).ok).length}</b>
            </summary>
            <div className="acc-body locked-clubs">
              {m.clubs
                .filter((c) => !clubAvailability(g, c).ok)
                .map((c) => (
                  <div key={c.id} className="locked-club">
                    <Emblem spec={clubCrest(c)} size={26} title={c.name} />
                    <span>
                      <b>{c.name}</b>
                      <small>{clubAvailability(g, c).reason}</small>
                    </span>
                  </div>
                ))}
            </div>
          </details>
        )}

        {warnings.map((w, i) => (
          <div className="warn" key={i}>
            {w}
          </div>
        ))}

        <div className="cta-bar">
          <button className="btn btn-primary btn-block btn-ico" disabled={!picked} onClick={() => setGame(confirmMarket(g))}>
            <Icon name="pen" />
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
            <button className="btn btn-ghost btn-small btn-ico" onClick={() => setConfirmRetire(true)}>
              <Icon name="door" size={15} />
              Zakończ karierę
            </button>
          )}
        </div>
      </section>
    </>
  );
}
