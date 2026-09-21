import { useMemo, useState } from 'react';
function toWords(topic) {
  return topic
    .trim()
    .split(/[\s\-_]+/)
    .filter(Boolean);
}
function toCamelCase(words) {
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}
function toPascalCase(words) {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}
const SUFFIXES = ['Tips', 'Life', 'Love', 'Daily', 'Community', 'Hacks', 'Goals'];
const PREFIXES = ['Best', 'Top', 'My', 'The'];
function generateHashtags(topic) {
  const words = toWords(topic);
  if (words.length === 0) return [];
  const base = toPascalCase(words);
  const camel = toCamelCase(words);
  const plain = words.join('').toLowerCase();
  const tags = new Set();
  tags.add(`#${plain}`);
  tags.add(`#${camel}`);
  SUFFIXES.forEach((s) => tags.add(`#${base}${s}`));
  PREFIXES.forEach((p) => tags.add(`#${p}${base}`));
  return Array.from(tags);
}
export default function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [copied, setCopied] = useState('');
  const hashtags = useMemo(() => generateHashtags(topic), [topic]);
  async function handleCopyOne(tag) {
    try {
      await navigator.clipboard.writeText(tag);
      setCopied(tag);
      setTimeout(() => setCopied(''), 1200);
    } catch {
    }
  }
  async function handleCopyAll() {
    if (hashtags.length === 0) return;
    try {
      await navigator.clipboard.writeText(hashtags.join(' '));
      setCopied('__all__');
      setTimeout(() => setCopied(''), 1200);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Hashtag Generator</h1>
      <p className="tool-description">
        Enter a topic or keyword to generate hashtag variations using simple string-pattern rules
        (camelCase combos, common prefixes and suffixes). This is pattern-based brainstorming, not
        real trending-hashtag or search-volume data. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="hashtag-topic">Topic / keyword</label>
        <input
          id="hashtag-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. morning routine"
        />
      </div>
      <div className="tool-controls">
        <button onClick={handleCopyAll} disabled={hashtags.length === 0}>
          {copied === '__all__' ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      {hashtags.length > 0 ? (
        <ul className="uuid-list">
          {hashtags.map((tag) => (
            <li key={tag}>
              <code>{tag}</code>
              <button className="uuid-copy-btn" onClick={() => handleCopyOne(tag)}>
                {copied === tag ? 'Copied!' : 'Copy'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tool-placeholder">Enter a topic to generate hashtag variations.</p>
      )}
    </div>
  );
}
