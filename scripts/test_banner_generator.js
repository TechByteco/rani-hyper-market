const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveProductImage(imgUrl) {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('data:image/')) return imgUrl;

  const candidateDirs = [
    path.join(__dirname, '..', 'public'),
    path.join(__dirname, '..'),
    process.cwd()
  ];

  for (const dir of candidateDirs) {
    const cleanPath = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl;
    const fullPath = path.join(dir, cleanPath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      try {
        const ext = path.extname(fullPath).toLowerCase();
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const buf = fs.readFileSync(fullPath);
        return `data:${mime};base64,${buf.toString('base64')}`;
      } catch (e) {}
    }
  }

  // If it's an HTTP URL
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  return '';
}

function buildSquareBannerSvg(data) {
  const width = 1080;
  const height = 1080;
  const engTitle = escapeXml(data.englishTitle || 'Karnataka Ponni Boiled Rice (25kg)');
  const tamTitle = escapeXml(data.tamilTitle || 'முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ)');
  const mrp = escapeXml(String(data.mrp || '1450').replace(/[^0-9.,]/g, ''));
  const offer = escapeXml(String(data.offerPrice || '1299').replace(/[^0-9.,]/g, ''));
  const savings = escapeXml(data.savingsText || 'சேமிப்பு: ₹151 (10% அதிரடி தள்ளுபடி!)');
  const badge = escapeXml(data.badgeText || '🔥 அதிரடி சலுகை • MEGA SAVINGS');
  const imageHref = resolveProductImage(data.skuImageUrl);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Luxury Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022C22"/>
      <stop offset="45%" stop-color="#064E3B"/>
      <stop offset="85%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>

    <!-- Gold Radial Spotlight -->
    <radialGradient id="goldGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25"/>
      <stop offset="70%" stop-color="#D97706" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0"/>
    </radialGradient>

    <!-- Product Stage Glow -->
    <radialGradient id="productGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0"/>
    </radialGradient>

    <!-- Gold Border Gradient -->
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <!-- Price Card Gradient -->
    <linearGradient id="priceCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>

    <!-- Shadow Filter -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1080" fill="url(#bgGrad)"/>
  <rect width="1080" height="1080" fill="url(#goldGlow)"/>

  <!-- Luxury Decorative Outer Border -->
  <rect x="36" y="36" width="1008" height="1008" rx="28" fill="none" stroke="url(#goldBorder)" stroke-width="3" stroke-opacity="0.6"/>
  <rect x="46" y="46" width="988" height="988" rx="22" fill="none" stroke="#D97706" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="8 6"/>

  <!-- Corner Filigree Ornaments -->
  <circle cx="56" cy="56" r="6" fill="#FCD34D"/>
  <circle cx="1024" cy="56" r="6" fill="#FCD34D"/>
  <circle cx="56" cy="1024" r="6" fill="#FCD34D"/>
  <circle cx="1024" cy="1024" r="6" fill="#FCD34D"/>

  <!-- ==================== HEADER BRANDING ==================== -->
  <g transform="translate(540, 85)">
    <!-- Top Badge Pill -->
    <rect x="-190" y="-12" width="380" height="40" rx="20" fill="#B91C1C" stroke="#FCA5A5" stroke-width="1.5"/>
    <text x="0" y="14" fill="#FFFFFF" font-size="16" font-weight="900" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="1.5">
      ${badge}
    </text>

    <!-- Main Store Brand Name -->
    <text x="0" y="65" fill="#FCD34D" font-size="44" font-weight="900" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
      RANI HYPER MARKET
    </text>

    <!-- Tamil Store / Terroir Subtitle -->
    <text x="0" y="98" fill="#A7F3D0" font-size="20" font-weight="600" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="1">
      போடிநாயக்கனூர் &#8226; போடி மெயின் ரோடு &#8226; ராணி மார்க்கெட்
    </text>
  </g>

  <!-- ==================== PRODUCT SHOWCASE STAGE ==================== -->
  <!-- Glowing Center Stage -->
  <circle cx="540" cy="420" r="230" fill="url(#productGlow)"/>
  <rect x="300" y="210" width="480" height="420" rx="24" fill="#022C22" fill-opacity="0.5" stroke="#047857" stroke-width="2" filter="url(#cardShadow)"/>

  ${imageHref ? `
  <image href="${imageHref}" x="320" y="230" width="440" height="380" preserveAspectRatio="xMidYMid meet"/>
  ` : `
  <!-- Fallback Grocery Icon -->
  <g transform="translate(540, 390)">
    <circle cx="0" cy="0" r="90" fill="#047857" fill-opacity="0.4"/>
    <text x="0" y="25" fill="#FCD34D" font-size="70" text-anchor="middle">🛒</text>
    <text x="0" y="140" fill="#A7F3D0" font-size="22" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">PREMIUM QUALITY STAPLE</text>
  </g>
  `}

  <!-- ==================== PRODUCT TITLES ==================== -->
  <g transform="translate(540, 680)">
    <!-- English Product Title -->
    <text x="0" y="0" fill="#FFFFFF" font-size="36" font-weight="900" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="0.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
      ${engTitle}
    </text>

    <!-- Tamil Product Title -->
    <text x="0" y="42" fill="#FCD34D" font-size="28" font-weight="700" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
      ${tamTitle}
    </text>
  </g>

  <!-- ==================== HIGH-CONTRAST PRICE BADGE ==================== -->
  <g transform="translate(540, 780)">
    <!-- Sunshine Yellow Card Backdrop -->
    <rect x="-340" y="0" width="680" height="175" rx="28" fill="url(#priceCardGrad)" filter="url(#cardShadow)" stroke="#FFFFFF" stroke-width="3"/>

    <!-- Left Box: MRP & Strike-through -->
    <g transform="translate(-170, 0)">
      <text x="0" y="52" fill="#4B5563" font-size="18" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle" text-transform="uppercase">
        வழக்கமான MRP
      </text>
      <!-- MRP Price Strike-through -->
      <text x="0" y="100" fill="#DC2626" font-size="44" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        ₹${mrp}
      </text>
      <!-- Red Strike line -->
      <line x1="-80" y1="88" x2="80" y2="88" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round"/>
      <text x="0" y="142" fill="#6B7280" font-size="16" font-weight="600" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        Standard Retail
      </text>
    </g>

    <!-- Divider Line -->
    <line x1="0" y1="20" x2="0" y2="155" stroke="#D97706" stroke-width="2" stroke-dasharray="6 4" stroke-opacity="0.5"/>

    <!-- Right Box: Special Offer Deal Price -->
    <g transform="translate(170, 0)">
      <text x="0" y="44" fill="#047857" font-size="18" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="1">
        ⭐ சிறப்பு ஆஃபர் விலை ⭐
      </text>
      <text x="0" y="112" fill="#000000" font-size="72" font-weight="950" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="-1">
        ₹${offer}
      </text>
      <!-- Pill Savings Badge -->
      <rect x="-135" y="128" width="270" height="34" rx="17" fill="#064E3B"/>
      <text x="0" y="151" fill="#34D399" font-size="15" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        ${savings}
      </text>
    </g>
  </g>

  <!-- ==================== VERIFIED BRAND FOOTER ==================== -->
  <g transform="translate(540, 1005)">
    <!-- Footer Pill -->
    <rect x="-380" y="-18" width="760" height="42" rx="21" fill="#022C22" stroke="#059669" stroke-width="1.5"/>
    <text x="0" y="9" fill="#FFFFFF" font-size="17" font-weight="700" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">
      📍 போடிநாயக்கனூர் &#8226; 🚚 Doorstep Delivery: <tspan fill="#FCD34D" font-weight="900">77088 34547</tspan> &#8226; 30-Min Fast Drop
    </text>
  </g>
</svg>
`;
}

function buildLandscapeBannerSvg(data) {
  const width = 1200;
  const height = 628;
  const engTitle = escapeXml(data.englishTitle || 'Karnataka Ponni Boiled Rice (25kg)');
  const tamTitle = escapeXml(data.tamilTitle || 'முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ)');
  const mrp = escapeXml(String(data.mrp || '1450').replace(/[^0-9.,]/g, ''));
  const offer = escapeXml(String(data.offerPrice || '1299').replace(/[^0-9.,]/g, ''));
  const savings = escapeXml(data.savingsText || 'சேமிப்பு: ₹151 (10% OFF)');
  const badge = escapeXml(data.badgeText || '🔥 அதிரடி சலுகை • MEGA OFFER');
  const imageHref = resolveProductImage(data.skuImageUrl);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgLand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022C22"/>
      <stop offset="50%" stop-color="#064E3B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <radialGradient id="goldGlowLand" cx="30%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldBorderLand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="priceCardLand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="shadowLand" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="628" fill="url(#bgLand)"/>
  <rect width="1200" height="628" fill="url(#goldGlowLand)"/>

  <!-- Outer Border -->
  <rect x="24" y="24" width="1152" height="580" rx="22" fill="none" stroke="url(#goldBorderLand)" stroke-width="2.5" stroke-opacity="0.6"/>

  <!-- LEFT COLUMN: BRANDING & DETAILS (Width 640) -->
  <g transform="translate(60, 55)">
    <!-- Top Badge -->
    <rect x="0" y="0" width="300" height="32" rx="16" fill="#B91C1C" stroke="#FCA5A5" stroke-width="1"/>
    <text x="150" y="21" fill="#FFFFFF" font-size="14" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="1">
      ${badge}
    </text>

    <!-- Store Brand -->
    <text x="0" y="75" fill="#FCD34D" font-size="38" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" letter-spacing="2">
      RANI HYPER MARKET
    </text>
    <text x="0" y="105" fill="#A7F3D0" font-size="18" font-weight="600" font-family="'Segoe UI', Roboto, sans-serif">
      போடிநாயக்கனூர் &#8226; போடி மெயின் ரோடு &#8226; ராணி மார்க்கெட்
    </text>

    <!-- Product Titles -->
    <text x="0" y="165" fill="#FFFFFF" font-size="30" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif">
      ${engTitle}
    </text>
    <text x="0" y="202" fill="#FCD34D" font-size="24" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif">
      ${tamTitle}
    </text>

    <!-- High-Contrast Price Badge Card -->
    <g transform="translate(0, 235)">
      <rect x="0" y="0" width="560" height="150" rx="22" fill="url(#priceCardLand)" filter="url(#shadowLand)" stroke="#FFFFFF" stroke-width="2.5"/>

      <!-- MRP Left Box -->
      <g transform="translate(130, 0)">
        <text x="0" y="42" fill="#4B5563" font-size="16" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          வழக்கமான MRP
        </text>
        <text x="0" y="86" fill="#DC2626" font-size="38" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ₹${mrp}
        </text>
        <line x1="-65" y1="75" x2="65" y2="75" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
        <text x="0" y="122" fill="#4B5563" font-size="14" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          Regular Price
        </text>
      </g>

      <line x1="270" y1="15" x2="270" y2="135" stroke="#D97706" stroke-width="2" stroke-dasharray="6 4" stroke-opacity="0.5"/>

      <!-- Offer Right Box -->
      <g transform="translate(415, 0)">
        <text x="0" y="38" fill="#047857" font-size="16" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ⭐ ஆஃபர் விலை ⭐
        </text>
        <text x="0" y="96" fill="#000000" font-size="62" font-weight="950" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ₹${offer}
        </text>
        <rect x="-120" y="108" width="240" height="30" rx="15" fill="#064E3B"/>
        <text x="0" y="128" fill="#34D399" font-size="14" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ${savings}
        </text>
      </g>
    </g>

    <!-- Verified Footer -->
    <g transform="translate(0, 435)">
      <rect x="0" y="0" width="560" height="36" rx="18" fill="#022C22" stroke="#059669" stroke-width="1.2"/>
      <text x="280" y="23" fill="#FFFFFF" font-size="14" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        📍 போடி &#8226; 🚚 Doorstep Delivery: <tspan fill="#FCD34D" font-weight="900">77088 34547</tspan> &#8226; 30-Min Fast Drop
      </text>
    </g>
  </g>

  <!-- RIGHT COLUMN: PRODUCT SHOWCASE STAGE (Width 480) -->
  <g transform="translate(680, 70)">
    <circle cx="230" cy="230" r="210" fill="#10B981" fill-opacity="0.18"/>
    <rect x="10" y="10" width="440" height="440" rx="28" fill="#022C22" fill-opacity="0.5" stroke="#047857" stroke-width="2" filter="url(#shadowLand)"/>
    ${imageHref ? `
    <image href="${imageHref}" x="30" y="30" width="400" height="400" preserveAspectRatio="xMidYMid meet"/>
    ` : `
    <g transform="translate(230, 210)">
      <circle cx="0" cy="0" r="80" fill="#047857" fill-opacity="0.4"/>
      <text x="0" y="25" fill="#FCD34D" font-size="65" text-anchor="middle">🛒</text>
      <text x="0" y="130" fill="#A7F3D0" font-size="20" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">SUPERIOR QUALITY</text>
    </g>
    `}
  </g>
</svg>
`;
}

async function runTest() {
  console.log('Testing Square and Landscape Banner Generation...');
  const payload = {
    skuImageUrl: 'images/products/domex_disinfectant_multi_surfa_back.png',
    englishTitle: 'Domex Disinfectant Multi-Surface Floor Cleaner 1L',
    tamilTitle: 'டோமெக்ஸ் பவர் கிளீனர் & கிருமிநாசினி (1 லிட்டர்)',
    mrp: '210',
    offerPrice: '179',
    savingsText: 'சேமிப்பு: ₹31 (15% தள்ளுபடி)',
    badgeText: '🔥 இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு'
  };

  // 1. Square (1080x1080)
  const sqSvg = buildSquareBannerSvg(payload);
  const t0 = performance.now();
  const sqWebp = await sharp(Buffer.from(sqSvg)).webp({ quality: 82, effort: 3 }).toBuffer();
  const sqTime = performance.now() - t0;
  console.log(`Square 1080x1080: Rendered in ${sqTime.toFixed(1)} ms | Size: ${(sqWebp.length / 1024).toFixed(1)} KB`);

  // 2. Landscape (1200x628)
  const lsSvg = buildLandscapeBannerSvg(payload);
  const t1 = performance.now();
  const lsWebp = await sharp(Buffer.from(lsSvg)).webp({ quality: 82, effort: 3 }).toBuffer();
  const lsTime = performance.now() - t1;
  console.log(`Landscape 1200x628: Rendered in ${lsTime.toFixed(1)} ms | Size: ${(lsWebp.length / 1024).toFixed(1)} KB`);

  // Save sample outputs
  fs.writeFileSync('public/sample_banner_square.webp', sqWebp);
  fs.writeFileSync('public/sample_banner_landscape.webp', lsWebp);
  console.log('Saved public/sample_banner_square.webp and public/sample_banner_landscape.webp');
}

runTest();
