import { createComputeHandler } from '../_lib/computeHandler.js';

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        current += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  fields.push(current);
  return fields;
}
function csvToJson(csv) {
  const lines = csv.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return '[]';
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? '';
    });
    return obj;
  });
  return JSON.stringify(rows, null, 2);
}
function csvEscape(value) {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}
function jsonToCsv(json) {
  const data = JSON.parse(json);
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return '';
  const headers = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach((k) => set.add(k));
    return set;
  }, new Set()));
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  return lines.join('\n');
}

function compute({ input, mode }) {
  const text = input || '';
  let output = '';
  let error = '';
  if (text.trim()) {
    try {
      output = mode === 'csv-to-json' ? csvToJson(text) : jsonToCsv(text);
    } catch (e) {
      error = e.message;
    }
  }
  return { output, error };
}

export default createComputeHandler(compute);
