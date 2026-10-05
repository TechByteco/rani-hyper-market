const fs = require('fs');
const vm = require('vm');
const path = require('path');

const targets = [
  'store.html',
  'index.html',
  'public/store.html',
  'public/index.html',
  'pre_model/store.html',
  'pre_model/index.html'
];

targets.forEach(t => {
  const p = path.join(__dirname, t);
  const html = fs.readFileSync(p, 'utf8');
  const scripts = html.match(/<script(?![^>]*(?:src=|ld\+json))[^>]*>([\s\S]*?)<\/script>/gi) || [];
  scripts.forEach((s, idx) => {
    const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    new vm.Script(code);
  });
  console.log(`[SYNTAX OK] ${t} (${scripts.length} JS inline script blocks parsed perfectly)`);
});
