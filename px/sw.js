// The service worker for slyr's Proxy: pages under /px/go/ are run by Scramjet (px/scram/, AGPL-3.0, source:
// https://github.com/MercuryWorkshop/scramjet). Everything they load goes through it, and on to slyr's relay.
importScripts("/px/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

async function handle(event) {
  await scramjet.loadConfig();
  if (scramjet.route(event)) return scramjet.fetch(event);
  return fetch(event.request);
}
self.addEventListener("fetch", (event) => event.respondWith(handle(event)));
