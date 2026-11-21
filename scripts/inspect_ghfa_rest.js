const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const start = code.indexOf('function getHistoricalFestivalAnalysis');
console.log(code.substring(start + 2000, start + 5000));
