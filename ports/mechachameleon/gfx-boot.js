// gfx_worker.js can only be started as a classic worker from the page's own origin. When the page itself is served
// from a CDN (jsDelivr and friends) its runtime is on that CDN too, so this rebuilds the worker from its source with
// every relative URL made absolute and starts it from a blob: URL, which is allowed - the graphics stay on a worker
// thread instead of falling back to WebGL on the engine thread. A same-origin page just gets the plain file.
(() => {
  const workerUrl = () => new URL('gfx_worker.js', document.baseURI);
  const abs = path => new URL(path, workerUrl()).href;

  globalThis.rxcMakeGfxWorker = async function () {
    const url = workerUrl();
    if (url.origin === location.origin) return new Worker(url.href);

    const res = await fetch(url.href);
    if (!res.ok) throw new Error('cannot load gfx_worker.js (HTTP ' + res.status + ')');
    let src = await res.text();
    const rewrite = (from, to) => {
      if (!src.includes(from)) throw new Error('gfx_worker.js no longer contains ' + from);
      src = src.split(from).join(to);
    };
    rewrite("importScripts('rexcomp_gfx.js')", "importScripts('" + abs('rexcomp_gfx.js') + "')");
    rewrite("importScripts('shadow_store.js')", "importScripts('" + abs('shadow_store.js') + "')");
    rewrite("fetch('programs.json')", "fetch('" + abs('programs.json') + "')");
    // rexcomp_gfx.wasm is looked up next to the worker's own script, which is a blob: URL here
    rewrite('G = await RexcompGfx({', "G = await RexcompGfx({ locateFile: p => new URL(p, '" + workerUrl().href + "').href,");
    return new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
  };
})();
