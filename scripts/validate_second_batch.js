const https = require('https');
const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('products_catalog.json', 'utf8'));

const candidates = [
  { kw: "Eno Lemon", tok: "ANd9GcRMWLBlsZvHLtuegD3kkPf8Yf-xonvTZ9IdkFlD0kpBZA" },
  { kw: "Eno Orange", tok: "ANd9GcSeyJ0tdM3YuAxAI5FH_TEs8EiaGAgY8bevSVLFJMuVKb" },
  { kw: "Eno Fruit Salt", tok: "ANd9GcQ9jkH_Alhi2skLA9fNf7VdZEOOURB3i_6ZdPGn3A8mP" },
  { kw: "Anil Semiya", tok: "ANd9GcTVdGgIt5ROvKybx0kWiKA7h841gygQg5r2iFsH8mA70N3" },
  { kw: "Ragi Semiya", tok: "ANd9GcSZWku5LQeWwhzf-bNnaJzHLO37sm5ofMdrpjbJUQvaxN" },
  { kw: "Chakka Puttu", tok: "ANd9GctR3t-1zHutz6zkWVfUY0plfS2-MwR2jEyLcMTZH3j0gJ" },
  { kw: "Idiyappam", tok: "ANd9GcRjxuuFVTKGdDPruo0aJ-EjUK94zB_nF4NinLyZZELEmQ" },
  { kw: "Samba Wheat", tok: "ANd9GcT4AE4sZb4FYAyhyB4KLXEvcyaqF2kkySLPkLtehURLBjU" },
  { kw: "Maida", tok: "ANd9GcXyhaDwkBXUl4Sl3QTq6DvBb-PyavyeUQ7AWbMWIY5nAJt" },
  { kw: "Karthika", tok: "ANd9GcT_HMq94SwWT-5L9qKF8c9e6mj-9U7wKvFsPZUoDvtONNh" },
  { kw: "Chik", tok: "ANd9GctjGpwqogSRWSfAlJq6flVRKDJeLYhW3Ab8rtAX4ZgrgJ" },
  { kw: "Sandalum Agarbathi", tok: "ANd9GcTkT5Mbhc0S_Et41wIYXuPKa-B7sfTwzs5PyiT4Fp3u1w" },
  { kw: "Quaker Oats", tok: "ANd9GcTwJRNyghjOI_UYALFkU5zcA88mi9SXqAV7ICXFxcfD-N" },
  { kw: "Lamp Oil", tok: "ANd9GcSyWNSmSzET4Aa8vENXrmg8m8AMxHExpxHjUXDuipNcBV" },
  { kw: "Gold Winner Vanaspati", tok: "ANd9GcRaRtFQ7dpPxtd_o6e1rw_KKALduEDPkzPrDO-zUfk_wJ" },
  { kw: "Garnier Black", tok: "ANd9GcQ0zAPXuwHMvkyiOZSURoDfmrlJvg3l8-K2zX5eZQbaVN" },
  { kw: "Lifebuoy Hand Wash", tok: "ANd9GcSeEhT7HSqFDzfI-n1Z3h-sVMNxfaoNM0nDUJxVtbA5XFs" },
  { kw: "Rin", tok: "ANd9GcTbZ_p0hiPrb8tXBNhxxI_zgGAvJZ83ygtjpwp3cBg0nN" },
  { kw: "Vaseline Aloe", tok: "ANd9GcRcVydGEE5pwKWBp9uWL6fUMlj6tJyFDE1YFhq4k833yR" },
  { kw: "Cavins Chocolate", tok: "ANd9GcTlFg1ayPyhnBZJ8MosgiX-orEoJuHAlDMXlVv8yNvr4N" },
  { kw: "Butter", tok: "ANd9GcRnyUiHteIl29D6w2-Bmf14zDsHoGV7VKfOBwhd3lDyf" },
  { kw: "Elite", tok: "ANd9Gc3SHZwV9gfkabDClxzZ308YnzrPIGBtQVd6cF6mupIxAR" },
  { kw: "Vanilla Cake", tok: "ANd9GcR9xkgKkhSqqqxIq2xWQ9saGC6Jo4mzIqaqrNZcUtGc6B" }
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ status: res.statusCode, size: res.headers['content-length'] });
    }).on('error', () => resolve({ status: 500 }));
  });
}

(async () => {
  const verified = [];
  for (const item of candidates) {
    const url = `https://encrypted-tbn0.gstatic.com/images?q=tbn:${item.tok}&s=10`;
    const res = await checkUrl(url);
    if (res.status === 200 && parseInt(res.size || '0') > 500) {
      // Find products in catalog matching kw
      const matches = catalog.filter(p => p.title.toLowerCase().includes(item.kw.toLowerCase()));
      verified.push({
        kw: item.kw,
        url: url,
        size: res.size,
        matchingProductIds: matches.map(m => m.id),
        sampleMatch: matches[0]?.title
      });
      console.log(`[OK] ${item.kw} (${res.size} bytes) -> matches ${matches.length} products (e.g. ${matches[0]?.id}: ${matches[0]?.title})`);
    } else {
      console.log(`[FAIL] ${item.kw} -> status ${res.status}`);
    }
  }
  fs.writeFileSync('scripts/verified_tokens.json', JSON.stringify(verified, null, 2));
})();
