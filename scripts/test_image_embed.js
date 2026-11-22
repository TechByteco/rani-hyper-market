const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Let's find a local product image
const testImgPath = path.join(__dirname, '..', 'public', 'images', 'products');
let sampleImgBase64 = '';
if (fs.existsSync(testImgPath)) {
  const files = fs.readdirSync(testImgPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  if (files.length > 0) {
    const imgBuf = fs.readFileSync(path.join(testImgPath, files[0]));
    sampleImgBase64 = `data:image/jpeg;base64,${imgBuf.toString('base64')}`;
    console.log(`Found sample product image: ${files[0]} (${imgBuf.length} bytes)`);
  }
}

const svgWithImage = `
<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="#064E3B"/>
  ${sampleImgBase64 ? `<image href="${sampleImgBase64}" x="290" y="280" width="500" height="400" preserveAspectRatio="xMidYMid meet"/>` : ''}
  <text x="540" y="800" fill="#F59E0B" font-size="48" font-family="Arial, sans-serif" text-anchor="middle">
    TEST PRODUCT IMAGE EMBED
  </text>
</svg>
`;

const t0 = performance.now();
sharp(Buffer.from(svgWithImage))
  .webp({ quality: 80 })
  .toBuffer()
  .then(buf => {
    console.log(`Render time with image: ${(performance.now() - t0).toFixed(1)} ms`);
    console.log(`WebP Size: ${(buf.length / 1024).toFixed(1)} KB`);
  })
  .catch(err => console.error('Error:', err));
