// Graphics worker: replays the GL command stream recorded by rt/web/gl_remote.c on a WebGL2 context over the page's
// transferred canvas. One message per flush ({cmds, seq, frame}); frames are acknowledged ({done: seq}) so the game
// stays at most one frame ahead. Opcodes must match gl_remote.c.
'use strict';
let gl = null, canvas = null, pcs = null, anisoExt = null;
const objs = [null];                         // recorder id -> WebGL object
const locDef = new Map();                    // location id (x1024) -> {prog, name}
const locCache = new Map();                  // location id + element -> WebGLUniformLocation | null
const progs = new Map();                     // program id -> {ready}
let curProg = 0, skipDraws = false, dec = new TextDecoder();
// texSubImage2D wants the typed array matching the pixel type (a Uint8Array only for UNSIGNED_BYTE)
function texView(d, ty) {
  const b = d.buffer, o = d.byteOffset, n = d.byteLength;
  switch (ty) {
    case 0x1400: return new Int8Array(b, o, n);                                                  // BYTE (snorm)
    case 0x1402: return new Int16Array(b, o, n >> 1);                                            // SHORT
    case 0x1403: case 0x140B: case 0x8363: case 0x8033: case 0x8034: return new Uint16Array(b, o, n >> 1);   // USHORT, HALF_FLOAT, packed 16-bit
    case 0x1404: return new Int32Array(b, o, n >> 2);                                            // INT
    case 0x1405: case 0x8368: case 0x8C3B: case 0x8C3E: case 0x84FA: return new Uint32Array(b, o, n >> 2);   // UINT, packed 32-bit
    case 0x1406: return new Float32Array(b, o, n >> 2);                                          // FLOAT
    default: return d;
  }
}
let ubo = null;                              // the uniform buffer holding each flush's shader constants
let streamV = null, streamI = null;          // the buffers the per-flush vertex / index arenas are uploaded into
// occlusion queries awaiting their result ([id, generation, query]): polled on a timer of their own (the game thread may
// be spinning on one, submitting nothing) and posted back in batches
// A frame's answers go back together once all of its queries have one: the game waits on the previous frame's queries,
// so it then waits once per frame instead of once per query. Answers of the frame still being recorded go back as soon as
// no query has ended for 2 ms (the game may be waiting on one mid-frame).
let curQuery = null, pendingQ = [], qTimer = 0, qFrame = 0, qLastEnd = 0;   // entries: [id, generation, query, frame, answer]
function pollQueries() {
  qTimer = 0;
  for (const e of pendingQ) if (e[4] === undefined && gl.getQueryParameter(e[2], gl.QUERY_RESULT_AVAILABLE)) e[4] = gl.getQueryParameter(e[2], gl.QUERY_RESULT) ? 1000 : 0;
  const quiet = performance.now() - qLastEnd > 2, out = [];
  while (pendingQ.length) {
    const f = pendingQ[0][3]; let n = 0, ready = true;
    while (n < pendingQ.length && pendingQ[n][3] === f) { if (pendingQ[n][4] === undefined) ready = false; n++; }
    if (!ready || (f === qFrame && !quiet)) break;                 // the oldest frame is not answered yet
    for (const e of pendingQ.splice(0, n)) out.push([e[0], e[1], e[4]]);
  }
  if (out.length) postMessage({ q: out });
  if (pendingQ.length) pollQueriesSoon();
}
function pollQueriesSoon() { if (!qTimer) qTimer = setTimeout(pollQueries, 1); }
let stats = { frames: 0, skipped: 0, execMs: 0 };

function init(d) {
  canvas = d.canvas;
  gl = canvas.getContext('webgl2', { alpha: false, depth: false, stencil: false, antialias: false, premultipliedAlpha: false,
                                      preserveDrawingBuffer: !!d.preserve, powerPreference: 'high-performance' });
  if (!gl) { postMessage({ fatal: 'WebGL2 is not available in the worker' }); return; }
  gl.getExtension('WEBGL_compressed_texture_s3tc');
  gl.getExtension('EXT_color_buffer_float');     // float render targets (UE3 scene colour: RGBA16F)
  gl.getExtension('EXT_float_blend');
  gl.getExtension('OES_texture_float_linear');
  anisoExt = gl.getExtension('EXT_texture_filter_anisotropic');
  pcs = gl.getExtension('KHR_parallel_shader_compile');
  if (pcs && pcs.maxShaderCompilerThreadsKHR) pcs.maxShaderCompilerThreadsKHR(0xFFFFFFFF);
  canvas.addEventListener && canvas.addEventListener('webglcontextlost', () => postMessage({ lost: true }));
}

