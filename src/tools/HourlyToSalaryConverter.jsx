import { useEffect, useState } from 'react';
export default function HourlyToSalaryConverter() {
    const [direction, setDirection] = useState('hourlyToSalary');
    const [hourlyRate, setHourlyRate] = useState('25');
    const [annualSalary, setAnnualSalary] = useState('52000');
    const [hoursPerWeek, setHoursPerWeek] = useState('40');
    const [weeksPerYear, setWeeksPerYear] = useState('52');
    const [valid, setValid] = useState(true);
    const [result, setResult] = useState(null);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/hourly-to-salary-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { direction, hourlyRate, annualSalary, hoursPerWeek, weeksPerYear } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setResult(data.valid ? data.result : null);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [direction, hourlyRate, annualSalary, hoursPerWeek, weeksPerYear]);
    return (
        <div className="tool-page">
            <h1>Hourly to Salary Converter</h1>
            <p className="tool-description">
                Convert between an hourly wage and annual, monthly, and weekly salary, based on
                configurable hours per week and weeks worked per year (reduce weeks per year to account
                for unpaid time off). Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Convert:
                    <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="hourlyToSalary">Hourly rate to salary</option>
                        <option value="salaryToHourly">Salary to hourly rate</option>
                    </select>
                </label>
                {direction === 'hourlyToSalary' ? (
                    <label>
                        Hourly rate:
                        <input type="number" min={0} step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} style={{ width: '90px' }} />
                    </label>
                ) : (
                    <label>
                        Annual salary:
                        <input type="number" min={0} value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} style={{ width: '110px' }} />
                    </label>
                )}
                <label>
                    Hours/week:
                    <input type="number" min={0} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} style={{ width: '80px' }} />
                </label>
                <label>
                    Weeks worked/year:
                    <input type="number" min={0} max={52} value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} style={{ width: '80px' }} />
                </label>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter non-negative values, with hours/week and weeks/year (1-52) greater than zero.
                </div>
            )}
            {result && (
                <div className="timestamp-result">
                    <div>
                        <strong>Hourly rate:</strong> {result.hourly.toFixed(2)}
                    </div>
                    <div>
                        <strong>Weekly:</strong> {result.weekly.toFixed(2)}
                    </div>
                    <div>
                        <strong>Monthly:</strong> {result.monthly.toFixed(2)}
                    </div>
                    <div>
                        <strong>Annual:</strong> {result.annual.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
