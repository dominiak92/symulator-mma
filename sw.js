/* MMA Miszcz: service worker, żeby grę dało się zainstalować na telefonie i uruchomić z ekranu głównego także bez sieci.
 * Strona startowa: zawsze najnowsza z sieci, bez sieci ostatnio otwarta.
 * Pliki gry (assets/): mają skrót w nazwie, więc raz pobrany plik się nie zmienia. Trzymamy je po pierwszym użyciu,
 * żeby zwykła kariera ruszyła bez sieci (wcześniej zapamiętana strona startowa bez plików dawała biały ekran).
 * Najwyżej ASSET_MAX plików: najstarsze wypadają, żeby kolejne wersje nie zapychały telefonu. */
const CACHE = 'mma-miszcz-start-v1';
const ASSETS = 'mma-miszcz-assets-v1';
const ASSET_MAX = 260;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

async function trim() {
  const c = await caches.open(ASSETS);
  const keys = await c.keys();
  for (const k of keys.slice(0, Math.max(0, keys.length - ASSET_MAX))) await c.delete(k);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return r;
        })
        .catch(() => caches.match(req).then((r) => r || Response.error())),
    );
    return;
  }
  const url = new URL(req.url);
  if (url.origin !== location.origin || !/\/assets\/[^/]+-[A-Za-z0-9_-]{8}\.[a-z0-9]+$/.test(url.pathname)) return;
  e.respondWith(
    caches.open(ASSETS).then((c) =>
      c.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((r) => {
            // tylko prawdziwy plik: brakujący Cloudflare oddaje jako stronę HTML z kodem 200 (tego nie zapamiętujemy)
            const type = r.headers.get('content-type') || '';
            if (r.ok && !type.includes('text/html')) {
              c.put(req, r.clone()).then(trim).catch(() => {});
            }
            return r;
          }),
      ),
    ),
  );
});
