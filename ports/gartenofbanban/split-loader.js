/* Inline in the existing HTML launcher, then call createSplitLoader(manifest, label). */
function createSplitLoader(assets, element, {baseURL = document.baseURI, concurrency = 3, onProgress = () => {}} = {}) {
    if (!element) throw new Error('A loading text element is required');
    if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error('concurrency must be a positive integer');
    const DOWNLOAD_ASSETS = assets;
    const loadingText = element;
    const originalFetch = window.fetch.bind(window);
    const assetURLs = new Map();
    let totalBytes = DOWNLOAD_ASSETS.reduce((sum, asset) =>
      sum + asset.parts.reduce((bytes, part) => bytes + part.bytes, 0), 0);
    let loadedBytes = 0;
    let loadingFailed = false;

    function updateLoadingText() {
      if (loadingFailed) return;
      const mbDone = (loadedBytes / (1024 * 1024)).toFixed(2);
      const mbTotal = (totalBytes / (1024 * 1024)).toFixed(2);
      loadingText.textContent = `LOADING... ${mbDone} MB / ${mbTotal} MB`;
      onProgress(loadedBytes, totalBytes);
    }

    function assetBase(asset) { return asset.baseURL || baseURL; }

    async function fetchWithProgress(part) {
      const response = await originalFetch(new URL(part.url, assetBase(part)));
      if (!response.ok) throw new Error(`Could not load ${part.url} (HTTP ${response.status})`);
      let expected = part.bytes;
      const chunks = [];
      let received = 0;
      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          received += value.byteLength;
          loadedBytes += value.byteLength;
          chunks.push(value);
          updateLoadingText();
        }
      } else {
        const bytes = new Uint8Array(await response.arrayBuffer());
        received = bytes.byteLength;
        loadedBytes += received;
        chunks.push(bytes);
      }
      totalBytes += received - expected;
      updateLoadingText();
      return new Blob(chunks);
    }

    function assetKey(url) {
      const resolved = new URL(url, baseURL);
      resolved.hash = '';
      return resolved.href;
    }

    function mimeType(url) {
      if (url.endsWith('.js')) return 'text/javascript';
      if (url.endsWith('.wasm')) return 'application/wasm';
      if (url.endsWith('.mp4')) return 'video/mp4';
      return 'application/octet-stream';
    }

    async function mergeFiles(asset) {
      const buffers = [];
      for (const part of asset.parts) buffers.push(await fetchWithProgress({...part, baseURL: assetBase(asset)}));
      const merged = new Blob(buffers, { type: asset.type || mimeType(asset.url) });
      const blobURL = URL.createObjectURL(merged);
      for (const url of [asset.url, ...(asset.aliases || [])]) {
        assetURLs.set(assetKey(new URL(url, baseURL)), blobURL);   // keyed by where the game will ask for it (next to this page), not where it was downloaded from
      }
    }

    function resolveAsset(url) {
      try { return assetURLs.get(assetKey(url)) || url; }
      catch { return url; }
    }

    function installAssetRoutes() {
      // Route only the exact manifest URLs (including known package version aliases).
      window.fetch = function(input, init) {
        const url = input instanceof Request ? input.url : String(input);
        const mapped = resolveAsset(url);
        return originalFetch(mapped === url ? input :
          input instanceof Request ? new Request(mapped, input) : mapped, init);
      };
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        return originalOpen.call(this, method, resolveAsset(String(url)), ...rest);
      };

    }

    function loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = resolveAsset(url);
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Could not start ${url}`));
        document.body.appendChild(script);
      });
    }


    let downloadPromise;
    async function downloadAll() {
      updateLoadingText();
      let nextAsset = 0;
      try {
        await Promise.all(Array.from({length: concurrency}, async () => {
          while (!loadingFailed && nextAsset < DOWNLOAD_ASSETS.length) {
            await mergeFiles(DOWNLOAD_ASSETS[nextAsset++]);
          }
        }));
        installAssetRoutes();
      } catch (error) {
        loadingFailed = true;
        loadingText.textContent = `Loading failed: ${error.message}`;
        throw error;
      }
    }
    window.addEventListener('pagehide', event => {
      if (!event.persisted) for (const url of assetURLs.values()) URL.revokeObjectURL(url);
    });
    return {
      download() { return downloadPromise || (downloadPromise = downloadAll()); },
      loadScript, resolveAsset,
      get loadedBytes() { return loadedBytes; },
      get totalBytes() { return totalBytes; }
    };
}
