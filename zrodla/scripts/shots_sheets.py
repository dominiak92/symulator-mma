"""Zrzuty arkuszy (zawodnik, medale/ranking, walki, rocznik) i układu na desktopie.
Użycie: python3 scripts/shots_sheets.py http://127.0.0.1:5173/ katalog"""
import sys, os
from playwright.sync_api import sync_playwright
URL, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

def play_until(page, seasons):
    done = 0
    for _ in range(400):
        if page.locator(".decision").count():
            page.locator(".decision .choice").first.click()
        elif page.locator(".train-opt").count():
            page.locator(".train-opt").first.click(); page.locator(".cta-bar .btn").first.click()
        elif page.locator(".offer").count() and page.locator(".cta-bar .btn").count():
            done += 1
            if done >= seasons: return
            page.locator(".cta-bar .btn").first.click()
        elif page.locator(".step .choice").count():
            page.locator(".step .choice").first.click()
        elif page.locator(".cta-bar .btn").count():
            page.locator(".cta-bar .btn").first.click()
        page.wait_for_timeout(60)

with sync_playwright() as p:
    b = p.chromium.launch()
    for W, H, tag in [(360, 740, "m"), (1280, 860, "d")]:
        ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=1 if tag == "d" else 2, reduced_motion="reduce")
        page = ctx.new_page()
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.route("https://groundgame.com/**", lambda r: r.abort())
        page.goto(URL); page.evaluate("localStorage.clear()"); page.goto(URL)
        page.get_by_role("button", name="Graj").first.click()
        if page.locator(".tutorial").count():
            page.locator(".tut-skip").click(); page.wait_for_timeout(150)
        page.locator(".btn-primary").first.click()
        page.locator(".btn-primary").last.click()
        page.wait_for_timeout(200)
        play_until(page, 3)
        page.add_style_tag(content='.toasts{display:none!important}')
        page.screenshot(path=f"{OUT}/{tag}-rynek.png")
        if tag == "m":
            for name in ["Zawodnik", "Medale", "Ranking", "Walki", "Rocznik"]:
                btn = page.locator(".dock button", has_text=name)
                if btn.count():
                    btn.first.click(); page.wait_for_timeout(150)
                    page.screenshot(path=f"{OUT}/{tag}-arkusz-{name}.png")
                    page.keyboard.press("Escape"); page.wait_for_timeout(100)
        print(tag, "po arkuszach:", page.inner_text("body")[:100].replace("\n", " | "), errs)
        page.locator(".cta-bar .btn").first.click(); page.wait_for_timeout(100)
        # do raportu sezonu
        for _ in range(60):
            if page.locator(".fight").count() >= 2 or page.locator(".decision").count(): break
            if page.locator(".train-opt").count():
                page.locator(".train-opt").nth(2).click(); page.locator(".cta-bar .btn").first.click()
            elif page.locator(".step .choice").count():
                page.locator(".step .choice").first.click()
            elif page.locator(".cta-bar .btn").count():
                page.locator(".cta-bar .btn").first.click()
            page.wait_for_timeout(80)
        page.add_style_tag(content='.toasts{display:none!important}')
        page.screenshot(path=f"{OUT}/{tag}-sezon.png", full_page=(tag == "d"))
        print(tag, errs or "brak błędów JS")
    b.close()
