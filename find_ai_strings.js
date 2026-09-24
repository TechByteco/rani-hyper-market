const fs = require('fs');

const buf = fs.readFileSync('C:/SKS Market/app/data/app.so');
const str = buf.toString('latin1');

const regexes = [
  /AI\s+[A-Za-z0-9]+/g,
  /Gemini[A-Za-z0-9_ ]+/g,
  /Assistant/g,
  /geminiApiKey/g,
  /aistudio/g
];

for (const r of regexes) {
  const m = str.match(r) || [];
  console.log(r, '->', [...new Set(m)].slice(0, 15));
}
