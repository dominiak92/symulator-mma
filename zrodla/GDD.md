# Symulator Polskiego Zawodnika MMA — dokument projektowy (v0.3)

Wzorzec: **Symulator Polskiego Kierowcy** (kierowca.rybicki.ai, v1.9.8.1). Przeklikane osobiście 3 sezony + menu. Robimy tę samą grę, przeniesioną 1:1 na MMA.

---

## 1. Jak działa kierowca (stan faktyczny)

### Menu główne
- **GRAJ** → 3 sloty zapisu
- **KARIERA DNIA** → jedno podejście dziennie, wspólny zawodnik dla wszystkich, liczy się pierwsze podejście
- **Seria dni** (streak) i **cele dnia**: cel dnia (np. „wygraj tytuł w serii bocznej”), wyzwanie tygodnia (np. „ścigaj się do 40-tki, min. 4 tytuły”)
- **Osiągnięcia** (55, kolekcja między karierami), **Muzeum kariery** (rekordy, werdykty, trofea), **Kaski** (kolekcja malowań, kosmetyka)
- **Rankingi LEGACY**: Kariera dnia dziś / tryb zwykły dziś / ostatnie 7 dni, „panujący mistrz” z wczoraj. Kolumny: kierowca, LEGACY (punkty), liczba sezonów
- Poleć grę, Discord, ustawienia (animacje, wibracje, zapis, co nowego), wersja angielska

### Nowa kariera
- Imię i nazwisko + przycisk **Wylosuj**
- **Punkt startowy** z mnożnikiem wyniku: Podwórko (talent losowy, pusto w portfelu, ×1,0), Syn sponsora (kasa i kamery, ×1,0), Wonderkid (talent, ×0,6), Wybraniec (talent kosmiczny, bez rankingu)
- **Poziom trudności**: Normalny ×1,0 / Trudny ×1,10 (skąpi sponsorzy, wyższe ryzyko)
- Start w wieku 8 lat, tekst otwierający z humorem („Tata sprzedał Passata…”)

### Ekran gry (HUD)
- Góra: **OVR**, imię, seria · zespół, **budżet, wiek, media, rep, sezon**
- Lewy panel: **6 skilli** z paskami (Tempo, Walka, Powtarzalność, Deszcz, Wyczucie, Kondycja), **sprzęt** (zespół, tier, „siła”), profil, **rozpiska budżetu** (wpisowe, raty kredytu), **klasyfikacja** (top 3 + ty, pełna po kliknięciu)
- Środek: aktualny krok sezonu, pasek postępu kroków

### Pętla sezonu (rok = sezon)
1. **Trening zimowy** — wybierasz 1 z 6 skilli do podkręcenia (każdy z opisem, na co wpływa)
2. **Budżet** — stan konta, koszty sezonu, **sponsorzy** z zabawnymi nazwami i klauzulami („Pierogarnia u Grażyny, 10 tys./sez., 2 sez., ruskie za podium”), kredyt w ratach
3. **Wydarzenie** — sytuacja fabularna (rodzina, sponsor, weteran, brat chce też jeździć…), 2 wybory, **skutki pokazane jako chipy**: +7 tys. zł, relacje +1, reputacja +3, „obietnica do S1”. Ukryte zmienne: relacje, obietnice (łamanie słowa ma konsekwencje)
4. **Raport sezonu (automatyczna symulacja)**:
   - **Forma na sezon** losowana animowaną ruletką (Sezon życia / Świetna / Dobra / Normalna / Słaby / Kryzys)
   - **Road mapa**: R1–R8, każda runda Q (kwalifikacje) → P (meta) + punkty, na żywo aktualizuje się klasyfikacja
   - **Kluczowe momenty** w niektórych rundach: test skilla z szansą i wynikiem („Wyczucie techniczne · SUPER SUKCES · szansa 49% · +0,4 do tempa”), czasem rozbicie: 5% super / 68% sukces / 27% porażka, „fioletowy bonus”
   - Czasem **decyzja w trakcie wyścigu** (np. start z zewnętrznej: trzymasz tor?) z widocznymi szansami
   - Przyciski: wykres pozycji, przyspiesz, **POMIŃ**
5. **Podsumowanie sezonu**: pozycja, punkty, wygrane · podia, zmiana budżetu, **ocena sezonu** z paskami (Wyniki, Wykorzystanie sprzętu, Finanse, Forma), **„Historia tego sezonu”** — automatyczny tekst z wyróżnikiem („średnio 5,4 pozycji zyskiwanych w wyścigu”), rozwój OVR (20 → 23), saldo
6. **Pokolenie** — śledzi kariery rówieśników z twojego rocznika (gdzie są, na jakim miejscu). Spotykasz ich dalej w karierze („znajomy = ktoś, z kim ścigałeś się wcześniej”)
7. **Rynek — co dalej?** — karty ofert zespołów: tier, siła sprzętu, koszt, kredyt i raty, długość kontraktu, „wspólna historia N sezonów”, sekcja **„Obserwują cię”** (zespoły chcą cię, ale nie masz budżetu). Wybierasz → „Decyzja” → następny sezon

