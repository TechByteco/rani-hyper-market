const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'server.js');
let code = fs.readFileSync(serverPath, 'utf8');

const target = `  if (reqPath === '/api/ai-analytics/chat' && req.method === 'POST') {`;

const newRoutes = `  // AI Marketing Campaign & Formula Synthesizer
  if ((reqPath === '/api/ai-marketing/generate' || reqPath === '/api/marketing/generate') && (req.method === 'POST' || req.method === 'GET')) {
    const generativeAi = require('./generativeAiAdvisor');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let parsed = {};
        if (req.method === 'POST' && body) {
          try { parsed = JSON.parse(body); } catch(e) { parsed = {}; }
        } else {
          parsed = Object.fromEntries(queryParams.entries());
        }
        const result = await generativeAi.generateMarketingCampaign(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Top Catalog Staples for Instant Selector
  if (reqPath === '/api/ai-marketing/catalog-staples' || reqPath === '/api/marketing/staples') {
    try {
      let catalog = [];
      const catPath = path.join(__dirname, 'products_catalog.json');
      const raniPath = path.join(__dirname, 'rani_products.json');
      if (fs.existsSync(catPath)) {
        catalog = JSON.parse(fs.readFileSync(catPath, 'utf8'));
      } else if (fs.existsSync(raniPath)) {
        catalog = JSON.parse(fs.readFileSync(raniPath, 'utf8'));
      }
      const stapleKeywords = ['rice', 'oil', 'sugar', 'dhal', 'dal', 'atta', 'ghee', 'salt', 'tea', 'chilli', 'soap', 'biscuit', 'vermicelli'];
      const matched = [];
      const seen = new Set();
      for (const item of catalog) {
        const title = (item.title || item.Name || '').trim();
        const lower = title.toLowerCase();
        const isStaple = stapleKeywords.some(k => lower.includes(k));
        if (isStaple && !seen.has(title) && item.price > 15) {
          seen.add(title);
          matched.push({
            id: item.id,
            title: title,
            price: item.price || item.SalesRate || 100,
            mrp: item.mrp || item.Mrp || Math.round((item.price || 100) * 1.15),
            stock: item.stock || 50,
            unit: item.unit || '1 unit',
            barcode: item.barcode || ''
          });
          if (matched.length >= 35) break;
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: matched.length, staples: matched }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (reqPath === '/api/ai-analytics/chat' && req.method === 'POST') {`;

if (code.includes(target)) {
  code = code.replace(target, newRoutes);
  fs.writeFileSync(serverPath, code, 'utf8');
  console.log('Successfully patched server.js with ai-marketing endpoints');
} else {
  console.error('Target not found in server.js');
}
