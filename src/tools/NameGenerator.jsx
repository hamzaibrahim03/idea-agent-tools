import { useState } from 'react';
const FIRST_NAMES = [
  'Aldric', 'Branwen', 'Cassian', 'Delphine', 'Eamon', 'Fiora', 'Gideon', 'Halcyon',
  'Isolde', 'Jasper', 'Kestrel', 'Lysandra', 'Magnus', 'Nyla', 'Orin', 'Perrin',
  'Quenna', 'Roderic', 'Seraphine', 'Thalen', 'Ursula', 'Vesper', 'Wren', 'Xiomara',
  'Yorick', 'Zephyra', 'Aurelia', 'Bastian', 'Corwin', 'Dashiell', 'Elowen', 'Fenwick',
  'Griselda', 'Hollis', 'Ines', 'Joric', 'Kaelin', 'Lorelei', 'Merrick', 'Novia'
];
const LAST_NAMES = [
  'Ashworth', 'Blackwood', 'Cromwell', 'Duskmere', 'Emberly', 'Fairweather', 'Graystone',
  'Hawthorne', 'Ironside', 'Jasperfield', 'Kingsley', 'Larkspur', 'Moorland', 'Nightingale',
  'Oakhaven', 'Pemberton', 'Quillan', 'Ravensworth', 'Silvermoon', 'Thornbury', 'Underhill',
  'Vantage', 'Whitlock', 'Yewbranch', 'Zellweger', 'Ashford', 'Briarwood', 'Castellan',
  'Drummond', 'Everhart', 'Foxglove', 'Greywind', 'Holloway', 'Ivywood', 'Junction',
  'Kestrelwood', 'Locksley', 'Maplecroft', 'Northgate', 'Osgood'
];
function randomInt(maxExclusive) {
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const buf = new Uint32Array(1);
  let n;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return n % maxExclusive;
}
function generateName() {
  const first = FIRST_NAMES[randomInt(FIRST_NAMES.length)];
  const last = LAST_NAMES[randomInt(LAST_NAMES.length)];
  return `${first} ${last}`;
}
export default function NameGenerator() {
  const [count, setCount] = useState(5);
  const [names, setNames] = useState(() => Array.from({ length: 5 }, generateName));
  const [copied, setCopied] = useState(false);
  function handleGenerate() {
    const howMany = Math.min(Math.max(Number(count) || 1, 1), 50);
    setNames(Array.from({ length: howMany }, generateName));
    setCopied(false);
  }
  async function handleCopy() {
    if (names.length === 0) return;
    try {
      await navigator.clipboard.writeText(names.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }
  return (
    <div className="tool-page">
      <h1>Random Name Generator</h1>
      <p className="tool-description">
        Generate random fantasy-style full names from first- and last-name word banks - handy for
        test data, placeholder content, or character naming. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          How many:
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: '70px' }}
          />
        </label>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleCopy} disabled={names.length === 0}>
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      {names.length > 0 && (
        <ul className="uuid-list">
          {names.map((name, i) => (
            <li key={i}>
              <code>{name}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