function loc(id) {
  let l = locCache.get(id);
  if (l !== undefined) return l;
  const base = id - (id % 1024), k = id - base, def = locDef.get(base);
  l = null;
  if (def) { const p = objs[def.prog]; if (p) l = gl.getUniformLocation(p, k ? def.name + '[' + k + ']' : def.name); }
  locCache.set(id, l);
  return l;
}

function exec(buf, bytes) {
  const u = new Uint32Array(buf), i32 = new Int32Array(buf), f = new Float32Array(buf), b8 = new Uint8Array(buf);
  const n = bytes >> 2;
  let p = 0;
  const blob = () => { const len = u[p++], off = p * 4; p += (len + 3) >> 2; return b8.subarray(off, off + len); };
  while (p < n) {
    const op = u[p++];
    const t0 = T ? performance.now() : 0;
    switch (op) {
      case 1: gl.enable(u[p++]); break;
      case 2: gl.disable(u[p++]); break;
      case 3: gl.viewport(i32[p], i32[p + 1], i32[p + 2], i32[p + 3]); p += 4; break;
      case 4: gl.scissor(i32[p], i32[p + 1], i32[p + 2], i32[p + 3]); p += 4; break;
      case 5: gl.clear(u[p++]); break;
      case 6: gl.clearColor(f[p], f[p + 1], f[p + 2], f[p + 3]); p += 4; break;
      case 7: gl.clearDepth(f[p++]); break;
      case 8: gl.clearStencil(i32[p++]); break;
      case 9: gl.colorMask(!!u[p], !!u[p + 1], !!u[p + 2], !!u[p + 3]); p += 4; break;
      case 10: gl.depthMask(!!u[p++]); break;
      case 11: gl.depthFunc(u[p++]); break;
      case 12: gl.depthRange(f[p], f[p + 1]); p += 2; break;
      case 13: gl.stencilFuncSeparate(u[p], u[p + 1], i32[p + 2], u[p + 3]); p += 4; break;
      case 14: gl.stencilOpSeparate(u[p], u[p + 1], u[p + 2], u[p + 3]); p += 4; break;
      case 15: gl.stencilMaskSeparate(u[p], u[p + 1]); p += 2; break;
      case 16: gl.blendFuncSeparate(u[p], u[p + 1], u[p + 2], u[p + 3]); p += 4; break;
      case 17: gl.blendEquationSeparate(u[p], u[p + 1]); p += 2; break;
      case 18: gl.blendColor(f[p], f[p + 1], f[p + 2], f[p + 3]); p += 4; break;
      case 19: gl.cullFace(u[p++]); break;
      case 20: gl.frontFace(u[p++]); break;
      case 21: gl.polygonOffset(f[p], f[p + 1]); p += 2; break;
      case 22: objs[u[p++]] = gl.createBuffer(); break;
      case 23: { const id = u[p++]; gl.deleteBuffer(objs[id]); objs[id] = null; break; }
      case 24: gl.bindBuffer(u[p], objs[u[p + 1]] || null); p += 2; break;
      case 25: { const t = u[p], size = u[p + 1], usage = u[p + 2], has = u[p + 3]; p += 4;
                 if (has) gl.bufferData(t, blob(), usage); else gl.bufferData(t, size, usage); break; }
      case 26: { const t = u[p], off = u[p + 1]; p += 2; const d = blob(); if (!DBG.noBufSub) gl.bufferSubData(t, off, d); break; }
      case 27: objs[u[p++]] = gl.createTexture(); break;
      case 28: { const id = u[p++]; gl.deleteTexture(objs[id]); objs[id] = null; break; }
      case 29: if (!DBG.noTex) gl.bindTexture(u[p], objs[u[p + 1]] || null); p += 2; break;
      case 30: gl.texStorage2D(u[p], i32[p + 1], u[p + 2], i32[p + 3], i32[p + 4]); p += 5; break;
      case 31: { const t = u[p], lv = i32[p + 1], x = i32[p + 2], y = i32[p + 3], w = i32[p + 4], h = i32[p + 5], fmt = u[p + 6], ty = u[p + 7]; p += 8;
                 gl.texSubImage2D(t, lv, x, y, w, h, fmt, ty, texView(blob(), ty)); break; }
      case 32: { const t = u[p], lv = i32[p + 1], x = i32[p + 2], y = i32[p + 3], w = i32[p + 4], h = i32[p + 5], fmt = u[p + 6]; p += 7;
                 gl.compressedTexSubImage2D(t, lv, x, y, w, h, fmt, blob()); break; }
      case 33: gl.activeTexture(u[p++]); break;
      case 34: gl.pixelStorei(u[p], i32[p + 1]); p += 2; break;
      case 35: objs[u[p++]] = gl.createSampler(); break;
      case 36: gl.bindSampler(u[p], objs[u[p + 1]] || null); p += 2; break;
      case 37: gl.samplerParameteri(objs[u[p]], u[p + 1], i32[p + 2]); p += 3; break;
      case 38: { const s = objs[u[p]], pn = u[p + 1], v = f[p + 2]; p += 3;
                 if (pn === 0x84FE && !anisoExt) break; gl.samplerParameterf(s, pn, v); break; }
      case 39: objs[u[p++]] = gl.createFramebuffer(); break;
      case 40: { const id = u[p++]; gl.deleteFramebuffer(objs[id]); objs[id] = null; break; }
      case 41: gl.bindFramebuffer(u[p], objs[u[p + 1]] || null); p += 2; break;
      case 42: gl.framebufferTexture2D(u[p], u[p + 1], u[p + 2], objs[u[p + 3]] || null, i32[p + 4]); p += 5; break;
      case 43: gl.framebufferRenderbuffer(u[p], u[p + 1], u[p + 2], objs[u[p + 3]] || null); p += 4; break;
      case 44: gl.blitFramebuffer(i32[p], i32[p + 1], i32[p + 2], i32[p + 3], i32[p + 4], i32[p + 5], i32[p + 6], i32[p + 7], u[p + 8], u[p + 9]); p += 10; break;
      case 45: objs[u[p++]] = gl.createRenderbuffer(); break;
      case 46: { const id = u[p++]; gl.deleteRenderbuffer(objs[id]); objs[id] = null; break; }
      case 47: gl.bindRenderbuffer(u[p], objs[u[p + 1]] || null); p += 2; break;
      case 48: gl.renderbufferStorage(u[p], u[p + 1], i32[p + 2], i32[p + 3]); p += 4; break;
      case 49: objs[u[p]] = gl.createShader(u[p + 1]); p += 2; break;
      case 50: { const s = objs[u[p++]]; gl.shaderSource(s, dec.decode(blob())); break; }
      case 51: gl.compileShader(objs[u[p++]]); break;
      case 52: { const id = u[p++]; gl.deleteShader(objs[id]); objs[id] = null; break; }
      case 53: { const id = u[p++]; objs[id] = gl.createProgram(); progs.set(id, { ready: false, shaders: [] }); break; }
      case 54: { const pr = u[p], s = u[p + 1]; p += 2; gl.attachShader(objs[pr], objs[s]); const e = progs.get(pr); if (e) e.shaders.push(objs[s]); break; }
      case 55: { const pr = u[p++]; gl.linkProgram(objs[pr]); break; }
      case 56: { const pr = u[p++]; curProg = pr; skipDraws = pr ? !ready(pr) : false; gl.useProgram(skipDraws ? null : objs[pr] || null); break; }
      case 57: { const id = u[p++]; gl.deleteProgram(objs[id]); objs[id] = null; progs.delete(id); break; }
      case 58: { const id = u[p], pr = u[p + 1]; p += 2; locDef.set(id, { prog: pr, name: dec.decode(blob()) }); break; }
      case 59: { const id = u[p], v = i32[p + 1]; p += 2; if (!skipDraws) { const l = loc(id); if (l) gl.uniform1i(l, v); } else deferUniform(id, 'i', v); break; }
      case 60: { const id = u[p], cnt = u[p + 1], len = u[p + 2], at = p + 3; p = at + ((len + 3) >> 2);
                 // a small view: uniform4fv(l, f, offset, length) over the whole command buffer is ~5x slower in Chrome
                 if (DBG.noUniforms) break;
                 if (!skipDraws) { const l = loc(id); if (l) gl.uniform4fv(l, f.subarray(at, at + cnt * 4)); } else deferUniform(id, 'f', f.slice(at, at + cnt * 4)); break; }
      case 61: objs[u[p++]] = gl.createVertexArray(); break;
      case 62: if (!DBG.noVao) gl.bindVertexArray(objs[u[p]] || null); p++; break;
      case 63: gl.enableVertexAttribArray(u[p++]); break;
      case 64: gl.disableVertexAttribArray(u[p++]); break;
      case 65: gl.vertexAttribPointer(u[p], i32[p + 1], u[p + 2], !!u[p + 3], i32[p + 4], u[p + 5]); p += 6; break;
      case 66: gl.vertexAttrib4f(u[p], f[p + 1], f[p + 2], f[p + 3], f[p + 4]); p += 5; break;
      case 67: { const m = u[p], first = i32[p + 1], cnt = i32[p + 2]; p += 3; if (drawOk()) gl.drawArrays(m, first, cnt); break; }
      case 68: { const m = u[p], cnt = i32[p + 1], ty = u[p + 2], off = u[p + 3]; p += 4; if (drawOk() && !DBG.noDraws) gl.drawElements(m, cnt, ty, off); break; }
      case 69: { const w = u[p], h = u[p + 1]; p += 2; if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; } break; }
      case 70: stats.frames++; qFrame++; break;
      case 71: { const id = u[p++]; gl.deleteVertexArray(objs[id]); objs[id] = null; break; }
      case 72: { const id = u[p], cnt = u[p + 1], len = u[p + 2], at = p + 3; p = at + ((len + 3) >> 2);
                 if (!skipDraws) { const l = loc(id); if (l) gl.uniform4iv(l, i32.subarray(at, at + cnt * 4)); } else deferUniform(id, 'iv', i32.slice(at, at + cnt * 4)); break; }
      case 73: gl.vertexAttribDivisor(u[p], u[p + 1]); p += 2; break;
      case 74: { const m = u[p], cnt = i32[p + 1], ty = u[p + 2], off = u[p + 3], n = i32[p + 4]; p += 5; if (drawOk() && !DBG.noDraws) gl.drawElementsInstanced(m, cnt, ty, off, n); break; }
      case 75: { const n = u[p], b = [u[p + 1], u[p + 2], u[p + 3], u[p + 4]].slice(0, n); p += 5; gl.drawBuffers(b); break; }
      case 76: gl.texParameteri(u[p], u[p + 1], i32[p + 2]); p += 3; break;
      case 79: objs[u[p++]] = gl.createQuery(); break;
      case 83: { const vid = u[p], iid = u[p + 1]; p += 2;                      // stream arenas: typed on creation (outside any VAO)
                 const vao = gl.getParameter(gl.VERTEX_ARRAY_BINDING), eb = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING), ab = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
                 objs[vid] = gl.createBuffer(); objs[iid] = gl.createBuffer(); streamV = objs[vid]; streamI = objs[iid];
                 gl.bindVertexArray(null); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, streamI); gl.bindBuffer(gl.ARRAY_BUFFER, streamV);
                 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, ab); if (!vao) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eb);
                 break; }
      case 80: { const tg = u[p], id = u[p + 1], gen = u[p + 2]; p += 3; const q = objs[id]; if (q) { gl.beginQuery(tg, q); curQuery = [id, gen, q]; } break; }
      case 81: { const tg = u[p++]; if (curQuery) { gl.endQuery(tg); curQuery.push(qFrame); pendingQ.push(curQuery); curQuery = null; qLastEnd = performance.now(); pollQueriesSoon(); } break; }
      case 82: { const id = u[p++]; if (objs[id]) gl.deleteQuery(objs[id]); objs[id] = null; break; }
      case 77: { const bi = u[p], off = u[p + 1], sz = u[p + 2]; p += 3; if (!DBG.noUniforms) gl.bindBufferRange(gl.UNIFORM_BUFFER, bi, ubo, off, sz); break; }
      case 78: { const pr = u[p], bi = u[p + 1]; p += 2; const name = dec.decode(blob()); const e = progs.get(pr);
                 if (e && e.ready) { const idx = gl.getUniformBlockIndex(objs[pr], name); if (idx !== gl.INVALID_INDEX) gl.uniformBlockBinding(objs[pr], idx, bi); }
                 else if (e) (e.blocks || (e.blocks = [])).push([name, bi]);
                 break; }
      default: throw new Error('gl worker: bad opcode ' + op + ' at word ' + (p - 1));
    }
    if (T) { T[op] += performance.now() - t0; TC[op]++; }
  }
}
// dev: {timing: ms} -> {timingResult}: time per opcode (5 us timer: meaningful as averages over many calls)
let T = null, TC = null; const DBG = {};
async function timing(ms) {
  T = new Float64Array(80); TC = new Uint32Array(80); const f0 = stats.frames, t0 = performance.now(), e0 = stats.execMs;
  await new Promise(r => setTimeout(r, ms));
  const fr = stats.frames - f0, res = [];
  for (let i = 0; i < 80; i++) if (TC[i]) res.push([i, T[i] / fr, TC[i] / fr]);
  res.sort((a, b) => b[1] - a[1]);
  postMessage({ timingResult: { frames: fr, wallMsPerFrame: (performance.now() - t0) / fr, execMsPerFrame: (stats.execMs - e0) / fr,
    ops: res.slice(0, 16).map(([op, ms, c]) => 'op' + op + ' ' + ms.toFixed(3) + 'ms x' + c.toFixed(0)).join(', ') } });
  T = TC = null;
}

