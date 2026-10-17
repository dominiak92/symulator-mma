import type { GameState } from '../engine/types';
import { RANK_SIZE, TIER_SHORT } from '../engine/data';
import { lat } from '../format';

// Wykres kariery: każdy rok to punkt na drabinie szczebli (wyżej = lepiej)
function level(tier: number, rank: number | null) {
  const size = RANK_SIZE[tier];
  const inTier = rank === null ? 1 : rank === 0 ? 15 : 2 + ((size - rank) / size) * 12;
  return tier * 16 + inTier;
}

export default function CareerChart({ g }: { g: GameState }) {
  const pts = g.seasons.map((s) => ({ x: s.season, y: level(s.tier, s.rank), champ: s.champion, age: s.age }));
  if (pts.length < 2) return null;
  const W = 640;
  const H = 220;
  const padL = 40;
  const padR = 12;
  const padT = 10;
  const padB = 26;
  const maxY = 80;
  const sx = (x: number) => padL + ((x - pts[0].x) / Math.max(1, pts[pts.length - 1].x - pts[0].x)) * (W - padL - padR);
  const sy = (y: number) => padT + (1 - y / maxY) * (H - padT - padB);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Wykres kariery: szczebel i ranking w kolejnych latach" style={{ display: 'block' }}>
      {TIER_SHORT.map((t, i) => (
        <g key={t}>
          <rect x={padL} y={sy((i + 1) * 16)} width={W - padL - padR} height={sy(i * 16) - sy((i + 1) * 16)} fill={i % 2 ? 'rgba(255,255,255,0.025)' : 'transparent'} />
          <text x={padL - 8} y={sy(i * 16 + 8) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--cond)">
            {t}
          </text>
        </g>
      ))}
      <path d={d} fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p) => (
        <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r={p.champ ? 5 : 3} fill={p.champ ? 'var(--gold)' : 'var(--cyan)'}>
          <title>{`Rok ${p.x}, ${lat(p.age)}`}</title>
        </circle>
      ))}
      {pts
        .filter((_, i) => i === 0 || i === pts.length - 1 || i % 5 === 0)
        .map((p) => (
          <text key={`t${p.x}`} x={sx(p.x)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--faint)">
            {p.age}
          </text>
        ))}
    </svg>
  );
}
