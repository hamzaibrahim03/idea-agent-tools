import { useEffect, useState } from 'react';
const QUADRANT_META = [
  { key: 'do', title: 'Do (urgent & important)' },
  { key: 'schedule', title: 'Schedule (important, not urgent)' },
  { key: 'delegate', title: 'Delegate (urgent, not important)' },
  { key: 'delete', title: 'Delete (neither urgent nor important)' }
];
export default function TaskPriorityMatrix() {
  const [tasks, setTasks] = useState([
    { text: 'Respond to client email', urgent: true, important: true },
    { text: 'Plan next quarter strategy', urgent: false, important: true },
    { text: 'Sit in on unrelated meeting', urgent: true, important: false },
    { text: 'Browse industry news', urgent: false, important: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [quadrants, setQuadrants] = useState(QUADRANT_META.map((q) => ({ ...q, tasks: [] })));
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setError('');
      fetch('/api/tools/task-priority-matrix', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { tasks } })
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setQuadrants(data.quadrants);
        })
        .catch((e) => { if (!cancelled) setError(e.message || 'Failed to compute'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [tasks]);
  function addTask() {
    if (!newTask.trim()) return;
    setTasks((prev) => [...prev, { text: newTask.trim(), urgent: false, important: false }]);
    setNewTask('');
  }
  function toggleField(index, field) {
    setTasks((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: !t[field] } : t)));
  }
  function removeTask(index) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }
  return (
    <div className="tool-page">
      <h1>Task Priority Matrix (Eisenhower Matrix)</h1>
      <p className="tool-description">
        Add tasks and toggle whether each is urgent and/or important - the tool automatically sorts
        them into the four Eisenhower matrix quadrants: Do, Schedule, Delegate, and Delete. Runs
        entirely in your browser.
      </p>
      {error && <div className="agent-error">{error}</div>}
      <div className="tool-controls">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          style={{ minWidth: '220px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask();
          }}
        />
        <button type="button" onClick={addTask}>
          Add task
        </button>
      </div>
      <ul className="uuid-list">
        {tasks.map((t, i) => (
          <li key={i}>
            <span style={{ flex: 1 }}>{t.text}</span>
            <label className="checkbox-label">
              <input type="checkbox" checked={t.urgent} onChange={() => toggleField(i, 'urgent')} />
              Urgent
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={t.important} onChange={() => toggleField(i, 'important')} />
              Important
            </label>
            <button type="button" className="uuid-copy-btn" onClick={() => removeTask(i)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="tool-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
        {quadrants.map((q) => (
          <div key={q.key} className="timestamp-result">
            <strong>{q.title}</strong>
            {q.tasks.length === 0 && <div style={{ opacity: 0.6 }}>No tasks here.</div>}
            {q.tasks.map((t, i) => (
              <div key={i}>• {t}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
