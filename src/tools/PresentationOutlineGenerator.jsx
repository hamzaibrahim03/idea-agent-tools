import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function PresentationOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState('8');
  const ai = useAiGenerate('presentation-outline', 'Presentation Outline Generator');
  const outline = ai.result;
  const slideCountNum = Math.max(4, Math.min(50, Math.floor(Number(slideCount) || 0)));
  async function handleGenerate() {
    await ai.generate({ topic, slideCount: slideCountNum });
  }
  return (
    <div className="tool-page">
      <h1>Presentation Outline Generator</h1>
      <p className="tool-description">
        Enter a topic and a number of slides and click "Generate with AI" for a genuinely
        AI-generated slide-by-slide outline - title slide, agenda, content slides, conclusion,
        and Q&amp;A - free, no account needed (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-controls">
        <label>
          Topic:
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Quarterly Sales Review" style={{ width: '220px' }} />
        </label>
        <label>
          Number of slides:
          <input type="number" min={4} max={50} value={slideCount} onChange={(e) => setSlideCount(e.target.value)} style={{ width: '70px' }} />
        </label>
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handleGenerate} disabled={ai.loading || !topic.trim()}>
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
      {outline && (
        <>
          <h2 style={{ fontSize: 18, margin: '16px 0 8px' }}>{outline.title}</h2>
          <ul className="uuid-list">
            {(outline.slides || []).map((slide, i) => (
              <li key={i} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                <strong>
                  Slide {slide.slideNumber ?? i + 1}: {slide.heading}
                </strong>
                {Array.isArray(slide.content) && slide.content.length > 0 && (
                  <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                    {slide.content.map((c, j) => (
                      <li key={j} style={{ fontSize: 13, opacity: 0.85 }}>{c}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
