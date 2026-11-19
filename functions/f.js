// slyr's relay for the Proxy screen (px/transport.mjs talks to it). It fetches a site exactly as asked and hands the
// answer back untouched; Scramjet, running in the browser, does all the rewriting. Only slyr's own pages may use it.
//   POST /f   with x-px-url, x-px-method, x-px-headers   -> the site's answer, its real status and headers in x-px-*
//   GET  /f?u=wss://...&h=...  (WebSocket)               -> a WebSocket joined to the site's
const BLOCKED_HOST = /^(localhost|.*\.localhost|.*\.local|.*\.internal|.*\.lan|metadata\.google\.internal)$/i;
const PRIVATE_V4 = /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;
const TRACKERS = /(^|\.)(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|googlesyndication\.com|googleadservices\.com|adservice\.google\.com|connect\.facebook\.net|hotjar\.com|scorecardresearch\.com|quantserve\.com|criteo\.com|criteo\.net|taboola\.com|outbrain\.com|amazon-adsystem\.com|adnxs\.com|moatads\.com|chartbeat\.com|chartbeat\.net|clarity\.ms|nr-data\.net|pubmatic\.com|rubiconproject\.com|openx\.net|casalemedia\.com|adsrvr\.org|bat\.bing\.com|mouseflow\.com|fullstory\.com)$/i;
const SKIP_REQUEST = new Set(["host", "connection", "content-length", "accept-encoding", "upgrade", "sec-websocket-key", "sec-websocket-version", "sec-websocket-extensions", "keep-alive", "transfer-encoding", "te", "trailer", "proxy-connection"]);
const SKIP_RESPONSE = new Set(["content-encoding", "content-length", "transfer-encoding", "connection", "keep-alive"]);
const ASSET = /\.(js|mjs|css|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp3|ogg|wav|mp4|webm|wasm)$/i;

function allowedTarget(url) {
  if (!/^(https?|wss?):$/.test(url.protocol)) return false;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (BLOCKED_HOST.test(host) || PRIVATE_V4.test(host)) return false;
  if (host.includes(":")) { const h = host.toLowerCase(); if (h === "::1" || h.startsWith("fe80") || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("::ffff:")) return false; }
  if (/^\d+$/.test(host) || /^0x[0-9a-f]+$/i.test(host)) return false;
  return true;
}
const parseHeaders = (raw) => { try { return JSON.parse(decodeURIComponent(raw || "%7B%7D")); } catch (e) { return {}; } };
const deny = (msg, status = 403) => new Response(msg, { status });

async function websocket(request, here) {
  if (request.headers.get("origin") !== here.origin) return deny("This proxy only works from inside slyr.");
  let target;
  try { target = new URL(here.searchParams.get("u")); } catch (e) { return deny("That is not a valid address.", 400); }
  if (!allowedTarget(target)) return deny("That address is not allowed.");
  target.protocol = target.protocol === "ws:" ? "http:" : target.protocol === "wss:" ? "https:" : target.protocol;
  const headers = new Headers();
  const given = parseHeaders(here.searchParams.get("h"));
  for (const k in given) if (!SKIP_REQUEST.has(k.toLowerCase())) headers.set(k, given[k]);
  headers.set("upgrade", "websocket");
  const protos = request.headers.get("sec-websocket-protocol");
  if (protos) headers.set("sec-websocket-protocol", protos);
  let res;
  try { res = await fetch(target.href, { headers }); } catch (e) { return deny("Could not reach " + target.hostname + ".", 502); }
  const remote = res.webSocket;
  if (!remote) return deny("That site did not accept the connection.", 502);
  remote.accept();
  const pair = new WebSocketPair(), client = pair[0], server = pair[1];
  server.accept();
  const ok = (c) => (c === 1000 || (c >= 3000 && c <= 4999) ? c : 1000);
  server.addEventListener("message", (e) => { try { remote.send(e.data); } catch (x) {} });
  remote.addEventListener("message", (e) => { try { server.send(e.data); } catch (x) {} });
  server.addEventListener("close", (e) => { try { remote.close(ok(e.code), e.reason); } catch (x) {} });
  remote.addEventListener("close", (e) => { try { server.close(ok(e.code), e.reason); } catch (x) {} });
  server.addEventListener("error", () => { try { remote.close(); } catch (x) {} });
  remote.addEventListener("error", () => { try { server.close(); } catch (x) {} });
  const chosen = res.headers.get("sec-websocket-protocol");
  return new Response(null, { status: 101, webSocket: client, headers: chosen ? { "sec-websocket-protocol": chosen } : {} });
}

