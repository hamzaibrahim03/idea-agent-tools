import { createComputeHandler } from '../computeHandler.js';

function parseDelimited(text, delimiter) {
  const lines = String(text || '').split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const splitLine = (line) => (delimiter === '\t' ? line.split('\t') : line.split(','));
  const headers = splitLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => splitLine(line).map((c) => c.trim()));
  return { headers, rows };
}

function toMarkdown(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const dividerLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const bodyLines = rows.map((r) => `| ${headers.map((_, i) => r[i] || '').join(' | ')} |`);
  return [headerLine, dividerLine, ...bodyLines].join('\n');
}

function toCsv(headers, rows) {
  const escape = (cell) => {
    const s = String(cell ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.map(escape).join(','), ...rows.map((r) => headers.map((_, i) => escape(r[i] || '')).join(','))];
  return lines.join('\n');
}

function compute({ input, delimiter }) {
  const { headers, rows } = parseDelimited(input, delimiter === 'tab' ? '\t' : ',');
  const hasData = headers.length > 0;
  const markdown = hasData ? toMarkdown(headers, rows) : '';
  const csv = hasData ? toCsv(headers, rows) : '';
  return { headers, rows, markdown, csv, hasData };
}

export default createComputeHandler(compute);
