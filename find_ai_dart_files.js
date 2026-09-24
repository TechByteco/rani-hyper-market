const fs = require('fs');

const buf = fs.readFileSync('C:/SKS Market/app/data/app.so');
const str = buf.toString('latin1');

const indices = [9525254, 9862752, 10279072, 12897824];

for (const idx of indices) {
  console.log(`\n=== Finding Dart files around ${idx} ===`);
  const slice = str.slice(Math.max(0, idx - 8000), Math.min(str.length, idx + 8000));
  const files = slice.match(/package:sksmarket\/[a-zA-Z0-9_\/]+\.dart/g) || [];
  console.log([...new Set(files)]);
}
