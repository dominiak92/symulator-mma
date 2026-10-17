# Symulator Kierowcy a nasz symulator MMA: notatki z rozgrywki i plan UI/UX

Grałem w kierowca.rybicki.ai (v1.9.8.1) przez 2 sezony na desktopie (Chrome). Zapisałem, co robi dobrze, i porównałem to z naszą grą. **Priorytetem jest wersja mobilna** (390 px). Desktop musi działać, ale każdy ekran projektujemy najpierw pod telefon.

## Jak wygląda Kierowca

| Element | Jak to działa | Dlaczego dobrze |
|---|---|---|
| Grafika | Pixel-artowy kask w HUD, rysunek gokartu/bolidu w panelu („Twój gokart”) i na każdej ofercie rynkowej, pikselowe logo sponsora, ikonki osiągnięć | Gracz *widzi* swoją karierę: sprzęt zmienia się z szczeblem |
| Pasek etapu | 3 segmenty u góry (trening → sponsorzy → wydarzenie), wypełniają się gradientem | Wiadomo, gdzie jestem, bez słów |
| Trening | 6 wierszy: nazwa, 1 linijka opisu, wartość. Klik zaznacza, DALEJ niżej | Mało tekstu, dużo oddechu |
| Wydarzenie | 2–3 zdania, budżet w 1 linii, 2 wybory: tytuł + 1 linijka + małe czipy skutków | Decyzja w 5 sekund |
| Wynik wydarzenia | Wybór pogrubiony + skutek, czipy „SKUTKI”, DALEJ. Budżet w HUD miga | Natychmiastowa informacja zwrotna |
| Sezon („Road mapa”) | Jeden **wiersz na wyścig**: `R1 Tor · Q13 → P6 · 8 pkt ▸`. Kwalifikacja kręci się jak „jednoręki bandyta”, potem się zatrzymuje. Kluczowe momenty pojawiają się jako krótka karta pod wierszem (✕ DESZCZ ZWERYFIKOWAŁ · test „Jazda w deszczu” ✕ PORAŻKA, szansa 49%) | Zwięzła, rytmiczna relacja na żywo |
| Auto-przewijanie | Strona sama zjeżdża do bieżącego wyścigu | Na telefonie nic nie trzeba robić |
| Pływająca pigułka | „MIEJSCE P9 ▲/▼” przyklejona u góry listy, animuje się w górę lub w dół po każdym wyścigu | Stan sezonu zawsze na widoku |
| Sterowanie | Ikony: wykres, przewijanie ⏩, POMIŃ | Mało miejsca, jasne |
| Koniec sezonu | Duża karta „P9”, 5 kafli liczb (wygrane, podia, pole, punkty, najwyżej), czerwona pływająca pigułka DALEJ na dole ekranu (animacja wjazdu) | Jedno spojrzenie, jeden kciuk |
| Raport sezonu | 4 kafle u góry, ocena („Sezon bardzo dobry”) z paskami, krótka „historia sezonu”, potem **zwijane sekcje** z podsumowaniem po prawej (`Rozwój … OVR 25 → 27`, `Finanse … saldo −20 tys.`) | Szczegóły są, ale nie zalewają ekranu |
| Rynek | Karta oferty z rysunkiem sprzętu, kropkami szczebla (T7 z 8), paskiem siły. Niedostępne oferty wyszarzone („Obserwują cię”) | Wizualne porównanie zamiast tabeli |
| Animacje (z CSS) | skipPulse, dalejUp, rollRush/rollLock, posFlash, pillUp/pillDown, podpulse, rmWinFlash, rmDnfShake, trophyDrop, champzoom, conffall (konfetti), budFlash i inne | Każde zdarzenie ma swój „ruch” |

## Co u nas kuleje (zrzuty z 390 px)

1. **Sezon**: każda walka to karta ~140 px z 4–5 liniami. Przy 6 walkach to 3 ekrany przewijania. Brak rytmu „na żywo”, brak efektu przy wyniku.
2. **Decyzja w walce**: 3 opcje × (tytuł, opis, ✓, ✗, pasek, 3-elementowa legenda, test) zajmują ponad 2 ekrany. Za dużo liczb naraz.
3. **Brak grafiki**: nie widać zawodnika ani rywala, tylko tekst i herby.
4. **Brak animacji wyniku**: wygrana, nokaut, medal i pas wyglądają tak samo jak zwykła linijka tekstu.
5. **CTA** „Podsumowanie sezonu” na końcu długiej listy. Toast osiągnięcia zasłania HUD.
6. **Podsumowanie i wydarzenia**: za dużo tekstu jednocześnie, nic się nie zwija.

## Plan (mobile-first)

