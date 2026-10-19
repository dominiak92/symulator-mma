// Zdarzenia z przymrużeniem oka: szatnia, rodzina, media, sponsorzy i życie zawodnika poza klatką.
// Wszystko fikcyjne. Każde ma prawdziwy wybór i skutki, a nie tylko żart.
import type { EventDef } from './events';
import type { GameState } from './types';
import { cash } from './events_money';

const vary = (s: GameState, arr: string[]) => arr[(s.season * 11 + s.age * 5) % arr.length];

export const FUN_EVENTS: EventDef[] = [
  {
    id: 'babcia_rosol',
    title: 'Babcia i dieta',
    weight: 4,
    cond: (s) => s.tier >= 0,
    text: (s) =>
      vary(s, [
        'Tydzień przed walką babcia stawia przed tobą talerz rosołu, schabowego i trzy rodzaje ciasta. „Ty taki chudy, jak ty się bić będziesz?”',
        'Niedzielny obiad u babci. Na stole pierogi w czterech smakach. Dietetyk pisze na WhatsAppie: „Mam nadzieję, że trzymasz makro”.',
      ]),
    choices: () => [
      { label: 'Jesz wszystko', desc: 'Babci się nie odmawia.', effects: { relations: 2, form: -1, note: 'waga skacze, babcia szczęśliwa' } },
      { label: 'Tłumaczysz, czym jest makro', desc: 'Pół godziny wykładu o białku.', chance: 35, success: { relations: 1, form: 1, note: 'babcia robi ci kurczaka na parze' }, fail: { relations: -1, note: 'babcia obrażona do świąt' }, successText: 'Babcia słucha, kiwa głową i w środę przynosi ci pudełko kurczaka z ryżem. Podpisane: „makro”.', failText: 'Babcia wychodzi do kuchni i trzaska drzwiami. Mama mówi, że to przez ciebie nie będzie sernika na święta.' },
    ],
  },
  {
    id: 'sasiad_wiertarka',
    title: 'Sąsiad z wiertarką',
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => 'Środek ciężkiego obozu, rano masz sparingi, a sąsiad zza ściany zaczyna remont. O 23:40 wiertarka udarowa, o 0:15 młotek. „Muszę skończyć półkę przed weekendem”.',
    choices: () => [
      { label: 'Idziesz porozmawiać', desc: 'Grzecznie, ale stanowczo.', chance: 60, success: { form: 1, note: 'sąsiad przeprasza i przynosi ciasto' }, fail: { media: 1, rep: -1, note: 'sąsiad nagrywa cię telefonem' }, successText: 'Sąsiad okazuje się twoim kibicem, przeprasza i zostawia pod drzwiami blachę szarlotki. Śpisz jak dziecko.', failText: 'Sąsiad nagrywa rozmowę i wrzuca do grupy osiedlowej z podpisem „zawodnik MMA grozi emerytowi”. Nikt nie grozi, ale komentarze są.' },
      { label: 'Zatyczki i sen', desc: 'Nie dasz się wyprowadzić z równowagi.', effects: { form: -1, note: 'spałeś cztery godziny' } },
    ],
  },
  {
    id: 'tiktok_trend',
    title: 'Trend na TikToku',
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) =>
      vary(s, [
        'Klubowy social media manager chce, żebyś nagrał taniec do modnego trendu. W rękawicach. „Algorytm to kocha”.',
        'Młodsi koledzy z klubu nagrywają filmik „zawodnik MMA ocenia pierogi z różnych miast”. Chcą, żebyś był jurorem.',
      ]),
    choices: () => [
      { label: 'Wchodzisz w to', desc: 'Raz się żyje.', chance: 55, success: { media: 3, note: 'filmik ma milion wyświetleń' }, fail: { media: 1, rep: -2, note: 'internet się śmieje, ale nie z tobą' }, successText: 'Filmik ma milion wyświetleń w dwa dni. W komentarzach ktoś pisze, że „tańczy lepiej, niż się bije”. Trener udaje, że nie widział.', failText: 'Ruszasz się jak szafa na kółkach. Komentarze bezlitosne, a rywal udostępnia filmik z trzema emotkami płaczu ze śmiechu.' },
      { label: 'Odmawiasz', desc: 'Jesteś tu, żeby się bić.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'mama_w_hali',
    title: 'Mama na trybunach',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && !!s.proDebut,
    text: () => 'Mama po raz pierwszy przychodzi na twoją galę. Przyniosła transparent „SYNKU, NIE DAJ SIĘ” i kanapki dla całego sektora.',
    choices: () => [
      { label: 'Machasz do niej przed walką', desc: 'Kamera to łapie.', effects: { relations: 2, media: 2, form: 1, note: 'cała hala bije brawo mamie' } },
      { label: 'Prosisz, żeby schowała transparent', desc: 'Skupienie przede wszystkim.', effects: { relations: -2, form: 1 } },
    ],
  },
  {
    id: 'kot_trenera',
    title: 'Kot trenera',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 0,
    text: () => 'Trener przyprowadza na salę kota, bo „sam w domu się nudzi”. Kot śpi na macie do parteru, dokładnie tam, gdzie macie robić drille.',
    choices: () => [
      { label: 'Trenujecie wokół kota', desc: 'Kot ma pierwszeństwo.', effects: { stats: { iq: 1 }, relations: 1, note: 'uczysz się kontroli pozycji w ograniczonej przestrzeni' } },
      { label: 'Przenosisz kota', desc: 'Delikatnie.', chance: 50, success: { media: 2, note: 'zdjęcie z kotem robi furorę' }, fail: { wear: 1, note: 'kot nie był zachwycony' }, successText: 'Kot mruczy ci w ramionach. Ktoś robi zdjęcie, a profil klubu ma rekord polubień.', failText: 'Kot wyraźnie nie zgadza się z decyzją. Trzy zadrapania na przedramieniu wyglądają gorzej niż po sparingu.' },
    ],
  },
  {
    id: 'reklama_pierogi',
    title: 'Reklama pierogarni',
    weight: 3,
    cond: (s) => s.tier >= 1 && s.tier <= 3 && s.media >= 10,
    text: () => 'Lokalna pierogarnia chce nakręcić z tobą reklamę: rozbijasz deskę ręką, a z deski wypadają pierogi. Hasło: „Siła z ciasta”.',
    choices: (s) => [
      { label: 'Kręcisz', desc: 'Pieniądze i pierogi gratis do końca roku.', effects: { money: cash(s, 0.03, 1500), media: 2, rep: -1, note: 'koledzy wołają na ciebie „Pierożek”' } },
      { label: 'Odmawiasz', desc: 'Godność ponad pierogi.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'pomylka_hotel',
    title: 'Pomyłka w hotelu',
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: () => 'Organizator gali zakwaterował cię w jednym pokoju z rywalem z karty wstępnej. Dwa łóżka, jedna łazienka, zero planu.',
    choices: () => [
      { label: 'Zostajesz', desc: 'Jak dorośli ludzie.', chance: 60, success: { rep: 2, media: 1, note: 'wspólne zdjęcie z rywalem obiega internet' }, fail: { form: -2, note: 'rywal chrapie jak traktor' }, successText: 'Wieczorem gracie razem w karty, rano robicie sobie zdjęcie w szlafrokach. Kibice piszą, że „tak powinien wyglądać sport”.', failText: 'Rywal chrapie jak traktor w żniwa. Zasypiasz o czwartej z poduszką na głowie.' },
      { label: 'Żądasz innego pokoju', desc: 'Organizator się krzywi.', effects: { form: 1, rep: -1 } },
    ],
  },
  {
    id: 'ochroniarz_wejscie',
    title: 'Ochroniarz cię nie wpuszcza',
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Federacja zaprasza cię na galę, żebyś pokazał się kibicom z klatki. Ochroniarz przy wejściu dla zawodników nie wierzy, że jesteś na liście. „Każdy tak mówi. Bilet?”',
    choices: () => [
      { label: 'Pokazujesz plakat na telefonie', desc: 'Twoja twarz, jego zdziwienie.', effects: { media: 1, note: 'ochroniarz prosi o autograf dla syna' } },
      { label: 'Dzwonisz do organizatora', desc: 'Dwadzieścia minut czekania na zimnie.', effects: { form: -1, note: 'katar po czekaniu na zimnie' } },
    ],
  },
  {
    id: 'auto_cofka',
    title: 'Spodenki w praniu',
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Dwie godziny przed walką okazuje się, że spodenki walkowe zostały w pralce. W hotelu. W innym mieście.',
    choices: () => [
      { label: 'Pożyczasz od kolegi z klubu', desc: 'Dwa rozmiary za duże.', effects: { media: 2, form: -1, note: 'w klatce trzymasz spodenki jedną ręką' } },
      { label: 'Kupujesz w sklepie przy hali', desc: 'Jedyne, jakie mają: różowe z jednorożcem.', effects: { media: 3, rep: 1, note: 'jednorożec staje się twoim znakiem' } },
    ],
  },
  {
    id: 'wujek_rada',
    title: 'Wujek ekspert',
    weight: 3,
    cond: (s) => s.age >= 17,
    text: () => 'Na imieninach wujek, który ostatni raz ćwiczył w wojsku w 1989, tłumaczy ci przy stole, jak „powinieneś był” wygrać ostatnią walkę. Z rysunkami na serwetce.',
    choices: () => [
      { label: 'Słuchasz z uśmiechem', desc: 'Rodzina jest najważniejsza.', effects: { relations: 2, note: 'wujek rozpowiada, że to jego taktyka' } },
      { label: 'Zapraszasz go na sparing', desc: 'Lekki, techniczny.', chance: 85, success: { relations: -1, media: 2, note: 'wujek przyznaje, że to nie takie proste' }, fail: { relations: -3, note: 'wujek obraził się na całą rodzinę' }, successText: 'Po trzydziestu sekundach wujek leży na macie i mówi, że „kolano mu się odezwało”. Filmik ma tysiące wyświetleń.', failText: 'Wujek wychodzi z imienin, a ciocia przez telefon wyjaśnia twojej mamie, że „syn ma za dużo w głowie”.' },
    ],
  },
  {
    id: 'kanapka_waga',
    title: 'Kanapka na wadze',
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: () => 'Przy oficjalnym ważeniu rywal wyjmuje z kieszeni kanapkę ze schabowym i je ją ci przed nosem. Ty nie piłeś wody od wczoraj.',
    choices: () => [
      { label: 'Patrzysz mu w oczy', desc: 'Kamień.', effects: { rep: 2, form: 1 } },
      { label: 'Zabierasz mu kanapkę', desc: 'I zjadasz.', chance: 50, success: { media: 4, note: 'klip roku' }, fail: { media: 2, rep: -2, form: -1, note: 'kara od komisji i ból brzucha' }, successText: 'Hala wybucha śmiechem, rywal stoi z pustą ręką. Klip trafia do wszystkich podsumowań tygodnia.', failText: 'Komisja nie widzi w tym nic śmiesznego, a schabowy po dwóch dniach głodówki to był zły pomysł.' },
    ],
  },
  {
    id: 'fan_tatuaz',
    title: 'Tatuaż fana',
    once: true,
    weight: 3,
    cond: (s) => s.media >= 30,
    text: () => 'Fan wrzuca zdjęcie: wytatuował sobie twoją twarz na łydce. Podobieństwo jest… umowne. Bardziej przypominasz na nim ziemniaka w rękawicach.',
    choices: () => [
      { label: 'Udostępniasz z sercem', desc: 'Szacunek dla oddania.', effects: { media: 3, rep: 1, note: 'fan zostaje lokalną gwiazdą' } },
      { label: 'Fundujesz mu poprawkę', desc: 'U dobrego tatuażysty.', effects: { money: -800, media: 4, rep: 2, note: 'ziemniak zamienia się w ciebie' } },
    ],
  },
  {
    id: 'komentator_myli',
    title: 'Komentator myli nazwisko',
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: (s) => `Przez całą transmisję komentator nazywa cię „${s.profile.lastName.slice(0, -1)}${s.profile.lastName.endsWith('a') ? 'o' : 'a'}”. Internet podchwytuje to szybciej niż ty wstajesz z maty.`,
    choices: () => [
      { label: 'Przyjmujesz nową ksywkę', desc: 'Skoro tak mówią.', effects: { media: 3, note: 'kibice skandują przekręcone nazwisko' } },
      { label: 'Prostujesz w wywiadzie', desc: 'Z uśmiechem.', effects: { rep: 1, media: 1 } },
    ],
  },
  {
    id: 'reklama_bank',
    title: 'Klient banku',
    weight: 2,
    cond: (s) => s.tier >= 2 && s.money >= 50000,
    text: () => 'Doradca w banku, widząc saldo, proponuje ci „produkt inwestycyjny dla sportowców”: fundusz oparty na cenach karmy dla psów.',
    choices: (s) => [
      { label: 'Wchodzisz w to', desc: 'Psy zawsze będą jeść.', chance: 45, success: { money: cash(s, 0.06, 4000), note: 'karma dla psów idzie w górę' }, fail: { money: -cash(s, 0.05, 3000), note: 'kryzys na rynku karmy' }, successText: 'Po pół roku dostajesz list z banku. Wszystko w górę. Doradca pisze, że „zawsze wierzył w psy”.', failText: 'Wielka sieć sklepów wprowadza własną karmę i fundusz leci w dół. Doradca jest na urlopie.' },
      { label: 'Dziękujesz', desc: 'Pieniądze lubią spokój.', effects: { note: 'doradca wysyła ci kalendarz z psami' } },
    ],
  },
  {
    id: 'dziecko_autograf',
    title: 'Mały kibic',
    weight: 3,
    cond: (s) => s.tier >= 1 && s.media >= 15,
    text: () => 'Po treningu czeka na ciebie chłopiec z mamą. Pokazuje ci swój rysunek: ty w klatce, z pasem, a obok smok. „Smok to twój trener”.',
    choices: () => [
      { label: 'Zapraszasz go na trening', desc: 'Niech pozna smoka osobiście.', effects: { rep: 3, relations: 1, form: -1, note: 'trener zaczyna mówić o sobie „smok”' } },
      { label: 'Podpisujesz rysunek', desc: 'I robicie zdjęcie.', effects: { rep: 1, media: 1 } },
    ],
  },
  {
    id: 'sponsor_gadzet',
    title: 'Gadżet od sponsora',
    weight: 3,
    cond: (s) => s.sponsors.length >= 2,
    text: () => 'Sponsor przysyła paczkę: elektryczny pas na brzuch, który „zastępuje 300 brzuszków”. W instrukcji po polsku tylko jedno zdanie: „Nie używać w wannie”.',
    choices: () => [
      { label: 'Testujesz na nagraniu', desc: 'Dla sponsora.', chance: 60, success: { media: 2, note: 'sponsor zachwycony recenzją' }, fail: { wear: 1, media: 2, note: 'pas kopie mocniej niż rywale' }, successText: 'Robisz poważną minę, pas buczy. Sponsor zamawia od razu drugi film.', failText: 'Pas uruchamia się na maksymalnej mocy. Twój krzyk słychać na sąsiedniej ulicy, a nagranie ma setki tysięcy wyświetleń.' },
      { label: 'Oddajesz bratu', desc: 'Niech on się męczy.', effects: { relations: 1 } },
    ],
  },
  {
    id: 'rap_wejscie',
    title: 'Piosenka na wejście',
    weight: 3,
    cond: (s) => s.tier >= 1,
    text: (s) =>
      vary(s, [
        'Kuzyn nagrał dla ciebie piosenkę na wejście. Disco polo o tym, jak „zgasisz światło każdemu rywalowi”. Refren wpada w ucho, niestety.',
        'Lokalny raper proponuje numer na twoje wejście. Rymuje twoje nazwisko z „kombajn”. Nikt nie wie dlaczego.',
      ]),
    choices: () => [
      { label: 'Wchodzisz przy tym', desc: 'Hala to pokocha. Albo nie.', chance: 55, success: { media: 3, relations: 1, note: 'cała hala śpiewa refren' }, fail: { rep: -2, media: 2, note: 'hala w ciszy, rywal się śmieje' }, successText: 'Przy drugim refrenie śpiewa cała hala. Następnego dnia piosenka jest w lokalnym radiu.', failText: 'Ciszę przerywa tylko twój kuzyn, śpiewający z pierwszego rzędu. Rywal na face to face nie może powstrzymać uśmiechu.' },
      { label: 'Zostajesz przy klasyku', desc: 'Sprawdzony numer.', effects: { form: 1 } },
    ],
  },
];
