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
# SMOKE_SIZES=393x395,360x640: inne ekrany (np. iPhone w Chrome z paskami: 393×395); SMOKE_FONT=130: powiększony tekst
SIZES = [tuple(int(v) for v in x.split('x')) for x in os.environ['SMOKE_SIZES'].split(',')] if os.environ.get('SMOKE_SIZES') else [(w, 760) for w in WIDTHS]
FONT = int(os.environ.get('SMOKE_FONT', '100'))

# Zbiera problemy na bieżącym ekranie telefonu (w przeglądarce).
CHECK_JS = r"""
() => {
  const out = [];
  const sc = document.getElementById('dev-screen') || document.getElementById('su-screen');
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
  // przycisk w przyklejonym pasku (albo „Walcz!” na plakacie) wystaje poza dół ekranu: na niskim telefonie nie da się go stuknąć
  for (const b of document.querySelectorAll('.cta-bar .btn, .play-ctrl .btn, .kt-bar .btn, .fi-go, .contract-actions .btn')) {
    const r = b.getBoundingClientRect();
    if (!r.height || getComputedStyle(b).visibility === 'hidden') continue;
    const bottom = Math.min(window.innerHeight, R.bottom + 60);
    if (r.top < bottom && r.bottom > window.innerHeight + 1) out.push(`przycisk ucięty u dołu: „${(b.textContent || '').trim().slice(0, 30)}” (${Math.round(r.bottom - window.innerHeight)} px)`);
  }
  if (/undefined|NaN|\[object Object\]/.test(txt)) out.push('w tekście: undefined/NaN');
  return out;
}
"""

# Łamanie tekstu po polsku: jednoliterowy wyraz na końcu linii, separator na początku linii,
# słowo rozbite na dwie linie, samotne krótkie słowo w ostatniej linii akapitu.
LINES_JS = r"""
(sel) => {
  const out = [];
  const root = document.querySelector(sel) || document.body;
  const blocks = new Map();
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const el = n.parentElement;
    if (!el || el.closest('[aria-hidden="true"], .sr-only, script, style')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.4 || cs.whiteSpace === 'nowrap') continue;
    let blk = el;
    while (blk && blk !== root && getComputedStyle(blk).display.startsWith('inline')) blk = blk.parentElement;
    const re = /\S+/g; let m;
    while ((m = re.exec(n.data))) {
      const r = document.createRange();
      r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
      const rc = [...r.getClientRects()].filter((x) => x.width > 0);
      if (!rc.length) continue;
      if (rc.length > 1 && Math.abs(rc[rc.length - 1].top - rc[0].top) > 3 && m[0].length > 2) out.push(`słowo rozbite: „${m[0]}”`);
      if (!blocks.has(blk)) blocks.set(blk, []);
      blocks.get(blk).push({ w: m[0], top: rc[0].top, bot: rc[0].bottom, h: rc[0].height });
    }
  }
  for (const [blk, ws] of blocks) {
    const lines = [];
    for (const x of ws) {
      const L = lines[lines.length - 1];
      // ta sama linia, jeśli słowa nachodzą na siebie w pionie (logo z małym „.pl” też)
      if (L && x.top < L.bot - 3 && x.bot > L.top + 3) { L.ws.push(x.w); L.top = Math.min(L.top, x.top); L.bot = Math.max(L.bot, x.bot); }
      else lines.push({ top: x.top, bot: x.bot, ws: [x.w] });
    }
    if (lines.length < 2) continue;
    const ctx = (i) => lines[i].ws.slice(-4).join(' ') + ' ⏎ ' + (lines[i + 1] ? lines[i + 1].ws.slice(0, 3).join(' ') : '');
    for (let i = 0; i < lines.length - 1; i++) {
      const last = lines[i].ws[lines[i].ws.length - 1];
      if (/^[„(]?[aiouwzAIOUWZ]$/.test(last)) out.push(`sierota: „${ctx(i)}”`);
      const first = lines[i + 1].ws[0];
      if (/^[·•—–\-,:;.]/.test(first)) out.push(`znak na początku linii: „${ctx(i)}”`);
    }
    const txt = ws.map((x) => x.w).join(' ');
    const lastL = lines[lines.length - 1].ws;
    if (lastL.length === 1 && lastL[0].replace(/[^\p{L}\d]/gu, '').length <= 5 && txt.length > 45) out.push(`wdowa: „${ctx(lines.length - 2)}”`);
    else if (window.__STRICT && lastL.length === 1 && txt.length > 30 && !/^[\d\s:.,–-]+$/.test(lastL[0])) out.push(`jedno słowo w ostatniej linii: „${ctx(lines.length - 2)}”`);
  }
  return [...new Set(out)];
}
"""

