import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function NewsletterTemplateGenerator() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [cta, setCta] = useState('');
  const [sections, setSections] = useState([
    { headline: '', summary: '' },
    { headline: '', summary: '' }
  ]);
  const [copied, setCopied] = useState(false);
  const ai = useAiGenerate('newsletter-template', 'Newsletter Template Generator');
  const result = ai.result;
  function updateSection(index, field, value) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }
  function addSection() {
    if (sections.length >= 3) return;
    setSections((prev) => [...prev, { headline: '', summary: '' }]);
  }
  const sectionNotes = sections
    .filter((s) => s.headline.trim() || s.summary.trim())
    .map((s) => `${s.headline.trim()}: ${s.summary.trim()}`)
    .join('; ');
  async function handleGenerate() {
    await ai.generate({ name, topic, sections: sectionNotes, cta });
  }
  const output = result
    ? [
        result.subject && `Subject: ${result.subject}`,
        result.headline,
        '',
        ...(result.sections || []).map((s) => `${s.heading}\n${s.content}`),
        '',
        result.callToAction
      ]
        .filter((line, i, arr) => line !== undefined && !(line === '' && arr[i - 1] === ''))
        .join('\n\n')
    : '';
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  function handleDownload() {
    downloadFile(output, 'newsletter.txt', 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Newsletter Template Generator</h1>
      <p className="tool-description">
        Fill in your newsletter name, main topic, 2-3 content sections, and a call-to-action, then
        click "Generate with AI" for genuinely AI-written newsletter copy - free, no account needed
        (rate-limited to keep it free for everyone). Edit the result to fit your voice before sending.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="news-name">Newsletter name</label>
          <input id="news-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Weekly Brief" />
        </div>
        <div className="tool-panel">
          <label htmlFor="news-topic">Main topic for this issue</label>
          <input id="news-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. product updates and industry news" />
        </div>
      </div>
      {sections.map((s, i) => (
        <div className="tool-grid" key={i}>
          <div className="tool-panel">
            <label htmlFor={`news-headline-${i}`}>Section {i + 1} headline</label>
            <input
              id={`news-headline-${i}`}
              type="text"
              value={s.headline}
              onChange={(e) => updateSection(i, 'headline', e.target.value)}
              placeholder="e.g. New feature: dark mode"
            />
          </div>
          <div className="tool-panel">
            <label htmlFor={`news-summary-${i}`}>Section {i + 1} summary</label>
            <input
              id={`news-summary-${i}`}
              type="text"
              value={s.summary}
              onChange={(e) => updateSection(i, 'summary', e.target.value)}
              placeholder="e.g. A quick note on what shipped and why"
            />
          </div>
        </div>
      ))}
      <div className="tool-controls">
        <button onClick={addSection} disabled={sections.length >= 3}>
          Add section ({sections.length}/3)
        </button>
      </div>
      <div className="tool-panel">
        <label htmlFor="news-cta">Call to action</label>
        <input id="news-cta" type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Reply and let us know what you think" />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !topic.trim()}>
          {ai.loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
        <button type="button" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy newsletter'}
        </button>
        <button type="button" onClick={handleDownload} disabled={!output}>
          Download
        </button>
        <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
          {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
        </button>
      </div>
      {ai.showApiSetup && (
        <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
      )}
      {ai.error && <div className="agent-error">{ai.error}</div>}
      <div className="tool-panel">
        <label htmlFor="news-output">Generated newsletter</label>
        <textarea id="news-output" value={output} readOnly placeholder="Fill in the fields above and click Generate with AI" style={{ minHeight: 260 }} />
      </div>
    </div>
  );
}
