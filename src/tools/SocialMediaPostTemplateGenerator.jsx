import { useMemo, useState } from 'react';
const PLATFORMS = {
  twitter: { label: 'Twitter / X', limit: 280 },
  instagram: { label: 'Instagram', limit: 2200 },
  linkedin: { label: 'LinkedIn', limit: 3000 },
  facebook: { label: 'Facebook', limit: 63206 }
};
const POST_TYPES = {
  announcement: 'announcement',
  question: 'question',
  tip: 'tip',
  promotion: 'promotion'
};
function buildPost({ platform, postType, topic, cta }) {
  const t = topic.trim() || '[your topic]';
  const c = cta.trim() || '[your call-to-action]';
  const hashtagHint = platform === 'instagram' || platform === 'twitter' ? '\n\n#YourHashtags' : '';
  switch (postType) {
    case POST_TYPES.announcement:
      return `Big news! ${t}\n\nWe're excited to share this with you. Here's what it means for you and why it matters.\n\n${c}${hashtagHint}`;
    case POST_TYPES.question:
      return `Quick question for our community: what's your take on ${t}?\n\nDrop your thoughts in the comments - we read every one.\n\n${c}${hashtagHint}`;
    case POST_TYPES.tip:
      return `Tip: here's something worth knowing about ${t}.\n\n1. Start with the basics\n2. Apply it consistently\n3. Track the results\n\n${c}${hashtagHint}`;
    case POST_TYPES.promotion:
      return `For a limited time: ${t}\n\nDon't miss this - it won't last long.\n\n${c}${hashtagHint}`;
    default:
      return '';
  }
}
export default function SocialMediaPostTemplateGenerator() {
  const [platform, setPlatform] = useState('twitter');
  const [postType, setPostType] = useState(POST_TYPES.announcement);
  const [topic, setTopic] = useState('');
  const [cta, setCta] = useState('');
  const [copied, setCopied] = useState(false);
  const post = useMemo(
    () => buildPost({ platform, postType, topic, cta }),
    [platform, postType, topic, cta]
  );
  const limit = PLATFORMS[platform].limit;
  const overLimit = post.length > limit;
  async function handleCopy() {
    if (!post) return;
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Social Media Post Template Generator</h1>
      <p className="tool-description">
        Pick a platform and post type, fill in your topic and call-to-action, and get a structured
        post draft based on common post patterns. This is a template generator, not AI writing - edit
        the result to fit your voice. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Platform:
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
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
        <button onClick={handleCopy} disabled={!post}>
          {copied ? 'Copied!' : 'Copy post'}
        </button>
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
      <div className="tool-panel">
        <label htmlFor="post-output">
          Generated post{' '}
          {overLimit && (
            <span className="tool-error-inline">
              {post.length}/{limit} - over {PLATFORMS[platform].label} limit
            </span>
          )}
        </label>
        <textarea id="post-output" value={post} readOnly style={{ minHeight: 220 }} />
      </div>
      <div className="timestamp-result">
        <span>
          <strong>Character count:</strong> {post.length} / {limit}
        </span>
      </div>
    </div>
  );
}
