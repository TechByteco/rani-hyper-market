const fs = require('fs');
const code = fs.readFileSync('generativeAiAdvisor.js', 'utf8');

const idx = code.indexOf('async function generateAnswer(');
console.log(code.substring(idx, idx + 1500));
