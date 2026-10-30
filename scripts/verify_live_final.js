const https = require('https');

const endpoints = [
  { url: 'https://rani-hyper-market.vercel.app/', name: 'Homepage' },
  { url: 'https://rani-hyper-market.vercel.app/store', name: 'Storefront' },
  { url: 'https://rani-hyper-market.vercel.app/admin', name: 'Admin POS Desk' },
  { url: 'https://rani-hyper-market.vercel.app/photo', name: 'Image Studio (/photo)' },
  { url: 'https://rani-hyper-market.vercel.app/marketing', name: 'SNS Marketing Hub (/marketing)' },
  { url: 'https://rani-hyper-market.vercel.app/sns-marketing', name: 'SNS Marketing Alias (/sns-marketing)' },
  { url: 'https://rani-hyper-market.vercel.app/images/products/prod_370_10rs_r_act_ii_clas_salt.jpg', name: 'Packshot: Act II Clas Salt' },
  { url: 'https://rani-hyper-market.vercel.app/images/products/prod_586_r_3_100g_r_cinthol_confidence.jpg', name: 'Packshot: Cinthol Confidence' },
  { url: 'https://rani-hyper-market.vercel.app/images/products/prod_17_40g_r_sensodyne_fresh_mint.jpg', name: 'Packshot: Sensodyne Fresh Mint' },
  { url: 'https://rani-hyper-market.vercel.app/images/products/prod_300_20rs_r_brita_good_day_cashew.jpg', name: 'Packshot: Good Day Cashew' }
];

function checkUrl(ep) {
  return new Promise(resolve => {
    https.get(ep.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => {
        if (data.length < 2000) data += chunk.toString();
      });
      res.on('end', () => {
        // extract title if HTML
        const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : (res.headers['content-type'] || 'image/binary');
        resolve({
          name: ep.name,
          url: ep.url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          titleOrType: pageTitle
        });
      });
    }).on('error', err => {
      resolve({ name: ep.name, url: ep.url, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing live deployment https://rani-hyper-market.vercel.app ...\n');
  for (const ep of endpoints) {
    const result = await checkUrl(ep);
    if (result.error) {
      console.log(`❌ ${result.name}: ERROR - ${result.error}`);
    } else {
      const mark = result.status === 200 ? '✅' : '⚠️';
      console.log(`${mark} [${result.status}] ${result.name}: ${result.titleOrType} (${result.url})`);
    }
  }
}

run();
