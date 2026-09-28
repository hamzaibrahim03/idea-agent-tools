import { useMemo, useRef, useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { readFileAsText, loadTextFromUrl } from '../lib/loadInput.js';
const EMOJI_MAP = {
  'ice cream': '🍦',
  'thank you': '🙏',
  'good morning': '🌅',
  'good night': '🌙',
  happy: '😊',
  sad: '😢',
  love: '❤️',
  fire: '🔥',
  cool: '😎',
  laugh: '😂',
  laughing: '😂',
  cry: '😭',
  crying: '😭',
  angry: '😠',
  tired: '😴',
  sleep: '😴',
  party: '🎉',
  celebrate: '🎉',
  music: '🎵',
  star: '⭐',
  sun: '☀️',
  rain: '🌧️',
  snow: '❄️',
  coffee: '☕',
  pizza: '🍕',
  burger: '🍔',
  beer: '🍺',
  cake: '🎂',
  dog: '🐶',
  cat: '🐱',
  money: '💰',
  rich: '🤑',
  idea: '💡',
  smart: '🧠',
  strong: '💪',
  run: '🏃',
  walk: '🚶',
  car: '🚗',
  plane: '✈️',
  home: '🏠',
  work: '💼',
  time: '⏰',
  book: '📚',
  phone: '📱',
  computer: '💻',
  game: '🎮',
  win: '🏆',
  lose: '😞',
  yes: '✅',
  no: '❌',
  ok: '👍',
  wow: '😮',
  hot: '🥵',
  cold: '🥶',
  hungry: '🍽️',
  thirsty: '🥤',
  sick: '🤒',
  scared: '😱',
  funny: '😆',
  bored: '😑',
  excited: '🤩',
  confused: '😕',
  peace: '✌️',
  world: '🌍',
  heart: '❤️',
  friend: '🤝'
};
const SORTED_KEYS = Object.keys(EMOJI_MAP).sort((a, b) => b.length - a.length);
const PATTERN = new RegExp(
  '\\b(' + SORTED_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b',
  'gi'
);
function translate(text) {
  if (!text) return { output: '', matchCount: 0 };
  let matchCount = 0;
  const output = text.replace(PATTERN, (match) => {
    matchCount++;
    const emoji = EMOJI_MAP[match.toLowerCase()];
    return `${match} ${emoji}`;
  });
  return { output, matchCount };
}
export default function TextEmojiTranslator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const fileInputRef = useRef(null);
  const { output, matchCount } = useMemo(() => translate(input), [input]);
  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, 'emoji-translated.txt', 'text/plain');
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
      <h1>Text Emoji Translator</h1>
      <p className="tool-description">
        Type text and common words get a matching emoji added after them (e.g. "happy" -&gt; "happy
        😊", "love" -&gt; "love ❤️"). Uses a curated lookup table of everyday words and phrases - fun,
        not exhaustive. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy output'}
        </button>
        <button onClick={handleDownload} disabled={!output}>
          Download
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
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="emoji-input">Text</label>
          <textarea
            id="emoji-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I am so happy, this is fire!"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="emoji-output">With emoji</label>
          <textarea id="emoji-output" value={output} readOnly />
        </div>
      </div>
      {input && (
        <div className="timestamp-result">
          <span>
            <strong>Words matched:</strong> {matchCount}
          </span>
        </div>
      )}
    </div>
  );
}
