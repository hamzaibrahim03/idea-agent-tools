import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
export default function BlogPostOutlineGenerator() {
    const [topic, setTopic] = useState('');
    const [wordCount, setWordCount] = useState(1200);
    const [copied, setCopied] = useState(false);
    const ai = useAiGenerate('blog-post-outline', 'Blog Post Outline Generator');
    const outline = ai.result;
    async function handleGenerate() {
        await ai.generate({ topic, wordCount });
    }
    function buildText() {
        if (!outline) return '';
        const lines = [outline.title || topic, ''];
        (outline.sections || []).forEach((s, i) => {
            lines.push(`${i + 1}. ${s.heading}${s.wordCountAllocation ? ` (~${s.wordCountAllocation})` : ''}`);
            (s.keyPoints || []).forEach((p) => lines.push(`   - ${p}`));
            lines.push('');
        });
        return lines.join('\n');
    }
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(buildText());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
        }
    }
    return (
        <div className="tool-page">
            <h1>Blog Post Outline Generator</h1>
            <p className="tool-description">
                Enter a blog topic and target word count and click "Generate with AI" for a genuinely
                AI-generated outline - a title, H2 sections with word count allocation, and key points
                for each section - free, no account needed (rate-limited to keep it free for everyone).
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="blog-topic">Blog topic</label>
                    <input id="blog-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. how to start composting at home" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="blog-words">Target word count</label>
                    <input id="blog-words" type="number" min={100} max={10000} step={100} value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerate} disabled={ai.loading || !topic.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
                <button type="button" onClick={handleCopy} disabled={!outline}>
                    {copied ? 'Copied!' : 'Copy outline'}
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
                        {(outline.sections || []).map((s, i) => (
                            <li key={i} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                <strong>
                                    {i + 1}. {s.heading} {s.wordCountAllocation ? `(~${s.wordCountAllocation})` : ''}
                                </strong>
                                {(s.keyPoints || []).length > 0 && (
                                    <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                                        {s.keyPoints.map((p, j) => (
                                            <li key={j} style={{ fontSize: 13, opacity: 0.85 }}>{p}</li>
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
