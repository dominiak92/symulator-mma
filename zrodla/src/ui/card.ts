import type { GameState } from '../engine/types';
import { honours } from '../engine/extras';
import { TIER_NAMES, WEIGHTS } from '../engine/data';
import { recStr } from '../engine/game';
import { lat, money } from '../format';

const W = 1080;
const H = 1350;

import { GG } from './brand';

export const LOGO_URL = GG.stacked;

const C: Record<string, string> = {
  bg: '#0f0f10',
  deep: '#18181b',
  line: '#2d2d32',
  text: '#f4f4f5',
  muted: '#a1a1aa',
  cyan: '#01aeee',
  cta: '#1f00fe',
  red: '#e11d48',
  gold: '#f5b700',
  faint: '#6b6b74',
};

export interface CardTheme {
  id: string;
  name: string;
  unlock: string | null; // id osiągnięcia
  unlockText: string;
  bg: string;
  accent: string;
  stripe: string;
  stripe2: string;
}

export const CARD_THEMES: CardTheme[] = [
  { id: 'gg', name: 'Ground Game', unlock: null, unlockText: 'zawsze dostępny', bg: '#0f0f10', accent: '#01aeee', stripe: '#01aeee', stripe2: '#1f00fe' },
  { id: 'blue', name: 'Niebieski narożnik', unlock: 'first_win', unlockText: 'wygraj pierwszą walkę', bg: '#0b0b1a', accent: '#8b7dff', stripe: '#1f00fe', stripe2: '#01aeee' },
  { id: 'red', name: 'Czerwony narożnik', unlock: 'first_ko', unlockText: 'wygraj przez nokaut', bg: '#140b0e', accent: '#fb7190', stripe: '#e11d48', stripe2: '#f4f4f5' },
  { id: 'mono', name: 'Klasyczna czerń', unlock: 'fights50', unlockText: 'stocz 50 walk', bg: '#000000', accent: '#f4f4f5', stripe: '#f4f4f5', stripe2: '#6b6b74' },
  { id: 'gold', name: 'Złoty pas', unlock: 'belt2', unlockText: 'zostań mistrzem Polski', bg: '#11100b', accent: '#f5b700', stripe: '#f5b700', stripe2: '#01aeee' },
  { id: 'world', name: 'Mistrz świata', unlock: 'belt4', unlockText: 'zdobądź pas świata', bg: '#07101f', accent: '#f5b700', stripe: '#01aeee', stripe2: '#f5b700' },
];

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 4000);
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

function fitText(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, start: number, maxW: number) {
  let px = start;
  ctx.font = font(px);
  while (ctx.measureText(text).width > maxW && px > 24) {
    px -= 4;
    ctx.font = font(px);
  }
  return px;
}

