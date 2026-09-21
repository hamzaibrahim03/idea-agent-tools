import { useState } from 'react';
const ROADMAPS = {
  'Frontend Developer': {
    beginner: ['HTML & CSS fundamentals', 'JavaScript basics', 'Git & GitHub', 'Responsive design'],
    intermediate: ['A JavaScript framework (React, Vue, or Svelte)', 'CSS layout systems (Flexbox, Grid)', 'REST APIs & fetch', 'Browser dev tools & debugging'],
    advanced: ['State management', 'Testing (unit & integration)', 'Performance optimization', 'Accessibility (a11y)', 'Build tools & bundlers']
  },
  'Data Analyst': {
    beginner: ['Excel/Google Sheets fundamentals', 'Basic statistics', 'SQL basics'],
    intermediate: ['Data visualization (Tableau/Power BI)', 'Python or R for data analysis', 'Intermediate SQL (joins, window functions)'],
    advanced: ['A/B testing & experiment design', 'Predictive modeling basics', 'Data storytelling & dashboards', 'ETL pipeline concepts']
  },
  'Product Manager': {
    beginner: ['Product lifecycle basics', 'User research fundamentals', 'Writing user stories'],
    intermediate: ['Roadmapping & prioritization frameworks', 'Agile/Scrum practices', 'Basic SQL for product analytics', 'Stakeholder communication'],
    advanced: ['Go-to-market strategy', 'Pricing & monetization', 'Cross-functional leadership', 'Advanced analytics & experimentation']
  },
  'Backend Developer': {
    beginner: ['A programming language (Node.js, Python, or Java)', 'Databases & SQL basics', 'HTTP & REST fundamentals'],
    intermediate: ['API design', 'Authentication & authorization', 'Caching strategies', 'Testing backend services'],
    advanced: ['System design & scalability', 'Message queues & async processing', 'Containerization (Docker)', 'CI/CD pipelines']
  },
  'UX Designer': {
    beginner: ['Design fundamentals (color, typography, layout)', 'User research basics', 'Wireframing'],
    intermediate: ['Prototyping tools (Figma)', 'Usability testing', 'Design systems'],
    advanced: ['Interaction design patterns', 'Accessibility in design', 'Design leadership & critique facilitation']
  }
};
export default function LearningRoadmapGenerator() {
  const [role, setRole] = useState('Frontend Developer');
  const roadmap = ROADMAPS[role];
  return (
    <div className="tool-page">
      <h1>Learning Roadmap Generator</h1>
      <p className="tool-description">
        Pick a target role to see a built-in, ordered list of typical skills and topics to learn
        for that path, grouped by beginner, intermediate, and advanced stages. This is a curated
        reference roadmap, not a personalized AI-generated plan. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Target role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {Object.keys(ROADMAPS).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>
      {['beginner', 'intermediate', 'advanced'].map((stage) => (
        <div key={stage}>
          <h2 style={{ fontSize: 16, margin: '16px 0 8px', textTransform: 'capitalize' }}>{stage}</h2>
          <ul className="uuid-list">
            {roadmap[stage].map((item, i) => (
              <li key={i}>
                <span>
                  {i + 1}. {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
