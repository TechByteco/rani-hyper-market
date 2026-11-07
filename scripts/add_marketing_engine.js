const fs = require('fs');
const path = require('path');

const advisorPath = path.join(__dirname, '..', 'generativeAiAdvisor.js');
let code = fs.readFileSync(advisorPath, 'utf8');

const campaignFn = `
/**
 * Autonomous AI Marketing Campaign & Formula Synthesizer
 * Computes live retail financial metrics and synthesizes multi-channel copy
 */
async function generateMarketingCampaign(options = {}) {
  const cohort = options.cohort || 'weekly_groceries';
  const tone = options.tone || 'tamil_traditional';
  const prompt = (options.prompt || '').trim();
  const discount = Math.min(50, Math.max(1, Number(options.discount) || 15));
  let productName = (options.productName || options.product || options.sku || 'Ponni Boiled Rice (25kg Bag) + Toor Dal').trim();
  let mrp = Math.max(10, Math.round(Number(options.mrp) || 1450));
  let cost = options.cost ? Math.round(Number(options.cost)) : Math.round(mrp * 0.84);

  // 1. Live Formula Calculations
  const dealPrice = Math.max(1, Math.round(mrp * (1 - discount / 100)));
  const savingsAmount = mrp - dealPrice;
  const unitGrossProfit = dealPrice - cost;
  const grossMarginPct = dealPrice > 0 ? Number(((unitGrossProfit / dealPrice) * 100).toFixed(1)) : 0;
  const isSafeMargin = grossMarginPct >= 5.0;

  const audienceMap = {
    weekly_groceries: { name: 'Weekly Grocery Families', count: 2680, aov: 890, focus: 'Everyday Household Replenishment' },
    rice_mills: { name: 'Wholesale & Grain Buyers', count: 1420, aov: 1550, focus: 'Bulk Rice & Mill Direct Sacks' },
    festival_families: { name: 'Festival Celebration Households', count: 2050, aov: 1650, focus: 'Pooja, Sweets & Festive Combos' },
    dead_stock: { name: 'Clearance & BOGO Deal Seekers', count: 1730, aov: 520, focus: 'Inventory Velocity & Liquidation' },
    champions: { name: 'VIP Champions Club', count: 1420, aov: 1240, focus: 'High Lifetime Value & Free Express Drop' }
  };
  const cohortMeta = audienceMap[cohort] || audienceMap.weekly_groceries;
  const audienceReach = cohortMeta.count;

  // Conversion model: baseline 4.5% + (discount * 0.35)%, capped at 22.0%
  const conversionRatePct = Number(Math.min(22.0, 4.5 + (discount * 0.35)).toFixed(1));
  const projectedOrders = Math.max(1, Math.round(audienceReach * (conversionRatePct / 100)));
  const projectedGmv = projectedOrders * dealPrice;
  const projectedProfit = projectedOrders * unitGrossProfit;
  const dispatchCost = Math.round(audienceReach * 0.40); // ₹0.40 per targeted WhatsApp / RCS notification
  const roiMultiplier = dispatchCost > 0 ? Number((projectedGmv / dispatchCost).toFixed(1)) : 14.2;

  const formulas = {
    mrp,
    cost,
    discountPct: discount,
    dealPrice,
    savingsAmount,
    unitGrossProfit,
    grossMarginPct,
    isSafeMargin,
    cohortKey: cohort,
    cohortName: cohortMeta.name,
    audienceReach,
    conversionRatePct,
    projectedOrders,
    projectedGmv,
    projectedProfit,
    dispatchCost,
    roiMultiplier
  };

  const config = loadConfig();
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // 2. Attempt Google Gemini Cloud AI Generation if enabled and key present
  if (config.enabled && apiKey && config.useCloudIfAvailable) {
    try {
      const geminiPrompt = \`You are the Chief Marketing Strategist for Rani Hyper Market in Bodinayakanur, Theni District, Tamil Nadu.
Create a promotional marketing package for the following retail campaign:
- Target Cohort: \${cohortMeta.name} (\${cohortMeta.focus})
- Target Product: \${productName}
- Standard MRP: ₹\${mrp} | Special Deal Price: ₹\${dealPrice} (\${discount}% OFF, Save ₹\${savingsAmount})
- Unit Gross Margin: \${grossMarginPct}% (Safe: \${isSafeMargin ? 'YES' : 'LOW'})
- Additional Instruction / Prompt: \${prompt || 'Drive instant store orders with free 30-min home delivery in Bodinayakanur'}
- Selected Tone: \${tone}

Generate a JSON object (strictly valid JSON only, without markdown fences or backticks) with these exact keys:
{
  "headline": "A catchy headline in the chosen tone",
  "whatsappCopy": "Full WhatsApp message with emojis, price breakdown (MRP ₹\${mrp} -> ₹\${dealPrice}), savings, free 30-min Bodinayakanur home delivery promise, and call-to-action to reply or tap link",
  "tamilCopy": "Authentic Tamil vernacular copy tailored to Bodinayakanur and Theni families",
  "instagramCopy": "Social media caption with hook, emojis, deal highlights, store location, and 5 hashtags",
  "smsCopy": "Concise 160-character SMS text",
  "aiStrategyNote": "2-3 sentence retail merchandising strategy explaining why this discount and cohort combination works"
}\`;

      const contents = [{ role: 'user', parts: [{ text: geminiPrompt }] }];
      const model = config.model || 'gemini-1.5-flash';
      const rawText = await requestGemini(model, apiKey, contents);
      if (rawText) {
        let cleanJson = rawText.trim();
        if (cleanJson.startsWith('\`\`\`json')) cleanJson = cleanJson.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
        else if (cleanJson.startsWith('\`\`\`')) cleanJson = cleanJson.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
          success: true,
          engine: 'Google Gemini Cloud AI (' + model + ')',
          formulas,
          copy: parsed
        };
      }
    } catch (e) {
      console.warn('Gemini marketing generation fallback to local engine:', e.message);
    }
  }

  // 3. Autonomous Retail Generative Engine (Local Synthesis)
  let headline = '';
  let whatsappCopy = '';
  let tamilCopy = '';
  let instagramCopy = '';
  let smsCopy = '';
  let aiStrategyNote = '';

  const safeBadge = isSafeMargin ? '✅ Profit Protected' : '⚠️ Low Margin Clearance';

  if (cohort === 'weekly_groceries') {
    headline = tone === 'tamil_traditional'
      ? \`👑 போடிநாயக்கனூர் வாராந்திர மளிகை மெகா தள்ளுபடி! (\${discount}% OFF)\`
      : \`⚡ Weekly Grocery Mega Savings in Bodinayakanur! (\${discount}% Off)\`;
    
    tamilCopy = \`அன்பான குடும்பங்களே! உங்கள் அன்றாட இல்லத் தேவைகளுக்கான \${productName} இப்போது சிறப்பு \${discount}% தள்ளுபடியில்!\\n\\n💰 MRP: ₹\${mrp} | சலுகை விலை: ₹\${dealPrice} (நேரடி சேமிப்பு: ₹\${savingsAmount})\\n🚚 போடி சுற்றுவட்டாரத்திற்கு 30 நிமிடங்களில் உங்கள் இல்லத்திற்கே டோர் டெலிவரி!\\n\\nஆர்டர் செய்ய இப்போதே வாட்ஸ்அப்பில் மெசேஜ் செய்யுங்கள் அல்லது இணையதளத்தில் வாங்கவும்: https://rani-hyper-market.vercel.app/store\`;
    
    whatsappCopy = \`🛒 *RANI HYPER MARKET — WEEKLY FAMILY SAVINGS*\\n\\n👑 *போடிநாயக்கனூர் சிறப்பு மளிகை ஆஃபர்!*\\n\\n📦 *Product:* \${productName}\\n🏷️ *MRP:* ~₹\${mrp}~\\n🔥 *Special Deal Price:* *₹\${dealPrice}* (Save ₹\${savingsAmount} / \${discount}% OFF)\\n\` +
      (prompt ? \`\\n💡 *Special Note:* \${prompt}\\n\` : '') +
      \`\\n🚚 *Guaranteed 30-Minute Doorstep Delivery* across Bodinayakanur\\n⚡ *Quick Order:* https://rani-hyper-market.vercel.app/store?q=\${encodeURIComponent(productName)}\\n📞 *Direct Call/WhatsApp:* +91 77088 34547\\n📍 *Store:* Bodinayakanur, Theni District.\`;

    instagramCopy = \`Stock your kitchen for the week with \${productName}! Get \${discount}% OFF today only at Rani Hyper Market. MRP ₹\${mrp} now just ₹\${dealPrice} (Save ₹\${savingsAmount}). Free 30-min express home delivery in Bodinayakanur!\\n\\n📍 Rani Hyper Market, Bodinayakanur\\n📲 WhatsApp: +91 77088 34547\\n\\n#RaniHyperMarket #Bodinayakanur #Theni #GroceryDeals #TamilNaduGroceries\`;

    smsCopy = \`Rani Hyper Market: \${productName} at just Rs.\${dealPrice} (MRP Rs.\${mrp}, \${discount}% OFF). Free 30-min Bodi delivery! Call/WA 7708834547 or visit rani-hyper-market.vercel.app\`;

    aiStrategyNote = \`Staple grocery basket driver: Discount of \${discount}% maintains a healthy \${grossMarginPct}% gross margin while yielding an estimated ₹\${projectedGmv.toLocaleString('en-IN')} GMV across \${projectedOrders} customer households.\`;

  } else if (cohort === 'rice_mills') {
    headline = tone === 'tamil_traditional'
      ? \`🌾 நேரடி மில் பொன்னி அரிசி அதிரடி விலை குறைப்பு! (\${discount}% OFF)\`
      : \`🌾 Direct Mill Grain & Rice Sack Wholesale Deals (\${discount}% Off)\`;

    tamilCopy = \`போடி சுற்றுவட்டார அரிசி நுகர்வோருக்கு நற்செய்தி! முதல் தரம் \${productName} நேரடி மில் விலையில் \${discount}% தள்ளுபடியில் கிடைக்கிறது!\\n\\n💰 MRP: ₹\${mrp} | சலுகை விலை: ₹\${dealPrice} (சேமிப்பு ₹\${savingsAmount})\\n🚚 இலவச வண்டி ஏற்றுதல் மற்றும் வீடு தேடி டெலிவரி!\\n\\nதொடர்புக்கு: +91 77088 34547\`;

    whatsappCopy = \`🌾 *RANI HYPER MARKET — WHOLESALE RICE DIRECT OFFER*\\n\\n🌾 *முதல் தர அரிசி மூட்டை அதிரடி தள்ளுபடி!*\\n\\n📦 *Item:* \${productName}\\n🏷️ *MRP:* ~₹\${mrp}~\\n🔥 *Wholesale Deal Price:* *₹\${dealPrice}* (Save ₹\${savingsAmount})\\n\` +
      (prompt ? \`\\n💡 *Deal Focus:* \${prompt}\\n\` : '') +
      \`\\n🚚 Free loading & fast doorstep delivery anywhere in Bodinayakanur & Periyakulam road.\\n⚡ Order now via WhatsApp: +91 77088 34547\`;

    instagramCopy = \`Direct mill tier savings on \${productName}! Premium quality guaranteed, now at ₹\${dealPrice} (MRP ₹\${mrp}). Bulk sacks available for families and catering.\\n\\n📍 Rani Hyper Market, Bodinayakanur\\n#RiceWholesale #Bodinayakanur #Theni #PonniRice #RaniHyperMarket\`;

    smsCopy = \`Rani Market Wholesale: \${productName} now Rs.\${dealPrice} (MRP Rs.\${mrp}). Free Bodi delivery. Order at 7708834547 or rani-hyper-market.vercel.app\`;

    aiStrategyNote = \`High-ticket basket anchor: Moving bulk sacks creates massive volume cash flow (est. ₹\${projectedGmv.toLocaleString('en-IN')}) and prevents household churn to roadside mandis.\`;

  } else if (cohort === 'festival_families') {
    headline = tone === 'tamil_traditional'
      ? \`🪔 தீபாவளி / பொங்கல் பலகாரப் பொருட்கள் ஸ்பெஷல் காம்போ! (\${discount}% OFF)\`
      : \`🪔 Tamil Festive Celebration Sweet & Ghee Kit (\${discount}% Off)\`;

    tamilCopy = \`பண்டிகை இனிப்புகள் மற்றும் பலகாரங்கள் செய்ய தூய நந்தினி/GRB நெய், மாவு வகைகள் மற்றும் மளிகை சாமான்கள் அடங்கிய \${productName} இப்போது மெகா சேமிப்பில்!\\n\\n💰 MRP: ₹\${mrp} | சலுகை விலை: ₹\${dealPrice} (லாபகர சேமிப்பு ₹\${savingsAmount})\\nஆர்டர் செய்த அரை மணி நேரத்தில் உங்கள் வீட்டிற்கு வரும்!\\n\\nவாட்ஸ்அப் எண்: +91 77088 34547\`;

    whatsappCopy = \`🪔 *RANI HYPER MARKET — FESTIVAL CELEBRATION COMBO*\\n\\n✨ *பண்டிகை இனிப்பு பலகாரப் பொருட்கள் சிறப்பு ஆஃபர்!*\\n\\n📦 *Kit:* \${productName}\\n🏷️ *MRP:* ~₹\${mrp}~\\n🔥 *Festival Offer Price:* *₹\${dealPrice}* (Save ₹\${savingsAmount})\\n\` +
      (prompt ? \`\\n💡 *Festive Note:* \${prompt}\\n\` : '') +
      \`\\n🪔 100% Pure, certified fresh batches for delicious sweets.\\n🚚 30-Minute Doorstep Drop across Bodinayakanur.\\n⚡ Instant Order: https://rani-hyper-market.vercel.app/store\`;

    instagramCopy = \`Celebrate the festival with Rani Hyper Market! Get \${productName} at special festive price ₹\${dealPrice} (MRP ₹\${mrp}). Fresh stock of pure ghee, nuts, and sweets ingredients!\\n\\n#FestivalOffers #DiwaliSweets #PongalDeals #Bodinayakanur #RaniHyperMarket\`;

    smsCopy = \`Rani Hyper Market Festival Special: \${productName} at Rs.\${dealPrice} (Save Rs.\${savingsAmount}). 30-min Bodi delivery. Call/WA 7708834547\`;

    aiStrategyNote = \`Seasonal surge multiplier: Festival shoppers exhibit 2.35x higher basket values. A \${discount}% incentive converts 2,050 high-affinity families with ₹\${projectedProfit.toLocaleString('en-IN')} net profit.\`;

  } else {
    // dead_stock / clearance / bogo
    headline = tone === 'tamil_traditional'
      ? \`⚠️ முடங்கிய சரக்கு கிளியரன்ஸ் அதிரடி ஆஃபர்! (\${discount}% தள்ளுபடி)\`
      : \`🔥 Clearance Blitz & Stock Velocity Sale! (\${discount}% Off)\`;

    tamilCopy = \`பிரத்யேக ஸ்டாக் கிளியரன்ஸ் சலுகை: \${productName} குறைந்த எண்ணிக்கையிலான இருப்பு மட்டுமே உள்ளது!\\n\\n💰 MRP: ₹\${mrp} | கிளியரன்ஸ் விலை: ₹\${dealPrice} (நேரடி சேமிப்பு ₹\${savingsAmount})\\nமுந்துங்கள், சரக்குகள் தீரும் வரை மட்டுமே!\\n\\nவாட்ஸ்அப்: +91 77088 34547\`;

    whatsappCopy = \`🔥 *RANI HYPER MARKET — LIMITED CLEARANCE BLITZ*\\n\\n⚠️ *அதிரடி விலை குறைப்பு — Stock Clearing Offer!*\\n\\n📦 *Item:* \${productName}\\n🏷️ *MRP:* ~₹\${mrp}~\\n🔥 *Clearance Deal Price:* *₹\${dealPrice}* (Save ₹\${savingsAmount} / \${discount}% OFF)\\n\` +
      (prompt ? \`\\n💡 *Details:* \${prompt}\\n\` : '') +
      \`\\n⚡ *Limited Units Available!*\\n🚚 Fast 30-Min Delivery in Bodinayakanur\\n📲 WhatsApp to reserve: +91 77088 34547\`;

    instagramCopy = \`Limited Stock Clearance! Get \${productName} for just ₹\${dealPrice} (MRP ₹\${mrp}). Grab yours before shelves clear at Rani Hyper Market, Bodinayakanur!\\n\\n#ClearanceSale #BodiShopping #RaniHyperMarket #Bodinayakanur\`;

    smsCopy = \`Rani Market Clearance: \${productName} at Rs.\${dealPrice} (MRP Rs.\${mrp}, \${discount}% OFF). Limited stock! Call/WA 7708834547 to reserve.\`;

    aiStrategyNote = \`Inventory velocity recovery: Liquidates stagnant working capital with \${safeBadge}. Reallocates locked funds back into 14-day replenishment fast staples.\`;
  }

  return {
    success: true,
    engine: 'SNS Autonomous Retail Engine (Local Formula Synthesis)',
    formulas,
    copy: {
      headline,
      whatsappCopy,
      tamilCopy,
      instagramCopy,
      smsCopy,
      aiStrategyNote
    }
  };
}
`;

// Insert before module.exports
const exportIdx = code.indexOf('module.exports = {');
if (exportIdx !== -1) {
  code = code.substring(0, exportIdx) + campaignFn + '\n' + code.substring(exportIdx);
  code = code.replace('module.exports = {', 'module.exports = {\n  generateMarketingCampaign,');
  fs.writeFileSync(advisorPath, code, 'utf8');
  console.log('Successfully updated generativeAiAdvisor.js');
} else {
  console.error('Could not find module.exports');
}