export async function drawCard(g: GameState, withLogo = true, theme: CardTheme = CARD_THEMES[0]): Promise<HTMLCanvasElement> {
  C.bg = theme.bg;
  C.cyan = theme.accent;
  C.cta = theme.stripe2;
  try {
    await Promise.all([
      document.fonts.load('700 80px Oswald'),
      document.fonts.load('400 30px "Archivo Variable"'),
      document.fonts.load('600 30px "Archivo Variable"'),
      document.fonts.load('700 30px "Archivo Variable"'),
    ]);
  } catch {
    /* czcionki zastępcze */
  }
  const logo = withLogo ? await loadImage(LOGO_URL) : null;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d')!;
  const display = (px: number) => `700 ${px}px Oswald, "Arial Narrow", Impact, sans-serif`;
  const body = (px: number, w = 400) => `${w} ${px}px "Archivo Variable", Archivo, system-ui, sans-serif`;
  const cond = (px: number) => `700 ${px}px "Archivo Variable", Archivo, sans-serif`;

  // tło
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  // siatka klatki
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 2;
  for (let x = -H; x < W + H; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 420, 420);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 420, 0);
    ctx.lineTo(x, 420);
    ctx.stroke();
  }
  const grad = ctx.createLinearGradient(0, 0, 0, 440);
  grad.addColorStop(0, 'rgba(27,31,37,0)');
  grad.addColorStop(1, C.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 440);
  ctx.restore();

  // pas w kolorach marki
  ctx.fillStyle = theme.stripe;
  ctx.fillRect(0, 0, 18, H);
  ctx.fillStyle = C.cta;
  ctx.fillRect(0, H - 220, 18, 220);

  const L = 76;
  const R = W - 70;
  // nagłówek
  ctx.fillStyle = C.cyan;
  ctx.font = cond(30);
  ctx.fillText('Symulator Polskiego Zawodnika MMA', L, 98);
  ctx.fillStyle = C.muted;
  ctx.font = body(28);
  const sub = g.mode === 'daily' ? `Kariera dnia ${g.dailyLabel}` : `Karta kariery · ${g.profile.hometown}`;
  ctx.fillText(sub, L, 138);

  // imię
  ctx.fillStyle = C.text;
  let y = 262;
  const fnU = g.profile.firstName.toUpperCase();
  const lnU = g.profile.lastName.toUpperCase();
  fitText(ctx, fnU, display, 88, R - L);
  ctx.fillText(fnU, L, y);
  const lpx = fitText(ctx, lnU, display, 128, R - L);
  y += Math.round(lpx * 1.08) + 6;
  ctx.fillText(lnU, L, y);
  if (g.profile.nickname) {
    y += 74;
    ctx.fillStyle = C.cyan;
    fitText(ctx, `„${g.profile.nickname}”`, display, 52, R - L);
    ctx.fillText(`„${g.profile.nickname}”`, L, y);
  }

  // rekord
  y += 170;
  ctx.fillStyle = C.text;
  const rec = recStr(g.proDebut ? g.record : g.amRecord);
  fitText(ctx, rec, display, 160, R - L);
  ctx.fillText(rec, L - 4, y);
  ctx.fillStyle = C.muted;
  ctx.font = cond(28);
  ctx.fillText(
    g.proDebut ? `rekord zawodowy · w amatorce ${recStr(g.amRecord)} · ${WEIGHTS[g.profile.weight ?? 'polsrednia'].label.toLowerCase()}` : `rekord amatorski · ${WEIGHTS[g.profile.weight ?? 'polsrednia'].label.toLowerCase()}`,
    L,
    y + 42,
  );

  // werdykt
  y += 118;
  ctx.fillStyle = C.cyan;
  const verdict = (g.ending?.verdict ?? '').toUpperCase();
  fitText(ctx, verdict, display, 64, R - L);
  ctx.fillText(verdict, L, y);

  // statystyki
  y += 40;
  const stats: [string, string][] = [
    ['KO', String(g.finishes.ko)],
    ['Poddania', String(g.finishes.sub)],
    g.belts.length ? ['Tytuły', String(g.belts.length)] : ['Medale', String(g.medals.gold + g.medals.silver + g.medals.bronze)],
    ['Najwyżej', g.peakRank === 0 ? `Mistrz ${['AMA', 'REG', 'PL', 'EU', 'ŚW'][g.peakTier]}` : g.peakRank ? `#${g.peakRank} ${['AMA', 'REG', 'PL', 'EU', 'ŚW'][g.peakTier]}` : TIER_NAMES[g.peakTier]],
  ];
  const colW = (R - L) / 4;
  stats.forEach(([k, v], i) => {
    const x = L + i * colW;
    ctx.fillStyle = C.deep;
    roundRect(ctx, x, y, colW - 14, 124, 14);
    ctx.fill();
    ctx.fillStyle = C.muted;
    ctx.font = cond(24);
    ctx.fillText(k, x + 20, y + 40);
    ctx.fillStyle = C.text;
    fitText(ctx, v, display, 56, colW - 50);
    ctx.fillText(v, x + 20, y + 102);
  });
  y += 124;

  const footerTop = H - 205;
  // wyróżnienia: podwójny mistrz, grappling, obserwujący…
  const hon = honours(g).slice(0, 3);
  if (hon.length) {
    y += 52;
    ctx.fillStyle = C.cyan;
    ctx.font = body(27, 600);
    const txt = hon.map((h) => `${h.emoji} ${h.text}`).join('   ');
    fitText(ctx, txt, (n: number) => body(n, 600), 27, R - L);
    ctx.fillText(txt, L, y);
  }

  // pasy
  if (g.belts.length) {
    y += 56;
    ctx.fillStyle = C.gold;
    ctx.font = body(30, 600);
    const shown = g.belts.slice(-3).reverse();
    shown.forEach((b, i) => ctx.fillText(`🏆 ${b.name.split(' (')[0]} · ${lat(b.age)}`, L, y + i * 44));
    y += (shown.length - 1) * 44;
    if (g.belts.length > 3) {
      y += 44;
      ctx.fillStyle = C.muted;
      ctx.fillText(`i jeszcze ${g.belts.length - 3}`, L, y);
    }
  }

  // historia (tyle linii, ile się zmieści nad stopką)
  ctx.font = body(31);
  y += 66;
  const lineH = 44;
  const maxLines = Math.max(0, Math.floor((footerTop - 24 - y) / lineH) + 1);
  const all = wrap(ctx, g.ending?.story ?? '', R - L - 30);
  const lines = all.slice(0, Math.min(4, maxLines));
  if (lines.length < all.length && lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/[ ,.]*$/, '…');
  if (lines.length) {
    ctx.fillStyle = C.cyan;
    ctx.fillRect(L, y - 32, 5, (lines.length - 1) * lineH + 42);
    ctx.fillStyle = C.text;
    lines.forEach((t, i) => ctx.fillText(t, L + 26, y + i * lineH));
  }

  // stopka
  const fy = footerTop;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(L, fy);
  ctx.lineTo(R, fy);
  ctx.stroke();
  ctx.fillStyle = C.muted;
  ctx.font = cond(26);
  ctx.fillText(g.quick ? 'LEGACY · SZYBKA KARIERA' : 'LEGACY', L, fy + 52);
  ctx.fillStyle = C.text;
  ctx.font = display(64);
  ctx.fillText(String(g.ending?.legacy ?? 0), L, fy + 118);

  // logo Ground Game po prawej
  if (logo) {
    const lh = 84;
    const lw = (logo.naturalWidth / logo.naturalHeight) * lh;
    ctx.drawImage(logo, R - lw, fy + 18, lw, lh);
  } else {
    ctx.textAlign = 'right';
    ctx.fillStyle = C.text;
    ctx.font = display(44);
    ctx.fillText('GROUND GAME', R, fy + 82);
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = C.muted;
  ctx.font = body(24);
  ctx.fillText(`Zarobki: ${money(g.totalEarned)} · koniec kariery w wieku ${g.age} lat`, R, fy + 140);
  ctx.textAlign = 'left';
  ctx.fillStyle = C.faint;
  ctx.font = body(20);
  ctx.fillText('groundgame.com · postacie, kluby, gale i sponsorzy w grze są fikcyjne', L, H - 30);

  return cv;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
