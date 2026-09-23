import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;
export default function SeoTitleMetaGenerator() {
  const [keyword, setKeyword] = useState('');
  const [topic, setTopic] = useState('');
  const ai = useAiGenerate('seo-title-meta-description', 'SEO Title & Meta Description Generator');
  const titles = ai.result?.titles || [];
  const descriptions = ai.result?.metaDescriptions || [];
  async function handleGenerate() {
    await ai.generate({ keyword, topic });
  }
  return (
    <div className="tool-page">
      <h1>SEO Title &amp; Meta Description Generator</h1>
      <p className="tool-description">
        Enter a target keyword and page topic, then click "Generate with AI" for genuinely
        AI-generated SEO title tag and meta description suggestions, with live character counts
        against the standard limits (titles ~50-60 characters, descriptions ~150-160 characters) and
        truncation warnings - free, no account needed (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="seo-keyword">Target keyword</label>
          <input
            id="seo-keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. home espresso machine"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="seo-topic">Page topic</label>
          <input
            id="seo-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. buying guide for beginners"
          />
        </div>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || (!keyword.trim() && !topic.trim())}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
          {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {ai.showApiSetup && (
        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
      )}
      {ai.error && <div className="agent-error">{ai.error}</div>}
      {titles.length === 0 ? (
        <p className="tool-placeholder">Enter a keyword or topic and click Generate with AI.</p>
      ) : (
        <>
          <div className="tool-panel">
            <label>Title tag suggestions</label>
            <ul className="uuid-list">
              {titles.map((title, i) => {
                const over = title.length > TITLE_LIMIT;
                return (
                  <li key={i} style={{ alignItems: 'flex-start' }}>
                    <span>{title}</span>
                    <span className={over ? 'tool-error-inline' : ''}>
                      {title.length}/{TITLE_LIMIT}
                      {over ? ' - will likely be truncated' : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="tool-panel">
            <label>Meta description suggestions</label>
            <ul className="uuid-list">
              {descriptions.map((desc, i) => {
                const over = desc.length > DESC_LIMIT;
                return (
                  <li key={i} style={{ alignItems: 'flex-start' }}>
                    <span>{desc}</span>
                    <span className={over ? 'tool-error-inline' : ''}>
                      {desc.length}/{DESC_LIMIT}
                      {over ? ' - will likely be truncated' : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
