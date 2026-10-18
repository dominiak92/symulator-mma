"""Przeklikuje grę w headless Chromium i robi zrzuty ekranów.

Użycie: python3 scripts/e2e.py [url] [katalog_na_zrzuty] [liczba_sezonów] [szerokość]
"""
import sys
import os
from playwright.sync_api import sync_playwright

def handle_money(pg):
    """Na ekranie budżetu bez pieniędzy: kredyt, a jak bank odmawia, rok przerwy."""
    if pg.get_by_role("button", name="Biorę kredyt").count():
        pg.get_by_role("button", name="Biorę kredyt").click(); pg.wait_for_timeout(150)
        return True
    if pg.get_by_role("button", name="Rok przerwy").count():
        pg.get_by_role("button", name="Rok przerwy").click(); pg.wait_for_timeout(100)
        pg.get_by_role("button", name="Tak, idę do pracy").click(); pg.wait_for_timeout(150)
        return True
    return False

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5173/"
OUT = sys.argv[2] if len(sys.argv) > 2 else "shots"
SEASONS = int(sys.argv[3]) if len(sys.argv) > 3 else 2
WIDTH = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
os.makedirs(OUT, exist_ok=True)

errors = []


def shot(page, name):
    sw = page.evaluate("document.documentElement.scrollWidth")
    vw = page.evaluate("window.innerWidth")
    if sw > vw + 1:
        errors.append(f"{name}: strona szersza niż ekran ({sw}px > {vw}px)")
    page.screenshot(path=f"{OUT}/{name}.png", full_page=True)


def click_text(page, text, exact=False):
    page.get_by_role("button", name=text, exact=exact).first.click()


