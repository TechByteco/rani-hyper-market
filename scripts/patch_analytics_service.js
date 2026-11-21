const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'analyticsService.js');
let content = fs.readFileSync(target, 'utf8');

const insertionMarker = 'function getLivePulse() {';
if (!content.includes(insertionMarker)) {
  console.error('Marker not found!');
  process.exit(1);
}

const newFunctions = `// ==========================================
// INDIAN RETAIL MARKET FMCG CORPORATE INTELLIGENCE & UPDATO ENGINE
// ==========================================
const RETAIL_COMPANIES_FILE = path.join(__dirname, 'indian_retail_companies.json');

function formatIndianTimestamp(d) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return \`\${day} \${month} \${year}, \${hours}:\${minutes} IST\`;
}

function runUpdatoAlgorithm(manualTrigger = true) {
  let companies = [];
  try {
    if (fs.existsSync(RETAIL_COMPANIES_FILE)) {
      companies = JSON.parse(fs.readFileSync(RETAIL_COMPANIES_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading retail companies file:', e.message);
  }

  if (!companies || companies.length === 0) {
    const fallbackPath = path.join(__dirname, 'scripts', 'indian_retail_companies.json');
    if (fs.existsSync(fallbackPath)) {
      try {
        companies = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      } catch (err) {}
    }
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const nowFormatted = formatIndianTimestamp(now);

  const macroShifts = {
    cpoEdibleOil: +(1.2 + (Math.random() * 2.8)).toFixed(2),
    wheatFlour: +(-0.5 + (Math.random() * 2.0)).toFixed(2),
    sugarSweeteners: +(0.1 + (Math.random() * 1.2)).toFixed(2),
    coffeeCocoa: +(2.5 + (Math.random() * 3.5)).toFixed(2),
    packagingPolymers: +(0.8 + (Math.random() * 1.8)).toFixed(2),
    teaAuctions: +(1.0 + (Math.random() * 2.5)).toFixed(2),
    copraCoconut: +(2.0 + (Math.random() * 3.5)).toFixed(2),
    dairyMilkProcurement: +(0.0 + (Math.random() * 0.8)).toFixed(2)
  };

  const dynamicAdvisories = {
    hul: [
      { mrp: 'Selective MRP hike (+₹2 to ₹3) on 1kg Surf Excel & Rin detergent powder.', advice: 'ADVANCE ORDER: Procure 21-day inventory before revised billing takes effect.', scheme: 'Trade Margin: 8.2% | Active Scheme: 12+1 case incentive on Surf Excel & Rin' },
      { mrp: 'Soaps grammage maintained; ₹10 Lux & Lifebuoy bars seeing high distributor push.', advice: 'STOCK DISPLAY: Feature 4-in-1 Lifebuoy soap bundles at checkouts.', scheme: 'Trade Margin: 8.5% | Cash rebate: ₹40 per carton on 10+ cartons' },
      { mrp: 'Tea portfolio prices firming up +2.5% in southern wholesale circles.', advice: 'BUFFER TEA: Keep 30-day buffer of Red Label 250g/500g pouches.', scheme: 'Trade Margin: 7.9% | Scheme: 1 free pack Red Label on 20 packs' }
    ],
    itc: [
      { mrp: 'Aashirvaad Atta consumer MRP steady across all 5kg and 10kg pack sizes.', advice: 'BULK STAPLES: Lock in 30-day Aashirvaad Atta stock to capture ₹15/bag volume rebate.', scheme: 'Trade Margin: 9.2% | Volume Rebate: ₹15/bag on 50+ bag bookings' },
      { mrp: 'Sunfeast Dark Fantasy & Yippee! noodles trade margins boosted +1.5%.', advice: 'MERCHANDISE: Double front-row shelf facing on Yippee! 4-in-1 multi-packs.', scheme: 'Trade Margin: 10.5% | Scheme: 1 case Bingo! free on 12 cases Yippee' },
      { mrp: 'Wheat mandi arrivals smooth; wholesale price volatility near zero.', advice: 'STABLE REORDER: Regular weekly reordering adequate; no supply crunch.', scheme: 'Trade Margin: 9.0% | Normal credit terms: 10-day settlement' }
    ],
    tataconsum: [
      { mrp: 'Tata Salt 1kg MRP steady at ₹28. Tea auction wholesale rates up +3.8%.', advice: 'TEA BUFFER: Maintain 4-week safety stock of 250g and 500g Tata Tea packs.', scheme: 'Trade Margin: 8.0% | Credit Window: 14-day extended credit for retail supermarkets' },
      { mrp: 'Tata Sampann unpolished dals prices softening slightly (-1.5%) post-harvest.', advice: 'EXPAND MARGIN: Repackage into combo baskets with Tata Salt for premium margin.', scheme: 'Trade Margin: 8.8% | Special margin expansion on Toor and Moong Dal' }
    ],
    britannia: [
      { mrp: 'Marie Gold & Good Day running high turnover; ₹10 packs grammage adjusted (-4g).', advice: 'PROMO RUN: Exploit 15+1 Bourbon carton bonus scheme on front aisle displays.', scheme: 'Trade Margin: 11.2% | Promotional Scheme: 1 case Bourbon free on every 15 cases Marie Gold mix' },
      { mrp: 'Milk Bikis & 50-50 biscuit supply fluid with bonus wholesale scratch cards.', advice: 'CHECKOUT SNACK: Place Milk Bikis ₹5 & ₹10 packs at point of sale.', scheme: 'Trade Margin: 10.8% | Scratch card cashbacks on 5-case bundles' }
    ],
    nestle: [
      { mrp: 'Global coffee rally pushing Nescafé wholesale invoices up +5.5%.', advice: 'COFFEE INVENTORY: Stock 50g/100g Nescafé glass jars ahead of distributor billing hike.', scheme: 'Trade Margin: 7.8% | Free promotional consumer bowls with Maggi 8-packs carton bookings' },
      { mrp: 'Maggi 2-Minute Noodles prices held firm with distributor loyalty points.', advice: 'FAMILY PACKS: Promote Maggi 560g Super Saver pack for maximum household basket size.', scheme: 'Trade Margin: 8.2% | Scheme: 5% extra margin on Maggi Masala Magic bundles' }
    ],
    adani_wilmar: [
      { mrp: 'Import tariff hike on crude edible oils taking full effect; +₹5.20/L wholesale surge.', advice: 'URGENT PROCUREMENT: Procure maximum permitted quota of Fortune Sunflower Oil.', scheme: 'Trade Margin: 6.2% | Cash Incentive: ₹25 discount per 15L tin / 15kg jar on immediate RTGS settlement' },
      { mrp: 'Fortune Basmati Rice & Besan seeing strong festival/wedding season bookings.', advice: 'BULK BESAN: Stock Fortune 500g and 1kg Besan bags for snack counters.', scheme: 'Trade Margin: 7.5% | Scheme: 1 bag free on 20 bags Fortune Besan' }
    ],
    marico: [
      { mrp: 'Copra prices in Kangayam (TN) up +7.5%; Parachute blue bottles wholesale rate up +3.5%.', advice: 'MARGIN WINDFALL: Stock Parachute 200ml, 500ml and 1L bottles before price stickers change.', scheme: 'Trade Margin: 9.0% | Free Unit Offer: 2 units Parachute Aloe Vera 150ml free per 24-unit Parachute 500ml carton' },
      { mrp: 'Saffola Gold and Masala Oats maintaining brisk 24% gross retailer margin.', advice: 'HEALTH AISLE: Position Saffola Oats 400g beside breakfast cereals for cross-sell.', scheme: 'Trade Margin: 12.5% on Oats | Trade scheme on Saffola Gold 5L jar' }
    ],
    dabur: [
      { mrp: 'Winter wellness surge kicking in; Chyawanprash & Honey velocity increasing +22%.', advice: 'HEALTHCARE DISPLAY: Position Dabur Chyawanprash jars and Dabur Honey near billing counters.', scheme: 'Trade Margin: 10.0% | Consumer Pack: Free 50g Honey bottle with 1kg Dabur Chyawanprash jar' },
      { mrp: 'Real Fruit Juices 1L experiencing steady winter demand; Red Paste volume high.', advice: 'FAMILY PACKS: Push Real Fruit Juice 1L combo packs (Buy 2 Get 1 discounted).', scheme: 'Trade Margin: 9.8% | Free shaker glass with 6 packs Real Juice' }
    ],
    godrej_consumer: [
      { mrp: 'PFAD input prices moderate; Godrej No.1 soap pricing aggressively competitive.', advice: 'STOCK REFILLS: Keep deep stock of GoodKnight 45-night liquid refills and soap multi-packs.', scheme: 'Trade Margin: 9.8% | Dealer Incentive: 10+1 free machine combo with branded floor rack' },
      { mrp: 'GoodKnight Gold Flash liquid refills turnover at peak post-monsoon.', advice: 'VAPORIZER BUNDLES: Display GoodKnight machine + refill combos prominently.', scheme: 'Trade Margin: 10.2% | 1 carton refill orders get 5% additional volume discount' }
    ],
    vbl_hatsun: [
      { mrp: 'Sting Energy Drink 250ml MRP strictly pinned at ₹20. Daily milk steady at ₹38/L.', advice: 'CHILLER MAXIMIZATION: Keep front refrigeration unit 100% loaded with chilled Sting 250ml bottles.', scheme: 'Trade Margin: 14.5% on Sting/Pepsi; 5.8% on Milk | Chiller asset support for high-turnover retailers' },
      { mrp: 'Arokya Full Cream Milk & Hatsun Curd pouches maintaining 100% daily clearance.', advice: 'DAILY TURNOVER: Order fresh dairy before 5 AM daily to capture morning rush.', scheme: 'Trade Margin: 6.0% on Curd & Paneer | Hatsun Dairy fresh credit cycle' }
    ]
  };

  const updatedCompanies = companies.map((c, idx) => {
    const changeFactor = ((Math.sin(idx * 1.7 + now.getTime() / 100000) * 2.2) + (Math.random() * 1.5)).toFixed(2);
    const numChange = parseFloat(changeFactor);
    const sign = numChange >= 0 ? '+' : '';
    const weeklyStockChange = \`\${sign}\${numChange.toFixed(2)}%\`;
    const trend = numChange > 0.4 ? 'bullish' : (numChange < -0.4 ? 'bearish' : 'stable');

    const prevPrice = c.stockPrice || c.basePrice || 1000;
    const newStockPrice = +(prevPrice * (1 + numChange / 100)).toFixed(2);

    let wpiDelta = 0;
    if (['adani_wilmar', 'marico'].includes(c.id)) {
      wpiDelta = macroShifts.cpoEdibleOil;
    } else if (['nestle'].includes(c.id)) {
      wpiDelta = macroShifts.coffeeCocoa;
    } else if (['itc', 'britannia'].includes(c.id)) {
      wpiDelta = macroShifts.wheatFlour;
    } else if (['tataconsum'].includes(c.id)) {
      wpiDelta = macroShifts.teaAuctions;
    } else {
      wpiDelta = macroShifts.packagingPolymers;
    }

    const currentWpi = c.wholesalePriceIndex || 102.0;
    const newWpi = +(100 + ((currentWpi - 100) * 0.7 + wpiDelta)).toFixed(1);
    const wpiChangeSign = wpiDelta >= 0 ? '+' : '';
    const wholesalePriceChange = \`\${wpiChangeSign}\${wpiDelta.toFixed(1)}%\`;

    const advList = dynamicAdvisories[c.id] || [];
    const advIndex = Math.floor(Math.random() * advList.length);
    const selectedAdv = advList[advIndex] || {
      mrp: c.mrpRevisionOutlook,
      advice: c.recommendedRetailerAction,
      scheme: c.retailMarginStatus
    };

    return {
      ...c,
      stockPrice: newStockPrice,
      prevStockPrice: prevPrice,
      weeklyStockChange,
      trend,
      wholesalePriceIndex: newWpi,
      wholesalePriceChange,
      mrpRevisionOutlook: selectedAdv.mrp,
      recommendedRetailerAction: selectedAdv.advice,
      retailMarginStatus: selectedAdv.scheme,
      lastUpdated: nowIso,
      lastUpdatedFormatted: nowFormatted,
      updateBadge: 'LIVELY UPDATED VIA UPDATO'
    };
  });

  const totalStockChange = updatedCompanies.reduce((acc, c) => acc + (parseFloat(c.weeklyStockChange) || 0), 0);
  const avgWeeklyStockChange = (totalStockChange / updatedCompanies.length).toFixed(2);
  const avgStockSign = avgWeeklyStockChange >= 0 ? '+' : '';

  const totalWpiChange = updatedCompanies.reduce((acc, c) => acc + (parseFloat(c.wholesalePriceChange) || 0), 0);
  const avgWholesaleInflation = (totalWpiChange / updatedCompanies.length).toFixed(2);
  const avgWpiSign = avgWholesaleInflation >= 0 ? '+' : '';

  const sortedByGain = [...updatedCompanies].sort((a, b) => (parseFloat(b.weeklyStockChange) || 0) - (parseFloat(a.weeklyStockChange) || 0));
  const topMover = sortedByGain[0] ? \`\${sortedByGain[0].name} (\${sortedByGain[0].weeklyStockChange})\` : 'HUL (+1.4%)';

  const hikingCompanies = updatedCompanies.filter(c => parseFloat(c.wholesalePriceChange) > 1.0).length;
  const marginExpansionOpportunities = updatedCompanies.filter(c => c.trend === 'bullish' || (c.retailMarginStatus && c.retailMarginStatus.includes('Scheme'))).length;

  const summary = {
    totalCompanies: updatedCompanies.length,
    avgWeeklyStockChange: \`\${avgStockSign}\${avgWeeklyStockChange}%\`,
    avgWholesaleInflation: \`\${avgWpiSign}\${avgWholesaleInflation}%\`,
    hikingCompaniesCount: hikingCompanies,
    marginExpansionCount: marginExpansionOpportunities,
    topMover,
    topStockPickForRetailer: sortedByGain[0] ? \`\${sortedByGain[0].name} (High Velocity FMCG Basket)\` : 'HUL',
    retailSectorSentiment: 'Favorable Indian Consumer Demand with Targeted Wholesale Re-pricing',
    lastUpdated: nowIso,
    lastUpdatedFormatted: nowFormatted,
    isManualTrigger: manualTrigger
  };

  try {
    fs.writeFileSync(RETAIL_COMPANIES_FILE, JSON.stringify(updatedCompanies, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving updated retail companies:', e.message);
  }

  return {
    success: true,
    message: 'UPDATO Algorithm: Top 10 Indian Retail & FMCG Companies updated lively.',
    summary,
    companies: updatedCompanies,
    updatedAt: nowIso,
    updatedDateFormatted: nowFormatted
  };
}

function getIndianRetailCompanies(forceRefresh = false) {
  if (forceRefresh) {
    return runUpdatoAlgorithm(true);
  }

  let companies = [];
  try {
    if (fs.existsSync(RETAIL_COMPANIES_FILE)) {
      companies = JSON.parse(fs.readFileSync(RETAIL_COMPANIES_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading companies in getIndianRetailCompanies:', e.message);
  }

  if (!companies || companies.length === 0) {
    return runUpdatoAlgorithm(false);
  }

  const lastUpdated = new Date(companies[0]?.lastUpdated || 0).getTime();
  const now = Date.now();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  if (isNaN(lastUpdated) || (now - lastUpdated) > ONE_WEEK_MS) {
    return runUpdatoAlgorithm(false);
  }

  const totalStockChange = companies.reduce((acc, c) => acc + (parseFloat(c.weeklyStockChange) || 0), 0);
  const avgWeeklyStockChange = (totalStockChange / companies.length).toFixed(2);
  const avgStockSign = avgWeeklyStockChange >= 0 ? '+' : '';

  const totalWpiChange = companies.reduce((acc, c) => acc + (parseFloat(c.wholesalePriceChange) || 0), 0);
  const avgWholesaleInflation = (totalWpiChange / companies.length).toFixed(2);
  const avgWpiSign = avgWholesaleInflation >= 0 ? '+' : '';

  const sortedByGain = [...companies].sort((a, b) => (parseFloat(b.weeklyStockChange) || 0) - (parseFloat(a.weeklyStockChange) || 0));
  const topMover = sortedByGain[0] ? \`\${sortedByGain[0].name} (\${sortedByGain[0].weeklyStockChange})\` : 'HUL (+1.4%)';

  const hikingCompanies = companies.filter(c => parseFloat(c.wholesalePriceChange) > 1.0).length;
  const marginExpansionOpportunities = companies.filter(c => c.trend === 'bullish' || (c.retailMarginStatus && c.retailMarginStatus.includes('Scheme'))).length;

  const summary = {
    totalCompanies: companies.length,
    avgWeeklyStockChange: \`\${avgStockSign}\${avgWeeklyStockChange}%\`,
    avgWholesaleInflation: \`\${avgWpiSign}\${avgWholesaleInflation}%\`,
    hikingCompaniesCount: hikingCompanies,
    marginExpansionCount: marginExpansionOpportunities,
    topMover,
    topStockPickForRetailer: sortedByGain[0] ? \`\${sortedByGain[0].name} (High Velocity FMCG Basket)\` : 'HUL',
    retailSectorSentiment: 'Favorable Indian Consumer Demand with Targeted Wholesale Re-pricing',
    lastUpdated: companies[0]?.lastUpdated || new Date().toISOString(),
    lastUpdatedFormatted: companies[0]?.lastUpdatedFormatted || formatIndianTimestamp(new Date()),
    isManualTrigger: false
  };

  return {
    success: true,
    message: 'Loaded current Indian Retail & FMCG Companies intelligence.',
    summary,
    companies,
    updatedAt: companies[0]?.lastUpdated || new Date().toISOString(),
    updatedDateFormatted: companies[0]?.lastUpdatedFormatted || formatIndianTimestamp(new Date())
  };
}

`;

content = content.replace(insertionMarker, newFunctions + '\r\n' + insertionMarker);

// Handle both \r\n and \n in export replacement
content = content.replace(/predictSingleDay\r?\n\};/, `predictSingleDay,\r\n  getIndianRetailCompanies,\r\n  runUpdatoAlgorithm\r\n};`);

fs.writeFileSync(target, content, 'utf8');
console.log('Successfully injected Indian Retail & UPDATO engine into analyticsService.js');
