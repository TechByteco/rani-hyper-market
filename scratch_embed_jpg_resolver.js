const fs = require('fs');
const path = require('path');
const { resolveProductPackshot } = require('./productPackshotResolver');

const storeFiles = [
  'store.html',
  'index.html',
  'public/store.html',
  'public/index.html',
  'pre_model/store.html',
  'pre_model/index.html'
];

// Embed PACKSHOT_MAP directly inside store.html for 0ms instant display of exact JPG packshots
const { SPECIFIC_PRODUCT_PACKSHOTS } = require('./productPackshotResolver');
const packshotsJson = JSON.stringify(SPECIFIC_PRODUCT_PACKSHOTS, null, 2);

const resolverFnCode = `    // High-Definition Authentic JPG Packshots Engine
    const DIRECT_JPG_PACKSHOTS = ${packshotsJson};

    function resolveDirectJpgImage(title) {
      if (!title) return null;
      const t = title.toLowerCase().replace(/[^a-z0-9\\s]/g, ' ');

      // 1. Sensodyne exact variants
      if (t.includes('sensodyne')) {
        if (t.includes('freshgel') || (t.includes('fresh') && t.includes('gel'))) return DIRECT_JPG_PACKSHOTS['sensodyne_freshgel'];
        if (t.includes('mint')) return DIRECT_JPG_PACKSHOTS['sensodyne_fresh_mint'];
        if (t.includes('repair') || t.includes('protect')) return DIRECT_JPG_PACKSHOTS['sensodyne_repair'];
        if (t.includes('rapid')) return DIRECT_JPG_PACKSHOTS['sensodyne_rapid_relief'];
        if (t.includes('deep') || t.includes('clean')) return DIRECT_JPG_PACKSHOTS['sensodyne_deep_clean'];
        if (t.includes('brush')) return DIRECT_JPG_PACKSHOTS['sensodyne_toothbrush'];
        return DIRECT_JPG_PACKSHOTS['sensodyne_freshgel'];
      }

      // 2. Iodex & Pain relief
      if (t.includes('iodex')) {
        if (t.includes('body') || t.includes('pain')) return DIRECT_JPG_PACKSHOTS['iodex_body_pain'];
        return DIRECT_JPG_PACKSHOTS['iodex_balm'];
      }
      if (t.includes('amrutanjan') || t.includes('amurutanjan')) return DIRECT_JPG_PACKSHOTS['amrutanjan_balm'];
      if (t.includes('moov')) return DIRECT_JPG_PACKSHOTS['moov_pain_relief'];
      if (t.includes('volini')) return DIRECT_JPG_PACKSHOTS['volini_spray'];
      if (t.includes('vicks') || t.includes('vaporub')) return DIRECT_JPG_PACKSHOTS['vicks_vaporub'];
      if (t.includes('zandu')) return DIRECT_JPG_PACKSHOTS['zandu_balm'];
      if (t.includes('eno')) {
        if (t.includes('lemon')) return DIRECT_JPG_PACKSHOTS['eno_lemon'];
        if (t.includes('orange')) return DIRECT_JPG_PACKSHOTS['eno_orange'];
        return DIRECT_JPG_PACKSHOTS['eno_regular'];
      }

      // 3. Colgate & Oral Care
      if (t.includes('colgate')) {
        if (t.includes('maxfresh') || (t.includes('max') && t.includes('fresh')) || t.includes('spicy')) return DIRECT_JPG_PACKSHOTS['colgate_maxfresh'];
        if (t.includes('active') || t.includes('salt')) return DIRECT_JPG_PACKSHOTS['colgate_active_salt'];
        if (t.includes('vedshakti') || t.includes('herbal')) return DIRECT_JPG_PACKSHOTS['colgate_vedshakti'];
        if (t.includes('brush') || t.includes('zigzag') || t.includes('super')) return DIRECT_JPG_PACKSHOTS['colgate_toothbrush'];
        return DIRECT_JPG_PACKSHOTS['colgate_strong_teeth'];
      }
      if (t.includes('close up') || t.includes('closeup')) return DIRECT_JPG_PACKSHOTS['closeup_everfresh'];
      if (t.includes('pepsodent')) return DIRECT_JPG_PACKSHOTS['pepsodent_germicheck'];
      if (t.includes('dant kanti')) return DIRECT_JPG_PACKSHOTS['dant_kanti'];

      // 4. Biscuits & Snacks
      if (t.includes('parle g') || (t.includes('parle') && t.includes('g'))) return DIRECT_JPG_PACKSHOTS['parle_g'];
      if (t.includes('good day') || t.includes('goodday')) return DIRECT_JPG_PACKSHOTS['britannia_good_day_cashew'];
      if (t.includes('marie gold') || (t.includes('marie') && !t.includes('bikis'))) return DIRECT_JPG_PACKSHOTS['britannia_marie_gold'];
      if (t.includes('milk bikis') || t.includes('bikis')) return DIRECT_JPG_PACKSHOTS['britannia_milk_bikis'];
      if (t.includes('bourbon')) return DIRECT_JPG_PACKSHOTS['britannia_bourbon'];
      if (t.includes('nutrichoice') || t.includes('digestive')) return DIRECT_JPG_PACKSHOTS['britannia_nutrichoice'];
      if (t.includes('50 50') || t.includes('50-50')) return DIRECT_JPG_PACKSHOTS['britannia_50_50'];
      if (t.includes('little hearts')) return DIRECT_JPG_PACKSHOTS['britannia_little_hearts'];
      if (t.includes('dark fantasy')) return DIRECT_JPG_PACKSHOTS['sunfeast_dark_fantasy'];
      if (t.includes('oreo')) return DIRECT_JPG_PACKSHOTS['oreo_biscuit'];

      // 5. Chocolates
      if (t.includes('dairy milk') || (t.includes('cadbury') && !t.includes('silk') && !t.includes('5 star') && !t.includes('perk') && !t.includes('gems') && !t.includes('bournvita'))) return DIRECT_JPG_PACKSHOTS['cadbury_dairy_milk'];
      if (t.includes('silk')) return DIRECT_JPG_PACKSHOTS['cadbury_silk'];
      if (t.includes('5 star') || t.includes('5star')) return DIRECT_JPG_PACKSHOTS['cadbury_5_star'];
      if (t.includes('perk')) return DIRECT_JPG_PACKSHOTS['cadbury_perk'];
      if (t.includes('gems')) return DIRECT_JPG_PACKSHOTS['cadbury_gems'];
      if (t.includes('kitkat') || t.includes('kit kat')) return DIRECT_JPG_PACKSHOTS['nestle_kitkat'];
      if (t.includes('munch')) return DIRECT_JPG_PACKSHOTS['nestle_munch'];

      // 6. Soaps
      if (t.includes('dettol')) {
        if (t.includes('skincare')) return DIRECT_JPG_PACKSHOTS['dettol_skincare_soap'];
        return DIRECT_JPG_PACKSHOTS['dettol_original_soap'];
      }
      if (t.includes('lifebuoy')) return DIRECT_JPG_PACKSHOTS['lifebuoy_total_soap'];
      if (t.includes('hamam')) return DIRECT_JPG_PACKSHOTS['hamam_soap'];
      if (t.includes('cinthol')) {
        if (t.includes('lime') || t.includes('lemon')) return DIRECT_JPG_PACKSHOTS['cinthol_lime_soap'];
        return DIRECT_JPG_PACKSHOTS['cinthol_original_soap'];
      }
      if (t.includes('mysore sandal') || (t.includes('sandal') && t.includes('soap'))) return DIRECT_JPG_PACKSHOTS['mysore_sandal_soap'];
      if (t.includes('medimix')) return DIRECT_JPG_PACKSHOTS['medimix_ayurvedic_soap'];
      if (t.includes('pears')) return DIRECT_JPG_PACKSHOTS['pears_pure_gentle_soap'];
      if (t.includes('lux')) return DIRECT_JPG_PACKSHOTS['lux_rose_soap'];
      if (t.includes('santoor')) return DIRECT_JPG_PACKSHOTS['santoor_sandal_turmeric_soap'];

      // 7. Shampoos & Hair Oils
      if (t.includes('clinic plus') || t.includes('clinic+')) return DIRECT_JPG_PACKSHOTS['clinic_plus_strong_long'];
      if (t.includes('head & shoulders') || t.includes('head and shoulders')) return DIRECT_JPG_PACKSHOTS['head_and_shoulders_smooth'];
      if (t.includes('pantene')) return DIRECT_JPG_PACKSHOTS['pantene_pro_v'];
      if (t.includes('sunsilk')) return DIRECT_JPG_PACKSHOTS['sunsilk_black_shine'];
      if (t.includes('meera')) return DIRECT_JPG_PACKSHOTS['meera_shikakai_shampoo'];
      if (t.includes('karthika') || t.includes('karthicka')) return DIRECT_JPG_PACKSHOTS['karthika_shampoo'];
      if (t.includes('parachute') && t.includes('oil')) return DIRECT_JPG_PACKSHOTS['parachute_coconut_hair_oil'];
      if (t.includes('dabur amla') || (t.includes('amla') && t.includes('oil'))) return DIRECT_JPG_PACKSHOTS['dabur_amla_hair_oil'];
      if (t.includes('bajaj almond') || (t.includes('almond') && t.includes('oil'))) return DIRECT_JPG_PACKSHOTS['bajaj_almond_drops_oil'];
      if (t.includes('vatika')) return DIRECT_JPG_PACKSHOTS['vatika_coconut_hair_oil'];

      // 8. Tea & Coffee
      if (t.includes('bru')) return DIRECT_JPG_PACKSHOTS['bru_instant_coffee'];
      if (t.includes('nescafe')) return DIRECT_JPG_PACKSHOTS['nescafe_classic_coffee'];
      if (t.includes('tata tea gold') || t.includes('tata gold')) return DIRECT_JPG_PACKSHOTS['tata_tea_gold'];
      if (t.includes('tata tea premium') || t.includes('tata premium')) return DIRECT_JPG_PACKSHOTS['tata_tea_premium'];
      if (t.includes('red label')) return DIRECT_JPG_PACKSHOTS['red_label_tea'];
      if (t.includes('3 roses') || t.includes('three roses')) return DIRECT_JPG_PACKSHOTS['3_roses_tea'];
      if (t.includes('chakra gold')) return DIRECT_JPG_PACKSHOTS['chakra_gold_tea'];
      if (t.includes('taj mahal')) return DIRECT_JPG_PACKSHOTS['taj_mahal_tea'];
      if (t.includes('avt')) return DIRECT_JPG_PACKSHOTS['avt_premium_tea'];
      if (t.includes('horlicks')) return DIRECT_JPG_PACKSHOTS['horlicks_classic_malt'];
      if (t.includes('boost')) return DIRECT_JPG_PACKSHOTS['boost_energy_drink'];
      if (t.includes('complan')) return DIRECT_JPG_PACKSHOTS['complan_royale_chocolate'];
      if (t.includes('bournvita')) return DIRECT_JPG_PACKSHOTS['bournvita_pro_health'];

      // 9. Spices & Atta
      if (t.includes('aachi')) {
        if (t.includes('chicken')) return DIRECT_JPG_PACKSHOTS['aachi_chicken_masala'];
        if (t.includes('mutton')) return DIRECT_JPG_PACKSHOTS['aachi_mutton_masala'];
        if (t.includes('chilli')) return DIRECT_JPG_PACKSHOTS['aachi_chilli_powder'];
        if (t.includes('sambar')) return DIRECT_JPG_PACKSHOTS['aachi_sambar_powder'];
        return DIRECT_JPG_PACKSHOTS['aachi_garam_masala'];
      }
      if (t.includes('sakthi')) {
        if (t.includes('turmeric') || t.includes('manjal')) return DIRECT_JPG_PACKSHOTS['sakthi_turmeric_powder'];
        if (t.includes('chilli') || t.includes('milagai')) return DIRECT_JPG_PACKSHOTS['sakthi_chilli_powder'];
        if (t.includes('sambar')) return DIRECT_JPG_PACKSHOTS['sakthi_sambar_powder'];
        if (t.includes('garam') || t.includes('masala')) return DIRECT_JPG_PACKSHOTS['sakthi_garam_masala'];
        return DIRECT_JPG_PACKSHOTS['sakthi_turmeric_powder'];
      }
      if (t.includes('tata salt') || (t.includes('salt') && t.includes('tata'))) return DIRECT_JPG_PACKSHOTS['tata_salt'];
      if (t.includes('aashirvaad') || t.includes('aashirwad')) return DIRECT_JPG_PACKSHOTS['aashirvaad_shudh_chakki_atta'];
      if (t.includes('maggi') && (t.includes('noodle') || t.includes('2 minute') || t.includes('masala'))) return DIRECT_JPG_PACKSHOTS['maggi_2_minute_noodles'];

      // 10. Detergents & Cleaning
      if (t.includes('surf excel') || t.includes('surf')) {
        if (t.includes('matic')) return DIRECT_JPG_PACKSHOTS['surf_excel_matic'];
        return DIRECT_JPG_PACKSHOTS['surf_excel_easy_wash'];
      }
      if (t.includes('ariel')) return DIRECT_JPG_PACKSHOTS['ariel_complete_detergent'];
      if (t.includes('tide')) return DIRECT_JPG_PACKSHOTS['tide_plus_extra_power'];
      if (t.includes('rin')) return DIRECT_JPG_PACKSHOTS['rin_detergent_bar'];
      if (t.includes('comfort') && (t.includes('fabric') || t.includes('conditioner') || t.includes('after wash'))) return DIRECT_JPG_PACKSHOTS['comfort_after_wash'];
      if (t.includes('ujala')) return DIRECT_JPG_PACKSHOTS['ujala_supreme_liquid'];
      if (t.includes('vim')) {
        if (t.includes('liquid') || t.includes('gel')) return DIRECT_JPG_PACKSHOTS['vim_dishwash_liquid'];
        return DIRECT_JPG_PACKSHOTS['vim_dishwash_bar'];
      }
      if (t.includes('exo')) return DIRECT_JPG_PACKSHOTS['exo_dishwash_bar'];
      if (t.includes('harpic')) return DIRECT_JPG_PACKSHOTS['harpic_power_plus'];
      if (t.includes('lizol')) return DIRECT_JPG_PACKSHOTS['lizol_disinfectant_floor_cleaner'];
      if (t.includes('colin')) return DIRECT_JPG_PACKSHOTS['colin_glass_cleaner'];
      if (t.includes('domex')) return DIRECT_JPG_PACKSHOTS['domex_disinfectant_floor_cleaner'];
      if (t.includes('goodknight') || t.includes('good knight')) return DIRECT_JPG_PACKSHOTS['goodknight_gold_flash'];
      if (t.includes('all out') || t.includes('allout')) return DIRECT_JPG_PACKSHOTS['all_out_ultra'];
      if (t.includes('hit') && (t.includes('spray') || t.includes('mosquito') || t.includes('cockroach'))) return DIRECT_JPG_PACKSHOTS['hit_mosquito_spray'];

      return null;
    }
`;

