import { useState } from 'react';
function computeTotal(base, bonusPct, benefits, raisePct) {
  const baseNum = Number(base) || 0;
  const bonusNum = (Number(bonusPct) || 0) / 100;
  const benefitsNum = Number(benefits) || 0;
  const raiseNum = (Number(raisePct) || 0) / 100;
  const newBase = baseNum * (1 + raiseNum);
  const bonusAmount = newBase * bonusNum;
  return {
    newBase,
    bonusAmount,
    total: newBase + bonusAmount + benefitsNum
  };
}
function OfferPanel({ label, offer, onChange }) {
  return (
    <div className="tool-panel">
      <label>{label}</label>
      <label style={{ fontWeight: 400 }}>
        Base salary
        <input type="number" min={0} value={offer.base} onChange={(e) => onChange({ ...offer, base: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Bonus (%)
        <input type="number" min={0} value={offer.bonusPct} onChange={(e) => onChange({ ...offer, bonusPct: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Benefits value (annual $)
        <input type="number" min={0} value={offer.benefits} onChange={(e) => onChange({ ...offer, benefits: e.target.value })} />
      </label>
      <label style={{ fontWeight: 400 }}>
        Equity estimate (annual $)
        <input type="number" min={0} value={offer.equity} onChange={(e) => onChange({ ...offer, equity: e.target.value })} />
      </label>
    </div>
  );
}
export default function SalaryCalculator() {
  const [mode, setMode] = useState('raise');
  const [base, setBase] = useState('80000');
  const [bonusPct, setBonusPct] = useState('10');
  const [benefits, setBenefits] = useState('8000');
  const [raisePct, setRaisePct] = useState('5');
  const [offerA, setOfferA] = useState({ base: '90000', bonusPct: '10', benefits: '10000', equity: '5000' });
  const [offerB, setOfferB] = useState({ base: '85000', bonusPct: '15', benefits: '12000', equity: '10000' });
  const raiseResult = computeTotal(base, bonusPct, benefits, raisePct);
  const currentResult = computeTotal(base, bonusPct, benefits, 0);
  const totalA = (Number(offerA.base) || 0) * (1 + (Number(offerA.bonusPct) || 0) / 100) + (Number(offerA.benefits) || 0) + (Number(offerA.equity) || 0);
  const totalB = (Number(offerB.base) || 0) * (1 + (Number(offerB.bonusPct) || 0) / 100) + (Number(offerB.benefits) || 0) + (Number(offerB.equity) || 0);
  return (
    <div className="tool-page">
      <h1>Salary &amp; Compensation Calculator</h1>
      <p className="tool-description">
        Model a raise negotiation (base salary plus bonus, benefits, and a target raise
        percentage) or compare two job offers side by side, including base, bonus, benefits, and
        an equity estimate. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="raise">Negotiate a raise</option>
            <option value="compare">Compare two offers</option>
          </select>
        </label>
      </div>
      {mode === 'raise' ? (
        <>
          <div className="tool-grid">
            <div className="tool-panel">
              <label htmlFor="sc-base">Current base salary</label>
              <input id="sc-base" type="number" min={0} value={base} onChange={(e) => setBase(e.target.value)} />
            </div>
            <div className="tool-panel">
              <label htmlFor="sc-bonus">Bonus (%)</label>
              <input id="sc-bonus" type="number" min={0} value={bonusPct} onChange={(e) => setBonusPct(e.target.value)} />
            </div>
            <div className="tool-panel">
              <label htmlFor="sc-benefits">Benefits value (annual $)</label>
              <input id="sc-benefits" type="number" min={0} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
            </div>
            <div className="tool-panel">
              <label htmlFor="sc-raise">Requested raise (%)</label>
              <input id="sc-raise" type="number" min={0} value={raisePct} onChange={(e) => setRaisePct(e.target.value)} />
            </div>
          </div>
          <div className="timestamp-result">
            <div>
              <strong>Current total compensation:</strong> ${currentResult.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div>
              <strong>New base after raise:</strong> ${raiseResult.newBase.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div>
              <strong>New bonus amount:</strong> ${raiseResult.bonusAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div>
              <strong>New total compensation:</strong> ${raiseResult.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div>
              <strong>Increase:</strong> ${(raiseResult.total - currentResult.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="tool-grid">
            <OfferPanel label="Offer A" offer={offerA} onChange={setOfferA} />
            <OfferPanel label="Offer B" offer={offerB} onChange={setOfferB} />
          </div>
          <div className="timestamp-result">
            <div>
              <strong>Offer A total value:</strong> ${totalA.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div>
              <strong>Offer B total value:</strong> ${totalB.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div>
              <strong>Better offer:</strong> {totalA === totalB ? 'Tied' : totalA > totalB ? 'Offer A' : 'Offer B'} (
              ${Math.abs(totalA - totalB).toLocaleString(undefined, { maximumFractionDigits: 0 })} difference)
            </div>
          </div>
        </>
      )}
    </div>
  );
}