// a program still compiling in the background (parallel compile): its draws are skipped instead of stalling the frame.
// Uniforms set while it is skipped are kept and applied (in order) when it becomes current and ready.
const pending = new Map();
function drawOk() {                          // a skipped program may have finished compiling since it became current
  if (!skipDraws) return true;
  if (ready(curProg)) { skipDraws = false; gl.useProgram(objs[curProg]); return true; }
  stats.skipped++; return false;
}
function deferUniform(id, kind, v) { let l = pending.get(curProg); if (!l) pending.set(curProg, l = []); l.push([id, kind, v]); }
function ready(pr) {
  const e = progs.get(pr); if (!e) return true;
  if (e.ready) return true;
  // the status query is a synchronous round trip to the GPU process: a still-compiling program is asked at most once
  // per frame (Unreal switches between hundreds of programs a frame while thousands compile in the background)
  if (pcs && e.polled === stats.frames) return false;
  e.polled = stats.frames;
  if (pcs && !gl.getProgramParameter(objs[pr], 0x91B1 /* COMPLETION_STATUS_KHR */)) return false;
  if (!gl.getProgramParameter(objs[pr], gl.LINK_STATUS)) {
    const logs = e.shaders.map(s => gl.getShaderInfoLog(s)).join('\n');
    postMessage({ log: '[gl worker] program link failed: ' + gl.getProgramInfoLog(objs[pr]) + '\n' + logs });
  }
  e.ready = true;
  if (e.blocks) for (const [name, bi] of e.blocks) { const idx = gl.getUniformBlockIndex(objs[pr], name); if (idx !== gl.INVALID_INDEX) gl.uniformBlockBinding(objs[pr], idx, bi); }
  const l = pending.get(pr);
  if (l) { gl.useProgram(objs[pr]); for (const [id, kind, v] of l) { const lo = loc(id); if (lo) { if (kind === 'i') gl.uniform1i(lo, v); else if (kind === 'iv') gl.uniform4iv(lo, v); else gl.uniform4fv(lo, v); } } pending.delete(pr); }
  return true;
}

