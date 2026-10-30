/* Project Zomboid web port - host core: PNG decoder, WebGL fixed-function renderer, WebAudio, input, JVM native bindings.
 * Works in browsers (window.PZ) and Node (module.exports) - Node uses a stub renderer for headless tests.
 *
 * Performance notes (vs. the first version):
 *  - vertices are transformed once, at glVertex time, straight into the pending buffer; quads are emitted immediately
 *  - vertex colour is packed to 4 bytes (stride 20 instead of 32 bytes -> ~37% less upload bandwidth)
 *  - affine MVP fast path (no perspective divide) for the 2D sprite case
 *  - matrix ops are in-place on a pooled stack: zero allocations per translate/scale/rotate/push/pop
 *  - redundant GL state changes (bindTexture, blendFunc, viewport, texParameteri) are skipped
 *  - present() is skipped when nothing was drawn, and uses a static quad that lives in the main VBO
 *  - texRead() caches the readPixels result until the texture is modified
 */
(function (root) {
'use strict';
const PZ = {};
PZ.config = { preserveDrawingBuffer: false };

/* ---------------- PNG decoder (sync, needs pako.inflate) ---------------- */
PZ.decodePNG = function (bytes, inflate) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (u8[i] !== sig[i]) return null;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let pos = 8, w = 0, h = 0, depth = 0, ctype = 0, interlace = 0, plte = null, trns = null;
  const idat = [];
  while (pos + 8 <= u8.length) {
    const len = dv.getUint32(pos); const type = String.fromCharCode(u8[pos + 4], u8[pos + 5], u8[pos + 6], u8[pos + 7]);
    const d = u8.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') { w = dv.getUint32(pos + 8); h = dv.getUint32(pos + 12); depth = u8[pos + 16]; ctype = u8[pos + 17]; interlace = u8[pos + 20]; }
    else if (type === 'PLTE') plte = d; else if (type === 'tRNS') trns = d; else if (type === 'IDAT') idat.push(d);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (interlace) return null;
  let z;
  if (idat.length === 1) z = idat[0];
  else { let total = 0; for (const c of idat) total += c.length; z = new Uint8Array(total); let o = 0; for (const c of idat) { z.set(c, o); o += c.length; } }
  const raw = inflate(z);
  const chans = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype];
  const bpp = Math.max(1, (chans * depth) >> 3);
  const stride = (w * chans * depth + 7) >> 3;
  const px = new Uint8Array(stride * h);
  let prev = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = px.subarray(y * stride, (y + 1) * stride);
    switch (f) {
      case 0: cur.set(src); break;
      case 1: for (let i = 0; i < bpp && i < stride; i++) cur[i] = src[i];
              for (let i = bpp; i < stride; i++) cur[i] = src[i] + cur[i - bpp]; break;
      case 2: for (let i = 0; i < stride; i++) cur[i] = src[i] + prev[i]; break;
      case 3: for (let i = 0; i < bpp && i < stride; i++) cur[i] = src[i] + (prev[i] >> 1);
              for (let i = bpp; i < stride; i++) cur[i] = src[i] + ((cur[i - bpp] + prev[i]) >> 1); break;
      case 4: for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        cur[i] = src[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
      } break;
      default: return null;
    }
    prev = cur;
  }
  // Fast paths for the common 8-bit cases (no per-pixel closure calls)
  if (depth === 8 && ctype === 6) return { w, h, rgba: px, hasAlpha: true };
  if (depth === 8 && ctype === 2 && !trns) {
    const o3 = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
      let s = y * stride, d = y * w * 4;
      for (let x = 0; x < w; x++, s += 3, d += 4) { o3[d] = px[s]; o3[d + 1] = px[s + 1]; o3[d + 2] = px[s + 2]; o3[d + 3] = 255; }
    }
    return { w, h, rgba: o3, hasAlpha: false };
  }
  if (depth === 8 && ctype === 3) {
    const o1 = new Uint8Array(w * h * 4), pl = plte, tn = trns, tl = tn ? tn.length : 0;
    for (let y = 0, d = 0; y < h; y++) {
      for (let x = 0, s = y * stride; x < w; x++, s++, d += 4) {
        const k = px[s] * 3, a = px[s] < tl ? tn[px[s]] : 255;
        o1[d] = pl[k]; o1[d + 1] = pl[k + 1]; o1[d + 2] = pl[k + 2]; o1[d + 3] = a;
      }
    }
    return { w, h, rgba: o1, hasAlpha: trns !== null };
  }
  const out = new Uint8Array(w * h * 4); let hasAlpha = ctype === 4 || ctype === 6 || (trns !== null);
  const sample = (row, idx) => {          // idx-th sample in row, scaled to 8 bit (palette: raw index)
    if (depth === 8) return row[idx];
    if (depth === 16) return row[idx * 2];
    const per = 8 / depth, bit = (idx % per) * depth, v = (row[(idx / per) | 0] >> (8 - depth - bit)) & ((1 << depth) - 1);
    return ctype === 3 ? v : Math.round(v * 255 / ((1 << depth) - 1));
  };
  for (let y = 0; y < h; y++) {
    const row = px.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; let r, g, b, a = 255;
      if (ctype === 6) { r = sample(row, x * 4); g = sample(row, x * 4 + 1); b = sample(row, x * 4 + 2); a = sample(row, x * 4 + 3); }
      else if (ctype === 2) { r = sample(row, x * 3); g = sample(row, x * 3 + 1); b = sample(row, x * 3 + 2);
        if (trns && depth === 8 && r === trns[1] && g === trns[3] && b === trns[5]) a = 0; }
      else if (ctype === 0) { r = g = b = sample(row, x); if (trns && depth === 8 && r === trns[1]) a = 0; }
      else if (ctype === 4) { r = g = b = sample(row, x * 2); a = sample(row, x * 2 + 1); }
      else { const idx = sample(row, x); r = plte[idx * 3]; g = plte[idx * 3 + 1]; b = plte[idx * 3 + 2]; a = trns && idx < trns.length ? trns[idx] : 255; }
      out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = a;
    }
  }
  return { w, h, rgba: out, hasAlpha };
};

