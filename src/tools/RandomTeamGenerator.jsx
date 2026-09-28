import { useState, useRef } from 'react';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function makeTeams(names, teamCount) {
  const shuffled = shuffle(names);
  const teams = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((name, i) => {
    teams[i % teamCount].push(name);
  });
  return teams;
}
export default function RandomTeamGenerator() {
  const [input, setInput] = useState('Alex\nJordan\nTaylor\nMorgan\nCasey\nRiley\nJamie\nDrew');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const names = input
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean);
  const count = Math.min(Math.max(Number(teamCount) || 1, 1), Math.max(names.length, 1));
  function handleGenerate() {
    if (names.length === 0) return;
    setTeams(makeTeams(names, count));
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
  function handleUploadClick() {
    fileInputRef.current?.click();
  }
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setInput(await readFileAsText(file));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    }
  }
  async function handleLoadFromUrl() {
    const url = window.prompt('Enter a URL to load text from:');
    if (!url) return;
    try {
      setInput(await loadTextFromUrl(url));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
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
        <button onClick={handleGenerate} disabled={names.length === 0}>
          Generate teams
        </button>
        <button onClick={handleCopy} disabled={teams.length === 0}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
        <button type="button" onClick={handleUploadClick}>
          Upload file
        </button>
        <button type="button" onClick={handleLoadFromUrl}>
          Load from URL
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,text/*"
          style={{ display: 'none' }}
        />
      </div>
      {loadError && (
        <div className="tool-error">
          <strong>Load error:</strong> {loadError}
        </div>
      )}
      {names.length === 0 && <div className="tool-error">Add at least one name above.</div>}
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
