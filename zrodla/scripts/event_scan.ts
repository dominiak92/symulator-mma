// Szuka zdarzeń z dominującą odpowiedzią: npx tsx scripts/event_scan.ts <katalog z zapisami>
import { readFileSync } from 'node:fs';
import { EVENTS } from '../src/engine/events';
import { seasonIncome } from '../src/engine/events_money';
import { chanceFrom } from '../src/engine/fight';
import { TIER_LEVEL } from '../src/engine/data';
import type { Effects, GameState } from '../src/engine/types';
const SP = process.argv[2];
const saves = ['save_am.json', 'save_new.json', 'save_exp.json', 'save_top.json', 'save_hook.json', 'save_end.json'].map((f) => { try { return JSON.parse(readFileSync(`${SP}/${f}`, 'utf8')) as GameState; } catch { return null; } }).filter(Boolean) as GameState[];
const val = (s: GameState, e?: Effects) => {
  if (!e) return 0;
  const inc = Math.max(3000, seasonIncome(s));
  const st = e.stats ? Object.values(e.stats).reduce((a, b) => a + (b ?? 0), 0) : 0;
  return (e.money ?? 0) / inc * 25 + (e.rep ?? 0) * 1.2 + (e.media ?? 0) * 0.7 + (e.form ?? 0) * 1.3 + (e.relations ?? 0) * 0.4 - (e.wear ?? 0) * 0.8 + st * 2.5 - (e.injury ? 10 : 0) + (e.healInjury ? 6 : 0);
};
const seen = new Map<string, { n: number; best: number[]; margin: number; vals: string }>();
for (const s of saves) {
  for (const ev of EVENTS) {
    let ok = false; try { ok = ev.cond(s); } catch {}
    if (!ok) continue;
    let ch; try { ch = ev.choices(s); } catch { continue; }
    if (ch.length < 2) continue;
    const vs = ch.map((c) => {
      const p = c.test ? chanceFrom(s.stats[c.test], TIER_LEVEL[s.tier] + 6) / 100 : c.chance !== undefined ? c.chance / 100 : null;
      return p === null ? val(s, c.effects) : p * val(s, c.success) + (1 - p) * val(s, c.fail);
    });
    const sorted = [...vs].sort((a, b) => b - a);
    const bi = vs.indexOf(sorted[0]);
    const r = seen.get(ev.id) ?? { n: 0, best: [], margin: 0, vals: '' };
    r.n++; r.best.push(bi); r.margin = Math.max(r.margin, sorted[0] - sorted[1]); r.vals = vs.map((v) => v.toFixed(1)).join(' | ');
    seen.set(ev.id, r);
  }
}
const rows = [...seen.entries()].filter(([, r]) => r.margin >= 3).sort((a, b) => b[1].margin - a[1].margin);
for (const [id, r] of rows) console.log(id.padEnd(26), 'najlepsza:', r.best.join(','), 'przewaga', r.margin.toFixed(1), ' ', r.vals);
console.log('przeanalizowane', seen.size, 'z dominującą opcją', rows.length, 'pierwsza najlepsza w', [...seen.values()].filter((r) => r.best.every((b) => b === 0)).length);
