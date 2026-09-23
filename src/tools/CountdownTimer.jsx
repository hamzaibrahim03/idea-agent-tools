import { useState, useEffect } from 'react';
function pad(n) {
    return String(n).padStart(2, '0');
}
function breakdown(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
}
function defaultTarget() {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export default function CountdownTimer() {
    const [targetInput, setTargetInput] = useState(defaultTarget());
    const [activeTarget, setActiveTarget] = useState(null);
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!activeTarget) return undefined;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [activeTarget]);
    function handleStart() {
        const target = new Date(targetInput);
        if (Number.isNaN(target.getTime())) return;
        setActiveTarget(target.getTime());
        setNow(Date.now());
    }
    function handleClear() {
        setActiveTarget(null);
    }
    const remainingMs = activeTarget ? activeTarget - now : null;
    const isPast = remainingMs !== null && remainingMs <= 0;
    const parts = remainingMs !== null ? breakdown(remainingMs) : null;
    return (
        <div className="tool-page">
            <h1>Countdown Timer</h1>
            <p className="tool-description">
                Set a target date and time and watch a live countdown in days, hours, minutes, and seconds.
                Timing is based on real elapsed wall-clock time, so it stays accurate even if the tab is
                backgrounded. Runs entirely in your browser.
            </p>
            <div className="tool-controls">
                <label>
                    Target date/time:
                    <input type="datetime-local" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} />
                </label>
                <button onClick={handleStart}>Start countdown</button>
                <button onClick={handleClear} disabled={!activeTarget}>
                    Clear
                </button>
            </div>
            {activeTarget && parts && (
                <div className="timestamp-result">
                    {isPast ? (
                        <strong>Target reached.</strong>
                    ) : (
                        <code style={{ fontSize: 24 }}>
                            {parts.days}d {pad(parts.hours)}h {pad(parts.minutes)}m {pad(parts.seconds)}s
                        </code>
                    )}
                    <span>
                        <strong>Target:</strong> {new Date(activeTarget).toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    );
}
