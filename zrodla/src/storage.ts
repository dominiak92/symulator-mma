import type { GameState } from './engine/types';
import { SAVE_VERSION } from './engine/game';

const KEY = (slot: number) => (slot === 0 ? 'spz-mma-daily' : `spz-mma-slot-${slot}`);
const DAILY_DONE = 'spz-mma-daily-done';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* brak miejsca albo zablokowany storage — gra działa dalej bez zapisu */
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignorujemy */
  }
}

export function loadSlot(slot: number): GameState | null {
  const raw = safeGet(KEY(slot));
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as GameState;
    if (s.v !== SAVE_VERSION) return null;
    return s;
  } catch {
    return null;
  }
}

export function saveSlot(s: GameState) {
  safeSet(KEY(s.slot), JSON.stringify(s));
  if (s.slot === 0 && s.phase === 'ended' && s.dailyLabel) {
    safeSet(DAILY_DONE, JSON.stringify({ label: s.dailyLabel, legacy: s.ending?.legacy ?? 0, verdict: s.ending?.verdict ?? '' }));
  }
}

export function clearSlot(slot: number) {
  safeRemove(KEY(slot));
}

export function dailyDone(): { label: string; legacy: number; verdict: string } | null {
  const raw = safeGet(DAILY_DONE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const SETTINGS = 'spz-mma-settings';
export interface Settings {
  animations: boolean;
  cardTheme: string;
  /** podpowiedzi trenera w pierwszej karierze */
  tips: boolean;
  tipsSeen: string[];
  tutorialSeen: boolean;
  /** delikatne dźwięki w ważnych momentach */
  sound: boolean;
  /** rozmiar tekstu w procentach (100, 112, 125) */
  fontScale: number;
}
export function loadSettings(): Settings {
  const raw = safeGet(SETTINGS);
  const def: Settings = { animations: true, cardTheme: 'gg', tips: true, tipsSeen: [], tutorialSeen: false, sound: true, fontScale: 100 };
  if (!raw) return def;
  try {
    return { ...def, ...JSON.parse(raw) };
  } catch {
    return def;
  }
}
export function saveSettings(s: Settings) {
  safeSet(SETTINGS, JSON.stringify(s));
}
export const FONT_SCALES = [
  { value: 100, label: 'Normalny' },
  { value: 112, label: 'Większy' },
  { value: 125, label: 'Duży' },
];
/** Ustawia rozmiar tekstu całej gry (rozmiary w CSS są w rem). */
export function applyFontScale(scale = loadSettings().fontScale) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.fontSize = scale === 100 ? '' : `${scale}%`;
}

// ---------- Meta między karierami ----------
const ACH = 'spz-mma-achievements';
const MUSEUM = 'spz-mma-museum';

export function loadAchievements(): Record<string, number> {
  const raw = safeGet(ACH);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveAchievements(a: Record<string, number>) {
  safeSet(ACH, JSON.stringify(a));
}

export interface MuseumEntry {
  id: string;
  name: string;
  nickname: string;
  hometown: string;
  record: string;
  verdict: string;
  legacy: number;
  ranked: boolean;
  belts: number;
  ko: number;
  sub: number;
  peakTier: number;
  earned: number;
  age: number;
  mode: 'normal' | 'daily' | 'quick';
  date: number;
}

export function loadMuseum(): MuseumEntry[] {
  const raw = safeGet(MUSEUM);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addToMuseum(e: MuseumEntry) {
  const list = loadMuseum().filter((x) => x.id !== e.id);
  list.push(e);
  list.sort((a, b) => b.legacy - a.legacy);
  safeSet(MUSEUM, JSON.stringify(list.slice(0, 50)));
}

// ---------- Cele dnia, wyzwanie tygodnia, seria dni ----------
const GOALS = 'spz-mma-goals';

export interface GoalsState {
  day: string;
  dailyDone: string[];
  week: string;
  weeklyDone: boolean;
  streak: number;
  lastPlayDay: string | null;
}

export function loadGoals(day: string, week: string): GoalsState {
  const raw = safeGet(GOALS);
  let g: GoalsState = { day, dailyDone: [], week, weeklyDone: false, streak: 0, lastPlayDay: null };
  if (raw) {
    try {
      g = { ...g, ...JSON.parse(raw) };
    } catch {
      /* zostaw domyślne */
    }
  }
  if (g.day !== day) {
    g.day = day;
    g.dailyDone = [];
  }
  if (g.week !== week) {
    g.week = week;
    g.weeklyDone = false;
  }
  // seria przepada, jeśli wczoraj nie grałeś
  if (g.lastPlayDay) {
    const last = new Date(g.lastPlayDay + 'T12:00:00');
    const today = new Date(day + 'T12:00:00');
    const diff = Math.round((today.getTime() - last.getTime()) / 86400000);
    if (diff > 1) g.streak = 0;
  }
  return g;
}

export function saveGoals(g: GoalsState) {
  safeSet(GOALS, JSON.stringify(g));
}