- **Ilustracje SVG**: zawodnik (sylwetka w gardzie, spodenki w kolorze klubu, rękawice), rywal w czerwonym narożniku, pas mistrzowski i medale. Używane w HUD, karcie walki (VS), podsumowaniu, rynku i końcu kariery.
- **Sezon jako „karta walk”**: kompaktowy wiersz na walkę (`W · KO R2 · Kowalski`), bieżąca walka jako duża karta **VS** z animowanymi rundami (R1 → R2 → R3), pieczątką wyniku (WYGRANA / PORAŻKA / KO) i błyskiem. Momenty zwinięte pod wierszem.
- **Pływająca pigułka bilansu** (`BILANS 3-1 ▲`), animowana przy każdej zmianie.
- **Auto-przewijanie** do bieżącej walki, decyzji i końca sezonu.
- **Pływający przycisk DALEJ** na dole ekranu na telefonie (dalejUp), wszędzie gdzie jest główna akcja.
- **Decyzje**: tytuł + 1 linijka + duża szansa + 1 linijka ✓/✗; jeden kolorowy pasek bez legendy.
- **Wydarzenia**: krótsze, bez legend; wynik z animacją i miganiem budżetu w HUD.
- **Podsumowanie**: duża karta wyniku z ilustracją (medal/pas), kafle liczb, reszta w zwijanych sekcjach.
- **Efekty**: konfetti przy medalu złotym/pasie, „trophy drop” pasa, wstrząs przy nokaucie, liczniki liczb (count-up).
- **Typografia**: tekst główny 15 px, drobny 12–13 px, nagłówki mniejsze na telefonie.
- **Toasty** przeniesione na dół ekranu na telefonie, nad przyciskiem.
- Wszystkie animacje respektują `prefers-reduced-motion` i ustawienie „Animacje”.

## Runda 2: ikony, samouczek, audyt zasłaniania

- **Ikony** (`src/ui/Icon.tsx`, podgląd pod adresem `#ikony`): jeden zestaw liniowy. Umiejętności mają własne piktogramy: rękawica (stójka), dwóch zawodników w klinczu (zapasy), pas BJJ (parter), serce z tętnem (kondycja), tarcza (szczęka), tarcza strzelnicza (taktyka).
- **Samouczek** (`src/ui/Tutorial.tsx`): 5 slajdów przed pierwszą karierą (można przesuwać palcem i pominąć). Dostępny też z menu głównego („Jak grać → Samouczek”) i z menu w grze.
- **Podpowiedzi trenera**: krótka ramka przy każdym etapie pierwszego sezonu. Każda pokazuje się raz, można ją zamknąć albo wyłączyć wszystkie (ustawienia → „Podpowiedzi trenera” włącza je od nowa).
- **Strona główna**: widoczna sekcja „Jak grać” w 4 krokach.
- **HUD**: jeden pasek statystyk z ikonami zamiast 4 osobnych pudełek, ciągły pasek postępu sezonu na dolnej krawędzi.
- **Naprawione zasłanianie**: powiadomienia o osiągnięciach są teraz u góry (nie zasłaniają przycisków ani wyborów i nie zasłaniają przycisku menu); nagłówek arkuszy nie przykrywa pierwszej linijki; kafle w podsumowaniu na wąskich ekranach układają się 2×2.
- `scripts/viewport_tour.py`: przechodzi grę na prawdziwym widoku telefonu, robi zrzuty góra/środek/dół każdego ekranu i automatycznie wypisuje zasłonięte lub ucięte elementy.

## Runda 3: balans i luki (wyniki `scripts/balance.ts`)

Porównanie strategii bota (100–120 karier na strategię):

| Luka | Przed | Po poprawce |
|---|---|---|
| Trenowanie tylko stójki | legacy 2261 vs 1254 (bazowy) | 1681 vs 1207; zapasy 1506, parter 1574 |
| Wieczna amatorka | 9,3 pasa amatorskiego, legacy jak u zawodowca | amatorka kończy się w wieku 24 lat, kolejne pasy tego samego szczebla są mniej warte |
| Freak fighty co roku | 7,3 mln zł, najlepszy wynik | 2,0 mln zł, wynik słabszy od drogi sportowej |
| Kredyty bez końca | brak konsekwencji | jeden kredyt naraz, sufit kwoty, rok przerwy w pracy |
| Przepaść kosztów po awansie na krajówkę | ponad 1 rok przerwy na karierę | pół etatu na krajówce poza top 3 rankingu |
| Granie do 40. bez względu na wyniki | legacy tylko rośnie | porażki po 34. roku życia obniżają legacy |

Zmiany w walce: szanse rosną coraz wolniej przy dużej przewadze (tanh), lepszy zapaśnik obala pod ciosem, z góry można kończyć (ground and pound, duszenie), poddania zdarzają się częściej, bicie z pleców jest trudniejsze.

`scripts/fuzz.ts` przechodzi setki karier z losowymi decyzjami i szuka „undefined”, NaN, nierozwiniętych szablonów, statystyk poza zakresem i wyjątków.

## Runda 4: wydatki, kontuzje, decyzje w walce

