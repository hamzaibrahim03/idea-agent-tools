import { useMemo, useState } from "react";
import { useAiGenerate } from "../lib/useAiGenerate.js";
import OwnKeyPanel from "../components/OwnKeyPanel.jsx";
const AGENT_CONFIG = {
  travel: {
    title: "🌍 Travel Agent",
    description:
      "Create personalized travel plans, itineraries, budgets, activities, transport and accommodation recommendations using AI.",
    fields: [
      { name: "origin", label: "Starting Location", type: "text", placeholder: "e.g. Lahore, Pakistan" },
      { name: "destination", label: "Destination", type: "text", placeholder: "e.g. Istanbul, Türkiye", required: true },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "days", label: "Number of Days", type: "number", min: 1, defaultValue: 5 },
      { name: "adults", label: "Adults", type: "number", min: 1, defaultValue: 1 },
      { name: "children", label: "Children", type: "number", min: 0, defaultValue: 0 },
      { name: "budget", label: "Total Budget", type: "number", min: 0 },
      { name: "currency", label: "Currency", type: "text", defaultValue: "USD" },
      { name: "preferences", label: "Preferences", type: "textarea", placeholder: "Family friendly, nature, photography, local food, shopping..." },
    ],
  },
  construction: {
    title: "🏗️ Construction Agent",
    description:
      "Analyze construction projects, estimate materials, quantities, labor, costs, timelines and project requirements using AI.",
    fields: [
      { name: "projectType", label: "Project Type", type: "text", placeholder: "House, commercial building, road...", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Lahore, Pakistan" },
      { name: "area", label: "Area", type: "number", placeholder: "e.g. 2000" },
      { name: "unit", label: "Area Unit", type: "text", defaultValue: "sq ft" },
      { name: "floors", label: "Floors", type: "number", min: 1, defaultValue: 1 },
      { name: "quality", label: "Construction Quality", type: "text", placeholder: "Economy, standard, premium" },
      { name: "budget", label: "Budget", type: "number" },
      { name: "requirements", label: "Requirements", type: "textarea", placeholder: "Bedrooms, bathrooms, parking, kitchen, materials, special requirements..." },
    ],
  },
  business: {
    title: "💼 Business Agent",
    description:
      "Generate business ideas, market analysis, startup requirements, pricing, expenses, revenue models and growth strategies using AI.",
    fields: [
      { name: "businessIdea", label: "Business Idea", type: "text", placeholder: "Describe your idea" },
      { name: "location", label: "Target Location", type: "text", placeholder: "Lahore, Pakistan / Worldwide" },
      { name: "industry", label: "Industry", type: "text", placeholder: "Technology, food, construction..." },
      { name: "capital", label: "Available Capital", type: "number" },
      { name: "currency", label: "Currency", type: "text", defaultValue: "USD" },
      { name: "experience", label: "Experience / Skills", type: "textarea" },
      { name: "goals", label: "Business Goals", type: "textarea", placeholder: "Monthly income target, growth target, online/offline, employees..." },
    ],
  },
  developer: {
    title: "👨‍💻 Developer Agent",
    description:
      "Generate software architecture, database design, APIs, components, code structure, testing plans and deployment guidance using AI.",
    fields: [
      { name: "project", label: "Project Description", type: "textarea", placeholder: "Describe the application you want to build...", required: true },
      { name: "frontend", label: "Frontend", type: "text", placeholder: "React, Vue, Angular, Next.js..." },
      { name: "backend", label: "Backend", type: "text", placeholder: "Node.js, Laravel, Django..." },
      { name: "database", label: "Database", type: "text", placeholder: "PostgreSQL, MySQL, MongoDB..." },
      { name: "authentication", label: "Authentication", type: "text", placeholder: "JWT, OAuth, session..." },
      { name: "requirements", label: "Additional Requirements", type: "textarea" },
    ],
  },
  marketing: {
    title: "📣 Marketing Agent",
    description:
      "Create AI-powered marketing strategies, campaigns, audiences, content plans, advertising ideas and growth strategies.",
    fields: [
      { name: "product", label: "Product / Service", type: "text", required: true },
      { name: "targetAudience", label: "Target Audience", type: "textarea" },
      { name: "location", label: "Target Market", type: "text" },
      { name: "budget", label: "Marketing Budget", type: "number" },
      { name: "channels", label: "Preferred Channels", type: "text", placeholder: "Facebook, Instagram, Google, TikTok..." },
      { name: "goal", label: "Marketing Goal", type: "text", placeholder: "Sales, leads, awareness, traffic..." },
    ],
  },
  realestate: {
    title: "🏠 Real Estate Agent",
    description:
      "Analyze properties, compare options, estimate pricing and surface requirements for buying, renting or investing using AI.",
    fields: [
      { name: "propertyType", label: "Property Type", type: "text", placeholder: "House, apartment, plot, commercial...", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Lahore, Pakistan" },
      { name: "size", label: "Size", type: "text", placeholder: "e.g. 10 Marla, 1200 sq ft" },
      { name: "budget", label: "Budget", type: "number" },
      { name: "purpose", label: "Purpose", type: "text", placeholder: "Buy, rent, or invest" },
      { name: "requirements", label: "Requirements", type: "textarea", placeholder: "Bedrooms, parking, nearby schools, proximity to work..." },
    ],
  },
  education: {
    title: "🎓 Education Agent",
    description:
      "Create personalized learning paths, study plans, course structures, practice schedules and educational resources using AI.",
    fields: [
      { name: "subject", label: "Subject / Skill", type: "text", required: true },
      { name: "level", label: "Current Level", type: "text", placeholder: "Beginner, intermediate, advanced" },
      { name: "goal", label: "Learning Goal", type: "textarea" },
      { name: "duration", label: "Available Duration", type: "text", placeholder: "3 months" },
      { name: "hoursPerDay", label: "Hours Per Day", type: "number" },
      { name: "preferences", label: "Learning Preferences", type: "textarea" },
    ],
  },
  finance: {
    title: "💰 Finance Agent",
    description:
      "Analyze budgets, expenses, savings goals, cash flow and financial scenarios using AI.",
    fields: [
      { name: "income", label: "Monthly Income", type: "number" },
      { name: "expenses", label: "Monthly Expenses", type: "number" },
      { name: "currency", label: "Currency", type: "text", defaultValue: "USD" },
      { name: "goal", label: "Financial Goal", type: "textarea" },
      { name: "debts", label: "Debts / Loans", type: "textarea" },
      { name: "savings", label: "Current Savings", type: "number" },
    ],
  },
  restaurant: {
    title: "🍽️ Restaurant Agent",
    description:
      "Plan menus, food costs, staffing and startup requirements for a restaurant or food business concept using AI.",
    fields: [
      { name: "restaurantType", label: "Restaurant Type / Cuisine", type: "text", placeholder: "Fast food, fine dining, cafe, cloud kitchen...", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Lahore, Pakistan" },
      { name: "seatingCapacity", label: "Seating Capacity", type: "number" },
      { name: "budget", label: "Budget", type: "number" },
      { name: "menuFocus", label: "Menu Focus", type: "text", placeholder: "Fast food, BBQ, desserts, healthy food..." },
      { name: "requirements", label: "Requirements", type: "textarea", placeholder: "Staff size, delivery, dine-in, target customers..." },
    ],
  },
  vehicle: {
    title: "🚗 Vehicle Agent",
    description:
      "Compare vehicles, estimate ownership costs, plan maintenance schedules and get buying recommendations using AI.",
    fields: [
      { name: "vehicleType", label: "Vehicle Type", type: "text", placeholder: "Sedan, SUV, motorcycle, commercial...", required: true },
      { name: "makeModel", label: "Make / Model (optional)", type: "text", placeholder: "e.g. Toyota Corolla" },
      { name: "ageMileage", label: "Age / Mileage", type: "text", placeholder: "New, or e.g. 5 years / 60,000 km" },
      { name: "usage", label: "Usage", type: "text", placeholder: "Daily commute, family, business, ride-hailing..." },
      { name: "budget", label: "Budget", type: "number" },
      { name: "requirements", label: "Requirements", type: "textarea", placeholder: "Fuel economy, seating, features..." },
    ],
  },
  energy: {
    title: "⚡ Energy Agent",
    description:
      "Analyze electricity usage, size a solar system and estimate savings for your home or business using AI.",
    fields: [
      { name: "propertyType", label: "Property Type", type: "text", placeholder: "House, apartment, shop, office...", required: true },
      { name: "monthlyUnits", label: "Monthly Usage (kWh / units)", type: "number" },
      { name: "location", label: "Location", type: "text", placeholder: "Lahore, Pakistan" },
      { name: "budget", label: "Budget", type: "number" },
      { name: "goal", label: "Goal", type: "text", placeholder: "Reduce bill, go solar, backup power..." },
      { name: "requirements", label: "Requirements", type: "textarea", placeholder: "Roof space, existing appliances, backup needs..." },
    ],
  },
};
function initialValues(config) {
  return config.fields.reduce((result, field) => {
    result[field.name] = field.defaultValue ?? "";
    return result;
  }, {});
}
function formatLabel(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function ResultValue({ value }) {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return (
      <div className="agent-result-list">
        {value.map((item, index) => (
          <div className="agent-result-item" key={index}>
            {typeof item === "object" ? (
              <ResultObject data={item} />
            ) : (
              String(item)
            )}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return <ResultObject data={value} />;
  }
  return <div>{String(value)}</div>;
}
function ResultObject({ data }) {
  return (
    <div className="agent-result-object">
      {Object.entries(data).map(([key, value]) => (
        <div className="agent-result-field" key={key}>
          <strong>{formatLabel(key)}</strong>
          <ResultValue value={value} />
        </div>
      ))}
    </div>
  );
}
export default function AIAgent({ type = "travel" }) {
  const config = AGENT_CONFIG[type] || AGENT_CONFIG.travel;
  const [form, setForm] = useState(() => initialValues(config));
  const ai = useAiGenerate(type, config.title, { kind: "agent" });
  const canGenerate = useMemo(() => {
    return config.fields
      .filter((field) => field.required)
      .every((field) => String(form[field.name] || "").trim());
  }, [config.fields, form]);
  const handleChange = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const generateAgentResult = () => ai.generate(form);
  const resetAgent = () => {
    setForm(initialValues(config));
    ai.reset();
  };
  return (
    <div className="tool-page">
      <h1>{config.title}</h1>
      <p className="tool-description">
        {config.description}
      </p>
      <div className="tool-grid">
        <div className="tool-panel">
          <h2>AI Agent Input</h2>
          <div className="tool-controls">
            {config.fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && " *"}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    rows={4}
                    value={form[field.name]}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                  />
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    value={form[field.name]}
                    min={field.min}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="agent-actions">
            <button
              type="button"
              onClick={generateAgentResult}
              disabled={ai.loading || !canGenerate}
            >
              {ai.loading ? "Generating..." : "✨ Generate with AI"}
            </button>
            <button
              type="button"
              onClick={resetAgent}
              disabled={ai.loading}
            >
              Reset
            </button>
            <button type="button" onClick={() => ai.setShowApiSetup((v) => !v)}>
              {ai.showApiSetup ? "Hide own-key setup" : ai.apiKey ? "Own key (connected)" : "Use my own key (unlimited)"}
            </button>
          </div>
          {ai.showApiSetup && (
            <OwnKeyPanel
              provider={ai.provider}
              updateProvider={ai.updateProvider}
              apiKey={ai.apiKey}
              updateApiKey={ai.updateApiKey}
            />
          )}
          {ai.error && (
            <div className="agent-error">
              {ai.error}
            </div>
          )}
        </div>
        <div className="tool-panel">
          <h2>AI Result</h2>
          {ai.loading && (
            <div className="agent-loading">
              <div>🤖 AI is analyzing your requirements...</div>
              <div>
                Generating recommendations, calculations and plan...
              </div>
            </div>
          )}
          {!ai.loading && !ai.result && (
            <div className="agent-empty">
              Enter your requirements and click
              <strong> Generate with AI</strong>.
            </div>
          )}
          {!ai.loading && ai.result && (
            <div className="agent-result">
              <ResultValue value={ai.result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
