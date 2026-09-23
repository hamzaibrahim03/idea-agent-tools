import { createComputeHandler } from '../_lib/computeHandler.js';

function buildUrl(width, height, bgColor, textColor, text) {
  const dimensions = height ? `${width}x${height}` : `${width}`;
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  const colors = bgColor.replace('#', '') + (textColor ? '/' + textColor.replace('#', '') : '');
  const query = params.toString();
  return `https://placehold.co/${dimensions}/${colors}${query ? '?' + query : ''}`;
}

function compute({ width, height, bgColor, textColor, text }) {
  const widthNum = Math.max(1, Math.min(4000, Number(width) || 1));
  const heightNum = height ? Math.max(1, Math.min(4000, Number(height) || 1)) : null;
  const url = buildUrl(widthNum, heightNum, bgColor, textColor, text);
  return { url, widthNum, heightNum };
}

export default createComputeHandler(compute);
