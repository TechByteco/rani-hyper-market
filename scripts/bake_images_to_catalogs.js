const fs = require('fs');

const imageMap = JSON.parse(fs.readFileSync('scripts/baked_product_images_map.json', 'utf8'));
// Map 115 (1Kg R Sugar) to the sugar image as well
imageMap[115] = 'images/products/prod_55_1kg_r_sugar.jpg';
// Clean up 55 and 85 if they aren't explicit IDs in catalog
delete imageMap[55];
delete imageMap[85];

console.log('Total products to update:', Object.keys(imageMap).length);

const catalogFiles = [
  'products_catalog.json',
  'public/products_catalog.json',
  'rani_products.json',
  'public/rani_products.json'
];

catalogFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;

  list.forEach(item => {
    const customImg = imageMap[item.id] || imageMap[String(item.id)];
    if (customImg) {
      item.image_url = customImg;
      item.image = customImg;
      updatedCount++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} products in ${filePath}`);
});

console.log('All catalog files updated successfully!');
