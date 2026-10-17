// Deterministyczny generator liczb losowych (mulberry32).
// Stan to jedna liczba, więc łatwo go zapisać w stanie gry
// i odtworzyć tę samą karierę (Kariera dnia, testy).

export interface Rng {
  next(): number; // [0, 1)
  int(min: number, max: number): number; // włącznie
  d20(): number;
  chance(p: number): boolean;
  pick<T>(arr: readonly T[]): T;
  weighted<T>(items: readonly { item: T; w: number }[]): T;
  shuffle<T>(arr: readonly T[]): T[];
  state(): number;
}

export function createRng(seed: number): Rng {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    d20: () => 1 + Math.floor(next() * 20),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    weighted: (items) => {
      const total = items.reduce((a, b) => a + Math.max(0, b.w), 0);
      let r = next() * total;
      for (const it of items) {
        r -= Math.max(0, it.w);
        if (r <= 0) return it.item;
      }
      return items[items.length - 1].item;
    },
    shuffle: (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    state: () => s,
  };
  return rng;
}

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function dailySeed(date = new Date()): { seed: number; label: string } {
  const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return { seed: hashString('kariera-dnia-' + label), label };
}
