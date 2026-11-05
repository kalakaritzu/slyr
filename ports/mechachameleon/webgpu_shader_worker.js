// Browser-side shader translation, kept separate from graphics replay so compilation cannot block a frame.
let translator;
let linker;
let spirvCompiler;

async function compileSpirv(source, stage) {
  if (!spirvCompiler) spirvCompiler = (async () => {
    const url = new URL('glslang/glslang.js', self.location.href);
    const { default: glslangModule } = await import(url.href);
    return glslangModule();
  })();
  const glslang = await spirvCompiler;
  return glslang.compileGLSL(source, stage);
}

async function getTranslator() {
  if (!translator) translator = (async () => {
    const base = new URL('.', self.location.href);
    const [{ glslToWgsl }, naga] = await Promise.all([
      import(new URL('glsl2wgsl_core.mjs', base).href),
      import(new URL('naga/index.js', base).href),
    ]);
    await naga.init();
    return { glslToWgsl, translate: naga.translate };
  })();
  return translator;
}

self.onmessage = async event => {
  const { id, stage, source, options = [], link } = event.data;
  try {
    if (link) {
      const base = new URL('.', self.location.href);
      if (!linker) linker = import(new URL('link_wgsl_core.mjs', base).href);
      const { linkWgslPair } = await linker;
      self.postMessage({ id, pair: linkWgslPair(link.vertex, link.fragment) });
      return;
    }
    const { glslToWgsl, translate } = await getTranslator();
    const wgsl = await glslToWgsl(stage, source, { translate, compileSpirv, options });
    self.postMessage({ id, wgsl });
  } catch (error) {
    self.postMessage({ id, error: String(error.formatted || error) });
  }
};
