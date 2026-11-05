// Optional disk cache for byte ranges. Store each range as a complete 200 response;
// CacheStorage rejects 206 responses and the HTTP cache can race concurrent ranges.
globalThis.rxcInstallRangeCache = function({ prefix, maxEntries = 512, maxRangeBytes = 1 << 20, name = 'rxc-ranges-v1' }) {
  const original = globalThis.fetch.bind(globalThis), root = new URL(prefix, location.href).href;
  maxEntries = Math.max(1, Math.floor(maxEntries));
  let cachePromise, indexPromise, order, indexed, pending = 0, writes = true, mutations = Promise.resolve();
  const stats = { hits: 0, misses: 0, stored: 0, errors: 0, indexMs: 0, lookupMs: 0, writeMs: 0 };
  const cache = () => cachePromise ||= caches.open(name).catch(() => null);
  const index = disk => indexPromise ||= (async () => {
    const t = performance.now(), keys = await disk.keys();
    stats.indexMs += performance.now() - t;
    order = keys.map(key => key.url);
    indexed = new Set(order);
  })();
  const touch = url => {
    if (!indexed?.has(url)) return;
    const at = order.indexOf(url);
    if (at >= 0) order.splice(at, 1);
    order.push(url);
  };
  globalThis.fetch = async function(input, init) {
    const request = new Request(input, init), range = request.headers.get('Range');
    const match = /^bytes=(\d+)-(\d+)$/.exec(range || '');
    if (request.method !== 'GET' || !request.url.startsWith(root) || !match) return original(input, init);
    const size = +match[2] - +match[1] + 1;
    if (size <= 0 || size > maxRangeBytes) return original(input, init);
    const key = new Request(new URL('/__rxc_range_cache/' + encodeURIComponent(request.url) + '/' + range, location.origin));
    let disk;
    try {
      disk = await cache();
      if (disk) await index(disk);
      const t = performance.now(), hit = disk && indexed.has(key.url) && await disk.match(key);
      stats.lookupMs += performance.now() - t;
      if (hit) { stats.hits++; touch(key.url); return new Response(hit.body, {status: 206, statusText: 'Partial Content', headers: hit.headers}); }
    } catch (_) { stats.errors++; }
    stats.misses++;
    const response = await original(request, {cache: 'no-store'});
    const span = /^bytes (\d+)-(\d+)\/\d+$/.exec(response.headers.get('Content-Range') || '');
    if (disk && writes && response.status === 206 && span && span[1] === match[1] && span[2] === match[2] && +response.headers.get('Content-Length') === size && pending < 8) {
      const copy = response.clone(); pending++;
      mutations = mutations.then(async () => {
        await index(disk);
        const t = performance.now();
        await disk.put(key, new Response(copy.body, {status: 200, headers: copy.headers}));
        stats.stored++;
        if (!indexed.has(key.url)) { indexed.add(key.url); order.push(key.url); }
        else touch(key.url);
        while (order.length > maxEntries) {
          const oldest = order.shift();
          indexed.delete(oldest);
          await disk.delete(oldest);
        }
        stats.writeMs += performance.now() - t;
      }).catch(e => {
        stats.errors++;
        if (e.name === 'QuotaExceededError') writes = false;
        if (copy.body && !copy.body.locked) copy.body.cancel().catch(() => {});
      }).finally(() => { pending--; });
    }
    return response;
  };
  return { stats, flush: () => mutations, uninstall: () => { globalThis.fetch = original; } };
};
