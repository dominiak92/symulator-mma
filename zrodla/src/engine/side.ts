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
const GRAPPLE1_PRIZE = [0, 4000, 12000, 30000, 70000];
const KICK_PURSE = [0, 3500, 12000, 30000, 80000];
const FILM_PAY = [0, 6000, 18000, 45000, 120000];
const CAMP_FEE = [0, 2500, 6000, 15000, 30000];
const PODCAST_PAY = [0, 500, 2000, 6000, 15000];
const CELEB_PAY = [0, 8000, 25000, 60000, 140000];

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
  if (s.tier >= 2 && s.stats.bjj >= 50) k.push('grapple1');
  if (s.tier >= 1) k.push('kick');
  if (s.media >= 35) k.push('film');
  if (s.tier >= 2) k.push('camp');
  k.push('charity');
  if (s.media >= 15 || s.tier >= 2) k.push('podcast');
  if (s.tier >= 2 && s.media >= 30) k.push('celebrity');
  return k;
}

function pickCity(rng: Rng, s: GameState) {
  return s.tier >= 3 ? rng.pick(['Londyn', 'Amsterdam', 'Praga', 'Berlin', 'Sztokholm', 'Barcelona']) : rng.pick(TOURNEY_CITIES);
}

export function buildInvite(rng: Rng, s: GameState): SideInvite | null {
  const kinds = inviteKinds(s);
  if (!kinds.length) return null;
  // grappling najczęściej: to najbardziej naturalny dodatek do MMA
  const W: Record<SideKind, number> = { grappling: 3, boxing: 2, kick: 1.5, seminar: 1.6, grapple1: 1.2, film: 1, camp: 1.4, charity: 1.2, podcast: 1.4, celebrity: 0.9 };
  const kind = rng.weighted(kinds.map((k) => ({ item: k, w: W[k] })));
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
  if (kind === 'grapple1') {
    const who = rng.pick(['brazylijskim mistrzem świata w BJJ', 'zapaśnikiem z kadry olimpijskiej', 'legendą submission only', 'mistrzem Europy w no-gi']);
    return {
      kind,
      title: `Superfight grapplingowy · ${city}`,
      place: city,
      fee: 0,
      prize: GRAPPLE1_PRIZE[t],
      text: `Gala grapplingowa w mieście ${city} chce pojedynku jeden na jeden z ${who}. Dziesięć minut, wygrana tylko przez poddanie albo na punkty. Za samo wyjście połowa stawki.`,
    };
  }
  if (kind === 'kick') {
    return {
      kind,
      title: `Gala kickboxingu · ${city}`,
      place: city,
      fee: 0,
      prize: KICK_PURSE[t],
      text: `Federacja kickboxingu robi galę w mieście ${city} i chce kogoś z MMA. Trzy rundy, ciosy, kopnięcia i kolana, bez obaleń. Kondycja i szczęka zostaną sprawdzone.`,
    };
  }
  if (kind === 'camp') {
    const who = rng.pick([
      { t: 'Obóz zapaśniczy w Dagestanie', pl: 'Machaczkała', st: 'wrest' as StatKey, txt: 'Tydzień w górach u trenera, który wychował trzech mistrzów świata. Biegi pod górę o piątej rano i sparingi z chłopakami, którzy nie znają słowa „odpuść”.' },
      { t: 'Tydzień w tajskim campie', pl: 'Phuket', st: 'stand' as StatKey, txt: 'Phuket, dwa treningi dziennie z byłymi mistrzami Lumpinee. Klincz, łokcie i tarcze w czterdziestostopniowym upale.' },
      { t: 'Tydzień u legendy BJJ w Rio', pl: 'Rio de Janeiro', st: 'bjj' as StatKey, txt: 'Mata w Rio, czarne pasy na każdym rogu i trener, który pamięta pierwsze turnieje vale tudo. Każdy dzień kończy się czyimś duszeniem.' },
      { t: 'Obóz kondycyjny w Alpach', pl: 'Alpy', st: 'cardio' as StatKey, txt: 'Trening na wysokości: rower, biegi i interwały w rozrzedzonym powietrzu. Płuca palą, ale serce będzie jak dzwon.' },
    ]);
    return { kind, title: who.t, place: who.pl, fee: CAMP_FEE[t], prize: 0, stat: who.st, text: `${who.txt} Bez walki, bez nagrody, tylko praca.` };
  }
  if (kind === 'charity') {
    const ev = rng.pick([
      { t: 'Gala charytatywna dla szpitala dziecięcego', txt: 'Pokazowa walka w rękawicach 16 uncji, licytacja twoich spodenek i zdjęcia z dzieciakami. Zero pieniędzy, za to dużo dobrego.' },
      { t: 'Trening z dzieciakami z domu dziecka', txt: 'Sobota w sali gimnastycznej z trzydziestką dzieciaków. Pokazujesz podstawy, rozdajesz rękawice od Ground Game i słuchasz, jak jeden chce zostać „takim jak ty”.' },
      { t: 'Bieg dla hospicjum', txt: 'Dziesięć kilometrów w koszulce z numerem i z kamerą lokalnej telewizji obok. Ludzie zbierają pieniądze za każdy twój kilometr.' },
    ]);
    return { kind, title: ev.t, place: pickCity(rng, s), fee: 0, prize: 0, text: ev.txt };
  }
  if (kind === 'podcast') {
    const show = rng.pick(['„Po gongu”', '„Klatka bez cenzury”', '„Szatnia”', '„Rozmowy przy macie”']);
    return { kind, title: `Podcast ${show}`, place: 'Warszawa', fee: 0, prize: PODCAST_PAY[t], text: `Trzy godziny rozmowy w podcaście ${show}. Prowadzący lubi dopytywać o rywali, pieniądze i kulisy federacji. Jedno nieostrożne zdanie i klip żyje własnym życiem.` };
  }
  if (kind === 'celebrity') {
    const who = rng.pick(['raper z pierwszej trójki listy przebojów', 'aktor z serialu, który ma walczyć na gali freak fightów', 'piłkarz po karierze, który chce „spróbować MMA”', 'youtuber z dwoma milionami subskrypcji']);
    return { kind, title: 'Trenujesz celebrytę', place: 'Warszawa', fee: 0, prize: Math.round((CELEB_PAY[t] * (1 + s.media / 150)) / 500) * 500, text: `Dzwoni menedżer: ${who} chce, żebyś przez miesiąc był jego trenerem personalnym. Kasa świetna, nagrania pójdą w internet, a w środowisku powiedzą, że uczysz cyrk.` };
  }
  if (kind === 'film') {
    const role = rng.pick([
      { title: 'Rola w filmie akcji', text: 'Reżyser kina akcji szuka prawdziwego wojownika do roli ochroniarza głównego bohatera. Trzy dni na planie, jedna scena walki i kwestia do zapamiętania.' },
      { title: 'Reklama napoju energetycznego', text: 'Marka napojów chce cię w reklamie: biegasz po schodach o świcie i otwierasz puszkę do kamery. Kasa dobra, koledzy z klubu będą mieli memy.' },
      { title: 'Gościnny występ w serialu', text: 'Serial obyczajowy chce cię w odcinku o „groźnym zawodniku z sąsiedztwa”. Grasz siebie, tylko bardziej.' },
    ]);
    return { kind, title: role.title, place: city, fee: 0, prize: Math.round((FILM_PAY[t] * (1 + s.media / 120)) / 500) * 500, text: role.text };
  }
  return {
    kind,
    title: `Seminarium · ${city}`,
    place: city,
    fee: 0,
    prize: Math.round((SEMINAR_PAY[t] * (1 + s.media / 100)) / 500) * 500,
    text: rng.pick([
      `Klub z miasta ${city} zaprasza cię na weekendowe seminarium. Pokazujesz swoje techniki, robisz zdjęcia z ludźmi i wracasz z kasą. Tylko że to weekend bez treningu tuż przed walką.`,
      `Sieć klubów z miasta ${city} robi zjazd zawodników i chce, żebyś poprowadził dwie godziny o swojej specjalności. Sala na sto osób już wyprzedana.`,
      `Policja w mieście ${city} szuka instruktora na szkolenie z obezwładniania. Dzień z antyterrorystami, kawa z termosu i dobra kasa.`,
    ]),
  };
}

