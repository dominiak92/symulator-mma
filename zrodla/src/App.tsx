import { useCallback, useEffect, useState } from 'react';
import type { GameState } from './engine/types';
import { addToMuseum, clearSlot, loadAchievements, loadGoals, loadSlot, saveAchievements, saveGoals, saveSlot } from './storage';
import { todaysGoals } from './engine/goals';
import Menu from './ui/Menu';
import Slots from './ui/Slots';
import Create from './ui/Create';
import Game from './ui/Game';
import { AchievementsScreen, MuseumScreen, SettingsScreen } from './ui/Meta';
import { EmblemGallery } from './ui/Emblem';
import { newGame, randomProfile, recStr } from './engine/game';
import { createRng, dailySeed } from './engine/rng';
import { newlyUnlocked } from './engine/achievements';
import { START_PROFILES } from './engine/data';

type Screen =
  | { name: 'menu' }
  | { name: 'slots' }
  | { name: 'create'; slot: number }
  | { name: 'game' }
  | { name: 'achievements' }
  | { name: 'museum' }
  | { name: 'settings' };

interface Toast {
  kind: string;
  title: string;
  desc: string;
}

function recordMeta(s: GameState): Toast[] {
  const have = loadAchievements();
  const fresh = newlyUnlocked(s, new Set(Object.keys(have)));
  const out: Toast[] = fresh.map((a) => ({ kind: 'Nowe osiągnięcie', title: a.title, desc: a.desc }));
  if (fresh.length) {
    for (const a of fresh) have[a.id] = Date.now();
    saveAchievements(have);
  }
  if (s.phase === 'ended' && s.ending && !s.flags.metaDone) {
    s.flags.metaDone = 1;
    saveSlot(s);
    const t = todaysGoals();
    const g = loadGoals(t.day, t.week);
    for (const goal of t.daily)
      if (!g.dailyDone.includes(goal.id) && goal.check(s)) {
        g.dailyDone.push(goal.id);
        out.push({ kind: 'Cel dnia', title: goal.title, desc: goal.desc });
      }
    if (!g.weeklyDone && t.weekly.check(s)) {
      g.weeklyDone = true;
      out.push({ kind: 'Wyzwanie tygodnia', title: t.weekly.title, desc: t.weekly.desc });
    }
    if (g.lastPlayDay !== t.day) {
      g.streak += 1;
      g.lastPlayDay = t.day;
    }
    saveGoals(g);
    addToMuseum({
      id: `${s.createdAt}-${s.slot}`,
      name: `${s.profile.firstName} ${s.profile.lastName}`,
      nickname: s.profile.nickname,
      hometown: s.profile.hometown,
      record: recStr(s.proDebut ? s.record : s.amRecord) + (s.proDebut ? '' : ' am.'),
      verdict: s.ending.verdict,
      legacy: s.ending.legacy,
      ranked: START_PROFILES[s.profile.start].mult !== null,
      belts: s.belts.length,
      ko: s.finishes.ko,
      sub: s.finishes.sub,
      peakTier: s.peakTier,
      earned: s.totalEarned,
      age: s.age,
      mode: s.mode,
      date: Date.now(),
    });
  }
  return out;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'menu' });
  const [game, setGameState] = useState<GameState | null>(null);
  const [toasts, setToasts] = useState<{ id: number; a: Toast }[]>([]);

  const setGame = useCallback((s: GameState) => {
    setGameState(s);
    saveSlot(s);
    const fresh = recordMeta(s);
    if (fresh.length) setToasts((t) => [...t, ...fresh.map((a, i) => ({ id: Date.now() + i, a }))]);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((x) => x.slice(1)), toasts.length > 1 ? 2200 : 3500);
    return () => clearTimeout(t);
  }, [toasts]);

  const openSlot = (slot: number) => {
    const s = loadSlot(slot);
    if (s) {
      setGameState(s);
      setScreen({ name: 'game' });
    } else setScreen({ name: 'create', slot });
  };

  const startDaily = () => {
    const { seed, label } = dailySeed();
    const existing = loadSlot(0);
    if (existing && existing.dailyLabel === label) {
      setGameState(existing);
      setScreen({ name: 'game' });
      return;
    }
    const rng = createRng(seed);
    const profile = randomProfile(rng);
    const s = newGame({ slot: 0, mode: 'daily', seed, dailyLabel: label, profile });
    setGame(s);
    setScreen({ name: 'game' });
  };

  const toMenu = () => {
    setGameState(null);
    setScreen({ name: 'menu' });
  };

  if (typeof location !== 'undefined' && location.hash === '#herby') return <EmblemGallery />;
  return (
    <>
      <div className="cage-top" aria-hidden="true" />
      <div className="app">
        {screen.name === 'menu' && (
          <Menu
            onPlay={() => setScreen({ name: 'slots' })}
            onDaily={startDaily}
            onAchievements={() => setScreen({ name: 'achievements' })}
            onMuseum={() => setScreen({ name: 'museum' })}
            onSettings={() => setScreen({ name: 'settings' })}
          />
        )}
        {screen.name === 'achievements' && <AchievementsScreen onBack={toMenu} />}
        {screen.name === 'museum' && <MuseumScreen onBack={toMenu} />}
        {screen.name === 'settings' && <SettingsScreen onBack={toMenu} />}
        {screen.name === 'slots' && (
          <Slots
            onOpen={openSlot}
            onDelete={(slot) => {
              clearSlot(slot);
              setScreen({ name: 'slots' });
            }}
            onBack={toMenu}
          />
        )}
        {screen.name === 'create' && (
          <Create
            slot={screen.slot}
            onBack={() => setScreen({ name: 'slots' })}
            onStart={(s) => {
              setGame(s);
              setScreen({ name: 'game' });
            }}
          />
        )}
        {screen.name === 'game' && game && (
          <Game
            game={game}
            setGame={setGame}
            onMenu={toMenu}
            onNewCareer={() => {
              if (game.slot === 0) {
                toMenu();
                return;
              }
              clearSlot(game.slot);
              setGameState(null);
              setScreen({ name: 'create', slot: game.slot });
            }}
          />
        )}
      </div>
      <div className="toasts" aria-live="polite">
        {toasts.slice(0, 1).map((t) => (
          <button key={t.id} className="toast reveal" onClick={() => setToasts((x) => x.slice(1))} aria-label={`${t.a.kind}: ${t.a.title}. Dotknij, żeby zamknąć.`}>
            <small>
              {t.a.kind}
              {toasts.length > 1 ? ` · jeszcze ${toasts.length - 1}` : ''}
            </small>
            <strong>{t.a.title}</strong>
            <span>{t.a.desc}</span>
          </button>
        ))}
      </div>
    </>
  );
}
