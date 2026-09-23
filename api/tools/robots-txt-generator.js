import { createComputeHandler } from '../_lib/computeHandler.js';

function buildRobotsTxt(blocks, sitemapUrl) {
  const lines = [];
  for (const block of blocks) {
    const agent = (block.userAgent || '').trim() || '*';
    lines.push(`User-agent: ${agent}`);
    for (const rule of block.rules || []) {
      if (!(rule.path || '').trim()) continue;
      lines.push(`${rule.type}: ${rule.path.trim()}`);
    }
    lines.push('');
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  if ((sitemapUrl || '').trim()) {
    if (lines.length) lines.push('');
    lines.push(`Sitemap: ${sitemapUrl.trim()}`);
  }
  return lines.join('\n');
}

function compute({ blocks, sitemapUrl }) {
  const list = Array.isArray(blocks) ? blocks : [];
  return { output: buildRobotsTxt(list, sitemapUrl || '') };
}

export default createComputeHandler(compute);