with sync_playwright() as p:
    b = p.chromium.launch()
    mobile = WIDTH < 600
    ctx = b.new_context(viewport={"width": WIDTH, "height": 844 if mobile else 900}, device_scale_factor=1, reduced_motion=("no-preference" if os.environ.get("ANIM") else "reduce"))
    page = ctx.new_page()
    fake = os.environ.get("FAKE_LOGO")
    if fake:
        # sieć do groundgame.com jest tu zablokowana; podstawiamy atrapę logo z nagłówkiem CORS
        page.route("https://groundgame.com/**", lambda route: route.fulfill(path=fake, content_type="image/png", headers={"Access-Control-Allow-Origin": "*"}))
    page.on("console", lambda m: errors.append(f"console {m.type}: {m.text}") if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.goto(URL)
    page.wait_for_timeout(600)
    shot(page, "01-menu")
    click_text(page, "Graj")
    page.wait_for_timeout(150)
    if page.locator(".tutorial").count():
        shot(page, "01b-tutorial")
        page.locator(".tut-skip").click(); page.wait_for_timeout(150)
    page.wait_for_timeout(200)
    shot(page, "02-slots")
    page.get_by_role("button", name="Zacznij").first.click()
    page.wait_for_timeout(200)
    page.get_by_label("Imię").fill("Sebastian")
    page.get_by_label("Nazwisko").fill("Testowy")
    page.get_by_label("Ksywa").fill("Bober")
    shot(page, "03-create")
    click_text(page, "Zaczynam karierę")
    page.wait_for_timeout(300)

    season = 0
    steps = 0
    seen = set()
    while season < SEASONS and steps < 2000:
        steps += 1
        body = page.inner_text("main") if page.locator("main").count() else page.inner_text("body")
        txt = (page.inner_text(".main") if page.locator(".main").count() else "").lower()
        def first_time(key):
            if key in seen:
                return False
            seen.add(key)
            return True
        if "karta kariery" in txt:
            page.wait_for_timeout(1200)
            shot(page, "14-ended")
            src = page.locator(".card-preview").get_attribute("src")
            if src:
                data = page.evaluate("async (u) => { const r = await fetch(u); const b = await r.arrayBuffer(); return Array.from(new Uint8Array(b)); }", src)
                open(f"{OUT}/15-card.png", "wb").write(bytes(data))
            chip = page.get_by_role("radio", name="Czerwony narożnik")
            if chip.count() and chip.first.is_enabled():
                chip.first.click()
                page.wait_for_timeout(1500)
                src = page.locator(".card-preview").get_attribute("src")
                data = page.evaluate("async (u) => { const r = await fetch(u); const b = await r.arrayBuffer(); return Array.from(new Uint8Array(b)); }", src)
                open(f"{OUT}/15b-card-red.png", "wb").write(bytes(data))
            page.get_by_role("button", name="Menu główne").click()
            page.wait_for_timeout(300)
            shot(page, "16-menu-after")
            page.get_by_role("button", name="Osiągnięcia").click()
            page.wait_for_timeout(200)
            shot(page, "17-achievements")
            page.get_by_role("button", name="Wróć do menu").click()
            page.get_by_role("button", name="Muzeum kariery").click()
            page.wait_for_timeout(200)
            shot(page, "18-museum")
            page.get_by_role("button", name="Wróć do menu").click()
            page.get_by_role("button", name="Ustawienia").click()
            shot(page, "19-settings")
            b.close()
            print("kroków:", steps, "sezonów:", season)
            print("\n".join(errors) if errors else "brak błędów w konsoli")
            sys.exit(0)
        if page.locator(".train-opt").count():
            if first_time(f"train{season}"):
                pass
            if season == 0:
                shot(page, "04-training")
            page.locator(".train-opt").nth((season * 2) % 6).click()
            page.locator(".cta-bar .btn").first.click()
        elif page.get_by_role("button", name="Brakuje pieniędzy na ten rok").count():
            if not handle_money(page): break
        elif page.get_by_role("button", name="Zaczynam rok", exact=True).count():
            if season == 0:
                shot(page, "05-budget")
            page.get_by_role("button", name="Zaczynam rok", exact=True).click()
        elif page.locator(".event-result").count():
            if first_time(f"evres{season}"):
                shot(page, f"07-event-result-s{season+1}")
            page.get_by_role("button", name="Dalej", exact=True).click()
        elif page.locator(".step .choice").count() and not page.locator(".offer").count() and not page.locator(".decision").count():
            if first_time(f"ev{season}"):
                shot(page, f"06-event-s{season+1}")
            page.locator(".step .choice").first.click()
        elif page.locator(".press-modal").count():
            page.locator(".press-opt").first.click(); page.wait_for_timeout(200)
        elif page.locator(".offer-modal").count():
            if first_time("offer"):
                shot(page, "08b-oferta")
            page.locator(".ofr-actions .btn-primary").click(); page.wait_for_timeout(200)
        elif page.locator(".fight-intro").count():
            if first_time("intro"):
                shot(page, "08a-zapowiedz")
            (lambda: page.locator(".fi-go").click(timeout=2000) if page.locator(".fi-go").count() else None)()
        elif page.locator(".icon-pill.next").count() and not page.locator(".decision .choice").count():
            page.locator(".icon-pill.next").click()
        elif page.locator(".decision").count():
            if first_time(f"dec{season}"):
                shot(page, f"08-decision-s{season+1}")
            page.locator(".decision .choice").first.click()
        elif page.get_by_role("button", name="Podsumowanie roku").count():
            shot(page, f"09-season-s{season+1}")
            page.get_by_role("button", name="Podsumowanie roku").click()
        elif page.get_by_role("button", name="Dalej: kontrakty").count():
            shot(page, f"10-summary-s{season+1}")
            page.get_by_role("button", name="Dalej: kontrakty").click()
        elif page.locator(".offer").count() and page.get_by_role("button", name="Podpisuję").count():
            shot(page, f"11-market-s{season+1}")
            page.get_by_role("button", name="Podpisuję").click()
            page.wait_for_timeout(300)
            if page.locator(".contract-veil").count():
                shot(page, "11b-kontrakt")
                page.locator(".cp-initials").click(); page.get_by_role("button", name="Zatwierdzam").click(); page.wait_for_timeout(900)
            season += 1
        elif page.locator(".fight-list").count():
            pass  # sezon się rozgrywa
        else:
            errors.append(f"nieznany ekran: {txt[:200]!r}")
            break
        page.wait_for_timeout(150)

    shot(page, "12-after")
    if "karta kariery" in (page.inner_text(".main") if page.locator(".main").count() else "").lower():
        b.close()
        print("kroków:", steps, "sezonów:", season)
        print("\n".join(errors) if errors else "brak błędów w konsoli")
        sys.exit(0)
    # menu w grze
    page.get_by_role("button", name="Menu gry").click()
    page.wait_for_timeout(150)
    page.get_by_role("button", name="Twój rocznik").click()
    page.wait_for_timeout(150)
    shot(page, "13-peers")
    b.close()

print("kroków:", steps, "sezonów:", season)
print("\n".join(errors) if errors else "brak błędów w konsoli")
