"""Test „pierwsze 15 minut”: nowy gracz od menu do pierwszej walki, jak człowiek (animacje włączone).

Sprawdza po drodze:
- błędy JS,
- czy gra nie stoi (ten sam ekran po kilku stuknięciach z rzędu),
- czy ta sama karta nie wraca po zamknięciu,
- czytelność każdego ekranu (kontrast, tekst poza ekranem, puste ekrany: te same reguły co ui_smoke.py),
- ile stuknięć zajmuje dojście do pierwszej walki.

python3 scripts/first15.py [URL] [--shots KATALOG] [--seed N]
Kod wyjścia 1, jeśli coś znalazł.
"""
import sys, re, os, json, hashlib
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = next((a for a in sys.argv[1:] if a.startswith('http')), 'http://localhost:5175/')
SHOTS = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else None
MAX_STEPS = int(os.environ.get('F15_MAX', '320'))
# reguły czytelności bierzemy z testu dymnego
src = open(os.path.join(HERE, 'ui_smoke.py')).read()
CHECK_JS = re.search(r'CHECK_JS = r"""(.*?)"""', src, re.S).group(1)
LINES_JS = re.search(r'LINES_JS = r"""(.*?)"""', src, re.S).group(1)
CENTER_JS = re.search(r'CENTER_JS = r"""(.*?)"""', src, re.S).group(1)
LAMANIE = os.environ.get('SMOKE_LAMANIE')

# co człowiek stuka w pierwszej kolejności (od najbardziej oczywistego)
SEL = ['.slot-empty', '.pc-unlock', '.ch-item.unread', '.call-btn.accept', '.camp-go .btn-primary', '.camp-end .btn', '.fp-entry-go', '.fg-draft', '.tel-pop .btn',
       '.fp-rest .btn-primary', '.fight-intro .btn-primary', '.brk-opt.advised', '.opt', '.rp-opt', '.tel-next', '.tel-done',
       '.notice-modal .btn-primary', '.camp-ev-opt', '.camp-opts .choice', '.choice', '.icon-pill.next', '.phone-wait', '.now-link', '.home-now', '.btn-primary']

problems = []
taps = 0
# F15_HUMAN=KATALOG: po każdym stuknięciu klatki co ~50 ms i przebieg przewijania/przesunięć układu
HUMAN = os.environ.get('F15_HUMAN')
PTS = []
TRACE_JS = r"""() => {
  window.__tr = []; window.__ls = [];
  try {
    if (window.__lso) window.__lso.disconnect();
    window.__lso = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push({ v: e.value, src: (e.sources || []).map((s) => s.node && s.node.className ? String(s.node.className).slice(0, 40) : s.node ? s.node.nodeName : '?') }); });
    window.__lso.observe({ type: 'layout-shift', buffered: false });
  } catch (e) {}
  const t0 = performance.now();
  const sc = () => document.getElementById('dev-screen') || document.getElementById('su-screen') || document.scrollingElement;
  window.__fx = false; window.__shell = 0; window.__pts = []; window.__dim = [];
  const dimT0 = performance.now(); const dimF = () => { for (const e of document.querySelectorAll('body *')) { const r = e.getBoundingClientRect(); if (r.width < 300 || r.height < 300) continue; const op = parseFloat(getComputedStyle(e).opacity); if (op < 0.6) { const k = String(e.className).slice(0, 40) + ':' + e.getAnimations().map((a) => a.animationName).join(','); if (!window.__dim.includes(k)) window.__dim.push(k); } } if (performance.now() - dimT0 < 700) requestAnimationFrame(dimF); }; requestAnimationFrame(dimF); window.__drop = []; window.__rm = [];
  try { if (window.__mo2) window.__mo2.disconnect(); window.__mo2 = new MutationObserver((l) => { for (const m of l) for (const n of m.removedNodes) if (n.className && typeof n.className === 'string') window.__rm.push(n.className.slice(0, 30)); }); window.__mo2.observe(document.getElementById('dev-screen') || document.body, { childList: true, subtree: true }); } catch (e) {}
  try { if (window.__mo) window.__mo.disconnect(); window.__mo = new MutationObserver((l) => { for (const m of l) for (const n of m.addedNodes) if (n.classList && (n.classList.contains('fx-flash') || n.classList.contains('fx-burst'))) window.__fx = true; }); window.__mo.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  const tick = () => { for (const d of document.querySelectorAll('.dev, .dev-root, .dev-stage')) window.__shell = Math.max(window.__shell, d.scrollTop); const s = sc(); const m = document.querySelector('.main.app-body, .stage-page, .dev-home'); const key = (s ? s.id || s.className : '') + '|' + (m ? m.className : '') + '|' + (document.querySelector('.rv-scene, .fight-intro, .decision-sheet') ? 'ov' : ''); const prev = window.__tr[window.__tr.length - 1]; if (prev && s && prev[1] > 120 && s.scrollTop === 0 && prev[2] === key) window.__drop = (window.__drop || []).concat([Math.round(performance.now() - t0) + 'ms h=' + s.scrollHeight + ' usunięte: ' + (window.__rm || []).slice(-4).join(', ')]); window.__tr.push([Math.round(performance.now() - t0), s ? Math.round(s.scrollTop) : 0, key]); const ep = document.elementFromPoint(196, 420); window.__pts = (window.__pts || []); window.__pts.push(Math.round(performance.now() - t0) + ':' + (ep ? String(ep.className || ep.tagName).slice(0, 30) + '<' + String(ep.parentElement?.className || '').slice(0, 25) : 'nic')); if (performance.now() - t0 < 1600) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}"""
