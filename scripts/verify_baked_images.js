const fs = require('fs');
const bakedMap = JSON.parse(fs.readFileSync('scripts/baked_product_images_map.json', 'utf8'));

let missing1 = 0;
let missing2 = 0;
let validCount = 0;

for (const [id, relPath] of Object.entries(bakedMap)) {
  const p1 = relPath;
  const p2 = 'public/' + relPath;

  if (!fs.existsSync(p1) || fs.statSync(p1).size < 100) {
    console.error(`Missing or empty in images/products: ${p1} (ID ${id})`);
    missing1++;
  }
  if (!fs.existsSync(p2) || fs.statSync(p2).size < 100) {
    console.error(`Missing or empty in public/images/products: ${p2} (ID ${id})`);
    missing2++;
  }
  if (fs.existsSync(p1) && fs.existsSync(p2)) {
    validCount++;
  }
}

console.log(`\nVerification Results:`);
console.log(`Total baked mappings: ${Object.keys(bakedMap).length}`);
console.log(`Valid on disk in both directories: ${validCount}`);
console.log(`Missing in images/products: ${missing1}`);
console.log(`Missing in public/images/products: ${missing2}`);
