/**
 * Karta roku i „zdjęcie z gali” do udostępnienia (1080×1350).
 * Zawodnik to ten sam SVG co na ekranie: serializujemy go z DOM, obrazki wewnątrz
 * (pas) zamieniamy na data URI, bo SVG wczytany jako obraz nie pobiera plików.
 */
import type { GameState, SeasonSummary } from '../engine/types';
import { recStr } from '../engine/game';
import { moneyShort } from '../format';
import { fedLogo } from './logos';
import { GG } from './brand';
import hallBg from '../assets/bg/menu.webp';

const W = 1080;
const H = 1350;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 5000);
  });
}

async function toDataUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;
  try {
    const b = await fetch(url).then((r) => r.blob());
    return await new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = () => res(url);
      fr.readAsDataURL(b);
    });
  } catch {
    return url;
  }
}

/** SVG zawodnika z ekranu → obraz do narysowania na płótnie. */
async function fighterImage(svg: SVGSVGElement): Promise<HTMLImageElement | null> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  const vb = (clone.getAttribute('viewBox') ?? '0 0 900 1080').split(/\s+/).map(Number);
  clone.setAttribute('width', String(vb[2]));
  clone.setAttribute('height', String(vb[3]));
  clone.removeAttribute('class');
  clone.removeAttribute('style');
  for (const im of Array.from(clone.querySelectorAll('image'))) {
    const href = im.getAttribute('href') ?? im.getAttribute('xlink:href');
    if (href) im.setAttribute('href', await toDataUrl(new URL(href, location.href).href));
  }
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml' }));
  const img = await loadImage(url);
  URL.revokeObjectURL(url);
  return img;
}

function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, start: number, maxW: number) {
  let px = start;
  ctx.font = font(px);
  while (ctx.measureText(text).width > maxW && px > 20) {
    px -= 3;
    ctx.font = font(px);
  }
  return px;
}

export interface PhotoInfo {
  kind: 'year' | 'belt';
  /** duży napis: „Udany rok” albo nazwa pasa */
  title: string;
  /** linijka pod tytułem: gala, pokonany rywal */
  sub: string;
}

export function photoInfo(g: GameState, s: SeasonSummary): PhotoInfo {
  if (s.beltWon && s.tier > 0) {
    const belt = g.belts[g.belts.length - 1];
    const fight = [...g.history].reverse().find((h) => h.title && h.result === 'W' && !h.amateur);
    return {
      kind: 'belt',
      title: belt ? belt.name.split(' (')[0] : 'Nowy mistrz',
      sub: fight ? `pokonany: ${fight.opponent} · ${fight.gala ?? fight.fed}` : s.fed,
    };
  }
  if (s.beltWon) return { kind: 'belt', title: 'Mistrz Polski amatorów', sub: `rok ${s.season} kariery · ${s.year}` };
  return { kind: 'year', title: s.grade, sub: `rok ${s.season} kariery · ${s.year} · ${s.tier === 0 ? 'amatorka' : s.fed.split(' – ')[0]}` };
}

