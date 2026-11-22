const analytics = require('../analyticsService');

for (const d of ['2026-11-22', '2026-11-23', '2026-11-24']) {
  console.log(`\n=== analytics.predictDate('${d}') ===`);
  const r = analytics.predictDate(d);
  console.log('Keys:', Object.keys(r));
  console.log('Date:', r.date, 'Day:', r.dayName, 'Sales:', r.projectedSales, 'Bills:', r.projectedBills);
  console.log('Event Name:', r.eventName);
  console.log('Active Fest:', r.activeFest ? r.activeFest.name : 'None');
  console.log('Checklist count:', r.checklist ? r.checklist.length : 0);
  if (r.checklist && r.checklist.length > 0) {
    console.log('Checklist sample:', r.checklist.slice(0, 3));
  }
}
