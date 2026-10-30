const fs = require('fs');
const https = require('https');
const path = require('path');

const BLOB_PATH = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\8';

if (!fs.existsSync(BLOB_PATH)) {
  console.error('Blob not found at:', BLOB_PATH);
  process.exit(1);
}

const blob = fs.readFileSync(BLOB_PATH);
console.log('Blob size:', blob.length);

const catalogPath = 'products_catalog.json';
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Keywords to inspect
const keywords = [
  'Anil', 'Rava', 'Semiya', 'Ragi', 'Puttu', 'Samba', 'Maida',
  'Karthika', 'Karthicka', 'Chik', 'Gold Winner', 'Vanaspati',
  'Garnier', 'Lifebuoy', 'Rin', 'Elite', 'Cake', 'Zandu', 'Vvd', 'Good Day'
];

console.log('\nSearching Blob 8 for target products and image tokens...');

keywords.forEach(kw => {
  let idx = 0;
  while ((idx = blob.indexOf(kw, idx)) !== -1) {
    const start = Math.max(0, idx - 50);
    const end = Math.min(blob.length, idx + 350);
    const snippet = blob.slice(start, end).toString('latin1');
    
    // Look for gstatic token or url
    const urlMatch = snippet.match(/https?:\/\/[^\s"'<>\x00-\x1f]+/i);
    const gstaticMatch = snippet.match(/ANd9Gc[a-zA-Z0-9_\-]+/);
    const gstaticShort = snippet.match(/(?:[A-Za-z0-9_\-]{30,50}&s=[0-9]+)/);

    const cleanSnippet = snippet.replace(/[^\x20-\x7e]/g, ' ');
    console.log(`[FOUND: ${kw}] at byte ${idx}:`);
    console.log(`  Snippet: ${cleanSnippet.slice(0, 150)}`);
    if (urlMatch) console.log(`  URL: ${urlMatch[0]}`);
    if (gstaticMatch) console.log(`  GStatic: ${gstaticMatch[0]}`);
    if (gstaticShort) console.log(`  GStaticShort: ${gstaticShort[0]}`);
    console.log('---');

    idx += kw.length;
  }
});
