import { cash } from './events_money';
// Dodatkowe zdarzenia losowe: więcej smaczków ze świata MMA (wszystko fikcyjne, z przymrużeniem oka).
import type { EventDef } from './events';
import type { GameState } from './types';

/** Wybór wariantu tekstu zależny od roku, żeby powtarzalne zdarzenia nie brzmiały tak samo. */
const vary = (s: GameState, arr: string[]) => arr[(s.season * 7 + s.age * 3) % arr.length];

const rivalOf = (s: GameState) => s.peers.find((p) => p.id === s.rivalId && !p.retired);
const rivalHere = (s: GameState) => {
  const r = rivalOf(s);
  return !!r && r.tier === s.tier && s.tier > 0;
};
const rn = (s: GameState) => {
  const r = rivalOf(s);
  return r ? `${r.firstName} ${r.lastName}` : 'twój rywal';
};

export const EXTRA_EVENTS: EventDef[] = [
  // ---------- Amatorka ----------
  {
    id: 'kask_pozyczony',
    title: 'Pożyczony kask',
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0,
    text: () => 'Dzień przed turniejem pęka ci kask. Kolega z klubu pożycza swój. Pachnie jak szatnia po trzech latach, ale innego nie ma.',
    choices: () => [
      { label: 'Bierzesz pożyczony', desc: 'Byle chronił.', effects: { form: -1, note: 'zapach zostaje na długo' } },
      { label: 'Kupujesz nowy', desc: 'Sklep sportowy otwiera się o dziewiątej.', effects: { money: -350, form: 1 } },
    ],
  },
  {
    id: 'wf_zwolnienie',
    title: 'Zwolnienie z WF-u',
    once: true,
    weight: 4,
    cond: (s) => s.tier === 0 && s.age <= 18,
    text: () => 'Wuefista nie wierzy, że trenujesz MMA. Każe ci grać w siatkówkę z resztą klasy, „bo zasady są dla wszystkich”.',
    choices: () => [
      { label: 'Grasz w siatkę', desc: 'Atakujesz piłkę jak rywala.', effects: { stats: { cardio: 1 }, relations: 1 } },
      { label: 'Pokazujesz medal', desc: 'Wuefista robi zdjęcie i wrzuca na stronę szkoły.', effects: { media: 2, rep: 1 } },
    ],
  },
  {
    id: 'bus_na_turniej',
    title: 'Bus na turniej',
    weight: 4,
    cond: (s) => s.tier === 0,
    text: (s) =>
      vary(s, [
        'Klubowy bus na turniej to stary ducato trenera. Siedem godzin w jedną stronę, ogrzewanie działa tylko na pełnej mocy.',
        'Bus klubowy znowu nie odpala. Trener mówi „spokojnie, popchniemy”. Popychacie go całą drużyną.',
        'Na turniej jedziecie w dziewięciu w busie na osiem osób. Ty siedzisz na skrzynce z rękawicami.',
      ]),
    choices: () => [
      { label: 'Jedziesz z ekipą', desc: 'Śpiewy, kanapki z jajkiem i drzemka na torbie.', effects: { relations: 1, form: -1, rep: 1 } },
      { label: 'Jedziesz pociągiem', desc: 'Wygodniej, ale za swoje.', effects: { money: -300, form: 1 } },
    ],
  },
  {
    id: 'sedzia_kolega',
    title: 'Sędzia z sąsiedniego klubu',
    once: true,
    weight: 3,
    cond: (s) => s.tier === 0 && s.amRecord.w + s.amRecord.l >= 2,
    text: () => 'Na turnieju okazuje się, że twoją walkę będzie sędziował trener klubu twojego rywala. Organizator twierdzi, że „nie ma innego”.',
    choices: () => [
      { label: 'Składasz protest', desc: 'Grzecznie, na piśmie.', chance: 50, success: { form: 2, note: 'zmieniają sędziego' }, fail: { rep: -1, form: -1, note: 'protest odrzucony' }, successText: 'Organizator ściąga sędziego z innej maty. Sprawiedliwości stało się zadość.', failText: 'Protest ląduje w koszu, a sędzia patrzy na ciebie spode łba przez cały turniej.' },
      { label: 'Kończysz przed czasem', desc: 'Jak nie będzie decyzji, nie będzie problemu.', effects: { form: 1, note: 'motywacja na plus' } },
    ],
  },
  {
    id: 'pierwszy_wywiad',
    title: 'Pierwszy wywiad',
    once: true,
    weight: 4,
    cond: (s) => s.amRecord.w >= 3 && s.tier <= 1,
    text: () => 'Lokalny portal chce zrobić z tobą wywiad. Redaktor ma 19 lat, nagrywa telefonem i pyta, czy „MMA to nie jest bicie się na ulicy”.',
    choices: () => [
      { label: 'Spokojnie tłumaczysz', desc: 'Sport, zasady, sędziowie, badania.', effects: { rep: 2, media: 1 } },
      { label: 'Rzucasz wyzwanie mistrzowi kraju', desc: 'Klikalność gwarantowana.', effects: { media: 4, rep: -2, note: 'nagłówek: „Młody wilk chce pasa!”' } },
    ],
  },

  // ---------- Gale regionalne ----------
  {
    id: 'walkout_disco',
    title: 'Muzyka na wejście',
    once: true,
    weight: 5,
    cond: (s) => s.tier >= 1,
    text: () => 'Organizator gali pyta o utwór na wejście. Kumple z osiedla namawiają na disco polo. Trener woli coś „groźnego”.',
    choices: () => [
      { label: 'Disco polo', desc: 'Hala śpiewa razem z tobą.', effects: { media: 4, rep: -1, note: 'hala zna refren' } },
      { label: 'Ciężki metal', desc: 'Klasyka gatunku.', effects: { form: 1 } },
      { label: 'Hymn klubu', desc: 'Trener wzruszony.', effects: { rep: 1, relations: 1 } },
    ],
  },
  {
    id: 'face_off_pchniecie',
    title: 'Face to face',
    weight: 4,
    cond: (s) => s.tier >= 1,
    text: (s) =>
      vary(s, [
        'Face to face przed galą. Rywal podchodzi tak blisko, że czujesz jego gumę miętową.',
        'Na face to face rywal zakłada okulary przeciwsłoneczne, choć jesteście w hali bez okien.',
        'Rywal na face to face nic nie mówi, tylko powoli kiwa głową. Fotografowie szaleją.',
      ]),
    choices: () => [
      { label: 'Stoisz spokojnie', desc: 'Patrzysz przez niego jak przez szybę.', effects: { rep: 1, form: 1 } },
      { label: 'Pchasz go', desc: 'Ochrona rozdziela, kamery kręcą.', effects: { media: 3, rep: -2, note: 'kara od organizatora' , money: -500 } },
    ],
  },
  {
    id: 'masarnia_sponsor',
    title: 'Masarnia chce logo',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: () => 'Lokalna masarnia chce sponsorować twoją walkę. Warunek: po wygranej wznosisz do kamery pęto kiełbasy jak pas mistrzowski.',
    choices: () => [
      { label: 'Wznosisz kiełbasę', desc: 'Godność to rzecz względna.', effects: { sponsor: { name: 'Masarnia u Grzesia', perSeason: 3500, seasonsLeft: 2, clause: 'pęto kiełbasy w górę po wygranej' }, media: 2 } },
      { label: 'Odmawiasz', desc: 'Jesteś sportowcem, nie reklamą.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'zbijanie_sauna',
    title: 'Zbijanie wagi',
    weight: 5,
    cond: (s) => s.tier >= 1,
    text: (s) =>
      vary(s, [
        'Dzień przed ważeniem brakuje ci dwóch kilo. Trener przynosi worki na śmieci i włącza saunę na maksa.',
        'Waga pokazuje 1,8 kg za dużo. Kolega z klubu proponuje „sprawdzony sposób”: wanna z gorącą wodą i sól Epsom.',
        'Do ważenia zostało 12 godzin, a ty dalej jesteś ponad limitem. Dietetyk nie odbiera telefonu.',
      ]),
    choices: (s) => [
      { label: 'Zbijasz do końca', desc: 'Ważysz się na styk, potem nawadniasz.', chance: 65, success: { form: 1, note: 'waga zrobiona' }, fail: { form: -4, wear: 2, note: 'zbijanie cię wypompowało' }, successText: 'Równo na limicie. Po ważeniu pijesz trzy litry wody i czujesz się jak nowy.', failText: 'Wchodzisz na wagę na styk, ale wieczorem ledwo stoisz. Organizm pamięta takie rzeczy.' },
      { label: 'Płacisz karę za wagę', desc: 'Część gaży idzie do rywala.', effects: { money: -Math.max(1000, Math.round((s.contract.purse * 0.2) / 100) * 100), rep: -1, form: 1 } },
    ],
  },
  {
    id: 'trener_youtube',
    title: 'Kręciołek z YouTube',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: () => 'Trener obejrzał kompilację najlepszych nokautów z obrotowego kopnięcia i chce, żebyś przez cały obóz ćwiczył „kręciołka”.',
    choices: () => [
      { label: 'Ćwiczysz kręciołka', desc: 'Albo spektakularny nokaut, albo spektakularny upadek.', test: 'stand', success: { stats: { stand: 2 }, media: 2, note: 'kręciołek wchodzi na treningach' }, fail: { wear: 2, form: -1, note: 'naciągnięta pachwina' }, successText: 'Po trzech tygodniach kręciołek wchodzi na tarczę z takim hukiem, że ludzie wychodzą z szatni popatrzeć.', failText: 'Przy setnej próbie coś strzela w pachwinie. Trener mówi, że „tak też uczą się mistrzowie”.' },
      { label: 'Zostajecie przy podstawach', desc: 'Prosty, prawy, obalenie.', effects: { stats: { iq: 1 } } },
    ],
  },
  {
    id: 'osir_gala',
    title: 'Gala w OSiR-ze',
    weight: 3,
    cond: (s) => s.tier === 1,
    text: (s) =>
      vary(s, [
        'Gala w hali OSiR. Szatnia to sala do przyrody, a twój narożnik dzieli ławkę z kołem gospodyń wiejskich, które robią catering.',
        'Na gali w OSiR-ze klatka stoi na boisku do kosza. W przerwie między walkami gra szkolna orkiestra dęta.',
      ]),
    choices: () => [
      { label: 'Jesz pierogi od KGW', desc: 'Grzech odmówić.', effects: { relations: 1, form: -1, note: 'pierogi z kapustą' } },
      { label: 'Zostajesz przy ryżu z kurczakiem', desc: 'Dieta to dieta.', effects: { form: 1 } },
    ],
  },
  {
    id: 'sasiad_bilety',
    title: 'Bilety dla rodziny',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 1 && s.tier <= 2,
    text: () => 'Cała rodzina chce przyjść na galę. Organizator daje dwa darmowe bilety. Na liście chętnych jest czternaście osób, w tym ciocia z Kanady.',
    choices: () => [
      { label: 'Kupujesz bilety wszystkim', desc: 'Rodzina na trybunach to rodzina na trybunach.', effects: { money: -1800, relations: 3, form: 1 } },
      { label: 'Dwa bilety dla rodziców', desc: 'Reszta obejrzy transmisję.', effects: { relations: -1 } },
    ],
  },

  // ---------- Krajówka ----------
  {
    id: 'kto_to_jest',
    title: '„A to kto?”',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 2,
    text: () => 'Na konferencji gwiazda gali patrzy na ciebie i pyta do mikrofonu: „A to kto w ogóle jest?”. Sala wybucha śmiechem.',
    choices: () => [
      { label: 'Odpowiadasz ripostą', desc: 'Albo przejdzie do historii, albo zrobi się niezręcznie.', test: 'iq', success: { media: 6, rep: 2, note: 'riposta dnia' }, fail: { media: 2, rep: -2, note: 'zrobiło się niezręcznie' }, successText: '„Ten, z kim będziesz walczył za rok” — sala klaszcze, a gwiazda pierwszy raz od dawna nie wie, co powiedzieć.', failText: 'Mówisz coś o tym, że „jeszcze zobaczymy”. Nikt nie słyszy, bo mikrofon był wyłączony.' },
      { label: 'Uśmiechasz się i milczysz', desc: 'Odpowiesz w klatce.', effects: { rep: 1, form: 1 } },
    ],
  },
  {
    id: 'kanal_youtube',
    title: 'Kanał na YouTube',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 2 && s.media >= 15,
    text: () => 'Kolega montażysta namawia cię na własny kanał: vlogi z obozu, „dzień z życia zawodnika”, unboxing rękawic.',
    choices: (s) => [
      { label: 'Zakładasz kanał', desc: 'Kamera wszędzie, nawet w saunie.', effects: { media: 5, form: -1, money: cash(s, 0.02, 1500), note: 'pierwszy film: 40 tys. wyświetleń' } },
      { label: 'Nie masz na to głowy', desc: 'Trenujesz, nie nagrywasz.', effects: { form: 1 } },
    ],
  },
  {
    id: 'pasztet_rywal',
    title: 'Trash talk w internecie',
    weight: 4,
    cond: (s) => s.tier >= 2,
    text: (s) =>
      vary(s, [
        'Twój najbliższy rywal napisał o tobie wierszyk. Rymuje „Polska” z „niedorosła”. Internet ma używanie.',
        'Rywal wrzucił film, na którym okłada manekina w koszulce z twoim nazwiskiem.',
        'Rywal twierdzi w podcaście, że „widział cię na sparingach i nic nie pokazałeś”. Nigdy z nim nie sparowałeś.',
      ]),
    choices: () => [
      { label: 'Odpisujesz', desc: 'Nikt nie będzie się z ciebie śmiał.', effects: { media: 3, rep: -1 } },
      { label: 'Ignorujesz', desc: 'Klatka zweryfikuje.', effects: { form: 1 } },
    ],
  },
  {
    id: 'stadion_wejscie',
    title: 'Wejście z fajerwerkami',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2 && s.media >= 25,
    text: () => 'Organizator proponuje ci wejście z pirotechniką, ogniem i chórem gregoriańskim. Za dopłatą z twojej gaży.',
    choices: (s) => [
      { label: 'Ogień i chór', desc: 'Raz się żyje.', effects: { money: -cash(s, 0.02, 3000), media: 5, note: 'wejście roku' } },
      { label: 'Wchodzisz po cichu', desc: 'Kaptur na głowę i do klatki.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'reklama_tv',
    title: 'Reklama telewizyjna',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2 && s.media >= 30,
    text: () => 'Sieć sklepów z elektronarzędziami chce cię do reklamy. Scenariusz: wiercisz dziurę w ścianie jednym ciosem.',
    choices: (s) => [
      { label: 'Kręcisz reklamę', desc: 'Trzy dni na planie, osiem dubli z wiertarką.', effects: { money: cash(s, 0.08, 12000), media: 4, form: -1 } },
      { label: 'Odmawiasz', desc: 'Nie jesteś aktorem.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'mlody_hype',
    title: 'Nowy cudowny dzieciak',
    weight: 3,
    cond: (s) => s.tier >= 2 && s.age >= 26,
    text: () => 'Media zachwycają się 20-latkiem z twojej kategorii, „przyszłym mistrzem świata”. Na jego profilu twoje zdjęcie z podpisem „następny”.',
    choices: () => [
      { label: 'Wołasz go do walki', desc: 'Pokażesz mu, gdzie jego miejsce.', effects: { media: 4, form: 1, note: 'promocja się cieszy' } },
      { label: 'Nie dajesz mu rozgłosu', desc: 'Niech najpierw coś wygra.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'sponsor_krypto',
    title: 'Sponsor płaci tokenami',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 2,
    text: () => 'Start-up kryptowalutowy „PunchCoin” chce cię sponsorować. Płaci wyłącznie w swoich tokenach. Prezes ma 22 lata i jacht na zdjęciu profilowym.',
    choices: (s) => [
      { label: 'Bierzesz tokeny', desc: 'Może to przyszłość finansów.', chance: 30, success: { money: cash(s, 0.1, 20000), note: 'tokeny wystrzeliły' }, fail: { media: -1, note: 'tokeny warte tyle, co nic' }, successText: 'Po pół roku tokeny są warte dziesięć razy więcej. Sprzedajesz wszystko w dniu, w którym prezes zamyka konta.', failText: 'Tydzień po podpisaniu umowy strona PunchCoin znika. Na pamiątkę zostaje ci naszywka na spodenkach.' },
      { label: 'Prosisz o złotówki', desc: 'Prezes się obraża.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'kibic_dziecko',
    title: 'Kibic z dzieckiem',
    weight: 3,
    cond: (s) => s.tier >= 2 && s.media >= 20,
    text: (s) =>
      vary(s, [
        'Kibic na lotnisku prosi, żebyś potrzymał jego syna do zdjęcia. Syn płacze, kibic jest zachwycony.',
        'Pod halą czeka dziewięciolatek z twoim plakatem i kartką: „Jak dorosnę, będę jak ty”.',
      ]),
    choices: () => [
      { label: 'Masz czas dla kibiców', desc: 'Zdjęcia, autografy, uśmiech.', effects: { media: 2, rep: 2, relations: 1 } },
      { label: 'Spieszysz się na trening', desc: 'Następnym razem.', effects: { form: 1, media: -1 } },
    ],
  },

  // ---------- Europa i świat ----------
  {
    id: 'papa_dagestan',
    title: 'Obóz w górach',
    once: true,
    weight: 4,
    cond: (s) => s.tier >= 3,
    text: () => 'Znajomy załatwia ci obóz w górach Dagestanu. Starszy trener na powitanie każe ci nieść go na barana pod górę. Mówi, że to rozgrzewka.',
    choices: () => [
      { label: 'Niesiesz', desc: 'Dwa kilometry pod górę z trenerem na plecach.', test: 'cardio', success: { stats: { wrest: 3, cardio: 2 }, rep: 2, note: 'trener mówi „dobrze”' }, fail: { stats: { wrest: 1 }, wear: 3, note: 'trener mówi „słabo”' }, successText: 'Na szczycie trener klepie cię w policzek i mówi jedno słowo: „dobrze”. W Dagestanie to prawie jak medal.', failText: 'Po kilometrze trener zsiada i idzie dalej sam. Ty jeszcze godzinę łapiesz oddech.' },
      { label: 'Zostajesz w Polsce', desc: 'W górach nie ma zasięgu.', effects: {} },
    ],
  },
  {
    id: 'las_vegas',
    title: 'Tydzień walk w Vegas',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => 'Federacja zaprasza cię na tydzień międzynarodowych walk w Las Vegas, żebyś pokazał się mediom. Kasyno jest na parterze hotelu.',
    choices: (s) => [
      { label: 'Tylko media i siłownia', desc: 'Wywiady, zdjęcia, trening.', effects: { media: 4, rep: 1 } },
      { label: 'Jedna partyjka ruletki', desc: 'Na czerwone.', chance: 47, success: { money: cash(s, 0.04, 6000), media: 3, note: 'wypadło czerwone' }, fail: { money: -cash(s, 0.04, 6000), note: 'wypadło zero' }, successText: 'Czerwone. Krupier gratuluje, a federacyjny fotograf ma zdjęcie dnia.', failText: 'Zero. Krupier wzrusza ramionami. Wracasz do pokoju i robisz sto pompek ze złości.' },
    ],
  },
  {
    id: 'tlumacz',
    title: 'Tłumacz na konferencji',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => 'Na konferencji w Londynie tłumacz przekłada twoje „będzie ciężko, ale damy radę” jako „I will destroy him in the first round”.',
    choices: () => [
      { label: 'Idziesz w to', desc: 'Skoro już tak powiedziałeś.', effects: { media: 5, rep: -1, form: 1, note: 'nagłówki po angielsku' } },
      { label: 'Prostujesz po angielsku', desc: '„No, no. Hard fight. Respect.”', effects: { rep: 2 } },
    ],
  },
  {
    id: 'walka_zastepstwo_ko',
    title: 'Telefon w środku nocy',
    weight: 3,
    cond: (s) => s.tier >= 3,
    text: () => 'Druga w nocy, dzwoni menedżer: rywal z main eventu wypadł, organizator pyta, czy wejdziesz za niego na wyższej wadze za dziesięć dni.',
    choices: (s) => [
      { label: 'Wchodzisz', desc: 'Takie szanse się nie powtarzają.', chance: 55, success: { money: cash(s, 0.12, 25000), media: 6, rep: 2, note: 'bohater wieczoru' }, fail: { money: cash(s, 0.05, 10000), wear: 4, form: -2, note: 'za ciężki rywal' }, successText: 'Wchodzisz na dziesięć dni przed galą i robisz najlepszą walkę wieczoru. Prezes federacji osobiście ściska ci rękę.', failText: 'Rywal jest o klasę cięższy. Przetrwałeś do końca, ale ciało pamięta każdą rundę.' },
      { label: 'Odmawiasz', desc: 'Zostajesz przy swoim planie.', effects: { form: 1 } },
    ],
  },
  {
    id: 'film_hollywood',
    title: 'Rola w filmie akcji',
    once: true,
    weight: 2,
    cond: (s) => s.tier >= 3 && s.media >= 45,
    text: () => 'Reżyser filmu akcji szuka „groźnego Słowianina” do roli trzeciego ochroniarza złoczyńcy. Masz jedną kwestię: „Nie przejdziesz”.',
    choices: (s) => [
      { label: 'Grasz', desc: 'Dwa tygodnie na planie w Budapeszcie.', effects: { money: cash(s, 0.1, 15000), media: 6, form: -2, note: '„Nie przejdziesz”' } },
      { label: 'Odmawiasz', desc: 'Kariera w klatce jest ważniejsza.', effects: { rep: 1, form: 1 } },
    ],
  },
  {
    id: 'pas_mlodosci',
    title: 'Wizyta w starym klubie',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 3 && s.age >= 25,
    text: () => 'Pierwszy trener zaprasza cię do starego klubu. Dzieciaki ustawiają się w kolejce do zdjęć, a na ścianie wisi twoje zdjęcie z pierwszego turnieju.',
    choices: (s) => [
      { label: 'Prowadzisz trening', desc: 'Dwie godziny z dzieciakami.', effects: { rep: 3, relations: 1, media: 1 } },
      { label: 'Fundujesz nowe maty', desc: 'Stare pamiętają jeszcze ciebie.', effects: { money: -cash(s, 0.02, 4000), rep: 4, media: 2 } },
    ],
  },

  // ---------- Życie (każdy etap) ----------
  {
    id: 'pies_spacer',
    title: 'Pies sąsiada',
    once: true,
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => 'Sąsiad wyjeżdża na dwa tygodnie i prosi, żebyś wyprowadzał jego owczarka. Pies ciągnie jak ciężarówka i nie słucha nikogo.',
    choices: () => [
      { label: 'Wyprowadzasz psa', desc: 'Dwa razy dziennie, po pięć kilometrów.', effects: { stats: { cardio: 1 }, relations: 1 } },
      { label: 'Odmawiasz', desc: 'Masz treningi.', effects: { relations: -1 } },
    ],
  },
  {
    id: 'mama_facebook',
    title: 'Mama na Facebooku',
    weight: 3,
    cond: (s) => s.media >= 10,
    text: (s) =>
      vary(s, [
        'Mama komentuje każdy post o tobie. Pod zapowiedzią walki napisała: „Synku, uważaj na buzię, ubierz się ciepło”.',
        'Mama założyła na Facebooku fanpage „Mama zawodnika”. Ma więcej obserwujących niż ty.',
        'Mama wdała się w kłótnię w komentarzach z hejterem. Hejter przeprosił.',
      ]),
    choices: () => [
      { label: 'Zostawiasz to', desc: 'Mama to mama.', effects: { relations: 2, media: 1 } },
      { label: 'Prosisz, żeby przestała', desc: 'Delikatnie.', effects: { relations: -1 } },
    ],
  },
  {
    id: 'dieta_mieso',
    title: 'Dieta samego mięsa',
    once: true,
    weight: 3,
    cond: (s) => s.age >= 19 && s.media >= 5,
    text: () => 'Kolega z siłowni przysięga, że dieta samego mięsa i surowych jajek to sekret mistrzów. Pokazuje filmik człowieka, który je wątróbkę na surowo.',
    choices: () => [
      { label: 'Próbujesz przez miesiąc', desc: 'Steki na śniadanie, obiad i kolację.', chance: 40, success: { form: 2, note: 'czujesz się jak lew' }, fail: { form: -3, note: 'żołądek protestuje' }, successText: 'Ku zaskoczeniu wszystkich czujesz się świetnie. Rachunek u rzeźnika już mniej.', failText: 'Po tygodniu żołądek odmawia współpracy. Wracasz do ryżu z kurczakiem.' },
      { label: 'Zostajesz przy swojej diecie', desc: 'Dietetyczka by cię zabiła.', effects: {} },
    ],
  },
  {
    id: 'lodowka_kapiel',
    title: 'Morsowanie',
    once: true,
    weight: 3,
    cond: (s) => s.age >= 18,
    text: () => 'Ekipa z klubu morsuje w każdą niedzielę. Twierdzą, że zimna woda to najlepsza regeneracja. Jest minus osiem.',
    choices: () => [
      { label: 'Wchodzisz do jeziora', desc: 'Na trzy minuty.', chance: 75, success: { stats: { chin: 1 }, form: 1, note: 'zahartowany' }, fail: { form: -2, note: 'tydzień z katarem' }, successText: 'Po trzech minutach czujesz się, jakbyś mógł przebiec maraton. Ekipa przyjmuje cię do klubu morsów.', failText: 'Następnego dnia leżysz pod kocem z gorączką. Morsy mówią, że „trzeba się przyzwyczaić”.' },
      { label: 'Patrzysz z brzegu', desc: 'Trzymasz ręczniki.', effects: { relations: 1 } },
    ],
  },
  {
    id: 'mandat_rower',
    title: 'Bieganie po ciemku',
    once: true,
    weight: 2,
    cond: (s) => s.age >= 17,
    text: () => 'Biegasz o piątej rano w ciemnej kurtce. Kierowca śmieciarki prawie cię potrąca, a potem opieprza przez okno przez dwie minuty.',
    choices: () => [
      { label: 'Kupujesz kamizelkę odblaskową', desc: 'Bezpieczeństwo przede wszystkim.', effects: { money: -60, note: 'wyglądasz jak drogowiec' } },
      { label: 'Biegasz w dzień', desc: 'Kosztem snu.', effects: { form: -1 } },
    ],
  },
  {
    id: 'rodzinna_impreza',
    title: 'Imieniny wujka',
    weight: 3,
    cond: (s) => s.age >= 18,
    text: (s) =>
      vary(s, [
        'Imieniny wujka. Wujek po trzecim kieliszku chce się z tobą „siłować na rękę, tak dla zabawy”.',
        'Rodzinny grill. Szwagier przekonuje wszystkich, że „za młodu też by tak potrafił” i chce pokazać, jak się dusi.',
        'Komunia chrześniaka. Ciocia pyta, kiedy wreszcie znajdziesz „normalną pracę”.',
      ]),
    choices: () => [
      { label: 'Bawisz się z rodziną', desc: 'Raz na jakiś czas trzeba.', effects: { relations: 2, form: -1 } },
      { label: 'Wychodzisz wcześniej na trening', desc: 'Obóz to obóz.', effects: { relations: -1, form: 1 } },
    ],
  },
  {
    id: 'auto_awaria',
    title: 'Awaria auta',
    weight: 3,
    cond: (s) => s.age >= 19 && s.tier <= 2,
    text: (s) =>
      vary(s, [
        'Pada skrzynia biegów w twoim starym passacie. Mechanik kręci głową i mówi „no, będzie kosztować”.',
        'Turbo w aucie zaczyna świszczeć jak czajnik. Do klubu masz 30 kilometrów.',
      ]),
    choices: () => [
      { label: 'Naprawiasz', desc: 'Bez auta ani rusz.', effects: { money: -3500 } },
      { label: 'Dojeżdżasz autobusem', desc: 'Dwie przesiadki, godzina w jedną stronę.', effects: { form: -2, stats: { cardio: 1 } } },
    ],
  },
  {
    id: 'kontrola_antydoping',
    title: 'Kontrola antydopingowa',
    weight: 2,
    cond: (s) => s.tier >= 2,
    text: () => 'O szóstej rano dzwonek do drzwi. Kontrola antydopingowa. Wczoraj wieczorem piłeś syrop na kaszel od babci.',
    choices: (s) => [
      { label: 'Zgłaszasz syrop w formularzu', desc: 'Lepiej powiedzieć wszystko.', effects: { rep: 1, note: 'wynik czysty' } },
      { label: 'Nic nie mówisz', desc: 'To przecież tylko syrop.', chance: 85, success: { note: 'wynik czysty' }, fail: { rep: -6, money: -cash(s, 0.02, 3000), note: 'wyjaśnienia trwały pół roku' }, successText: 'Wynik czysty. Babcia dumna, że jej syrop przeszedł kontrolę.', failText: 'Syrop zawierał coś z listy zakazanej. Wyjaśnienia trwają pół roku i kosztują fortunę.' },
    ],
  },
  {
    id: 'dzieciak_pyta',
    title: 'Pytanie na spotkaniu w szkole',
    once: true,
    weight: 3,
    cond: (s) => s.tier >= 1 && s.media >= 10,
    text: () => 'Szkoła zaprasza cię na spotkanie z uczniami. Pierwsze pytanie z sali: „Ile pan zarabia?”. Drugie: „A pan by pokonał tego strongmana z telewizji?”.',
    choices: () => [
      { label: 'Odpowiadasz na wszystko', desc: 'Szczerze i z humorem.', effects: { rep: 2, media: 2 } },
      { label: 'Opowiadasz o ciężkiej pracy', desc: 'Dzieciaki ziewają.', effects: { rep: 1 } },
    ],
  },
  {
    id: 'kontuzja_dziecko',
    title: 'Kontuzja na placu zabaw',
    once: true,
    weight: 2,
    cond: (s) => (s.flags.kid ?? 0) > 0,
    text: () => 'Bawisz się z dzieckiem na placu zabaw. Zjeżdżalnia była niższa, niż myślałeś. Kostka puchnie jak balon.',
    choices: () => [
      { label: 'Idziesz do lekarza', desc: 'Lepiej sprawdzić.', effects: { money: -400, form: -1 } },
      { label: 'Zaciskasz zęby', desc: 'Lód i będzie dobrze.', chance: 50, success: { note: 'przeszło samo' }, fail: { injury: { name: 'skręcona kostka', seasons: 1, penalty: 4 } }, successText: 'Po trzech dniach kostka wraca do normy. Dziecko zjeżdża dalej, ty patrzysz z ławki.', failText: 'Kostka nie przechodzi. Lekarz po tygodniu mówi, że trzeba było przyjść od razu.' },
    ],
  },
  // ---------- Odwieczny rywal ----------
  {
    id: 'rywal_social',
    title: 'Rywal w internecie',
    weight: 7,
    cond: rivalHere,
    text: (s) =>
      vary(s, [
        `${rn(s)} wrzuca filmik, na którym przewraca się manekin w twojej koszulce. Podpis: „sezon na dziki otwarty”.`,
        `${rn(s)} w podcaście opowiada, że w waszej ostatniej walce „sędziowie ci pomogli”. Klip ma ćwierć miliona wyświetleń.`,
        `${rn(s)} nagrywa relację spod twojej sali treningowej. „Puk, puk, jest ktoś odważny?”`,
      ]),
    choices: () => [
      { label: 'Odpowiadasz i wyzywasz go', desc: 'Niech organizator zrobi tę walkę.', effects: { media: 4, rep: -1, flag: 'rivalCallout', note: 'w tym roku się spotkacie' } },
      { label: 'Nagrywasz parodię', desc: 'Śmiech to też broń.', effects: { media: 3, relations: 1 } },
      { label: 'Ignorujesz', desc: 'Odpowiesz w klatce.', effects: { rep: 2, form: 1 } },
    ],
  },
  {
    id: 'rywal_nagrania',
    title: 'Były sparingpartner rywala',
    weight: 4,
    cond: rivalHere,
    text: (s) => `Odzywa się chłopak, który przez rok sparował z ${rn(s)}. Za dwa tysiące odda pendrive z nagraniami jego treningów.`,
    choices: () => [
      { label: 'Kupujesz nagrania', desc: 'Wiedza to przewaga.', effects: { money: -2000, form: 2, note: 'znasz jego nawyki' } },
      { label: 'Odmawiasz', desc: 'Nie tak się wygrywa.', effects: { rep: 2 } },
    ],
  },
  {
    id: 'rywal_konferencja',
    title: 'Face to face z rywalem',
    weight: 5,
    cond: rivalHere,
    text: (s) => `Konferencja przed galą. ${rn(s)} staje centymetr od twojej twarzy i coś szepcze. Kamery czekają, co zrobisz.`,
    choices: () => [
      {
        label: 'Odpychasz go',
        desc: 'Show musi trwać.',
        chance: 50,
        success: { media: 5, form: 1, note: 'klip dnia' },
        fail: { media: 3, form: -2, money: -1500, note: 'kara od federacji' },
        successText: 'Ochrona was rozdziela, a klip z konferencji leci we wszystkich serwisach. Bilety schodzą w godzinę.',
        failText: 'Federacja nakłada karę za naruszenie nietykalności. On się tylko uśmiecha. Wyprowadził cię z równowagi.',
      },
      { label: 'Uśmiechasz się i milczysz', desc: 'Zimna krew.', effects: { rep: 2, form: 1 } },
    ],
  },
];
