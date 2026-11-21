const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const sIdx = code.indexOf('function getHistoricalFestivalAnalysis(targetId) {');
console.log(code.substring(sIdx + 5000, sIdx + 9000));
