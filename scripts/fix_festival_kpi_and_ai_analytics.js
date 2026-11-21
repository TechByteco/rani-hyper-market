/**
 * fix_festival_kpi_and_ai_analytics.js
 * Fixes ai-analytics.html: adds Festival Date field, fixes JS date updates
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function fixAiAnalytics(filePath) {
  if (!fs.existsSync(filePath)) { console.log(`  SKIP: ${filePath} not found`); return false; }
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // FIX 1: Add Festival Date field to KPI bar
  // Replace grid-cols-4 with grid-cols-5 and insert new date field after Festival Event
  if (html.includes('sm:grid-cols-4 gap-3 mb-3 bg-gray-950/60') && !html.includes('fest-stock-festdate')) {
    html = html.replace(
      'sm:grid-cols-4 gap-3 mb-3 bg-gray-950/60',
      'sm:grid-cols-5 gap-3 mb-3 bg-gray-950/60'
    );
    // Insert Festival Date div after the fest-stock-name div
    html = html.replace(
      'id="fest-stock-name">Deepavali Mega Week</h5>\n          </div>\n          <div>\n            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reorder Budget</p>',
      'id="fest-stock-name">Deepavali Mega Week</h5>\n          </div>\n          <div>\n            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">\uD83D\uDCC5 Festival Date</p>\n            <h5 class="text-sm font-black text-blue-300 mt-0.5" id="fest-stock-festdate">2026-11-24</h5>\n          </div>\n          <div>\n            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reorder Budget</p>'
    );
    changed = true;
    console.log('  ✅ Added Festival Date field to KPI bar');
  }

  // FIX 2: Update the JS that populates the KPI bar to also set festdate
  // Find the section where fest-stock-cutoff is set and add fest-stock-festdate
  const cutoffSetOld = `document.getElementById('fest-stock-cutoff').innerText = data.cutoff2026 || 'Order 7 days ahead';`;
  const cutoffSetNew = `document.getElementById('fest-stock-cutoff').innerText = data.cutoff2026 || 'Order 7 days ahead';
        const festDateEl = document.getElementById('fest-stock-festdate');
        if (festDateEl) {
          const fd = data.datesByYear && data.datesByYear['2026'] ? data.datesByYear['2026'].date : (data.festivalDate || data.date || '');
          festDateEl.innerText = fd || data.cutoff2026 || 'See calendar';
        }`;
  if (html.includes(cutoffSetOld)) {
    html = html.replace(cutoffSetOld, cutoffSetNew);
    changed = true;
    console.log('  ✅ Fixed JS to populate Festival Date in KPI bar');
  }

  // FIX 3: Also update the Procure Cutoff label to be clearly labeled as "Order Cutoff"
  html = html.replace(
    '<p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Procure Cutoff</p>',
    '<p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">⚠️ Order Deadline</p>'
  );
  if (html.includes('⚠️ Order Deadline')) changed = true;

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅ Written: ${path.relative(ROOT, filePath)}`);
    return true;
  }
  console.log(`  ℹ️  No changes in ${path.basename(filePath)}`);
  return false;
}

console.log('\n📅 Fixing ai-analytics.html festival date display...');
fixAiAnalytics(path.join(ROOT, 'ai-analytics.html'));
fixAiAnalytics(path.join(PUBLIC, 'ai-analytics.html'));

// FIX 4: Fix fetchDirectGemini in admin.html that strips valid models
console.log('\n🤖 Verifying admin.html AI model fix...');
const adminPath = path.join(ROOT, 'admin.html');
if (fs.existsSync(adminPath)) {
  let adminHtml = fs.readFileSync(adminPath, 'utf8');
  if (adminHtml.includes("cleanModel.includes('2.5') || cleanModel.includes('3.8') || cleanModel.includes('3.5')")) {
    adminHtml = adminHtml.replace(
      `let cleanModel = (model || 'gemini-1.5-flash').trim();
      if (cleanModel.includes('2.5') || cleanModel.includes('3.8') || cleanModel.includes('3.5')) {
        cleanModel = 'gemini-1.5-flash';
      }`,
      `let cleanModel = (model || 'gemini-2.0-flash').trim();
      // Keep modern Gemini 2.x models - only downgrade truly legacy ones
      if (cleanModel.includes('ultra') || cleanModel.includes('pro-vision')) {
        cleanModel = 'gemini-2.0-flash';
      }`
    );
    fs.writeFileSync(adminPath, adminHtml, 'utf8');
    fs.copyFileSync(adminPath, path.join(PUBLIC, 'admin.html'));
    console.log('  ✅ Fixed fetchDirectGemini model stripping in admin.html');
  } else {
    console.log('  ✅ Model fix already applied');
  }
}

// Summary
console.log('\n✅ All ai-analytics and admin.html fixes applied!');
