// Loaded by index.html. Keeps the game's data chunks on disk so the game never waits on the network for a 1 MB
// block after the first visit (?install=0 turns it off, ?install=1 forces a full pass now). Only does anything when
// the build is chunked-packed (manifest.json has {chunk, files}); on a Range-mode dev server it exits immediately.
(() => {
  const q = new URLSearchParams(location.search);
  if (q.get('install') === '0') return;
  if (!('serviceWorker' in navigator) || !('caches' in window)) return;
  if (navigator.connection && navigator.connection.saveData && q.get('install') !== '1') return;
  // A CDN data base is another origin: nothing would read those cached chunks (sw.js only answers same-origin /game/
  // requests), so a prefetch would pull the whole 3.1 GB container into Cache Storage for no benefit.
  // A CDN-backed build is cached by the CDN itself, and a service worker registered on a public CDN origin would claim
  // that path for every player: the local install pass is for self-hosted copies only (?install=1 forces it). sw.js
  // also answers same-origin /game/ requests only, so chunks cached from a CDN would never be read back.
  if (window.RXC_CDN && q.get('install') !== '1') return;
  const NAME = 'meccha-game-v1', KEY = 'meccha.install.v1';
  let badge = null;
  const show = t => { if (!badge) { badge = document.createElement('div');
      badge.style.cssText = 'position:fixed;left:10px;bottom:8px;z-index:30;font:12px/1.3 ui-monospace,monospace;color:#9aa6b4;background:rgba(0,0,0,.6);padding:4px 9px;border-radius:6px;pointer-events:none';
      document.body.appendChild(badge); }
    badge.textContent = t; };
  const hide = () => { if (badge) badge.style.display = 'none'; };
  window.mecchaCache = { installed: false, done: 0, total: 0, cache: NAME };
  (async () => {
    let m; try { const r = await fetch('manifest.json', { cache: 'no-cache' }); m = await r.json(); } catch (e) { return; }
    if (!m || !m.files) return;                                  // Range mode (dev server): nothing to pre-install
    navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
    // do not compete with the game's own reads on a cold start: wait for the first frame, then a little longer
    const waitFirstFrame = async () => { for (let i = 0; i < 900; i++) { if (window.rexcomp && window.rexcomp.__lastPresent) return; await new Promise(r => setTimeout(r, 200)); } };
    const chunk = m.chunk, urls = [];
    for (const [k, n] of Object.entries(m.files)) {
      const rel = k.split(' + BS + ').map(encodeURIComponent).join('/');
      const v = m.vers && m.vers[k] ? '?v=' + m.vers[k] : '';
      for (let i = 0; i < Math.ceil(n / chunk); i++) urls.push('game/' + rel + '.' + i + v);
    }
    window.mecchaCache.total = urls.length;
    const fp = urls.length + ':' + Object.values(m.files).reduce((a, b) => a + b, 0);
    let done = 0;
    try { done = (JSON.parse(localStorage.getItem(KEY) || '{}')[fp] || 0); } catch (e) {}
    if (done >= urls.length && q.get('install') !== '1') { window.mecchaCache.installed = true; return; }
    if (q.get('install') !== '1') { await waitFirstFrame(); await new Promise(r => setTimeout(r, 15000)); }
    if (q.get('install') === '1') done = 0;
    try { await navigator.storage.persist(); } catch (e) {}      // ask Chrome not to evict the saved data
    const cache = await caches.open(NAME);
    const store = cache;
    let i = done, fails = 0;
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ [fp]: i })); } catch (e) {} };
    show('saving game data ' + Math.round(100 * i / urls.length) + '%');
    const worker = async () => {
      while (i < urls.length) {
        const u = urls[i++];
        try {
          const abs = new URL(u, location.href).href;
          if (!(await store.match(abs, { ignoreVary: true }))) {
            const r = await fetch(u);
            if (r.ok) await store.put(abs, r.clone());
          }
        } catch (e) { if (++fails > 80) { show('saving stopped (storage full)'); setTimeout(hide, 5000); return; } }
        if (i % 40 === 0) { window.mecchaCache.done = i; show('saving game data ' + Math.round(100 * i / urls.length) + '%'); save(); }
      }
    };
    await Promise.all([worker(), worker()]);   // two at a time: the game keeps the link most of the time
    window.mecchaCache.done = i;
    if (i >= urls.length) { save(); show('game data saved'); setTimeout(hide, 4000); }
  })();
})();
