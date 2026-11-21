const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const sIdx = code.indexOf('function getHistoricalFestivalAnalysis(targetId) {');
const eIdx = code.indexOf('function getIndianRetailCompanies()', sIdx);
console.log('Start index:', sIdx, 'End index:', eIdx);
console.log(code.substring(sIdx, sIdx + 1200));
console.log('...\nMiddle of function:');
console.log(code.substring(sIdx + 3000, sIdx + 4500));
