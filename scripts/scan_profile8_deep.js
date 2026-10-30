const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('products_catalog.json', 'utf8'));
const catalogById = {};
const catalogByTitle = {};
const catalogByBarcode = {};

catalog.forEach(p => {
  catalogById[p.id] = p;
  if (p.barcode) catalogByBarcode[p.barcode] = p;
  catalogByTitle[p.title.toLowerCase().trim()] = p;
});

console.log(`Loaded catalog with ${catalog.length} products.`);

// 1. Scan LevelDB files in Profile 8
const ldbDir = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\Local Storage\\leveldb';
const ldbFiles = fs.readdirSync(ldbDir).filter(f => f.endsWith('.ldb') || f.endsWith('.log'));

let foundImagesMap = {};

ldbFiles.forEach(f => {
  const fullPath = path.join(ldbDir, f);
  try {
    const buf = fs.readFileSync(fullPath);
    const content = buf.toString('latin1');
    
    // Look for nsn_custom_images or _customImgCache
    const marker = 'nsn_custom_images';
    let idx = 0;
    while ((idx = content.indexOf(marker, idx)) !== -1) {
      console.log(`Found ${marker} in ${f} at byte ${idx}!`);
      // Read JSON chunk
      const start = content.indexOf('{', idx);
      if (start !== -1) {
        // find matching or parseable chunk
        for (let len = 50; len < 500000; len += 1000) {
          const slice = content.slice(start, start + len);
          try {
            const parsed = JSON.parse(slice);
            Object.assign(foundImagesMap, parsed);
            console.log(`Successfully parsed ${Object.keys(parsed).length} overrides from ${f}!`);
            break;
          } catch(e) {}
        }
      }
      idx += marker.length;
    }

    // Also look for data:image/jpeg;base64 or direct gstatic URLs
    const urlMatches = content.match(/https?:\/\/[^\s"'<>\x00-\x1f]+\.(?:jpg|jpeg|png|webp)/gi);
    if (urlMatches) {
      console.log(`Found ${urlMatches.length} raw image URLs in ${f}`);
    }
  } catch(e) {
    console.error(`Error reading ${f}:`, e.message);
  }
});

// 2. Scan IndexedDB Blob 'c'
const blobPath = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\c';
if (fs.existsSync(blobPath)) {
  const blob = fs.readFileSync(blobPath);
  console.log(`\nScanning IndexedDB Blob 'c' (size: ${blob.length} bytes)...`);

  const matchedBlobUpdates = [];

  catalog.forEach(prod => {
    const searchTitle = prod.title.trim();
    if (searchTitle.length < 4) return;

    let pos = blob.indexOf(searchTitle);
    if (pos === -1 && searchTitle.length > 10) {
      pos = blob.indexOf(searchTitle.slice(0, 10));
    }

    if (pos !== -1) {
      const window = blob.slice(pos, pos + 350).toString('latin1');
      
      const httpMatch = window.match(/https?:\/\/[a-zA-Z0-9_\-\.\/]+(?:\?[^\s"'<>\x00-\x1f]*)?/i);
      const tokenMatch = window.match(/(?:ANd9Gc[a-zA-Z0-9_\-]+|[A-Za-z0-9_\-]{30,60}&[a-zA-Z0-9=]+|[A-Za-z0-9_\-]{40,65})/);

      let foundUrl = null;
      if (httpMatch && !httpMatch[0].includes('openbeautyfacts') && !httpMatch[0].includes('openfoodfacts')) {
        foundUrl = httpMatch[0];
      } else if (tokenMatch) {
        const tok = tokenMatch[0];
        if (tok.startsWith('ANd9Gc')) {
          foundUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:${tok}`;
        } else if (tok.includes('&s') || tok.length >= 35) {
          foundUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc${tok}`;
        }
      }

      if (foundUrl && foundUrl !== prod.image_url) {
        matchedBlobUpdates.push({
          id: prod.id,
          title: prod.title,
          barcode: prod.barcode,
          catalog_image: prod.image_url,
          found_url: foundUrl
        });
      }
    }
  });

  console.log(`Found ${matchedBlobUpdates.length} product image updates in Blob 'c'!`);
  fs.writeFileSync('scripts/blob_c_matches.json', JSON.stringify(matchedBlobUpdates, null, 2));
}

console.log(`\nTotal local overrides from LevelDB: ${Object.keys(foundImagesMap).length}`);
fs.writeFileSync('scripts/leveldb_overrides.json', JSON.stringify(foundImagesMap, null, 2));
