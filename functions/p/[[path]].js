// The web proxy behind slyr's Proxy screen. Cloudflare Pages runs this file for every request under /p/.
//   /p/https/example.com/some/page?x=1   is https://example.com/some/page?x=1, fetched and returned with its links, images
//   and scripts pointed back through here. Because each page has a real path, its own relative links, imports and workers
//   find the right files by themselves. /p/__sw.js is a service worker that catches whatever the page asks for in JavaScript.
//   (/proxy?u=<address>, the old form, redirects here: see functions/proxy.js.)
// It only answers requests that come from slyr's own pages, so it cannot be used as an open relay by other sites.
//
// Speed: pages are rewritten while they stream in (HTMLRewriter), so they start showing before they finish downloading;
// pictures, scripts, styles and fonts are kept in Cloudflare's cache; ad and tracker scripts are not fetched at all.
// Each site keeps its own cookies (stored under that site's name), so logins and "are you human" checks can stick.

const BLOCKED_HOST = /^(localhost|.*\.localhost|.*\.local|.*\.internal|.*\.lan|metadata\.google\.internal)$/i;
const PRIVATE_V4 = /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;
const TRACKERS = /(^|\.)(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|googlesyndication\.com|googleadservices\.com|adservice\.google\.com|connect\.facebook\.net|hotjar\.com|scorecardresearch\.com|quantserve\.com|criteo\.com|criteo\.net|taboola\.com|outbrain\.com|amazon-adsystem\.com|adnxs\.com|moatads\.com|chartbeat\.com|chartbeat\.net|segment\.io|segment\.com|clarity\.ms|nr-data\.net|newrelic\.com|pubmatic\.com|rubiconproject\.com|openx\.net|casalemedia\.com|adsrvr\.org|bat\.bing\.com|mouseflow\.com|fullstory\.com|optimizely\.com|branch\.io|appsflyer\.com)$/i;
const DROP_RESPONSE = new Set(["content-security-policy", "content-security-policy-report-only", "x-frame-options", "set-cookie", "set-cookie2", "strict-transport-security", "public-key-pins", "report-to", "nel", "content-length", "content-encoding", "cross-origin-opener-policy", "cross-origin-embedder-policy", "cross-origin-resource-policy", "permissions-policy", "alt-svc", "link", "server-timing"]);
const PASS_REQUEST = ["accept", "accept-language", "content-type", "range", "if-none-match", "if-modified-since", "user-agent", "cache-control", "pragma"];
const ASSET_DEST = new Set(["image", "script", "style", "font", "audio", "video", "track", "manifest", "worker"]);

export function allowedTarget(url) {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (BLOCKED_HOST.test(host)) return false;
  if (PRIVATE_V4.test(host)) return false;
  if (host.includes(":")) { const h = host.toLowerCase(); if (h === "::1" || h.startsWith("fe80") || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("::ffff:")) return false; }
  if (/^\d+$/.test(host) || /^0x[0-9a-f]+$/i.test(host)) return false;          // numeric shortcuts for an address
  return true;
}

// an address -> its place under /p/ ; and back
export function prox(origin, abs) {
  const u = new URL(abs);
  return origin + "/p/" + u.protocol.slice(0, -1) + "/" + u.host + u.pathname + u.search;
}
export function targetOf(href, origin) {
  try {
    const u = new URL(href);
    if (u.origin !== origin) return null;
    if (u.pathname.startsWith("/p/")) {
      const m = u.pathname.slice(3).match(/^(https?)\/([^\/]+)(\/.*)?$/);
      return m ? m[1] + "://" + m[2] + (m[3] || "/") + u.search : null;
    }
    if (u.pathname === "/proxy") return u.searchParams.get("u");
  } catch (e) {}
  return null;
}

