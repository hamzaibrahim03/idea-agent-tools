import { useState } from 'react';
function parseXml(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(parseError.textContent.trim().split('\n')[0] || 'Invalid XML.');
  }
  return doc;
}
function serializeIndented(node, depth, lines) {
  const indent = '  '.repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text) lines.push(indent + text);
    return;
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    lines.push(`${indent}<!--${node.textContent}-->`);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const attrs = Array.from(node.attributes)
    .map((a) => ` ${a.name}="${a.value}"`)
    .join('');
  const children = Array.from(node.childNodes).filter(
    (c) => c.nodeType !== Node.TEXT_NODE || c.textContent.trim()
  );
  const onlyText = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
  if (children.length === 0) {
    lines.push(`${indent}<${node.tagName}${attrs} />`);
  } else if (onlyText) {
    lines.push(`${indent}<${node.tagName}${attrs}>${children[0].textContent.trim()}</${node.tagName}>`);
  } else {
    lines.push(`${indent}<${node.tagName}${attrs}>`);
    for (const child of children) serializeIndented(child, depth + 1, lines);
    lines.push(`${indent}</${node.tagName}>`);
  }
}
function prettyPrintXml(xml) {
  const doc = parseXml(xml);
  const lines = [];
  for (const child of doc.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.COMMENT_NODE) {
      serializeIndented(child, 0, lines);
    }
  }
  return lines.join('\n');
}
function minifyXml(xml) {
  const doc = parseXml(xml);
  return new XMLSerializer()
    .serializeToString(doc)
    .replace(/>\s+</g, '><')
    .trim();
}
export default function XmlFormatter() {
  const [input, setInput] = useState('<root><item id="1"><name>First</name></item><item id="2"><name>Second</name></item></root>');
  const [mode, setMode] = useState('pretty');
  const [copied, setCopied] = useState(false);
  let output = '';
  let error = '';
  if (input.trim()) {
    try {
      output = mode === 'pretty' ? prettyPrintXml(input) : minifyXml(input);
    } catch (e) {
      error = e.message || 'Invalid XML.';
    }
  }
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>XML Formatter</h1>
      <p className="tool-description">
        Pretty-print or minify XML using the browser's built-in XML parser and serializer. Runs
        entirely in your browser.
      </p>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="radio" name="xml-mode" checked={mode === 'pretty'} onChange={() => setMode('pretty')} />
          Pretty-print
        </label>
        <label className="checkbox-label">
          <input type="radio" name="xml-mode" checked={mode === 'minify'} onChange={() => setMode('minify')} />
          Minify
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="xml-input">XML</label>
          <textarea
            id="xml-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<root><item>value</item></root>"
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="xml-output">Result</label>
          <textarea id="xml-output" value={output} readOnly spellCheck={false} placeholder="Result will appear here" />
        </div>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
