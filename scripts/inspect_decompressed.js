const fs = require('fs');
const decomp = fs.readFileSync('scripts/decompressed_blob_c.bin');
console.log('Decompressed size:', decomp.length);

function inspectProduct(searchStr) {
  const idx = decomp.indexOf(Buffer.from(searchStr));
  if (idx !== -1) {
    console.log(`\n=== Found '${searchStr}' at byte ${idx} ===`);
    const chunk = decomp.slice(Math.max(0, idx - 40), Math.min(decomp.length, idx + 300));
    console.log(chunk.toString('latin1'));
  } else {
    console.log(`\n=== NOT FOUND: '${searchStr}' ===`);
  }
}

inspectProduct('10Rs R Mangaldeep');
inspectProduct('100Ml R Vvd Coconut Oil Pouch');
inspectProduct('200Ml R Him Gentle Baby Shampoo');
inspectProduct('Act II Clas Salt');
