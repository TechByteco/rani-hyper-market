const fs = require('fs');

const srv = fs.readFileSync('server.js', 'utf8');

const fsn = srv.indexOf('/api/ai/festival-stock-needs');
console.log('/api/ai/festival-stock-needs in server.js at:', fsn);
if (fsn !== -1) {
  console.log(srv.substring(fsn - 100, fsn + 1000));
}

const fcm = srv.indexOf('/api/ai/festival-calendar-matrix');
console.log('/api/ai/festival-calendar-matrix in server.js at:', fcm);
if (fcm !== -1) {
  console.log(srv.substring(fcm - 100, fcm + 1000));
}
