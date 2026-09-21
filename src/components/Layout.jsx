import { Link, Outlet, useLocation } from 'react-router-dom';
import ToolSearch from './ToolSearch.jsx';
export default function Layout() {
  const location = useLocation();
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="site-logo">
          idea-agent
        </Link>
        <ToolSearch />
        <nav>
          <Link to="/">All tools</Link>
        </nav>
      </header>
      {/* key={pathname} forces a remount on route change so the fade-up
          animation replays per page instead of only on first load. */}
      <main className="site-main" key={location.pathname}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Free browser-based tools. Almost everything runs locally in your browser — the QR code generator is the one exception, noted on its page.</p>
      </footer>
    </div>
  );
}
