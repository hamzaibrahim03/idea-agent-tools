import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
const ROLES = ['Frontend Developer', 'Data Analyst', 'Product Manager', 'Backend Developer', 'UX Designer'];
export default function LearningRoadmapGenerator() {
  const [role, setRole] = useState('Frontend Developer');
  const ai = useAiGenerate('learning-roadmap', 'Learning Roadmap Generator');
  const roadmap = ai.result;
  async function handleGenerate() {
    await ai.generate({ role });
  }
  return (
    <div className="tool-page">
      <h1>Learning Roadmap Generator</h1>
      <p className="tool-description">
        Pick a target role and click "Generate with AI" for a genuinely AI-generated learning
        roadmap - ordered stages of topics to learn for that path, with estimated duration for
        each - free, no account needed (rate-limited to keep it free for everyone).
      </p>
      <div className="tool-controls">
        <label>
          Target role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleGenerate} disabled={ai.loading}>
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
      {roadmap && (
        <>
          <h2 style={{ fontSize: 18, margin: '16px 0 8px' }}>{roadmap.title}</h2>
          {(roadmap.stages || []).map((stage, i) => (
            <div key={i}>
              <h3 style={{ fontSize: 16, margin: '16px 0 8px' }}>
                {stage.stage} {stage.estimatedDuration ? `(${stage.estimatedDuration})` : ''}
              </h3>
              <ul className="uuid-list">
                {(stage.topics || []).map((topic, j) => (
                  <li key={j}>
                    <span>
                      {j + 1}. {topic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