# Wyśrodkowanie: napis w przycisku, kafelku, zakładce i chipie ma stać na środku
# (w poziomie, gdy pole jest wyśrodkowane; w pionie zawsze), i nie może wychodzić poza pole.
CENTER_JS = r"""
(sel) => {
  const out = [];
  const root = document.querySelector(sel) || document.body;
  const C = root.querySelectorAll('button, [role=radio], [role=tab], [role=switch], a.btn, .btn, .tag, [class*="chip"], [class*="seg"] > *, [class*="tab"] > *');
  for (const el of C) {
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 18 || r.height > 96) continue;
    // ikona aplikacji z podpisem i pasek „stuknij” mają układ pionowy z założenia
    if (el.matches('.tel-app, .pc-unlock, .scroll-hint')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.5) continue;
    if (el.closest('[aria-hidden="true"], .fx-ghost')) continue;
    // w trakcie animacji wejścia pomiar nie ma sensu
    if (el.getAnimations({ subtree: false }).some((a) => a.playState === 'running') || el.closest('[style*="transform"]')) continue;
    let L = 1e9, T = 1e9, R = -1e9, B = -1e9, n = 0;
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let x;
    while ((x = tw.nextNode())) {
      let rects = [];
      if (x.nodeType === 3) {
        if (!x.data.trim()) continue;
        const pe = x.parentElement; if (!pe || getComputedStyle(pe).position === 'absolute') continue;
        const rg = document.createRange(); rg.selectNodeContents(x); rects = [...rg.getClientRects()];
        // tekst ucięty wielokropkiem albo schowany: liczy się tylko widoczna część
        for (let a = pe; a && a !== el.parentElement; a = a.parentElement) {
          const ac = getComputedStyle(a);
          if (ac.overflowX !== 'visible' || ac.textOverflow === 'ellipsis') {
            const ar = a.getBoundingClientRect();
            rects = rects.map((q) => new DOMRect(Math.max(q.left, ar.left), q.top, Math.max(0, Math.min(q.right, ar.right) - Math.max(q.left, ar.left)), q.height));
          }
        }
      } else if (x.tagName === 'svg' || x.tagName === 'IMG') {
        const pc = getComputedStyle(x); if (pc.position === 'absolute' || pc.display === 'none') continue;
        // obrócona ikonka (słuchawka „Odrzuć”) ma pudełko większe niż to, co widać
        if (pc.transform !== 'none' && !/^matrix\(1, 0, 0, 1,/.test(pc.transform)) continue;
        rects = [x.getBoundingClientRect()];
      } else {
        // plakietka z tłem (licznik, chip) liczy się całym pudełkiem, nie samym tekstem
        const pc = getComputedStyle(x);
        if (pc.position === 'absolute' || pc.display === 'none') continue;
        const bg = pc.backgroundColor;
        if (bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg)) rects = [x.getBoundingClientRect()];
        else continue;
      }
      for (const q of rects) { if (q.width < 1) continue; L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); n++; }
    }
    if (!n) continue;
    const name = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    if (L < r.left - 1 || R > r.right + 1) { out.push(`napis wychodzi poza pole: „${name}” (${Math.round(Math.max(r.left - L, R - r.right))} px)`); continue; }
    const bl = parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft), br = parseFloat(cs.borderRightWidth) + parseFloat(cs.paddingRight);
    const bt = parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop), bb = parseFloat(cs.borderBottomWidth) + parseFloat(cs.paddingBottom);
    const hc = cs.display.includes('flex')
      ? (cs.flexDirection.startsWith('row') ? cs.justifyContent === 'center' : cs.alignItems === 'center')
      : cs.display.includes('grid')
        ? cs.justifyItems === 'center' || cs.justifyContent === 'center'
        : cs.textAlign === 'center' || cs.textAlign === '-webkit-center';
    const dx = ((L - r.left - bl) - (r.right - R - br)) / 2;
    if (hc && Math.abs(dx) > 2 && (R - L) < r.width - bl - br - 2) out.push(`nie na środku w poziomie (${Math.round(dx)} px): „${name}”`);
    const dy = ((T - r.top - bt) - (r.bottom - B - bb)) / 2;
    const lines = Math.round((B - T) / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25));
    if (Math.abs(dy) > 2 && lines <= 2 && r.height <= 64 && (B - T) < r.height - bt - bb - 6) out.push(`nie na środku w pionie (${Math.round(dy)} px): „${name}”`);
  }
  return [...new Set(out)];
}
"""

