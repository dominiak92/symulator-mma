import type { Stats, StatKey, Style, StartProfile, TourneyStage, WeightKey } from './types';

export const STAT_LABELS: Record<StatKey, string> = {
  stand: 'Stójka',
  wrest: 'Zapasy',
  bjj: 'Parter',
  cardio: 'Kondycja',
  chin: 'Szczęka',
  iq: 'Taktyka',
};

export const STAT_DESC: Record<StatKey, string> = {
  stand: 'boks, kopnięcia, nokauty',
  wrest: 'obalenia i obrona przed nimi',
  bjj: 'duszenia, dźwignie, walka z dołu',
  cardio: 'jak długo masz paliwo',
  chin: 'ile przyjmiesz, zanim zgaśnie światło',
  iq: 'czytanie walki i nerwy',
};

export const STAT_KEYS: StatKey[] = ['stand', 'wrest', 'bjj', 'cardio', 'chin', 'iq'];

export const STYLE_LABELS: Record<Style, string> = {
  boxer: 'Bokser',
  kickboxer: 'Kickbokser',
  wrestler: 'Zapaśnik',
  grappler: 'Parterowiec',
  brawler: 'Zadymiarz',
  allround: 'Wszechstronny',
};

export const STYLE_DESC: Record<Style, string> = {
  boxer: 'Szybkie ręce i dobra garda. Na plecach czuje się jak ryba na piasku.',
  kickboxer: 'Kopie z dystansu i wchodzi kolanem. Obalenia to jego słaby punkt.',
  wrestler: 'Wchodzi w nogi, dociska do siatki i męczy. Na nogach raczej toporny.',
  grappler: 'Na macie jak w domu, szuka szyi i ręki. Stójka do poprawy.',
  brawler: 'Twarda głowa, ciężka ręka, planu B nie ma.',
  allround: 'Wszystkiego po trochu. Bez dziur, ale i bez wielkiej broni.',
};

// Profil statystyk stylu (dodawany do bazy)
export const STYLE_PROFILE: Record<Style, Stats> = {
  boxer: { stand: 10, wrest: -3, bjj: -6, cardio: 2, chin: 1, iq: 3 },
  kickboxer: { stand: 9, wrest: -6, bjj: -4, cardio: 3, chin: -1, iq: 2 },
  wrestler: { stand: -5, wrest: 11, bjj: 2, cardio: 4, chin: 0, iq: 0 },
  grappler: { stand: -6, wrest: 3, bjj: 12, cardio: 0, chin: -2, iq: 2 },
  brawler: { stand: 6, wrest: -3, bjj: -7, cardio: -3, chin: 9, iq: -5 },
  allround: { stand: 2, wrest: 2, bjj: 2, cardio: 1, chin: 0, iq: 1 },
};

export const STAT_TRAINING_DESC: Record<StatKey, string> = {
  stand: 'Worki, tarcze, sparingi bokserskie. Więcej nokautów.',
  wrest: 'Wejścia w nogi, obrona obaleń, praca przy siatce.',
  bjj: 'Duszenia, dźwignie i wstawanie z pleców.',
  cardio: 'Interwały i sprinty pod górkę. Trzecia runda jak pierwsza.',
  chin: 'Szyja, garda, obrona. Trudniej cię wyłączyć.',
  iq: 'Analiza nagrań i taktyka. Lepsze decyzje w walce.',
};

// --- Kategorie wagowe ---
export interface WeightDef {
  label: string; // waga półśrednia
  short: string; // półśrednia
  kg: number;
  mod: Partial<Stats>;
}

export const WEIGHTS: Record<WeightKey, WeightDef> = {
  piorkowa: { label: 'Waga piórkowa', short: 'piórkowa', kg: 66, mod: { cardio: 3, chin: -2 } },
  lekka: { label: 'Waga lekka', short: 'lekka', kg: 70, mod: { cardio: 2, chin: -1 } },
  polsrednia: { label: 'Waga półśrednia', short: 'półśrednia', kg: 77, mod: {} },
  srednia: { label: 'Waga średnia', short: 'średnia', kg: 84, mod: { chin: 1, cardio: -1 } },
  polciezka: { label: 'Waga półciężka', short: 'półciężka', kg: 93, mod: { chin: 2, stand: 1, cardio: -2 } },
  ciezka: { label: 'Waga ciężka', short: 'ciężka', kg: 120, mod: { chin: 3, stand: 2, cardio: -4 } },
};

export const WEIGHT_KEYS: WeightKey[] = ['piorkowa', 'lekka', 'polsrednia', 'srednia', 'polciezka', 'ciezka'];

// --- Turnieje amatorskie ---
export const STAGE_LABELS: Record<TourneyStage, string> = {
  qf: 'Ćwierćfinał',
  sf: 'Półfinał',
  f: 'Finał',
  b: 'Walka o brąz',
};

export const AMATEUR_TOURNEYS = ['Amatorski Puchar Polski MMA', 'Amatorskie Mistrzostwa Polski MMA'];
/** Słabsze zawody na start (gdy trener uzna, że trzeba się jeszcze otrzaskać). */
export const AMATEUR_TOURNEYS_LOCAL = ['Amatorska Liga Wojewódzka MMA', 'Amatorski Turniej o Puchar Wojewody'];
export const TOURNEY_CITIES = ['Gliwice', 'Łódź', 'Puławy', 'Warszawa', 'Grodzisk Mazowiecki', 'Lublin', 'Poznań', 'Wrocław'];

export function amateurDivision(age: number, amFights: number): string {
  if (amFights < 3) return 'pierwszy krok';
  if (age < 18) return 'kadeci';
  if (age < 21) return 'juniorzy';
  return 'seniorzy';
}

export interface StartProfileDef {
  label: string;
  desc: string;
  mult: number | null; // null = bez rankingu
  money: number;
  talent: [number, number];
  intro: string;
}

