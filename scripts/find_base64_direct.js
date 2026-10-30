const fs = require('fs');
const decomp = fs.readFileSync('scripts/decompressed_blob_c.bin');

let idx = 0;
let matches = [];
while ((idx = decomp.indexOf(Buffer.from('data:image/'), idx)) !== -1) {
  // Look backward for title and id
  const start = Math.max(0, idx - 300);
  const contextBefore = decomp.slice(start, idx).toString('latin1');
  const contextAfter = decomp.slice(idx, idx + 20000).toString('latin1');
  
  // Extract data URI
  const endIdx = contextAfter.search(/[\"\x00-\x1f]/);
  const dataUri = endIdx !== -1 ? contextAfter.slice(0, endIdx) : contextAfter.slice(0, 5000);
  
  matches.push({
    pos: idx,
    contextBefore: contextBefore.slice(-150),
    dataUriLength: dataUri.length,
    dataUriPreview: dataUri.slice(0, 50) + '...'
  });
  idx += 10;
}

console.log('Total data:image/ occurrences:', matches.length);
matches.forEach((m, i) => {
  console.log(`\nMatch ${i+1} at byte ${m.pos}:`);
  console.log(`Context before: ${m.contextBefore}`);
  console.log(`Length: ${m.dataUriLength}, Preview: ${m.dataUriPreview}`);
});
