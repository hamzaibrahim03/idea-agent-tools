import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="site-logo">
          idea-agent
        </Link>
        <nav>
          <Link to="/">All tools</Link>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Free browser-based tools. Nothing you type is sent to a server.</p>
      </footer>
    </div>
  );
}
