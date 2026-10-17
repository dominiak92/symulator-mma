// Zdarzenia pieniężne: życie dokłada albo zabiera. Kwoty liczone od zarobków zawodnika,
// żeby amatora nie wbić w ziemię, a gwiazdy nie „rozpieścić” śmiesznymi sumami.
import type { EventDef } from './events';
import type { GameState } from './types';

const vary = (s: GameState, arr: string[]) => arr[(s.season * 5 + s.age) % arr.length];

/** Ile mniej więcej zarabiasz w sezonie (gaże + premie + sponsorzy). */
export function seasonIncome(s: GameState): number {
  const floor = [2500, 9000, 40000, 120000, 300000][s.tier] ?? 2500;
  if (s.tier === 0) return floor;
  const c = s.contract;
  const purses = c.purse * c.fights + c.winBonus * Math.ceil(c.fights / 2);
  const sponsors = s.sponsors.reduce((a, b) => a + b.perSeason, 0);
  return Math.max(floor, purses + sponsors);
}

/** Kwota jako ułamek rocznych zarobków, zaokrąglona „po ludzku”. */
export function cash(s: GameState, frac: number, min = 100, max = Infinity): number {
  const raw = Math.min(max, Math.max(min, seasonIncome(s) * frac));
  const step = raw < 1000 ? 50 : raw < 10000 ? 100 : raw < 100000 ? 500 : 1000;
  return Math.round(raw / step) * step;
}

/** Zawodnik z ekipy Ground Game: sprzęt pokrywa sponsor. */
export const inBanda = (s: GameState) => s.sponsors.some((x) => x.name === 'Ground Game');

const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;

