import { useState } from 'react';
function emptyProperty(name) {
  return { name, price: '', sqft: '', bedrooms: '', bathrooms: '', hoa: '', taxRate: '' };
}
export default function PropertyComparisonTool() {
  const [properties, setProperties] = useState([
    emptyProperty('Property A'),
    emptyProperty('Property B'),
    emptyProperty('Property C')
  ]);
  function updateField(index, field, value) {
    setProperties((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }
  function computed(p) {
    const price = Number(p.price);
    const sqft = Number(p.sqft);
    const taxRate = Number(p.taxRate);
    const pricePerSqft = price > 0 && sqft > 0 ? price / sqft : null;
    const annualTax = price > 0 && Number.isFinite(taxRate) && taxRate > 0 ? price * (taxRate / 100) : null;
    return { pricePerSqft, annualTax };
  }
  const rows = [
    { label: 'Price', get: (p) => p.price || '-' },
    { label: 'Square feet', get: (p) => p.sqft || '-' },
    { label: 'Bedrooms', get: (p) => p.bedrooms || '-' },
    { label: 'Bathrooms', get: (p) => p.bathrooms || '-' },
    { label: 'Price per sq ft', get: (p) => (computed(p).pricePerSqft != null ? computed(p).pricePerSqft.toFixed(2) : '-') },
    { label: 'HOA fee (monthly)', get: (p) => p.hoa || '-' },
    { label: 'Property tax rate (%)', get: (p) => p.taxRate || '-' },
    { label: 'Est. annual property tax', get: (p) => (computed(p).annualTax != null ? computed(p).annualTax.toFixed(2) : '-') }
  ];
  return (
    <div className="tool-page">
      <h1>Property Comparison Tool</h1>
      <p className="tool-description">
        Enter details for up to three properties to compare them side by side, including an
        automatically computed price-per-square-foot and estimated annual property tax. Runs
        entirely in your browser.
      </p>
      <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {properties.map((p, i) => (
          <div className="tool-panel" key={i}>
            <label htmlFor={`pc-name-${i}`}>Name</label>
            <input id={`pc-name-${i}`} type="text" value={p.name} onChange={(e) => updateField(i, 'name', e.target.value)} />
            <label htmlFor={`pc-price-${i}`}>Price</label>
            <input id={`pc-price-${i}`} type="number" min={0} value={p.price} onChange={(e) => updateField(i, 'price', e.target.value)} />
            <label htmlFor={`pc-sqft-${i}`}>Square feet</label>
            <input id={`pc-sqft-${i}`} type="number" min={0} value={p.sqft} onChange={(e) => updateField(i, 'sqft', e.target.value)} />
            <label htmlFor={`pc-bed-${i}`}>Bedrooms</label>
            <input id={`pc-bed-${i}`} type="number" min={0} value={p.bedrooms} onChange={(e) => updateField(i, 'bedrooms', e.target.value)} />
            <label htmlFor={`pc-bath-${i}`}>Bathrooms</label>
            <input id={`pc-bath-${i}`} type="number" min={0} value={p.bathrooms} onChange={(e) => updateField(i, 'bathrooms', e.target.value)} />
            <label htmlFor={`pc-hoa-${i}`}>HOA fee (monthly)</label>
            <input id={`pc-hoa-${i}`} type="number" min={0} value={p.hoa} onChange={(e) => updateField(i, 'hoa', e.target.value)} />
            <label htmlFor={`pc-tax-${i}`}>Property tax rate (% of price/yr)</label>
            <input id={`pc-tax-${i}`} type="number" min={0} step="0.01" value={p.taxRate} onChange={(e) => updateField(i, 'taxRate', e.target.value)} />
          </div>
        ))}
      </div>
      <div className="tool-panel">
        <label>Comparison table</label>
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Metric</th>
                {properties.map((p, i) => (
                  <th key={i}>{p.name || `Property ${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {properties.map((p, i) => (
                    <td key={i}>{row.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
