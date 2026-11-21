const fs = require('fs');
const apiCode = fs.readFileSync('api/index.js', 'utf8');

const fsn = apiCode.indexOf('/api/ai/festival-stock-needs');
console.log('/api/ai/festival-stock-needs in api/index.js at:', fsn);
if (fsn !== -1) {
  console.log(apiCode.substring(fsn - 100, fsn + 600));
}

const fcm = apiCode.indexOf('/api/ai/festival-calendar-matrix');
console.log('/api/ai/festival-calendar-matrix in api/index.js at:', fcm);
if (fcm !== -1) {
  console.log(apiCode.substring(fcm - 100, fcm + 600));
}
