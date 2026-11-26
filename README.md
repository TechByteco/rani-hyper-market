# 🛒 SNS Retail Marketing Agent — Autonomous Retail AI Operating System

[![Live Demo](https://img.shields.io/badge/Vercel-Live%20Online-000000?style=for-the-badge&logo=vercel)](https://rani-hyper-market.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-SNS--Retail--Marketing--Agent-181717?style=for-the-badge&logo=github)](https://github.com/TechByteco/sns-retail-marketing-agent)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.1%20Flash%20Lite-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

**SNS Retail Marketing Agent** is an enterprise-grade, cloud-deployed retail operating system and autonomous AI marketing swarm tailored for supermarkets, hypermarkets, and regional grocery chains. The system combines high-converting omnichannel customer shopping with real-time POS counter management, predictive festival demand modeling, automated WhatsApp marketing, and continuous inventory reconciliation.

---

## 🌐 Live Cloud Deployment

* **Customer Supermarket Storefront**: [https://rani-hyper-market.vercel.app/](https://rani-hyper-market.vercel.app/)
* **Admin Management & POS Portal**: [https://rani-hyper-market.vercel.app/admin](https://rani-hyper-market.vercel.app/admin)
* **Online Orders & UPI Reconciler**: [https://rani-hyper-market.vercel.app/online-orders](https://rani-hyper-market.vercel.app/online-orders)
* **AI Business Intelligence Hub**: [https://rani-hyper-market.vercel.app/ai-analytics](https://rani-hyper-market.vercel.app/ai-analytics)
* **Public Product Catalog**: [https://rani-hyper-market.vercel.app/store](https://rani-hyper-market.vercel.app/store)
* **Voucher & Bill History Archive**: [https://rani-hyper-market.vercel.app/bill_history](https://rani-hyper-market.vercel.app/bill_history)

---

## ⚡ Core Capabilities & Intelligent Modules

### 1. Autonomous AI Marketing & Demand Swarm
* **34-Festival Lunisolar Surge Planner**: Continuous predictive replenishment engine modeling major Indian festivals (Deepavali, Pongal, Karthigai Deepam, Eid, Christmas) with empirical POS inventory surge factors.
* **Customer Replenishment Tracker**: Predictive consumption models identifying repeat grocery purchase cycles (e.g. 25kg Ponni rice, 5L cooking oil, pulses) for timely reorder prompts.
* **Automated WhatsApp Conversational Commerce**: Meta Graph API integration generating automated morning executive briefings, transactional order confirmations, interactive catalog checkout, and digital e-bills.
* **Zero-Waste Fresh Markdown Shelf**: Algorithmic dynamic discounts (`20% OFF`) for perishables and near-expiry dairy/batter stock to maximize sell-through and eliminate food waste.

### 2. High-Performance Mobile Storefront (`store.html`)
* **Instant SKU Catalog**: Fast search and category filters across **7,179+ products** powered by an in-memory indexed search engine (`/api/products/search`) and browser caching.
* **Thumb-Friendly Mobile Grid**: Optimized 2-column e-commerce grid with quick-view modals, vegetarian/non-vegetarian indicators, barcode camera scanner, and dynamic wishlists.
* **Smart Shopping Cart**: Real-time savings calculators, free doorstep delivery thresholds, and 1-tap checkout via Google Pay, UPI, and Cash on Delivery.

### 3. Executive Admin Command Dock & Counter POS (`admin.html`)
* **Live Counter POS Billing Terminal**: Fast barcode scanning, hotkey accelerators (`F2`, `F4`, `Enter`), and "Park & Hold" customer bill queues.
* **Shift Drawer & Z-Report Reconciliation**: Real-time cash drawer tracking with opening float verification, sales breakdown (Cash / UPI / Card), and formal cashier shift sign-off.
* **5-Year Reconstructed Inventory Ledger**: Stock ledger tracking 760,005+ billed units across master products and variant stock records.
* **Continuous 2-Way Delta Sync**: Resilient offline-to-cloud synchronization keeping local POS counters and Vercel cloud deployments aligned.

### 4. Order Management & Bank Webhook Reconciliation (`online-orders.html`)
* **Automated UPI & GPay Matching**: Real-time webhook matching linking bank UTR/RRN reference codes to pending cart orders with instant cashier audit logs.
* **Order Lifecycle Tracker**: Live status updates across `PLACED` ➔ `CONFIRMED` ➔ `PACKED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.
* **WhatsApp E-Bill Engine**: One-click dispatch of formatted digital receipts directly to the customer's verified WhatsApp mobile number.

### 5. Bilingual AI Retail Advisor (`ai-analytics.html`)
* **Grounded Retail Synthesis**: Google Gemini AI model grounded in 5 years of verified store transactions and category profitability margins.
* **Bilingual Voice & Text Assistant**: Web Speech voice interface supporting both **English (`en-IN`)** and regional **Tamil (`ta-IN`)**.
* **Financial Performance Reports**: Automated GSTR-1 outward supplies analysis, dead-stock velocity diagnostics, and hourly footfall heatmaps.

---

## 🏗️ Architecture & Tech Stack

```
sns-retail-marketing-agent/
├── public/                         # Static assets served via Vercel Global Edge CDN
│   ├── store.html                  # Customer Supermarket Storefront
│   ├── admin.html                  # Executive Admin Management & POS Dock
│   ├── online-orders.html          # Online Orders & UPI Reconciler Dashboard
│   ├── ai-analytics.html           # AI Business Intelligence Hub
│   ├── login.html                  # Multi-Tier Staff Authentication Portal
│   ├── bill_history.html           # Historical Bill Archive
│   ├── products_catalog.json       # Master Product Catalog (7,179 SKUs)
│   └── rani_products.json          # Working FMCG Inventory Dataset
├── api/                            # Vercel Serverless Functions (Node.js runtime)
│   ├── index.js                    # Unified Serverless REST API Gateway
│   ├── posEnhancementService.js    # Retail enhancement & shift drawer controller
│   └── analyticsService.js         # Analytics aggregation & festival prediction engine
├── services/                       # Background services & operational daemons
├── securityAndCatalogHelper.js     # Strict CORS allowlist, timing-safe auth & search
├── posEnhancementService.js        # Core POS, UPI webhook & shift management
├── analyticsService.js             # Retail sales & festival analytics engine
├── server.js                       # Local development HTTP server (Port 5500)
├── vercel.json                     # Edge CDN caching, rewrites & security headers
└── package.json                    # Scripts, dependencies & project metadata
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* **Node.js**: v18.x or v20.x+ (Recommended: Node.js 22+ or 24 LTS)
* **Python**: 3.10+ (for test suites and parity verification)
* **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TechByteco/sns-retail-marketing-agent.git
cd sns-retail-marketing-agent

# 2. Install dependencies
npm install

# 3. Run automated verification suite (parity, syntax, security)
npm test

# 4. Start local development server
npm start
```

The local development server boots on:
* **Local Storefront**: `http://localhost:5500/store.html`
* **Admin / POS Terminal**: `http://localhost:5500/admin.html`
* **Orders Dashboard**: `http://localhost:5500/online-orders.html`

---

## 🧪 Testing & Verification

The project includes an automated test runner enforcing zero dual-copy parity drift, 100% valid JavaScript syntax, and security checks:

```bash
npm test
```

Verification stages:
1. `scripts/verify_all_dual_parity.py`: Validates 100% binary identity between root and `public/` / `api/` file pairs.
2. `scripts/check_all_html_scripts.py`: Validates AST syntax across all 38 frontend HTML templates.
3. `scripts/test_api_index_routes.py`: Verifies Vercel serverless API routes (`/api/webhooks/gpay`, `/api/pos/shift/current`, `/api/inventory/fresh-markdowns`, `/api/sync/delta`).
4. `scripts/verify_precision_improvements.py`: Tests timing-safe admin authentication, strict CORS allowlists, `/tmp` serverless persistence safety, and `/api/reorders/predict`.

---

## 🔐 Environment Variables

Configure the following environment variables in Vercel or your local `.env`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ADMIN_API_KEY` | Timing-safe master secret for administrative mutations | `admin123` |
| `SUPABASE_URL` | Supabase Cloud Database URL | `https://lofykatlypiywrziwtdp.supabase.co` |
| `SUPABASE_ANON_KEY` | Public Supabase API Key for heartbeat pings | `sb_publishable_...` |
| `GEMINI_API_KEY` | Google Gemini API Key for bilingual retail advisor | Optional (has offline fallback) |
| `PORT` | Local HTTP server port | `5500` |

---

## 📄 License & Ownership
Copyright © 2026 **TechByte**. Licensed under the [ISC License](LICENSE). Built for modern independent supermarkets and retail hypermarkets.
