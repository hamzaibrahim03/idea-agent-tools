import { createComputeHandler } from '../_lib/computeHandler.js';

const IDENTIFIER_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function toJsObjectLiteral(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => childPad + toJsObjectLiteral(v, indent + 1));
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const items = keys.map((k) => {
      const key = IDENTIFIER_KEY.test(k) ? k : `'${k.replace(/'/g, "\\'")}'`;
      return `${childPad}${key}: ${toJsObjectLiteral(value[k], indent + 1)}`;
    });
    return `{\n${items.join(',\n')}\n${pad}}`;
  }
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return String(value);
}

function jsonToJsObject(json) {
  return toJsObjectLiteral(JSON.parse(json));
}

function jsObjectToJson(code) {
  const value = new Function(`"use strict"; return (\n${code}\n);`)();
  return JSON.stringify(value, null, 2);
}

function compute({ mode, input }) {
  if (!input || !String(input).trim()) {
    return { output: '' };
  }
  try {
    const output = mode === 'json-to-js' ? jsonToJsObject(input) : jsObjectToJson(input);
    return { output };
  } catch (e) {
    throw new Error(e.message);
  }
}

export default createComputeHandler(compute);
