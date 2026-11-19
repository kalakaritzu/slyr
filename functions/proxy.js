// A small web proxy for the Proxy app (ports/proxy/). Cloudflare Pages runs this file for every request to /proxy.
//   /proxy?u=<address>   fetches the address and returns it with its links, images and scripts pointed back through here.
// It only answers requests that come from slyr's own pages, so it cannot be used as an open relay by other sites.

const BLOCKED_HOST = /^(localhost|.*\.localhost|.*\.local|.*\.internal|.*\.lan|metadata\.google\.internal)$/i;
const PRIVATE_V4 = /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;
const DROP_RESPONSE = ["content-security-policy", "content-security-policy-report-only", "x-frame-options", "set-cookie", "set-cookie2", "strict-transport-security", "public-key-pins", "report-to", "nel", "content-length", "content-encoding", "cross-origin-opener-policy", "cross-origin-embedder-policy", "cross-origin-resource-policy", "permissions-policy"];
const PASS_REQUEST = ["accept", "accept-language", "content-type", "range", "if-none-match", "if-modified-since", "user-agent"];

export function allowedTarget(url) {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (BLOCKED_HOST.test(host)) return false;
  if (PRIVATE_V4.test(host)) return false;
  if (host.includes(":")) { const h = host.toLowerCase(); if (h === "::1" || h.startsWith("fe80") || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("::ffff:")) return false; }
  if (/^\d+$/.test(host) || /^0x[0-9a-f]+$/i.test(host)) return false;          // numeric shortcuts for an address
  return true;
}

const prox = (origin, abs) => origin + "/proxy?u=" + encodeURIComponent(abs);

function resolve(value, base) {
  const v = value.trim();
  if (!v || v[0] === "#" || /^(javascript|data|mailto|tel|blob|about|sms):/i.test(v)) return null;
  try { return new URL(v, base).href; } catch (e) { return null; }
}

function rewriteCss(css, base, origin) {
  return css
    .replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (m, q, u) => { const a = resolve(u, base); return a ? "url(" + q + prox(origin, a) + q + ")" : m; })
    .replace(/@import\s+(["'])([^"']+)\1/gi, (m, q, u) => { const a = resolve(u, base); return a ? "@import " + q + prox(origin, a) + q : m; });
}

function rewriteSrcset(value, base, origin) {
  return value.split(",").map((part) => {
    const bits = part.trim().split(/\s+/);
    const a = resolve(bits[0] || "", base);
    return a ? [prox(origin, a)].concat(bits.slice(1)).join(" ") : part;
  }).join(", ");
}

// the page-side helper: it sends fetch, XMLHttpRequest, form posts, window.open and clicks on links through the proxy too
function helper(base, origin) {
  const code = "(function(){var B=" + JSON.stringify(base) + ",O=" + JSON.stringify(origin) + ";" +
    "function P(u){try{var a=new URL(String(u),B);if(a.origin===O&&a.pathname==='/proxy')return String(u);" +
    "if(!/^https?:$/.test(a.protocol))return String(u);return O+'/proxy?u='+encodeURIComponent(a.href)}catch(e){return String(u)}}" +
    "var f=window.fetch;if(f)window.fetch=function(i,n){try{if(typeof i==='string'||i instanceof URL)i=P(i);else if(i&&i.url)i=new Request(P(i.url),i)}catch(e){}return f.call(this,i,n)};" +
    "var x=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){arguments[1]=P(u);return x.apply(this,arguments)};" +
    "var w=window.open;window.open=function(u,n,s){return w.call(window,u?P(u):u,n,s)};" +
    "document.addEventListener('submit',function(e){var fm=e.target;if(fm&&fm.action&&!e.defaultPrevented){var a=fm.getAttribute('action')||B;fm.action=P(a)}},true);" +
    "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a){var h=a.getAttribute('href');if(h&&!/^(#|javascript:|mailto:|tel:)/i.test(h)&&a.href.indexOf(O+'/proxy?u=')!==0)a.href=P(a.href)}},true);" +
    "})();";
  return "<script>" + code + "</script>";
}

function rewriteHtml(html, base, origin) {
  let out = html
    .replace(/<base\b[^>]*>/gi, "")
    .replace(/\s(integrity|nonce|crossorigin)=("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(\s)(href|src|action|poster|data-src|formaction)=("([^"]*)"|'([^']*)')/gi, (m, sp, attr, whole, d, s) => {
      const q = whole[0], a = resolve(d !== undefined ? d : s, base);
      return a ? sp + attr + "=" + q + prox(origin, a) + q : m;
    })
    .replace(/(\s)srcset=("([^"]*)"|'([^']*)')/gi, (m, sp, whole, d, s) => sp + "srcset=" + whole[0] + rewriteSrcset(d !== undefined ? d : s, base, origin) + whole[0])
    .replace(/(<meta\b[^>]*http-equiv=["']?refresh["']?[^>]*content=["'][^"']*?url=)([^"']+)/gi, (m, pre, u) => { const a = resolve(u, base); return a ? pre + prox(origin, a) : m; })
    .replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, o, css, c) => o + rewriteCss(css, base, origin) + c)
    .replace(/(\sstyle=)("([^"]*)"|'([^']*)')/gi, (m, pre, whole, d, s) => pre + whole[0] + rewriteCss(d !== undefined ? d : s, base, origin) + whole[0]);
  const tag = helper(base, origin);
  return /<head\b[^>]*>/i.test(out) ? out.replace(/<head\b[^>]*>/i, (h) => h + tag) : tag + out;
}

export async function onRequest(context) {
  const req = context.request, here = new URL(req.url), origin = here.origin;
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  // only slyr's own pages may use it
  const site = req.headers.get("sec-fetch-site");
  const ref = req.headers.get("referer");
  const fromHere = site ? (site === "same-origin") : (ref && new URL(ref).origin === origin);
  if (!fromHere) return new Response("This proxy only works from inside slyr.", { status: 403 });

  const raw = here.searchParams.get("u");
  if (!raw) return new Response("Missing address.", { status: 400 });
  let target;
  try { target = new URL(raw); } catch (e) { return new Response("That is not a valid address.", { status: 400 }); }
  if (!allowedTarget(target)) return new Response("That address is not allowed.", { status: 403 });

  const headers = new Headers();
  PASS_REQUEST.forEach((k) => { const v = req.headers.get(k); if (v) headers.set(k, v); });
  let upstream;
  try {
    upstream = await fetch(target.href, { method: req.method, headers, body: (req.method === "GET" || req.method === "HEAD") ? undefined : req.body, redirect: "manual" });
  } catch (e) { return new Response("Could not reach " + target.hostname + ".", { status: 502 }); }

  const out = new Headers();
  upstream.headers.forEach((v, k) => { if (!DROP_RESPONSE.includes(k.toLowerCase())) out.set(k, v); });
  const loc = upstream.headers.get("location");
  if (loc) { const a = resolve(loc, target.href); if (a) out.set("location", prox(origin, a)); }
  out.set("cache-control", "private, max-age=300");
  if (upstream.status >= 300 && upstream.status < 400) return new Response(null, { status: upstream.status, headers: out });

  const type = (upstream.headers.get("content-type") || "").toLowerCase();
  if (type.includes("text/html")) {
    const html = await upstream.text();
    out.set("content-type", "text/html; charset=utf-8");
    return new Response(rewriteHtml(html, target.href, origin), { status: upstream.status, headers: out });
  }
  if (type.includes("text/css")) {
    const css = await upstream.text();
    return new Response(rewriteCss(css, target.href, origin), { status: upstream.status, headers: out });
  }
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
