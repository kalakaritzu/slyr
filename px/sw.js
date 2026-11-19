// The service worker for slyr's Proxy: pages under /px/go/ are run by Scramjet (px/scram/, AGPL-3.0, source:
// https://github.com/MercuryWorkshop/scramjet). Everything they load goes through it, and on to slyr's relay.
importScripts("/px/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();
const HOME = self.location.origin, PFX = "/px/go/";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// "/px/go/<address>" -> the address; layers of it (a page that read its own proxied address and asked for that) are peeled off
function realOf(href) {
  let u;
  try { u = new URL(href); } catch (e) { return null; }
  for (let k = 0; k < 12 && u.origin === HOME && u.pathname.startsWith(PFX); k++) {
    try { u = new URL(decodeURIComponent(u.pathname.slice(PFX.length)) + u.search); } catch (e) { return null; }
  }
  return u;
}

// A page asked for an address on slyr itself instead of its own site (it built it from slyr's domain, or from its proxied
// address). Send it where it meant to go: inside the proxy, on the site it is really on.
async function backOnSite(event, wanted) {
  let t = realOf(wanted.href);
  if (t && t.origin === HOME) {
    let site = null;
    const client = event.clientId ? await self.clients.get(event.clientId) : null;
    for (const h of [client && client.url, event.request.referrer]) {
      const r = h && realOf(h);
      if (r && r.origin !== HOME && /^https?:$/.test(r.protocol)) { site = r.origin; break; }
    }
    if (!site) return new Response("Not found.", { status: 404 });
    t = new URL(t.pathname + t.search + t.hash, site);
  }
  if (!t) return new Response("Not found.", { status: 404 });
  return Response.redirect(HOME + PFX + encodeURIComponent(t.href), 307);
}

async function handle(event) {
  await scramjet.loadConfig();
  if (scramjet.route(event)) return scramjet.fetch(event);
  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  const u = new URL(event.request.url);
  if (u.origin === HOME && u.pathname.startsWith(PFX)) {
    let wanted = null;
    try { wanted = new URL(decodeURIComponent(u.pathname.slice(PFX.length)) + u.search); } catch (e) {}
    if (wanted && wanted.origin === HOME) return event.respondWith(backOnSite(event, wanted));
  }
  event.respondWith(handle(event));
});
