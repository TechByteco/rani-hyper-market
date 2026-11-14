const fs = require('fs');
const code = fs.readFileSync('generativeAiAdvisor.js', 'utf8');

const funcs = code.match(/function [a-zA-Z0-9_]+\s*\(/g) || [];
console.log('All functions in generativeAiAdvisor.js:');
console.log(funcs);
