const fs = require('fs');

function inspectBlob(filePath, label) {
  if (!fs.existsSync(filePath)) return;
  const buf = fs.readFileSync(filePath);
  console.log(`\n========================================`);
  console.log(`BLOB: ${label} (size: ${buf.length} bytes)`);
  console.log(`========================================`);
  
  const str = buf.toString('latin1');
  
  // Any http or https URL
  const urlRegex = /https?:\/\/[a-zA-Z0-9_\-\.\/]+(?:\?[^\s"'<>\x00-\x1f]*)?/gi;
  let m;
  const results = [];
  while ((m = urlRegex.exec(str)) !== null) {
    const url = m[0];
    const before = str.slice(Math.max(0, m.index - 250), m.index);
    results.push({ url, before, index: m.index });
  }

  console.log(`Found ${results.length} total URLs.`);
  results.forEach((r, idx) => {
    // Only show interesting ones (gstatic, images, etc.)
    const cleanBefore = r.before.replace(/[^\x20-\x7e]/g, ' ');
    console.log(`\n[#${idx + 1}] URL: ${r.url}`);
    console.log(`    Before: ${cleanBefore.slice(-100).trim()}`);
  });
}

inspectBlob('C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\8', 'Profile 8');
inspectBlob('C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 12\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\8', 'Profile 12');
