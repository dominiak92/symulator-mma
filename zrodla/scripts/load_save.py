"""Wczytuje zapis (JSON) do slotu 1 i otwiera grę: python3 scripts/load_save.py URL save.json szerokość wysokość katalog"""
import sys, json, re, os
from playwright.sync_api import sync_playwright
URL, SAVE, W, H, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
data = open(SAVE).read()
HOOK = None
def open_game(p, anim=False):
    b = p.chromium.launch()
    mob = bool(os.environ.get('MOBILE')) and W < 800
    pg = b.new_page(viewport={'width': W, 'height': H}, color_scheme=os.environ.get('SCHEME', 'light'), reduced_motion='no-preference' if anim else 'reduce',
                    is_mobile=mob, has_touch=mob, device_scale_factor=3 if mob else 1)
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(URL)
    import os as _os
    pg.evaluate(f"window.__FS={int(_os.environ.get('FONT', '100'))}; window.__FW={1 if _os.environ.get('FEWER') else 0}; window.__TIPS={1 if _os.environ.get('TIPS') else 0}")
    pg.evaluate("([d]) => { localStorage.setItem('spz-mma-slot-1', d); localStorage.setItem('spz-mma-settings', JSON.stringify({animations:true,cardTheme:'dark',tips:!!window.__TIPS,tipsSeen:[],tutorialSeen:!window.__TIPS,fontScale:Number(window.__FS||100),fewer:!!window.__FW})); }", [data])
    pg.reload(); pg.wait_for_timeout(300)
    pg.get_by_role('button', name='Graj').first.click(); pg.wait_for_timeout(300)
    # samouczek „Jak grać” (gdy włączone podpowiedzi jak u nowego gracza): przeklikaj, sprawdzając każdy ekran
    for _ in range(10):
        if not pg.get_by_role('button', name='Pomiń').count(): break
        if HOOK: HOOK(pg, 'samouczek')
        nxt = pg.locator('button').filter(has_text=re.compile('^(Dalej|Zaczynam|Gramy|Start)'))
        if nxt.count(): nxt.last.click()
        else: pg.get_by_role('button', name='Pomiń').click()
        pg.wait_for_timeout(300)
    pg.locator('.slot button, button').filter(has_text=re.compile('Kontynuuj|Zobacz kartę')).first.click(); pg.wait_for_timeout(500)
    return b, pg, errs
