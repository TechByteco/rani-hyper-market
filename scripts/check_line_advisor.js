const fs = require('fs');
const code = fs.readFileSync('generativeAiAdvisor.js', 'utf8');

const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Analysis & Strategic Perspective for')) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
