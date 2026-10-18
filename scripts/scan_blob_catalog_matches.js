const fs = require('fs');

const blob = fs.readFileSync('C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\8');
const catalog = JSON.parse(fs.readFileSync('products_catalog.json', 'utf8'));

console.log('Blob size:', blob.length);
console.log('Catalog size:', catalog.length);

const matchedUpdates = [];

// For each product in the catalog, search for its title in Blob 8
catalog.forEach((prod, idx) => {
  // Use first 15 chars of title to search
  const searchTitle = prod.title.trim();
  if (searchTitle.length < 4) return;
  
  let pos = blob.indexOf(searchTitle);
  if (pos === -1 && searchTitle.length > 10) {
    pos = blob.indexOf(searchTitle.slice(0, 10));
  }
  
  if (pos !== -1) {
    // Look in a window of 300 bytes after the title for an image URL
    const window = blob.slice(pos, pos + 350).toString('latin1');
    
    // Check for explicit https://
    const httpMatch = window.match(/https?:\/\/[a-zA-Z0-9_\-\.\/]+(?:\?[^\s"'<>\x00-\x1f]*)?/i);
    
    // Check for gstatic token like ANd9Gc... or TDB7f... or RMWL...
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
      matchedUpdates.push({
        id: prod.id,
        title: prod.title,
        barcode: prod.barcode,
        catalog_image: prod.image_url,
        blob_image: foundUrl,
        windowSnippet: window.slice(0, 120).replace(/[^\x20-\x7e]/g, ' ')
      });
    }
  }
});

console.log(`\nFound ${matchedUpdates.length} product image updates in Blob 8!`);
matchedUpdates.forEach((u, i) => {
  console.log(`\n[#${i + 1}] ID: ${u.id} | Title: "${u.title}"`);
  console.log(`    Current: ${u.catalog_image}`);
  console.log(`    Updated: ${u.blob_image}`);
});

fs.writeFileSync('scripts/matched_blob8_updates.json', JSON.stringify(matchedUpdates, null, 2));
console.log('Saved to scripts/matched_blob8_updates.json');
