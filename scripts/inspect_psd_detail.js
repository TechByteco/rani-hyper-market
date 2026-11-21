const fs = require('fs');
const code = fs.readFileSync('analyticsService.js', 'utf8');

const psd = code.indexOf('predictSingleDay(');
console.log(code.substring(psd + 1500, psd + 3500));
