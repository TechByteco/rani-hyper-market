const fs = require('fs');
const apiCode = fs.readFileSync('api/index.js', 'utf8');

const sIdx = apiCode.indexOf("if (reqPath === '/api/ai/festival-stock-needs'");
console.log('Index in api/index.js:', sIdx);
if (sIdx !== -1) {
  console.log(apiCode.substring(sIdx, sIdx + 1500));
}
