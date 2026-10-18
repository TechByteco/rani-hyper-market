const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data';

fs.mkdirSync('public/images/custom_extracted', { recursive: true });

function findBase64Images(filePath, label) {
  if (!fs.existsSync(filePath)) return [];
  const buf = fs.readFileSync(filePath);
  const str = buf.toString('latin1');

  const images = [];
  let pos = 0;
  while ((pos = str.indexOf('data:image/', pos)) !== -1) {
    // Find the end of base64 (quote, null, or non-base64 char)
    let end = pos;
    while (end < str.length && (
      (str[end] >= 'A' && str[end] <= 'Z') ||
      (str[end] >= 'a' && str[end] <= 'z') ||
      (str[end] >= '0' && str[end] <= '9') ||
      str[end] === '+' || str[end] === '/' || str[end] === '=' ||
      str[end] === ':' || str[end] === ';' || str[end] === ','
    )) {
      end++;
    }
    const dataUri = str.substring(pos, end);
    const before = str.substring(Math.max(0, pos - 150), pos);
    images.push({ dataUri, before, label, offset: pos });
    pos = end + 1;
  }
  return images;
}

const allImages = [];
['Profile 8', 'Profile 12', 'Profile 16', 'Profile 18', 'Profile 2', 'Default'].forEach(p => {
  const lsDir = path.join(baseDir, p, 'Local Storage', 'leveldb');
  if (fs.existsSync(lsDir)) {
    fs.readdirSync(lsDir).forEach(f => {
      if (f.endsWith('.ldb') || f.endsWith('.log')) {
        const found = findBase64Images(path.join(lsDir, f), `${p} LS/${f}`);
        allImages.push(...found);
      }
    });
  }
});

console.log(`Found ${allImages.length} base64 images total.`);
allImages.forEach((img, idx) => {
  console.log(`\n--- Image #${idx + 1} (${img.label}) ---`);
  console.log(`Data URI length: ${img.dataUri.length}`);
  const cleanBefore = img.before.replace(/[^\x20-\x7e]/g, ' ');
  console.log(`Context before: ${cleanBefore.slice(-100)}`);

  // Try extracting product ID or title
  const idMatch = cleanBefore.match(/(?:\"id\"|\"|\b)(\d{1,6})(?:\"|\b)/);
  const titleMatch = cleanBefore.match(/title[\"\s:]+([A-Za-z0-9\s\+\-\*\/\.\(\)]+)/i);
  console.log(`Inferred ID: ${idMatch ? idMatch[1] : 'none'}, Title: ${titleMatch ? titleMatch[1] : 'none'}`);

  // Save to public/images/custom_extracted
  try {
    const parts = img.dataUri.split(',');
    if (parts.length === 2) {
      const mime = parts[0].match(/data:(image\/[a-z]+);base64/i);
      const ext = mime ? mime[1].split('/')[1] : 'jpg';
      const b64Buf = Buffer.from(parts[1], 'base64');
      const filename = `img_${idx + 1}_${pName(img.label)}_${idMatch ? idMatch[1] : 'unknown'}.${ext}`;
      fs.writeFileSync(`public/images/custom_extracted/${filename}`, b64Buf);
      console.log(`Saved as public/images/custom_extracted/${filename} (${b64Buf.length} bytes)`);
    }
  } catch(e) {
    console.error('Error saving image:', e.message);
  }
});

function pName(label) {
  return label.replace(/[^a-zA-Z0-9]/g, '_');
}
