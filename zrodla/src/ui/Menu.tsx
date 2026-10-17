import { dailyDone } from '../storage';
import { dailySeed } from '../engine/rng';
import Logo, { SHOP_URL } from './Logo';
import { GG } from './brand';
import { loadAchievements, loadGoals, loadMuseum } from '../storage';
import { todaysGoals, weekEndsIn } from '../engine/goals';
import { plural } from '../format';
import { ACHIEVEMENTS } from '../engine/achievements';
import { Fighter } from './Art';

export default function Menu({
  onPlay,
  onDaily,
  onAchievements,
  onMuseum,
  onSettings,
}: {
  onPlay: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onMuseum: () => void;
  onSettings: () => void;
}) {
  const { label } = dailySeed();
  const ach = Object.keys(loadAchievements()).length;
  const museum = loadMuseum();
  const goals = todaysGoals();
  const gs = loadGoals(goals.day, goals.week);
  const left = weekEndsIn();
  const done = dailyDone();
  const doneToday = done && done.label === label;
  return (
    <main className="menu">
      <img className="menu-deco" src={GG.icon} alt="" aria-hidden="true" />
      <header className="poster">
        <div className="menu-brand">
          <a href={`${SHOP_URL}menu_logo`} target="_blank" rel="noopener" aria-label="Ground Game, sklep">
            <Logo className="gg-logo big" variant="wordmark" />
          </a>
          <span>przedstawia</span>
        </div>
        <div className="kicker">Kariera w klatce · 20 minut</div>
        <h1>
          Symulator Polskiego
          <span className="red">Zawodnika MMA</span>
        </h1>
        <div className="menu-faceoff" aria-hidden="true">
          <Fighter seed="GroundGameHero" corner="blue" size={110} />
          <span className="vs-word">VS</span>
          <Fighter seed="RywalZRocznika7" corner="red" size={110} mirror />
        </div>
        <p>Zaczynasz w wieku 16 lat na turniejach amatorskich. Medale, debiut zawodowy, gale regionalne, pas mistrza Polski, a może i świata. Reszta zależy od ciebie.</p>
      </header>

      <div className="menu-grid">
        <button className="menu-tile primary" onClick={onPlay}>
          <strong>Graj</strong>
          <span>Nowa kariera albo dalej tam, gdzie skończyłeś</span>
        </button>
        <button className="menu-tile" onClick={onDaily}>
          <strong>Kariera dnia</strong>
          <span>
            {doneToday
              ? `Dzisiaj: ${done.verdict}, ${done.legacy} pkt LEGACY. Zobacz wynik.`
              : 'Jedno podejście. Dziś wszyscy grają tym samym zawodnikiem'}
          </span>
        </button>
      </div>

      <section className="goals">
        <div className="goals-head">
          <div>
            <small>Seria</small>
            <b>
              {gs.streak} {gs.streak === 1 ? 'dzień' : 'dni'}
            </b>
          </div>
          <div>
            <small>Cele dnia</small>
            <b>
              {gs.dailyDone.length}/{goals.daily.length}
            </b>
          </div>
          <p className="muted small">Sprawdzane na koniec kariery. Seria rośnie, gdy kończysz karierę codziennie.</p>
        </div>
        <ul className="goal-list">
          {goals.daily.map((g) => {
            const done = gs.dailyDone.includes(g.id);
            return (
              <li key={g.id} className={done ? 'done' : ''}>
                <span className="goal-check" aria-hidden="true">
                  {done ? '✓' : ''}
                </span>
                <div>
                  <strong>{g.title}</strong>
                  <span>{g.desc}</span>
                </div>
              </li>
            );
          })}
          <li className={`weekly ${gs.weeklyDone ? 'done' : ''}`}>
            <span className="goal-check" aria-hidden="true">
              {gs.weeklyDone ? '✓' : ''}
            </span>
            <div>
              <strong>{goals.weekly.title}</strong>
              <span>{goals.weekly.desc}</span>
            </div>
            <small>
              wyzwanie tygodnia · {left.days} d {left.hours} h
            </small>
          </li>
        </ul>
      </section>

      <div className="menu-grid small">
        <button className="menu-tile" onClick={onAchievements}>
          <strong>Osiągnięcia</strong>
          <span>
            {ach}/{ACHIEVEMENTS.length} zdobytych, kolekcja między karierami
          </span>
        </button>
        <button className="menu-tile" onClick={onMuseum}>
          <strong>Muzeum kariery</strong>
          <span>{museum.length ? `${museum.length} ${plural(museum.length, 'kariera', 'kariery', 'karier')}, rekord ${museum.find((m) => m.ranked)?.legacy ?? 0} pkt` : 'Rekordy i werdykty twoich karier'}</span>
        </button>
        <button className="menu-tile" onClick={onSettings}>
          <strong>Ustawienia</strong>
          <span>Animacje i zapis gry</span>
        </button>
      </div>

      <details className="acc how-acc" style={{ maxWidth: 760 }}>
        <summary>
          <span>Jak to działa</span>
        </summary>
        <p className="muted acc-body">
          Każdy rok to jeden sezon. Wybierasz, co trenujesz, sprawdzasz budżet i decydujesz, co zrobić z tym, co przynosi życie. Potem
          oglądasz swoje walki, a w ważnych momentach sam wybierasz plan i widzisz, jaką masz szansę. Po sezonie wybierasz, gdzie walczysz i w
          jakim klubie trenujesz. Na koniec dostajesz kartę kariery, którą możesz wysłać znajomym.
        </p>
      </details>

      <a className="shop-link" style={{ maxWidth: 760 }} href={`${SHOP_URL}menu`} target="_blank" rel="noopener">
        <img className="shop-logo" src={GG.stacked} alt="" aria-hidden="true" />
        <div className="shop-text">
          <strong>A ty trenujesz?</strong>
          <small>Rashguardy, spodenki i rękawice do sportów walki w sklepie Ground Game.</small>
        </div>
        <span className="btn btn-primary btn-small">Sklep</span>
      </a>

      <p className="footer">
        Gra od Ground Game. Wszystkie postacie, nazwiska, kluby, gale, federacje i sponsorzy w grze są fikcyjne. Podobieństwo do prawdziwych osób i firm jest przypadkowe. Prawdziwa jest tylko marka Ground Game.
      </p>
    </main>
  );
}
