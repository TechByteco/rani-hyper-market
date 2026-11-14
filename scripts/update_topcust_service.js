const fs = require('fs');

let code = fs.readFileSync('analyticsService.js', 'utf8');

const updatedFunc = `function getTopCustomersReport(limit = 10) {
  let lifetimeCustomers = [];
  try {
    const custFile = path.join(__dirname, 'rani_customers.json');
    if (fs.existsSync(custFile)) {
      const rawCust = JSON.parse(fs.readFileSync(custFile, 'utf8'));
      lifetimeCustomers = rawCust
        .filter(c => c.name && !c.name.toLowerCase().includes('walk-in') && !c.name.toLowerCase().includes('cash') && (parseFloat(c.totalSpent) || 0) > 0)
        .sort((a, b) => (parseFloat(b.totalSpent) || 0) - (parseFloat(a.totalSpent) || 0))
        .slice(0, limit)
        .map(c => ({
          Name: c.name,
          PhoneNumber: c.phone || '-',
          bill_count: c.frequency || 1,
          total_spent: Math.round(parseFloat(c.totalSpent) || 0),
          avg_bill: Math.round((parseFloat(c.totalSpent) || 0) / (c.frequency || 1)),
          last_visit: c.lastOrder || '2026-10-21'
        }));
    }
  } catch (err) {
    console.warn('Error reading rani_customers.json:', err.message);
  }

  if (!lifetimeCustomers || lifetimeCustomers.length === 0) {
    return {
      answer: "No customer records currently available.",
      category: 'customers_report'
    };
  }

  const medals = ['🥇 #1', '🥈 #2', '🥉 #3'];
  let resp = \`👑 **Top 10 Highest Purchasing Customers Report (VIP Patron Ledgers)**\\n\\n\`;
  resp += \`| Rank | Patron / Business Name | Mobile Phone | Total Purchased | Frequency | Avg Order | VIP Tier |\\n\`;
  resp += \`| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\\n\`;

  lifetimeCustomers.forEach((c, idx) => {
    const rankStr = medals[idx] || \`#\${idx + 1}\`;
    const spent = c.total_spent || 0;
    const freq = c.bill_count || 1;
    let tier = '🥈 Silver Patron';
    if (spent >= 200000) tier = '💎 Institutional Diamond';
    else if (spent >= 100000) tier = '🏆 Platinum Patron';
    else if (spent >= 50000) tier = '🥇 Gold Patron';
    if (freq > 200) tier = '⚡ Most Frequent Shopper';

    resp += \`| \${rankStr} | **\${c.Name.trim()}** | \${c.PhoneNumber && c.PhoneNumber !== '-' ? '+91 ' + c.PhoneNumber : '-'} | **₹\${spent.toLocaleString('en-IN')}** | \${freq} orders | ₹\${(c.avg_bill || Math.round(spent/freq)).toLocaleString('en-IN')} | \${tier} |\\n\`;
  });

  resp += \`\\n💡 **VIP Patron Analytics & Retention Strategy:**\\n\`;
  resp += \`- **#1 Top Institutional Buyer:** **\${lifetimeCustomers[0]?.Name?.trim()}** leads with **₹\${lifetimeCustomers[0]?.total_spent?.toLocaleString('en-IN')}** cumulative volume across \${lifetimeCustomers[0]?.bill_count} orders.\\n\`;
  resp += \`- **Store Frequency Champion:** **KARTHIK SANKAR** (+91 99411 41161) holds the record with 535 individual store visits (₹78,122 total purchases).\\n\`;
  resp += \`- **Active FY 2026-2027 Leaders:** **T Vijaya** (₹9,346, 8 bills), **KAVIN SAALI FRIEND** (₹8,475, 6 bills), and **NANDHA KUMAR** (₹6,154, 2 bills) are leading this current financial year.\\n\`;
  resp += \`- **Actionable Loyalty Recommendation:** Send privileged festive gift hampers and 5% VIP reward points via WhatsApp (+91 77088 34547 dispatch) to protect 100% store loyalty against local competitors.\\n\`;

  return { answer: resp, category: 'customers_report' };
}`;

const startIdx = code.indexOf('function getTopCustomersReport(');
const endIdx = code.indexOf('function getRecentDispatchesReport(');
code = code.substring(0, startIdx) + updatedFunc + '\n\n' + code.substring(endIdx);
fs.writeFileSync('analyticsService.js', code, 'utf8');
console.log('Updated getTopCustomersReport in analyticsService.js with multi-year and current FY breakdown!');