/** Szansa na wygraną pojedynczej walki w danym wydarzeniu (0..1). */
export function sideChance(s: GameState, kind: SideKind, form = 0): number {
  const st = s.stats;
  const lvl = TIER_LEVEL[Math.max(1, s.tier)];
  if (kind === 'grappling') return clamp(0.5 + (st.bjj * 0.65 + st.wrest * 0.35 - (lvl + 4)) / 28 + form / 100, 0.12, 0.88);
  if (kind === 'boxing') return clamp(0.5 + (st.stand * 0.7 + st.chin * 0.3 - (lvl + 2)) / 28 + form / 100, 0.1, 0.85);
  if (kind === 'grapple1') return clamp(0.5 + (st.bjj * 0.75 + st.wrest * 0.25 - (lvl + 8)) / 26 + form / 100, 0.1, 0.85);
  if (kind === 'kick') return clamp(0.5 + (st.stand * 0.6 + st.cardio * 0.2 + st.chin * 0.2 - (lvl + 3)) / 28 + form / 100, 0.1, 0.85);
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
  if (inv.kind === 'camp') {
    s.money -= inv.fee;
    const st = inv.stat ?? 'wrest';
    bump(s, st, 2);
    s.potential[st] = clamp(s.potential[st] + 1, 1, 99);
    s.wear = clamp(s.wear + 1, 0, 100);
    const name = { stand: 'Stójka', wrest: 'Zapasy', bjj: 'Parter', cardio: 'Kondycja', chin: 'Szczęka', iq: 'Taktyka' }[st];
    return { title: inv.title, lines: [`${name} +2, potencjał +1`, `Koszt: ${inv.fee.toLocaleString('pl-PL')} zł`, 'Zużycie +1'], text: 'Wracasz zmęczony jak nigdy, ale z rzeczami, których w swojej sali nie dałoby się nauczyć.', tone: 'purple', win: true };
  }
  if (inv.kind === 'charity') {
    s.rep = clamp(s.rep + 4, 0, 100);
    s.media = clamp(s.media + 2, 0, 100);
    s.flags.charity = (s.flags.charity ?? 0) + 1;
    return { title: inv.title, lines: ['Reputacja +4, media +2', 'Bez pieniędzy'], text: 'Zdjęcie z dzieciakami obiega lokalne media. Kilku sponsorów pisze, że „takich ludzi chcą wspierać”.', tone: 'good', win: true };
  }
  if (inv.kind === 'podcast') {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    const gaffe = rng.chance(0.25);
    s.media = clamp(s.media + (gaffe ? 4 : 2), 0, 100);
    if (gaffe) s.rep = clamp(s.rep - 3, 0, 100);
    return {
      title: inv.title,
      lines: [gaffe ? 'Media +4, reputacja −3 (klip z nieostrożnym zdaniem)' : 'Media +2', `Wypłata: ${inv.prize.toLocaleString('pl-PL')} zł`],
      text: gaffe ? 'Po trzech godzinach mówisz o jedno zdanie za dużo o federacji. Klip ma pół miliona wyświetleń, a prezes nie odbiera od ciebie telefonu.' : 'Spokojna, mądra rozmowa. W komentarzach ludzie piszą, że nie spodziewali się takiej głowy po „zawodniku MMA”.',
      tone: gaffe ? 'neutral' : 'good',
      win: !gaffe,
    };
  }
  if (inv.kind === 'celebrity') {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.media = clamp(s.media + 3, 0, 100);
    s.rep = clamp(s.rep - 2, 0, 100);
    return { title: inv.title, lines: [`Wypłata: ${inv.prize.toLocaleString('pl-PL')} zł`, 'Media +3, reputacja −2'], text: 'Miesiąc treningów z kimś, kto po pięciu minutach siada na ławce. Nagrania mają miliony wyświetleń, a w twoim klubie nikt o tym nie rozmawia.', tone: 'good', win: true };
  }
  if (inv.kind === 'film') {
    s.money += inv.prize;
    s.totalEarned += inv.prize;
    s.media = clamp(s.media + 3, 0, 100);
    s.rep = clamp(s.rep - 1, 0, 100);
    s.flags.filmRoles = (s.flags.filmRoles ?? 0) + 1;
    return {
      title: inv.title,
      lines: [`Wypłata: ${inv.prize.toLocaleString('pl-PL')} zł`, 'Media +3, reputacja −1 (środowisko się podśmiewa)'],
      text: 'Na planie wszyscy mówią do ciebie „panie mistrzu”. W internecie klip robi furorę, a w szatni słyszysz „o, aktor przyszedł”.',
      tone: 'good',
      win: true,
    };
  }
  s.money -= inv.fee;
  if (inv.kind === 'grapple1') {
    const p = sideChance(s, 'grapple1', form);
    const ok = rng.chance(p);
    const show = Math.round(inv.prize / 2 / 100) * 100;
    s.money += show + (ok ? inv.prize - show : 0);
    s.totalEarned += show + (ok ? inv.prize - show : 0);
    if (ok) {
      bump(s, 'bjj', 1);
      s.media = clamp(s.media + 2, 0, 100);
      s.rep = clamp(s.rep + 2, 0, 100);
      s.flags.grapplingGold = (s.flags.grapplingGold ?? 0) + 1;
    }
    const lines = [ok ? (rng.chance(0.5) ? 'Wygrana przez duszenie w 7. minucie' : 'Wygrana na punkty po dziesięciu minutach') : rng.chance(0.5) ? 'Odklepujesz dźwignię na kolano' : 'Przegrana na punkty', ok ? `Parter +1, media +2, reputacja +2, cała stawka ${inv.prize.toLocaleString('pl-PL')} zł` : `Za wyjście: ${show.toLocaleString('pl-PL')} zł`];
    if (!s.injury && rng.chance(0.05)) {
      s.injury = { name: 'naciągnięte więzadło w kolanie', seasons: 1, penalty: 3 };
      lines.push('Kontuzja: naciągnięte więzadło w kolanie (testy −3 pkt)');
    }
    return { title: inv.title, lines, text: ok ? 'Specjalista od chwytów musiał uznać wyższość „tego z MMA”. Klip z duszenia krąży po wszystkich grupach grapplingowych.' : 'Na macie bez ciosów to był jego świat. Ale pieniądze za wyjście są w kieszeni, a lekcja bezcenna.', tone: ok ? 'purple' : 'neutral', win: ok };
  }
  if (inv.kind === 'kick') {
    const p = sideChance(s, 'kick', form);
    const ok = rng.chance(p);
    if (ok) {
      bump(s, rng.chance(0.5) ? 'stand' : 'cardio', 1);
      s.money += inv.prize;
      s.totalEarned += inv.prize;
      s.media = clamp(s.media + 2, 0, 100);
      s.flags.kickWins = (s.flags.kickWins ?? 0) + 1;
      return { title: inv.title, lines: [rng.chance(0.3) ? 'Wygrana przez nokaut kolanem' : 'Wygrana na punkty po trzech rundach', `Stójka albo kondycja +1, gaża ${inv.prize.toLocaleString('pl-PL')} zł, media +2`], text: 'Kickbokserzy myśleli, że „ten z MMA” umie tylko obalać. Myśleli źle.', tone: 'good', win: true };
    }
    const half = Math.round(inv.prize / 2 / 100) * 100;
    s.money += half;
    s.totalEarned += half;
    const ko = rng.chance(0.25);
    s.wear = clamp(s.wear + (ko ? 5 : 3), 0, 100);
    s.rep = clamp(s.rep - 1, 0, 100);
    return { title: inv.title, lines: [ko ? 'Przegrana przez nokaut po kopnięciu na głowę' : 'Przegrana na punkty', `Połowa gaży: ${half.toLocaleString('pl-PL')} zł, zużycie +${ko ? 5 : 3}`], text: ko ? 'Wysokie kopnięcie, którego nie widziałeś. Obudziłeś się już w narożniku.' : 'Kickbokser był szybszy na nogach i lepiej czytał dystans.', tone: 'bad', win: false };
  }
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
