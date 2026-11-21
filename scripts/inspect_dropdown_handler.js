const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

const fnIdx = html.indexOf('handleFestivalDropdownChange');
console.log('handleFestivalDropdownChange at:', fnIdx);
if (fnIdx !== -1) {
  console.log(html.substring(fnIdx, fnIdx + 1000));
}
