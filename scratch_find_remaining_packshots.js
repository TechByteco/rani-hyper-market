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
    req.setTimeout(4000, () => { req.abort(); resolve({ ok: false }); });
  });
}

async function searchProduct(term) {
  for (const domain of ['world.openfoodfacts.org', 'world.openbeautyfacts.org', 'world.openproductsfacts.org']) {
    const url = `https://${domain}/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=10`;
    const res = await fetchJson(url);
    if (res && res.products && res.products.length > 0) {
      for (const p of res.products) {
        const img = p.image_front_url || p.image_url || p.image_small_url;
        if (img) {
          const chk = await checkImage(img);
          if (chk.ok) {
            return {
              name: p.product_name || p.generic_name || term,
              url: img,
              code: p.code
            };
          }
        }
      }
    }
  }
  return null;
}

async function main() {
  const list = [
    'iodex',
    'moov pain',
    'volini',
    'zandu balm',
    'horlicks malt',
    'boost drink',
    'surf excel matic',
    'ariel detergent',
    'tide detergent',
    'rin detergent bar',
    'comfort fabric conditioner',
    'ujala liquid',
    'vim dishwash',
    'exo dishwash',
    'harpic toilet cleaner',
    'lizol floor cleaner',
    'colin cleaner',
    'domex cleaner',
    'good knight',
    'all out mosquito',
    'hit spray',
    'close up toothpaste',
    'pepsodent germicheck',
    'patanjali dant kanti',
    'hamam soap',
    'lux rose soap',
    'meera shikakai',
    'karthika shampoo',
    'bajaj almond drops',
    'vatika hair oil'
  ];

  const results = {};
  for (const term of list) {
    const res = await searchProduct(term);
    if (res) {
      console.log(`[FOUND] ${term} -> ${res.name} | ${res.url}`);
      results[term] = res.url;
    } else {
      console.log(`[NOT FOUND] ${term}`);
    }
  }

  const fs = require('fs');
  fs.writeFileSync('additional_discovered_packshots.json', JSON.stringify(results, null, 2), 'utf8');
}

main();
