import { Fighter } from './Art';
import { useMemo, useState } from 'react';
import type { GameState, Profile, StartProfile, Style } from '../engine/types';
import { DIFFICULTY, HOMETOWNS, NICKNAMES, START_PROFILES, STYLE_DESC, STYLE_LABELS, VOIVODESHIPS, WEIGHTS, WEIGHT_KEYS } from '../engine/data';
import { newGame, randomProfile } from '../engine/game';
import { createRng } from '../engine/rng';
import { Icon } from './Icon';

const STYLES: Style[] = ['boxer', 'kickboxer', 'wrestler', 'grappler', 'brawler', 'allround'];
const STARTS: StartProfile[] = ['osiedle', 'biznes', 'junior', 'wybraniec'];

export default function Create({ slot, onBack, onStart }: { slot: number; onBack: () => void; onStart: (s: GameState) => void }) {
  const rng = useMemo(() => createRng((Date.now() ^ (Math.random() * 1e9)) >>> 0), []);
  const [p, setP] = useState<Profile>(() => randomProfile(rng));
  const [quick, setQuick] = useState(false);

  const set = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));
  const reroll = () => {
    const r = randomProfile(rng);
    set({ firstName: r.firstName, lastName: r.lastName });
  };

  const valid = p.firstName.trim().length > 0 && p.lastName.trim().length > 0;

  const start = () => {
    if (!valid) return;
    const seed = (Date.now() ^ rng.int(0, 1e9)) >>> 0;
    onStart(
      newGame({
        slot,
        mode: 'normal',
        seed,
        quick,
        profile: { ...p, firstName: p.firstName.trim(), lastName: p.lastName.trim(), nickname: p.nickname.trim() },
      }),
    );
  };

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 0 80px' }}>
      <div className="create-head">
        <div>
          <h2>Nowa kariera</h2>
          <p className="muted small">Tak wygląda twój zawodnik. Zmień imię, a zmieni się też on.</p>
        </div>
        <Fighter weight={p.weight} age={16} key={`${p.firstName.trim()}${p.lastName.trim()}`} className="pop" seed={`${p.firstName.trim()}${p.lastName.trim()}`} corner="blue" size={86} />
      </div>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="user" size={16} />
          Imię i nazwisko
        </div>
        <div className="field-grid">
          <input
            className="input"
            value={p.firstName}
            maxLength={20}
            aria-label="Imię"
            onChange={(e) => set({ firstName: e.target.value })}
          />
          <input
            className="input"
            value={p.lastName}
            maxLength={24}
            aria-label="Nazwisko"
            onChange={(e) => set({ lastName: e.target.value })}
          />
        </div>
        <button className="btn btn-ghost btn-small btn-ico" style={{ marginTop: 8 }} onClick={reroll}>
          <Icon name="dice" size={15} />
          Losuj imię i nazwisko
        </button>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="pen" size={16} />
          Ksywka (możesz zostawić pustą)
        </div>
        <div className="field-inline">
          <input
            className="input"
            value={p.nickname}
            maxLength={20}
            placeholder="np. Pitbull"
            aria-label="Ksywa"
            onChange={(e) => set({ nickname: e.target.value })}
          />
          <button className="btn btn-ghost btn-ico" onClick={() => set({ nickname: rng.pick(NICKNAMES) })}>
            <Icon name="dice" size={15} />
            Losuj
          </button>
        </div>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="pin" size={16} />
          Skąd jesteś
        </div>
        <div className="row wrap">
          <select
            className="input"
            style={{ flex: '1 1 200px' }}
            value={p.region}
            aria-label="Województwo"
            onChange={(e) => set({ region: e.target.value, hometown: HOMETOWNS[e.target.value][0] })}
          >
            {VOIVODESHIPS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select
            className="input"
            style={{ flex: '1 1 200px' }}
            value={p.hometown}
            aria-label="Miasto"
            onChange={(e) => set({ hometown: e.target.value })}
          >
            {HOMETOWNS[p.region].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="glove" size={16} />
          Styl walki
        </div>
        <div className="choice-grid" role="radiogroup" aria-label="Styl walki">
          {STYLES.map((st) => (
            <button key={st} className="choice" role="radio" aria-checked={p.style === st} onClick={() => set({ style: st })}>
              <span className="title">{STYLE_LABELS[st]}</span>
              <span className="desc">{STYLE_DESC[st]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="scale" size={16} />
          Kategoria wagowa
        </div>
        <div className="weight-grid" role="radiogroup" aria-label="Kategoria wagowa">
          {WEIGHT_KEYS.map((w) => (
            <button key={w} className="choice weight" role="radio" aria-checked={p.weight === w} onClick={() => set({ weight: w })}>
              <span className="title">{WEIGHTS[w].short}</span>
              <span className="desc">do {WEIGHTS[w].kg} kg</span>
            </button>
          ))}
        </div>
        <p className="faint small" style={{ marginTop: 6 }}>
          {p.weight === 'ciezka' || p.weight === 'polciezka'
            ? 'Trudniej cię znokautować, ale kondycja kończy się szybciej.'
            : p.weight === 'piorkowa' || p.weight === 'lekka'
              ? 'Szybkość i kondycja na plus, szczęka trochę słabsza.'
              : 'Środek stawki, bez wyraźnych plusów i minusów.'}
        </p>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="sparkle" size={16} />
          Punkt startowy
        </div>
        <div className="choice-list" role="radiogroup" aria-label="Punkt startowy">
          {STARTS.map((k) => {
            const sp = START_PROFILES[k];
            return (
              <button key={k} className="choice" role="radio" aria-checked={p.start === k} onClick={() => set({ start: k })}>
                <span className="title">
                  {sp.label}
                  {sp.mult === null ? (
                    <span className="tag bad">poza tabelą wyników</span>
                  ) : (
                    <span className="tag gold">punkty ×{sp.mult.toLocaleString('pl-PL', { minimumFractionDigits: 1 })}</span>
                  )}
                </span>
                <span className="desc">{sp.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="clock" size={16} />
          Rodzaj kariery
        </div>
        <div className="choice-grid" role="radiogroup" aria-label="Rodzaj kariery">
          <button className="choice" role="radio" aria-checked={!quick} onClick={() => setQuick(false)}>
            <span className="title">
              Pełna kariera
              <span className="tag">ok. 45–60 min</span>
            </span>
            <span className="desc">Od turniejów amatorskich w wieku 16 lat. Każda walka i każda decyzja w twoich rękach.</span>
          </button>
          <button className="choice" role="radio" aria-checked={quick} onClick={() => setQuick(true)}>
            <span className="title">
              Szybka kariera
              <span className="tag gold">ok. 15 min</span>
            </span>
            <span className="desc">Startujesz od zawodowstwa, mniejsze walki rozgrywa narożnik, ty decydujesz w walkach o pas i z rywalem. Koniec najpóźniej w wieku 35 lat. Osobny ranking LEGACY.</span>
          </button>
        </div>
      </section>

      <section className="form-section">
        <div className="label pt-ico">
          <Icon name="target" size={16} />
          Poziom trudności
        </div>
        <div className="choice-grid" role="radiogroup" aria-label="Poziom trudności">
          {(['normal', 'hard'] as const).map((d) => (
            <button key={d} className="choice" role="radio" aria-checked={p.difficulty === d} onClick={() => set({ difficulty: d })}>
              <span className="title">
                {DIFFICULTY[d].label}
                <span className="tag gold">punkty ×{DIFFICULTY[d].mult.toLocaleString('pl-PL', { minimumFractionDigits: 1 })}</span>
              </span>
              <span className="desc">{DIFFICULTY[d].desc}</span>
            </button>
          ))}
        </div>
      </section>

      <p className="muted" style={{ marginTop: 22 }}>
        Ile masz talentu? Przekonasz się na pierwszych sparingach.
      </p>
      <p className="faint small" style={{ marginTop: 8 }}>
        Wszystkie postacie, nazwiska, kluby, gale, federacje i sponsorzy w grze są fikcyjne. Podobieństwo do prawdziwych osób i firm jest przypadkowe. Prawdziwa jest tylko marka Ground Game.
      </p>

      <div className="create-cta">
        <button className="btn btn-ghost" onClick={onBack}>
          Wróć
        </button>
        <button className="btn btn-primary btn-ico" disabled={!valid} onClick={start}>
          <Icon name="dumbbell" />
          Zaczynam karierę
        </button>
      </div>
    </main>
  );
}
