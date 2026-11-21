const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

const sIdx = html.indexOf('fest-multi-year-dates-container');
console.log('fest-multi-year-dates-container at:', sIdx);
if (sIdx !== -1) {
  console.log(html.substring(sIdx - 100, sIdx + 1200));
}
