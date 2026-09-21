import { useState } from 'react';
function convertQuotes(code, targetQuote) {
  const quoteChars = ['"', "'", '`'];
  let result = '';
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (quoteChars.includes(ch)) {
      const openQuote = ch;
      let j = i + 1;
      let content = '';
      while (j < code.length) {
        if (code[j] === '\\' && j + 1 < code.length) {
          content += code[j] + code[j + 1];
          j += 2;
          continue;
        }
        if (code[j] === openQuote) break;
        content += code[j];
        j++;
      }
      if (j >= code.length) {
        result += code.slice(i);
        break;
      }
      const unescaped = content.replace(new RegExp(`\\\\${openQuote}`, 'g'), openQuote);
      const reescaped = unescaped.replace(new RegExp(targetQuote, 'g'), `\\${targetQuote}`);
      result += targetQuote + reescaped + targetQuote;
      i = j + 1;
    } else {
      result += ch;
      i++;
    }
  }
  return result;
}
const QUOTE_OPTIONS = [
  { value: "'", label: "Single quotes (')" },
  { value: '"', label: 'Double quotes (")' },
  { value: '`', label: 'Backticks (`)' }
];
export default function QuoteStyleConverter() {
  const [input, setInput] = useState(`const name = "world";\nconst greeting = 'Hello, ' + name + "!";`);
  const [targetQuote, setTargetQuote] = useState("'");
  const [copied, setCopied] = useState(false);
  const output = input ? convertQuotes(input, targetQuote) : '';
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
      <h1>Quote Style Converter</h1>
      <p className="tool-description">
        Convert string quotes in a code snippet to single, double, or backtick style, correctly
        handling quotes already inside strings. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Convert to:
          <select value={targetQuote} onChange={(e) => setTargetQuote(e.target.value)}>
            {QUOTE_OPTIONS.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="quote-input">Input</label>
          <textarea id="quote-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
        </div>
        <div className="tool-panel">
          <label htmlFor="quote-output">Output</label>
          <textarea id="quote-output" value={output} readOnly spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
