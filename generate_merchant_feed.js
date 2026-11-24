const fs = require('fs');
const path = require('path');

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateGoogleMerchantFeed() {
  const catPath = path.join(__dirname, 'products_catalog.json');
  if (!fs.existsSync(catPath)) {
    console.error('products_catalog.json not found');
    return;
  }

  const products = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  const baseUrl = 'https://rani-hyper-market.vercel.app';
  const defaultImage = `${baseUrl}/images/rani_logo.png`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Rani Hyper Market Products Catalog</title>
    <link>${baseUrl}</link>
    <description>Official Google Merchant Center Product Feed for Rani Hyper Market, Bodinayakanur, Theni - Fresh groceries, daily staples, packaged foods, and household essentials.</description>
`;

  let count = 0;
  for (const p of products) {
    const title = p.title || p.name;
    if (!title) continue;

    const id = p.id || count + 1;
    const price = typeof p.price === 'number' ? p.price.toFixed(2) : parseFloat(p.price || 0).toFixed(2);
    const mrp = typeof p.mrp === 'number' ? p.mrp.toFixed(2) : (p.mrp ? parseFloat(p.mrp).toFixed(2) : price);
    const link = `${baseUrl}/store?product=${id}`;
    const rawImg = p.image_url || p.image;
    const imageLink = (rawImg && rawImg.startsWith('http')) ? rawImg : defaultImage;
    const availability = (p.stock === 0 || p.in_stock === false) ? 'out_of_stock' : 'in_stock';
    const barcode = (p.barcode || p.gtin || '').toString().trim();
    const hasValidGtin = /^[0-9]{8,14}$/.test(barcode);

    // Clean description
    const desc = `${title} available at Rani Hyper Market, Bodinayakanur, Theni. Fresh quality, best local pricing at ₹${price} with fast home delivery in Bodinayakanur. GSTIN: 33BAGPN1341C1ZC.`;

    xml += `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(desc)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price} INR</g:price>
      <g:condition>new</g:condition>
      <g:brand>Rani Hyper Market</g:brand>
      <g:google_product_category>Food, Beverages &amp; Tobacco</g:google_product_category>
`;

    if (hasValidGtin) {
      xml += `      <g:gtin>${escapeXml(barcode)}</g:gtin>
      <g:identifier_exists>yes</g:identifier_exists>
`;
    } else {
      xml += `      <g:identifier_exists>no</g:identifier_exists>
`;
    }

    xml += `    </item>
`;
    count++;
  }

  xml += `  </channel>
</rss>`;

  fs.writeFileSync(path.join(__dirname, 'google-merchant-feed.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'public', 'google-merchant-feed.xml'), xml, 'utf8');
  console.log(`Generated Google Merchant Feed with ${count} products.`);
}

generateGoogleMerchantFeed();
