/** Samouczek dla nowego gracza (slajdy) i podpowiedzi trenera w trakcie gry. */
import coachFace from '../assets/coaches/club.webp';
import { useEffect, useState, type ReactNode } from 'react';
import { loadSettings, saveSettings } from '../storage';
import { StatArt, Belt, Fighter } from './Art';
import { Icon } from './Icon';
import { STAT_KEYS, STAT_LABELS } from '../engine/data';

interface Slide {
  title: string;
  text: string;
  art: ReactNode;
}

const SLIDES: Slide[] = [
  {
    title: 'Od amatora do mistrza',
    text: 'Masz 16 lat i zaczynasz od turniejów amatorskich. Każdy rok to kilka walk i decyzji. Twoim celem jest pas mistrzowski i jak najlepsza kariera.',
    art: (
      <div className="tut-faceoff">
        <Fighter seed="TutorialHero" corner="blue" size={92} />
        <span className="vs-word">VS</span>
        <Fighter seed="TutorialRival3" corner="red" size={92} mirror />
      </div>
    ),
  },
  {
    title: 'Trenuj z głową',
    text: 'Masz sześć umiejętności. Przed każdym rokiem wybierasz jedną, która urośnie najbardziej. Jedna broń bez reszty to błąd: zawodowi rywale oglądają nagrania i szykują się na nią.',
    art: (
      <div className="tut-stats">
        {STAT_KEYS.map((k) => (
          <span key={k}>
            <StatArt stat={k} size={44} />
            <small>{STAT_LABELS[k]}</small>
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Walczysz i decydujesz',
    text: 'Przed każdą walką zawodową wybierasz plan, a scouting podpowiada, gdzie rywal jest słaby. W walkach o pas decydujesz w każdej przerwie, a po wygranej możesz chwycić mikrofon i kogoś wywołać.',
    art: (
      <div className="tut-choice">
        <div className="tut-opt">
          <b>Obalamy i dociskamy</b>
          <span className="tone-good">raczej wyjdzie</span>
          <i style={{ width: '72%' }} className="good" />
        </div>
        <div className="tut-opt">
          <b>Szukamy nokautu</b>
          <span className="tone-bad">ryzykowne</span>
          <i style={{ width: '31%' }} className="bad" />
        </div>
      </div>
    ),
  },
  {
    title: 'Kasa, gale i kluby',
    text: 'Klub, starty i życie kosztują, a gaże przyjdą dopiero na zawodowstwie. Na początku dorabiasz na etacie i sprzedajesz bilety na regionalne gale. Po każdym roku wybierasz galę, a kontrakt możesz negocjować przed podpisem.',
    art: (
      <div className="tut-icons">
        <span>
          <Icon name="coins" size={30} />
          <small>budżet</small>
        </span>
        <span>
          <Icon name="briefcase" size={30} />
          <small>kontrakty</small>
        </span>
        <span>
          <Icon name="home" size={30} />
          <small>klub</small>
        </span>
      </div>
    ),
  },
  {
    title: 'Zostaw legendę',
    text: 'Na koniec dostajesz kartę kariery z punktami LEGACY. Możesz ją pobrać i wysłać znajomym. Potem spróbuj pobić swój rekord.',
    art: (
      <div className="tut-belt">
        <Belt size={170} tier={4} />
      </div>
    ),
  },
];

export function Tutorial({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const finish = () => {
    const st = loadSettings();
    saveSettings({ ...st, tutorialSeen: true });
    onDone();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((x) => Math.min(SLIDES.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // przesuwanie palcem
  const [touchX, setTouchX] = useState<number | null>(null);
  const s = SLIDES[i];
  return (
    <div className="tutorial" role="dialog" aria-modal="true" aria-label="Samouczek">
      <div
        className="tut-card"
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX === null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (dx < -40) setI((x) => Math.min(SLIDES.length - 1, x + 1));
          if (dx > 40) setI((x) => Math.max(0, x - 1));
          setTouchX(null);
        }}
      >
        <div className="tut-top">
          <span className="kicker">
            Jak grać · {i + 1} z {SLIDES.length}
          </span>
          <button className="tut-skip" onClick={finish}>
            Pomiń
          </button>
        </div>
        <div className="tut-slide" key={i}>
          <div className="tut-art">{s.art}</div>
          <h2>{s.title}</h2>
          <p>{s.text}</p>
        </div>
        <div className="tut-dots" role="tablist" aria-label="Slajdy">
          {SLIDES.map((_, k) => (
            <button key={k} role="tab" aria-selected={k === i} aria-label={`Slajd ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)} />
          ))}
        </div>
        <div className="tut-nav">
          {i > 0 ? (
            <button className="btn btn-ghost" onClick={() => setI(i - 1)} aria-label="Wstecz">
              <Icon name="play" size={14} style={{ transform: 'scaleX(-1)' }} />
            </button>
          ) : (
            <span />
          )}
          <button className="btn btn-primary btn-ico" onClick={() => (last ? finish() : setI(i + 1))}>
            {last ? 'Zaczynam karierę' : 'Dalej'}
            <Icon name={last ? 'glove' : 'play'} size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function tutorialSeen() {
  return loadSettings().tutorialSeen;
}

/** Podpowiedź trenera. Pokazuje się raz (id), dopóki gracz nie wyłączy wskazówek. */
export function CoachTip({ id, children }: { id: string; children: ReactNode }) {
  const [visible, setVisible] = useState(() => {
    const st = loadSettings();
    return st.tips && !st.tipsSeen.includes(id);
  });
  // raz pokazana podpowiedź nie wraca w kolejnych latach
  useEffect(() => {
    if (!visible) return;
    const st = loadSettings();
    if (!st.tipsSeen.includes(id)) saveSettings({ ...st, tipsSeen: [...st.tipsSeen, id] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!visible) return null;
  const off = () => {
    const st = loadSettings();
    saveSettings({ ...st, tips: false });
    setVisible(false);
  };
  return (
    <aside className="coach" role="note">
      <img className="coach-av" src={coachFace} alt="" aria-hidden="true" />
      <div className="coach-body">
        <div className="coach-text">{children}</div>
        <button className="coach-off" onClick={off}>
          Wyłącz podpowiedzi
        </button>
      </div>
      <button className="coach-x" aria-label="Zamknij podpowiedź" onClick={() => setVisible(false)}>
        <Icon name="x" size={16} />
      </button>
    </aside>
  );
}
