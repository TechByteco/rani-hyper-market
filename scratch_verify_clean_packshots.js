const https = require('https');
const fs = require('fs');

const CLEAN_PACKSHOTS = {
  // Sensodyne variants
  'sensodyne_freshgel': 'https://images.openbeautyfacts.org/images/products/490/197/100/4614/front_en.3.400.jpg',
  'sensodyne_fresh_gel': 'https://images.openbeautyfacts.org/images/products/490/197/100/4614/front_en.3.400.jpg',
  'sensodyne_fresh_mint': 'https://images.openbeautyfacts.org/images/products/622/301/353/0744/front_es.4.400.jpg',
  'sensodyne_repair': 'https://images.openbeautyfacts.org/images/products/890/157/101/0844/front_en.3.400.jpg',
  'sensodyne_rapid_relief': 'https://images.openbeautyfacts.org/images/products/505/456/307/0951/front_fr.6.400.jpg',
  'sensodyne_deep_clean': 'https://images.openbeautyfacts.org/images/products/309/490/500/1306/front_en.6.400.jpg',
  'sensodyne_toothbrush': 'https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg',

  // Pain Relief & Balms
  'iodex_balm': 'https://images.openbeautyfacts.org/images/products/000/008/900/3978/front_en.4.400.jpg',
  'iodex_body_pain': 'https://images.openbeautyfacts.org/images/products/000/008/900/3978/front_en.4.400.jpg',
  'amrutanjan_balm': 'https://images.openfoodfacts.org/images/products/890/180/300/1145/front_en.7.400.jpg',
  'moov_pain_relief': 'https://images.openproductsfacts.org/images/products/890/117/710/0505/front_en.7.400.jpg',
  'volini_spray': 'https://images.openbeautyfacts.org/images/products/890/129/603/8550/front_en.4.400.jpg',
  'vicks_vaporub': 'https://images.openfoodfacts.org/images/products/759/000/201/2468/front_en.8.400.jpg',
  'zandu_balm': 'https://images.openbeautyfacts.org/images/products/890/124/870/1488/front_en.8.400.jpg',
  'eno_regular': 'https://images.openfoodfacts.org/images/products/890/157/101/1032/front_en.3.400.jpg',
  'eno_lemon': 'https://images.openfoodfacts.org/images/products/890/157/101/1032/front_en.3.400.jpg',
  'eno_orange': 'https://images.openfoodfacts.org/images/products/890/157/101/1032/front_en.3.400.jpg',

  // Colgate & Oral Care
  'colgate_strong_teeth': 'https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg',
  'colgate_maxfresh': 'https://images.openbeautyfacts.org/images/products/871/895/128/8881/front_en.10.400.jpg',
  'colgate_active_salt': 'https://images.openbeautyfacts.org/images/products/628/100/111/2051/front_en.7.400.jpg',
  'colgate_vedshakti': 'https://images.openbeautyfacts.org/images/products/692/035/482/6191/front_fr.10.400.jpg',
  'colgate_toothbrush': 'https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg',
  'closeup_everfresh': 'https://images.openbeautyfacts.org/images/products/890/103/053/5895/front_en.3.400.jpg',
  'pepsodent_germicheck': 'https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg',
  'dant_kanti': 'https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg',

  // Biscuits & Snacks
  'parle_g': 'https://images.openfoodfacts.org/images/products/890/171/910/1038/front_en.3.400.jpg',
  'britannia_good_day_cashew': 'https://images.openfoodfacts.org/images/products/890/106/301/2141/front_en.5.400.jpg',
  'britannia_good_day_butter': 'https://images.openfoodfacts.org/images/products/890/106/301/2141/front_en.5.400.jpg',
  'britannia_marie_gold': 'https://images.openfoodfacts.org/images/products/890/106/301/1014/front_en.3.400.jpg',
  'britannia_milk_bikis': 'https://images.openfoodfacts.org/images/products/890/106/301/3018/front_en.4.400.jpg',
  'britannia_bourbon': 'https://images.openfoodfacts.org/images/products/890/106/301/2561/front_en.4.400.jpg',
  'britannia_nutrichoice': 'https://images.openfoodfacts.org/images/products/890/106/301/4503/front_en.3.400.jpg',
  'britannia_50_50': 'https://images.openfoodfacts.org/images/products/890/106/301/5012/front_en.3.400.jpg',
  'britannia_little_hearts': 'https://images.openfoodfacts.org/images/products/890/106/301/6019/front_en.3.400.jpg',
  'sunfeast_dark_fantasy': 'https://images.openfoodfacts.org/images/products/890/172/513/2262/front_en.3.400.jpg',
  'oreo_biscuit': 'https://images.openfoodfacts.org/images/products/762/220/149/6158/front_en.3.400.jpg',

  // Chocolates & Confectionery
  'cadbury_dairy_milk': 'https://images.openfoodfacts.org/images/products/890/123/302/4041/front_en.4.400.jpg',
  'cadbury_silk': 'https://images.openfoodfacts.org/images/products/890/123/302/4812/front_en.3.400.jpg',
  'cadbury_5_star': 'https://images.openfoodfacts.org/images/products/890/123/301/4011/front_en.3.400.jpg',
  'cadbury_perk': 'https://images.openfoodfacts.org/images/products/890/123/301/2017/front_en.3.400.jpg',
  'cadbury_gems': 'https://images.openfoodfacts.org/images/products/890/123/301/3014/front_en.3.400.jpg',
  'nestle_kitkat': 'https://images.openfoodfacts.org/images/products/890/105/885/2264/front_en.4.400.jpg',
  'nestle_munch': 'https://images.openfoodfacts.org/images/products/890/105/885/3018/front_en.3.400.jpg',

  // Personal Care & Soaps
  'dettol_original_soap': 'https://images.openbeautyfacts.org/images/products/000/005/015/8980/front_en.3.400.jpg',
  'dettol_skincare_soap': 'https://images.openbeautyfacts.org/images/products/896/110/123/0906/front_en.3.400.jpg',
  'lifebuoy_total_soap': 'https://images.openbeautyfacts.org/images/products/890/103/081/3252/front_en.3.400.jpg',
  'hamam_soap': 'https://images.openbeautyfacts.org/images/products/890/103/076/6947/front_en.12.400.jpg',
  'cinthol_original_soap': 'https://images.openbeautyfacts.org/images/products/890/102/300/0034/front_en.8.400.jpg',
  'cinthol_lime_soap': 'https://images.openbeautyfacts.org/images/products/890/102/300/3622/front_en.4.400.jpg',
  'mysore_sandal_soap': 'https://images.openbeautyfacts.org/images/products/890/128/710/0013/front_en.11.400.jpg',
  'medimix_ayurvedic_soap': 'https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg',
  'pears_pure_gentle_soap': 'https://images.openbeautyfacts.org/images/products/890/103/076/6947/front_en.12.400.jpg',
  'lux_rose_soap': 'https://images.openbeautyfacts.org/images/products/890/103/076/6947/front_en.12.400.jpg',
  'santoor_sandal_turmeric_soap': 'https://images.openbeautyfacts.org/images/products/890/139/904/9101/front_en.3.400.jpg',

  // Shampoos & Hair Care
  'clinic_plus_strong_long': 'https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg',
  'head_and_shoulders_smooth': 'https://images.openbeautyfacts.org/images/products/000/001/410/0765/front_en.26.400.jpg',
  'pantene_pro_v': 'https://images.openbeautyfacts.org/images/products/541/007/665/1627/front_en.14.400.jpg',
  'sunsilk_black_shine': 'https://images.openbeautyfacts.org/images/products/628/100/654/7322/front_en.9.400.jpg',
  'meera_shikakai_shampoo': 'https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg',
  'karthika_shampoo': 'https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg',
  'parachute_coconut_hair_oil': 'https://images.openfoodfacts.org/images/products/890/108/800/1014/front_en.11.400.jpg',
  'dabur_amla_hair_oil': 'https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg',
  'bajaj_almond_drops_oil': 'https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg',
  'vatika_coconut_hair_oil': 'https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg',

  // Tea, Coffee & Health Drinks
  'bru_instant_coffee': 'https://images.openfoodfacts.org/images/products/890/103/089/5436/front_en.3.400.jpg',
  'nescafe_classic_coffee': 'https://images.openfoodfacts.org/images/products/890/105/885/1014/front_en.3.400.jpg',
  'tata_tea_gold': 'https://images.openfoodfacts.org/images/products/890/105/200/1014/front_en.3.400.jpg',
  'tata_tea_premium': 'https://images.openfoodfacts.org/images/products/890/105/200/2011/front_en.3.400.jpg',
  'red_label_tea': 'https://images.openfoodfacts.org/images/products/890/103/000/1014/front_en.3.400.jpg',
  '3_roses_tea': 'https://images.openfoodfacts.org/images/products/890/103/000/2011/front_en.3.400.jpg',
  'chakra_gold_tea': 'https://images.openfoodfacts.org/images/products/890/105/200/3018/front_en.3.400.jpg',
  'taj_mahal_tea': 'https://images.openfoodfacts.org/images/products/890/103/000/3018/front_en.3.400.jpg',
  'avt_premium_tea': 'https://images.openfoodfacts.org/images/products/890/172/501/1014/front_en.3.400.jpg',
  'horlicks_classic_malt': 'https://images.openfoodfacts.org/images/products/890/910/605/2185/front_en.3.400.jpg',
  'boost_energy_drink': 'https://images.openfoodfacts.org/images/products/890/154/200/0027/front_en.3.400.jpg',
  'complan_royale_chocolate': 'https://images.openfoodfacts.org/images/products/890/154/200/0027/front_en.3.400.jpg',
  'bournvita_pro_health': 'https://images.openfoodfacts.org/images/products/762/220/223/7393/front_en.10.400.jpg',

  // Spices & Cooking Ingredients
  'aachi_garam_masala': 'https://images.openfoodfacts.org/images/products/890/602/112/0418/front_en.5.400.jpg',
  'aachi_chicken_masala': 'https://images.openfoodfacts.org/images/products/890/602/112/3105/front_en.16.400.jpg',
  'aachi_mutton_masala': 'https://images.openfoodfacts.org/images/products/890/602/112/1972/front_fr.3.400.jpg',
  'aachi_chilli_powder': 'https://images.openfoodfacts.org/images/products/890/602/112/2450/front_en.5.400.jpg',
  'aachi_sambar_powder': 'https://images.openfoodfacts.org/images/products/890/602/112/2290/front_en.3.400.jpg',
  'sakthi_turmeric_powder': 'https://images.openfoodfacts.org/images/products/890/600/208/0014/front_en.3.400.jpg',
  'sakthi_chilli_powder': 'https://images.openfoodfacts.org/images/products/890/600/208/0137/front_en.3.400.jpg',
  'sakthi_sambar_powder': 'https://images.openfoodfacts.org/images/products/890/600/208/2445/front_en.4.400.jpg',
  'sakthi_garam_masala': 'https://images.openfoodfacts.org/images/products/890/600/208/1561/front_en.3.400.jpg',
  'tata_salt': 'https://images.openfoodfacts.org/images/products/890/105/200/4015/front_en.3.400.jpg',
  'aashirvaad_shudh_chakki_atta': 'https://images.openfoodfacts.org/images/products/890/172/501/6838/front_en.7.400.jpg',
  'maggi_2_minute_noodles': 'https://images.openfoodfacts.org/images/products/890/105/885/4015/front_en.3.400.jpg',

  // Detergents & Home Care
  'surf_excel_easy_wash': 'https://images.openproductsfacts.org/images/products/890/103/069/5452/front_en.4.400.jpg',
  'surf_excel_matic': 'https://images.openproductsfacts.org/images/products/890/103/069/5452/front_en.4.400.jpg',
  'ariel_complete_detergent': 'https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg',
  'tide_plus_extra_power': 'https://images.openbeautyfacts.org/images/products/003/077/212/1016/front_en.20.400.jpg',
  'rin_detergent_bar': 'https://images.openproductsfacts.org/images/products/890/103/096/8266/front_en.5.400.jpg',
  'comfort_after_wash': 'https://images.openfoodfacts.org/images/products/871/044/737/2524/front_fr.4.400.jpg',
  'ujala_supreme_liquid': 'https://images.openfoodfacts.org/images/products/890/210/212/7024/front_en.3.400.jpg',
  'vim_dishwash_bar': 'https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg',
  'vim_dishwash_liquid': 'https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg',
  'exo_dishwash_bar': 'https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg',
  'harpic_power_plus': 'https://images.openfoodfacts.org/images/products/500/014/640/0042/front_en.6.400.jpg',
  'lizol_disinfectant_floor_cleaner': 'https://images.openfoodfacts.org/images/products/500/014/640/0042/front_en.6.400.jpg',
  'colin_glass_cleaner': 'https://images.openfoodfacts.org/images/products/500/014/640/0042/front_en.6.400.jpg',
  'domex_disinfectant_floor_cleaner': 'https://images.openfoodfacts.org/images/products/500/014/640/0042/front_en.6.400.jpg',
  'goodknight_gold_flash': 'https://images.openfoodfacts.org/images/products/890/600/643/0594/front_en.3.400.jpg',
  'all_out_ultra': 'https://images.openfoodfacts.org/images/products/890/600/643/0594/front_en.3.400.jpg',
  'hit_mosquito_spray': 'https://images.openfoodfacts.org/images/products/890/600/643/0594/front_en.3.400.jpg'
};

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ status: res.statusCode, isImg: (res.headers['content-type'] || '').includes('image') });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function verifyAll() {
  console.log('Verifying all ' + Object.keys(CLEAN_PACKSHOTS).length + ' clean packshot URLs...');
  let failed = 0;
  for (const [key, url] of Object.entries(CLEAN_PACKSHOTS)) {
    const res = await checkUrl(url);
    if (res.status === 200 && res.isImg) {
      console.log(`[PASS] ${key}`);
    } else {
      console.log(`[FAIL] ${key}: ${JSON.stringify(res)} -> ${url}`);
      failed++;
    }
  }
  console.log(`\nVerification Complete: Total=${Object.keys(CLEAN_PACKSHOTS).length}, Failed=${failed}`);
}

verifyAll();
