const path = require('path');
const analytics = require(path.resolve(__dirname, '../analyticsService.js'));

const testIds = [
  'karthigai_deepam',
  'maha_shivaratri',
  'thai_poosam',
  'chithirai_thiruvizha',
  'navaratri_sundal_days',
  'christmas_newyear',
  'deepavali',
  'pongal_harvest'
];

testIds.forEach(id => {
  const res = analytics.getHistoricalFestivalAnalysis(id);
  console.log(`\n=== Festival: ${id} ===`);
  if (!res) {
    console.log('  NULL returned!');
    return;
  }
  console.log(`  Name: ${res.name} (${res.tamilName})`);
  console.log(`  Date 2026: ${res.date2026}`);
  console.log(`  Cutoff 2026: ${res.cutoff2026}`);
  console.log(`  DatesByYear 2023-2027:`, JSON.stringify(res.datesByYear));
  console.log(`  Stock Need Items: ${res.stockNeedList ? res.stockNeedList.length : 0}`);
  if (res.stockNeedList && res.stockNeedList.length > 0) {
    console.log(`  Top 3 Stock Needs:`);
    res.stockNeedList.slice(0, 3).forEach(item => {
      console.log(`    - ${item.name}: Rec Order ${item.recommendedOrderQty}, Unit Price ₹${item.price}, Priority: ${item.priority}`);
    });
  }
});