# przyciski: dopisek w nawiasie (ma być mniejszym wierszem .btn-sub pod etykietą), etykieta w 3+ liniach, tekst wychodzący z przycisku
BTN_JS = r"""
(root) => {
  const out = [];
  const R = document.querySelector(root);
  if (!R) return out;
  for (const b of R.querySelectorAll('.btn, button.choice .opt-label')) {
    const r = b.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue;
    const cs = getComputedStyle(b);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    // tekst przycisku bez dopisku .btn-sub
    const c = b.cloneNode(true);
    for (const x of c.querySelectorAll('.btn-sub, .sr-only, svg')) x.remove();
    const t = c.textContent.replace(/\s+/g, ' ').trim();
    if (b.classList.contains('btn') && /\([^)]{2,}\)/.test(t)) out.push(`nawias w przycisku: „${t.slice(0, 60)}”`);
    if (b.classList.contains('btn')) {
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      const main = b.querySelector('.btn-main') || b;
      const lines = Math.round((main === b ? (r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) : main.getBoundingClientRect().height) / lh);
      const max = b.classList.contains('btn-small') ? 1 : 2;
      if (lines > max && !b.querySelector('.btn-sub')) out.push(`przycisk w ${lines} liniach: „${t.slice(0, 60)}”`);
      const sub = b.querySelector('.btn-sub');
      if (sub) { const sl = Math.round(sub.getBoundingClientRect().height / (parseFloat(getComputedStyle(sub).lineHeight) || 14)); if (sl > 1) out.push(`dopisek w ${sl} liniach: „${t.slice(0, 60)}”`); }
      if (b.scrollWidth > b.clientWidth + 2) out.push(`tekst wychodzi z przycisku: „${t.slice(0, 60)}”`);
    }
  }
  // tekst ucięty wielokropkiem w przycisku (gracz nie przeczyta reszty)
  for (const b of R.querySelectorAll('button, a.btn')) {
    const r = b.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
    for (const e of [b, ...b.querySelectorAll('*')]) {
      // podgląd wiadomości w skrzynce (mail, czat) celowo jak w telefonie: pełna treść po otwarciu
      if (e.matches('.ch-prev, .pm-subj, .pm-snip, .ch-item-top b, .pm-row-top b')) continue;
      if (getComputedStyle(e).textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) out.push(`ucięty tekst w przycisku: „${e.textContent.trim().slice(0, 60)}”`);
    }
  }
  return out;
}
"""
BTN = os.environ.get('SMOKE_BTN', '1') == '1'
STYLE_OUT = os.environ.get('SMOKE_STYLES')
STYLES = []
STYLE_JS = r"""
() => [...document.querySelectorAll('#dev-screen .btn, #dev-screen button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 40 && r.height > 20 && r.bottom > 0 && r.top < innerHeight; }).map((e) => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return { cls: (e.className && e.className.baseVal === undefined ? e.className : '').toString().slice(0, 60), txt: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 30), h: Math.round(r.height), w: Math.round(r.width), fs: c.fontSize, ff: c.fontFamily.split(',')[0], rad: c.borderTopLeftRadius, bg: c.backgroundImage !== 'none' ? 'grad' : c.backgroundColor }; })
"""