/* ---------------- Input state (filled by DOM events in browser) ---------------- */
PZ.input = { mx: 0, my: 0, buttons: 0, wheel: 0, active: 1, w: 800, h: 600, keys: new Uint8Array(256), events: [] };
const SC = { Escape: 1, Digit1: 2, Digit2: 3, Digit3: 4, Digit4: 5, Digit5: 6, Digit6: 7, Digit7: 8, Digit8: 9, Digit9: 10, Digit0: 11, Minus: 12, Equal: 13,
  Backspace: 14, Tab: 15, KeyQ: 16, KeyW: 17, KeyE: 18, KeyR: 19, KeyT: 20, KeyY: 21, KeyU: 22, KeyI: 23, KeyO: 24, KeyP: 25, BracketLeft: 26, BracketRight: 27,
  Enter: 28, ControlLeft: 29, KeyA: 30, KeyS: 31, KeyD: 32, KeyF: 33, KeyG: 34, KeyH: 35, KeyJ: 36, KeyK: 37, KeyL: 38, Semicolon: 39, Quote: 40, Backquote: 41,
  ShiftLeft: 42, Backslash: 43, KeyZ: 44, KeyX: 45, KeyC: 46, KeyV: 47, KeyB: 48, KeyN: 49, KeyM: 50, Comma: 51, Period: 52, Slash: 53, ShiftRight: 54,
  NumpadMultiply: 55, AltLeft: 56, Space: 57, CapsLock: 58, F1: 59, F2: 60, F3: 61, F4: 62, F5: 63, F6: 64, F7: 65, F8: 66, F9: 67, F10: 68, NumLock: 69,
  ScrollLock: 70, Numpad7: 71, Numpad8: 72, Numpad9: 73, NumpadSubtract: 74, Numpad4: 75, Numpad5: 76, Numpad6: 77, NumpadAdd: 78, Numpad1: 79, Numpad2: 80,
  Numpad3: 81, Numpad0: 82, NumpadDecimal: 83, F11: 87, F12: 88, NumpadEnter: 156, ControlRight: 157, NumpadDivide: 181, AltRight: 184, Home: 199, ArrowUp: 200,
  PageUp: 201, ArrowLeft: 203, ArrowRight: 205, End: 207, ArrowDown: 208, PageDown: 209, Insert: 210, Delete: 211 };
PZ.keyCodeFor = (code) => SC[code] || 0;
PZ.pushKey = function (sc, down, ch) {
  if (!sc) return; const I = PZ.input;
  I.keys[sc] = down ? 1 : 0;
  if (I.events.length < 250) I.events.push([sc, down ? 1 : 0, ch || 0]);
};
PZ.fillInput = function (st) {   // st: Int32Array (see Keyboard.java layout)
  const I = PZ.input;
  st[0] = I.mx | 0; st[1] = I.my | 0; st[2] = I.buttons; st[3] = I.wheel; I.wheel = 0; st[4] = I.active; st[5] = I.w; st[6] = I.h;
  st.set(I.keys, 8);                                    // native bulk copy instead of a 256-iteration JS loop
  const ev = I.events, n = Math.min(ev.length, 256); st[7] = n;
  for (let i = 0; i < n; i++) { const e = ev[i]; st[264 + i * 3] = e[0]; st[265 + i * 3] = e[1]; st[266 + i * 3] = e[2]; }
  if (n === ev.length) ev.length = 0; else ev.splice(0, n);
};