export const MONEY_EVENTS: EventDef[] = [
  {
    id: 'skrzynia_passat',
    title: 'Skrzynia biegów',
    weight: 2,
    cond: (s) => s.age >= 19 && s.tier <= 2,
    text: (s) =>
      vary(s, [
        `Znowu padła skrzynia biegów w passacie. Mechanik kręci głową: „${zl(cash(s, 0.09, 600, 9000))} i będzie jak nowa. Prawie.”`,
        `W drodze na trening passat wydaje dźwięk, którego nie powinien wydawać żaden samochód. Diagnoza: skrzynia. Wycena: ${zl(cash(s, 0.09, 600, 9000))}.`,
      ]),
    choices: (s) => [
      { label: 'Naprawiasz u mechanika', desc: 'Drogo, ale na gwarancji.', effects: { money: -cash(s, 0.09, 600, 9000) } },
      {
        label: 'Szwagier „ogarnie”',
        desc: 'Taniej, w garażu, przy grillu.',
        chance: 55,
        success: { money: -cash(s, 0.03, 200, 3000), note: 'jeździ, nie pytaj jak' },
        fail: { money: -cash(s, 0.12, 800, 12000), note: 'szwagier rozkręcił, nie skręcił' },
        successText: 'Szwagier wymienia skrzynię ze szrotu w jedno popołudnie. Jeździ. Nie pytasz jak.',
        failText: 'Po tygodniu skrzynia ze szrotu się sypie. Kończy się u mechanika i to jeszcze drożej.',
      },
      { label: 'Jeździsz autobusem', desc: 'Za darmo, ale godzina w jedną stronę.', effects: { form: -1, note: 'MPK zamiast passata' } },
    ],
  },
  {
    id: 'kumpel_z_maty_firma',
    title: 'Kumpel z maty',
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) =>
      vary(s, [
        `Kumpel, z którym kiedyś rolowałeś na każdym treningu, otworzył firmę z oknami. Chce cię wesprzeć przed najbliższą walką: ${zl(cash(s, 0.08, 600, 25000))} za logo na banerze.`,
        `Stary znajomy z maty prowadzi teraz warsztat. Dzwoni: „Słuchaj, mam ${zl(cash(s, 0.08, 600, 25000))}, wrzucę cię na naklejki i jedziemy”.`,
      ]),
    choices: (s) => [
      { label: 'Bierzesz i dziękujesz', desc: 'Logo na banerze, zdjęcie z ekipą.', effects: { money: cash(s, 0.08, 600, 25000), relations: 1 } },
      { label: 'Bierzesz i robisz relację', desc: 'Filmik z warsztatu, oznaczasz firmę.', effects: { money: cash(s, 0.08, 600, 25000), media: 1 } },
      { label: 'Odmawiasz', desc: 'Kumpel dopiero zaczyna, niech się rozkręci.', effects: { rep: 1, relations: 2 } },
    ],
  },
  {
    id: 'fotoradar',
    title: 'List z fotoradaru',
    weight: 2,
    cond: (s) => s.age >= 19,
    text: (s) => `W skrzynce koperta: zdjęcie twojego auta, 82 km/h w terenie zabudowanym, w drodze na sparing. Do zapłaty ${zl(cash(s, 0.02, 200, 1500))}.`,
    choices: (s) => [
      { label: 'Płacisz', desc: 'Lekcja kosztuje.', effects: { money: -cash(s, 0.02, 200, 1500) } },
      { label: 'Odwołujesz się', desc: 'Piszesz pismo, że to nie ty prowadziłeś.', chance: 30, success: { note: 'umorzone' }, fail: { money: -cash(s, 0.03, 300, 2500), note: 'z odsetkami' }, successText: 'Sprawa umorzona. Nie pytaj, jak.', failText: 'Odwołanie odrzucone. Płacisz więcej, z kosztami.' },
    ],
  },
  {
    id: 'zwrot_podatku',
    title: 'Zwrot podatku',
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) => `Księgowa dzwoni z dobrą wiadomością: z rozliczenia wychodzi zwrot ${zl(cash(s, 0.06, 400))}. Pierwszy raz w życiu urząd coś ci oddaje.`,
    choices: (s) => [
      { label: 'Odkładasz', desc: 'Na gorsze czasy.', effects: { money: cash(s, 0.06, 400) } },
      { label: 'Nowy sprzęt dla klubu', desc: 'Worki dla dzieciaków z sekcji.', effects: { money: Math.round(cash(s, 0.06, 400) / 3), rep: 2, relations: 1 } },
    ],
  },
  {
    id: 'korekta_pit',
    title: 'Pismo z urzędu',
    weight: 2,
    cond: (s) => s.tier >= 2,
    text: (s) => `Urząd skarbowy znalazł błąd w twoim zeznaniu sprzed dwóch lat. Dopłata z odsetkami: ${zl(cash(s, 0.05, 1000))}.`,
    choices: (s) => [
      { label: 'Płacisz od razu', desc: 'Święty spokój.', effects: { money: -cash(s, 0.05, 1000) } },
      { label: 'Bierzesz doradcę', desc: 'Kosztuje, ale może coś wywalczy.', chance: 50, success: { money: -cash(s, 0.02, 500), note: 'część umorzona' }, fail: { money: -cash(s, 0.07, 1500), note: 'doradca też chce zapłaty' }, successText: 'Doradca znajduje ulgę, o której nie miałeś pojęcia. Płacisz mniej niż połowę.', failText: 'Urząd się nie ugina, a doradca wystawia fakturę.' },
    ],
  },
  {
    id: 'zalane_mieszkanie',
    title: 'Sąsiad z góry',
    weight: 2,
    cond: (s) => s.age >= 20,
    text: () => 'Wracasz z treningu, a z sufitu w kuchni kapie. Sąsiad z góry zostawił odkręconą pralkę i wyjechał na Mazury.',
    choices: (s) => [
      { label: 'Remontujesz sam', desc: 'Szpachla, farba i weekend z głowy.', effects: { money: -cash(s, 0.03, 300, 2500), form: -1 } },
      { label: 'Ubezpieczenie', desc: 'Formularze, rzeczoznawca, czekanie.', chance: 60, success: { money: cash(s, 0.02, 200, 1500), note: 'nawet coś zostało' }, fail: { money: -cash(s, 0.05, 500, 25000), note: 'nie obejmuje zalania z góry' }, successText: 'Ubezpieczyciel płaci więcej, niż kosztował remont. Pierwszy raz w historii.', failText: 'Okazuje się, że polisa nie obejmuje zalania z góry. Płacisz sam, i to więcej.' },
    ],
  },
  {
    id: 'seminarium',
    title: 'Seminarium w klubie',
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 12,
    text: (s) => `Klub z twojego województwa zaprasza cię na seminarium. Dwie godziny techniki i zdjęcia z dzieciakami, ${zl(cash(s, 0.07, 500, 35000))} do ręki.`,
    choices: (s) => [
      { label: 'Jedziesz', desc: 'Pokazujesz swoje ulubione techniki.', effects: { money: cash(s, 0.07, 500, 35000), rep: 1, stats: { iq: 1 } } },
      { label: 'Odpuszczasz', desc: 'Weekend na regenerację.', effects: { wear: -2 } },
    ],
  },
  {
    id: 'wesele_kuzyna',
    title: 'Wesele kuzyna',
    weight: 2,
    cond: (s) => s.age >= 20,
    text: () => 'Kuzyn się żeni. Ciocia już rozpowiada, że „ten od bijatyk” na pewno da porządną kopertę.',
    choices: (s) => [
      { label: 'Gruba koperta', desc: 'Rodzina pamięta takie rzeczy.', effects: { money: -cash(s, 0.04, 400, 15000), relations: 3 } },
      { label: 'Skromna koperta', desc: 'Ciocia zrobi minę.', effects: { money: -cash(s, 0.015, 150, 3000), relations: -1 } },
      { label: 'Nie jedziesz, obóz', desc: 'Wysyłasz życzenia na Messengerze.', effects: { relations: -3, form: 1 } },
    ],
  },
  {
    id: 'zbiorka_kibicow',
    title: 'Zrzutka kibiców',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 30,
    text: (s) => `Kibice z twojego miasta założyli zrzutkę „na obóz dla naszego chłopaka”. Zebrali ${zl(cash(s, 0.08, 800, 50000))}.`,
    choices: (s) => [
      { label: 'Przyjmujesz', desc: 'Dziękujesz w filmiku i obiecujesz walkę na całego.', effects: { money: cash(s, 0.08, 800, 50000), media: 2, form: 1 } },
      { label: 'Przekazujesz na sekcję dzieci', desc: 'Niech młodzi mają rękawice.', effects: { rep: 4, media: 3, relations: 1 } },
    ],
  },
  {
    id: 'kradziez_torby',
    title: 'Skradziona torba',
    weight: 2,
    cond: (s) => !inBanda(s),
    text: () => 'Ktoś wyniósł z szatni twoją torbę. Rękawice, ochraniacze, rashguard i słuchawki. Kamera na korytarzu „akurat nie działała”.',
    choices: (s) => [
      { label: 'Kupujesz wszystko nowe', desc: 'Przynajmniej pachnie nowością.', effects: { money: -cash(s, 0.03, 250, 4000), form: 1 } },
      { label: 'Pożyczasz od klubowiczów', desc: 'Za duże rękawice, za ciasny rashguard.', effects: { money: -cash(s, 0.008, 50, 500), form: -1, relations: 1 } },
    ],
  },
  // ---------- Sprzęt: bez sponsora płacisz, w Ground Game Bandzie sponsor pokrywa ----------
  {
    id: 'pies_rekawice',
    title: 'Pies i rękawice',
    weight: 2,
    cond: (s) => s.age >= 19 && !inBanda(s),
    text: () => 'Zostawiłeś torbę w przedpokoju. Pies uznał, że rękawice sparingowe pachną najlepiej w całym mieszkaniu. Zostały z nich strzępy i zadowolony pies.',
    choices: (s) => [
      { label: 'Kupujesz nowe', desc: 'Dobre rękawice to dobre ręce.', effects: { money: -cash(s, 0.02, 350, 1500) } },
      { label: 'Sklejasz taśmą', desc: 'Jakoś to będzie.', effects: { form: -1, note: 'taśma odkleja się na trzecim sparingu' } },
    ],
  },
  {
    id: 'pies_rekawice_gg',
    title: 'Pies i rękawice',
    brand: 'banda',
    weight: 3,
    cond: (s) => s.age >= 19 && inBanda(s),
    text: () => 'Pies pogryzł ci rękawice sparingowe na strzępy. Na szczęście jesteś w Ground Game Bandzie: piszesz do sponsora i nowe są u ciebie po dwóch dniach. Za darmo.',
    choices: () => [
      { label: 'Wrzucasz unboxing', desc: 'Pies w roli głównej, oznaczasz Ground Game.', effects: { media: 2, form: 1, note: 'nowe rękawice od sponsora' } },
      { label: 'Po prostu dziękujesz', desc: 'Krótka wiadomość i na trening.', effects: { form: 1, note: 'nowe rękawice od sponsora' } },
    ],
  },
  {
    id: 'kradziez_torby_gg',
    title: 'Skradziona torba',
    brand: 'banda',
    weight: 2,
    cond: (s) => inBanda(s),
    text: () => 'Ktoś wyniósł z szatni twoją torbę ze sprzętem. Dzwonisz do Ground Game. Pół godziny później masz potwierdzenie: nowy rashguard, spodenki i rękawice jadą do ciebie kurierem.',
    choices: () => [
      { label: 'Trenujesz w nowym', desc: 'Pachnie nowością, leży jak ulał.', effects: { form: 1, note: 'sponsor pokrył cały sprzęt' } },
    ],
  },
  {
    id: 'rashguard_rozdarty',
    title: 'Rozdarty rashguard',
    weight: 2,
    cond: (s) => s.tier >= 1,
    text: (s) =>
      inBanda(s)
        ? 'Na ostatnim sparingu rozdarłeś rashguard od szyi do pasa. Ground Game wysyła nowy komplet przed walką, z twoim nazwiskiem na rękawie.'
        : 'Na ostatnim sparingu rozdarłeś rashguard od szyi do pasa. Tydzień przed walką. Ten na wagę też już pamięta lepsze czasy.',
    choices: (s) =>
      inBanda(s)
        ? [{ label: 'Odbierasz paczkę', desc: 'Komplet na walkę od sponsora.', effects: { form: 1, media: 1, note: 'sprzęt od Ground Game' } }]
        : [
            { label: 'Kupujesz nowy komplet', desc: 'Rashguard i spodenki na walkę.', effects: { money: -cash(s, 0.015, 300, 1200) } },
            { label: 'Walczysz w starym', desc: 'Zszyty przez mamę.', effects: { form: -1, relations: 1 } },
          ],
  },
  {
    id: 'pizzeria_reklama',
    title: 'Pizzeria spod bloku',
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: (s) => `Właściciel pizzerii spod bloku chce cię na plakacie: „Pizza Mistrza” z podwójnym salami. Płaci ${zl(cash(s, 0.04, 400, 15000))} i dożywotnią darmową pizzę.`,
    choices: (s) => [
      { label: 'Robisz zdjęcie z pizzą', desc: 'Z miną zwycięzcy.', effects: { money: cash(s, 0.04, 400, 15000), media: 1, rep: -1, form: -1 } },
      { label: 'Tylko kasa, bez pizzy', desc: 'Dieta przed walką.', effects: { money: cash(s, 0.04, 400, 15000), rep: -1 } },
      { label: 'Odmawiasz', desc: 'Dietetyk by cię zabił.', effects: { form: 1 } },
    ],
  },
  {
    id: 'stypendium_miasta',
    title: 'Stypendium sportowe',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 3 && s.rep >= 20,
    text: (s) => `Rada miasta przyznaje ci stypendium sportowe: ${zl(cash(s, 0.09, 1500, 25000))}. Trzeba tylko przyjść na sesję i potrzymać czek.`,
    choices: (s) => [
      { label: 'Idziesz na sesję', desc: 'Garnitur, uśmiech, zdjęcie z burmistrzem.', effects: { money: cash(s, 0.09, 1500, 25000), rep: 2 } },
      { label: 'Wysyłasz trenera', desc: 'Ty masz trening.', effects: { money: cash(s, 0.09, 1500, 25000), relations: -1 } },
    ],
  },
  {
    id: 'odszkodowanie',
    title: 'Stłuczka na parkingu',
    weight: 4,
    cond: (s) => s.age >= 19,
    text: () => 'Ktoś przytarł ci auto na parkingu pod halą. Zostawił kartkę z numerem i przeprosinami. Uczciwość jeszcze istnieje.',
    choices: (s) => [
      { label: 'Bierzesz odszkodowanie', desc: 'Z jego OC.', effects: { money: cash(s, 0.03, 400, 6000), note: 'rysa zostaje' } },
      { label: 'Machasz ręką', desc: 'To tylko rysa, a gość był miły.', effects: { rep: 1, relations: 1 } },
    ],
  },
  {
    id: 'zus_dzialalnosc',
    title: 'ZUS',
    weight: 2,
    cond: (s) => s.tier >= 1,
    text: (s) => `Pierwszy raz widzisz na koncie, ile kosztuje ZUS za działalność. Księgowa mówi, że ${zl(cash(s, 0.03, 400, 6000))} zaległości trzeba wpłacić do końca miesiąca.`,
    choices: (s) => [
      { label: 'Płacisz', desc: 'Z ciężkim sercem.', effects: { money: -cash(s, 0.03, 400, 6000) } },
      { label: 'Rozkładasz na raty', desc: 'Trzy raty z odsetkami, płacone z budżetu.', effects: { loan: { amount: 0, installment: Math.round((cash(s, 0.03, 400, 6000) * 1.12) / 3 / 10) * 10, count: 3 } } },
    ],
  },
];
