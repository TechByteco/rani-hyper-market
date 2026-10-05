const fs = require('fs');

const data = JSON.parse(fs.readFileSync('double_sided_products.json', 'utf8'));
console.log('Total items in double_sided_products.json:', data.length);
console.log('Sample item:', data[0]);

// Find items matching Sensodyne, Colgate, Iodex, etc.
const matches = data.filter(item => {
  const name = (item.title || item.product_name || item.name || '').toLowerCase();
  return name.includes('sensodyne') || name.includes('colgate') || name.includes('iodex');
});
console.log('Found specific brand matches in double_sided_products.json:', matches.length);
matches.slice(0, 10).forEach(m => {
  console.log(`- ${m.title || m.product_name}: Front=${m.front_image || m.image_url || m.image}, Back=${m.back_image}`);
});
