import { useEffect, useState } from 'react';
let nextId = 1;
function makeId() {
  return nextId++;
}
function makeBlock(userAgent = '*') {
  return {
    id: makeId(),
    userAgent,
    rules: [{ id: makeId(), type: 'Disallow', path: '' }],
  };
}
export default function RobotsTxtGenerator() {
  const [blocks, setBlocks] = useState(() => [makeBlock()]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  function addBlock() {
    setBlocks((bs) => [...bs, makeBlock()]);
  }
  function removeBlock(id) {
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  }
  function updateUserAgent(id, value) {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, userAgent: value } : b)));
  }
  function addRule(blockId) {
    setBlocks((bs) =>
      bs.map((b) =>
        b.id === blockId ? { ...b, rules: [...b.rules, { id: makeId(), type: 'Disallow', path: '' }] } : b
      )
    );
  }
  function removeRule(blockId, ruleId) {
    setBlocks((bs) =>
      bs.map((b) => (b.id === blockId ? { ...b, rules: b.rules.filter((r) => r.id !== ruleId) } : b))
    );
  }
  function updateRule(blockId, ruleId, key, value) {
    setBlocks((bs) =>
      bs.map((b) =>
        b.id === blockId
          ? { ...b, rules: b.rules.map((r) => (r.id === ruleId ? { ...r, [key]: value } : r)) }
          : b
      )
    );
  }
  function applyPreset(type) {
    if (type === 'allow-all') {
      setBlocks([{ id: makeId(), userAgent: '*', rules: [{ id: makeId(), type: 'Allow', path: '/' }] }]);
    } else if (type === 'disallow-all') {
      setBlocks([{ id: makeId(), userAgent: '*', rules: [{ id: makeId(), type: 'Disallow', path: '/' }] }]);
    }
    setSitemapUrl('');
  }
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/robots-txt-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { blocks, sitemapUrl } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setOutput(data.output);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [blocks, sitemapUrl]);
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
      <h1>Robots.txt Generator</h1>
      <p className="tool-description">
        Build a robots.txt file from one or more User-agent rule blocks, plus an optional sitemap
        line. Runs entirely in your browser - copy the result into a file named robots.txt at your
        site's root.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <button onClick={() => applyPreset('allow-all')}>Preset: Allow all</button>
        <button onClick={() => applyPreset('disallow-all')}>Preset: Disallow all</button>
        <button onClick={addBlock}>Add rule block</button>
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy robots.txt'}
        </button>
      </div>
      {blocks.map((block) => (
        <div className="tool-panel" key={block.id}>
          <label htmlFor={`ua-${block.id}`}>User-agent</label>
          <input
            id={`ua-${block.id}`}
            type="text"
            value={block.userAgent}
            onChange={(e) => updateUserAgent(block.id, e.target.value)}
            placeholder="*"
          />
          {block.rules.map((rule) => (
            <div className="tool-controls" key={rule.id} style={{ marginBottom: 0 }}>
              <select
                value={rule.type}
                onChange={(e) => updateRule(block.id, rule.id, 'type', e.target.value)}
              >
                <option value="Allow">Allow</option>
                <option value="Disallow">Disallow</option>
              </select>
              <input
                type="text"
                value={rule.path}
                onChange={(e) => updateRule(block.id, rule.id, 'path', e.target.value)}
                placeholder="/path"
                style={{ flex: 1, minWidth: '120px' }}
              />
              <button onClick={() => removeRule(block.id, rule.id)} disabled={block.rules.length <= 1}>
                Remove
              </button>
            </div>
          ))}
          <div className="tool-controls" style={{ marginBottom: 0, marginTop: '4px' }}>
            <button onClick={() => addRule(block.id)}>Add path</button>
            <button onClick={() => removeBlock(block.id)} disabled={blocks.length <= 1}>
              Remove block
            </button>
          </div>
        </div>
      ))}
      <div className="tool-panel">
        <label htmlFor="sitemap-url">Sitemap URL (optional)</label>
        <input
          id="sitemap-url"
          type="text"
          value={sitemapUrl}
          onChange={(e) => setSitemapUrl(e.target.value)}
          placeholder="https://example.com/sitemap.xml"
        />
      </div>
      <div className="tool-panel">
        <label htmlFor="robots-output">Generated robots.txt</label>
        <textarea id="robots-output" value={output} readOnly spellCheck={false} />
      </div>
    </div>
  );
}
