// Delikatne dźwięki syntezowane w przeglądarce (Web Audio), bez plików.
// Grają tylko w ważnych momentach i tylko, gdy w ustawieniach są włączone.
import { loadSettings } from '../storage';

type Ctx = AudioContext;
let ctx: Ctx | null = null;
let master: GainNode | null = null;
const VOLUME = 0.32;

function audio(): { ctx: Ctx; out: GainNode } | null {
  if (typeof window === 'undefined') return null;
  if (!loadSettings().sound) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = VOLUME;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return { ctx, out: master! };
  } catch {
    return null;
  }
}

/** Odblokowanie dźwięku po pierwszym dotknięciu (wymóg przeglądarek). */
export function unlockAudio() {
  const a = audio();
  if (!a) return;
  // krótka cisza, żeby iOS uznał kontekst za uruchomiony przez gracza
  const b = a.ctx.createBuffer(1, 1, 22050);
  const src = a.ctx.createBufferSource();
  src.buffer = b;
  src.connect(a.out);
  src.start(0);
}

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(freq: number, dur: number, type: OscillatorType, peak: number, delay = 0, slideTo?: number) {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + delay;
  const o = a.ctx.createOscillator();
  const g = a.ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  env(g, t, peak, 0.005, dur);
  o.connect(g).connect(a.out);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur: number, peak: number, filterFreq: number, q = 0.7, delay = 0, attack = 0.01) {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + delay;
  const len = Math.floor(a.ctx.sampleRate * (dur + attack + 0.05));
  const buf = a.ctx.createBuffer(1, len, a.ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.ctx.createBufferSource();
  src.buffer = buf;
  const f = a.ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = filterFreq;
  f.Q.value = q;
  const g = a.ctx.createGain();
  env(g, t, peak, attack, dur);
  src.connect(f).connect(g).connect(a.out);
  src.start(t);
  src.stop(t + dur + attack + 0.05);
}

/** Gong na początek walki. */
export function sfxGong() {
  tone(196, 1.6, 'sine', 0.5);
  tone(392.5, 1.1, 'sine', 0.18);
  tone(588, 0.7, 'triangle', 0.08);
}

/** Głuche uderzenie (nokdaun, nokaut). */
export function sfxThud(big = false) {
  tone(big ? 110 : 140, big ? 0.35 : 0.2, 'sine', big ? 0.9 : 0.6, 0, 45);
  noise(big ? 0.18 : 0.1, big ? 0.5 : 0.3, 900, 0.8);
}

/** Doping hali: szum tłumu narastający i opadający. */
export function sfxCrowd(big = false) {
  noise(big ? 2.4 : 1.3, big ? 0.55 : 0.32, 1200, 0.5, 0, big ? 0.35 : 0.2);
  noise(big ? 2.0 : 1.0, big ? 0.3 : 0.16, 2600, 0.9, 0.1, 0.25);
  if (big) {
    // dzwonek mistrzowski
    tone(1046, 0.5, 'triangle', 0.18, 0.2);
    tone(1318, 0.6, 'triangle', 0.15, 0.38);
    tone(1568, 0.9, 'triangle', 0.14, 0.56);
  }
}

/** Porażka: krótki, niski ton. */
export function sfxLoss() {
  tone(220, 0.35, 'triangle', 0.22, 0, 165);
  tone(165, 0.5, 'triangle', 0.18, 0.18, 110);
}

/** Kasa (gaża, sponsor, inwestycja). */
export function sfxCash() {
  tone(1318, 0.12, 'square', 0.07);
  tone(1760, 0.3, 'square', 0.07, 0.08);
}

/** Cichy klik przy decyzji. */
export function sfxClick() {
  tone(660, 0.05, 'triangle', 0.12);
}
