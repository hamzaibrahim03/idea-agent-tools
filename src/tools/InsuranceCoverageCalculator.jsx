import { useState } from 'react';
function computeCoverage(bill, deductibleRemaining, coinsurancePercent, oopMax, oopSpentSoFar) {
  let remainingBill = bill;
  let patientPays = 0;
  const deductiblePortion = Math.min(remainingBill, Math.max(0, deductibleRemaining));
  patientPays += deductiblePortion;
  remainingBill -= deductiblePortion;
  const coinsuranceOnRemainder = remainingBill * (coinsurancePercent / 100);
  let patientTotalIfUncapped = patientPays + coinsuranceOnRemainder;
  const spentBeforeThisBill = oopSpentSoFar;
  const roomLeftInOopMax = Math.max(0, oopMax - spentBeforeThisBill);
  let finalPatientPays;
  if (patientTotalIfUncapped <= roomLeftInOopMax) {
    finalPatientPays = patientTotalIfUncapped;
  } else {
    finalPatientPays = roomLeftInOopMax;
  }
  const insurancePays = bill - finalPatientPays;
  return { patientPays: finalPatientPays, insurancePays };
}
export default function InsuranceCoverageCalculator() {
  const [bill, setBill] = useState('2000');
  const [deductibleRemaining, setDeductibleRemaining] = useState('500');
  const [coinsurance, setCoinsurance] = useState('20');
  const [oopMax, setOopMax] = useState('5000');
  const [oopSpent, setOopSpent] = useState('0');
  const billNum = Number(bill);
  const deductibleNum = Number(deductibleRemaining);
  const coinsuranceNum = Number(coinsurance);
  const oopMaxNum = Number(oopMax);
  const oopSpentNum = Number(oopSpent);
  const valid =
    Number.isFinite(billNum) && billNum >= 0 &&
    Number.isFinite(deductibleNum) && deductibleNum >= 0 &&
    Number.isFinite(coinsuranceNum) && coinsuranceNum >= 0 && coinsuranceNum <= 100 &&
    Number.isFinite(oopMaxNum) && oopMaxNum >= 0 &&
    Number.isFinite(oopSpentNum) && oopSpentNum >= 0;
  const result = valid ? computeCoverage(billNum, deductibleNum, coinsuranceNum, oopMaxNum, oopSpentNum) : null;
  return (
    <div className="tool-page">
      <h1>Insurance Coverage Calculator</h1>
      <p className="tool-description">
        Estimate how a medical bill splits between you and your insurer, using standard health
        insurance math: you pay up to your remaining deductible, then a coinsurance percentage
        applies until you reach your out-of-pocket max, after which insurance covers the rest.
        Runs entirely in your browser.
      </p>
      <div className="tool-error">
        <strong>Not medical or insurance advice:</strong> This is illustrative math based on a
        simplified standard plan structure. Actual insurance plans have varying rules, exclusions,
        and network considerations. Confirm real figures with your insurance provider.
      </div>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ic-bill">Medical bill amount ($)</label>
          <input id="ic-bill" type="number" min={0} value={bill} onChange={(e) => setBill(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ic-deductible">Deductible remaining ($)</label>
          <input id="ic-deductible" type="number" min={0} value={deductibleRemaining} onChange={(e) => setDeductibleRemaining(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ic-coinsurance">Coinsurance (% you pay after deductible)</label>
          <input id="ic-coinsurance" type="number" min={0} max={100} value={coinsurance} onChange={(e) => setCoinsurance(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ic-oop-max">Annual out-of-pocket max ($)</label>
          <input id="ic-oop-max" type="number" min={0} value={oopMax} onChange={(e) => setOopMax(e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ic-oop-spent">Out-of-pocket already spent this year ($)</label>
          <input id="ic-oop-spent" type="number" min={0} value={oopSpent} onChange={(e) => setOopSpent(e.target.value)} />
        </div>
      </div>
      {!valid && (
        <div className="tool-error">
          <strong>Error:</strong> Enter valid non-negative amounts, and a coinsurance percentage
          between 0 and 100.
        </div>
      )}
      {result && (
        <div className="timestamp-result">
          <div>
            <strong>You owe:</strong> ${result.patientPays.toFixed(2)}
          </div>
          <div>
            <strong>Insurance pays:</strong> ${result.insurancePays.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
