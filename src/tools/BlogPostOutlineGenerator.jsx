import { useMemo, useState } from 'react';
function buildOutline(topic, wordCount) {
  const total = Math.max(wordCount, 100);
  const t = topic.trim() || '[your topic]';
  const introWords = Math.round(total * 0.1);
  const conclusionWords = Math.round(total * 0.08);
  const bodyWords = total - introWords - conclusionWords;
  const sectionCount = bodyWords > 1600 ? 5 : bodyWords > 1000 ? 4 : bodyWords > 500 ? 3 : 2;
  const perSectionWords = Math.round(bodyWords / sectionCount);
  return {
    intro: { words: introWords, text: `Introduce ${t}, state why it matters, and preview what the post covers.` },
    sections: Array.from({ length: sectionCount }, (_, i) => ({
      heading: `H2 Section ${i + 1}: [subtopic ${i + 1} of ${t}]`,
      words: perSectionWords
    })),
    conclusion: { words: conclusionWords, text: `Summarize the key takeaways on ${t} and include a closing call-to-action.` }
  };
}
export default function BlogPostOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(1200);
  const outline = useMemo(() => buildOutline(topic, wordCount), [topic, wordCount]);
  return (
    <div className="tool-page">
      <h1>Blog Post Outline Generator</h1>
      <p className="tool-description">
        Enter a blog topic and target word count to get a structured outline - intro, H2 sections
        with estimated word allocation, and conclusion - based on typical blog-post structure. This
        is a structural template, not written content. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="blog-topic">Blog topic</label>
          <input
            id="blog-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to start composting at home"
          />
        </div>
        <div className="tool-panel">
          <label htmlFor="blog-words">Target word count</label>
          <input
            id="blog-words"
            type="number"
            min={100}
            max={10000}
            step={100}
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
          />
        </div>
      </div>
      <ul className="uuid-list">
        <li style={{ alignItems: 'flex-start' }}>
          <span>
            <strong>Intro</strong> (~{outline.intro.words} words) - {outline.intro.text}
          </span>
        </li>
        {outline.sections.map((s, i) => (
          <li key={i} style={{ alignItems: 'flex-start' }}>
            <span>
              <strong>{s.heading}</strong> (~{s.words} words)
            </span>
          </li>
        ))}
        <li style={{ alignItems: 'flex-start' }}>
          <span>
            <strong>Conclusion</strong> (~{outline.conclusion.words} words) - {outline.conclusion.text}
          </span>
        </li>
      </ul>
    </div>
  );
}
