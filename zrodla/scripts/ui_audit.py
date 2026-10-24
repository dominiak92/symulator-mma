"""Wspólny audyt UI: wywoływany na każdym kroku botów (pro_tour, start_tour, app_shots).
Szuka: tekstów undefined/NaN/null, pustych przycisków i opcji, nieczytelnego tekstu (kontrast),
treści ucinanej bez przewijania, rzeczy wystających poza ekran. Każdy nowy problem: wpis + zrzut."""
import os, json

JS = r'''() => {
  const out = [];
  const W = innerWidth, H = innerHeight;
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
    if (el.closest('[aria-hidden=true]')) return false; return true; };
  const label = (el) => { const c = (typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '').split(' ').filter(Boolean).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (c ? '.' + c : ''); };
  const path = (el) => { const a = []; let e = el; for (let i = 0; e && i < 3; i++, e = e.parentElement) a.unshift(label(e)); const app = el.closest('.app-body'); return (app ? '[' + app.className + '] ' : '') + a.join(' > '); };
  // 1. dziury w tekście
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) {
    const t = n.textContent; if (!t || !t.trim()) continue;
    const m = t.match(/\bundefined\b|\bNaN\b|\bnull\b|\[object Object\]|\$\{|Infinity/);
    const glue = t.match(/[a-ząćęłńóśźż0-9][.!?][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]|[a-ząćęłńóśźż],[a-ząćęłńóśźżA-Z]|\s[,.;:](?=\s|$)|  +\S/);
    if (glue && n.parentElement && vis(n.parentElement)) out.push({ k: 'źle złożony tekst', m: `"${glue[0]}" w: ${t.trim().slice(0, 70)}`, at: path(n.parentElement) });
    if (m && n.parentElement && vis(n.parentElement)) out.push({ k: 'tekst', m: `"${m[0]}" w: ${t.trim().slice(0, 80)}`, at: path(n.parentElement) });
  }
  // 2. puste przyciski i opcje
  for (const el of document.querySelectorAll('button, [role=button], .choice, .rp-opt, .press-opt, .train-opt, .camp-opts > *, .opt, a.btn')) {
    if (!vis(el)) continue;
    const txt = (el.innerText || '').trim();
    const hasPic = el.querySelector('svg, img, .ico, [class*=icon]');
    if (!txt && !hasPic && !el.getAttribute('aria-label') && !el.title) out.push({ k: 'pusty przycisk', m: label(el), at: path(el) });
    if ((el.matches('.choice, .rp-opt, .press-opt, .train-opt')) && txt.length < 2) out.push({ k: 'pusta opcja', m: label(el) + ' "' + txt + '"', at: path(el) });
  }
  // 2b. linia skutków z samą ikonką ✓/✗ i niczym więcej
  for (const el of document.querySelectorAll('.rp-fx, .chips')) {
    if (!vis(el)) continue;
    const txt = (el.innerText || '').replace(/[✓✗]/g, '').trim();
    if (!txt) out.push({ k: 'pusta linia skutków', m: label(el) + ' w "' + ((el.closest('.choice, .rp-opt') || el).innerText || '').trim().slice(0, 40) + '"', at: path(el) });
  }
  // 3. kontrast: kolor tekstu vs. pierwsze nieprzezroczyste tło w górę drzewa
  const rgb = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        if (/url\(/.test(cs.backgroundImage)) return null; // zdjęcie: nie oceniamy
        const cols = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(rgb).filter((c) => c && c.a > 0.6);
        if (cols.length) return { r: cols.reduce((s, c) => s + c.r, 0) / cols.length, g: cols.reduce((s, c) => s + c.g, 0) / cols.length, b: cols.reduce((s, c) => s + c.b, 0) / cols.length, a: 1 };
      }
      const c = rgb(cs.backgroundColor); if (c && c.a > 0.85) return c; }
    return rgb(getComputedStyle(document.body).backgroundColor) || { r: 0, g: 0, b: 0, a: 1 }; };
  const seenC = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length && ![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
    const own = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join('').trim();
    if (own.length < 2 || !vis(el)) continue;
    const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) continue;
    const cs = getComputedStyle(el); const fg = rgb(cs.color); if (!fg || fg.a < 0.3) continue;
    if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text' || /transparent/.test(cs.webkitTextFillColor || '')) continue;
    const bg = bgOf(el); if (!bg) continue;
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (ratio < 2.2) { const key = label(el); if (seenC.has(key)) continue; seenC.add(key);
      out.push({ k: 'nieczytelny tekst', m: `${label(el)} ${cs.color} na rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}) ${ratio.toFixed(1)}:1 "${own.slice(0, 40)}"`, at: path(el) }); }
  }
  // 4. ucięta treść: kontener z overflow hidden/clip, treść dłuższa, bez przewijania
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue; const cs = getComputedStyle(el);
    if (!/(hidden|clip)/.test(cs.overflowY)) continue;
    if (el.scrollHeight <= el.clientHeight + 6 || el.clientHeight < 60) continue;
    // czy coś interaktywnego albo tekst siedzi pod dolną krawędzią
    const box = el.getBoundingClientRect();
    const scrollsInside = (c) => { for (let e = c.parentElement; e && e !== el; e = e.parentElement) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 2) return true; } return false; };
    const lost = [...el.querySelectorAll('button, .choice, p, li, .btn')].filter((c) => { const r = c.getBoundingClientRect(); return r.height > 0 && r.top > box.bottom - 4 && vis(c) && !scrollsInside(c); });
    if (lost.length) out.push({ k: 'ucięte bez przewijania', m: `${label(el)} (${el.clientHeight}/${el.scrollHeight}px, ukryte: ${lost.length}, np. "${(lost[0].innerText || '').trim().slice(0, 40)}")`, at: path(el) });
  }
  // 5. przyciski nieosiągalne: poza ekranem, a nic nad nimi się nie przewija
  for (const el of document.querySelectorAll('button, .choice, .btn')) {
    if (!vis(el)) continue; const r = el.getBoundingClientRect();
    if (r.top < H - 2) continue;
    let ok = document.scrollingElement.scrollHeight > H + 2 && getComputedStyle(document.body).overflowY !== 'hidden';
    for (let e = el.parentElement; e && !ok; e = e.parentElement) { const cs = getComputedStyle(e); if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 2) ok = true; }
    if (!ok) out.push({ k: 'przycisk poza ekranem', m: `${label(el)} "${(el.innerText || '').trim().slice(0, 30)}" top=${Math.round(r.top)}`, at: path(el) });
  }
  // 7. przewijanie palcem: przewijany kontener musi być na wierzchu i bez touch-action: none
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (!/(auto|scroll)/.test(cs.overflowY) || el.scrollHeight <= el.clientHeight + 20 || !vis(el)) continue;
    const r = el.getBoundingClientRect();
    const top = Math.max(r.top, 0), bot = Math.min(r.bottom, H); if (bot - top < 40) continue;
    const pts = [[r.left + r.width / 2, top + (bot - top) * 0.3], [r.left + r.width / 2, top + (bot - top) * 0.7]];
    let covered = 0;
    for (const [x, y] of pts) { const hit = document.elementFromPoint(x, y); if (hit && !el.contains(hit) && !hit.contains(el)) covered++; }
    const modal = (h) => { for (let e = h; e && e !== document.body; e = e.parentElement) { if (e.contains(el)) return false; const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'absolute') return true; } return false; };
    if (covered === pts.length && modal(document.elementFromPoint(pts[0][0], pts[0][1]))) covered = 0;
    if (covered === pts.length) { const hit = document.elementFromPoint(pts[0][0], pts[0][1]); out.push({ k: 'scroll zasłonięty', m: `${label(el)} pod ${hit ? label(hit) : '?'}`, at: path(el) }); }
    for (let e = el; e; e = e.parentElement) if (getComputedStyle(e).touchAction === 'none') { out.push({ k: 'scroll zablokowany (touch-action)', m: label(el) + ' przez ' + label(e), at: path(el) }); break; }
  }
  // 8. słowo rozdzielone między wiersze („Wszechstronn/y”)
  { const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let tn, cnt = 0;
    while ((tn = tw.nextNode()) && cnt < 4000) { const s = tn.textContent; if (!s || s.trim().length < 4) continue;
      const pe = tn.parentElement; if (!pe || !vis(pe) || pe.closest('svg')) continue; const pr = pe.getBoundingClientRect(); if (pr.bottom < 0 || pr.top > H) continue;
      const re = /[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{4,}/g; let m;
      while ((m = re.exec(s)) && cnt < 4000) { cnt++;
        const rg = document.createRange(); rg.setStart(tn, m.index); rg.setEnd(tn, m.index + m[0].length);
        const rs = [...rg.getClientRects()].filter((r) => r.width > 0.5);
        if (rs.length > 1 && Math.abs(rs[0].top - rs[rs.length - 1].top) > 2) out.push({ k: 'słowo rozbite', m: `"${m[0]}" w ${label(pe)}`, at: path(pe) }); } } }
  // 9. tekst ucięty w poziomie (wychodzi poza przycinającego przodka)
  for (const el of document.querySelectorAll('h1, h2, h3, b, strong, span, p, small, button, a, li')) {
    if (!vis(el)) continue; const own = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()); if (!own) continue;
    if (el.closest('svg')) continue;
    { let tf = false; for (let e = el; e && e !== document.body; e = e.parentElement) if (getComputedStyle(e).transform !== 'none') { tf = true; break; } if (tf) continue; }
    const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) continue;
    let ell = false; for (let e = el; e && e !== document.body; e = e.parentElement) { if (getComputedStyle(e).textOverflow === 'ellipsis') { ell = true; break; } }
    const rg = document.createRange(); rg.selectNodeContents(el); const tr = rg.getBoundingClientRect();
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e);
      if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) { if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 1 && e !== document.getElementById('dev-screen')) break; if (ell) break; const pr = e.getBoundingClientRect(); if (tr.right > pr.right + 2 || tr.left < pr.left - 2) out.push({ k: 'tekst ucięty z boku', m: `${label(el)} "${(el.innerText || '').trim().slice(0, 30)}" poza ${label(e)}`, at: path(el) }); break; } }
    const cs = getComputedStyle(el); if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1 && el.closest('button, .choice, h2, h3, .rp-desc, .decision-text')) out.push({ k: 'tekst ucięty wielokropkiem', m: `${label(el)} "${(el.innerText || '').trim().slice(0, 30)}"`, at: path(el) });
  }
  // 10. pasek z przyciskiem (sticky) musi być na samym końcu treści, inaczej coś zostaje pod nim
  for (const bar of document.querySelectorAll('.cta-bar')) {
    if (!vis(bar) || getComputedStyle(bar).position !== 'sticky') continue;
    let sc = bar.parentElement; while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement; if (!sc) continue;
    const br = bar.getBoundingClientRect();
    const after = [...sc.querySelectorAll('*')].filter((e) => !bar.contains(e) && (bar.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) && vis(e) && e.children.length === 0 && (e.innerText || '').trim().length > 2);
    if (after.length) out.push({ k: 'treść za paskiem przycisku', m: `${label(bar)} a za nim "${(after[0].innerText || '').trim().slice(0, 40)}"`, at: path(bar) });
  }
  // 11. element wychodzi poza ekran telefonu w prawo (ukryty przez overflow ekranu, więc ucięty)
  { const scr = document.getElementById('dev-screen'); if (scr) { const R = scr.getBoundingClientRect().right;
    for (const e of scr.querySelectorAll('*')) { if (!vis(e) || e.closest('svg')) continue; const r = e.getBoundingClientRect(); if (r.right <= R + 1 || r.width < 8) continue;
      let hs = false; for (let a = e.parentElement; a && a !== scr; a = a.parentElement) { const s = getComputedStyle(a); if (/(auto|scroll)/.test(s.overflowX) || ((/(hidden|clip)/.test(s.overflowX)) && a.getBoundingClientRect().right <= R + 1)) { hs = true; break; } if (s.transform !== 'none') { hs = true; break; } }
      if (hs) continue; const p = e.parentElement.getBoundingClientRect(); if (p.right > R + 1 && e.parentElement !== scr) continue;
      out.push({ k: 'wychodzi poza ekran', m: `${label(e)} o ${Math.round(r.right - R)}px`, at: path(e) }); } } }
  // 12. nierówne marginesy: karta/panel bliżej jednej krawędzi ekranu niż drugiej (tylko elementy samotne w poziomie)
  { const dev = document.querySelector('.dev'); if (dev) { const D = dev.getBoundingClientRect();
    for (const e of document.querySelectorAll('#dev-screen *, .dev-root [role=dialog] *')) {
      if (!vis(e) || e.closest('svg, [aria-hidden=true]')) continue;
      // dymki rozmów są z założenia przy jednej krawędzi
      if (e.closest('.tc-in, .tc-out, .tel-bubble, .sm-msg, .fp-chat-in, .sz-bubble, .camp-coach, .tc-doc, .ofr-me, .goal-pill, .pc-out, .pc-msg, .pc-bubble, .rp-mine, .coach, .bubble, [class*=bubble], [class*=chat-]')) continue;
      const cs = getComputedStyle(e); if (cs.position === 'absolute' || cs.position === 'fixed' || cs.transform !== 'none') continue;
      const boxy = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || parseFloat(cs.borderLeftWidth) > 0) && parseFloat(cs.borderRadius) > 0;
      if (!boxy) continue;
      const r = e.getBoundingClientRect(); if (r.width < D.width * 0.6 || r.height < 30) continue;
      const pe = e.parentElement; if (!pe) continue; const ps = getComputedStyle(pe);
      // element w wierszu obok innych: asymetria jest zamierzona
      if ((ps.display.includes('flex') && !ps.flexDirection.startsWith('column')) || (ps.display.includes('grid') && ps.gridTemplateColumns.split(' ').length > 1)) continue;
      const lg = r.left - D.left, rg = D.right - r.right;
      if (lg < 0 || rg < 0) continue;
      if (Math.abs(lg - rg) > 8) out.push({ k: 'nierówne marginesy', m: `${label(e)} lewy ${Math.round(lg)}px, prawy ${Math.round(rg)}px`, at: path(e) });
    } } }
  // 13. za mały tekst (poniżej 12 px przy normalnym rozmiarze czcionki w ustawieniach)
  { let n = 0; const walk = document.createTreeWalker(document.querySelector('.dev') || document.body, NodeFilter.SHOW_TEXT);
    for (let t; (t = walk.nextNode()) && n < 3;) { const el = t.parentElement; const txt = (t.textContent || '').trim(); if (!el || txt.length < 2 || !vis(el) || el.closest('svg, [aria-hidden=true], .dev-status')) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 11.5) { n++; out.push({ k: 'za mały tekst', m: `${label(el)} ${fs.toFixed(1)}px "${txt.slice(0, 30)}"`, at: path(el) }); } } }
  // 14. przycisk przyklejony do dołu zasłania treść, gdy przewinięto do końca
  { const sc = document.getElementById('dev-screen'); if (sc && sc.scrollHeight - sc.scrollTop - sc.clientHeight < 4) {
    for (const bar of sc.querySelectorAll('.cta-bar, .pc-next, .sticky-cta')) { const bs = getComputedStyle(bar); if (!vis(bar) || (bs.position !== 'sticky' && bs.position !== 'fixed')) continue;
      const br = bar.getBoundingClientRect();
      const hid = [...sc.querySelectorAll('p, li, .kv, .choice, h3, b, span')].filter((e) => !bar.contains(e) && vis(e) && e.children.length === 0 && (e.innerText || '').trim().length > 2 && (() => { const r = e.getBoundingClientRect(); return r.bottom > br.top + 4 && r.top < br.bottom; })());
      if (hid.length) out.push({ k: 'przycisk zasłania treść', m: `${label(bar)} na "${(hid[0].innerText || '').trim().slice(0, 40)}"`, at: path(bar) }); } } }
  // 6. poziome wystawanie
  if (document.documentElement.scrollWidth > W + 1) out.push({ k: 'strona za szeroka', m: String(document.documentElement.scrollWidth), at: 'html' });
  const seen = new Set(); return out.filter((o) => { const k = o.k + o.m; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
}'''


