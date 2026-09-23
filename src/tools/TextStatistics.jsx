import { useMemo, useState } from 'react';
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
function analyzeLetters(text) {
  const counts = new Map();
  let vowels = 0;
  let consonants = 0;
  for (const ch of text.toLowerCase()) {
    if (!/[a-z]/.test(ch)) continue;
    counts.set(ch, (counts.get(ch) || 0) + 1);
    if (VOWELS.has(ch)) vowels++;
    else consonants++;
  }
  const frequency = [...counts.entries()]
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
  return {
    frequency,
    mostCommon: frequency[0] || null,
    vowels,
    consonants,
    uniqueCount: counts.size
  };
}
export default function TextStatistics() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => analyzeLetters(input), [input]);
  const maxCount = stats.frequency[0]?.count || 1;
  return (
    <div className="tool-page">
      <h1>Text Statistics</h1>
      <p className="tool-description">
        Paste text to see a letter-frequency breakdown, the most common letter, the vowel/consonant
        ratio, and the count of unique letters used. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="stats-input">Text</label>
        <textarea
          id="stats-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here"
          style={{ minHeight: 200 }}
        />
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Most common letter:</strong>{' '}
          {stats.mostCommon ? `${stats.mostCommon.letter} (${stats.mostCommon.count})` : '—'}
        </span>
        <span>
          <strong>Vowels:</strong> {stats.vowels} &nbsp; <strong>Consonants:</strong> {stats.consonants}
          {stats.consonants > 0 && ` (ratio ${(stats.vowels / stats.consonants).toFixed(2)})`}
        </span>
        <span>
          <strong>Unique letters:</strong> {stats.uniqueCount}
        </span>
      </div>
      {stats.frequency.length > 0 && (
        <div className="tool-panel">
          <label>Letter frequency</label>
          <div className="regex-groups-wrap">
            <table className="regex-groups-table">
              <thead>
                <tr>
                  <th>Letter</th>
                  <th>Count</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {stats.frequency.map(({ letter, count }) => (
                  <tr key={letter}>
                    <td><code>{letter}</code></td>
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
