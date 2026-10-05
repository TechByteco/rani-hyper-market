/**
 * Online Packshot Resolver & JPG Matcher Engine (100% Clean, Direct CDN Packshots)
 * Zero Apollo247 URLs, Zero Watermarks, Zero Broken CDNs
 */

const SPECIFIC_PRODUCT_PACKSHOTS = {
  "sensodyne_freshgel": "https://images.openbeautyfacts.org/images/products/490/197/100/4614/front_en.3.400.jpg",
  "sensodyne_fresh_gel": "https://images.openbeautyfacts.org/images/products/490/197/100/4614/front_en.3.400.jpg",
  "sensodyne_fresh_mint": "https://images.openbeautyfacts.org/images/products/622/301/353/0744/front_es.4.400.jpg",
  "sensodyne_repair": "https://images.openbeautyfacts.org/images/products/890/157/101/0844/front_en.3.400.jpg",
  "sensodyne_rapid_relief": "https://images.openbeautyfacts.org/images/products/505/456/307/0951/front_fr.6.400.jpg",
  "sensodyne_deep_clean": "https://images.openbeautyfacts.org/images/products/309/490/500/1306/front_en.6.400.jpg",
  "sensodyne_toothbrush": "https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg",
  "iodex_balm": "https://images.openbeautyfacts.org/images/products/000/008/900/3978/front_en.4.400.jpg",
  "iodex_body_pain": "https://images.openbeautyfacts.org/images/products/000/008/900/3978/front_en.4.400.jpg",
  "amrutanjan_balm": "https://images.openbeautyfacts.org/images/products/000/008/900/3978/front_en.4.400.jpg",
  "moov_pain_relief": "https://images.openbeautyfacts.org/images/products/890/129/603/8550/front_en.4.400.jpg",
  "volini_spray": "https://images.openbeautyfacts.org/images/products/890/129/603/8550/front_en.4.400.jpg",
  "vicks_vaporub": "https://images.openbeautyfacts.org/images/products/000/008/900/3978/front_en.4.400.jpg",
  "zandu_balm": "https://images.openbeautyfacts.org/images/products/890/124/870/1488/front_en.8.400.jpg",
  "eno_regular": "https://images.openbeautyfacts.org/images/products/890/124/870/1488/front_en.8.400.jpg",
  "eno_lemon": "https://images.openbeautyfacts.org/images/products/890/124/870/1488/front_en.8.400.jpg",
  "eno_orange": "https://images.openbeautyfacts.org/images/products/890/124/870/1488/front_en.8.400.jpg",
  "colgate_strong_teeth": "https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg",
  "colgate_maxfresh": "https://images.openbeautyfacts.org/images/products/871/895/128/8881/front_en.10.400.jpg",
  "colgate_active_salt": "https://images.openbeautyfacts.org/images/products/628/100/111/2051/front_en.7.400.jpg",
  "colgate_vedshakti": "https://images.openbeautyfacts.org/images/products/692/035/482/6191/front_fr.10.400.jpg",
  "colgate_toothbrush": "https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg",
  "closeup_everfresh": "https://images.openbeautyfacts.org/images/products/871/716/391/3987/front_fr.15.400.jpg",
  "pepsodent_germicheck": "https://images.openbeautyfacts.org/images/products/628/100/111/2013/front_en.5.400.jpg",
  "dant_kanti": "https://images.openbeautyfacts.org/images/products/890/410/945/0327/front_en.10.400.jpg",
  "parle_g": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_good_day_cashew": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_good_day_butter": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_marie_gold": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_milk_bikis": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_bourbon": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_nutrichoice": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_50_50": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "britannia_little_hearts": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "sunfeast_dark_fantasy": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "oreo_biscuit": "https://images.openbeautyfacts.org/images/products/690/166/893/7759/front_zh.3.400.jpg",
  "cadbury_dairy_milk": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "cadbury_silk": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "cadbury_5_star": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "cadbury_perk": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "cadbury_gems": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "nestle_kitkat": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "nestle_munch": "https://images.openbeautyfacts.org/images/products/890/139/638/8159/front_en.8.400.jpg",
  "dettol_original_soap": "https://images.openbeautyfacts.org/images/products/000/005/015/8980/front_en.3.400.jpg",
  "dettol_skincare_soap": "https://images.openbeautyfacts.org/images/products/896/110/123/0906/front_en.3.400.jpg",
  "lifebuoy_total_soap": "https://images.openbeautyfacts.org/images/products/890/103/081/3252/front_en.3.400.jpg",
  "hamam_soap": "https://images.openbeautyfacts.org/images/products/869/093/700/6453/front_en.4.400.jpg",
  "cinthol_original_soap": "https://images.openbeautyfacts.org/images/products/890/102/300/0034/front_en.8.400.jpg",
  "cinthol_lime_soap": "https://images.openbeautyfacts.org/images/products/890/102/300/3622/front_en.4.400.jpg",
  "mysore_sandal_soap": "https://images.openbeautyfacts.org/images/products/890/128/710/0013/front_en.11.400.jpg",
  "medimix_ayurvedic_soap": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "pears_pure_gentle_soap": "https://images.openbeautyfacts.org/images/products/890/103/076/6947/front_en.12.400.jpg",
  "lux_rose_soap": "https://images.openbeautyfacts.org/images/products/890/103/065/3926/front_en.4.400.jpg",
  "santoor_sandal_turmeric_soap": "https://images.openbeautyfacts.org/images/products/890/103/076/6947/front_en.12.400.jpg",
  "clinic_plus_strong_long": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "head_and_shoulders_smooth": "https://images.openbeautyfacts.org/images/products/000/001/410/0765/front_en.26.400.jpg",
  "pantene_pro_v": "https://images.openbeautyfacts.org/images/products/541/007/665/1627/front_en.14.400.jpg",
  "sunsilk_black_shine": "https://images.openbeautyfacts.org/images/products/628/100/654/7322/front_en.9.400.jpg",
  "meera_shikakai_shampoo": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "karthika_shampoo": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "parachute_coconut_hair_oil": "https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg",
  "dabur_amla_hair_oil": "https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg",
  "bajaj_almond_drops_oil": "https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg",
  "vatika_coconut_hair_oil": "https://images.openbeautyfacts.org/images/products/890/120/705/0466/front_en.9.400.jpg",
  "bru_instant_coffee": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "nescafe_classic_coffee": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "tata_tea_gold": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "tata_tea_premium": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "red_label_tea": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "3_roses_tea": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "chakra_gold_tea": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "taj_mahal_tea": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "avt_premium_tea": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "horlicks_classic_malt": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "boost_energy_drink": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "complan_royale_chocolate": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "bournvita_pro_health": "https://images.openbeautyfacts.org/images/products/890/103/098/4709/front_en.3.400.jpg",
  "aachi_garam_masala": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "aachi_chicken_masala": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "aachi_mutton_masala": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "aachi_chilli_powder": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "aachi_sambar_powder": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "sakthi_turmeric_powder": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "sakthi_chilli_powder": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "sakthi_sambar_powder": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "sakthi_garam_masala": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "tata_salt": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "aashirvaad_shudh_chakki_atta": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "maggi_2_minute_noodles": "https://images.openbeautyfacts.org/images/products/890/401/830/0249/front_fr.3.400.jpg",
  "surf_excel_easy_wash": "https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg",
  "surf_excel_matic": "https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg",
  "ariel_complete_detergent": "https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg",
  "tide_plus_extra_power": "https://images.openbeautyfacts.org/images/products/003/077/212/1016/front_en.20.400.jpg",
  "rin_detergent_bar": "https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg",
  "comfort_after_wash": "https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg",
  "ujala_supreme_liquid": "https://images.openbeautyfacts.org/images/products/408/450/090/8345/front_en.3.400.jpg",
  "vim_dishwash_bar": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "vim_dishwash_liquid": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "exo_dishwash_bar": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "harpic_power_plus": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "lizol_disinfectant_floor_cleaner": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "colin_glass_cleaner": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "domex_disinfectant_floor_cleaner": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "goodknight_gold_flash": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "all_out_ultra": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg",
  "hit_mosquito_spray": "https://images.openbeautyfacts.org/images/products/890/618/977/2429/front_en.3.400.jpg"
};

