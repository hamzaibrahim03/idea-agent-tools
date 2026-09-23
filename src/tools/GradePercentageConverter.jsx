import { useEffect, useState } from 'react';
const GRADE_BANDS = [
    { min: 97, letter: 'A+', gpa: 4.0 },
    { min: 93, letter: 'A', gpa: 4.0 },
    { min: 90, letter: 'A-', gpa: 3.7 },
    { min: 87, letter: 'B+', gpa: 3.3 },
    { min: 83, letter: 'B', gpa: 3.0 },
    { min: 80, letter: 'B-', gpa: 2.7 },
    { min: 77, letter: 'C+', gpa: 2.3 },
    { min: 73, letter: 'C', gpa: 2.0 },
    { min: 70, letter: 'C-', gpa: 1.7 },
    { min: 67, letter: 'D+', gpa: 1.3 },
    { min: 63, letter: 'D', gpa: 1.0 },
    { min: 60, letter: 'D-', gpa: 0.7 },
    { min: -Infinity, letter: 'F', gpa: 0.0 }
];
export default function GradePercentageConverter() {
    const [percent, setPercent] = useState('88');
    const [valid, setValid] = useState(true);
    const [grade, setGrade] = useState(null);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/grade-percentage-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { percent } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setGrade(data.valid ? data.grade : null);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [percent]);
    return (
        <div className="tool-page">
            <h1>Grade / Percentage Converter</h1>
            <p className="tool-description">
                Convert a percentage score to a US letter grade and 4.0-scale GPA point value, using
                common grading bands. Bands vary by school - check your syllabus for the exact cutoffs
                used. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Percentage:
                    <input type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(e.target.value)} style={{ width: '80px' }} />
                </label>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a percentage between 0 and 100.
                </div>
            )}
            {grade && (
                <div className="timestamp-result">
                    <div>
                        <strong>Letter grade:</strong> {grade.letter}
                    </div>
                    <div>
                        <strong>GPA points:</strong> {grade.gpa.toFixed(1)}
                    </div>
                </div>
            )}
            <div className="tool-panel" style={{ marginTop: 16 }}>
                <label>Grading scale used</label>
                <table className="regex-groups-table">
                    <thead>
                        <tr>
                            <th>Percentage</th>
                            <th>Letter</th>
                            <th>GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {GRADE_BANDS.map((band, i) => {
                            const next = GRADE_BANDS[i - 1];
                            const rangeLabel = i === 0 ? `${band.min}-100` : Number.isFinite(band.min) ? `${band.min}-${next.min - 1}` : `Below ${GRADE_BANDS[i - 1].min}`;
                            return (
                                <tr key={band.letter}>
                                    <td>{rangeLabel}</td>
                                    <td>{band.letter}</td>
                                    <td>{band.gpa.toFixed(1)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
