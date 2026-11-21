const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const fcc = code.indexOf('FESTIVAL_CALENDAR_CONFIG');
console.log('FESTIVAL_CALENDAR_CONFIG at:', fcc);
if (fcc !== -1) {
  console.log(code.substring(fcc - 100, fcc + 1500));
}
