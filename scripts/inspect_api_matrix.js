const fs = require('fs');
const apiCode = fs.readFileSync('api/index.js', 'utf8');

const sIdx = apiCode.indexOf("if (reqPath === '/api/ai/festival-calendar-matrix') {");
console.log('Matrix route in api/index.js at:', sIdx);
if (sIdx !== -1) {
  console.log(apiCode.substring(sIdx, sIdx + 1200));
}
