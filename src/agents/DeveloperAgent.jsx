import { useMemo, useState } from "react";
/*
|--------------------------------------------------------------------------
| GLOBAL DEVELOPER AGENT
|--------------------------------------------------------------------------
| A browser-based software project planning assistant.
|
| It generates:
| - Requirements
| - Features
| - Architecture
| - Frontend stack
| - Backend stack
| - Database
| - API plan
| - Authentication
| - Security
| - Folder structure
| - Starter code
| - Testing
| - Deployment
| - Development roadmap
|
| NOTE:
| This is a planning/template agent. It does not claim to provide
| live pricing, live cloud costs, or production-ready architecture.
|--------------------------------------------------------------------------
*/
const PROJECT_TYPES = {
    web: {
        label: "Web Application",
        icon: "🌐",
        features: [
            "Responsive web interface",
            "Authentication",
            "Dashboard",
            "API integration",
            "Database",
            "Role-based access",
            "Search and filtering",
            "Notifications",
        ],
    },
    ecommerce: {
        label: "E-commerce Platform",
        icon: "🛒",
        features: [
            "Product catalog",
            "Product search",
            "Shopping cart",
            "Checkout",
            "Payment integration",
            "Order management",
            "Customer accounts",
            "Admin dashboard",
            "Inventory management",
        ],
    },
    saas: {
        label: "SaaS Application",
        icon: "☁️",
        features: [
            "Landing page",
            "Authentication",
            "User onboarding",
            "Dashboard",
            "Subscription management",
            "Team management",
            "Billing",
            "Usage limits",
            "Notifications",
        ],
    },
    mobile: {
        label: "Mobile Application",
        icon: "📱",
        features: [
            "Mobile UI",
            "Authentication",
            "Push notifications",
            "API integration",
            "Offline handling",
            "User profile",
            "App settings",
            "Analytics",
        ],
    },
    social: {
        label: "Social Media / Community",
        icon: "👥",
        features: [
            "User profiles",
            "Posts",
            "Comments",
            "Likes",
            "Following",
            "Notifications",
            "Messaging",
            "Search",
            "Moderation",
        ],
    },
    dashboard: {
        label: "Admin / Analytics Dashboard",
        icon: "📊",
        features: [
            "Dashboard",
            "KPI cards",
            "Charts",
            "Data tables",
            "Filters",
            "Search",
            "CRUD operations",
            "User management",
            "Reports",
        ],
    },
    ai: {
        label: "AI / AI-Powered Application",
        icon: "🤖",
        features: [
            "AI interface",
            "Prompt handling",
            "AI API integration",
            "Conversation history",
            "File upload",
            "Usage tracking",
            "Authentication",
            "AI response streaming",
        ],
    },
    marketplace: {
        label: "Marketplace",
        icon: "🏪",
        features: [
            "Buyer accounts",
            "Seller accounts",
            "Listings",
            "Search",
            "Messaging",
            "Reviews",
            "Orders",
            "Payments",
            "Admin moderation",
        ],
    },
    booking: {
        label: "Booking / Reservation System",
        icon: "📅",
        features: [
            "Availability calendar",
            "Booking creation",
            "Booking cancellation",
            "User accounts",
            "Notifications",
            "Payments",
            "Admin management",
            "Reports",
        ],
    },
    custom: {
        label: "Custom Software Project",
        icon: "💻",
        features: [
            "User interface",
            "Authentication",
            "API integration",
            "Database",
            "Dashboard",
            "Administration",
        ],
    },
};
const FRONTENDS = {
    react: {
        label: "React",
        language: "JavaScript / TypeScript",
        type: "Frontend",
    },
    nextjs: {
        label: "Next.js",
        language: "JavaScript / TypeScript",
        type: "Full-stack React framework",
    },
    vue: {
        label: "Vue.js",
        language: "JavaScript / TypeScript",
        type: "Frontend",
    },
    angular: {
        label: "Angular",
        language: "TypeScript",
        type: "Frontend",
    },
    svelte: {
        label: "Svelte / SvelteKit",
        language: "JavaScript / TypeScript",
        type: "Frontend / Full-stack",
    },
    html: {
        label: "HTML / CSS / JavaScript",
        language: "JavaScript",
        type: "Frontend",
    },
    flutter: {
        label: "Flutter",
        language: "Dart",
        type: "Cross-platform mobile",
    },
    reactnative: {
        label: "React Native",
        language: "JavaScript / TypeScript",
        type: "Cross-platform mobile",
    },
};
const BACKENDS = {
    node: {
        label: "Node.js",
        language: "JavaScript / TypeScript",
        frameworks: "Express / Fastify / NestJS",
    },
    python: {
        label: "Python",
        language: "Python",
        frameworks: "Django / FastAPI / Flask",
    },
    php: {
        label: "PHP",
        language: "PHP",
        frameworks: "Laravel / Symfony",
    },
    java: {
        label: "Java",
        language: "Java",
        frameworks: "Spring Boot",
    },
    dotnet: {
        label: ".NET",
        language: "C#",
        frameworks: "ASP.NET Core",
    },
    go: {
        label: "Go",
        language: "Go",
        frameworks: "Gin / Fiber / Echo",
    },
    ruby: {
        label: "Ruby",
        language: "Ruby",
        frameworks: "Ruby on Rails",
    },
    none: {
        label: "No dedicated backend",
        language: "N/A",
        frameworks: "Static / frontend-only",
    },
};
const DATABASES = {
    postgresql: {
        label: "PostgreSQL",
        type: "Relational SQL",
    },
    mysql: {
        label: "MySQL",
        type: "Relational SQL",
    },
    mongodb: {
        label: "MongoDB",
        type: "Document database",
    },
    sqlite: {
        label: "SQLite",
        type: "Embedded relational database",
    },
    firebase: {
        label: "Firebase",
        type: "Backend-as-a-service",
    },
    supabase: {
        label: "Supabase",
        type: "PostgreSQL-based backend platform",
    },
    none: {
        label: "No database",
        type: "Static / external API",
    },
};
const AUTH_OPTIONS = {
    jwt: {
        label: "JWT Authentication",
        tables: ["users", "refresh_tokens"],
    },
    session: {
        label: "Server-side Sessions",
        tables: ["users", "sessions"],
    },
    oauth: {
        label: "OAuth / Social Login",
        tables: ["users", "oauth_accounts"],
    },
    firebase: {
        label: "Firebase Authentication",
        tables: ["users"],
    },
    supabase: {
        label: "Supabase Authentication",
        tables: ["users"],
    },
    none: {
        label: "No Authentication",
        tables: [],
    },
};
const CLOUD_PROVIDERS = {
    aws: {
        label: "AWS",
        services: "EC2 / S3 / RDS / CloudFront / Lambda",
    },
    azure: {
        label: "Microsoft Azure",
        services: "App Service / Blob Storage / SQL / Functions",
    },
    gcp: {
        label: "Google Cloud",
        services: "Cloud Run / Cloud Storage / Cloud SQL / Functions",
    },
    vercel: {
        label: "Vercel",
        services: "Web deployment / Functions / CDN",
    },
    netlify: {
        label: "Netlify",
        services: "Web deployment / Functions / CDN",
    },
    digitalocean: {
        label: "DigitalOcean",
        services: "Droplets / Managed Database / Spaces",
    },
    cloudflare: {
        label: "Cloudflare",
        services: "Pages / Workers / R2 / CDN",
    },
    none: {
        label: "Local / Self-managed",
        services: "Custom hosting",
    },
};
const API_STYLES = {
    rest: {
        label: "REST API",
    },
    graphql: {
        label: "GraphQL",
    },
    trpc: {
        label: "tRPC",
    },
    grpc: {
        label: "gRPC",
    },
    none: {
        label: "No API",
    },
};
const TESTING = [
    "Unit tests",
    "Component tests",
    "Integration tests",
    "API tests",
    "Authentication tests",
    "End-to-end tests",
    "Validation and error handling",
    "Responsive testing",
    "Accessibility testing",
    "Cross-browser testing",
    "Performance testing",
];
const SECURITY = [
    "HTTPS",
    "Secure authentication",
    "Password hashing",
    "Input validation",
    "Authorization checks",
    "Rate limiting",
    "CORS configuration",
    "CSRF protection where applicable",
    "XSS protection",
    "SQL/NoSQL injection protection",
    "Secure environment variables",
    "Dependency vulnerability scanning",
    "Logging and monitoring",
];
const DEVOPS = [
    "Git repository",
    "Development / staging / production environments",
    "Environment variables",
    "Automated testing",
    "CI pipeline",
    "Build pipeline",
    "Deployment process",
    "Database migration strategy",
    "Logging",
    "Error monitoring",
    "Backup strategy",
    "Rollback strategy",
];
const getSafeName = (name) => {
    const cleaned = name
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (!cleaned.length) {
        return "MyApp";
    }
    return cleaned
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join("");
};
export default function DeveloperAgent() {
    const [step, setStep] = useState(1);
    const [appName, setAppName] = useState("My App");
    const [projectType, setProjectType] = useState("web");
    const [frontend, setFrontend] = useState("react");
    const [backend, setBackend] = useState("node");
    const [database, setDatabase] = useState("postgresql");
    const [auth, setAuth] = useState("jwt");
    const [apiStyle, setApiStyle] = useState("rest");
    const [cloud, setCloud] = useState("vercel");
    const [language, setLanguage] = useState("typescript");
    const [includePayments, setIncludePayments] = useState(false);
    const [includeMaps, setIncludeMaps] = useState(false);
    const [includeEmail, setIncludeEmail] = useState(false);
    const [includeNotifications, setIncludeNotifications] =
        useState(false);
    const type = PROJECT_TYPES[projectType];
    const frontendData = FRONTENDS[frontend];
    const backendData = BACKENDS[backend];
    const databaseData = DATABASES[database];
    const authData = AUTH_OPTIONS[auth];
    const apiData = API_STYLES[apiStyle];
    const cloudData = CLOUD_PROVIDERS[cloud];
    const appClassName = getSafeName(appName);
    const tables = useMemo(() => {
        const baseTables = [];
        if (database !== "none") {
            baseTables.push("users");
        }
        if (projectType === "ecommerce") {
            baseTables.push(
                "products",
                "categories",
                "carts",
                "cart_items",
                "orders",
                "order_items"
            );
        }
        if (projectType === "social") {
            baseTables.push(
                "posts",
                "comments",
                "likes",
                "follows",
                "notifications"
            );
        }
        if (projectType === "marketplace") {
            baseTables.push(
                "listings",
                "orders",
                "reviews",
                "messages"
            );
        }
        if (projectType === "booking") {
            baseTables.push(
                "services",
                "availability",
                "bookings"
            );
        }
        if (projectType === "dashboard") {
            baseTables.push(
                "records",
                "audit_logs"
            );
        }
        if (projectType === "saas") {
            baseTables.push(
                "organizations",
                "memberships",
                "subscriptions"
            );
        }
        if (includePayments) {
            baseTables.push(
                "payments",
                "transactions"
            );
        }
        if (includeNotifications) {
            baseTables.push("notifications");
        }
        authData.tables.forEach((table) => {
            if (!baseTables.includes(table)) {
                baseTables.push(table);
            }
        });
        return baseTables;
    }, [
        database,
        projectType,
        includePayments,
        includeNotifications,
        authData.tables,
    ]);
    const components = useMemo(() => {
        const result = [...type.features];
        if (includePayments) {
            result.push(
                "Payment checkout",
                "Payment success/failure pages",
                "Transaction history"
            );
        }
        if (includeMaps) {
            result.push(
                "Interactive map",
                "Location search",
                "Markers / pins",
                "Location details"
            );
        }
        if (includeEmail) {
            result.push(
                "Email templates",
                "Transactional email service",
                "Email verification / reset flow"
            );
        }
        if (includeNotifications) {
            result.push(
                "Notification center",
                "Push / in-app notifications"
            );
        }
        return [...new Set(result)];
    }, [
        type.features,
        includePayments,
        includeMaps,
        includeEmail,
        includeNotifications,
    ]);
    const apiEndpoints = useMemo(() => {
        const endpoints = [];
        if (auth !== "none") {
            endpoints.push(
                {
                    method: "POST",
                    path: "/api/auth/register",
                    purpose: "Create a user account",
                },
                {
                    method: "POST",
                    path: "/api/auth/login",
                    purpose: "Authenticate user",
                },
                {
                    method: "POST",
                    path: "/api/auth/logout",
                    purpose: "End authenticated session",
                },
                {
                    method: "GET",
                    path: "/api/me",
                    purpose: "Get current user",
                }
            );
        }
        if (projectType === "ecommerce") {
            endpoints.push(
                {
                    method: "GET",
                    path: "/api/products",
                    purpose: "List/search products",
                },
                {
                    method: "GET",
                    path: "/api/products/:id",
                    purpose: "Get product details",
                },
                {
                    method: "POST",
                    path: "/api/cart",
                    purpose: "Add/update cart items",
                },
                {
                    method: "POST",
                    path: "/api/orders",
                    purpose: "Create order",
                },
                {
                    method: "GET",
                    path: "/api/orders",
                    purpose: "List user orders",
                }
            );
        }
        if (projectType === "social") {
            endpoints.push(
                {
                    method: "GET",
                    path: "/api/feed",
                    purpose: "Get user feed",
                },
                {
                    method: "POST",
                    path: "/api/posts",
                    purpose: "Create post",
                },
                {
                    method: "POST",
                    path: "/api/posts/:id/like",
                    purpose: "Like/unlike post",
                },
                {
                    method: "POST",
                    path: "/api/posts/:id/comments",
                    purpose: "Create comment",
                }
            );
        }
        if (projectType === "dashboard") {
            endpoints.push(
                {
                    method: "GET",
                    path: "/api/dashboard/summary",
                    purpose: "Dashboard KPIs",
                },
                {
                    method: "GET",
                    path: "/api/records",
                    purpose: "List records",
                },
                {
                    method: "GET",
                    path: "/api/records/:id",
                    purpose: "Get record",
                },
                {
                    method: "PUT",
                    path: "/api/records/:id",
                    purpose: "Update record",
                },
                {
                    method: "DELETE",
                    path: "/api/records/:id",
                    purpose: "Delete record",
                }
            );
        }
        if (projectType === "booking") {
            endpoints.push(
                {
                    method: "GET",
                    path: "/api/availability",
                    purpose: "Check availability",
                },
                {
                    method: "POST",
                    path: "/api/bookings",
                    purpose: "Create booking",
                },
                {
                    method: "GET",
                    path: "/api/bookings",
                    purpose: "List bookings",
                },
                {
                    method: "DELETE",
                    path: "/api/bookings/:id",
                    purpose: "Cancel booking",
                }
            );
        }
        if (includePayments) {
            endpoints.push(
                {
                    method: "POST",
                    path: "/api/payments/create",
                    purpose: "Create payment",
                },
                {
                    method: "POST",
                    path: "/api/payments/webhook",
                    purpose: "Receive payment provider events",
                }
            );
        }
        if (includeMaps) {
            endpoints.push(
                {
                    method: "GET",
                    path: "/api/locations",
                    purpose: "Search business/map locations",
                }
            );
        }
        return endpoints;
    }, [
        auth,
        projectType,
        includePayments,
        includeMaps,
    ]);
    const starterCode = useMemo(() => {
        if (frontend === "react") {
            return `import { useEffect, useState } from "react";
export default function ${appClassName}() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch("${apiEndpoints[0]?.path || "/api/data"}");
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <main className="app-shell">
            <h1>${appName}</h1>
            <section>
                {/* ${components[0] || "Main content"} */}
                {data && (
                    <pre>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                )}
            </section>
        </main>
    );
}`;
        }
        if (frontend === "vue") {
            return `<script setup>
import { ref, onMounted } from "vue";
const data = ref(null);
const loading = ref(true);
const error = ref(null);
onMounted(async () => {
    try {
        const response = await fetch(
            "${apiEndpoints[0]?.path || "/api/data"}"
        );
        if (!response.ok) {
            throw new Error("Request failed");
        }
        data.value = await response.json();
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
});
</script>
<template>
    <main class="app-shell">
        <h1>${appName}</h1>
        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            Error: {{ error }}
        </div>
        <pre v-else>
            {{ data }}
        </pre>
    </main>
</template>`.trim();
        }
        if (frontend === "nextjs") {
            return `export default async function Page() {
    const response = await fetch(
        "${apiEndpoints[0]?.path || "/api/data"}",
        {
            cache: "no-store",
        }
    );
    if (!response.ok) {
        throw new Error("Request failed");
    }
    const data = await response.json();
    return (
        <main className="app-shell">
            <h1>${appName}</h1>
            {/* ${components[0] || "Main content"} */}
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </main>
    );
}`;
        }
        return `// ${frontendData.label} starter project
// Project:
// ${appName}
// Project type:
// ${type.label}
// Backend:
// ${backendData.label}
// Database:
// ${databaseData.label}
// Authentication:
// ${authData.label}
// API:
// ${apiData.label}
// Start by creating:
// ${components.slice(0, 5).join("\n// ")}`;
    }, [
        frontend,
        apiEndpoints,
        appClassName,
        appName,
        components,
        frontendData.label,
        type.label,
        backendData.label,
        databaseData.label,
        authData.label,
        apiData.label,
    ]);
    const folderStructure = useMemo(() => {
        if (frontend === "nextjs") {
            return `/${appClassName}
├── app/
│   ├── layout
│   ├── page
│   ├── login/
│   ├── dashboard/
│   └── api/
├── components/
├── lib/
├── hooks/
├── services/
├── types/
├── public/
├── tests/
├── .env
├── package.json
└── README.md`;
        }
        return `/${appClassName}
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── api/
│   ├── utils/
│   ├── types/
│   ├── assets/
│   └── ${frontend === "vue" ? "router/" : "routes/"}
├── public/
├── tests/
├── .env
├── package.json
└── README.md`;
    }, [
        appClassName,
        frontend,
    ]);
    const roadmap = [
        {
            phase: "1",
            title: "Requirements",
            tasks: [
                "Define target users",
                "Define business problem",
                "Define MVP features",
                "Define user roles",
                "Define success criteria",
            ],
        },
        {
            phase: "2",
            title: "UI / UX",
            tasks: [
                "Create wireframes",
                "Create responsive layouts",
                "Define navigation",
                "Define reusable components",
                "Create design system",
            ],
        },
        {
            phase: "3",
            title: "Frontend",
            tasks: [
                `Set up ${frontendData.label}`,
                "Build pages",
                "Build reusable components",
                "Connect API",
                "Handle loading/error/empty states",
            ],
        },
        {
            phase: "4",
            title: "Backend",
            tasks: backend === "none"
                ? [
                    "Configure external API / static data",
                    "Set up environment configuration",
                ]
                : [
                    `Set up ${backendData.label}`,
                    "Create API routes",
                    "Implement validation",
                    "Implement business logic",
                    "Connect database",
                ],
        },
        {
            phase: "5",
            title: "Authentication & Security",
            tasks: [
                authData.label,
                "Authorization",
                "Input validation",
                "Secure secrets",
                "Error handling",
            ],
        },
        {
            phase: "6",
            title: "Testing",
            tasks: TESTING,
        },
        {
            phase: "7",
            title: "Deployment",
            tasks: [
                `Deploy using ${cloudData.label}`,
                "Configure production environment",
                "Configure domain",
                "Enable HTTPS",
                "Configure monitoring",
                "Create backup / rollback process",
            ],
        },
    ];
    const steps = [
        "Overview",
        "Requirements",
        "Architecture",
        "Components",
        "Database",
        "API",
        "Folder Structure",
        "Starter Code",
        "Security",
        "Testing",
        "Deployment",
        "Roadmap",
    ];
    return (
        <div className="tool-page developer-agent">
            {/* HEADER */}
            <div className="developer-header">
                <div>
                    <h1>
                        💻 Developer Agent
                    </h1>
                    <p className="tool-description">
                        Plan software projects across web, mobile,
                        SaaS, e-commerce, AI, dashboards, marketplaces,
                        booking systems and custom applications.
                    </p>
                </div>
                <div className="developer-badge">
                    🌍 Global Developer Tool
                </div>
            </div>
            {/* NOTICE */}
            <div className="agent-notice">
                <strong>Development planner:</strong>
                <span>
                    This agent generates a structured starting plan.
                    Technology choices should be adjusted according
                    to the project's requirements, team experience,
                    budget, security requirements and deployment needs.
                </span>
            </div>
            {/* INPUTS */}
            <div className="tool-grid">
                <div className="tool-panel">
                    <label htmlFor="developer-app-name">
                        Project name
                    </label>
                    <input
                        id="developer-app-name"
                        type="text"
                        value={appName}
                        onChange={(e) =>
                            setAppName(e.target.value)
                        }
                    />
                </div>
                <div className="tool-panel">
                    <label htmlFor="developer-project-type">
                        Project type
                    </label>
                    <select
                        id="developer-project-type"
                        value={projectType}
                        onChange={(e) =>
                            setProjectType(e.target.value)
                        }
                    >
                        {Object.entries(PROJECT_TYPES).map(
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
                    <label htmlFor="developer-frontend">
                        Frontend / client
                    </label>
                    <select
                        id="developer-frontend"
                        value={frontend}
                        onChange={(e) =>
                            setFrontend(e.target.value)
                        }
                    >
                        {Object.entries(FRONTENDS).map(
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
                    <label htmlFor="developer-backend">
                        Backend
                    </label>
                    <select
                        id="developer-backend"
                        value={backend}
                        onChange={(e) =>
                            setBackend(e.target.value)
                        }
                    >
                        {Object.entries(BACKENDS).map(
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
                    <label htmlFor="developer-database">
                        Database
                    </label>
                    <select
                        id="developer-database"
                        value={database}
                        onChange={(e) =>
                            setDatabase(e.target.value)
                        }
                    >
                        {Object.entries(DATABASES).map(
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
                    <label htmlFor="developer-auth">
                        Authentication
                    </label>
                    <select
                        id="developer-auth"
                        value={auth}
                        onChange={(e) =>
                            setAuth(e.target.value)
                        }
                    >
                        {Object.entries(AUTH_OPTIONS).map(
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
                    <label htmlFor="developer-api">
                        API architecture
                    </label>
                    <select
                        id="developer-api"
                        value={apiStyle}
                        onChange={(e) =>
                            setApiStyle(e.target.value)
                        }
                    >
                        {Object.entries(API_STYLES).map(
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
                    <label htmlFor="developer-cloud">
                        Deployment / cloud
                    </label>
                    <select
                        id="developer-cloud"
                        value={cloud}
                        onChange={(e) =>
                            setCloud(e.target.value)
                        }
                    >
                        {Object.entries(CLOUD_PROVIDERS).map(
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
            </div>
            {/* EXTRA FEATURES */}
            <div className="developer-features">
                <h3>
                    Optional capabilities
                </h3>
                <div className="feature-checkboxes">
                    <label>
                        <input
                            type="checkbox"
                            checked={includePayments}
                            onChange={(e) =>
                                setIncludePayments(
                                    e.target.checked
                                )
                            }
                        />
                        💳 Payments
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={includeMaps}
                            onChange={(e) =>
                                setIncludeMaps(
                                    e.target.checked
                                )
                            }
                        />
                        🗺️ Maps / Location
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={includeEmail}
                            onChange={(e) =>
                                setIncludeEmail(
                                    e.target.checked
                                )
                            }
                        />
                        📧 Email
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={includeNotifications}
                            onChange={(e) =>
                                setIncludeNotifications(
                                    e.target.checked
                                )
                            }
                        />
                        🔔 Notifications
                    </label>
                </div>
            </div>
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
            {/* 1 OVERVIEW */}
            {step === 1 && (
                <div className="agent-step">
                    <h2>
                        {type.icon} Project Overview
                    </h2>
                    <div className="agent-cards">
                        <div>
                            <span>
                                Project
                            </span>
                            <strong>
                                {appName}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Project Type
                            </span>
                            <strong>
                                {type.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Frontend
                            </span>
                            <strong>
                                {frontendData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Backend
                            </span>
                            <strong>
                                {backendData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Database
                            </span>
                            <strong>
                                {databaseData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Authentication
                            </span>
                            <strong>
                                {authData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                API
                            </span>
                            <strong>
                                {apiData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Deployment
                            </span>
                            <strong>
                                {cloudData.label}
                            </strong>
                        </div>
                    </div>
                </div>
            )}
            {/* 2 REQUIREMENTS */}
            {step === 2 && (
                <div className="agent-step">
                    <h2>
                        📋 Requirements
                    </h2>
                    <div className="requirement-grid">
                        {components.map(
                            (feature, index) => (
                                <div
                                    className="requirement-item"
                                    key={feature}
                                >
                                    <span>
                                        {String(
                                            index + 1
                                        ).padStart(2, "0")}
                                    </span>
                                    <strong>
                                        {feature}
                                    </strong>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
            {/* 3 ARCHITECTURE */}
            {step === 3 && (
                <div className="agent-step">
                    <h2>
                        🏛️ Architecture
                    </h2>
                    <div className="architecture-flow">
                        <div className="architecture-box">
                            👤
                            <strong>
                                User
                            </strong>
                        </div>
                        <div className="architecture-arrow">
                            →
                        </div>
                        <div className="architecture-box">
                            🖥️
                            <strong>
                                {frontendData.label}
                            </strong>
                        </div>
                        <div className="architecture-arrow">
                            →
                        </div>
                        <div className="architecture-box">
                            🔌
                            <strong>
                                {apiData.label}
                            </strong>
                        </div>
                        {backend !== "none" && (
                            <>
                                <div className="architecture-arrow">
                                    →
                                </div>
                                <div className="architecture-box">
                                    ⚙️
                                    <strong>
                                        {backendData.label}
                                    </strong>
                                </div>
                            </>
                        )}
                        {database !== "none" && (
                            <>
                                <div className="architecture-arrow">
                                    →
                                </div>
                                <div className="architecture-box">
                                    🗄️
                                    <strong>
                                        {databaseData.label}
                                    </strong>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="architecture-details">
                        <p>
                            <strong>Client:</strong>{" "}
                            {frontendData.label}
                        </p>
                        <p>
                            <strong>Backend:</strong>{" "}
                            {backendData.label}
                        </p>
                        <p>
                            <strong>Database:</strong>{" "}
                            {databaseData.label}
                        </p>
                        <p>
                            <strong>Authentication:</strong>{" "}
                            {authData.label}
                        </p>
                        <p>
                            <strong>Deployment:</strong>{" "}
                            {cloudData.label}
                        </p>
                    </div>
                </div>
            )}
            {/* 4 COMPONENTS */}
            {step === 4 && (
                <div className="agent-step">
                    <h2>
                        🧩 Application Components
                    </h2>
                    <div className="component-list">
                        {components.map(
                            (component, index) => (
                                <div
                                    key={component}
                                    className="component-row"
                                >
                                    <span>
                                        {index + 1}
                                    </span>
                                    <strong>
                                        {component}
                                    </strong>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
            {/* 5 DATABASE */}
            {step === 5 && (
                <div className="agent-step">
                    <h2>
                        🗄️ Database Plan
                    </h2>
                    {database === "none" ? (
                        <div className="agent-summary">
                            This project is configured without a
                            database.
                        </div>
                    ) : (
                        <>
                            <div className="agent-summary">
                                <strong>
                                    Database:
                                </strong>{" "}
                                {databaseData.label}
                                <br />
                                <strong>
                                    Type:
                                </strong>{" "}
                                {databaseData.type}
                            </div>
                            <table className="regex-groups-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Table / Collection
                                        </th>
                                        <th>
                                            Suggested purpose
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables.map(
                                        (table) => (
                                            <tr key={table}>
                                                <td>
                                                    <code>
                                                        {table}
                                                    </code>
                                                </td>
                                                <td>
                                                    Core application
                                                    data related to{" "}
                                                    {table.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}
            {/* 6 API */}
            {step === 6 && (
                <div className="agent-step">
                    <h2>
                        🔌 API Plan
                    </h2>
                    <div className="agent-summary">
                        <strong>
                            API architecture:
                        </strong>{" "}
                        {apiData.label}
                    </div>
                    {apiEndpoints.length === 0 ? (
                        <p>
                            No API endpoints are required by
                            the current configuration.
                        </p>
                    ) : (
                        <table className="regex-groups-table">
                            <thead>
                                <tr>
                                    <th>
                                        Method
                                    </th>
                                    <th>
                                        Endpoint
                                    </th>
                                    <th>
                                        Purpose
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiEndpoints.map(
                                    (endpoint) => (
                                        <tr
                                            key={
                                                endpoint.method +
                                                endpoint.path
                                            }
                                        >
                                            <td>
                                                <code>
                                                    {
                                                        endpoint.method
                                                    }
                                                </code>
                                            </td>
                                            <td>
                                                <code>
                                                    {
                                                        endpoint.path
                                                    }
                                                </code>
                                            </td>
                                            <td>
                                                {
                                                    endpoint.purpose
                                                }
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {/* 7 FOLDER */}
            {step === 7 && (
                <div className="agent-step">
                    <h2>
                        📁 Suggested Folder Structure
                    </h2>
                    <textarea
                        readOnly
                        value={folderStructure}
                        spellCheck={false}
                        className="code-output"
                    />
                </div>
            )}
            {/* 8 CODE */}
            {step === 8 && (
                <div className="agent-step">
                    <h2>
                        💻 Starter Code
                    </h2>
                    <p>
                        Starter implementation for{" "}
                        <strong>
                            {frontendData.label}
                        </strong>.
                    </p>
                    <textarea
                        readOnly
                        value={starterCode}
                        spellCheck={false}
                        className="code-output large"
                    />
                </div>
            )}
            {/* 9 SECURITY */}
            {step === 9 && (
                <div className="agent-step">
                    <h2>
                        🔐 Security Checklist
                    </h2>
                    <div className="checklist-grid">
                        {SECURITY.map(
                            (item) => (
                                <label
                                    key={item}
                                    className="checklist-item"
                                >
                                    <input
                                        type="checkbox"
                                    />
                                    <span>
                                        {item}
                                    </span>
                                </label>
                            )
                        )}
                    </div>
                </div>
            )}
            {/* 10 TESTING */}
            {step === 10 && (
                <div className="agent-step">
                    <h2>
                        🧪 Testing Plan
                    </h2>
                    <div className="checklist-grid">
                        {TESTING.map(
                            (item) => (
                                <label
                                    key={item}
                                    className="checklist-item"
                                >
                                    <input
                                        type="checkbox"
                                    />
                                    <span>
                                        {item}
                                    </span>
                                </label>
                            )
                        )}
                    </div>
                </div>
            )}
            {/* 11 DEPLOYMENT */}
            {step === 11 && (
                <div className="agent-step">
                    <h2>
                        🚀 Deployment
                    </h2>
                    <div className="agent-cards">
                        <div>
                            <span>
                                Provider
                            </span>
                            <strong>
                                {cloudData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Services
                            </span>
                            <strong>
                                {cloudData.services}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Frontend
                            </span>
                            <strong>
                                {frontendData.label}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Backend
                            </span>
                            <strong>
                                {backendData.label}
                            </strong>
                        </div>
                    </div>
                    <div className="checklist-grid">
                        {DEVOPS.map(
                            (item) => (
                                <label
                                    key={item}
                                    className="checklist-item"
                                >
                                    <input
                                        type="checkbox"
                                    />
                                    <span>
                                        {item}
                                    </span>
                                </label>
                            )
                        )}
                    </div>
                </div>
            )}
            {/* 12 ROADMAP */}
            {step === 12 && (
                <div className="agent-step">
                    <h2>
                        🗺️ Development Roadmap
                    </h2>
                    <div className="roadmap">
                        {roadmap.map(
                            (phase) => (
                                <div
                                    key={phase.phase}
                                    className="roadmap-card"
                                >
                                    <div className="roadmap-number">
                                        {phase.phase}
                                    </div>
                                    <div>
                                        <h3>
                                            {phase.title}
                                        </h3>
                                        <ul>
                                            {phase.tasks.map(
                                                (task) => (
                                                    <li
                                                        key={task}
                                                    >
                                                        {task}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}