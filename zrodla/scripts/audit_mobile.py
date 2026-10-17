"""Audyt mobilny: przechodzi grę na wąskim ekranie, robi zrzuty kolejnych ekranów
(w rozmiarze telefonu, z przewijaniem) i wypisuje elementy, które wychodzą poza ekran
albo mają ucięty tekst.

Użycie: python3 scripts/audit_mobile.py http://127.0.0.1:5173/ katalog [szerokość] [sezony]
"""
import os
import sys
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

URL = sys.argv[1]
OUT = sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 360
SEASONS = int(sys.argv[4]) if len(sys.argv) > 4 else 2
os.makedirs(OUT, exist_ok=True)
H = 740
issues = []

CHECK = r"""
() => {
  const vw = window.innerWidth;
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const st = getComputedStyle(el);
    if (st.position === 'fixed') continue;
    const name = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : '');
    if (r.right > vw + 1 && !el.closest('[data-scroll-x]')) out.push('poza ekranem: ' + name + ' prawa krawędź ' + Math.round(r.right));
    if ((st.textOverflow === 'ellipsis' || st.overflow === 'hidden') && el.scrollWidth > el.clientWidth + 1 && el.children.length === 0)
      out.push('ucięty tekst: ' + name + ' „' + el.textContent.trim().slice(0, 40) + '”');
  }
  // złe łamanie: linia kończy się jednoliterowym słowem albo ostatnia linia akapitu to jedno krótkie słowo
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let tn;
  while ((tn = walker.nextNode())) {
    const txt = tn.nodeValue;
    if (!txt || txt.trim().length < 12) continue;
    const words = [];
    const re = /\S+/g; let m;
    while ((m = re.exec(txt))) {
      const r = document.createRange(); r.setStart(tn, m.index); r.setEnd(tn, m.index + m[0].length);
      const rects = r.getClientRects(); if (!rects.length) continue;
      words.push({ w: m[0], top: Math.round(rects[0].top) });
    }
    if (words.length < 3) continue;
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i + 1].top > words[i].top + 2 && /^[aiouwzAIOUWZ]$/.test(words[i].w)) out.push('wiszące „' + words[i].w + '”: ' + txt.trim().slice(0, 50));
    }
    const lastTop = words[words.length - 1].top;
    const lastLine = words.filter((x) => x.top === lastTop);
    if (lastTop > words[0].top + 2 && lastLine.length === 1 && lastLine[0].w.length <= 4) out.push('sierotka „' + lastLine[0].w + '”: ' + txt.trim().slice(0, 50));
  }
  return [...new Set(out)].slice(0, 25);
}
"""

def snap(page, name):
    total = page.evaluate("document.documentElement.scrollHeight")
    for k in issues_for(page):
        issues.append(f"{name}: {k}")
    y = 0
    i = 0
    while y < total and i < 8:
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(120)
        page.screenshot(path=f"{OUT}/{name}-{i}.png")
        y += H - 120
        i += 1
    page.evaluate("window.scrollTo(0, 0)")

def issues_for(page):
    try:
        return page.evaluate(CHECK)
    except Exception as e:
        return [f"błąd sprawdzania {e}"]

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=2, is_mobile=True, has_touch=True, reduced_motion="reduce")
    page = ctx.new_page()
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.route("https://groundgame.com/**", lambda r: r.abort())
    page.goto(URL)
    page.wait_for_timeout(500)
    snap(page, "01-menu")
    page.get_by_role("button", name="Graj").first.click()
    if page.locator(".tutorial").count():
        page.locator(".tut-skip").click(); page.wait_for_timeout(150)
    page.wait_for_timeout(200)
    snap(page, "02-sloty")
    page.locator(".btn-primary").first.click()
    page.wait_for_timeout(200)
    snap(page, "03-nowa")
    page.locator(".btn-primary").last.click()
    page.wait_for_timeout(300)
    seen = set()
    season = 0
    for step in range(300):
        txt = page.inner_text("body").lower()
        key = None
        if page.locator(".decision").count():
            key = f"s{season}-decyzja"
            if key not in seen:
                seen.add(key); snap(page, key)
            page.locator(".decision .choice").first.click()
        elif page.locator(".event-result").count():
            key = f"s{season}-wydarzenie-wynik"
            if key not in seen:
                seen.add(key); snap(page, key)
            page.locator(".cta-bar .btn").first.click()
        elif page.locator(".step .choice").count() and page.locator(".train-opt").count() == 0 and page.locator(".offer").count() == 0:
            key = f"s{season}-wydarzenie"
            if key not in seen:
                seen.add(key); snap(page, key)
            page.locator(".step .choice").first.click()
        elif page.locator(".train-opt").count():
            key = f"s{season}-trening"
            if key not in seen:
                seen.add(key); snap(page, key)
            page.locator(".train-opt").first.click()
            page.locator(".cta-bar .btn").first.click()
        elif page.locator(".offer").count():
            snap(page, f"s{season}-rynek")
            up = page.locator("button.offer", has_text="debiut zawodowy")
            if not up.count():
                up = page.locator("button.offer", has_text="awans")
            if up.count() and up.first.is_enabled():
                up.first.click(); page.wait_for_timeout(80)
            page.locator(".cta-bar .btn").first.click()
            season += 1
            if season >= SEASONS:
                break
        elif page.get_by_role("button", name="Brakuje pieniędzy na sezon").count():
            snap(page, f"s{season}-brak-kasy")
            if not handle_money(page): break
        elif page.locator(".cta-bar .btn").count():
            btn = page.locator(".cta-bar .btn").first
            label = btn.inner_text().lower()
            key = f"s{season}-" + ("budzet" if "zaczynam" in label else "raport" if "podsumowanie" in label else "podsumowanie" if "rynek" in label else "inne")
            if key not in seen:
                seen.add(key); snap(page, key)
            btn.click()
        else:
            page.wait_for_timeout(200)
        page.wait_for_timeout(120)
    b.close()

print("\n".join(issues) if issues else "brak wykrytych problemów układu")
print("\n".join(errs) if errs else "brak błędów JS")
