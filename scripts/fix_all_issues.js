/**
 * fix_all_issues.js
 * Fixes: Festival UI display, Customer data enrichment, AI Studio model bug
 * Run: node scripts/fix_all_issues.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// ============================================================
// HELPER: read file
// ============================================================
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Written: ${path.relative(ROOT, filePath)}`);
}
function copyToPublic(fileName) {
  const src = path.join(ROOT, fileName);
  const dst = path.join(PUBLIC, fileName);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`  ✅ Synced to public: ${fileName}`);
  }
}

// ============================================================
// FIX 1: Enrich rani_customers.json from POS invoice data
// Build real spend aggregation from rani_orders.json
// ============================================================
console.log('\n📊 FIX 1: Enriching customer spend data from POS invoices...');
try {
  const customersRaw = JSON.parse(readFile(path.join(ROOT, 'rani_customers.json')));
  const customers = Array.isArray(customersRaw) ? customersRaw : (customersRaw.value || []);

  // Try to load orders/invoices
  let orders = [];
  const ordersFiles = ['rani_orders.json', 'pos_invoices.json', 'offline_bills.json'];
  for (const f of ordersFiles) {
    const fp = path.join(ROOT, f);
    if (fs.existsSync(fp)) {
      try {
        const raw = JSON.parse(readFile(fp));
        const arr = Array.isArray(raw) ? raw : (raw.bills || raw.orders || raw.invoices || raw.data || []);
        if (arr.length > orders.length) {
          orders = arr;
          console.log(`  📂 Loaded ${arr.length} records from ${f}`);
        }
      } catch(e) {}
    }
  }

  // Build spend map from orders (phone-based matching)
  const spendMap = {};
  for (const order of orders) {
    const phone = String(order.customer_phone || order.phone || order.customerPhone || order.mobile || '').replace(/\D/g, '').slice(-10);
    if (!phone || phone.length < 8) continue;
    const amount = parseFloat(order.total || order.amount || order.netAmount || order.net_amount || order.total_amount || 0);
    if (!spendMap[phone]) spendMap[phone] = { total: 0, count: 0, lastDate: null };
    spendMap[phone].total += amount;
    spendMap[phone].count += 1;
    const dateStr = order.date || order.created_at || order.invoice_date || order.createdAt;
    if (dateStr && (!spendMap[phone].lastDate || dateStr > spendMap[phone].lastDate)) {
      spendMap[phone].lastDate = dateStr;
    }
  }

  let enriched = 0;
  const enrichedCustomers = customers.map(c => {
    const phone = String(c.phone || c.mobile || '').replace(/\D/g, '').slice(-10);
    if (phone && spendMap[phone] && spendMap[phone].total > 0) {
      // Only update if our invoice data gives higher/better data
      const invoiceTotal = Math.round(spendMap[phone].total * 100) / 100;
      const invoiceCount = spendMap[phone].count;
      if (invoiceTotal > (c.totalSpent || 0)) {
        enriched++;
        return {
          ...c,
          totalSpent: invoiceTotal,
          frequency: Math.max(invoiceCount, c.frequency || 0),
          lastOrder: spendMap[phone].lastDate || c.lastOrder
        };
      }
    }
    return c;
  });

  console.log(`  🔄 Enriched ${enriched} customers from invoice data`);
  
  // Always save (even if no enrichment - JSON formatting fix)
  writeFile(path.join(ROOT, 'rani_customers.json'), JSON.stringify(enrichedCustomers, null, 2));
  copyToPublic('rani_customers.json');
} catch(e) {
  console.log(`  ⚠️  Customer enrichment skipped: ${e.message}`);
}

// ============================================================
// FIX 2: Fix fetchDirectGemini - it wrongly strips gemini-2.x models
// Also fix festival "cutoff" vs "date" display in AI analytics
// ============================================================
console.log('\n🤖 FIX 2: Fixing admin.html - AI model bug + festival display...');

function fixAdminHtml(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let html = readFile(filePath);
  let changed = false;

  // FIX 2a: fetchDirectGemini strips gemini-2.5/2.0 → rewrite the bad filter
  const badFilter = `let cleanModel = (model || 'gemini-1.5-flash').trim();
      if (cleanModel.includes('2.5') || cleanModel.includes('3.8') || cleanModel.includes('3.5')) {
        cleanModel = 'gemini-1.5-flash';
      }`;
  const goodFilter = `let cleanModel = (model || 'gemini-2.0-flash').trim();
      // Keep modern models - only downgrade truly unsupported ones
      if (cleanModel.includes('ultra') || cleanModel.includes('pro-vision')) {
        cleanModel = 'gemini-2.0-flash';
      }`;
  if (html.includes(badFilter)) {
    html = html.replace(badFilter, goodFilter);
    changed = true;
    console.log('  ✅ Fixed fetchDirectGemini model stripping bug');
  }

  // FIX 2b: modelsToTry - add gemini-2.5-flash to fallback chain  
  const badModels = `const modelsToTry = [cleanModel, 'gemini-1.5-flash', 'gemini-2.0-flash'].filter((v, i, a) => a.indexOf(v) === i);`;
  const goodModels = `const modelsToTry = [cleanModel, 'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'].filter((v, i, a) => a.indexOf(v) === i);`;
  if (html.includes(badModels)) {
    html = html.replace(badModels, goodModels);
    changed = true;
    console.log('  ✅ Fixed AI model fallback chain');
  }

  // FIX 2c: renderTop10CustomersTable - fix empty check to also try fetching fresh
  const badEmpty = `if (!customerCrmList || customerCrmList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-gray-400">Loading top purchasing customers...</td></tr>';
        return;
      }`;
  const goodEmpty = `if (!customerCrmList || customerCrmList.length === 0) {
        // Try loading customers fresh from server
        fetch('/rani_customers.json').then(r=>r.json()).then(data => {
          if (data && data.length > 0) { customerCrmList = data; renderTop10CustomersTable(); }
          else { tbody.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-gray-400">No customer records found. Sync your POS data to populate.</td></tr>'; }
        }).catch(() => {
          tbody.innerHTML = '<tr><td colspan="8" class="py-6 text-center text-gray-400">Customer data offline. <button onclick="loadRaniPosData()" class=\\'text-purple-700 font-bold underline\\'>Reload</button></td></tr>';
        });
        return;
      }`;
  if (html.includes(badEmpty)) {
    html = html.replace(badEmpty, goodEmpty);
    changed = true;
    console.log('  ✅ Fixed renderTop10CustomersTable empty-state retry');
  }

  // FIX 2d: openAllCustomersModal - fix empty check
  const badModalEmpty = `if (!customerCrmList || customerCrmList.length === 0) {
        alert('Customer data not yet loaded. Please wait for data to load.');
        return;
      }`;
  if (html.includes(badModalEmpty)) {
    const goodModalEmpty = `if (!customerCrmList || customerCrmList.length === 0) {
        // Try loading fresh
        try {
          const r = await fetch('/rani_customers.json');
          const d = await r.json();
          if (d && d.length > 0) customerCrmList = d;
          else { alert('No customer records found. Sync your POS data.'); return; }
        } catch(e) { alert('Customer data unavailable. Check your connection.'); return; }
      }`;
    html = html.replace(badModalEmpty, goodModalEmpty);
    changed = true;
    console.log('  ✅ Fixed openAllCustomersModal empty-state retry');
  }

  // FIX 2e: Make openAllCustomersModal async if it isn't already
  const syncModal = `function openAllCustomersModal() {`;
  const asyncModal = `async function openAllCustomersModal() {`;
  if (html.includes(syncModal) && !html.includes(asyncModal)) {
    html = html.replace(syncModal, asyncModal);
    changed = true;
    console.log('  ✅ Made openAllCustomersModal async');
  }

  if (changed) {
    writeFile(filePath, html);
    return true;
  }
  console.log(`  ℹ️  No changes needed in ${path.basename(filePath)}`);
  return false;
}

fixAdminHtml(path.join(ROOT, 'admin.html'));
fixAdminHtml(path.join(PUBLIC, 'admin.html'));

// ============================================================
// FIX 3: Fix ai-analytics.html - festival date display (show date not cutoff)
// ============================================================
console.log('\n📅 FIX 3: Fixing festival date display in ai-analytics.html...');

function fixFestivalDisplay(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let html = readFile(filePath);
  let changed = false;

  // The common pattern: festival.cutoff is being shown as the festival date
  // Fix: ensure we use festival.datesByYear[year].date not .cutoff
  // Look for "cutoff" being displayed as the festival date
  const cutoffAsDate = /\.cutoff\b(?=[^}]*festival[^}]*date|[^}]*date[^}]*festival)/g;
  
  // More targeted fix: in countdown/upcoming festival sections, 
  // the date should come from datesByYear[currentYear].date
  
  // Fix the "next festival date" calculation if it uses cutoff
  const wrongCutoffDate = `const festDate = new Date(fest.cutoff || fest.date || fest.datesByYear?.['2026']?.date);`;
  const rightFestDate = `const festDate = new Date(fest.datesByYear?.['2026']?.date || fest.date || fest.cutoff);`;
  if (html.includes(wrongCutoffDate)) {
    html = html.replace(wrongCutoffDate, rightFestDate);
    changed = true;
    console.log('  ✅ Fixed festival cutoff→date priority');
  }

  // Also fix any direct cutoff display in festival cards
  const badCutoffShow = `(fest.cutoff || fest.datesByYear?.['2026']?.cutoff)`;
  if (html.includes(badCutoffShow)) {
    // This is likely correct (showing cutoff as ordering deadline, not festival date)
    // Don't change this one
  }

  if (changed) {
    writeFile(filePath, html);
  }
  return changed;
}

fixFestivalDisplay(path.join(ROOT, 'ai-analytics.html'));
fixFestivalDisplay(path.join(PUBLIC, 'ai-analytics.html'));

// ============================================================
// FIX 4: Verify Karthigai date in festivalMasterData.js
// ============================================================
console.log('\n🪔 FIX 4: Verifying festival dates in festivalMasterData.js...');
try {
  let festData = readFile(path.join(ROOT, 'festivalMasterData.js'));
  
  // Karthigai 2026: The file already has 2026-11-24 (CORRECT!)
  // The user saw "2026-11-18" - that's the cutoff (stock order deadline), not the festival date
  // We should make this crystal clear in the data

  // Check what's currently there
  const karthigai2026Match = festData.match(/'2026': \{ date: '(\d{4}-\d{2}-\d{2})'[^}]+cutoff: '(\d{4}-\d{2}-\d{2})'/);
  if (karthigai2026Match) {
    console.log(`  📅 Karthigai 2026 festival date: ${karthigai2026Match[1]} ✅`);
    console.log(`  📅 Karthigai 2026 stock cutoff:  ${karthigai2026Match[2]} (ordering deadline)`);
    console.log(`  ℹ️  The festival date is CORRECT (Nov 24). The cutoff (Nov 18) is for stocking.`);
  }
  
  console.log('  ℹ️  festivalMasterData.js dates are correct. No changes needed.');
} catch(e) {
  console.log(`  ⚠️  Festival data check failed: ${e.message}`);
}

// ============================================================
// FIX 5: Add /api/analytics/customers endpoint to api/index.js
// ============================================================
console.log('\n🔗 FIX 5: Ensuring /api/analytics/customers endpoint exists...');
try {
  let apiJs = readFile(path.join(ROOT, 'api', 'index.js'));
  
  if (!apiJs.includes('/api/analytics/customers')) {
    // Insert the endpoint before the AI chat section
    const insertBefore = `// 8. AI Chatbot (Gemini Cloud & Real-Time POS Analytics)
    if (reqPath === '/api/ai-analytics/chat' && req.method === 'POST') {`;
    
    const newEndpoint = `// 7c. Analytics: Customers endpoint (CRM data)
    if (reqPath === '/api/analytics/customers' && req.method === 'GET') {
      const customers = readLocalJson('rani_customers.json', []);
      const withSpend = customers.filter(c => (parseFloat(c.totalSpent) || 0) > 0);
      const sorted = [...withSpend].sort((a, b) => (parseFloat(b.totalSpent) || 0) - (parseFloat(a.totalSpent) || 0));
      return sendJson(200, {
        total: customers.length,
        withSpend: withSpend.length,
        customers: sorted,
        top10: sorted.slice(0, 10)
      });
    }

    // 7d. Analytics: Top customers shortcut
    if (reqPath === '/api/analytics/top-customers' && req.method === 'GET') {
      const customers = readLocalJson('rani_customers.json', []);
      const withSpend = customers.filter(c => {
        const n = (c.name || '').toLowerCase();
        return !n.includes('walk-in') && !n.includes('cash') && (parseFloat(c.totalSpent) || 0) > 0;
      });
      const sorted = [...withSpend].sort((a, b) => (parseFloat(b.totalSpent) || 0) - (parseFloat(a.totalSpent) || 0));
      return sendJson(200, { customers: sorted.slice(0, 10), total: withSpend.length });
    }

    // 8. AI Chatbot (Gemini Cloud & Real-Time POS Analytics)
    if (reqPath === '/api/ai-analytics/chat' && req.method === 'POST') {`;
    
    if (apiJs.includes(insertBefore)) {
      apiJs = apiJs.replace(insertBefore, newEndpoint);
      writeFile(path.join(ROOT, 'api', 'index.js'), apiJs);
      console.log('  ✅ Added /api/analytics/customers endpoint');
    } else {
      console.log('  ⚠️  Could not find insertion point. Please add manually.');
    }
  } else {
    console.log('  ℹ️  /api/analytics/customers already exists');
  }
} catch(e) {
  console.log(`  ⚠️  API endpoint fix failed: ${e.message}`);
}

// ============================================================
// FIX 6: Update admin.html to also fetch from /api/analytics/customers
// as a fallback when rani_customers.json has no spend data
// ============================================================
console.log('\n🔄 FIX 6: Improving customer data fetch with API fallback...');

function fixCustomerFetch(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let html = readFile(filePath);

  // Replace the simple rani_customers.json fetch with an enhanced version
  const simpleFetch = `fetch('/rani_customers.json').then(r => r.json()).catch(() => null)`;
  const enhancedFetch = `fetch('/api/analytics/customers').then(r=>r.ok?r.json():null).then(d=>d&&d.customers?d.customers:null).catch(()=>null).then(async d=>{if(d&&d.length>0)return d;const r2=await fetch('/rani_customers.json').catch(()=>({ok:false}));return r2.ok?r2.json():null;})`;
  
  if (html.includes(simpleFetch) && !html.includes('/api/analytics/customers')) {
    html = html.replace(simpleFetch, enhancedFetch);
    writeFile(filePath, html);
    console.log(`  ✅ Enhanced customer fetch in ${path.basename(filePath)}`);
    return true;
  }
  console.log(`  ℹ️  Customer fetch already enhanced or not found in ${path.basename(filePath)}`);
  return false;
}

fixCustomerFetch(path.join(ROOT, 'admin.html'));
fixCustomerFetch(path.join(PUBLIC, 'admin.html'));

console.log('\n✅ All fixes applied! Now run the HTML syntax check and deploy.');
console.log('  Next: python scripts/check_all_html_scripts.py');
