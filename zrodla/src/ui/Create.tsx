import { Fighter } from './Art';
import { useMemo, useState } from 'react';
import type { GameState, Profile, StartProfile, Style } from '../engine/types';
import { DIFFICULTY, HOMETOWNS, NICKNAMES, START_PROFILES, STYLE_DESC, STYLE_LABELS, VOIVODESHIPS, WEIGHTS, WEIGHT_KEYS } from '../engine/data';
import { newGame, randomProfile } from '../engine/game';
import { createRng } from '../engine/rng';
import { Icon } from './Icon';

const STYLES: Style[] = ['boxer', 'kickboxer', 'wrestler', 'grappler', 'brawler', 'allround'];
const STARTS: StartProfile[] = ['osiedle', 'biznes', 'junior', 'wybraniec'];
/** Korzenie zawodnika: zmieniają tylko wygląd (karnację). Walczy zawsze dla Polski. */
const ORIGINS: [string, string][] = [
  ['Polska', 'polskie'],
  ['Dagestan', 'dagestańskie'],
  ['Czeczenia', 'czeczeńskie'],
  ['Gruzja', 'gruzińskie'],
  ['Kazachstan', 'kazachskie'],
  ['Brazylia', 'brazylijskie'],
  ['Holandia', 'holenderskie'],
  ['Irlandia', 'irlandzkie'],
];

