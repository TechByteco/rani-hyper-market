const fs = require('fs');
const path = require('path');

const storeFiles = [
  'store.html',
  'index.html',
  'public/store.html',
  'public/index.html',
  'pre_model/store.html',
  'pre_model/index.html'
];

const targetPattern = "if (existingUrl && !existingUrl.includes('apollo247') && !existingUrl.includes('aas0010_1') && !existingUrl.includes('unsplash.com')) {";
const replacement = "if (existingUrl && !existingUrl.includes('aas0010_1') && !existingUrl.includes('unsplash.com')) {";

let updatedCount = 0;
for (const relPath of storeFiles) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(targetPattern)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${relPath}`);
      updatedCount++;
    }
  }
}

console.log(`Updated ${updatedCount} storefront HTML files to enable Apollo packshot rendering!`);