LAMANIE = os.environ.get('SMOKE_LAMANIE')
# iPhone (Safari < 26) nie zna text-wrap: pretty: SMOKE_IOS=1 wyłącza je przed sprawdzeniem
NOPRETTY_JS = "() => { for (const e of document.querySelectorAll('*')) if (getComputedStyle(e).textWrapStyle === 'pretty') e.style.textWrapStyle = 'auto'; }"
IOS = os.environ.get('SMOKE_IOS')
problems = []
opened = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for (w, hgt) in SIZES:
        for save in SAVES:
            name = os.path.basename(save)
            pg = b.new_page(viewport={'width': w, 'height': hgt}, is_mobile=True, has_touch=True, device_scale_factor=1)
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(URL)
            data = open(save).read()
            pg.evaluate("([d, f]) => { localStorage.clear(); localStorage.setItem('spz-mma-slot-1', d); localStorage.setItem('spz-mma-settings', JSON.stringify({animations:false,cardTheme:'dark',tips:false,tipsSeen:[],tutorialSeen:true,fontScale:f})); localStorage.setItem('spz-mma-seen-version','999'); }", [data, FONT])
            pg.reload(); pg.wait_for_timeout(400)
            pg.locator('.cv-quick').first.click(); pg.wait_for_timeout(300)
            pg.locator('.slot button, button').filter(has_text=re.compile('Kontynuuj|Zobacz kartę')).first.click(); pg.wait_for_timeout(1200)
            # nowy rok zaczyna się od ekranu blokady telefonu: bez odblokowania test oglądał tylko ją
            if pg.locator('.pc-lock.yl .pc-unlock').count():
                pg.locator('.pc-lock.yl .pc-unlock').first.click(); pg.wait_for_timeout(500)

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
            labels = [x.strip() for x in pg.locator('.tel-app .tel-name').all_inner_texts() if x.strip()]
            for lab in labels:
                home()
                btn = pg.locator('.tel-app').filter(has=pg.locator('.tel-name', has_text=re.compile('^' + re.escape(lab) + r'$')))
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
                        # ekran blokady (prolog) leży nad aplikacją: to nie pusty ekran
                        if pr.startswith('pusty') and pg.locator('.pc-lock:visible').count():
                            continue
                        problems.append(f'{w}px {name} › {lab}: {pr}')
                    if BTN:
                        for pr in pg.evaluate(BTN_JS, '#dev-screen'):
                            problems.append(f'{w}px {name} › {lab}: {pr}')
                    if i == 0 and STYLE_OUT:
                        # spis przycisków (SMOKE_STYLES=plik): wysokość, czcionka, zaokrąglenie, do przeglądu spójności
                        for st in pg.evaluate(STYLE_JS):
                            STYLES.append({'app': lab, 'save': name, **st})
                    if i == 0:
                        for pr in pg.evaluate(CENTER_JS, '.app'):
                            problems.append(f'{w}px {name} › {lab}: {pr}')
                    if LAMANIE and w == 393:
                        if IOS: pg.evaluate(NOPRETTY_JS); pg.evaluate('window.__STRICT = true')
                        for pr in pg.evaluate(LINES_JS, '#dev-screen'):
                            problems.append(f'łamanie {name} › {lab}: {pr}')
                if SHOTS:
                    os.makedirs(SHOTS, exist_ok=True)
                    pg.evaluate("document.getElementById('dev-screen').scrollTop=0")
                    pg.screenshot(path=f'{SHOTS}/{w}_{name[:-5]}_{re.sub(r"\W+", "_", lab)}.png')
            for e in errs:
                problems.append(f'{w}px {name}: błąd JS: {e[:160]}')
            pg.close()
    # menu startowe: rozbite słowa w dużym tytule i nic nie wystaje w poziomie
    for w in (320, 360, 393, 430):
        pg = b.new_page(viewport={'width': w, 'height': 852})
        pg.add_init_script("try{localStorage.clear()}catch(e){}")
        pg.goto(URL); pg.wait_for_timeout(1200)
        if pg.locator('.menu').count():
            for pr in pg.evaluate(LINES_JS, '.menu'):
                if pr.startswith('słowo rozbite'):
                    problems.append(f'{w}px menu: {pr}')
            if pg.evaluate('document.documentElement.scrollWidth > innerWidth + 1'):
                problems.append(f'{w}px menu: strona szersza niż ekran')
            if BTN:
                for pr in pg.evaluate(BTN_JS, '.menu'):
                    problems.append(f'{w}px menu: {pr}')
        pg.close()
    b.close()

uniq = list(dict.fromkeys(problems))
if STYLE_OUT:
    json.dump(STYLES, open(STYLE_OUT, 'w'), ensure_ascii=False, indent=0)
print(f'Sprawdzone zapisy: {len(SAVES)}, ekrany: {SIZES}, tekst {FONT}%, otwartych aplikacji: {opened}')
for pr in uniq:
    print(' -', pr)
print('OK' if not uniq else f'{len(uniq)} problemów')
sys.exit(1 if uniq else 0)
