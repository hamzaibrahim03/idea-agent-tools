import { createComputeHandler } from '../computeHandler.js';

function alignmentMarker(align) {
  if (align === 'center') return ':---:';
  if (align === 'right') return '---:';
  return ':---';
}

function buildMarkdown(headers, rows, alignments) {
  const colCount = headers.length;
  const widths = Array.from({ length: colCount }, (_, c) => {
    const headerLen = (headers[c] || '').length;
    const cellLens = rows.map((r) => (r[c] || '').length);
    return Math.max(3, headerLen, ...cellLens);
  });
  const pad = (text, w) => (text || '').padEnd(w, ' ');
  const headerLine = `| ${headers.map((h, c) => pad(h, widths[c])).join(' | ')} |`;
  const dividerLine = `| ${alignments.map((a, c) => alignmentMarker(a).padEnd(widths[c], '-')).join(' | ')} |`;
  const bodyLines = rows.map((row) => `| ${row.map((cell, c) => pad(cell, widths[c])).join(' | ')} |`);
  return [headerLine, dividerLine, ...bodyLines].join('\n');
}

function compute({ headers, rows, alignments }) {
  const h = Array.isArray(headers) ? headers : [];
  const r = Array.isArray(rows) ? rows : [];
  const a = Array.isArray(alignments) ? alignments : h.map(() => 'left');
  return { markdown: buildMarkdown(h, r, a) };
}

export default createComputeHandler(compute);
