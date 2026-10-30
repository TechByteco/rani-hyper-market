const fs = require('fs');
const path = require('path');

const decomp = fs.readFileSync('scripts/decompressed_blob_c.bin');
const bakedMap = JSON.parse(fs.readFileSync('scripts/baked_product_images_map.json', 'utf8'));

// 1. Act II Clas Salt
const b1Idx = decomp.indexOf(Buffer.from('8901512540102'));
if (b1Idx !== -1) {
  const str = decomp.slice(Math.max(0, b1Idx - 35000), b1Idx).toString('latin1');
  const tag = 'data:image/jpeg;base64,';
  const start = str.lastIndexOf(tag);
  if (start !== -1) {
    const raw = str.slice(start + tag.length);
    const end = raw.indexOf('"');
    if (end !== -1) {
      const b64 = raw.slice(0, end);
      const buf = Buffer.from(b64, 'base64');
      const p1 = 'images/products/prod_370_10rs_r_act_ii_clas_salt.jpg';
      const p2 = 'public/images/products/prod_370_10rs_r_act_ii_clas_salt.jpg';
      fs.writeFileSync(p1, buf);
      fs.writeFileSync(p2, buf);
      bakedMap[370] = p1;
      console.log(`Saved Prod 370 image (${buf.length} bytes) to ${p1}`);
    }
  }
}

// 2. Cinthol Confidence (barcode 8901023010453)
const b2Idx = decomp.indexOf(Buffer.from('8901023010453'));
if (b2Idx !== -1) {
  const str = decomp.slice(b2Idx, b2Idx + 20000).toString('latin1');
  const tag = 'data:image/jpeg;base64,';
  const start = str.indexOf(tag);
  if (start !== -1) {
    const raw = str.slice(start + tag.length);
    const end = raw.indexOf('"');
    if (end !== -1) {
      const b64 = raw.slice(0, end);
      const buf = Buffer.from(b64, 'base64');
      const p1 = 'images/products/prod_586_r_3_100g_r_cinthol_confidence.jpg';
      const p2 = 'public/images/products/prod_586_r_3_100g_r_cinthol_confidence.jpg';
      fs.writeFileSync(p1, buf);
      fs.writeFileSync(p2, buf);
      bakedMap[586] = p1;
      console.log(`Saved Prod 586 image (${buf.length} bytes) to ${p1}`);
    }
  }
}

// Save updated bakedMap
fs.writeFileSync('scripts/baked_product_images_map.json', JSON.stringify(bakedMap, null, 2), 'utf8');

// Bake into all 4 catalogs
const catalogFiles = [
  'products_catalog.json',
  'public/products_catalog.json',
  'rani_products.json',
  'public/rani_products.json'
];

catalogFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCatalogCount = 0;

  list.forEach(prod => {
    const customImg = bakedMap[prod.id] || bakedMap[String(prod.id)];
    if (customImg) {
      prod.image_url = customImg;
      prod.image = customImg;
      updatedCatalogCount++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
  console.log(`Baked ${updatedCatalogCount} images into ${filePath}`);
});

console.log('Finished base64 extraction and baking.');
