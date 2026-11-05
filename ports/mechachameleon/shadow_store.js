// Temporary backing for recoverable texture bytes. Each worker owns one locked file; stale files are reclaimed later.
'use strict';
async function rxcCreateShadowStore(maxBytes = 2 * 1024 ** 3) {
  if (!navigator.storage?.getDirectory || !navigator.locks) return null;
  const dir = await (await navigator.storage.getDirectory()).getDirectoryHandle('rxc-texture-shadows', { create: true });
  for await (const [name] of dir.entries()) {
    await navigator.locks.request('rxc-shadow-' + name, { ifAvailable: true }, async lock => {
      if (lock) await dir.removeEntry(name).catch(() => {});
    });
  }
  const name = crypto.randomUUID(), slots = new Map(), free = [];
  let unlock, ready, reject, file, end = 0, disabled = false;
  const opened = new Promise((yes, no) => { ready = yes; reject = no; });
  const held = navigator.locks.request('rxc-shadow-' + name, async () => {
    try {
      file = await (await dir.getFileHandle(name, { create: true })).createSyncAccessHandle();
      ready();
      await new Promise(resolve => { unlock = resolve; });
    } catch (e) { reject(e); }
    finally { file?.close(); await dir.removeEntry(name).catch(() => {}); }
  });
  await opened;
  const stats = { bytes: 0, writes: 0, reads: 0, writeMs: 0, readMs: 0, errors: 0 };
  function release(slot) {
    free.push({ at: slot.at, cap: slot.cap }); free.sort((a, b) => a.at - b.at);
    for (let i = 1; i < free.length;) {
      if (free[i - 1].at + free[i - 1].cap === free[i].at) { free[i - 1].cap += free[i].cap; free.splice(i, 1); }
      else i++;
    }
  }
  function drop(id) { const s = slots.get(id); if (s) { slots.delete(id); stats.bytes -= s.size; release(s); } }
  return {
    stats,
    put(id, bytes) {
      if (disabled || slots.has(id)) return false;
      const cap = Math.ceil(bytes.length / 65536) * 65536;
      const i = free.findIndex(s => s.cap >= cap);
      let at;
      if (i >= 0) { at = free[i].at; free[i].at += cap; free[i].cap -= cap; if (!free[i].cap) free.splice(i, 1); }
      else { if (end + cap > maxBytes) return false; at = end; end += cap; }
      const slot = { at, cap, size: bytes.length }, t = performance.now();
      try {
        if (file.write(bytes, { at }) !== bytes.length) throw new Error('short texture shadow write');
        slots.set(id, slot); stats.bytes += bytes.length; stats.writes++; stats.writeMs += performance.now() - t;
        return true;
      } catch (e) {
        release(slot); disabled = true; stats.errors++;
        console.warn('[gfx worker] texture backing writes disabled:', String(e));
        return false;
      }
    },
    get(id, bytes) {
      const s = slots.get(id); if (!s || s.size !== bytes.length) return false;
      const t = performance.now();
      try {
        if (file.read(bytes, { at: s.at }) !== bytes.length) throw new Error('short texture shadow read');
        stats.reads++; stats.readMs += performance.now() - t; drop(id); return true;
      } catch (e) { stats.errors++; console.error('[gfx worker] texture backing read failed:', String(e)); return false; }
    },
    drop,
    async close() { unlock(); await held; },
  };
}
