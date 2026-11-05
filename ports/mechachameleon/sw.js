// Cache-first for the game's packed data chunks (/game/*). One visit fills Cache Storage and later reads never touch
// the network - which is what stops the guest stalling on a 1 MB block while you click around. install.js can also
// fetch the whole set up front. Scope is this directory, so other sites on the host are untouched.
const CACHE = 'meccha-game-v1';
const isGame = url => url.origin === self.location.origin && url.pathname.includes('/game/');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (e) { return; }
  if (!isGame(url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreVary: true });
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && res.status === 200) { const copy = res.clone(); cache.put(req, copy).catch(() => {}); }
    return res;
  })());
});
