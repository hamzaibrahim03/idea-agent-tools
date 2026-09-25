import { useMemo, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function findReplace(text, find, replace, options) {
  if (!find) return { result: text, count: 0, error: '' };
  let re;
  try {
    const flags = (options.global ? 'g' : '') + (options.caseSensitive ? '' : 'i');
    const source = options.regex ? find : escapeRegExp(find);
    re = new RegExp(source, flags);
  } catch (e) {
    return { result: text, count: 0, error: e.message };
  }
  let count = 0;
  const result = text.replace(re, (...args) => {
    count++;
    return typeof replace === 'function' ? replace(...args) : replace;
  });
  return { result, count, error: '' };
}
export default function FindReplaceTool() {
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [useRegex, setUseRegex] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);
  const [copied, setCopied] = useState(false);
  const { result, count, error } = useMemo(
    () => findReplace(input, find, replace, { caseSensitive, regex: useRegex, global: replaceAll }),
    [input, find, replace, caseSensitive, useRegex, replaceAll]
  );
  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(result, 'find-replace-result.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Find &amp; Replace</h1>
      <p className="tool-description">
        Paste text and find/replace across it, with optional case sensitivity, regex matching, and
        replace-all vs replace-first-only. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="fr-find">Find</label>
          <input
            id="fr-find"
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder={useRegex ? 'e.g. \\d+' : 'e.g. cat'}
            spellCheck={false}
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="fr-replace">Replace with</label>
          <input
            id="fr-replace"
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="e.g. dog"
            spellCheck={false}
          />
        </div>
      </div>
      <div className="tool-controls">
        <label className="checkbox-label">
          <input type="checkbox" checked={caseSensitive} onChange={() => setCaseSensitive((v) => !v)} />
          Case-sensitive
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={useRegex} onChange={() => setUseRegex((v) => !v)} />
          Treat Find as regex
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={replaceAll} onChange={() => setReplaceAll((v) => !v)} />
          Replace all (unchecked = first match only)
        </label>
        <button onClick={handleCopy} disabled={!result}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!result}>
          Download
        </button>
      </div>
      {error && (
        <div className="tool-error">
          <strong>Invalid regex:</strong> {error}
        </div>
      )}
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="fr-input">Input</label>
          <textarea id="fr-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="fr-output">Result ({count} replacement{count === 1 ? '' : 's'})</label>
          <textarea id="fr-output" value={result} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
