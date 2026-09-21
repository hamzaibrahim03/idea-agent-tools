import { useMemo, useState } from 'react';
const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;
function buildSuggestions({ keyword, topic }) {
  const k = keyword.trim();
  const t = topic.trim();
  if (!k && !t) return { titles: [], descriptions: [] };
  const subject = t || k;
  const kw = k || t;
  const titles = [
    `${kw} - ${subject}`,
    `${subject} | Complete Guide to ${kw}`,
    `${kw}: Everything You Need to Know`,
    `Best ${kw} Tips for ${subject}`
  ].filter((s, i, arr) => arr.indexOf(s) === i);
  const descriptions = [
    `Learn about ${kw} and ${subject}. Explore practical tips, key details, and everything you need to get started today.`,
    `Discover ${subject} with our guide to ${kw} - clear explanations, practical advice, and answers to common questions.`,
    `Looking for ${kw}? This guide covers ${subject} in detail, with actionable tips you can use right away.`
  ];
  return { titles, descriptions };
}
export default function SeoTitleMetaGenerator() {
  const [keyword, setKeyword] = useState('');
  const [topic, setTopic] = useState('');
  const { titles, descriptions } = useMemo(() => buildSuggestions({ keyword, topic }), [keyword, topic]);
  return (
    <div className="tool-page">
      <h1>SEO Title &amp; Meta Description Generator</h1>
      <p className="tool-description">
        Enter a target keyword and page topic to get SEO-friendly title tag and meta description
        suggestions, with live character counts against the standard limits (titles ~50-60 characters,
        descriptions ~150-160 characters) and truncation warnings. These are template suggestions to
        edit and refine, not real search-ranking data. Runs entirely in your browser.
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
      {titles.length === 0 ? (
        <p className="tool-placeholder">Enter a keyword or topic to generate suggestions.</p>
      ) : (
        <>
          <div className="tool-panel">
            <label>Title tag suggestions</label>
            <ul className="uuid-list">
              {titles.map((title) => {
                const over = title.length > TITLE_LIMIT;
                return (
                  <li key={title} style={{ alignItems: 'flex-start' }}>
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
              {descriptions.map((desc) => {
                const over = desc.length > DESC_LIMIT;
                return (
                  <li key={desc} style={{ alignItems: 'flex-start' }}>
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
