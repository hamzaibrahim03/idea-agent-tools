import { useMemo, useState } from 'react';
const CONVENTIONS = {
  single: { label: 'Single-spaced (~500 words/page)', wordsPerPage: 500 },
  double: { label: 'Double-spaced (~250 words/page)', wordsPerPage: 250 },
  custom: { label: 'Custom', wordsPerPage: null }
};
export default function WordCountByPage() {
  const [input, setInput] = useState('');
  const [convention, setConvention] = useState('double');
  const [customWpp, setCustomWpp] = useState(300);
  const wordCount = useMemo(() => {
    const trimmed = input.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [input]);
  const wordsPerPage = convention === 'custom' ? Math.max(1, parseInt(customWpp, 10) || 1) : CONVENTIONS[convention].wordsPerPage;
  const estimatedPages = wordCount > 0 ? wordCount / wordsPerPage : 0;
  return (
    <div className="tool-page">
      <h1>Document Word Count &amp; Page Estimator</h1>
      <p className="tool-description">
        Paste document text to estimate the number of printed pages, using standard words-per-page
        conventions for single- or double-spaced documents (or your own custom words-per-page
        figure). Useful for planning document length. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Convention:
          <select value={convention} onChange={(e) => setConvention(e.target.value)}>
            {Object.entries(CONVENTIONS).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </label>
        {convention === 'custom' && (
          <label>
            Words per page:
            <input type="number" min="1" value={customWpp} onChange={(e) => setCustomWpp(e.target.value)} style={{ width: '80px' }} />
          </label>
        )}
      </div>
      <div className="tool-panel">
        <label htmlFor="wcp-input">Text</label>
        <textarea id="wcp-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste or type your document text here" style={{ minHeight: 260 }} />
      </div>
      <div className="timestamp-result">
        <span><strong>Word count:</strong> {wordCount}</span>
        <span><strong>Words per page (used):</strong> {wordsPerPage}</span>
        <span><strong>Estimated pages:</strong> {estimatedPages.toFixed(1)} (~{Math.max(1, Math.ceil(estimatedPages))} printed page{Math.ceil(estimatedPages) === 1 ? '' : 's'})</span>
        <span style={{ opacity: 0.6 }}>
          This is an estimate based on standard word-per-page conventions, not an exact page count -
          actual pagination depends on font, margins, and formatting in your document editor.
        </span>
      </div>
    </div>
  );
}
