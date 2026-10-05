const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'SKSMarket/1.0 (packshot-research)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function checkImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve({ ok: false });
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const isImg = (res.headers['content-type'] || '').includes('image');
      resolve({ ok: res.statusCode === 200 && isImg, status: res.statusCode, type: res.headers['content-type'] });
    });
    req.on('error', () => resolve({ ok: false }));
    req.setTimeout(5000, () => { req.abort(); resolve({ ok: false }); });
  });
}

async function searchOFF(query, isBeauty = false) {
  const domain = isBeauty ? 'world.openbeautyfacts.org' : 'world.openfoodfacts.org';
  const url = `https://${domain}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`;
  const res = await fetchJson(url);
  if (!res || !res.products) return [];
  return res.products
    .filter(p => p.image_url || p.image_front_url || p.image_small_url)
    .map(p => ({
      name: p.product_name || p.generic_name || query,
      image: p.image_front_url || p.image_url || p.image_small_url
    }));
}

async function main() {
  const queries = [
    { key: 'sensodyne', q: 'sensodyne', beauty: true },
    { key: 'colgate', q: 'colgate', beauty: true },
    { key: 'iodex', q: 'iodex', beauty: false },
    { key: 'amrutanjan', q: 'amrutanjan', beauty: false },
    { key: 'moov', q: 'moov', beauty: false },
    { key: 'volini', q: 'volini', beauty: false },
    { key: 'vicks', q: 'vicks vaporub', beauty: false },
    { key: 'zandu', q: 'zandu balm', beauty: false },
    { key: 'eno', q: 'eno', beauty: false },
    { key: 'dettol', q: 'dettol soap', beauty: true },
    { key: 'cinthol', q: 'cinthol', beauty: true },
    { key: 'mysore_sandal', q: 'mysore sandal soap', beauty: true },
    { key: 'medimix', q: 'medimix soap', beauty: true },
    { key: 'pears', q: 'pears soap', beauty: true },
    { key: 'santoor', q: 'santoor soap', beauty: true },
    { key: 'head_shoulders', q: 'head shoulders shampoo', beauty: true },
    { key: 'pantene', q: 'pantene shampoo', beauty: true },
    { key: 'sunsilk', q: 'sunsilk shampoo', beauty: true },
    { key: 'horlicks', q: 'horlicks', beauty: false },
    { key: 'boost', q: 'boost', beauty: false },
    { key: 'complan', q: 'complan', beauty: false }
  ];

  for (const item of queries) {
    const results = await searchOFF(item.q, item.beauty);
    console.log(`\n=== Query: ${item.q} (Results: ${results.length}) ===`);
    for (const r of results.slice(0, 3)) {
      const check = await checkImage(r.image);
      console.log(`- [${check.ok ? 'VALID' : 'FAIL'}] ${r.name} -> ${r.image}`);
    }
  }
}

main();
