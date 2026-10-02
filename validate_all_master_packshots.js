const https = require('https');
const http = require('http');

const ALL_PACKSHOTS = {
  // Masalas & Spices (Tamil Nadu Regional & Indian FMCG)
  aachi_chicken_masala: 'https://images.openfoodfacts.org/images/products/890/602/112/0418/front_en.3.400.jpg',
  aachi_turmeric_powder: 'https://images.openfoodfacts.org/images/products/890/602/112/3105/front_en.16.400.jpg',
  aachi_lemon_rice: 'https://images.openfoodfacts.org/images/products/890/602/112/1972/front_fr.3.400.jpg',
  aachi_pepper_powder: 'https://images.openfoodfacts.org/images/products/890/602/112/2450/front_en.5.400.jpg',
  aachi_mutton_masala: 'https://images.openfoodfacts.org/images/products/890/602/112/2290/front_en.3.400.jpg',
  aachi_badam_drink: 'https://images.openfoodfacts.org/images/products/890/602/112/0180/front_fr.3.400.jpg',
  sakthi_turmeric_powder: 'https://images.openfoodfacts.org/images/products/890/600/208/0014/front_en.3.400.jpg',
  sakthi_chilli_powder: 'https://images.openfoodfacts.org/images/products/890/600/208/0137/front_en.3.400.jpg',
  sakthi_bajji_bonda: 'https://images.openfoodfacts.org/images/products/890/600/208/2445/front_en.4.400.jpg',
  sakthi_chicken_masala: 'https://images.openfoodfacts.org/images/products/890/600/208/1561/front_en.3.400.jpg',

  // Grains, Flours & Vermicelli (Tamil Nadu Regional)
  anil_roasted_vermicelli: 'https://images.openfoodfacts.org/images/products/890/604/215/0029/front_en.16.400.jpg',
  anil_ragi_vermicelli: 'https://images.openfoodfacts.org/images/products/890/604/215/0074/front_en.18.400.jpg',
  naga_sooji_rava: 'https://images.openfoodfacts.org/images/products/890/601/183/0068/front_en.17.400.jpg',
  naga_maida_flour: 'https://images.openfoodfacts.org/images/products/890/601/183/1713/front_en.6.400.jpg',
  aashirvaad_superior_atta: 'https://images.openfoodfacts.org/images/products/890/172/501/6838/front_en.7.400.jpg',
  elite_chakki_atta: 'https://images.openfoodfacts.org/images/products/890/600/725/0870/front_en.3.400.jpg',
  ponni_boiled_rice_sack: 'https://5.imimg.com/data5/SELLER/Default/2024/6/430824538/CU/YQ/EH/52481281/ponni-boiled-rice-500x500.jpg',

  // Dhals, Pulses & Salts
  udhaiyam_urad_dal: 'https://5.imimg.com/data5/SELLER/Default/2020/10/YA/MF/WG/114682825/udhayam-urad-dal-500x500.jpeg',
  tata_crystal_salt: 'https://images.openfoodfacts.org/images/products/890/404/390/1015/front_en.34.400.jpg',

  // Edible Cooking Oils & Ghee
  idhayam_gingelly_oil: 'https://images.openfoodfacts.org/images/products/890/400/180/0237/front_en.25.400.jpg',
  gold_winner_sunflower: 'https://5.imimg.com/data5/IOS/Default/2024/2/385576212/LP/RX/EM/38768188/product-jpeg-500x500.png',
  saffola_tasty_oil: 'https://images.openfoodfacts.org/images/products/890/108/800/2530/front_en.8.400.jpg',
  sundrop_superlite_oil: 'https://images.openfoodfacts.org/images/products/890/151/210/2805/front_en.3.400.jpg',
  parachute_coconut_oil: 'https://images.openfoodfacts.org/images/products/000/008/900/2940/front_en.7.400.jpg',
  grb_pure_ghee: 'https://images.openfoodfacts.org/images/products/890/601/036/0382/front_fr.3.400.jpg',

  // Sweeteners & Dates
  parrys_sugar: 'https://images.openfoodfacts.org/images/products/890/600/901/3008/front_en.5.400.jpg',
  dabur_pure_honey: 'https://images.openfoodfacts.org/images/products/890/120/702/5372/front_en.21.400.jpg',
  lion_dates_pack: 'https://images.openfoodfacts.org/images/products/890/600/672/0039/front_en.4.400.jpg',
  lion_kimjo_dates: 'https://images.openfoodfacts.org/images/products/890/600/672/1821/front_en.4.400.jpg',
  traditional_mandai_vellam: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Open_and_close_Jaggery.jpg',

  // Dairy
  amul_butter: 'https://images.openfoodfacts.org/images/products/890/126/201/0207/front_en.5.400.jpg',
  amulya_dairy_whitener: 'https://images.openfoodfacts.org/images/products/890/126/209/0322/front_en.12.400.jpg',
  arokya_milk_packet: 'https://5.imimg.com/data5/DD/WD/DB/GLADMIN-60238/arokya-milk-250x250.jpg',
  cavins_milkshake: 'https://images.openfoodfacts.org/images/products/890/297/905/0883/front_en.3.400.jpg',

  // Traditional Tamil Collectives & Pooja Essentials
  gopuram_kumkum: 'https://www.gopuramproducts.com/wp-content/uploads/2022/12/kumkum-powder-red-darkred-15gm-600x600.jpg',
  roja_mark_supari_pakku: 'https://5.imimg.com/data5/GLADMIN/Default/2022/6/LE/KJ/BJ/147580835/roja-supari-500x500.jpg',
  cycle_pure_agarbatti: 'https://5.imimg.com/data5/SELLER/Default/2024/6/430874789/PX/DP/DB/58276089/714vzdjkr6l-sl1500-500x500.jpg',
  mangaldeep_agarbatti: 'https://5.imimg.com/data5/EG/RF/LH/GLADMIN-81955/mangaldeep-incense-sticks-250x250.jpg',
  grb_soan_papdi: 'https://images.openfoodfacts.org/images/products/890/601/036/8081/front_en.3.400.jpg',

  // Snacks & Biscuits
  a2b_om_podi_snacks: 'https://5.imimg.com/data5/NSDMERP/Default/2022/4/KE/KP/QY/131265089/a2b-om-podi-1650694455796-250x250.jpg',
  haldiram_aloo_bhujia: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/front_en.28.400.jpg',
  kurkure_masala_munch: 'https://images.openfoodfacts.org/images/products/890/149/136/1026/front_en.51.400.jpg',
  too_yumm_karare: 'https://images.openfoodfacts.org/images/products/890/609/057/2118/front_fr.3.400.jpg',
  britannia_bourbon: 'https://images.openfoodfacts.org/images/products/890/106/313/9329/front_en.14.400.jpg',
  britannia_milk_bikis: 'https://images.openfoodfacts.org/images/products/890/106/301/2349/front_en.6.400.jpg',
  britannia_good_day: 'https://images.openfoodfacts.org/images/products/890/106/309/3409/front_en.4.400.jpg',
  britannia_marie_gold: 'https://images.openfoodfacts.org/images/products/890/106/316/2600/front_en.10.400.jpg',
  britannia_little_hearts: 'https://images.openfoodfacts.org/images/products/890/106/301/9171/front_en.3.400.jpg',
  parle_g_glucose: 'https://images.openfoodfacts.org/images/products/890/171/913/4845/front_en.11.400.jpg',
  maggi_masala_noodles: 'https://5.imimg.com/data5/ECOM/Default/2023/9/341085522/HH/PU/IX/44622788/1693909431322-sku-2320-0-500x500.jpg',

  // Beverages & Health Drinks
  bru_instant_coffee: 'https://images.openfoodfacts.org/images/products/890/103/053/5895/front_en.3.400.jpg',
  horlicks_health_drink: 'https://images.openfoodfacts.org/images/products/890/910/605/2185/front_en.3.400.jpg',
  boost_energy_drink: 'https://5.imimg.com/data5/IOS/Default/2024/5/414992959/FO/ZL/DV/38768188/product-jpeg-500x500.png',
  three_roses_tea: 'https://5.imimg.com/data5/SELLER/Default/2023/7/322869835/ZA/DP/ZQ/192043398/teadust1-500x500.jpg',
  avt_premium_tea: 'https://avtbeverages.com/wp-content/uploads/2022/11/01-29.jpg',
  chakra_gold_tea: 'https://5.imimg.com/data5/SELLER/Default/2021/11/BC/MI/GQ/43854801/chakra-gold-tata-tea-500x500.jpeg',
  frooti_mango_drink: 'https://images.openfoodfacts.org/images/products/890/257/910/3170/front_en.69.400.jpg',
  malas_fruit_crush: 'https://images.openfoodfacts.org/images/products/890/168/903/1175/front_en.3.400.jpg',
  bailley_packaged_water: 'https://images.openfoodfacts.org/images/products/890/257/920/3016/front_en.18.400.jpg',

  // Personal Care, Soaps & OTC
  mysore_sandal_soap: 'https://5.imimg.com/data5/SELLER/Default/2024/5/419913297/KS/ZV/EN/3091301/mysore-sandalwood-soap-500x500.jpg',
  hamam_neem_soap: 'https://5.imimg.com/data5/SELLER/Default/2024/5/415902709/VM/YC/ZE/197038225/hamam-bath-soap-big-500x500.jpg',
  cinthol_original_soap: 'https://5.imimg.com/data5/SELLER/Default/2024/5/417140327/QR/DA/QI/128348662/61pcvibnvgl-250x250.jpg',
  medimix_ayurvedic_soap: 'https://5.imimg.com/data5/SELLER/Default/2025/1/484687825/LB/GM/EG/227820430/medimix-ayurvedic-soap-500x500.jpg',
  clinic_plus_shampoo: 'https://5.imimg.com/data5/SELLER/Default/2023/6/314487320/YG/XX/LL/63187278/clinic-plus-shampoo-500x500.png',
  colgate_maxfresh_paste: 'https://5.imimg.com/data5/SELLER/Default/2026/5/604732203/BB/QS/XG/5251707/colgate-strong-teeth-toothpaste-800g-500x500.jpg',
  iodex_pain_balm: 'https://images.openfoodfacts.org/images/products/000/008/900/0014/front_en.3.400.jpg',
  eno_fruit_salt: 'https://images.openfoodfacts.org/images/products/890/157/100/6861/front_en.3.400.jpg',

  // Home Care & Cleaning
  surf_excel_quick_wash: 'https://images.openfoodfacts.org/images/products/890/910/600/6485/front_en.3.400.jpg',
  harpic_toilet_cleaner: 'https://images.openfoodfacts.org/images/products/629/512/005/2334/front_en.3.400.jpg',
  vim_dishwash_bar: 'https://images.openfoodfacts.org/images/products/890/910/600/7123/front_en.3.400.jpg',
  knorr_delite_soup: 'https://images.openfoodfacts.org/images/products/890/103/090/0150/front_en.3.400.jpg',
  kissan_fruit_jam: 'https://images.openfoodfacts.org/images/products/890/103/092/1667/front_en.39.400.jpg'
};

async function testAll() {
  console.log(`Checking ${Object.keys(ALL_PACKSHOTS).length} master packshots...`);
  const entries = Object.entries(ALL_PACKSHOTS);
  let failed = 0;

  for (const [key, url] of entries) {
    const status = await new Promise(res => {
      const client = url.startsWith('https') ? https : http;
      client.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
        res(r.statusCode);
      }).on('error', () => res(500)).end();
    });

    if (status !== 200) {
      console.log(`❌ FAIL [${status}]: ${key} -> ${url}`);
      failed++;
    } else {
      console.log(`✅ OK [200]: ${key}`);
    }
  }

  console.log(`\nFinal: ${entries.length - failed} / ${entries.length} passed (Failed: ${failed})`);
}

testAll();
