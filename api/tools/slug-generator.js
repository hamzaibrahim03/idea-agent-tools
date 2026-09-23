import { createComputeHandler } from '../_lib/computeHandler.js';

function slugify(text, separator) {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');
}

function compute({ input, separator }) {
  const sep = separator || '-';
  const slug = input ? slugify(input, sep) : '';
  return { slug };
}

export default createComputeHandler(compute);
