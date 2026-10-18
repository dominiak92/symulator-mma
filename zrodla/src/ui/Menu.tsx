import { useState } from 'react';
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
  const [goalsOpen, setGoalsOpen] = useState(false);
  return (
    <main className="menu">
      <img className="menu-deco" src={GG.icon} alt="" aria-hidden="true" />
      <header className="menu-hero">
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
        <p>Od turniejów amatorskich w wieku 16 lat do pasa mistrza świata. Reszta zależy od ciebie.</p>
      </header>

      {(() => {
        const bestOf = (q: boolean) => museum.filter((e) => e.ranked && (e.mode === 'quick') === q).reduce((a, e) => Math.max(a, e.legacy), 0);
        const full = bestOf(false);
        const quick = bestOf(true);
        if (!full && !quick) return null;
        return (
          <div className="legacy-best" aria-label="Twoje rekordy LEGACY">
            <span className="lb-title">
              <Icon name="trophy" size={14} />
              Twój rekord LEGACY
            </span>
            {full > 0 && (
              <span className="lb-item">
                <small>pełna kariera</small>
                <b>{full.toLocaleString('pl-PL')}</b>
              </span>
            )}
            {quick > 0 && (
              <span className="lb-item">
                <small>szybka kariera</small>
                <b>{quick.toLocaleString('pl-PL')}</b>
              </span>
            )}
          </div>
        );
      })()}
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

      <section className="how compact">
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
              <Icon name="dumbbell" size={18} />
            </span>
            <div>
              <strong>Trenuj</strong>
              <span>co poprawisz przed startem</span>
            </div>
          </li>
          <li>
            <span className="how-ico">
              <Icon name="coins" size={18} />
            </span>
            <div>
              <strong>Pilnuj kasy</strong>
              <span>klub, starty i życie kosztują</span>
            </div>
          </li>
          <li>
            <span className="how-ico">
              <Icon name="glove" size={18} />
            </span>
            <div>
              <strong>Walcz</strong>
              <span>w ważnych chwilach wybierasz plan</span>
            </div>
          </li>
          <li>
            <span className="how-ico">
              <Icon name="trophy" size={18} />
            </span>
            <div>
              <strong>Idź w górę</strong>
              <span>gale, pasy, punkty LEGACY</span>
            </div>
          </li>
        </ol>
      </section>

      <section className={`goals compact${goalsOpen ? ' open' : ''}`}>
        <button className="goals-sum" aria-expanded={goalsOpen} onClick={() => setGoalsOpen(!goalsOpen)}>
          <span className="gs-item">
            <small>
              <Icon name="flame" size={12} />
              Seria
            </small>
            <b>
              {gs.streak} {gs.streak === 1 ? 'dzień' : 'dni'}
            </b>
          </span>
          <span className="gs-item">
            <small>
              <Icon name="target" size={12} />
              Cele dnia
            </small>
            <b>
              {gs.dailyDone.length}/{goals.daily.length}
            </b>
          </span>
          <span className="gs-item">
            <small>
              <Icon name="star" size={12} />
              Tydzień
            </small>
            <b className={gs.weeklyDone ? 'ok' : ''}>{gs.weeklyDone ? 'zrobione' : `${left.days} d ${left.hours} h`}</b>
          </span>
          <span className="gs-more">
            {goalsOpen ? 'Zwiń' : 'Cele'}
            <span className="gs-chev" aria-hidden="true">▸</span>
          </span>
        </button>
        {goalsOpen && (
          <>
            <p className="muted small goals-note">Sprawdzane na koniec kariery. Seria rośnie, gdy kończysz karierę codziennie.</p>
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
          </>
        )}
      </section>

      <nav className="menu-mini" aria-label="Więcej">
        <button onClick={onAchievements}>
          <span className="tile-ico">
            <Icon name="trophy" size={18} />
          </span>
          <strong>Osiągnięcia</strong>
          <small>
            {ach}/{ACHIEVEMENTS.length}
          </small>
        </button>
        <button onClick={onMuseum}>
          <span className="tile-ico">
            <Icon name="museum" size={18} />
          </span>
          <strong>Muzeum</strong>
          <small>{museum.length ? `${museum.length} ${plural(museum.length, 'kariera', 'kariery', 'karier')}` : 'pusto'}</small>
        </button>
        <button onClick={onSettings}>
          <span className="tile-ico">
            <Icon name="sliders" size={18} />
          </span>
          <strong>Ustawienia</strong>
          <small>dźwięk, zapis</small>
        </button>
      </nav>

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