/* ---------------- WebGL fixed-function emulation ---------------- */
const IDENT = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
function m4() { return new Float32Array(IDENT); }
function mulInto(out, a, b) {   // out = a * b (column-major); out may alias neither a nor b
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3];
    out[c * 4]     = a[0] * b0 + a[4] * b1 + a[8]  * b2 + a[12] * b3;
    out[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9]  * b2 + a[13] * b3;
    out[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    out[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
}
const WORDS = 5;   // per vertex: x, y, u, v (float32) + packed RGBA (4 bytes) = 20 bytes
const STRIDE = WORDS * 4;
const pack8 = (v) => (v <= 0 ? 0 : v >= 1 ? 255 : (v * 255 + 0.5) | 0);

PZ.Renderer = function (canvas) {
  // preserveDrawingBuffer is expensive; set PZ.config.preserveDrawingBuffer = true only if the game relies on retained frames.
  const attrs = { alpha: false, antialias: false, preserveDrawingBuffer: !!PZ.config.preserveDrawingBuffer, depth: false, stencil: false, powerPreference: 'high-performance' };
  const gl = canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
  if (!gl) throw new Error('WebGL not available');
  this.gl = gl; this.canvas = canvas;
  const vs = 'attribute vec2 aPos;attribute vec2 aUV;attribute vec4 aCol;varying vec2 vUV;varying vec4 vCol;void main(){gl_Position=vec4(aPos,0.0,1.0);vUV=aUV;vCol=aCol;}';
  const fs = 'precision mediump float;varying vec2 vUV;varying vec4 vCol;uniform sampler2D uTex;uniform float uUseTex;uniform float uReplace;' +
    'void main(){vec4 c=vCol;if(uUseTex>0.5){vec4 t=texture2D(uTex,vUV);c=uReplace>0.5?t:c*t;}gl_FragColor=c;}';
  const mk = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, 'aPos'); gl.bindAttribLocation(p, 1, 'aUV'); gl.bindAttribLocation(p, 2, 'aCol');
  gl.linkProgram(p); gl.useProgram(p);
  this.uUseTex = gl.getUniformLocation(p, 'uUseTex'); this.uReplace = gl.getUniformLocation(p, 'uReplace'); gl.uniform1i(gl.getUniformLocation(p, 'uTex'), 0);

  // One VBO: CAP dynamic vertices followed by 6 static vertices for the present() full-screen quad.
  this.vbo = gl.createBuffer(); this.CAP = 1 << 16;
  const ab = new ArrayBuffer((this.CAP + 6) * STRIDE);
  this.vb = new Float32Array(ab); this.vbU = new Uint32Array(ab); this.nv = 0;
  const q = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, -1, 0, 0, 1, 1, 1, 1, -1, 1, 0, 1];
  for (let i = 0; i < 6; i++) { const o = (this.CAP + i) * WORDS; this.vb[o] = q[i * 4]; this.vb[o + 1] = q[i * 4 + 1]; this.vb[o + 2] = q[i * 4 + 2]; this.vb[o + 3] = q[i * 4 + 3]; this.vbU[o + 4] = 0xFFFFFFFF; }
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo); gl.bufferData(gl.ARRAY_BUFFER, ab.byteLength, gl.DYNAMIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, this.CAP * STRIDE, new Uint8Array(ab, this.CAP * STRIDE, 6 * STRIDE));
  gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1); gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, STRIDE, 0); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, STRIDE, 8); gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, STRIDE, 16);

  this.tex = new Map(); this.fbo = new Map(); this.fboT = new Map(); this.fboTex = null;
  this.bound = 0; this.cb = null; this.texOn = false; this.replace = false;
  this.mvS = { a: [m4()], d: 0 }; this.prS = { a: [m4()], d: 0 }; this.mode = 0x1700;
  this.mvp = m4(); this.mvpOK = false; this._t = new Float32Array(16); this._o = m4(); this._m = this.mvp; this._aff = true;
  this.colU = 0xFFFFFFFF; this.cu = 0; this.cv = 0; this.prim = -1;
  this.pvCap = 1024; this.pv = new Float32Array(this.pvCap * WORDS); this.pvU = new Uint32Array(this.pv.buffer); this.npv = 0;
  this.lastUseTex = -1; this.lastReplace = -1; this.fboBound = 0;
  this.bsrc = -1; this.bdst = -1; this.dirty = true;
  this.viewport = [0, 0, canvas.width, canvas.height];
  gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.viewport(0, 0, canvas.width, canvas.height);
  this.clearC = [0, 0, 0, 1]; this.blendOn = false;
  // Double buffering: the game draws a frame over many N.gl() flushes and Doppio yields to the browser in between, so the
  // browser used to present half-drawn frames. Render into an offscreen texture and copy it to the canvas only when the
  // game finishes a frame (PZ natives call present() from input()).
  this.back = null; this.backTex = null; this.bw = 0; this.bh = 0;
  this.ensureBack();
};
const R = PZ.Renderer.prototype;
R.bindT = function (h) { if (this.cb !== h) { this.gl.bindTexture(this.gl.TEXTURE_2D, h); this.cb = h; } };
R.ensureBack = function () {
  const gl = this.gl, w = this.canvas.width, h = this.canvas.height;
  if (this.back && this.bw === w && this.bh === h) return;
  if (!this.back) { this.back = gl.createFramebuffer(); this.backTex = gl.createTexture(); }
  this.bindT(this.backTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.back);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.backTex, 0);
  gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
  this.bw = w; this.bh = h; this.dirty = true;
  if (this.fboBound) { const f = this.fbo.get(this.fboBound); if (f) gl.bindFramebuffer(gl.FRAMEBUFFER, f); }
};
R.present = function () {   // copy the finished offscreen frame to the visible canvas (skipped if nothing changed)
  this.flushBatch(); this.ensureBack();
  if (!this.dirty) return;
  this.dirty = false;
  const gl = this.gl, cw = this.canvas.width, ch = this.canvas.height;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cw, ch); if (this.blendOn) gl.disable(gl.BLEND);
  if (this.lastUseTex !== 1) { gl.uniform1f(this.uUseTex, 1); this.lastUseTex = 1; }
  if (this.lastReplace !== 1) { gl.uniform1f(this.uReplace, 1); this.lastReplace = 1; }
  this.bindT(this.backTex);
  gl.drawArrays(gl.TRIANGLES, this.CAP, 6);               // static quad stored after the dynamic vertices
  const v = this.viewport; gl.viewport(v[0], v[1], v[2], v[3]); if (this.blendOn) gl.enable(gl.BLEND);
  const f = this.fboBound ? this.fbo.get(this.fboBound) : this.back; gl.bindFramebuffer(gl.FRAMEBUFFER, f || this.back);
};
R.curS = function () { return this.mode === 0x1701 ? this.prS : this.mvS; };
R.top = function () { const s = this.curS(); return s.a[s.d]; };
R.mulTop = function (m) { const t = this.top(); mulInto(this._t, t, m); t.set(this._t); this.mvpOK = false; };
R.getMVP = function () {
  if (!this.mvpOK) { const p = this.prS, m = this.mvS; mulInto(this.mvp, p.a[p.d], m.a[m.d]); this.mvpOK = true; }
  return this.mvp;
};
R.glTex = function (id) {
  let t = this.tex.get(id);
  if (!t) { const gl = this.gl; t = { h: gl.createTexture(), w: 1, hh: 1, min: gl.LINEAR, mag: gl.LINEAR, ws: gl.CLAMP_TO_EDGE, wt: gl.CLAMP_TO_EDGE, pd: true, ok: true, cpu: null, cdirty: true }; this.tex.set(id, t); }
  return t;
};
R.flushBatch = function () {
  if (!this.nv) return; const gl = this.gl;
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vb.subarray(0, this.nv * WORDS));   // vbo stays bound for the renderer's lifetime
  const ut = this.texOn ? 1 : 0, ur = this.replace ? 1 : 0;
  if (ut !== this.lastUseTex) { gl.uniform1f(this.uUseTex, ut); this.lastUseTex = ut; }
  if (ur !== this.lastReplace) { gl.uniform1f(this.uReplace, ur); this.lastReplace = ur; }
  if (this.texOn) { const t = this.tex.get(this.bound); this.bindT(t ? t.h : null); }
  gl.drawArrays(gl.TRIANGLES, 0, this.nv); this.nv = 0;
  this.dirty = true; if (this.fboTex) this.fboTex.cdirty = true;
};
R.pushV = function (x, y) {   // transform immediately and append to the pending primitive (no allocation)
  if (this.npv >= this.pvCap) {
    this.pvCap *= 2; const nb = new Float32Array(this.pvCap * WORDS); nb.set(this.pv); this.pv = nb; this.pvU = new Uint32Array(nb.buffer);
  }
  const m = this._m, p = this.pv, o = this.npv * WORDS;
  if (this._aff) { p[o] = m[0] * x + m[4] * y + m[12]; p[o + 1] = m[1] * x + m[5] * y + m[13]; }
  else { const w = 1 / (m[3] * x + m[7] * y + m[15]); p[o] = (m[0] * x + m[4] * y + m[12]) * w; p[o + 1] = (m[1] * x + m[5] * y + m[13]) * w; }
  p[o + 2] = this.cu; p[o + 3] = this.cv; this.pvU[o + 4] = this.colU;
  if (++this.npv === 4 && this.prim === 7) { this.tri(0, 1, 2); this.tri(0, 2, 3); this.npv = 0; }   // quads go straight out
};
R.tri = function (a, b, c) {
  if (this.nv + 3 > this.CAP) this.flushBatch();
  const s = this.pvU, d = this.vbU; let o = this.nv * WORDS;
  let i = a * WORDS; d[o] = s[i]; d[o + 1] = s[i + 1]; d[o + 2] = s[i + 2]; d[o + 3] = s[i + 3]; d[o + 4] = s[i + 4]; o += WORDS;
  i = b * WORDS; d[o] = s[i]; d[o + 1] = s[i + 1]; d[o + 2] = s[i + 2]; d[o + 3] = s[i + 3]; d[o + 4] = s[i + 4]; o += WORDS;
  i = c * WORDS; d[o] = s[i]; d[o + 1] = s[i + 1]; d[o + 2] = s[i + 2]; d[o + 3] = s[i + 3]; d[o + 4] = s[i + 4];
  this.nv += 3;
};
R.endPrim = function () {
  const n = this.npv, mode = this.prim; this.prim = -1; this.npv = 0; if (!n) return;
  switch (mode) {
    case 7: break;   // already emitted incrementally
    case 4: for (let i = 0; i + 2 < n; i += 3) this.tri(i, i + 1, i + 2); break;
    case 5: for (let i = 0; i + 2 < n; i++) (i & 1) ? this.tri(i + 1, i, i + 2) : this.tri(i, i + 1, i + 2); break;
    case 6: case 9: for (let i = 1; i + 1 < n; i++) this.tri(0, i, i + 1); break;
    case 8: for (let i = 0; i + 3 < n; i += 2) { this.tri(i, i + 1, i + 3); this.tri(i, i + 3, i + 2); } break;
    default: break; // lines/points are not used by the game's sprite renderer
  }
};
R.texImage = function (id, w, h, data, off) {
  const gl = this.gl, t = this.glTex(id); this.flushBatch();
  this.bindT(t.h); t.w = w; t.hh = h; t.cdirty = true;
  let px = null; if (data) px = new Uint8Array(data.buffer, data.byteOffset + off, w * h * 4);   // no CPU-side copy; texRead uses readPixels
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
  const ok = ((w & (w - 1)) === 0) && ((h & (h - 1)) === 0);
  if (t.pd || t.ok !== ok) this.applyParams(t);   // params persist on the texture object; only re-send when they changed
};
R.texSub = function (id, x, y, w, h, data, off) {
  const gl = this.gl, t = this.glTex(id); this.flushBatch(); this.bindT(t.h); t.cdirty = true;
  const px = new Uint8Array(data.buffer, data.byteOffset + off, w * h * 4); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
};
R.texRead = function (id, out, off) {   // readPixels stalls the pipeline, so cache the result until the texture changes
  const t = this.tex.get(id); if (!t) return; const gl = this.gl; this.flushBatch();
  const n = t.w * t.hh * 4;
  if (!t.cpu || t.cpu.length !== n || t.cdirty) {
    if (!this.readFbo) this.readFbo = gl.createFramebuffer();
    if (!t.cpu || t.cpu.length !== n) t.cpu = new Uint8Array(n);
    const prev = this.fboBound ? this.fbo.get(this.fboBound) : null;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.readFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.h, 0);
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.readPixels(0, 0, t.w, t.hh, gl.RGBA, gl.UNSIGNED_BYTE, t.cpu);
    gl.bindFramebuffer(gl.FRAMEBUFFER, prev || this.back);
    t.cdirty = false;
  }
  new Uint8Array(out.buffer, out.byteOffset + off, n).set(t.cpu);
};
R.applyParams = function (t) {
  const gl = this.gl, pow2 = (n) => (n & (n - 1)) === 0, ok = pow2(t.w) && pow2(t.hh);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, t.min); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, t.mag);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, ok ? t.ws : gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, ok ? t.wt : gl.CLAMP_TO_EDGE);
  t.pd = false; t.ok = ok;
};
R.exec = function (c, n) {
  const gl = this.gl; let i = 0; this.ensureBack();
  while (i < n) {
    const op = c[i];
    switch (op) {
      case 1: this.prim = c[i + 1]; this.npv = 0; { const m = this._m = this.getMVP(); this._aff = m[3] === 0 && m[7] === 0 && m[15] === 1; } i += 5; break;
      case 2: this.endPrim(); i += 5; break;
      case 3: if (this.prim >= 0) this.pushV(c[i + 1], c[i + 2]); i += 3; break;
      case 4: this.cu = c[i + 1]; this.cv = c[i + 2]; i += 3; break;
      case 5: this.colU = pack8(c[i + 1]) | (pack8(c[i + 2]) << 8) | (pack8(c[i + 3]) << 16) | (pack8(c[i + 4]) << 24); i += 5; break;
      case 6: if (this.bound !== c[i + 1]) { this.flushBatch(); this.bound = c[i + 1]; } i += 5; break;
      case 7: case 8: { const on = op === 7, cap = c[i + 1];
        if (cap === 0x0DE1) { if (this.texOn !== on) { this.flushBatch(); this.texOn = on; } }
        else if (cap === 0x0BE2) { if (this.blendOn !== on) { this.flushBatch(); this.blendOn = on; on ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND); } }
        i += 5; break; }
      case 9: this.mode = c[i + 1]; i += 5; break;
      case 10: this.top().set(IDENT); this.mvpOK = false; i += 5; break;
      case 11: { const l = c[i + 1], r = c[i + 2], b = c[i + 3], t = c[i + 4], zn = c[i + 5], zf = c[i + 6];
        const o = this._o; o.set(IDENT); o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (zf - zn); o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(zf + zn) / (zf - zn);
        this.mulTop(o); i += 7; break; }
      case 12: { const m = this.top(), x = c[i + 1], y = c[i + 2], z = c[i + 3];   // M * T, in place
        m[12] += m[0] * x + m[4] * y + m[8] * z; m[13] += m[1] * x + m[5] * y + m[9] * z;
        m[14] += m[2] * x + m[6] * y + m[10] * z; m[15] += m[3] * x + m[7] * y + m[11] * z; this.mvpOK = false; i += 5; break; }
      case 13: { const s = this.curS(); if (++s.d >= s.a.length) s.a.push(new Float32Array(16)); s.a[s.d].set(s.a[s.d - 1]); i += 5; break; }
      case 14: { const s = this.curS(); if (s.d > 0) s.d--; this.mvpOK = false; i += 5; break; }
      case 15: { const s = c[i + 1], d = c[i + 2];
        if (s !== this.bsrc || d !== this.bdst) { this.flushBatch(); this.bsrc = s; this.bdst = d;
          const bm = this.blendMap || (this.blendMap = { 0: gl.ZERO, 1: gl.ONE, 0x302: gl.SRC_ALPHA, 0x303: gl.ONE_MINUS_SRC_ALPHA, 0x300: gl.SRC_COLOR, 0x301: gl.ONE_MINUS_SRC_COLOR, 0x304: gl.DST_ALPHA, 0x305: gl.ONE_MINUS_DST_ALPHA, 0x306: gl.DST_COLOR, 0x307: gl.ONE_MINUS_DST_COLOR });
          gl.blendFunc(bm[s] || gl.ONE, bm[d] || gl.ONE); }
        i += 5; break; }
      case 16: { const v = this.viewport, x = c[i + 1], y = c[i + 2], w = c[i + 3], h = c[i + 4];
        if (v[0] !== x || v[1] !== y || v[2] !== w || v[3] !== h) { this.flushBatch(); this.viewport = [x, y, w, h]; gl.viewport(x, y, w, h); }
        i += 5; break; }
      case 17: this.flushBatch(); gl.clearColor(this.clearC[0], this.clearC[1], this.clearC[2], this.clearC[3]); gl.clear(gl.COLOR_BUFFER_BIT); this.dirty = true; if (this.fboTex) this.fboTex.cdirty = true; i += 5; break;
      case 18: this.clearC = [c[i + 1], c[i + 2], c[i + 3], c[i + 4]]; i += 5; break;
      case 19: { const t = this.glTex(this.bound), pn = c[i + 1], v = c[i + 2];
        const filt = (x) => (x === 0x2600 || x === 0x2700 || x === 0x2702) ? gl.NEAREST : gl.LINEAR;
        let nv;
        if (pn === 0x2801) { nv = filt(v); if (t.min === nv) { i += 5; break; } this.flushBatch(); t.min = nv; }
        else if (pn === 0x2800) { nv = filt(v); if (t.mag === nv) { i += 5; break; } this.flushBatch(); t.mag = nv; }
        else if (pn === 0x2802) { nv = v === 0x2901 ? gl.REPEAT : gl.CLAMP_TO_EDGE; if (t.ws === nv) { i += 5; break; } this.flushBatch(); t.ws = nv; }
        else if (pn === 0x2803) { nv = v === 0x2901 ? gl.REPEAT : gl.CLAMP_TO_EDGE; if (t.wt === nv) { i += 5; break; } this.flushBatch(); t.wt = nv; }
        else { i += 5; break; }
        this.bindT(t.h); this.applyParams(t); i += 5; break; }
      case 20: if (c[i + 1] === 0x2200) { const r = c[i + 2] === 0x1E01; if (r !== this.replace) { this.flushBatch(); this.replace = r; } } i += 5; break;
      case 21: { const t = this.tex.get(c[i + 1]); if (t) { if (this.cb === t.h) this.cb = null; gl.deleteTexture(t.h); this.tex.delete(c[i + 1]); } i += 5; break; }
      case 22: { this.flushBatch(); const id = c[i + 1]; this.fboBound = id | 0; if (!id) { gl.bindFramebuffer(gl.FRAMEBUFFER, this.back); this.fboTex = null; }
        else { let f = this.fbo.get(id); if (!f) { f = gl.createFramebuffer(); this.fbo.set(id, f); } gl.bindFramebuffer(gl.FRAMEBUFFER, f); this.curFbo = id; this.fboTex = this.fboT.get(id) || null; } i += 5; break; }
      case 23: { this.flushBatch(); const t = this.glTex(c[i + 1]); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.h, 0);
        t.cdirty = true; if (this.fboBound) { this.fboT.set(this.fboBound, t); this.fboTex = t; } i += 5; break; }
      case 24: { const m = this.top(), x = c[i + 1], y = c[i + 2], z = c[i + 3];   // M * S, in place
        m[0] *= x; m[1] *= x; m[2] *= x; m[3] *= x; m[4] *= y; m[5] *= y; m[6] *= y; m[7] *= y; m[8] *= z; m[9] *= z; m[10] *= z; m[11] *= z; this.mvpOK = false; i += 5; break; }
      case 25: { const a = c[i + 1] * Math.PI / 180, s = Math.sin(a), co = Math.cos(a), m = this.top();   // M * Rz, in place
        for (let k = 0; k < 4; k++) { const a0 = m[k], a1 = m[4 + k]; m[k] = co * a0 + s * a1; m[4 + k] = co * a1 - s * a0; } this.mvpOK = false; i += 5; break; }
      default: i += 5; break;
    }
  }
  this.flushBatch();
};

