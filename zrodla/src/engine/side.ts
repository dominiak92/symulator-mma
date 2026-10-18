// Wydarzenia poza federacją: turnieje grapplingowe, gale bokserskie, seminaria.
// To nie są walki MMA, więc wolno w nich startować także przy kontrakcie na wyłączność.
import type { GameState, SideInvite, SideKind, StatKey } from './types';
import { TIER_LEVEL, TOURNEY_CITIES } from './data';
import type { Rng } from './rng';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const FEE = [0, 300, 800, 2000, 5000];
const GRAPPLING_PRIZE = [0, 1500, 6000, 18000, 45000];
const BOXING_PURSE = [0, 3000, 12000, 35000, 90000];
const SEMINAR_PAY = [0, 1500, 6000, 16000, 40000];

const GRAPPLING_NAMES = [
  ['Puchar Polski No-Gi', 'Grappling Open'],
  ['Puchar Polski No-Gi', 'Mistrzostwa Polski Grapplingu', 'Submission Only Kraków'],
  ['Grappling Masters Europe', 'Euro No-Gi Open', 'Polaris Pro Invitational'],
  ['World No-Gi Invitational', 'Submission Kings Abu Zabi', 'Grappling Masters World'],
];

/** Jakie zaproszenia są możliwe na tym etapie kariery. */
export function inviteKinds(s: GameState): SideKind[] {
  const k: SideKind[] = [];
  if (s.tier >= 1) k.push('grappling');
  if (s.tier >= 1) k.push('boxing');
  if (s.tier >= 2 || s.media >= 25) k.push('seminar');
  return k;
}

function pickCity(rng: Rng, s: GameState) {
  return s.tier >= 3 ? rng.pick(['Londyn', 'Amsterdam', 'Praga', 'Berlin', 'Sztokholm', 'Barcelona']) : rng.pick(TOURNEY_CITIES);
}

export function buildInvite(rng: Rng, s: GameState): SideInvite | null {
  const kinds = inviteKinds(s);
  if (!kinds.length) return null;
  // grappling najczęściej: to najbardziej naturalny dodatek do MMA
  const kind = rng.weighted(kinds.map((k) => ({ item: k, w: k === 'grappling' ? 3 : k === 'boxing' ? 2 : 1.5 })));
  const city = pickCity(rng, s);
  const t = s.tier;
  if (kind === 'grappling') {
    const name = rng.pick(GRAPPLING_NAMES[Math.min(3, Math.max(0, t - 1))]);
    return {
      kind,
      title: name,
      place: city,
      fee: FEE[t],
      prize: GRAPPLING_PRIZE[t],
      text: `Zaproszenie na ${name} w mieście ${city}. Bez ciosów, tylko chwyty i duszenia: trzy walki w drabince. Wygrana nauczy cię więcej w parterze niż miesiąc na macie.`,
    };
  }
  if (kind === 'boxing') {
    return {
      kind,
      title: `Gala bokserska · ${city}`,
      place: city,
      fee: 0,
      prize: BOXING_PURSE[t],
      text: `Promotor boksu szuka kogoś z MMA do walki na swojej gali w mieście ${city}. Cztery rundy, tylko pięści, rękawice 10 uncji. Dobra lekcja stójki i niezła kasa, ale bokser będzie u siebie.`,
    };
  }
  return {
    kind,
    title: `Seminarium · ${city}`,
    place: city,
    fee: 0,
    prize: Math.round((SEMINAR_PAY[t] * (1 + s.media / 100)) / 500) * 500,
    text: `Klub z miasta ${city} zaprasza cię na weekendowe seminarium. Pokazujesz swoje techniki, robisz zdjęcia z ludźmi i wracasz z kasą. Tylko że to weekend bez treningu tuż przed walką.`,
  };
}

/** Szansa na wygraną pojedynczej walki w danym wydarzeniu (0..1). */
export function sideChance(s: GameState, kind: SideKind, form = 0): number {
  const st = s.stats;
  const lvl = TIER_LEVEL[Math.max(1, s.tier)];
  if (kind === 'grappling') return clamp(0.5 + (st.bjj * 0.65 + st.wrest * 0.35 - (lvl + 4)) / 28 + form / 100, 0.12, 0.88);
  if (kind === 'boxing') return clamp(0.5 + (st.stand * 0.7 + st.chin * 0.3 - (lvl + 2)) / 28 + form / 100, 0.1, 0.85);
  return 1;
}

function bump(s: GameState, k: StatKey, n: number) {
  s.stats[k] = clamp(s.stats[k] + n, 1, 99);
  s.potential[k] = Math.max(s.potential[k], s.stats[k]);
}

export interface SideResult {
  title: string;
  lines: string[];
  text: string;
  tone: 'good' | 'bad' | 'neutral' | 'purple';
  win: boolean;
}

