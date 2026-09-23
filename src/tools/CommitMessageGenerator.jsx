import { useState } from 'react';
const TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
function buildCommitMessage({ type, scope, description, body, breaking, breakingDescription }) {
  if (!description.trim()) return '';
  const scopePart = scope.trim() ? `(${scope.trim()})` : '';
  const bangPart = breaking ? '!' : '';
  const header = `${type}${scopePart}${bangPart}: ${description.trim()}`;
  const parts = [header];
  if (body.trim()) parts.push(body.trim());
  if (breaking) {
    parts.push(`BREAKING CHANGE: ${breakingDescription.trim() || description.trim()}`);
  }
  return parts.join('\n\n');
}
export default function CommitMessageGenerator() {
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [breaking, setBreaking] = useState(false);
  const [breakingDescription, setBreakingDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const message = buildCommitMessage({ type, scope, description, body, breaking, breakingDescription });
  async function handleCopy() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Commit Message Generator</h1>
      <p className="tool-description">
        Fill in a type, optional scope, and description to assemble a properly formatted{' '}
        <a href="https://www.conventionalcommits.org/" target="_blank" rel="noreferrer">Conventional Commits</a>{' '}
        message, with optional body and breaking-change footer. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!message}>
          {copied ? 'Copied!' : 'Copy message'}
        </button>
      </div>
      <div className="tool-grid">
        <div>
          <div className="tool-panel">
            <label htmlFor="commit-type">Type</label>
            <select id="commit-type" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="tool-panel">
            <label htmlFor="commit-scope">Scope (optional)</label>
            <input
              id="commit-scope"
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. api, auth, ui"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor="commit-description">Description</label>
            <input
              id="commit-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="short summary in the imperative mood"
            />
          </div>
        </div>
        <div>
          <div className="tool-panel">
            <label htmlFor="commit-body">Body (optional)</label>
            <textarea
              id="commit-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Additional context or motivation for the change"
              style={{ minHeight: 100 }}
            />
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} />
            Breaking change
          </label>
          {breaking && (
            <div className="tool-panel" style={{ marginTop: 10 }}>
              <label htmlFor="commit-breaking">Breaking change description</label>
              <input
                id="commit-breaking"
                type="text"
                value={breakingDescription}
                onChange={(e) => setBreakingDescription(e.target.value)}
                placeholder="What breaks and how to migrate"
              />
            </div>
          )}
        </div>
      </div>
      <div className="tool-panel">
        <label htmlFor="commit-output">Generated commit message</label>
        <textarea
          id="commit-output"
          value={message}
          readOnly
          spellCheck={false}
          placeholder="Fill in a description to generate the commit message"
          style={{ minHeight: 140 }}
        />
      </div>
    </div>
  );
}
