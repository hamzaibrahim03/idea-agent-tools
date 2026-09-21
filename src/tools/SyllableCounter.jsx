import { useMemo, useState } from 'react';
function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  const groups = clean.match(/[aeiouy]+/g) || [];
  let count = groups.length;
  if (clean.endsWith('e') && !clean.endsWith('le')) {
    count -= 1;
  } else if (clean.endsWith('le') && clean.length > 2 && !/[aeiouy]/.test(clean[clean.length - 3])) {
    count += 1;
  }
  if (clean.endsWith('ed') && groups.length > 1) {
    const beforeEd = clean.slice(0, -2);
    if (!/[td]$/.test(beforeEd)) count -= 1;
  }
  return Math.max(1, count);
}
function analyze(text) {
  const words = text.match(/[a-zA-Z']+/g) || [];
  const perWord = words.map((w) => ({ word: w, syllables: countSyllables(w) }));
  const total = perWord.reduce((sum, w) => sum + w.syllables, 0);
  return { perWord, total, wordCount: words.length };
}
export default function SyllableCounter() {
  const [input, setInput] = useState('');
  const { perWord, total, wordCount } = useMemo(() => analyze(input), [input]);
  return (
    <div className="tool-page">
      <h1>Syllable Counter</h1>
      <p className="tool-description">
        Estimate the syllable count for each word and the total, using a vowel-group heuristic with
        common English adjustments (like silent trailing "e"). This is a heuristic estimate, not a
        linguistically perfect count - handy for haiku and other syllable-counted poetry. Runs
        entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="syllable-input">Text</label>
        <textarea
          id="syllable-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here, e.g. an old silent pond"
        />
      </div>
      {wordCount > 0 && (
        <div className="timestamp-result">
          <span>
            <strong>Total syllables (estimated):</strong> {total}
          </span>
          <span>
            <strong>Words:</strong> {wordCount}
          </span>
        </div>
      )}
      {perWord.length > 0 && (
        <div className="tool-panel">
          <label>Per-word breakdown</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Syllables</th>
                </tr>
              </thead>
              <tbody>
                {perWord.map((w, i) => (
                  <tr key={`${w.word}-${i}`}>
                    <td>{w.word}</td>
                    <td>{w.syllables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
