const fs = require('fs');
const path = require('path');
const { resolveProductPackshot, SPECIFIC_PRODUCT_PACKSHOTS } = require('./productPackshotResolver');

const catalogFiles = [
  'products_catalog.json',
  'public/products_catalog.json',
  'pre_model/products_catalog.json',
  'rani_products.json',
  'public/rani_products.json'
];

function cleanObj(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(item => cleanObj(item));
  } else if (obj && typeof obj === 'object') {
    const title = obj.name || obj.title || obj.product_name || '';
    const cleanPackshot = resolveProductPackshot(title) || SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_freshgel'];

    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && obj[key].includes('apollo247')) {
        obj[key] = cleanPackshot;
      } else if (typeof obj[key] === 'object') {
        cleanObj(obj[key]);
      }
    }
  }
}

catalogFiles.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let raw = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(raw);
    cleanObj(data);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');

    // Double check raw text
    let checkRaw = fs.readFileSync(fullPath, 'utf8');
    const hasApollo = checkRaw.includes('apollo247');
    console.log(`${relPath}: Apollo cleaned -> Remaining occurrences in text: ${hasApollo ? (checkRaw.match(/apollo247/g) || []).length : 0}`);
  }
});
