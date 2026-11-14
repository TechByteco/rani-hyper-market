const fs = require('fs');
const code = fs.readFileSync('api/index.js', 'utf8');

const idx = code.indexOf('/api/ai-analytics/chat');
console.log(code.substring(idx, idx + 1000));
