import { useMemo, useState } from 'react';
import '../assets/style.css'
/*
|--------------------------------------------------------------------------
| Construction Agent
|--------------------------------------------------------------------------
| Demo / planning tool for residential construction.
|
| IMPORTANT:
| - Rates are planning assumptions and should be verified locally.
| - Material quantities are approximate.
| - Site/Floor maps are conceptual demo layouts only.
| - Final construction drawings must be prepared/verified by a
|   qualified architect / structural engineer / relevant authority.
|--------------------------------------------------------------------------
*/
const SQFT_PER_MARLA = 225;
const COVERED_AREA_RATIO = 0.85;
const QUALITY_TIERS = {
    economy: {
        label: 'Economy',
        greyRate: 2900,
        turnkeyRate: 5600,
        steelDensity: 3.5
    },
    standard: {
        label: 'Standard',
        greyRate: 3200,
        turnkeyRate: 7000,
        steelDensity: 4.2
    },
    premium: {
        label: 'Premium',
        greyRate: 3500,
        turnkeyRate: 8500,
        steelDensity: 5.0
    }
};
const MATERIAL_RATES = {
    cement: 1450,
    steelGrade40: 258,
    steelGrade60: 263,
    bricks: 25,
    sandRavi: 88,
    sandChenab: 98,
    crush: 180,
    bindingWire: 300,
    dpc: 45,
    termite: 18
};
const LABOUR_RATES = {
    mason: 2400,
    helper: 1400,
    steelFixer: 2600,
    carpenter: 2800,
    electrician: 3000,
    plumber: 2700,
    tileMason: 2500,
    painter: 2400,
    welder: 2800,
    aluminiumWorker: 2600
};
const FINISHING_RATES = {
    economy: {
        flooring: 300,
        paint: 180,
        doors: 220,
        windows: 250,
        kitchen: 450,
        sanitary: 220,
        electrical: 250,
        plumbing: 180,
        ceiling: 120
    },
    standard: {
        flooring: 500,
        paint: 280,
        doors: 350,
        windows: 400,
        kitchen: 750,
        sanitary: 400,
        electrical: 400,
        plumbing: 300,
        ceiling: 220
    },
    premium: {
        flooring: 850,
        paint: 450,
        doors: 550,
        windows: 650,
        kitchen: 1200,
        sanitary: 700,
        electrical: 650,
        plumbing: 500,
        ceiling: 400
    }
};
const PHASES = [
    {
        name: 'Site preparation',
        days: 7
    },
    {
        name: 'Foundation',
        days: 18
    },
    {
        name: 'Structure / columns / beams',
        days: 30
    },
    {
        name: 'Brick masonry',
        days: 22
    },
    {
        name: 'Roof slabs',
        days: 14
    },
    {
        name: 'Electrical & plumbing',
        days: 18
    },
    {
        name: 'Plastering',
        days: 20
    },
    {
        name: 'Flooring & tiles',
        days: 18
    },
    {
        name: 'Doors & windows',
        days: 12
    },
    {
        name: 'Kitchen & sanitary',
        days: 12
    },
    {
        name: 'Painting',
        days: 15
    },
    {
        name: 'Final inspection',
        days: 5
    }
];
const RISKS = [
    {
        item: 'Material price fluctuation',
        likelihood: 4,
        severity: 3
    },
    {
        item: 'Weather / monsoon delays',
        likelihood: 3,
        severity: 3
    },
    {
        item: 'Labor shortage',
        likelihood: 3,
        severity: 2
    },
    {
        item: 'Design changes during construction',
        likelihood: 3,
        severity: 4
    },
    {
        item: 'Approval / permission delays',
        likelihood: 2,
        severity: 4
    },
    {
        item: 'Soil / structural conditions',
        likelihood: 2,
        severity: 5
    },
    {
        item: 'Supplier delays',
        likelihood: 3,
        severity: 3
    },
    {
        item: 'Contractor scope disputes',
        likelihood: 2,
        severity: 4
    }
];
const ROAD_SIDES = {
    front: 'Front',
    back: 'Back',
    left: 'Left',
    right: 'Right'
};
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function formatDate(date) {
    return date.toISOString().slice(0, 10);
}
function formatCurrency(value) {
    return `Rs. ${Math.round(value).toLocaleString()}`;
}
function riskLevel(score) {
    if (score <= 3) {
        return {
            label: 'Low',
            color: '#16a34a'
        };
    }
    if (score <= 7) {
        return {
            label: 'Medium',
            color: '#ca8a04'
        };
    }
    if (score <= 14) {
        return {
            label: 'High',
            color: '#ea580c'
        };
    }
    return {
        label: 'Critical',
        color: '#dc2626'
    };
}
/*
|--------------------------------------------------------------------------
| Demo Site Map
|--------------------------------------------------------------------------
*/
function DemoSiteMap({
    plotWidth,
    plotDepth,
    roadSide,
    parking,
    lawn,
    basement
}) {
    const roadClass = `demo-road road-${roadSide}`;
    return (
        <div className="construction-map-wrapper">
            <div className="construction-map-header">
                <div>
                    <h3>🗺️ Demo Site Map</h3>
                    <p>
                        Conceptual site arrangement for a {plotWidth} × {plotDepth} ft
                        plot.
                    </p>
                </div>
                <div className="map-badge">
                    DEMO / CONCEPTUAL
                </div>
            </div>
            <div className="construction-map">
                <div className="north-arrow">
                    ↑
                    <span>N</span>
                </div>
                <div className={roadClass}>
                    ROAD
                </div>
                <div className="plot-boundary">
                    <div className="plot-label">
                        Plot
                        <br />
                        {plotWidth} × {plotDepth} ft
                    </div>
                    <div className="site-building">
                        <div className="building-title">
                            HOUSE
                        </div>
                        <div className="site-room living-room">
                            Living
                        </div>
                        <div className="site-room bedroom-one">
                            Bedroom
                        </div>
                        <div className="site-room bedroom-two">
                            Bedroom
                        </div>
                        <div className="site-room kitchen-room">
                            Kitchen
                        </div>
                        <div className="site-room bath-room">
                            Bath
                        </div>
                        <div className="site-room stairs-room">
                            Stairs
                        </div>
                        <div className="site-room dining-room">
                            Dining
                        </div>
                    </div>
                    {parking && (
                        <div className="site-parking">
                            🚗 Parking
                        </div>
                    )}
                    {lawn && (
                        <div className="site-lawn">
                            🌿 Lawn
                        </div>
                    )}
                    <div className="site-gate">
                        Main Gate
                    </div>
                    <div className="site-water-tank">
                        Water Tank
                    </div>
                    {basement && (
                        <div className="site-basement">
                            Basement
                        </div>
                    )}
                </div>
            </div>
            <div className="map-legend">
                <div>
                    <span className="legend-box building-legend" />
                    Building
                </div>
                <div>
                    <span className="legend-box parking-legend" />
                    Parking
                </div>
                <div>
                    <span className="legend-box lawn-legend" />
                    Lawn
                </div>
                <div>
                    <span className="legend-box basement-legend" />
                    Basement
                </div>
                <div>
                    <span className="legend-box road-legend" />
                    Road
                </div>
            </div>
            <div className="map-warning">
                ⚠️ This is a conceptual demonstration map only. It is not an
                architectural drawing, structural drawing, approval plan, or
                construction document.
            </div>
        </div>
    );
}
/*
|--------------------------------------------------------------------------
| Demo Floor Plan
|--------------------------------------------------------------------------
*/
function DemoFloorPlan({
    floors,
    plotWidth,
    plotDepth,
    bedrooms,
    bathrooms
}) {
    return (
        <div className="construction-map-wrapper">
            <div className="construction-map-header">
                <div>
                    <h3>🏠 Demo Floor Plan</h3>
                    <p>
                        Conceptual floor arrangement for the selected house.
                    </p>
                </div>
                <div className="map-badge">
                    FLOOR PLAN DEMO
                </div>
            </div>
            <div className="floor-plan-container">
                <div className="floor-plan-title">
                    Ground Floor — {plotWidth} × {plotDepth} ft
                </div>
                <div className="floor-plan">
                    <div className="floor-room entrance-room">
                        <strong>Entrance</strong>
                        <span>Main Entry</span>
                    </div>
                    <div className="floor-room living-plan-room">
                        <strong>Living Room</strong>
                        <span>Family / Guests</span>
                    </div>
                    <div className="floor-room dining-plan-room">
                        <strong>Dining</strong>
                    </div>
                    <div className="floor-room kitchen-plan-room">
                        <strong>Kitchen</strong>
                        <span>Kitchen Area</span>
                    </div>
                    <div className="floor-room bedroom-plan-room">
                        <strong>Bedroom 1</strong>
                        <span>Master</span>
                    </div>
                    <div className="floor-room bedroom-plan-room second-bedroom">
                        <strong>Bedroom 2</strong>
                    </div>
                    {bedrooms >= 3 && (
                        <div className="floor-room bedroom-plan-room third-bedroom">
                            <strong>Bedroom 3</strong>
                        </div>
                    )}
                    <div className="floor-room bathroom-plan-room">
                        <strong>Bath</strong>
                    </div>
                    {bathrooms >= 2 && (
                        <div className="floor-room bathroom-plan-room second-bath">
                            <strong>Bath 2</strong>
                        </div>
                    )}
                    <div className="floor-room stairs-plan-room">
                        <strong>Stairs</strong>
                        <span>Upper Floor</span>
                    </div>
                    <div className="floor-room utility-plan-room">
                        <strong>Utility</strong>
                    </div>
                </div>
            </div>
            <div className="floor-plan-info">
                <div>
                    <strong>Floors:</strong> {floors}
                </div>
                <div>
                    <strong>Bedrooms:</strong> {bedrooms}
                </div>
                <div>
                    <strong>Bathrooms:</strong> {bathrooms}
                </div>
            </div>
            <div className="map-warning">
                ⚠️ Room sizes, walls, columns, stairs, ventilation and structural
                elements are illustrative only. Final floor plans require
                professional design and verification.
            </div>
        </div>
    );
}
/*
|--------------------------------------------------------------------------
| Construction Site Layout
|--------------------------------------------------------------------------
*/
function ConstructionSiteLayout() {
    return (
        <div className="construction-map-wrapper">
            <div className="construction-map-header">
                <div>
                    <h3>🚧 Construction Site Layout</h3>
                    <p>
                        Example arrangement for materials, labor movement and
                        temporary construction facilities.
                    </p>
                </div>
                <div className="map-badge">
                    SITE DEMO
                </div>
            </div>
            <div className="site-layout-map">
                <div className="site-road">
                    🚚 Material Access Road
                </div>
                <div className="site-storage">
                    <strong>Material Storage</strong>
                    <span>Cement / Sand / Crush</span>
                </div>
                <div className="site-steel">
                    <strong>Steel Area</strong>
                    <span>Cutting / Bending</span>
                </div>
                <div className="site-office">
                    <strong>Site Office</strong>
                    <span>Supervisor</span>
                </div>
                <div className="site-house-area">
                    <strong>HOUSE CONSTRUCTION AREA</strong>
                    <div className="site-foundation-box">
                        Foundation / Structure
                    </div>
                </div>
                <div className="site-mixing">
                    <strong>Mixing Area</strong>
                    <span>Concrete / Mortar</span>
                </div>
                <div className="site-safety">
                    🦺 PPE / Safety Zone
                </div>
                <div className="site-waste">
                    ♻️ Waste Area
                </div>
                <div className="site-worker">
                    👷 Worker Rest Area
                </div>
            </div>
            <div className="map-warning">
                ⚠️ Demonstration only. Actual construction-site logistics depend
                on plot access, neighboring properties, safety requirements,
                contractor arrangements and local regulations.
            </div>
        </div>
    );
}
/*
|--------------------------------------------------------------------------
| Main Construction Agent
|--------------------------------------------------------------------------
*/
export default function ConstructionAgent() {
    const [step, setStep] = useState(1);
    const [plotMarla, setPlotMarla] = useState('5');
    const [floors, setFloors] = useState('2');
    const [quality, setQuality] = useState('standard');
    const [constructionType, setConstructionType] = useState('turnkey');
    const [steelGrade, setSteelGrade] = useState('steelGrade60');
    const [sandType, setSandType] = useState('sandChenab');
    const [startDate, setStartDate] = useState(
        () => new Date().toISOString().slice(0, 10)
    );
    const [basement, setBasement] = useState(false);
    /*
    |--------------------------------------------------------------------------
    | Map Settings
    |--------------------------------------------------------------------------
    */
    const [plotWidth, setPlotWidth] = useState('30');
    const [plotDepth, setPlotDepth] = useState('45');
    const [roadSide, setRoadSide] = useState('front');
    const [parking, setParking] = useState(true);
    const [lawn, setLawn] = useState(true);
    const [bedrooms, setBedrooms] = useState('3');
    const [bathrooms, setBathrooms] = useState('3');
    /*
    |--------------------------------------------------------------------------
    | Basic Validation
    |--------------------------------------------------------------------------
    */
    const plotMarlaNum = Number(plotMarla);
    const floorsNum = Number(floors);
    const plotWidthNum = Number(plotWidth);
    const plotDepthNum = Number(plotDepth);
    const bedroomsNum = Number(bedrooms);
    const bathroomsNum = Number(bathrooms);
    const valid =
        Number.isFinite(plotMarlaNum) &&
        plotMarlaNum > 0 &&
        Number.isFinite(floorsNum) &&
        floorsNum >= 1;
    /*
    |--------------------------------------------------------------------------
    | Selected Rates
    |--------------------------------------------------------------------------
    */
    const tier = QUALITY_TIERS[quality];
    const steelRate = MATERIAL_RATES[steelGrade];
    const sandRate = MATERIAL_RATES[sandType];
    /*
    |--------------------------------------------------------------------------
    | Area Calculations
    |--------------------------------------------------------------------------
    */
    const plotSqFt = plotMarlaNum * SQFT_PER_MARLA;
    const coveredAreaPerFloor =
        plotSqFt * COVERED_AREA_RATIO;
    const totalBuiltUpArea =
        coveredAreaPerFloor * floorsNum;
    const basementArea =
        basement ? coveredAreaPerFloor : 0;
    const totalConstructionArea =
        totalBuiltUpArea + basementArea;
    /*
    |--------------------------------------------------------------------------
    | Material Quantities
    |--------------------------------------------------------------------------
    */
    const materialCalculations = useMemo(() => {
        const area = totalConstructionArea;
        const cementBags =
            area * 0.40;
        const steelKg =
            area * tier.steelDensity;
        const bricks =
            area * 13;
        const sandCft =
            area * 0.45;
        const crushCft =
            area * 0.85;
        const bindingWireKg =
            steelKg * 0.012;
        const dpcArea =
            coveredAreaPerFloor;
        const termiteArea =
            coveredAreaPerFloor;
        return {
            cementBags: Math.ceil(cementBags),
            steelKg: Math.round(steelKg),
            bricks: Math.ceil(bricks),
            sandCft: Math.round(sandCft),
            crushCft: Math.round(crushCft),
            bindingWireKg: Math.ceil(bindingWireKg),
            dpcArea,
            termiteArea
        };
    }, [
        totalConstructionArea,
        tier.steelDensity,
        coveredAreaPerFloor
    ]);
    /*
    |--------------------------------------------------------------------------
    | BOQ
    |--------------------------------------------------------------------------
    */
    const boqItems = useMemo(() => {
        const items = [
            {
                description: 'Cement',
                unit: 'bags',
                quantity: materialCalculations.cementBags,
                rate: MATERIAL_RATES.cement
            },
            {
                description: `Steel ${steelGrade === 'steelGrade60' ? 'Grade 60' : 'Grade 40'}`,
                unit: 'kg',
                quantity: materialCalculations.steelKg,
                rate: steelRate
            },
            {
                description: 'Bricks',
                unit: 'nos',
                quantity: materialCalculations.bricks,
                rate: MATERIAL_RATES.bricks
            },
            {
                description:
                    sandType === 'sandChenab'
                        ? 'Chenab Sand'
                        : 'Ravi Sand',
                unit: 'CFT',
                quantity: materialCalculations.sandCft,
                rate: sandRate
            },
            {
                description: 'Crush',
                unit: 'CFT',
                quantity: materialCalculations.crushCft,
                rate: MATERIAL_RATES.crush
            },
            {
                description: 'Binding Wire',
                unit: 'kg',
                quantity: materialCalculations.bindingWireKg,
                rate: MATERIAL_RATES.bindingWire
            },
            {
                description: 'DPC',
                unit: 'sq ft',
                quantity: Math.round(materialCalculations.dpcArea),
                rate: MATERIAL_RATES.dpc
            },
            {
                description: 'Termite Treatment',
                unit: 'sq ft',
                quantity: Math.round(materialCalculations.termiteArea),
                rate: MATERIAL_RATES.termite
            }
        ];
        return items.map(item => ({
            ...item,
            amount: item.quantity * item.rate
        }));
    }, [
        materialCalculations,
        steelGrade,
        steelRate,
        sandType,
        sandRate
    ]);
    const boqTotal = boqItems.reduce(
        (total, item) => total + item.amount,
        0
    );
    /*
    |--------------------------------------------------------------------------
    | Construction Cost
    |--------------------------------------------------------------------------
    */
    const baseConstructionRate =
        constructionType === 'grey'
            ? tier.greyRate
            : tier.turnkeyRate;
    const baseConstructionCost =
        totalBuiltUpArea * baseConstructionRate;
    const basementExtra =
        basementArea * 1000;
    const subtotalCost =
        baseConstructionCost + basementExtra;
    const contingency =
        subtotalCost * 0.07;
    const estimatedTotalCost =
        subtotalCost + contingency;
    /*
    |--------------------------------------------------------------------------
    | Cost Breakdown
    |--------------------------------------------------------------------------
    */
    const costBreakdown = [
        {
            label: 'Structure',
            percentage: 43
        },
        {
            label: 'Finishing',
            percentage: 30
        },
        {
            label: 'Electrical',
            percentage: 8
        },
        {
            label: 'Plumbing',
            percentage: 7
        },
        {
            label: 'Other / Contingency',
            percentage: 12
        }
    ].map(item => ({
        ...item,
        amount:
            estimatedTotalCost *
            (item.percentage / 100)
    }));
    /*
    |--------------------------------------------------------------------------
    | Finishing Estimate
    |--------------------------------------------------------------------------
    */
    const finishingRates =
        FINISHING_RATES[quality];
    const finishingItems = [
        {
            name: 'Flooring',
            rate: finishingRates.flooring
        },
        {
            name: 'Paint',
            rate: finishingRates.paint
        },
        {
            name: 'Doors',
            rate: finishingRates.doors
        },
        {
            name: 'Windows',
            rate: finishingRates.windows
        },
        {
            name: 'Kitchen',
            rate: finishingRates.kitchen
        },
        {
            name: 'Sanitary',
            rate: finishingRates.sanitary
        },
        {
            name: 'Electrical',
            rate: finishingRates.electrical
        },
        {
            name: 'Plumbing',
            rate: finishingRates.plumbing
        },
        {
            name: 'Ceiling',
            rate: finishingRates.ceiling
        }
    ].map(item => ({
        ...item,
        amount:
            totalBuiltUpArea *
            item.rate
    }));
    /*
    |--------------------------------------------------------------------------
    | Labor Estimate
    |--------------------------------------------------------------------------
    */
    const areaScale =
        totalConstructionArea / 1000;
    const labor = [
        {
            name: 'Mason',
            dailyRate: LABOUR_RATES.mason,
            daysPer1000: 45
        },
        {
            name: 'Helper / Laborer',
            dailyRate: LABOUR_RATES.helper,
            daysPer1000: 60
        },
        {
            name: 'Steel Fixer',
            dailyRate: LABOUR_RATES.steelFixer,
            daysPer1000: 18
        },
        {
            name: 'Carpenter',
            dailyRate: LABOUR_RATES.carpenter,
            daysPer1000: 20
        },
        {
            name: 'Electrician',
            dailyRate: LABOUR_RATES.electrician,
            daysPer1000: 12
        },
        {
            name: 'Plumber',
            dailyRate: LABOUR_RATES.plumber,
            daysPer1000: 12
        },
        {
            name: 'Tile Mason',
            dailyRate: LABOUR_RATES.tileMason,
            daysPer1000: 18
        },
        {
            name: 'Painter',
            dailyRate: LABOUR_RATES.painter,
            daysPer1000: 15
        },
        {
            name: 'Welder',
            dailyRate: LABOUR_RATES.welder,
            daysPer1000: 8
        },
        {
            name: 'Aluminium Worker',
            dailyRate: LABOUR_RATES.aluminiumWorker,
            daysPer1000: 8
        }
    ].map(trade => {
        const days = Math.max(
            1,
            Math.round(
                trade.daysPer1000 * areaScale
            )
        );
        return {
            ...trade,
            days,
            cost:
                days *
                trade.dailyRate
        };
    });
    const laborTotal =
        labor.reduce(
            (sum, item) =>
                sum + item.cost,
            0
        );
    /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */
    const timelineScale =
        Math.max(
            0.6,
            totalConstructionArea / 2000
        );
    const timeline = [];
    let timelineCursor =
        startDate
            ? new Date(`${startDate}T00:00:00`)
            : new Date();
    PHASES.forEach(phase => {
        const days =
            Math.max(
                3,
                Math.round(
                    phase.days *
                    timelineScale
                )
            );
        const phaseStart =
            new Date(timelineCursor);
        const phaseEnd =
            addDays(
                phaseStart,
                days - 1
            );
        timeline.push({
            name: phase.name,
            days,
            start: formatDate(phaseStart),
            end: formatDate(phaseEnd)
        });
        timelineCursor =
            addDays(
                phaseStart,
                days
            );
    });
    const totalDays =
        timeline.reduce(
            (sum, phase) =>
                sum + phase.days,
            0
        );
    /*
    |--------------------------------------------------------------------------
    | Risks
    |--------------------------------------------------------------------------
    */
    const risks =
        RISKS
            .map(item => {
                const score =
                    item.likelihood *
                    item.severity;
                return {
                    ...item,
                    score,
                    ...riskLevel(score)
                };
            })
            .sort(
                (a, b) =>
                    b.score - a.score
            );
    /*
    |--------------------------------------------------------------------------
    | Steps
    |--------------------------------------------------------------------------
    */
    const steps = [
        'Requirements',
        'Materials',
        'BOQ',
        'Cost',
        'Finishing',
        'Labour',
        'Timeline',
        'Maps',
        'Risk'
    ];
    return (
        <div className="tool-page construction-agent">
            <h1>
                🏗️ Construction Agent
            </h1>
            <p className="tool-description">
                Plan a residential construction project with
                requirements, material quantities, BOQ, estimated
                cost, finishing, labor, timeline, demo maps and
                construction risks.
                <br />
                <strong>
                    Note:
                </strong>{' '}
                These figures are planning estimates. Actual
                Lahore market rates, quantities and construction
                requirements should be confirmed with a contractor,
                quantity surveyor, architect and structural engineer.
            </p>
            {/* -------------------------------------------------------
                BASIC PROJECT INPUTS
            ------------------------------------------------------- */}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="plot-marla">
                        Plot Size (Marla)
                    </label>
                    <input
                        id="plot-marla"
                        type="number"
                        min="1"
                        value={plotMarla}
                        onChange={e =>
                            setPlotMarla(
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label htmlFor="floors">
                        Number of Floors
                    </label>
                    <input
                        id="floors"
                        type="number"
                        min="1"
                        step="1"
                        value={floors}
                        onChange={e =>
                            setFloors(
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label htmlFor="quality">
                        Construction Quality
                    </label>
                    <select
                        id="quality"
                        value={quality}
                        onChange={e =>
                            setQuality(
                                e.target.value
                            )
                        }
                    >
                        {Object.entries(
                            QUALITY_TIERS
                        ).map(
                            ([key, value]) => (
                                <option
                                    key={key}
                                    value={key}
                                >
                                    {value.label}
                                </option>
                            )
                        )}
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="construction-type">
                        Construction Type
                    </label>
                    <select
                        id="construction-type"
                        value={constructionType}
                        onChange={e =>
                            setConstructionType(
                                e.target.value
                            )
                        }
                    >
                        <option value="grey">
                            Grey Structure
                        </option>
                        <option value="turnkey">
                            Turnkey / Complete
                        </option>
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="steel-grade">
                        Steel Grade
                    </label>
                    <select
                        id="steel-grade"
                        value={steelGrade}
                        onChange={e =>
                            setSteelGrade(
                                e.target.value
                            )
                        }
                    >
                        <option value="steelGrade40">
                            Grade 40
                        </option>
                        <option value="steelGrade60">
                            Grade 60
                        </option>
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="sand-type">
                        Sand Type
                    </label>
                    <select
                        id="sand-type"
                        value={sandType}
                        onChange={e =>
                            setSandType(
                                e.target.value
                            )
                        }
                    >
                        <option value="sandRavi">
                            Ravi Sand
                        </option>
                        <option value="sandChenab">
                            Chenab Sand
                        </option>
                    </select>
                </div>
                <div className="tool-panel">
                    <label htmlFor="start-date">
                        Planned Start Date
                    </label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={e =>
                            setStartDate(
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="tool-panel checkbox-panel">
                    <label>
                        <input
                            type="checkbox"
                            checked={basement}
                            onChange={e =>
                                setBasement(
                                    e.target.checked
                                )
                            }
                        />
                        Include Basement
                    </label>
                </div>
            </div>
            {!valid && (
                <div className="tool-error">
                    <strong>
                        Error:
                    </strong>{' '}
                    Enter a valid plot size and at
                    least one floor.
                </div>
            )}
            {valid && (
                <>
                    {/* -------------------------------------------------------
                        SUMMARY CARDS
                    ------------------------------------------------------- */}
                    <div className="construction-summary-grid">
                        <div className="construction-summary-card">
                            <span>
                                Plot Area
                            </span>
                            <strong>
                                {Math.round(
                                    plotSqFt
                                ).toLocaleString()}
                                {' '}sq ft
                            </strong>
                        </div>
                        <div className="construction-summary-card">
                            <span>
                                Covered / Floor
                            </span>
                            <strong>
                                {Math.round(
                                    coveredAreaPerFloor
                                ).toLocaleString()}
                                {' '}sq ft
                            </strong>
                        </div>
                        <div className="construction-summary-card">
                            <span>
                                Total Built-up
                            </span>
                            <strong>
                                {Math.round(
                                    totalBuiltUpArea
                                ).toLocaleString()}
                                {' '}sq ft
                            </strong>
                        </div>
                        <div className="construction-summary-card">
                            <span>
                                Estimated Cost
                            </span>
                            <strong>
                                {formatCurrency(
                                    estimatedTotalCost
                                )}
                            </strong>
                        </div>
                    </div>
                    {/* -------------------------------------------------------
                        STEP NAVIGATION
                    ------------------------------------------------------- */}
                    <div className="tool-controls construction-step-controls">
                        {steps.map(
                            (name, index) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() =>
                                        setStep(
                                            index + 1
                                        )
                                    }
                                    className={
                                        step === index + 1
                                            ? 'agent-step-active'
                                            : ''
                                    }
                                >
                                    {index + 1}. {name}
                                </button>
                            )
                        )}
                    </div>
                    {/* =======================================================
                        STEP 1 — REQUIREMENTS
                    ======================================================= */}
                    {step === 1 && (
                        <div className="agent-step timestamp-result">
                            <h2>
                                📋 Project Requirements
                            </h2>
                            <div>
                                <strong>
                                    Plot Size:
                                </strong>{' '}
                                {plotMarlaNum} marla
                                {' '}
                                ({Math.round(
                                    plotSqFt
                                ).toLocaleString()} sq ft)
                            </div>
                            <div>
                                <strong>
                                    Floors:
                                </strong>{' '}
                                {floorsNum}
                            </div>
                            <div>
                                <strong>
                                    Covered Area / Floor:
                                </strong>{' '}
                                {Math.round(
                                    coveredAreaPerFloor
                                ).toLocaleString()} sq ft
                            </div>
                            <div>
                                <strong>
                                    Total Built-up Area:
                                </strong>{' '}
                                {Math.round(
                                    totalBuiltUpArea
                                ).toLocaleString()} sq ft
                            </div>
                            <div>
                                <strong>
                                    Basement:
                                </strong>{' '}
                                {basement
                                    ? 'Included'
                                    : 'Not Included'}
                            </div>
                            <div>
                                <strong>
                                    Construction Type:
                                </strong>{' '}
                                {constructionType === 'grey'
                                    ? 'Grey Structure'
                                    : 'Turnkey / Complete'}
                            </div>
                            <div>
                                <strong>
                                    Quality:
                                </strong>{' '}
                                {tier.label}
                            </div>
                            <div>
                                <strong>
                                    Steel:
                                </strong>{' '}
                                {steelGrade === 'steelGrade60'
                                    ? 'Grade 60'
                                    : 'Grade 40'}
                            </div>
                            <div>
                                <strong>
                                    Sand:
                                </strong>{' '}
                                {sandType === 'sandChenab'
                                    ? 'Chenab Sand'
                                    : 'Ravi Sand'}
                            </div>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 2 — MATERIALS
                    ======================================================= */}
                    {step === 2 && (
                        <div className="agent-step regex-groups-wrap">
                            <h2>
                                🧱 Material Requirements
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Material
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th>
                                            Unit
                                        </th>
                                        <th>
                                            Rate
                                        </th>
                                        <th>
                                            Estimated Cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Cement
                                        </td>
                                        <td>
                                            {materialCalculations.cementBags.toLocaleString()}
                                        </td>
                                        <td>
                                            Bags
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                MATERIAL_RATES.cement
                                            )}
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                materialCalculations.cementBags *
                                                MATERIAL_RATES.cement
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Steel
                                        </td>
                                        <td>
                                            {materialCalculations.steelKg.toLocaleString()}
                                        </td>
                                        <td>
                                            kg
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                steelRate
                                            )}
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                materialCalculations.steelKg *
                                                steelRate
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Bricks
                                        </td>
                                        <td>
                                            {materialCalculations.bricks.toLocaleString()}
                                        </td>
                                        <td>
                                            Nos
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                MATERIAL_RATES.bricks
                                            )}
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                materialCalculations.bricks *
                                                MATERIAL_RATES.bricks
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {sandType === 'sandChenab'
                                                ? 'Chenab Sand'
                                                : 'Ravi Sand'}
                                        </td>
                                        <td>
                                            {materialCalculations.sandCft.toLocaleString()}
                                        </td>
                                        <td>
                                            CFT
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                sandRate
                                            )}
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                materialCalculations.sandCft *
                                                sandRate
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Crush
                                        </td>
                                        <td>
                                            {materialCalculations.crushCft.toLocaleString()}
                                        </td>
                                        <td>
                                            CFT
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                MATERIAL_RATES.crush
                                            )}
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                materialCalculations.crushCft *
                                                MATERIAL_RATES.crush
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Binding Wire
                                        </td>
                                        <td>
                                            {materialCalculations.bindingWireKg.toLocaleString()}
                                        </td>
                                        <td>
                                            kg
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                MATERIAL_RATES.bindingWire
                                            )}
                                        </td>
                                        <td>
                                            {formatCurrency(
                                                materialCalculations.bindingWireKg *
                                                MATERIAL_RATES.bindingWire
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 3 — BOQ
                    ======================================================= */}
                    {step === 3 && (
                        <div className="agent-step regex-groups-wrap">
                            <h2>
                                📑 Bill of Quantities
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Unit
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th>
                                            Rate
                                        </th>
                                        <th>
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boqItems.map(
                                        item => (
                                            <tr
                                                key={
                                                    item.description
                                                }
                                            >
                                                <td>
                                                    {item.description}
                                                </td>
                                                <td>
                                                    {item.unit}
                                                </td>
                                                <td>
                                                    {item.quantity.toLocaleString()}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.rate
                                                    )}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.amount
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    <tr>
                                        <td
                                            colSpan="4"
                                        >
                                            <strong>
                                                BOQ Total
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                {formatCurrency(
                                                    boqTotal
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 4 — COST
                    ======================================================= */}
                    {step === 4 && (
                        <div className="agent-step">
                            <h2>
                                💰 Construction Cost Estimate
                            </h2>
                            <div className="timestamp-result">
                                <div>
                                    <strong>
                                        Construction Type:
                                    </strong>{' '}
                                    {constructionType === 'grey'
                                        ? 'Grey Structure'
                                        : 'Turnkey / Complete'}
                                </div>
                                <div>
                                    <strong>
                                        Quality:
                                    </strong>{' '}
                                    {tier.label}
                                </div>
                                <div>
                                    <strong>
                                        Rate:
                                    </strong>{' '}
                                    {formatCurrency(
                                        baseConstructionRate
                                    )}{' '}/sq ft
                                </div>
                                <div>
                                    <strong>
                                        Built-up Area:
                                    </strong>{' '}
                                    {Math.round(
                                        totalBuiltUpArea
                                    ).toLocaleString()} sq ft
                                </div>
                                <div>
                                    <strong>
                                        Base Construction Cost:
                                    </strong>{' '}
                                    {formatCurrency(
                                        baseConstructionCost
                                    )}
                                </div>
                                {basement && (
                                    <div>
                                        <strong>
                                            Basement Extra:
                                        </strong>{' '}
                                        {formatCurrency(
                                            basementExtra
                                        )}
                                    </div>
                                )}
                                <div>
                                    <strong>
                                        Contingency 7%:
                                    </strong>{' '}
                                    {formatCurrency(
                                        contingency
                                    )}
                                </div>
                                <div className="construction-total">
                                    <strong>
                                        Estimated Total:
                                    </strong>{' '}
                                    {formatCurrency(
                                        estimatedTotalCost
                                    )}
                                </div>
                            </div>
                            <h3>
                                Cost Breakdown
                            </h3>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Category
                                        </th>
                                        <th>
                                            Percentage
                                        </th>
                                        <th>
                                            Estimated Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {costBreakdown.map(
                                        item => (
                                            <tr
                                                key={
                                                    item.label
                                                }
                                            >
                                                <td>
                                                    {item.label}
                                                </td>
                                                <td>
                                                    {item.percentage}%
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.amount
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 5 — FINISHING
                    ======================================================= */}
                    {step === 5 && (
                        <div className="agent-step regex-groups-wrap">
                            <h2>
                                🎨 Finishing Estimate
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Item
                                        </th>
                                        <th>
                                            Rate / sq ft
                                        </th>
                                        <th>
                                            Estimated Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finishingItems.map(
                                        item => (
                                            <tr
                                                key={
                                                    item.name
                                                }
                                            >
                                                <td>
                                                    {item.name}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.rate
                                                    )}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.amount
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 6 — LABOUR
                    ======================================================= */}
                    {step === 6 && (
                        <div className="agent-step regex-groups-wrap">
                            <h2>
                                👷 Labour Estimate
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Trade
                                        </th>
                                        <th>
                                            Approx. Days
                                        </th>
                                        <th>
                                            Daily Rate
                                        </th>
                                        <th>
                                            Estimated Cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labor.map(
                                        item => (
                                            <tr
                                                key={
                                                    item.name
                                                }
                                            >
                                                <td>
                                                    {item.name}
                                                </td>
                                                <td>
                                                    {item.days}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.dailyRate
                                                    )}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        item.cost
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    <tr>
                                        <td
                                            colSpan="3"
                                        >
                                            <strong>
                                                Total Labour Cost
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                {formatCurrency(
                                                    laborTotal
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 7 — TIMELINE
                    ======================================================= */}
                    {step === 7 && (
                        <div className="agent-step regex-groups-wrap">
                            <h2>
                                📅 Construction Timeline
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Phase
                                        </th>
                                        <th>
                                            Days
                                        </th>
                                        <th>
                                            Start
                                        </th>
                                        <th>
                                            End
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeline.map(
                                        phase => (
                                            <tr
                                                key={
                                                    phase.name
                                                }
                                            >
                                                <td>
                                                    {phase.name}
                                                </td>
                                                <td>
                                                    {phase.days}
                                                </td>
                                                <td>
                                                    {phase.start}
                                                </td>
                                                <td>
                                                    {phase.end}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            <div className="timestamp-result">
                                <strong>
                                    Total Estimated Duration:
                                </strong>{' '}
                                {totalDays} days
                                {' '}(~{Math.round(
                                    totalDays / 7
                                )} weeks)
                            </div>
                        </div>
                    )}
                    {/* =======================================================
                        STEP 8 — MAPS
                    ======================================================= */}
                    {step === 8 && (
                        <div className="agent-step">
                            <h2>
                                🗺️ Construction Map Generator
                            </h2>
                            <p className="tool-description">
                                Configure the demo layout below and
                                the agent will generate conceptual
                                construction maps.
                            </p>
                            {/* MAP CONTROLS */}
                            <div className="tool-grid map-settings">
                                <div className="tool-panel">
                                    <label>
                                        Plot Width (ft)
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        value={plotWidth}
                                        onChange={e =>
                                            setPlotWidth(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="tool-panel">
                                    <label>
                                        Plot Depth (ft)
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        value={plotDepth}
                                        onChange={e =>
                                            setPlotDepth(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="tool-panel">
                                    <label>
                                        Road Side
                                    </label>
                                    <select
                                        value={roadSide}
                                        onChange={e =>
                                            setRoadSide(
                                                e.target.value
                                            )
                                        }
                                    >
                                        {Object.entries(
                                            ROAD_SIDES
                                        ).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="tool-panel">
                                    <label>
                                        Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="8"
                                        value={bedrooms}
                                        onChange={e =>
                                            setBedrooms(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="tool-panel">
                                    <label>
                                        Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="8"
                                        value={bathrooms}
                                        onChange={e =>
                                            setBathrooms(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="tool-panel checkbox-panel">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={parking}
                                            onChange={e =>
                                                setParking(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        Include Parking
                                    </label>
                                </div>
                                <div className="tool-panel checkbox-panel">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={lawn}
                                            onChange={e =>
                                                setLawn(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        Include Lawn
                                    </label>
                                </div>
                            </div>
                            {/* SITE MAP */}
                            <DemoSiteMap
                                plotWidth={
                                    plotWidthNum
                                }
                                plotDepth={
                                    plotDepthNum
                                }
                                roadSide={
                                    roadSide
                                }
                                parking={
                                    parking
                                }
                                lawn={
                                    lawn
                                }
                                basement={
                                    basement
                                }
                            />
                            {/* FLOOR PLAN */}
                            <DemoFloorPlan
                                floors={
                                    floorsNum
                                }
                                plotWidth={
                                    plotWidthNum
                                }
                                plotDepth={
                                    plotDepthNum
                                }
                                bedrooms={
                                    bedroomsNum
                                }
                                bathrooms={
                                    bathroomsNum
                                }
                            />
                            {/* CONSTRUCTION SITE MAP */}
                            <ConstructionSiteLayout />
                        </div>
                    )}
                    {/* =======================================================
                        STEP 9 — RISK
                    ======================================================= */}
                    {step === 9 && (
                        <div className="agent-step regex-groups-wrap">
                            <h2>
                                ⚠️ Construction Risk Assessment
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Risk
                                        </th>
                                        <th>
                                            Likelihood
                                        </th>
                                        <th>
                                            Severity
                                        </th>
                                        <th>
                                            Score
                                        </th>
                                        <th>
                                            Level
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {risks.map(
                                        risk => (
                                            <tr
                                                key={
                                                    risk.item
                                                }
                                            >
                                                <td>
                                                    {risk.item}
                                                </td>
                                                <td>
                                                    {risk.likelihood}
                                                </td>
                                                <td>
                                                    {risk.severity}
                                                </td>
                                                <td>
                                                    {risk.score}
                                                </td>
                                                <td
                                                    style={{
                                                        color:
                                                            risk.color,
                                                        fontWeight:
                                                            700
                                                    }}
                                                >
                                                    {risk.label}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}