export async function drawPhoto(g: GameState, s: SeasonSummary, svg: SVGSVGElement | null): Promise<HTMLCanvasElement> {
  try {
    await Promise.all([document.fonts.load('700 80px Oswald'), document.fonts.load('600 30px "Archivo Variable"')]);
  } catch {
    /* czcionki zastępcze */
  }
  const info = photoInfo(g, s);
  const gold = info.kind === 'belt';
  const accent = gold ? '#f5b700' : '#01aeee';
  const [bg, fighter, logo, fed] = await Promise.all([
    loadImage(hallBg),
    svg ? fighterImage(svg) : Promise.resolve(null),
    loadImage(GG.horizontal),
    s.tier > 0 && fedLogo(s.fed) ? loadImage(fedLogo(s.fed)!) : Promise.resolve(null),
  ]);
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d')!;
  const display = (px: number) => `700 ${px}px Oswald, "Arial Narrow", Impact, sans-serif`;
  const body = (px: number, w = 500) => `${w} ${px}px "Archivo Variable", Archivo, system-ui, sans-serif`;

  // hala w tle, przyciemniona, z reflektorem nad zawodnikiem
  ctx.fillStyle = '#05080f';
  ctx.fillRect(0, 0, W, H);
  if (bg) {
    const sc = Math.max(W / bg.width, H / bg.height);
    ctx.globalAlpha = 0.55;
    ctx.drawImage(bg, (W - bg.width * sc) / 2, (H - bg.height * sc) / 2, bg.width * sc, bg.height * sc);
    ctx.globalAlpha = 1;
  }
  const spot = ctx.createRadialGradient(W / 2, 420, 40, W / 2, 520, 640);
  spot.addColorStop(0, gold ? 'rgba(245,183,0,0.35)' : 'rgba(1,174,238,0.30)');
  spot.addColorStop(1, 'rgba(5,8,15,0)');
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, W, H);
  const fade = ctx.createLinearGradient(0, H * 0.45, 0, H);
  fade.addColorStop(0, 'rgba(5,8,15,0)');
  fade.addColorStop(0.55, 'rgba(5,8,15,0.92)');
  fade.addColorStop(1, '#05080f');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);

  // nagłówek
  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = body(28, 700);
  ctx.fillText(gold ? 'NOWY MISTRZ' : 'PODSUMOWANIE ROKU', W / 2, 92);
  if (fed) {
    const fh = 96;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(fed, W / 2 - fh / 2, 112, fh, fh);
    ctx.globalAlpha = 1;
  }

  // zawodnik
  if (fighter) {
    const fh = 760;
    const fw = (fighter.width / fighter.height) * fh;
    ctx.drawImage(fighter, W / 2 - fw / 2, fed ? 200 : 150, fw, fh);
  }

  // tytuł i nazwisko
  let y = 1010;
  ctx.fillStyle = accent;
  fit(ctx, info.title.toUpperCase(), display, 92, W - 140);
  ctx.fillText(info.title.toUpperCase(), W / 2, y);
  y += 70;
  ctx.fillStyle = '#f4f4f5';
  const name = `${g.profile.firstName}${g.profile.nickname ? ` „${g.profile.nickname}”` : ''} ${g.profile.lastName}`;
  fit(ctx, name, (px) => body(px, 700), 48, W - 140);
  ctx.fillText(name, W / 2, y);
  y += 46;
  ctx.fillStyle = '#a1a1aa';
  fit(ctx, info.sub, (px) => body(px, 500), 28, W - 140);
  ctx.fillText(info.sub, W / 2, y);

  // pasek liczb
  y += 46;
  const cells: [string, string][] = [
    ['bilans roku', `${s.w}-${s.l}${s.d ? `-${s.d}` : ''}`],
    [g.proDebut ? 'rekord' : 'amatorka', recStr(g.proDebut ? g.record : g.amRecord)],
    ['ranking', s.tier === 0 ? '—' : s.rank === 0 ? 'mistrz' : s.rank === null ? 'poza' : `#${s.rank}`],
    ['kasa w roku', `${s.moneyDelta >= 0 ? '+' : '−'}${moneyShort(Math.abs(s.moneyDelta))}`],
  ];
  const cw = (W - 140) / 4;
  cells.forEach(([k, v], i) => {
    const x = 70 + cw * i + cw / 2;
    ctx.fillStyle = '#f4f4f5';
    fit(ctx, v, display, 50, cw - 20);
    ctx.fillText(v, x, y + 46);
    ctx.fillStyle = '#8591a8';
    ctx.font = body(21, 600);
    ctx.fillText(k, x, y + 78);
  });

  // stopka
  ctx.fillStyle = accent;
  ctx.fillRect(0, H - 10, W, 10);
  if (logo) {
    const lh = 40;
    const lw = (logo.width / logo.height) * lh;
    ctx.drawImage(logo, 70, H - 74, lw, lh);
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = '#8591a8';
  ctx.font = body(22, 500);
  ctx.fillText('Symulator Polskiego Zawodnika MMA · postacie fikcyjne', W - 70, H - 46);
  ctx.textAlign = 'left';
  return cv;
}
