import { dailyDone } from '../storage';
import { dailySeed } from '../engine/rng';
import Logo, { SHOP_URL } from './Logo';
import { GG } from './brand';
import { loadAchievements, loadGoals, loadMuseum } from '../storage';
import { todaysGoals, weekEndsIn } from '../engine/goals';
import { plural } from '../format';
import { ACHIEVEMENTS } from '../engine/achievements';
import { Fighter } from './Art';
import { Icon } from './Icon';

export default function Menu({
  onPlay,
  onDaily,
  onAchievements,
  onMuseum,
  onSettings,
  onTutorial,
}: {
  onPlay: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onMuseum: () => void;
  onSettings: () => void;
  onTutorial: () => void;
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
          <span className="tile-ico">
            <Icon name="play" size={22} />
          </span>
          <strong>Graj</strong>
          <span>Nowa kariera albo dalej tam, gdzie skończyłeś</span>
        </button>
        <button className="menu-tile" onClick={onDaily}>
          <span className="tile-ico">
            <Icon name="calendar" size={20} />
          </span>
          <strong>Kariera dnia</strong>
          <span>
            {doneToday
              ? `Dzisiaj: ${done.verdict}, ${done.legacy} pkt LEGACY. Zobacz wynik.`
              : 'Jedno podejście. Dziś wszyscy grają tym samym zawodnikiem'}
          </span>
        </button>
      </div>

      <section className="how">
        <div className="how-head">
          <h2>Jak grać</h2>
          <button className="btn btn-ghost btn-small btn-ico" onClick={onTutorial}>
            <Icon name="help" size={15} />
            Samouczek
          </button>
        </div>
        <ol className="how-steps">
          <li>
            <span className="how-ico">
              <Icon name="dumbbell" size={20} />
            </span>
            <div>
              <strong>Trenuj</strong>
              <span>Przed sezonem wybierasz, co poprawić: stójkę, zapasy, parter, kondycję, szczękę albo taktykę.</span>
            </div>
          </li>
          <li>
            <span className="how-ico">
              <Icon name="coins" size={20} />
            </span>
            <div>
              <strong>Pilnuj kasy</strong>
              <span>Klub, starty i życie kosztują. Losowe wydarzenia mogą pomóc albo zaszkodzić.</span>
            </div>
          </li>
          <li>
            <span className="how-ico">
              <Icon name="glove" size={20} />
            </span>
            <div>
              <strong>Walcz</strong>
              <span>Walki toczą się na żywo. W ważnych momentach wybierasz plan, a procent pokazuje twoją szansę.</span>
            </div>
          </li>
          <li>
            <span className="how-ico">
              <Icon name="trophy" size={20} />
            </span>
            <div>
              <strong>Idź w górę</strong>
              <span>Po sezonie wybierasz galę i klub. Medale, debiut, awanse, pas. Na koniec karta kariery z punktami LEGACY.</span>
            </div>
          </li>
        </ol>
      </section>

      <section className="goals">
        <div className="goals-head">
          <div>
            <small>
              <Icon name="flame" size={12} />
              Seria
            </small>
            <b>
              {gs.streak} {gs.streak === 1 ? 'dzień' : 'dni'}
            </b>
          </div>
          <div>
            <small>
              <Icon name="target" size={12} />
              Cele dnia
            </small>
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
                  {done ? <Icon name="check" size={14} /> : ''}
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
              {gs.weeklyDone ? <Icon name="check" size={14} /> : <Icon name="star" size={13} />}
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
          <span className="tile-ico">
            <Icon name="trophy" size={20} />
          </span>
          <strong>Osiągnięcia</strong>
          <span>
            {ach}/{ACHIEVEMENTS.length} zdobytych, kolekcja między karierami
          </span>
        </button>
        <button className="menu-tile" onClick={onMuseum}>
          <span className="tile-ico">
            <Icon name="museum" size={20} />
          </span>
          <strong>Muzeum kariery</strong>
          <span>{museum.length ? `${museum.length} ${plural(museum.length, 'kariera', 'kariery', 'karier')}, rekord ${museum.find((m) => m.ranked)?.legacy ?? 0} pkt` : 'Rekordy i werdykty twoich karier'}</span>
        </button>
        <button className="menu-tile" onClick={onSettings}>
          <span className="tile-ico">
            <Icon name="sliders" size={20} />
          </span>
          <strong>Ustawienia</strong>
          <span>Animacje i zapis gry</span>
        </button>
      </div>


      <a className="shop-link" style={{ maxWidth: 760 }} href={`${SHOP_URL}menu`} target="_blank" rel="noopener">
        <img className="shop-logo" src={GG.stacked} alt="" aria-hidden="true" />
        <div className="shop-text">
          <strong>A ty trenujesz?</strong>
          <small>Rashguardy, spodenki i rękawice do sportów walki w sklepie Ground Game.</small>
        </div>
        <span className="btn btn-primary btn-small btn-ico">
          <Icon name="shirt" size={15} />
          Sklep
        </span>
      </a>

      <p className="footer">
        Gra od Ground Game. Wszystkie postacie, nazwiska, kluby, gale, federacje i sponsorzy w grze są fikcyjne. Podobieństwo do prawdziwych osób i firm jest przypadkowe. Prawdziwa jest tylko marka Ground Game.
      </p>
    </main>
  );
}
