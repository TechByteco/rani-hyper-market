const fs = require('fs');

const files = [
  'products_catalog.json',
  'public/products_catalog.json',
  'pre_model/products_catalog.json',
  'rani_products.json',
  'public/rani_products.json'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    const apolloItems = data.filter(p => (p.image_url || p.image || '').includes('apollo247'));
    console.log(`${f}: Total=${data.length}, Apollo items=${apolloItems.length}`);
    if (apolloItems.length > 0) {
      console.log('Sample Apollo items in ' + f + ':', apolloItems.slice(0, 3).map(p => ({ name: p.name || p.title, img: p.image_url || p.image })));
    }
  }
});