SCROLLERS = r'''() => { const out = [];
  for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el);
    if (!/(auto|scroll)/.test(cs.overflowY) || el.scrollHeight <= el.clientHeight + 40) continue;
    const r = el.getBoundingClientRect(); if (r.width < 40 || r.height < 80) continue;
    const top = Math.max(r.top, 0), bot = Math.min(r.bottom, innerHeight); if (bot - top < 80) continue;
    const c = (typeof el.className === 'string' ? el.className : '').split(' ').filter(Boolean).slice(0, 2).join('.');
    el.dataset.auScroll = String(out.length);
    out.push({ i: out.length, key: el.tagName.toLowerCase() + '.' + c, x: r.left + r.width / 2, y1: top + (bot - top) * 0.75, y2: top + (bot - top) * 0.25, st: el.scrollTop, max: el.scrollHeight - el.clientHeight }); }
  return out; }'''


REACH_LIST = r'''() => {
  const sel = 'button.btn-primary, .btn-primary, .choice, .rp-opt, .tel-done, .tel-next, .fi-go, .tc-sheet-send, .tc-start, .tc-open-plan, .pc-unlock, .call-btn, .camp-end .btn, .notice-modal .btn, .contract-actions .btn, .ofr-actions .btn, .decision-text, .sm-sit p, .tel-bubble p, .rp-desc, .ev-text, .notice-modal p';
  const out = []; let n = 0;
  // otwarte okna (plakat, arkusz, kontrakt): elementy pod nimi pomijamy, bo gracz najpierw zamyka okno
  const modals = [...document.querySelectorAll('body *')].filter((e) => { const s = getComputedStyle(e); if (s.position !== 'fixed' && s.position !== 'absolute') return false;
    const r = e.getBoundingClientRect(); if (r.width * r.height < innerWidth * innerHeight * 0.55) return false; if (s.pointerEvents === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    return s.position === 'fixed' || +s.zIndex >= 20; });
  const label = (el) => { const c = (typeof el.className === 'string' ? el.className : '').split(' ').filter(Boolean).slice(0, 2).join('.'); return el.tagName.toLowerCase() + (c ? '.' + c : ''); };
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0 || el.closest('[aria-hidden=true], [inert]')) continue;
    if (el.disabled) continue;
    if (modals.some((m) => !m.contains(el) && !el.contains(m) && +getComputedStyle(m).zIndex >= 20)) continue;
    let hidden = false; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.15) { hidden = true; break; } } if (hidden) continue;
    // w trakcie animacji wejścia (np. przycisk pojawia się po rozstrzygnięciu walki) oceniamy dopiero po jej końcu
    if (document.getAnimations().some((a) => a.playState === 'running' || a.playState === 'pending' ? (a.effect && a.effect.target && a.effect.target.contains && a.effect.target.contains(el)) : false)) continue;
    el.dataset.auT = String(n);
    const btn = !/^(p|div|span)$/.test(el.tagName.toLowerCase()) || el.matches('.choice, .rp-opt, .btn-primary, .btn');
    out.push({ i: n++, key: label(el) + '|' + (el.innerText || '').trim().slice(0, 24), txt: (el.innerText || '').trim().slice(0, 40), btn, ok: window.__auOk(el), at: label(el.parentElement || el) + ' > ' + label(el) });
  }
  return out; }'''
