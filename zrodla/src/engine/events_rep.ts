// Zdarzenia o wizerunku: drobne sytuacje z życia, w których to gracz decyduje, jak się zachować.
// Zmiany reputacji są małe (zwykle 1–3 pkt), żeby o opinii decydowały głównie walki i wybory, a nie los.
import type { EventDef } from './events';
import type { GameState } from './types';

const vary = (s: GameState, arr: string[]) => arr[(s.season * 3 + s.age * 7) % arr.length];

export const REP_EVENTS: EventDef[] = [
  {
    id: 'silownia_nagranie',
    title: 'Nagranie z siłowni',
    weight: 3,
    cond: (s) => s.age >= 18,
    text: (s) =>
      vary(s, [
        'Na siłowni koleś od kwadransa siedzi na ławce z telefonem. Prosisz grzecznie, a on rzuca: „A co, myślisz, że jak bijesz się w klatce, to wszystko ci wolno?”. Ktoś obok wyciąga telefon i nagrywa.',
        'Typ na siłowni zaczepia cię przy sztandze: „Ty jesteś tym zawodnikiem? Pokaż, co umiesz”. Jego kolega już nagrywa telefonem.',
      ]),
    choices: () => [
      { label: 'Odpuszczasz z uśmiechem', desc: 'Mówisz „miłego treningu” i idziesz na inną ławkę.', effects: { rep: 2, note: 'filmik „zawodnik z klasą”' } },
      { label: 'Mówisz mu, co myślisz', desc: 'Głośno i dosadnie.', effects: { rep: -2, media: 2, note: 'filmik krąży po grupach' } },
    ],
  },
  {
    id: 'babcia_zakupy',
    title: 'Ciężkie zakupy',
    weight: 3,
    cond: () => true,
    text: () => 'Wracasz z treningu. Starsza pani pod blokiem mocuje się z dwiema siatkami ziemniaków i zgrzewką wody. Czwarte piętro, bez windy.',
    choices: () => [
      { label: 'Wnosisz zakupy', desc: 'Po treningu nogi i tak już bolą.', effects: { rep: 1, relations: 1, note: 'sąsiadka wrzuca zdjęcie na grupę osiedla' } },
      { label: 'Spieszysz się', desc: 'Za godzinę drugi trening.', effects: { form: 1 } },
    ],
  },
  {
    id: 'hejter_komentarz',
    title: 'Komentarz pod postem',
    weight: 3,
    cond: (s) => s.tier >= 1 && s.media >= 10,
    text: () => 'Pod twoim zdjęciem z treningu ktoś pisze: „Nic nie umiesz, wygrywasz tylko z emerytami”. Ma czterdzieści polubień.',
    choices: () => [
      { label: 'Ignorujesz', desc: 'Telefon do torby, wracasz do treningu.', effects: { form: 1 } },
      { label: 'Odpisujesz z humorem', desc: '„Zapraszam na sparing, emeryci też trenują.”', effects: { media: 2, rep: 1 } },
      { label: 'Odpisujesz ostro', desc: 'Trzy akapity, wielkie litery.', effects: { media: 2, rep: -2 } },
    ],
  },
  {
    id: 'bojka_pod_klubem',
    title: 'Awantura pod klubem',
    weight: 2,
    cond: (s) => s.age >= 19,
    text: () => 'Wychodzisz z urodzin kolegi. Przed lokalem dwóch pijanych zaczepia chłopaka, który nie wygląda, jakby umiał się bronić.',
    choices: () => [
      { label: 'Rozdzielasz ich spokojnie', desc: 'Stajesz pomiędzy i rozmawiasz.', test: 'iq', success: { rep: 2, note: 'obeszło się bez ciosów' }, fail: { rep: -1, wear: 2, note: 'policja spisuje wszystkich' }, successText: 'Wystarcza, że staniesz pomiędzy i spokojnie powiesz kilka słów. Pijani odchodzą, a chłopak dziękuje ci łamiącym się głosem.', failText: 'Jeden z pijanych rzuca się na ciebie. Kończy się przepychanką, a policja spisuje wszystkich, także ciebie.' },
      { label: 'Dzwonisz po policję', desc: 'Od tego oni są.', effects: { rep: -6 } },
      { label: 'Idziesz do domu', desc: 'To nie twoja sprawa.', effects: {} },
    ],
  },
  {
    id: 'trening_charytatywny',
    title: 'Trening dla fundacji',
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Fundacja dla dzieci z domu dziecka prosi, żebyś poprowadził otwarty trening. Bez honorarium, cały dochód z biletów idzie na fundację.',
    choices: () => [
      { label: 'Prowadzisz trening', desc: 'Sobota rano zamiast odpoczynku.', effects: { rep: 3, wear: 1 } },
      { label: 'Przekazujesz rękawice na licytację', desc: 'Z autografem.', effects: { rep: 1 } },
      { label: 'Odmawiasz', desc: 'Obóz, nie ma kiedy.', effects: { form: 1 } },
    ],
  },
  {
    id: 'stacja_benzynowa',
    title: 'Na stacji benzynowej',
    weight: 2,
    cond: (s) => s.tier >= 1 && s.media >= 15,
    text: () => 'O drugiej w nocy na stacji poznaje cię grupka kibiców po meczu. Chcą zdjęcie, a jeden koniecznie chce „sprawdzić, jak mocno bijesz”.',
    choices: () => [
      { label: 'Zdjęcie i do domu', desc: 'Uśmiech, piątka, kluczyki.', effects: { rep: 1, media: 1 } },
      { label: 'Dajesz mu „sprawdzić”', desc: 'Lekki cios w łapę.', chance: 50, success: { media: 2, note: 'filmik „pokazał, jak bije”' }, fail: { rep: -2, media: 1, note: 'ktoś nagrał tylko końcówkę' }, successText: 'Lekki cios w otwartą dłoń, wszyscy się śmieją. Filmik krąży, ale w dobrym tonie.', failText: 'Kibic się przewraca, a w internecie ląduje tylko końcówka filmiku. Wygląda gorzej, niż było.' },
    ],
  },
  {
    id: 'sedzia_krytyka',
    title: 'Pytanie o sędziów',
    weight: 2,
    cond: (s) => s.tier >= 1 && s.record.l >= 1,
    text: () => 'Dziennikarz pyta o twoją ostatnią porażkę na punkty. „Czy sędziowie dobrze to widzieli?”',
    choices: () => [
      { label: 'Bierzesz to na siebie', desc: '„Trzeba było zrobić więcej.”', effects: { rep: 2 } },
      { label: 'Krytykujesz sędziów', desc: '„Złodziejstwo, trzeba to powiedzieć głośno.”', effects: { media: 2, rep: -2 } },
    ],
  },
  {
    id: 'pomoc_wypadek',
    title: 'Wypadek na drodze',
    once: true,
    weight: 2,
    cond: (s) => s.age >= 19,
    text: () => 'W drodze na trening widzisz auto w rowie. Kierowca jest przytomny, ale zakleszczony. Nikt się nie zatrzymuje.',
    choices: () => [
      { label: 'Zatrzymujesz się i pomagasz', desc: 'Spóźnisz się na trening.', effects: { rep: 3, form: -1, note: 'lokalna gazeta pisze o „zawodniku na ratunek”' } },
      { label: 'Dzwonisz pod 112 i jedziesz dalej', desc: 'Pomoc jest w drodze.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'prank_youtuber',
    title: 'Youtuber z kamerą',
    weight: 2,
    cond: (s) => s.tier >= 1 && s.media >= 20,
    text: () => 'Znany youtuber chce nagrać z tobą „prank”: udajesz ochroniarza w galerii i „wyprowadzasz” przypadkowych ludzi. Obiecuje milion wyświetleń.',
    choices: () => [
      { label: 'Nagrywasz', desc: 'Milion wyświetleń to milion wyświetleń.', effects: { media: 4, rep: -3 } },
      { label: 'Proponujesz trening zamiast pranku', desc: 'Niech on spróbuje sparingu.', effects: { media: 2, rep: 1 } },
      { label: 'Odmawiasz', desc: 'Nie twoja bajka.', effects: {} },
    ],
  },
  {
    id: 'sekcja_dzieci',
    title: 'Zastępstwo w sekcji dzieci',
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => 'Trener prosi, żebyś przez miesiąc poprowadził zajęcia dla dzieciaków. Dwa razy w tygodniu, za symboliczne pieniądze.',
    choices: () => [
      { label: 'Prowadzisz zajęcia', desc: 'Dzieciaki nazywają cię „trenerem”.', effects: { rep: 2, relations: 1, money: 300, wear: 1 } },
      { label: 'Odmawiasz', desc: 'Własny trening ważniejszy.', effects: { form: 1 } },
    ],
  },
  {
    id: 'parkowanie',
    title: 'Miejsce dla niepełnosprawnych',
    weight: 2,
    cond: (s) => s.age >= 19 && s.media >= 15,
    text: () => 'Spóźniony na wywiad, widzisz jedno wolne miejsce pod studiem. Dla niepełnosprawnych. Przed wejściem stoi fotoreporter.',
    choices: () => [
      { label: 'Szukasz innego miejsca', desc: 'Spóźnisz się dziesięć minut.', effects: { rep: 1, media: -1 } },
      { label: 'Parkujesz „na chwilę”', desc: 'Przecież zaraz wychodzisz.', chance: 40, success: { note: 'nikt nie zauważył' }, fail: { rep: -3, media: 1, note: 'zdjęcie w portalu plotkarskim' }, successText: 'Nikt nie robi zdjęcia. Tym razem.', failText: 'Wieczorem twoje auto na miejscu dla niepełnosprawnych jest na głównej portalu plotkarskiego.' },
    ],
  },
];
