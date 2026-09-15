import { Link } from 'react-router-dom';
import { TOOLS } from '../toolRegistry.js';

export default function Home() {
  return (
    <div className="home-page">
      <h1>Free Developer Tools</h1>
      <p className="home-intro">
        Small, fast, single-purpose tools that run entirely in your browser. No sign-up, no data
        sent anywhere.
      </p>
      <div className="tool-grid-home">
        {TOOLS.map((tool) => (
          <Link key={tool.slug} to={`/tools/${tool.slug}`} className="tool-card">
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