for (const relPath of storeFiles) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let html = fs.readFileSync(fullPath, 'utf8');

    // Remove old DIRECT_JPG_PACKSHOTS if present
    if (html.includes('const DIRECT_JPG_PACKSHOTS')) {
      const startIdx = html.indexOf('    // High-Definition Authentic JPG Packshots Engine');
      const endIdx = html.indexOf('function getRelevantProductImage', startIdx);
      if (startIdx !== -1 && endIdx !== -1) {
        html = html.substring(0, startIdx) + html.substring(endIdx);
      }
    }

    // Insert DIRECT_JPG_PACKSHOTS before getRelevantProductImage
    const getRelIdx = html.indexOf('function getRelevantProductImage(title, existingUrl) {');
    if (getRelIdx !== -1) {
      html = html.substring(0, getRelIdx) + resolverFnCode + '\n    ' + html.substring(getRelIdx);
    }

    // Update getRelevantProductImage body to check resolveDirectJpgImage FIRST
    const oldFnBody = `function getRelevantProductImage(title, existingUrl) {
      // 1. If product already has an authentic uploaded or catalog image (not generic placeholder/unsplash), keep it
      if (existingUrl && !existingUrl.includes('aas0010_1') && !existingUrl.includes('unsplash.com')) {
        return existingUrl;
      }`;

    const newFnBody = `function getRelevantProductImage(title, existingUrl) {
      // 1. Check direct high-definition JPG packshot engine first
      try {
        const directJpg = resolveDirectJpgImage(title);
        if (directJpg) return directJpg;
      } catch(e) {}

      // 2. If product already has an authentic uploaded or catalog image, keep it
      if (existingUrl && !existingUrl.includes('aas0010_1') && !existingUrl.includes('unsplash.com')) {
        return existingUrl;
      }`;

    if (html.includes(oldFnBody)) {
      html = html.replace(oldFnBody, newFnBody);
    }

    fs.writeFileSync(fullPath, html, 'utf8');
    console.log(`Successfully updated resolver logic in ${relPath}`);
  }
}