/* ---------------- WebAudio (OpenAL replacement) ---------------- */
PZ.Audio = function () {
  this.ctx = null; this.bufs = new Map(); this.src = new Map(); this.listener = [0, 0, 0];
};
const A = PZ.Audio.prototype;
A.ensure = function () { if (!this.ctx) { const C = root.AudioContext || root.webkitAudioContext; if (C) this.ctx = new C(); } return this.ctx; };
A.resume = function () { const c = this.ensure(); if (c && c.state === 'suspended') c.resume(); };
A.data = function (id, ch, bits, rate, bytes, len) {
  const c = this.ensure(); if (!c) return; const frames = Math.floor(len / (ch * (bits / 8)));
  const b = c.createBuffer(ch, Math.max(1, frames), rate);
  if (bits === 16 && (bytes.byteOffset & 1) === 0) {   // aligned fast path (little-endian hosts)
    const s = new Int16Array(bytes.buffer, bytes.byteOffset, frames * ch);
    for (let k = 0; k < ch; k++) { const d = b.getChannelData(k); for (let f = 0, j = k; f < frames; f++, j += ch) d[f] = s[j] / 32768; }
  } else {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, len);
    for (let k = 0; k < ch; k++) { const d = b.getChannelData(k);
      for (let f = 0; f < frames; f++) d[f] = bits === 16 ? dv.getInt16((f * ch + k) * 2, true) / 32768 : (dv.getUint8(f * ch + k) - 128) / 128; }
  }
  this.bufs.set(id, b);
};
A.s = function (id) { let s = this.src.get(id); if (!s) { s = { buf: 0, gain: 1, pitch: 1, loop: false, state: 0x1011, node: null, g: null, pos: [0, 0, 0] }; this.src.set(id, s); } return s; };
A.cmd = function (op, a, b, c, f) {
  switch (op) {
    case 1: { const s = this.s(a); if (b === 0x1009) s.buf = c; else if (b === 0x1007) { s.loop = !!c; if (s.node) s.node.loop = s.loop; } break; }
    case 2: { const s = this.s(a); if (b === 0x100A) { s.gain = f; if (s.g) s.g.gain.value = f; } else if (b === 0x1003) { s.pitch = f; if (s.node) s.node.playbackRate.value = f; } break; }
    case 3: case 4: case 5: break;
    case 6: { const s = this.s(a), c2 = this.ensure(), buf = this.bufs.get(s.buf); if (!c2 || !buf) { s.state = 0x1014; break; }
      this.cmd(7, a, 0, 0, 0); const n = c2.createBufferSource(); n.buffer = buf; n.loop = s.loop; n.playbackRate.value = s.pitch;
      const g = c2.createGain(); g.gain.value = s.gain; n.connect(g); g.connect(c2.destination); s.node = n; s.g = g; s.state = 0x1012;
      n.onended = () => { if (s.node === n) { s.state = 0x1014; s.node = null; } }; n.start(); break; }
    case 7: { const s = this.s(a); if (s.node) { const n = s.node; s.node = null; try { n.onended = null; n.stop(); } catch (e) {} } if (s.state === 0x1012) s.state = 0x1014; break; }
    default: break;
  }
};
A.query = function (param, id) { if (param === 0x1010) return this.s(id).state; return 0; };
A.decode = function (bytes, info) {   // returns Promise<handle>
  const c = this.ensure(); this.dec = this.dec || new Map(); this.decN = (this.decN || 0) + 1; const h = this.decN;
  if (!c) { this.dec.set(h, new Int8Array(2)); info[0] = 1; info[1] = 22050; info[2] = 16; info[3] = 2; return Promise.resolve(h); }
  const ab = bytes.slice().buffer;
  return new Promise((res) => c.decodeAudioData(ab, (b) => {
    const ch = Math.min(2, b.numberOfChannels), n = b.length, out = new Int8Array(n * ch * 2), s16 = new Int16Array(out.buffer);
    for (let k = 0; k < ch; k++) { const d = b.getChannelData(k); for (let f = 0, j = k; f < n; f++, j += ch) { const v = d[f] < -1 ? -1 : d[f] > 1 ? 1 : d[f]; s16[j] = v < 0 ? v * 32768 : v * 32767; } }
    this.dec.set(h, out); info[0] = ch; info[1] = b.sampleRate; info[2] = 16; info[3] = out.length; res(h);
  }, () => res(-1)));
};

