import { useState } from 'react';
function emptyQuestion() {
  return { text: '', marks: '5', answer: '' };
}
export default function ExamPaperGenerator() {
  const [title, setTitle] = useState('Exam Paper');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  function updateQuestion(i, field, value) {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));
  }
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  return (
    <div className="tool-page">
      <h1>Exam Paper Generator</h1>
      <p className="tool-description">
        Add questions with marks allocated to build a printable exam paper. Total marks are
        computed automatically. Toggle the answer key view separately from the clean paper view
        used for printing. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="exam-title">Exam title</label>
        <input id="exam-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="tool-controls">
        <button type="button" onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}>
          Add question
        </button>
        <label className="checkbox-label">
          <input type="checkbox" checked={showAnswerKey} onChange={(e) => setShowAnswerKey(e.target.checked)} />
          Show answer key (hidden from printable paper view)
        </label>
        <button type="button" onClick={() => window.print()}>
          Print paper
        </button>
      </div>
      <ul className="uuid-list">
        {questions.map((q, i) => (
          <li key={i} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                style={{ flex: 1 }}
              />
              <label>
                Marks:
                <input
                  type="number"
                  min={0}
                  value={q.marks}
                  onChange={(e) => updateQuestion(i, 'marks', e.target.value)}
                  style={{ width: '60px', marginLeft: 4 }}
                />
              </label>
            </div>
            {showAnswerKey && (
              <input
                type="text"
                placeholder="Model answer (for answer key only)"
                value={q.answer}
                onChange={(e) => updateQuestion(i, 'answer', e.target.value)}
              />
            )}
            <button
              type="button"
              className="uuid-copy-btn"
              onClick={() => setQuestions((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={questions.length <= 1}
              style={{ alignSelf: 'flex-start' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="timestamp-result">
        <strong>Total marks: {totalMarks}</strong>
      </div>
      <h2 style={{ fontSize: 16, margin: '20px 0 8px' }}>{showAnswerKey ? 'Answer key preview' : 'Printable paper preview'}</h2>
      <div className="timestamp-result" style={{ background: 'var(--bg)' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
        <div style={{ opacity: 0.75 }}>Total marks: {totalMarks}</div>
        {questions.map((q, i) => (
          <div key={i} style={{ marginTop: 10 }}>
            <div>
              <strong>
                {i + 1}. {q.text || '(untitled question)'}
              </strong>{' '}
              [{q.marks || 0} mark{Number(q.marks) === 1 ? '' : 's'}]
            </div>
            {showAnswerKey && q.answer && <div style={{ marginLeft: 12, opacity: 0.8 }}>Answer: {q.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
