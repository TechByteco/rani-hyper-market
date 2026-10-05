const https = require('https');
const fs = require('fs');

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
    if (!url) return resolve(false);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve(res.statusCode === 200 && (res.headers['content-type'] || '').includes('image'));
    }).on('error', () => resolve(false));
  });
}

async function searchValidImage(query) {
  for (const domain of ['world.openfoodfacts.org', 'world.openbeautyfacts.org', 'world.openproductsfacts.org']) {
    const url = `https://${domain}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
    const res = await fetchJson(url);
    if (res && res.products) {
      for (const p of res.products) {
        const candidates = [p.image_front_url, p.image_url, p.image_small_url, p.image_front_small_url].filter(Boolean);
        for (const c of candidates) {
          const ok = await checkImage(c);
          if (ok) return { name: p.product_name || query, url: c };
        }
      }
    }
  }
  return null;
}

async function main() {
  const failedKeys = [
    { key: 'parle_g', q: 'parle g' },
    { key: 'britannia_good_day_cashew', q: 'good day cashew' },
    { key: 'britannia_good_day_butter', q: 'good day butter' },
    { key: 'britannia_marie_gold', q: 'marie gold' },
    { key: 'britannia_milk_bikis', q: 'milk bikis' },
    { key: 'britannia_bourbon', q: 'britannia bourbon' },
    { key: 'britannia_nutrichoice', q: 'nutrichoice' },
    { key: 'britannia_50_50', q: 'britannia 50 50' },
    { key: 'britannia_little_hearts', q: 'little hearts' },
    { key: 'sunfeast_dark_fantasy', q: 'dark fantasy' },
    { key: 'oreo_biscuit', q: 'oreo' },
    { key: 'cadbury_dairy_milk', q: 'dairy milk' },
    { key: 'cadbury_silk', q: 'dairy milk silk' },
    { key: 'cadbury_5_star', q: '5 star chocolate' },
    { key: 'cadbury_perk', q: 'cadbury perk' },
    { key: 'cadbury_gems', q: 'cadbury gems' },
    { key: 'nestle_kitkat', q: 'kitkat' },
    { key: 'nestle_munch', q: 'nestle munch' },
    { key: 'parachute_coconut_hair_oil', q: 'parachute coconut oil' },
    { key: 'bru_instant_coffee', q: 'bru instant' },
    { key: 'nescafe_classic_coffee', q: 'nescafe classic' },
    { key: 'tata_tea_gold', q: 'tata tea gold' },
    { key: 'tata_tea_premium', q: 'tata tea premium' },
    { key: 'red_label_tea', q: 'red label tea' },
    { key: '3_roses_tea', q: '3 roses tea' },
    { key: 'chakra_gold_tea', q: 'chakra gold tea' },
    { key: 'taj_mahal_tea', q: 'taj mahal tea' },
    { key: 'avt_premium_tea', q: 'avt tea' },
    { key: 'aachi_garam_masala', q: 'aachi garam masala' },
    { key: 'tata_salt', q: 'tata salt' },
    { key: 'maggi_2_minute_noodles', q: 'maggi 2 minute noodles' }
  ];

  const results = {};
  for (const item of failedKeys) {
    const res = await searchValidImage(item.q);
    if (res) {
      console.log(`[RESOLVED 200] ${item.key} -> ${res.url}`);
      results[item.key] = res.url;
    } else {
      console.log(`[UNRESOLVED] ${item.key}`);
    }
  }

  fs.writeFileSync('fixed_31_packshots.json', JSON.stringify(results, null, 2), 'utf8');
}

main();
