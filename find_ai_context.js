const fs = require('fs');

const buf = fs.readFileSync('C:/SKS Market/app/data/app.so');
const str = buf.toString('latin1');

const targets = ['AI Brain', 'Gemini API key', 'AI Integration', 'AI invoice', 'aistudio'];

for (const t of targets) {
  let idx = 0;
  console.log(`\n=== TARGET: ${t} ===`);
  while ((idx = str.indexOf(t, idx)) !== -1) {
    console.log(`Index ${idx}:`);
    console.log(str.slice(Math.max(0, idx - 300), idx + 300).replace(/[\x00-\x1F\x7F-\xFF]/g, ' '));
    idx += t.length;
  }
}