export async function onRequest({ request }) {
  const here = new URL(request.url);
  if ((request.headers.get("upgrade") || "").toLowerCase() === "websocket") return websocket(request, here);
  if (request.method !== "POST") return deny("Not here.", 405);
  if (request.headers.get("sec-fetch-site") !== "same-origin") return deny("This proxy only works from inside slyr.");

  let target;
  try { target = new URL(request.headers.get("x-px-url")); } catch (e) { return deny("That is not a valid address.", 400); }
  if (!allowedTarget(target)) return deny("That address is not allowed.");
  const reply = (status, headers, body, statusText = "") => new Response(body, {
    status: 200,
    headers: { "x-px-status": String(status), "x-px-status-text": encodeURIComponent(statusText), "x-px-headers": encodeURIComponent(JSON.stringify(headers)), "cache-control": "no-store" },
  });
  if (TRACKERS.test(target.hostname)) return reply(204, {}, null);                       // ads and trackers: nothing to fetch

  const method = (request.headers.get("x-px-method") || "GET").toUpperCase();
  const given = parseHeaders(request.headers.get("x-px-headers"));

  // A page asked for slyr itself: it built an address from slyr's domain instead of its own. Send it to the right place:
  // "/px/go/<address>" is that address, anything else belongs to the site the page is on (its referer).
  if (target.host === here.host) {
    let real = null;
    if (target.pathname.startsWith("/px/go/")) { try { real = new URL(decodeURIComponent(target.pathname.slice(7)) + target.search); } catch (e) {} }
    else {
      const ref = given.referer || given.Referer;
      try { const r = new URL(ref); if (r.host !== here.host) real = new URL(target.pathname + target.search + target.hash, r.origin); } catch (e) {}
    }
    if (!real || real.host === here.host || !allowedTarget(real)) return reply(404, { "content-type": "text/plain" }, "Not found.", "Not Found");
    return reply(307, { location: real.href }, null, "Temporary Redirect");
  }
  const headers = new Headers();
  for (const k in given) if (!SKIP_REQUEST.has(k.toLowerCase())) { try { headers.set(k, given[k]); } catch (e) {} }
  const cacheable = method === "GET" && !headers.has("cookie") && !headers.has("authorization") && ASSET.test(target.pathname);

  let up;
  try {
    up = await fetch(target.href, {
      method, headers, redirect: "manual",
      body: method === "GET" || method === "HEAD" ? undefined : request.body,
      cf: cacheable ? { cacheEverything: true, cacheTtlByStatus: { "200-299": 86400, "404": 300, "500-599": 0 } } : undefined,   // pictures, scripts and fonts come from Cloudflare's cache next time
    });
  } catch (e) { return reply(502, { "content-type": "text/plain" }, "Could not reach " + target.hostname + ".", "Bad Gateway"); }

  const out = {};
  up.headers.forEach((v, k) => { if (!SKIP_RESPONSE.has(k) && k !== "set-cookie") out[k] = v; });
  const cookies = typeof up.headers.getSetCookie === "function" ? up.headers.getSetCookie() : [];
  if (cookies.length) out["set-cookie"] = cookies;
  const empty = [101, 204, 205, 304].includes(up.status) || method === "HEAD";
  return reply(up.status, out, empty ? null : up.body, up.statusText || "");
}
