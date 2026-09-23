import { useState } from 'react';
import { useAiGenerate } from '../lib/useAiGenerate.js';
import OwnKeyPanel from '../components/OwnKeyPanel.jsx';
function emptyQuestion() {
    return { text: '', marks: '5', answer: '' };
}
export default function ExamPaperGenerator() {
    const [title, setTitle] = useState('Exam Paper');
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    const [subject, setSubject] = useState('');
    const [questionCount, setQuestionCount] = useState('5');
    const ai = useAiGenerate('exam-paper', 'Exam Paper Generator');
    function updateQuestion(i, field, value) {
        setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));
    }
    async function handleGenerateWithAi() {
        const data = await ai.generate({ subject, questionCount });
        if (!data) return;
        const generated = (data.questions || []).map((q) => ({
            text: q.question || '',
            marks: String(q.marks ?? '5'),
            answer: ''
        }));
        if (generated.length === 0) return;
        setQuestions((prev) => {
            const nonEmpty = prev.filter((q) => q.text.trim());
            return [...nonEmpty, ...generated];
        });
        if (data.title && !title.trim()) setTitle(data.title);
    }
    const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
    return (
        <div className="tool-page">
            <h1>Exam Paper Generator</h1>
            <p className="tool-description">
                Add questions with marks allocated to build a printable exam paper. Total marks are
                computed automatically. Toggle the answer key view separately from the clean paper view
                used for printing. Optionally use AI to generate a starting set of questions for a subject,
                then edit marks and add more manually.
            </p>
            <div className="tool-panel">
                <label htmlFor="exam-title">Exam title</label>
                <input id="exam-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="exam-subject">Subject / Topic</label>
                    <input id="exam-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. World War II, Algebra basics" />
                </div>
                <div className="tool-panel">
                    <label htmlFor="exam-count">Number of questions</label>
                    <input id="exam-count" type="number" min={1} max={20} value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} />
                </div>
            </div>
            <div className="tool-controls">
                <button type="button" onClick={handleGenerateWithAi} disabled={ai.loading || !subject.trim()}>
                    {ai.loading ? 'Generating...' : '✨ Generate questions with AI'}
                </button>
                <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
                    {ai.showApiSetup ? 'Hide own-key setup' : ai.apiKey ? 'Own key (connected)' : 'Use my own key (unlimited)'}
                </button>
            </div>
            {ai.showApiSetup && (
                <OwnKeyPanel provider={ai.provider} updateProvider={ai.updateProvider} apiKey={ai.apiKey} updateApiKey={ai.updateApiKey} />
            )}
            {ai.error && <div className="agent-error">{ai.error}</div>}
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
                            <input type="text" placeholder="Question text" value={q.text} onChange={(e) => updateQuestion(i, 'text', e.target.value)} style={{ flex: 1 }} />
                            <label>
                                Marks:
                                <input type="number" min={0} value={q.marks} onChange={(e) => updateQuestion(i, 'marks', e.target.value)} style={{ width: '60px', marginLeft: 4 }} />
                            </label>
                        </div>
                        {showAnswerKey && (
                            <input type="text" placeholder="Model answer (for answer key only)" value={q.answer} onChange={(e) => updateQuestion(i, 'answer', e.target.value)} />
                        )}
                        <button type="button" className="uuid-copy-btn" onClick={() => setQuestions((prev) => prev.filter((_, idx) => idx !== i))} disabled={questions.length <= 1} style={{ alignSelf: 'flex-start' }} >
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
