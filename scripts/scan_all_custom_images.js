const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data';
const allCustomImages = {};

function scanFile(filePath, label) {
  if (!fs.existsSync(filePath)) return;
  const buf = fs.readFileSync(filePath);
  const str = buf.toString('latin1');

  let pos = 0;
  while ((pos = str.indexOf('nsn_custom_images', pos)) !== -1) {
    // Find JSON around here
    // Look forward for {
    const braceStart = str.indexOf('{', pos);
    if (braceStart !== -1 && braceStart - pos < 50) {
      // Find matching or end of JSON
      let depth = 0;
      let end = -1;
      for (let i = braceStart; i < Math.min(str.length, braceStart + 500000); i++) {
        if (str[i] === '{') depth++;
        else if (str[i] === '}') {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
      if (end !== -1) {
        const jsonStr = str.substring(braceStart, end);
        try {
          const parsed = JSON.parse(jsonStr);
          console.log(`[${label}] Successfully parsed nsn_custom_images! Keys:`, Object.keys(parsed));
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === 'string') {
              console.log(`  Key ${k}: ${v.substring(0, 100)}... (length ${v.length})`);
              allCustomImages[k] = v;
            }
          }
        } catch(e) {
          console.log(`[${label}] Found { but JSON.parse failed:`, e.message, jsonStr.substring(0, 100));
        }
      }
    }
    pos += 'nsn_custom_images'.length;
  }
}

fs.readdirSync(baseDir).forEach(p => {
  const pDir = path.join(baseDir, p);
  const lsDir = path.join(pDir, 'Local Storage', 'leveldb');
  if (fs.existsSync(lsDir)) {
    fs.readdirSync(lsDir).forEach(f => {
      if (f.endsWith('.ldb') || f.endsWith('.log')) {
        scanFile(path.join(lsDir, f), `${p} LS/${f}`);
      }
    });
  }
});

console.log('\n========================================');
console.log('CONSOLIDATED ALL CUSTOM IMAGES FOUND:');
console.log('Total keys:', Object.keys(allCustomImages).length);
for (const [k, v] of Object.entries(allCustomImages)) {
  console.log(`Product ID/Key [${k}]: ${v.substring(0, 80)}...`);
}

fs.writeFileSync('scripts/consolidated_custom_images.json', JSON.stringify(allCustomImages, null, 2));
console.log('Saved to scripts/consolidated_custom_images.json');
