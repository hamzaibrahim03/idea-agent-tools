import { useMemo, useState } from 'react';
function buildOutline(topic, minutes) {
  const totalSeconds = Math.max(minutes, 0.5) * 60;
  const t = topic.trim() || '[your topic]';
  const hookSeconds = Math.round(Math.min(totalSeconds * 0.08, 15));
  const introSeconds = Math.round(totalSeconds * 0.1);
  const ctaSeconds = Math.round(totalSeconds * 0.08);
  const outroSeconds = Math.round(totalSeconds * 0.05);
  const mainSeconds = Math.max(totalSeconds - hookSeconds - introSeconds - ctaSeconds - outroSeconds, 0);
  const pointCount = mainSeconds > 240 ? 4 : mainSeconds > 90 ? 3 : 2;
  const perPointSeconds = Math.round(mainSeconds / pointCount);
  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };
  return {
    hook: { label: 'Hook', duration: fmt(hookSeconds), text: `Open with a bold statement or question about ${t} to stop the scroll.` },
    intro: { label: 'Intro', duration: fmt(introSeconds), text: `Briefly introduce yourself/channel and preview what viewers will get from this video on ${t}.` },
    points: Array.from({ length: pointCount }, (_, i) => ({
      label: `Main point ${i + 1}`,
      duration: fmt(perPointSeconds),
      text: `Cover key point ${i + 1} about ${t} with a concrete example or demonstration.`
    })),
    cta: { label: 'Call to action', duration: fmt(ctaSeconds), text: 'Ask viewers to like, comment, subscribe, or click the link in the description.' },
    outro: { label: 'Outro', duration: fmt(outroSeconds), text: 'Thank viewers and tease the next video or related content.' }
  };
}
export default function VideoScriptOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState(5);
  const outline = useMemo(() => buildOutline(topic, minutes), [topic, minutes]);
  const rows = [outline.hook, outline.intro, ...outline.points, outline.cta, outline.outro];
  return (
    <div className="tool-page">
      <h1>Video Script Outline Generator</h1>
      <p className="tool-description">
        Enter your video topic and target length to get a structured script outline - hook, intro,
        main points with estimated time allocation, call-to-action, and outro - based on standard
        video-pacing conventions. This is a structural template, not a written script. Runs entirely
        in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="video-topic">Video topic</label>
          <input
            id="video-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 5 tips for better sleep"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="video-minutes">Target length (minutes)</label>
          <input
            id="video-minutes"
            type="number"
            min={0.5}
            max={60}
            step={0.5}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </div>
      </div>
      <ul className="uuid-list">
        {rows.map((row, i) => (
          <li key={i} style={{ alignItems: 'flex-start' }}>
            <span>
              <strong>{row.label}</strong> ({row.duration}) - {row.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
