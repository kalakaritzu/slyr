// Graphics worker: owns the page's canvas (as an OffscreenCanvas) and replays the command buffers the engine thread
// posts (rt/web/gfx_remote.c) through rexcomp_gfx.wasm (rt/gfxworker/gfx_worker.c). Messages in: {init, canvas, env},
// {cmds: ArrayBuffer}. Out: {log}, {done: frame, q: occlusion results}, {rb: seq, addr, data}, {lost}, {fatal}.
'use strict';
let G = null, running = false, failed = false, inPtr = 0, inCap = 0, lastSeq = 0, memLogged = 0, rec = false, recSeq = 0, recChain = Promise.resolve(), LINK = null;
const queue = [], st = { t0: performance.now(), busy: 0, lat: 0, nlat: 0 };   // st: share of wall time spent replaying (reported each second)
const hop = (() => { const ch = new MessageChannel(); let q = []; ch.port1.onmessage = () => { const f = q; q = []; for (const g of f) g(); }; return f => { q.push(f); if (q.length === 1) ch.port2.postMessage(0); }; })();
const fatal = err => { if (failed) return; failed = true; postMessage({ fatal: String((err && err.stack) || err) }); queue.length = 0; if (LINK) { const u = new Int32Array(LINK.mem.buffer), b = LINK.addr >>> 2; Atomics.store(u, b + 9, 1); Atomics.add(u, b, 1); Atomics.notify(u, b); } };
const record = body => { const seq = ++recSeq; recChain = recChain.then(() => fetch('/gfxrec', { method: 'POST', headers: { 'X-Gfxrec-Seq': String(seq) }, body })).catch(err => postMessage({ log: `[gfx worker] recording buffer ${seq} failed: ${err}` })); };

self.onmessage = e => {
  if (failed) return;
  const d = e.data;
  if (d.init) { rec = !!(d.env && d.env.REXCOMP_GFXREC); start(d).catch(fatal); return; }
  if (d.link) { LINK = d.link; if (G) G['rxcLink'] = LINK; linkPoll(); return; }
  if (d.glcheck) { if (G) G._gfxw_glcheck(d.glcheck | 0); return; }        // debug: glGetError after every GL call of the next n frames ([gl] error lines)
  if (d.readtex) {                                                       // debug: {readtex: [gl texture, w, h, isFloat, name]} -> {img: {name, w, h, data}} (rows top-down)
    if (G) { const [tex, w, h, fl, name] = d.readtex; const p = G._gfxw_readtex(tex, w, h, fl) >>> 0;
      if (!p) postMessage({ log: `[gfx worker] readtex ${tex}: not a complete colour attachment` });
      else { const src = G.HEAPU8.subarray(p, p + w * h * 4), out = new Uint8Array(w * h * 4); for (let y = 0; y < h; y++) out.set(src.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4);
        G._free(p); for (let i = 3; i < out.length; i += 4) out[i] = 255; postMessage({ img: { name, w, h, data: out } }, [out.buffer]); } }
    return; }
  if (d.passlog) { if (G) G['__passlog'] = d.passlog | 0; return; }   // debug: log the next n frames' passes (gfx_host_passlog)
  if (rec && d.cmds) record(d.cmds.slice(0, d.len !== undefined ? d.len : d.cmds.byteLength));
  if (d.gputime) { if (G) G['__gputime'] = d.gputime | 0; return; }
  if (d.override) {
    if (G) { const b = new TextEncoder().encode(String(d.override) + '\0'), p = G._malloc(b.length); G.HEAPU8.set(b, p); G._gfxw_override(p); G._free(p); }
    return; }
  if (d.skipshader !== undefined) { if (G) { G['__skipshader'] = String(d.skipshader); G['__skipver'] = (G['__skipver'] | 0) + 1; } return; }
  if (d.glsl) {
    if (G) { const h = String(d.glsl), p = G._malloc(h.length + 1); for (let i = 0; i < h.length; i++) G.HEAPU8[p + i] = h.charCodeAt(i) & 255; G.HEAPU8[p + h.length] = 0;
      const r = G._gfxw_glsl(p) >>> 0; G._free(p); let s = ''; if (r) { let e = r; while (G.HEAPU8[e]) e++; s = new TextDecoder().decode(G.HEAPU8.slice(r, e)); }
      postMessage({ log: '[glsl ' + h + ']\n' + (s || '(not found)') }); }
    return; }   // debug: log the next n frames' passes (gfx_host_passlog)
  if (d.vkglsl) {
    if (G) {
      const hash = String(d.vkglsl), bytes = new TextEncoder().encode(hash + '\0'), p = G._malloc(bytes.length);
      G.HEAPU8.set(bytes, p);
      const r = G._gfxw_vkglsl(p) >>> 0; G._free(p);
      let source = '';
      if (r) { let end = r; while (G.HEAPU8[end]) end++; source = new TextDecoder().decode(G.HEAPU8.slice(r, end)); G._free(r); }
      postMessage({ vkglsl: { hash, source } });
    }
    return;
  }
  queue.push(d);
  if (G) pump();
};

