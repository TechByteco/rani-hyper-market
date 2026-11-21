const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const fcm = code.indexOf('getFestivalCalendarMatrix');
console.log('getFestivalCalendarMatrix at:', fcm);
if (fcm !== -1) {
  console.log(code.substring(fcm, fcm + 2500));
}
