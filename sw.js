/* MMA Miszcz: service worker, żeby grę dało się zainstalować na telefonie i uruchomić z ekranu głównego także bez sieci.
 * Strona startowa: zawsze najnowsza z sieci, bez sieci ostatnio otwarta.
 * Pliki gry (assets/): mają skrót w nazwie, więc raz pobrany plik się nie zmienia. Trzymamy je po pierwszym użyciu,
 * żeby zwykła kariera ruszyła bez sieci (wcześniej zapamiętana strona startowa bez plików dawała biały ekran).
 * Najwyżej ASSET_MAX plików: wypadają najdawniej używane, najpierw obrazki (kod gry i style zostają najdłużej),
 * bo przy 260 plikach i ponad 600 obrazkach na wersję wypadały pliki startowe i start bez sieci przestawał działać
 * u najbardziej zaangażowanych graczy (przegląd 1.11). */
const CACHE = 'mma-miszcz-start-v1';
const ASSETS = 'mma-miszcz-assets-v1';
const ASSET_MAX = 700;
const CODE_MAX = 160;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

const isCode = (u) => /\.(js|css)$/.test(new URL(u).pathname);
async function trim() {
  const c = await caches.open(ASSETS);
  const keys = await c.keys();
  // kolejność w pamięci = kolejność użycia (trafienie odkłada plik na koniec), więc z przodu są najdawniej używane
  const media = keys.filter((k) => !isCode(k.url));
  const code = keys.filter((k) => isCode(k.url));
  for (const k of media.slice(0, Math.max(0, keys.length - ASSET_MAX))) await c.delete(k);
  for (const k of code.slice(0, Math.max(0, code.length - CODE_MAX))) await c.delete(k);
}

// powiadomienie (np. koniec sprawy na mieście): stuknięcie otwiera grę
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const w of list) if ('focus' in w) return w.focus();
      return self.clients.openWindow ? self.clients.openWindow(self.registration.scope) : undefined;
    }),
  );
});

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
        (hit) => {
          if (hit) {
            // używany plik idzie na koniec kolejki (wypada ostatni)
            const copy = hit.clone();
            c.delete(req).then(() => c.put(req, copy)).catch(() => {});
            return hit;
          }
          return fetch(req).then((r) => {
            // tylko prawdziwy plik: brakujący Cloudflare oddaje jako stronę HTML z kodem 200 (tego nie zapamiętujemy)
            const type = r.headers.get('content-type') || '';
            if (r.ok && !type.includes('text/html')) {
              c.put(req, r.clone()).then(trim).catch(() => {});
            }
            return r;
          });
        },
      ),
    ),
  );
});
