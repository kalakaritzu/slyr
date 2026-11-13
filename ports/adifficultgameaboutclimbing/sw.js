// Serves this game's files from where its GitHub project publishes them, so the game runs on this site instead of sending you elsewhere.
const CFG = {"base": "https://nostaligafun.pages.dev/games/games-accualy/OTHER/ADifficultGameAboutClimbing_Data/", "start": "", "rewrite": null, "isolate": true, "patches": null, "overrides": null, "id": "adifficultgameaboutclimbing"};
const BASE = CFG.base;
const SHIM = "(function(){var P=" + JSON.stringify(CFG.id + ":") + ";var F=IDBFactory.prototype,op=F.open,del=F.deleteDatabase,dbs=F.databases;F.open=function(n){var a=[].slice.call(arguments);a[0]=P+n;return op.apply(this,a)};F.deleteDatabase=function(n){var a=[].slice.call(arguments);a[0]=P+n;return del.apply(this,a)};if(dbs)F.databases=function(){return dbs.call(this).then(function(l){return l.filter(function(d){return d.name.indexOf(P)===0}).map(function(d){return{name:d.name.slice(P.length),version:d.version}})})}})();";

const TYPES = { html: "text/html; charset=utf-8", htm: "text/html; charset=utf-8", js: "text/javascript", mjs: "text/javascript", css: "text/css", json: "application/json", wasm: "application/wasm", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", ico: "image/x-icon", mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav", mp4: "video/mp4", webm: "video/webm", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf", txt: "text/plain; charset=utf-8", xml: "application/xml", map: "application/json", webmanifest: "application/manifest+json" };
const SCOPE = self.registration.scope, SCOPE_PATH = new URL(SCOPE).pathname;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const req = e.request, u = new URL(req.url);
  if (u.origin !== location.origin || !u.pathname.startsWith(SCOPE_PATH)) return;
  let rel = decodeURIComponent(u.pathname.slice(SCOPE_PATH.length));
  rel = rel.split("/").filter((x, i, arr) => x !== "" || i === arr.length - 1).join("/");
  if (rel === "sw.js") return;
  if (rel === "" && CFG.start) { e.respondWith(Response.redirect(SCOPE + CFG.start, 302)); return; }
  if (rel === "" || rel.endsWith("/")) rel += "index.html";
  e.respondWith(serve(req, rel));
});
async function serve(req, rel) {
  const url = (CFG.overrides && CFG.overrides[rel]) || (BASE + rel.split("/").map(encodeURIComponent).join("/"));
  const range = req.headers.get("range");
  let cache = null;
  try { cache = await caches.open("proxy2-" + SCOPE_PATH); } catch (e) {}
  if (cache && !range) { const hit = await cache.match(url); if (hit) return wants(rel) ? rewritten(hit, rel) : finish(hit, rel, true); }
  let res;
  try { res = await fetch(url, range ? { headers: { Range: range } } : undefined); } catch (err) { return new Response("Could not load " + rel, { status: 502 }); }
  const len = +res.headers.get("content-length") || 0;
  if (cache && !range && res.status === 200 && len && len < 6 * 1048576) { try { await cache.put(url, res.clone()); } catch (e) {} }
  if (res.status === 200 && wants(rel) && len < 8 * 1048576) return rewritten(res, rel);
  return finish(res, rel, false);
}
const wants = (rel) => (CFG.rewrite && TEXT.test(rel)) || (CFG.patches || []).some((p) => p.file === rel) || /\.html?$/i.test(rel);
const TEXT = /\.(html?|js|mjs|css|json|webmanifest)$/i;
async function rewritten(res, rel) {
  let text = await res.text();
  if (CFG.rewrite) text = text.split(CFG.rewrite[0]).join(SCOPE_PATH);
  for (const p of (CFG.patches || [])) if (p.file === rel) text = text.split(p.find).join(p.replace);
  if (/\.html?$/i.test(rel)) {
    const tag = "<script>" + SHIM + "</script>";
    const hm = /<head[^>]*>/i.exec(text);
    if (hm) text = text.slice(0, hm.index + hm[0].length) + tag + text.slice(hm.index + hm[0].length);
    else { const tm = /<html[^>]*>/i.exec(text); text = tm ? text.slice(0, tm.index + tm[0].length) + tag + text.slice(tm.index + tm[0].length) : tag + text; }
  }
  const h = new Headers(); h.set("Content-Type", TYPES[rel.split(".").pop().toLowerCase()] || "text/plain");
  if (CFG.isolate) { h.set("Cross-Origin-Embedder-Policy", CFG.isolate === "credentialless" ? "credentialless" : "require-corp"); h.set("Cross-Origin-Opener-Policy", "same-origin"); }
  return new Response(text, { status: 200, headers: h });
}
function finish(res, rel, _) {
  const h = new Headers();
  const ext = (rel.split("?")[0].split(".").pop() || "").toLowerCase();
  h.set("Content-Type", TYPES[ext] || "application/octet-stream");
  for (const k of ["content-length", "content-range", "accept-ranges", "etag"]) { const v = res.headers.get(k); if (v) h.set(k, v); }
  if (!h.has("accept-ranges")) h.set("Accept-Ranges", "bytes");
  if (CFG.isolate) { h.set("Cross-Origin-Embedder-Policy", CFG.isolate === "credentialless" ? "credentialless" : "require-corp"); h.set("Cross-Origin-Opener-Policy", "same-origin"); }
  return new Response(res.status === 404 ? "Not found" : res.body, { status: res.status, headers: h });
}
