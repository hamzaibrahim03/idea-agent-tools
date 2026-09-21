import { useState } from 'react';
function emptyQuestion() {
  return { text: '', choices: ['', '', '', ''], correctIndex: 0 };
}
export default function QuizGenerator() {
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [mode, setMode] = useState('build');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  function updateQuestion(i, field, value) {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));
  }
  function updateChoice(qi, ci, value) {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === qi ? { ...q, choices: q.choices.map((c, cidx) => (cidx === ci ? value : c)) } : q))
    );
  }
  const validQuestions = questions.filter((q) => q.text.trim() && q.choices.every((c) => c.trim()));
  function startQuiz() {
    setAnswers({});
    setSubmitted(false);
    setMode('take');
  }
  function selectAnswer(qi, ci) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qi]: ci }));
  }
  const score = validQuestions.reduce((sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0), 0);
  return (
    <div className="tool-page">
      <h1>Quiz Generator</h1>
      <p className="tool-description">
        Build a multiple-choice quiz by adding questions with four answer choices each, then take
        the quiz yourself and see your score at the end. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button type="button" onClick={() => setMode('build')} disabled={mode === 'build'}>
          Build quiz
        </button>
        <button type="button" onClick={startQuiz} disabled={validQuestions.length === 0}>
          Take quiz ({validQuestions.length} question{validQuestions.length === 1 ? '' : 's'})
        </button>
      </div>
      {mode === 'build' && (
        <>
          <div className="tool-controls">
            <button type="button" onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}>
              Add question
            </button>
          </div>
          <ul className="uuid-list">
            {questions.map((q, qi) => (
              <li key={qi} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                <input type="text" placeholder="Question text" value={q.text} onChange={(e) => updateQuestion(qi, 'text', e.target.value)} />
                {q.choices.map((c, ci) => (
                  <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === ci}
                      onChange={() => updateQuestion(qi, 'correctIndex', ci)}
                    />
                    <input
                      type="text"
                      placeholder={`Choice ${ci + 1}`}
                      value={c}
                      onChange={(e) => updateChoice(qi, ci, e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                ))}
                <span style={{ fontSize: 12, opacity: 0.7 }}>Select the radio button next to the correct answer.</span>
                <button
                  type="button"
                  className="uuid-copy-btn"
                  onClick={() => setQuestions((prev) => prev.filter((_, idx) => idx !== qi))}
                  disabled={questions.length <= 1}
                  style={{ alignSelf: 'flex-start' }}
                >
                  Remove question
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {mode === 'take' && (
        <>
          <ul className="uuid-list">
            {validQuestions.map((q, qi) => (
              <li key={qi} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                <strong>
                  {qi + 1}. {q.text}
                </strong>
                {q.choices.map((c, ci) => {
                  const isSelected = answers[qi] === ci;
                  const isCorrect = ci === q.correctIndex;
                  let color = 'inherit';
                  if (submitted && isSelected && !isCorrect) color = '#dc2626';
                  if (submitted && isCorrect) color = '#16a34a';
                  return (
                    <label key={ci} style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
                      <input type="radio" name={`take-${qi}`} checked={isSelected} onChange={() => selectAnswer(qi, ci)} disabled={submitted} />
                      {c}
                    </label>
                  );
                })}
              </li>
            ))}
          </ul>
          <div className="tool-controls">
            <button type="button" onClick={() => setSubmitted(true)} disabled={submitted}>
              Submit answers
            </button>
          </div>
          {submitted && (
            <div className="timestamp-result">
              <strong>
                Score: {score} / {validQuestions.length}
              </strong>
            </div>
          )}
        </>
      )}
    </div>
  );
}
