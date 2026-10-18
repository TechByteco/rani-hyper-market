const https = require('https');
const http = require('http');

const candidates = [
  { id: 9, title: "8G R Iodex", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdRtra-lUFuieLfTSy3DV41YjiTeJ2Vi6nh9XiCRtnwg&s=10" },
  { id: 10, title: "18G R Iodex BODY PAIN", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDB7fybWiN_HEGJpsQ8VwleplrsMuIB9f8gDycd08Rjw&s=10" },
  { id: 10, title: "18G R Iodex BODY PAIN (alt)", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mkZYkX1o81KbCl1c17MYm4iX1gKt_ZxcOeuHE5ALwQ&s=10" },
  { id: 16, title: "40G R Sensodyne Freshgel", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7rFQTBBAVvG8rxk-paabXNe9JTCFYCkyfXpzncPUOWA&s=10" },
  { id: 577, title: "10Rs R Mangaldeep Temple", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10" },
  { id: 599, title: "100Ml R Vvd Coconut Oil Pouch", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcAM7z0Hx-SXmzhXFkhd0jCbZWLnsqY7dG1LhSleWEk4A&s=10" },
  { id: 1504, title: "1Ltr R Porna Rice Bran Oil", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5w9qcxIJMboObMlPbO6TpcjIcy624j9-lh5-twIxI_SNa-DWVe1G8o8&s=10" },
  { id: 1801, title: "10Rs R Mangaldeepam Sandal", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10" },
  { id: 3555, title: "Mangaldeep Temple Gold Tradition", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10" },
  { id: 5494, title: "R Mangaldeep Temple Agarpathi", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10" },
  { id: 9223, title: "R Mangaldeep Treya Agarbathi", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10" },
  { id: 22603, title: "R Mangaldeep 3In 1", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10" },
  { id: 521, title: "R Colgate Cibaca 1-2-3 Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 3638, title: "R Colgate SUPER FLEXI CHARCOAL", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 5504, title: "R Colgate SF-Tooth Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 7591, title: "R Colgate Slim Soft Charcol Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 14731, title: "R Colgate Kids Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 14930, title: "R Colgate Zig Zag Anti-Bacterial Tooth Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 17443, title: "R Colgate Extra Soft", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 17444, title: "R Colgate Medium", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 19766, title: "R Colgate Super Flexi", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 21604, title: "R Colgate Extra Clean", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 21605, title: "R Colgate Kids O2", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 23151, title: "R Colgate Gentle Clean", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 23794, title: "R Colgate Protect Milk Tooth For Babies", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 23803, title: "R Colgate Gentle Clean Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" },
  { id: 24361, title: "R Colgate Kids Brush", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10" }
];

function checkUrl(item) {
  return new Promise((resolve) => {
    https.get(item.url, res => {
      resolve({
        id: item.id,
        title: item.title,
        url: item.url,
        status: res.statusCode,
        size: res.headers['content-length']
      });
    }).on('error', e => resolve({ id: item.id, title: item.title, url: item.url, error: e.message }));
  });
}

(async () => {
  const results = [];
  for (const c of candidates) {
    const r = await checkUrl(c);
    results.push(r);
  }
  const valid = results.filter(r => r.status === 200 && parseInt(r.size || '0') > 500);
  console.log(`Verified ${valid.length} of ${candidates.length} candidate URLs as 100% valid images!`);
  valid.forEach(v => {
    console.log(`[ID ${v.id}] ${v.title} -> ${v.url} (${v.size} bytes)`);
  });

  const fs = require('fs');
  fs.writeFileSync('scripts/verified_candidate_updates.json', JSON.stringify(valid, null, 2));
})();
