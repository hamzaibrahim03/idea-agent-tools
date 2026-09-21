import { useState } from 'react';
function buildOutline(topic, slideCount) {
  const t = topic.trim() || 'Your Topic';
  const outline = [];
  outline.push({ title: `${t}`, note: 'Title slide - presenter name, date, occasion' });
  outline.push({ title: 'Agenda', note: 'Overview of what this presentation will cover' });
  const contentSlideCount = Math.max(0, slideCount - 4);
  for (let i = 1; i <= contentSlideCount; i++) {
    outline.push({ title: `Key point ${i}`, note: `Placeholder prompt - supporting detail or data for key point ${i}` });
  }
  outline.push({ title: 'Summary', note: 'Recap the key points covered' });
  outline.push({ title: 'Conclusion', note: 'Call to action or closing thought' });
  outline.push({ title: 'Q&A', note: 'Open the floor for questions' });
  return outline;
}
export default function PresentationOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState('8');
  const slideCountNum = Math.max(4, Math.min(50, Math.floor(Number(slideCount) || 0)));
  const outline = buildOutline(topic, slideCountNum);
  return (
    <div className="tool-page">
      <h1>Presentation Outline Generator</h1>
      <p className="tool-description">
        Enter a topic and a number of slides to get a structured slide-by-slide outline template -
        title slide, agenda, content slides with placeholder prompts, conclusion, and Q&amp;A. This
        is a structural template to fill in yourself, not AI-generated slide content. Runs entirely
        in your browser.
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
      <ul className="uuid-list">
        {outline.map((slide, i) => (
          <li key={i} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
            <strong>
              Slide {i + 1}: {slide.title}
            </strong>
            <span style={{ opacity: 0.75, fontSize: 13 }}>{slide.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
