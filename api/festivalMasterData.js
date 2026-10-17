/**
 * RANI HYPER MARKET & SNS MARKET
 * COMPLETE 12-MONTH (365-DAY) RETAIL FESTIVAL & SPECIAL EVENT MASTER DATA
 * Covers all Tamil Nadu regional festivals, national holidays, temple thiruvizhas,
 * seasonal beverage surges, wedding muhurthams, and salary cycles across 2023–2027.
 */

const ALL_YEAR_FESTIVALS = [
  // ==========================================
  // JANUARY (தை / THAI SEASON)
  // ==========================================
  {
    id: 'new_year_day',
    name: "New Year's Day Celebration",
    tamilName: 'ஆங்கில புத்தாண்டு கொண்டாட்டம்',
    fullName: "New Year's Day 2026/2027 Gala",
    month: 1,
    monthName: 'January',
    quarter: 'Q1',
    calendarRule: 'Gregorian Fixed (January 1st)',
    tier: 'High',
    surgeMultiplier: 1.45,
    surgePercent: '+45%',
    tag: 'Holiday Celebration',
    description: 'Midnight countdown parties and family gatherings. Peak rush for Plum Cakes, Confectionery, Fresh Dairy Butter, Soft Drinks, Potato Chips, and Savouries.',
    stockingAdvice: 'Stock refrigerated soft drinks and multi-pack snacks near entrance. Pre-book packaged cakes from Madurai bakeries.',
    keyCategories: ['Bakery Cakes & Pastries', 'Soft Drinks & Sodas', 'Biscuits & Cookies', 'Chocolates & Gift Boxes', 'Snacks & Namkeen'],
    sampleSkus: [
      { name: 'Plum Cake (500g Box)', rate: 180, mrp: 200, surge: '+140%' },
      { name: 'Amul Butter (500g)', rate: 275, mrp: 290, surge: '+60%' },
      { name: 'Thums Up / Coca Cola 2.25L', rate: 95, mrp: 100, surge: '+85%' },
      { name: 'Cadbury Celebrations Gift Pack', rate: 150, mrp: 175, surge: '+95%' },
      { name: 'Lays / Kurkure Party Pack', rate: 30, mrp: 30, surge: '+70%' }
    ],
    datesByYear: {
      '2023': { date: '2023-01-01', window: { start: '2022-12-30', end: '2023-01-02' } },
      '2024': { date: '2024-01-01', window: { start: '2023-12-30', end: '2024-01-02' } },
      '2025': { date: '2025-01-01', window: { start: '2024-12-30', end: '2025-01-02' } },
      '2026': { date: '2026-01-01', window: { start: '2025-12-30', end: '2026-01-02' }, cutoff: '2025-12-26' },
      '2027': { date: '2027-01-01', window: { start: '2026-12-30', end: '2027-01-02' }, cutoff: '2026-12-26' }
    },
    stockNeedList: [
      { name: 'Plum Cake (500g Box)', unit: 'Box', price: 180, currentStock: 25, recommendedOrderQty: 180, estPurchaseBudget: 27000, priority: 'CRITICAL', qty2023: 140, qty2024: 165, qty2025: 175 },
      { name: 'Amul Butter (500g)', unit: 'Pack', price: 275, currentStock: 30, recommendedOrderQty: 120, estPurchaseBudget: 28800, priority: 'HIGH', qty2023: 85, qty2024: 105, qty2025: 115 },
      { name: 'Thums Up / Coca Cola 2.25L Pet', unit: 'Bottle', price: 95, currentStock: 40, recommendedOrderQty: 250, estPurchaseBudget: 20000, priority: 'HIGH', qty2023: 180, qty2024: 210, qty2025: 235 },
      { name: 'Cadbury Celebrations Box 130g', unit: 'Box', price: 150, currentStock: 20, recommendedOrderQty: 140, estPurchaseBudget: 17500, priority: 'HIGH', qty2023: 95, qty2024: 120, qty2025: 135 },
      { name: 'R AJWA Mixture & Murukku 500g', unit: 'Pack', price: 85, currentStock: 35, recommendedOrderQty: 200, estPurchaseBudget: 14000, priority: 'NORMAL', qty2023: 150, qty2024: 180, qty2025: 195 }
    ]
  },
  {
    id: 'bhogi_festival',
    name: 'Bhogi Festival (Pre-Pongal Cleaning)',
    tamilName: 'போகி பண்டிகை',
    fullName: 'Bhogi Festival & Home Purifying Day',
    month: 1,
    monthName: 'January',
    quarter: 'Q1',
    calendarRule: 'Last day of Margazhi month (Jan 13/14)',
    tier: 'Moderate',
    surgeMultiplier: 1.35,
    surgePercent: '+35%',
    tag: 'Purification & Cleaning',
    description: 'Tradition of discarding old articles and purifying the house. Surges in Camphor, Agarbatti, Sambrani, Bleaching powder, Floor cleaners, and Mops.',
    stockingAdvice: 'Display cleaning supplies and pooja dhoop prominently in the cleaning aisle 4 days prior.',
    keyCategories: ['Camphor & Agarbatti', 'Floor Cleaners & Disinfectants', 'Brooms & Mops', 'Detergents & Soaps', 'Sambrani & Dhoop'],
    sampleSkus: [
      { name: 'Mangaldeep Agarbatti 6-in-1', rate: 45, mrp: 50, surge: '+70%' },
      { name: 'Cycle Pure Camphor 50g', rate: 55, mrp: 60, surge: '+85%' },
      { name: 'Lizol Floor Cleaner 500ml Citrus', rate: 110, mrp: 120, surge: '+60%' }
    ],
    datesByYear: {
      '2023': { date: '2023-01-14', window: { start: '2023-01-12', end: '2023-01-14' } },
      '2024': { date: '2024-01-14', window: { start: '2024-01-12', end: '2024-01-14' } },
      '2025': { date: '2025-01-13', window: { start: '2025-01-11', end: '2025-01-13' } },
      '2026': { date: '2026-01-14', window: { start: '2026-01-12', end: '2026-01-14' }, cutoff: '2026-01-08' },
      '2027': { date: '2027-01-14', window: { start: '2027-01-12', end: '2027-01-14' }, cutoff: '2027-01-08' }
    },
    stockNeedList: [
      { name: 'Cycle Pure Camphor 50g Jar', unit: 'Jar', price: 55, currentStock: 40, recommendedOrderQty: 220, estPurchaseBudget: 9900, priority: 'CRITICAL', qty2023: 160, qty2024: 190, qty2025: 210 },
      { name: 'Mangaldeep 6-in-1 Agarbatti', unit: 'Pack', price: 45, currentStock: 50, recommendedOrderQty: 250, estPurchaseBudget: 9500, priority: 'HIGH', qty2023: 180, qty2024: 220, qty2025: 240 },
      { name: 'Lizol Citrus Floor Cleaner 500ml', unit: 'Bottle', price: 110, currentStock: 30, recommendedOrderQty: 150, estPurchaseBudget: 14250, priority: 'NORMAL', qty2023: 110, qty2024: 135, qty2025: 145 }
    ]
  },
  {
    id: 'pongal_harvest',
    name: 'Thai Pongal (Tamil Harvest Festival)',
    tamilName: 'தைப்பொங்கல் & மகர சங்கராந்தி',
    fullName: 'Thai Pongal & Makar Sankranti Grand Festival',
    month: 1,
    monthName: 'January',
    quarter: 'Q1',
    calendarRule: 'Thai 1 (Solar Ingress - Jan 14/15)',
    tier: 'Peak (Tamil Mega Festival)',
    surgeMultiplier: 2.20,
    surgePercent: '+120%',
    tag: 'Mega Harvest Festival',
    description: "Tamil Nadu's premier harvest celebration. Mandatory customer grocery lists for Raw Rice (Pacharisi), Jaggery (Vellam), Ghee, Cashews, Raisins, Cardamom, Turmeric bunches, and Sugarcane.",
    stockingAdvice: 'Setup a decorated "Pongal Thirunaal Bazaar" kiosk. Provide pre-packed 5-in-1 Pongal Ingredient Kits.',
    keyCategories: ['Raw Rice (Pacharisi 5kg/10kg)', 'Traditional Jaggery (Vellam)', 'Pure Ghee Jars', 'Cashews & Raisins', 'Cardamom & Spices'],
    sampleSkus: [
      { name: 'Pacharisi Raw Rice (5Kg Bag)', rate: 260, mrp: 290, surge: '+210%' },
      { name: 'Traditional Jaggery (Vellam 1Kg)', rate: 65, mrp: 75, surge: '+195%' },
      { name: '500Ml Hat Ghee Jar', rate: 480, mrp: 500, surge: '+130%' },
      { name: 'Cashew (100g) & Kismis (100g)', rate: 145, mrp: 165, surge: '+120%' },
      { name: 'Turmeric Plant Bunch', rate: 30, mrp: 35, surge: '+300%' }
    ],
    datesByYear: {
      '2023': { date: '2023-01-15', window: { start: '2023-01-12', end: '2023-01-17' } },
      '2024': { date: '2024-01-15', window: { start: '2024-01-12', end: '2024-01-17' } },
      '2025': { date: '2025-01-14', window: { start: '2025-01-11', end: '2025-01-16' } },
      '2026': { date: '2026-01-15', window: { start: '2026-01-12', end: '2026-01-17' }, cutoff: '2026-01-08' },
      '2027': { date: '2027-01-15', window: { start: '2027-01-12', end: '2027-01-17' }, cutoff: '2027-01-08' }
    },
    stockNeedList: [
      { name: '1KG R PONNI PACHAARISI (Raw Rice)', unit: 'Kg', price: 58, currentStock: 60, recommendedOrderQty: 450, estPurchaseBudget: 22500, priority: 'CRITICAL', qty2023: 380, qty2024: 420, qty2025: 440 },
      { name: 'Traditional Jaggery / Nattu Vellam 1kg', unit: 'Kg', price: 65, currentStock: 50, recommendedOrderQty: 380, estPurchaseBudget: 20900, priority: 'CRITICAL', qty2023: 310, qty2024: 350, qty2025: 375 },
      { name: '500Ml Hat Ghee Jar', unit: 'Jar', price: 480, currentStock: 25, recommendedOrderQty: 180, estPurchaseBudget: 74700, priority: 'CRITICAL', qty2023: 130, qty2024: 160, qty2025: 175 },
      { name: 'Cashew Nut W320 100g Pouch', unit: 'Pouch', price: 95, currentStock: 40, recommendedOrderQty: 280, estPurchaseBudget: 22400, priority: 'HIGH', qty2023: 210, qty2024: 250, qty2025: 270 },
      { name: 'Golden Raisins (Kismis) 100g Pouch', unit: 'Pouch', price: 45, currentStock: 45, recommendedOrderQty: 260, estPurchaseBudget: 9880, priority: 'HIGH', qty2023: 195, qty2024: 230, qty2025: 250 },
      { name: 'Cardamom (Elachi) 25g Pouch', unit: 'Pouch', price: 85, currentStock: 30, recommendedOrderQty: 200, estPurchaseBudget: 14450, priority: 'HIGH', qty2023: 160, qty2024: 185, qty2025: 195 }
    ]
  },
  {
    id: 'mattu_kanum_pongal',
    name: 'Mattu & Kanum Pongal (Jallikattu Season)',
    tamilName: 'மாட்டுப்பொங்கல் & காணும் பொங்கல்',
    fullName: 'Mattu Pongal, Jallikattu & Kanum Pongal',
    month: 1,
    monthName: 'January',
    quarter: 'Q1',
    calendarRule: 'Thai 2 & 3 (Jan 16/17)',
    tier: 'High',
    surgeMultiplier: 1.55,
    surgePercent: '+55%',
    tag: 'Rural Festive Gathering',
    description: 'Theni and Madurai rural bull festival (Jallikattu) and outdoor picnics. Surge in savory snacks, packaged biscuits, disposable paper plates, cold drinks, and chicken biryani spices.',
    stockingAdvice: 'Promote 500g snack jars, mixture packets, and cold bottled drinks near billing counters.',
    keyCategories: ['Murukku & Mixture Snacks', 'Cold Soft Drinks & Water', 'Biryani Masala & Spices', 'Disposable Paper Plates & Cups', 'Biscuits & Rusks'],
    sampleSkus: [
      { name: 'R AJWA Madras Mixture 500g', rate: 85, mrp: 95, surge: '+85%' },
      { name: 'Aachi Biryani Masala 100g', rate: 38, mrp: 42, surge: '+70%' },
      { name: 'Bisleri 1L Mineral Water', rate: 20, mrp: 20, surge: '+95%' }
    ],
    datesByYear: {
      '2023': { date: '2023-01-16', window: { start: '2023-01-15', end: '2023-01-18' } },
      '2024': { date: '2024-01-16', window: { start: '2024-01-15', end: '2024-01-18' } },
      '2025': { date: '2025-01-15', window: { start: '2025-01-14', end: '2025-01-17' } },
      '2026': { date: '2026-01-16', window: { start: '2026-01-15', end: '2026-01-18' }, cutoff: '2026-01-10' },
      '2027': { date: '2027-01-16', window: { start: '2027-01-15', end: '2027-01-18' }, cutoff: '2027-01-10' }
    },
    stockNeedList: [
      { name: 'R AJWA Madras Mixture 500g', unit: 'Pack', price: 85, currentStock: 40, recommendedOrderQty: 220, estPurchaseBudget: 15400, priority: 'HIGH', qty2023: 170, qty2024: 195, qty2025: 215 },
      { name: 'Aachi Biryani Masala 100g', unit: 'Pack', price: 38, currentStock: 60, recommendedOrderQty: 300, estPurchaseBudget: 9600, priority: 'HIGH', qty2023: 220, qty2024: 260, qty2025: 290 },
      { name: 'Paper Plates & Cups (Pack of 50)', unit: 'Pack', price: 45, currentStock: 35, recommendedOrderQty: 180, estPurchaseBudget: 6750, priority: 'NORMAL', qty2023: 130, qty2024: 155, qty2025: 170 }
    ]
  },
  {
    id: 'thai_poosam',
    name: 'Thai Poosam (Palani Padayatra Pilgrim Season)',
    tamilName: 'தைப்பூசம் திருவிழா',
    fullName: 'Thai Poosam Murugan Pilgrimage Festival',
    month: 1,
    monthName: 'January',
    quarter: 'Q1',
    calendarRule: 'Thai Pournami with Poosam Nakshatra (Late Jan - Early Feb)',
    tier: 'High',
    surgeMultiplier: 1.50,
    surgePercent: '+50%',
    tag: 'Pilgrim & Temple Season',
    description: 'Devotees trekking through Theni/Bodi foothills to Palani Murugan temple. Heavy demand for Panchamirtham ingredients: Dates (Pericham), Ghee, Honey, Cardamom, Banana, and Glucose.',
    stockingAdvice: 'Set up an aisle for "Palani Padayatra Pooja Essentials" with glucose powder, energy bars, and tender coconut drinks.',
    keyCategories: ['Lion Dates & Dry Fruits', 'Pure Honey & Ghee', 'Glucose-D Powders', 'Camphor & Incense', 'Aval & Jaggery'],
    sampleSkus: [
      { name: 'Lion Arabian Dates 500g', rate: 165, mrp: 185, surge: '+90%' },
      { name: 'Dabur 100% Pure Honey 500g', rate: 210, mrp: 245, surge: '+75%' },
      { name: 'Dabur Glucose-D 500g', rate: 120, mrp: 135, surge: '+85%' }
    ],
    datesByYear: {
      '2023': { date: '2023-02-05', window: { start: '2023-02-02', end: '2023-02-06' } },
      '2024': { date: '2024-01-25', window: { start: '2024-01-22', end: '2024-01-26' } },
      '2025': { date: '2025-02-11', window: { start: '2025-02-08', end: '2025-02-12' } },
      '2026': { date: '2026-02-01', window: { start: '2026-01-29', end: '2026-02-02' }, cutoff: '2026-01-25' },
      '2027': { date: '2027-01-22', window: { start: '2027-01-19', end: '2027-01-23' }, cutoff: '2027-01-15' }
    },
    stockNeedList: [
      { name: 'Lion Arabian Dates 500g Pack', unit: 'Pack', price: 165, currentStock: 30, recommendedOrderQty: 180, estPurchaseBudget: 25200, priority: 'HIGH', qty2023: 130, qty2024: 160, qty2025: 175 },
      { name: 'Dabur Honey 500g Squeezy', unit: 'Bottle', price: 210, currentStock: 25, recommendedOrderQty: 140, estPurchaseBudget: 24500, priority: 'HIGH', qty2023: 105, qty2024: 125, qty2025: 135 },
      { name: 'Glucon-D Orange / Regular 500g', unit: 'Box', price: 120, currentStock: 35, recommendedOrderQty: 190, estPurchaseBudget: 19000, priority: 'NORMAL', qty2023: 140, qty2024: 165, qty2025: 180 }
    ]
  },
  {
    id: 'republic_day_sale',
    name: 'Republic Day Long Weekend Sale',
    tamilName: 'குடியரசு தின சிறப்பு சலுகை',
    fullName: 'Republic Day Retail Super Saver Weekend',
    month: 1,
    monthName: 'January',
    quarter: 'Q1',
    calendarRule: 'National Fixed (January 26th)',
    tier: 'Moderate-High',
    surgeMultiplier: 1.40,
    surgePercent: '+40%',
    tag: 'National Holiday Discount',
    description: '3-day long weekend grocery restocking. Families purchase value packs of Atta, Sunflower oil, washing powders, and breakfast grains.',
    stockingAdvice: 'Offer "Tricolor Grocery Combos" (Rice + Dal + Ghee) with bundled discounts.',
    keyCategories: ['Wheat Atta (5kg/10kg)', 'Sunflower Cooking Oil (5L)', 'Detergent Value Packs', 'Tea & Coffee Jars'],
    sampleSkus: [
      { name: 'Aashirvaad Atta 5kg Bag', rate: 340, mrp: 395, surge: '+55%' },
      { name: 'Gold Winner Sunflower Oil 5L', rate: 720, mrp: 830, surge: '+50%' }
    ],
    datesByYear: {
      '2023': { date: '2023-01-26', window: { start: '2023-01-24', end: '2023-01-27' } },
      '2024': { date: '2024-01-26', window: { start: '2024-01-24', end: '2024-01-27' } },
      '2025': { date: '2025-01-26', window: { start: '2025-01-24', end: '2025-01-27' } },
      '2026': { date: '2026-01-26', window: { start: '2026-01-24', end: '2026-01-27' }, cutoff: '2026-01-20' },
      '2027': { date: '2027-01-26', window: { start: '2027-01-24', end: '2027-01-27' }, cutoff: '2027-01-20' }
    },
    stockNeedList: [
      { name: 'Aashirvaad Superior MP Atta 5kg', unit: 'Bag', price: 340, currentStock: 40, recommendedOrderQty: 180, estPurchaseBudget: 52200, priority: 'HIGH', qty2023: 140, qty2024: 160, qty2025: 175 },
      { name: 'Gold Winner Sunflower Oil 5L Can', unit: 'Can', price: 720, currentStock: 30, recommendedOrderQty: 140, estPurchaseBudget: 86800, priority: 'HIGH', qty2023: 110, qty2024: 125, qty2025: 135 }
    ]
  },

  // ==========================================
  // FEBRUARY (மாசி / MASI SEASON)
  // ==========================================
  {
    id: 'valentines_snack_week',
    name: "Valentine's & Youth Snacking Week",
    tamilName: 'காதலர் தின இனிப்பு & சாக்லேட் ஸ்பெஷல்',
    fullName: "Valentine's Week Premium Confectionery & Bakery Surge",
    month: 2,
    monthName: 'February',
    quarter: 'Q1',
    calendarRule: 'Gregorian Fixed (February 7–14)',
    tier: 'Moderate',
    surgeMultiplier: 1.35,
    surgePercent: '+35%',
    tag: 'Youth & Confectionery',
    description: 'High impulse sales for premium boxed chocolates, imported biscuits, cookies, gifting dry fruits, and scented body sprays.',
    stockingAdvice: 'Display heart-shaped confectionery and Ferrero Rocher towers near POS counter checkout.',
    keyCategories: ['Cadbury & Nestle Chocolates', 'Ferrero Rocher & Premium Packs', 'Dry Fruits Gift Tins', 'Deodorants & Perfumes'],
    sampleSkus: [
      { name: 'Cadbury Silk Roast Almond 143g', rate: 175, mrp: 190, surge: '+120%' },
      { name: 'Ferrero Rocher 16 Pieces Box', rate: 525, mrp: 575, surge: '+95%' }
    ],
    datesByYear: {
      '2023': { date: '2023-02-14', window: { start: '2023-02-10', end: '2023-02-15' } },
      '2024': { date: '2024-02-14', window: { start: '2024-02-10', end: '2024-02-15' } },
      '2025': { date: '2025-02-14', window: { start: '2025-02-10', end: '2025-02-15' } },
      '2026': { date: '2026-02-14', window: { start: '2026-02-10', end: '2026-02-15' }, cutoff: '2026-02-06' },
      '2027': { date: '2027-02-14', window: { start: '2027-02-10', end: '2027-02-15' }, cutoff: '2027-02-06' }
    },
    stockNeedList: [
      { name: 'Cadbury Dairy Milk Silk 150g', unit: 'Bar', price: 175, currentStock: 30, recommendedOrderQty: 180, estPurchaseBudget: 27000, priority: 'HIGH', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: 'Ferrero Rocher T-16 Box', unit: 'Box', price: 525, currentStock: 15, recommendedOrderQty: 80, estPurchaseBudget: 35700, priority: 'NORMAL', qty2023: 50, qty2024: 65, qty2025: 75 }
    ]
  },
  {
    id: 'maha_shivaratri',
    name: 'Maha Shivaratri (All-Night Fasting & Vigil)',
    tamilName: 'மகா சிவராத்திரி விரதம்',
    fullName: 'Maha Shivaratri Fasting & Temple Vigil',
    month: 2,
    monthName: 'February',
    quarter: 'Q1',
    calendarRule: 'Masi Krishna Chaturdashi (Lunisolar shifts Feb–Mar)',
    tier: 'High',
    surgeMultiplier: 1.45,
    surgePercent: '+45%',
    tag: 'Fasting & Vigil Festival',
    description: 'Devotees fast through the night. Surges in Tender Coconut, Fresh Milk, Curd, Fruits (Bananas, Apples), Aval (Flattened rice), Pure Ghee, and Dheepam lamp oil.',
    stockingAdvice: 'Ensure fresh milk deliveries arrive twice on Shivaratri morning and afternoon. Stock extra Dheepam oil.',
    keyCategories: ['Milk, Curd & Dairy', 'Aval / Poha & Honey', 'Fresh Fruits & Coconuts', 'Pooja Oil & Camphor', 'Jaggery'],
    sampleSkus: [
      { name: 'Aavin Full Cream Milk 500ml', rate: 30, mrp: 30, surge: '+75%' },
      { name: 'Nylon Aval (Poha) 500g', rate: 45, mrp: 52, surge: '+80%' },
      { name: '500Ml R Dheepam Lamp Oil', rate: 100, mrp: 111, surge: '+70%' }
    ],
    datesByYear: {
      '2023': { date: '2023-02-18', window: { start: '2023-02-17', end: '2023-02-19' } },
      '2024': { date: '2024-03-08', window: { start: '2024-03-07', end: '2024-03-09' } },
      '2025': { date: '2025-02-26', window: { start: '2025-02-25', end: '2025-02-27' } },
      '2026': { date: '2026-02-15', window: { start: '2026-02-14', end: '2026-02-16' }, cutoff: '2026-02-10' },
      '2027': { date: '2027-03-06', window: { start: '2027-03-05', end: '2027-03-07' }, cutoff: '2027-03-01' }
    },
    stockNeedList: [
      { name: 'Nylon Aval (Poha) 500g Pack', unit: 'Pack', price: 45, currentStock: 35, recommendedOrderQty: 220, estPurchaseBudget: 8580, priority: 'HIGH', qty2023: 160, qty2024: 185, qty2025: 205 },
      { name: '500Ml R Dheepam Lamp Oil', unit: 'Pouch', price: 100, currentStock: 40, recommendedOrderQty: 200, estPurchaseBudget: 17000, priority: 'HIGH', qty2023: 150, qty2024: 175, qty2025: 190 }
    ]
  },
  {
    id: 'thai_masi_weddings',
    name: 'Thai & Masi Subha Muhurtham Wedding Season',
    tamilName: 'தை - மாசி சுப முகூர்த்த திருமண சீசன்',
    fullName: 'Pre-Summer Grand Wedding Feast Purchases',
    month: 2,
    monthName: 'February',
    quarter: 'Q1',
    calendarRule: 'Auspicious Tamil Marriage Muhurtham dates in Thai & Masi',
    tier: 'Very High',
    surgeMultiplier: 1.65,
    surgePercent: '+65%',
    tag: 'Wedding & Feast Season',
    description: 'Bulk caterer and wedding house orders. Customers buy 25kg Sona Masoori/Basmati bags, 15L Cooking oil tins, 50kg Sugar sacks, and bulk spices.',
    stockingAdvice: 'Offer direct delivery to marriage halls in Bodinayakanur. Stock extra 25kg rice sacks in warehouse.',
    keyCategories: ['25kg Rice Sacks', '15L Oil Tins', '50kg Sugar Bags', 'Toor Dal Sacks (30kg)', 'Whole Spices Quintals'],
    sampleSkus: [
      { name: '25Kg Sona Masoori Rice Bag', rate: 1450, mrp: 1600, surge: '+75%' },
      { name: '15L Gold Winner Sunflower Oil Tin', rate: 2150, mrp: 2350, surge: '+85%' }
    ],
    datesByYear: {
      '2023': { date: '2023-02-15', window: { start: '2023-02-10', end: '2023-02-25' } },
      '2024': { date: '2024-02-18', window: { start: '2024-02-12', end: '2024-02-26' } },
      '2025': { date: '2025-02-20', window: { start: '2025-02-14', end: '2025-02-28' } },
      '2026': { date: '2026-02-18', window: { start: '2026-02-12', end: '2026-02-26' }, cutoff: '2026-02-05' },
      '2027': { date: '2027-02-22', window: { start: '2027-02-15', end: '2027-02-28' }, cutoff: '2027-02-10' }
    },
    stockNeedList: [
      { name: '25Kg Sona Masoori Premium Rice Bag', unit: 'Bag', price: 1450, currentStock: 35, recommendedOrderQty: 180, estPurchaseBudget: 221400, priority: 'CRITICAL', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: '15L Gold Winner Sunflower Oil Tin', unit: 'Tin', price: 2150, currentStock: 20, recommendedOrderQty: 110, estPurchaseBudget: 200750, priority: 'CRITICAL', qty2023: 80, qty2024: 95, qty2025: 105 }
    ]
  },

  // ==========================================
  // MARCH (பங்குனி / PANGUNI SEASON)
  // ==========================================
  {
    id: 'holi_festival',
    name: 'Holi Festival Celebration',
    tamilName: 'ஹோலி பண்டிகை',
    fullName: 'Holi Festival of Colors & Sweets',
    month: 3,
    monthName: 'March',
    quarter: 'Q1',
    calendarRule: 'Phalguna Purnima (Shifts March)',
    tier: 'Moderate',
    surgeMultiplier: 1.35,
    surgePercent: '+35%',
    tag: 'Color & Sweet Festival',
    description: 'Sweets preparation and cold beverages. High demand for Maida, Rava, Sugar, Khoya, Ghee, Thandai nuts, Cold drinks, and snack savouries.',
    stockingAdvice: 'Stock sweet-making ingredients and colorful fruit drinks.',
    keyCategories: ['Maida & Rava', 'Sugar & Ghee', 'Dry Fruits for Thandai', 'Fruit Syrups & Cold Drinks'],
    sampleSkus: [
      { name: '500G R Anil Maida', rate: 38, mrp: 42, surge: '+50%' },
      { name: 'Rooh Afza Sharbat 750ml', rate: 170, mrp: 185, surge: '+65%' }
    ],
    datesByYear: {
      '2023': { date: '2023-03-08', window: { start: '2023-03-06', end: '2023-03-09' } },
      '2024': { date: '2024-03-25', window: { start: '2024-03-23', end: '2024-03-26' } },
      '2025': { date: '2025-03-14', window: { start: '2025-03-12', end: '2025-03-15' } },
      '2026': { date: '2026-03-03', window: { start: '2026-03-01', end: '2026-03-04' }, cutoff: '2026-02-25' },
      '2027': { date: '2027-03-22', window: { start: '2027-03-20', end: '2027-03-23' }, cutoff: '2027-03-15' }
    },
    stockNeedList: [
      { name: '500G R Anil Maida', unit: 'Pack', price: 38, currentStock: 50, recommendedOrderQty: 220, estPurchaseBudget: 7260, priority: 'NORMAL', qty2023: 160, qty2024: 185, qty2025: 205 },
      { name: 'Hamdard Rooh Afza 750ml', unit: 'Bottle', price: 170, currentStock: 25, recommendedOrderQty: 110, estPurchaseBudget: 16170, priority: 'NORMAL', qty2023: 80, qty2024: 95, qty2025: 105 }
    ]
  },
  {
    id: 'ugadi_telugu_new_year',
    name: 'Ugadi (Telugu / Kannada New Year)',
    tamilName: 'யுகாதி புத்தாண்டு திருநாள்',
    fullName: 'Ugadi New Year & Pachadi Celebration',
    month: 3,
    monthName: 'March',
    quarter: 'Q1',
    calendarRule: 'Chaitra Shukla Pratipada (Lunisolar shifts late March - early April)',
    tier: 'Moderate-High',
    surgeMultiplier: 1.45,
    surgePercent: '+45%',
    tag: 'Regional Cultural New Year',
    description: 'Widely celebrated across Theni/Bodi border communities. Demand for Raw Mangoes, Neem flowers, Traditional Jaggery, Tamarind, and Payasam ingredients for Ugadi Pachadi.',
    stockingAdvice: 'Procure authentic organic jaggery blocks and fresh raw mango crates from local Theni orchards.',
    keyCategories: ['Organic Jaggery / Nattu Sakkarai', 'Tamarind / Puli 500g', 'Raw Mangoes', 'Vermicelli Semiya & Payasam Dal'],
    sampleSkus: [
      { name: 'Traditional Jaggery (Vellam 1Kg)', rate: 65, mrp: 75, surge: '+70%' },
      { name: '500g Seedless Tamarind Block', rate: 95, mrp: 110, surge: '+60%' }
    ],
    datesByYear: {
      '2023': { date: '2023-03-22', window: { start: '2023-03-20', end: '2023-03-23' } },
      '2024': { date: '2024-04-09', window: { start: '2024-04-07', end: '2024-04-10' } },
      '2025': { date: '2025-03-30', window: { start: '2025-03-28', end: '2025-03-31' } },
      '2026': { date: '2026-03-19', window: { start: '2026-03-17', end: '2026-03-20' }, cutoff: '2026-03-13' },
      '2027': { date: '2027-04-07', window: { start: '2027-04-05', end: '2027-04-08' }, cutoff: '2027-04-01' }
    },
    stockNeedList: [
      { name: 'Organic Traditional Jaggery 1kg', unit: 'Kg', price: 65, currentStock: 45, recommendedOrderQty: 220, estPurchaseBudget: 12100, priority: 'HIGH', qty2023: 160, qty2024: 185, qty2025: 205 },
      { name: 'Seedless Round Tamarind 500g', unit: 'Pack', price: 95, currentStock: 35, recommendedOrderQty: 180, estPurchaseBudget: 14760, priority: 'HIGH', qty2023: 130, qty2024: 155, qty2025: 170 }
    ]
  },
  {
    id: 'panguni_uthiram',
    name: 'Panguni Uthiram Divine Marriage Festival',
    tamilName: 'பங்குனி உத்திரம் திருக்கல்யாணம்',
    fullName: 'Panguni Uthiram Temple Feast & Annadhanam Festival',
    month: 3,
    monthName: 'March',
    quarter: 'Q1',
    calendarRule: 'Panguni Pournami with Uthiram Nakshatra (Late March / Early April)',
    tier: 'High',
    surgeMultiplier: 1.55,
    surgePercent: '+55%',
    tag: 'Temple Feast & Annadhanam',
    description: 'Divine marriage day observed across Murugan and Shiva temples. Massive demand for community feast groceries: Ponni Rice, Sambar Dal, Tamarind, Sunflower Oil, Ghee, and Semiya Payasam.',
    stockingAdvice: 'Engage local temple trust coordinators for advance wholesale supply orders.',
    keyCategories: ['Ponni Boiled Rice (25kg)', 'Toor Dal (10kg)', 'Refined Sunflower Oil (15L)', 'Payasam Semiya & Cashews'],
    sampleSkus: [
      { name: '25kg Ponni Boiled Rice Bag', rate: 1350, mrp: 1500, surge: '+70%' },
      { name: 'Toor Dal Premium 5kg Pack', rate: 680, mrp: 740, surge: '+65%' }
    ],
    datesByYear: {
      '2023': { date: '2023-04-05', window: { start: '2023-04-03', end: '2023-04-06' } },
      '2024': { date: '2024-03-24', window: { start: '2024-03-22', end: '2024-03-25' } },
      '2025': { date: '2025-04-11', window: { start: '2025-04-09', end: '2025-04-12' } },
      '2026': { date: '2026-03-31', window: { start: '2026-03-29', end: '2026-04-01' }, cutoff: '2026-03-25' },
      '2027': { date: '2027-04-20', window: { start: '2027-04-18', end: '2027-04-21' }, cutoff: '2027-04-14' }
    },
    stockNeedList: [
      { name: '25kg Ponni Boiled Rice Bag', unit: 'Bag', price: 1350, currentStock: 30, recommendedOrderQty: 150, estPurchaseBudget: 175500, priority: 'CRITICAL', qty2023: 110, qty2024: 130, qty2025: 140 },
      { name: 'Toor Dal Premium 5kg Pack', unit: 'Pack', price: 680, currentStock: 25, recommendedOrderQty: 120, estPurchaseBudget: 69360, priority: 'HIGH', qty2023: 85, qty2024: 105, qty2025: 115 }
    ]
  },

  // ==========================================
  // APRIL (சித்திரை / CHITHIRAI SEASON)
  // ==========================================
  {
    id: 'tamil_new_year',
    name: 'Tamil New Year (Puthandu / Chithirai 1)',
    tamilName: 'தமிழ் புத்தாண்டு (சித்திரை 1)',
    fullName: 'Tamil New Year (Puthandu & Chithirai Vishu)',
    month: 4,
    monthName: 'April',
    quarter: 'Q2',
    calendarRule: 'Solar Calendar Fixed (April 14th)',
    tier: 'Very High',
    surgeMultiplier: 1.60,
    surgePercent: '+60%',
    tag: 'Cultural New Year',
    description: 'Chithirai Puthandu feast across every household. Mandatory preparation of Maanga Pachadi (sweet, sour, bitter, spicy taste), vadai, payasam, raw mangoes, neem flower, and new year pooja provisions.',
    stockingAdvice: 'Bundle "Puthandu Mangala Kit" (Mango + Jaggery + Red Chilli + Tamarind + Payasam Semiya).',
    keyCategories: ['Raw Mangoes & Jaggery', 'Payasam Semiya & Ghee', 'Raw Rice & Moong Dal', 'Pooja Oil & Camphor', 'New Year Sweets'],
    sampleSkus: [
      { name: '1Kg Traditional Jaggery', rate: 65, mrp: 75, surge: '+95%' },
      { name: '500G R Anil Roasted Vermicelli', rate: 42, mrp: 48, surge: '+85%' },
      { name: '500Ml Hat Ghee Jar', rate: 480, mrp: 500, surge: '+65%' }
    ],
    datesByYear: {
      '2023': { date: '2023-04-14', window: { start: '2023-04-12', end: '2023-04-15' } },
      '2024': { date: '2024-04-14', window: { start: '2024-04-12', end: '2024-04-15' } },
      '2025': { date: '2025-04-14', window: { start: '2025-04-12', end: '2025-04-15' } },
      '2026': { date: '2026-04-14', window: { start: '2026-04-12', end: '2026-04-15' }, cutoff: '2026-04-08' },
      '2027': { date: '2027-04-14', window: { start: '2027-04-12', end: '2027-04-15' }, cutoff: '2027-04-08' }
    },
    stockNeedList: [
      { name: '1Kg Traditional Jaggery Block', unit: 'Kg', price: 65, currentStock: 50, recommendedOrderQty: 320, estPurchaseBudget: 17600, priority: 'CRITICAL', qty2023: 240, qty2024: 280, qty2025: 305 },
      { name: '500G R Anil Roasted Vermicelli', unit: 'Pack', price: 42, currentStock: 45, recommendedOrderQty: 260, estPurchaseBudget: 9282, priority: 'HIGH', qty2023: 190, qty2024: 230, qty2025: 250 },
      { name: '500Ml Hat Ghee Jar', unit: 'Jar', price: 480, currentStock: 25, recommendedOrderQty: 140, estPurchaseBudget: 58100, priority: 'HIGH', qty2023: 95, qty2024: 120, qty2025: 135 }
    ]
  },
  {
    id: 'easter_good_friday',
    name: 'Good Friday & Easter Sunday',
    tamilName: 'புனித வெள்ளி & ஈஸ்டர் பண்டிகை',
    fullName: 'Good Friday & Easter Celebration Weekend',
    month: 4,
    monthName: 'April',
    quarter: 'Q2',
    calendarRule: 'Christian Lunar Calendar (March / April)',
    tier: 'Moderate-High',
    surgeMultiplier: 1.45,
    surgePercent: '+45%',
    tag: 'Christian Holiday & Feast',
    description: 'Post-lent festive feast. High sales of Rich Plum Cakes, Eggs, Poultry seasonings, Bread, Butter, Chocolates, and breakfast essentials.',
    stockingAdvice: 'Stock extra bakery cakes and poultry masalas.',
    keyCategories: ['Bakery Cakes & Bread', 'Fresh Farm Eggs (Trays)', 'Chicken/Mutton Masalas', 'Butter & Cream', 'Confectionery'],
    sampleSkus: [
      { name: 'Plum Cake (500g Box)', rate: 180, mrp: 200, surge: '+90%' },
      { name: 'Aachi Chicken Masala 100g', rate: 36, mrp: 40, surge: '+60%' }
    ],
    datesByYear: {
      '2023': { date: '2023-04-09', window: { start: '2023-04-07', end: '2023-04-10' } },
      '2024': { date: '2024-03-31', window: { start: '2024-03-29', end: '2024-04-01' } },
      '2025': { date: '2025-04-20', window: { start: '2025-04-18', end: '2025-04-21' } },
      '2026': { date: '2026-04-05', window: { start: '2026-04-03', end: '2026-04-06' }, cutoff: '2026-03-30' },
      '2027': { date: '2027-03-28', window: { start: '2027-03-26', end: '2027-03-29' }, cutoff: '2027-03-22' }
    },
    stockNeedList: [
      { name: 'Plum Cake (500g Box)', unit: 'Box', price: 180, currentStock: 25, recommendedOrderQty: 140, estPurchaseBudget: 21000, priority: 'HIGH', qty2023: 95, qty2024: 120, qty2025: 135 },
      { name: 'Aachi Chicken Masala 100g', unit: 'Pack', price: 36, currentStock: 50, recommendedOrderQty: 250, estPurchaseBudget: 7650, priority: 'NORMAL', qty2023: 180, qty2024: 215, qty2025: 235 }
    ]
  },
  {
    id: 'chithirai_thiruvizha',
    name: 'Chithirai Thiruvizha (Madurai & Theni)',
    tamilName: 'சித்திரைத் திருவிழா & கள்ளழகர் ஆற்றில் இறங்குதல்',
    fullName: 'Chithirai Thiruvizha & Kallazhagar Vaigai Festival',
    month: 4,
    monthName: 'April',
    quarter: 'Q2',
    calendarRule: 'Chithirai Pournami (Late April / Early May)',
    tier: 'Very High',
    surgeMultiplier: 1.70,
    surgePercent: '+70%',
    tag: 'Grand Regional Thiruvizha',
    description: '10-day world-renowned cultural festival. Millions gather in Madurai and Theni belt. Massive demand for Bottled Water, Buttermilk, Cold drinks, Biscuits, Glucose, and ready-to-eat travel snacks.',
    stockingAdvice: 'Stock 100+ cases of 1L mineral water and buttermilk cartons. Keep beverage chillers at maximum cooling.',
    keyCategories: ['Mineral Water Bottles (1L/2L)', 'Spiced Buttermilk (Mor) & Curd', 'Cold Carbonated Beverages', 'Glucose & Energy Powders', 'Packaged Biscuits'],
    sampleSkus: [
      { name: 'Bisleri 1L Mineral Water', rate: 20, mrp: 20, surge: '+250%' },
      { name: 'Aavin Spiced Buttermilk 200ml', rate: 12, mrp: 12, surge: '+200%' },
      { name: 'Glucon-D Instant Energy 500g', rate: 120, mrp: 135, surge: '+110%' }
    ],
    datesByYear: {
      '2023': { date: '2023-04-25', window: { start: '2023-04-20', end: '2023-04-28' } },
      '2024': { date: '2024-04-20', window: { start: '2024-04-16', end: '2024-04-23' } },
      '2025': { date: '2025-05-09', window: { start: '2025-05-05', end: '2025-05-12' } },
      '2026': { date: '2026-04-29', window: { start: '2026-04-25', end: '2026-05-02' }, cutoff: '2026-04-20' },
      '2027': { date: '2027-05-18', window: { start: '2027-05-14', end: '2027-05-21' }, cutoff: '2027-05-10' }
    },
    stockNeedList: [
      { name: 'Bisleri 1L Mineral Water (Case of 12)', unit: 'Case', price: 210, currentStock: 20, recommendedOrderQty: 120, estPurchaseBudget: 21600, priority: 'CRITICAL', qty2023: 90, qty2024: 110, qty2025: 115 },
      { name: 'Glucon-D Instant Energy 500g Box', unit: 'Box', price: 120, currentStock: 30, recommendedOrderQty: 160, estPurchaseBudget: 16320, priority: 'HIGH', qty2023: 115, qty2024: 140, qty2025: 155 }
    ]
  },

  // ==========================================
  // MAY (வைகாசி / VAIKASI SEASON)
  // ==========================================
  {
    id: 'summer_cool_beverage_surge',
    name: 'Peak Agni Nakshatram Summer Surge',
    tamilName: 'அக்னி நட்சத்திர கோடைக்கால குளிர்பானங்கள்',
    fullName: 'Peak Agni Nakshatram & Summer School Vacation Surge',
    month: 5,
    monthName: 'May',
    quarter: 'Q2',
    calendarRule: 'Month of May (Peak Summer Heat in Theni District)',
    tier: 'Very High',
    surgeMultiplier: 1.65,
    surgePercent: '+65%',
    tag: 'Seasonal Climate Surge',
    description: 'Scorching summer heat in Bodinayakanur foothills. Continuous demand for Thick Curd, Buttermilk, Ice cream mixes, Glucose-D, Rasna, Rooh Afza, Sabja seeds, Nannari sharbat, and Cold beverages.',
    stockingAdvice: 'Maintain double inventory of Curd and Buttermilk. Set up an "Agni Nakshatram Coolers" section.',
    keyCategories: ['Thick Curd & Fresh Buttermilk', 'Nannari & Rose Milk Syrups', 'Sabja Seeds & Gond Katira', 'Ice Cream Mixes & Squashes', 'Chilled Cold Drinks'],
    sampleSkus: [
      { name: 'Nannari Sharbat Syrup 750ml', rate: 110, mrp: 125, surge: '+140%' },
      { name: 'Aavin Curd 500g Tub', rate: 35, mrp: 35, surge: '+95%' },
      { name: 'Sabja Seeds 100g Pouch', rate: 40, mrp: 45, surge: '+110%' }
    ],
    datesByYear: {
      '2023': { date: '2023-05-15', window: { start: '2023-05-04', end: '2023-05-28' } },
      '2024': { date: '2024-05-15', window: { start: '2024-05-04', end: '2024-05-28' } },
      '2025': { date: '2025-05-15', window: { start: '2025-05-04', end: '2025-05-28' } },
      '2026': { date: '2026-05-15', window: { start: '2026-05-04', end: '2026-05-28' }, cutoff: '2026-04-28' },
      '2027': { date: '2027-05-15', window: { start: '2027-05-04', end: '2027-05-28' }, cutoff: '2027-04-28' }
    },
    stockNeedList: [
      { name: 'Nannari Sharbat Syrup 750ml Bottle', unit: 'Bottle', price: 110, currentStock: 35, recommendedOrderQty: 220, estPurchaseBudget: 20570, priority: 'CRITICAL', qty2023: 160, qty2024: 195, qty2025: 215 },
      { name: 'Aavin Fresh Curd 500g Tub', unit: 'Tub', price: 35, currentStock: 40, recommendedOrderQty: 300, estPurchaseBudget: 9450, priority: 'HIGH', qty2023: 220, qty2024: 260, qty2025: 285 }
    ]
  },
  {
    id: 'mariamman_koozh_thiruvizha',
    name: 'Theni & Bodi Mariamman Temple Koozh Thiruvizha',
    tamilName: 'மாரியம்மன் கூழ் திருவிழா',
    fullName: 'Annual Mariamman & Bhagavathi Amman Koozh Feast',
    month: 5,
    monthName: 'May',
    quarter: 'Q2',
    calendarRule: 'Vaikasi month Tuesday/Friday festival in Theni/Bodi',
    tier: 'High',
    surgeMultiplier: 1.55,
    surgePercent: '+55%',
    tag: 'Traditional Village Thiruvizha',
    description: 'Devotees brew and distribute holy herbal porridge (Koozh). Immense demand for Ragi (Kezhvaragu) flour, Chinna Vengayam (Small onions), Green chillies, Thick curd, Salt, and Lemons.',
    stockingAdvice: 'Stock 25kg sacks of Ragi flour and crates of local small onions.',
    keyCategories: ['Ragi / Kezhvaragu Flour (500g & 1kg)', 'Chinna Vengayam (Small Onions)', 'Green Chillies & Lemons', 'Thick Curd & Buttermilk', 'Rock Salt (Kal Uppu)'],
    sampleSkus: [
      { name: 'Ragi / Kezhvaragu Flour 1kg', rate: 52, mrp: 60, surge: '+180%' },
      { name: 'Tata Salt Crystal (Kal Uppu) 1kg', rate: 22, mrp: 25, surge: '+85%' }
    ],
    datesByYear: {
      '2023': { date: '2023-05-16', window: { start: '2023-05-14', end: '2023-05-18' } },
      '2024': { date: '2024-05-19', window: { start: '2024-05-17', end: '2024-05-21' } },
      '2025': { date: '2025-05-18', window: { start: '2025-05-16', end: '2025-05-20' } },
      '2026': { date: '2026-05-17', window: { start: '2026-05-15', end: '2026-05-19' }, cutoff: '2026-05-10' },
      '2027': { date: '2027-05-19', window: { start: '2027-05-17', end: '2027-05-21' }, cutoff: '2027-05-12' }
    },
    stockNeedList: [
      { name: 'Ragi / Kezhvaragu Flour 1kg Bag', unit: 'Bag', price: 52, currentStock: 40, recommendedOrderQty: 300, estPurchaseBudget: 13260, priority: 'CRITICAL', qty2023: 220, qty2024: 260, qty2025: 290 },
      { name: 'Tata Salt Crystal 1kg Pouch', unit: 'Pouch', price: 22, currentStock: 60, recommendedOrderQty: 350, estPurchaseBudget: 6545, priority: 'HIGH', qty2023: 260, qty2024: 310, qty2025: 340 }
    ]
  },

  // ==========================================
  // JUNE (ஆனி / AANI SEASON)
  // ==========================================
  {
    id: 'school_reopening_rush',
    name: 'School & College Reopening Rush',
    tamilName: 'பள்ளி திறப்பு & லஞ்ச் பாக்ஸ் சீசன்',
    fullName: 'Academic Reopening, Lunchbox Groceries & Kids Nutrition',
    month: 6,
    monthName: 'June',
    quarter: 'Q2',
    calendarRule: 'First two weeks of June (TN Academic Calendar)',
    tier: 'High',
    surgeMultiplier: 1.50,
    surgePercent: '+50%',
    tag: 'Academic Reopening',
    description: 'Schools reopen across Tamil Nadu. Mothers stock lunchbox snacks: Biscuits (Marie Gold, Parle-G, Good Day), Health malt drinks (Horlicks, Boost, Complan), Jam, Cheese, Noodles, and Juice tetrapaks.',
    stockingAdvice: 'Create a dedicated "Back to School Lunchbox Station" with buy-2-get-1 offers on snacks.',
    keyCategories: ['Biscuits, Cookies & Cream', 'Health Drinks (Horlicks, Boost)', 'Maggi & Instant Noodles', 'Kissan Jam & Cheese Spreads', 'Juice Tetrapaks'],
    sampleSkus: [
      { name: 'Horlicks Classic Malt 500g Jar', rate: 260, mrp: 285, surge: '+75%' },
      { name: 'Maggi 2-Minute Noodles 12-Pack', rate: 168, mrp: 190, surge: '+95%' },
      { name: 'Britannia Good Day Cashew 600g', rate: 110, mrp: 130, surge: '+80%' }
    ],
    datesByYear: {
      '2023': { date: '2023-06-05', window: { start: '2023-06-01', end: '2023-06-12' } },
      '2024': { date: '2024-06-06', window: { start: '2024-06-01', end: '2024-06-12' } },
      '2025': { date: '2025-06-04', window: { start: '2025-06-01', end: '2025-06-12' } },
      '2026': { date: '2026-06-05', window: { start: '2026-06-01', end: '2026-06-12' }, cutoff: '2026-05-28' },
      '2027': { date: '2027-06-06', window: { start: '2027-06-01', end: '2027-06-12' }, cutoff: '2027-05-28' }
    },
    stockNeedList: [
      { name: 'Maggi 2-Min Noodles 12-Pack Multi', unit: 'Pack', price: 168, currentStock: 35, recommendedOrderQty: 250, estPurchaseBudget: 35700, priority: 'CRITICAL', qty2023: 180, qty2024: 215, qty2025: 240 },
      { name: 'Horlicks Classic Malt 500g Jar', unit: 'Jar', price: 260, currentStock: 25, recommendedOrderQty: 150, estPurchaseBudget: 33150, priority: 'HIGH', qty2023: 110, qty2024: 130, qty2025: 145 },
      { name: 'Britannia Marie Gold 1kg Value Pack', unit: 'Pack', price: 125, currentStock: 30, recommendedOrderQty: 200, estPurchaseBudget: 21250, priority: 'HIGH', qty2023: 145, qty2024: 175, qty2025: 195 }
    ]
  },
  {
    id: 'bakrid_eid',
    name: 'Bakrid (Eid al-Adha Grand Feast)',
    tamilName: 'பக்ரீத் பெருநாள் பிரியாணி & விருந்து',
    fullName: 'Bakrid (Eid al-Adha Festival & Biryani Feast)',
    month: 6,
    monthName: 'June',
    quarter: 'Q2',
    calendarRule: 'Dhul Hijjah 10 (Lunar calendar shifts ~11 days earlier each solar year)',
    tier: 'Very High',
    surgeMultiplier: 1.65,
    surgePercent: '+65%',
    tag: 'Islamic Grand Feast',
    description: 'Community feast and family gatherings. Massive sales of India Gate Basmati Rice (5kg bags), Pure Ghee, Whole Biryani spices, Vermicelli (Semiya), Sugar, and Dry fruits.',
    stockingAdvice: 'Display 5kg Basmati Rice bags and Ghee jars side-by-side with whole spices bundles.',
    keyCategories: ['Basmati Rice (India Gate, Daawat 5kg)', 'Pure Cow Ghee (1L & 500ml)', 'Whole Biryani Spices (Bay leaf, Star anise)', 'Roasted Vermicelli & Sugar', 'Cashews, Almonds & Kismis'],
    sampleSkus: [
      { name: 'India Gate Basmati Rozzana 5kg', rate: 460, mrp: 540, surge: '+120%' },
      { name: 'Amul Pure Ghee 1L Tin', rate: 610, mrp: 670, surge: '+95%' },
      { name: 'Anil Roasted Vermicelli 500g', rate: 42, mrp: 48, surge: '+85%' }
    ],
    datesByYear: {
      '2023': { date: '2023-06-29', window: { start: '2023-06-26', end: '2023-06-30' } },
      '2024': { date: '2024-06-17', window: { start: '2024-06-14', end: '2024-06-18' } },
      '2025': { date: '2025-06-07', window: { start: '2025-06-04', end: '2025-06-08' } },
      '2026': { date: '2026-05-27', window: { start: '2026-05-24', end: '2026-05-28' }, cutoff: '2026-05-20' },
      '2027': { date: '2027-05-16', window: { start: '2027-05-13', end: '2027-05-17' }, cutoff: '2027-05-09' }
    },
    stockNeedList: [
      { name: 'India Gate Basmati Rozzana 5kg Bag', unit: 'Bag', price: 460, currentStock: 30, recommendedOrderQty: 180, estPurchaseBudget: 70380, priority: 'CRITICAL', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: 'Amul Pure Ghee 1L Tin', unit: 'Tin', price: 610, currentStock: 25, recommendedOrderQty: 140, estPurchaseBudget: 72590, priority: 'CRITICAL', qty2023: 100, qty2024: 125, qty2025: 135 }
    ]
  },

  // ==========================================
  // JULY (ஆடி / AADI SEASON)
  // ==========================================
  {
    id: 'aadi_month_kickoff',
    name: 'Aadi Month Kickoff (Aadi 1st)',
    tamilName: 'ஆடி மாத தொடக்கம் (ஆடி 1)',
    fullName: 'Aadi 1st - Auspicious Tamil Shopping & Discount Season Begins',
    month: 7,
    monthName: 'July',
    quarter: 'Q3',
    calendarRule: 'Aadi 1 (Solar ingress - July 16/17)',
    tier: 'High',
    surgeMultiplier: 1.45,
    surgePercent: '+45%',
    tag: 'Tamil Cultural Shopping Season',
    description: 'Marks the start of the monsoon & spiritual discount season in Tamil Nadu. Families buy തേங்காய் பால் (coconut milk) pongal items, jaggery, raw rice, and lighting oils.',
    stockingAdvice: 'Launch "Aadi Discount Thiruvizha" banners and storewide offers.',
    keyCategories: ['Pacharisi Raw Rice', 'Jaggery & Coconut', 'Dheepam Lamp Oil', 'Sesame Oil', 'Pooja Items'],
    sampleSkus: [
      { name: 'Ponni Pacharisi 5kg Bag', rate: 290, mrp: 320, surge: '+65%' },
      { name: '500Ml R Dheepam Lamp Oil', rate: 100, mrp: 111, surge: '+75%' }
    ],
    datesByYear: {
      '2023': { date: '2023-07-17', window: { start: '2023-07-15', end: '2023-07-18' } },
      '2024': { date: '2024-07-16', window: { start: '2024-07-15', end: '2024-07-18' } },
      '2025': { date: '2025-07-16', window: { start: '2025-07-15', end: '2025-07-18' } },
      '2026': { date: '2026-07-17', window: { start: '2026-07-15', end: '2026-07-18' }, cutoff: '2026-07-10' },
      '2027': { date: '2027-07-17', window: { start: '2027-07-15', end: '2027-07-18' }, cutoff: '2027-07-10' }
    },
    stockNeedList: [
      { name: 'Ponni Pacharisi 5kg Bag', unit: 'Bag', price: 290, currentStock: 35, recommendedOrderQty: 180, estPurchaseBudget: 44370, priority: 'HIGH', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: '500Ml R Dheepam Lamp Oil', unit: 'Pouch', price: 100, currentStock: 40, recommendedOrderQty: 220, estPurchaseBudget: 18700, priority: 'HIGH', qty2023: 160, qty2024: 190, qty2025: 210 }
    ]
  },
  {
    id: 'aadi_velli_pooja',
    name: 'Aadi Velli (Aadi Friday Goddess Poojas)',
    tamilName: 'ஆடி வெள்ளி அம்மன் பூஜைகள் (5 வாரங்கள்)',
    fullName: 'Aadi Fridays (Amman Temple & Sakkarai Pongal Poojas)',
    month: 7,
    monthName: 'July',
    quarter: 'Q3',
    calendarRule: 'All Fridays of the Tamil month Aadi (July 17 – August 16)',
    tier: 'High',
    surgeMultiplier: 1.50,
    surgePercent: '+50%',
    tag: 'Spiritual Temple Rush',
    description: 'Women worship Goddess Amman on all 5 Fridays. Surges in Sakkarai Pongal rice, Traditional Jaggery, Dheepam lamp oil, Kumkum, Turmeric, Coconuts, Lemons, and Pure Ghee.',
    stockingAdvice: 'Ensure pooja oil and jaggery racks are refilled every Thursday afternoon ahead of Friday morning rushes.',
    keyCategories: ['Dheepam Lamp Oil & Sesame Oil', 'Traditional Jaggery (Vellam)', 'Raw Rice & Moong Dal', 'Pure Ghee & Camphor', 'Kumkum & Turmeric'],
    sampleSkus: [
      { name: '1Ltr R Porna Pooja Oil Pet', rate: 195, mrp: 215, surge: '+85%' },
      { name: '1Kg Traditional Jaggery', rate: 65, mrp: 75, surge: '+80%' },
      { name: '200Ml GRB Ghee Jar', rate: 195, mrp: 210, surge: '+60%' }
    ],
    datesByYear: {
      '2023': { date: '2023-07-21', window: { start: '2023-07-20', end: '2023-08-15' } },
      '2024': { date: '2024-07-26', window: { start: '2024-07-25', end: '2024-08-16' } },
      '2025': { date: '2025-07-25', window: { start: '2025-07-24', end: '2025-08-15' } },
      '2026': { date: '2026-07-24', window: { start: '2026-07-23', end: '2026-08-14' }, cutoff: '2026-07-18' },
      '2027': { date: '2027-07-23', window: { start: '2027-07-22', end: '2027-08-13' }, cutoff: '2027-07-18' }
    },
    stockNeedList: [
      { name: '1Ltr R Porna Pooja Oil Pet', unit: 'Bottle', price: 195, currentStock: 30, recommendedOrderQty: 180, estPurchaseBudget: 29835, priority: 'CRITICAL', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: '1Kg Traditional Jaggery', unit: 'Kg', price: 65, currentStock: 50, recommendedOrderQty: 260, estPurchaseBudget: 14300, priority: 'HIGH', qty2023: 190, qty2024: 230, qty2025: 250 }
    ]
  },

  // ==========================================
  // AUGUST (ஆவணி / AAVANI SEASON)
  // ==========================================
  {
    id: 'aadi_18_perukku',
    name: 'Aadi 18 Perukku (River Feast & 5 Variety Rice)',
    tamilName: 'ஆடிப்பெருக்கு 18ம் பெருக்கு & சித்ரான்ன விருந்து',
    fullName: 'Aadi Perukku (18th Day of Aadi Variety Rice Feast)',
    month: 8,
    monthName: 'August',
    quarter: 'Q3',
    calendarRule: 'Aadi 18 (Solar Calendar - Fixed Aug 2/3)',
    tier: 'Very High',
    surgeMultiplier: 1.65,
    surgePercent: '+65%',
    tag: 'Traditional Variety Rice Feast',
    description: 'River reverence and picnic feast. Families prepare 5 types of rice: Lemon rice, Coconut rice, Puliyodharai (Tamarind rice), Curd rice, and Sakkarai pongal. Surge in Ponni rice, Appalam, Sesame, and Ghee.',
    stockingAdvice: 'Set up "Chitrannam Essentials Basket" (Tamarind + Lemons + Peanuts + Mustard + Appalam).',
    keyCategories: ['Ponni Boiled Rice (5kg & 25kg)', 'Appalam (Crispy papads)', 'Peanuts & Sesame Seeds', 'Puliyodharai Paste & Masala', 'Ghee & Gingelly Oil'],
    sampleSkus: [
      { name: 'Ambika Appalam 200g Pack', rate: 45, mrp: 50, surge: '+120%' },
      { name: '1Ltr Idhayam Sesame Oil', rate: 420, mrp: 450, surge: '+70%' },
      { name: 'Raw Peanuts / Verkadalai 500g', rate: 75, mrp: 85, surge: '+85%' }
    ],
    datesByYear: {
      '2023': { date: '2023-08-03', window: { start: '2023-08-01', end: '2023-08-04' } },
      '2024': { date: '2024-08-02', window: { start: '2024-08-01', end: '2024-08-04' } },
      '2025': { date: '2025-08-03', window: { start: '2025-08-01', end: '2025-08-04' } },
      '2026': { date: '2026-08-03', window: { start: '2026-08-01', end: '2026-08-04' }, cutoff: '2026-07-28' },
      '2027': { date: '2027-08-03', window: { start: '2027-08-01', end: '2027-08-04' }, cutoff: '2027-07-28' }
    },
    stockNeedList: [
      { name: 'Ambika Appalam 200g Pack', unit: 'Pack', price: 45, currentStock: 40, recommendedOrderQty: 280, estPurchaseBudget: 10710, priority: 'CRITICAL', qty2023: 200, qty2024: 245, qty2025: 270 },
      { name: '1Ltr Idhayam Sesame Oil Pet', unit: 'Bottle', price: 420, currentStock: 25, recommendedOrderQty: 140, estPurchaseBudget: 49980, priority: 'HIGH', qty2023: 95, qty2024: 120, qty2025: 135 }
    ]
  },
  {
    id: 'independence_day_sale',
    name: 'Independence Day Freedom Mega Sale',
    tamilName: 'சுதந்திர தின மெகா ஆஃபர் விழா',
    fullName: 'Independence Day Mega Freedom Discount Weekend',
    month: 8,
    monthName: 'August',
    quarter: 'Q3',
    calendarRule: 'National Fixed (August 15th)',
    tier: 'High',
    surgeMultiplier: 1.55,
    surgePercent: '+55%',
    tag: 'National Mega Discount',
    description: 'Long weekend pantry stocking. Heavy volume in household essentials: Atta, Sunflower oil, Pulses, Soaps, Washing detergents, and Tea/Coffee.',
    stockingAdvice: 'Run aggressive multi-pack deals (Buy 2 Get 1, Combo Packs) to drive turnover.',
    keyCategories: ['Sunflower Oil 5L Cans', 'Wheat Atta 10kg', 'Toor Dal 5kg', 'Surf Excel 5kg', 'Tata Tea Gold 500g'],
    sampleSkus: [
      { name: '5Ltr Gold Winner Sunflower Oil', rate: 690, mrp: 750, surge: '+75%' },
      { name: 'Surf Excel Easy Wash 5kg', rate: 580, mrp: 625, surge: '+60%' }
    ],
    datesByYear: {
      '2023': { date: '2023-08-15', window: { start: '2023-08-12', end: '2023-08-16' } },
      '2024': { date: '2024-08-15', window: { start: '2024-08-12', end: '2024-08-16' } },
      '2025': { date: '2025-08-15', window: { start: '2025-08-12', end: '2025-08-16' } },
      '2026': { date: '2026-08-15', window: { start: '2026-08-12', end: '2026-08-16' }, cutoff: '2026-08-08' },
      '2027': { date: '2027-08-15', window: { start: '2027-08-12', end: '2027-08-16' }, cutoff: '2027-08-08' }
    },
    stockNeedList: [
      { name: '5Ltr Gold Winner Sunflower Oil Can', unit: 'Can', price: 690, currentStock: 35, recommendedOrderQty: 160, estPurchaseBudget: 93840, priority: 'CRITICAL', qty2023: 120, qty2024: 140, qty2025: 155 },
      { name: 'Surf Excel Easy Wash 5kg Pack', unit: 'Pack', price: 580, currentStock: 25, recommendedOrderQty: 130, estPurchaseBudget: 63960, priority: 'HIGH', qty2023: 95, qty2024: 115, qty2025: 125 }
    ]
  },
  {
    id: 'varalakshmi_vratham',
    name: 'Varalakshmi Vratham (Sumangali Pooja)',
    tamilName: 'வரலட்சுமி விரத பூஜை',
    fullName: 'Varalakshmi Vratham Sacred Goddess Worship',
    month: 8,
    monthName: 'August',
    quarter: 'Q3',
    calendarRule: 'Friday before Shravana Purnima (Lunisolar shifts August)',
    tier: 'High',
    surgeMultiplier: 1.55,
    surgePercent: '+55%',
    tag: 'Spiritual Prosperity Pooja',
    description: 'Major festival observed by married women for family prosperity. High sales of Raw rice, Turmeric, Kumkum, Betel leaves, Pooja coconuts, Ghee, Dry fruits, and Sweet boxes.',
    stockingAdvice: 'Prepare pre-packed "Varalakshmi Thamboolam Pouches" with turmeric, kumkum, and bangles.',
    keyCategories: ['Pooja Coconuts & Raw Rice', 'Pure Ghee & Camphor', 'Cashews, Almonds & Dry Fruits', 'Saffron & Cardamom', 'Sweet Boxes & Mithai'],
    sampleSkus: [
      { name: '200Ml GRB Ghee Jar', rate: 195, mrp: 210, surge: '+70%' },
      { name: 'Turmeric Powder 200g Pack', rate: 38, mrp: 42, surge: '+85%' }
    ],
    datesByYear: {
      '2023': { date: '2023-08-25', window: { start: '2023-08-23', end: '2023-08-26' } },
      '2024': { date: '2024-08-16', window: { start: '2024-08-14', end: '2024-08-17' } },
      '2025': { date: '2025-08-08', window: { start: '2025-08-06', end: '2025-08-09' } },
      '2026': { date: '2026-08-28', window: { start: '2026-08-26', end: '2026-08-29' }, cutoff: '2026-08-22' },
      '2027': { date: '2027-08-13', window: { start: '2027-08-11', end: '2027-08-14' }, cutoff: '2027-08-07' }
    },
    stockNeedList: [
      { name: '200Ml GRB Ghee Jar', unit: 'Jar', price: 195, currentStock: 30, recommendedOrderQty: 160, estPurchaseBudget: 26520, priority: 'HIGH', qty2023: 115, qty2024: 140, qty2025: 155 },
      { name: 'Aachi Turmeric Powder 200g', unit: 'Pack', price: 38, currentStock: 45, recommendedOrderQty: 220, estPurchaseBudget: 7106, priority: 'NORMAL', qty2023: 160, qty2024: 190, qty2025: 210 }
    ]
  },
  {
    id: 'krishna_jayanthi',
    name: 'Sri Krishna Jayanthi (Gokulashtami)',
    tamilName: 'ஸ்ரீ கிருஷ்ண ஜெயந்தி (கோகுலாஷ்டமி)',
    fullName: 'Sri Krishna Jayanthi / Gokulashtami Festival',
    month: 8,
    monthName: 'August',
    quarter: 'Q3',
    calendarRule: 'Shravana Krishna Ashtami with Rohini Nakshatra (Late Aug - Early Sep)',
    tier: 'High',
    surgeMultiplier: 1.60,
    surgePercent: '+60%',
    tag: 'Traditional Sweets & Snacks',
    description: 'Celebrating Lord Krishnas birth. Tradition of preparing Seedai (Uppu & Vella seedai), Murukku, Thattai, and Aval snacks. High demand for Rice flour, Fresh butter (Vennai), Roasted gram, Jaggery, Sesame, and Aval.',
    stockingAdvice: 'Stock authentic seedai/murukku rice flour and fresh white butter in chiller.',
    keyCategories: ['Murukku & Seedai Rice Flour', 'Fresh White Cooking Butter (Vennai)', 'Aval / Poha (500g)', 'Jaggery & Cardamom', 'Sesame Seeds (Black & White)'],
    sampleSkus: [
      { name: 'Anil Murukku Rice Flour 500g', rate: 45, mrp: 50, surge: '+140%' },
      { name: 'Fresh Cooking Butter (Vennai 200g)', rate: 110, mrp: 120, surge: '+150%' },
      { name: 'Thick Aval (Poha) 500g', rate: 45, mrp: 52, surge: '+95%' }
    ],
    datesByYear: {
      '2023': { date: '2023-09-06', window: { start: '2023-09-04', end: '2023-09-07' } },
      '2024': { date: '2024-08-26', window: { start: '2024-08-24', end: '2024-08-27' } },
      '2025': { date: '2025-08-16', window: { start: '2025-08-14', end: '2025-08-17' } },
      '2026': { date: '2026-09-04', window: { start: '2026-09-02', end: '2026-09-05' }, cutoff: '2026-08-29' },
      '2027': { date: '2027-08-25', window: { start: '2027-08-23', end: '2027-08-26' }, cutoff: '2027-08-19' }
    },
    stockNeedList: [
      { name: 'Anil Murukku Rice Flour 500g', unit: 'Pack', price: 45, currentStock: 35, recommendedOrderQty: 240, estPurchaseBudget: 9180, priority: 'CRITICAL', qty2023: 170, qty2024: 210, qty2025: 230 },
      { name: 'Fresh Cooking Butter 200g', unit: 'Pack', price: 110, currentStock: 25, recommendedOrderQty: 150, estPurchaseBudget: 14025, priority: 'CRITICAL', qty2023: 105, qty2024: 130, qty2025: 145 },
      { name: 'Thick Aval 500g Pack', unit: 'Pack', price: 45, currentStock: 30, recommendedOrderQty: 200, estPurchaseBudget: 7650, priority: 'HIGH', qty2023: 145, qty2024: 175, qty2025: 190 }
    ]
  },

  // ==========================================
  // SEPTEMBER (புரட்டாசி / PURATTASI SEASON)
  // ==========================================
  {
    id: 'vinayakar_chaturthi',
    name: 'Vinayakar Chaturthi (Ganesha Festival)',
    tamilName: 'விநாயகர் சதுர்த்தி திருவிழா',
    fullName: 'Vinayakar Chaturthi (Ganesha Festival & Kozhukattai)',
    month: 9,
    monthName: 'September',
    quarter: 'Q3',
    calendarRule: 'Avani Shukla Chaturthi (Lunisolar shifts Aug–Sep)',
    tier: 'Very High',
    surgeMultiplier: 1.75,
    surgePercent: '+75%',
    tag: 'Major Religious Festival',
    description: 'Widespread family and public pandal celebrations. Massive demand for Kozhukattai rice flour, traditional Jaggery, Coconuts, Black & White Sesame, Dheepam lamp oil, and Camphor.',
    stockingAdvice: 'Display modak molds, pooja oil bottles, and kozhukattai flour together in entrance foyer.',
    keyCategories: ['Kozhukattai Rice Flour', 'Traditional Jaggery Blocks', 'Pooja Lamp Oils & Camphor', 'Fresh Coconuts', 'Sesame Seeds & Cardamom'],
    sampleSkus: [
      { name: '500Ml R Dheepam Lamp Oil', rate: 100, mrp: 111, surge: '+85%' },
      { name: '1Ltr R Porna Pooja Oil Pet', rate: 195, mrp: 215, surge: '+80%' },
      { name: 'Kozhukattai Rice Flour 500g', rate: 45, mrp: 50, surge: '+160%' },
      { name: 'Traditional Jaggery 1kg', rate: 65, mrp: 75, surge: '+95%' }
    ],
    datesByYear: {
      '2022': { date: '2022-08-31', window: { start: '2022-08-28', end: '2022-09-01' } },
      '2023': { date: '2023-09-18', window: { start: '2023-09-15', end: '2023-09-19' } },
      '2024': { date: '2024-09-07', window: { start: '2024-09-04', end: '2024-09-08' } },
      '2025': { date: '2025-08-27', window: { start: '2025-08-24', end: '2025-08-28' } },
      '2026': { date: '2026-09-14', window: { start: '2026-09-11', end: '2026-09-15' }, cutoff: '2026-09-08' },
      '2027': { date: '2027-09-04', window: { start: '2027-09-01', end: '2027-09-05' }, cutoff: '2027-08-28' }
    },
    stockNeedList: [
      { name: 'Kozhukattai Rice Flour 500g Pack', unit: 'Pack', price: 45, currentStock: 35, recommendedOrderQty: 280, estPurchaseBudget: 10710, priority: 'CRITICAL', qty2023: 200, qty2024: 245, qty2025: 270 },
      { name: 'Traditional Jaggery 1kg Block', unit: 'Kg', price: 65, currentStock: 45, recommendedOrderQty: 260, estPurchaseBudget: 14300, priority: 'CRITICAL', qty2023: 190, qty2024: 230, qty2025: 250 },
      { name: '500Ml R Dheepam Lamp Oil Pouch', unit: 'Pouch', price: 100, currentStock: 40, recommendedOrderQty: 240, estPurchaseBudget: 20400, priority: 'HIGH', qty2023: 170, qty2024: 210, qty2025: 230 }
    ]
  },
  {
    id: 'onam_sadhya',
    name: 'Onam Festival (Grand Sadhya Feast)',
    tamilName: 'ஓணம் பண்டிகை சாத்யா விருந்து',
    fullName: 'Onam Harvest & 26-Dish Sadhya Feast',
    month: 9,
    monthName: 'September',
    quarter: 'Q3',
    calendarRule: 'Chingam month Thiruvonam (Late Aug / Early Sep)',
    tier: 'High',
    surgeMultiplier: 1.55,
    surgePercent: '+55%',
    tag: 'Cultural Harvest Feast',
    description: 'Prominent across Kerala-border Theni/Bodi communities. Surge in Kerala Matta Rice, Coconut Oil, Banana Chips, Semiya Payasam, Jaggery sharkara upperi, and Pappadams.',
    stockingAdvice: 'Stock authentic Kera / KPL Coconut oil and Palada payasam mix packets.',
    keyCategories: ['Kerala Matta Rice', 'Pure Coconut Cooking Oil', 'Banana Chips & Sharkara Upperi', 'Palada Payasam Mix', 'Pappadam'],
    sampleSkus: [
      { name: 'KPL Shudhi Coconut Oil 1L', rate: 260, mrp: 285, surge: '+90%' },
      { name: 'Kerala Matta Rice 5kg Bag', rate: 340, mrp: 380, surge: '+75%' }
    ],
    datesByYear: {
      '2023': { date: '2023-08-29', window: { start: '2023-08-27', end: '2023-08-30' } },
      '2024': { date: '2024-09-15', window: { start: '2024-09-13', end: '2024-09-16' } },
      '2025': { date: '2025-09-05', window: { start: '2025-09-03', end: '2025-09-06' } },
      '2026': { date: '2026-08-25', window: { start: '2026-08-23', end: '2026-08-26' }, cutoff: '2026-08-19' },
      '2027': { date: '2027-09-14', window: { start: '2027-09-12', end: '2027-09-15' }, cutoff: '2027-09-08' }
    },
    stockNeedList: [
      { name: 'KPL Shudhi Coconut Oil 1L Bottle', unit: 'Bottle', price: 260, currentStock: 25, recommendedOrderQty: 140, estPurchaseBudget: 30940, priority: 'HIGH', qty2023: 100, qty2024: 120, qty2025: 135 },
      { name: 'Kerala Matta Rice 5kg Bag', unit: 'Bag', price: 340, currentStock: 30, recommendedOrderQty: 150, estPurchaseBudget: 43350, priority: 'HIGH', qty2023: 105, qty2024: 130, qty2025: 140 }
    ]
  },

  // ==========================================
  // OCTOBER (ஐப்பசி / AIPASI SEASON)
  // ==========================================
  {
    id: 'navaratri_sundal_days',
    name: 'Navaratri 9 Days of Sundal & Golu',
    tamilName: 'நவராத்திரி 9 நாட்கள் கொலு & சுண்டல் பிரசாதம்',
    fullName: 'Navaratri 9 Days of Sundal & Golu Offerings',
    month: 10,
    monthName: 'October',
    quarter: 'Q4',
    calendarRule: 'Purattasi Shukla Pratipada to Navami (Shifts Sep–Oct)',
    tier: 'Very High',
    surgeMultiplier: 1.60,
    surgePercent: '+60%',
    tag: '9 Days Sundal Pulses Surge',
    description: 'Every evening families offer a different legume sundal to Golu visitors. Daily surge in White Chickpeas (Konda kadalai), Green Gram (Pasi payaru), Black Chana, Cowpea (Karamani), Grated coconut, Mustard, Hing, and Red chillies.',
    stockingAdvice: 'Display all 9 sundal pulses together with a sign "Navaratri 9-Day Sundal Pulses Counter".',
    keyCategories: ['White Chickpeas (Kabuli Chana)', 'Green Gram (Pasi Payaru)', 'Black Chana & Cowpea', 'Grated Coconut & Mustard', 'Hing (Asafoetida) & Red Chilli'],
    sampleSkus: [
      { name: 'Kabuli Chana (White) 500g', rate: 75, mrp: 85, surge: '+110%' },
      { name: 'Green Gram Whole 500g', rate: 68, mrp: 76, surge: '+95%' },
      { name: 'LG Asafoetida (Hing) 50g', rate: 45, mrp: 50, surge: '+70%' }
    ],
    datesByYear: {
      '2023': { date: '2023-10-15', window: { start: '2023-10-14', end: '2023-10-23' } },
      '2024': { date: '2024-10-03', window: { start: '2024-10-02', end: '2024-10-11' } },
      '2025': { date: '2025-09-22', window: { start: '2025-09-21', end: '2025-09-30' } },
      '2026': { date: '2026-10-11', window: { start: '2026-10-10', end: '2026-10-19' }, cutoff: '2026-10-05' },
      '2027': { date: '2027-10-01', window: { start: '2027-09-30', end: '2027-10-09' }, cutoff: '2027-09-25' }
    },
    stockNeedList: [
      { name: 'Kabuli Chana (White) 500g Pack', unit: 'Pack', price: 75, currentStock: 40, recommendedOrderQty: 260, estPurchaseBudget: 16575, priority: 'CRITICAL', qty2023: 190, qty2024: 230, qty2025: 250 },
      { name: 'Green Gram Whole 500g Pack', unit: 'Pack', price: 68, currentStock: 45, recommendedOrderQty: 250, estPurchaseBudget: 14450, priority: 'HIGH', qty2023: 180, qty2024: 220, qty2025: 240 }
    ]
  },
  {
    id: 'ayudha_pooja',
    name: 'Ayudha Pooja & Saraswathi Pooja',
    tamilName: 'ஆயுத பூஜை & சரஸ்வதி பூஜை',
    fullName: 'Ayudha Pooja & Saraswathi Pooja Commercial Rush',
    month: 10,
    monthName: 'October',
    quarter: 'Q4',
    calendarRule: 'Purattasi Mahanavami (Shifts Sep–Oct)',
    tier: 'Peak (Single Day Highest FMCG)',
    surgeMultiplier: 1.90,
    surgePercent: '+90%',
    tag: 'Commercial & Vehicle Pooja',
    description: 'The highest single-day retail FMCG transaction volume in Tamil Nadu. Every vehicle, machine, shop, and home buys Pori (puffed rice), Pottukadalai (roasted gram), Country Jaggery, Sweets candy drops, Bananas, Lemons, Agarbatti, and Lamp oils.',
    stockingAdvice: 'Pre-order 4x usual volume of Pori and Roasted Gram directly from mills by Oct 14 to avoid stockouts.',
    keyCategories: ['Pori (Puffed Rice 500g Bags)', 'Roasted Gram (Pottukadalai 500g)', 'Country Jaggery / Nattu Sakkarai', 'Pooja Oils (Dheepam & Porna)', 'Lemons & Fruits'],
    sampleSkus: [
      { name: 'Pori (Puffed Rice 500g)', rate: 35, mrp: 40, surge: '+250%' },
      { name: 'Roasted Gram (Pottukadalai 500g)', rate: 65, mrp: 75, surge: '+180%' },
      { name: '1Ltr R Porna Pooja Oil Pet', rate: 195, mrp: 215, surge: '+90%' },
      { name: '1Kg R Sugar M', rate: 48.5, mrp: 60, surge: '+70%' }
    ],
    datesByYear: {
      '2022': { date: '2022-10-04', window: { start: '2022-10-01', end: '2022-10-05' } },
      '2023': { date: '2023-10-23', window: { start: '2023-10-19', end: '2023-10-24' } },
      '2024': { date: '2024-10-11', window: { start: '2024-10-08', end: '2024-10-13' } },
      '2025': { date: '2025-10-01', window: { start: '2025-09-27', end: '2025-10-02' } },
      '2026': { date: '2026-10-19', window: { start: '2026-10-16', end: '2026-10-20' }, cutoff: '2026-10-14' },
      '2027': { date: '2027-10-09', window: { start: '2027-10-06', end: '2027-10-10' }, cutoff: '2027-10-03' }
    },
    stockNeedList: [
      { name: 'Pori (Puffed Rice 500g Bag)', unit: 'Bag', price: 35, currentStock: 50, recommendedOrderQty: 450, estPurchaseBudget: 13388, priority: 'CRITICAL', qty2023: 380, qty2024: 420, qty2025: 440 },
      { name: 'Roasted Gram (Pottukadalai 500g)', unit: 'Pack', price: 65, currentStock: 45, recommendedOrderQty: 380, estPurchaseBudget: 20995, priority: 'CRITICAL', qty2023: 310, qty2024: 355, qty2025: 375 },
      { name: '1Ltr R Porna Pooja Oil Pet', unit: 'Bottle', price: 195, currentStock: 30, recommendedOrderQty: 220, estPurchaseBudget: 36465, priority: 'CRITICAL', qty2023: 160, qty2024: 195, qty2025: 215 },
      { name: '1Kg R Sugar M', unit: 'Kg', price: 48.5, currentStock: 60, recommendedOrderQty: 350, estPurchaseBudget: 14400, priority: 'HIGH', qty2023: 260, qty2024: 310, qty2025: 340 }
    ]
  },

  // ==========================================
  // NOVEMBER (கார்த்திகை / KARTHIGAI SEASON)
  // ==========================================
  {
    id: 'deepavali',
    name: 'Deepavali (Diwali Mega Shopping Week)',
    tamilName: 'தீபாவளி பெருந்திருவிழா & பலகார சீசன்',
    fullName: 'Deepavali (Festival of Lights & Mega Sweet Season)',
    month: 11,
    monthName: 'November',
    quarter: 'Q4',
    calendarRule: 'Aipasi Amavasya / Naraka Chaturdashi (Lunisolar shifts Oct–Nov)',
    tier: 'Peak (Year Highest Turnover)',
    surgeMultiplier: 2.35,
    surgePercent: '+135%',
    tag: 'Grand Annual Festival',
    description: 'The absolute apex of the retail grocery year. Families bake multiple kilos of sweets and savouries. Astounding demand for Cooking oils (1L & 5L cans), Pure Ghee, Maida, Rava, Sugar, Gram flour (Besan), Cashews, Almonds, and Crackers snack hampers.',
    stockingAdvice: 'Book bulk 5L Sunflower Oil cans and Ghee inventory 10 days in advance. Package ready-to-buy "Diwali Sweet Maker Combos".',
    keyCategories: ['Refined Cooking Oils (1L & 5L)', 'Pure Ghee Jars (200ml, 500ml, 1L)', 'Sugar & Sweeteners (1kg & 5kg)', 'Maida, Rava & Besan Flours', 'Dry Fruits, Sweets & Crackers Hampers'],
    sampleSkus: [
      { name: '1Ltr R Gold Winner Sunflower Oil', rate: 142, mrp: 155, surge: '+220%' },
      { name: '500Ml Hat Ghee Jar', rate: 480, mrp: 500, surge: '+160%' },
      { name: '500G R Anil Maida', rate: 38, mrp: 42, surge: '+140%' },
      { name: '1Kg R Naga Rava', rate: 76, mrp: 85, surge: '+130%' },
      { name: 'Cashew Nut W320 500g Box', rate: 450, mrp: 490, surge: '+180%' }
    ],
    datesByYear: {
      '2022': { date: '2022-10-24', window: { start: '2022-10-20', end: '2022-10-25' } },
      '2023': { date: '2023-11-12', window: { start: '2023-11-07', end: '2023-11-12' } },
      '2024': { date: '2024-10-31', window: { start: '2024-10-26', end: '2024-10-31' } },
      '2025': { date: '2025-10-20', window: { start: '2025-10-15', end: '2025-10-20' } },
      '2026': { date: '2026-11-08', window: { start: '2026-11-03', end: '2026-11-08' }, cutoff: '2026-10-28' },
      '2027': { date: '2027-10-29', window: { start: '2027-10-24', end: '2027-10-29' }, cutoff: '2027-10-19' }
    },
    stockNeedList: [
      { name: '1Ltr R Gold Winner Sunflower Oil Pet', unit: 'Bottle', price: 142, currentStock: 40, recommendedOrderQty: 480, estPurchaseBudget: 57936, priority: 'CRITICAL', qty2023: 390, qty2024: 440, qty2025: 470 },
      { name: '500Ml Hat Ghee Jar', unit: 'Jar', price: 480, currentStock: 25, recommendedOrderQty: 220, estPurchaseBudget: 91300, priority: 'CRITICAL', qty2023: 160, qty2024: 195, qty2025: 215 },
      { name: '500G R Anil Maida', unit: 'Pack', price: 38, currentStock: 45, recommendedOrderQty: 320, estPurchaseBudget: 10336, priority: 'CRITICAL', qty2023: 240, qty2024: 285, qty2025: 310 },
      { name: '1Kg R Naga Rava', unit: 'Kg', price: 76, currentStock: 40, recommendedOrderQty: 260, estPurchaseBudget: 16796, priority: 'HIGH', qty2023: 190, qty2024: 230, qty2025: 250 },
      { name: '1Kg R Sugar M', unit: 'Kg', price: 48.5, currentStock: 60, recommendedOrderQty: 500, estPurchaseBudget: 20562, priority: 'CRITICAL', qty2023: 410, qty2024: 460, qty2025: 490 },
      { name: 'Cashew Nut W320 500g Gift Box', unit: 'Box', price: 450, currentStock: 20, recommendedOrderQty: 120, estPurchaseBudget: 45900, priority: 'HIGH', qty2023: 80, qty2024: 105, qty2025: 115 }
    ]
  },
  {
    id: 'karthigai_deepam',
    name: 'Karthigai Deepam (Festival of 1,000 Lamps)',
    tamilName: 'திருக்கார்த்திகை தீபத் திருவிழா',
    fullName: 'Karthigai Deepam (Agal Vilakku & Pori Urundai)',
    month: 11,
    monthName: 'November',
    quarter: 'Q4',
    calendarRule: 'Karthigai Pournami Krittika Nakshatra (Late Nov - Early Dec)',
    tier: 'High',
    surgeMultiplier: 1.50,
    surgePercent: '+50%',
    tag: 'Traditional Lighting Festival',
    description: 'Lighting oil and jaggery pori festival. Surges in Dheepam Lamp Oil, Idhayam Gingelly/Sesame Oil, Clay Agal Vilakku wicks, Pori, and Jaggery for Pori Urundai.',
    stockingAdvice: 'Create center stack for Dheepam Lamp Oil and cotton wicks. Offer discount on 1L Gingelly oil.',
    keyCategories: ['Gingelly / Sesame Oil (Idhayam)', 'Dheepam Lamp Oil & Wicks', 'Clay Lamps & Diyas', 'Jaggery & Pori for Urundai'],
    sampleSkus: [
      { name: '500Ml R Dheepam Lamp Oil', rate: 100, mrp: 111, surge: '+95%' },
      { name: '1Ltr Idhayam Gingelly Oil Pet', rate: 420, mrp: 450, surge: '+85%' },
      { name: 'Jaggery / Vellam (1Kg)', rate: 65, mrp: 75, surge: '+60%' }
    ],
    datesByYear: {
      '2022': { date: '2022-12-06', window: { start: '2022-12-03', end: '2022-12-07' } },
      '2023': { date: '2023-11-26', window: { start: '2023-11-24', end: '2023-11-27' } },
      '2024': { date: '2024-12-13', window: { start: '2024-12-11', end: '2024-12-14' } },
      '2025': { date: '2025-12-04', window: { start: '2025-12-02', end: '2025-12-05' } },
      '2026': { date: '2026-11-24', window: { start: '2026-11-22', end: '2026-11-25' }, cutoff: '2026-11-18' },
      '2027': { date: '2027-12-13', window: { start: '2027-12-11', end: '2027-12-14' }, cutoff: '2027-12-07' }
    },
    stockNeedList: [
      { name: '500Ml R Dheepam Lamp Oil Pouch', unit: 'Pouch', price: 100, currentStock: 40, recommendedOrderQty: 260, estPurchaseBudget: 22100, priority: 'CRITICAL', qty2023: 190, qty2024: 230, qty2025: 250 },
      { name: '1Ltr Idhayam Gingelly Oil Pet', unit: 'Bottle', price: 420, currentStock: 25, recommendedOrderQty: 150, estPurchaseBudget: 53550, priority: 'CRITICAL', qty2023: 105, qty2024: 130, qty2025: 145 },
      { name: 'Cotton Pooja Wicks (Thiri 50g)', unit: 'Pack', price: 20, currentStock: 50, recommendedOrderQty: 300, estPurchaseBudget: 5100, priority: 'HIGH', qty2023: 220, qty2024: 265, qty2025: 290 }
    ]
  },

  // ==========================================
  // DECEMBER (மார்கழி / MARGAZHI SEASON)
  // ==========================================
  {
    id: 'margazhi_temple_month',
    name: 'Margazhi Devotional Month Begins',
    tamilName: 'மார்கழி மாத திருப்பாவை பக்தி மாதம்',
    fullName: 'Margazhi Month Early Morning Temple Poojas',
    month: 12,
    monthName: 'December',
    quarter: 'Q4',
    calendarRule: 'Margazhi 1 (Solar ingress - Dec 16)',
    tier: 'High',
    surgeMultiplier: 1.45,
    surgePercent: '+45%',
    tag: 'Spiritual Temple Devotion',
    description: '30 days of pre-dawn temple visits and Tiruppavai recitation. Constant daily demand for Ven Pongal ingredients: Raw rice, Split Moong dal, Whole Black Pepper (Milagu), Cumin seeds (Jeeragam), Pure Ghee, and Cashews.',
    stockingAdvice: 'Display "Margazhi Ven Pongal Combo" in 1kg kits.',
    keyCategories: ['Pacharisi Raw Rice', 'Split Moong Dal (Paasi Paruppu)', 'Black Pepper & Cumin Seeds', 'Pure Cow Ghee', 'Dheepam Oil & Camphor'],
    sampleSkus: [
      { name: 'Black Pepper (Milagu) 100g', rate: 95, mrp: 110, surge: '+75%' },
      { name: 'Cumin Seeds (Jeera) 100g', rate: 65, mrp: 75, surge: '+70%' },
      { name: 'Split Moong Dal 500g', rate: 72, mrp: 80, surge: '+65%' }
    ],
    datesByYear: {
      '2023': { date: '2023-12-16', window: { start: '2023-12-15', end: '2023-12-20' } },
      '2024': { date: '2024-12-16', window: { start: '2024-12-15', end: '2024-12-20' } },
      '2025': { date: '2025-12-16', window: { start: '2025-12-15', end: '2025-12-20' } },
      '2026': { date: '2026-12-16', window: { start: '2026-12-15', end: '2026-12-20' }, cutoff: '2026-12-10' },
      '2027': { date: '2027-12-16', window: { start: '2027-12-15', end: '2027-12-20' }, cutoff: '2027-12-10' }
    },
    stockNeedList: [
      { name: 'Black Pepper (Milagu) 100g Pack', unit: 'Pack', price: 95, currentStock: 35, recommendedOrderQty: 180, estPurchaseBudget: 14535, priority: 'HIGH', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: 'Split Moong Dal 500g Pack', unit: 'Pack', price: 72, currentStock: 40, recommendedOrderQty: 220, estPurchaseBudget: 13464, priority: 'HIGH', qty2023: 160, qty2024: 190, qty2025: 210 }
    ]
  },
  {
    id: 'christmas_newyear',
    name: 'Christmas Eve & Christmas Grand Day',
    tamilName: 'கிறிஸ்துமஸ் பெருநாள் விருந்து',
    fullName: 'Christmas Celebration & Holiday Baking Feast',
    month: 12,
    monthName: 'December',
    quarter: 'Q4',
    calendarRule: 'Gregorian Fixed (December 24–25)',
    tier: 'Very High',
    surgeMultiplier: 1.65,
    surgePercent: '+65%',
    tag: 'Christmas Grand Feast',
    description: 'Baking and family feasts. High demand for Plum Cakes, Cocoa powder, Baking powder, Vanilla essence, Tutti frutti, Cashews, Raisins, Farm eggs, Butter, Chocolates, and soft drinks.',
    stockingAdvice: 'Ensure beverage refrigeration is fully stocked. Set up front-of-store Christmas Cake and gift hamper display.',
    keyCategories: ['Plum Cakes & Bakery', 'Butter & Cream', 'Soft Drinks & Juices', 'Chocolates & Gifts', 'Baking Essentials & Dry Fruits'],
    sampleSkus: [
      { name: 'Plum Cake (500g Box)', rate: 180, mrp: 200, surge: '+190%' },
      { name: 'Butter (500g)', rate: 275, mrp: 290, surge: '+65%' },
      { name: 'Cold Beverages & Juices', rate: 45, mrp: 50, surge: '+80%' },
      { name: 'Chocolates & Gift Boxes', rate: 120, mrp: 150, surge: '+75%' }
    ],
    datesByYear: {
      '2022': { date: '2022-12-25', window: { start: '2022-12-23', end: '2022-12-26' } },
      '2023': { date: '2023-12-25', window: { start: '2023-12-23', end: '2023-12-26' } },
      '2024': { date: '2024-12-25', window: { start: '2024-12-23', end: '2024-12-26' } },
      '2025': { date: '2025-12-25', window: { start: '2025-12-23', end: '2025-12-26' } },
      '2026': { date: '2026-12-25', window: { start: '2026-12-23', end: '2026-12-26' }, cutoff: '2026-12-18' },
      '2027': { date: '2027-12-25', window: { start: '2027-12-23', end: '2027-12-26' }, cutoff: '2027-12-18' }
    },
    stockNeedList: [
      { name: 'Traditional Plum Cake 500g Box', unit: 'Box', price: 180, currentStock: 25, recommendedOrderQty: 220, estPurchaseBudget: 33660, priority: 'CRITICAL', qty2023: 160, qty2024: 190, qty2025: 210 },
      { name: 'Amul Butter 500g Pack', unit: 'Pack', price: 275, currentStock: 30, recommendedOrderQty: 140, estPurchaseBudget: 32725, priority: 'HIGH', qty2023: 95, qty2024: 120, qty2025: 135 },
      { name: 'Tutti Frutti Mix 200g Pouch', unit: 'Pouch', price: 45, currentStock: 40, recommendedOrderQty: 200, estPurchaseBudget: 7650, priority: 'NORMAL', qty2023: 140, qty2024: 170, qty2025: 190 }
    ]
  },

  // ==========================================
  // RECURRING MONTHLY SALARY CYCLE (ALL 12 MONTHS)
  // ==========================================
  {
    id: 'payday_cycle',
    name: 'Monthly Payday Grocery Cycle (1st–5th)',
    tamilName: 'மாத சம்பள மளிகை கொள்முதல் (1-5ம் தேதி)',
    fullName: 'Monthly Salary & Pension Provision Cycle',
    month: 0,
    monthName: 'Every Month',
    quarter: 'All',
    calendarRule: '1st to 5th day of every calendar month',
    tier: 'Recurring High',
    surgeMultiplier: 1.35,
    surgePercent: '+35%',
    tag: 'Monthly Salary & Pension Cycle',
    description: 'Bodinayakanur families make their primary monthly ration purchase. Heavy demand for 25kg Rice bags, 5L Oil cans, washing detergents, and monthly spices.',
    stockingAdvice: 'Keep warehouse bags of Rice and Oil easily accessible. Ready extra carry boxes for bulk shopping.',
    keyCategories: ['25kg Rice Bags', '5L Cooking Oil Cans', 'Toor Dal (5kg)', 'Detergents & Soaps (5kg)'],
    sampleSkus: [
      { name: '25Kg Sona Masoori Rice Bag', rate: 1450, mrp: 1600, surge: '+50%' },
      { name: '5Ltr Sunflower Oil Can', rate: 690, mrp: 750, surge: '+45%' },
      { name: '5Kg Surf Excel / Detergent', rate: 580, mrp: 625, surge: '+40%' }
    ],
    datesByYear: {
      '2023': { date: 'Monthly (1st-5th)' },
      '2024': { date: 'Monthly (1st-5th)' },
      '2025': { date: 'Monthly (1st-5th)' },
      '2026': { date: 'Monthly (1st-5th)', cutoff: '28th of every month' },
      '2027': { date: 'Monthly (1st-5th)', cutoff: '28th of every month' }
    },
    stockNeedList: [
      { name: '25Kg Sona Masoori Rice Bag', unit: 'Bag', price: 1450, currentStock: 35, recommendedOrderQty: 180, estPurchaseBudget: 221400, priority: 'CRITICAL', qty2023: 130, qty2024: 155, qty2025: 170 },
      { name: '5Ltr Gold Winner Sunflower Oil Can', unit: 'Can', price: 690, currentStock: 30, recommendedOrderQty: 160, estPurchaseBudget: 93840, priority: 'CRITICAL', qty2023: 115, qty2024: 140, qty2025: 155 },
      { name: 'Toor Dal Premium 5kg Pack', unit: 'Pack', price: 680, currentStock: 25, recommendedOrderQty: 130, estPurchaseBudget: 75140, priority: 'HIGH', qty2023: 95, qty2024: 115, qty2025: 125 }
    ]
  }
];

module.exports = {
  ALL_YEAR_FESTIVALS
};