/** Rozgrywa wydarzenie i zapisuje skutki w stanie. */
export function resolveInvite(rng: Rng, s: GameState, inv: SideInvite, form: number): SideResult {
  s.flags.sideTired = 1; // weekend poza salą: w najbliższej walce forma −2
  s.flags.sideEvents = (s.flags.sideEvents ?? 0) + 1;
  if (inv.kind === 'seminar') {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.rep = clamp(s.rep + 1, 0, 100);
    s.media = clamp(s.media + 1, 0, 100);
    return {
      title: inv.title,
      lines: [`Wypłata: ${inv.prize.toLocaleString('pl-PL')} zł`, 'Reputacja +1, media +1'],
      text: 'Sala pełna, ludzie zachwyceni, a ty wracasz z kopertą. Tylko nogi bolą od stania cały weekend.',
      tone: 'good',
      win: true,
    };
  }
  s.money -= inv.fee;
  if (inv.kind === 'grappling') {
    const p = sideChance(s, 'grappling', form);
    const stages = ['ćwierćfinał', 'półfinał', 'finał'];
    const lines: string[] = [];
    let won = 0;
    for (const st of stages) {
      const ok = rng.chance(p);
      lines.push(`${st}: ${ok ? (rng.chance(0.5) ? 'wygrana przez duszenie' : 'wygrana na punkty') : rng.chance(0.5) ? 'odklepujesz' : 'przegrana na punkty'}`);
      if (!ok) break;
      won++;
    }
    let text: string;
    let tone: SideResult['tone'];
    if (won === 3) {
      bump(s, 'bjj', 2);
      bump(s, 'wrest', 1);
      s.money += inv.prize;
      s.totalEarned += inv.prize;
      s.rep = clamp(s.rep + 2, 0, 100);
      s.media = clamp(s.media + 1, 0, 100);
      s.flags.grapplingGold = (s.flags.grapplingGold ?? 0) + 1;
      lines.push(`Złoto! Parter +2, zapasy +1, nagroda ${inv.prize.toLocaleString('pl-PL')} zł`);
      text = `Złoto na ${inv.title}. Trzy walki, trzy wygrane, a ludzie z grapplingu pytają, czemu marnujesz się w MMA.`;
      tone = 'purple';
    } else if (won === 2) {
      bump(s, 'bjj', 1);
      const pr = Math.round(inv.prize / 3 / 100) * 100;
      s.money += pr;
      s.totalEarned += pr;
      lines.push(`Srebro: parter +1${pr ? `, nagroda ${pr.toLocaleString('pl-PL')} zł` : ''}`);
      text = 'Srebro. Finał przegrany ze specjalistą, ale w parterze czujesz się pewniej niż kiedykolwiek.';
      tone = 'good';
    } else {
      lines.push(won === 1 ? 'Odpadasz w półfinale. Coś tam zostaje w głowie.' : 'Odpadasz w pierwszej walce.');
      if (won === 1 && rng.chance(0.5)) bump(s, 'bjj', 1);
      text = won === 1 ? 'Półfinał. Specjaliści od grapplingu to inna liga, ale wiesz już, czego ci brakuje.' : 'Pierwsza walka i koniec. Chłopak w kimonie zrobił z tobą, co chciał.';
      tone = 'bad';
    }
    if (!s.injury && rng.chance(0.06)) {
      s.injury = { name: 'naciągnięte więzadło w łokciu', seasons: 1, penalty: 3 };
      lines.push('Kontuzja: naciągnięte więzadło w łokciu (testy −3 pkt)');
    }
    return { title: inv.title, lines, text, tone, win: won === 3 };
  }
  // boks
  const p = sideChance(s, 'boxing', form);
  const ok = rng.chance(p);
  const lines: string[] = [];
  let text: string;
  let tone: SideResult['tone'];
  if (ok) {
    bump(s, 'stand', 1);
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.media = clamp(s.media + 2, 0, 100);
    s.flags.boxingWins = (s.flags.boxingWins ?? 0) + 1;
    const ko = rng.chance(0.35);
    lines.push(ko ? 'Wygrana przez nokaut w 3. rundzie' : 'Wygrana na punkty po czterech rundach', `Stójka +1, gaża ${inv.prize.toLocaleString('pl-PL')} zł, media +2`);
    text = ko ? 'Bokser nie spodziewał się takiej siły od „zapaśnika z klatki”. Hala wstaje.' : 'Cztery rundy nauki boksu za pieniądze. Sędziowie widzą to po twojej stronie.';
    tone = 'good';
  } else {
    const half = Math.round(inv.prize / 2 / 100) * 100;
    s.money += half;
    s.totalEarned += half;
    const ko = rng.chance(0.3);
    s.wear = clamp(s.wear + (ko ? 6 : 3), 0, 100);
    s.rep = clamp(s.rep - 1, 0, 100);
    if (ko) s.media = clamp(s.media - 1, 0, 100);
    lines.push(ko ? 'Przegrana przez nokaut w 2. rundzie' : 'Przegrana na punkty', `Połowa gaży: ${half.toLocaleString('pl-PL')} zł, zużycie +${ko ? 6 : 3}`);
    text = ko ? 'Bokser trafił cię czysto w szczękę. W boksie nie ma obaleń, które by cię uratowały.' : 'Bokser był szybszy na nogach i lepszy w wymianach. Cenna, choć bolesna lekcja.';
    tone = 'bad';
  }
  return { title: inv.title, lines, text, tone, win: ok };
}
