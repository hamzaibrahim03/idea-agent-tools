import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function VideoScriptOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState(5);
  const ai = useAiGenerate('video-script-outline', 'Video Script Outline Generator');
  const outline = ai.result;
  async function handleGenerate() {
    await ai.generate({ topic, minutes });
  }
  return (
    <div className="tool-page">
      <h1>Video Script Outline Generator</h1>
      <p className="tool-description">
        Enter your video topic and target length and click "Generate with AI" for a genuinely
        AI-generated script outline - scenes with time allocation, visual notes, and script text -
        free, no account needed (rate-limited to keep it free for everyone).
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
            {(outline.scenes || []).map((scene, i) => (
              <li key={i} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                <strong>
                  Scene {scene.sceneNumber ?? i + 1} {scene.timeAllocation ? `(${scene.timeAllocation})` : ''}
                </strong>
                {scene.visualNotes && (
                  <span style={{ fontSize: 13, opacity: 0.75, fontStyle: 'italic' }}>Visuals: {scene.visualNotes}</span>
                )}
                {scene.script && <span style={{ fontSize: 13, opacity: 0.9 }}>{scene.script}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
