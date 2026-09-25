import { useState } from 'react';
import { downloadFile } from '../lib/downloadFile.js';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
const POST_TYPES = {
  announcement: 'announcement',
  question: 'question',
  tip: 'tip',
  promotion: 'promotion'
};
export default function SocialMediaPostTemplateGenerator() {
  const [platforms, setPlatforms] = useState('Twitter / X, Instagram, LinkedIn');
  const [postType, setPostType] = useState(POST_TYPES.announcement);
  const [topic, setTopic] = useState('');
  const [cta, setCta] = useState('');
  const [copied, setCopied] = useState('');
  const ai = useAiGenerate('social-media-post-template', 'Social Media Post Generator');
  const posts = ai.result?.posts || [];
  async function handleGenerate() {
    await ai.generate({ platforms, postType, topic, cta });
  }
  async function handleCopy(post, key) {
    const text = post.hashtags?.length ? `${post.text}\n\n${post.hashtags.join(' ')}` : post.text;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch {
    }
  }
  function handleDownload(post, key) {
    const text = post.hashtags?.length ? `${post.text}\n\n${post.hashtags.join(' ')}` : post.text;
    const platformSlug = (post.platform || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    downloadFile(text, `social-post-${platformSlug || key + 1}.txt`, 'text/plain');
  }
  return (
    <div className="tool-page">
      <h1>Social Media Post Template Generator</h1>
      <p className="tool-description">
        Pick platforms and a post type, fill in your topic and call-to-action, and click "Generate
        with AI" for genuinely AI-written post drafts - free, no account needed (rate-limited to keep
        it free for everyone). Edit the result to fit your voice before posting.
      </p>
      <div className="tool-controls">
        <label>
          Platforms:
          <input
            type="text"
            value={platforms}
            onChange={(e) => setPlatforms(e.target.value)}
            placeholder="e.g. Twitter / X, Instagram, LinkedIn"
            style={{ minWidth: 240 }}
          />
        </label>
        <label>
          Post type:
          <select value={postType} onChange={(e) => setPostType(e.target.value)}>
            <option value={POST_TYPES.announcement}>Announcement</option>
            <option value={POST_TYPES.question}>Question</option>
            <option value={POST_TYPES.tip}>Tip</option>
            <option value={POST_TYPES.promotion}>Promotion</option>
          </select>
        </label>
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="post-topic">Topic</label>
          <input
            id="post-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. our new product launch"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="post-cta">Call to action</label>
          <input
            id="post-cta"
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g. Shop now at example.com"
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
      {posts.length === 0 && !ai.loading && (
        <p className="tool-placeholder">Fill in the fields above and click Generate with AI.</p>
      )}
      {posts.map((post, i) => (
        <div className="tool-panel" key={i}>
          <label>{post.platform}</label>
          <textarea readOnly value={post.text} style={{ minHeight: 140 }} />
          {post.hashtags?.length > 0 && (
            <div className="timestamp-result">
              <span>{post.hashtags.join(' ')}</span>
            </div>
          )}
          <div className="tool-controls">
            <button type="button" onClick={() => handleCopy(post, i)}>
              {copied === i ? 'Copied!' : 'Copy post'}
            </button>
            <button type="button" onClick={() => handleDownload(post, i)}>
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
