"""Przechodzi kilka sezonów zawodowych z zapisu i robi zrzuty każdego typu ekranu.
Użycie: python3 scripts/pro_tour.py URL save.json szerokość wysokość katalog [sezony]"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import load_save
from load_save import sync_playwright, open_game
from ui_audit import Auditor
AUD = Auditor(os.environ.get('AUDIT', sys.argv[5] + '/audyt'), os.environ.get('TAG', ''))
import load_save as _ls; _ls.HOOK = AUD.check
URL, SAVE, W, H, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
SEASONS = int(sys.argv[6]) if len(sys.argv) > 6 else 2
os.makedirs(OUT, exist_ok=True)
seen = {}
def shot(pg, name):
    n = seen.get(name, 0)
    if n >= 2: return
    seen[name] = n + 1
    pg.wait_for_timeout(250)
    pg.screenshot(path=f"{OUT}/{name}-{n}.png")
    total = pg.evaluate("document.documentElement.scrollHeight")
    sw = pg.evaluate("document.documentElement.scrollWidth")
    if sw > W + 1: print(f"{name}: strona szersza niż ekran ({sw})")
    bad = pg.evaluate('''() => { const W = innerWidth; const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        const cs = getComputedStyle(el);
        if (r.right > W + 1 && cs.position !== 'fixed' && !el.closest('[aria-hidden=true]')) {
          const p = el.parentElement && el.parentElement.getBoundingClientRect();
          if (!p || p.right <= W + 1) out.push('wystaje: ' + (el.className && el.className.baseVal === undefined ? el.className : el.tagName) + ' ' + Math.round(r.right));
        }
        if (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1) out.push('pasek poziomy: ' + el.className);
      }
      return [...new Set(out)].slice(0, 6); }''')
    for b_ in bad: print(f"{name}: {b_}")
with sync_playwright() as p:
    b, pg, errs = open_game(p, anim=True)
    season = 0
    for step in range(600):
        if season >= SEASONS: break
        AUD.check(pg, f'pro krok {step}')
        try:
            main = pg.locator('.main').inner_text() if pg.locator('.main').count() else ''
            if pg.locator('.call-btn.accept').count():
                shot(pg, 'telefon-dzwoni'); pg.locator('.call-btn.accept').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.pc-lock .pc-unlock').count():
                shot(pg, 'nowy-rok'); pg.locator('.pc-lock .pc-unlock').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.roul, .drum').count():
                shot(pg, 'losowanie'); pg.locator('.roul, .drum').first.click(force=True, timeout=4000); pg.wait_for_timeout(900); continue
            if pg.locator('.tel-pop .btn').count():
                shot(pg, 'telefon-wynik'); pg.locator('.tel-pop .btn').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.fp-poster .vs-hero').count() and pg.locator('.rp-opt').count():
                shot(pg, 'ogloszenie'); pg.locator('.rp-opt').nth(step % pg.locator('.rp-opt').count()).click(); pg.wait_for_timeout(500); continue
            if pg.locator('.rp-opt').count():
                shot(pg, 'tydzien-przed' if pg.locator('.fp-week-head').count() else 'telefon'); pg.locator('.rp-opt').first.click(); pg.wait_for_timeout(600); continue
            if pg.locator('.tel-next').count():
                pg.locator('.tel-next').first.click(); pg.wait_for_timeout(300); continue
            if pg.locator('.tel-done').count():
                shot(pg, 'telefon-koniec'); pg.locator('.tel-done').click(); pg.wait_for_timeout(400); continue
            if pg.locator('.camp-opts .choice').count():
                shot(pg, 'oboz'); pg.locator('.camp-opts .choice').nth(step % 5).click(); pg.wait_for_timeout(500); continue
            if pg.locator('.camp-go .btn-primary').count():
                shot(pg, 'oboz-plan'); pg.locator('.camp-go .btn-primary').click(); pg.wait_for_timeout(600); continue
            if pg.locator('.camp-end .btn').count():
                shot(pg, 'oboz-koniec'); pg.locator('.camp-end .btn').click(); pg.wait_for_timeout(500); continue
            if pg.locator('.wo').count():
                shot(pg, 'wejscie'); pg.locator('.wo').click(force=True, timeout=4000); pg.wait_for_timeout(300); continue
            if pg.locator('.notice-modal .btn-primary').count():
                t = pg.locator('.notice-modal').inner_text(); pg.wait_for_timeout(1400); shot(pg, 'kontuzja' if ('ontuzj' in t.lower() or 'uraz' in t.lower()) else 'komunikat'); pg.locator('.notice-modal .btn-primary').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.rv-scene .btn').count():
                shot(pg, 'scena-wyniku'); pg.locator('.rv-scene .btn').first.click(); pg.wait_for_timeout(300); continue
            if pg.locator('.post-modal .btn-primary, .weigh-modal .choice, .post-modal .choice, .invite-modal .btn-primary').count():
                shot(pg, 'po-walce'); pg.locator('.post-modal .btn-primary, .weigh-modal .choice, .post-modal .choice, .invite-modal .btn-primary').first.click(); pg.wait_for_timeout(300); continue
            if pg.locator('.fp-sheet .choice').count():
                shot(pg, 'ogloszenie'); pg.locator('.fp-sheet .choice').nth(step % pg.locator('.fp-sheet .choice').count()).click(); pg.wait_for_timeout(500); continue
            if pg.locator('.fp-after-week > .btn').count():
                shot(pg, 'tydzien-walki'); pg.locator('.fp-after-week > .btn').click(); pg.wait_for_timeout(500); continue
            if pg.locator('.fp-rest .btn').count():
                shot(pg, 'po-walce-ekran'); pg.locator('.fp-rest .btn').click(); pg.wait_for_timeout(600); continue
            if pg.locator('.press-modal .press-result').count():
                shot(pg, 'konferencja-wynik'); pg.get_by_role('button', name='Do walki').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.press-modal').count():
                shot(pg, 'konferencja'); pg.locator('.press-opt').nth(1).click(); pg.wait_for_timeout(300); continue
            if pg.locator('.offer-modal').count():
                shot(pg, 'oferta-odbudowa' if pg.locator('.fi-card.tuneup').count() else 'oferta')
                if step % 3 == 0 and pg.get_by_role('button', name='Negocjuj gażę').count() and pg.get_by_role('button', name='Negocjuj gażę').is_enabled():
                    pg.get_by_role('button', name='Negocjuj gażę').click(); pg.wait_for_timeout(1500); shot(pg, 'oferta-po-negocjacji'); continue
                try:
                    pg.locator('.ofr-actions .btn-primary').click(timeout=6000)
                except Exception:
                    pass  # oferta schowana za sceną wyniku: następny krok ją zamknie
                pg.wait_for_timeout(300); continue
            if pg.locator('.poster-modal').count():
                pg.wait_for_timeout(400); shot(pg, 'plakat'); pg.locator('.fi-go').click(force=True); pg.wait_for_timeout(300); continue
            if pg.locator('.fight-intro .fi-go').count():
                pg.locator('.fi-go').click(force=True); pg.wait_for_timeout(300); continue
            if pg.locator('.decision .choice').count():
                shot(pg, 'decyzja')
                if pg.locator('.sheet-grip').count() and seen.get('decyzja-zwinieta', 0) < 1:
                    pg.locator('.sheet-grip').click(); shot(pg, 'decyzja-zwinieta'); pg.locator('.sheet-grip').click(); pg.wait_for_timeout(200)
                pg.locator('.decision .choice').first.click(); pg.wait_for_timeout(400); continue
            if pg.locator('.tc-open-plan').count() and not pg.locator('.train-opt').count():
                shot(pg, 'trener-czat'); pg.locator('.tc-open-plan').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.tc-start').count() and not pg.locator('.train-opt').count():
                shot(pg, 'trener-odpowiedz'); pg.locator('.tc-start').click(); pg.wait_for_timeout(500); continue
            if pg.locator('.train-opt').count():
                pg.locator('.train-opt').nth(2).click(); pg.wait_for_timeout(200); shot(pg, 'trening')
                pg.locator('.tc-sheet-send').click(); pg.wait_for_timeout(500); continue
            if pg.get_by_role('button', name='Zaczynam rehabilitację').count():
                shot(pg, 'rehab'); pg.get_by_role('button', name='Zaczynam rehabilitację').click(); pg.wait_for_timeout(400); continue
            if pg.locator('.pr').count():
                shot(pg, 'plan-roku')
                if pg.locator('.pr-seg button').count():
                    pg.locator('.pr-seg button').last.click(); pg.wait_for_timeout(200)
                # raz na jakiś czas zajrzyj do poczty i grafiku (zrzuty), odpowiedz na cel roku
                if step % 4 == 0 and pg.locator('.pr-item').filter(has_text='Poczta').count():
                    pg.locator('.pr-item').filter(has_text='Poczta').click(); pg.wait_for_timeout(300); shot(pg, 'poczta')
                    if pg.locator('.pm-row.unread').count():
                        pg.locator('.pm-row.unread').first.click(); pg.wait_for_timeout(300); shot(pg, 'poczta-mail')
                        if pg.locator('.pm-reply').count(): pg.locator('.pm-reply').first.click()
                        elif pg.locator('.pm-actions .pm-btn').count(): pg.locator('.pm-actions .pm-btn').last.click()
                        pg.wait_for_timeout(300)
                    pg.locator('.dev-homebar').click(); pg.wait_for_timeout(200); pg.locator('.tel-app.app-gale').click(); pg.wait_for_timeout(300)
                btn = pg.get_by_role('button', name='Zaczynam rok')
                if btn.count() and btn.is_enabled(): btn.click()
                else:
                    pg.get_by_role('button', name='Brakuje pieniędzy: otwórz Bankotekę').click(); pg.wait_for_timeout(300); shot(pg, 'bank-brak')
                    if pg.locator('.bk-fix').filter(has_text='Kredyt').count():
                        pg.locator('.bk-fix').filter(has_text='Kredyt').click(); pg.wait_for_timeout(200)
                        pg.get_by_role('button', name='Biorę kredyt').click()
                    else:
                        pg.get_by_role('button', name='Rok przerwy').click(); pg.get_by_role('button', name='Tak, idę do pracy').click()
                    pg.wait_for_timeout(300)
                    if pg.locator('.pr').count() == 0 and pg.locator('.dev-homebar').count():
                        pg.locator('.dev-homebar').click(); pg.wait_for_timeout(200)
                        if pg.locator('.home-now').count(): pg.locator('.home-now').click()
                pg.wait_for_timeout(500); continue
            if pg.locator('.tel-pop .btn').count():
                pg.locator('.tel-pop .btn').click(); pg.wait_for_timeout(300); continue
            if pg.locator('.sm-reply').count():
                shot(pg, 'wydarzenie'); pg.locator('.sm-reply').first.click(); pg.wait_for_timeout(500); continue
            if pg.locator('.sm-compose .btn').count():
                shot(pg, 'wydarzenie-wynik'); pg.locator('.sm-compose .btn').click(); pg.wait_for_timeout(400); continue
            if pg.locator('.step .choice').count() and 'Kontrakty ·' not in main and not pg.locator('.offer').count():
                shot(pg, 'wydarzenie'); pg.locator('.step .choice').first.click(); pg.wait_for_timeout(500); continue
            if pg.get_by_role('button', name='Podsumowanie roku').count():
                pg.wait_for_timeout(1500); shot(pg, 'sezon-koniec')
                try: pg.get_by_role('button', name='Podsumowanie roku').click(timeout=4000)
                except Exception: pass
                pg.wait_for_timeout(600); continue
            if pg.get_by_role('button', name='Dalej: kontrakty').count():
                shot(pg, 'podsumowanie')
                if pg.locator('.photo-btn').count() and seen.get('karta-roku', 0) < 2:
                    pg.locator('.photo-btn').click(); pg.wait_for_selector('.photo-frame img', timeout=8000); shot(pg, 'karta-roku')
                    pg.get_by_role('button', name='Zamknij').click(); pg.wait_for_timeout(300)
                pg.get_by_role('button', name='Dalej: kontrakty').click(); pg.wait_for_timeout(600); continue
            if (pg.locator('.mgr-section:not(.coach-section)').count() or pg.get_by_role('button', name='Podpisuję').count()) and pg.locator('.offer').count():
                shot(pg, 'rynek')
                if pg.locator('.mgr-section:not(.coach-section)').count():
                    try: pg.locator('.mgr-section:not(.coach-section)').scroll_into_view_if_needed(timeout=3000)
                    except Exception: pass
                    pg.wait_for_timeout(300); shot(pg, 'rynek-menedzer')
                    opts = pg.locator('.mgr-section:not(.coach-section) .club-offer')
                    if opts.count() > 1: opts.nth(1).click(); pg.wait_for_timeout(200)
                try:
                    pg.locator('.offer').first.click(timeout=4000)
                    pg.get_by_role('button', name='Podpisuję').click(timeout=4000); pg.wait_for_timeout(600); (pg.locator(".contract-actions .btn-primary").click(), pg.wait_for_timeout(1600)) if pg.locator('.contract-veil').count() else None; season += 1
                except Exception:
                    pg.wait_for_timeout(500)  # rynek właśnie się zamknął
                continue
            # sprawa w telefonie w przerwie między walkami: karta „Telefon wibruje” i post na Flexagramie
            if pg.locator('.fg-draft:enabled').count():
                shot(pg, 'flexagram-post'); pg.locator('.fg-draft:enabled').first.click(); pg.wait_for_timeout(600); continue
            if pg.locator('button.phone-wait').count():
                shot(pg, 'telefon-wibruje'); pg.locator('button.phone-wait').first.click(); pg.wait_for_timeout(600); continue
            if pg.locator('.icon-pill.next').count():
                try: pg.locator('.icon-pill.next').click(timeout=3000)
                except Exception: pass
                pg.wait_for_timeout(500); continue
            if step % 40 == 39: shot(pg, 'bezczynnie')
            # nic do kliknięcia w tej aplikacji: jak gracz, wracamy na ekran główny i otwieramy kartę „Teraz”
            if step % 6 == 5 and pg.locator('.dev-homebar').count() and not pg.locator('.season-step').count():
                try:
                    pg.locator('.dev-homebar').click(timeout=2000); pg.wait_for_timeout(250)
                    if pg.locator('.home-now').count(): pg.locator('.home-now').click(timeout=2000); pg.wait_for_timeout(400)
                except Exception:
                    pass
            pg.wait_for_timeout(600)
        except Exception as ex:
            print('krok', step, 'wyjątek', str(ex)[:120]); pg.wait_for_timeout(500)
    print('kroki', step, 'sezony', season, 'błędy', errs)
    AUD.save()
    b.close()
