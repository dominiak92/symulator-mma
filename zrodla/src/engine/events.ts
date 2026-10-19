import { cash } from './events_money';
import type { EventChoice, GameState } from './types';
import { BELT_NAMES, START_PROFILES } from './data';
import { EXTRA_EVENTS } from './events_extra';
import { MONEY_EVENTS } from './events_money';
import { REP_EVENTS } from './events_rep';
import { STAGE_EVENTS } from './events_stage';

export interface EventDef {
  id: string;
  once?: boolean;
  weight: number;
  cond: (s: GameState) => boolean;
  title?: string;
  brand?: string;
  text: (s: GameState) => string;
  choices: (s: GameState) => EventChoice[];
}

const tys = (n: number) => n;

export const EVENTS: EventDef[] = [
  // ---------- Młodość ----------
  {
    id: 'matura',
    title: 'Matura',
    once: true,
    weight: 6,
    cond: (s) => s.age >= 17 && s.age <= 18,
    text: () => 'Matura za pasem. Mama stawia sprawę jasno: do maja żadnych treningów, bo „z klatki rachunków nie zapłacisz”.',
    choices: () => [
      { label: 'Odpuszczasz do matury', desc: 'Książki zamiast worka. Mama płacze ze szczęścia.', effects: { relations: 2, form: -3, note: 'świadectwo w ramce' } },
      { label: 'Trenujesz po kryjomu', desc: 'Mówisz, że idziesz na korepetycje z matmy.', effects: { relations: -2, stats: { cardio: 2 } } },
    ],
  },
  {
    id: 'kebab_sponsor',
    title: 'Sponsor spod bloku',
    once: true,
    weight: 7,
    cond: (s) => s.age <= 21 && s.tier <= 1,
    text: () => 'Pan Ahmed z kebaba pod blokiem widział twoją walkę na telefonie siostrzeńca. Chce dać logo na spodenki.',
    choices: () => [
      {
        label: 'Bierzesz',
        desc: 'Kasa nieduża, ale pita po każdej walce gratis.',
        effects: { sponsor: { name: 'Kebab u Ahmeda', perSeason: tys(1500), seasonsLeft: 2, clause: 'zdjęcie z rollo po każdej wygranej' }, media: 1 },
      },
      { label: 'Dziękujesz i odmawiasz', desc: 'Czekasz na poważniejszego sponsora.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'dyskoteka',
    title: 'Zadyma na dyskotece',
    once: true,
    weight: 5,
    cond: (s) => s.age >= 17 && s.age <= 23,
    text: () => 'Sobota, dyskoteka w sąsiedniej gminie. Trzech gości zaczepia twoją dziewczynę. Patrzą na ciebie, bo „ty niby od tego MMA”.',
    choices: () => [
      { label: 'Zabierasz ją i wychodzicie', desc: 'Trener zawsze powtarza, że prawdziwa walka jest w klatce.', effects: { rep: 2, relations: 1 } },
      {
        label: 'Pokazujesz, czego się nauczyłeś',
        desc: 'Ktoś na pewno nagrywa.',
        chance: 45,
        success: { media: 4, rep: -2, note: 'nagranie leci po grupach' },
        fail: { rep: -6, injury: { name: 'złamana ręka', seasons: 1, penalty: 6 }, note: 'trener wściekły' },
        successText: 'Trzy ruchy, trzech na ziemi. Nagranie ma 200 tys. wyświetleń, trener udaje, że nie widział.',
        failText: 'Czwarty kolega wyszedł z toalety. Ręka w gipsie, a trener nie odbiera telefonu.',
      },
    ],
  },
  {
    id: 'kadra_zapasy',
    title: 'Zgrupowanie w Spale',
    once: true,
    weight: 5,
    cond: (s) => s.age <= 20,
    text: () => 'Trener kadry zapaśniczej juniorów zaprasza na dwutygodniowe zgrupowanie w Spale. Za obóz trzeba dopłacić.',
    choices: () => [
      { label: 'Jedziesz', desc: 'Dwa tygodnie wylewania potu i zupy pomidorowej.', effects: { money: -2000, stats: { wrest: 4, cardio: 1 } } },
      { label: 'Zostajesz w klubie', desc: 'Szkoda kasy.', effects: {} },
    ],
  },
  {
    id: 'holandia',
    title: 'Lato w Holandii',
    once: true,
    weight: 6,
    cond: (s) => s.age >= 18 && s.age <= 22 && s.money < 8000,
    text: () => 'Wujek załatwia robotę przy pomidorach w Holandii na całe lato. Płacą w euro, ale treningi trzeba zawiesić.',
    choices: () => [
      { label: 'Jedziesz na pomidory', desc: 'Kasa się zgadza, forma niekoniecznie.', effects: { money: 9000, form: -4 } },
      { label: 'Zostajesz trenować', desc: 'Wujek obrażony do Wigilii.', effects: { relations: -1, stats: { cardio: 1, stand: 1 } } },
    ],
  },
  {
    id: 'sparingpartner_rzuca',
    title: 'Kolega rzuca MMA',
    once: true,
    weight: 4,
    cond: (s) => s.age <= 22,
    text: () => 'Twój najlepszy sparingpartner rzuca MMA. Teraz robi „masę” na siłowni i namawia cię, żebyś też odpuścił techniczne treningi.',
    choices: () => [
      { label: 'Zostajesz przy macie', desc: 'Technika ponad bicepsy.', effects: { stats: { bjj: 1, iq: 1 } } },
      { label: 'Idziesz z nim na masę', desc: 'Lepiej wyglądasz na plaży.', effects: { stats: { chin: 2, cardio: -2 }, media: 2 } },
    ],
  },
  {
    id: 'ojciec_przekonany',
    title: 'Ojciec na trybunach',
    once: true,
    weight: 5,
    cond: (s) => s.record.w + s.amRecord.w >= 3 && s.age <= 21,
    text: () => 'Ojciec pierwszy raz przyszedł na twoją walkę. Po wszystkim mówi tylko „no dobra” i wciska ci do ręki kopertę.',
    choices: () => [
      { label: 'Bierzesz kopertę', desc: 'Nie wypada odmówić.', effects: { money: 3000, relations: 2 } },
      { label: '„Tato, nie trzeba”', desc: 'Duma też coś znaczy.', effects: { relations: 3, rep: 1 } },
    ],
  },

  {
    id: 'wazenie_amator',
    title: 'Ważenie o siódmej rano',
    weight: 5,
    cond: (s) => s.tier === 0,
    text: () => 'Ważenie przed turniejem, tolerancja zerowa. Waga pokazuje 300 gramów za dużo, a do zamknięcia listy zostało czterdzieści minut.',
    choices: () => [
      { label: 'Skakanka w kurtce', desc: 'Pocisz się w toalecie i wchodzisz na wagę na styk.', effects: { form: -1 } },
      {
        label: 'Startujesz kategorię wyżej',
        desc: 'Bez zbijania, ale rywale będą więksi.',
        chance: 50,
        success: { form: 2, note: 'wyżej czujesz się jak u siebie' },
        fail: { form: -4, note: 'rywale więksi o głowę' },
        successText: 'Pełny brzuch, pełno siły. W wyższej wadze nikt nie jest szybszy od ciebie.',
        failText: 'Pierwszy rywal jest o głowę wyższy i o osiem kilo cięższy. Czujesz każdy jego cios.',
      },
    ],
  },
  {
    id: 'otwarta_mata',
    title: 'Otwarta mata w niedziele',
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0,
    text: () => 'Czarny pas BJJ z innego klubu robi w niedziele otwartą matę. Za darmo, tylko trzeba dojechać godzinę w jedną stronę.',
    choices: () => [
      { label: 'Jeździsz co tydzień', desc: 'Niedziele w kimonie zamiast obiadu u babci.', effects: { stats: { bjj: 3 }, relations: -1 } },
      { label: 'Szkoda niedziel', desc: 'Raz w tygodniu trzeba odpocząć.', effects: { relations: 1 } },
    ],
  },
  {
    id: 'zawody_szkolne',
    title: 'Zawody szkolne',
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0 && s.age <= 18,
    text: () => 'Wuefista chce, żebyś reprezentował szkołę na powiatowych zawodach w zapasach. Termin wypada tydzień przed Pucharem Polski.',
    choices: () => [
      { label: 'Jedziesz za szkołę', desc: 'Dyrektor wspomni o tobie na apelu.', effects: { stats: { wrest: 1 }, relations: 1, rep: 1, form: -1 } },
      { label: 'Odmawiasz', desc: 'Liczy się Puchar.', effects: { form: 1 } },
    ],
  },

  {
    id: 'gg_cup',
    title: 'Ground Game Cup',
    brand: 'cup',
    once: true,
    weight: 5,
    cond: (s) => s.tier <= 2 && s.age <= 30,
    text: () =>
      'Ground Game robi turniej grapplingowy bez uderzeń: Ground Game Cup. Wpisowe 150 zł, medale i nagrody od marki. Trener mówi, że lepszego sparingu w parterze nie znajdziesz.',
    choices: () => [
      {
        label: 'Startujesz',
        desc: 'Kimono do torby i jazda.',
        test: 'bjj',
        success: { money: -150, stats: { bjj: 2 }, media: 2, rep: 1, note: 'złoto Ground Game Cup' },
        fail: { money: -150, stats: { bjj: 1 }, note: 'wiesz już, nad czym pracować' },
        successText: 'Cztery walki, trzy poddania. Złoty medal i nowa bluza z logo marki.',
        failText: 'Odpadasz w drugiej rundzie po ciasnej gilotynie. Przynajmniej wiesz, czego się uczyć.',
      },
      { label: 'Odpuszczasz', desc: 'Ten weekend na odpoczynek.', effects: {} },
    ],
  },
  {
    id: 'gg_camp',
    title: 'Ground Game Camp',
    brand: 'camp',
    once: true,
    weight: 5,
    cond: (s) => s.tier <= 3 && s.money >= 3000,
    text: () =>
      'Letni obóz Ground Game Camp: tydzień treningów z zawodnikami z całej Polski. Zapasy rano, parter wieczorem, a w środku ognisko. Koszt 2500 zł z noclegiem.',
    choices: () => [
      { label: 'Jedziesz', desc: 'Tydzień, po którym ledwo chodzisz.', effects: { money: -2500, stats: { wrest: 2, bjj: 2 }, form: 1 } },
      { label: 'Zostajesz w domu', desc: 'Szkoda pieniędzy.', effects: {} },
    ],
  },
  {
    id: 'gg_academy',
    title: 'Seminarium w Ground Game Academy',
    brand: 'academy',
    once: true,
    weight: 4,
    cond: (s) => s.tier <= 2,
    text: () =>
      'Ground Game Academy robi seminarium z czarnym pasem z Brazylii. Trzy godziny walki z dołu i obron przed duszeniami. Wejście 300 zł.',
    choices: () => [
      { label: 'Idziesz', desc: 'Notes w torbie, kimono wyprane.', effects: { money: -300, stats: { bjj: 2 } } },
      { label: 'Nie dziś', desc: 'Masz swój plan treningowy.', effects: {} },
    ],
  },
  {
    id: 'gg_labs',
    title: 'Ground Game Labs',
    brand: 'labs',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 8,
    text: () =>
      'Ground Game Labs szuka zawodników do testowania nowych spodenek przed premierą. Trzeba w nich trenować przez miesiąc i napisać szczerą opinię.',
    choices: () => [
      { label: 'Zgłaszasz się', desc: 'Nowy sprzęt, zanim trafi do sklepu.', effects: { media: 2, rep: 1, note: 'spodenki przed premierą' } },
      { label: 'Nie masz czasu', desc: 'Obóz się sam nie zrobi.', effects: {} },
    ],
  },

  // ---------- Start kariery: sparing kontrolny u trenera (kolejkowany przy pierwszym roku) ----------
  {
    id: 'sparing_kontrolny',
    title: 'Sparing kontrolny',
    once: true,
    weight: 0,
    cond: () => false,
    text: (s) => {
      const partners = [
        'Marka z sekcji BJJ, brązowy pas, który na macie spędził więcej czasu niż ty na świecie',
        'Darka, byłego boksera z ligi okręgowej, z nosem złamanym trzy razy',
        'Kubę, zapaśnika z AZS, który podobno nosi worki z piaskiem na rozgrzewkę',
        'Pawła, kickboksera z amatorskim pasem K-1, szybszego niż wygląda',
      ];
      const who = partners[(s.profile.lastName.length + s.profile.firstName.length) % partners.length];
      return `${START_PROFILES[s.profile.start].intro}\n\nPo kilku tygodniach treningów trener stawia cię naprzeciw ${who}. „Trzy rundy, zasady MMA. Nie musisz wygrać, chcę zobaczyć, co w tobie siedzi. Od tego zależy, gdzie cię wyślę na pierwsze amatorskie zawody.”`;
    },
    choices: (s) => {
      const ch = (v: number) => Math.max(25, Math.min(80, Math.round(30 + (v - 20) * 3.5)));
      const ok = { flag: 'amTalent', form: 1, rep: 1, note: 'od razu zawody ogólnopolskie' };
      const slow = { flag: 'amLocal', note: 'najpierw zawody wojewódzkie' };
      const okText = 'Trener długo nic nie mówi, potem kiwa głową: „Masz to coś. Jedziesz od razu na Amatorski Puchar Polski.”';
      const slowText = 'Trener klepie cię w ramię: „Dobra, wyrobisz się. Na początek wyślemy cię na zawody wojewódzkie, tam się otrzaskasz. Za rok pogadamy.”';
      return [
        { label: 'Wymieniasz w stójce', desc: 'Ręce wysoko, kombinacje, praca na nogach.', chance: ch(s.stats.stand), success: ok, fail: slow, successText: okText, failText: slowText },
        { label: 'Idziesz w zapasy', desc: 'Wejście w nogi i kontrola przy siatce.', chance: ch(s.stats.wrest), success: ok, fail: slow, successText: okText, failText: slowText },
        { label: 'Walczysz głową', desc: 'Spokojnie, czytasz go i kontrujesz.', chance: ch(s.stats.iq), success: ok, fail: slow, successText: okText, failText: slowText },
      ];
    },
  },

  // ---------- Kariera ----------
  {
    id: 'menedzer',
    title: 'Menedżer po gali',
    once: true,
    weight: 6,
    cond: (s) => s.tier >= 1 && s.tier <= 2 && s.record.w >= 3 && !s.manager && !s.flags.manager,
    text: () =>
      'Po gali podchodzi Kamil Wroński z KW Fight: okulary przeciwsłoneczne, choć jest 23:00, i dwa telefony w ręku. Mówi, że „zna wszystkich w federacji” i chce 15% od każdej gaży.',
    choices: () => [
      {
        label: 'Podpisujesz',
        desc: 'Może faktycznie zna.',
        chance: 55,
        success: { media: 5, flag: 'manager', note: 'lepsze oferty kontraktów' },
        fail: { money: -4000, rep: -2, note: 'zniknął z zaliczką' },
        successText: 'Faktycznie zna. Telefon dzwoni częściej, a gaże rosną.',
        failText: 'Po tygodniu zablokował twój numer. Zaliczka 4 tys. zł przepadła.',
      },
      { label: 'Odmawiasz', desc: 'Sam ogarniesz swoje kontrakty.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'konferencja',
    title: 'Konferencja przed galą',
    weight: 5,
    cond: (s) => s.tier >= 1,
    text: () => 'Konferencja przed galą. Rywal na żywo obraża twoją mamę i rzuca w ciebie butelką wody.',
    choices: (s) => [
      { label: 'Odpowiadasz klasą', desc: '„Pogadamy w klatce”. Dziennikarze kiwają głowami.', effects: { rep: 3 } },
      { label: 'Wywracasz stół', desc: 'Ochrona ledwo was rozdziela. Klipy lecą wszędzie.', effects: { media: 6, rep: -3, money: -cash(s, 0.015, 1000), note: 'kara od federacji' } },
    ],
  },
  {
    id: 'dieta_influencer',
    title: 'Dieta z Instagrama',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.media >= 10,
    text: () => 'Influencerka fitness oferuje „autorski plan zbijania wagi na sucho” w zamian za reklamę na twoim profilu.',
    choices: () => [
      {
        label: 'Wchodzisz w to',
        desc: 'Dieta z Instagrama, co może pójść nie tak.',
        chance: 55,
        success: { money: 3000, form: 2, media: 2 },
        fail: { money: 3000, form: -5, note: 'ważenie na granicy omdlenia' },
        successText: 'O dziwo działa. Wchodzisz w wagę lekko jak piórko.',
        failText: 'Na ważeniu widzisz trzy wagi i dwóch sędziów. Forma leci w dół.',
      },
      { label: 'Zostajesz przy dietetyku z klubu', desc: 'Nudne, ale sprawdzone.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'kolano',
    title: 'Kolano',
    weight: 4,
    cond: (s) => s.age >= 21 && !s.injury,
    text: () => 'Na ostatnim sparingu przed startem kolano strzela jak gałąź. Lekarz mówi o łąkotce.',
    choices: () => [
      { label: 'Operacja', desc: 'Kosztuje i trochę potrwa, ale kolano będzie jak nowe.', effects: { money: -12000, form: -3, healInjury: true } },
      { label: 'Walczysz na blokadzie', desc: 'Jakoś to będzie.', effects: { injury: { name: 'kolano na blokadzie', seasons: 1, penalty: 5 }, wear: 6 } },
    ],
  },
  {
    id: 'suplement',
    title: 'Suplement z Turcji',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Kolega z siłowni daje ci „całkowicie legalny” suplement z Turcji. Na opakowaniu same krzaczki i zdjęcie byka.',
    choices: () => [
      { label: 'Wyrzucasz do kosza', desc: 'Kontrole antydopingowe nie wybaczają.', effects: { rep: 1 } },
      {
        label: 'Próbujesz raz',
        desc: 'Byk na opakowaniu wygląda przekonująco.',
        chance: 65,
        success: { stats: { cardio: 3, chin: 1 } },
        fail: { rep: -15, media: 6, form: -8, note: 'pozytywny test, zawieszenie' },
        successText: 'Nic się nie stało. Może to była po prostu kreatyna. Może.',
        failText: 'Kontrola o 6 rano. Wynik pozytywny. Pół Polski pisze o tobie memy.',
      },
    ],
  },
  {
    id: 'kielbasa_reklama',
    title: 'Reklama kiełbasy',
    once: true,
    weight: 6,
    cond: (s) => s.media >= 25,
    text: () => 'Zakłady Mięsne „Dzik” chcą cię do reklamy kiełbasy grillowej. Masz ugryźć kiełbasę i powiedzieć „siła z natury”.',
    choices: () => [
      {
        label: 'Gryziesz kiełbasę',
        desc: 'Nikt nie przeczyta umowy do końca.',
        effects: { sponsor: { name: 'ZM „Dzik”', perSeason: tys(20000), seasonsLeft: 3, clause: '„siła z natury” w każdym wywiadzie' }, media: 3, rep: -1 },
      },
      { label: 'Jesteś wegetarianinem od wczoraj', desc: 'Godność nie na sprzedaż.', effects: { rep: 2 } },
    ],
  },
  {
    id: 'wesele',
    title: 'Wesele siostry',
    once: true,
    weight: 5,
    cond: (s) => s.age >= 20,
    text: () => 'Siostra bierze ślub. Termin? Dokładnie w dniu ważenia przed ważną walką. Rodzina mówi, że nie wybaczy.',
    choices: () => [
      { label: 'Idziesz na wesele', desc: 'Woda zamiast wódki, ale i tak tańczysz do 4 rano.', effects: { relations: 4, form: -4 } },
      { label: 'Jedziesz na ważenie', desc: 'Siostra wysyła ci tort na Messengerze.', effects: { relations: -4, rep: 1 } },
    ],
  },
  {
    id: 'podcast',
    title: 'Zaproszenie na podcast',
    weight: 4,
    cond: (s) => s.media >= 15,
    text: () => 'Popularny podcaster zaprasza cię na trzygodzinną rozmowę. Pytania o „spiski federacji” i „prawdziwych mężczyzn”.',
    choices: () => [
      {
        label: 'Idziesz i mówisz, co myślisz',
        desc: 'Bez filtra.',
        chance: 55,
        success: { media: 6, rep: 1 },
        fail: { media: 4, rep: -4, note: 'cytat wyrwany z kontekstu' },
        successText: 'Wychodzisz na normalnego gościa. Obserwujący lecą w górę.',
        failText: 'Jedno zdanie o sędziach poszło w świat. Federacja nie jest zachwycona.',
      },
      { label: 'Odmawiasz', desc: 'Czas na trening.', effects: { stats: { iq: 1 } } },
    ],
  },
  {
    id: 'trener_dubaj',
    title: 'Trener dostaje ofertę',
    once: true,
    weight: 4,
    cond: (s) => s.club.quality >= 2 && s.clubSeasons >= 2,
    text: () => 'Twój trener dostał ofertę z Dubaju: ma uczyć MMA syna szejka. Pyta, czy ma jechać.',
    choices: () => [
      { label: 'Prosisz, żeby został', desc: 'Dokładasz mu do pensji z własnej kieszeni.', effects: { money: -6000, relations: 1, form: 2 } },
      { label: '„Jedź, trenerze”', desc: 'Szejkowie też muszą się nauczyć dźwigni.', effects: { form: -3, rep: 1 } },
    ],
  },
  {
    id: 'sparing_mistrz',
    title: 'Sparing z mistrzem świata',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 2,
    text: () => 'Mistrz świata przylatuje do Polski na seminarium i szuka mocnych sparingpartnerów na trzy rundy.',
    choices: () => [
      {
        label: 'Zgłaszasz się',
        desc: 'Albo się czegoś nauczysz, albo obudzisz się w karetce.',
        test: 'chin',
        success: { stats: { stand: 2, iq: 3 }, media: 3 },
        fail: { injury: { name: 'wstrząśnienie mózgu', seasons: 1, penalty: 5 }, wear: 6 },
        successText: 'Wytrzymałeś trzy rundy. Mistrz klepie cię po plecach i mówi „good boy”.',
        failText: 'Druga minuta, lewy hak, sufit. Lekarz zabrania sparingów na miesiąc.',
      },
      { label: 'Patrzysz z boku', desc: 'Notatki też się liczą.', effects: { stats: { iq: 1 } } },
    ],
  },
  {
    id: 'polozenie',
    title: 'Propozycja w szatni',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1 && s.tier <= 3,
    text: () => 'W szatni podchodzi typ w dresie z „propozycją biznesową”: 30 tys. zł, jeśli położysz się w drugiej rundzie.',
    choices: (s) => [
      { label: 'Odmawiasz i zgłaszasz federacji', desc: 'Sport ma być czysty.', effects: { rep: 6, media: 2 } },
      { label: 'Odmawiasz po cichu', desc: 'Nie chcesz problemów.', effects: {} },
      {
        label: 'Bierzesz kasę',
        desc: 'Jedna walka, nikt się nie dowie.',
        chance: 50,
        success: { money: cash(s, 0.15, 20000), rep: -10, form: -6, note: 'przegrywasz walkę i szacunek do siebie' },
        fail: { money: cash(s, 0.15, 20000), rep: -40, media: 10, flag: 'banned', note: 'afera, federacja zrywa kontrakt' },
        successText: 'Nikt się nie dowiedział. Ty wiesz.',
        failText: 'Nagranie z szatni wycieka. Afera na pół kraju, federacja rozwiązuje kontrakt.',
      },
    ],
  },
  {
    id: 'ultimatum',
    title: 'Ultimatum',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 21 && s.age <= 28,
    text: () => 'Dziewczyna stawia sprawę jasno: „Albo ja, albo ta twoja klatka. Mam dość weekendów na galach w Pcimiu”.',
    choices: () => [
      { label: 'Wybierasz ją', desc: 'Mniej obozów, więcej wspólnych niedziel.', effects: { relations: 4, form: -2, flag: 'partner' } },
      { label: 'Wybierasz klatkę', desc: 'Pakujesz torbę na trening.', effects: { relations: -3, stats: { iq: 1 }, form: 2 } },
    ],
  },
  {
    id: 'ojciec_zostaniesz',
    title: 'Będziesz ojcem',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 24 && (s.flags.partner ?? 0) > 0,
    text: () => 'Zostaniesz ojcem! Teściowa już planuje chrzciny, a ty liczysz, ile kosztują pieluchy.',
    choices: () => [
      { label: 'Bierzesz więcej walk', desc: 'Dziecko musi mieć na buty.', effects: { relations: 2, flag: 'kid', form: 2, note: 'koszty życia rosną' } },
      { label: 'Zwalniasz tempo', desc: 'Pierwsze kroki dziecka są ważniejsze.', effects: { relations: 5, flag: 'kid', form: -3, note: 'koszty życia rosną' } },
    ],
  },
  {
    id: 'kredyt_mieszkanie',
    title: 'Kredyt na mieszkanie',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 25 && s.money > 30000,
    text: () => 'Doradca w banku przekonuje, że „mieszkanie to najlepsza inwestycja” i proponuje kredyt na 30 lat.',
    choices: () => [
      { label: 'Podpisujesz', desc: 'Własne cztery kąty. Raty co roku.', effects: { money: -25000, loan: { amount: 0, installment: 9000, count: 6 }, relations: 3, note: 'wkład własny + raty' } },
      { label: 'Wynajmujesz dalej', desc: 'Elastyczność przede wszystkim.', effects: {} },
    ],
  },
  {
    id: 'myjnia',
    title: 'Myjnia kumpla',
    once: true,
    weight: 4,
    cond: (s) => s.money >= 20000,
    text: () => 'Kumpel z osiedla otwiera myjnię bezdotykową i proponuje, żebyś wszedł jako wspólnik za 15 tys. zł.',
    choices: () => [
      {
        label: 'Inwestujesz',
        desc: '„Samochody zawsze będą brudne”.',
        chance: 50,
        success: { money: 25000, note: 'myjnia zarabia' },
        fail: { money: -15000, relations: -1, note: 'myjnia splajtowała' },
        successText: 'Myjnia zarabia lepiej niż ty w klatce. Kumpel stawia kolację.',
        failText: 'Po pół roku na myjni wisi kartka „lokal do wynajęcia”. Kumpel nie odbiera.',
      },
      { label: 'Odmawiasz', desc: 'Skupiasz się na sporcie.', effects: {} },
    ],
  },
  {
    id: 'insta_3am',
    title: 'Wpis o trzeciej w nocy',
    weight: 4,
    cond: (s) => s.media >= 10,
    text: () => 'O trzeciej w nocy wrzuciłeś na Instagrama długi wpis o tym, że „wszyscy w polskim MMA to leszcze”. Rano ma 4 tys. komentarzy.',
    choices: () => [
      { label: 'Przepraszasz', desc: '„To nie ja, to emocje”.', effects: { rep: 1, media: -1 } },
      { label: 'Brniesz dalej', desc: 'Nagrywasz drugą część.', effects: { media: 6, rep: -4 } },
    ],
  },
  {
    id: 'nagroda_gminy',
    title: 'Sportowiec roku',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 2,
    text: (s) => `${s.profile.hometown} jest z ciebie dumny. Burmistrz chce ci wręczyć statuetkę „Sportowiec Roku”. Uroczystość w domu kultury, będzie orkiestra dęta.`,
    choices: () => [
      { label: 'Jedziesz odebrać', desc: 'Lokalna telewizja, ciocie, tort.', effects: { media: 3, relations: 3, rep: 2 } },
      { label: 'Masz obóz', desc: 'Prosisz, żeby statuetkę odebrała mama.', effects: { relations: -1, form: 1 } },
    ],
  },
  {
    id: 'trener_mentalny',
    title: 'Trener mentalny',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: () => 'Trener mentalny po weekendowym kursie online proponuje sesje „przeprogramowania umysłu zwycięzcy”. 4 tys. zł za pakiet.',
    choices: (s) => [
      {
        label: 'Kupujesz pakiet',
        desc: 'Wizualizacje, oddechy i afirmacje.',
        chance: 45,
        success: { money: -cash(s, 0.015, 2000), stats: { iq: 4 } },
        fail: { money: -cash(s, 0.015, 2000), note: 'umysł nie przeprogramowany' },
        successText: 'Zaskakująco działa. Pierwszy raz w życiu nie trzęsą ci się ręce w szatni.',
        failText: 'Po trzech sesjach umiesz tylko oddychać przez lewą dziurkę od nosa.',
      },
      { label: 'Wolisz psychologa sportowego z klubu', desc: 'Darmowy i z prawdziwym dyplomem.', effects: { stats: { iq: 1 } } },
    ],
  },
  {
    id: 'tajlandia',
    title: 'Miesiąc w Tajlandii',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 1 && s.money >= 12000,
    text: () => 'Znajomy z klubu jedzie na miesiąc do Tajlandii trenować muay thai. Bilet i obóz to ok. 10 tys. zł.',
    choices: (s) => [
      {
        label: 'Lecisz z nim',
        desc: 'Dwa treningi dziennie w 35 stopniach.',
        chance: 80,
        success: { money: -cash(s, 0.03, 6000), stats: { stand: 4, cardio: 2 } },
        fail: { money: -cash(s, 0.03, 6000), form: -4, note: 'denga w drugim tygodniu' },
        successText: 'Wracasz opalony, z kolanami jak noże i nowym tatuażem, którego nie umiesz przeczytać.',
        failText: 'Komar okazał się szybszy od ciebie. Dwa tygodnie w szpitalu w Phuket.',
      },
      { label: 'Zostajesz', desc: 'Polska zima też hartuje.', effects: {} },
    ],
  },
  {
    id: 'parafia',
    title: 'Zajęcia przy parafii',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Proboszcz prosi, żebyś poprowadził darmowe zajęcia dla dzieciaków z parafii. Dwa razy w tygodniu, w salce katechetycznej.',
    choices: () => [
      { label: 'Prowadzisz zajęcia', desc: 'Dzieciaki zapamiętają to na całe życie.', effects: { rep: 3, relations: 2, form: -1 } },
      { label: 'Nie masz czasu', desc: 'Proboszcz rozumie. Chyba.', effects: {} },
    ],
  },
  {
    id: 'sniadaniowa',
    title: 'Telewizja śniadaniowa',
    once: true,
    weight: 4,
    cond: (s) => s.media >= 35,
    text: () => 'Zaproszenie do telewizji śniadaniowej. Scenariusz: pompki na wyścigi z prowadzącym i gotowanie owsianki „mistrza”.',
    choices: () => [
      { label: 'Idziesz', desc: 'Pół Polski zobaczy cię przy kawie.', effects: { media: 6, rep: -1 } },
      { label: 'Odmawiasz', desc: 'Nie jesteś pajacem.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'reality',
    title: 'Reality show',
    once: true,
    weight: 4,
    cond: (s) => s.media >= 45,
    text: () => 'Stacja telewizyjna proponuje udział w reality show na bezludnej wyspie. Dwa miesiące bez treningu, ale 60 tys. zł.',
    choices: (s) => [
      { label: 'Lecisz na wyspę', desc: 'Kokosy, kamery i dramy.', effects: { money: cash(s, 0.2, 30000), media: 12, rep: -6, form: -6 } },
      { label: 'Odmawiasz', desc: 'Sport przede wszystkim.', effects: { rep: 3 } },
    ],
  },
  {
    id: 'lojalnosc_klub',
    title: 'Propozycja właściciela klubu',
    once: true,
    weight: 4,
    cond: (s) => s.club.cost > 0 && s.tier <= 2,
    text: () => 'Właściciel klubu proponuje ci darmowe składki na ten rok. Warunek: zostajesz u niego jeszcze przez dwa lata.',
    choices: (s) => [
      {
        label: 'Obiecujesz',
        desc: 'Pieniądze zostają w kieszeni.',
        effects: { money: s.club.cost, promise: { text: `Obiecałeś, że zostaniesz w klubie ${s.club.name}.`, untilSeason: s.season + 2, kind: 'stayClub' }, relations: 1 },
      },
      { label: 'Wolisz być wolny', desc: 'Płacisz składki jak wszyscy.', effects: {} },
    ],
  },
  {
    id: 'firma_regionu',
    title: 'Sponsor z regionu',
    once: true,
    weight: 5,
    cond: (s) => s.tier <= 2 && s.tier < 4,
    text: (s) => `Firma z twojego regionu chce dołożyć się do twoich startów. Stawia jeden warunek: na koniec roku ${s.tier === 0 ? 'nie przechodzisz jeszcze na zawodowstwo' : 'nie przechodzisz do większej federacji'}.`,
    choices: (s) => [
      {
        label: 'Podpisujesz umowę',
        desc: 'Pieniądze od razu. Jeśli na koniec roku pójdziesz wyżej, złamiesz słowo.',
        effects: { money: [5000, 8000, 20000][s.tier] ?? 8000, relations: 1, promise: { text: 'Obiecałeś, że po tym roku nie pójdziesz wyżej.', untilSeason: s.season, kind: 'noPromotion' } },
      },
      { label: 'Dziękujesz i odmawiasz', desc: 'Nie masz żadnych zobowiązań.', effects: {} },
    ],
  },
  {
    id: 'charytatywna',
    title: 'Licytacja dla fundacji',
    weight: 3,
    cond: (s) => s.media >= 15,
    text: () => 'Fundacja dla chorych dzieci prosi o twoje rękawice z ostatniej walki na licytację.',
    choices: () => [
      { label: 'Oddajesz rękawice', desc: 'I dorzucasz trening z najwyższą ofertą. To cała sobota.', effects: { rep: 3, media: 2, form: -1 } },
      { label: 'Masz do nich sentyment', desc: 'Wiszą nad łóżkiem i dają ci kopa przed każdym obozem.', effects: { form: 1 } },
    ],
  },
  {
    id: 'kebab_challenge',
    title: 'Kebab challenge',
    once: true,
    weight: 3,
    cond: (s) => s.media >= 10,
    text: () => 'Streamer proponuje challenge na żywo: 3 kg kebaba w 20 minut. „Mistrzowie jedzą jak mistrzowie”.',
    choices: () => [
      { label: 'Jesz', desc: 'Dla ludu.', effects: { media: 4, form: -2 } },
      { label: 'Odmawiasz', desc: 'Ważenie za 6 tygodni.', effects: { form: 1 } },
    ],
  },
  {
    id: 'hejter',
    title: 'Hejter',
    weight: 3,
    cond: (s) => s.media >= 8,
    text: () => 'Anonimowy użytkownik „Kibic_MMA_1987” pod każdym twoim postem pisze, że jesteś „papierowym zawodnikiem”.',
    choices: () => [
      { label: 'Odpisujesz', desc: 'Kłótnia na 300 komentarzy.', effects: { media: 2, rep: -1 } },
      { label: 'Ignorujesz', desc: 'Najlepsza odpowiedź to wygrana.', effects: { stats: { iq: 1 } } },
    ],
  },
  {
    id: 'gala_w_miescie',
    title: 'Gala w rodzinnym mieście',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: (s) => `Organizator robi galę w hali OSiR u ciebie w domu: ${s.profile.hometown}. Chce cię na plakacie i w walce wieczoru.`,
    choices: () => [
      { label: 'Zgadzasz się', desc: 'Pełna hala, cała rodzina w pierwszym rzędzie. Presja jak nigdy.', test: 'iq', success: { media: 5, money: 5000, form: 2 }, fail: { media: 3, money: 5000, form: -3, note: 'presja przed swoimi zjadła cię na obozie' }, successText: 'Bilety schodzą w dwa dni. Cały obóz czujesz wsparcie miasta.', failText: 'Bilety schodzą w dwa dni, ale ty nie śpisz po nocach. Wszyscy pytają tylko o tę walkę.' },
      { label: 'Wolisz spokój', desc: 'Presja przed swoimi to za dużo. Skupiasz się na treningu.', effects: { form: 1 } },
    ],
  },
  {
    id: 'rywal_rocznik',
    title: 'Wyzwanie z rocznika',
    weight: 5,
    cond: (s) => s.peers.some((p) => !p.retired && p.tier === s.tier),
    text: (s) => {
      const p = s.peers.find((x) => !x.retired && x.tier === s.tier)!;
      return `${p.firstName} ${p.lastName}, z którym znacie się jeszcze z amatorki, wrzuca filmik: „On się mnie po prostu boi”.`;
    },
    choices: () => [
      { label: 'Przyjmujesz wyzwanie', desc: 'W tym roku musicie się spotkać.', effects: { media: 3, flag: 'peerCallout' } },
      { label: 'Ignorujesz', desc: 'Nie dajesz mu rozgłosu.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'koniec_namowy',
    title: 'Niedzielny obiad',
    weight: 6,
    cond: (s) => s.age >= 34,
    text: () => 'Przy niedzielnym obiedzie rodzina zaczyna temat: „Może już wystarczy? Głowa jedna, a ty coraz wolniej mówisz”.',
    choices: () => [
      { label: 'Jeszcze jeden rok', desc: 'Czujesz, że masz jeszcze coś do udowodnienia.', effects: { relations: -3 } },
      { label: 'Kończysz po tym roku', desc: 'Ostatni taniec.', effects: { relations: 4, flag: 'lastSeason', note: 'ostatni rok kariery' } },
    ],
  },
  {
    id: 'wlasny_klub',
    title: 'Własny klub',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 27 && s.money >= 60000,
    text: () => 'Lokal po starej hurtowni jest do wynajęcia. Możesz otworzyć własny klub ze swoim nazwiskiem na szyldzie.',
    choices: () => [
      {
        label: 'Otwierasz klub',
        desc: 'Inwestycja teraz, składki od kursantów potem.',
        effects: { money: -50000, rep: 5, sponsor: { name: 'Twój klub (składki)', perSeason: 18000, seasonsLeft: 30, clause: 'prowadzisz zajęcia dla dzieci we wtorki' }, form: -2 },
      },
      { label: 'Jeszcze nie teraz', desc: 'Najpierw kariera.', effects: {} },
    ],
  },
  {
    id: 'akademia_mlodziez',
    title: 'Spotkanie w podstawówce',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2 && s.age <= 30,
    text: () => 'Twoja stara podstawówka zaprasza cię na spotkanie z dzieciakami. Pani dyrektor pamięta, jak biłeś się na przerwach.',
    choices: () => [
      { label: 'Idziesz', desc: 'Autografy na zeszytach do matmy.', effects: { rep: 2, relations: 1, media: 1 } },
      { label: 'Nie masz czasu', desc: 'Obóz się sam nie zrobi.', effects: {} },
    ],
  },
  {
    id: 'kontuzja_reki',
    title: 'Nadgarstek',
    weight: 3,
    cond: (s) => !s.injury && s.age >= 19,
    text: () => 'Na worku coś trzasnęło w nadgarstku. Ręka puchnie jak bułka. Do pierwszej walki roku zostało sześć tygodni.',
    choices: () => [
      { label: 'Odpuszczasz sparingi i leczysz', desc: 'Fizjoterapeuta, lód, cierpliwość.', effects: { money: -3000, form: -2, healInjury: true } },
      { label: 'Zaciskasz zęby', desc: 'Usztywniasz taśmą i jedziesz dalej.', effects: { injury: { name: 'nadgarstek', seasons: 1, penalty: 4 }, stats: { iq: 1 } } },
    ],
  },
  {
    id: 'brat_tez',
    title: 'Młodszy brat',
    once: true,
    weight: 4,
    cond: (s) => s.age <= 22,
    text: () => 'Twój młodszy brat jeździ z tobą na każde zawody. Teraz sam chce trenować, a rodzice mówią wprost, że na dwóch nie starczy.',
    choices: () => [
      { label: 'Płacisz za brata ze swoich', desc: 'Rodzina jest najważniejsza.', effects: { money: -3000, relations: 4 } },
      { label: 'Mówisz, że jeszcze nie teraz', desc: 'Najpierw ty musisz się przebić.', effects: { relations: -3 } },
    ],
  },
  {
    id: 'stary_trener',
    title: 'Telefon od starego trenera',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 20,
    text: () => 'Dzwoni weteran, który uczył cię pierwszych kroków w parterze. Organizuje turniej dla dzieciaków i prosi o pomoc.',
    choices: () => [
      { label: 'Pomagasz', desc: 'Dokładasz pieniądze i swój czas. O akcji mówi całe środowisko.', effects: { rep: 3, relations: 1, money: -2000 } },
      { label: 'Odmawiasz', desc: 'Masz swoje sprawy.', effects: { relations: -1 } },
    ],
  },
  {
    id: 'oferta_pracy',
    title: 'Praca na bramce',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 20 && s.tier <= 1 && s.money < 5000,
    text: () => 'Kolega załatwia etat na bramce w klubie nocnym. Pewna kasa co miesiąc, ale noce zarwane.',
    choices: () => [
      { label: 'Bierzesz etat', desc: 'Kasa na składki będzie.', effects: { money: 14000, form: -3, wear: 2 } },
      { label: 'Zostajesz przy sporcie', desc: 'Jakoś przeżyjesz na makaronie.', effects: { form: 1 } },
    ],
  },
  {
    id: 'wywiad_zly',
    title: 'Wywiad przed ważeniem',
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: () => 'Dziennikarz pyta o twoją ostatnią walkę, a ty po 14 godzinach bez jedzenia przed ważeniem odpowiadasz… różnie.',
    choices: () => [
      {
        label: 'Mówisz, co myślisz o sędziach',
        desc: 'Nikt ci nie zabroni.',
        chance: 50,
        success: { media: 4 },
        fail: { media: 3, rep: -3 },
        successText: 'Ludzie przyznają ci rację. Klip ma milion wyświetleń.',
        failText: 'Federacja wysyła pismo „z prośbą o wyjaśnienia”.',
      },
      { label: '„Skupiam się na sobie”', desc: 'Najnudniejsza odpowiedź w historii.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'sponsor_suple',
    title: 'Sponsor od suplementów',
    once: true,
    weight: 5,
    cond: (s) => s.media >= 18 && s.tier >= 1,
    text: () => 'Marka suplementów „MegaMass Polska” proponuje kontrakt. Musisz pokazywać się z shakerem na każdym ważeniu.',
    choices: (s) => [
      {
        label: 'Podpisujesz',
        desc: 'Shaker w każdym kadrze.',
        effects: { sponsor: { name: 'MegaMass Polska', perSeason: 4000 + s.tier * 5000, seasonsLeft: 2, clause: 'shaker w każdym kadrze' }, media: 1 },
      },
      { label: 'Odmawiasz', desc: 'Nie lubisz smaku truskawki.', effects: {} },
    ],
  },
  {
    id: 'gg_banda',
    title: 'Ground Game się odzywa',
    brand: 'banda',
    once: true,
    weight: 9,
    cond: (s) => s.tier >= 1 && s.media >= 12 && !s.sponsors.some((x) => x.name === 'Ground Game'),
    text: () =>
      'Na Instagramie odzywa się Ground Game. Widzieli twoją ostatnią walkę i chcą cię w ekipie: rashguardy, spodenki na walki i kod rabatowy z twoim nazwiskiem.',
    choices: (s) => [
      {
        label: 'Dołączasz do Bandy',
        desc: 'Wychodzisz do klatki w spodenkach GG, ludzie kupują z twoim kodem, a sprzęt masz z głowy.',
        effects: {
          sponsor: { name: 'Ground Game', perSeason: [2000, 3000, 9000, 20000, 45000][s.tier], seasonsLeft: 4, clause: 'kod rabatowy z twoim nazwiskiem, sprzęt na koszt sponsora' },
          media: 3,
          rep: 1,
        },
      },
      { label: 'Czekasz na większą markę', desc: 'Może kiedyś zadzwoni ktoś z Ameryki.', effects: {} },
    ],
  },

  {
    id: 'gg_labs_supps',
    title: 'Ground Game Labs',
    brand: 'labs',
    once: true,
    weight: 6,
    cond: (s) => s.tier >= 2 && s.media >= 18 && !s.sponsors.some((x) => x.name === 'Ground Game Labs'),
    text: () =>
      'Odzywa się Ground Game Labs, linia odżywek Ground Game. Chcą, żebyś testował ich białko, elektrolity i kreatynę, a w zamian biorą na siebie całą twoją suplementację.',
    choices: (s) => [
      {
        label: 'Wchodzisz w to',
        desc: 'Shaker Labs na każdym treningu, suplementacja za darmo.',
        effects: {
          sponsor: { name: 'Ground Game Labs', perSeason: [0, 0, 2000, 5000, 10000][s.tier], seasonsLeft: 3, clause: 'suplementacja na koszt sponsora' },
          media: 1,
          note: 'suplementacja za darmo',
        },
      },
      { label: 'Zostajesz przy swoich', desc: 'Przyzwyczaiłeś się do białka z hurtowni.', effects: {} },
    ],
  },

  // ---------- Wyższe szczeble i późna kariera ----------
  {
    id: 'londyn',
    title: 'Walka w Londynie',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 3,
    text: () => 'Pierwsza walka roku w Londynie. Federacja kupiła ci lot z przesiadką w Dubaju i hotel przy lotnisku. Możesz dopłacić za wcześniejszy przylot.',
    choices: (s) => [
      { label: 'Lecisz tydzień wcześniej', desc: 'Aklimatyzacja, spokojny sen, własny dietetyk.', effects: { money: -cash(s, 0.03, 6000), form: 2 } },
      { label: 'Lecisz z federacją', desc: 'Jet lag to dla słabych.', effects: { form: -2 } },
    ],
  },
  {
    id: 'stadion',
    title: 'Gala na stadionie',
    once: true,
    weight: 6,
    cond: (s) => s.tier === 2 && s.rank !== null && s.rank <= 5,
    text: () => 'Polska federacja robi galę na stadionie. 50 tysięcy ludzi. Proponują ci walkę w karcie głównej, ale z rywalem z wyższej półki.',
    choices: () => [
      { label: 'Bierzesz to', desc: 'Takie wieczory zdarzają się raz w życiu.', effects: { media: 8, money: 15000, form: 1 } },
      { label: 'Wolisz bezpieczniejszą walkę', desc: 'Stadion poczeka.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'zastepstwo',
    title: 'Zastępstwo z marszu',
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: () => 'Dzwoni matchmaker. Na gali za dwa tygodnie wypadł zawodnik z karty głównej. Potrzebują zastępstwa i płacą podwójnie.',
    choices: (s) => [
      {
        label: 'Bierzesz walkę z marszu',
        desc: 'Bez obozu, ale kasa i wdzięczność federacji.',
        chance: 55,
        success: { money: [0, 6000, 40000, 90000, 300000][s.tier], rep: 3, media: 3 },
        fail: { money: [0, 3000, 20000, 45000, 150000][s.tier], wear: 5, form: -3, note: 'dostałeś lanie, ale kasa jest' },
        successText: 'Wygrywasz w drugiej rundzie. Prezes federacji osobiście dziękuje ci w szatni.',
        failText: 'Kondycja skończyła się po pięciu minutach. Kasa się zgadza, twarz już mniej.',
      },
      { label: 'Odmawiasz', desc: 'Bez obozu to proszenie się o kłopoty.', effects: {} },
    ],
  },
  {
    id: 'kontrakt_tv',
    title: 'Serial dokumentalny',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 2 && s.media >= 30,
    text: () => 'Stacja telewizyjna chce zrobić o tobie serial dokumentalny „Droga do pasa”. Kamery będą na każdym treningu.',
    choices: (s) => [
      { label: 'Zgadzasz się', desc: 'Sława i pieniądze, ale prywatności zero.', effects: { money: cash(s, 0.08, 15000), media: 10, relations: -2, form: -1 } },
      { label: 'Odmawiasz', desc: 'Trening to nie reality show.', effects: { form: 1 } },
    ],
  },
  {
    id: 'kontrola_federacji',
    title: 'Kontrola antydopingowa',
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => 'Federacja wprowadza losowe kontrole antydopingowe. Kontroler zjawia się o 6:30 w niedzielę, akurat po urodzinach brata.',
    choices: () => [
      { label: 'Oddajesz próbkę bez dyskusji', desc: 'Nie masz nic do ukrycia.', effects: { rep: 2 } },
      { label: 'Prosisz o godzinę na kawę', desc: 'Kontroler patrzy na zegarek.', chance: 70, success: { note: 'kontroler był wyrozumiały' }, fail: { rep: -5, note: 'raport o utrudnianiu kontroli' } },
    ],
  },
  {
    id: 'rywal_trash',
    title: 'Wyzwanie w internecie',
    weight: 4,
    cond: (s) => s.tier >= 2,
    text: () => 'Zawodnik z twojej kategorii nagrał film, w którym nazywa cię „emerytem z przeterminowaną szczęką”. Federacja proponuje walkę z nim.',
    choices: () => [
      { label: 'Żądasz walki', desc: 'Sprawa honorowa.', effects: { media: 5, flag: 'grudge', form: 2 } },
      { label: 'Ignorujesz', desc: 'Nie zniżasz się do jego poziomu.', effects: { rep: 2 } },
    ],
  },
  {
    id: 'dagestan',
    title: 'Obóz w Dagestanie',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 3,
    text: () => 'Dostajesz zaproszenie na obóz zapaśniczy w górach Dagestanu. Treningi trzy razy dziennie, jedzenie proste, sauny brak.',
    choices: (s) => [
      {
        label: 'Jedziesz',
        desc: 'Wracasz albo zapaśnikiem, albo w trumnie.',
        chance: 75,
        success: { stats: { wrest: 4, cardio: 2 }, money: -cash(s, 0.03, 6000) },
        fail: { injury: { name: 'naderwany bark', seasons: 1, penalty: 5 }, money: -cash(s, 0.03, 6000) },
        successText: 'Po miesiącu obalasz ludzi, zanim zdążą pomyśleć o gardzie.',
        failText: 'Trzeci dzień, rzut przez biodro na beton. Bark mówi „dość”.',
      },
      { label: 'Zostajesz w kraju', desc: 'Polskie zapasy też coś znaczą.', effects: {} },
    ],
  },
  {
    id: 'gala_rodzina',
    title: 'Gala w Las Vegas',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 3,
    text: () => 'Twoja walka będzie na gali w Las Vegas. Federacja daje bilety tylko dla ciebie i trenera. Rodzina pyta, czy mogą lecieć.',
    choices: (s) => [
      { label: 'Fundujesz im lot', desc: 'Mama pierwszy raz w samolocie.', effects: { money: -cash(s, 0.05, 15000), relations: 5, form: 2 } },
      { label: 'Obejrzą w telewizji', desc: 'Skupienie przede wszystkim.', effects: { relations: -2 } },
    ],
  },
  {
    id: 'operacja_lokcia',
    title: 'Łokieć',
    weight: 3,
    cond: (s) => s.age >= 28 && !s.injury,
    text: () => 'Łokieć strzela przy każdym prostym. Ortopeda daje wybór: zastrzyki i ból do końca kariery albo operacja.',
    choices: () => [
      { label: 'Operacja', desc: 'Pół roku rehabilitacji i spokój.', effects: { money: -15000, form: -4, wear: -5 } },
      { label: 'Zastrzyki i jedziemy', desc: 'Doktor z siłowni zna dobre specyfiki.', effects: { injury: { name: 'łokieć na zastrzykach', seasons: 2, penalty: 3 }, wear: 4 } },
    ],
  },
  {
    id: 'mlodszy_zawodnik',
    title: 'Młody w klubie',
    once: true,
    weight: 5,
    cond: (s) => s.age >= 29,
    text: () => 'W klubie pojawia się 18-latek, który na sparingach robi ci problemy. Trener pyta, czy weźmiesz go pod skrzydła.',
    choices: () => [
      { label: 'Zostajesz mentorem', desc: 'Uczysz go wszystkiego, co wiesz. Twoje treningi schodzą na drugi plan.', effects: { rep: 3, stats: { iq: 1 }, relations: 1, form: -2 } },
      { label: 'Pokazujesz mu, gdzie jego miejsce', desc: 'Na sparingu bez litości.', effects: { stats: { stand: 1 }, rep: -1, form: 1 } },
    ],
  },
  {
    id: 'komentator',
    title: 'Propozycja z telewizji',
    once: true,
    weight: 4,
    cond: (s) => s.age >= 30 && s.media >= 25,
    text: () => 'Telewizja proponuje ci rolę eksperta przy komentowaniu gal. Dobra kasa, ale weekendy w studiu.',
    choices: () => [
      { label: 'Bierzesz mikrofon', desc: 'Przyszłość po karierze sama się nie zbuduje.', effects: { sponsor: { name: 'Studio telewizyjne', perSeason: 25000, seasonsLeft: 10, clause: 'komentowanie gal w weekendy' }, form: -2, media: 3 } },
      { label: 'Jeszcze nie teraz', desc: 'Najpierw kariera.', effects: { form: 1 } },
    ],
  },
  {
    id: 'kategoria_nizej',
    title: 'Kategoria niżej?',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 2 && s.age <= 30,
    text: () => 'Trener przekonuje, że w niższej kategorii wagowej byłbyś „gigantem”. Tylko trzeba zrzucić dodatkowe 7 kilo, a zbijanie wagi to katorga.',
    choices: () => [
      {
        label: 'Schodzisz kategorię niżej',
        desc: 'Jesteś silniejszy od rywali, ale ważenie to piekło.',
        test: 'cardio',
        success: { stats: { stand: 2, wrest: 2, cardio: -1 }, form: 2 },
        fail: { form: -6, wear: 4, note: 'zbijanie wagi cię wykończyło' },
        successText: 'Wchodzisz w wagę i w klatce czujesz się jak niedźwiedź wśród lisów.',
        failText: 'Saunowanie do upadłego. W walce nie masz siły unieść rąk.',
      },
      { label: 'Zostajesz w swojej wadze', desc: 'Zdrowie przede wszystkim.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'pas_kradziony',
    title: 'Skradziona walka?',
    weight: 3,
    cond: (s) => s.tier >= 2 && s.history.slice(-3).some((h) => h.result === 'L' && h.method === 'Decyzja niejednogłośna'),
    text: () => 'Po ostatniej niejednogłośnej decyzji internet huczy, że cię okradli. Federacja proponuje szybki rewanż albo możesz złożyć oficjalny protest.',
    choices: () => [
      { label: 'Składasz protest', desc: 'Sprawiedliwość musi być.', chance: 30, success: { rep: 3, media: 3, note: 'komisja przyznaje, że sędziowie się pomylili' }, fail: { rep: -1, note: 'protest odrzucony' } },
      { label: 'Wygrasz to w klatce', desc: 'Prosisz o rewanż.', effects: { media: 4, form: 2 } },
    ],
  },
  {
    id: 'kryptowaluty',
    title: 'ClinchCoin',
    once: true,
    weight: 4,
    cond: (s) => s.money >= 80000,
    text: () => 'Znajomy z siłowni namawia cię na inwestycję w nową kryptowalutę „ClinchCoin”. Ma pierwsze zyski i zrzuty ekranu.',
    choices: () => [
      {
        label: 'Wchodzisz za 40 tys. zł',
        desc: 'Do księżyca.',
        chance: 25,
        success: { money: 90000, note: 'ClinchCoin wystrzelił' },
        fail: { money: -40000, note: 'ClinchCoin zniknął z giełdy' },
        successText: 'Sprzedajesz na szczycie. Znajomy zostaje i traci wszystko.',
        failText: 'Twórcy ClinchCoina wyjechali na Dominikanę. Z twoimi pieniędzmi.',
      },
      { label: 'Odmawiasz', desc: 'Pieniądze lubią ciszę.', effects: {} },
    ],
  },
  {
    id: 'biografia',
    title: 'Biografia',
    once: true,
    weight: 3,
    cond: (s) => s.belts.length >= 2 && s.age >= 27,
    text: () => 'Wydawnictwo chce wydać twoją biografię. Ghostwriter zadaje pytania o dzieciństwo, porażki i pierwsze rękawice.',
    choices: (s) => [
      { label: 'Opowiadasz wszystko', desc: 'Bez upiększania.', effects: { money: cash(s, 0.1, 25000), media: 5, rep: 2 } },
      { label: 'Odkładasz to na emeryturę', desc: 'Historia jeszcze się pisze.', effects: { form: 1 } },
    ],
  },
  {
    id: 'kontuzja_trenera',
    title: 'Trener w szpitalu',
    weight: 3,
    cond: (s) => s.club.quality >= 3,
    text: () => 'Twój trener trafia do szpitala z zawałem tuż przed obozem. Asystent ma 24 lata i dużo zapału.',
    choices: () => [
      { label: 'Dajesz szansę asystentowi', desc: 'Młody, ale głodny.', chance: 50, success: { form: 2, stats: { iq: 1 } }, fail: { form: -3 } },
      { label: 'Robisz obóz w innym klubie', desc: 'Kosztuje, ale pewniej.', effects: { money: -10000, form: 1 } },
    ],
  },
  {
    id: 'sauna_pomysl',
    title: 'Sauna w ogrodzie',
    once: true,
    weight: 3,
    cond: (s) => s.money >= 30000 && s.age >= 24,
    text: () => 'Fizjoterapeuta przekonuje, że własna sauna i balia z lodem w ogrodzie to „najlepsza inwestycja w regenerację”.',
    choices: () => [
      { label: 'Stawiasz saunę', desc: 'Sąsiedzi patrzą zza płotu.', effects: { money: -25000, wear: -6, relations: 2 } },
      { label: 'Wystarczy siłownia', desc: 'Kiedyś. Może.', effects: {} },
    ],
  },
  {
    id: 'rekord_wagi',
    title: 'Waga nie schodzi',
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Dzień przed ważeniem waga pokazuje 1,5 kg za dużo. Trener patrzy na saunę, dietetyk na ciebie.',
    choices: (s) => [
      { label: 'Sauna do ostatniej kropli', desc: 'Wchodzisz w limit, ale suchy jak wiór.', effects: { form: -2, wear: 2 } },
      { label: 'Przyjmujesz karę 20% gaży', desc: 'Zdrowie ważniejsze.', effects: { money: -Math.max(1000, Math.round((s.contract.purse * 0.2) / 100) * 100), rep: -2, form: 1 } },
    ],
  },
  {
    id: 'ojciec_dumny',
    title: 'Plakat w warsztacie',
    once: true,
    weight: 6,
    cond: (s) => s.belts.some((b) => !b.name.startsWith(BELT_NAMES[0])),
    text: () => 'Ojciec, który kiedyś mówił, że to „zabawa dla patusów”, wiesza twój plakat w warsztacie i pokazuje go każdemu klientowi.',
    choices: () => [
      { label: 'Dzwonisz do niego', desc: 'Rozmowa trwa dwie godziny.', effects: { relations: 5, form: 2 } },
      { label: 'Udajesz, że nie wiesz', desc: 'Ale w środku coś cię ściska.', effects: { relations: 1 } },
    ],
  },
  {
    id: 'obi_stacja',
    title: 'Twarz na kubkach',
    once: true,
    weight: 4,
    cond: (s) => s.media >= 30 && s.tier >= 2,
    text: () => 'Sieć stacji paliw chce dać twoje zdjęcie na kubki do kawy w całej Polsce. „Tankuj jak mistrz”.',
    choices: (s) => [
      {
        label: 'Bierzesz',
        desc: 'Twoja twarz przy każdym hot-dogu.',
        effects: { sponsor: { name: 'Stacje „Orlik Paliwa”', perSeason: 30000 + s.tier * 10000, seasonsLeft: 2, clause: 'twoja twarz na kubkach' }, media: 4 },
      },
      { label: 'Odmawiasz', desc: 'Kubki to nie twój styl.', effects: {} },
    ],
  },
  ...EXTRA_EVENTS,
  ...MONEY_EVENTS,
  ...REP_EVENTS,
  ...STAGE_EVENTS,
];

export function eventWeight(e: EventDef, s: GameState): number {
  if (e.once && s.seenEvents.includes(e.id)) return 0;
  if (!e.once && s.seenEvents.slice(-6).includes(e.id)) return 0;
  if (!e.cond(s)) return 0;
  return e.weight;
}

export function findEvent(id: string): EventDef | undefined {
  return EVENTS.find((e) => e.id === id);
}
