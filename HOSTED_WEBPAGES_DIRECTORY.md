# Rani Hyper Market & SNS Market — Complete Hosted Webpages & Systems Directory

**Generated**: October 2026  
**Live Production Domain**: [https://rani-hyper-market.vercel.app](https://rani-hyper-market.vercel.app)  
**Local Retail POS Server**: [http://localhost:5500](http://localhost:5500)  
**Active Retail Database**: `C:/SKS Market/Data/database/37a64e83-514d-4b00-b90a-9af172dacdd6/9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db` (46.87 MB | 7,166+ products | 17,547+ transactions)

---

## 1. Quick Reference URL Matrix

| Page Name | Vercel Live Production URL | Local Retail POS URL | Primary Audience | Access Security |
| :--- | :--- | :--- | :--- | :--- |
| **Digital Supermarket & Store** | `https://rani-hyper-market.vercel.app/store` | `http://localhost:5500/store.html` | Public Customers | Public (0ms first render) |
| **Store Gateway / Landing** | `https://rani-hyper-market.vercel.app/` | `http://localhost:5500/index.html` | Public Customers | Public |
| **Product Image Studio** | `https://rani-hyper-market.vercel.app/product-images` | `http://localhost:5500/product-images.html` | Inventory / Product Admin | **Front Security Gate (`admin` / `admin123`)** |
| **Rani Hyper Market Portal** | `https://rani-hyper-market.vercel.app/rani` | `http://localhost:5500/rani.html` | Store Owners & Managers | Staff / Admin |
| **SNS Market Admin POS** | `https://rani-hyper-market.vercel.app/admin` | `http://localhost:5500/admin.html` | Cashiers & Billing Clerks | Staff / Cashier Desk |
| **Master Enterprise Console** | `https://rani-hyper-market.vercel.app/master` | `http://localhost:5500/master.html` | Super Administrators | Master Key Gate |
| **Master Login** | `https://rani-hyper-market.vercel.app/master-login` | `http://localhost:5500/master-login.html` | Master Administrators | Master Credentials |
| **NSN Marketing Hub** | `https://rani-hyper-market.vercel.app/marketing` | `http://localhost:5500/marketing.html` | Marketing Team / MarkBot | Admin / MarkBot Engine |
| **AI Store Intelligence** | `https://rani-hyper-market.vercel.app/ai-analytics` | `http://localhost:5500/ai-analytics.html` | Business Analysts / Owners | Staff / Analytics |
| **POS Bill History** | `https://rani-hyper-market.vercel.app/bill_history` | `http://localhost:5500/bill_history.html` | Auditors & Cashiers | Staff / Cashier Desk |
| **System Diagnostics** | `https://rani-hyper-market.vercel.app/diagnostics` | `http://localhost:5500/diagnostics.html` | Tech Admin & Support | Diagnostic Hub |
| **Staff Login** | `https://rani-hyper-market.vercel.app/login` | `http://localhost:5500/login.html` | Store Operators | Staff Password |

---

## 2. Detailed Page Breakdowns & Purposes

### 1. Customer Digital Supermarket (`/store`)
* **Live URL**: [https://rani-hyper-market.vercel.app/store](https://rani-hyper-market.vercel.app/store)
* **Local URL**: [http://localhost:5500/store.html](http://localhost:5500/store.html)
* **Target Audience**: General public, online shoppers, local grocery buyers.
* **Purpose**:
  * Provides a modern e-commerce storefront for Rani Hyper Market.
  * Instant 0ms initial render with 60 core essentials, background hydrating to 7,179 authentic products.
  * Real-time search by English and Tamil item names, brand names, and barcode numbers.
  * Category navigation pills (Atta, Rice, Dal, Masala, Dairy, Personal Care, Snacks).
  * Interactive shopping cart, delivery slot scheduling, and direct 1-click WhatsApp order dispatch.
  * Auto-updates product packaging images dynamically via `BroadcastChannel` with zero reload needed.

---

### 2. Product Image Studio (`/product-images`)
* **Live URL**: [https://rani-hyper-market.vercel.app/product-images](https://rani-hyper-market.vercel.app/product-images)
* **Local URL**: [http://localhost:5500/product-images.html](http://localhost:5500/product-images.html)
* **Access Control**: **Front Protection Gate Enabled**
  * **Default Username**: `admin`
  * **Default Password**: `admin123`
* **Target Audience**: Store inventory clerks, catalog managers, administrators.
* **Purpose**:
  * Dedicated workstation for uploading and managing packaging packshots across all 7,179 products.
  * **3 Image Input Methods**:
    1. 📷 **Live Camera Capture**: Real-time camera viewfinder with front/back camera switching for shooting shelf products on phones/tablets.
    2. 📁 **Device Gallery Upload**: Drag-and-drop or gallery browse with client-side canvas auto-compression.
    3. 🔗 **Online URL Link**: Paste any web image URL with an instant live test preview.
  * **Direct Database Synchronization**:
    * Persists updates directly into SQLite `ProductImageMaster` table.
    * Updates `products_catalog.json` and `rani_products.json`.
    * Broadcasts updates to open customer tabs for instant visual swaps.
    * Features a red "Lock Studio" button to clear session authorization on demand.

---

### 3. Rani Hyper Market Management Hub (`/rani`)
* **Live URL**: [https://rani-hyper-market.vercel.app/rani](https://rani-hyper-market.vercel.app/rani)
* **Local URL**: [http://localhost:5500/rani.html](http://localhost:5500/rani.html)
* **Target Audience**: Store owners, general managers, floor supervisors.
* **Purpose**:
  * Executive analytics and store management command center.
  * Real-time sales report: revenue, total bills (17,547+), average basket value, and peak transaction periods.
  * Real-time inventory tracking, low-stock warnings, and top-selling product leaderboards.
  * Quick links to POS cashier, diagnostics, and catalog image studio.

---

### 4. SNS Market Admin POS Terminal (`/admin`)
* **Live URL**: [https://rani-hyper-market.vercel.app/admin](https://rani-hyper-market.vercel.app/admin)
* **Local URL**: [http://localhost:5500/admin.html](http://localhost:5500/admin.html)
* **Target Audience**: Billing clerks, checkout cashiers, counter operators.
* **Purpose**:
  * Desktop and tablet POS checkout counter.
  * Rapid barcode scanning and SKU lookup.
  * Automated GST tax calculation, line-item discounts, and multi-payment processing (Cash, Card, UPI).
  * Direct thermal bill print trigger and electronic invoice generation.
  * Direct local SQLite database read/write synchronization.

---

### 5. Master Enterprise Console (`/master` & `/master-login`)
* **Live URL (Console)**: [https://rani-hyper-market.vercel.app/master](https://rani-hyper-market.vercel.app/master)
* **Live URL (Login)**: [https://rani-hyper-market.vercel.app/master-login](https://rani-hyper-market.vercel.app/master-login)
* **Local URL**: [http://localhost:5500/master.html](http://localhost:5500/master.html)
* **Target Audience**: System owners, enterprise super-administrators.
* **Purpose**:
  * Multi-branch configuration and database selection.
  * Switching between fiscal year databases (`2024-2025`, `2025-2026`, `2026-2027`).
  * Cloud sync configuration (Supabase credentials, remote backup toggles).
  * High-level security lockouts and audit logging.

---

### 6. NSN Marketing Hub & MarkBot Engine (`/marketing`)
* **Live URL**: [https://rani-hyper-market.vercel.app/marketing](https://rani-hyper-market.vercel.app/marketing)
* **Local URL**: [http://localhost:5500/marketing.html](http://localhost:5500/marketing.html)
* **Target Audience**: Marketing team, autonomous MarkBot engine, growth managers.
* **Purpose**:
  * Autonomous marketing campaign manager.
  * Manages seasonal promotions (Deepavali Megasale, Pongal Thiruvizha, Weekend Super Savers).
  * Generates promotional graphic banners and formatted WhatsApp message flyers for social broadcast.
  * Flash sale countdown clocks and deal-of-the-day scheduler.

---

### 7. AI Store Intelligence & Analytics (`/ai-analytics`)
* **Live URL**: [https://rani-hyper-market.vercel.app/ai-analytics](https://rani-hyper-market.vercel.app/ai-analytics)
* **Local URL**: [http://localhost:5500/ai-analytics.html](http://localhost:5500/ai-analytics.html)
* **Target Audience**: Data analysts, retail planners, financial controllers.
* **Purpose**:
  * AI-powered predictive store telemetry.
  * Peak customer traffic forecasting and cashier desk load balancing.
  * Reorder point and stockout probability estimation.
  * Basket analysis and smart product cross-selling recommendations.

---

### 8. POS Bill History & Voucher Archive (`/bill_history`)
* **Live URL**: [https://rani-hyper-market.vercel.app/bill_history](https://rani-hyper-market.vercel.app/bill_history)
* **Local URL**: [http://localhost:5500/bill_history.html](http://localhost:5500/bill_history.html)
* **Target Audience**: Store accountants, tax auditors, cashiers.
* **Purpose**:
  * Historical ledger containing all 17,547+ customer bills generated at the POS.
  * Search and filter by voucher number, date range, payment mode, or bill total.
  * Complete itemized breakdown per voucher (product names, quantities, unit prices, tax amounts).
  * Re-print bill receipts for customer duplicates or dispute resolutions.

---

### 9. System Diagnostics & POS Monitor (`/diagnostics`)
* **Live URL**: [https://rani-hyper-market.vercel.app/diagnostics](https://rani-hyper-market.vercel.app/diagnostics)
* **Local URL**: [http://localhost:5500/diagnostics.html](http://localhost:5500/diagnostics.html)
* **Target Audience**: Technical administrators, DevOps, retail support technicians.
* **Purpose**:
  * Live connectivity and system health auditor.
  * Verifies SQLite database existence, file size (`46.87 MB`), and active read/write permissions.
  * Monitors desktop background daemons (`desktopApi`, `sksMarketPos`).
  * Validates catalog integrity: confirms zero missing prices and authentic product packaging URLs across all 7,179 items.

---

### 10. Staff & Cashier Login (`/login`)
* **Live URL**: [https://rani-hyper-market.vercel.app/login](https://rani-hyper-market.vercel.app/login)
* **Local URL**: [http://localhost:5500/login.html](http://localhost:5500/login.html)
* **Target Audience**: Cashiers, counter staff.
* **Purpose**:
  * Quick authentication screen for cashier shift check-in before launching POS counters.

---

## 3. Core Backend API Endpoints Directory

All endpoints are available locally via `http://localhost:5500` and on cloud production via `https://rani-hyper-market.vercel.app`.

| HTTP Method | Endpoint Path | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pos/status` | Public | Returns desktop POS connection status, active database path, and live sales summary. |
| `GET` | `/api/products/catalog` | Public | Delivers the complete 7,179-product inventory catalog with prices and image links. |
| `GET` | `/api/products/images` | Public | Returns key-value mapping of all custom product image overrides. |
| `POST` | `/api/products/update-image` | **Required (`admin` / `admin123`)** | Updates product image packshot in SQLite database, JSON files, and storefront. |
| `GET` | `/api/sales/report` | Staff / Admin | Generates real-time daily, weekly, and total revenue analytics from POS vouchers. |
| `GET` | `/api/bills/history` | Staff / Admin | Retrieves paginated historical transaction bills and voucher records. |
| `GET` | `/api/diagnostics/health` | Public | Executes self-diagnostic checks across database, daemons, and storage. |

---

## 4. Local Retail System & File Locations

* **Project Working Directory**: `C:\SKS_Market_Projects\SKS Market`
* **Active Retail Database File**:
  `C:\SKS Market\Data\database\37a64e83-514d-4b00-b90a-9af172dacdd6\9bcfb0b0-2cd2-11f1-9b4b-6fef85f604f9_2026-2027.db`
* **Product Catalog JSON Files**:
  * `products_catalog.json` (Optimized 1.66 MB catalog for 7,179 items)
  * `rani_products.json` (Full master product record with category mappings)
  * `initial_products.js` (Pre-embedded 60 core essentials for instant 0ms first render)
* **Uploaded Images Storage**:
  * Local Disk: `public/uploads/products/`
  * Web Path: `/uploads/products/<barcode_or_id>.jpg`
* **GitHub Repository**: [https://github.com/TechByteco/rani-hyper-market](https://github.com/TechByteco/rani-hyper-market)