onmessage = (e) => {
  const d = e.data;
  if (d.init) { init(d); return; }
  if (d.timing) { timing(d.timing); return; }
  if (d.dbg) { Object.assign(DBG, d.dbg); return; }     // dev: {dbg: {noUniforms, noDraws}} measurement switches
  if (d.cmds) {
    const t0 = performance.now();
    try {
      // this flush's arenas first (through COPY_WRITE_BUFFER: the recorded vertex / element bindings stay as they are)
      if (d.vsBytes && streamV) { gl.bindBuffer(gl.COPY_WRITE_BUFFER, streamV); gl.bufferData(gl.COPY_WRITE_BUFFER, new Uint8Array(d.vs, 0, d.vsBytes), gl.STREAM_DRAW); }
      if (d.isBytes && streamI) { gl.bindBuffer(gl.COPY_WRITE_BUFFER, streamI); gl.bufferData(gl.COPY_WRITE_BUFFER, new Uint8Array(d.is, 0, d.isBytes), gl.STREAM_DRAW); }
      if (d.ubBytes) {                              // this flush's shader constants first: its draws bind ranges of them
        if (!ubo) ubo = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo); gl.bufferData(gl.UNIFORM_BUFFER, new Uint8Array(d.ub, 0, d.ubBytes), gl.STREAM_DRAW);
      }
      exec(d.cmds, d.bytes === undefined ? d.cmds.byteLength : d.bytes);
    }
    catch (err) { postMessage({ fatal: String(err && err.stack || err) }); return; }
    stats.execMs += performance.now() - t0;
    // a frame's buffer goes back to the game thread's pool. Big mid-frame flushes (loading) are dropped here: the game
    // thread doesn't read its messages while it loads, so returned buffers would pile up in its queue.
    if (!d.frame) return;
    if (d.cmds.byteLength <= (8 << 20)) { const tr = [d.cmds], sb = []; if (d.ub) tr.push(d.ub); if (d.vs) { tr.push(d.vs); sb.push(d.vs); } if (d.is) { tr.push(d.is); sb.push(d.is); }
      postMessage({ done: d.seq, skipped: stats.skipped, execMs: stats.execMs, buf: d.cmds, ubuf: d.ub || undefined, sbufs: sb.length ? sb : undefined }, tr); }
    else postMessage({ done: d.seq, skipped: stats.skipped, execMs: stats.execMs });
  }
};

