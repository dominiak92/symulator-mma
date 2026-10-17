import { useState } from 'react';
import type { GameState, SeasonSummary } from '../engine/types';
import { RANK_SIZE, TIER_NAMES, TIER_SHORT } from '../engine/data';
import { lat } from '../format';

// Wykres kariery: droga po szczeblach, OVR i bilans walk rok po roku, z kluczowymi momentami.

function level(tier: number, rank: number | null) {
  const size = RANK_SIZE[tier];
  const inTier = rank === null ? 1 : rank === 0 ? 15 : 2 + ((size - rank) / size) * 12;
  return tier * 16 + inTier;
}

type View = 'road' | 'ovr' | 'fights';

interface KeyMoment {
  season: number;
  age: number;
  text: string;
  tone: 'gold' | 'cyan' | 'bad';
}

/** Najważniejsze punkty kariery wyliczone z podsumowań lat. */
export function keyMoments(g: GameState): KeyMoment[] {
  const out: KeyMoment[] = [];
  const ss = g.seasons;
  let maxTier = ss[0]?.tier ?? 0;
  let firstBelt = true;
  ss.forEach((s, i) => {
    if (i > 0 && s.tier > maxTier) {
      out.push({ season: s.season, age: s.age, text: s.tier === 1 ? 'Debiut zawodowy' : `Awans: ${TIER_NAMES[s.tier]}`, tone: 'cyan' });
      maxTier = s.tier;
    }
    if (s.beltWon) {
      out.push({ season: s.season, age: s.age, text: firstBelt ? `Pierwszy pas (${TIER_SHORT[s.tier]})` : `Kolejny pas (${TIER_SHORT[s.tier]})`, tone: 'gold' });
      firstBelt = false;
    }
  });
  // najlepszy rok: najwięcej wygranych przy dodatnim bilansie
  const pro = ss.some((s) => s.tier >= 1) ? ss.filter((s) => s.tier >= 1) : ss;
  const best = [...pro].filter((s) => s.w > s.l).sort((a, b) => b.w - b.l - (a.w - a.l) || b.tier - a.tier)[0];
  if (best && !out.some((m) => m.season === best.season)) out.push({ season: best.season, age: best.age, text: `Najlepszy rok: ${best.w}-${best.l}`, tone: 'cyan' });
  // szczyt formy
  const peak = [...ss].sort((a, b) => b.ovrTo - a.ovrTo)[0];
  if (peak && !out.some((m) => m.season === peak.season)) out.push({ season: peak.season, age: peak.age, text: `Szczyt formy: OVR ${peak.ovrTo}`, tone: 'cyan' });
  // najgorszy rok
  const worst = [...ss].filter((s) => s.l >= 2 && s.l > s.w).sort((a, b) => b.l - b.w - (a.l - a.w))[0];
  if (worst && !out.some((m) => m.season === worst.season)) out.push({ season: worst.season, age: worst.age, text: `Najtrudniejszy rok: ${worst.w}-${worst.l}`, tone: 'bad' });
  return out.sort((a, b) => a.season - b.season);
}

const W = 400;
const H = 210;
const padL = 36;
const padR = 10;
const padT = 12;
const padB = 24;

function xScale(ss: SeasonSummary[]) {
  const a = ss[0].season;
  const b = ss[ss.length - 1].season;
  return (x: number) => padL + ((x - a) / Math.max(1, b - a)) * (W - padL - padR);
}

function AgeAxis({ ss, sx }: { ss: SeasonSummary[]; sx: (x: number) => number }) {
  const step = ss.length > 16 ? 5 : ss.length > 8 ? 3 : 1;
  return (
    <>
      {ss
        .filter((_, i) => i === 0 || i === ss.length - 1 || i % step === 0)
        .filter((s, i, arr) => i === arr.length - 1 || sx(arr[arr.length - 1].season) - sx(s.season) > 22 || arr.length === 1)
        .map((s) => (
          <text key={`t${s.season}`} x={sx(s.season)} y={H - 7} textAnchor="middle" fontSize="11" fill="var(--faint)">
            {s.age}
          </text>
        ))}
    </>
  );
}

function Markers({ moments, sx, yOf }: { moments: KeyMoment[]; sx: (x: number) => number; yOf: (season: number) => number }) {
  return (
    <>
      {moments.map((m, i) => (
        <g key={i}>
          <circle cx={sx(m.season)} cy={yOf(m.season)} r="8" fill={m.tone === 'gold' ? 'var(--gold)' : m.tone === 'bad' ? 'var(--bad)' : 'var(--cyan)'} stroke="var(--panel)" strokeWidth="2" />
          <text x={sx(m.season)} y={yOf(m.season) + 3.5} textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--bg-deep)">
            {i + 1}
          </text>
        </g>
      ))}
    </>
  );
}

