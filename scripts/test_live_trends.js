const https = require('https');

const eps = [
  '/api/ai-analytics/daily?limit=45&fy=2026-2027',
  '/api/ai-analytics/monthly?fy=2026-2027',
  '/api/ai-analytics/yearly',
  '/api/ai-analytics/hourly',
  '/api/ai-analytics/forecast?days=14',
  '/api/ai-analytics/dead-stock',
  '/api/ai/festival-calendar-matrix'
];

function test(urlPath) {
  return new Promise(resolve => {
    https.get('https://rani-hyper-market.vercel.app' + urlPath, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch(e) {}
        resolve({
          path: urlPath,
          status: res.statusCode,
          length: Array.isArray(parsed) ? parsed.length : (parsed ? Object.keys(parsed).length : 0),
          isArray: Array.isArray(parsed),
          preview: data.slice(0, 100)
        });
      });
    }).on('error', err => resolve({ path: urlPath, error: err.message }));
  });
}

async function main() {
  for (const ep of eps) {
    const r = await test(ep);
    console.log(`${r.path} -> [${r.status}] items: ${r.length} (isArray: ${r.isArray})`);
    if (r.length === 0) console.log('   ⚠️ EMPTY: ' + r.preview);
  }
}

main();
