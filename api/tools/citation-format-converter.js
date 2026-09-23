import { createComputeHandler } from '../_lib/computeHandler.js';

function formatApa({ author, title, year, publisher, url }) {
  const parts = [];
  if (author) parts.push(`${author}.`);
  parts.push(`(${year || 'n.d.'}).`);
  if (title) parts.push(`${title}.`);
  if (publisher) parts.push(`${publisher}.`);
  if (url) parts.push(url);
  return parts.filter(Boolean).join(' ');
}
function formatMla({ author, title, year, publisher, url }) {
  const parts = [];
  if (author) parts.push(`${author}.`);
  if (title) parts.push(`"${title}."`);
  const tail = [publisher, year].filter(Boolean).join(', ');
  if (tail) parts.push(`${tail}.`);
  if (url) parts.push(`${url}.`);
  return parts.filter(Boolean).join(' ');
}
function formatChicago({ author, title, year, publisher, url }) {
  const parts = [];
  if (author) parts.push(`${author}.`);
  if (title) parts.push(`${title}.`);
  const tail = [publisher, year].filter(Boolean).join(', ');
  if (tail) parts.push(`${tail}.`);
  if (url) parts.push(`${url}.`);
  return parts.filter(Boolean).join(' ');
}
const FORMATTERS = { apa: formatApa, mla: formatMla, chicago: formatChicago };

function compute({ author, title, year, publisher, url }) {
  const source = { author: author || '', title: title || '', year: year || '', publisher: publisher || '', url: url || '' };
  const results = {};
  for (const key of Object.keys(FORMATTERS)) {
    results[key] = FORMATTERS[key](source);
  }
  return { results };
}

export default createComputeHandler(compute);
