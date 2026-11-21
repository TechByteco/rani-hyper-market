const path = require('path');
const analytics = require(path.resolve(__dirname, '../analyticsService.js'));

const testDates = [
  '2026-11-24', // Karthigai Deepam
  '2026-01-15', // Pongal
  '2026-11-08', // Deepavali
  '2026-02-15', // Maha Shivaratri
  '2026-04-29'  // Chithirai Thiruvizha
];

testDates.forEach(d => {
  const pred = analytics.predictSingleDay(d);
  console.log(`\n=== Prediction for ${d} (${pred.dayName}) ===`);
  console.log(`  Event: ${pred.eventName} (${pred.surgePercent})`);
  console.log(`  Projected Sales: ₹${pred.projectedSales}, Projected Bills: ${pred.projectedBills}`);
  if (pred.activeFest) {
    console.log(`  Active Festival: ${pred.activeFest.name} (Peak: ${pred.activeFest.isPeakDay})`);
    console.log(`  Sample Empirical SKUs (AI Checklist items):`);
    (pred.activeFest.sampleSkus || []).slice(0, 4).forEach(sku => {
      console.log(`    - ${sku.name}: Rec Order ${sku.recOrder}, Rate ₹${sku.rate}, Surge ${sku.surge}, Priority: ${sku.priority}`);
    });
  }
});
