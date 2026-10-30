const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
}

const updates = JSON.parse(fs.readFileSync('scripts/all_pwa_image_updates.json', 'utf8'));
const bakedMap = JSON.parse(fs.readFileSync('scripts/baked_product_images_map.json', 'utf8'));

console.log(`Starting processing for ${updates.length} potential product image updates...`);

fs.mkdirSync('images/products', { recursive: true });
fs.mkdirSync('public/images/products', { recursive: true });

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    try {
      const client = url.startsWith('https:') ? https : http;
      const parsedUrl = new URL(url);
      const req = client.get(
        parsedUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          },
          timeout: 10000
        },
        res => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          const chunks = [];
          res.on('data', d => chunks.push(d));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            if (buffer.length < 50) {
              return reject(new Error('File too small / empty'));
            }
            fs.writeFileSync(destPath, buffer);
            resolve(buffer.length);
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function run() {
  let successCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  for (let i = 0; i < updates.length; i++) {
    const item = updates[i];
    const slug = slugify(item.title);
    const relPath = `images/products/prod_${item.id}_${slug}.jpg`;
    const fullPath1 = path.join('images', 'products', `prod_${item.id}_${slug}.jpg`);
    const fullPath2 = path.join('public', 'images', 'products', `prod_${item.id}_${slug}.jpg`);

    // If already baked and new_image is not different or already downloaded
    if (fs.existsSync(fullPath1) && bakedMap[item.id] === relPath && !item.new_image.startsWith('http')) {
      skippedCount++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${updates.length}] Prod ${item.id} (${item.title}): `);

    try {
      const bytes = await downloadUrl(item.new_image, fullPath1);
      // Copy to public folder as well
      fs.copyFileSync(fullPath1, fullPath2);
      bakedMap[item.id] = relPath;
      successCount++;
      console.log(`OK (${bytes} bytes) -> saved ${relPath}`);
    } catch (err) {
      failCount++;
      console.log(`FAILED: ${err.message}`);
    }
  }

  console.log(`\nDownload summary: ${successCount} downloaded, ${skippedCount} skipped, ${failCount} failed.`);

  // Save updated bakedMap
  fs.writeFileSync('scripts/baked_product_images_map.json', JSON.stringify(bakedMap, null, 2), 'utf8');
  console.log(`Updated scripts/baked_product_images_map.json with ${Object.keys(bakedMap).length} total products.`);

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

  console.log('Finished updating catalogs!');
}

run();
