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

# co człowiek stuka w pierwszej kolejności (od najbardziej oczywistego)
SEL = ['.pc-unlock', '.ch-item.unread', '.call-btn.accept', '.camp-go .btn-primary', '.camp-end .btn', '.fp-entry-go', '.fg-draft', '.tel-pop .btn',
       '.fp-rest .btn-primary', '.fight-intro .btn-primary', '.brk-opt.advised', '.opt', '.rp-opt', '.tel-next', '.tel-done',
       '.notice-modal .btn-primary', '.camp-ev-opt', '.camp-opts .choice', '.choice', '.icon-pill.next', '.phone-wait', '.now-link', '.home-now', '.btn-primary']

problems = []
taps = 0
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
    pg.get_by_role('button', name='Graj').first.click(); pg.wait_for_timeout(500)

    def save():
        raw = pg.evaluate("() => localStorage.getItem('spz-mma-slot-1')")
        try:
            return json.loads(raw) if raw else None
        except Exception:
            return None

    def screen_key():
        t = pg.evaluate("() => (document.querySelector('#dev-screen') || document.body).innerText")
        return hashlib.md5(t.encode()).hexdigest(), t

    same = 0
    last_key = None
    seen_closed = {}
    first_fight = None
    for step in range(MAX_STEPS):
        s = save()
        if s and any(f.get('result') for f in s.get('history', [])):
            first_fight = step
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
        if pg.locator('#dev-screen').count():
            for pr in pg.evaluate(CHECK_JS):
                # ekran blokady telefonu (prolog) leży nad ekranem aplikacji
                if pr.startswith('pusty') and (step < 5 or pg.locator('.pc-unlock:visible').count()):
                    continue
                problems.append(f'krok {step}: {pr}')
        if SHOTS:
            os.makedirs(SHOTS, exist_ok=True)
            pg.screenshot(path=f'{SHOTS}/{step:03d}.png')
        pg.wait_for_timeout(700)
        clicked = None
        dlg = pg.locator('[role=dialog]:visible')
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
                            l.first.click(timeout=1500)
                        except Exception as e:
                            problems.append(f'krok {step}: przycisk „{t}” zasłonięty ({str(e).splitlines()[0][:60]})')
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
            if clicked in ('OK', 'Zamknij'):
                seen_closed[txt[:200]] = step
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
