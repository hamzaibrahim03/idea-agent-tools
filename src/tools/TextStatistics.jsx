import { useEffect, useState } from 'react';
export default function TextStatistics() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({ frequency: [], mostCommon: null, vowels: 0, consonants: 0, uniqueCount: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/text-statistics', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { input } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setStats(data);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [input]);
  const maxCount = stats.frequency[0]?.count || 1;
  return (
    <div className="tool-page">
      <h1>Text Statistics</h1>
      <p className="tool-description">
        Paste text to see a letter-frequency breakdown, the most common letter, the vowel/consonant
        ratio, and the count of unique letters used. Runs entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
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
