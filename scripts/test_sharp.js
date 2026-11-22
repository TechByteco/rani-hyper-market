const sharp = require('sharp');

const svg = `
<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042F2E"/>
      <stop offset="60%" stop-color="#064E3B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect width="1080" height="1080" fill="url(#goldGlow)"/>
  <rect x="40" y="40" width="1000" height="1000" rx="32" fill="none" stroke="#D97706" stroke-width="4" stroke-opacity="0.5"/>
  <text x="540" y="160" fill="#FCD34D" font-size="52" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle" letter-spacing="4">
    RANI HYPER MARKET
  </text>
  <text x="540" y="210" fill="#A7F3D0" font-size="28" font-family="Arial, sans-serif" text-anchor="middle">
    போடிநாயக்கனூர் &#8226; போடி மெயின் ரோடு
  </text>
  <!-- Price Badge -->
  <g transform="translate(680, 720)">
    <rect width="320" height="180" rx="24" fill="#FBBF24" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.4))"/>
    <text x="160" y="55" fill="#DC2626" font-size="28" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle" text-decoration="line-through">
      MRP ₹1,450
    </text>
    <text x="160" y="125" fill="#000000" font-size="64" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">
      ₹1,299
    </text>
    <text x="160" y="160" fill="#047857" font-size="20" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">
      சேமிப்பு: ₹151 (10% OFF)
    </text>
  </g>
</svg>
`;

async function testBench() {
  console.log('Warming up Sharp...');
  await sharp(Buffer.from(svg)).webp().toBuffer();

  const times = [];
  let finalBuffer = null;
  for (let i = 0; i < 5; i++) {
    const t0 = performance.now();
    finalBuffer = await sharp(Buffer.from(svg))
      .webp({ quality: 82, effort: 3 })
      .toBuffer();
    const elapsed = performance.now() - t0;
    times.push(elapsed);
    console.log(`Run ${i+1}: ${elapsed.toFixed(1)} ms | Size: ${(finalBuffer.length / 1024).toFixed(1)} KB`);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`Average render time: ${avg.toFixed(1)} ms`);
  console.log(`Target < 250ms achieved: ${avg < 250 ? 'YES! ⚡' : 'NO'}`);
  console.log(`Target < 120KB achieved: ${finalBuffer.length < 120 * 1024 ? 'YES! 📦' : 'NO'}`);
}

testBench();
