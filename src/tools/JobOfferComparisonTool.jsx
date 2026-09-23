import { useState } from 'react';
function emptyOffer(label) {
  return { label, base: '', bonus: '', benefits: '', commuteCost: '', commuteMinutes: '', remoteScore: '5' };
}
function computeValue(offer) {
  const base = Number(offer.base) || 0;
  const bonus = Number(offer.bonus) || 0;
  const benefits = Number(offer.benefits) || 0;
  const commuteCost = Number(offer.commuteCost) || 0;
  const commuteMinutes = Number(offer.commuteMinutes) || 0;
  const remoteScore = Number(offer.remoteScore) || 0;
  const annualCommuteCost = commuteCost * 240;
  const annualCommuteTimeCost = (commuteMinutes * 2 * 240 / 60) * 25;
  const remoteBonusValue = remoteScore * 500;
  const totalValue = base + bonus + benefits + remoteBonusValue - annualCommuteCost - annualCommuteTimeCost;
  return { totalValue, annualCommuteCost, annualCommuteTimeCost, remoteBonusValue };
}
function OfferForm({ offer, onChange }) {
  return (
    <div className="tool-panel">
      <label>{offer.label}</label>
      <label style={{ fontWeight: 400 }}>
        Base salary ($/yr)
        <input type="number" min={0} value={offer.base} onChange={(e) => onChange({ ...offer, base: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Bonus ($/yr)
        <input type="number" min={0} value={offer.bonus} onChange={(e) => onChange({ ...offer, bonus: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Benefits value ($/yr)
        <input type="number" min={0} value={offer.benefits} onChange={(e) => onChange({ ...offer, benefits: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Commute cost ($/day)
        <input type="number" min={0} value={offer.commuteCost} onChange={(e) => onChange({ ...offer, commuteCost: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Commute time (minutes, one-way)
        <input type="number" min={0} value={offer.commuteMinutes} onChange={(e) => onChange({ ...offer, commuteMinutes: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Remote flexibility (0 = office only, 10 = fully remote)
        <input type="number" min={0} max={10} value={offer.remoteScore} onChange={(e) => onChange({ ...offer, remoteScore: e.target.value })} />
      </label>
    </div>
  );
}
export default function JobOfferComparisonTool() {
  const [offerA, setOfferA] = useState(emptyOffer('Offer A'));
  const [offerB, setOfferB] = useState(emptyOffer('Offer B'));
  const resultA = computeValue(offerA);
  const resultB = computeValue(offerB);
  return (
    <div className="tool-page">
      <h1>Job Offer Comparison Tool</h1>
      <p className="tool-description">
        Compare two job offers side by side across base salary, bonus, benefits, commute cost and
        time, and remote flexibility. Commute cost and time are annualized and remote flexibility
        is converted to a small illustrative dollar value, then combined into a normalized "total
        value" for comparison. This is a transparent, configurable calculation - not financial
        advice or an AI-driven recommendation. Runs entirely in your browser.
      </p>
      <div className="tool-grid">
        <OfferForm offer={offerA} onChange={setOfferA} />
        <OfferForm offer={offerB} onChange={setOfferB} />
      </div>
      <div className="timestamp-result">
        <div>
          <strong>Offer A total value:</strong> ${resultA.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
        <div>
          <strong>Offer B total value:</strong> ${resultB.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
        <div>
          <strong>Better value:</strong>{' '}
          {resultA.totalValue === resultB.totalValue ? 'Tied' : resultA.totalValue > resultB.totalValue ? 'Offer A' : 'Offer B'} ($
          {Math.abs(resultA.totalValue - resultB.totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })} difference)
        </div>
      </div>
      <div className="regex-groups-wrap">
        <table className="regex-groups-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Offer A</th>
              <th>Offer B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Annual commute cost</td>
              <td>${resultA.annualCommuteCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              <td>${resultB.annualCommuteCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr>
              <td>Annual commute time cost (est.)</td>
              <td>${resultA.annualCommuteTimeCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              <td>${resultB.annualCommuteTimeCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr>
              <td>Remote flexibility value</td>
              <td>${resultA.remoteBonusValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              <td>${resultB.remoteBonusValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