export const START_PROFILES: Record<StartProfile, StartProfileDef> = {
  osiedle: {
    label: 'Chłopak z osiedla',
    desc: 'Talent jak wypadnie, w kieszeni pusto.',
    mult: 1,
    money: 1500,
    talent: [0.15, 0.85],
    intro:
      'Masz 16 lat. Mama wyjęła z koperty w szafie trzy stówy na pierwsze rękawice. Ojciec mówi, że to sport dla patusów, ale na pierwszy trening i tak cię podwozi.',
  },
  biznes: {
    label: 'Syn biznesmena',
    desc: 'Kasa i znajomości są, talent jak wypadnie.',
    mult: 0.9,
    money: 45000,
    talent: [0.1, 0.75],
    intro:
      'Masz 16 lat. Ojciec ma trzy hurtownie paneli i kolegę, który zna kogoś z federacji. Na pierwszy trening podjeżdżasz Audi. Na macie nikogo to nie obchodzi.',
  },
  junior: {
    label: 'Zapaśnik z kadry juniorów',
    desc: 'Talent ponad średnią i zapasy we krwi. Kasy tyle, ile trzeba.',
    mult: 0.6,
    money: 5000,
    talent: [0.55, 0.9],
    intro:
      'Masz 16 lat i złoto mistrzostw Polski juniorów w zapasach. Trener z sekcji ma żal, że zamieniasz matę na klatkę. Ty już wiesz swoje.',
  },
  wybraniec: {
    label: 'Wybraniec',
    desc: 'Talent nie z tej ziemi. Pasy same się pchają, ale punkty LEGACY się nie liczą.',
    mult: null,
    money: 10000,
    talent: [0.92, 1],
    intro:
      'Masz 16 lat. Na pierwszym sparingu przewracasz trenera. Na drugim jego brata. Na trzecim pod klubem stoi gość w kurtce dużej federacji i nagrywa cię telefonem.',
  },
};

export const DIFFICULTY = {
  normal: { label: 'Normalny', desc: 'Tak, jak to sobie wymyśliliśmy.', mult: 1 },
  hard: { label: 'Trudny', desc: 'Sponsorzy skąpią, rywale są twardsi.', mult: 1.3 },
};

export const SEASON_FORMS: { label: string; mod: number; w: number; tone: 'good' | 'bad' | 'neutral' | 'purple' }[] = [
  { label: 'Forma życia', mod: 9, w: 5, tone: 'purple' },
  { label: 'Świetna forma', mod: 5, w: 12, tone: 'good' },
  { label: 'Dobra forma', mod: 2, w: 23, tone: 'good' },
  { label: 'Normalna forma', mod: 0, w: 30, tone: 'neutral' },
  { label: 'Słabszy rok', mod: -4, w: 20, tone: 'bad' },
  { label: 'Kryzys', mod: -8, w: 10, tone: 'bad' },
];

export const GOOD_FORMS = ['Forma życia', 'Świetna forma', 'Sezon życia'];
export const BAD_FORMS = ['Słabszy rok', 'Kryzys'];

export const VOIVODESHIPS = [
  'Dolnośląskie',
  'Kujawsko-pomorskie',
  'Lubelskie',
  'Lubuskie',
  'Łódzkie',
  'Małopolskie',
  'Mazowieckie',
  'Opolskie',
  'Podkarpackie',
  'Podlaskie',
  'Pomorskie',
  'Śląskie',
  'Świętokrzyskie',
  'Warmińsko-mazurskie',
  'Wielkopolskie',
  'Zachodniopomorskie',
];

export const HOMETOWNS: Record<string, string[]> = {
  Dolnośląskie: ['Wrocław', 'Wałbrzych', 'Legnica', 'Oława'],
  'Kujawsko-pomorskie': ['Bydgoszcz', 'Toruń', 'Włocławek', 'Inowrocław'],
  Lubelskie: ['Lublin', 'Zamość', 'Biała Podlaska', 'Puławy'],
  Lubuskie: ['Zielona Góra', 'Gorzów Wielkopolski', 'Sulechów', 'Żary'],
  Łódzkie: ['Łódź', 'Piotrków Trybunalski', 'Pabianice', 'Kutno'],
  Małopolskie: ['Kraków', 'Tarnów', 'Nowy Sącz', 'Zakopane'],
  Mazowieckie: ['Warszawa', 'Radom', 'Płock', 'Siedlce'],
  Opolskie: ['Opole', 'Kędzierzyn-Koźle', 'Nysa', 'Brzeg'],
  Podkarpackie: ['Rzeszów', 'Przemyśl', 'Krosno', 'Mielec'],
  Podlaskie: ['Białystok', 'Suwałki', 'Łomża', 'Augustów'],
  Pomorskie: ['Gdańsk', 'Gdynia', 'Słupsk', 'Wejherowo'],
  Śląskie: ['Katowice', 'Bytom', 'Częstochowa', 'Rybnik'],
  Świętokrzyskie: ['Kielce', 'Ostrowiec Świętokrzyski', 'Skarżysko-Kamienna', 'Sandomierz'],
  'Warmińsko-mazurskie': ['Olsztyn', 'Elbląg', 'Ełk', 'Giżycko'],
  Wielkopolskie: ['Poznań', 'Kalisz', 'Konin', 'Piła'],
  Zachodniopomorskie: ['Szczecin', 'Koszalin', 'Świnoujście', 'Stargard'],
};

// --- Federacje (fikcyjne) ---
export const TIER_NAMES = ['Amatorka', 'Gale regionalne', 'Polska federacja', 'Europa', 'Światowa federacja'];

export const TIER_FEDS: string[][] = [
  ['Mistrzostwa MMA amatorów'],
  // parodie jak auta w GTA: brzmią znajomo, ale to nie te gale
  ['Babel MMA', 'Armada Fight Night', 'Thunderbolt Fight League'],
  ['XSW – Ekstremalne Starcia Wojowników', 'FAN – Fight Absolute Night'],
  ['Cage Worriers', 'Hexagon MMA', 'Brava CF', 'Oktagram MMA'],
  ['UFL – Ultimate Fighting League', 'Balettor MMA', 'TWO FC – Two Fighting Championship', 'PLF – Professional League of Fighters'],
];

