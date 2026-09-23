import { useState } from 'react';
const QUADRANTS = [
  { key: 'do', title: 'Do (urgent & important)', match: (u, i) => u && i },
  { key: 'schedule', title: 'Schedule (important, not urgent)', match: (u, i) => !u && i },
  { key: 'delegate', title: 'Delegate (urgent, not important)', match: (u, i) => u && !i },
  { key: 'delete', title: 'Delete (neither urgent nor important)', match: (u, i) => !u && !i }
];
export default function TaskPriorityMatrix() {
  const [tasks, setTasks] = useState([
    { text: 'Respond to client email', urgent: true, important: true },
    { text: 'Plan next quarter strategy', urgent: false, important: true },
    { text: 'Sit in on unrelated meeting', urgent: true, important: false },
    { text: 'Browse industry news', urgent: false, important: false }
  ]);
  const [newTask, setNewTask] = useState('');
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
        {QUADRANTS.map((q) => {
          const matching = tasks.filter((t) => q.match(t.urgent, t.important));
          return (
            <div key={q.key} className="timestamp-result">
              <strong>{q.title}</strong>
              {matching.length === 0 && <div style={{ opacity: 0.6 }}>No tasks here.</div>}
              {matching.map((t, i) => (
                <div key={i}>• {t.text}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
