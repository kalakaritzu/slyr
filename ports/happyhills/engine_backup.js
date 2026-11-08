/* HTML5 runtime for The Happy Hills Homicide (GameMaker Studio 1.4 bytecode 15 port) */
(function () {
'use strict';
const G = window.GAME;
const D2R = Math.PI / 180;
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.width = G.w; canvas.height = G.h;
ctx.imageSmoothingEnabled = false;
let saveDepth = 0;
{ const _s = ctx.save.bind(ctx), _r = ctx.restore.bind(ctx);
  ctx.save = () => { saveDepth++; _s(); };
  ctx.restore = () => { if (saveDepth > 0) { saveDepth--; _r(); } }; }

// ---------- assets ----------
const tex = [];
const snds = G.snd.map(s => { const a = new Audio(); a.preload = 'auto'; a.src = s[1]; return a; });
const sndPlaying = G.snd.map(() => []);
const fontCache = {};

function loadAssets(cb) {
  let n = 5, done = 0;
  for (let i = 0; i < 5; i++) {
    const im = new Image();
    im.onload = () => { if (++done === n) cb(); };
    im.onerror = () => { console.error('tex load fail', i); if (++done === n) cb(); };
    im.src = 'tex/tex' + i + '.png';
    tex[i] = im;
  }
}

// ---------- state ----------
let insts = [], roomIdx = 0, room = null, nextRoom = -1, nextId = 1000000;
let rel = 0, dcol = 16777215, dfont = 0, dalign = 0;
let gameOver = false, frame = 0;
const keys = {}, pressed = {}, released = {};
const V = { view_visible: [], view_xview: [], view_yview: [], view_wview: [], view_hview: [], view_object: [] };
const GL = { room_width: 0, room_height: 0, room_speed: 30 };
const bgScroll = [];
const noop = () => {};

class Inst {
  constructor(obj, x, y, id) {
    const o = G.objs[obj];
    this.obj = obj; this.id = id; this.x = x; this.y = y;
    this.xstart = x; this.ystart = y; this.xprevious = x; this.yprevious = y;
    this.sprite_index = o[1]; this.image_index = 0; this.image_speed = 1; this.image_alpha = 1;
    this.image_xscale = 1; this.image_yscale = 1; this.image_angle = 0; this.image_single = -1;
    this.depth = o[4]; this.visible = !!o[2]; this.solid = !!o[3]; this.persistent = !!o[5];
    this.mask_index = o[7]; this.alarm = new Array(12).fill(-1);
    this._sp = 0; this._dir = 0; this.gravity = 0; this.gravity_direction = 270; this.friction = 0;
    this.dead = false;
  }
  get speed() { return this._sp; } set speed(v) { this._sp = v; }
  get direction() { return this._dir; } set direction(v) { this._dir = ((v % 360) + 360) % 360; }
  get hspeed() { return this._sp * Math.cos(this._dir * D2R); }
  get vspeed() { return -this._sp * Math.sin(this._dir * D2R); }
  set hspeed(h) { const v = this.vspeed; this._sp = Math.hypot(h, v); this._dir = (Math.atan2(-v, h) / D2R + 360) % 360; }
  set vspeed(v) { const h = this.hspeed; this._sp = Math.hypot(h, v); this._dir = (Math.atan2(-v, h) / D2R + 360) % 360; }
}
// FIX: snap float noise in hspeed/vspeed to 0 (wraps the existing accessors; originals untouched)
{
  const snap = n => (Math.abs(n) < 1e-9 ? 0 : n);
  const hs = Object.getOwnPropertyDescriptor(Inst.prototype, 'hspeed');
  const vs = Object.getOwnPropertyDescriptor(Inst.prototype, 'vspeed');
  Object.defineProperty(Inst.prototype, 'hspeed', { configurable: true, get() { return snap(hs.get.call(this)); }, set: hs.set });
  Object.defineProperty(Inst.prototype, 'vspeed', { configurable: true, get() { return snap(vs.get.call(this)); }, set: vs.set });
}
// ---------- object helpers ----------
function isA(i, o) {
  let c = i.obj;
  for (let n = 0; n < 20 && c >= 0; n++) { if (c === o) return true; c = G.objs[c][6]; }
  return false;
}
function getEv(obj, type, sub) {
  for (let n = 0; n < 20 && obj >= 0; n++) {
    const e = G.objs[obj][8][type];
    if (e && e[sub]) return e[sub];
    obj = G.objs[obj][6];
  }
  return null;
}
function fire(i, type, sub, other) {
  const ids = getEv(i.obj, type, sub);
  if (ids) for (const id of ids) run(id, i, other || null);
}
function instOf(o) {
  // During knife/stab minigame the player is obj_playerafk (777), not obj_player (731).
  // Treat 777 as a living player so SWAT/NPC kill checks and with(player) still find you.
  if (o === 731) {
    return insts.filter(i => !i.dead && (isA(i, 731) || i.obj === 777));
  }
  return insts.filter(i => !i.dead && isA(i, o));
}
function byId(id) { for (const i of insts) if (i.id === id && !i.dead) return i; return null; }
function resolve(it, self, other) {
  if (it === -1) return self; if (it === -2) return other;
  if (it >= 100000) return byId(it);
  if (it >= 0) { for (const i of insts) if (!i.dead && isA(i, it)) return i; return null; }
  return null;
}
function create(obj, x, y, id) {
  const i = new Inst(obj, x, y, id || nextId++);
  insts.push(i); fire(i, 0, 0);
  return i;
}
function destroy(i) {
  if (i.dead) return;
  i.dead = true; fire(i, 1, 0);
}

// ---------- collision ----------
function bbox(i, x, y) {
  let si = i.mask_index >= 0 ? i.mask_index : i.sprite_index;
  const s = G.spr[si]; if (!s) return null;
  const xs = i.image_xscale, ys = i.image_yscale;
  const a = x + (s[5] - s[3]) * xs, b = x + (s[6] + 1 - s[3]) * xs;
  const c = y + (s[7] - s[4]) * ys, d = y + (s[8] + 1 - s[4]) * ys;
  return [Math.min(a, b), Math.min(c, d), Math.max(a, b), Math.max(c, d)];
}
function hit(i, x, y, j) {
  const a = bbox(i, x, y), b = bbox(j, j.x, j.y);
  const boxHit = !!a && !!b && a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  // FIX: a ROTATED sprite (e.g. a guard's sight beam) used to be tested with its axis-aligned box, so a diagonal beam
  // "reached" far past where it is actually drawn (shooting you from the other side of a wall / across the water).
  // Only pairs where one side is rotated take this path; everything else behaves exactly as before.
  if (window.HH_NOROT || !(i.image_angle || j.image_angle)) return boxHit;   // HH_NOROT=true in the console switches the rotation fix off (for testing)
  return hitRotated(i, x, y, j, j.x, j.y);
}
// ---- rotation-aware collision (added) ----
const maskCache = {};
function spriteMask(si, fi) {                                   // alpha mask of one sprite frame, or null if unreadable
  const key = si + '_' + fi; if (key in maskCache) return maskCache[key];
  let m = null;
  try {
    const s = G.spr[si], t = G.tp[s[9][fi]];
    if (t) {
      const c = document.createElement('canvas'); c.width = t[2]; c.height = t[3];
      const x = c.getContext('2d'); x.drawImage(tex[t[8]], t[0], t[1], t[2], t[3], 0, 0, t[2], t[3]);
      m = { t, d: x.getImageData(0, 0, t[2], t[3]).data };
    }
  } catch (e) { m = null; }                                     // tainted canvas (file://) -> fall back to the rotated box
  return (maskCache[key] = m);
}
function isPrecise(s) { return s[10] === 1 || s[10] === true; }  // GameMaker "precise collision checking" flag, if the data carries it
function quad(i, x, y) {                                        // the sprite's collision rectangle, scaled then rotated about the origin
  const s = G.spr[i.mask_index >= 0 ? i.mask_index : i.sprite_index]; if (!s) return null;
  const xs = i.image_xscale, ys = i.image_yscale, an = (i.image_angle || 0) * D2R, c = Math.cos(an), sn = Math.sin(an);
  const l = (s[5] - s[3]) * xs, r = (s[6] + 1 - s[3]) * xs, tp = (s[7] - s[4]) * ys, bt = (s[8] + 1 - s[4]) * ys;
  return [[l, tp], [r, tp], [r, bt], [l, bt]].map(p => [x + p[0] * c + p[1] * sn, y - p[0] * sn + p[1] * c]);
}
function sepAxis(A, B) {                                        // separating-axis test for two convex quads; true if they overlap
  for (const Q of [A, B]) for (let n = 0; n < 4; n++) {
    const p = Q[n], q = Q[(n + 1) % 4], ax = p[1] - q[1], ay = q[0] - p[0];
    let a0 = 1e18, a1 = -1e18, b0 = 1e18, b1 = -1e18;
    for (const v of A) { const d = v[0] * ax + v[1] * ay; if (d < a0) a0 = d; if (d > a1) a1 = d; }
    for (const v of B) { const d = v[0] * ax + v[1] * ay; if (d < b0) b0 = d; if (d > b1) b1 = d; }
    if (a1 <= b0 || b1 <= a0) return false;
  }
  return true;
}
function pointIn(i, x, y, px, py) {                             // is world point inside instance i's (rotated, maybe pixel-precise) mask?
  const s = G.spr[i.mask_index >= 0 ? i.mask_index : i.sprite_index];
  const an = (i.image_angle || 0) * D2R, c = Math.cos(an), sn = Math.sin(an), dx = px - x, dy = py - y;
  const lx = (dx * c - dy * sn) / i.image_xscale + s[3], ly = (dx * sn + dy * c) / i.image_yscale + s[4];
  if (lx < s[5] || lx >= s[6] + 1 || ly < s[7] || ly >= s[8] + 1) return false;
  if (!isPrecise(s)) return true;
  const n = s[9].length; if (!n) return true;
  let fi = Math.floor(i.image_index) % n; if (fi < 0) fi += n;
  const m = spriteMask(i.mask_index >= 0 ? i.mask_index : i.sprite_index, fi); if (!m) return true;
  const u = Math.floor(lx) - m.t[4] + 0, v = Math.floor(ly) - m.t[5] + 0;
  if (u < 0 || v < 0 || u >= m.t[2] || v >= m.t[3]) return false;
  return m.d[(v * m.t[2] + u) * 4 + 3] > 0;
}
function hitRotated(i, x, y, j, jx, jy) {
  const A = quad(i, x, y), B = quad(j, jx, jy); if (!A || !B) return false;
  if (!sepAxis(A, B)) return false;
  const si = G.spr[i.mask_index >= 0 ? i.mask_index : i.sprite_index], sj = G.spr[j.mask_index >= 0 ? j.mask_index : j.sprite_index];
  if (!isPrecise(si) && !isPrecise(sj)) return true;            // plain rotated boxes: the overlap test above is the answer
  const xs = A.concat(B).map(p => p[0]), ys = A.concat(B).map(p => p[1]);
  const ax0 = Math.max(Math.min(...A.map(p => p[0])), Math.min(...B.map(p => p[0]))), ax1 = Math.min(Math.max(...A.map(p => p[0])), Math.max(...B.map(p => p[0])));
  const ay0 = Math.max(Math.min(...A.map(p => p[1])), Math.min(...B.map(p => p[1]))), ay1 = Math.min(Math.max(...A.map(p => p[1])), Math.max(...B.map(p => p[1])));
  for (let py = Math.floor(ay0) + 0.5; py < ay1; py++) for (let px = Math.floor(ax0) + 0.5; px < ax1; px++)
    if (pointIn(i, x, y, px, py) && pointIn(j, jx, jy, px, py)) return true;
  return false;
}
function meeting(i, x, y, o) { for (const j of insts) if (j !== i && !j.dead && isA(j, o) && hit(i, x, y, j)) return true; return false; }
function placeFree(i, x, y) { for (const j of insts) if (j !== i && !j.dead && j.solid && hit(i, x, y, j)) return false; return true; }
function placeEmpty(i, x, y) { for (const j of insts) if (j !== i && !j.dead && hit(i, x, y, j)) return false; return true; }

// ---------- variables ----------
function getv(name, it, idx, self, other, loc) {
  if (name in V && idx !== null) return V[name][idx] ?? 0;
  if (name in GL) return GL[name];
  if (it === -7) return loc[name] ?? 0;
  if (it === -5) return GL[name] ?? 0;
  const t = it === -1 ? self : it === -2 ? other : resolve(it, self, other);
  if (!t) return 0;
  const v = t[name];
  return v === undefined ? 0 : v;
}
function setv(name, it, idx, v, self, other, loc) {
  if (name in V && idx !== null) { V[name][idx] = v; return; }
  if (name in GL) { GL[name] = v; return; }
  if (it === -7) { loc[name] = v; return; }
  if (it === -5) { GL[name] = v; return; }
  const t = it === -1 ? self : it === -2 ? other : resolve(it, self, other);
  if (t) t[name] = v;
}
function withList(v, self, other) {
  if (v === -1) return [self]; if (v === -2) return other ? [other] : [];
  if (v === -3) return insts.filter(i => !i.dead);
  if (v >= 100000) { const i = byId(v); return i ? [i] : []; }
  if (v >= 0) return instOf(v);
  return [];
}

// ---------- the bytecode VM ----------
let errCount = 0;
function run(ci, self, other) {
  const prevRel = rel; rel = 0;
  try { runInner(ci, self, other); }
  catch (e) { if (errCount++ < 20) console.error('script', ci, e); }
  finally { rel = prevRel; }
}
function runInner(ci, self, other) {
  const c = G.code[ci]; if (!c) return; window.__ci = ci;
  const st = [], loc = {}, envs = [];
  let pc = 0, guard = 0;
  while (pc < c.length) {
    if (++guard > 200000) { console.warn('VM guard hit', ci); return; }
    const i = c[pc];
    switch (i[0]) {
      case 'k': st.push(i[1]); pc++; break;
      case 'v': { let idx = null; if (i[3]) { idx = st.pop(); st.pop(); } st.push(getv(i[1], i[2], idx, self, other, loc)); pc++; break; }
      case 's': { let idx = null; if (i[3]) { idx = st.pop(); st.pop(); } const v = st.pop(); setv(i[1], i[2], idx, v, self, other, loc); pc++; break; }
      case 'c': { const args = []; for (let n = 0; n < i[2]; n++) args.push(st.pop());
        const f = FN[i[1]]; let r = 0;
        if (f) { try { r = f(args, self, other); } catch (e) { console.error('fn', i[1], e); } } else console.warn('missing fn', i[1]);
        st.push(r === undefined ? 0 : r); pc++; break; }
      case 'b': pc = i[1]; break;
      case 'bt': pc = (st.pop() > 0.5) ? i[1] : pc + 1; break;
      case 'bf': pc = (st.pop() > 0.5) ? pc + 1 : i[1]; break;
      case 'cv': { if (i[2] === 4) { const v = st.pop(); st.push(v > 0.5 ? 1 : 0); } else if (i[2] === 2 && typeof st[st.length - 1] === 'number') st.push(Math.trunc(st.pop())); pc++; break; }
      case 'add': { const b = st.pop(), a = st.pop(); st.push(a + b); pc++; break; }
      case 'sub': { const b = st.pop(), a = st.pop(); st.push(a - b); pc++; break; }
      case 'mul': { const b = st.pop(), a = st.pop(); st.push(a * b); pc++; break; }
      case 'div': { const b = st.pop(), a = st.pop(); st.push(a / b); pc++; break; }
      case 'rem': case 'mod': { const b = st.pop(), a = st.pop(); st.push(a % b); pc++; break; }
      case 'and': { const b = st.pop(), a = st.pop(); st.push(a & b); pc++; break; }
      case 'or': { const b = st.pop(), a = st.pop(); st.push(a | b); pc++; break; }
      case 'xor': { const b = st.pop(), a = st.pop(); st.push(a ^ b); pc++; break; }
      case 'shl': { const b = st.pop(), a = st.pop(); st.push(a << b); pc++; break; }
      case 'shr': { const b = st.pop(), a = st.pop(); st.push(a >> b); pc++; break; }
      case 'neg': st.push(-st.pop()); pc++; break;
      case 'not': st.push(st.pop() > 0.5 ? 0 : 1); pc++; break;
           case 'slt': { const b = st.pop(), a = st.pop();
        // FIX (farmer, tape 14 field): obj_npc18walk walks RIGHT and must only shoot a player who is in FRONT of him (and not hidden in the grain).
        // The data tests "player.x < farmer.x", i.e. the player BEHIND him, so he shot you the instant you got to his back and you could never stab him.
        // FIX (cop, tape 16 "No loose ends"): obj_npc20 faces RIGHT; same inverted test let him spot you from behind.
        // Only these two comparisons are mirrored; every other < in the game is untouched.
        // FIX (SWAT patrol, tape 19): obj_swatpatrol's step code (938) has two shoot tests. The 1st ("facing left AND player.x < swat.x") is right.
        // The 2nd ("facing RIGHT AND player.x < swat.x") has the same inverted test, so a swat facing right shot a player standing BEHIND him.
        // Mirrored here (pc 206) so he only shoots a player who is in FRONT of him.
        // FIX (tape 20 dark hallway, obj_playerenemy = the clown): the same inverted "player.x < enemy.x" test made him RUN AWAY from you
        // (code 999 pc 90, his chase direction) and get knocked back TOWARD you by your flash (code 1000 pc 103). He left the hallway at 4px/frame,
        // never came back, and (since only one may exist at a time) no new one could spawn. Both mirrored here.
        st.push(((ci === 768 && pc === 6) || (ci === 834 && pc === 27) || (ci === 938 && pc === 206) || (ci === 999 && pc === 90) || (ci === 1000 && pc === 103) ? a > b : a < b) ? 1 : 0); pc++; break; }
      case 'sle': { const b = st.pop(), a = st.pop(); st.push(a <= b ? 1 : 0); pc++; break; }
      case 'seq': { const b = st.pop(), a = st.pop(); st.push(a == b ? 1 : 0); pc++; break; }
      case 'sne': { const b = st.pop(), a = st.pop(); st.push(a != b ? 1 : 0); pc++; break; }
      case 'sge': { const b = st.pop(), a = st.pop(); st.push(a >= b ? 1 : 0); pc++; break; }
      case 'sgt': { const b = st.pop(), a = st.pop(); st.push(a > b ? 1 : 0); pc++; break; }
      case 'pz': st.pop(); pc++; break;
      case 'pe': { const v = st.pop(); const l = withList(v, self, other);
        if (!l.length) { pc = i[1] + 1; } else { envs.push({ l, n: 0, self, other }); other = self; self = l[0]; pc++; } break; }
      case 'po': { const e = envs[envs.length - 1]; if (!e) { pc++; break; }
        if (i[2]) { envs.pop(); self = e.self; other = e.other; pc++; break; }
        e.n++;
        if (e.n < e.l.length) { self = e.l[e.n]; other = e.self; pc = i[1]; }
        else { envs.pop(); self = e.self; other = e.other; pc++; } break; }
      case 'ex': return;
      default: console.warn('bad op', i[0]); pc++;
    }
  }
}

// ---------- sprite / text drawing ----------
function drawSpr(si, fi, x, y, xs, ys, ang, alpha) {
  const s = G.spr[si]; if (!s) return;
  const n = s[9].length; if (!n) return;
  fi = Math.floor(fi) % n; if (fi < 0) fi += n;
  const t = G.tp[s[9][fi]]; if (!t) return;
  const img = tex[t[8]];
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  if (ang || xs !== 1 || ys !== 1) {
    ctx.save(); ctx.translate(x, y); if (ang) ctx.rotate(-ang * D2R); ctx.scale(xs, ys);
    ctx.drawImage(img, t[0], t[1], t[2], t[3], -s[3] + t[4], -s[4] + t[5], t[2], t[3]); ctx.restore();
  } else ctx.drawImage(img, t[0], t[1], t[2], t[3], Math.round(x - s[3] + t[4]), Math.round(y - s[4] + t[5]), t[2], t[3]);
  ctx.globalAlpha = 1;
}
function tinted(fi, col) {
  const key = fi + '_' + col; if (fontCache[key]) return fontCache[key];
  const f = G.fonts[fi], t = G.tp[f.tp];
  const c = document.createElement('canvas'); c.width = t[2]; c.height = t[3];
  const x = c.getContext('2d'); x.drawImage(tex[t[8]], t[0], t[1], t[2], t[3], 0, 0, t[2], t[3]);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = 'rgb(' + (col & 255) + ',' + ((col >> 8) & 255) + ',' + ((col >> 16) & 255) + ')';
  x.fillRect(0, 0, t[2], t[3]);
  return (fontCache[key] = c);
}
function textWidth(f, s) { let w = 0; for (const ch of s) { const g = f.glyphs[ch.charCodeAt(0)]; if (g) w += g[4]; } return w; }
function drawText(str, x, y) {
  const f = G.fonts[dfont]; if (!f) return;
  const atlas = tinted(dfont, dcol);
  const lines = String(str).replace(/\\n/g, '\n').split(/#|\n/);
  const lh = f.size + 6;
  lines.forEach((ln, li) => {
    let cx = x; const w = textWidth(f, ln);
    if (dalign === 1) cx -= w / 2; else if (dalign === 2) cx -= w;
    for (const ch of ln) {
      const g = f.glyphs[ch.charCodeAt(0)]; if (!g) continue;
      if (g[2] > 0 && g[3] > 0) ctx.drawImage(atlas, g[0], g[1], g[2], g[3], Math.round(cx + g[5]), Math.round(y + li * lh), g[2], g[3]);
      cx += g[4];
    }
  });
}

// ---------- sound ----------
function playSnd(i, loop) {
  const base = snds[i]; if (!base) return;
  const vol = G.snd[i][2];
  try {
    if (loop) { base.loop = true; base.volume = Math.min(1, vol); if (base.paused) base.play().catch(noop); }
    else { const a = base.cloneNode(); a.volume = Math.min(1, vol); a.play().catch(noop); sndPlaying[i].push(a); a.onended = () => { sndPlaying[i] = sndPlaying[i].filter(z => z !== a); }; }
  } catch (e) { }
}
function sndIsPlaying(i) { const b = snds[i]; return !!b && ((!b.paused && !b.ended) || sndPlaying[i].some(a => !a.paused && !a.ended)); }
function stopSnd(i) { const b = snds[i]; if (!b) return; b.pause(); b.currentTime = 0; sndPlaying[i].forEach(a => a.pause()); sndPlaying[i] = []; }
function stopAllSnd() { snds.forEach((_, i) => stopSnd(i)); }

// ---------- GML built-ins / drag-and-drop actions ----------
const cmp = (a, b, op) => op === 1 ? a < b : op === 2 ? a > b : a == b;
// FIX (tape 13): swapping the player into the trolley (obj_trolleyplayer) used to keep the PLAYER's taller collision mask, which\n// poked into the kitchen floor blocks and froze the sneak. GameMaker gives an object-swapped instance the new object's mask; we do\n// that only for the objects listed here so every other swap in the game behaves exactly as before.
const RESET_MASK_ON_CHANGE = new Set([627, 340]);
let lastRoomChangeFrame = -999;
const ROOM_CHANGE_COOLDOWN = 45;
const FN = {
  random: a => Math.random() * a[0],
  point_direction: a => { const d = Math.atan2(a[1] - a[3], a[2] - a[0]) / D2R; return (d + 360) % 360; },
  distance_to_object: (a, s) => { let best = 1e6; const bs = bbox(s, s.x, s.y); if (!bs) return best;
    for (const j of instOf(a[0])) { if (j === s) continue; const bj = bbox(j, j.x, j.y); if (!bj) continue;
      const dx = Math.max(0, bj[0] - bs[2], bs[0] - bj[2]), dy = Math.max(0, bj[1] - bs[3], bs[1] - bj[3]); best = Math.min(best, Math.hypot(dx, dy)); } return best; },
  file_exists: a => (memSaves[a[0]] || localStorage.getItem('hh_' + a[0])) ? 1 : 0,
  action_set_relative: a => { rel = a[0]; },
  action_if: a => a[0],
  action_if_number: a => cmp(instOf(a[0]).length, a[1], a[2]) ? 1 : 0,
  action_if_variable: a => cmp(a[0], a[1], a[2]) ? 1 : 0,
  action_if_dice: a => Math.random() * a[0] < 1 ? 1 : 0,
  action_if_sound: a => sndIsPlaying(a[0]) ? 1 : 0,
  action_if_next_room: () => roomOrderPos() < G.order.length - 1 ? 1 : 0,
  action_if_collision: (a, s) => { const x = rel ? s.x + a[0] : a[0], y = rel ? s.y + a[1] : a[1]; return (a[2] === 0 ? placeFree(s, x, y) : placeEmpty(s, x, y)) ? 0 : 1; },
  action_if_empty: (a, s) => { const x = rel ? s.x + a[0] : a[0], y = rel ? s.y + a[1] : a[1]; return (a[2] === 0 ? placeFree(s, x, y) : placeEmpty(s, x, y)) ? 1 : 0; },
  action_if_object: (a, s) => {
    const x = rel ? s.x + a[1] : a[1], y = rel ? s.y + a[2] : a[2];
    if (meeting(s, x, y, a[0])) return 1;
    // A solid door the player walks up to can leave them a few pixels short of its trigger zone (the walking step is 5px),
    // which made key doors unreachable depending on exact alignment. Allow a small tolerance for those only.
    if (s.solid && Math.abs(a[1]) <= 4 && Math.abs(a[2]) <= 2 && isA({ obj: a[0] }, 729)) { for (const dx of [-4, -3, -1, 1, 3, 4]) if (meeting(s, x + dx, y, a[0])) return 1; }
    return 0;
  },
  action_kill_object: (a, s) => { destroy(s); },
  action_create_object: (a, s) => { const x = rel ? s.x + a[1] : a[1], y = rel ? s.y + a[2] : a[2]; create(a[0], x, y); },
  action_create_object_motion: (a, s) => { const x = rel ? s.x + a[1] : a[1], y = rel ? s.y + a[2] : a[2]; const i = create(a[0], x, y); i.speed = a[3]; i.direction = a[4]; },
    action_change_object: (a, s) => {
    const n = a[0];
    if (a[1]) fire(s, 1, 0);
    s.obj = n;
    const o = G.objs[n];
    if (o[1] >= 0) s.sprite_index = o[1];
    s.depth = o[4]; s.solid = !!o[3]; s.visible = !!o[2];
    if (RESET_MASK_ON_CHANGE.has(n)) s.mask_index = o[7];
    // Player death objects: always stop motion + arm the fail sequence
    // 734 = obj_playerdie, 771 = obj_player2die, 363 = obj_playerenemydie
    if (n === 734 || n === 771 || n === 363) {
      s.speed = 0; s.hspeed = 0; s.vspeed = 0; s.gravity = 0;
      s.image_speed = 0;
      if (s.image_single < 0) s.image_single = 0;
    }
    if (a[1]) fire(s, 0, 0);
    // Re-assert die alarms after create (covers playerafk→die stab path where events can skip)
    if (n === 734 || n === 771 || n === 363) {
      if (!(s.alarm[0] > 0)) s.alarm[0] = 40;   // then image_single=1, arm retry
      if (!(s.alarm[2] > 0)) s.alarm[2] = 1;    // blood
      if (!(s.alarm[1] > 0)) { /* leave for die alarm 0 to set */ }
    }
  },
  action_set_alarm: (a, s) => { const k = a[1]; s.alarm[k] = rel && s.alarm[k] > 0 ? s.alarm[k] + a[0] : a[0]; },
  action_set_hspeed: (a, s) => { s.hspeed = rel ? s.hspeed + a[0] : a[0]; },
  action_set_vspeed: (a, s) => { s.vspeed = rel ? s.vspeed + a[0] : a[0]; },
  action_set_motion: (a, s) => { if (rel) { const h = s.hspeed + a[1] * Math.cos(a[0] * D2R), v = s.vspeed - a[1] * Math.sin(a[0] * D2R); s.hspeed = h; s.vspeed = v; } else { s.direction = a[0]; s.speed = a[1]; } },
  action_set_gravity: (a, s) => { s.gravity_direction = a[0]; s.gravity = rel ? s.gravity + a[1] : a[1]; },
  action_set_friction: (a, s) => { s.friction = rel ? s.friction + a[0] : a[0]; },
  action_move_start: (a, s) => { s.x = s.xstart; s.y = s.ystart; },
  action_move_to: (a, s) => { if (rel) { s.x += a[0]; s.y += a[1]; } else { s.x = a[0]; s.y = a[1]; } },
  action_move_point: (a, s) => { const x = rel ? s.x + a[0] : a[0], y = rel ? s.y + a[1] : a[1]; s.direction = FN.point_direction([s.x, s.y, x, y]); s.speed = a[2]; },
  action_move: (a, s) => { const str = String(a[0]); const map = [225, 270, 315, 180, -1, 0, 135, 90, 45]; const ch = [];
    for (let n = 0; n < 9; n++) if (str[n] === '1') ch.push(map[n]);
    if (!ch.length) return; const d = ch[Math.floor(Math.random() * ch.length)];
    if (d < 0) s.speed = 0; else { s.direction = d; s.speed = rel ? s.speed + a[1] : a[1]; } },
  action_move_contact: (a, s) => { const d = a[0], max = a[1] > 0 ? a[1] : 1000, dx = Math.cos(d * D2R), dy = -Math.sin(d * D2R); const solidOnly = a[2] === 0;
    for (let n = 0; n < max; n++) { const nx = s.x + dx, ny = s.y + dy; if (solidOnly ? !placeFree(s, nx, ny) : !placeEmpty(s, nx, ny)) break; s.x = nx; s.y = ny; } },
  action_bounce: (a, s) => { if (!placeFree(s, s.x + s.hspeed, s.y)) s.hspeed = -s.hspeed; if (!placeFree(s, s.x, s.y + s.vspeed)) s.vspeed = -s.vspeed; },
  action_reverse_xdir: (a, s) => { s.hspeed = -s.hspeed; },
  action_wrap: (a, s) => { if (a[0] !== 1) { if (s.x < 0) s.x += room.w; else if (s.x > room.w) s.x -= room.w; } if (a[0] !== 0) { if (s.y < 0) s.y += room.h; else if (s.y > room.h) s.y -= room.h; } },
  action_path: noop,
  action_sprite_set: (a, s) => { if (a[0] >= 0) s.sprite_index = a[0]; if (a[1] >= 0) s.image_index = a[1]; if (a[2] >= 0) s.image_speed = a[2]; },
  action_sprite_transform: (a, s) => { let xs = a[0], ys = a[1]; const m = a[3]; s.image_angle = a[2]; if (m === 1 || m === 3) xs = -xs; if (m === 2 || m === 3) ys = -ys; s.image_xscale = xs; s.image_yscale = ys; },
  action_sound: a => playSnd(a[0], a[1] > 0.5),
  action_end_sound: a => stopSnd(a[0]),
  action_color: a => { dcol = a[0]; },
  action_font: a => { dfont = a[0]; dalign = a[1]; },
  action_draw_text: (a, s) => { drawText(a[0], rel ? s.x + a[1] : a[1], rel ? s.y + a[2] : a[2]); },
  action_draw_variable: (a, s) => { drawText(String(a[0]), rel ? s.x + a[1] : a[1], rel ? s.y + a[2] : a[2]); },
  action_draw_sprite: (a, s) => { drawSpr(a[0], a[3] < 0 ? s.image_index : a[3], rel ? s.x + a[1] : a[1], rel ? s.y + a[2] : a[2], 1, 1, 0, 1); },
  action_draw_background: a => drawBg(a[0], a[1], a[2], a[3]),
  draw_sprite: (a, s) => drawSpr(a[0], a[1] < 0 ? s.image_index : a[1], a[2], a[3], 1, 1, 0, 1),
  draw_sprite_ext: (a, s) => drawSpr(a[0], a[1] < 0 ? s.image_index : a[1], a[2], a[3], a[4], a[5], a[6], a[8]),
  draw_self: (a, s) => drawSpr(s.sprite_index, s.image_index, s.x, s.y, s.image_xscale, s.image_yscale, s.image_angle, s.image_alpha),
  action_end_game: () => { gameOver = true; stopAllSnd(); },
  action_next_room: () => {
    if (nextRoom >= 0) return;           // already changing this frame
    const p = roomOrderPos();
    if (p < G.order.length - 1) nextRoom = G.order[p + 1];
  },
  action_previous_room: () => {
    if (nextRoom >= 0) return;           // already changing this frame
    const p = roomOrderPos();
    if (p > 0) nextRoom = G.order[p - 1];
  },
  action_current_room: () => { nextRoom = roomIdx; },
  action_another_room: a => { nextRoom = a[0]; },
  room_goto: a => { nextRoom = a[0]; },
  action_save_game: a => { pendingSave = String(a[0]); },
  action_load_game: a => { pendingLoad = String(a[0]); },
};
let pendingSave = null, pendingLoad = null;
const roomStore = {};
// ---- save / load (full-game snapshots, like GameMaker's game_save) ----
// Snapshots must stay small: browsers only allow ~5 MB of localStorage, and a save that fails to write silently leaves
// the OLD save in place (which is what used to send you back several tapes after a retry).
function tapeKey(ri) {
  const n = G.rooms[ri] && G.rooms[ri].name || '';
  let m = n.match(/^rm_l+evel(\d+)/); if (m) return 'L' + m[1];
  m = n.match(/^rm_outro(\d+)/); if (m) return 'O' + m[1];
  return null;
}
const memSaves = {};
function ser(i) {                                             // only keep what differs from a freshly created instance
  const base = new Inst(i.obj, i.x, i.y, i.id), o = { obj: i.obj, id: i.id, x: i.x, y: i.y };
  for (const k of Object.keys(i)) {
    if (k === 'obj' || k === 'id' || k === 'x' || k === 'y') continue;
    const v = i[k], b = base[k];
    if (Array.isArray(v)) { if (JSON.stringify(v) !== JSON.stringify(b)) o[k] = v.slice(); }
    else if (v !== b) o[k] = v;
  }
  return o;
}
function unser(o) { const i = new Inst(o.obj, o.x, o.y, o.id); Object.assign(i, o); i.alarm = (o.alarm || i.alarm).slice(); i.dead = false; return i; }
function snapshot(keepStore) {
  const store = {}, key = tapeKey(roomIdx);
  if (keepStore) for (const k in roomStore) { if (key && tapeKey(+k) === key) store[k] = roomStore[k].filter(i => !i.dead).map(ser); }
  const V2 = {}; for (const k in V) V2[k] = V[k].slice();
  return JSON.stringify({ room: roomIdx, insts: insts.filter(i => !i.dead).map(ser), store, nextId, V: V2, GL: Object.assign({}, GL) });
}
function restore(str) {
  const d = JSON.parse(str);
  stopAllSnd();
  insts = d.insts.map(unser);
  for (const k in roomStore) delete roomStore[k];
  for (const k in d.store) roomStore[k] = d.store[k].map(unser);
  roomIdx = d.room; room = G.rooms[roomIdx]; nextRoom = -1; nextId = d.nextId;
  for (const k in d.V) V[k] = d.V[k].slice();
  Object.assign(GL, d.GL);
  room.bgs.forEach((b, n) => { bgScroll[n] = [0, 0]; });
}
function doSave(name) {
  let str = snapshot(true);
  memSaves[name] = str;                                       // always kept for this session, even if the browser refuses
  try { localStorage.setItem('hh_' + name, str); return; } catch (e) { }
  str = snapshot(false); memSaves[name] = str;                // too big? save just the current room
  try { localStorage.setItem('hh_' + name, str); } catch (e) { console.warn('could not persist save', e); }
}
function doLoad(name) {
  try { const d = memSaves[name] || localStorage.getItem('hh_' + name); if (d) restore(d); } catch (e) { console.error('load failed', e); }
}
function roomOrderPos() { return G.order.indexOf(roomIdx); }

// ---------- backgrounds ----------
function drawBg(bgi, x, y, tiled) {
  const b = G.bg[bgi]; if (!b) return; const t = G.tp[b[1]]; if (!t) return; const img = tex[t[8]];
  const w = t[6] || t[2], h = t[7] || t[3];
  if (!tiled) { ctx.drawImage(img, t[0], t[1], t[2], t[3], Math.round(x + t[4]), Math.round(y + t[5]), t[2], t[3]); return; }
  const x0 = ((x % w) - w) % w, y0 = ((y % h) - h) % h;
  for (let yy = y0; yy < room.h; yy += h) for (let xx = x0; xx < room.w; xx += w) ctx.drawImage(img, t[0], t[1], t[2], t[3], Math.round(xx + t[4]), Math.round(yy + t[5]), t[2], t[3]);
}
function drawRoomBgs(fg) {
  room.bgs.forEach((b, n) => {
    if ((b.fg ? 1 : 0) !== fg || b.bg < 0) return;
    const sc = bgScroll[n] || [0, 0]; const x = b.x + sc[0], y = b.y + sc[1];
    const g = G.bg[b.bg], t = g && G.tp[g[1]]; if (!t) return; const img = tex[t[8]], w = t[6] || t[2], h = t[7] || t[3];
    const x0 = b.tx ? ((x % w) - w) % w : x, y0 = b.ty ? ((y % h) - h) % h : y;
    for (let yy = y0; yy < (b.ty ? room.h : y0 + 1); yy += h) for (let xx = x0; xx < (b.tx ? room.w : x0 + 1); xx += w)
      ctx.drawImage(img, t[0], t[1], t[2], t[3], Math.round(xx + t[4]), Math.round(yy + t[5]), t[2], t[3]);
  });
}

// ---------- rooms ----------
function initViews() {
  for (let n = 0; n < 8; n++) {
    const v = room.views[n];
    V.view_visible[n] = v ? v.en : 0; V.view_xview[n] = v ? v.x : 0; V.view_yview[n] = v ? v.y : 0;
    V.view_wview[n] = v ? v.w : 0; V.view_hview[n] = v ? v.h : 0; V.view_object[n] = v ? v.obj : -1;
  }
}
// A restored room remembers the player standing in the doorway they left through. Put them just inside that door,
// otherwise the door would send them straight back out again every frame.
function placeAtDoor() {
  const doors = insts.filter(d => !d.dead && d.target_r !== undefined);
  if (!doors.length) return;
  for (const p of insts) {
    if (p.dead || !isA(p, 729)) continue;
    for (const d of doors) {
      let guard = 0; const dir = d.x < room.w / 2 ? 1 : -1;
      while (guard++ < 60 && hit(p, p.x, p.y, d)) p.x += dir * 5;             // steps of 5 = the player's walking step, so
      if (guard > 1) p.x += dir * 15;                                         // puzzles that depend on exact alignment still work
    }
    p.speed = 0; p.xprevious = p.x; p.yprevious = p.y;
  }
}
function enterRoom(ri) {
  for (const i of insts) if (!i.dead) fire(i, 7, 5);                      // Room End
  const prev = roomIdx, hadRoom = !!room;
  const toMenu = G.rooms[ri].name === 'rm_mainmenu';                      // the main menu is a full game reset
  let keep = insts.filter(i => i.persistent && !i.dead);
  // overlays (fades, TV frame, static, tape cards... depth <= -500) are transient and never saved with a room
  if (hadRoom && room.pers && !toMenu) roomStore[prev] = insts.filter(i => !i.persistent && !i.dead && i.depth > -500);
  if (toMenu) { keep = []; for (const k in roomStore) delete roomStore[k]; stopAllSnd(); }
  { const nk = tapeKey(ri); if (nk && nk[0] === 'L') for (const k in roomStore) { const kk = tapeKey(+k); if (kk && kk[0] === 'L' && kk !== nk) delete roomStore[k]; } }   // earlier tapes are never revisited
  insts = keep; roomIdx = ri; room = G.rooms[ri]; nextRoom = -1;
  GL.room_width = room.w; GL.room_height = room.h; GL.room_speed = room.speed;
  initViews();
  room.bgs.forEach((b, n) => { bgScroll[n] = [0, 0]; });
  if (ri === prev) delete roomStore[ri];                                  // restarting a room resets it
  if (room.pers && roomStore[ri]) {                                       // persistent room: bring back its saved state
    insts = keep.concat(roomStore[ri]); delete roomStore[ri];
    placeAtDoor();
  } else {
    const fresh = [];
    for (const o of room.objs) {
      if (keep.some(k => k.id === o[3])) continue;
      const i = new Inst(o[2], o[0], o[1], o[3]);
      i.image_xscale = o[5]; i.image_yscale = o[6]; i.image_angle = o[7];
      insts.push(i); fresh.push([i, o[4]]);
    }
    for (const [i, cc] of fresh) { fire(i, 0, 0); if (cc >= 0) run(cc, i, null); }
    if (room.code >= 0) run(room.code, null, null);
  }
  for (const i of insts.slice()) if (!i.dead) fire(i, 7, 4);              // Room Start
  followViews();
}

// ---------- step ----------
function followViews() {
  for (let n = 0; n < 8; n++) { const v = room.views[n]; if (!V.view_visible[n] || V.view_object[n] < 0 || !v) continue;
    const t = instOf(V.view_object[n])[0]; if (!t || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
    let vx = V.view_xview[n], vy = V.view_yview[n]; if (!Number.isFinite(vx)) vx = 0; if (!Number.isFinite(vy)) vy = 0;
    const bx = Math.min(v.bx, v.w / 2), by = Math.min(v.by, v.h / 2);   // a huge border means "keep centered"
    if (t.x < vx + bx) vx = t.x - bx; if (t.x > vx + v.w - bx) vx = t.x - v.w + bx;
    if (t.y < vy + by) vy = t.y - by; if (t.y > vy + v.h - by) vy = t.y - v.h + by;
    V.view_xview[n] = Math.max(0, Math.min(room.w - v.w, vx)); V.view_yview[n] = Math.max(0, Math.min(room.h - v.h, vy)); }
}
function step() {
  try { stepInner(); } catch (e) { if (errCount++ < 20) console.error('step', e); }
  // Only process room change / save / load AFTER the full step, and only once
  if (nextRoom >= 0) {
    const target = nextRoom;
    nextRoom = -1;               // clear immediately so Room Start events cannot chain
    try { enterRoom(target); } catch (e) { console.error('room', e); nextRoom = -1; }
  }
  if (pendingSave) { const n = pendingSave; pendingSave = null; doSave(n); }
  if (pendingLoad) { const n = pendingLoad; pendingLoad = null; doLoad(n); }
}
// FIX (SWAT patrols, tape 19): every obj_swatpatrol in a room started walking LEFT with near-identical timers and could roam the whole
// corridor, so they bunched up and came at you two at a time. Now each patrol (a) starts in alternating directions with staggered timers,
// and (b) patrols only its OWN stretch of the corridor: from the turner (or the midpoint to the next patrol) on each side. A patrol that
// dies hands its stretch to its neighbours. Only obj_swatpatrol (339) is touched; a lone patrol behaves as before.
const SWATPATROL = 339, SWATTURNER = 218, SWATMASK = 667;
function swatPatrolFix() {
  const ps = [];
  for (const i of insts) if (!i.dead && i.obj === SWATPATROL) ps.push(i);
  if (!ps.length) return;
  ps.sort((a, b) => a.xstart - b.xstart || a.id - b.id);
  const sm = G.spr[SWATMASK], ml = sm ? sm[3] - sm[5] : 16, mr = sm ? sm[6] + 1 - sm[3] : 18, gap = 6;
  const tb = [];
  for (const t of insts) if (!t.dead && t.obj === SWATTURNER) { const b = bbox(t, t.x, t.y); if (b) tb.push(b); }
  ps.forEach((p, n) => {
    if (!p._swInit) {                                                    // first step in this room: stagger the start
      p._swInit = 1;
      if (p.hspeed !== 0 && p.sprite_index === 351) { const d = (n % 2) ? 3 : -3; p.hspeed = d; p.image_xscale = d > 0 ? 1 : -1; }
      if (p.alarm[0] > 0) p.alarm[0] += n * 37 + Math.floor(Math.random() * 30);
    }
    let lo = ml, hi = room.w - mr;
    for (const b of tb) { if ((b[0] + b[2]) / 2 < p.xstart) lo = Math.max(lo, b[2] + ml + 1); else hi = Math.min(hi, b[0] - mr - 1); }
    if (n > 0) lo = Math.max(lo, (ps[n - 1].xstart + p.xstart) / 2 + ml + gap);
    if (n < ps.length - 1) hi = Math.min(hi, (p.xstart + ps[n + 1].xstart) / 2 - mr - gap);
    if (lo > hi) return;
    const hs = p.hspeed;
    if ((hs < 0 && p.x + hs < lo) || (hs > 0 && p.x + hs > hi)) { p.hspeed = -hs; p.image_xscale = hs > 0 ? -1 : 1; }
  });
}
function stepInner() {
  frame++;
  const list = insts.slice();
  // alarms
  for (const i of list) { if (i.dead) continue;
    for (let k = 0; k < 12; k++) { if (i.alarm[k] > 0) { i.alarm[k]--; if (i.alarm[k] === 0) { i.alarm[k] = -1; fire(i, 2, k); } } } }
  // key events
  for (const i of list) { if (i.dead) continue;
    for (const k in pressed) { fire(i, 9, +k); }
    if (Object.keys(pressed).length) fire(i, 9, 1);
    for (const k in keys) if (keys[k]) fire(i, 5, +k);
    for (const k in released) fire(i, 10, +k);
  }
  for (const i of list) if (!i.dead) fire(i, 3, 1);
  for (const i of list) if (!i.dead) fire(i, 3, 0);
  swatPatrolFix();
  // motion
  for (const i of list) { if (i.dead) continue;
    i.xprevious = i.x; i.yprevious = i.y;
    if (i.gravity) { const gx = i.gravity * Math.cos(i.gravity_direction * D2R), gy = -i.gravity * Math.sin(i.gravity_direction * D2R); const h = i.hspeed + gx, v = i.vspeed + gy; i.hspeed = h; i.vspeed = v; }
    if (i.friction && i._sp) i._sp = Math.max(0, i._sp - i.friction);
    if (i._sp) { i.x += i.hspeed; i.y += i.vspeed; }
    if (!Number.isFinite(i.x)) i.x = i.xprevious; if (!Number.isFinite(i.y)) i.y = i.yprevious;
  }
  // collisions
  for (const i of list) { if (i.dead) continue;
    let o = i.obj; const seen = new Set();
    for (let n = 0; n < 20 && o >= 0; n++) { const ce = G.objs[o][8][4];
      if (ce) for (const sub in ce) { if (seen.has(sub)) continue; seen.add(sub);
        for (const j of insts.slice()) { if (i.dead) break; if (j === i || j.dead || !isA(j, +sub) || !hit(i, i.x, i.y, j)) continue;
          if (j.solid || i.solid) { i.x = i.xprevious; i.y = i.yprevious; }
          for (const id of ce[sub]) run(id, i, j); } }
      o = G.objs[o][6]; } }
  for (const i of list) if (!i.dead) fire(i, 3, 2);
  // animation, outside room
  for (const i of list) { if (i.dead) continue;
    if (i.image_single >= 0) i.image_index = i.image_single;
    else if (i.image_speed) { const s = G.spr[i.sprite_index]; i.image_index += i.image_speed;
      if (s) { const n = s[9].length; if (n && (i.image_index >= n || i.image_index < 0)) { i.image_index = ((i.image_index % n) + n) % n; fire(i, 7, 7); } } }
    const b = bbox(i, i.x, i.y);
    if (b && (b[2] < 0 || b[0] > room.w || b[3] < 0 || b[1] > room.h)) fire(i, 7, 0);
  }
  insts = insts.filter(i => !i.dead);
  followViews();
  room.bgs.forEach((b, n) => { if (b.sx || b.sy) { bgScroll[n][0] += b.sx; bgScroll[n][1] += b.sy; } });
  for (const k in pressed) delete pressed[k]; for (const k in released) delete released[k];
 // if (nextRoom >= 0) enterRoom(nextRoom);
 // if (pendingSave) { const n = pendingSave; pendingSave = null; doSave(n); }
 // if (pendingLoad) { const n = pendingLoad; pendingLoad = null; doLoad(n); }
}

// ---------- draw ----------
function drawWorld() {
  if (room.drawbg) { const c = room.bgc; ctx.fillStyle = 'rgb(' + (c & 255) + ',' + ((c >> 8) & 255) + ',' + ((c >> 16) & 255) + ')'; ctx.fillRect(0, 0, room.w, room.h); }
  drawRoomBgs(0);
  const items = [];
  for (const t of room.tiles) items.push({ d: t[7], t });
  for (const i of insts) if (!i.dead && i.visible) items.push({ d: i.depth, i });
  items.sort((a, b) => b.d - a.d);
  for (const it of items) {
    if (it.t) { const t = it.t, b = G.bg[t[2]], tp = b && G.tp[b[1]]; if (!tp) continue;
      const ix0 = Math.max(t[3], tp[4]), iy0 = Math.max(t[4], tp[5]);
      const ix1 = Math.min(t[3] + t[5], tp[4] + tp[2]), iy1 = Math.min(t[4] + t[6], tp[5] + tp[3]);
      if (ix1 <= ix0 || iy1 <= iy0) continue;
      ctx.drawImage(tex[tp[8]], tp[0] + (ix0 - tp[4]), tp[1] + (iy0 - tp[5]), ix1 - ix0, iy1 - iy0,
        t[0] + (ix0 - t[3]) * t[8], t[1] + (iy0 - t[4]) * t[9], (ix1 - ix0) * t[8], (iy1 - iy0) * t[9]); }
    else { const i = it.i; window.__cur = i;
      try { if (getEv(i.obj, 8, 0)) fire(i, 8, 0); else drawSpr(i.sprite_index, i.image_index, i.x, i.y, i.image_xscale, i.image_yscale, i.image_angle, i.image_alpha); }
      catch (e) { ctx.globalAlpha = 1; if (errCount++ < 20) console.error('draw', e); } }
  }
  drawRoomBgs(1);
}
function portOf(v) {
  // GameMaker keeps the picture undistorted; ignore leftover default ports whose aspect differs from the view
  let pw = v.pw, ph = v.ph;
  if (v.w > 0 && v.h > 0 && Math.abs(pw / ph - v.w / v.h) > 0.01) ph = Math.round(pw * v.h / v.w);
  return [v.px, v.py, pw, ph];
}
function fit() {
  if (!canvas.style) return;
  const k = Math.min(innerWidth / canvas.width, innerHeight / canvas.height);
  canvas.style.width = Math.floor(canvas.width * k) + 'px';
  canvas.style.height = Math.floor(canvas.height * k) + 'px';
}
function draw() {
  // the screen is the bounding box of all visible view ports (this is what makes the kill-scene zoom work)
  let sw = 0, sh = 0; const vis = [];
  for (let n = 0; n < 8; n++) { const v = room.views[n]; if (!V.view_visible[n] || !v) continue; const p = portOf(v); vis.push([n, v, p]); sw = Math.max(sw, p[0] + p[2]); sh = Math.max(sh, p[1] + p[3]); }
  if (!vis.length) { sw = G.w; sh = G.h; }
  if (canvas.width !== sw || canvas.height !== sh) { canvas.width = sw; canvas.height = sh; saveDepth = 0; ctx.imageSmoothingEnabled = false; fit(); }
  while (saveDepth > 0) ctx.restore();
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const [n, v, p] of vis) {
    ctx.save(); ctx.beginPath(); ctx.rect(p[0], p[1], p[2], p[3]); ctx.clip();
    ctx.translate(p[0], p[1]); ctx.scale(p[2] / v.w, p[3] / v.h);
    const vx = Number.isFinite(V.view_xview[n]) ? V.view_xview[n] : 0, vy = Number.isFinite(V.view_yview[n]) ? V.view_yview[n] : 0;
    ctx.translate(-Math.round(vx), -Math.round(vy));
    try { drawWorld(); } finally { ctx.globalAlpha = 1; ctx.restore(); }
  }
  if (!vis.length) drawWorld();
}

// ---------- main loop ----------
let acc = 0, last = 0;
function loop(t) {
  requestAnimationFrame(loop);
  if (!last) last = t; acc += t - last; last = t; if (acc > 500) acc = 500;
  const dt = 1000 / (GL.room_speed || 30);
  let ran = false;
  while (acc >= dt && !gameOver) { try { step(); } catch (e) { console.error('step', e); } acc -= dt; ran = true; }
  if (ran || frame < 2) { try { draw(); } catch (e) { console.error('draw', e); } }
  if (gameOver) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#fff'; ctx.font = '14px monospace'; ctx.textAlign = 'center'; ctx.fillText('Game over - refresh to play again', canvas.width / 2, canvas.height / 2); }
}

window.addEventListener('keydown', e => { if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault(); if (!keys[e.keyCode]) pressed[e.keyCode] = 1; keys[e.keyCode] = 1; });
window.addEventListener('keyup', e => { keys[e.keyCode] = 0; released[e.keyCode] = 1; });
window.addEventListener('resize', () => fit());
window.addEventListener('blur', () => { for (const k in keys) keys[k] = 0; });

window.HH = { fit, key(k, down) { if (down) { if (!keys[k]) pressed[k] = 1; keys[k] = 1; } else { keys[k] = 0; released[k] = 1; } },
  start(first) { loadAssets(() => { enterRoom(first === undefined ? G.order[0] : first); requestAnimationFrame(loop); }); },
  // test hooks
  _: { hit, bbox, create, press(k){ pressed[k]=1; keys[k]=1; }, release(k){ keys[k]=0; released[k]=1; }, get roomIdx(){return roomIdx;}, GL, V, enterRoom, step, draw, get insts() { return insts; }, get room() { return room; }, FN, run } };
})();
