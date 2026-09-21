import { useState } from 'react';
const ATTRIBUTE_COUNT = 5;
function emptyProduct() {
  return { id: Date.now() + Math.random(), name: '', attrs: Array(ATTRIBUTE_COUNT).fill('') };
}
export default function ProductComparisonTable() {
  const [products, setProducts] = useState([emptyProduct(), emptyProduct()]);
  function updateName(id, value) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, name: value } : p)));
  }
  function updateAttr(id, index, value) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const attrs = [...p.attrs];
        attrs[index] = value;
        return { ...p, attrs };
      })
    );
  }
  function addProduct() {
    setProducts((prev) => [...prev, emptyProduct()]);
  }
  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }
  const hasData = products.some((p) => p.name.trim() || p.attrs.some((a) => a.trim()));
  return (
    <div className="tool-page">
      <h1>Product Comparison Table</h1>
      <p className="tool-description">
        Add products with a name and up to 5 custom feature/spec fields each, and see them rendered
        as a clean comparison table. Runs entirely in your browser.
      </p>
      <div className="tool-controls">
        <button onClick={addProduct}>Add product</button>
      </div>
      {products.map((p, pi) => (
        <div key={p.id} className="tool-grid">
          <div className="tool-panel">
            <label htmlFor={`pc-name-${p.id}`}>Product {pi + 1} name</label>
            <input id={`pc-name-${p.id}`} type="text" value={p.name} onChange={(e) => updateName(p.id, e.target.value)} placeholder="e.g. Model A" />
          </div>
          <div className="tool-controls" style={{ alignItems: 'flex-end' }}>
            <button onClick={() => removeProduct(p.id)} disabled={products.length <= 1}>
              Remove
            </button>
          </div>
          {p.attrs.map((attr, ai) => (
            <div className="tool-panel" key={ai}>
              <label htmlFor={`pc-attr-${p.id}-${ai}`}>Feature/spec {ai + 1}</label>
              <input
                id={`pc-attr-${p.id}-${ai}`}
                type="text"
                value={attr}
                onChange={(e) => updateAttr(p.id, ai, e.target.value)}
                placeholder={`e.g. Feature ${ai + 1} value`}
              />
            </div>
          ))}
        </div>
      ))}
      {hasData && (
        <div className="regex-groups-wrap">
          <table className="regex-groups-table">
            <thead>
              <tr>
                <th>Feature/spec</th>
                {products.map((p) => (
                  <th key={p.id}>{p.name.trim() || 'Unnamed product'}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ATTRIBUTE_COUNT }, (_, ai) => (
                <tr key={ai}>
                  <td>Spec {ai + 1}</td>
                  {products.map((p) => (
                    <td key={p.id}>{p.attrs[ai] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