/* ---------------- JVM natives (pz/shim/N) ---------------- */
PZ.makeNatives = function (env) {   // env: {renderer, audio, inflate, ASYNC, log}
  const u8 = (a) => new Uint8Array(a.array.buffer, a.array.byteOffset, a.array.length);
  const images = new Map(); let imgN = 0;
  const td = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;
  return { 'pz/shim/N': {
    'gl([FI)V'(t, c, n) { if (env.renderer) env.renderer.exec(c.array, n); },
    'texImage(III[BI)V'(t, id, w, h, d, off) { if (env.renderer) env.renderer.texImage(id, w, h, d ? d.array : null, off); },
    'texSub(IIIII[BI)V'(t, id, x, y, w, h, d, off) { if (env.renderer) env.renderer.texSub(id, x, y, w, h, d.array, off); },
    'texRead(I[BI)V'(t, id, out, off) { if (env.renderer) env.renderer.texRead(id, out.array, off); },
    'decode([BI[I)I'(t, data, len, info) {
      const r = PZ.decodePNG(u8(data).subarray(0, len), env.inflate);
      if (!r) { env.log('decode failed (not a supported PNG)'); return -1; }
      images.set(++imgN, r); info.array[0] = r.w; info.array[1] = r.h; info.array[2] = r.hasAlpha ? 1 : 0; return imgN;
    },
    'pixels(I[I)V'(t, h, out) {
      const r = images.get(h), o = out.array, s = r.rgba, n = r.w * r.h;
      if (r.hasAlpha) o.set(s.subarray(0, n * 4));       // native typed-array copy/convert
      else for (let i = 0, j = 0, k = 0; i < n; i++, j += 4) { o[k++] = s[j]; o[k++] = s[j + 1]; o[k++] = s[j + 2]; }
    },
    // Bulk RGBA copy into a Java byte[] with rows padded to texW pixels (replaces a per-pixel ByteBuffer.put loop in Java).
    'pixelsPadded(I[BI)V'(t, h, out, texW) {
      const r = images.get(h), o = out.array, s = r.rgba, rowB = r.w * 4, stride = texW * 4;
      const src = new Int8Array(s.buffer, s.byteOffset, s.length);
      if (stride === rowB) o.set(src.subarray(0, rowB * r.h), 0);
      else for (let y = 0; y < r.h; y++) o.set(src.subarray(y * rowB, (y + 1) * rowB), y * stride);
    },
    'input([I)V'(t, st) { if (env.renderer && env.renderer.present) env.renderer.present(); PZ.fillInput(st.array); },   // input() runs once per Display.update() = end of frame
    'display(II)V'(t, w, h) { PZ.input.w = w; PZ.input.h = h; if (env.onDisplay) env.onDisplay(w, h); },
    'al(IIIIF)V'(t, op, a, b, c, f) { if (env.audio) env.audio.cmd(op, a, b, c, f); },
    'alData(IIII[BI)V'(t, id, ch, bits, rate, d, len) { if (env.audio) env.audio.data(id, ch, bits, rate, u8(d), len); },
    'alQuery(II)I'(t, p, s) { return env.audio ? env.audio.query(p, s) : 0; },
    'audioDecode([BI[I)I'(t, data, len, info) {
      if (!env.audio) { info.array[0] = 1; info.array[1] = 22050; info.array[2] = 16; info.array[3] = 2; env.audio = env.audio; return 0; }
      t.setStatus(env.ASYNC); env.audio.decode(u8(data).subarray(0, len), info.array).then((h) => t.asyncReturn(h));
    },
    'audioPcm(I[B)V'(t, h, out) { const d = env.audio && env.audio.dec && env.audio.dec.get(h); if (d) out.array.set(d.subarray(0, out.array.length)); },
    'log([B)V'(t, m) { const a = m.array; env.log(td ? td.decode(new Uint8Array(a.buffer, a.byteOffset, a.length)) : String.fromCharCode.apply(null, Array.from(a))); },
  } };
};

if (typeof module !== 'undefined' && module.exports) module.exports = PZ; else root.PZ = PZ;
})(typeof window !== 'undefined' ? window : globalThis);
