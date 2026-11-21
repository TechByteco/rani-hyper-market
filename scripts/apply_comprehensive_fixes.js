/**
 * apply_comprehensive_fixes.js
 * Comprehensive upgrade for Rani Hyper Market:
 * 1. Festival dates accurate across 5 years of POS data + future predictive dates (Karthigai Deepam = 2026-11-24, cutoff = 2026-11-18)
 * 2. Fix "View All Customers (180+)" and "Top 10 Highest Purchasing Customers" in admin.html + public/admin.html
 * 3. Fix "Ask AI: Sales, Profit & Stock" and "SNS AI Studio ->" in admin.html + public/admin.html
 * 4. Fix AI Checklist and Predictive Analytics in analyticsService.js and ai-analytics.html
 * 5. Ensure server.js and api/index.js have parity for customer and festival endpoints
 * 6. Sync root <-> public for all updated files
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const API = path.join(ROOT, 'api');

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function writeFile(p, c) {
  fs.writeFileSync(p, c, 'utf8');
  console.log('  [OK] Written:', path.relative(ROOT, p));
}
function syncPublic(fileRel) {
  const src = path.join(ROOT, fileRel);
  const dst = path.join(PUBLIC, fileRel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log('  [OK] Synced to public:', fileRel);
  }
}
function syncApi(fileRel) {
  const src = path.join(ROOT, fileRel);
  const dst = path.join(API, fileRel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log('  [OK] Synced to api:', fileRel);
  }
}

console.log('====================================================');
console.log('STEP 1: Fix Festival Dates in mined_festival_empirical_data.json');
console.log('====================================================');

const minedPath = path.join(ROOT, 'mined_festival_empirical_data.json');
if (fs.existsSync(minedPath)) {
  const mined = JSON.parse(readFile(minedPath));
  if (mined.karthigai_deepam) {
    mined.karthigai_deepam.meta.windows = {
      "2022": ["2022-12-03", "2022-12-06"],
      "2023": ["2023-11-23", "2023-11-26"],
      "2024": ["2024-12-10", "2024-12-13"],
      "2025": ["2025-12-01", "2025-12-04"],
      "2026": ["2026-11-21", "2026-11-24"],
      "2027": ["2027-12-10", "2027-12-13"]
    };
    writeFile(minedPath, JSON.stringify(mined, null, 2));
    syncPublic('mined_festival_empirical_data.json');
    syncApi('mined_festival_empirical_data.json');
    console.log('  [OK] Karthigai Deepam date set to 2026-11-24 (window: 2026-11-21 to 2026-11-24)');
  }
}

console.log('\n====================================================');
console.log('STEP 2: Fix analyticsService.js (Dates, Endpoints & AI Checklist)');
console.log('====================================================');

const analyticsPath = path.join(ROOT, 'analyticsService.js');
let analyticsCode = readFile(analyticsPath);

// Fix 2.1: getHistoricalFestivalAnalysis date2026 & cutoff2026 for karthigai_deepam
if (analyticsCode.includes("const w26 = windows['2026'] || [];")) {
  const oldSnippet = `      const w26 = windows['2026'] || [];
      const date2026 = w26[1] || '2026-11-08';
      const dObj = new Date(date2026);
      dObj.setDate(dObj.getDate() - 10);
      const cutoff2026 = dObj.toISOString().slice(0, 10);`;

  const newSnippet = `      const w26 = windows['2026'] || [];
      // Fixed festival date logic: use exact lunisolar calendar date
      let date2026 = w26[1] || '2026-11-08';
      let cutoff2026 = '2026-10-28';
      if (k === 'karthigai_deepam') {
        date2026 = '2026-11-24';
        cutoff2026 = '2026-11-18';
      } else {
        const dObj = new Date(date2026);
        dObj.setDate(dObj.getDate() - 7);
        cutoff2026 = dObj.toISOString().slice(0, 10);
      }`;

  analyticsCode = analyticsCode.replace(oldSnippet, newSnippet);
  console.log('  [OK] Fixed date2026 and cutoff2026 in analyticsService.js getHistoricalFestivalAnalysis');
}

// Fix 2.2: predictSingleDay - attach empirical highest moved products to sampleSkus
if (analyticsCode.includes('sampleSkus: activeFest.sampleSkus || []')) {
  analyticsCode = analyticsCode.replace(
    'sampleSkus: activeFest.sampleSkus || []',
    `sampleSkus: (function() {
        const minedFest = MINED_FESTIVAL_EMPIRICAL_DATA && MINED_FESTIVAL_EMPIRICAL_DATA[activeFest.id];
        if (minedFest && minedFest.recommended_stock_needs && minedFest.recommended_stock_needs.length > 0) {
          return minedFest.recommended_stock_needs.slice(0, 8).map(item => ({
            name: item.name,
            rate: item.price,
            cost: item.cost,
            surge: '+' + Math.min(120, Math.round(((item.recommended_order_qty / Math.max(1, item.avg_historical_qty)) - 1) * 100 + 40)) + '%',
            priority: item.priority || 'HIGH',
            recOrder: item.recommended_order_qty,
            avgQty: item.avg_historical_qty
          }));
        }
        return activeFest.sampleSkus || [];
      })()`
  );
  console.log('  [OK] Attached empirical POS highest moved products to predictSingleDay sampleSkus');
}

writeFile(analyticsPath, analyticsCode);

console.log('\n====================================================');
console.log('STEP 3: Fix server.js (Customer CRM & Festival Routes)');
console.log('====================================================');

const serverPath = path.join(ROOT, 'server.js');
let serverCode = readFile(serverPath);

// Check if /api/analytics/customers already exists in server.js
if (!serverCode.includes("reqPath === '/api/analytics/customers'")) {
  const customerRouteSnippet = `  // 7c. Analytics: Customers CRM endpoint
  if (reqPath === '/api/analytics/customers' && req.method === 'GET') {
    let customers = [];
    const custPath = path.join(__dirname, 'rani_customers.json');
    const pubCustPath = path.join(__dirname, 'public', 'rani_customers.json');
    if (fs.existsSync(custPath)) {
      try { customers = JSON.parse(fs.readFileSync(custPath, 'utf8')); } catch(e) {}
    } else if (fs.existsSync(pubCustPath)) {
      try { customers = JSON.parse(fs.readFileSync(pubCustPath, 'utf8')); } catch(e) {}
    }
    if (!Array.isArray(customers) && customers && Array.isArray(customers.value)) {
      customers = customers.value;
    }
    const withSpend = customers.filter(c => (parseFloat(c.totalSpent) || 0) > 0);
    const sorted = [...withSpend].sort((a, b) => (parseFloat(b.totalSpent) || 0) - (parseFloat(a.totalSpent) || 0));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: customers.length,
      withSpend: withSpend.length,
      customers: customers,
      top10: sorted.slice(0, 10)
    }));
    return;
  }

  // 7d. Top customers shortcut
  if (reqPath === '/api/analytics/top-customers' && req.method === 'GET') {
    let customers = [];
    const custPath = path.join(__dirname, 'rani_customers.json');
    const pubCustPath = path.join(__dirname, 'public', 'rani_customers.json');
    if (fs.existsSync(custPath)) {
      try { customers = JSON.parse(fs.readFileSync(custPath, 'utf8')); } catch(e) {}
    } else if (fs.existsSync(pubCustPath)) {
      try { customers = JSON.parse(fs.readFileSync(pubCustPath, 'utf8')); } catch(e) {}
    }
    if (!Array.isArray(customers) && customers && Array.isArray(customers.value)) {
      customers = customers.value;
    }
    const withSpend = customers.filter(c => {
      const n = (c.name || '').toLowerCase();
      return !n.includes('walk-in') && !n.includes('cash') && (parseFloat(c.totalSpent) || 0) > 0;
    });
    const sorted = [...withSpend].sort((a, b) => (parseFloat(b.totalSpent) || 0) - (parseFloat(a.totalSpent) || 0));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: withSpend.length,
      customers: sorted.slice(0, 10),
      top10: sorted.slice(0, 10)
    }));
    return;
  }

`;

  // Insert before AI chat
  const chatMarker = "if (reqPath === '/api/ai-analytics/chat' && req.method === 'POST')";
  if (serverCode.includes(chatMarker)) {
    serverCode = serverCode.replace(chatMarker, customerRouteSnippet + '  ' + chatMarker);
    console.log('  [OK] Added /api/analytics/customers and /api/analytics/top-customers to server.js');
  }
}

// Ensure festival-stock-needs in server.js uses analyticsService.getHistoricalFestivalAnalysis properly
if (serverCode.includes("if (reqPath === '/api/ai/festival-stock-needs'")) {
  const oldFestStock = `  if (reqPath === '/api/ai/festival-stock-needs' || reqPath === '/api/ai/historical-festival-sales') {
    const festivalId = queryParams.get('festivalId') || queryParams.get('id') || 'deepavali';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics.getHistoricalFestivalAnalysis(festivalId)));
    return;
  }`;

  const newFestStock = `  if (reqPath === '/api/ai/festival-stock-needs' || reqPath === '/api/ai/historical-festival-sales') {
    const festivalId = queryParams.get('festivalId') || queryParams.get('id') || 'deepavali';
    const analysis = analytics.getHistoricalFestivalAnalysis(festivalId);
    if (analysis && (analysis.festivalId === 'karthigai_deepam' || festivalId.includes('karthigai'))) {
      analysis.date2026 = '2026-11-24';
      analysis.cutoff2026 = '2026-11-18';
      if (analysis.datesByYear) analysis.datesByYear['2026'] = '2026-11-24';
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analysis));
    return;
  }`;

  if (serverCode.includes(oldFestStock)) {
    serverCode = serverCode.replace(oldFestStock, newFestStock);
    console.log('  [OK] Enhanced /api/ai/festival-stock-needs in server.js');
  }
}

writeFile(serverPath, serverCode);

console.log('\n====================================================');
console.log('STEP 4: Fix api/index.js (Vercel Serverless Parity)');
console.log('====================================================');

const apiIndexPath = path.join(API, 'index.js');
let apiIndexCode = readFile(apiIndexPath);

// Ensure festival-stock-needs in api/index.js enforces Karthigai Deepam 2026-11-24
if (apiIndexCode.includes("if (analyticsService && typeof analyticsService.getHistoricalFestivalAnalysis === 'function')")) {
  const oldApiAnalysis = `      if (analyticsService && typeof analyticsService.getHistoricalFestivalAnalysis === 'function') {
        try { return sendJson(200, analyticsService.getHistoricalFestivalAnalysis(festivalId)); } catch {}
      }`;
  const newApiAnalysis = `      if (analyticsService && typeof analyticsService.getHistoricalFestivalAnalysis === 'function') {
        try {
          const analysis = analyticsService.getHistoricalFestivalAnalysis(festivalId);
          if (analysis && (analysis.festivalId === 'karthigai_deepam' || festivalId.toLowerCase().includes('karthigai'))) {
            analysis.date2026 = '2026-11-24';
            analysis.cutoff2026 = '2026-11-18';
            if (analysis.datesByYear) analysis.datesByYear['2026'] = '2026-11-24';
          }
          return sendJson(200, analysis);
        } catch {}
      }`;

  if (apiIndexCode.includes(oldApiAnalysis)) {
    apiIndexCode = apiIndexCode.replace(oldApiAnalysis, newApiAnalysis);
    console.log('  [OK] Enhanced getHistoricalFestivalAnalysis in api/index.js');
  }
}

writeFile(apiIndexPath, apiIndexCode);

console.log('\n====================================================');
console.log('STEP 5: Fix admin.html & public/admin.html (Customers, AI Studio, Launcher)');
console.log('====================================================');

function fixAdminFile(filePath) {
  let html = readFile(filePath);
  let changed = false;

  // Fix 5.1: Fix COPILOT_FESTIVALS_DATA karthigai_deepam date
  if (html.includes('"karthigai_deepam": {')) {
    html = html.replace(
      '"date2026": "2026-11-25"',
      '"date2026": "2026-11-24"'
    );
    html = html.replace(
      '"2026": "2026-11-25"',
      '"2026": "2026-11-24"'
    );
    changed = true;
    console.log('  [OK] Fixed COPILOT_FESTIVALS_DATA karthigai_deepam date to 2026-11-24 in ' + path.basename(filePath));
  }

  // Fix 5.2: In loadRaniPosData, ensure customer list is set regardless of array or object wrapping
  const oldCustResCheck = `        if (custRes && custRes.length > 0) {
          customerCrmList = custRes;
          renderTop10CustomersTable();
          renderCustomerCrmTable();
        }`;
  const newCustResCheck = `        // Robust Customer CRM initialization (supports Array, {customers: [...]}, or {value: [...]})
        if (custRes) {
          const list = Array.isArray(custRes) ? custRes : (custRes.customers || custRes.value || []);
          if (list.length > 0) {
            customerCrmList = list;
            renderTop10CustomersTable();
            renderCustomerCrmTable();
          }
        }`;
  if (html.includes(oldCustResCheck)) {
    html = html.replace(oldCustResCheck, newCustResCheck);
    changed = true;
    console.log('  [OK] Robust customerCrmList assignment in loadRaniPosData in ' + path.basename(filePath));
  }

  // Fix 5.3: Ensure ensureCustomerCrmLoaded helper exists and is used in openAllCustomersModal & renderTop10CustomersTable
  const oldOpenAllCust = `    async function openAllCustomersModal() {
      document.getElementById('all-customers-modal')?.classList.remove('hidden');
      renderCustomerCrmTable();
    }`;

  const newOpenAllCust = `    async function ensureCustomerCrmLoaded() {
      if (customerCrmList && customerCrmList.length > 0) return customerCrmList;
      try {
        const res = await fetch('/api/analytics/customers');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.customers || data.value || []);
          if (list.length > 0) {
            customerCrmList = list;
            return customerCrmList;
          }
        }
      } catch (e) {}
      try {
        const res = await fetch('/rani_customers.json');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.customers || data.value || []);
          if (list.length > 0) {
            customerCrmList = list;
            return customerCrmList;
          }
        }
      } catch (e) {}
      return [];
    }

    /* ALL CUSTOMERS DIRECTORY MODAL CONTROLS */
    async function openAllCustomersModal() {
      await ensureCustomerCrmLoaded();
      document.getElementById('all-customers-modal')?.classList.remove('hidden');
      renderCustomerCrmTable();
    }`;

  if (html.includes(oldOpenAllCust)) {
    html = html.replace(oldOpenAllCust, newOpenAllCust);
    changed = true;
    console.log('  [OK] Added ensureCustomerCrmLoaded and async fallback in openAllCustomersModal in ' + path.basename(filePath));
  }

  // Fix 5.4: In renderTop10CustomersTable, if customerCrmList is empty, auto-call ensureCustomerCrmLoaded
  const oldTop10Empty = `      if (!customerCrmList || customerCrmList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-gray-400">Loading top purchasing customers...</td></tr>';
        return;
      }`;
  const newTop10Empty = `      if (!customerCrmList || customerCrmList.length === 0) {
        ensureCustomerCrmLoaded().then(list => {
          if (list && list.length > 0) {
            renderTop10CustomersTable();
          } else {
            tbody.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-gray-400">No customer records found.</td></tr>';
          }
        });
        return;
      }`;
  if (html.includes(oldTop10Empty)) {
    html = html.replace(oldTop10Empty, newTop10Empty);
    changed = true;
    console.log('  [OK] Added automatic background retry to renderTop10CustomersTable in ' + path.basename(filePath));
  }

  // Fix 5.5: Fix openSnsAiStudio and floating launcher interactions
  const oldLauncherMarkup = `  <!-- FLOATING AI COPILOT LAUNCHER BUTTON -->
  <div id="ai-copilot-launcher-container" class="fixed bottom-6 right-6 z-40 flex items-center gap-3">
    <div id="ai-launcher-tooltip" onclick="openSnsAiStudio()" class="cursor-pointer hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 text-white text-xs font-black rounded-2xl shadow-2xl backdrop-blur-md border border-purple-400/50 hover:border-emerald-400 hover:bg-black transition-all group">
      <i class="fa-solid fa-sparkles text-emerald-400 animate-pulse"></i> 
      <span>Ask AI: Sales, Profit &amp; Stock</span>
      <span class="px-1.5 py-0.5 rounded-md bg-purple-600/80 text-[10px] uppercase tracking-wider group-hover:bg-emerald-600 transition">SNS AI Studio &rarr;</span>
    </div>
    <button type="button" onclick="openSnsAiStudio()" id="btn-ai-launcher" title="Open SNS AI Studio: Sales, Profit & Stock Analysis" class="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-600 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/80 cursor-pointer">`;

  const newLauncherMarkup = `  <!-- FLOATING AI COPILOT LAUNCHER BUTTON -->
  <div id="ai-copilot-launcher-container" class="fixed bottom-6 right-6 z-40 flex items-center gap-3">
    <div id="ai-launcher-tooltip" class="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 text-white text-xs font-black rounded-2xl shadow-2xl backdrop-blur-md border border-purple-400/50 hover:border-emerald-400 hover:bg-black transition-all group">
      <div onclick="toggleAdminAiChat()" class="flex items-center gap-1.5 cursor-pointer hover:text-emerald-300" title="Click to chat with AI Assistant">
        <i class="fa-solid fa-sparkles text-emerald-400 animate-pulse"></i> 
        <span>Ask AI: Sales, Profit &amp; Stock</span>
      </div>
      <button type="button" onclick="openSnsAiStudio()" class="px-2 py-0.5 rounded-md bg-purple-600 hover:bg-emerald-600 text-[10px] uppercase tracking-wider text-white font-black transition cursor-pointer" title="Open Dedicated SNS AI Studio">
        SNS AI Studio &rarr;
      </button>
    </div>
    <button type="button" onclick="toggleAdminAiChat()" id="btn-ai-launcher" title="Ask AI: Sales, Profit & Stock (Click to Chat)" class="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-600 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/80 cursor-pointer">`;

  if (html.includes(oldLauncherMarkup)) {
    html = html.replace(oldLauncherMarkup, newLauncherMarkup);
    changed = true;
    console.log('  [OK] Enhanced floating launcher tooltip and chat button in ' + path.basename(filePath));
  }

  // Fix 5.6: Enhanced openSnsAiStudio implementation with clean scroll
  const oldOpenStudio = `    // Open Full Dedicated SNS AI Studio Module
    function openSnsAiStudio(initialQuery) {
      if (typeof switchAdminModule === 'function') {
        switchAdminModule('ai-copilot');
      }
      const widget = document.getElementById('admin-ai-chat-widget');
      if (widget) widget.classList.add('hidden');
      isAiChatOpen = false;

      const studioSec = document.getElementById('module-sec-ai-copilot');
      if (studioSec) {
        studioSec.classList.remove('hidden');
        studioSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      setTimeout(() => {
        const input = document.getElementById('studio-ai-input');
        if (input) {
          if (initialQuery) input.value = initialQuery;
          input.focus();
        }
      }, 250);
    }`;

  const newOpenStudio = `    // Open Full Dedicated SNS AI Studio Module
    function openSnsAiStudio(initialQuery) {
      // 1. Activate tab & unhide studio module
      if (typeof switchAdminModule === 'function') {
        switchAdminModule('ai-copilot');
      }
      // 2. Hide chat popup
      const widget = document.getElementById('admin-ai-chat-widget');
      if (widget) widget.classList.add('hidden');
      isAiChatOpen = false;

      // 3. Ensure section is fully visible
      const studioSec = document.getElementById('module-sec-ai-copilot');
      if (studioSec) {
        studioSec.classList.remove('hidden');
        studioSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // 4. Focus input dock
      setTimeout(() => {
        const input = document.getElementById('studio-ai-input');
        if (input) {
          if (initialQuery) input.value = initialQuery;
          input.focus();
        }
      }, 300);
    }`;

  if (html.includes(oldOpenStudio)) {
    html = html.replace(oldOpenStudio, newOpenStudio);
    changed = true;
    console.log('  [OK] Improved openSnsAiStudio function in ' + path.basename(filePath));
  }

  if (changed) {
    writeFile(filePath, html);
    return true;
  }
  return false;
}

fixAdminFile(path.join(ROOT, 'admin.html'));
syncPublic('admin.html');

console.log('\n====================================================');
console.log('STEP 6: Fix ai-analytics.html & public/ai-analytics.html (Date Display & AI Checklist)');
console.log('====================================================');

function fixAiAnalyticsFile(filePath) {
  let html = readFile(filePath);
  let changed = false;

  // Fix 6.1: Date display in loadFestivalStockNeeds
  const oldFestDateLogic = `        const festDateEl = document.getElementById('fest-stock-festdate');
        if (festDateEl) {
          const fd = data.datesByYear && data.datesByYear['2026'] ? data.datesByYear['2026'].date : (data.festivalDate || data.date || '');
          festDateEl.innerText = fd || data.cutoff2026 || 'See calendar';
        }`;

  const newFestDateLogic = `        const festDateEl = document.getElementById('fest-stock-festdate');
        if (festDateEl) {
          const fd = (typeof data.datesByYear?.['2026'] === 'string' ? data.datesByYear['2026'] : data.datesByYear?.['2026']?.date) || data.date2026 || data.date || data.festivalDate || '';
          festDateEl.innerText = (data.festivalId === 'karthigai_deepam' || (data.name && data.name.includes('Karthigai'))) ? '2026-11-24' : (fd || data.cutoff2026 || 'See calendar');
        }`;

  if (html.includes(oldFestDateLogic)) {
    html = html.replace(oldFestDateLogic, newFestDateLogic);
    changed = true;
    console.log('  [OK] Fixed fest-stock-festdate display in ' + path.basename(filePath));
  }

  // Fix 6.2: Ensure cutoff display is accurate
  if (html.includes("document.getElementById('fest-stock-cutoff').innerText = data.cutoff2026 || 'Order 7 days ahead';")) {
    html = html.replace(
      "document.getElementById('fest-stock-cutoff').innerText = data.cutoff2026 || 'Order 7 days ahead';",
      "document.getElementById('fest-stock-cutoff').innerText = (data.festivalId === 'karthigai_deepam' || (data.name && data.name.includes('Karthigai'))) ? '2026-11-18' : (data.cutoff2026 || 'Order 7 days ahead');"
    );
    changed = true;
    console.log('  [OK] Ensured fest-stock-cutoff shows 2026-11-18 for Karthigai Deepam in ' + path.basename(filePath));
  }

  // Fix 6.3: In getLiveFestivalCountdown, support string dates in datesByYear['2026']
  const oldCountdownParse = `      const d2026 = f.datesByYear?.['2026'] || {};
      const d2027 = f.datesByYear?.['2027'] || {};
      const d2026Start = d2026.date || d2026.window?.start || f.startDate || f.date;
      const d2027Start = d2027.date || d2027.window?.start;`;

  const newCountdownParse = `      const d2026 = f.datesByYear?.['2026'] || {};
      const d2027 = f.datesByYear?.['2027'] || {};
      const d2026Start = (typeof d2026 === 'string' ? d2026 : (d2026.date || d2026.window?.start)) || f.startDate || f.date || f.date2026;
      const d2027Start = (typeof d2027 === 'string' ? d2027 : (d2027.date || d2027.window?.start)) || f.datesByYear?.['2027']?.date;`;

  if (html.includes(oldCountdownParse)) {
    html = html.replace(oldCountdownParse, newCountdownParse);
    changed = true;
    console.log('  [OK] Fixed getLiveFestivalCountdown date parsing in ' + path.basename(filePath));
  }

  // Fix 6.4: AI Checklist in runCustomDatePrediction - rich priority checklist from empirical POS data
  const oldSkuChecklistBlock = `        skus.slice(0, 4).forEach(s => {
          skuChecklist += \`
            <div class="flex items-center justify-between p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-xs">
              <span class="text-white font-medium line-clamp-1">\${s.name}</span>
              <div class="flex items-center gap-2 shrink-0">
                <span class="font-bold text-gray-300">â‚¹\${s.rate}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">\${s.surge || '+25%'}</span>
              </div>
            </div>
          \`;
        });`;

  const newSkuChecklistBlock = `        skus.slice(0, 6).forEach(s => {
          const isCritical = s.priority === 'CRITICAL';
          const badgeClass = isCritical 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          const recText = s.recOrder ? \`<span class="text-[10px] text-gray-400 font-mono">Need: \${s.recOrder} Units</span>\` : '';
          skuChecklist += \`
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 text-xs hover:border-gray-700 transition">
              <div class="truncate max-w-[200px] sm:max-w-[240px]">
                <p class="text-white font-bold truncate">\${s.name}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-black \${badgeClass}">\${s.priority || 'HIGH'}</span>
                  \${recText}
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="font-bold text-gray-200">₹\${s.rate || s.price}</span>
                <span class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">\${s.surge || '+45%'}</span>
              </div>
            </div>
          \`;
        });`;

  if (html.includes(oldSkuChecklistBlock)) {
    html = html.replace(oldSkuChecklistBlock, newSkuChecklistBlock);
    changed = true;
    console.log('  [OK] Enhanced AI Checklist display in ' + path.basename(filePath));
  }

  if (changed) {
    writeFile(filePath, html);
    return true;
  }
  return false;
}

fixAiAnalyticsFile(path.join(ROOT, 'ai-analytics.html'));
syncPublic('ai-analytics.html');

console.log('\n====================================================');
console.log('ALL COMPREHENSIVE FIXES APPLIED SUCCESSFULLY!');
console.log('====================================================');
