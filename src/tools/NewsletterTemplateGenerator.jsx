import { useMemo, useState } from 'react';
function buildNewsletter({ name, topic, sections, cta }) {
  const n = name.trim() || '[Newsletter Name]';
  const t = topic.trim() || '[main topic]';
  const c = cta.trim() || '[call-to-action]';
  const sectionText = sections
    .filter((s) => s.headline.trim() || s.summary.trim())
    .map((s, i) => `${i + 1}. ${s.headline.trim() || `[Section ${i + 1} headline]`}\n   ${s.summary.trim() || '[Short summary]'}`)
    .join('\n\n');
  return `${n}\n\nThis issue: ${t}\n\n${sectionText || '[Add content sections below]'}\n\n---\n${c}`;
}
export default function NewsletterTemplateGenerator() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [cta, setCta] = useState('');
  const [sections, setSections] = useState([
    { headline: '', summary: '' },
    { headline: '', summary: '' }
  ]);
  const [copied, setCopied] = useState(false);
  function updateSection(index, field, value) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }
  function addSection() {
    if (sections.length >= 3) return;
    setSections((prev) => [...prev, { headline: '', summary: '' }]);
  }
  const output = useMemo(() => buildNewsletter({ name, topic, sections, cta }), [name, topic, sections, cta]);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Newsletter Template Generator</h1>
      <p className="tool-description">
        Fill in your newsletter name, main topic, 2-3 content sections, and a call-to-action to
        assemble a structured newsletter layout. This is a template generator, not AI-written
        content - edit the result to fit your voice. Runs entirely in your browser.
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
        <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy newsletter'}</button>
      </div>
      <div className="tool-panel">
        <label htmlFor="news-output">Generated newsletter</label>
        <textarea id="news-output" value={output} readOnly style={{ minHeight: 260 }} />
      </div>
    </div>
  );
}
