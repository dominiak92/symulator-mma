"""Przechodzi grę na prawdziwym ekranie telefonu i robi zrzuty WIDOKU (nie całej strony)
na każdym ekranie: góra, środek i dół po przewinięciu. Do tego sprawdza automatycznie,
czy coś nie jest zasłonięte przez przyklejone elementy (HUD, pasek sezonu, przycisk, toast).
Użycie: python3 scripts/viewport_tour.py URL katalog szerokość sezony [wysokość]"""
import sys, os
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

URL, OUT, W, SEASONS = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
H = int(sys.argv[5]) if len(sys.argv) > 5 else 780
os.makedirs(OUT, exist_ok=True)

CHECK = r"""
() => {
  const out = [];
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  // 1) tekst wychodzący poza swój kontener (poziomo)
  for (const el of document.querySelectorAll('.hud *, .step *, .menu *, .sheet *, main *')) {
    if (!vis(el) || el.children.length) continue;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push('ucięty: ' + (el.className||el.tagName) + ' „' + el.textContent.trim().slice(0,40) + '”');
    const r = el.getBoundingClientRect();
    if (r.right > innerWidth + 1 || r.left < -1) out.push('poza ekranem: ' + (el.className||el.tagName) + ' „' + el.textContent.trim().slice(0,40) + '”');
  }
  // 2) elementy przyklejone/fixed: co jest pod nimi z klikalnych rzeczy?
  const floats = [...document.querySelectorAll('.hud, .play-ctrl, .cta-bar, .toasts > *')].filter(vis).filter(e => ['sticky','fixed'].includes(getComputedStyle(e).position) || e.closest('.toasts'));
  const clickables = [...document.querySelectorAll('button, a, input, .choice, .offer')].filter(vis);
  for (const f of floats) {
    const fr = f.getBoundingClientRect();
    for (const c of clickables) {
      if (f.contains(c) || c.contains(f)) continue;
      const cr = c.getBoundingClientRect();
      const ix = Math.min(fr.right, cr.right) - Math.max(fr.left, cr.left);
      const iy = Math.min(fr.bottom, cr.bottom) - Math.max(fr.top, cr.top);
      if (ix > 4 && iy > 4) {
        // czy element faktycznie jest zasłonięty w swoim środku widocznej części
        const x = Math.max(fr.left, cr.left) + ix / 2, y = Math.max(fr.top, cr.top) + iy / 2;
        const top = document.elementFromPoint(x, y);
        if (top && !c.contains(top)) out.push(`zasłania: ${f.className.split(' ')[0]} na „${c.textContent.trim().slice(0,30)}” (${Math.round(iy)}px)`);
      }
    }
  }
  return out;
}
"""

def snap(pg, name, problems):
    total = pg.evaluate("document.documentElement.scrollHeight")
    pos = [0]
    if total > H * 1.4: pos.append((total - H) // 2)
    if total > H: pos.append(total)
    for i, y in enumerate(pos):
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(120)
        pg.screenshot(path=f"{OUT}/{name}-{i}.png")
        for p in pg.evaluate(CHECK):
            problems.add(f"{name}: {p}")
    pg.evaluate("window.scrollTo(0,0)")

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=2, reduced_motion="reduce", is_mobile=True, has_touch=True)
    pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL); pg.evaluate("localStorage.clear()"); pg.goto(URL); pg.wait_for_timeout(400)
    problems = set(); seen = {}
    def once(k):
        seen[k] = seen.get(k, 0) + 1
        return seen[k] == 1
    snap(pg, "00-menu", problems)
    pg.get_by_role("button", name="Graj").first.click(); pg.wait_for_timeout(250)
    # samouczek (jeśli jest)
    for i in range(8):
        if pg.locator(".tutorial").count():
            snap(pg, f"01-tutorial-{i}", problems)
            nxt = pg.locator(".tutorial .btn-primary")
            nxt.click(); pg.wait_for_timeout(200)
        else: break
    if pg.locator(".slot").count() or pg.get_by_text("Zapisy").count():
        snap(pg, "02-sloty", problems)
        pg.locator(".btn-primary").first.click(); pg.wait_for_timeout(250)
    snap(pg, "03-nowa", problems)
    pg.locator(".create-cta .btn-primary").click(); pg.wait_for_timeout(300)
    season = 0
    for step in range(400):
        if season >= SEASONS: break
        coach = pg.locator(".coach")
        main = pg.inner_text("body").lower()
        if pg.locator(".train-opt").count():
            if once(f"t{season}"): snap(pg, f"s{season}-1-trening", problems)
            pg.locator(".train-opt").nth(season % 6).click(); pg.wait_for_timeout(150)
            if once(f"tp{season}") and season == 0: snap(pg, f"s{season}-1b-trening-wybor", problems)
            pg.locator(".cta-bar .btn").first.click()
        elif pg.get_by_role("button", name="Brakuje pieniędzy na sezon").count():
            if not handle_money(pg): break
        elif pg.get_by_role("button", name="Zaczynam sezon").count():
            if once(f"b{season}"): snap(pg, f"s{season}-2-budzet", problems)
            pg.get_by_role("button", name="Zaczynam sezon").click()
        elif pg.locator(".event-result").count():
            if once(f"er{season}"): snap(pg, f"s{season}-4-wydarzenie-wynik", problems)
            pg.get_by_role("button", name="Dalej", exact=True).click()
        elif pg.locator(".fight-intro").count():
            if once("intro"): snap(pg, "s0-4b-zapowiedz", problems)
            pg.locator(".fi-go").click()
        elif pg.locator(".icon-pill.next").count() and not pg.locator(".decision .choice").count():
            pg.locator(".icon-pill.next").click()
        elif pg.locator(".decision .choice").count():
            if once(f"d{season}"): snap(pg, f"s{season}-5-decyzja", problems)
            pg.locator(".decision .choice").first.click()
        elif pg.locator(".step .choice").count() and not pg.locator(".offer").count():
            if once(f"e{season}"): snap(pg, f"s{season}-3-wydarzenie", problems)
            pg.locator(".step .choice").first.click()
        elif pg.get_by_role("button", name="Podsumowanie sezonu").count():
            if once(f"r{season}"): snap(pg, f"s{season}-6-raport", problems)
            pg.get_by_role("button", name="Podsumowanie sezonu").click()
        elif pg.get_by_role("button", name="Dalej: rynek").count():
            if once(f"p{season}"): snap(pg, f"s{season}-7-podsumowanie", problems)
            pg.get_by_role("button", name="Dalej: rynek").click()
        elif pg.locator(".offer").count() and pg.get_by_role("button", name="Podpisuję").count():
            if once(f"m{season}"): snap(pg, f"s{season}-8-rynek", problems)
            pg.get_by_role("button", name="Podpisuję").click(); season += 1
        elif "karta kariery" in main or pg.locator(".verdict-big").count():
            snap(pg, "99-koniec", problems); break
        pg.wait_for_timeout(120)
    # arkusze
    if pg.get_by_role("button", name="Menu gry").count():
        for nm, sel in [("zawodnik", ".hud-who"), ("walki", "button.hs >> nth=0"), ("ranking", "button.hs >> nth=1"), ("rocznik", "button.hs >> nth=2")]:
            btn = pg.locator(sel)
            pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(200)
            if btn.count():
                btn.first.click(); pg.wait_for_timeout(200)
                snap(pg, f"x-arkusz-{nm.lower()}", problems)
                pg.keyboard.press("Escape"); pg.wait_for_timeout(150)
    b.close()
    for pr in sorted(problems): print(pr)
    print("JS:", errs or "brak błędów")
