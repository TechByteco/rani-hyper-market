const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data';

function inspectProfile(profileName) {
  const pDir = path.join(baseDir, profileName);
  if (!fs.existsSync(pDir)) return;
  console.log(`\n========================================\nINSPECTING ${profileName}\n========================================`);

  // Local Storage
  const lsDir = path.join(pDir, 'Local Storage', 'leveldb');
  if (fs.existsSync(lsDir)) {
    fs.readdirSync(lsDir).forEach(f => {
      if (f.endsWith('.ldb') || f.endsWith('.log')) {
        const filePath = path.join(lsDir, f);
        const buf = fs.readFileSync(filePath);
        const str = buf.toString('latin1');
        
        let pos = 0;
        while ((pos = str.indexOf('nsn_custom_images', pos)) !== -1) {
          console.log(`[${profileName} LS ${f}] 'nsn_custom_images' at ${pos}:`);
          console.log(str.substring(pos, pos + 1000));
          pos += 'nsn_custom_images'.length;
        }

        // Look for any keys related to rani
        ['custom_images', 'RaniImageHold', 'RaniStoreCatalogDB'].forEach(kw => {
          let p = 0;
          while ((p = str.indexOf(kw, p)) !== -1) {
            console.log(`[${profileName} LS ${f}] '${kw}' at ${p}:`);
            console.log(str.substring(p, p + 500));
            p += kw.length;
          }
        });
      }
    });
  }

  // IndexedDB
  const idbBase = path.join(pDir, 'IndexedDB');
  if (fs.existsSync(idbBase)) {
    fs.readdirSync(idbBase).forEach(d => {
      if (d.includes('rani-hyper-market')) {
        const ldbDir = path.join(idbBase, d);
        fs.readdirSync(ldbDir).forEach(f => {
          if (f.endsWith('.ldb') || f.endsWith('.log')) {
            const filePath = path.join(ldbDir, f);
            const buf = fs.readFileSync(filePath);
            const str = buf.toString('latin1');

            let pos = 0;
            while ((pos = str.indexOf('nsn_custom_images', pos)) !== -1) {
              console.log(`[${profileName} IDB ${d}/${f}] 'nsn_custom_images' at ${pos}:`);
              console.log(str.substring(pos, pos + 1000));
              pos += 'nsn_custom_images'.length;
            }

            ['RaniImageHold', 'RaniStoreCatalogDB', 'custom_images', 'products_catalog'].forEach(kw => {
              let p = 0;
              while ((p = str.indexOf(kw, p)) !== -1) {
                console.log(`[${profileName} IDB ${d}/${f}] '${kw}' at ${p}:`);
                console.log(str.substring(p, p + 500));
                p += kw.length;
              }
            });

            // Extract any URLs
            const urlRegex = /(https?:\/\/[a-zA-Z0-9_\-\.\/]+(?:\.jpg|\.jpeg|\.png|\.webp|gstatic\.com\/images\?q=tbn:[^\s"'<>]+|openfoodfacts[^\s"'<>]+))/gi;
            let m;
            const urls = new Set();
            while ((m = urlRegex.exec(str)) !== null) {
              urls.add(m[1]);
            }
            if (urls.size > 0) {
              console.log(`[${profileName} IDB ${d}/${f}] Found URLs:`, [...urls]);
            }
          }
        });
      }
    });
  }
}

['Profile 8'].forEach(inspectProfile);
