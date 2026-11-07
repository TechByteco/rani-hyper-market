const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '..', 'api', 'index.js');
let code = fs.readFileSync(apiPath, 'utf8');

const regex = /(\s*\/\/\s*8\.\s*AI Chatbot \(Gemini \/ Autonomous\)\r?\n\s*if\s*\(reqPath === '\/api\/ai-analytics\/chat')/;

const replacement = `
    // 8.1 AI Marketing Campaign & Formula Synthesizer
    if ((reqPath === '/api/ai-marketing/generate' || reqPath === '/api/marketing/generate') && (req.method === 'POST' || req.method === 'GET')) {
      const body = req.method === 'POST' ? await getBody() : Object.fromEntries(queryParams.entries());
      if (generativeAi && typeof generativeAi.generateMarketingCampaign === 'function') {
        try {
          const result = await generativeAi.generateMarketingCampaign(body);
          return sendJson(200, result);
        } catch (err) {
          console.error('Error generating AI marketing campaign:', err.message);
          return sendJson(500, { success: false, error: err.message });
        }
      }
      return sendJson(200, {
        success: true,
        engine: 'Fallback Engine',
        formulas: { mrp: 1450, dealPrice: 1233, savingsAmount: 217, grossMarginPct: 11.2 },
        copy: { headline: 'Weekly Grocery Offer', whatsappCopy: 'Offer details' }
      });
    }

    // 8.2 Top Catalog Staples for Instant Selector
    if (reqPath === '/api/ai-marketing/catalog-staples' || reqPath === '/api/marketing/staples') {
      try {
        const catalog = readLocalJson('products_catalog.json', readLocalJson('rani_products.json', []));
        const stapleKeywords = ['rice', 'oil', 'sugar', 'dhal', 'dal', 'atta', 'ghee', 'salt', 'tea', 'chilli', 'soap', 'biscuit'];
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
        return sendJson(200, { success: true, count: matched.length, staples: matched });
      } catch (err) {
        return sendJson(500, { success: false, error: err.message });
      }
    }
$1`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync(apiPath, code, 'utf8');
  console.log('Successfully patched api/index.js with ai-marketing routes');
} else {
  console.error('Regex target not found in api/index.js');
}
