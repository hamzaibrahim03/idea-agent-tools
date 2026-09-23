import React, { useMemo, useState } from "react";
import '../assets/style.css'
/*
|--------------------------------------------------------------------------
| BUSINESS AGENT
|--------------------------------------------------------------------------
| Lahore / Pakistan business planning calculator.
|
| IMPORTANT:
| Rates below are planning estimates, not live quotations.
| Keep them editable and update them when you have verified local rates.
|--------------------------------------------------------------------------
*/
const BUSINESS_TYPES = {
    clothing: {
        label: "Clothing / Garments Store",
        icon: "👕",
        cogsPct: 55,
        defaultMargin: 35,
        equipmentPerSqFt: 450,
        inventoryPerSqFt: 2200,
        renovationPerSqFt: 900,
        staff: [
            { role: "Sales Person", salary: 30000, count: 2 },
            { role: "Cashier", salary: 35000, count: 1 },
        ],
    },
    grocery: {
        label: "Grocery / General Store",
        icon: "🛒",
        cogsPct: 75,
        defaultMargin: 20,
        equipmentPerSqFt: 500,
        inventoryPerSqFt: 3500,
        renovationPerSqFt: 700,
        staff: [
            { role: "Sales Person", salary: 30000, count: 2 },
            { role: "Cashier", salary: 35000, count: 1 },
        ],
    },
    restaurant: {
        label: "Restaurant / Cafe",
        icon: "🍔",
        cogsPct: 35,
        defaultMargin: 45,
        equipmentPerSqFt: 2500,
        inventoryPerSqFt: 1200,
        renovationPerSqFt: 1800,
        staff: [
            { role: "Cook / Chef", salary: 50000, count: 2 },
            { role: "Waiter", salary: 28000, count: 3 },
            { role: "Cashier", salary: 35000, count: 1 },
        ],
    },
    salon: {
        label: "Salon / Beauty Business",
        icon: "💇",
        cogsPct: 25,
        defaultMargin: 55,
        equipmentPerSqFt: 1200,
        inventoryPerSqFt: 500,
        renovationPerSqFt: 1500,
        staff: [
            { role: "Beautician", salary: 35000, count: 2 },
            { role: "Helper", salary: 28000, count: 1 },
        ],
    },
    mobile: {
        label: "Mobile / Accessories Shop",
        icon: "📱",
        cogsPct: 70,
        defaultMargin: 25,
        equipmentPerSqFt: 500,
        inventoryPerSqFt: 4500,
        renovationPerSqFt: 800,
        staff: [
            { role: "Sales Person", salary: 35000, count: 1 },
        ],
    },
    pharmacy: {
        label: "Pharmacy / Medical Store",
        icon: "💊",
        cogsPct: 80,
        defaultMargin: 18,
        equipmentPerSqFt: 800,
        inventoryPerSqFt: 5000,
        renovationPerSqFt: 900,
        staff: [
            { role: "Sales Person", salary: 35000, count: 2 },
        ],
    },
    printing: {
        label: "Printing / Photocopy Shop",
        icon: "🖨️",
        cogsPct: 35,
        defaultMargin: 45,
        equipmentPerSqFt: 2200,
        inventoryPerSqFt: 600,
        renovationPerSqFt: 700,
        staff: [
            { role: "Operator", salary: 35000, count: 1 },
        ],
    },
    construction: {
        label: "Construction / Contractor",
        icon: "🏗️",
        cogsPct: 65,
        defaultMargin: 25,
        equipmentPerSqFt: 300,
        inventoryPerSqFt: 500,
        renovationPerSqFt: 0,
        staff: [
            { role: "Supervisor", salary: 50000, count: 1 },
            { role: "Helper", salary: 30000, count: 2 },
        ],
    },
    ecommerce: {
        label: "Online / E-commerce Store",
        icon: "🛍️",
        cogsPct: 50,
        defaultMargin: 40,
        equipmentPerSqFt: 300,
        inventoryPerSqFt: 2500,
        renovationPerSqFt: 300,
        staff: [
            { role: "Order / Customer Support", salary: 30000, count: 1 },
        ],
    },
    custom: {
        label: "Other Business",
        icon: "💼",
        cogsPct: 50,
        defaultMargin: 35,
        equipmentPerSqFt: 500,
        inventoryPerSqFt: 1500,
        renovationPerSqFt: 500,
        staff: [],
    },
};
/*
|--------------------------------------------------------------------------
| Lahore areas
|--------------------------------------------------------------------------
*/
const LAHORE_AREAS = {
    gulberg: {
        label: "Gulberg",
        rentPerSqFt: 250,
        securityMonths: 6,
    },
    dha: {
        label: "DHA",
        rentPerSqFt: 220,
        securityMonths: 6,
    },
    joharTown: {
        label: "Johar Town",
        rentPerSqFt: 160,
        securityMonths: 4,
    },
    modelTown: {
        label: "Model Town",
        rentPerSqFt: 170,
        securityMonths: 4,
    },
    faisalTown: {
        label: "Faisal Town",
        rentPerSqFt: 150,
        securityMonths: 4,
    },
    gardenTown: {
        label: "Garden Town",
        rentPerSqFt: 150,
        securityMonths: 4,
    },
    wapdaTown: {
        label: "Wapda Town",
        rentPerSqFt: 130,
        securityMonths: 4,
    },
    bahriaTown: {
        label: "Bahria Town",
        rentPerSqFt: 140,
        securityMonths: 4,
    },
    raiwindRoad: {
        label: "Raiwind Road",
        rentPerSqFt: 110,
        securityMonths: 3,
    },
};
/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/
const money = (value) =>
    `Rs. ${Math.round(Number(value) || 0).toLocaleString("en-PK")}`;
