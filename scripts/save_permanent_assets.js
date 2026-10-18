const fs = require('fs');
const https = require('https');
const path = require('path');

fs.mkdirSync('images/products', { recursive: true });
fs.mkdirSync('public/images/products', { recursive: true });

const verifiedList = [
  { id: 9, slug: '8g_iodex', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdRtra-lUFuieLfTSy3DV41YjiTeJ2Vi6nh9XiCRtnwg&s=10' },
  { id: 10, slug: '18g_iodex_bodypain', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDB7fybWiN_HEGJpsQ8VwleplrsMuIB9f8gDycd08Rjw&s=10' },
  { id: 16, slug: '40g_sensodyne_freshgel', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7rFQTBBAVvG8rxk-paabXNe9JTCFYCkyfXpzncPUOWA&s=10' },
  { id: 26, slug: '5g_eno_lemon', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMWLBlsZvHLtuegD3kkPf8Yf-xonvTZ9IdkFlD0kpBZA&s=10' },
  { id: 45, slug: '500g_anil_idiyappam_mavu', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxuuFVTKGdDPruo0aJ-EjUK94zB_nF4NinLyZZELEmQ&s=10' },
  { id: 59, slug: '10n_sandalum_agarbathi_cones', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkT5Mbhc0S_Et41wIYXuPKa-B7sfTwzs5PyiT4Fp3u1w&s=10' },
  { id: 61, slug: '400g_quaker_oats', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwJRNyghjOI_UYALFkU5zcA88mi9SXqAV7ICXFxcfD-N&s=10' },
  { id: 63, slug: '500ml_dheepam_lamp_oil', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyWNSmSzET4Aa8vENXrmg8m8AMxHExpxHjUXDuipNcBV&s=10' },
  { id: 161, slug: '100ml_vaseline_aloe_fresh', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVydGEE5pwKWBp9uWL6fUMlj6tJyFDE1YFhq4k833yR&s=10' },
  { id: 197, slug: '200ml_cavins_chocolate', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlFg1ayPyhnBZJ8MosgiX-orEoJuHAlDMXlVv8yNvr4N&s=10' },
  { id: 577, slug: '10rs_mangaldeep_temple', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10' },
  { id: 1504, slug: '1ltr_porna_rice_bran_oil', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5w9qcxIJMboObMlPbO6TpcjIcy624j9-lh5-twIxI_SNa-DWVe1G8o8&s=10' },
  { id: 1801, slug: '10rs_mangaldeepam_sandal', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10' },
  { id: 3555, slug: 'mangaldeep_temple_gold', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10' },
  { id: 5494, slug: 'mangaldeep_temple_agarpathi', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10' },
  { id: 9223, slug: 'mangaldeep_treya_agarbathi', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10' },
  { id: 22603, slug: 'mangaldeep_3in1', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbEc5bAuqsvG3Lt5dTvXNpG0Q8L6KAthB3h4KPNbzymA&s=10' },
  { id: 521, slug: 'colgate_cibaca_123', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 3638, slug: 'colgate_super_flexi_charcoal', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 5504, slug: 'colgate_sf_toothbrush', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 7591, slug: 'colgate_slim_soft_charcoal', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 14731, slug: 'colgate_kids_brush', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 14930, slug: 'colgate_zigzag_anti_bacterial', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 17443, slug: 'colgate_extra_soft', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 17444, slug: 'colgate_medium', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 19766, slug: 'colgate_super_flexi', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 21604, slug: 'colgate_extra_clean', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 21605, slug: 'colgate_kids_o2', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 23151, slug: 'colgate_gentle_clean', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 23794, slug: 'colgate_protect_milk_tooth', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 23803, slug: 'colgate_gentle_clean_brush', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' },
  { id: 24361, slug: 'colgate_kids_brush_alt', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRh4fJ8w7lglsh4NBPCQgDyqu6y2N4YJ-ECxVGhiR4g&s=10' }
];

// Also handle local custom uploaded photos
const localUploads = [
  { id: 55, slug: '1kg_r_sugar', src: 'public/images/custom_extracted/img_12_Default_LS_001120_ldb_55.jpeg' },
  { id: 85, slug: '1kg_r_sk_sugar', src: 'public/images/custom_extracted/img_10_Profile_2_LS_000473_ldb_85.jpeg' }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  const finalMap = {};

  // Copy local uploaded images
  for (const item of localUploads) {
    if (fs.existsSync(item.src)) {
      const filename = `prod_${item.id}_${item.slug}.jpg`;
      const p1 = path.join('public/images/products', filename);
      const p2 = path.join('images/products', filename);
      fs.copyFileSync(item.src, p1);
      fs.copyFileSync(item.src, p2);
      const relativeUrl = `images/products/${filename}`;
      finalMap[item.id] = relativeUrl;
      console.log(`[LOCAL] Copied ${item.src} -> ${relativeUrl}`);
    }
  }

  // Download remote gstatic images
  for (const item of verifiedList) {
    const filename = `prod_${item.id}_${item.slug}.jpg`;
    const p1 = path.join('public/images/products', filename);
    const p2 = path.join('images/products', filename);
    try {
      await downloadFile(item.url, p1);
      fs.copyFileSync(p1, p2);
      const relativeUrl = `images/products/${filename}`;
      finalMap[item.id] = relativeUrl;
      console.log(`[DOWNLOADED] ${item.url} -> ${relativeUrl} (${fs.statSync(p1).size} bytes)`);
    } catch(e) {
      console.error(`Failed ${item.id}:`, e.message);
    }
  }

  fs.writeFileSync('scripts/baked_product_images_map.json', JSON.stringify(finalMap, null, 2));
  console.log(`\nSuccessfully prepared ${Object.keys(finalMap).length} permanent image assets!`);
})();