SAVE_SCROLL = r'''() => { const a = []; document.querySelectorAll('*').forEach((e, k) => { if (e.scrollTop) a.push([k, e.scrollTop]); }); return a; }'''
RESTORE_SCROLL = r'''(a) => { const all = document.querySelectorAll('*'); for (const e of all) if (e.scrollTop) e.scrollTop = 0; for (const [k, v] of a) if (all[k]) all[k].scrollTop = v; }'''
REACH_STATE = r'''(i) => {
  const el = document.querySelector(`[data-au-t="${i}"]`); if (!el) return null;
  const r = el.getBoundingClientRect();
  if (window.__auOk(el)) return { ok: true };
  // najbliższy przewijany przodek (albo dokument)
  let sc = null; for (let e = el.parentElement; e; e = e.parentElement) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 1) { sc = e; break; } }
  const box = sc ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
  const top = Math.max(box.top, 0), bot = Math.min(box.bottom, innerHeight);
  const dir = r.top < top ? -1 : 1;
  // powód do raportu
  const cx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1), cy = Math.min(Math.max(r.top + Math.min(r.height, 40) / 2, 1), innerHeight - 1);
  const h = document.elementFromPoint(cx, cy);
  const lab = (e) => e ? e.tagName.toLowerCase() + '.' + ((typeof e.className === 'string' ? e.className : '').split(' ').filter(Boolean).slice(0, 2).join('.')) : '?';
  let why;
  if (r.bottom > innerHeight || r.top < 0) why = `poza ekranem (top ${Math.round(r.top)}, ekran ${innerHeight})` + (sc ? `, przewijanie ${lab(sc)} ${Math.round(sc.scrollTop)}/${sc.scrollHeight - sc.clientHeight}` : ', nic się nie przewija');
  else if (r.bottom > bot + 1 || r.top < top - 1) why = `ucięte przez ${sc ? lab(sc) : 'kontener'}`;
  else { let ov = false; for (let e = h; e && e !== document.body; e = e.parentElement) { if (e.contains(el)) break; const p = getComputedStyle(e).position; if (p === 'fixed' || (p === 'absolute' && +getComputedStyle(e).zIndex > 0)) { ov = true; break; } }
    if (ov) return { ok: true, overlay: true }; why = `zasłonięte przez ${lab(h)}`; }
  const need = dir > 0 ? (r.top + Math.min(r.height, 48)) - bot + 12 : top - r.top + 12;
  const step = Math.max(40, Math.min(Math.abs(need), (bot - top) * 0.7));
  const under = document.elementFromPoint((box.left + box.right) / 2, (top + bot) / 2);
  return { ok: false, dir, step, sx: (box.left + box.right) / 2, sy: (top + bot) / 2, why, st: sc ? Math.round(sc.scrollTop) : -1, under: lab(under) + (sc && under && sc.contains(under) ? '' : ' (POZA)') };
}'''


