const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const sIdx = code.indexOf('function getHistoricalFestivalAnalysis(targetId) {');
console.log(code.substring(sIdx + 8000, sIdx + 11500));