- **Obozy zagraniczne** (od ligi krajowej): Tajlandia, Dagestan, Floryda. Koszt rośnie ze szczeblem, premia do dwóch umiejętności (do granicy talentu).
- **„2-3 years Dagestan and forget”**: raz na karierę, zawodowiec do 30 lat. Trzy sezony bez walk, duży skok zapasów i kondycji, utrata rankingu i rozpoznawalności.
- **Własna akademia**: 4 poziomy (150 tys. → 3 mln zł), przychód co sezon zależny od mediów i 60–550 pkt legacy po karierze.
- **Kontuzje**: lekkie (kara do szans), poważne (koniec sezonu) i urazy na cały rok (ekran rehabilitacji, NFZ, gdy brak pieniędzy). Średnio na karierę: 2,6 lekkie, 1,3 poważne, 0,5 roku rehabilitacji.
- **Decyzje w walce**: szansa słowami i kropkami zamiast procentu, wyraźna stawka (kończenie / runda / odpoczynek) i stan walki (karty, siły, obrażenia). Bot „zawsze największa szansa” nie jest już najlepszy: najlepiej wypada gra pod sytuację, „zawsze ryzyko” najgorzej.
- Automat sezonu staje przy każdym dotknięciu ekranu (z widocznym „czeka”).

## Runda 5: oferty walk, menedżerowie, rywal, plakaty

- **Oferty walk** (zawodowcy): przed każdą walką karta z rywalem, gażą i premią. Możesz przyjąć, negocjować (szansa zależy od menedżera, mediów i pozycji) albo odrzucić. Po odmowie przychodzi inna oferta albo w sezonie jest jedna walka mniej, a grymaszenie obniża reputację. O pas się nie odmawia.
- **Liczba walk w sezonie**: wybór na ekranie budżetu (standard kontraktu ±1). Czwarta i piąta walka męczą (forma, zużycie, kontuzje), mniej walk daje świeżość, ale wolniejszy ranking i mniej pieniędzy.
- **Menedżerowie**: Wujek Zdzisiek, Facet w okularach, Agencja Spinacz, Paradygmat Sports, Dominacja Management. Prowizja 5–18%, wyższe gaże, mocniejsi rywale, łatwiejsze negocjacje i awanse, sponsorzy. Duże stajnie czasem cały sezon zajmują się innymi.
- **Odwieczny rywal**: zawodnik z rocznika, z którym przegrasz albo spotkasz się drugi raz. Wraca częściej, ma swoje zdarzenia (internet, nagrania, face to face), wyższą gażę i liczy się do legacy.
- **Plakaty**: plakat każdej gali zawodowej (miasto, hala, cała karta walk) i każdego turnieju amatorskiego (miasto, kategoria, drabinka).

Balans (120 karier na strategię): przyjmowanie ofert, negocjowanie i wybredność dają podobne wyniki. Najlepszy menedżer daje dużo więcej pieniędzy, ale trudniejszych rywali (mniej pasów). Maksymalna liczba walk to więcej pieniędzy przy podobnym legacy, minimalna jest słabsza. Pełny gracz (menedżer, negocjacje, obozy, akademia, walka pod sytuację) wypada najlepiej. Słabe strony do dalszej pracy: trenowanie wyłącznie kondycji albo szczęki nie opłaca się, a najtańszy klub i kredyty ponad stan prowadzą do spirali długów.

## Runda 6: waga, obóz pod rywala, konferencje, balans szczebli

- **Kategoria wagowa** (rynek, od zawodowstwa): naturalna albo sąsiednie. Zbijanie: +4 do formy, ale ryzyko nieudanego ważenia (7–25%, kara 25% gaży i −5 formy) i większe zużycie. Kategoria wyżej: −4 do formy, bez ryzyka, mniejsze zużycie. Zmiana zeruje ranking.
- **Obóz przed walką** (na ofercie): zwykły, pod rywala (+4, koszt 20% gaży), ciężki (+3, większe zużycie i ryzyko urazu).
- **Konferencja** przed dużą walką (karta główna, rywal, pas, freak): spokojnie (+reputacja), riposta (60%: +3, inaczej −3), po bandzie (45%: +4, inaczej kara i −4; zasięgi rosną, reputacja spada).
- **Balans szczebli**: zostawanie w Polsce dawało więcej niż wyjazd do Europy. Europa płaci teraz więcej (gaże 40–160 tys.), tańszy sztab, większa premia legacy za najwyższy szczebel (0/40/120/300/550), kolejne pasy w kraju są warte mniej.

## Runda 7: przegląd całości

- Szansa w wydarzeniach i przy sponsorach słowami z kropkami (jak w walkach), procent w podpowiedzi.
- Budżet: liczba walk i ostrzeżenie o minusie zaraz pod rachunkiem; sponsor i akademia niżej jako dodatki.
- Dagestan zwinięty do jednej linii (koszt albo „jeszcze nie”), rozwija się po dotknięciu.
- Rynek: „Premia” zamiast zawijającego się „Za wygraną”; na 320 px warunki w 2 kolumnach.
- Oferta na 320 px: przyciski negocjacji nie łamią się w trzy linie.
- Animacje: rachunek wjeżdża wierszami, paski treningu rosną, kwota na koncie wskakuje; cytat z konferencji pojawia się szybciej.
- Balans: obelga na konferencji wygrywa w 40% (było 45%); kategoria wyżej −2 do walki (było −4) i wolniejsze zużycie organizmu.
