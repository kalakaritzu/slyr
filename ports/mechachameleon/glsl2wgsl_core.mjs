// Keep the conversion independent of Node so the same shader fixups can run in a browser worker.

function rewriteImageCall(source, name, operation, arity, emit) {
  const call = new RegExp(`\\b${operation}\\(\\s*${name}\\s*,`, 'g');
  let rewritten = '', from = 0, match;
  while ((match = call.exec(source))) {
    let depth = 0, start = call.lastIndex, end = -1;
    const args = [];
    for (let i = start; i < source.length; i++) {
      if (source[i] === '(' || source[i] === '[') depth++;
      else if (source[i] === ')' || source[i] === ']') {
        if (!depth) { end = i; break; }
        depth--;
      } else if (source[i] === ',' && !depth) {
        args.push(source.slice(start, i).trim()); start = i + 1;
      }
    }
    if (end < 0) throw new Error(`unterminated ${operation}`);
    args.push(source.slice(start, end).trim());
    if (args.length !== arity || args.some(x => !x)) throw new Error(`unsupported ${operation} arguments`);
    rewritten += source.slice(from, match.index) + emit(...args);
    from = end + 1;
    call.lastIndex = from;
  }
  return rewritten + source.slice(from);
}

export async function glslToWgsl(stage, inputSource, { translate, compileSpirv, options = [] }) {
  if (!['vertex', 'fragment', 'compute'].includes(stage)) throw new Error('unsupported shader stage');
  if (options.some(x => !['--widen-r8', '--allow-nonuniform-derivatives', '--layer-uniform'].includes(x)))
    throw new Error('unsupported shader option');
  const widenR8 = options.includes('--widen-r8');
  // GLSL's precise qualifier has no WGSL equivalent. Leave all other declarations intact so unsupported features fail visibly.
  let source = inputSource.replace(/\bprecise\s+/g, '');
  const hasImageReadOrAtomic = /\bimage(?:Load|Atomic\w*)\s*\(/.test(source);
  if (options.includes('--layer-uniform')) {
    if (stage !== 'fragment' || !/\bgl_Layer\b/.test(source))
      throw new Error('--layer-uniform requires a fragment shader using gl_Layer');
    const used = new Set([...source.matchAll(/\blayout\(\s*set\s*=\s*(\d+)/g)].map(m => Number(m[1])));
    const set = [0, 1, 2, 3].find(n => !used.has(n));
    if (set === undefined || !/^#version[^\n]*\n/.test(source))
      throw new Error('--layer-uniform requires a free bind group and GLSL version directive');
    source = source.replace(/^#version[^\n]*\n/,
      `$&layout(set = ${set}, binding = 0, std140) uniform RxcLayer { int rxcLayer; };\n`)
      .replace(/\bgl_Layer\b/g, 'rxcLayer');
  }
  if (widenR8) {
    if (stage !== 'compute') throw new Error('--widen-r8 supports compute shaders only');
    const widened = [];
    source = source.replace(/\bwriteonly\s+layout\(set\s*=\s*\d+\s*,\s*binding\s*=\s*\d+\s*,\s*r8\)\s+(?:highp\s+|mediump\s+|lowp\s+)?uniform\s+image3D\s+([A-Za-z_]\w*)\s*;/g,
      (declaration, name) => { widened.push(name); return declaration.replace(/\br8\b/, 'rgba8'); });
    for (const name of widened) {
      source = rewriteImageCall(source, name, 'imageStore', 2,
        (coords, value) => `imageStore(${name}, ${coords}, vec4((${value}).x, 0.0, 0.0, 1.0))`);
    }
    if (/\b(?:r8\)\s+(?:highp\s+|mediump\s+|lowp\s+)?uniform\s+image3D|r8unorm)\b/.test(source))
      throw new Error('unsupported r8 storage image declaration');
  }
  source = source.replace(/\bshared\s+struct\s*\{([^{}]+)\}\s*([A-Za-z_]\w*)\s*\[(\d+)\]\s*;/g,
    (_, fields, name, count) => `struct Rxc_${name} {${fields}}; shared Rxc_${name} ${name}[${count}];`);
  source = source.replace(/\bmemoryBarrierShared\(\)\s*;\s*barrier\(\)\s*;/g, 'barrier();');
  // GLSL buffer textures map to read-only storage buffers with one four-component element per texel.
  const buffers = new Map();
  source = source.replace(/layout\(set\s*=\s*(\d+)\s*,\s*binding\s*=\s*(\d+)\)\s+uniform\s+(?:highp\s+|mediump\s+|lowp\s+)?([ui]?textureBuffer)\s+([A-Za-z_]\w*)\s*;/g,
    (_, set, binding, kind, name) => {
      const type = kind[0] === 'u' ? 'uvec4' : kind[0] === 'i' ? 'ivec4' : 'vec4';
      buffers.set(name, kind[0] === 'u' || kind[0] === 'i' ? kind[0] : '');
      return `layout(set = ${set}, binding = ${binding}, std430) readonly buffer Rxc_${name} { ${type} values[]; } ${name};`;
    });
  for (const [name, prefix] of buffers) {
    const fetch = new RegExp(`texelFetch\\(\\s*${prefix}samplerBuffer\\(\\s*${name}\\s*,\\s*[A-Za-z_]\\w*\\s*\\)\\s*,\\s*int\\(([^()]+)\\)\\s*\\)`, 'g');
    source = source.replace(fetch, (_, index) => `${name}.values[uint(${index})]`);
  }
  if (/\b(?:[ui]?textureBuffer|[ui]?samplerBuffer)\b/.test(source))
    throw new Error('unsupported texture-buffer declaration or access');
  const images = new Map();
  source = source.replace(/(?:writeonly\s+)?layout\(set\s*=\s*(\d+)\s*,\s*binding\s*=\s*(\d+)\s*,\s*(r32(?:ui|i|f)|r8_snorm)\)\s+(?:highp\s+|mediump\s+|lowp\s+)?uniform\s+([ui]?imageBuffer)\s+([A-Za-z_]\w*)\s*;/g,
    (declaration, set, binding, format, kind, name) => {
      const type = format === 'r8_snorm' ? 'snorm8' : format === 'r32ui' ? 'uint' : format === 'r32i' ? 'int' : 'float';
      if (kind !== (type === 'uint' ? 'uimageBuffer' : type === 'int' ? 'iimageBuffer' : 'imageBuffer')) return declaration;
      images.set(name, type);
      return `layout(set = ${set}, binding = ${binding}, std430) buffer Rxc_${name} { ${type === 'snorm8' ? 'uint' : type} values[]; } ${name};`;
    });
  for (const [name, type] of images) {
    if (type === 'snorm8') {
      if (new RegExp(`\\bimage(?:Load|Atomic\\w*)\\(\\s*${name}\\s*,`).test(source))
        throw new Error('signed-normalized buffer-image reads or atomics are unsupported');
      source = rewriteImageCall(source, name, 'imageStore', 2,
        (index, value) => `rxcStore_${name}(uint(${index}), (${value}).x)`);
      const helper = `void rxcStore_${name}(uint index, float value) {
  uint word = index >> 2u;
  uint shift = (index & 3u) * 8u;
  uint mask = 255u << shift;
  uint bits = uint(int(round(clamp(value, -1.0, 1.0) * 127.0))) & 255u;
  atomicAnd(${name}.values[word], ~mask);
  atomicOr(${name}.values[word], bits << shift);
}\n`;
      if (!/\bvoid\s+main\s*\(/.test(source)) throw new Error('GLSL main function required');
      source = source.replace(/\bvoid\s+main\s*\(/, helper + 'void main(');
      continue;
    }
    for (const operation of ['imageAtomicAdd', 'imageAtomicExchange']) {
      if (type === 'float' && new RegExp(`\\b${operation}\\(\\s*${name}\\s*,`).test(source))
        throw new Error('floating-point buffer-image atomics are unsupported');
      source = rewriteImageCall(source, name, operation, 2,
        (index, value) => `atomic${operation.slice(11)}(${name}.values[uint(${index})], ${value})`);
    }
    source = rewriteImageCall(source, name, 'imageStore', 2,
      (index, value) => `${name}.values[uint(${index})] = (${value}).x`);
    const vector = type === 'uint' ? 'uvec4' : type === 'int' ? 'ivec4' : 'vec4';
    const zero = type === 'uint' ? '0u' : type === 'int' ? '0' : '0.0';
    const one = type === 'uint' ? '1u' : type === 'int' ? '1' : '1.0';
    source = rewriteImageCall(source, name, 'imageLoad', 1,
      index => `${vector}(${name}.values[uint(${index})], ${zero}, ${zero}, ${one})`);
    if (new RegExp(`\\bimageAtomic\\w*\\(\\s*${name}\\s*,`).test(source))
      throw new Error('buffer-image atomics require an atomic storage binding');
  }
  // Naga exposes these Vulkan GLSL built-ins as unsigned WGSL inputs, while
  // HLSLcc's generated arithmetic uses signed GLSL integers.
  source = source.replace(/\bgl_(Vertex|Instance)Index\b/g, (_, kind) => `int(gl_${kind}Index)`);
  source = source.replace(/\(\s*-(u_xlatu\w*)\s*\)/g, ' (0u - $1) ');
  const clip = /\bgl_ClipDistance\s*\[/.test(source);
  if (clip) {
    const refs = source.replace(/\bout\s+float\s+gl_ClipDistance\s*\[\s*1\s*\]\s*;/g, '');
    if (stage !== 'vertex' || /\bgl_ClipDistance\s*\[\s*(?!0\s*\])/.test(refs))
      throw new Error('only vertex gl_ClipDistance[0] is supported');
    if (!/\bout\s+float\s+gl_ClipDistance\s*\[\s*1\s*\]/.test(source)) {
      if (!/^#version[^\n]*\n/.test(source)) throw new Error('GLSL version directive required for clip distances');
      source = source.replace(/^#version[^\n]*\n/, '$&layout(location = 15) out float gl_ClipDistance[1];\n');
    }
  }
  let wgsl;
  try { wgsl = translate({ from: 'glsl', to: 'wgsl', source, parse: { stage } }); }
  catch (directError) {
    if (stage === 'vertex' || !compileSpirv) throw directError;
    try {
      const spirv = await compileSpirv(source.replace(/^#version\s+440\b/m, '#version 450'), stage);
      wgsl = translate({ from: 'spirv', to: 'wgsl', source: spirv });
    } catch (spirvError) {
      throw new Error(`GLSL: ${directError.formatted || directError}\nSPIR-V: ${spirvError.formatted || spirvError}`);
    }
  }
  if (!hasImageReadOrAtomic)
    wgsl = wgsl.replace(/storageBarrier\(\);\s*workgroupBarrier\(\);\s*subgroupBarrier\(\);\s*textureBarrier\(\);/g,
      'storageBarrier();\n    workgroupBarrier();');
  if (clip) {
    const output = /struct VertexOutput\s*\{([\s\S]*?)\}/.exec(wgsl);
    const field = output && /@location\(\d+\)\s+gl_ClipDistance:\s*f32\s*,/.exec(output[1]);
    if (!field) throw new Error('Naga did not emit a scalar clip-distance output');
    const index = [...output[1].slice(0, field.index).matchAll(/@(?:location|builtin)\(/g)].length;
    const fields = [...output[1].matchAll(/@(?:location|builtin)\(/g)].length;
    const returns = [...wgsl.matchAll(/return VertexOutput\(([A-Za-z_\d\s,]+)\);/g)];
    if (returns.length !== 1) throw new Error('cannot identify the vertex output constructor');
    const args = returns[0][1].split(',').map(x => x.trim());
    if (args.length !== fields || !args[index]) throw new Error('clip-distance output constructor mismatch');
    args[index] = `array<f32, 1>(${args[index]})`;
    wgsl = 'enable clip_distances;\n' + wgsl.replace(output[0],
      output[0].replace(field[0], '@builtin(clip_distances) gl_ClipDistance: array<f32, 1>,'))
      .replace(returns[0][0], `return VertexOutput(${args.join(', ')});`);
  }
  if (options.includes('--allow-nonuniform-derivatives')) {
    if (stage !== 'fragment') throw new Error('--allow-nonuniform-derivatives supports fragment shaders only');
    wgsl = 'diagnostic(off, derivative_uniformity);\n' + wgsl;
  }
  return wgsl;
}
