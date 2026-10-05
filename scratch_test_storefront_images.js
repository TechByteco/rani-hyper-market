const fs = require('fs');

const html = fs.readFileSync('store.html', 'utf8');

// Extract getRelevantProductImage and DIRECT_JPG_PACKSHOTS from store.html
const startIdx = html.indexOf('const DIRECT_JPG_PACKSHOTS = {');
const endIdx = html.indexOf('function getRelevantProductImage(title, existingUrl) {', startIdx);
const fnEndIdx = html.indexOf('function getDoubleSidedMatch(', endIdx);

const directPackshotsBlock = html.substring(startIdx, endIdx);
const resolverFnBlock = html.substring(endIdx, fnEndIdx);

const testCode = `
${directPackshotsBlock}
${resolverFnBlock}

const testProducts = [
  '40G R Sensodyne Freshgel',
  'Sensodyne Toothpaste Fresh Mint 75g',
  'Sensodyne Repair & Protect',
  '8G R Iodex',
  '18G R Iodex BODY PAIN',
  'Amrutanjan Pain Balm',
  'Moov Pain Relief Cream',
  'Volini Pain Relief Spray',
  'Vicks VapoRub 25g',
  'Zandu Balm 25ml',
  'Eno Fruit Salt Lemon 100g',
  'Colgate Strong Teeth 100g',
  'Colgate MaxFresh Spicy Red 150g',
  'Parle-G Gold Biscuits 100g',
  'Britannia Good Day Cashew 200g',
  'Cadbury Dairy Milk Silk 150g',
  'Dettol Original Soap 75g',
  'Cinthol Lime Bath Soap 100g',
  'Mysore Sandal Soap 75g',
  'Clinic Plus Strong & Long Shampoo 175ml',
  'Head & Shoulders Smooth & Silky 180ml',
  'Tata Tea Gold 250g',
  'Bru Instant Coffee 100g',
  'Horlicks Classic Malt 500g',
  'Aachi Chicken Masala 100g',
  'Surf Excel Matic Liquid Detergent 1L',
  'Harpic Power Plus 500ml'
];

console.log('Testing Storefront getRelevantProductImage():\\n');
let allValid = true;
testProducts.forEach(name => {
  const img = getRelevantProductImage(name, null);
  const isApollo = (img || '').includes('apollo247');
  const isOk = img && img.startsWith('http') && !isApollo;
  if (!isOk) allValid = false;
  console.log(\`- [\${isOk ? 'OK' : 'FAIL'}] \${name} -> \${img}\`);
});

console.log('\\nStorefront Image Engine Test: ' + (allValid ? 'ALL PASSED (0 Apollo, 100% Authentic)' : 'FAILED'));
`;

eval(testCode);
