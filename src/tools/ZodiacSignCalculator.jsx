import { useState } from 'react';
const SIGNS = [
  { name: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20] },
  { name: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22] },
  { name: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22] },
  { name: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21] }
];
function getZodiacSign(month, day) {
  return SIGNS.find(({ start, end }) => {
    const [sm, sd] = start;
    const [em, ed] = end;
    if (sm === em) return month === sm && day >= sd && day <= ed;
    if (sm > em) return (month === sm && day >= sd) || (month === em && day <= ed);
    return (month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em);
  });
}
export default function ZodiacSignCalculator() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const parsed = new Date(`${birthDate}T12:00:00Z`);
  const valid = !Number.isNaN(parsed.getTime());
  const sign = valid ? getZodiacSign(parsed.getUTCMonth() + 1, parsed.getUTCDate()) : null;
  return (
    <div className="tool-page">
      <h1>Zodiac Sign Calculator</h1>
      <p className="tool-description">
        Find your Western astrological sign based on your birth date. This is for fun, not
        scientific - astrology has no basis in astronomy or predictive validity. Runs entirely in
        your browser.
      </p>
      <div className="tool-controls">
        <label>
          Birth date:
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </label>
      </div>
      {!valid && <div className="tool-error">Please enter a valid date.</div>}
      {valid && sign && (
        <div className="timestamp-result">
          <span style={{ fontSize: 32 }}>{sign.symbol}</span>
          <span>
            <strong>Sign:</strong> {sign.name}
          </span>
        </div>
      )}
    </div>
  );
}
