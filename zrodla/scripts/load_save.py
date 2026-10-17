"""Wczytuje zapis (JSON) do slotu 1 i otwiera grę: python3 scripts/load_save.py URL save.json szerokość wysokość katalog"""
import sys, json
from playwright.sync_api import sync_playwright
URL, SAVE, W, H, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
data = open(SAVE).read()
def open_game(p, anim=False):
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': W, 'height': H}, reduced_motion='no-preference' if anim else 'reduce')
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(URL)
    pg.evaluate("([d]) => { localStorage.setItem('spz-mma-slot-1', d); localStorage.setItem('spz-mma-settings', JSON.stringify({animations:true,cardTheme:'dark',tips:false,tipsSeen:[],tutorialSeen:true})); }", [data])
    pg.reload(); pg.wait_for_timeout(300)
    pg.get_by_role('button', name='Graj').first.click(); pg.wait_for_timeout(300)
    pg.locator('.slot button, button').filter(has_text='Kontynuuj').first.click(); pg.wait_for_timeout(500)
    return b, pg, errs
