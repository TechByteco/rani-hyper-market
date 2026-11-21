const path = require('path');
const analytics = require(path.resolve(__dirname, '../analyticsService.js'));

const allRes = analytics.getHistoricalFestivalAnalysis('all');
console.log('Total festivals returned by getHistoricalFestivalAnalysis("all"):', allRes.length);
console.log('First 5 festivals sorted by date2026:');
allRes.slice(0, 5).forEach(f => {
  console.log(`  ${f.date2026} (Cutoff: ${f.cutoff2026}) - ${f.name} [${f.stockNeedList ? f.stockNeedList.length : 0} items]`);
});
console.log('Last 5 festivals sorted by date2026:');
allRes.slice(-5).forEach(f => {
  console.log(`  ${f.date2026} (Cutoff: ${f.cutoff2026}) - ${f.name} [${f.stockNeedList ? f.stockNeedList.length : 0} items]`);
});
