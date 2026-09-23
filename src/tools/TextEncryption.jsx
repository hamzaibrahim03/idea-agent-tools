import { useState } from 'react';
export default function TextEncryption() {
  const [mode, setMode] = useState('encrypt');
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  async function handleRun() {
    setError('');
    setOutput('');
    if (!input.trim() || !password) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tools/text-encryption', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { mode, input, password } })
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setOutput(data.output);
    } catch (e) {
      setError(e.message || 'Failed to compute');
    } finally {
      setLoading(false);
    }
  }
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
      <h1>Text Encryption (AES-256)</h1>
      <p className="tool-description">
        Encrypt or decrypt text with a password, using AES-256-GCM. You'll need the same
        password to decrypt later; there's no way to recover the text without it.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => { setMode(e.target.value); setOutput(''); setError(''); }}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '160px' }} />
        </label>
        <button onClick={handleRun} disabled={!input.trim() || !password || loading}>
          {loading ? 'Working...' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="encrypt-input">{mode === 'encrypt' ? 'Text to encrypt' : 'Encrypted text (base64)'}</label>
        <textarea id="encrypt-input" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </div>
      {error && (
        <div className="tool-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {output && (
        <div className="tool-panel">
          <label htmlFor="encrypt-output">
            {mode === 'encrypt' ? 'Encrypted (base64)' : 'Decrypted text'}
          </label>
          <div className="tool-controls">
            <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <textarea id="encrypt-output" value={output} readOnly spellCheck={false} />
        </div>
      )}
    </div>
  );
}
