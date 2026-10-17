# Symulator Polskiego Zawodnika MMA · Ground Game

Tekstowa kariera polskiego zawodnika MMA w przeglądarce. Od maty w remizie po pas światowej federacji w ok. 20 minut. Wzorowane na „Symulatorze Polskiego Kierowcy”, w identyfikacji Ground Game.

## Uruchomienie

```bash
npm install
npm run dev          # gra na http://localhost:5173
npm run build        # build produkcyjny do dist/
npm run build:single # cała gra w jednym pliku: dist-single/index.html
npm run sim          # bot rozgrywa 300 karier i wypisuje statystyki balansu
npm test             # testy jednostkowe silnika (Vitest)
```

Symulacja z parametrami: `npx tsx scripts/sim.ts [liczba] [osiedle|biznes|junior|wybraniec] [naive]`. Tryb `naive` gra jak ktoś, kto zawsze klika pierwszą opcję; porównanie z trybem domyślnym pokazuje, ile znaczą decyzje gracza.

Test w przeglądarce (Playwright, Python): `python3 scripts/e2e.py http://127.0.0.1:5173/ katalog_zrzutow 3 1280`. Audyt telefonu (zrzuty i wykrywanie uciętych elementów): `python3 scripts/audit_mobile.py http://127.0.0.1:5173/ katalog 360 6`.

## Jak to działa

Pętla sezonu 1:1 jak w kierowcy:

1. **Okres przygotowawczy** — wybierasz umiejętność na obóz (reszta rośnie naturalnie, zależnie od wieku i klubu).
2. **Budżet** — składki, wpisowe, życie, raty, sponsorzy; przy braku pieniędzy kredyt.
3. **Wydarzenie** — sytuacja z wyborem, skutki widoczne przed decyzją jako chipy, przy ryzyku szansa w %.
4. **Raport sezonu** — ruletka formy, walki rozgrywane po kolei, kluczowe momenty z testem umiejętności i szansą, od czasu do czasu decyzja w walce (zawsze z opcją bezpieczną i opisem, co daje sukces, a czym grozi porażka).
5. **Podsumowanie** — ocena sezonu, historia sezonu, rozwój, rocznik.
6. **Rynek** — federacja (zostań, awans, spadek, freak fighty) i klub (siła klubu ogranicza sufit rozwoju).

Realia polskiego MMA:

- **Amatorka** to dwa turnieje w roku (Puchar Polski MMA i Mistrzostwa Polski MMA) z drabinką: ćwierćfinał i półfinał 1 × 4 min, finał i walka o brąz 3 × 3 min, w drabince bez remisów (dogrywka). Osobny rekord amatorski, medale, kategorie wiekowe (pierwszy krok, kadeci, juniorzy, seniorzy). Złoto Mistrzostw daje tytuł mistrza Polski amatorów.
- **Debiut zawodowy** najwcześniej po 18. urodzinach, po 5 wygranych i medalu (albo 10 wygranych, albo wyraźnie wyższych umiejętnościach). Rekord zawodowy liczy się od zera.
- **Gale** mają numery (np. „PLW 47”, „Fight Night Lubuskie 12”), walki są na karcie wstępnej, głównej albo jako walka wieczoru. Wyniki zapisują się jak na portalach: metoda, runda, czas, karty sędziów. Bonusy: nokaut, poddanie i walka wieczoru.
- **Kategoria wagowa** wybierana przy tworzeniu zawodnika.

Koniec kariery: wiek, zużycie organizmu, seria nokautów po 27. roku życia, długi albo własna decyzja. Na koniec werdykt, punkty LEGACY i karta kariery PNG do udostępnienia.

Meta między karierami: 3 sloty, Kariera dnia (ten sam zawodnik dla wszystkich danego dnia), cele dnia (3) i wyzwanie tygodnia, seria dni, 35 osiągnięć, muzeum karier, 6 motywów karty kariery odblokowywanych osiągnięciami. Wszystko w localStorage.

## Struktura

- `src/engine/` — czysta logika gry w TypeScript, bez Reacta. Deterministyczny RNG z ziarnem zapisanym w stanie gry.
  - `game.ts` — stan, fazy sezonu, budżet, rynek, ranking, koniec kariery, LEGACY
  - `fight.ts` — silnik walki runda po rundzie, jawne szanse, decyzje
  - `events.ts` — wydarzenia (treść i efekty deklaratywnie)
  - `fighter.ts` — rywale, rocznik, kluby, rozwój
  - `achievements.ts`, `data.ts`, `types.ts`, `rng.ts`
- `src/ui/` — ekrany React, karta kariery rysowana na canvasie (`card.ts`)
- `scripts/` — symulacja balansu i test e2e

## Publikacja

`npm run build` daje statyczną stronę w `dist/` (z obrazkiem do linków `og.png`), którą można wrzucić na Netlify, Vercel albo subdomenę groundgame.com. `npm run build:single` daje jeden plik HTML, który działa nawet po otwarciu z dysku.

## Ground Game

Kolory i fonty ze sklepu groundgame.com (cyan #01AEEE z logo, niebieski #1F00FE z przycisków, grafit; Oswald + Archivo). Logo ładowane z `groundgame.com/cdn/shop/files/logo_big_white.png`. Linki do sklepu mają UTM `utm_source=symulator_mma&utm_medium=gra&utm_campaign=symulator_mma&utm_content=…`.

Wszystkie postacie, nazwiska, kluby, gale, federacje i sponsorzy w grze są fikcyjne. Podobieństwo do prawdziwych osób i firm jest przypadkowe. Prawdziwa jest tylko marka Ground Game.
