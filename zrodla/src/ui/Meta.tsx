import { useState } from 'react';
import { ACHIEVEMENTS } from '../engine/achievements';
import { TIER_NAMES } from '../engine/data';
import { loadAchievements, loadMuseum, loadSettings, saveSettings } from '../storage';
import { money, plural } from '../format';
import { GG } from './brand';

function Shell({ title, sub, onBack, children }: { title: string; sub?: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '40px 0 80px' }}>
      <div className="row wrap" style={{ alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <h2>{title}</h2>
          {sub && (
            <p className="muted" style={{ marginTop: 6 }}>
              {sub}
            </p>
          )}
        </div>
        <button className="btn btn-ghost btn-small" onClick={onBack}>
          Wróć do menu
        </button>
      </div>
      <div style={{ marginTop: 20 }}>{children}</div>
    </main>
  );
}

export function AchievementsScreen({ onBack }: { onBack: () => void }) {
  const have = loadAchievements();
  const got = ACHIEVEMENTS.filter((a) => have[a.id]).length;
  return (
    <Shell title="Osiągnięcia" sub={`${got} z ${ACHIEVEMENTS.length}. Zostają z tobą między karierami.`} onBack={onBack}>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const on = !!have[a.id];
          const hidden = a.secret && !on;
          return (
            <div key={a.id} className={`ach ${on ? 'on' : ''}`}>
              <span className="ach-icon" aria-hidden="true">
                <img src={GG.icon} alt="" />
              </span>
              <div>
                <strong>{hidden ? 'Ukryte osiągnięcie' : a.title}</strong>
                <span>{hidden ? 'Odkryjesz je, kiedy zdobędziesz.' : a.desc}</span>
                {on && <small>{new Date(have[a.id]).toLocaleDateString('pl-PL')}</small>}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

export function MuseumScreen({ onBack }: { onBack: () => void }) {
  const list = loadMuseum();
  if (!list.length)
    return (
      <Shell title="Muzeum kariery" onBack={onBack}>
        <p className="muted">Tu trafi każda zakończona kariera. Zagraj pierwszą do końca, a pojawi się na liście.</p>
      </Shell>
    );
  const best = (fn: (e: (typeof list)[0]) => number) => list.reduce((a, b) => (fn(b) > fn(a) ? b : a));
  const records = [
    { label: 'Najwięcej LEGACY', e: best((e) => (e.ranked ? e.legacy : -1)), v: (e: (typeof list)[0]) => `${e.legacy} pkt` },
    { label: 'Najwięcej pasów', e: best((e) => e.belts), v: (e: (typeof list)[0]) => `${e.belts}` },
    { label: 'Najwięcej skończeń', e: best((e) => e.ko + e.sub), v: (e: (typeof list)[0]) => `${e.ko} KO, ${e.sub} ${plural(e.sub, 'poddanie', 'poddania', 'poddań')}` },
    { label: 'Największe zarobki', e: best((e) => e.earned), v: (e: (typeof list)[0]) => money(e.earned) },
  ];
  return (
    <Shell title="Muzeum kariery" sub="Rekordy i wszystkie zakończone kariery na tym urządzeniu." onBack={onBack}>
      <div className="stats-strip">
        {records.map((r) => (
          <div key={r.label}>
            <small>{r.label}</small>
            <b style={{ fontSize: '1.25rem' }}>{r.v(r.e)}</b>
            <div className="muted" style={{ fontSize: '0.85rem' }}>
              {r.e.name}
            </div>
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <table className="peer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Zawodnik</th>
              <th>Werdykt</th>
              <th className="r">Rekord</th>
              <th className="r">LEGACY</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e, i) => (
              <tr key={e.id}>
                <td>{i + 1}</td>
                <td>
                  {e.name}
                  <div className="faint" style={{ fontSize: '0.8rem' }}>
                    {e.hometown} · {TIER_NAMES[e.peakTier]}
                    {e.mode === 'daily' ? ' · kariera dnia' : ''}
                  </div>
                </td>
                <td>{e.verdict}</td>
                <td className="r">{e.record}</td>
                <td className="r">{e.ranked ? e.legacy : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [st, setSt] = useState(loadSettings());
  const toggle = () => {
    const n = { ...st, animations: !st.animations };
    setSt(n);
    saveSettings(n);
  };
  return (
    <Shell title="Ustawienia" onBack={onBack}>
      <button className="choice" role="switch" aria-checked={st.animations} onClick={toggle}>
        <span className="title">
          Animacje raportu sezonu
          <span className={`tag ${st.animations ? 'good' : ''}`}>{st.animations ? 'włączone' : 'wyłączone'}</span>
        </span>
        <span className="desc">Ruletka formy i walki pojawiające się po kolei. Po wyłączeniu sezon rozgrywa się od razu.</span>
      </button>
      <p className="muted" style={{ marginTop: 16 }}>
        Gra zapisuje się automatycznie w tej przeglądarce. Wyczyszczenie danych strony usunie kariery, osiągnięcia i muzeum.
      </p>
    </Shell>
  );
}
