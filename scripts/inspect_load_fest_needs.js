const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

const sIdx = html.indexOf('async function loadFestivalStockNeeds');
console.log('loadFestivalStockNeeds at:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx, sIdx + 1200));
}
