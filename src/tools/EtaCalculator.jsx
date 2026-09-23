import { useEffect, useState } from 'react';
function nowTimeString() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
export default function EtaCalculator() {
    const [distance, setDistance] = useState('240');
    const [speed, setSpeed] = useState('60');
    const [startTime, setStartTime] = useState(nowTimeString());
    const [valid, setValid] = useState(true);
    const [travelHours, setTravelHours] = useState(null);
    const [etaLabel, setEtaLabel] = useState(null);
    const [dayOffset, setDayOffset] = useState(0);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/eta-calculator', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { distance, speed, startTime } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setValid(data.valid);
                        setTravelHours(data.travelHours ?? null);
                        setEtaLabel(data.etaLabel ?? null);
                        setDayOffset(data.dayOffset ?? 0);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [distance, speed, startTime]);
    function formatDuration(hours) {
        const totalMinutes = Math.round(hours * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h ${m}m`;
    }
    return (
        <div className="tool-page">
            <h1>ETA Calculator</h1>
            <p className="tool-description">
                Enter distance, average speed, and a start time to compute travel time and estimated time of
                arrival - correctly rolling over to the next day when travel crosses midnight. Runs entirely
                in your browser.
            </p>
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="eta-distance">Distance (miles or km)</label>
                    <input id="eta-distance" type="number" min={0} value={distance} onChange={(e) => setDistance(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="eta-speed">Average speed (same unit per hour)</label>
                    <input id="eta-speed" type="number" min={0} value={speed} onChange={(e) => setSpeed(e.target.value)} />
                </div>
                <div className="tool-panel">
                    <label htmlFor="eta-start">Start time</label>
                    <input id="eta-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            {!valid && (
                <div className="tool-error">
                    <strong>Error:</strong> Enter a positive distance, a positive speed, and a valid start time.
                </div>
            )}
            {valid && travelHours !== null && (
                <div className="timestamp-result">
                    <div>
                        <strong>Travel time:</strong> {formatDuration(travelHours)}
                    </div>
                    <div>
                        <strong>ETA:</strong> {etaLabel}
                        {dayOffset > 0 ? ` (+${dayOffset} day${dayOffset > 1 ? 's' : ''})` : ''}
                    </div>
                </div>
            )}
        </div>
    );
}
