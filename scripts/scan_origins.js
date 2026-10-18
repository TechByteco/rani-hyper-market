const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data';

const origins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'https://rani-hyper-market.vercel.app'
];

function scanProfileOrigins(profileName) {
  const pDir = path.join(baseDir, profileName, 'Local Storage', 'leveldb');
  if (!fs.existsSync(pDir)) return;

  fs.readdirSync(pDir).forEach(f => {
    if (!f.endsWith('.ldb') && !f.endsWith('.log')) return;
    const buf = fs.readFileSync(path.join(pDir, f));
    const str = buf.toString('latin1');

    origins.forEach(orig => {
      const prefix = '_' + orig + '\x00\x01';
      let pos = 0;
      while ((pos = str.indexOf(prefix, pos)) !== -1) {
        const keyStart = pos + prefix.length;
        let keyEnd = keyStart;
        while (keyEnd < str.length && str.charCodeAt(keyEnd) >= 32 && str.charCodeAt(keyEnd) <= 126) keyEnd++;
        const key = str.substring(keyStart, keyEnd);
        const valPreview = str.substring(keyEnd, keyEnd + 300);
        
        if (key.includes('custom') || key.includes('image') || key.includes('nsn') || key.includes('catalog') || valPreview.includes('data:image') || valPreview.includes('http')) {
          console.log(`[${profileName} / ${orig} / ${f}] Key: "${key}"`);
          console.log('Preview:', JSON.stringify(valPreview.slice(0, 150)));
        }
        pos = keyEnd + 1;
      }
    });
  });
}

fs.readdirSync(baseDir).forEach(p => {
  if (p.startsWith('Profile') || p === 'Default') {
    scanProfileOrigins(p);
  }
});