INSTALL_OK = r'''() => { window.__auOk = (el) => { const r = el.getBoundingClientRect(); const H = innerHeight, W = innerWidth;
  const need = Math.min(r.height, 48);
  const cx = r.left + r.width / 2; if (r.top < 0 || r.top + need > H || cx < 0 || cx > W) return false;
  // przycięcie przez przodków z overflow
  for (let e = el.parentElement; e; e = e.parentElement) { const s = getComputedStyle(e); if (/(auto|scroll|hidden|clip)/.test(s.overflowY)) { const b = e.getBoundingClientRect(); if (r.top < b.top - 1 || r.top + need > b.bottom + 1) return false; } }
  // nic nie zasłania: sprawdzamy kilka punktów górnego pasa elementu
  const ys = [r.top + Math.min(need, r.height) / 2]; const xs = [r.left + r.width * 0.25, r.left + r.width / 2, r.left + r.width * 0.75];
  let hits = 0; for (const x of xs) for (const y of ys) { const h = document.elementFromPoint(x, y); if (h && (el.contains(h) || h.contains(el))) hits++; }
  return hits >= 2; }; }'''

class Auditor:
    def __init__(self, out_dir, tag=''):
        self.out = out_dir
        self.tag = tag
        self.found = {}
        self.swiped = set()
        os.makedirs(out_dir, exist_ok=True)

    def reach(self, pg, where):
        """Jak gracz: do każdego przycisku i ważnego tekstu przewija kółkiem (palcem) i sprawdza,
        czy da się go zobaczyć w całości i kliknąć (nic go nie zasłania)."""
        try:
            items = pg.evaluate(REACH_LIST)
        except Exception:
            return
        todo = [it for it in items if not it['ok'] and it['key'] not in self.swiped]
        if not todo: return
        try:
            saved = pg.evaluate(SAVE_SCROLL)
        except Exception:
            return
        for it in todo[:12]:
            self.swiped.add(it['key'])
            ok = False
            last = None
            trace = []
            for _ in range(30):
                try:
                    st = pg.evaluate(REACH_STATE, it['i'])
                except Exception:
                    break
                if not st: break
                last = st
                if st['ok']: ok = True; break
                trace.append(st.get('st'))
                pg.mouse.move(st['sx'], st['sy'])
                pg.mouse.wheel(0, st['step'] if st['dir'] > 0 else -st['step'])
                pg.wait_for_timeout(120)
            if not ok and last:
                self._add(pg, {'k': 'nieosiągalne' if it['btn'] else 'tekst niewidoczny', 'm': f"{it['key']} \"{it['txt']}\" — {last['why']} [przewijanie: {trace[:3]}…{trace[-3:]}, pod kursorem {last.get('under')}]", 'at': it['at']}, where)
            try: pg.evaluate(RESTORE_SCROLL, saved)
            except Exception: pass

    def _add(self, pg, i, where):
        key = i['k'] + '|' + i['m'][:70]
        if key in self.found:
            self.found[key]['n'] += 1; return
        shot = f"{self.out}/{self.tag}{len(self.found):03d}.png"
        try: pg.screenshot(path=shot)
        except Exception: shot = ''
        self.found[key] = {**i, 'where': where, 'shot': shot, 'n': 1}
        print(f"[UI] {i['k']}: {i['m']}  ({where}; {i['at']})", flush=True)

    def check(self, pg, where):
        try: pg.evaluate(INSTALL_OK)
        except Exception: return
        self.reach(pg, where)
        try:
            issues = pg.evaluate(JS)
        except Exception as e:  # strona w trakcie nawigacji
            return
        fresh = [i for i in issues if (i['k'] + '|' + i['m'][:70]) not in self.found]
        if fresh:
            # potwierdzenie po animacjach: zostają tylko problemy, które nie znikają same
            pg.wait_for_timeout(900)
            try:
                again = {(j['k'] + '|' + j['m'][:70]) for j in pg.evaluate(JS)}
            except Exception:
                return
            issues = [i for i in issues if (i['k'] + '|' + i['m'][:70]) in again]
        for i in issues:
            key = i['k'] + '|' + i['m'][:70]
            if key in self.found:
                self.found[key]['n'] += 1
                continue
            shot = f"{self.out}/{self.tag}{len(self.found):03d}.png"
            try:
                pg.screenshot(path=shot)
            except Exception:
                shot = ''
            self.found[key] = {**i, 'where': where, 'shot': shot, 'n': 1}
            print(f"[UI] {i['k']}: {i['m']}  ({where}; {i['at']})", flush=True)

    def save(self, name='audit.json'):
        with open(f"{self.out}/{self.tag}{name}", 'w') as f:
            json.dump(list(self.found.values()), f, ensure_ascii=False, indent=1)
        print(f"[UI] razem problemów: {len(self.found)}")
