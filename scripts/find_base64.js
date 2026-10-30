const fs = require('fs');
const decomp = fs.readFileSync('scripts/decompressed_blob_c.bin');

const str = decomp.toString('latin1');
const dataUriRegex = /idI([^\x00-\x1f]+)?" title" ([^\"]+)".*?image_url"([^\"]*data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)/g;

let count = 0;
let match;
while ((match = dataUriRegex.exec(str)) !== null) {
  count++;
  console.log(`Found base64 product: Title="${match[2]}" (length: ${match[3].length})`);
}
console.log(`Total base64 images found: ${count}`);
