import { useEffect, useState } from 'react';
const VOLUME_UNITS = {
    teaspoon: 4.92892,
    tablespoon: 14.7868,
    'fluid ounce': 29.5735,
    cup: 236.588,
    milliliter: 1,
    liter: 1000
};
const INGREDIENT_GRAMS_PER_CUP = {
    'All-purpose flour': 120,
    'Granulated sugar': 200,
    'Brown sugar (packed)': 220,
    Butter: 227,
    'Rolled oats': 90,
    'Honey': 340,
    Rice: 185,
    'Powdered sugar': 120
};
export default function CookingMeasurementConverter() {
    const [value, setValue] = useState('1');
    const [fromUnit, setFromUnit] = useState('cup');
    const [toUnit, setToUnit] = useState('tablespoon');
    const [weightValue, setWeightValue] = useState('1');
    const [ingredient, setIngredient] = useState('All-purpose flour');
    const [weightDirection, setWeightDirection] = useState('cupsToGrams');
    const [volumeResult, setVolumeResult] = useState(null);
    const [weightResult, setWeightResult] = useState(null);
    const [fetchError, setFetchError] = useState('');
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setFetchError('');
            fetch('/api/tools/cooking-measurement-converter', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ input: { value, fromUnit, toUnit, weightValue, ingredient, weightDirection } })
            })
                .then((r) => r.json())
                .then((data) => {
                    if (cancelled) return;
                    if (data.error) {
                        setFetchError(data.error);
                    } else {
                        setVolumeResult(data.volumeResult);
                        setWeightResult(data.weightResult);
                    }
                })
                .catch((e) => { if (!cancelled) setFetchError(e.message || 'Failed to compute'); });
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [value, fromUnit, toUnit, weightValue, ingredient, weightDirection]);
    return (
        <div className="tool-page">
            <h1>Cooking Measurement Converter</h1>
            <p className="tool-description">
                Convert between common cooking volume units (cups, tablespoons, teaspoons, fluid ounces,
                milliliters, liters), and estimate weight conversions for a few common baking ingredients.
                Runs entirely in your browser.
            </p>
            <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Volume conversion</h2>
            <div className="tool-controls">
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '120px' }} />
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                    {Object.keys(VOLUME_UNITS).map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
                <span>=</span>
                <strong>{volumeResult !== null && volumeResult !== undefined ? Number(volumeResult.toFixed(4)) : '—'}</strong>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                    {Object.keys(VOLUME_UNITS).map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
            </div>
            <h2 style={{ fontSize: 18, margin: '24px 0 8px' }}>Weight conversion (by ingredient)</h2>
            <div className="tool-controls">
                <input type="number" value={weightValue} onChange={(e) => setWeightValue(e.target.value)} style={{ width: '120px' }} />
                <select value={weightDirection} onChange={(e) => setWeightDirection(e.target.value)}>
                    <option value="cupsToGrams">cups of</option>
                    <option value="gramsToCups">grams of</option>
                </select>
                <select value={ingredient} onChange={(e) => setIngredient(e.target.value)}>
                    {Object.keys(INGREDIENT_GRAMS_PER_CUP).map((i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
                <span>=</span>
                <strong>
                    {weightResult !== null && weightResult !== undefined ? Number(weightResult.toFixed(1)) : '—'}{' '}
                    {weightDirection === 'cupsToGrams' ? 'g' : 'cups'}
                </strong>
            </div>
            {fetchError && <div className="agent-error">{fetchError}</div>}
            <div className="tool-error">
                Weight conversions are ingredient-specific approximations (e.g. 1 cup of flour ≈ 120g, 1 cup
                of sugar ≈ 200g). Actual weight varies with how an ingredient is measured, packed, or sifted
                - use a kitchen scale for precise baking.
            </div>
        </div>
    );
}
