import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../toolRegistry.js';
import { AGENTS } from '../agentRegistry.js';
import Seo from './Seo.jsx';
import AdSlot from './AdSlot.jsx';
const INDUSTRY_ICONS = {
  all: '🔎',
  dev: '💻',
  general: '🏠',
  text: '✍️',
  finance: '💰',
  construction: '🏗️',
  business: '💼',
  realestate: '🏡',
  education: '📚',
  career: '👔',
  marketing: '📱',
  ecommerce: '🛒',
  manufacturing: '🏭',
  logistics: '🚚',
  legal: '⚖️',
  healthcare: '🏥',
  architecture: '📐',
  agriculture: '🌱',
  restaurant: '🍽️',
  travel: '✈️',
  design: '🎨',
  documents: '📄'
};
function matchesQuery(tool, query) {
  const q = query.toLowerCase();
  return tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
}
export default function Home() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const searching = query.trim().length > 0;
  const categoryFiltered = category === 'all' ? TOOLS : TOOLS.filter((t) => t.category === category);
  const filteredTools = searching ? TOOLS.filter((t) => matchesQuery(t, query.trim())) : categoryFiltered;
  return (
    <div className="home-page">
      <Seo
        title={null}
        description="Free AI agents and single-purpose online tools that run entirely in your browser: construction, business, developer, and travel planning agents, plus 345+ calculators and generators. No sign-up required."
        path="/"
      />
      <h1>AI Tools &amp; Agents</h1>
      <p className="home-intro">
        Free planning agents that chain several tools into one guided flow, plus 345+ single-purpose
        calculators and generators. Everything runs entirely in your browser — no sign-up, no data
        sent anywhere, and no AI cost hiding behind the results (agents use real math/templates, not
        paid AI calls).
      </p>
      <div className="home-search">
        <input
          type="text"
          className="home-search-input"
          placeholder="🔍 What do you want to accomplish?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tools and agents"
        />
      </div>
      {!searching && (
        <>
          <h2 className="home-section-title">AI Agents</h2>
          <div className="agent-grid-home">
            {AGENTS.map((agent, i) => (
              <Link key={agent.slug} to={`/agents/${agent.slug}`} className="agent-card" style={{ '--i': i }}>
                <span className="agent-card-icon">{agent.icon}</span>
                <h3>{agent.name}</h3>
                <p>{agent.description}</p>
              </Link>
            ))}
          </div>
          <h2 className="home-section-title">Browse by Industry</h2>
          <div className="industry-grid-home">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.value}
                type="button"
                className={category === c.value ? 'industry-card active' : 'industry-card'}
                style={{ '--i': i }}
                onClick={() => setCategory(c.value)}
              >
                <span className="industry-card-icon">{INDUSTRY_ICONS[c.value] || '🔧'}</span>
                <span className="industry-card-label">{c.label}</span>
                <span className="industry-card-count">
                  {c.value === 'all' ? TOOLS.length : TOOLS.filter((t) => t.category === c.value).length}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {/* key forces the grid to remount when the visible set changes, so
          the stagger animation replays instead of only running once. */}
      <h2 className="home-section-title">
        {searching ? `Results for "${query.trim()}"` : CATEGORIES.find((c) => c.value === category)?.label || 'Tools'}
      </h2>
      <div className="tool-grid-home" key={searching ? `search:${query.trim()}` : category}>
        {filteredTools.map((tool, i) => (
          <Link
            key={tool.slug}
            to={`/tools/${tool.slug}`}
            className="tool-card"
            style={{ '--i': Math.min(i, 12) }}
          >
            <div className="tool-card-top">
              <h2>{tool.name}</h2>
              <span className="tool-card-badge">{CATEGORIES.find((c) => c.value === tool.category)?.label || tool.category}</span>
            </div>
            <p>{tool.description}</p>
            <div className="tool-card-footer">
              <span className="tool-card-time">⏱️ ~1 min</span>
              <span className="tool-card-open">Open tool →</span>
            </div>
          </Link>
        ))}
      </div>
      {filteredTools.length === 0 && <p className="tool-placeholder">No tools match this search or category yet.</p>}
      <AdSlot slot="0000000000" style={{ marginTop: 32 }} />
    </div>
  );
}
