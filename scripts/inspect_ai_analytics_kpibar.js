const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

const sIdx = html.indexOf('fest-stock-kpi-bar');
console.log('fest-stock-kpi-bar at:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx - 100, sIdx + 1500));
}
