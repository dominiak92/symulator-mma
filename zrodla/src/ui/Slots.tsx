import { useState } from 'react';
import { loadSlot } from '../storage';
import { TIER_NAMES } from '../engine/data';
import { recStr } from '../engine/game';
import { ovr } from '../engine/fighter';
import { lat } from '../format';
import { Icon } from './Icon';
import { Fighter } from './FighterArt';
import { clubLogo } from './logos';
import { divisionKey } from '../engine/game';

export default function Slots({
  onOpen,
  onDelete,
  onBack,
}: {
  onOpen: (slot: number) => void;
  onDelete: (slot: number) => void;
  onBack: () => void;
}) {
  const [confirm, setConfirm] = useState<number | null>(null);
  const slots = [1, 2, 3].map((n) => ({ n, s: loadSlot(n) }));
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 0' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>Zapisy</h2>
        <button className="btn btn-ghost btn-small btn-ico" onClick={onBack}>
          <Icon name="home" size={14} />
          Wróć do menu
        </button>
      </div>
      <p className="muted" style={{ marginTop: 6 }}>
        Masz trzy miejsca na kariery. Gra zapisuje się sama.
      </p>
      <div className="choice-list" style={{ marginTop: 18 }}>
        {slots.map(({ n, s }) => (
          <div key={n} className={`panel slot-card ${s ? 'filled' : 'empty'}`} style={{ margin: 0 }}>
            {s && clubLogo(s.club?.name) && <img className="slot-wm" src={clubLogo(s.club?.name)!} alt="" aria-hidden="true" />}
            {s ? (
              <div className="row wrap">
                <span className="slot-av" aria-hidden="true">
                  <Fighter head seed={`${s.profile.firstName}${s.profile.lastName}`} age={s.age} weight={divisionKey(s)} size={58} />
                </span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <h3>
                    {s.profile.firstName} {s.profile.lastName}
                  </h3>
                  <p className="muted">
                    {s.phase === 'ended'
                      ? `Koniec kariery · ${s.ending?.verdict} · ${recStr(s.proDebut ? s.record : s.amRecord)}`
                      : `${lat(s.age)} · rok ${s.season} · ${TIER_NAMES[s.tier]} · ${recStr(s.proDebut ? s.record : s.amRecord)}${s.proDebut ? '' : ' am.'} · OVR ${ovr(s.stats)}`}
                  </p>
                </div>
                {confirm === n ? (
                  <>
                    <button className="btn btn-ghost btn-small" onClick={() => setConfirm(null)}>
                      Zostaw
                    </button>
                    <button
                      className="btn btn-small"
                      style={{ background: 'var(--bad)' }}
                      onClick={() => {
                        setConfirm(null);
                        onDelete(n);
                      }}
                    >
                      Usuń karierę
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-ghost btn-small btn-ico" onClick={() => setConfirm(n)}>
                      <Icon name="x" size={14} />
                      Usuń
                    </button>
                    <button className="btn btn-primary btn-small btn-ico" onClick={() => onOpen(n)}>
                      <Icon name={s.phase === 'ended' ? 'card' : 'play'} size={14} />
                      {s.phase === 'ended' ? 'Zobacz kartę' : 'Kontynuuj'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="row">
                <div style={{ flex: 1 }}>
                  <h3>Nowa kariera</h3>
                  <p className="muted">Pusty slot. Zacznij od pierwszego treningu.</p>
                </div>
                <button className="btn btn-primary btn-small btn-ico" onClick={() => onOpen(n)}>
                  <Icon name="plus" size={14} />
                  Zacznij
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
