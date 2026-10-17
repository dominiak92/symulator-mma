"""Zrzuty ekranów poza rozgrywką: menu, sloty, tworzenie, osiągnięcia, muzeum, ustawienia.
Użycie: python3 scripts/shots_screens.py http://127.0.0.1:5173/ katalog"""
import sys, os
from playwright.sync_api import sync_playwright
URL, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    for W, H, tag in [(360, 740, "m"), (1280, 860, "d")]:
        ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=2 if tag == "m" else 1, reduced_motion="reduce")
        pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(500)
        pg.screenshot(path=f"{OUT}/{tag}-menu.png", full_page=True)
        for name, btn in [("osiagniecia", "Osiągnięcia"), ("muzeum", "Muzeum kariery"), ("ustawienia", "Ustawienia")]:
            pg.get_by_role("button", name=btn).first.click(); pg.wait_for_timeout(150)
            pg.screenshot(path=f"{OUT}/{tag}-{name}.png", full_page=True)
            pg.get_by_role("button", name="Wróć do menu").click(); pg.wait_for_timeout(100)
        pg.get_by_role("button", name="Graj").first.click(); pg.wait_for_timeout(150)
        if pg.locator(".tutorial").count():
            pg.locator(".tut-skip").click(); pg.wait_for_timeout(150)
        pg.screenshot(path=f"{OUT}/{tag}-sloty.png", full_page=True)
        pg.locator(".btn-primary").first.click(); pg.wait_for_timeout(150)
        pg.screenshot(path=f"{OUT}/{tag}-nowa.png", full_page=True)
        print(tag, errs or "brak błędów JS")
    b.close()
