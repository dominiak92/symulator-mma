// Polska typografia na ekranie: twarde spacje tam, gdzie łamanie wiersza wygląda niechlujnie.
// - jednoliterowe spójniki i przyimki (w, z, i, a, o, u) nie zostają na końcu linii,
// - liczba trzyma się jednostki („16 lat”, „3,8 tys. zł”, „R2 3:12”),
// - kropka środkowa „·” nie zaczyna nowej linii.

const NB = '\u00A0';

export function polishTypography(text: string): string {
  if (text.length < 3 || !/\s/.test(text)) return text;
  let t = text;
  // jednoliterowe słowa (dwa razy, bo mogą stać obok siebie: „i w domu”)
  for (let i = 0; i < 2; i++) t = t.replace(/(^|[\s(„"])([aiouwzAIOUWZ]) /g, `$1$2${NB}`);
  // krótkie słowa, które też źle wyglądają na końcu wiersza
  t = t.replace(/(^|[\s(„"])(ze|we|do|na|od|po|za|że|by|nie) (?=\S)/g, (_m, a, w) => `${a}${w}${NB}`);
  // liczba + jednostka / słowo
  t = t.replace(/(\d) (?=\S)/g, `$1${NB}`);
  t = t.replace(/(tys\.|mln) (zł)/g, `$1${NB}$2`);
  // „ · ” — separator zostaje na końcu linii, nie na początku następnej
  t = t.replace(/ ·/g, `${NB}·`);
  // myślnik nie zaczyna wiersza
  t = t.replace(/ ([–—])/g, `${NB}$1`);
  // krótkie ostatnie słowo zdania w dłuższym tekście nie zostaje samo w linii (sierotka)
  if (t.length > 40) t = t.replace(/ (\S{1,4}[.!?…]?)$/, `${NB}$1`);
  return t;
}

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'TITLE']);

function fixNode(n: Node) {
  if (n.nodeType === Node.TEXT_NODE) {
    const p = n.parentElement;
    if (!p || SKIP.has(p.tagName) || p.isContentEditable) return;
    const v = n.nodeValue ?? '';
    const f = polishTypography(v);
    if (f !== v) n.nodeValue = f;
    return;
  }
  if (n.nodeType === Node.ELEMENT_NODE && SKIP.has((n as Element).tagName)) return;
  for (let c = n.firstChild; c; c = c.nextSibling) fixNode(c);
}

/** Pilnuje typografii w całym drzewie aplikacji, także po każdej zmianie renderowanej przez Reacta. */
export function installTypography(root: HTMLElement) {
  fixNode(root);
  const obs = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') fixNode(m.target);
      else m.addedNodes.forEach(fixNode);
    }
  });
  obs.observe(root, { subtree: true, childList: true, characterData: true });
  return () => obs.disconnect();
}
