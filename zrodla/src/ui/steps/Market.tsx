import { STAT_LABELS, TIER_LEVEL } from '../../engine/data';
import { ovr } from '../../engine/fighter';
import { changeDivision, clubAvailability, clubLimits, confirmMarket, divisionKey, divisionOptions, marketWarnings, pickClub, pickContract, retire, setManager, weightMissChance } from '../../engine/game';
import { WEIGHTS } from '../../engine/data';
import { MANAGERS, currentManager, managerBlocked } from '../../engine/managers';
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
  const [clubsOpen, setClubsOpen] = useState(false);
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

      {g.tier >= 1 && <DivisionPick game={g} setGame={setGame} />}
      {g.tier >= 1 && <ManagerPick game={g} setGame={setGame} />}

      <section className="step">
        <h3 className="pt-ico" style={{ marginBottom: 10 }}>
          <Icon name="home" size={18} />
          Klub
        </h3>
        <div role="radiogroup" aria-label="Klub" className="club-pick">
          {m.clubs.map((c, idx) => {
            const av = clubAvailability(g, c);
            if (!av.ok) return null;
            if (!clubsOpen && idx !== m.pickedClub) return null;
            const current = c.id === g.club.id;
            return (
              <button
                key={c.id}
                className="offer club-offer"
                role="radio"
                aria-checked={m.pickedClub === idx}
                onClick={() => {
                  setGame(pickClub(g, idx));
                  setClubsOpen(false);
                }}
              >
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
        {(() => {
          const others = m.clubs.filter((c, i) => i !== m.pickedClub && clubAvailability(g, c).ok).length;
          return others > 0 ? (
            <button className="more-btn" onClick={() => setClubsOpen((x) => !x)} aria-expanded={clubsOpen}>
              <Icon name={clubsOpen ? 'x' : 'list'} size={15} />
              {clubsOpen ? 'Zwiń listę klubów' : `Zmień klub · ${others} ${plural(others, 'inny', 'inne', 'innych')} do wyboru`}
            </button>
          ) : null;
        })()}
        {clubsOpen && m.clubs.some((c) => !clubAvailability(g, c).ok) && (
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

function focusWord(f: number) {
  return f >= 0.9 ? 'zawsze ma czas' : f >= 0.75 ? 'zwykle ma czas' : f >= 0.6 ? 'często zajęty' : 'wielu zawodników';
}

const MGR_LOOK: Record<string, { bg: string; fg: string; ini: string }> = {
  zdzisiek: { bg: '#78350f', fg: '#fde68a', ini: 'WZ' },
  okulary: { bg: '#18181b', fg: '#f5b700', ini: 'FO' },
  spinacz: { bg: '#0c4a6e', fg: '#e0f2fe', ini: 'AS' },
  paradygmat: { bg: '#581c87', fg: '#f5d0fe', ini: 'PS' },
  dominacja: { bg: '#7f1d1d', fg: '#fecaca', ini: 'DM' },
};

function MgrAvatar({ id }: { id: string | null }) {
  const l = id ? MGR_LOOK[id] : { bg: '#27272a', fg: '#a1a1aa', ini: 'JA' };
  return (
    <span className="mgr-ava" style={{ background: l.bg, color: l.fg }} aria-hidden="true">
      {l.ini}
    </span>
  );
}

function ManagerPick({ game: g, setGame }: StepProps) {
  const cur = currentManager(g);
  const open = MANAGERS.filter((m) => !managerBlocked(g, m));
  const locked = MANAGERS.filter((m) => managerBlocked(g, m));
  const [openList, setOpenList] = useState(false);
  const pick = (id: string | null) => {
    setGame(setManager(g, id));
    setOpenList(false);
  };
  return (
    <section className="step mgr-section">
      <h3 className="pt-ico" style={{ marginBottom: 4 }}>
        <Icon name="briefcase" size={18} />
        Menedżer
        {!cur && open.length > 1 && <span className="tag gold mgr-new">nowe oferty</span>}
      </h3>
      {openList && (
        <p className="muted small" style={{ margin: '0 0 10px' }}>
          Bierze procent od gaż. W zamian wyższe stawki, łatwiejsze negocjacje, szybszy awans w rankingu i sponsorzy.
        </p>
      )}
      <div role="radiogroup" aria-label="Menedżer" className="club-pick">
        {(openList || !cur) && (
        <button className="offer club-offer" role="radio" aria-checked={!cur} onClick={() => pick(null)}>
          <span className="offer-top">
            <span className="fed-row">
              <MgrAvatar id={null} />
              <span className="fed">
                Sam sobie menedżerem
                <small className="club-sub">
                  <span>
                    <Icon name="coins" size={12} />
                    cała gaża twoja
                  </span>
                </small>
              </span>
            </span>
            <span className="tag">0%</span>
          </span>
          {!cur && (
            <span className="chips">
              <span className="tag blue">teraz</span>
            </span>
          )}
        </button>
        )}
        {open
          .filter((m) => openList || cur?.id === m.id)
          .map((m) => (
          <button key={m.id} className="offer club-offer" role="radio" aria-checked={cur?.id === m.id} onClick={() => pick(m.id)}>
            <span className="offer-top">
              <span className="fed-row">
                <MgrAvatar id={m.id} />
                <span className="fed">
                  {m.name}
                  <small className="club-sub">
                    <span>
                      <Icon name="coins" size={12} />
                      gaże +{Math.round((m.purse - 1) * 100)}%
                    </span>
                    {m.quality > 0 && (
                      <span>
                        <Icon name="trend" size={12} />
                        szybciej w rankingu
                      </span>
                    )}
                    {m.sponsor >= 8 && (
                      <span>
                        <Icon name="shirt" size={12} />
                        sponsorzy
                      </span>
                    )}
                    <span>
                      <Icon name="clock" size={12} />
                      {focusWord(m.focus)}
                    </span>
                  </small>
                </span>
              </span>
              <span className="tag gold">{Math.round(m.cut * 100)}%</span>
            </span>
            <span className="offer-note">{m.desc}</span>
            {cur?.id === m.id && (
              <span className="chips">
                <span className="tag blue">twój menedżer</span>
              </span>
            )}
          </button>
        ))}
      </div>
      <button className="more-btn" onClick={() => setOpenList((x) => !x)} aria-expanded={openList}>
        <Icon name={openList ? 'x' : 'briefcase'} size={15} />
        {openList ? 'Zwiń listę menedżerów' : cur ? `Zmień menedżera · ${open.length} ${plural(open.length, 'oferta', 'oferty', 'ofert')}` : `Zobacz oferty menedżerów · ${open.length}`}
      </button>
      {openList && locked.length > 0 && (
        <details className="acc" style={{ marginTop: 8 }}>
          <summary>
            <span>Menedżerowie poza zasięgiem</span>
            <b>{locked.length}</b>
          </summary>
          <div className="acc-body locked-clubs">
            {locked.map((m) => (
              <div key={m.id} className="locked-club">
                <MgrAvatar id={m.id} />
                <span>
                  <b>{m.name}</b>
                  <small>{managerBlocked(g, m)}</small>
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function DivisionPick({ game: g, setGame }: StepProps) {
  const opts = divisionOptions(g);
  const cur = divisionKey(g);
  const natural = g.profile.weight ?? 'polsrednia';
  const idx = (k: string) => opts.indexOf(k as never);
  const shift = opts.indexOf(cur) - opts.indexOf(natural);
  const miss = weightMissChance(g);
  return (
    <section className="step div-section">
      <h3 className="pt-ico" style={{ marginBottom: 8 }}>
        <Icon name="scale" size={18} />
        Kategoria wagowa
      </h3>
      <div className="seg div-seg" role="radiogroup" aria-label="Kategoria wagowa">
        {opts.map((k) => (
          <button key={k} role="radio" aria-checked={k === cur} className={k === cur ? 'on' : ''} onClick={() => setGame(changeDivision(g, k))}>
            <b>{WEIGHTS[k].short}</b>
            <small>{k === natural ? 'naturalna' : idx(k) < idx(natural) ? 'zbijasz wagę' : 'kategoria wyżej'}</small>
          </button>
        ))}
      </div>
      <p className="muted small div-note">
        {shift < 0
          ? `Przewaga warunków fizycznych w klatce, ale przed każdą walką ryzyko, że nie zrobisz wagi (ok. ${miss}%: kara z gaży i słabsza forma). Zbijanie męczy organizm.`
          : shift > 0
            ? 'Bez zbijania wagi i bez ryzyka na ważeniu, ale rywale są więksi i silniejsi.'
            : 'Twoja naturalna waga. Bez premii i bez ryzyka.'}{' '}
        Zmiana kategorii zeruje ranking.
      </p>
    </section>
  );
}
