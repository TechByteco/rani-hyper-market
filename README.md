# 🛒 RANI HYPER MARKET — Retail Operating System & AI Intelligence Hub

[![Live Demo](https://img.shields.io/badge/Vercel-Live%20Online-000000?style=for-the-badge&logo=vercel)](https://rani-hyper-market.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.1%20Flash%20Lite-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

An enterprise-grade, cloud-deployed retail operating system designed for supermarkets, grocery chains, and modern department stores. Features a high-converting customer storefront, multi-device mobile command dock for merchants, live counter POS billing terminal, bilingual AI business advisor (English & Tamil), and automated WhatsApp briefings.

---

## 🌐 Live Cloud Deployment

- **Customer Supermarket Storefront**: [https://rani-hyper-market.vercel.app/](https://rani-hyper-market.vercel.app/)
- **Admin Management Portal**: [https://rani-hyper-market.vercel.app/admin](https://rani-hyper-market.vercel.app/admin)
- **Public Product Catalog**: [https://rani-hyper-market.vercel.app/store](https://rani-hyper-market.vercel.app/store)
- **AI Business Intelligence**: [https://rani-hyper-market.vercel.app/ai-analytics](https://rani-hyper-market.vercel.app/ai-analytics)
- **Voucher & Bill History Archive**: [https://rani-hyper-market.vercel.app/bill_history](https://rani-hyper-market.vercel.app/bill_history)

---

## ⚡ Core Feature Suite

### 1. Customer Storefront & Catalog
- **Ultra-Fast Mobile Grid**: 2-column supermarket grid optimized for thumb interactions on smartphones.
- **Real-Time Search & Category Filters**: Instant search over 7,179 SKUs with live stock health indicators.
- **WhatsApp Order Dispatch**: Direct 1-tap cart checkout dispatching formatted orders to the store's official WhatsApp.

### 2. Executive Admin Command Dock
- **Multi-Device Ergonomics**: Mobile bottom dock with safe-area support, 2×2 responsive KPI cards, and dynamic viewport sizing (`94dvh`).
- **Live POS Counter Terminal**: Fast barcode billing, hotkeys (`F2`, `F4`, `Enter`), and "Park & Hold" bill queueing.
- **Inventory Freshness Engine**: Near-expiry badges (`< 30 days`) with 1-click clearance markdown calculators.
- **Agency Invoice OCR**: Tesseract-powered camera scanning for wholesale purchase invoices.
- **Tax & Compliance**: Instant GSTR-1 outward supplies breakdown and CSV reporting.

### 3. AI Business Intelligence (Gemini 3.1)
- **Grounded Retail Intelligence**: Powered by 5 years of historical transaction records (137,205+ items).
- **Festival & Rush Predictions**: Deep learning forecasting for Deepavali, Pongal, and weekend rush hours.
- **Bilingual Natural Language Voice Assistant**: Web Speech voice interface supporting both **English (`en-IN`)** and **Tamil (`ta-IN`)**.
- **Automated WhatsApp Morning Briefings**: Daily executive snapshot formatted for store proprietors.

---

## 🏗️ Architecture & Tech Stack

```
├── public/                 # Static web assets served by Vercel Global Edge CDN
│   ├── index.html          # Public Customer Storefront
│   ├── store.html          # Product Catalog Page
│   ├── admin.html          # Executive Admin Management Portal
│   ├── ai-analytics.html   # AI Business Intelligence Hub
│   └── bill_history.html   # Voucher History & Invoices
├── api/                    # Vercel Serverless Functions (Node.js runtime)
│   ├── index.js            # Unified REST API handler (/api/pos, /api/ai-analytics)
│   └── [...slug].js        # Wildcard catch-all serverless routing
├── analyticsService.js     # Retail analytics query and aggregation engine
├── generativeAiAdvisor.js  # Google Gemini AI business synthesis engine
├── server.js               # Local development HTTP server (port 5500)
└── vercel.json             # Cloud routing, headers, and function configuration
```

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/saali/rani-hyper-market.git
cd rani-hyper-market

# Install dependencies
npm install

# Start local server
npm start
# Server starts on http://localhost:5500
```

---

## 📄 License
ISC License. Built for **Rani Hyper Market**.