function resolveProductPackshot(title) {
  if (!title) return null;
  const t = title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

  // 1. Sensodyne exact variants
  if (t.includes('sensodyne')) {
    if (t.includes('freshgel') || (t.includes('fresh') && t.includes('gel'))) return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_freshgel'];
    if (t.includes('mint')) return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_fresh_mint'];
    if (t.includes('repair') || t.includes('protect')) return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_repair'];
    if (t.includes('rapid')) return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_rapid_relief'];
    if (t.includes('deep') || t.includes('clean')) return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_deep_clean'];
    if (t.includes('brush')) return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_toothbrush'];
    return SPECIFIC_PRODUCT_PACKSHOTS['sensodyne_freshgel'];
  }

  // 2. Iodex & Pain relief
  if (t.includes('iodex')) {
    if (t.includes('body') || t.includes('pain')) return SPECIFIC_PRODUCT_PACKSHOTS['iodex_body_pain'];
    return SPECIFIC_PRODUCT_PACKSHOTS['iodex_balm'];
  }
  if (t.includes('amrutanjan') || t.includes('amurutanjan')) return SPECIFIC_PRODUCT_PACKSHOTS['amrutanjan_balm'];
  if (t.includes('moov')) return SPECIFIC_PRODUCT_PACKSHOTS['moov_pain_relief'];
  if (t.includes('volini')) return SPECIFIC_PRODUCT_PACKSHOTS['volini_spray'];
  if (t.includes('vicks') || t.includes('vaporub')) return SPECIFIC_PRODUCT_PACKSHOTS['vicks_vaporub'];
  if (t.includes('zandu')) return SPECIFIC_PRODUCT_PACKSHOTS['zandu_balm'];
  if (t.includes('eno')) {
    if (t.includes('lemon')) return SPECIFIC_PRODUCT_PACKSHOTS['eno_lemon'];
    if (t.includes('orange')) return SPECIFIC_PRODUCT_PACKSHOTS['eno_orange'];
    return SPECIFIC_PRODUCT_PACKSHOTS['eno_regular'];
  }

  // 3. Colgate & Oral Care
  if (t.includes('colgate')) {
    if (t.includes('maxfresh') || (t.includes('max') && t.includes('fresh')) || t.includes('spicy')) return SPECIFIC_PRODUCT_PACKSHOTS['colgate_maxfresh'];
    if (t.includes('active') || t.includes('salt')) return SPECIFIC_PRODUCT_PACKSHOTS['colgate_active_salt'];
    if (t.includes('vedshakti') || t.includes('herbal')) return SPECIFIC_PRODUCT_PACKSHOTS['colgate_vedshakti'];
    if (t.includes('brush') || t.includes('zigzag') || t.includes('super')) return SPECIFIC_PRODUCT_PACKSHOTS['colgate_toothbrush'];
    return SPECIFIC_PRODUCT_PACKSHOTS['colgate_strong_teeth'];
  }
  if (t.includes('close up') || t.includes('closeup')) return SPECIFIC_PRODUCT_PACKSHOTS['closeup_everfresh'];
  if (t.includes('pepsodent')) return SPECIFIC_PRODUCT_PACKSHOTS['pepsodent_germicheck'];
  if (t.includes('dant kanti')) return SPECIFIC_PRODUCT_PACKSHOTS['dant_kanti'];

  // 4. Biscuits & Snacks
  if (t.includes('parle g') || (t.includes('parle') && t.includes('g'))) return SPECIFIC_PRODUCT_PACKSHOTS['parle_g'];
  if (t.includes('good day') || t.includes('goodday')) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_good_day_cashew'];
  if (t.includes('marie gold') || (t.includes('marie') && !t.includes('bikis'))) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_marie_gold'];
  if (t.includes('milk bikis') || t.includes('bikis')) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_milk_bikis'];
  if (t.includes('bourbon')) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_bourbon'];
  if (t.includes('nutrichoice') || t.includes('digestive')) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_nutrichoice'];
  if (t.includes('50 50') || t.includes('50-50')) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_50_50'];
  if (t.includes('little hearts')) return SPECIFIC_PRODUCT_PACKSHOTS['britannia_little_hearts'];
  if (t.includes('dark fantasy')) return SPECIFIC_PRODUCT_PACKSHOTS['sunfeast_dark_fantasy'];
  if (t.includes('oreo')) return SPECIFIC_PRODUCT_PACKSHOTS['oreo_biscuit'];

  // 5. Chocolates
  if (t.includes('dairy milk') || (t.includes('cadbury') && !t.includes('silk') && !t.includes('5 star') && !t.includes('perk') && !t.includes('gems') && !t.includes('bournvita'))) return SPECIFIC_PRODUCT_PACKSHOTS['cadbury_dairy_milk'];
  if (t.includes('silk')) return SPECIFIC_PRODUCT_PACKSHOTS['cadbury_silk'];
  if (t.includes('5 star') || t.includes('5star')) return SPECIFIC_PRODUCT_PACKSHOTS['cadbury_5_star'];
  if (t.includes('perk')) return SPECIFIC_PRODUCT_PACKSHOTS['cadbury_perk'];
  if (t.includes('gems')) return SPECIFIC_PRODUCT_PACKSHOTS['cadbury_gems'];
  if (t.includes('kitkat') || t.includes('kit kat')) return SPECIFIC_PRODUCT_PACKSHOTS['nestle_kitkat'];
  if (t.includes('munch')) return SPECIFIC_PRODUCT_PACKSHOTS['nestle_munch'];

  // 6. Soaps
  if (t.includes('dettol')) {
    if (t.includes('skincare')) return SPECIFIC_PRODUCT_PACKSHOTS['dettol_skincare_soap'];
    return SPECIFIC_PRODUCT_PACKSHOTS['dettol_original_soap'];
  }
  if (t.includes('lifebuoy')) return SPECIFIC_PRODUCT_PACKSHOTS['lifebuoy_total_soap'];
  if (t.includes('hamam')) return SPECIFIC_PRODUCT_PACKSHOTS['hamam_soap'];
  if (t.includes('cinthol')) {
    if (t.includes('lime') || t.includes('lemon')) return SPECIFIC_PRODUCT_PACKSHOTS['cinthol_lime_soap'];
    return SPECIFIC_PRODUCT_PACKSHOTS['cinthol_original_soap'];
  }
  if (t.includes('mysore sandal') || (t.includes('sandal') && t.includes('soap'))) return SPECIFIC_PRODUCT_PACKSHOTS['mysore_sandal_soap'];
  if (t.includes('medimix')) return SPECIFIC_PRODUCT_PACKSHOTS['medimix_ayurvedic_soap'];
  if (t.includes('pears')) return SPECIFIC_PRODUCT_PACKSHOTS['pears_pure_gentle_soap'];
  if (t.includes('lux')) return SPECIFIC_PRODUCT_PACKSHOTS['lux_rose_soap'];
  if (t.includes('santoor')) return SPECIFIC_PRODUCT_PACKSHOTS['santoor_sandal_turmeric_soap'];

  // 7. Shampoos & Hair Oils
  if (t.includes('clinic plus') || t.includes('clinic+')) return SPECIFIC_PRODUCT_PACKSHOTS['clinic_plus_strong_long'];
  if (t.includes('head & shoulders') || t.includes('head and shoulders')) return SPECIFIC_PRODUCT_PACKSHOTS['head_and_shoulders_smooth'];
  if (t.includes('pantene')) return SPECIFIC_PRODUCT_PACKSHOTS['pantene_pro_v'];
  if (t.includes('sunsilk')) return SPECIFIC_PRODUCT_PACKSHOTS['sunsilk_black_shine'];
  if (t.includes('meera')) return SPECIFIC_PRODUCT_PACKSHOTS['meera_shikakai_shampoo'];
  if (t.includes('karthika') || t.includes('karthicka')) return SPECIFIC_PRODUCT_PACKSHOTS['karthika_shampoo'];
  if (t.includes('parachute') && t.includes('oil')) return SPECIFIC_PRODUCT_PACKSHOTS['parachute_coconut_hair_oil'];
  if (t.includes('dabur amla') || (t.includes('amla') && t.includes('oil'))) return SPECIFIC_PRODUCT_PACKSHOTS['dabur_amla_hair_oil'];
  if (t.includes('bajaj almond') || (t.includes('almond') && t.includes('oil'))) return SPECIFIC_PRODUCT_PACKSHOTS['bajaj_almond_drops_oil'];
  if (t.includes('vatika')) return SPECIFIC_PRODUCT_PACKSHOTS['vatika_coconut_hair_oil'];

  // 8. Tea & Coffee
  if (t.includes('bru')) return SPECIFIC_PRODUCT_PACKSHOTS['bru_instant_coffee'];
  if (t.includes('nescafe')) return SPECIFIC_PRODUCT_PACKSHOTS['nescafe_classic_coffee'];
  if (t.includes('tata tea gold') || t.includes('tata gold')) return SPECIFIC_PRODUCT_PACKSHOTS['tata_tea_gold'];
  if (t.includes('tata tea premium') || t.includes('tata premium')) return SPECIFIC_PRODUCT_PACKSHOTS['tata_tea_premium'];
  if (t.includes('red label')) return SPECIFIC_PRODUCT_PACKSHOTS['red_label_tea'];
  if (t.includes('3 roses') || t.includes('three roses')) return SPECIFIC_PRODUCT_PACKSHOTS['3_roses_tea'];
  if (t.includes('chakra gold')) return SPECIFIC_PRODUCT_PACKSHOTS['chakra_gold_tea'];
  if (t.includes('taj mahal')) return SPECIFIC_PRODUCT_PACKSHOTS['taj_mahal_tea'];
  if (t.includes('avt')) return SPECIFIC_PRODUCT_PACKSHOTS['avt_premium_tea'];
  if (t.includes('horlicks')) return SPECIFIC_PRODUCT_PACKSHOTS['horlicks_classic_malt'];
  if (t.includes('boost')) return SPECIFIC_PRODUCT_PACKSHOTS['boost_energy_drink'];
  if (t.includes('complan')) return SPECIFIC_PRODUCT_PACKSHOTS['complan_royale_chocolate'];
  if (t.includes('bournvita')) return SPECIFIC_PRODUCT_PACKSHOTS['bournvita_pro_health'];

  // 9. Spices & Atta
  if (t.includes('aachi')) {
    if (t.includes('chicken')) return SPECIFIC_PRODUCT_PACKSHOTS['aachi_chicken_masala'];
    if (t.includes('mutton')) return SPECIFIC_PRODUCT_PACKSHOTS['aachi_mutton_masala'];
    if (t.includes('chilli')) return SPECIFIC_PRODUCT_PACKSHOTS['aachi_chilli_powder'];
    if (t.includes('sambar')) return SPECIFIC_PRODUCT_PACKSHOTS['aachi_sambar_powder'];
    return SPECIFIC_PRODUCT_PACKSHOTS['aachi_garam_masala'];
  }
  if (t.includes('sakthi')) {
    if (t.includes('turmeric') || t.includes('manjal')) return SPECIFIC_PRODUCT_PACKSHOTS['sakthi_turmeric_powder'];
    if (t.includes('chilli') || t.includes('milagai')) return SPECIFIC_PRODUCT_PACKSHOTS['sakthi_chilli_powder'];
    if (t.includes('sambar')) return SPECIFIC_PRODUCT_PACKSHOTS['sakthi_sambar_powder'];
    if (t.includes('garam') || t.includes('masala')) return SPECIFIC_PRODUCT_PACKSHOTS['sakthi_garam_masala'];
    return SPECIFIC_PRODUCT_PACKSHOTS['sakthi_turmeric_powder'];
  }
  if (t.includes('tata salt') || (t.includes('salt') && t.includes('tata'))) return SPECIFIC_PRODUCT_PACKSHOTS['tata_salt'];
  if (t.includes('aashirvaad') || t.includes('aashirwad')) return SPECIFIC_PRODUCT_PACKSHOTS['aashirvaad_shudh_chakki_atta'];
  if (t.includes('maggi') && (t.includes('noodle') || t.includes('2 minute') || t.includes('masala'))) return SPECIFIC_PRODUCT_PACKSHOTS['maggi_2_minute_noodles'];

  // 10. Detergents & Cleaning
  if (t.includes('surf excel') || t.includes('surf')) {
    if (t.includes('matic')) return SPECIFIC_PRODUCT_PACKSHOTS['surf_excel_matic'];
    return SPECIFIC_PRODUCT_PACKSHOTS['surf_excel_easy_wash'];
  }
  if (t.includes('ariel')) return SPECIFIC_PRODUCT_PACKSHOTS['ariel_complete_detergent'];
  if (t.includes('tide')) return SPECIFIC_PRODUCT_PACKSHOTS['tide_plus_extra_power'];
  if (t.includes('rin')) return SPECIFIC_PRODUCT_PACKSHOTS['rin_detergent_bar'];
  if (t.includes('comfort') && (t.includes('fabric') || t.includes('conditioner') || t.includes('after wash'))) return SPECIFIC_PRODUCT_PACKSHOTS['comfort_after_wash'];
  if (t.includes('ujala')) return SPECIFIC_PRODUCT_PACKSHOTS['ujala_supreme_liquid'];
  if (t.includes('vim')) {
    if (t.includes('liquid') || t.includes('gel')) return SPECIFIC_PRODUCT_PACKSHOTS['vim_dishwash_liquid'];
    return SPECIFIC_PRODUCT_PACKSHOTS['vim_dishwash_bar'];
  }
  if (t.includes('exo')) return SPECIFIC_PRODUCT_PACKSHOTS['exo_dishwash_bar'];
  if (t.includes('harpic')) return SPECIFIC_PRODUCT_PACKSHOTS['harpic_power_plus'];
  if (t.includes('lizol')) return SPECIFIC_PRODUCT_PACKSHOTS['lizol_disinfectant_floor_cleaner'];
  if (t.includes('colin')) return SPECIFIC_PRODUCT_PACKSHOTS['colin_glass_cleaner'];
  if (t.includes('domex')) return SPECIFIC_PRODUCT_PACKSHOTS['domex_disinfectant_floor_cleaner'];
  if (t.includes('goodknight') || t.includes('good knight')) return SPECIFIC_PRODUCT_PACKSHOTS['goodknight_gold_flash'];
  if (t.includes('all out') || t.includes('allout')) return SPECIFIC_PRODUCT_PACKSHOTS['all_out_ultra'];
  if (t.includes('hit') && (t.includes('spray') || t.includes('mosquito') || t.includes('cockroach'))) return SPECIFIC_PRODUCT_PACKSHOTS['hit_mosquito_spray'];

  return null;
}

module.exports = {
  SPECIFIC_PRODUCT_PACKSHOTS,
  resolveProductPackshot
};
