const fs = require('fs');
const https = require('https');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'rani_products.json');
const GTIN_FILE = path.join(__dirname, 'gtin_packshots.json');

// Load products
const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

// Load existing registry if available
let registry = {};
if (fs.existsSync(GTIN_FILE)) {
  try {
    registry = JSON.parse(fs.readFileSync(GTIN_FILE, 'utf8'));
  } catch(e) {}
}

// Find unique Indian EAN-13 barcodes (starts with 890, 13 digits)
const uniqueBarcodes = new Map();
products.forEach(p => {
  const bc = (p.barcode || '').trim();
  if (/^890\d{10}$/.test(bc)) {
    if (!uniqueBarcodes.has(bc)) {
      uniqueBarcodes.set(bc, p.title);
    }
  }
});

console.log(`Found ${uniqueBarcodes.size} unique Indian EAN-13 barcodes.`);
console.log(`Already in GTIN registry: ${Object.keys(registry).length}`);

// Filter out barcodes already resolved with valid images
const toFetch = [];
for (const [bc, title] of uniqueBarcodes.entries()) {
  if (!registry[bc]) {
    toFetch.push({ barcode: bc, title });
  }
}

console.log(`Barcodes to query: ${toFetch.length}`);

// Concurrency worker with keep-alive agent
const agent = new https.Agent({ keepAlive: true, maxSockets: 15 });

async function fetchOffProduct(barcode) {
  return new Promise((resolve) => {
    const url = 'https://world.openfoodfacts.org/api/v0/product/' + barcode + '.json';
    const req = https.get(url, { agent, timeout: 6000, headers: { 'User-Agent': 'RaniHyperMarket-CatalogEnricher/2.0 (contact: support@ranimarket.in)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.status === 1 && j.product) {
            const p = j.product;
            const img = p.image_front_url || p.image_url || (p.selected_images && p.selected_images.front && p.selected_images.front.display && p.selected_images.front.display.en);
            if (img && typeof img === 'string' && img.startsWith('http')) {
              resolve({ found: true, img, name: p.product_name || p.product_name_en });
              return;
            }
          }
          resolve({ found: false });
        } catch(e) {
          resolve({ found: false });
        }
      });
    });

    req.on('error', () => resolve({ found: false }));
    req.on('timeout', () => { req.destroy(); resolve({ found: false }); });
  });
}

// Batch runner
async function run() {
  const batchSize = 15;
  let newFound = 0;
  let processed = 0;

  for (let i = 0; i < toFetch.length; i += batchSize) {
    const batch = toFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(item => fetchOffProduct(item.barcode)));

    results.forEach((res, idx) => {
      const item = batch[idx];
      if (res.found) {
        registry[item.barcode] = res.img;
        newFound++;
        console.log(`[+] Match: ${item.barcode} | ${item.title} -> ${res.name || 'Packshot'}`);
      }
    });

    processed += batch.length;
    if (processed % 75 === 0 || processed === toFetch.length) {
      console.log(`Progress: ${processed} / ${toFetch.length} (${(processed/toFetch.length*100).toFixed(1)}%) | Discovered new: ${newFound}`);
      fs.writeFileSync(GTIN_FILE, JSON.stringify(registry, null, 2));
    }

    // Small delay to be polite to Open Food Facts API
    await new Promise(r => setTimeout(r, 120));
  }

  fs.writeFileSync(GTIN_FILE, JSON.stringify(registry, null, 2));
  console.log(`Finished! Total in GTIN registry: ${Object.keys(registry).length} (Discovered +${newFound} new commercial packshots).`);
}

run();