/** Federacje, które trzymają zawodników na wyłączność: płacą trochę więcej, ale nie pozwalają walczyć na innych galach. */
export const EXCLUSIVE_FEDS = ['XSW – Ekstremalne Starcia Wojowników', 'Cage Worriers', 'UFL – Ultimate Fighting League', 'TWO FC – Two Fighting Championship'];
export const EXCLUSIVE_BONUS = 1.08;
export function isExclusiveFed(fed: string) {
  return EXCLUSIVE_FEDS.some((f) => fed.startsWith(f));
}

/** Krótki opis federacji przy ofercie kontraktu (parodie). */
export const FED_NOTES: Record<string, string> = {
  'Oktagram MMA': 'Czesko-słowacka federacja: hale pełne, piwo tanie, a kibice śpiewają przez całą walkę.',
  'Brava CF': 'Gale od Bahrajnu po Brazylię. Dużo latania, dobre hotele.',
  'Cage Worriers': 'Kuźnia talentów z Wysp. Stąd najczęściej idzie się do UFL.',
  'Hexagon MMA': 'Francusko-belgijska gala w sześciokątnej klatce. Sędziowie lubią parter.',
  'UFL – Ultimate Fighting League': 'Najbardziej znana liga na świecie. Pieniądze i sława, ale rywale z samego topu.',
  'Balettor MMA': 'Amerykańska liga, co druga gala w kasynie. Płacą dobrze, a turnieje Grand Prix to szansa na szybki pas.',
  'TWO FC – Two Fighting Championship': 'Azja: Singapur, Bangkok, Manila. Hale na 20 tysięcy i ważenie z badaniem nawodnienia.',
  'PLF – Professional League of Fighters': 'Liga z turniejem i play-offami. Wygrywasz turniej, dostajesz czek na milion.',
};

/** Hale dla federacji z innych kontynentów (reszta bierze listę ze szczebla). */
export const FED_VENUES: Record<string, { city: string; venue: string }[]> = {
  'Oktagram MMA': [
    { city: 'Praga', venue: 'Hala na Libni' },
    { city: 'Bratysława', venue: 'Zimný štadión' },
    { city: 'Ostrawa', venue: 'Hala w Witkowicach' },
  ],
  'Balettor MMA': [
    { city: 'Uncasville', venue: 'Arena w kasynie' },
    { city: 'Los Angeles', venue: 'Forum' },
    { city: 'Dublin', venue: 'Arena Liffey' },
  ],
  'TWO FC – Two Fighting Championship': [
    { city: 'Singapur', venue: 'Indoor Stadium' },
    { city: 'Bangkok', venue: 'Lumpinee Arena' },
    { city: 'Manila', venue: 'Mall of Asia Arena' },
    { city: 'Dżakarta', venue: 'Istora Senayan' },
  ],
  'PLF – Professional League of Fighters': [
    { city: 'Nowy Jork', venue: 'Hulu Theater' },
    { city: 'Rijad', venue: 'Kingdom Arena' },
    { city: 'Atlanta', venue: 'Overtime Elite Arena' },
  ],
};

/** Dziwne gale na walki „na odbudowę” (Słowacja, Czechy, przygraniczne hale). */
export const TUNEUP_GALAS: { gala: string; city: string; venue: string }[] = [
  { gala: 'Tatra Fight Night 4', city: 'Poprad', venue: 'Hala zimowego stadionu' },
  { gala: 'Bitka pod Hradem 9', city: 'Trenczyn', venue: 'Hala sportowa przy zamku' },
  { gala: 'Kemping Fight Show', city: 'Liptowski Mikułasz', venue: 'Namiot przy aquaparku' },
  { gala: 'Noc Wojowników 2', city: 'Dolny Kubin', venue: 'Sala gimnastyczna gimnazjum' },
  { gala: 'Halušky Fight Club 11', city: 'Żylina', venue: 'Hala targowa' },
  { gala: 'Granica Cup', city: 'Czadca', venue: 'Dyskoteka Galaxy' },
];

/** Dziwni sponsorzy, których podsuwa menedżer: kasa jest, gorzej z wizerunkiem. */
export const SHADY_SPONSORS: { name: string; product: string; pitch: string }[] = [
  { name: 'Ulga dla Siedzących', product: 'maść na hemoroidy', pitch: 'W wywiadzie po każdej walce mówisz do kamery: „Po walce siadam bez bólu. Dzięki, Ulga dla Siedzących”.' },
  { name: 'Senior Komfort', product: 'pieluchomajtki dla dorosłych', pitch: 'Wchodzisz do klatki w koszulce z hasłem „Komfort na każdą rundę”. Na ważeniu też.' },
  { name: 'Stopa Wojownika', product: 'spray na grzybicę stóp', pitch: 'Co tydzień filmik: zbliżenie na twoją bosą stopę i psik. Na koniec mówisz „Swędzi? Już nie”.' },
  { name: 'Bąbel-Stop', product: 'syrop na wzdęcia', pitch: 'Na konferencji przed walką wypijasz łyżkę syropu i mówisz: „Jestem lekki jak nigdy”. Rywal będzie miał używanie.' },
  { name: 'Pan Fryzura', product: 'tupeciki i doczepiane grzywki', pitch: 'Na face to face poprawiasz grzywkę z ich kolekcji. Grzywka jest różowa.' },
  { name: 'Babcine Ciepło', product: 'kalesony z wełny owczej', pitch: 'Pozujesz w kalesonach do plakatu gali. Plakat zawiśnie w każdym kiosku w województwie.' },
  { name: 'Talia Osy', product: 'gorset wyszczuplający dla panów', pitch: 'Ważysz się w gorsecie i mówisz do kamery, że to „sekret zbijania wagi”. Komentatorzy płaczą ze śmiechu.' },
  { name: 'Cud-Pięta', product: 'krem na odciski i zrogowacenia', pitch: 'Reklama w telewizji śniadaniowej: smarujesz piętę prowadzącej. Na żywo.' },
  { name: 'Świeży Oddech Mamuta', product: 'pastylki na nieświeży oddech', pitch: 'Przed każdą walką chuchasz do kamery i mówisz „Mamut poleca”. Twój trener nie chce na to patrzeć.' },
  { name: 'Burek & Ty', product: 'szampon 2w1 dla psa i właściciela', pitch: 'Filmik z kąpieli: ty i pies, ta sama butelka. Pies wygląda na bardziej zadowolonego.' },
];

