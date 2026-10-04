const fs = require('fs');
const path = require('path');
const { resolveProductPackshot } = require('./productPackshotResolver');

const catalogFiles = [
  'products_catalog.json',
  'public/products_catalog.json',
  'pre_model/products_catalog.json',
  'rani_products.json',
  'public/rani_products.json'
];

let totalUpdated = 0;

for (const relPath of catalogFiles) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    try {
      const catalog = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (Array.isArray(catalog)) {
        let fileUpdated = 0;
        for (const p of catalog) {
          const packshot = resolveProductPackshot(p.title);
          if (packshot) {
            p.image_url = packshot;
            p.image = packshot;
            if (p.canonical_record) p.canonical_record.image_url = packshot;
            fileUpdated++;
          }
        }
        fs.writeFileSync(fullPath, JSON.stringify(catalog, null, 2), 'utf8');
        console.log(`Updated ${fileUpdated} products in ${relPath}`);
        totalUpdated += fileUpdated;
      }
    } catch (e) {
      console.warn(`Error updating ${relPath}:`, e.message);
    }
  }
}

console.log(`\nFinished updating all catalog files! Total packshot assignments: ${totalUpdated}`);
