import { useEffect, useState } from 'react';
function emptyCategory() {
    return { name: '', weight: '', score: '' };
}
export default function GradeWeightCalculator() {
    const [categories, setCategories] = useState([
        { name: 'Homework', weight: '20', score: '90' },
        { name: 'Exams', weight: '50', score: '85' },
        { name: 'Participation', weight: '30', score: '95' }
    ]);
    const [totalWeight, setTotalWeight] = useState(0);
    const [finalGrade, setFinalGrade] = useState(null);
    const [fetchError, setFetchError] = useState('');
    function updateCategory(i, field, value) {
        setCategories((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
    }
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/grade-weight-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { categories } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setTotalWeight(data.totalWeight || 0);
                        setFinalGrade(data.finalGrade);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [categories]);
    return (
        <div className="tool-page">
            <h1>Grade Weight Calculator</h1>
            <p className="tool-description">
                Enter your assignment categories (e.g. homework, exams, participation) with their weights
                and your score in each, and this tool computes your weighted final grade. This is distinct
                from a simple GPA calculator or a single percentage-to-letter converter - it combines
                multiple weighted categories into one overall grade. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <button type="button" onClick={() => setCategories((prev) => [...prev, emptyCategory()])}>
                    Add category
                </button>
            </div>
            <ul className="uuid-list">
                {categories.map((c, i) => (
                    <li key={i}>
                        <input type="text" placeholder="Category name" value={c.name} onChange={(e) => updateCategory(i, 'name', e.target.value)} style={{ flex: 1 }} />
                        <label>
                            Weight (%):
                            <input type="number" min={0} value={c.weight} onChange={(e) => updateCategory(i, 'weight', e.target.value)} style={{ width: '70px', marginLeft: 4 }} />
                        </label>
                        <label>
                            Score (%):
                            <input type="number" min={0} max={100} value={c.score} onChange={(e) => updateCategory(i, 'score', e.target.value)} style={{ width: '70px', marginLeft: 4 }} />
                        </label>
                        <button type="button" className="uuid-copy-btn" onClick={() => setCategories((prev) => prev.filter((_, idx) => idx !== i))} disabled={categories.length <= 1} >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {totalWeight !== 100 && (
                <div className="tool-error">
                    <strong>Note:</strong> Weights total {totalWeight}%, not 100%. The weighted grade below is still computed proportionally to whatever weights you entered.
                </div>
            )}
            <div className="timestamp-result">
                <div>
                    <strong>Total weight:</strong> {totalWeight}%
                </div>
                <div>
                    <strong>Weighted final grade:</strong> {finalGrade !== null ? `${finalGrade.toFixed(2)}%` : '—'}
                </div>
            </div>
        </div>
    );
}
