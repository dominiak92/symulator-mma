"""Test dymny interfejsu: każda aplikacja w telefonie na kilku zapisach, na szerokości iPhone'a.
Sprawdza: błędy JS, poziome przewijanie ekranu, tekst wychodzący poza ekran, nieczytelny kontrast
(np. biały napis na białej karcie), puste ekrany aplikacji.

python3 scripts/ui_smoke.py [URL] [--shots KATALOG]
Kod wyjścia 1, jeśli coś znalazł. Uruchamiać przed każdym wgraniem na /dev/.
"""
import sys, re, os, json, glob
INJECT = os.environ.get('SMOKE_INJECT')  # do sprawdzenia samego testu: wstrzyknięty błąd CSS
from playwright.sync_api import sync_playwright

URL = next((a for a in sys.argv[1:] if a.startswith('http')), 'http://localhost:5175/')
SHOTS = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else None
HERE = os.path.dirname(os.path.abspath(__file__))
SAVES = sorted(glob.glob(os.path.join(HERE, '..', 'tests', 'fixtures', 'ui', '*.json')))
WIDTHS = [393, 360]

# Zbiera problemy na bieżącym ekranie telefonu (w przeglądarce).
CHECK_JS = r"""
() => {
  const out = [];
  const sc = document.getElementById('dev-screen');
  if (!sc) return ['brak ekranu telefonu'];
  const R = sc.getBoundingClientRect();
  if (sc.scrollWidth > sc.clientWidth + 1) out.push(`poziome przewijanie: ${sc.scrollWidth} > ${sc.clientWidth}`);
  const lum = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    if (p.length === 4 && p[3] < 0.5) return null;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]);
  };
  const bgOf = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // gradient albo zdjęcie: nie oceniamy
      const l = lum(cs.backgroundColor);
      if (l !== null) return l;
    }
    return null;
  };
  const seen = new Set();
  const walker = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.4) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.bottom < R.top || r.top > R.bottom) continue;
    if (el.closest('[aria-hidden="true"], .sr-only')) continue;
    // tekst wychodzi poza ekran telefonu
    if (r.right > R.right + 2 && cs.overflow !== 'hidden' && !el.closest('[style*="overflow"], .h-scroll, .kn-nav, .tm-tabs, nav')) out.push(`tekst poza ekranem: „${t.slice(0, 40)}” (${Math.round(r.right - R.right)} px)`);
    // kontrast
    const fg = lum(cs.color);
    const bg = bgOf(el);
    if (fg !== null && bg !== null) {
      const c = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      if (c < 2.2) out.push(`słaby kontrast ${c.toFixed(1)}: „${t.slice(0, 40)}”`);
    }
  }
  const txt = sc.innerText.trim();
  if (txt.length < 30) out.push(`pusty ekran (${txt.length} znaków)`);
  if (/undefined|NaN|\[object Object\]/.test(txt)) out.push('w tekście: undefined/NaN');
  return out;
}
"""

problems = []
opened = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in WIDTHS:
        for save in SAVES:
            name = os.path.basename(save)
            pg = b.new_page(viewport={'width': w, 'height': 760}, is_mobile=True, has_touch=True, device_scale_factor=1)
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(URL)
            data = open(save).read()
            pg.evaluate("([d]) => { localStorage.clear(); localStorage.setItem('spz-mma-slot-1', d); localStorage.setItem('spz-mma-settings', JSON.stringify({animations:false,cardTheme:'dark',tips:false,tipsSeen:[],tutorialSeen:true,fontScale:100})); localStorage.setItem('spz-mma-seen-version','999'); }", [data])
            pg.reload(); pg.wait_for_timeout(400)
            pg.get_by_role('button', name='Graj').first.click(); pg.wait_for_timeout(300)
            pg.locator('.slot button, button').filter(has_text=re.compile('Kontynuuj|Zobacz kartę')).first.click(); pg.wait_for_timeout(1200)

            def home():
                for _ in range(3):
                    if pg.locator('.tel-app').count():
                        return True
                    if pg.locator('.dev-homebar').count():
                        pg.locator('.dev-homebar').first.dispatch_event('click'); pg.wait_for_timeout(500)
                return pg.locator('.tel-app').count() > 0

            if not home():
                problems.append(f'{w}px {name}: nie da się wrócić do ekranu głównego')
                pg.close(); continue
            labels = [x.strip() for x in pg.locator('.tel-app').all_inner_texts() if x.strip()]
            for lab in labels:
                home()
                btn = pg.locator('.tel-app').filter(has_text=re.compile('^' + re.escape(lab) + r'\s*$'))
                if not btn.count():
                    continue
                # powiadomienia na wierzchu zasłaniają ikony: stukamy bezpośrednio w aplikację
                btn.first.dispatch_event('click'); pg.wait_for_timeout(600)
                if INJECT: pg.add_style_tag(content=INJECT)
                opened += 1
                for i, sc in enumerate([0, 600, 1200]):
                    pg.evaluate(f"(() => {{ const s=document.getElementById('dev-screen'); if (s) s.scrollTop={sc}; }})()"); pg.wait_for_timeout(150)
                    for pr in pg.evaluate(CHECK_JS):
                        if i > 0 and pr.startswith('pusty'):
                            continue
                        problems.append(f'{w}px {name} › {lab}: {pr}')
                if SHOTS:
                    os.makedirs(SHOTS, exist_ok=True)
                    pg.evaluate("document.getElementById('dev-screen').scrollTop=0")
                    pg.screenshot(path=f'{SHOTS}/{w}_{name[:-5]}_{re.sub(r"\W+", "_", lab)}.png')
            for e in errs:
                problems.append(f'{w}px {name}: błąd JS: {e[:160]}')
            pg.close()
    b.close()

uniq = list(dict.fromkeys(problems))
print(f'Sprawdzone zapisy: {len(SAVES)}, szerokości: {WIDTHS}, otwartych aplikacji: {opened}')
for pr in uniq:
    print(' -', pr)
print('OK' if not uniq else f'{len(uniq)} problemów')
sys.exit(1 if uniq else 0)
