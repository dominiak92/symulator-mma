# Audyt mobilny (360 px) — 17.10.2026, przed przeróbką

## Układ
1. Pasek górny: nazwisko i podtytuł ucięte („Wojewódz…”), widać tylko budżet; rekord, wiek, ranking schowane.
2. Karta walki: wynik („Dec. niejedn.”, „Odwołana”, „trwa”) nachodzi na nazwisko rywala i linię podziału.
3. Przyklejony przycisk na dole: w stanie nieaktywnym jest półprzezroczysty i prześwituje przez niego treść; zasłania ostatnie elementy listy.
4. Powiadomienia o osiągnięciach zasłaniają środek ekranu na kilka ekranów z rzędu.
5. Panele boczne (umiejętności, klub, ranking, profil) lądują pod główną treścią — na telefonie nikt tam nie dojedzie.
6. Nagłówki wersalikami na 3 linie („OKRES PRZYGOTOWAWCZY. CO PODKRĘCASZ?”) — za duże, za długie.
7. „Forma na sezon” — etykieta, pole i znacznik rozjeżdżają się w trzy linie.
8. Legenda paska szans łamie się nierówno („81% porażka” w osobnej linii).

## Czytelność i zrozumiałość
9. Trening: „obóz +6,2” — nie wiadomo, co to znaczy; lepiej „24 → 30”.
10. Decyzje: wszystkie opcje po 19–26% — gracz nie ma żadnego sensownego wyboru; brak opcji „bezpiecznej”.
11. Decyzja nie mówi, co daje sukces, a co porażka.
12. Rywal może mieć to samo nazwisko co gracz (Wiśniewski vs „Żubr” Wiśniewski).
13. Wydarzenia mają ogólny tytuł „Wydarzenie” zamiast własnego.
14. Podsumowanie: „Wykorzystanie potencjału” i paski bez skali — niejasne.
15. Rynek: „rywale OVR ~28 (Ty: 23)” — techniczne, nieczytelne.

## Realia i język
16. Amatorka jako „liga” z gażą „brak” zamiast turniejów z drabinką i medalami; brak rozróżnienia rekordu amatorskiego i zawodowego.
17. Brak kategorii wagowej zawodnika.
18. Walki zawodowe bez gali i miejsca w karcie walk.
19. Teksty sztywne, „tłumaczone” („Znak rozpoznawczy sezonu:”, „Efekt okresu przygotowawczego”, „Plan działa idealnie”).

## Stan po przeróbce (17.10.2026, noc)
Wszystkie punkty 1–19 poprawione. Audyt automatyczny (`scripts/audit_mobile.py`) na 360 i 390 px przez 6–7 sezonów, z debiutem zawodowym: brak elementów poza ekranem, brak uciętych tekstów, brak błędów JS. Pełna kariera w teście e2e na 390 px (21 sezonów) bez błędów.
