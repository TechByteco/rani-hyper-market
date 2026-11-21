const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const start = code.indexOf('function getHistoricalFestivalAnalysis');
console.log(code.substring(start, start + 3500));
