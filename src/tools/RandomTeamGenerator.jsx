import { useState } from 'react';
export default function RandomTeamGenerator() {
  const [input, setInput] = useState('Alex\nJordan\nTaylor\nMorgan\nCasey\nRiley\nJamie\nDrew');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const names = input
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean);
  const count = Math.min(Math.max(Number(teamCount) || 1, 1), Math.max(names.length, 1));
  function handleGenerate() {
    if (names.length === 0) return;
    setLoading(true);
    setError('');
    fetch('/api/tools/random-team-generator', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { names, teamCount: count } })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTeams(data.teams);
      })
      .catch((e) => setError(e.message || 'Failed to compute'))
      .finally(() => setLoading(false));
    setCopied(false);
  }
  async function handleCopy() {
    if (teams.length === 0) return;
    const text = teams.map((team, i) => `Team ${i + 1}:\n${team.join('\n')}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Team Generator</h1>
      <p className="tool-description">
        Paste a list of names (one per line) and split them into randomly, fairly balanced teams
        using your browser's cryptographically-random source. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="team-names-input">Names (one per line)</label>
        <textarea id="team-names-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </div>
      <div className="tool-controls">
        <label>
          Number of teams:
          <input
            type="number"
            min={1}
            max={Math.max(names.length, 1)}
            value={teamCount}
            onChange={(e) => setTeamCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <button onClick={handleGenerate} disabled={names.length === 0 || loading}>
          Generate teams
        </button>
        <button onClick={handleCopy} disabled={teams.length === 0}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
      </div>
      {names.length === 0 && <div className="tool-error">Add at least one name above.</div>}
      {error && <div className="agent-error">{error}</div>}
      {teams.length > 0 && (
        <div className="tool-grid">
          {teams.map((team, i) => (
            <div key={i} className="tool-panel" style={{ marginBottom: 0 }}>
              <label>
                Team {i + 1} ({team.length})
              </label>
              <ul className="uuid-list">
                {team.map((name, j) => (
                  <li key={j}>
                    <code>{name}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
