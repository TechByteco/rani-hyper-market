const fs = require('fs');
const path = require('path');

const masterHtml = fs.readFileSync(path.join(__dirname, 'store.html'), 'utf8');

const targets = [
  'index.html',
  'public/store.html',
  'public/index.html',
  'pre_model/store.html',
  'pre_model/index.html'
];

targets.forEach(t => {
  const p = path.join(__dirname, t);
  fs.writeFileSync(p, masterHtml, 'utf8');
  console.log(`Synced master store.html -> ${t} (${masterHtml.length} bytes)`);
});
