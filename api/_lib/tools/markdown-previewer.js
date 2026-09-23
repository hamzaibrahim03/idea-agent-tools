import { createComputeHandler } from '../computeHandler.js';

function renderMarkdown(md) {
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const withInline = (line) =>
    escapeHtml(line)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const lines = md.split('\n');
  const html = [];
  let inList = false;
  let inCode = false;
  for (const raw of lines) {
    if (raw.trim().startsWith('```')) {
      inCode = !inCode;
      html.push(inCode ? '<pre><code>' : '</code></pre>');
      continue;
    }
    if (inCode) {
      html.push(escapeHtml(raw));
      continue;
    }
    const heading = raw.match(/^(#{1,6})\s+(.*)$/);
    const listItem = raw.match(/^[-*]\s+(.*)$/);
    const quote = raw.match(/^>\s?(.*)$/);
    if (listItem) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${withInline(listItem[1])}</li>`);
      continue;
    }
    if (inList) { html.push('</ul>'); inList = false; }
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${withInline(heading[2])}</h${level}>`);
    } else if (quote) {
      html.push(`<blockquote>${withInline(quote[1])}</blockquote>`);
    } else if (raw.trim() === '') {
      html.push('');
    } else {
      html.push(`<p>${withInline(raw)}</p>`);
    }
  }
  if (inList) html.push('</ul>');
  return html.join('\n');
}

function compute({ input }) {
  return { html: renderMarkdown(input || '') };
}

export default createComputeHandler(compute);
