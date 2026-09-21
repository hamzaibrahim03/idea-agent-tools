import { useState } from 'react';
const STATUSES = ['applied', 'interview', 'offer', 'rejected'];
function emptyApp() {
  return { company: '', role: '', status: 'applied', date: new Date().toISOString().slice(0, 10) };
}
export default function JobApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [draft, setDraft] = useState(emptyApp());
  const [filter, setFilter] = useState('all');
  function addApplication() {
    if (!draft.company.trim() && !draft.role.trim()) return;
    setApplications((prev) => [...prev, draft]);
    setDraft(emptyApp());
  }
  function updateStatus(index, status) {
    setApplications((prev) => prev.map((a, i) => (i === index ? { ...a, status } : a)));
  }
  function removeApplication(index) {
    setApplications((prev) => prev.filter((_, i) => i !== index));
  }
  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);
  return (
    <div className="tool-page">
      <h1>Job Application Tracker</h1>
      <p className="tool-description">
        Track your job applications - company, role, status, and date - in a simple table you can
        filter by status. This is a session-only tracker: your data lives in this browser tab and
        is lost on refresh or when you close the page, since there is no backend or account
        system. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <input type="text" placeholder="Company" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
        <input type="text" placeholder="Role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
      </div>
      <div className="tool-controls">
        <label>
          Status:
          <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </label>
        <button type="button" onClick={addApplication}>
          Add application
        </button>
      </div>
      <div className="tool-controls">
        <label>
          Filter by status:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All ({applications.length})</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s} ({applications.filter((a) => a.status === s).length})
              </option>
            ))}
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <p className="tool-placeholder">No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}. Add one above.</p>
      ) : (
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a, i) => {
                if (filter !== 'all' && a.status !== filter) return null;
                return (
                  <tr key={i}>
                    <td>{a.company}</td>
                    <td>{a.role}</td>
                    <td>
                      <select value={a.status} onChange={(e) => updateStatus(i, e.target.value)}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{a.date}</td>
                    <td>
                      <button type="button" className="uuid-copy-btn" onClick={() => removeApplication(i)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
