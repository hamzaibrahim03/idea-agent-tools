import { useMemo, useState } from 'react';
function countWords(text) {
  const matches = text.toLowerCase().match(/[a-z0-9']+/g) || [];
  const counts = new Map();
  for (const word of matches) {
    const clean = word.replace(/^'+|'+$/g, '');
    if (!clean) continue;
    counts.set(clean, (counts.get(clean) || 0) + 1);
  }
  const frequency = [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  return { frequency, totalWords: matches.length, uniqueCount: counts.size };
}
export default function WordFrequencyCounter() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => countWords(input), [input]);
  const maxCount = stats.frequency[0]?.count || 1;
  return (
    <div className="tool-page">
      <h1>Word Frequency Counter</h1>
      <p className="tool-description">
        Paste text to see how often each distinct word appears, sorted from most to least
        frequent. Matching is case-insensitive and ignores surrounding punctuation. Runs entirely
        in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="wf-input">Text</label>
        <textarea
          id="wf-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here"
          style={{ minHeight: 200 }}
        />
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Total words:</strong> {stats.totalWords}
        </span>
        <span>
          <strong>Unique words:</strong> {stats.uniqueCount}
        </span>
      </div>
      {stats.frequency.length > 0 && (
        <div className="tool-panel">
          <label>Word frequency</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Count</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {stats.frequency.map(({ word, count }) => (
                  <tr key={word}>
                    <td><code>{word}</code></td>
                    <td>{count}</td>
                    <td>
                      <div
                        style={{
                          height: 8,
                          borderRadius: 4,
                          background: 'var(--accent-bg)',
                          width: `${Math.max(4, Math.round((count / maxCount) * 100))}%`
                        }}
                      />
                    </td>
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
