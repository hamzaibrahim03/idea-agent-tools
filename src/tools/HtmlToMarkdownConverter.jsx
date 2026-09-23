import { useState } from 'react';
// Minimal HTML -> Markdown for a small, dependency-free converter. Not a
// full-spec conversion - covers the common cases (headings, bold/italic,
// links, lists, paragraphs) mirroring the scope of MarkdownPreviewer's
// Markdown -> HTML parser, just inverted.
function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  function inline(node) {
    let result = '';
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent;
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName.toLowerCase();
      const inner = inline(child);
      if (tag === 'strong' || tag === 'b') result += `**${inner}**`;
      else if (tag === 'em' || tag === 'i') result += `*${inner}*`;
      else if (tag === 'code') result += `\`${inner}\``;
      else if (tag === 'a') result += `[${inner}](${child.getAttribute('href') || ''})`;
      else if (tag === 'br') result += '\n';
      else result += inner;
    }
    return result;
  }
  function block(node, lines) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) lines.push(text);
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        const level = Number(tag[1]);
        lines.push(`${'#'.repeat(level)} ${inline(child).trim()}`);
        lines.push('');
      } else if (tag === 'p') {
        lines.push(inline(child).trim());
        lines.push('');
      } else if (tag === 'ul' || tag === 'ol') {
        let i = 1;
        for (const li of child.children) {
          if (li.tagName.toLowerCase() !== 'li') continue;
          const prefix = tag === 'ul' ? '-' : `${i}.`;
          lines.push(`${prefix} ${inline(li).trim()}`);
          i++;
        }
        lines.push('');
      } else if (tag === 'blockquote') {
        lines.push(`> ${inline(child).trim()}`);
        lines.push('');
      } else if (tag === 'pre') {
        lines.push('```');
        lines.push(child.textContent);
        lines.push('```');
        lines.push('');
      } else if (tag === 'hr') {
        lines.push('---');
        lines.push('');
      } else if (tag === 'br') {
        lines.push('');
      } else {
        block(child, lines);
      }
    }
  }
  const lines = [];
  block(doc.body, lines);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
export default function HtmlToMarkdownConverter() {
  const [input, setInput] = useState(
    '<h1>Title</h1>\n<p>Some <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.com">link</a>.</p>\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>'
  );
  const [copied, setCopied] = useState(false);
  const output = input.trim() ? htmlToMarkdown(input) : '';
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Non-critical convenience action - fail silently on clipboard denial.
    }
  }
  return (
    <div className="tool-page">
      <h1>HTML to Markdown Converter</h1>
      <p className="tool-description">
        Paste basic HTML and convert it to Markdown - headings, bold/italic, links, lists,
        blockquotes, and paragraphs. Handles common HTML, not the full spec. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="html-input">HTML</label>
          <textarea
            id="html-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<h1>Hello</h1>"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="md-output">Markdown</label>
          <textarea id="md-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
        </div>
      </div>
    </div>
  );
}