export default function CareerChart({ g, full = false }: { g: GameState; full?: boolean }) {
  const [view, setView] = useState<View>('road');
  const ss = g.seasons;
  if (ss.length < 2) return null;
  const sx = xScale(ss);
  const moments = full ? keyMoments(g) : [];
  const bySeason = new Map(ss.map((s) => [s.season, s]));

  let chart: React.ReactNode;
  if (view === 'road' || !full) {
    const maxY = 80;
    const sy = (y: number) => padT + (1 - y / maxY) * (H - padT - padB);
    const yOf = (season: number) => {
      const s = bySeason.get(season)!;
      return sy(level(s.tier, s.rank));
    };
    const d = ss.map((s, i) => `${i ? 'L' : 'M'}${sx(s.season).toFixed(1)},${yOf(s.season).toFixed(1)}`).join(' ');
    chart = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Droga kariery: szczebel i ranking w kolejnych latach" style={{ display: 'block' }}>
        {TIER_SHORT.map((t, i) => (
          <g key={t}>
            <rect x={padL} y={sy((i + 1) * 16)} width={W - padL - padR} height={sy(i * 16) - sy((i + 1) * 16)} fill={i % 2 ? 'rgba(255,255,255,0.03)' : 'transparent'} />
            <text x={padL - 6} y={sy(i * 16 + 8) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--cond)">
              {t}
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeLinejoin="round" />
        {ss.map((s) => (
          <circle key={s.season} cx={sx(s.season)} cy={yOf(s.season)} r={s.champion ? 4.5 : 2.5} fill={s.champion ? 'var(--gold)' : 'var(--cyan)'}>
            <title>{`Rok ${s.season}, ${lat(s.age)}`}</title>
          </circle>
        ))}
        <Markers moments={moments} sx={sx} yOf={yOf} />
        <AgeAxis ss={ss} sx={sx} />
      </svg>
    );
  } else if (view === 'ovr') {
    const vals = ss.map((s) => s.ovrTo);
    const lo = Math.max(0, Math.floor((Math.min(...ss.map((s) => s.ovrFrom), ...vals) - 5) / 10) * 10);
    const hi = Math.min(99, Math.ceil((Math.max(...vals) + 5) / 10) * 10);
    const sy = (y: number) => padT + (1 - (y - lo) / Math.max(1, hi - lo)) * (H - padT - padB);
    const yOf = (season: number) => sy(bySeason.get(season)!.ovrTo);
    const d = ss.map((s, i) => `${i ? 'L' : 'M'}${sx(s.season).toFixed(1)},${yOf(s.season).toFixed(1)}`).join(' ');
    const area = `${d} L${sx(ss[ss.length - 1].season).toFixed(1)},${sy(lo)} L${sx(ss[0].season).toFixed(1)},${sy(lo)} Z`;
    const ticks = Array.from({ length: Math.floor((hi - lo) / 10) + 1 }, (_, i) => lo + i * 10);
    chart = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="OVR zawodnika w kolejnych latach" style={{ display: 'block' }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={sy(t)} y2={sy(t)} stroke="var(--line)" strokeWidth="1" />
            <text x={padL - 6} y={sy(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
              {t}
            </text>
          </g>
        ))}
        <path d={area} fill="var(--cyan-soft)" />
        <path d={d} fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeLinejoin="round" />
        <Markers moments={moments} sx={sx} yOf={yOf} />
        <AgeAxis ss={ss} sx={sx} />
      </svg>
    );
  } else {
    const maxN = Math.max(2, ...ss.map((s) => Math.max(s.w, s.l + s.d)));
    const mid = padT + (H - padT - padB) / 2;
    const half = (H - padT - padB) / 2 - 4;
    const bw = Math.max(3, Math.min(16, ((W - padL - padR) / ss.length) * 0.6));
    const yOf = (season: number) => {
      const s = bySeason.get(season)!;
      return mid - (s.w / maxN) * half - 10;
    };
    chart = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Wygrane i porażki w kolejnych latach" style={{ display: 'block' }}>
        <line x1={padL} x2={W - padR} y1={mid} y2={mid} stroke="var(--line)" strokeWidth="1" />
        <text x={padL - 6} y={mid - half + 8} textAnchor="end" fontSize="11" fill="var(--good)">
          W
        </text>
        <text x={padL - 6} y={mid + half} textAnchor="end" fontSize="11" fill="var(--bad)">
          P
        </text>
        {ss.map((s) => (
          <g key={s.season}>
            {s.w > 0 && <rect x={sx(s.season) - bw / 2} y={mid - (s.w / maxN) * half} width={bw} height={(s.w / maxN) * half} rx="2" fill={s.champion ? 'var(--gold)' : 'var(--good)'} />}
            {s.l + s.d > 0 && <rect x={sx(s.season) - bw / 2} y={mid + 1} width={bw} height={((s.l + s.d) / maxN) * half} rx="2" fill="var(--bad)" opacity="0.85" />}
            <title>{`Rok ${s.season}: ${s.w}-${s.l}${s.d ? `-${s.d}` : ''}`}</title>
          </g>
        ))}
        <Markers moments={moments} sx={sx} yOf={yOf} />
        <AgeAxis ss={ss} sx={sx} />
      </svg>
    );
  }

  if (!full) return <>{chart}</>;
  return (
    <div className="career-chart">
      <div className="cc-tabs" role="tablist" aria-label="Widok wykresu">
        {(
          [
            ['road', 'Droga'],
            ['ovr', 'Forma (OVR)'],
            ['fights', 'Bilans'],
          ] as [View, string][]
        ).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={view === k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>
            {label}
          </button>
        ))}
      </div>
      {chart}
      <div className="cc-axis-note">wiek zawodnika</div>
      {moments.length > 0 && (
        <ol className="cc-moments">
          {moments.map((m, i) => (
            <li key={i} className={m.tone}>
              <span className="cc-num">{i + 1}</span>
              <span className="cc-body">
                <span className="cc-text">{m.text}</span>
                <span className="cc-when">
                  Rok {m.season} · {lat(m.age)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
