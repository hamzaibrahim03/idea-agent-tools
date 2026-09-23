import { createComputeHandler } from '../_lib/computeHandler.js';

function toPascalCase(key) {
  const cleaned = key.replace(/[^a-zA-Z0-9]+/g, ' ').trim();
  return cleaned
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') || 'Root';
}
function isValidIdentifier(key) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}
function propKey(key) {
  return isValidIdentifier(key) ? key : JSON.stringify(key);
}
function inferType(value, name, interfaces) {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const elementTypes = [...new Set(value.map((v) => inferType(v, name, interfaces)))];
    return elementTypes.length === 1 ? `${elementTypes[0]}[]` : `(${elementTypes.join(' | ')})[]`;
  }
  const t = typeof value;
  if (t === 'object') {
    const interfaceName = toPascalCase(name);
    buildInterface(value, interfaceName, interfaces);
    return interfaceName;
  }
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'unknown';
}
function buildInterface(obj, name, interfaces) {
  const keys = Object.keys(obj);
  const lines = keys.map((key) => {
    const type = inferType(obj[key], key, interfaces);
    return `  ${propKey(key)}: ${type};`;
  });
  interfaces.push(`interface ${name} {\n${lines.join('\n')}\n}`);
  return name;
}
function generateInterfaces(json, rootName) {
  const parsed = JSON.parse(json);
  const interfaces = [];
  if (Array.isArray(parsed)) {
    if (parsed.length === 0 || typeof parsed[0] !== 'object' || parsed[0] === null) {
      const elementType = parsed.length ? inferType(parsed[0], rootName, interfaces) : 'unknown';
      return `type ${rootName} = ${elementType}[];`;
    }
    buildInterface(parsed[0], rootName, interfaces);
    return interfaces.reverse().join('\n\n');
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return `type ${rootName} = ${inferType(parsed, rootName, interfaces)};`;
  }
  buildInterface(parsed, rootName, interfaces);
  return interfaces.reverse().join('\n\n');
}

function compute({ input, rootName }) {
  if (!input || !String(input).trim()) return { output: '' };
  try {
    const output = generateInterfaces(input, (rootName || '').trim() || 'Root');
    return { output };
  } catch (e) {
    throw new Error(e.message);
  }
}

export default createComputeHandler(compute);
