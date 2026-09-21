import { useState } from 'react';
function mean(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
function mode(nums) {
  const counts = new Map();
  nums.forEach((n) => counts.set(n, (counts.get(n) || 0) + 1));
  const maxCount = Math.max(...counts.values());
  if (maxCount === 1) return [];
  return [...counts.entries()].filter(([, c]) => c === maxCount).map(([v]) => v);
}
function variance(nums, avg, sample) {
  const sumSq = nums.reduce((acc, n) => acc + (n - avg) ** 2, 0);
  return sumSq / (nums.length - (sample ? 1 : 0));
}
export default function StatisticsCalculator() {
  const [input, setInput] = useState('4, 8, 6, 5, 3, 9, 8, 7');
  const nums = input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number);
  let error = '';
  if (nums.length === 0) {
    error = 'Enter a list of numbers, separated by commas or spaces.';
  } else if (nums.some(Number.isNaN)) {
    error = 'All values must be valid numbers.';
  }
  let stats = null;
  if (!error) {
    const avg = mean(nums);
    const sorted = [...nums].sort((a, b) => a - b);
    stats = {
      count: nums.length,
      mean: avg,
      median: median(nums),
      mode: mode(nums),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0],
      popVariance: variance(nums, avg, false),
      popStdDev: Math.sqrt(variance(nums, avg, false)),
      sampleVariance: nums.length > 1 ? variance(nums, avg, true) : null,
      sampleStdDev: nums.length > 1 ? Math.sqrt(variance(nums, avg, true)) : null,
    };
  }
  function fmt(n) {
    return Number(n.toFixed(4)).toString();
  }
  return (
    <div className="tool-page">
      <h1>Statistics Calculator</h1>
      <p className="tool-description">
        Paste a list of numbers to compute the mean, median, mode, range, variance, and standard
        deviation - both population and sample formulas. Runs entirely in your browser.
      </p>
      <div className="tool-panel">
        <label htmlFor="stats-input">Numbers (comma or space separated)</label>
        <textarea
          id="stats-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ minHeight: '100px' }}
        />
      </div>
      {error && <div className="tool-error">{error}</div>}
      {stats && (
        <div className="timestamp-result">
          <span><strong>Count:</strong> {stats.count}</span>
          <span><strong>Mean:</strong> {fmt(stats.mean)}</span>
          <span><strong>Median:</strong> {fmt(stats.median)}</span>
          <span><strong>Mode:</strong> {stats.mode.length ? stats.mode.map(fmt).join(', ') : 'None'}</span>
          <span><strong>Min:</strong> {fmt(stats.min)}</span>
          <span><strong>Max:</strong> {fmt(stats.max)}</span>
          <span><strong>Range:</strong> {fmt(stats.range)}</span>
          <span><strong>Population variance:</strong> {fmt(stats.popVariance)}</span>
          <span><strong>Population std. deviation:</strong> {fmt(stats.popStdDev)}</span>
          <span>
            <strong>Sample variance:</strong>{' '}
            {stats.sampleVariance !== null ? fmt(stats.sampleVariance) : 'Needs 2+ values'}
          </span>
          <span>
            <strong>Sample std. deviation:</strong>{' '}
            {stats.sampleStdDev !== null ? fmt(stats.sampleStdDev) : 'Needs 2+ values'}
          </span>
        </div>
      )}
    </div>
  );
}
