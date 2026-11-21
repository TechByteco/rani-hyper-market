const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

// Check MINED_FESTIVAL_EMPIRICAL_DATA loading
const idx = code.indexOf('MINED_FESTIVAL_EMPIRICAL_DATA');
console.log('MINED_FESTIVAL_EMPIRICAL_DATA declaration:');
console.log(code.substring(idx - 100, idx + 400));

// Check getHistoricalFestivalAnalysis
const start = code.indexOf('function getHistoricalFestivalAnalysis');
console.log('\ngetHistoricalFestivalAnalysis lines:');
console.log(code.substring(start, start + 2500));
