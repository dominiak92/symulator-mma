"""Jak pro_tour, ale co 9 kroków przeładowuje stronę (test zapisu i odtwarzania stanu). Użycie: python3 scripts/reload_tour.py URL save.json szer wys katalog [sezony]"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import load_save
from load_save import sync_playwright, open_game
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
with sync_playwright() as p:
    b, pg, errs = open_game(p, anim=True)
    season = 0
    import random
    random.seed(11)
    reloads = 0
    for step in range(900):
        if season >= SEASONS: break
        if step and step % 9 == 0:
            pg.reload(); pg.wait_for_timeout(400); reloads += 1
            if pg.get_by_role('button', name='Graj').count():
                pg.get_by_role('button', name='Graj').first.click(); pg.wait_for_timeout(300)
                k = pg.locator('button').filter(has_text='Kontynuuj')
                if k.count(): k.first.click(); pg.wait_for_timeout(500)
            if pg.locator('body').inner_text().strip()[:5] == '' : print('pusty ekran po przeładowaniu', step)
        main = pg.locator('.main').inner_text() if pg.locator('.main').count() else ''
        if pg.locator('.press-modal').count():
            shot(pg, 'konferencja'); pg.locator('.press-opt').nth(1).click(); pg.wait_for_timeout(300); continue
        if pg.locator('.offer-modal').count():
            shot(pg, 'oferta-odbudowa' if pg.locator('.fi-card.tuneup').count() else 'oferta')
            if step % 3 == 0 and pg.get_by_role('button', name='Chcę więcej').count() and pg.get_by_role('button', name='Chcę więcej').is_enabled():
                pg.get_by_role('button', name='Chcę więcej').click(); pg.wait_for_timeout(1500); shot(pg, 'oferta-po-negocjacji'); continue
            pg.locator('.ofr-actions .btn-primary').click(); pg.wait_for_timeout(300); continue
        if pg.locator('.poster-modal').count():
            pg.wait_for_timeout(400); shot(pg, 'plakat'); pg.locator('.fi-go').click(); pg.wait_for_timeout(300); continue
        if pg.locator('.fight-intro .fi-go').count():
            pg.locator('.fi-go').click(); pg.wait_for_timeout(300); continue
        if pg.locator('.decision .choice').count():
            shot(pg, 'decyzja'); pg.locator('.decision .choice').first.click(); pg.wait_for_timeout(400); continue
        if pg.locator('.train-opt').count():
            pg.locator('.train-opt').nth(2).click(); pg.wait_for_timeout(200); shot(pg, 'trening')
            pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); shot(pg, 'trening-dol')
            pg.locator('.cta-bar button').click(); pg.wait_for_timeout(500); continue
        if pg.get_by_role('button', name='Zaczynam rehabilitację').count():
            shot(pg, 'rehab'); pg.get_by_role('button', name='Zaczynam rehabilitację').click(); pg.wait_for_timeout(400); continue
        if pg.locator('.fights-pick').count() or pg.get_by_role('button', name='Zaczynam rok').count():
            shot(pg, 'budzet')
            if pg.locator('.fights-pick').count():
                pg.locator('.fights-pick').scroll_into_view_if_needed(); shot(pg, 'budzet-walki')
                pg.locator('.fights-pick .seg button').last.click(); pg.wait_for_timeout(200)
            if pg.get_by_role('button', name='Biorę kredyt').count(): pg.get_by_role('button', name='Biorę kredyt').click()
            btn = pg.get_by_role('button', name='Zaczynam rok')
            if btn.count() and btn.is_enabled(): btn.click()
            else:
                pg.get_by_role('button', name='Rok przerwy').click(); pg.get_by_role('button', name='Tak, idę do pracy').click()
            pg.wait_for_timeout(500); continue
        if pg.locator('.event-result').count():
            shot(pg, 'wydarzenie-wynik'); pg.get_by_role('button', name='Dalej', exact=True).click(); pg.wait_for_timeout(400); continue
        if pg.locator('.step .choice').count() and 'Rynek' not in main and not pg.locator('.offer').count():
            shot(pg, 'wydarzenie'); pg.locator('.step .choice').first.click(); pg.wait_for_timeout(500); continue
        if pg.get_by_role('button', name='Podsumowanie roku').count():
            pg.wait_for_timeout(1500); shot(pg, 'sezon-koniec'); pg.get_by_role('button', name='Podsumowanie roku').click(); pg.wait_for_timeout(600); continue
        if pg.get_by_role('button', name='Dalej: rynek').count():
            shot(pg, 'podsumowanie'); pg.get_by_role('button', name='Dalej: rynek').click(); pg.wait_for_timeout(600); continue
        if pg.locator('.mgr-section').count() or pg.get_by_role('button', name='Podpisuję').count():
            shot(pg, 'rynek')
            if pg.locator('.mgr-section').count():
                pg.locator('.mgr-section').scroll_into_view_if_needed(); pg.wait_for_timeout(300); shot(pg, 'rynek-menedzer')
                opts = pg.locator('.mgr-section .club-offer')
                if opts.count() > 1: opts.nth(1).click(); pg.wait_for_timeout(200)
            pg.locator('.offer').first.click()
            pg.get_by_role('button', name='Podpisuję').click(); pg.wait_for_timeout(600); season += 1; continue
        if pg.locator('.icon-pill.next').count():
            pg.locator('.icon-pill.next').click(); pg.wait_for_timeout(500); continue
        pg.wait_for_timeout(600)
    print('kroki', step, 'sezony', season, 'przeładowania', reloads, 'błędy', errs)
    b.close()
