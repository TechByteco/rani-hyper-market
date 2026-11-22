const fs = require('fs');
const path = require('path');
const planner = require('../services/festivalSurgePlannerService');

async function main() {
  console.log('Generating Festival Surge Planner Artifacts (2026–2035)...');

  // 1. Export Multi-Year Calendar (2026–2035)
  const multiYearCalendar = planner.exportMultiYearCalendar(2026, 2035);
  console.log('Generated multi-year calendar for years 2026–2035.');

  // 2. Export Active Purchase Orders (All 4 festivals for 2026 & 2027)
  const purchaseOrders = [];
  for (let y of [2026, 2027]) {
    const cal = planner.getFestivalCalendar(y);
    for (let f of cal.festivals) {
      purchaseOrders.push(f.purchase_order);
    }
  }
  console.log(`Generated ${purchaseOrders.length} Purchase Orders for 2026–2027.`);

  // 3. Stage All 4 Festival Campaigns with Full Copy
  const stagedCampaigns = [];
  const targetIds = ['pongal_harvest', 'chithirai_thiruvizha', 'ayudha_pooja', 'deepavali'];
  for (let fid of targetIds) {
    const cmp = await planner.stageFestivalBundleCampaign(fid, 2026);
    if (cmp) stagedCampaigns.push(cmp);
  }
  console.log(`Staged ${stagedCampaigns.length} festival promotional bundle campaigns.`);

  // Targets across tiers
  const targets = [
    {
      name: 'festival_surge_calendar_2026_2035.json',
      content: JSON.stringify(multiYearCalendar, null, 2),
      paths: [
        path.join(__dirname, '..', 'festival_surge_calendar_2026_2035.json'),
        path.join(__dirname, '..', 'data', 'festival_surge_calendar_2026_2035.json'),
        path.join(__dirname, '..', 'public', 'festival_surge_calendar_2026_2035.json'),
        path.join(__dirname, '..', 'api', 'data', 'festival_surge_calendar_2026_2035.json')
      ]
    },
    {
      name: 'automated_vendor_purchase_orders.json',
      content: JSON.stringify(purchaseOrders, null, 2),
      paths: [
        path.join(__dirname, '..', 'automated_vendor_purchase_orders.json'),
        path.join(__dirname, '..', 'data', 'automated_vendor_purchase_orders.json'),
        path.join(__dirname, '..', 'public', 'automated_vendor_purchase_orders.json'),
        path.join(__dirname, '..', 'api', 'data', 'automated_vendor_purchase_orders.json')
      ]
    },
    {
      name: 'staged_festival_campaigns.json',
      content: JSON.stringify(stagedCampaigns, null, 2),
      paths: [
        path.join(__dirname, '..', 'staged_festival_campaigns.json'),
        path.join(__dirname, '..', 'data', 'staged_festival_campaigns.json'),
        path.join(__dirname, '..', 'public', 'staged_festival_campaigns.json'),
        path.join(__dirname, '..', 'api', 'data', 'staged_festival_campaigns.json')
      ]
    }
  ];

  for (let item of targets) {
    for (let p of item.paths) {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(p, item.content, 'utf8');
      console.log(`Saved ${item.name} -> ${p}`);
    }
  }

  console.log('ALL FESTIVAL SURGE PLANNER ARTIFACTS WRITTEN SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal error generating artifacts:', err);
  process.exit(1);
});
