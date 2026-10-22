/* MMA Miszcz: service worker tylko po to, żeby grę dało się zainstalować na telefonie.
 * Niczego nie trzyma na zapas: zawsze bierze najnowszą wersję z sieci, a bez sieci pokazuje
 * ostatnio otwartą stronę startową, żeby gra z ekranu głównego nie kończyła się białym ekranem. */
const CACHE = 'mma-miszcz-start-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || Response.error())),
  );
});
