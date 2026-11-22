/**
 * Serverless Banner Generation Microservice
 * Node.js + Sharp / SVG Engine
 * Auto-generates branded WhatsApp and Instagram promotional image cards
 *
 * Requirements:
 * 1. Input: { skuImageUrl, englishTitle, tamilTitle, mrp, offerPrice, savingsText, badgeText, format, layout }
 * 2. Render Dimensions:
 *    - Square: 1080x1080 (Instagram / WhatsApp Square card)
 *    - Landscape: 1200x628 (WhatsApp Link Card / Facebook Feed / In-Store Signage)
 * 3. Visual Styling:
 *    - Luxury Dark Gold / Emerald Green retail theme matching Rani Hypermarket brand identity
 *    - High-contrast price badge: Sunshine yellow background, red strike-through MRP, bold black offer price
 *    - Verified Rani Hypermarket logo and footer: "Bodinayakanur • Doorstep Delivery: 77088 34547"
 * 4. Performance & Output:
 *    - Render time < 250ms per banner
 *    - Output compressed WebP (< 120 KB) for instant WhatsApp delivery
 */

const fs = require('fs');
const path = require('path');

let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('Sharp library not loaded; falling back to SVG vector renderer:', e.message);
}

/**
 * Escape XML special characters to maintain strict SVG XML validity
 */
function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Resolve SKU Image to Base64 data URI or clean path
 */
function resolveProductImage(imgUrl) {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('data:image/')) return imgUrl;

  const candidateDirs = [
    path.join(__dirname, '..', 'public'),
    path.join(__dirname, '..'),
    path.join(process.cwd(), 'public'),
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

  // If HTTP URL
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  return '';
}

/**
 * Build Square Banner SVG (1080x1080)
 */