export default function Create({ slot, onBack, onStart }: { slot: number; onBack: () => void; onStart: (s: GameState) => void }) {
  const rng = useMemo(() => createRng((Date.now() ^ (Math.random() * 1e9)) >>> 0), []);
  const [p, setP] = useState<Profile>(() => randomProfile(rng));
  const [quick, setQuick] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);

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

  const seed = `${p.firstName.trim()}${p.lastName.trim()}`;
  const sp = START_PROFILES[p.start];
  return (
    <main className="create" style={{ maxWidth: 760, margin: '0 auto', padding: '28px 0 80px' }}>
      <h2 className="sr-only">Nowa kariera</h2>
      {/* podgląd zawodnika: zmienia się na żywo */}
      <div className="cr-hero">
        <div className="cr-art">
          <Fighter weight={p.weight} age={16} country={p.origin} key={`${seed}${p.origin ?? ''}`} className="pop" seed={seed} corner="blue" size={128} />
        </div>
        <div className="cr-id">
          <span className="cr-kicker">Nowa kariera · 16 lat</span>
          <b className="cr-name">
            {p.firstName || 'Imię'}
            {p.nickname.trim() && <em> „{p.nickname.trim()}”</em>} {p.lastName || 'Nazwisko'}
          </b>
          <span className="cr-meta">
            <Icon name="pin" size={12} /> {p.hometown}
          </span>
          <span className="cr-tags">
            <span className="tag blue">{STYLE_LABELS[p.style]}</span>
            <span className="tag">{WEIGHTS[p.weight].short}</span>
          </span>
        </div>
      </div>

      <div className="cr-steps" role="tablist" aria-label="Kroki">
        {['Zawodnik', 'Kariera'].map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} className={`cr-step ${step === i ? 'on' : ''} ${step > i ? 'done' : ''}`} onClick={() => (i === 0 || valid) && setStep(i as 0 | 1)}>
            <i>{step > i ? '✓' : i + 1}</i>
            {t}
          </button>
        ))}
      </div>

      {step === 0 && (
      <section className="cr-card cr-pane">
        <div className="field-grid">
          <label className="cr-field">
            <span>Imię</span>
            <input className="input" value={p.firstName} maxLength={20} onChange={(e) => set({ firstName: e.target.value })} />
          </label>
          <label className="cr-field">
            <span>Nazwisko</span>
            <input className="input" value={p.lastName} maxLength={24} onChange={(e) => set({ lastName: e.target.value })} />
          </label>
        </div>
        <div className="field-inline">
          <label className="cr-field">
            <span>Ksywka (opcjonalnie)</span>
            <input className="input" value={p.nickname} maxLength={20} placeholder="np. Pitbull" onChange={(e) => set({ nickname: e.target.value })} />
          </label>
          <button className="btn btn-ghost btn-ico cr-dice" onClick={() => { reroll(); set({ nickname: rng.chance(0.5) ? rng.pick(NICKNAMES) : '' }); }} aria-label="Losuj imię, nazwisko i ksywkę">
            <Icon name="dice" size={16} />
            Losuj
          </button>
        </div>
        <div className="cr-selects">
          <label className="cr-field">
            <span>Województwo</span>
            <select className="input" value={p.region} onChange={(e) => set({ region: e.target.value, hometown: HOMETOWNS[e.target.value][0] })}>
              {VOIVODESHIPS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="cr-field">
            <span>Miasto</span>
            <select className="input" value={p.hometown} onChange={(e) => set({ hometown: e.target.value })}>
              {HOMETOWNS[p.region].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="cr-field">
            <span>Korzenie (wygląd)</span>
            <select className="input" value={p.origin ?? 'Polska'} onChange={(e) => set({ origin: e.target.value === 'Polska' ? undefined : e.target.value })}>
              {ORIGINS.map(([c, adj]) => (
                <option key={c} value={c}>
                  {adj}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      )}

      {step === 1 && (
      <>
      <section className="cr-card cr-pane">
        <div className="cr-label">
          <Icon name="glove" size={15} />
          Styl walki
        </div>
        <div className="seg seg-3" role="radiogroup" aria-label="Styl walki">
          {STYLES.map((st) => (
            <button key={st} className="seg-btn" role="radio" aria-checked={p.style === st} onClick={() => set({ style: st })}>
              {STYLE_LABELS[st]}
            </button>
          ))}
        </div>
        <p className="cr-desc">{STYLE_DESC[p.style]}</p>

        <div className="cr-label">
          <Icon name="scale" size={15} />
          Kategoria wagowa
        </div>
        <div className="seg seg-3" role="radiogroup" aria-label="Kategoria wagowa">
          {WEIGHT_KEYS.map((w) => (
            <button key={w} className="seg-btn" role="radio" aria-checked={p.weight === w} onClick={() => set({ weight: w })}>
              {WEIGHTS[w].short}
              <small>do {WEIGHTS[w].kg} kg</small>
            </button>
          ))}
        </div>
        <p className="cr-desc">
          {p.weight === 'ciezka' || p.weight === 'polciezka'
            ? 'Trudniej cię znokautować, ale kondycja kończy się szybciej.'
            : p.weight === 'piorkowa' || p.weight === 'lekka'
              ? 'Szybkość i kondycja na plus, szczęka trochę słabsza.'
              : 'Środek stawki, bez wyraźnych plusów i minusów.'}
        </p>
      </section>

      <section className="cr-card">
        <div className="cr-label">
          <Icon name="sparkle" size={15} />
          Punkt startowy
        </div>
        <div className="seg seg-2" role="radiogroup" aria-label="Punkt startowy">
          {STARTS.map((k) => (
            <button key={k} className="seg-btn" role="radio" aria-checked={p.start === k} onClick={() => set({ start: k })}>
              {START_PROFILES[k].label}
            </button>
          ))}
        </div>
        <p className="cr-desc">
          {sp.desc}{' '}
          {sp.mult === null ? <span className="tag bad">poza tabelą wyników</span> : <span className="tag gold">punkty ×{sp.mult.toLocaleString('pl-PL', { minimumFractionDigits: 1 })}</span>}
        </p>

        <div className="cr-two">
          <div>
            <div className="cr-label">
              <Icon name="clock" size={15} />
              Kariera
            </div>
            <div className="seg seg-2" role="radiogroup" aria-label="Rodzaj kariery">
              <button className="seg-btn" role="radio" aria-checked={!quick} onClick={() => setQuick(false)}>
                Pełna
                <small>45–60 min</small>
              </button>
              <button className="seg-btn" role="radio" aria-checked={quick} onClick={() => setQuick(true)}>
                Szybka
                <small>15 min</small>
              </button>
            </div>
          </div>
          <div>
            <div className="cr-label">
              <Icon name="target" size={15} />
              Trudność
            </div>
            <div className="seg seg-2" role="radiogroup" aria-label="Poziom trudności">
              {(['normal', 'hard'] as const).map((d) => (
                <button key={d} className="seg-btn" role="radio" aria-checked={p.difficulty === d} onClick={() => set({ difficulty: d })}>
                  {DIFFICULTY[d].label}
                  <small>punkty ×{DIFFICULTY[d].mult.toLocaleString('pl-PL', { minimumFractionDigits: 1 })}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="cr-desc">
          {quick
            ? 'Startujesz od zawodowstwa, mniejsze walki rozgrywa narożnik, ty decydujesz w walkach o pas i z rywalem. Koniec najpóźniej w wieku 35 lat. Osobny ranking LEGACY.'
            : 'Od turniejów amatorskich w wieku 16 lat. Każda walka i każda decyzja w twoich rękach.'}{' '}
          {DIFFICULTY[p.difficulty].desc}
        </p>
      </section>
      </>
      )}

      <p className="faint small" style={{ marginTop: 14 }}>
        Ile masz talentu? Przekonasz się na pierwszych sparingach. Wszystkie postacie, nazwiska, kluby, gale, federacje i sponsorzy w grze są fikcyjne. Podobieństwo do prawdziwych osób i firm jest przypadkowe. Prawdziwa jest tylko marka Ground Game.
      </p>

      <div className="create-cta">
        <button className="btn btn-ghost" onClick={() => (step === 1 ? setStep(0) : onBack())}>
          {step === 1 ? 'Wstecz' : 'Wróć'}
        </button>
        {step === 0 ? (
          <button className="btn btn-primary btn-ico" disabled={!valid} onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Dalej: styl i kariera
            <Icon name="play" size={14} />
          </button>
        ) : (
          <button className="btn btn-primary btn-ico" disabled={!valid} onClick={start}>
            <Icon name="dumbbell" />
            Zaczynam karierę
          </button>
        )}
      </div>
    </main>
  );
}
