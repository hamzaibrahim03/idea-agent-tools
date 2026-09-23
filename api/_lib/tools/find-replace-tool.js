import { createComputeHandler } from '../computeHandler.js';

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findReplace(text, find, replace, options) {
  if (!find) return { result: text, count: 0, error: '' };
  let re;
  try {
    const flags = (options.global ? 'g' : '') + (options.caseSensitive ? '' : 'i');
    const source = options.regex ? find : escapeRegExp(find);
    re = new RegExp(source, flags);
  } catch (e) {
    return { result: text, count: 0, error: e.message };
  }
  let count = 0;
  const result = text.replace(re, (...args) => {
    count++;
    return typeof replace === 'function' ? replace(...args) : replace;
  });
  return { result, count, error: '' };
}

function compute({ input, find, replace, caseSensitive, useRegex, replaceAll }) {
  const text = input || '';
  const { result, count, error } = findReplace(text, find || '', replace || '', {
    caseSensitive: !!caseSensitive,
    regex: !!useRegex,
    global: !!replaceAll
  });
  return { result, count, error };
}

export default createComputeHandler(compute);