### Wnioski
- **Główna pętla to zarządzanie karierą, nie sterowanie wyścigiem.** Wyścigi lecą automatycznie, gracz decyduje między sezonami (trening, pieniądze, zespół, wydarzenia) i w kilku kluczowych momentach. Dzięki temu 20 minut wystarcza na dziesiątki sezonów.
- **Transparentność** to podstawa: każdy rzut ma pokazaną szansę, każdy wybór pokazane skutki.
- **Budżet** jest głównym ograniczeniem i źródłem dramatu (kredyty, tata dokłada z trzynastki).
- **Humor polskich realiów** w drobnych tekstach.
- **Meta** (Kariera dnia, rankingi, osiągnięcia, cele, kolekcje) trzyma ludzi dłużej niż jedna kariera.

### Co gracze krytykują (Hejto)
- wybory mają za mały wpływ, ostrożne opcje i tak często przegrywają
- ścieżka przewidywalna, teksty z czasem się przeklikuje

---

## 2. Przeniesienie na MMA 1:1

| Kierowca | MMA |
|---|---|
| Karting → F4 → F3 → F2 → F1 | Amatorka → Gale regionalne → Polska federacja → Europa → Światowa federacja |
| Zespół + siła bolidu | **Klub** + siła klubu (trenerzy, sparingpartnerzy) |
| Kontrakt z zespołem w danej serii | **Kontrakt z federacją** (na N walk / sezon) |
| Wyścigi R1–R8 | **Walki w sezonie** (amatorka: 4–5 turniejowych, zawodowo: 2–3) |
| Q → P i punkty | **Rywal (rekord, ranking) → wynik i metoda** (KO R2, poddanie, decyzja) |
| Klasyfikacja sezonu | **Ranking kategorii wagowej** + pas mistrzowski |
| 6 skilli | **Stójka, Zapasy, Parter, Kondycja, Szczęka, Głowa** |
| OVR, media, rep | **OVR, media (obserwujący), rep** |
| Budżet, wpisowe, kredyt | **Budżet**: składki w klubie, wpisowe na turnieje, dojazdy, obozy; zawodowo gaże |
| Forma na sezon (ruletka) | **Forma na sezon** (ta sama mechanika) |
| Kluczowy moment w wyścigu | **Kluczowy moment w walce**: „Rywal opada z sił w 3. rundzie”, test Kondycji, szansa 61% |
| Decyzja w wyścigu | **Decyzja w walce**: „Rozcięty łuk, lekarz pyta. Walczysz dalej?”, „Masz plecy rywala: duszenie czy kontrola?” |
| Pokolenie | **Rocznik**: zawodnicy, z którymi zaczynałeś w amatorce. Spotykasz ich później w klatce (rewanże, rywalizacje) |
| Deszcz | **Zbijanie wagi** / walki z zastępstwa / wyjazdowe |
| Seria boczna | **Freak fighty** (kasa i media vs prestiż), **grappling/kickboxing** jako boczne turnieje |
| Start w wieku 8 lat | Start w wieku **16 lat**, pierwszy trening, koniec ok. 38–40 |
| Tata sprzedał Passata | np. „Mama oddała ci oszczędności na rękawice. Ojciec mówi, że to zabawa dla patusów.” |

### Punkt startowy (z mnożnikiem wyniku)
- **Chłopak z osiedla** — talent losowy, zero kasy (×1,0)
- **Syn biznesmena** — kasa i kontakty, talent jak wypadnie (×1,0)
- **Mistrz Polski juniorów w zapasach** — talent, bazowe zapasy wysoko (×0,6)
- **Wybraniec** — talent kosmiczny (bez rankingu)

Poziom trudności: Normalny ×1,0 / Trudny ×1,10.

### Walka (auto-symulacja z kluczowymi momentami)
Walka liczy się w tle runda po rundzie (statystyki obu zawodników, style, kondycja, obrażenia, sędziowie 10–9). Gracz widzi w raporcie wynik i **kluczowe momenty** z testami skilli i szansą. Raz na kilka walk pojawia się **decyzja**, którą gracz podejmuje z widocznym rozkładem wyników (super / sukces / porażka). To odpowiedź na zarzut z Hejto: decyzja jest rzadka, ale ważna, a jej szanse są jawne.

### LEGACY (wynik kariery)
Punkty za: zwycięstwa (waga wg szczebla), skończenia, pasy, obrony, najwyższy ranking, zarobki, media. Mnożnik z profilu startowego i trudności. To liczba na karcie i (później) w rankingach.

---

## 3. Priorytety

