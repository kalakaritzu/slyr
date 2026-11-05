export function linkWgslPair(vertexSource, fragmentSource) {
  let vertex = vertexSource;
  let fragment = fragmentSource;
  const groups = [...vertex.matchAll(/@group\((\d+)\)/g)].map(match => Number(match[1]));
  const offset = Math.max(2, ...groups.map(group => group + 1));
  fragment = fragment.replace(/@group\((\d+)\)/g, (_, group) => {
    const mapped = Number(group) + offset;
    if (mapped > 3) throw new Error('shader pair exceeds four WebGPU bind groups');
    return `@group(${mapped})`;
  });

  const output = /\bstruct\s+VertexOutput\s*\{([\s\S]*?)\}/.exec(vertex);
  if (!output) throw new Error('vertex output structure not found');
  const byName = new Map();
  for (const field of output[1].matchAll(/@location\((\d+)\)\s+(?:@interpolate\([^)]+\)\s+)?([A-Za-z_]\w*)\s*:/g))
    byName.set(field[2], Number(field[1]));
  const entry = /@fragment\s+fn\s+[A-Za-z_]\w*\s*\(/.exec(fragment);
  if (!entry) throw new Error('fragment entry point not found');
  const begin = entry.index + entry[0].length;
  let depth = 0, end = -1;
  for (let i = begin; i < fragment.length; i++) {
    if (fragment[i] === '(') depth++;
    else if (fragment[i] === ')') {
      if (!depth) { end = i; break; }
      depth--;
    }
  }
  if (end < 0) throw new Error('unterminated fragment entry parameters');
  let params = fragment.slice(begin, end);
  params = params.replace(/@location\((\d+)\)(\s+(?:@interpolate\([^)]+\)\s+)?)([A-Za-z_]\w*)(\s*:)/g,
    (all, old, decoration, name, colon) => {
      const location = byName.get(name);
      if (location === undefined) {
        if (name.startsWith('vs_')) throw new Error(`vertex output ${name} not found`);
        return all;
      }
      return `@location(${location})${decoration}${name}${colon}`;
    });
  fragment = fragment.slice(0, begin) + params + fragment.slice(end);

  const required = new Map();
  for (const match of params.matchAll(/@location\((\d+)\)\s+(@interpolate\([^)]+\))/g)) {
    const location = Number(match[1]), interpolation = match[2];
    if (required.has(location) && required.get(location) !== interpolation)
      throw new Error(`conflicting interpolation at location ${location}`);
    required.set(location, interpolation);
  }
  if (required.size) {
    let fields = output[1];
    for (const [location, interpolation] of required) {
      const field = new RegExp(`@location\\(${location}\\)\\s+((?:@interpolate\\([^)]+\\)\\s+)?[A-Za-z_]\\w*\\s*:)`);
      const found = field.exec(fields);
      if (!found) throw new Error(`vertex output location ${location} not found`);
      if (found[1].startsWith('@interpolate(')) {
        if (!found[1].startsWith(interpolation)) throw new Error(`interpolation mismatch at location ${location}`);
      } else fields = fields.replace(field, `@location(${location}) ${interpolation} $1`);
    }
    vertex = vertex.replace(output[0], output[0].replace(output[1], fields));
  }
  return { vertex, fragment };
}
