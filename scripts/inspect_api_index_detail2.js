const fs = require('fs');
const apiCode = fs.readFileSync('api/index.js', 'utf8');

const sIdx = apiCode.indexOf("if (reqPath === '/api/ai/festival-stock-needs'");
console.log(apiCode.substring(sIdx + 1200, sIdx + 2800));
