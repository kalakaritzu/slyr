// slyr's transport for bare-mux: Scramjet hands every request and WebSocket of a proxied page to this module,
// which sends it to slyr's own relay (functions/f.js on Cloudflare). The relay fetches the real site and hands
// back the answer as it is; Scramjet does all the rewriting in the browser.
const NULL_BODY = new Set([101, 204, 205, 304]);
const flat = (h) => { const o = {}; for (const k in h) o[k] = Array.isArray(h[k]) ? h[k].join(", ") : String(h[k]); return o; };

export default class SlyrTransport {
  constructor(opts) { this.base = (opts && opts.base) || self.location.origin; this.ready = false; }
  async init() { this.ready = true; }
  meta() { return {}; }

  async request(remote, method, body, headers, signal) {
    if (body instanceof ReadableStream || (body && typeof body === "object" && !(body instanceof ArrayBuffer) && !ArrayBuffer.isView(body) && !(body instanceof Blob)))
      body = await new Response(body).arrayBuffer();                                   // send the body in one piece
    const res = await fetch(this.base + "/f", {
      method: "POST",
      body: method === "GET" || method === "HEAD" ? undefined : body,
      headers: { "x-px-url": remote.href, "x-px-method": method, "x-px-headers": encodeURIComponent(JSON.stringify(flat(headers))) },
      signal, credentials: "omit", cache: "no-store",
    });
    const status = +res.headers.get("x-px-status") || res.status;
    let out = {};
    try { out = JSON.parse(decodeURIComponent(res.headers.get("x-px-headers") || "%7B%7D")); } catch (e) {}
    return { body: NULL_BODY.has(status) ? null : res.body, headers: out, status, statusText: decodeURIComponent(res.headers.get("x-px-status-text") || "") };
  }

  connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
    const q = "?u=" + encodeURIComponent(url.href) + "&h=" + encodeURIComponent(JSON.stringify(flat(requestHeaders || {})));
    const ws = new WebSocket(this.base.replace(/^http/, "ws") + "/f" + q, protocols && protocols.length ? protocols : undefined);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => onopen(ws.protocol || "");
    ws.onmessage = (e) => onmessage(e.data);
    ws.onclose = (e) => onclose(e.code, e.reason);
    ws.onerror = () => onerror("Could not connect.");
    const okCode = (c) => c === 1000 || (c >= 3000 && c <= 4999);
    return [(d) => { try { ws.send(d); } catch (e) {} }, (c, r) => { try { okCode(c) ? ws.close(c, r) : ws.close(); } catch (e) {} }];
  }
}