def lum(path):
    from PIL import Image, ImageStat
    im = Image.open(path).convert('L').resize((98, 213))
    st = ImageStat.Stat(im)
    return st.mean[0], st.stddev[0]
def analyse(step, frames, trace, ls, label, fxhit=False, shell=0):
    out = []
    if shell > 0: out.append(f'obudowa telefonu przewinięta o {shell} px (znika pasek stanu i nagłówek)')
    L = [lum(f) for f in frames]
    if len(L) >= 3:
        a, z = L[0][0], L[-1][0]
        for i, (m, sd) in enumerate(L[1:-1], 1):
            if not fxhit and abs(m - a) > 22 and abs(m - z) > 22 and abs(a - z) < 18:
                out.append(f'miganie: klatka {i} jasność {m:.0f} przy {a:.0f}→{z:.0f}')
                break
        for i, (m, sd) in enumerate(L[1:-1], 1):
            if False and sd < 5 and L[0][1] > 12 and L[-1][1] > 12:  # zrzut w trakcie przeliczania bywa pusty, nagranie wideo nie: sprawdzamy na wideo
                out.append(f'pusta klatka {i} w trakcie przejścia (jednolity kolor {m:.0f}) {PTS[:8]}')
                break
    # liczymy tylko ostatni ciągły odcinek na tym samym ekranie (nowy ekran zaczyna od góry: to nie skok)
    seg = []
    for t in trace:
        if seg and t[2] != seg[-1][2]: seg = []
        seg.append(t)
    ys = [t[1] for t in seg]
    rev = 0; dirn = 0; amp = 0
    for p0, p1 in zip(ys, ys[1:]):
        d = p1 - p0
        if abs(d) < 2: continue
        nd = 1 if d > 0 else -1
        if dirn and nd != dirn: rev += 1
        dirn = nd
        amp = max(amp, abs(d))
    if rev >= 2 and ys and (max(ys) - min(ys)) > 40:
        out.append(f'przewijanie w tę i z powrotem ({rev} zmian kierunku, {min(ys)}–{max(ys)} px)')
    big = [abs(b - a) for a, b in zip(ys, ys[1:])]
    if big and max(big) > 300:
        out.append(f'skok przewinięcia o {max(big)} px w jednej klatce')
    cls = sum(x['v'] for x in ls)
    if cls > 0.08:
        srcs = sorted({s for x in ls for s in x['src']})[:4]
        out.append(f'układ skacze (przesunięcie {cls:.2f}: {", ".join(srcs)})')
    return [f'krok {step} po „{label}”: {o}' for o in out]