// attribute values in HTML may be written with entities (a link's "&" is "&amp;"); read them as the real characters
const unent = (v) => v.replace(/&(amp|#0*38|#x0*26);/gi, "&").replace(/&(quot|#0*34|#x0*22);/gi, '"').replace(/&(apos|#0*39|#x0*27);/gi, "'").replace(/&(lt|#0*60);/gi, "<").replace(/&(gt|#0*62);/gi, ">");

function resolve(value, base) {
  const v = unent(String(value)).trim();
  if (!v || v[0] === "#" || /^(javascript|data|mailto|tel|blob|about|sms|intent):/i.test(v)) return null;
  try { return new URL(v, base).href; } catch (e) { return null; }
}

function rewriteCss(css, base, origin) {
  return css
    .replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (m, q, u) => { const a = resolve(u, base); return a ? "url(" + q + prox(origin, a) + q + ")" : m; })
    .replace(/@import\s+(["'])([^"']+)\1/gi, (m, q, u) => { const a = resolve(u, base); return a ? "@import " + q + prox(origin, a) + q : m; });
}

function rewriteSrcset(value, base, origin) {
  return unent(value).split(/,\s+|,(?=\S)/).map((part) => {
    const bits = part.trim().split(/\s+/);
    const a = resolve(bits[0] || "", base);
    return a ? [prox(origin, a)].concat(bits.slice(1)).join(" ") : part;
  }).join(", ");
}

/* ---------- cookies: each site's cookies live under its own name ("example.com~sid"), so sites never see each other's ---------- */
const jarName = (domain, name) => domain.replace(/^\./, "").toLowerCase() + "~" + name;

function cookiesFor(header, host) {
  if (!header) return "";
  host = host.toLowerCase();
  const out = [];
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("="); if (eq < 1) continue;
    const key = part.slice(0, eq), val = part.slice(eq + 1), t = key.indexOf("~");
    if (t < 1) continue;
    const dom = key.slice(0, t);
    if (host === dom || host.endsWith("." + dom)) out.push(key.slice(t + 1) + "=" + val);
  }
  return out.join("; ");
}

function rewriteSetCookie(line, host, secure) {
  const parts = line.split(";");
  const first = parts.shift(), eq = first.indexOf("=");
  if (eq < 1) return null;
  let domain = host;
  const keep = [];
  for (const raw of parts) {
    const a = raw.trim(), low = a.toLowerCase();
    if (low.startsWith("domain=")) { const d = a.slice(7).replace(/^\./, ""); if (host === d.toLowerCase() || host.endsWith("." + d.toLowerCase())) domain = d; continue; }
    if (low.startsWith("path=") || low.startsWith("samesite") || low === "secure" || low === "partitioned" || low === "httponly") continue;
    keep.push(a);
  }
  const name = first.slice(0, eq).trim().replace(/^__(Host|Secure)-/, "");
  return [jarName(domain, name) + "=" + first.slice(eq + 1).trim(), "Path=/p", "SameSite=Lax", "HttpOnly"].concat(secure ? ["Secure"] : []).concat(keep).join("; ");
}

/* ---------- the helper put into every page: addresses the page makes in JavaScript go through the proxy too ---------- */
function helper(base, origin) {
  const code = "(function(){var B=" + JSON.stringify(base) + ",O=" + JSON.stringify(origin) + ";" +
    "function P(u){if(u==null||u==='')return u;try{var s=String(u);if(/^(data|blob|javascript|about|mailto|tel):/i.test(s))return u;var a=new URL(s,B);" +
    "if(a.origin===O&&(a.pathname.indexOf('/p/')===0||a.pathname==='/proxy'))return s;if(!/^https?:$/.test(a.protocol))return u;" +
    "return O+'/p/'+a.protocol.slice(0,-1)+'/'+a.host+a.pathname+a.search+a.hash}catch(e){return u}}" +
    "window.__slyrP=P;" +
    "var f=window.fetch;if(f)window.fetch=function(i,n){try{if(typeof i==='string'||i instanceof URL)i=P(String(i));else if(i&&i.url)i=new Request(P(i.url),i)}catch(e){}return f.call(this,i,n)};" +
    "var x=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){arguments[1]=P(u);return x.apply(this,arguments)};" +
    "var w=window.open;window.open=function(u,n,s){return w.call(window,u?P(u):u,n,s)};" +
    "if(navigator.sendBeacon){var sb=navigator.sendBeacon.bind(navigator);navigator.sendBeacon=function(u,d){return sb(P(u),d)}}" +
    "['pushState','replaceState'].forEach(function(k){var h=history[k];history[k]=function(s,t,u){return h.call(history,s,t,u==null?u:P(u))}});" +
    "function hook(C,p){if(!window[C])return;var d=Object.getOwnPropertyDescriptor(window[C].prototype,p);if(!d||!d.set)return;" +
    "Object.defineProperty(window[C].prototype,p,{get:d.get,set:function(v){d.set.call(this,P(v))},configurable:true,enumerable:d.enumerable})}" +
    "[['HTMLImageElement','src'],['HTMLScriptElement','src'],['HTMLLinkElement','href'],['HTMLIFrameElement','src'],['HTMLSourceElement','src'],['HTMLMediaElement','src'],['HTMLFormElement','action'],['HTMLEmbedElement','src'],['HTMLTrackElement','src']].forEach(function(h){hook(h[0],h[1])});" +
    "var sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){try{if(/^(src|href|action|formaction|poster)$/i.test(n)&&!(this instanceof SVGElement)&&!(this instanceof HTMLAnchorElement))v=P(v)}catch(e){}return sa.call(this,n,v)};" +
    "document.addEventListener('submit',function(e){var fm=e.target;if(fm&&!e.defaultPrevented){var a=fm.getAttribute('action');fm.setAttribute('action',P(a==null||a===''?location.href:a))}},true);" +
    "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a){var h=a.getAttribute('href');if(h&&!/^(#|javascript:|mailto:|tel:)/i.test(h)){var p=P(h);if(p!==h)a.setAttribute('href',p)}if(/^_(top|parent)$/i.test(a.target))a.target='_self'}},true);" +
    "})();";
  return "<script>" + code + "</script>";
}


/* ---------- the service worker for pages under /p/: every request a page makes, it sends through the proxy ---------- */
const SW = `
const O=self.location.origin;
const P=a=>{const u=new URL(a);return O+'/p/'+u.protocol.slice(0,-1)+'/'+u.host+u.pathname+u.search};
const T=h=>{try{const u=new URL(h);if(u.origin!==O)return null;if(u.pathname.indexOf('/p/')===0){const m=u.pathname.slice(3).match(/^(https?)\\/([^\\/]+)(\\/.*)?$/);return m?m[1]+'://'+m[2]+(m[3]||'/')+u.search:null}if(u.pathname==='/proxy')return u.searchParams.get('u')}catch(e){}return null};
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
async function send(r,url){
  const init={method:r.method,headers:r.headers,credentials:'same-origin',redirect:r.mode==='navigate'?'manual':r.redirect,cache:r.cache==='only-if-cached'?'default':r.cache};
  if(r.method!=='GET'&&r.method!=='HEAD')init.body=await r.arrayBuffer();
  try{return await fetch(url,init)}catch(e){return new Response('',{status:502})}
}
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(!/^https?:$/.test(u.protocol))return;
  if(u.origin===O){
    if(u.pathname.indexOf('/p/')===0||u.pathname==='/proxy')return;          /* already on its way through the proxy */
    e.respondWith((async()=>{                                                  /* "/something" meant the page's own site, not slyr */
      let base=null;
      if(e.clientId){const c=await self.clients.get(e.clientId);if(c)base=T(c.url)}
      if(!base&&r.referrer)base=T(r.referrer);
      if(!base)return fetch(r);
      return send(r,P(new URL(u.pathname+u.search,base).href));
    })());
    return;
  }
  e.respondWith(send(r,P(u.href)));                                            /* straight to another site: through the proxy instead */
});
`;

/* ---------- pages: rewritten as they stream through ---------- */
function rewritePage(res, target, origin) {
  const st = { base: target, injected: false };
  const tag = () => helper(st.base, origin);
  const attr = (name) => ({
    element(el) {
      const v = el.getAttribute(name); if (v == null) return;
      const a = resolve(v, st.base); if (a) el.setAttribute(name, prox(origin, a));
    },
  });
  let css = "";
  return new HTMLRewriter()
    .on("base[href]", { element(el) { const a = resolve(el.getAttribute("href"), st.base); if (a) st.base = a; el.remove(); } })
    .on("head", { element(el) { if (!st.injected) { st.injected = true; el.prepend(tag(), { html: true }); } } })
    .on("body", { element(el) { if (!st.injected) { st.injected = true; el.prepend(tag(), { html: true }); } } })
    .on("meta[http-equiv]", {
      element(el) {
        const kind = (el.getAttribute("http-equiv") || "").toLowerCase();
        if (kind.startsWith("content-security-policy") || kind === "x-frame-options") { el.remove(); return; }
        if (kind === "refresh") {
          const c = el.getAttribute("content") || "", m = c.match(/^(\s*\d*\s*;?\s*url\s*=\s*)['"]?([^'"]+)/i);
          if (m) { const a = resolve(m[2], st.base); if (a) el.setAttribute("content", m[1] + prox(origin, a)); }
        }
      },
    })
    .on("link[rel]", { element(el) { if (/\b(preconnect|dns-prefetch)\b/i.test(el.getAttribute("rel") || "")) el.remove(); } })
    .on("[integrity]", { element(el) { el.removeAttribute("integrity"); } })
    .on("[href]", attr("href"))
    .on("[src]", attr("src"))
    .on("[action]", attr("action"))
    .on("[formaction]", attr("formaction"))
    .on("[poster]", attr("poster"))
    .on("[data-src]", attr("data-src"))
    .on("[srcset]", { element(el) { el.setAttribute("srcset", rewriteSrcset(el.getAttribute("srcset"), st.base, origin)); } })
    .on("[imagesrcset]", { element(el) { el.setAttribute("imagesrcset", rewriteSrcset(el.getAttribute("imagesrcset"), st.base, origin)); } })
    .on("[style]", { element(el) { el.setAttribute("style", rewriteCss(unent(el.getAttribute("style")), st.base, origin).replace(/"/g, "'")); } })
    .on("a[target], form[target], area[target]", { element(el) { if (/^_(top|parent)$/i.test(el.getAttribute("target") || "")) el.setAttribute("target", "_self"); } })
    .on("style", {
      text(t) {
        css += t.text;
        if (t.lastInTextNode) { t.replace(rewriteCss(css, st.base, origin), { html: true }); css = ""; }
        else t.remove();
      },
    })
    .onDocument({ end(end) { if (!st.injected) { st.injected = true; end.append(tag(), { html: true }); } } })
    .transform(res);
}

export async function onRequest(context) {
  const req = context.request, here = new URL(req.url), origin = here.origin;
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  // only slyr's own pages may use it
  const site = req.headers.get("sec-fetch-site");
  const ref = req.headers.get("referer");
  let fromHere = false;
  try { fromHere = site ? site === "same-origin" : !!ref && new URL(ref).origin === origin; } catch (e) {}
  if (!fromHere) return new Response("This proxy only works from inside slyr.", { status: 403 });

  if (here.pathname === "/p/__sw.js") return new Response(SW, { headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-cache" } });
  const raw = targetOf(here.href, origin);
  if (!raw) return new Response("Missing address.", { status: 400 });
  let target;
  try { target = new URL(raw); } catch (e) { return new Response("That is not a valid address.", { status: 400 }); }
  if (!allowedTarget(target)) return new Response("That address is not allowed.", { status: 403 });
  if (TRACKERS.test(target.hostname)) return new Response("", { status: 204, headers: { "cache-control": "public, max-age=86400" } });   // ads and trackers: nothing to fetch

  const dest = (req.headers.get("sec-fetch-dest") || "").toLowerCase();
  const asset = req.method === "GET" && ASSET_DEST.has(dest);
  const host = target.hostname.toLowerCase();

  const headers = new Headers();
  PASS_REQUEST.forEach((k) => { const v = req.headers.get(k); if (v) headers.set(k, v); });
  const jar = cookiesFor(req.headers.get("cookie"), host);
  if (jar) headers.set("cookie", jar);
  // the site sees a visit from itself, as it would without the proxy
  const refTarget = ref && targetOf(ref, origin); if (refTarget) headers.set("referer", refTarget);
  if (req.method !== "GET" && req.method !== "HEAD") headers.set("origin", target.origin);   // forms and posts: from the site itself

  let upstream;
  try {
    upstream = await fetch(target.href, {
      method: req.method, headers, redirect: "manual",
      body: (req.method === "GET" || req.method === "HEAD") ? undefined : req.body,
      cf: asset && !jar ? { cacheEverything: true, cacheTtlByStatus: { "200-299": 86400, "404": 300, "500-599": 0 } } : undefined,   // pictures, scripts, styles and fonts come from Cloudflare's cache next time
    });
  } catch (e) { return new Response("Could not reach " + target.hostname + ".", { status: 502 }); }

  const out = new Headers();
  upstream.headers.forEach((v, k) => { if (!DROP_RESPONSE.has(k.toLowerCase())) out.set(k, v); });
  const sets = typeof upstream.headers.getSetCookie === "function" ? upstream.headers.getSetCookie() : (upstream.headers.get("set-cookie") ? [upstream.headers.get("set-cookie")] : []);
  for (const line of sets) { const c = rewriteSetCookie(line, host, here.protocol === "https:"); if (c) out.append("set-cookie", c); }
  const loc = upstream.headers.get("location");
  if (loc) { const a = resolve(loc, target.href); if (a) out.set("location", prox(origin, a)); }
  if (upstream.status >= 300 && upstream.status < 400 && loc) return new Response(null, { status: upstream.status, headers: out });

  const type = (upstream.headers.get("content-type") || "").toLowerCase();
  if (type.includes("text/html") || type.includes("application/xhtml")) {
    out.set("cache-control", "private, max-age=60");
    return rewritePage(new Response(upstream.body, { status: upstream.status, headers: out }), target.href, origin);
  }
  if (type.includes("text/css")) {
    const css = await upstream.text();
    if (!out.has("cache-control")) out.set("cache-control", "public, max-age=3600");
    return new Response(rewriteCss(css, target.href, origin), { status: upstream.status, headers: out });
  }
  if (!out.has("cache-control")) out.set("cache-control", asset ? "public, max-age=3600" : "private, max-age=60");
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
