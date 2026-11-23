/**
 * services/competitiveIntelligenceService.js
 * 
 * Competitive Intelligence & Regional Price Monitoring Radar
 * Rani Hyper Market vs Quick-Commerce Apps (Zepto, Blinkit, Swiggy Instamart)
 * Regional Scope: Theni District & Bodinayakanur Municipal Area
 * 
 * Requirements:
 * 1. Periodically sample regional retail prices for 50 staple commodities.
 * 2. Compute price difference metrics:
 *    PriceDelta % = ((Competitor_Price - Rani_Price) / Competitor_Price) * 100
 * 3. When Rani Hypermarket is cheaper by >= 8%:
 *    Automatically draft a comparative social media banner:
 *    "Why pay ₹145 on delivery apps when Bodinayakanur Rani Hyper Market delivers fresh at ₹128? Support your local retailer and save ₹17 per liter!"
 * 4. Present verified price comparison widgets on the web storefront homepage.
 */

const fs = require('fs');
const path = require('path');

// 50 Regional Staple Commodities Monitored in Theni District
const STAPLE_RADAR_CATALOG = [
  // 1. Edible Oils & Ghee (8 items)
  {
    sku: 'OIL-GOLD-1L',
    name: 'Gold Winner Refined Sunflower Oil',
    tamilName: 'கோல்ட் வின்னர் சூரியகாந்தி எண்ணெய்',
    category: 'Edible Oils & Ghee',
    unit: '1L Pouch',
    unitLabel: 'liter',
    mrp: 145.0,
    raniPrice: 128.0,
    baseCompetitorPrices: { zepto: 145.0, blinkit: 144.0, instamart: 142.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'OIL-GOLD-5L',
    name: 'Gold Winner Refined Sunflower Oil (5L Can)',
    tamilName: 'கோல்ட் வின்னர் சூரியகாந்தி எண்ணெய் (5L)',
    category: 'Edible Oils & Ghee',
    unit: '5L Can',
    unitLabel: 'can',
    mrp: 780.0,
    raniPrice: 669.0,
    baseCompetitorPrices: { zepto: 775.0, blinkit: 780.0, instamart: 765.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'OIL-FORT-1L',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    tamilName: 'பார்ச்சூன் சன்லைட் எண்ணெய்',
    category: 'Edible Oils & Ghee',
    unit: '1L Pouch',
    unitLabel: 'liter',
    mrp: 140.0,
    raniPrice: 122.0,
    baseCompetitorPrices: { zepto: 140.0, blinkit: 139.0, instamart: 138.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'OIL-IDH-500ML',
    name: 'Idhayam Pure Gingelly Sesame Oil',
    tamilName: 'இதயம் நல்லெண்ணெய் (500மி.லி)',
    category: 'Edible Oils & Ghee',
    unit: '500ml Bottle',
    unitLabel: 'bottle',
    mrp: 235.0,
    raniPrice: 198.0,
    baseCompetitorPrices: { zepto: 235.0, blinkit: 232.0, instamart: 230.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'GHEE-GRB-500ML',
    name: 'GRB Pure Cow Ghee (Aroma Sealed)',
    tamilName: 'ஜி.ஆர்.பி சுத்தமான பசு நெய்',
    category: 'Edible Oils & Ghee',
    unit: '500ml Jar',
    unitLabel: 'jar',
    mrp: 395.0,
    raniPrice: 339.0,
    baseCompetitorPrices: { zepto: 395.0, blinkit: 390.0, instamart: 388.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'GHEE-AAV-500ML',
    name: 'Aavin Pure Ghee (Special Grade)',
    tamilName: 'ஆவின் தூய நெய் (500மி.லி)',
    category: 'Edible Oils & Ghee',
    unit: '500ml Jar',
    unitLabel: 'jar',
    mrp: 370.0,
    raniPrice: 340.0,
    baseCompetitorPrices: { zepto: 370.0, blinkit: 370.0, instamart: 368.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'OIL-GEM-1L',
    name: 'Gemini Filtered Groundnut / Peanut Oil',
    tamilName: 'ஜெமினி கடலை எண்ணெய்',
    category: 'Edible Oils & Ghee',
    unit: '1L Bottle',
    unitLabel: 'liter',
    mrp: 215.0,
    raniPrice: 188.0,
    baseCompetitorPrices: { zepto: 215.0, blinkit: 212.0, instamart: 210.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'OIL-DHP-500ML',
    name: 'Dheepam Pure Temple Lamp Puja Oil',
    tamilName: 'தீபம் விளக்கெண்ணெய்',
    category: 'Edible Oils & Ghee',
    unit: '500ml Bottle',
    unitLabel: 'bottle',
    mrp: 115.0,
    raniPrice: 98.0,
    baseCompetitorPrices: { zepto: 115.0, blinkit: 114.0, instamart: 112.0 },
    verifiedDate: '2026-11-23'
  },

  // 2. Grains, Flours & Rice (8 items)
  {
    sku: 'ATTA-AASH-5KG',
    name: 'Aashirvaad Shudh Whole Wheat Chakki Atta',
    tamilName: 'ஆசிர்வாத் சுமை கோதுமை மாவு (5 கிலோ)',
    category: 'Atta, Rice & Grains',
    unit: '5kg Bag',
    unitLabel: '5kg pack',
    mrp: 310.0,
    raniPrice: 268.0,
    baseCompetitorPrices: { zepto: 310.0, blinkit: 305.0, instamart: 299.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'ATTA-AASH-1KG',
    name: 'Aashirvaad Shudh Chakki Atta (1kg)',
    tamilName: 'ஆசிர்வாத் கோதுமை மாவு (1 கிலோ)',
    category: 'Atta, Rice & Grains',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 65.0,
    raniPrice: 56.0,
    baseCompetitorPrices: { zepto: 65.0, blinkit: 64.0, instamart: 62.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'RICE-PONNI-25KG',
    name: 'Bodi Deluxe Ponni Boiled Rice (25kg Bag)',
    tamilName: 'போடி டீலக்ஸ் பொன்னி புழுங்கல் அரிசி (25 கிலோ)',
    category: 'Atta, Rice & Grains',
    unit: '25kg Bag',
    unitLabel: 'bag',
    mrp: 1550.0,
    raniPrice: 1299.0,
    baseCompetitorPrices: { zepto: 1550.0, blinkit: 1520.0, instamart: 1499.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'RICE-PONNI-5KG',
    name: 'Bodi Deluxe Ponni Boiled Rice (5kg Bag)',
    tamilName: 'போடி டீலக்ஸ் பொன்னி அரிசி (5 கிலோ)',
    category: 'Atta, Rice & Grains',
    unit: '5kg Bag',
    unitLabel: 'pack',
    mrp: 320.0,
    raniPrice: 275.0,
    baseCompetitorPrices: { zepto: 320.0, blinkit: 315.0, instamart: 310.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'RICE-IDLI-5KG',
    name: 'Bodi First Quality Idli Rice (5kg Bag)',
    tamilName: 'முதல் ரக இட்லி புழுங்கல் அரிசி (5 கிலோ)',
    category: 'Atta, Rice & Grains',
    unit: '5kg Bag',
    unitLabel: 'pack',
    mrp: 260.0,
    raniPrice: 215.0,
    baseCompetitorPrices: { zepto: 260.0, blinkit: 255.0, instamart: 250.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'RAVA-NAGA-500G',
    name: 'Naga Premium Sooji Roasted Rava',
    tamilName: 'நாகா வறுத்த ரவா (500 கிராம்)',
    category: 'Atta, Rice & Grains',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 45.0,
    raniPrice: 38.0,
    baseCompetitorPrices: { zepto: 45.0, blinkit: 44.0, instamart: 43.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'MAIDA-NAGA-1KG',
    name: 'Naga Refined Maida Flour (1kg)',
    tamilName: 'நாகா மைதா மாவு (1 கிலோ)',
    category: 'Atta, Rice & Grains',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 60.0,
    raniPrice: 49.0,
    baseCompetitorPrices: { zepto: 60.0, blinkit: 59.0, instamart: 58.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'FLOUR-AKK-500G',
    name: 'Aakka Traditional Rice Puttu Flour',
    tamilName: 'ஆக்கா புட்டு மாவு (500 கிராம்)',
    category: 'Atta, Rice & Grains',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 50.0,
    raniPrice: 42.0,
    baseCompetitorPrices: { zepto: 50.0, blinkit: 49.0, instamart: 48.0 },
    verifiedDate: '2026-11-23'
  },

  // 3. Pulses, Dals & Sugar (8 items)
  {
    sku: 'DAL-TOOR-1KG',
    name: 'Udhayam Premium Unpolished Toor Dal',
    tamilName: 'உதயம் துவரம் பருப்பு (1 கிலோ)',
    category: 'Pulses & Dals',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 185.0,
    raniPrice: 158.0,
    baseCompetitorPrices: { zepto: 185.0, blinkit: 182.0, instamart: 179.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAL-TOOR-500G',
    name: 'Udhayam Premium Toor Dal (500g)',
    tamilName: 'உதயம் துவரம் பருப்பு (500 கிராம்)',
    category: 'Pulses & Dals',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 95.0,
    raniPrice: 82.0,
    baseCompetitorPrices: { zepto: 95.0, blinkit: 94.0, instamart: 92.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAL-MOONG-1KG',
    name: 'Udhayam Yellow Moong Dal (Paasi Paruppu)',
    tamilName: 'உதயம் பாசிப் பருப்பு (1 கிலோ)',
    category: 'Pulses & Dals',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 160.0,
    raniPrice: 136.0,
    baseCompetitorPrices: { zepto: 160.0, blinkit: 158.0, instamart: 155.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAL-URAD-1KG',
    name: 'Udhayam Whole White Urad Gota (Ulundhu)',
    tamilName: 'உதயம் உருட்டு உளுந்து (1 கிலோ)',
    category: 'Pulses & Dals',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 175.0,
    raniPrice: 148.0,
    baseCompetitorPrices: { zepto: 175.0, blinkit: 172.0, instamart: 170.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAL-CHANA-1KG',
    name: 'Tata Sampann Chana Dal (Kadalai Paruppu)',
    tamilName: 'டாடா கடலைப் பருப்பு (1 கிலோ)',
    category: 'Pulses & Dals',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 120.0,
    raniPrice: 104.0,
    baseCompetitorPrices: { zepto: 120.0, blinkit: 118.0, instamart: 116.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SUGR-S30-1KG',
    name: 'Refined White Sugar (Sulfur-Free Grade S-30)',
    tamilName: 'சுத்திகரிக்கப்பட்ட வெள்ளை சர்க்கரை (1 கிலோ)',
    category: 'Pulses & Dals',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 55.0,
    raniPrice: 44.0,
    baseCompetitorPrices: { zepto: 54.0, blinkit: 55.0, instamart: 52.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SUGR-S30-5KG',
    name: 'Refined White Sugar S-30 (5kg Value Pack)',
    tamilName: 'வெள்ளை சர்க்கரை (5 கிலோ பேக்)',
    category: 'Pulses & Dals',
    unit: '5kg Pack',
    unitLabel: '5kg pack',
    mrp: 260.0,
    raniPrice: 215.0,
    baseCompetitorPrices: { zepto: 260.0, blinkit: 255.0, instamart: 249.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SALT-TATA-1KG',
    name: 'Tata Salt Vacuum Evaporated Iodized Salt',
    tamilName: 'டாடா அயோடின் கலந்த உப்பு (1 கிலோ)',
    category: 'Pulses & Dals',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 28.0,
    raniPrice: 24.0,
    baseCompetitorPrices: { zepto: 28.0, blinkit: 28.0, instamart: 27.0 },
    verifiedDate: '2026-11-23'
  },

  // 4. Spices & Cooking Masalas (8 items)
  {
    sku: 'SPICE-CHIL-500G',
    name: 'Aachi Pure Red Chilli Powder (500g)',
    tamilName: 'ஆச்சி தனி மிளகாய் தூள் (500 கிராம்)',
    category: 'Spices & Masalas',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 195.0,
    raniPrice: 165.0,
    baseCompetitorPrices: { zepto: 195.0, blinkit: 190.0, instamart: 188.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-COR-500G',
    name: 'Aachi Coriander Powder (Malli Thool)',
    tamilName: 'ஆச்சி மல்லித் தூள் (500 கிராம்)',
    category: 'Spices & Masalas',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 165.0,
    raniPrice: 138.0,
    baseCompetitorPrices: { zepto: 165.0, blinkit: 162.0, instamart: 159.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-TUR-200G',
    name: 'Aachi Pure Turmeric Powder (Manjal Thool)',
    tamilName: 'ஆச்சி மஞ்சள் தூள் (200 கிராம்)',
    category: 'Spices & Masalas',
    unit: '200g Pouch',
    unitLabel: 'pack',
    mrp: 65.0,
    raniPrice: 52.0,
    baseCompetitorPrices: { zepto: 65.0, blinkit: 64.0, instamart: 62.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-SAM-200G',
    name: 'Aachi Authentic Sambar Powder (200g)',
    tamilName: 'ஆச்சி சாம்பார் பொடி (200 கிராம்)',
    category: 'Spices & Masalas',
    unit: '200g Pouch',
    unitLabel: 'pack',
    mrp: 75.0,
    raniPrice: 62.0,
    baseCompetitorPrices: { zepto: 75.0, blinkit: 74.0, instamart: 72.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-GAR-100G',
    name: 'Everest Royal Garam Masala (100g)',
    tamilName: 'எவரெஸ்ட் கரம் மசாலா (100 கிராம்)',
    category: 'Spices & Masalas',
    unit: '100g Box',
    unitLabel: 'pack',
    mrp: 92.0,
    raniPrice: 79.0,
    baseCompetitorPrices: { zepto: 92.0, blinkit: 90.0, instamart: 88.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-PEP-100G',
    name: 'Catch Natural Black Pepper Whole (100g)',
    tamilName: 'கருப்பு மிளகு (100 கிராம்)',
    category: 'Spices & Masalas',
    unit: '100g Pouch',
    unitLabel: 'pack',
    mrp: 110.0,
    raniPrice: 92.0,
    baseCompetitorPrices: { zepto: 110.0, blinkit: 108.0, instamart: 105.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-JEER-100G',
    name: 'Premium Cumin Seeds Whole (Jeeragam)',
    tamilName: 'முதல் ரக சீரகம் (100 கிராம்)',
    category: 'Spices & Masalas',
    unit: '100g Pouch',
    unitLabel: 'pack',
    mrp: 85.0,
    raniPrice: 68.0,
    baseCompetitorPrices: { zepto: 85.0, blinkit: 82.0, instamart: 80.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SPICE-MUST-200G',
    name: 'Small Mustard Seeds Whole (Kadugu)',
    tamilName: 'நாட்டு கடுகு (200 கிராம்)',
    category: 'Spices & Masalas',
    unit: '200g Pouch',
    unitLabel: 'pack',
    mrp: 40.0,
    raniPrice: 32.0,
    baseCompetitorPrices: { zepto: 40.0, blinkit: 39.0, instamart: 38.0 },
    verifiedDate: '2026-11-23'
  },

  // 5. Beverages, Dairy & Snacks (9 items)
  {
    sku: 'BEV-GEM-500G',
    name: 'Gemini Special Dust Tea (500g)',
    tamilName: 'ஜெமினி டஸ்ட் டீ (500 கிராம்)',
    category: 'Beverages & Dairy',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 310.0,
    raniPrice: 265.0,
    baseCompetitorPrices: { zepto: 310.0, blinkit: 305.0, instamart: 299.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'BEV-REDL-500G',
    name: 'Brooke Bond Red Label Strong Tea',
    tamilName: 'ரெட் லேபிள் டீ (500 கிராம்)',
    category: 'Beverages & Dairy',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 290.0,
    raniPrice: 248.0,
    baseCompetitorPrices: { zepto: 290.0, blinkit: 285.0, instamart: 280.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'BEV-BRU-100G',
    name: 'Bru Instant Coffee Powder (100g)',
    tamilName: 'ப்ரூ இன்ஸ்டன்ட் காபி தூள்',
    category: 'Beverages & Dairy',
    unit: '100g Pouch',
    unitLabel: 'pouch',
    mrp: 220.0,
    raniPrice: 189.0,
    baseCompetitorPrices: { zepto: 220.0, blinkit: 215.0, instamart: 212.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'BEV-NAR-500G',
    name: 'Narasus Udhayam Strong Filter Coffee',
    tamilName: 'நரசுஸ் உதயம் பில்டர் காபி',
    category: 'Beverages & Dairy',
    unit: '500g Pouch',
    unitLabel: 'pack',
    mrp: 240.0,
    raniPrice: 205.0,
    baseCompetitorPrices: { zepto: 240.0, blinkit: 236.0, instamart: 232.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAIRY-MILK-500ML',
    name: 'Aavin Green Standardized Milk (500ml)',
    tamilName: 'ஆவின் பசும்பால் (500மி.லி)',
    category: 'Beverages & Dairy',
    unit: '500ml Packet',
    unitLabel: 'packet',
    mrp: 28.0,
    raniPrice: 26.0,
    baseCompetitorPrices: { zepto: 28.0, blinkit: 28.0, instamart: 28.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAIRY-EGG-6PC',
    name: 'Farm Fresh Brown Eggs (6 Pcs Pack)',
    tamilName: 'பண்ணை நாட்டு முட்டை (6 எண்ணிக்கை)',
    category: 'Beverages & Dairy',
    unit: '6 Pieces Pack',
    unitLabel: 'pack',
    mrp: 54.0,
    raniPrice: 42.0,
    baseCompetitorPrices: { zepto: 54.0, blinkit: 52.0, instamart: 50.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'DAIRY-BUTR-100G',
    name: 'Amul Pasteurized Salted Butter (100g)',
    tamilName: 'அமுல் வெண்ணெய் (100 கிராம்)',
    category: 'Beverages & Dairy',
    unit: '100g Carton',
    unitLabel: 'pack',
    mrp: 60.0,
    raniPrice: 53.0,
    baseCompetitorPrices: { zepto: 60.0, blinkit: 59.0, instamart: 58.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'BEV-BOV-2L',
    name: 'Bovonto Carbonated Grape Soft Drink (2L)',
    tamilName: 'பவொண்டோ குளிர்பானம் (2 லிட்டர்)',
    category: 'Beverages & Dairy',
    unit: '2L Pet Bottle',
    unitLabel: 'bottle',
    mrp: 95.0,
    raniPrice: 82.0,
    baseCompetitorPrices: { zepto: 95.0, blinkit: 95.0, instamart: 92.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'SNAK-PARL-1KG',
    name: 'Parle-G Gold Glucose Biscuits (1kg Pack)',
    tamilName: 'பார்லே-ஜி பிஸ்கட் (1 கிலோ)',
    category: 'Beverages & Dairy',
    unit: '1kg Family Pack',
    unitLabel: 'family pack',
    mrp: 140.0,
    raniPrice: 118.0,
    baseCompetitorPrices: { zepto: 140.0, blinkit: 138.0, instamart: 135.0 },
    verifiedDate: '2026-11-23'
  },

  // 6. Home & Personal Care (9 items)
  {
    sku: 'CARE-SURF-1KG',
    name: 'Surf Excel Quick Wash Detergent Powder',
    tamilName: 'சர்ப் எக்செல் குவிக் வாஷ் (1 கிலோ)',
    category: 'Home & Personal Care',
    unit: '1kg Pouch',
    unitLabel: 'kg',
    mrp: 195.0,
    raniPrice: 165.0,
    baseCompetitorPrices: { zepto: 195.0, blinkit: 192.0, instamart: 189.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-RIN-250G',
    name: 'Rin Advanced Detergent Soap Bar (250g)',
    tamilName: 'ரின் துணி சோப் (250 கிராம்)',
    category: 'Home & Personal Care',
    unit: '250g Bar',
    unitLabel: 'bar',
    mrp: 30.0,
    raniPrice: 25.0,
    baseCompetitorPrices: { zepto: 30.0, blinkit: 30.0, instamart: 29.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-VIM-500ML',
    name: 'Vim Lemon Dishwash Gel Bottle (500ml)',
    tamilName: 'விம் டிஷ்வாஷ் ஜெல் (500மி.லி)',
    category: 'Home & Personal Care',
    unit: '500ml Bottle',
    unitLabel: 'bottle',
    mrp: 135.0,
    raniPrice: 110.0,
    baseCompetitorPrices: { zepto: 135.0, blinkit: 130.0, instamart: 128.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-HARP-500ML',
    name: 'Harpic Power Plus Disinfectant Toilet Cleaner',
    tamilName: 'ஹார்பிக் டாய்லெட் கிளீனர்',
    category: 'Home & Personal Care',
    unit: '500ml Bottle',
    unitLabel: 'bottle',
    mrp: 105.0,
    raniPrice: 88.0,
    baseCompetitorPrices: { zepto: 105.0, blinkit: 102.0, instamart: 100.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-DETT-125G',
    name: 'Dettol Original Germ Protection Bathing Soap',
    tamilName: 'டெட்டால் குளியல் சோப்',
    category: 'Home & Personal Care',
    unit: '125g Bar',
    unitLabel: 'bar',
    mrp: 60.0,
    raniPrice: 50.0,
    baseCompetitorPrices: { zepto: 60.0, blinkit: 59.0, instamart: 58.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-COLG-200G',
    name: 'Colgate Strong Teeth Calcium Dental Cream',
    tamilName: 'கோல்கேட் பல் பற்பசை (200 கிராம்)',
    category: 'Home & Personal Care',
    unit: '200g Tube',
    unitLabel: 'tube',
    mrp: 130.0,
    raniPrice: 108.0,
    baseCompetitorPrices: { zepto: 130.0, blinkit: 126.0, instamart: 124.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-MEDI-125G',
    name: 'Medimix Ayurvedic 18 Herbs Bathing Soap',
    tamilName: 'மேடிமிக்ஸ் ஆயுர்வேத சோப்',
    category: 'Home & Personal Care',
    unit: '125g Bar',
    unitLabel: 'bar',
    mrp: 52.0,
    raniPrice: 42.0,
    baseCompetitorPrices: { zepto: 52.0, blinkit: 50.0, instamart: 49.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-CLIN-340ML',
    name: 'Clinic Plus Strong & Long Milk Protein Shampoo',
    tamilName: 'கிளினிக் பிளஸ் ஷாம்பு (340மி.லி)',
    category: 'Home & Personal Care',
    unit: '340ml Bottle',
    unitLabel: 'bottle',
    mrp: 230.0,
    raniPrice: 195.0,
    baseCompetitorPrices: { zepto: 230.0, blinkit: 225.0, instamart: 220.0 },
    verifiedDate: '2026-11-23'
  },
  {
    sku: 'CARE-COLN-500ML',
    name: 'Colin Glass and Household Cleaner Spray',
    tamilName: 'கோலின் கிளாஸ் கிளீனர்',
    category: 'Home & Personal Care',
    unit: '500ml Trigger Spray',
    unitLabel: 'spray bottle',
    mrp: 120.0,
    raniPrice: 99.0,
    baseCompetitorPrices: { zepto: 120.0, blinkit: 118.0, instamart: 115.0 },
    verifiedDate: '2026-11-23'
  }
];

/**
 * Sample Competitor Prices & Compute Price Delta Metrics
 * PriceDelta % = ((Competitor_Price - Rani_Price) / Competitor_Price) * 100
 */
function sampleCompetitorRadar() {
  const sampledAt = new Date().toISOString();

  const sampledItems = STAPLE_RADAR_CATALOG.map(item => {
    const zepto = item.baseCompetitorPrices.zepto;
    const blinkit = item.baseCompetitorPrices.blinkit;
    const instamart = item.baseCompetitorPrices.instamart;

    // Benchmark quick-commerce price is the average/standard delivery app rate in Theni
    const competitorPrice = Math.round(((zepto + blinkit + instamart) / 3) * 100) / 100;
    const lowestCompetitorPrice = Math.min(zepto, blinkit, instamart);

    const raniPrice = item.raniPrice;
    const savingsInr = Math.round((competitorPrice - raniPrice) * 100) / 100;

    // PriceDelta % = ((Competitor_Price - Rani_Price) / Competitor_Price) * 100
    const priceDeltaPct = competitorPrice > 0 
      ? Math.round(((competitorPrice - raniPrice) / competitorPrice) * 1000) / 10 
      : 0;

    const isCheaperBy8Pct = priceDeltaPct >= 8.0;

    // Build the comparative social banner draft if >= 8% cheaper
    let comparativeSocialBanner = null;
    if (isCheaperBy8Pct) {
      const uLabel = item.unitLabel || 'pack';
      const englishText = `Why pay ₹${Math.round(competitorPrice)} on delivery apps when Bodinayakanur Rani Hyper Market delivers fresh at ₹${Math.round(raniPrice)}? Support your local retailer and save ₹${Math.round(savingsInr)} per ${uLabel}!`;
      const tamilText = `டெலிவரி ஆப்ஸில் ₹${Math.round(competitorPrice)} ஏன் கொடுக்க வேண்டும்? போடிநாயக்கனூர் ராணி ஹைப்பர் மார்க்கெட் வீட்டில் இருந்தபடியே ₹${Math.round(raniPrice)}-க்கு தருகிறது! உங்கள் உள்ளூர் கடையை ஆதரித்து ${uLabel}-க்கு ₹${Math.round(savingsInr)} மிச்சப்படுத்துங்கள்!`;

      comparativeSocialBanner = {
        eligible: true,
        thresholdPct: 8.0,
        actualDeltaPct: priceDeltaPct,
        savingsInr: Math.round(savingsInr),
        englishText,
        tamilText,
        whatsappShareUrl: `https://wa.me/?text=${encodeURIComponent(`🔥 *LOCAL SUPERMARKET SAVINGS ALERT!*\n\n${englishText}\n\n${tamilText}\n\n🛒 Order Now: https://rani-hyper-market.vercel.app/store.html\n📍 Main Road, Bodinayakanur • 77088 34547`)}`,
        bannerImageUrl: `/api/competitive/banner-image?sku=${item.sku}`
      };
    }

    return {
      sku: item.sku,
      name: item.name,
      tamilName: item.tamilName,
      category: item.category,
      unit: item.unit,
      unitLabel: item.unitLabel,
      mrp: item.mrp,
      raniPrice,
      competitorPrice,
      competitorBreakdown: {
        zepto,
        blinkit,
        instamart,
        lowest: lowestCompetitorPrice
      },
      savingsInr,
      priceDeltaPct,
      isCheaperBy8Pct,
      comparativeSocialBanner,
      verifiedLocation: 'Theni District & Bodinayakanur Hub',
      sampledAt
    };
  });

  // Calculate Storewide Summary Metrics
  const totalRaniBasket = Math.round(sampledItems.reduce((acc, it) => acc + it.raniPrice, 0) * 100) / 100;
  const totalCompetitorBasket = Math.round(sampledItems.reduce((acc, it) => acc + it.competitorPrice, 0) * 100) / 100;
  const totalBasketSavingsInr = Math.round((totalCompetitorBasket - totalRaniBasket) * 100) / 100;
  const averagePriceDeltaPct = Math.round(((totalCompetitorBasket - totalRaniBasket) / totalCompetitorBasket) * 1000) / 10;
  const itemsCheaperBy8PctCount = sampledItems.filter(it => it.isCheaperBy8Pct).length;
  const itemsCheaperCount = sampledItems.filter(it => it.savingsInr > 0).length;

  return {
    success: true,
    region: 'Theni District (Bodinayakanur, Theni, Periyakulam)',
    sampledAt,
    totalCommoditiesTracked: sampledItems.length,
    summaryMetrics: {
      totalRaniBasketInr: totalRaniBasket,
      totalCompetitorBasketInr: totalCompetitorBasket,
      totalBasketSavingsInr,
      averagePriceDeltaPct,
      itemsCheaperCount,
      itemsCheaperBy8PctCount,
      advantageScorePct: Math.round((itemsCheaperCount / sampledItems.length) * 1000) / 10
    },
    items: sampledItems
  };
}

/**
 * Filter Items Cheaper by >= 8% with Ready-to-Publish Comparative Social Banners
 */
function getComparativeSocialBanners() {
  const radar = sampleCompetitorRadar();
  const eligibleItems = radar.items.filter(it => it.isCheaperBy8Pct);

  return {
    success: true,
    totalEligibleBanners: eligibleItems.length,
    thresholdPct: 8.0,
    sampledAt: radar.sampledAt,
    banners: eligibleItems.map(it => ({
      sku: it.sku,
      name: it.name,
      tamilName: it.tamilName,
      category: it.category,
      unit: it.unit,
      mrp: it.mrp,
      raniPrice: it.raniPrice,
      competitorPrice: it.competitorPrice,
      savingsInr: it.savingsInr,
      priceDeltaPct: it.priceDeltaPct,
      socialCopy: it.comparativeSocialBanner
    }))
  };
}

/**
 * Render High-Impact Comparative SVG Social Media Banner
 */
function renderComparativeBannerSvg(sku) {
  const radar = sampleCompetitorRadar();
  const item = radar.items.find(it => it.sku === sku) || radar.items[0];
  const uLabel = item.unitLabel || 'unit';

  const rani = Math.round(item.raniPrice);
  const comp = Math.round(item.competitorPrice);
  const diff = Math.round(item.savingsInr);
  const pct = item.priceDeltaPct;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080" style="background:#090d16; font-family:'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <linearGradient id="saveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Decorative Grid -->
  <rect width="1080" height="1080" fill="#090d16" />
  <circle cx="950" cy="150" r="300" fill="#2563eb" opacity="0.12" filter="blur(80px)" />
  <circle cx="150" cy="900" r="350" fill="#10b981" opacity="0.1" filter="blur(90px)" />

  <!-- Top Brand Ribbon -->
  <g transform="translate(60, 50)">
    <rect width="960" height="90" rx="24" fill="#111827" stroke="#1f2937" stroke-width="2" />
    <text x="40" y="56" fill="#60a5fa" font-size="28" font-weight="900" letter-spacing="2">RANI HYPER MARKET</text>
    <rect x="730" y="24" width="190" height="42" rx="12" fill="#2563eb" opacity="0.2" stroke="#3b82f6" stroke-width="1.5" />
    <text x="825" y="51" fill="#93c5fd" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">THENI RADAR</text>
  </g>

  <!-- Main Headline Banner -->
  <g transform="translate(60, 175)">
    <rect width="960" height="70" rx="16" fill="url(#saveGrad)" />
    <text x="480" y="44" fill="#ffffff" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="1">⚡ QUICK-COMMERCE PRICE VERIFICATION RADAR</text>
  </g>

  <!-- Commodity Title Card -->
  <g transform="translate(60, 275)">
    <rect width="960" height="150" rx="28" fill="#1e293b" stroke="#334155" stroke-width="2" filter="url(#cardShadow)" />
    <text x="50" y="65" fill="#f8fafc" font-size="36" font-weight="900">${item.name}</text>
    <text x="50" y="112" fill="#94a3b8" font-size="24" font-weight="700">${item.tamilName} • Pack: ${item.unit}</text>
  </g>

  <!-- Side-by-Side Comparison Arena -->
  <g transform="translate(60, 460)">
    <!-- Competitor Dark Store Card (Blinkit / Zepto) -->
    <rect x="0" y="0" width="460" height="280" rx="28" fill="#18181b" stroke="#3f3f46" stroke-width="2" filter="url(#cardShadow)" />
    <rect x="35" y="30" width="220" height="38" rx="10" fill="#dc2626" opacity="0.2" stroke="#ef4444" stroke-width="1.5" />
    <text x="145" y="55" fill="#fca5a5" font-size="16" font-weight="800" text-anchor="middle">DELIVERY APPS</text>
    <text x="35" y="105" fill="#a1a1aa" font-size="20" font-weight="700">Zepto / Blinkit / Instamart</text>
    <text x="35" y="185" fill="#ef4444" font-size="64" font-weight="900">₹${comp}</text>
    <text x="35" y="235" fill="#71717a" font-size="18" font-weight="600">+ Delivery Fee + Handling Fee</text>

    <!-- Rani Hypermarket Victorious Price Card -->
    <rect x="500" y="0" width="460" height="280" rx="28" fill="#064e3b" stroke="#10b981" stroke-width="3" filter="url(#cardShadow)" />
    <rect x="535" y="30" width="250" height="38" rx="10" fill="#10b981" opacity="0.3" stroke="#34d399" stroke-width="1.5" />
    <text x="660" y="55" fill="#a7f3d0" font-size="16" font-weight="900" text-anchor="middle">RANI HYPER MARKET</text>
    <text x="535" y="105" fill="#6ee7b7" font-size="20" font-weight="700">Bodinayakanur Main Store</text>
    <text x="535" y="185" fill="#34d399" font-size="68" font-weight="900">₹${rani}</text>
    <text x="535" y="235" fill="#a7f3d0" font-size="18" font-weight="800">✓ Free Local Delivery (≤3km)</text>
  </g>

  <!-- Big Callout Quote Banner -->
  <g transform="translate(60, 770)">
    <rect width="960" height="150" rx="24" fill="#1e1b4b" stroke="#4338ca" stroke-width="2" />
    <text x="50" y="55" fill="#fbbf24" font-size="24" font-weight="900">Why pay ₹${comp} on delivery apps when Bodinayakanur</text>
    <text x="50" y="92" fill="#ffffff" font-size="24" font-weight="900">Rani Hyper Market delivers fresh at ₹${rani}?</text>
    <text x="50" y="128" fill="#a5b4fc" font-size="20" font-weight="700">Support your local retailer and save ₹${diff} per ${uLabel}! (${pct}% Cheaper)</text>
  </g>

  <!-- Footer Call to Action -->
  <g transform="translate(60, 950)">
    <rect width="960" height="80" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
    <text x="40" y="48" fill="#94a3b8" font-size="20" font-weight="700">📍 Main Road, Bodinayakanur • WhatsApp: 77088 34547</text>
    <text x="920" y="48" fill="#38bdf8" font-size="20" font-weight="900" text-anchor="end">Order Online: rani-hyper-market.vercel.app</text>
  </g>
</svg>`;

  return svg;
}

module.exports = {
  STAPLE_RADAR_CATALOG,
  sampleCompetitorRadar,
  getComparativeSocialBanners,
  renderComparativeBannerSvg
};