const number = (value) => Number(value) || 0;
function calculateMonthlyStaffCost(staff) {
    return staff.reduce(
        (total, employee) =>
            total + number(employee.salary) * number(employee.count),
        0
    );
}
/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/
export default function BusinessAgent() {
    const [step, setStep] = useState(1);
    const [businessType, setBusinessType] = useState("clothing");
    const [area, setArea] = useState("joharTown");
    const [capital, setCapital] = useState(1000000);
    const [shopSize, setShopSize] = useState(500);
    const [targetMargin, setTargetMargin] = useState(35);
    const [monthlySales, setMonthlySales] = useState(500000);
    const [marketingBudget, setMarketingBudget] = useState(50000);
    const [otherExpenses, setOtherExpenses] = useState(15000);
    const [customRent, setCustomRent] = useState("");
    const [showAssumptions, setShowAssumptions] = useState(false);
    const type = BUSINESS_TYPES[businessType];
    const location = LAHORE_AREAS[area];
    /*
    |--------------------------------------------------------------------------
    | Calculations
    |--------------------------------------------------------------------------
    */
    const calculations = useMemo(() => {
        const size = number(shopSize);
        const capitalAmount = number(capital);
        const rent =
            customRent !== ""
                ? number(customRent)
                : size * number(location.rentPerSqFt);
        const securityDeposit = rent * number(location.securityMonths);
        const renovation =
            size * number(type.renovationPerSqFt);
        const equipment =
            size * number(type.equipmentPerSqFt);
        const inventory =
            size * number(type.inventoryPerSqFt);
        const registration = 25000;
        const initialMarketing = number(marketingBudget);
        const emergencyReserve =
            Math.max(
                0,
                capitalAmount -
                (
                    securityDeposit +
                    renovation +
                    equipment +
                    inventory +
                    registration +
                    initialMarketing
                )
            );
        const startupCost =
            securityDeposit +
            renovation +
            equipment +
            inventory +
            registration +
            initialMarketing;
        const staffCost =
            calculateMonthlyStaffCost(type.staff);
        const utilities =
            businessType === "restaurant"
                ? 50000
                : businessType === "printing"
                    ? 30000
                    : 20000;
        const monthlyFixedExpenses =
            rent +
            staffCost +
            utilities +
            number(otherExpenses) +
            number(marketingBudget);
        const sales = number(monthlySales);
        const cogs =
            sales * (number(type.cogsPct) / 100);
        const grossProfit =
            sales - cogs;
        const netProfit =
            grossProfit - monthlyFixedExpenses;
        const actualMargin =
            sales > 0
                ? (netProfit / sales) * 100
                : 0;
        const contributionMargin =
            1 - number(type.cogsPct) / 100;
        const breakEven =
            contributionMargin > 0
                ? monthlyFixedExpenses / contributionMargin
                : 0;
        const targetMarginFraction =
            number(targetMargin) / 100;
        const targetRevenueDenominator =
            contributionMargin - targetMarginFraction;
        const requiredRevenue =
            targetRevenueDenominator > 0
                ? monthlyFixedExpenses / targetRevenueDenominator
                : null;
        const monthsToRecover =
            netProfit > 0
                ? startupCost / netProfit
                : null;
        const yearlyRevenue =
            sales * 12;
        const yearlyNetProfit =
            netProfit * 12;
        const priceFor1000Cost =
            targetMarginFraction < 1
                ? 1000 / (1 - targetMarginFraction)
                : null;
        const marketing = {
            social:
                initialMarketing * 0.35,
            google:
                initialMarketing * 0.20,
            influencers:
                initialMarketing * 0.15,
            offline:
                initialMarketing * 0.15,
            launch:
                initialMarketing * 0.15,
        };
        return {
            rent,
            securityDeposit,
            renovation,
            equipment,
            inventory,
            registration,
            initialMarketing,
            emergencyReserve,
            startupCost,
            staffCost,
            utilities,
            monthlyFixedExpenses,
            sales,
            cogs,
            grossProfit,
            netProfit,
            actualMargin,
            breakEven,
            requiredRevenue,
            monthsToRecover,
            yearlyRevenue,
            yearlyNetProfit,
            priceFor1000Cost,
            marketing,
        };
    }, [
        area,
        businessType,
        capital,
        shopSize,
        targetMargin,
        monthlySales,
        marketingBudget,
        otherExpenses,
        customRent,
        type,
        location,
    ]);
    /*
    |--------------------------------------------------------------------------
    | 12 month projection
    |--------------------------------------------------------------------------
    */
    const projection = useMemo(() => {
        const rows = [];
        for (let month = 1; month <= 12; month++) {
            const growth = Math.pow(1.03, month - 1);
            const revenue =
                calculations.sales * growth;
            const cogs =
                revenue * (type.cogsPct / 100);
            const profit =
                revenue -
                cogs -
                calculations.monthlyFixedExpenses;
            rows.push({
                month,
                revenue,
                profit,
            });
        }
        return rows;
    }, [
        calculations.sales,
        calculations.monthlyFixedExpenses,
        type.cogsPct,
    ]);
    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */
    const valid =
        number(capital) > 0 &&
        number(shopSize) > 0 &&
        number(targetMargin) > 0 &&
        number(targetMargin) < 100 &&
        number(monthlySales) >= 0;
    /*
    |--------------------------------------------------------------------------
    | Steps
    |--------------------------------------------------------------------------
    */
    const steps = [
        "Business",
        "Location",
        "Startup Cost",
        "Monthly Expenses",
        "Revenue & Profit",
        "Break-even",
        "Marketing",
        "Projection",
        "Map",
    ];
    return (
        <div className="tool-page business-agent">
            {/* HEADER */}
            <div className="agent-header">
                <div>
                    <h1>
                        💼 Business Agent
                    </h1>
                    <p className="tool-description">
                        Plan and estimate the startup and monthly operating
                        requirements of a business in Lahore, Pakistan.
                    </p>
                </div>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        setShowAssumptions(!showAssumptions)
                    }
                >
                    ⚙ Assumptions
                </button>
            </div>
            {/* ASSUMPTION NOTICE */}
            <div className="agent-notice">
                <strong>Planning estimate:</strong>
                <span>
                    The figures used by this calculator are editable
                    planning estimates. Actual Lahore rents, salaries,
                    supplier prices, utility bills, taxes and licensing
                    costs can vary by location and business.
                </span>
            </div>
            {/* ASSUMPTIONS */}
            {showAssumptions && (
                <div className="agent-assumptions">
                    <h3>
                        Current assumptions
                    </h3>
                    <ul>
                        <li>
                            Rent is estimated using selected area and shop size.
                        </li>
                        <li>
                            Security deposit is estimated using the area's
                            assumed number of months.
                        </li>
                        <li>
                            COGS is based on the selected business type.
                        </li>
                        <li>
                            Salaries are editable in the source data.
                        </li>
                        <li>
                            Electricity and utilities are planning estimates.
                        </li>
                        <li>
                            Marketing is included in monthly operating expenses.
                        </li>
                    </ul>
                </div>
            )}
            {/* INPUTS */}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label>
                        Business type
                    </label>
                    <select
                        value={businessType}
                        onChange={(e) => {
                            const value = e.target.value;
                            setBusinessType(value);
                            setTargetMargin(
                                BUSINESS_TYPES[value].defaultMargin
                            );
                        }}
                    >
                        {Object.entries(BUSINESS_TYPES).map(
                            ([key, item]) => (
                                <option
                                    key={key}
                                    value={key}
                                >
                                    {item.icon} {item.label}
                                </option>
                            )
                        )}
                    </select>
                </div>
                <div className="tool-panel">
                    <label>
                        Lahore area
                    </label>
                    <select
                        value={area}
                        onChange={(e) =>
                            setArea(e.target.value)
                        }
                    >
                        {Object.entries(LAHORE_AREAS).map(
                            ([key, item]) => (
                                <option
                                    key={key}
                                    value={key}
                                >
                                    {item.label}
                                </option>
                            )
                        )}
                    </select>
                </div>
                <div className="tool-panel">
                    <label>
                        Starting capital
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={capital}
                        onChange={(e) =>
                            setCapital(e.target.value)
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label>
                        Shop / workspace size (sq. ft.)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={shopSize}
                        onChange={(e) =>
                            setShopSize(e.target.value)
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label>
                        Target net margin (%)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="99"
                        value={targetMargin}
                        onChange={(e) =>
                            setTargetMargin(e.target.value)
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label>
                        Expected monthly sales
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={monthlySales}
                        onChange={(e) =>
                            setMonthlySales(e.target.value)
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label>
                        Monthly marketing budget
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={marketingBudget}
                        onChange={(e) =>
                            setMarketingBudget(e.target.value)
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label>
                        Other monthly expenses
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={otherExpenses}
                        onChange={(e) =>
                            setOtherExpenses(e.target.value)
                        }
                    />
                </div>
            </div>
            {/* CUSTOM RENT */}
            <div className="tool-panel custom-rent">
                <label>
                    Actual monthly rent
                    <small>
                        Optional — leave empty to use estimated area rate
                    </small>
                </label>
                <input
                    type="number"
                    min="0"
                    placeholder={money(calculations.rent)}
                    value={customRent}
                    onChange={(e) =>
                        setCustomRent(e.target.value)
                    }
                />
            </div>
            {!valid && (
                <div className="tool-error">
                    <strong>Check your inputs.</strong>
                    <p>
                        Capital and shop size must be greater than zero,
                        target margin must be between 1% and 99%, and
                        monthly sales cannot be negative.
                    </p>
                </div>
            )}
            {valid && (
                <>
                    {/* NAVIGATION */}
                    <div className="tool-controls">
                        {steps.map((item, index) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    setStep(index + 1)
                                }
                                className={
                                    step === index + 1
                                        ? "agent-step-active"
                                        : ""
                                }
                            >
                                {index + 1}. {item}
                            </button>
                        ))}
                    </div>
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="agent-step">
                            <h2>
                                {type.icon} Business Overview
                            </h2>
                            <div className="agent-cards">
                                <div>
                                    <span>Business</span>
                                    <strong>
                                        {type.label}
                                    </strong>
                                </div>
                                <div>
                                    <span>Location</span>
                                    <strong>
                                        {location.label}
                                    </strong>
                                </div>
                                <div>
                                    <span>Capital</span>
                                    <strong>
                                        {money(capital)}
                                    </strong>
                                </div>
                                <div>
                                    <span>Shop size</span>
                                    <strong>
                                        {number(shopSize).toLocaleString()} sq. ft.
                                    </strong>
                                </div>
                            </div>
                            <div className="agent-summary">
                                <p>
                                    <strong>Estimated COGS:</strong>{" "}
                                    {type.cogsPct}% of sales
                                </p>
                                <p>
                                    <strong>Target margin:</strong>{" "}
                                    {targetMargin}%
                                </p>
                                <p>
                                    <strong>Estimated rent:</strong>{" "}
                                    {money(calculations.rent)}
                                </p>
                            </div>
                        </div>
                    )}
                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="agent-step">
                            <h2>
                                📍 Location Analysis
                            </h2>
                            <div className="agent-cards">
                                <div>
                                    <span>Area</span>
                                    <strong>
                                        {location.label}
                                    </strong>
                                </div>
                                <div>
                                    <span>Estimated rent / sq. ft.</span>
                                    <strong>
                                        {money(location.rentPerSqFt)}
                                    </strong>
                                </div>
                                <div>
                                    <span>Shop size</span>
                                    <strong>
                                        {shopSize} sq. ft.
                                    </strong>
                                </div>
                                <div>
                                    <span>Estimated monthly rent</span>
                                    <strong>
                                        {money(calculations.rent)}
                                    </strong>
                                </div>
                            </div>
                            <p>
                                The rent figure is a planning estimate.
                                A real commercial property can differ
                                substantially based on road, frontage,
                                floor, parking, building condition and
                                commercial activity.
                            </p>
                        </div>
                    )}
                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="agent-step">
                            <h2>
                                🏗️ Startup Cost
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Estimated Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Security deposit
                                        </td>
                                        <td>
                                            {money(
                                                calculations.securityDeposit
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Renovation / interior
                                        </td>
                                        <td>
                                            {money(
                                                calculations.renovation
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Equipment
                                        </td>
                                        <td>
                                            {money(
                                                calculations.equipment
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Initial inventory
                                        </td>
                                        <td>
                                            {money(
                                                calculations.inventory
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Registration / setup
                                        </td>
                                        <td>
                                            {money(
                                                calculations.registration
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Initial marketing
                                        </td>
                                        <td>
                                            {money(
                                                calculations.initialMarketing
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>
                                                Estimated startup cost
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                {money(
                                                    calculations.startupCost
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Capital remaining
                                        </td>
                                        <td>
                                            {money(
                                                number(capital) -
                                                calculations.startupCost
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {calculations.startupCost >
                                number(capital) && (
                                    <div className="tool-error">
                                        Startup requirements exceed
                                        the available capital by{" "}
                                        {money(
                                            calculations.startupCost -
                                            number(capital)
                                        )}
                                    </div>
                                )}
                        </div>
                    )}
                    {/* STEP 4 */}
                    {step === 4 && (
                        <div className="agent-step">
                            <h2>
                                📋 Monthly Expenses
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>Expense</th>
                                        <th>Monthly</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Rent
                                        </td>
                                        <td>
                                            {money(
                                                calculations.rent
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Staff salaries
                                        </td>
                                        <td>
                                            {money(
                                                calculations.staffCost
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Utilities
                                        </td>
                                        <td>
                                            {money(
                                                calculations.utilities
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Marketing
                                        </td>
                                        <td>
                                            {money(
                                                marketingBudget
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Other expenses
                                        </td>
                                        <td>
                                            {money(
                                                otherExpenses
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>
                                                Total fixed monthly expenses
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                {money(
                                                    calculations.monthlyFixedExpenses
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* STEP 5 */}
                    {step === 5 && (
                        <div className="agent-step">
                            <h2>
                                📊 Revenue & Profit
                            </h2>
                            <div className="agent-cards">
                                <div>
                                    <span>
                                        Monthly Sales
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.sales
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        COGS
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.cogs
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Gross Profit
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.grossProfit
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Net Profit
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.netProfit
                                        )}
                                    </strong>
                                </div>
                            </div>
                            <div className="agent-summary">
                                <p>
                                    <strong>
                                        Actual estimated net margin:
                                    </strong>{" "}
                                    {calculations.actualMargin.toFixed(1)}%
                                </p>
                                <p>
                                    <strong>
                                        Target margin:
                                    </strong>{" "}
                                    {targetMargin}%
                                </p>
                                {calculations.priceFor1000Cost && (
                                    <p>
                                        An item costing{" "}
                                        <strong>
                                            Rs. 1,000
                                        </strong>{" "}
                                        would need to sell for approximately{" "}
                                        <strong>
                                            {money(
                                                calculations.priceFor1000Cost
                                            )}
                                        </strong>{" "}
                                        to achieve a {targetMargin}% gross
                                        margin before other expenses.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    {/* STEP 6 */}
                    {step === 6 && (
                        <div className="agent-step">
                            <h2>
                                ⚖️ Break-even Analysis
                            </h2>
                            <div className="agent-cards">
                                <div>
                                    <span>
                                        Monthly break-even sales
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.breakEven
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Target-margin revenue
                                    </span>
                                    <strong>
                                        {calculations.requiredRevenue
                                            ? money(
                                                calculations.requiredRevenue
                                            )
                                            : "Not achievable"}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Estimated monthly profit
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.netProfit
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Startup recovery
                                    </span>
                                    <strong>
                                        {calculations.monthsToRecover
                                            ? `${calculations.monthsToRecover.toFixed(1)} months`
                                            : "Not profitable"}
                                    </strong>
                                </div>
                            </div>
                            {calculations.netProfit <= 0 && (
                                <div className="tool-error">
                                    Current sales assumptions produce
                                    a non-positive monthly profit.
                                    Increase revenue, reduce expenses,
                                    or review the business model.
                                </div>
                            )}
                        </div>
                    )}
                    {/* STEP 7 */}
                    {step === 7 && (
                        <div className="agent-step">
                            <h2>
                                📣 Marketing Plan
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>Channel</th>
                                        <th>%</th>
                                        <th>Budget</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Social Media
                                        </td>
                                        <td>
                                            35%
                                        </td>
                                        <td>
                                            {money(
                                                calculations.marketing.social
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Google / Search
                                        </td>
                                        <td>
                                            20%
                                        </td>
                                        <td>
                                            {money(
                                                calculations.marketing.google
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Influencers / Referrals
                                        </td>
                                        <td>
                                            15%
                                        </td>
                                        <td>
                                            {money(
                                                calculations.marketing.influencers
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Local / Offline
                                        </td>
                                        <td>
                                            15%
                                        </td>
                                        <td>
                                            {money(
                                                calculations.marketing.offline
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Launch / Promotions
                                        </td>
                                        <td>
                                            15%
                                        </td>
                                        <td>
                                            {money(
                                                calculations.marketing.launch
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>
                                                Total
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                100%
                                            </strong>
                                        </td>
                                        <td>
                                            <strong>
                                                {money(
                                                    marketingBudget
                                                )}
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* STEP 8 */}
                    {step === 8 && (
                        <div className="agent-step">
                            <h2>
                                📈 12-Month Projection
                            </h2>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Month
                                        </th>
                                        <th>
                                            Revenue
                                        </th>
                                        <th>
                                            Estimated Profit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projection.map(
                                        (row) => (
                                            <tr
                                                key={row.month}
                                            >
                                                <td>
                                                    Month {row.month}
                                                </td>
                                                <td>
                                                    {money(
                                                        row.revenue
                                                    )}
                                                </td>
                                                <td>
                                                    {money(
                                                        row.profit
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            <div className="agent-cards">
                                <div>
                                    <span>
                                        Year 1 revenue
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.yearlyRevenue
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Year 1 estimated profit
                                    </span>
                                    <strong>
                                        {money(
                                            calculations.yearlyNetProfit
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* STEP 9 */}
                    {step === 9 && (
                        <div className="agent-step">
                            <h2>
                                🗺️ Business Location Map
                            </h2>
                            <div className="demo-map">
                                <div className="map-grid">
                                    <div className="map-road road-1" />
                                    <div className="map-road road-2" />
                                    <div className="map-road road-3" />
                                    <div className="map-area area-gulberg">
                                        Gulberg
                                    </div>
                                    <div className="map-area area-dha">
                                        DHA
                                    </div>
                                    <div className="map-area area-johar">
                                        Johar Town
                                    </div>
                                    <div className="map-area area-model">
                                        Model Town
                                    </div>
                                    <div className="map-area area-faisal">
                                        Faisal Town
                                    </div>
                                    <div className="map-marker">
                                        📍
                                    </div>
                                </div>
                            </div>
                            <div className="map-info">
                                <strong>
                                    Selected location:
                                </strong>{" "}
                                {location.label}
                                <p>
                                    This is a demonstration map for the
                                    Business Agent. For production, replace
                                    this section with Google Maps, Mapbox,
                                    OpenStreetMap/Leaflet, or another map
                                    provider.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}