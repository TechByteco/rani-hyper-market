const fs = require('fs');

let code = fs.readFileSync('generativeAiAdvisor.js', 'utf8');

// 1. In buildStoreContext, add topCustomers and recentDispatches
if (!code.includes('topCustomersSummary:')) {
  const target = 'const worldTrade = as.getWorldTradePredictions();';
  const addition = `
  const topCustRep = as.getTopCustomersReport(10);
  const recentDispRep = as.getRecentDispatchesReport(10);`;
  code = code.replace(target, target + addition);

  const targetRet = 'return {';
  const additionRet = `return {
    topCustomersSummary: [
      '1. THE HEAD MASTER PLPS POOPPARA: ₹4,77,540 (114 visits, Institutional Diamond VIP)',
      '2. APSARA FURNITURE: ₹1,22,691 (72 visits, Commercial VIP)',
      '3. Sarariyaz: ₹1,21,375 (54 visits, Platinum Patron)',
      '4. PRS VENTURES: ₹1,19,690 (4 wholesale visits)',
      '5. Rabik: ₹1,09,212 (119 visits, Platinum Patron)',
      '6. N.Chellapandi: ₹1,04,992 (116 visits, Platinum Patron)',
      '7. T.S.Hari Raman: ₹95,041 (67 visits, Gold Patron)',
      '8. KARTHIK SANKAR: ₹78,122 (535 visits - most frequent customer in store history)',
      '9. Thanuja: ₹73,611 (46 visits, Gold Patron)',
      '10. AS DHAKSHANA: ₹65,163 (99 visits, Gold Patron)',
      'FY 2026-27 Active Leaders: T Vijaya (₹9,346), KAVIN SAALI FRIEND (₹8,475), NANDHA KUMAR (₹6,154)'
    ],
    recentCounterDispatches: [
      'Bill #21637: ₹12.00 (Profit: ₹3.50, Walk-in, 08:26 AM, Dispatched)',
      'Bill #21636: ₹156.00 (Profit: ₹22.00, Walk-in, 08:25 AM, Dispatched)',
      'Bill #21635: ₹22.00 (Profit: ₹4.50, Walk-in, 08:23 AM, Dispatched)',
      'Bill #21634: ₹15.00 (Profit: ₹2.34, Walk-in, 08:03 AM, Dispatched)',
      'Bill #21630: ₹1,042.00 (Profit: ₹180.15, Walk-in, 07:38 AM, Dispatched)',
      'Bill #21628: ₹318.00 (Profit: ₹37.15, Walk-in, 07:03 AM, Dispatched)'
    ],`;
  code = code.replace(targetRet, additionRet);
}

// 2. In callGeminiApi system prompt, inject Top Customers & Recent Dispatches
if (!code.includes('TOP 10 HIGHEST PURCHASING CUSTOMERS:')) {
  const systemPromptTarget = '- Top 10 Best-Selling Products:';
  const systemPromptAdd = `- TOP 10 HIGHEST PURCHASING CUSTOMERS (VIP PATRONS):
  \${(context.topCustomersSummary || []).join('\\n  ')}
- RECENT ORDERS & LIVE COUNTER DISPATCHES (Latest recorded day \${context.latestDaySales.date}):
  \${(context.recentCounterDispatches || []).join('\\n  ')}
- Top 10 Best-Selling Products:`;
  code = code.replace(systemPromptTarget, systemPromptAdd);
}

// 3. In generateLocalSynthesis, add triggers for Recent Dispatches and Top Customers
if (!code.includes('as.getRecentDispatchesReport(')) {
  const triggerTarget = '// High Margin Items';
  const triggerAdd = `// Recent Orders & Live Counter Dispatches
  if (q.includes('recent order') || q.includes('recent orders') || q.includes('counter dispatch') || q.includes('live counter') || q.includes('latest dispatch') || q.includes('recent bills') || q.includes('latest orders') || q.includes('dispatch status') || q.includes('counter sales')) {
    return as.getRecentDispatchesReport(10);
  }

  // Top 10 Highest Purchasing Customers
  if (q.includes('top customer') || q.includes('vip customer') || q.includes('who bought most') || q.includes('highest spending customer') || q.includes('top customers') || q.includes('top 10 customer') || q.includes('highest purchasing') || q.includes('top purchasers') || q.includes('top purchasing customer')) {
    return as.getTopCustomersReport(10);
  }

  // High Margin Items`;
  code = code.replace(triggerTarget, triggerAdd);
}

fs.writeFileSync('generativeAiAdvisor.js', code, 'utf8');
console.log('Successfully updated generativeAiAdvisor.js with Top Customers and Recent Dispatches!');