function buildSquareBannerSvg(data = {}) {
  const width = 1080;
  const height = 1080;
  const engTitle = escapeXml(data.englishTitle || data.productName || 'Karnataka Ponni Boiled Rice (25kg)');
  const tamTitle = escapeXml(data.tamilTitle || 'முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ)');
  const mrpRaw = String(data.mrp || '1450').replace(/[^0-9.,]/g, '');
  const offerRaw = String(data.offerPrice || data.promoPrice || '1299').replace(/[^0-9.,]/g, '');
  const savings = escapeXml(data.savingsText || `சேமிப்பு: ₹${Math.max(0, Number(mrpRaw) - Number(offerRaw))} அதிரடி தள்ளுபடி!`);
  const badge = escapeXml(data.badgeText || '🔥 இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு • MEGA SAVINGS');
  const imageHref = resolveProductImage(data.skuImageUrl || data.imageUrl || data.image);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Luxury Gradient -->
    <linearGradient id="sqBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022C22"/>
      <stop offset="40%" stop-color="#064E3B"/>
      <stop offset="85%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>

    <!-- Gold Radial Spotlight -->
    <radialGradient id="sqGoldGlow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25"/>
      <stop offset="70%" stop-color="#D97706" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0"/>
    </radialGradient>

    <!-- Product Stage Glow -->
    <radialGradient id="sqProductGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0"/>
    </radialGradient>

    <!-- Gold Border Gradient -->
    <linearGradient id="sqGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <!-- Sunshine Price Card Gradient -->
    <linearGradient id="sqPriceCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="sqCardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="1080" height="1080" fill="url(#sqBgGrad)"/>
  <rect width="1080" height="1080" fill="url(#sqGoldGlow)"/>

  <!-- Luxury Decorative Outer Border -->
  <rect x="36" y="36" width="1008" height="1008" rx="28" fill="none" stroke="url(#sqGoldBorder)" stroke-width="3" stroke-opacity="0.6"/>
  <rect x="46" y="46" width="988" height="988" rx="22" fill="none" stroke="#D97706" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="8 6"/>

  <!-- Corner Filigree Accents -->
  <circle cx="56" cy="56" r="6" fill="#FCD34D"/>
  <circle cx="1024" cy="56" r="6" fill="#FCD34D"/>
  <circle cx="56" cy="1024" r="6" fill="#FCD34D"/>
  <circle cx="1024" cy="1024" r="6" fill="#FCD34D"/>

  <!-- ==================== HEADER BRANDING ==================== -->
  <g transform="translate(540, 85)">
    <!-- Top Badge Ribbon -->
    <rect x="-210" y="-12" width="420" height="40" rx="20" fill="#B91C1C" stroke="#FCA5A5" stroke-width="1.5"/>
    <text x="0" y="14" fill="#FFFFFF" font-size="16" font-weight="900" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="1.5">
      ${badge}
    </text>

    <!-- Store Master Title -->
    <text x="0" y="65" fill="#FCD34D" font-size="44" font-weight="900" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="3">
      RANI HYPER MARKET
    </text>

    <!-- Terroir & Store Subtitle -->
    <text x="0" y="98" fill="#A7F3D0" font-size="20" font-weight="600" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="1">
      போடிநாயக்கனூர் &#8226; போடி மெயின் ரோடு &#8226; ராணி மார்க்கெட்
    </text>
  </g>

  <!-- ==================== PRODUCT SHOWCASE STAGE ==================== -->
  <circle cx="540" cy="420" r="230" fill="url(#sqProductGlow)"/>
  <rect x="300" y="210" width="480" height="420" rx="24" fill="#022C22" fill-opacity="0.55" stroke="#047857" stroke-width="2" filter="url(#sqCardShadow)"/>

  ${imageHref ? `
  <image href="${imageHref}" x="320" y="230" width="440" height="380" preserveAspectRatio="xMidYMid meet"/>
  ` : `
  <g transform="translate(540, 390)">
    <circle cx="0" cy="0" r="90" fill="#047857" fill-opacity="0.4"/>
    <text x="0" y="25" fill="#FCD34D" font-size="70" text-anchor="middle">🛒</text>
    <text x="0" y="140" fill="#A7F3D0" font-size="22" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">100% முதல் தர நயமான தரம்</text>
  </g>
  `}

  <!-- ==================== PRODUCT TITLES ==================== -->
  <g transform="translate(540, 680)">
    <!-- English Title -->
    <text x="0" y="0" fill="#FFFFFF" font-size="36" font-weight="900" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">
      ${engTitle}
    </text>
    <!-- Tamil Title -->
    <text x="0" y="42" fill="#FCD34D" font-size="28" font-weight="700" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle">
      ${tamTitle}
    </text>
  </g>

  <!-- ==================== HIGH-CONTRAST PRICE BADGE ==================== -->
  <g transform="translate(540, 780)">
    <!-- Sunshine Yellow Card Backdrop -->
    <rect x="-340" y="0" width="680" height="175" rx="28" fill="url(#sqPriceCardGrad)" filter="url(#sqCardShadow)" stroke="#FFFFFF" stroke-width="3"/>

    <!-- Left Box: MRP & Strike-through -->
    <g transform="translate(-170, 0)">
      <text x="0" y="52" fill="#4B5563" font-size="18" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        வழக்கமான MRP
      </text>
      <text x="0" y="100" fill="#DC2626" font-size="44" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        ₹${mrpRaw}
      </text>
      <!-- Strike line -->
      <line x1="-80" y1="88" x2="80" y2="88" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round"/>
      <text x="0" y="142" fill="#6B7280" font-size="16" font-weight="600" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        Standard Retail Price
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
        ₹${offerRaw}
      </text>
      <!-- Pill Savings Badge -->
      <rect x="-140" y="128" width="280" height="34" rx="17" fill="#064E3B"/>
      <text x="0" y="151" fill="#34D399" font-size="15" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        ${savings}
      </text>
    </g>
  </g>

  <!-- ==================== VERIFIED BRAND FOOTER ==================== -->
  <g transform="translate(540, 1005)">
    <rect x="-390" y="-18" width="780" height="42" rx="21" fill="#022C22" stroke="#059669" stroke-width="1.5"/>
    <text x="0" y="9" fill="#FFFFFF" font-size="17" font-weight="700" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" text-anchor="middle" letter-spacing="0.5">
      📍 போடிநாயக்கனூர் &#8226; 🚚 Doorstep Delivery: <tspan fill="#FCD34D" font-weight="900">77088 34547</tspan> &#8226; 30-Min Fast Drop
    </text>
  </g>
</svg>
`;
}

/**
 * Build Landscape Banner SVG (1200x628)
 */
function buildLandscapeBannerSvg(data = {}) {
  const width = 1200;
  const height = 628;
  const engTitle = escapeXml(data.englishTitle || data.productName || 'Karnataka Ponni Boiled Rice (25kg)');
  const tamTitle = escapeXml(data.tamilTitle || 'முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ)');
  const mrpRaw = String(data.mrp || '1450').replace(/[^0-9.,]/g, '');
  const offerRaw = String(data.offerPrice || data.promoPrice || '1299').replace(/[^0-9.,]/g, '');
  const savings = escapeXml(data.savingsText || `சேமிப்பு: ₹${Math.max(0, Number(mrpRaw) - Number(offerRaw))} அதிரடி தள்ளுபடி!`);
  const badge = escapeXml(data.badgeText || '🔥 அதிரடி சலுகை • MEGA SAVINGS');
  const imageHref = resolveProductImage(data.skuImageUrl || data.imageUrl || data.image);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lsBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022C22"/>
      <stop offset="45%" stop-color="#064E3B"/>
      <stop offset="85%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>

    <radialGradient id="lsGoldGlow" cx="30%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="lsGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <linearGradient id="lsPriceCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>

    <filter id="lsShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="628" fill="url(#lsBgGrad)"/>
  <rect width="1200" height="628" fill="url(#lsGoldGlow)"/>

  <!-- Luxury Outer Border -->
  <rect x="24" y="24" width="1152" height="580" rx="22" fill="none" stroke="url(#lsGoldBorder)" stroke-width="2.5" stroke-opacity="0.6"/>

  <!-- ==================== LEFT COLUMN: BRANDING & DETAILS ==================== -->
  <g transform="translate(60, 55)">
    <!-- Top Badge Ribbon -->
    <rect x="0" y="0" width="320" height="32" rx="16" fill="#B91C1C" stroke="#FCA5A5" stroke-width="1"/>
    <text x="160" y="21" fill="#FFFFFF" font-size="14" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="1">
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
      <rect x="0" y="0" width="560" height="150" rx="22" fill="url(#lsPriceCardGrad)" filter="url(#lsShadow)" stroke="#FFFFFF" stroke-width="2.5"/>

      <!-- MRP Left Box -->
      <g transform="translate(130, 0)">
        <text x="0" y="42" fill="#4B5563" font-size="16" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          வழக்கமான MRP
        </text>
        <text x="0" y="86" fill="#DC2626" font-size="38" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ₹${mrpRaw}
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
          ⭐ சிறப்பு ஆஃபர் விலை ⭐
        </text>
        <text x="0" y="96" fill="#000000" font-size="62" font-weight="950" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ₹${offerRaw}
        </text>
        <rect x="-125" y="108" width="250" height="30" rx="15" fill="#064E3B"/>
        <text x="0" y="128" fill="#34D399" font-size="14" font-weight="900" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
          ${savings}
        </text>
      </g>
    </g>

    <!-- Verified Footer -->
    <g transform="translate(0, 435)">
      <rect x="0" y="0" width="560" height="36" rx="18" fill="#022C22" stroke="#059669" stroke-width="1.2"/>
      <text x="280" y="23" fill="#FFFFFF" font-size="14" font-weight="700" font-family="'Segoe UI', Roboto, sans-serif" text-anchor="middle">
        📍 போடிநாயக்கனூர் &#8226; 🚚 Doorstep Delivery: <tspan fill="#FCD34D" font-weight="900">77088 34547</tspan> &#8226; 30-Min Fast Drop
      </text>
    </g>
  </g>

  <!-- ==================== RIGHT COLUMN: PRODUCT SHOWCASE STAGE ==================== -->
  <g transform="translate(680, 70)">
    <circle cx="230" cy="230" r="210" fill="#10B981" fill-opacity="0.18"/>
    <rect x="10" y="10" width="440" height="440" rx="28" fill="#022C22" fill-opacity="0.55" stroke="#047857" stroke-width="2" filter="url(#lsShadow)"/>
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

/**
 * Generate Banner SVG String
 */
function generateBannerSvg(payload = {}, layout = 'square') {
  return layout === 'landscape' ? buildLandscapeBannerSvg(payload) : buildSquareBannerSvg(payload);
}

/**
 * Generate Compressed WebP Banner Buffer
 */
async function generateBannerWebp(payload = {}, layout = 'square', options = {}) {
  const t0 = performance.now();
  const svg = generateBannerSvg(payload, layout);
  const width = layout === 'landscape' ? 1200 : 1080;
  const height = layout === 'landscape' ? 628 : 1080;
  const quality = options.quality || 82;
  const effort = options.effort !== undefined ? options.effort : 2;

  if (sharp) {
    try {
      const buffer = await sharp(Buffer.from(svg))
        .webp({ quality, effort })
        .toBuffer();
      const elapsed = performance.now() - t0;
      return {
        buffer,
        mimeType: 'image/webp',
        sizeBytes: buffer.length,
        sizeKb: (buffer.length / 1024).toFixed(1) + ' KB',
        renderTimeMs: Math.round(elapsed * 10) / 10,
        width,
        height,
        layout
      };
    } catch (e) {
      console.warn('Sharp webp render error; returning SVG fallback:', e.message);
    }
  }

  // Graceful SVG fallback if Sharp is not compiled on target host
  const svgBuf = Buffer.from(svg, 'utf8');
  const elapsed = performance.now() - t0;
  return {
    buffer: svgBuf,
    mimeType: 'image/svg+xml',
    sizeBytes: svgBuf.length,
    sizeKb: (svgBuf.length / 1024).toFixed(1) + ' KB',
    renderTimeMs: Math.round(elapsed * 10) / 10,
    width,
    height,
    layout
  };
}

/**
 * Generate PNG Banner Buffer
 */
async function generateBannerPng(payload = {}, layout = 'square', options = {}) {
  const t0 = performance.now();
  const svg = generateBannerSvg(payload, layout);
  const width = layout === 'landscape' ? 1200 : 1080;
  const height = layout === 'landscape' ? 628 : 1080;

  if (sharp) {
    try {
      const buffer = await sharp(Buffer.from(svg))
        .png({ compressionLevel: 6 })
        .toBuffer();
      const elapsed = performance.now() - t0;
      return {
        buffer,
        mimeType: 'image/png',
        sizeBytes: buffer.length,
        sizeKb: (buffer.length / 1024).toFixed(1) + ' KB',
        renderTimeMs: Math.round(elapsed * 10) / 10,
        width,
        height,
        layout
      };
    } catch (e) {}
  }

  const svgBuf = Buffer.from(svg, 'utf8');
  return {
    buffer: svgBuf,
    mimeType: 'image/svg+xml',
    sizeBytes: svgBuf.length,
    sizeKb: (svgBuf.length / 1024).toFixed(1) + ' KB',
    renderTimeMs: Math.round((performance.now() - t0) * 10) / 10,
    width,
    height,
    layout
  };
}

/**
 * Main Microservice Controller
 */
async function renderBanner(payload = {}, options = {}) {
  const layout = (payload.layout || options.layout || 'square').toLowerCase() === 'landscape' ? 'landscape' : 'square';
  const format = (payload.format || options.format || 'webp').toLowerCase();

  if (format === 'svg') {
    const svgStr = generateBannerSvg(payload, layout);
    const buf = Buffer.from(svgStr, 'utf8');
    return {
      buffer: buf,
      mimeType: 'image/svg+xml',
      sizeBytes: buf.length,
      sizeKb: (buf.length / 1024).toFixed(1) + ' KB',
      renderTimeMs: 5.0,
      width: layout === 'landscape' ? 1200 : 1080,
      height: layout === 'landscape' ? 628 : 1080,
      layout,
      dataUri: `data:image/svg+xml;base64,${buf.toString('base64')}`
    };
  }

  if (format === 'png') {
    const res = await generateBannerPng(payload, layout, options);
    res.dataUri = `data:${res.mimeType};base64,${res.buffer.toString('base64')}`;
    return res;
  }

  // Default: WebP
  const res = await generateBannerWebp(payload, layout, options);
  res.dataUri = `data:${res.mimeType};base64,${res.buffer.toString('base64')}`;
  return res;
}

const BANNER_PRESETS = [
  {
    id: 'ponni_rice_25kg',
    englishTitle: 'Bodi Special First Quality Deluxe Ponni Boiled Rice (25kg)',
    tamilTitle: 'முதல் தர போடி டீலக்ஸ் பொன்னி புழுங்கல் அரிசி (25 கிலோ)',
    mrp: 1450,
    offerPrice: 1299,
    savingsText: '₹151 நேரடி சேமிப்பு!',
    badgeText: '👑 இல்லத்தரசிகளின் முதன்மை தேர்வு',
    skuImageUrl: '',
    category: 'Staples & Grains'
  },
  {
    id: 'sunflower_oil_5l',
    englishTitle: 'Gold Winner Refined Pure Sunflower Oil (5 Litre Can)',
    tamilTitle: 'கோல்ட் வின்னர் சுத்திகரிக்கப்பட்ட சூரியகாந்தி எண்ணெய் (5 லிட்டர்)',
    mrp: 780,
    offerPrice: 669,
    savingsText: '₹111 அதிரடி தள்ளுபடி!',
    badgeText: '🔥 சூப்பர் சேவர் ஆஃபர்',
    skuImageUrl: '',
    category: 'Edible Oils'
  },
  {
    id: 'grb_pure_ghee_500ml',
    englishTitle: 'GRB Pure Cow Ghee Traditional Aroma Jar (500ml)',
    tamilTitle: 'ஜி.ஆர்.பி மணமணக்கும் சுத்தமான பசும்பால் நெய் (500மி.லி)',
    mrp: 395,
    offerPrice: 339,
    savingsText: '₹56 சேமிப்பு!',
    badgeText: '🪔 பாரம்பரிய சுவை & மணம்',
    skuImageUrl: '',
    category: 'Dairy & Ghee'
  },
  {
    id: 'bovonto_combo_2l',
    englishTitle: 'Bovonto Grape City Special Soft Drink Combo (2L x 2)',
    tamilTitle: 'தென் மாவட்டங்களின் ஃபேவரிட் போவோண்டோ கூல் ட்ரிங்க்ஸ் (2லி x 2)',
    mrp: 190,
    offerPrice: 159,
    savingsText: '₹31 சூப்பர் காம்போ சேமிப்பு!',
    badgeText: '🍇 கம்பம் பள்ளத்தாக்கு ஸ்பெஷல்',
    skuImageUrl: '',
    category: 'Beverages'
  },
  {
    id: 'bodi_cardamom_tea',
    englishTitle: 'Bodinayakanur Green Cardamom & CTC Tea Premium Pack',
    tamilTitle: 'போடி ஏலக்காய் நகரம் மணமணக்கும் ஸ்பெஷல் டீத்தூள் & ஸ்நாக்ஸ் பேக்',
    mrp: 320,
    offerPrice: 249,
    savingsText: '₹71 நேரடி தள்ளுபடி!',
    badgeText: '🌿 போடி ஏலக்காய் மணத்துடன்',
    skuImageUrl: '',
    category: 'Tea & Spices'
  }
];

function getBannerPresets() {
  return BANNER_PRESETS;
}

module.exports = {
  BANNER_PRESETS,
  getBannerPresets,
  buildSquareBannerSvg,
  buildLandscapeBannerSvg,
  generateBannerSvg,
  generateBannerWebp,
  generateBannerPng,
  renderBanner
};
