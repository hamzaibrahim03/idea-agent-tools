import { useMemo, useState } from 'react';
function countStats(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(?:\s|$)/g) || []).length || 1 : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingMinutes = words ? Math.max(1, Math.round(words / 200)) : 0;
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
}
export default function WordCounter() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => countStats(input), [input]);
  return (
    <div className="tool-page">
      <h1>Word Counter</h1>
      <p className="tool-description">
        Count words, characters, sentences, and paragraphs as you type, plus an estimated reading
        time. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="wc-input">Text</label>
        <textarea
          id="wc-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here"
          style={{ minHeight: 260 }}
        />
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Words:</strong> {stats.words}
        </span>
        <span>
          <strong>Characters:</strong> {stats.characters} ({stats.charactersNoSpaces} without spaces)
        </span>
        <span>
          <strong>Sentences:</strong> {stats.sentences}
        </span>
        <span>
          <strong>Paragraphs:</strong> {stats.paragraphs}
        </span>
        <span>
          <strong>Estimated reading time:</strong> {stats.readingMinutes} min
        </span>
      </div>
    </div>
  );
}