with sync_playwright() as p:
    b = p.chromium.launch()
    VIDEO = os.environ.get('F15_VIDEO')
    ctx = b.new_context(viewport={'width': 393, 'height': 852}, reduced_motion='no-preference', is_mobile=True, has_touch=True, device_scale_factor=1, **({'record_video_dir': VIDEO, 'record_video_size': {'width': 393, 'height': 852}} if VIDEO else {}))
    pg = ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL)
    pg.evaluate("() => { localStorage.clear(); localStorage.setItem('spz-mma-seen-version','999'); localStorage.setItem('spz-mma-settings', JSON.stringify({animations:true,cardTheme:'dark',tips:false,tipsSeen:[],tutorialSeen:true,fontScale:100})); }")
    pg.reload(); pg.wait_for_timeout(600)
    SAVE = os.environ.get('F15_SAVE')
    if SAVE:
        pg.evaluate("([d]) => localStorage.setItem('spz-mma-slot-1', d)", [open(SAVE).read()])
        pg.reload(); pg.wait_for_timeout(600)
    pg.get_by_role('button', name='Graj').first.click(); pg.wait_for_timeout(500)
    if SAVE:
        pg.locator('button').filter(has_text=re.compile('Kontynuuj|Zobacz kartę')).first.click(); pg.wait_for_timeout(1200)

    def save():
        raw = pg.evaluate("() => localStorage.getItem('spz-mma-slot-1')")
        try:
            return json.loads(raw) if raw else None
        except Exception:
            return None

    def screen_key():
        # okna nad ekranem (np. oprowadzenie po telefonie) też się liczą: zmiana kroku w oknie to nie „stojący ekran”
        t = pg.evaluate("() => (document.querySelector('#dev-screen') || document.body).innerText + [...document.querySelectorAll('[role=dialog]')].map((d) => d.innerText).join('|')")
        return hashlib.md5(t.encode()).hexdigest(), t

    same = 0
    last_key = None
    seen_closed = {}
    first_fight = None
    SHOTS = os.environ.get('F15_SHOTS')
    if SHOTS: os.makedirs(SHOTS, exist_ok=True)
    for step in range(MAX_STEPS):
        if SHOTS: pg.screenshot(path=f'{SHOTS}/{step:03d}.png')
        s = save()
        if s and any(f.get('result') for f in s.get('history', [])) and first_fight is None and not os.environ.get('F15_SAVE'):
            first_fight = step
            if not os.environ.get('F15_ALL'):
                break
        # formularz nowej kariery: imię i nazwisko, jeśli puste
        for inp in pg.locator('input[type=text]:visible').all():
            try:
                if not inp.input_value():
                    inp.fill('Testowy'); taps += 1
            except Exception:
                pass
        key, txt = screen_key()
        same = same + 1 if key == last_key else 0
        last_key = key
        if same >= 6:
            problems.append(f'krok {step}: ekran stoi po 6 stuknięciach: „{txt[:120]}”')
            break
        for pr in pg.evaluate(CENTER_JS, '.app'):
            problems.append(f'krok {step}: {pr}')
        if pg.locator('#dev-screen, #su-screen').count():
            for pr in pg.evaluate(CHECK_JS):
                # ekran blokady telefonu (prolog) leży nad ekranem aplikacji
                if pr.startswith('pusty') and (step < 5 or pg.locator('.pc-unlock:visible').count()):
                    continue
                problems.append(f'krok {step}: {pr}')
        if LAMANIE:
            for pr in pg.evaluate(LINES_JS, '.app'):
                problems.append(f'łamanie krok {step}: {pr}')
        if SHOTS:
            os.makedirs(SHOTS, exist_ok=True)
            pg.screenshot(path=f'{SHOTS}/{step:03d}.png')
        pg.wait_for_timeout(700)
        if HUMAN:
            os.makedirs(HUMAN, exist_ok=True)
            pg.evaluate(TRACE_JS)
        clicked = None
        dlg = pg.locator('[role=dialog]:visible')
        had_dlg = dlg.count() > 0
        scopes = [dlg.last] if dlg.count() else [pg]
        sels = ['.btn-primary', '.call-btn.accept', '.brk-opt.advised', '.opt', '.choice', '.rp-opt', 'button'] if dlg.count() else SEL + ['button:has-text("Dalej")', 'button:has-text("Zaczynam")', 'button:has-text("Start")']
        for scope in scopes:
            for sel in sels:
                # człowiek nie wychodzi z gry w trakcie i nie kasuje niczego
                l = scope.locator(sel).filter(has_not_text=re.compile('Wyjdź|Usuń|Zacznij od nowa|Sklep'))
                try:
                    if l.count() and l.first.is_visible() and l.first.is_enabled():
                        t = (l.first.inner_text(timeout=500) or '').strip().replace('\n', ' ')[:50]
                        try:
                            l.first.scroll_into_view_if_needed(timeout=800)
                            # pomiar ruchu zaczyna się po przewinięciu przez bota (to nie jest ruch gry)
                            if HUMAN: pg.evaluate(TRACE_JS)
                            l.first.click(timeout=1500)
                        except Exception:
                            # przycisk jeszcze wjeżdża (animacja): człowiek poczeka chwilę i stuknie jeszcze raz
                            pg.wait_for_timeout(1200)
                            try:
                                l.first.click(timeout=2000)
                            except Exception as e:
                                # w punkcie stuknięcia jest sam przycisk (tylko pulsuje): to nie błąd, stukamy
                                mine = l.first.evaluate("(el) => { const r = el.getBoundingClientRect(); const x = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!x && (x === el || el.contains(x)); }")
                                if not mine:
                                    who = l.first.evaluate("(el) => { const r = el.getBoundingClientRect(); const x = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return x ? (x.className || x.tagName) + ' w ' + (x.parentElement?.className || '') : 'nic'; }")
                                    problems.append(f'krok {step}: przycisk „{t}” zasłonięty przez {who} ({str(e).splitlines()[0][:60]})')
                                l.first.dispatch_event('click')
                        clicked = t
                        taps += 1
                        break
                except Exception:
                    pass
            if clicked is not None:
                break
        if os.environ.get('F15_DEBUG'): print(round(pg.evaluate('performance.now()')/1000,1), step, 'klik:', clicked, 'now-link:', pg.locator('.now-link').count(), pg.locator('.now-link').first.is_visible() if pg.locator('.now-link').count() else '-')
        if clicked is None and dlg.count():
            # okno bez przycisków (losowanie, odsłona formy): człowiek stuka w nie albo czeka
            try:
                dlg.last.click(timeout=1500, force=True); clicked = '[okno]'; taps += 1
            except Exception:
                pg.wait_for_timeout(1500)
        elif clicked is None and pg.locator('[class*=typing]:visible').count():
            # ktoś pisze: człowiek poczeka, a nie wyjdzie z rozmowy
            pg.wait_for_timeout(1500)
        elif clicked is None:
            # nic do stuknięcia: wróć na ekran główny telefonu
            if pg.locator('.dev-homebar').count():
                pg.locator('.dev-homebar').first.dispatch_event('click'); taps += 1
        else:
            # karta, którą zamknąłeś przyciskiem „OK”, nie może wrócić na ten sam ekran
            if clicked in ('OK', 'Zamknij') and not had_dlg:
                seen_closed[txt[:200]] = step
        if HUMAN:
            import time as _t
            fr = []
            pre = f'{HUMAN}/{step:03d}_00.png'
            t0 = _t.time()
            for i in range(14):
                f = f'{HUMAN}/{step:03d}_{i + 1:02d}.png'
                pg.screenshot(path=f, type='png', scale='css')
                fr.append(f)
                if _t.time() - t0 > 1.3: break
            pg.wait_for_timeout(200)
            last = f'{HUMAN}/{step:03d}_99.png'; pg.screenshot(path=last); fr.append(last)
            if SHOTS and os.path.exists(f'{SHOTS}/{step:03d}.png'): fr.insert(0, f'{SHOTS}/{step:03d}.png')
            tr = pg.evaluate('window.__tr || []'); lsv = pg.evaluate('window.__ls || []'); PTS[:] = pg.evaluate('window.__pts || []')
            found = analyse(step, fr, tr, lsv, clicked or '-', pg.evaluate('!!window.__fx'), pg.evaluate('window.__shell || 0'))
            for dd in pg.evaluate('window.__dim || []'):
                if not re.search(r'fx-ghost|tel-pop|roul|veil|rv-|fight-intro|hall-bg|offer-modal|lock', dd): found.append(f'krok {step} po „{clicked}”: przygaszony ekran: {dd}')
            for dd in pg.evaluate('window.__drop || []'):
                if re.search(r'fp-page|fp-rail|fight-list|season-step|offer-modal|pc-root|\bkn\b|intro-notes', dd): continue  # nowa strona: od góry to dobrze
                found.append(f'krok {step} po „{clicked}”: ekran spadł na górę ({dd})')
            problems.extend(found)
            if not found:
                for f in fr:
                    if f.startswith(HUMAN): os.remove(f)
        else:
            pg.wait_for_timeout(900)
        key2, txt2 = screen_key()
        for t0, st in seen_closed.items():
            if st < step and t0 and t0 == txt2[:200]:
                problems.append(f'krok {step}: zamknięta karta wróciła: „{t0[:80]}”')
    for e in errs:
        problems.append(f'błąd JS: {e[:160]}')
    if first_fight is None:
        problems.append(f'nie doszło do pierwszej walki w {MAX_STEPS} krokach')
    ctx.close()
    b.close()

uniq = list(dict.fromkeys(problems))
print(f'Stuknięć do pierwszej walki: {taps}' if first_fight is not None else 'Pierwszej walki nie było')
for pr in uniq[:60]:
    print(' -', pr)
print('OK' if not uniq else f'{len(uniq)} problemów')
sys.exit(1 if uniq else 0)
