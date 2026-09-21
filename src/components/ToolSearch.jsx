import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../toolRegistry.js';
function matchesQuery(tool, query) {
  const q = query.toLowerCase();
  return tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
}
export default function ToolSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const results = query.trim() ? TOOLS.filter((t) => matchesQuery(t, query.trim())).slice(0, 8) : [];
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  function goToTool(tool) {
    navigate(`/tools/${tool.slug}`);
    setQuery('');
    setOpen(false);
  }
  function handleKeyDown(e) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      goToTool(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }
  return (
    <div className="tool-search" ref={containerRef}>
      <input
        type="text"
        className="tool-search-input"
        placeholder="Search tools…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label="Search tools"
      />
      {open && query.trim() && (
        <ul className="tool-search-results">
          {results.length > 0 ? (
            results.map((tool, i) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  className={i === activeIndex ? 'tool-search-result active' : 'tool-search-result'}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => goToTool(tool)}
                >
                  <span className="tool-search-result-name">{tool.name}</span>
                  <span className="tool-search-result-desc">{tool.description}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="tool-search-empty">No tools match "{query.trim()}"</li>
          )}
        </ul>
      )}
    </div>
  );
}
