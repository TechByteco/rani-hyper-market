const fs = require('fs');

const code = fs.readFileSync('analyticsService.js', 'utf8');

// Find getHistoricalFestivalAnalysis
const start = code.indexOf('function getHistoricalFestivalAnalysis');
console.log('getHistoricalFestivalAnalysis found at index:', start);
if (start !== -1) {
    console.log(code.substring(start, start + 3000));
}

// Find predictSingleDay festival handling
const psd = code.indexOf('predictSingleDay(');
console.log('\npredictSingleDay found at index:', psd);
if (psd !== -1) {
    console.log(code.substring(psd, psd + 2000));
}