export const NAMES_TUNEUP: NamePool[] = [
  { country: 'Słowacja', flag: '🇸🇰', first: ['Marek', 'Jozef', 'Peter', 'Ľuboš', 'Miroslav', 'Dušan', 'Igor'], last: ['Horváth', 'Kováč', 'Baláž', 'Varga', 'Tóth', 'Šimko', 'Hudák'] },
  { country: 'Czechy', flag: '🇨🇿', first: ['Pavel', 'Radek', 'Zdeněk', 'Jiří', 'Libor'], last: ['Dvořák', 'Procházka', 'Kratochvíl', 'Veselý', 'Pokorný'] },
];
export const TUNEUP_NICKS = ['Dziadek', 'Weteran', 'Tatranský Medveď', 'Kotlina', 'Ostatni Mohikanin', 'Bulwa', 'Taxi', 'Pan Kanapka'];

export const FREAK_FEDS = ['Flame MMA', 'Primo MMA', 'Hype League', 'Klout MMA'];

export const BELT_NAMES = [
  'Mistrz Polski amatorów',
  'Pas gali regionalnej',
  'Pas mistrza Polski',
  'Pas mistrza Europy',
  'Pas mistrza świata',
];

export const RANK_SIZE = [10, 10, 15, 15, 15];

// Średni poziom statystyk rywala na szczeblu
export const TIER_LEVEL = [28, 40, 54, 66, 78];

// Gaże (zł) za walkę na szczeblu, [min, max] przy zerowym rankingu do top 1
export const TIER_PURSE: [number, number][] = [
  [0, 0],
  [1500, 6000],
  [12000, 60000],
  [40000, 160000],
  [90000, 900000],
];

export const TIER_FIGHTS = [4, 3, 3, 3, 2];
export const TIER_ENTRY = [1200, 800, 0, 0, 0]; // opłaty startowe, dojazdy, badania na rok
export const TIER_SHORT = ['AMA', 'REG', 'PL', 'EU', 'ŚW'];

// skrót federacji do nazwy gali (XSW 47)
export function galaPrefix(fed: string): string {
  if (fed.includes(' – ')) return fed.split(' – ')[0];
  return fed;
}

// miasto wojewódzkie, od którego regionalne gale biorą nazwę (np. „Fight Night Rzeszów 12”)
export const REGION_CITY: Record<string, string> = {
  Dolnośląskie: 'Wrocław',
  'Kujawsko-pomorskie': 'Bydgoszcz',
  Lubelskie: 'Lublin',
  Lubuskie: 'Zielona Góra',
  Łódzkie: 'Łódź',
  Małopolskie: 'Kraków',
  Mazowieckie: 'Warszawa',
  Opolskie: 'Opole',
  Podkarpackie: 'Rzeszów',
  Podlaskie: 'Białystok',
  Pomorskie: 'Gdańsk',
  Śląskie: 'Katowice',
  Świętokrzyskie: 'Kielce',
  'Warmińsko-mazurskie': 'Olsztyn',
  Wielkopolskie: 'Poznań',
  Zachodniopomorskie: 'Szczecin',
};

export function regionalFedName(base: string, region: string): string {
  return `${base} ${REGION_CITY[region] ?? region}`;
}

// koszty życia: do 18 lat rodzice, potem rośnie
export function livingCost(age: number): number {
  if (age < 19) return 0;
  if (age < 22) return 14000;
  if (age < 26) return 26000;
  return 36000;
}

// --- Imiona i nazwiska ---
export interface NamePool {
  country: string;
  flag: string;
  first: string[];
  last: string[];
}

export const NAMES_PL: NamePool = {
  country: 'Polska',
  flag: '🇵🇱',
  first: [
    'Kamil', 'Damian', 'Patryk', 'Mateusz', 'Kacper', 'Szymon', 'Dawid', 'Krystian', 'Marcin', 'Łukasz',
    'Michał', 'Bartek', 'Adrian', 'Sebastian', 'Paweł', 'Piotr', 'Konrad', 'Rafał', 'Arkadiusz', 'Norbert',
    'Grzegorz', 'Mariusz', 'Daniel', 'Tomasz', 'Hubert', 'Oskar', 'Igor', 'Wiktor', 'Dominik', 'Przemek',
    'Jakub', 'Filip', 'Wojciech', 'Jarosław', 'Zbigniew', 'Radosław', 'Sławomir', 'Bartosz', 'Artur', 'Krzysztof', 'Maciej', 'Robert', 'Andrzej', 'Jacek', 'Karol', 'Kordian', 'Janusz', 'Leszek', 'Ireneusz', 'Bogdan', 'Marek', 'Waldemar', 'Remigiusz', 'Eryk', 'Fabian', 'Olaf', 'Ksawery', 'Antoni', 'Tymon', 'Bruno',
  ],
  last: [
    'Nowak', 'Kowalczyk', 'Wiśniewski', 'Wójcik', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański',
    'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowski',
    'Grabowski', 'Pawlak', 'Michalski', 'Zając', 'Wróbel', 'Jabłoński', 'Majewski', 'Olszewski', 'Stępień',
    'Malinowski', 'Jaworski', 'Adamczyk', 'Dudek', 'Nowicki', 'Pietrzak', 'Wieczorek', 'Sikora', 'Baran',
    'Rutkowski', 'Michalak', 'Szewczyk', 'Ostrowski', 'Tomaszewski', 'Pietrzyk', 'Duda', 'Zalewski',
    'Wróblewski', 'Jasiński', 'Marciniak', 'Bąk', 'Kaczmarczyk', 'Sadowski', 'Zawadzki', 'Chmielewski',
    'Kubiak', 'Sobczak', 'Wilk', 'Lis', 'Kaczor', 'Kot', 'Bielecki', 'Kalinowski', 'Górski', 'Mazurek', 'Czarnecki', 'Sowa', 'Kołodziej', 'Wawrzyniak', 'Szulc', 'Ziółkowski', 'Borkowski', 'Gajewski', 'Laskowski', 'Mroczek', 'Cieślak', 'Kurek', 'Wrona', 'Kruk', 'Sroka', 'Dziedzic', 'Pająk', 'Wróbel-Kosmala', 'Sosnowski', 'Szczepański', 'Kowalewski', 'Głowacki', 'Urbański', 'Gołębiowski', 'Przybylski', 'Rogalski', 'Kozak', 'Siwiec', 'Furman', 'Kowal', 'Bednarz', 'Kasprzak', 'Tokarski', 'Ślusarczyk', 'Bocian', 'Żak', 'Leśniak', 'Grzelak', 'Kulesza', 'Ptak',
  ],
};

