import { createComputeHandler } from '../_lib/computeHandler.js';

function columnize(items, columnCount) {
  if (items.length === 0) return '';
  const rows = Math.ceil(items.length / columnCount);
  const columns = [];
  for (let c = 0; c < columnCount; c++) {
    columns.push(items.slice(c * rows, c * rows + rows));
  }
  const widths = columns.map((col) => col.reduce((max, item) => Math.max(max, item.length), 0));
  const lines = [];
  for (let r = 0; r < rows; r++) {
    const cells = columns.map((col, c) => (col[r] !== undefined ? col[r].padEnd(widths[c]) : ''));
    lines.push(cells.join('  ').trimEnd());
  }
  return lines.join('\n');
}

function compute({ input, columnCount }) {
  const items = String(input || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const output = columnize(items, Math.max(1, Math.min(items.length || 1, Number(columnCount) || 1)));
  return { output, itemCount: items.length };
}

export default createComputeHandler(compute);
