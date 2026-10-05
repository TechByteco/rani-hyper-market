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

async function searchBarcodePrefix(query, isBeauty) {
  const domain = isBeauty ? 'world.openbeautyfacts.org' : 'world.openfoodfacts.org';
  const url = `https://${domain}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;
  const res = await fetchJson(url);
  if (!res || !res.products) return [];
  return res.products
    .filter(p => p.image_front_url || p.image_url)
    .map(p => ({
      code: p.code,
      name: p.product_name || p.brands || query,
      image: p.image_front_url || p.image_url
    }));
}

async function run() {
  const items = [
    { name: 'sensodyne', q: 'sensodyne india', beauty: true },
    { name: 'sensodyne_gel', q: 'sensodyne fresh gel', beauty: true },
    { name: 'colgate_strong', q: 'colgate strong teeth', beauty: true },
    { name: 'colgate_maxfresh', q: 'colgate max fresh', beauty: true },
    { name: 'colgate_vedshakti', q: 'colgate vedshakti', beauty: true },
    { name: 'dettol_soap', q: 'dettol soap', beauty: true },
    { name: 'cinthol_soap', q: 'cinthol', beauty: true },
    { name: 'mysore_sandal', q: 'mysore sandal', beauty: true },
    { name: 'medimix', q: 'medimix', beauty: true },
    { name: 'pears_soap', q: 'pears', beauty: true },
    { name: 'santoor_soap', q: 'santoor', beauty: true },
    { name: 'lifebuoy_soap', q: 'lifebuoy', beauty: true },
    { name: 'clinic_plus', q: 'clinic plus', beauty: true },
    { name: 'head_shoulders', q: 'head shoulders', beauty: true },
    { name: 'pantene', q: 'pantene', beauty: true },
    { name: 'sunsilk', q: 'sunsilk', beauty: true },
    { name: 'parachute_oil', q: 'parachute coconut oil', beauty: false },
    { name: 'dabur_amla', q: 'dabur amla', beauty: true },
    { name: 'horlicks', q: 'horlicks', beauty: false },
    { name: 'boost', q: 'boost health', beauty: false },
    { name: 'complan', q: 'complan', beauty: false },
    { name: 'bournvita', q: 'bournvita', beauty: false },
    { name: 'vicks', q: 'vicks vaporub', beauty: false },
    { name: 'moov', q: 'moov', beauty: false },
    { name: 'amrutanjan', q: 'amrutanjan', beauty: false },
    { name: 'iodex', q: 'iodex', beauty: false },
    { name: 'eno', q: 'eno fruit salt', beauty: false },
    { name: 'surf_excel', q: 'surf excel', beauty: false },
    { name: 'ariel', q: 'ariel detergent', beauty: false },
    { name: 'tide', q: 'tide detergent', beauty: false },
    { name: 'rin', q: 'rin detergent', beauty: false },
    { name: 'comfort', q: 'comfort fabric conditioner', beauty: false },
    { name: 'ujala', q: 'ujala', beauty: false },
    { name: 'vim', q: 'vim dishwash', beauty: false },
    { name: 'exo', q: 'exo dishwash', beauty: false },
    { name: 'harpic', q: 'harpic', beauty: false },
    { name: 'lizol', q: 'lizol', beauty: false },
    { name: 'colin', q: 'colin cleaner', beauty: false },
    { name: 'domex', q: 'domex', beauty: false },
    { name: 'goodknight', q: 'goodknight', beauty: false },
    { name: 'all_out', q: 'all out', beauty: false },
    { name: 'hit', q: 'hit spray', beauty: false }
  ];

  const results = {};
  for (const it of items) {
    const prods = await searchBarcodePrefix(it.q, it.beauty);
    if (prods.length > 0) {
      results[it.name] = prods[0].image;
      console.log(`Found for ${it.name}: ${prods[0].name} -> ${prods[0].image}`);
    } else {
      // Fallback search general
      const alt = await searchBarcodePrefix(it.q.split(' ')[0], it.beauty);
      if (alt.length > 0) {
        results[it.name] = alt[0].image;
        console.log(`Fallback for ${it.name}: ${alt[0].name} -> ${alt[0].image}`);
      } else {
        console.log(`NOT found for ${it.name}`);
      }
    }
  }

  const fs = require('fs');
  fs.writeFileSync('discovered_clean_packshots.json', JSON.stringify(results, null, 2), 'utf8');
}

run();