export const NAMES_EU: NamePool[] = [
  { country: 'Niemcy', flag: '🇩🇪', first: ['Lukas', 'Jonas', 'Maximilian', 'Felix', 'Tobias', 'Niklas'], last: ['Becker', 'Hoffmann', 'Schäfer', 'Krüger', 'Wagner', 'Braun', 'Vogel'] },
  { country: 'Czechy', flag: '🇨🇿', first: ['Jakub', 'Ondřej', 'Tomáš', 'Vojtěch', 'Matěj', 'Lukáš'], last: ['Dvořák', 'Novotný', 'Procházka', 'Kučera', 'Veselý', 'Horák'] },
  { country: 'Francja', flag: '🇫🇷', first: ['Mathieu', 'Kevin', 'Yanis', 'Théo', 'Julien', 'Karim'], last: ['Lefèvre', 'Moreau', 'Girard', 'Benali', 'Rousseau', 'Fontaine'] },
  { country: 'Anglia', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', first: ['Liam', 'Callum', 'Jack', 'Kyle', 'Reece', 'Danny'], last: ['Walsh', 'Hughes', 'Barker', 'Fletcher', 'Doyle', 'Turner'] },
  { country: 'Irlandia', flag: '🇮🇪', first: ['Seán', 'Ciarán', 'Darragh', 'Cillian', 'Eoin'], last: ['Byrne', "O'Brien", 'Kavanagh', 'Gallagher', 'Brennan'] },
  { country: 'Szwecja', flag: '🇸🇪', first: ['Erik', 'Oskar', 'Viktor', 'Anton', 'Linus'], last: ['Lindqvist', 'Bergström', 'Holm', 'Ekström', 'Nyberg'] },
  { country: 'Gruzja', flag: '🇬🇪', first: ['Giorgi', 'Levan', 'Davit', 'Irakli', 'Nika'], last: ['Beridze', 'Kapanadze', 'Tsiklauri', 'Gelashvili', 'Jabua'] },
  { country: 'Hiszpania', flag: '🇪🇸', first: ['Álvaro', 'Pablo', 'Sergio', 'Iker', 'Raúl'], last: ['Navarro', 'Romero', 'Castillo', 'Ortega', 'Delgado'] },
  { country: 'Ukraina', flag: '🇺🇦', first: ['Andrij', 'Ołeh', 'Maksym', 'Bohdan', 'Taras'], last: ['Kowalenko', 'Szewczenko', 'Bondarenko', 'Tkaczuk', 'Melnyk'] },
  { country: 'Holandia', flag: '🇳🇱', first: ['Daan', 'Sem', 'Bram', 'Ruben', 'Jesse'], last: ['de Vries', 'van Dijk', 'Bakker', 'Visser', 'Smit'] },
];

export const NAMES_WORLD: NamePool[] = [
  { country: 'USA', flag: '🇺🇸', first: ['Tyler', 'Brandon', 'Jake', 'Marcus', 'Cody', 'Derrick', 'Trey'], last: ['Johnson', 'Miller', 'Carter', 'Hayes', 'Brooks', 'Reed', 'Coleman'] },
  { country: 'Brazylia', flag: '🇧🇷', first: ['Thiago', 'Rafael', 'Gilberto', 'Fabrício', 'Jailton', 'Renato'], last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Barbosa', 'Nunes', 'Moraes'] },
  { country: 'Dagestan', flag: '🇷🇺', first: ['Magomed', 'Islam', 'Abubakar', 'Shamil', 'Zaur'], last: ['Gadzhiev', 'Abdulaev', 'Magomedov', 'Aliev', 'Omarov'] },
  { country: 'Meksyk', flag: '🇲🇽', first: ['Diego', 'Alejandro', 'Brandon', 'Jesús', 'Yair'], last: ['Ramírez', 'Hernández', 'Guzmán', 'Torres', 'Vargas'] },
  { country: 'Australia', flag: '🇦🇺', first: ['Jai', 'Brody', 'Kai', 'Lachlan', 'Mitch'], last: ['Whittaker', 'Ryan', 'Morrison', 'Kerr', 'Doolan'] },
  { country: 'Nigeria', flag: '🇳🇬', first: ['Kamaru', 'Israel', 'Chidi', 'Emeka', 'Tunde'], last: ['Adeyemi', 'Okafor', 'Eze', 'Balogun', 'Nwosu'] },
  { country: 'Japonia', flag: '🇯🇵', first: ['Kai', 'Ryo', 'Takeru', 'Yuto', 'Shinji'], last: ['Tanaka', 'Horiguchi', 'Sato', 'Kimura', 'Nakamura'] },
  { country: 'Kazachstan', flag: '🇰🇿', first: ['Shavkat', 'Yerlan', 'Nurlan', 'Arman', 'Daulet'], last: ['Rakhimov', 'Seitkali', 'Zhumagulov', 'Akhmetov', 'Bekov'] },
];

export const NICKNAMES = [
  'Pitbull', 'Młot', 'Cichy', 'Kosa', 'Byk', 'Dzik', 'Grizzly', 'Snajper', 'Tytan', 'Pirania', 'Wilk', 'Skorpion',
  'Buldożer', 'Żelazny', 'Kowal', 'Tajfun', 'Bestia', 'Szakal', 'Spokojny', 'Profesor', 'Doktor', 'Kat',
  'Gladiator', 'Rzeźnik', 'Łoś', 'Rekin', 'Kobra', 'Anakonda', 'Turbo', 'Diesel', 'Mały', 'Góral', 'Baca',
  'Książę', 'Generał', 'Dynamit', 'Grom', 'Huragan', 'Zadyma', 'Bazooka', 'Kamikaze', 'Hydraulik', 'Ksiądz',
  'Ogórek', 'Kiełbasa', 'Hrabia', 'Wiking', 'Sęk', 'Kret', 'Bober', 'Żubr', 'Sokół', 'Ryś',
  'Szwagier', 'Sołtys', 'Prezes', 'Kombajn', 'Traktor', 'Pączek', 'Czołg', 'Rambo', 'Komornik', 'Mechanik', 'Taksówkarz', 'Dzięcioł', 'Borsuk', 'Jeż', 'Kowboj', 'Szeryf', 'Miś', 'Zbój', 'Janosik', 'Harnaś', 'Lord', 'Barbarzyńca', 'Wulkan', 'Lawina', 'Kafar', 'Dźwig', 'Siekiera', 'Kilof', 'Świder', 'Kaskader', 'Bramkarz', 'Strażak', 'Listonosz', 'Kaloryfer', 'Betoniarka', 'Pierożek', 'Chrzan', 'Pikachu', 'Nocny Marek', 'Gołąb',
];

export const INTL_NICKNAMES = [
  'The Hammer', 'Bad Boy', 'The Machine', 'Iceman', 'Cyborg', 'The Spider', 'Bonecrusher', 'The Eagle',
  'Hurricane', 'The Natural', 'Mad Dog', 'Thunder', 'The Prodigy', 'El Diablo', 'Tank', 'The Reaper',
  'Kid Dynamite', 'Showtime', 'The Assassin', 'Wolverine',
  'The Problem', 'No Love', 'The Count', 'The Eraser', 'The Gentleman', 'Big Ben', 'Lightning', 'The Bull', 'Scorpion King', 'Tarzan', 'The Professor', 'Chaos', 'The Butcher', 'Ironside', 'The Viking', 'Night Train', 'Hitman', 'Jackhammer', 'The Surgeon', 'Captain',
];

export const FREAK_TYPES = [
  { title: 'raper z Radomia', nick: 'Rymowany' },
  { title: 'youtuber od pranków', nick: 'Prankster' },
  { title: 'były strongman', nick: 'Lodówka' },
  { title: 'gwiazda reality show', nick: 'Celebryta' },
  { title: 'influencer fitness', nick: 'Klata' },
  { title: 'streamer od gier', nick: 'Lagujący' },
  { title: 'były piłkarz IV ligi', nick: 'Spalony' },
  { title: 'tiktoker od tańców', nick: 'Trend' },
  { title: 'poseł na urlopie', nick: 'Immunitet' },
  { title: 'kulturysta po czterdziestce', nick: 'Pompka' },
  { title: 'uczestnik randkowego reality show', nick: 'Amant' },
  { title: 'cukiernik z TikToka', nick: 'Babeczka' },
  { title: 'trener personalny celebrytów', nick: 'Coach' },
  { title: 'youtuber od survivalu', nick: 'Przetrwaniec' },
  { title: 'prezenter pogody', nick: 'Niż' },
  { title: 'kulturysta „naturalny” (podobno)', nick: 'Natural' },
  { title: 'wokalista disco polo', nick: 'Refren' },
  { title: 'youtuber, który nigdy nie walczył', nick: 'Teoretyk' },
  { title: 'mówca motywacyjny', nick: 'Mindset' },
  { title: 'mistrz w jedzeniu pierogów', nick: 'Farsz' },
  { title: 'były członek boysbandu', nick: 'Falset' },
  { title: 'kierowca tira z TikToka', nick: 'Kabina' },
  { title: 'radny gminy', nick: 'Uchwała' },
  { title: 'barber gwiazd', nick: 'Fade' },
  { title: 'zawodowy gracz komputerowy', nick: 'Kamper' },
];

// --- Kluby (fikcyjne) ---
export interface ClubTemplate {
  name: string;
  city: string;
  quality: number;
  cost: number;
  specialty: StatKey;
  injuryMod: number;
  desc: string;
  minTier: number;
  crest: CrestSpec;
}

export type CrestShape = 'shield' | 'circle' | 'hex' | 'diamond' | 'badge';
export interface CrestSpec {
  shape: CrestShape;
  bg: string;
  fg: string;
  icon: string;
  text?: string;
}

// Kluby fikcyjne. Część to parodie znanych polskich teamów w stylu aut z GTA: brzmią znajomo, ale to nie te kluby.
export const CLUB_TEMPLATES: ClubTemplate[] = [
  { name: 'Remiza Team', city: '{home}', quality: 1, cost: 0, specialty: 'chin', injuryMod: 1.2, desc: 'Mata w remizie OSP, worek po dziadku. Trener kiedyś stał na bramce w dyskotece.', minTier: 0, crest: { shape: 'shield', bg: '#b91c1c', fg: '#fde68a', icon: 'flame', text: 'RT' } },
  { name: 'Sparta Fight Club', city: '{home}', quality: 2, cost: 3000, specialty: 'stand', injuryMod: 1.0, desc: 'Sala w piwnicy pod blokiem, ale ring, klatka i trener z licencją są.', minTier: 0, crest: { shape: 'circle', bg: '#1e3a8a', fg: '#facc15', icon: 'fist', text: 'SFC' } },
  { name: 'Hutnik Bytom', city: 'Bytom', quality: 2, cost: 4000, specialty: 'wrest', injuryMod: 1.1, desc: 'Sekcja zapasów przy starym klubie hutniczym. Kondycję robi się tu przez cierpienie.', minTier: 0, crest: { shape: 'shield', bg: '#18181b', fg: '#f97316', icon: 'gear', text: 'KSH' } },
  { name: 'Meduza Łódź', city: 'Łódź', quality: 3, cost: 9000, specialty: 'bjj', injuryMod: 0.9, desc: 'Czarne pasy na każdej macie, sala w starej przędzalni. Tu nauczą cię dusić.', minTier: 1, crest: { shape: 'hex', bg: '#581c87', fg: '#f5f5f5', icon: 'wave', text: 'MŁ' } },
  { name: 'Berzerker Brothers', city: 'Wrocław', quality: 3, cost: 11000, specialty: 'stand', injuryMod: 0.9, desc: 'Mocna stójka, twarde sparingi z zawodowcami i dietetyczka, która odbiera telefon.', minTier: 1, crest: { shape: 'circle', bg: '#166534', fg: '#fca5a5', icon: 'bolt', text: 'BB' } },
  { name: 'WZA Fight Team', city: 'Warszawa', quality: 4, cost: 28000, specialty: 'wrest', injuryMod: 0.85, desc: 'Czołowy klub w kraju. Na treningach mijasz się z mistrzami największych gal.', minTier: 2, crest: { shape: 'shield', bg: '#111827', fg: '#01aeee', icon: 'star', text: 'WZA' } },
  { name: 'Barracuda Top Team', city: 'Gdynia', quality: 4, cost: 25000, specialty: 'cardio', injuryMod: 0.85, desc: 'Obozy nad morzem, bieganie po plaży o szóstej rano i przygotowanie motoryczne na serio.', minTier: 2, crest: { shape: 'circle', bg: '#0c4a6e', fg: '#f8fafc', icon: 'wave', text: 'BTT' } },
  { name: 'Czerwony Wąż', city: 'Poznań', quality: 4, cost: 24000, specialty: 'iq', injuryMod: 0.85, desc: 'Klub od lat robiący mistrzów. Tu uczą, jak wygrywać walki głową, a nie tylko pięściami.', minTier: 2, crest: { shape: 'hex', bg: '#991b1b', fg: '#fef2f2', icon: 'snake', text: 'CW' } },
  { name: 'Phuket Top Camp', city: 'Tajlandia', quality: 4, cost: 45000, specialty: 'stand', injuryMod: 1.1, desc: 'Muay thai dwa razy dziennie w 35 stopniach. Wracasz opalony i ostry jak brzytwa.', minTier: 2, crest: { shape: 'diamond', bg: '#c2410c', fg: '#fef3c7', icon: 'palm', text: 'PTC' } },
  { name: 'American Top Dog', city: 'Floryda, USA', quality: 5, cost: 140000, specialty: 'iq', injuryMod: 0.8, desc: 'Światowa czołówka. Pasy wiszą na ścianie, rachunek też robi wrażenie.', minTier: 3, crest: { shape: 'hex', bg: '#0f766e', fg: '#fde047', icon: 'sun', text: 'ATD' } },
  { name: 'Altitude Fight Lab', city: 'Kolorado, USA', quality: 5, cost: 120000, specialty: 'cardio', injuryMod: 0.8, desc: 'Obóz w górach, sztab naukowców i kondycja z kosmosu.', minTier: 3, crest: { shape: 'shield', bg: '#1f2937', fg: '#93c5fd', icon: 'mountain', text: 'AFL' } },
  { name: 'Garaż u Zbyszka', city: '{home}', quality: 1, cost: 0, specialty: 'cardio', injuryMod: 1.25, desc: 'Mata rozłożona między kosiarką a starym fiatem. Zbyszek oglądał każdą galę w telewizji i ma swoje teorie.', minTier: 0, crest: { shape: 'badge', bg: '#78350f', fg: '#fde68a', icon: 'wrench', text: 'GZ' } },
  { name: 'LZS Kłos Fight', city: '{home}', quality: 1, cost: 500, specialty: 'wrest', injuryMod: 1.15, desc: 'Ludowy Zespół Sportowy. Mata leży w świetlicy po dożynkach, a sołtys przychodzi kibicować na sparingi.', minTier: 0, crest: { shape: 'shield', bg: '#3f6212', fg: '#fef08a', icon: 'wheat', text: 'LZS' } },
  { name: 'Akademia Kimura Kraków', city: 'Kraków', quality: 2, cost: 5000, specialty: 'bjj', injuryMod: 1.0, desc: 'Kimona, maty i zdjęcia brazylijskich mistrzów na ścianie. Trener mówi „oss” nawet do kuriera.', minTier: 0, crest: { shape: 'circle', bg: '#f8fafc', fg: '#1e3a8a', icon: 'fist', text: 'AK' } },
  { name: 'Dziki Zachód Szczecin', city: 'Szczecin', quality: 2, cost: 4500, specialty: 'chin', injuryMod: 1.15, desc: 'Port, wiatr i sparingi bez przerw na wodę. Kto przetrwa tu rok, nie boi się już niczego.', minTier: 0, crest: { shape: 'badge', bg: '#1c1917', fg: '#fb923c', icon: 'boar', text: 'DZ' } },
  { name: 'Arachnion Olsztyn', city: 'Olsztyn', quality: 3, cost: 8500, specialty: 'wrest', injuryMod: 0.95, desc: 'Klub z jeziorami za oknem i zapaśnikami na każdej macie. Biegi wokół jeziora o świcie gratis.', minTier: 1, crest: { shape: 'hex', bg: '#0f172a', fg: '#a3e635', icon: 'snake', text: 'AO' } },
  { name: 'Lubelskie Lwy', city: 'Lublin', quality: 3, cost: 9500, specialty: 'chin', injuryMod: 0.95, desc: 'Twarde sparingi i jeszcze twardszy trener. Po treningu wszyscy idą na cebularza.', minTier: 1, crest: { shape: 'shield', bg: '#7f1d1d', fg: '#fcd34d', icon: 'crown', text: 'LL' } },
  { name: 'Gracje Barra Rio', city: 'Rio de Janeiro', quality: 4, cost: 38000, specialty: 'bjj', injuryMod: 0.9, desc: 'Kimona, plaża i churrasco po treningu. Każdy tu jest czyimś kuzynem, a każdy kuzyn ma czarny pas.', minTier: 2, crest: { shape: 'diamond', bg: '#15803d', fg: '#fde047', icon: 'wave', text: 'GB' } },
  { name: 'Straight Blarney Gym', city: 'Dublin', quality: 4, cost: 36000, specialty: 'stand', injuryMod: 0.9, desc: 'Trener mówi, że nie ma talentu, jest tylko obsesja. Po sparingach cała ekipa idzie do pubu na wodę.', minTier: 2, crest: { shape: 'shield', bg: '#166534', fg: '#f8fafc', icon: 'mug', text: 'SBG' } },
  { name: 'All-Gwiazdy Sztokholm', city: 'Sztokholm', quality: 4, cost: 34000, specialty: 'iq', injuryMod: 0.85, desc: 'Skandynawski spokój, analiza wideo i sauna po każdym treningu. Nikt tu nie krzyczy.', minTier: 2, crest: { shape: 'circle', bg: '#1d4ed8', fg: '#fde047', icon: 'star', text: 'AG' } },
  { name: 'Miasto Kickboxing', city: 'Auckland', quality: 4, cost: 48000, specialty: 'stand', injuryMod: 0.85, desc: 'Najluźniejsza sala na świecie: muzyka, taniec na rozgrzewce i stójka jak z filmu. Lot trwa 30 godzin.', minTier: 2, crest: { shape: 'diamond', bg: '#0a0a0a', fg: '#f472b6', icon: 'bolt', text: 'MK' } },
  { name: 'Team Alfa Samiec', city: 'Sacramento, USA', quality: 5, cost: 95000, specialty: 'wrest', injuryMod: 0.85, desc: 'Wszyscy niewysocy, wszyscy zapaśnicy, wszyscy z rozjaśnionymi włosami. Obalenia uczą tu jak alfabetu.', minTier: 3, crest: { shape: 'badge', bg: '#111827', fg: '#facc15', icon: 'wolf', text: 'TAS' } },
  { name: 'Orły Machaczkała', city: 'Dagestan', quality: 5, cost: 85000, specialty: 'wrest', injuryMod: 0.9, desc: 'Rozgrzewka to noszenie się na barana pod górę. Ojca głównego trenera lepiej nie denerwować.', minTier: 3, crest: { shape: 'shield', bg: '#1e3a8a', fg: '#f8fafc', icon: 'eagle', text: 'OM' } },
  { name: 'Jackman-Wonk', city: 'Albuquerque, USA', quality: 5, cost: 115000, specialty: 'iq', injuryMod: 0.8, desc: 'Trener rozpisuje walki na tablicy jak partię szachów. Sala na wysokości 1600 m, oddycha się ciężko.', minTier: 3, crest: { shape: 'hex', bg: '#7c2d12', fg: '#fef3c7', icon: 'mountain', text: 'JW' } },
  { name: 'Kill Klif FC', city: 'Floryda, USA', quality: 5, cost: 105000, specialty: 'cardio', injuryMod: 0.85, desc: 'Upał, sprinty po plaży i sparingi z połową topowej dziesiątki świata. Klimatyzacja tylko w szatni.', minTier: 3, crest: { shape: 'circle', bg: '#0e7490', fg: '#fef9c3', icon: 'sun', text: 'KK' } },
];

// nom: jak w wyniku walki; form: KO w narzędniku („trafia lewym sierpowym”), poddania w bierniku („zapina gilotynę”)
export interface FinishDetail {
  nom: string;
  form: string;
}

export const WIN_DETAILS: { KO: FinishDetail[]; SUB: FinishDetail[] } = {
  KO: [
    { nom: 'prawy prosty', form: 'prawym prostym' },
    { nom: 'lewy sierpowy', form: 'lewym sierpowym' },
    { nom: 'kopnięcie na głowę', form: 'kopnięciem na głowę' },
    { nom: 'kolano z wyskoku', form: 'kolanem z wyskoku' },
    { nom: 'łokieć z klinczu', form: 'łokciem z klinczu' },
    { nom: 'prawa kontra', form: 'prawą kontrą' },
    { nom: 'seria przy siatce', form: 'serią przy siatce' },
    { nom: 'podbródkowy', form: 'podbródkowym' },
    { nom: 'kopnięcie na wątrobę', form: 'kopnięciem na wątrobę' },
    { nom: 'lewy hak', form: 'lewym hakiem' },
  ],
  SUB: [
    { nom: 'duszenie zza pleców', form: 'duszenie zza pleców' },
    { nom: 'gilotyna', form: 'gilotynę' },
    { nom: 'trójkąt nogami', form: 'trójkąt nogami' },
    { nom: 'omoplata', form: 'omoplatę' },
    { nom: "duszenie d'arce", form: "duszenie d'arce" },
    { nom: 'kimura', form: 'kimurę' },
    { nom: 'anakonda', form: 'anakondę' },
    { nom: 'trójkąt rękami', form: 'trójkąt rękami' },
    { nom: 'dźwignia na kolano', form: 'dźwignię na kolano' },
    { nom: 'balacha', form: 'balachę' },
  ],
};
