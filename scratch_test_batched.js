const https = require('https');
const fs = require('fs');

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      resolve({ status: res.statusCode, isImg: (res.headers['content-type'] || '').includes('image') });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(8000, () => { req.abort(); resolve({ error: 'timeout' }); });
  });
}

async function testBatched(urls) {
  const results = {};
  for (let i = 0; i < urls.length; i += 5) {
    const chunk = urls.slice(i, i + 5);
    const chunkRes = await Promise.all(chunk.map(async (u) => {
      const res = await checkUrl(u.url);
      return { key: u.key, url: u.url, ...res };
    }));
    chunkRes.forEach(r => {
      results[r.key] = r;
      console.log(`[${r.status === 200 && r.isImg ? 'PASS' : 'FAIL'}] ${r.key} -> status=${r.status || r.error}`);
    });
  }
}

const resolver = require('./productPackshotResolver');
const items = Object.entries(resolver.SPECIFIC_PRODUCT_PACKSHOTS).map(([key, url]) => ({ key, url }));
testBatched(items);