**P0 — tej nocy (grywalna całość, lokalnie):**
1. Menu: Graj (3 sloty), Kariera dnia (lokalnie, bez rankingu online)
2. Nowa kariera: imię + losowanie, punkt startowy, trudność, kategoria wagowa, styl
3. HUD 1:1: OVR, budżet, wiek, media, rep, sezon, skille, klub, budżet, ranking
4. Pętla sezonu: trening → budżet i sponsorzy → wydarzenie (skutki jako chipy) → raport sezonu (forma-ruletka, road mapa walk, kluczowe momenty, decyzje, pomiń) → podsumowanie (ocena, historia sezonu, rozwój, rocznik) → rynek (federacje + kluby)
5. Silnik walki i progresja 5 szczebli, pasy, ranking, kontuzje, zużycie, starzenie
6. 40+ wydarzeń z polskim humorem, sponsorzy z klauzulami
7. Rocznik (pokolenie) i spotkania z rówieśnikami
8. Koniec kariery: werdykt + **karta kariery PNG** + LEGACY
9. Balans: symulacja tysięcy karier botem
10. Mobile-first, ciemny motyw jak w oryginale

**P1:** osiągnięcia, muzeum kariery, cele dnia i tygodnia, seria dni, freak fighty w pełni, obietnice/relacje rozbudowane, kosmetyka (np. spodenki/rękawice zamiast kasków), sponsor-easter egg Ground Game.

**P2 (wymaga backendu):** rankingi LEGACY online, panujący mistrz, Kariera dnia z tablicą wyników, polecanie, wersja angielska, OG image.

---

## 4. Stack
- React + TypeScript + Vite, bez backendu (backend dopiero pod P2)
- Silnik gry jako czyste funkcje TS, oddzielony od UI, deterministyczny RNG z ziarnem (Kariera dnia, testy, powtarzalność)
- Vitest + skrypt symulujący tysiące karier do balansu
- Zapis w localStorage (3 sloty)
- Karta kariery rysowana na canvas → PNG
- Lokalnie (`npm run dev`), publikacja później


---

## 5. Stan prac (noc 16/17.10.2026)

**Zrobione (P0 w całości + większość P1):**
- Menu: Graj (3 sloty), Kariera dnia, cele dnia (3) + wyzwanie tygodnia + seria dni, osiągnięcia (35), muzeum kariery, ustawienia
- Nowa kariera: imię/nazwisko z losowaniem, ksywa, województwo i miasto, styl (6), punkt startowy z mnożnikiem wyniku (4), trudność
- HUD 1:1 jak w kierowcy: OVR, budżet, rekord, wiek, media, rep, sezon; panel boczny: umiejętności, klub z siłą, ranking (top 3 + Ty, pełny ranking z rocznikiem), profil
- Pętla sezonu: okres przygotowawczy → budżet (kredyt, sponsorzy, rodzice) → wydarzenie (66 wydarzeń, skutki jako chipy, szanse w %) → raport sezonu (ruletka formy, walki po kolei, kluczowe momenty, decyzje w walce z rozkładem super/sukces/porażka, pomiń/szybciej) → podsumowanie (ocena, paski, historia sezonu, wykres kariery, rocznik) → rynek (federacje: kontynuacja/awans/spadek/freak, „obserwują Cię”, kluby z siłą i ceną, poziom rywali vs Twój OVR, ostrzeżenia o łamaniu obietnic)
- Silnik walki: runda po rundzie, 3 wymiany na rundę, style, kondycja, obrażenia, nokdauny, poddania, ground and pound, lekarz, punktacja 10-9/10-8 trzech sędziów (decyzje jednogłośne/niejednogłośne/większościowe/remis)
- Rocznik: 10 rówieśników rozwija się równolegle, spotykasz ich w klatce, rewanże, bilans bezpośredni
- Koniec kariery: werdykt (11 typów), LEGACY, karta PNG 1080×1350 z motywami (6, odblokowywane), udostępnianie
- Ground Game: paleta i fonty ze sklepu, logo, link do sklepu z UTM, wydarzenie ze sponsoringiem GG
- Jakość: testy jednostkowe silnika (determinizm, brak NaN, kariera zawsze się kończy), symulacja balansu (tryb rozsądny vs naiwny), test e2e w przeglądarce (desktop i telefon)

**Balans (300 karier „chłopaka z osiedla”, bot rozsądny):** ok. 21 sezonów, koniec kariery ok. 36 lat, KO ok. 23%, poddania ok. 12%; rozsądny gracz ma ok. 58% więcej LEGACY niż naiwny.

## 6. Następne kroki

1. **Publikacja**: hosting statyczny (Netlify/Vercel albo subdomena groundgame.com), obrazek OG do linków, domena.
2. **Rankingi online (P2)**: backend (np. Supabase, jak w Ground Game Lab) z tablicą LEGACY dzień/tydzień i „panującym mistrzem”, Kariera dnia z tabelą.
3. **Treść**: więcej decyzji w walce (kontuzja w trakcie, cięcie łuku), więcej wydarzeń pod konkretne szczeble, wersja angielska.
4. **Ground Game**: prawdziwe kolekcje jako sponsor/stroje w grze (np. spodenki Ramen Cat), kod rabatowy na karcie kariery dla wybitnych wyników.
