import { createComputeHandler } from '../computeHandler.js';

function tagForPath(path) {
  const trimmed = path.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const isAppleTouch = lower.includes('apple-touch-icon');
  if (isAppleTouch) {
    return `<link rel="apple-touch-icon" href="${trimmed}">`;
  }
  if (lower.endsWith('.ico')) {
    return `<link rel="icon" href="${trimmed}">`;
  }
  const sizeMatch = lower.match(/(\d+)x\1/);
  const type = lower.endsWith('.svg')
    ? 'image/svg+xml'
    : lower.endsWith('.png')
      ? 'image/png'
      : null;
  const attrs = [`rel="icon"`, `href="${trimmed}"`];
  if (type) attrs.push(`type="${type}"`);
  if (sizeMatch) attrs.push(`sizes="${sizeMatch[0]}"`);
  return `<link ${attrs.join(' ')}>`;
}
function buildFaviconTags(paths) {
  return paths
    .map(tagForPath)
    .filter(Boolean)
    .join('\n');
}

function compute({ paths }) {
  const output = buildFaviconTags(paths || []);
  return { output };
}

export default createComputeHandler(compute);
