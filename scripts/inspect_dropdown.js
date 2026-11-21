const fs = require('fs');
const html = fs.readFileSync('ai-analytics.html', 'utf8');

const dropdownIdx = html.indexOf('all-festivals-dropdown');
console.log('all-festivals-dropdown at:', dropdownIdx);
if (dropdownIdx !== -1) {
  console.log(html.substring(dropdownIdx - 200, dropdownIdx + 2000));
}
