import { createComputeHandler } from '../computeHandler.js';

function compute({ componentName, rows }) {
  const name = componentName || '';
  const list = Array.isArray(rows) ? rows : [];
  const pad = (text, w) => (text || '').padEnd(w, ' ');
  const widths = {
    name: Math.max(4, ...list.map((r) => (r.name || '').length), 4),
    type: Math.max(4, ...list.map((r) => (r.type || '').length), 4),
    defaultValue: Math.max(7, ...list.map((r) => (r.defaultValue || '').length), 7),
    description: Math.max(11, ...list.map((r) => (r.description || '').length), 11)
  };
  const headerLine = `| ${pad('Prop', widths.name)} | ${pad('Type', widths.type)} | ${pad('Default', widths.defaultValue)} | ${pad('Description', widths.description)} |`;
  const dividerLine = `| ${'-'.repeat(widths.name)} | ${'-'.repeat(widths.type)} | ${'-'.repeat(widths.defaultValue)} | ${'-'.repeat(widths.description)} |`;
  const bodyLines = list.map(
    (r) => `| ${pad(r.name, widths.name)} | ${pad(r.type, widths.type)} | ${pad(r.defaultValue, widths.defaultValue)} | ${pad(r.description, widths.description)} |`
  );
  const markdown = `### ${name} Props\n\n${[headerLine, dividerLine, ...bodyLines].join('\n')}`;
  return { markdown };
}

export default createComputeHandler(compute);
