// Zdarzenia zależne od etapu kariery: środek (gale krajowe, Europa) i schyłek.
// Wcześniej większość zdarzeń pasowała wszędzie; te mają sens tylko w konkretnym momencie drogi.
import type { EventDef } from './events';
import type { GameState } from './types';
import { cash } from './events_money';

const vary = (s: GameState, arr: string[]) => arr[(s.season * 7 + s.age * 3) % arr.length];
const zl = (n: number) => `${n.toLocaleString('pl-PL')} zł`;
const mid = (s: GameState) => s.tier >= 1 && s.tier <= 3 && s.contract.kind !== 'freak';

export const STAGE_EVENTS: EventDef[] = [
  // ---------- Narodziny rywalizacji ----------
  {
    id: 'rywal_narodziny',
    title: 'Ktoś cię zapamiętał',
    once: true,
    weight: 6,
    cond: (s) => !s.rivalId && s.season >= 2 && s.peers.some((p) => !p.retired && Math.abs(p.tier - s.tier) <= 1),
    text: (s) => {
      const p = [...s.peers].filter((x) => !x.retired && Math.abs(x.tier - s.tier) <= 1).sort((a, b) => b.talent - a.talent)[0];
      return `${p.firstName} ${p.lastName} z twojego rocznika w wywiadzie po wygranej mówi: „W Polsce w tej wadze liczy się tylko jeden zawodnik i to nie jest ${s.profile.lastName}”. Klip wrzucają wszystkie grupy o MMA. Od tej chwili kibice mają was za rywali.`;
    },
    choices: () => [
      { label: 'Odpowiadasz w mediach', desc: '„Powtórz to w klatce.”', effects: { media: 3, flag: 'rivalPick', note: 'masz rywala na lata' } },
      { label: 'Zapisujesz to sobie', desc: 'Zdjęcie wywiadu wisi teraz nad workiem.', effects: { form: 2, flag: 'rivalPick', note: 'masz rywala na lata' } },
    ],
  },

  // ---------- Środek kariery ----------
  {
    id: 'trener_konflikt',
    title: 'Spięcie z trenerem',
    weight: 3,
    cond: (s) => mid(s) && s.clubSeasons >= 3,
    text: (s) =>
      vary(s, [
        'Trener po sparingu bierze cię na bok: „Od roku robisz po swojemu. Albo słuchasz, albo szukaj sobie innej sali”. Reszta grupy udaje, że nie słyszy.',
        'Trener nie zgadza się z twoim planem na ten rok. Uważa, że za często bierzesz walki i za mało trenujesz. Rozmowa robi się głośna.',
      ]),
    choices: () => [
      { label: 'Przyznajesz mu rację', desc: 'Ego zostaje w szatni.', effects: { relations: 2, form: 2 } },
      { label: 'Stawiasz na swoim', desc: 'To twoja kariera.', effects: { relations: -3, media: 1, note: 'w klubie zrobiło się chłodno' } },
      { label: 'Dobierasz trenera od stójki', desc: 'Prywatne treningi poza klubem.', effects: { money: -4000, relations: -1, stats: { stand: 1 } } },
    ],
  },
  {
    id: 'narożnik_mlody',
    title: 'Narożnik dla młodego',
    weight: 3,
    cond: (s) => s.tier >= 2 && s.age >= 25,
    text: () => 'Dziewiętnastolatek z twojego klubu jedzie na pierwsze amatorskie zawody. Prosi, żebyś stanął mu w narożniku. Mówi, że ogląda wszystkie twoje walki.',
    choices: () => [
      { label: 'Jedziesz z nim', desc: 'Sobota w hali sportowej zamiast regeneracji.', test: 'iq', success: { rep: 3, relations: 2, note: 'młody wygrywa, w narożniku się popłakał' }, fail: { rep: 1, relations: 1, note: 'przegrał, ale wie, że nie był sam' }, successText: 'Między rundami mówisz mu trzy zdania. W trzeciej rundzie obala i wygrywa na punkty. Rzuca ci się na szyję.', failText: 'Młody przegrywa na punkty, ale po walce mówi, że twoje wskazówki to była najlepsza lekcja w jego życiu.' },
      { label: 'Odmawiasz', desc: 'Masz własny obóz.', effects: { form: 1, relations: -1 } },
    ],
  },
  {
    id: 'antydoping',
    title: 'Kontrola antydopingowa',
    weight: 2,
    cond: (s) => s.tier >= 2,
    text: () => 'Szósta rano, dzwonek do drzwi. Dwóch panów z walizeczką: kontrola antydopingowa poza zawodami. Sąsiadka wygląda przez wizjer i pyta, czy to kurier, bo ona też czeka na paczkę.',
    choices: () => [
      { label: 'Otwierasz i oddajesz próbkę', desc: 'Nie masz nic do ukrycia.', effects: { rep: 1, note: 'wynik czysty' } },
      { label: 'Prosisz o dziesięć minut', desc: 'Musisz się ogarnąć.', chance: 65, success: { note: 'kontrolerzy czekają, wynik czysty' }, fail: { rep: -4, media: 2, note: 'portal pisze o „unikaniu kontroli”' }, successText: 'Kontrolerzy czekają na klatce schodowej. Wynik jest czysty i nikt o tym nie słyszy.', failText: 'Dziesięć minut wystarcza, żeby ktoś z sąsiadów zrobił zdjęcie. Tydzień później portal pisze o „unikaniu kontroli”.' },
    ],
  },
  {
    id: 'sparing_nowy',
    title: 'Nowy na sparingach',
    weight: 3,
    cond: (s) => mid(s),
    text: () => 'Na sparingi przychodzi nowy, ciężki chłopak z Ukrainy. Od pierwszej minuty idzie na sto procent, jakby to był finał mistrzostw.',
    choices: () => [
      { label: 'Odpowiadasz tym samym', desc: 'Pokażesz mu, gdzie jest.', test: 'chin', success: { stats: { chin: 1, stand: 1 }, wear: 2, note: 'od jutra sparuje spokojniej' }, fail: { wear: 6, form: -2, note: 'tydzień z bólem głowy' }, successText: 'Po dwóch rundach on łapie oddech, a ty dalej idziesz. Od jutra sparuje spokojniej i szanuje cię na sali.', failText: 'Łapiesz czysty prawy i siadasz na macie. Przez tydzień boli cię głowa.' },
      { label: 'Mówisz mu, żeby zwolnił', desc: 'Sparing to nie walka.', effects: { relations: 1, form: 1 } },
      { label: 'Robisz z nim tylko zapasy', desc: 'Bez uderzeń, technika.', effects: { stats: { wrest: 1 } } },
    ],
  },
  {
    id: 'oboz_wielki_klub',
    title: 'Zaproszenie na obóz',
    weight: 2,
    cond: (s) => s.tier >= 2 && s.rank !== null && s.rank <= 6,
    text: (s) => `Najmocniejszy klub w kraju zaprasza cię na dwa tygodnie obozu z ich czołówką. Koszty pobytu po twojej stronie: ${zl(cash(s, 0.05, 2000, 15000))}. Twój trener udaje, że się cieszy.`,
    choices: (s) => [
      { label: 'Jedziesz', desc: 'Sparingi z najlepszymi w Polsce.', effects: { money: -cash(s, 0.05, 2000, 15000), stats: { wrest: 1, iq: 1 }, relations: -1 } },
      { label: 'Zostajesz w swoim klubie', desc: 'Lojalność też coś znaczy.', effects: { relations: 3 } },
    ],
  },
  {
    id: 'weteran_mentor',
    title: 'Rada od weterana',
    weight: 2,
    cond: (s) => s.tier >= 1 && s.tier <= 3 && s.age >= 22 && s.age <= 29,
    text: () => 'Po gali w kuluarach zaczepia cię były mistrz Europy, dziś trener. „Masz papiery, ale bijesz się głupio. Przyjedź do mnie na tydzień, pokażę ci, gdzie tracisz rundy”.',
    choices: () => [
      { label: 'Jedziesz na tydzień', desc: 'Kanapa u niego w salonie, trening trzy razy dziennie.', effects: { stats: { iq: 2 }, form: 1, money: -1500 } },
      { label: 'Dziękujesz grzecznie', desc: 'Masz swojego trenera.', effects: { relations: 1 } },
    ],
  },
  {
    id: 'podcast_duzy',
    title: 'Zaproszenie do podcastu',
    weight: 2,
    cond: (s) => s.tier >= 2 && s.media >= 25,
    text: () => 'Najpopularniejszy podcast o sportach walki chce trzygodzinną rozmowę. Prowadzący lubi pytać o pieniądze, sędziów i konflikty.',
    choices: () => [
      { label: 'Mówisz szczerze', desc: 'O wyrzeczeniach, długach i pierwszych walkach.', effects: { rep: 2, media: 3 } },
      { label: 'Rzucasz kontrowersyjne teksty', desc: 'Klipy same się zrobią.', effects: { media: 6, rep: -3 } },
      { label: 'Odmawiasz', desc: 'Trzy godziny to cały trening.', effects: { form: 1 } },
    ],
  },
  {
    id: 'kontuzja_sparing_mid',
    title: 'Kolano na sparingu',
    weight: 2,
    cond: (s) => s.tier >= 1 && s.age >= 24 && !s.injury,
    text: () => 'Przy obronie obalenia coś strzela w kolanie. Ortopeda mówi, że to naciągnięcie, ale „lepiej odpuścić na kilka tygodni”.',
    choices: () => [
      { label: 'Odpuszczasz cztery tygodnie', desc: 'Rehabilitacja i rower stacjonarny.', effects: { form: -2, wear: -2 } },
      { label: 'Trenujesz z ortezą', desc: 'Obóz nie poczeka.', chance: 55, success: { form: 1, note: 'kolano wytrzymało' }, fail: { injury: { name: 'naderwane więzadło w kolanie', seasons: 1, penalty: 6 }, note: 'kolano nie wytrzymało' }, successText: 'Orteza trzyma, kolano też. Po obozie nikt nie pamięta, że coś strzeliło.', failText: 'Na trzecim treningu kolano ucieka w bok. Tym razem to naderwane więzadło.' },
    ],
  },

  // ---------- Schyłek kariery ----------
  {
    id: 'mlody_wilk',
    title: 'Młody wilk',
    weight: 3,
    cond: (s) => s.age >= 31 && s.tier >= 1 && s.contract.kind !== 'freak',
    text: () => 'Dwudziestolatek z niepokonanym rekordem nagrywa filmik: „Szanuję weteranów, ale czas ustąpić miejsca. Daj mi walkę albo idź na emeryturę”.',
    choices: () => [
      { label: 'Przyjmujesz wyzwanie', desc: 'Pokażesz mu, czym jest doświadczenie.', effects: { media: 3, form: 2, note: 'motywacja na cały rok' } },
      { label: 'Odpowiadasz z klasą', desc: '„Powodzenia, młody. Zobaczymy się kiedyś.”', effects: { rep: 2 } },
      { label: 'Wyśmiewasz go', desc: '„Jak skończysz liceum, pogadamy.”', effects: { media: 2, rep: -1 } },
    ],
  },
  {
    id: 'cialo_mowi_dosc',
    title: 'Ciało mówi swoje',
    weight: 3,
    cond: (s) => s.age >= 32 && s.wear >= 30,
    text: () => 'Rano schodzenie z łóżka zajmuje ci dwie minuty. Barki strzelają, kolana trzeszczą, a po sparingu potrzebujesz trzech dni zamiast jednego.',
    choices: (s) => [
      { label: 'Fizjoterapia i joga', desc: `Dwa razy w tygodniu, ${zl(cash(s, 0.03, 1000, 12000))} za rok.`, effects: { money: -cash(s, 0.03, 1000, 12000), wear: -6 } },
      { label: 'Mniej sparingów', desc: 'Więcej techniki, mniej wojny.', effects: { wear: -3, form: -1 } },
      { label: 'Zaciskasz zęby', desc: 'Odpoczniesz na emeryturze.', effects: { wear: 3, form: 1 } },
    ],
  },
  {
    id: 'oferta_trenerska',
    title: 'Propozycja trenerska',
    weight: 2,
    cond: (s) => s.age >= 33 && s.tier >= 2,
    text: () => 'Klub z twojego województwa proponuje ci prowadzenie grupy zawodniczej. Na razie dwa razy w tygodniu, a po karierze pełen etat.',
    choices: (s) => [
      { label: 'Bierzesz grupę', desc: 'Pierwsze kroki jako trener.', effects: { money: cash(s, 0.03, 2000, 20000), relations: 2, stats: { iq: 1 }, form: -1 } },
      { label: 'Jeszcze nie teraz', desc: 'Najpierw kariera.', effects: { form: 1 } },
    ],
  },
  {
    id: 'pozegnanie_pytanie',
    title: 'Pytanie o emeryturę',
    weight: 2,
    cond: (s) => s.age >= 34 && s.tier >= 1,
    text: () => 'Na konferencji dziennikarz pyta wprost: „Ile jeszcze walk przed tobą? Nie myślisz o tym, żeby skończyć, póki jesteś zdrowy?”. Na sali robi się cicho.',
    choices: () => [
      { label: '„Skończę, kiedy przestanę wygrywać”', desc: 'Pewnie i bez wahania.', effects: { media: 2, form: 1 } },
      { label: '„Myślę o tym codziennie”', desc: 'Szczerze, jak nigdy.', effects: { rep: 2, note: 'kibice doceniają szczerość' } },
    ],
  },
];