async function start(d) {
  importScripts('rexcomp_gfx.js');
  // The page handed this worker the canvas (transferControlToOffscreen), so a lost WebGL context - a GPU reset, a
  // driver recovery, the GPU process running out of memory on a Chromebook - only arrives here: tell the page, which
  // offers a reload (the engine cannot rebuild its GL resources).
  try {
    d.canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); postMessage({ lost: 1 }); });
    d.canvas.addEventListener('webglcontextrestored', () => postMessage({ restored: 1 }));
  } catch (e) { postMessage({ log: '[gfx worker] cannot watch the context: ' + String(e) }); }
  const shadowMB = Number(d.env?.REXCOMP_TEXTURE_SHADOW_MB) || 0;
  let shadowStore = null;
  if (shadowMB > 0 && shadowMB <= 2048) {
    try { importScripts('shadow_store.js'); shadowStore = await rxcCreateShadowStore(); }
    catch (e) { postMessage({ log: '[gfx worker] texture backing unavailable: ' + String(e) }); }
  }
  let pairs = null;
  if (!d.noprelink) {
    const seen = new Set(), list = [];
    const take = arr => { for (const e of arr || []) if (typeof e === 'string' && !seen.has(e)) { seen.add(e); list.push(e); } };
    try { const r = await fetch('programs.json'); if (r.ok) take(await r.json()); } catch (e) {}
    take(d.learned);
    if (list.length) { pairs = new Map(); const add = (k, v) => { let a = pairs.get(k); if (!a) pairs.set(k, a = []); a.push(v); };
      for (const e of list) { const [v, p] = e.split(':'); if (!v || !p) continue; add('v' + v, p); if (p !== '-') add('p' + p, v); } }
  }
  // debug: ?REXCOMP_GLSHADERS=1&REXCOMP_SRCWANT=<hash16>,<hash16>,... uploads those shaders' GLSL to shots/<kind>_<hash>.glsl
  // (gfx_gl.c logs "[shader] ps id N = ps_<hash>" right after glShaderSource, so the last source seen is that shader's)
  // (shaders are translated on the engine thread, so the worker cannot see hashes: REXCOMP_SRCGREP=<regex> instead uploads
  // every shader source matching it as shots/src_<n>.glsl, at most 60)
  const grep = (d.env || {}).REXCOMP_SRCGREP;
  if (grep) { const re = new RegExp(grep), ss = WebGL2RenderingContext.prototype.shaderSource; let n = 0;
    WebGL2RenderingContext.prototype.shaderSource = function (sh, src) { if (n < 60 && re.test(src)) { const k = n++; fetch('/upload/src_' + String(k).padStart(2, '0') + '.glsl', { method: 'POST', body: src }); } return ss.call(this, sh, src); }; }
  // debug: ?REXCOMP_GLCOUNT=1 counts the WebGL calls by name -> "[glcount]" every 10 s, calls per second (the top 28)
  if ((d.env || {}).REXCOMP_GLCOUNT) {
    const P = WebGL2RenderingContext.prototype, cnt = new Map(), sc = new Map(), stk = String(d.env.REXCOMP_GLSTACK || '').split(',');
    for (const k of Object.getOwnPropertyNames(P)) {
      const desc = Object.getOwnPropertyDescriptor(P, k);
      if (!desc || typeof desc.value !== 'function' || k === 'constructor') continue;
      const f = desc.value; cnt.set(k, 0);
      // ?REXCOMP_GLSTACK=name,name: also attribute every 4th call of those to its callers -> "[glstack]" (the top 16 chains)
      if (stk.includes(k)) P[k] = function (...a) { const n = cnt.get(k) + 1; cnt.set(k, n);
        if (!(n & 3)) { const s = k + ': ' + String(new Error().stack).split('\n').slice(2, 9).map(l => l.trim().replace(/^at /, '').replace(/ \(.*$/, '').replace(/^.*wasm-function\[/, 'fn[')).join(' < '); sc.set(s, (sc.get(s) || 0) + 1); }
        return f.apply(this, a); };
      else P[k] = function (...a) { cnt.set(k, cnt.get(k) + 1); return f.apply(this, a); };
    }
    let t0 = performance.now();
    setInterval(() => { const t = performance.now(), s = (t - t0) / 1000; t0 = t; const top = [...cnt].filter(e => e[1]).sort((a, b) => b[1] - a[1]); let tot = 0; for (const e of top) tot += e[1];
      postMessage({ log: `[glcount] ${(tot / s).toFixed(0)} WebGL calls/s: ` + top.slice(0, 28).map(e => `${e[0]} ${(e[1] / s).toFixed(0)}`).join(', ') }); for (const k of cnt.keys()) cnt.set(k, 0);
      if (sc.size) { postMessage({ log: '[glstack] ' + [...sc].sort((a, b) => b[1] - a[1]).slice(0, 16).map(e => `${(e[1] * 4 / s).toFixed(0)}/s ${e[0]}`).join('\n[glstack] ') }); sc.clear(); } }, 10000);
  }
  const onPrint = s => postMessage({ log: s });
  G = await RexcompGfx({
    canvas: d.canvas, rxcwPairs: pairs, rxcShadowStore: shadowStore, rxcShadowMB: shadowMB,
    preRun: [m => { for (const k in (d.env || {})) m.ENV[k] = d.env[k]; }],
    print: onPrint, printErr: onPrint,
  });
  if (LINK) G['rxcLink'] = LINK;
  postMessage({ log: '[gfx worker] ready' + (pairs ? ` (pre-link list: ${pairs.size} shaders)` : '') + (LINK ? ', commands through shared memory' : '') });
  pump();
}

function linkPoll() {
  if (failed) return;
  const L = LINK, u = new Int32Array(L.mem.buffer), b = L.addr >>> 2, head = Atomics.load(u, b + 6) >>> 0;
  let tail = u[b + 7] >>> 0;
  if (head !== tail) {
    const u32 = new Uint32Array(L.mem.buffer);
    for (; tail !== head; tail = (tail + 1) >>> 0) {
      const e = b + L.cmdAt + (tail % L.cmdCap) * 4;
      const src = new Uint8Array(L.mem.buffer, u32[e], u32[e + 1]), seq = u32[e + 2];
      if (rec) record(src.slice().buffer);
      // Copy a lone command into the wasm input buffer before releasing its shared ring slot.
      if (G && !running && !queue.length && ((head - tail) >>> 0) === 1) {
        const n = src.byteLength;
        if (n > inCap) { if (inPtr) G._free(inPtr); inCap = Math.max(n, inCap * 2, 1 << 20); inPtr = G._malloc(inCap) >>> 0; }
        G.HEAPU8.set(src, inPtr);
        if (seq !== lastSeq + 1) postMessage({ log: `[gfx worker] buffer ${seq} arrived after ${lastSeq}` });
        lastSeq = seq;
        queue.push({ pos: 0, n: n >> 2 });
      } else queue.push({ cmds: src.slice().buffer, seq });
      Atomics.store(u, b + 7, (tail + 1) | 0);
    }
    Atomics.add(u, b, 1); Atomics.notify(u, b);
    if (G) pump();
  }
  const r = Atomics.waitAsync(u, b + 6, head | 0);
  if (r.async) r.value.then(linkPoll); else Promise.resolve().then(linkPoll);
}

function pump() {
  if (failed || running || !G) return;
  running = true;
  try {
    while (queue.length) {
      const m = queue[0];
      if (m.cmds || m.pos !== undefined) {                    // (a buffer resumed after a yield has cmds = null)
        if (m.pos === undefined) {
          if (m.t) { st.lat += performance.timeOrigin + performance.now() - m.t; st.nlat++; }
          if (m.seq !== undefined) { if (m.seq !== lastSeq + 1) postMessage({ log: `[gfx worker] buffer ${m.seq} arrived after ${lastSeq}` }); lastSeq = m.seq; }
          const n = m.len !== undefined ? m.len : m.cmds.byteLength;
          if (n > inCap) {
            if (inPtr) G._free(inPtr);
            inCap = Math.max(n, inCap * 2, 1 << 20); inPtr = G._malloc(inCap) >>> 0;
            if (!inPtr) { inCap = n; inPtr = G._malloc(n) >>> 0; }
            if (!inPtr) { inCap = 0; throw new Error(`[gfx worker] no memory for a ${(n / 1048576).toFixed(1)} MB command buffer (worker memory ${(G.HEAPU8.length / 1048576) | 0} MB)`); }
          }
          const mb = G.HEAPU8.length >>> 20;
          if (mb >= memLogged + 256) { memLogged = mb; postMessage({ log: `[gfx worker] memory ${mb} MB (largest command buffer ${(inCap / 1048576).toFixed(1)} MB)` }); }
          G.HEAPU8.set(new Uint8Array(m.cmds, 0, n), inPtr); m.pos = 0; m.n = n >> 2;
          if (m.len !== undefined) postMessage({ ret: m.cmds }, [m.cmds]);
          m.cmds = null;
        }
        const at = m.pos, t0 = performance.now(), r = G._gfxw_run(inPtr, m.n, m.pos), t1 = performance.now();
        st.busy += t1 - t0; if (t1 - st.t0 > 1000) {
          const pos = r < 0 ? m.n : r, u = G.HEAPU8, view = new DataView(u.buffer), next = pos < m.n && (inPtr + pos * 4 + 24) <= u.length
            ? Array.from({ length: 6 }, (_, i) => view.getUint32(inPtr + (pos + i) * 4, true)) : [];
          postMessage({ wstat: { busy: st.busy / (t1 - st.t0), lat: st.nlat ? st.lat / st.nlat : 0,
            queue: queue.length, seq: lastSeq, pos, words: m.n, next, prelinks: G._gfxw_prelinks?.() || 0, shadows: G['rxcShadowStore']?.stats } });
          st.t0 = t1; st.busy = 0; st.lat = 0; st.nlat = 0;
        }
        // A replay retry at the same word waits for the GPU: a fence, or the program of a draw that must not be skipped
        // (gfx_draw). Let the GPU process run before polling again.
        if (r >= 0) { m.pos = r; running = false; if (r === at) setTimeout(pump, 2); else hop(pump); return; }
      }
      const finished = queue.shift();
      if (finished.ack) postMessage({ ack: finished.seq });
    }
  } catch (err) { fatal(err); }
  running = false;
  idlePoll(0);
}
// occlusion queries still outstanding after the queue ran dry: poll every ~2 ms for up to 20 ms (results must reach the
// engine thread before it starts its next frame); readbacks and optional prelinks: until their queues drain
let pollTimer = 0, pollUntil = 0;
function idlePoll(t) {
  if (failed || !G) return;
  if (!t) { pollUntil = performance.now() + 20; if (pollTimer) return; }
  pollTimer = 0;
  if (running || queue.length) return;
  const t0 = performance.now(), live = G._gfxw_poll(); st.busy += performance.now() - t0;
  if ((live & 6) || (live && performance.now() < pollUntil)) pollTimer = self.scheduler && scheduler.postTask ? (scheduler.postTask(() => idlePoll(1), { delay: 2 }), 1) : setTimeout(() => idlePoll(1), 2);
}
