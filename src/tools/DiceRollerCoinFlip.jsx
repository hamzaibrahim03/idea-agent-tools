import { useState } from 'react';
const DIE_SIDES = [4, 6, 8, 10, 12, 20, 100];
function randomInt(maxExclusive) {
  const range = maxExclusive;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);
  const buf = new Uint32Array(1);
  let n;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return n % range;
}
function rollDice(count, sides) {
  return Array.from({ length: count }, () => randomInt(sides) + 1);
}
function flipCoins(count) {
  return Array.from({ length: count }, () => (randomInt(2) === 0 ? 'Heads' : 'Tails'));
}
export default function DiceRollerCoinFlip() {
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [customSides, setCustomSides] = useState('20');
  const [useCustomSides, setUseCustomSides] = useState(false);
  const [diceResults, setDiceResults] = useState([]);
  const [coinCount, setCoinCount] = useState(1);
  const [coinResults, setCoinResults] = useState([]);
  const effectiveSides = useCustomSides ? Math.max(2, Number(customSides) || 2) : diceSides;
  function handleRollDice() {
    const count = Math.min(Math.max(Number(diceCount) || 1, 1), 10);
    setDiceResults(rollDice(count, effectiveSides));
  }
  function handleFlipCoins() {
    const count = Math.min(Math.max(Number(coinCount) || 1, 1), 10);
    setCoinResults(flipCoins(count));
  }
  const diceSum = diceResults.reduce((a, b) => a + b, 0);
  const headsCount = coinResults.filter((r) => r === 'Heads').length;
  return (
    <div className="tool-page">
      <h1>Dice Roller & Coin Flip</h1>
      <p className="tool-description">
        Roll virtual dice or flip virtual coins using your browser's cryptographically-random
        source. Nothing is sent to a server. Runs entirely in your browser.
      </p>
      <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Dice Roller</h2>
      <div className="tool-controls">
        <label>
          Number of dice:
          <input
            type="number"
            min={1}
            max={10}
            value={diceCount}
            onChange={(e) => setDiceCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <label>
          Die sides:
          <select
            value={useCustomSides ? 'custom' : diceSides}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setUseCustomSides(true);
              } else {
                setUseCustomSides(false);
                setDiceSides(Number(e.target.value));
              }
            }}
          >
            {DIE_SIDES.map((s) => (
              <option key={s} value={s}>
                d{s}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>
        {useCustomSides && (
          <label>
            Sides:
            <input
              type="number"
              min={2}
              value={customSides}
              onChange={(e) => setCustomSides(e.target.value)}
              style={{ width: '70px' }}
            />
          </label>
        )}
        <button onClick={handleRollDice}>Roll</button>
      </div>
      {diceResults.length > 0 && (
        <div className="timestamp-result">
          <div>
            <strong>Results:</strong> {diceResults.join(', ')}
          </div>
          <div>
            <strong>Sum:</strong> {diceSum}
          </div>
        </div>
      )}
      <h2 style={{ fontSize: 18, margin: '24px 0 8px' }}>Coin Flip</h2>
      <div className="tool-controls">
        <label>
          Number of coins:
          <input
            type="number"
            min={1}
            max={10}
            value={coinCount}
            onChange={(e) => setCoinCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <button onClick={handleFlipCoins}>Flip</button>
      </div>
      {coinResults.length > 0 && (
        <div className="timestamp-result">
          <div>
            <strong>Results:</strong> {coinResults.join(', ')}
          </div>
          <div>
            <strong>Heads:</strong> {headsCount} &nbsp; <strong>Tails:</strong> {coinResults.length - headsCount}
          </div>
        </div>
      )}
    </div>
  );
}
