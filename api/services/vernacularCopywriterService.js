/**
 * Agent 2: Generative Vernacular Copywriter
 * Customized for Bodinayakanur & Theni District Consumers
 * Powered by Google Gemini 2.5 / 3.0 API with Autonomous Regional Dialect Synthesis Engine
 * Grounded in Bodinayakanur & Theni Regional Voice Configuration (tamil_regional_voice_config.json)
 *
 * Cultural Anchors:
 * - Cardamom City: போடி மணமணக்கும் ஏலக்காய் (Cardamom City pride)
 * - Cumbum Valley: கம்பம் பள்ளத்தாக்கு பன்னீர் திராட்சை
 * - Culinary Traditions: Chettinad/Madurai Kuzhambu, traditional filter coffee decoction, Sunday non-veg meal prep
 * 
 * Dynamic Daypart & Tone Templates:
 * - Saturday Morning: "ஞாயிறு அசைவ விருந்துக்கான மசாலா பொருட்கள் மற்றும் எண்ணெய் வகைகள்..."
 * - Monthly 1st-5th: "மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா..."
 * - Thursday Evening: "வார இறுதி சமையல் மளிகை முன்கூட்டியே புக் செய்யுங்கள்!"
 * - Daily Morning Dairy: "சுடச்சுட மணக்கும் டிகிரி பில்டர் காபி & பிரெஷ் பால் ஆஃபர்!"
 *
 * Output schema: JSON { sms_tamil, whatsapp_tamil, instagram_caption, preview_render }
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, '..', 'ai-config.json');

const VOICE_CONFIG_CANDIDATE_PATHS = [
  path.join(__dirname, '..', 'tamil_regional_voice_config.json'),
  path.join(__dirname, '..', '..', 'tamil_regional_voice_config.json'),
  path.join(__dirname, '..', 'data', 'tamil_regional_voice_config.json'),
  path.join(__dirname, '..', '..', 'data', 'tamil_regional_voice_config.json'),
  path.join(__dirname, '..', 'public', 'tamil_regional_voice_config.json'),
  path.join(__dirname, '..', '..', 'public', 'tamil_regional_voice_config.json'),
  path.join(__dirname, '..', 'api', 'data', 'tamil_regional_voice_config.json'),
  path.join(__dirname, 'data', 'tamil_regional_voice_config.json'),
  path.join(process.cwd(), 'tamil_regional_voice_config.json'),
  path.join(process.cwd(), 'data', 'tamil_regional_voice_config.json'),
  path.join(process.cwd(), 'public', 'tamil_regional_voice_config.json'),
  path.join(process.cwd(), 'api', 'data', 'tamil_regional_voice_config.json')
];

let cachedVoiceConfig = null;

/**
 * Load Tamil Regional Voice Configuration
 */
function loadRegionalVoiceConfig() {
  if (cachedVoiceConfig) return cachedVoiceConfig;

  for (const p of VOICE_CONFIG_CANDIDATE_PATHS) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        cachedVoiceConfig = JSON.parse(raw);
        return cachedVoiceConfig;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  // Graceful fallback structure
  cachedVoiceConfig = {
    metadata: {
      title: 'Rani Hypermarket - Bodinayakanur & Theni Tamil Voice Config',
      role: 'Cultural Linguist & Tamil Prompt Engineer'
    },
    regional_cultural_dictionary: {},
    dynamic_daypart_and_calendar_templates: {}
  };
  return cachedVoiceConfig;
}

function loadAiConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn('ai-config.json read notice:', e.message);
  }
  return {
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
    model: 'gemini-2.5-flash',
    enabled: true,
    useCloudIfAvailable: true
  };
}

/**
 * Clean string and trim whitespace
 */
function cleanStr(val, defaultVal = '') {
  if (val === undefined || val === null) return defaultVal;
  return String(val).trim();
}

/**
 * Detect dynamic regional template from payload and current context
 */
function detectRegionalTemplate(payload = {}) {
  const cfg = loadRegionalVoiceConfig();
  const templates = cfg.dynamic_daypart_and_calendar_templates || {};

  // 1. Explicit template passed
  if (payload.template && templates[payload.template]) {
    return { key: payload.template, config: templates[payload.template] };
  }

  const pName = (payload.productName || payload.name || '').toLowerCase();
  const ctx = (payload.festivalContext || payload.context || '').toLowerCase();

  // 2. Saturday / Non-veg meat prep detection
  const isMeatOrOil = /mutton|chicken|meat|briyani|biryani|curry|masala|sunflower oil|oil|மட்டன்|சிக்கன்|அசைவ|ஞாயிறு|விருந்து|சீரக சம்பா/.test(pName + ' ' + ctx);
  const now = new Date();
  const dayOfWeek = now.getDay(); // 6 = Saturday, 0 = Sunday
  const dateOfMonth = now.getDate();

  if (payload.template === 'saturday_morning' || isMeatOrOil || dayOfWeek === 6) {
    if (templates.saturday_morning) {
      return { key: 'saturday_morning', config: templates.saturday_morning };
    }
  }

  // 3. Monthly 1st - 5th provisions festival detection
  const isMonthlyBudget = /monthly|salary|budget|provisions|1st|மாதாந்திர|பட்ஜெட்|மாத மளிகை|சம்பளம்/.test(ctx);
  if (payload.template === 'monthly_salary_days' || isMonthlyBudget || (dateOfMonth >= 1 && dateOfMonth <= 5)) {
    if (templates.monthly_salary_days) {
      return { key: 'monthly_salary_days', config: templates.monthly_salary_days };
    }
  }

  // 4. Daily Morning Dairy / Filter Coffee detection
  const isMorningItem = /milk|coffee|tea|curd|batter|idli|பால்|காபி|தேநீர்|தயிர்|இட்லி/.test(pName);
  if (payload.template === 'daily_morning_dairy' || isMorningItem) {
    if (templates.daily_morning_dairy) {
      return { key: 'daily_morning_dairy', config: templates.daily_morning_dairy };
    }
  }

  // 5. Thursday Evening weekend grocery reservation detection
  if (payload.template === 'thursday_evening' || dayOfWeek === 4 || dayOfWeek === 5) {
    if (templates.thursday_evening) {
      return { key: 'thursday_evening', config: templates.thursday_evening };
    }
  }

  // Fallback to Saturday Morning if non-veg, else monthly salary days
  return {
    key: 'monthly_salary_days',
    config: templates.monthly_salary_days || {
      headline: "மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா...",
      opening_hook: "போடி இல்லத்தரசிகளே! உங்கள் மாதாந்திர மளிகை பட்ஜெட்டை மிச்சப்படுத்த நம்ம போடி ராணி மார்க்கெட் வழங்கும் அதிரடி ஆஃபர்!",
      dlt_sms_lead: "போடி ராணி மார்க்கெட்: மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா!",
      whatsapp_lead: "🌾 *மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா - நம்ம போடி ராணி மார்க்கெட்டில்!* 💰",
      culinary_cue: "25kg கர்நாடகா பொன்னி அரிசி மற்றும் 5L சன்ஃபிளவர் ஆயில் நேரடி மொத்த விலை",
      urgency_hook: "முழு மாச வீட்டு மளிகையையும் ஒரே பில்லில் அள்ளிச் செல்லுங்கள் - கைநிறைய மிச்சம்!"
    }
  };
}

/**
 * Calculate financial metrics
 */
function computeMetrics(payload) {
  const productName = cleanStr(payload.productName || payload.product || payload.name, 'முதல் தர பொன்னி புழுங்கல் அரிசி (25 கிலோ)');
  const mrp = Math.max(1, Math.round(Number(payload.mrp) || 1450));
  let promoPrice = Math.round(Number(payload.promoPrice || payload.promo_price || payload.dealPrice || payload.price) || (mrp * 0.9));
  if (promoPrice >= mrp) promoPrice = Math.round(mrp * 0.9);
  
  const savingsAmount = Math.max(0, mrp - promoPrice);
  const discountPct = Math.min(60, Math.max(1, Math.round(((mrp - promoPrice) / mrp) * 100)));
  const marginPct = Number(Number(payload.marginPct || payload.margin || 14.5).toFixed(1));
  const stockUnits = Math.max(0, Math.round(Number(payload.stockUnits || payload.stock) || 50));
  const festivalContext = cleanStr(payload.festivalContext || payload.festival || payload.context, 'வாராந்திர பட்ஜெட் சேமிப்பு திருவிழா');

  const templateContext = detectRegionalTemplate(payload);

  return {
    productName,
    mrp,
    promoPrice,
    savingsAmount,
    discountPct,
    marginPct,
    stockUnits,
    festivalContext,
    templateContext,
    isScarcity: stockUnits > 0 && stockUnits <= 20,
    isAbundant: stockUnits >= 60,
    storePhone: '77088 34547',
    storeName: 'ராணி ஹைப்பர் மார்க்கெட் (போடி)',
    storeUrl: `https://rani-hyper-market.vercel.app/store?search=${encodeURIComponent(productName.split(' ')[0] || productName)}`
  };
}

/**
 * Enforce strict DLT 160-character limit for Indian telecom regulations
 */
function enforceDltLimit(smsText, m) {
  let text = cleanStr(smsText);
  if (text.length <= 160) return text;

  const tpl = m.templateContext?.config;
  const lead = tpl?.dlt_sms_lead || 'போடி ராணி மார்க்கெட்:';

  // Compact fallback format guaranteed to fit within 160 chars
  const compact = `${lead} ${m.productName.slice(0, 28)} MRP ₹${m.mrp} ஆஃபர் ₹${m.promoPrice}! சேமிப்பு ₹${m.savingsAmount}. இலவச டெலிவரி! ஆர்டர்: 7708834547 / rani-hyper-market.vercel.app`;
  if (compact.length <= 160) return compact;

  return compact.slice(0, 157) + '...';
}

/**
 * Call Google Gemini 2.5/3.0 Cloud API
 */
async function callGeminiCloudApi(promptText, config) {
  const apiKey = (config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) return null;

  const candidateModels = [
    cleanStr(config.model, 'gemini-2.5-flash').replace(/^models\//, ''),
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-3.0-flash',
    'gemini-2.0-flash'
  ];
  const models = [...new Set(candidateModels.filter(Boolean))];

  for (const model of models) {
    try {
      const result = await new Promise((resolve, reject) => {
        const bodyData = JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        });

        const req = https.request({
          hostname: 'generativelanguage.googleapis.com',
          port: 443,
          path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyData)
          },
          timeout: 10000
        }, (res) => {
          let chunks = '';
          res.on('data', d => { chunks += d; });
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const parsed = JSON.parse(chunks);
                const rawText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (rawText) {
                  const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                  resolve(JSON.parse(cleanedJson));
                  return;
                }
              } catch (e) {
                reject(e);
              }
            }
            reject(new Error(`Gemini HTTP ${res.statusCode}: ${chunks.slice(0, 150)}`));
          });
        });

        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Timeout calling model ${model}`));
        });
        req.write(bodyData);
        req.end();
      });

      if (result && result.sms_tamil && result.whatsapp_tamil && result.instagram_caption) {
        return result;
      }
    } catch (err) {
      console.warn(`Gemini API ${model} notice: ${err.message}`);
    }
  }

  return null;
}

/**
 * Autonomous Regional Vernacular Synthesis Engine (Dialect-Grounded Fallback)
 * Zero literal English translations; 100% authentic Bodinayakanur & Theni retail tone.
 */
function synthesizeRegionalTamilCopy(m) {
  const tpl = m.templateContext?.config || {};
  const tplKey = m.templateContext?.key || 'monthly_salary_days';

  // Dynamic Daypart Headline & Opening Hook
  const headline = tpl.headline || 'மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா...';
  const openingHook = tpl.opening_hook || 'போடி இல்லத்தரசிகளே! உங்கள் வீட்டு பட்ஜெட்டை மிச்சப்படுத்த நம்ம போடி ராணி மார்க்கெட் வழங்கும் அதிரடி ஆஃபர்!';
  const whatsappLead = tpl.whatsapp_lead || '🌾 *நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டின் அதிரடி சலுகை!* 🌾';
  const culinaryCue = tpl.culinary_cue || 'அசல் போடி மணமணக்கும் ஏலக்காய் மற்றும் செட்டிநாடு வறுத்தரைச்ச மசாலா';
  const urgencyHook = tpl.urgency_hook || 'போடி நகர் முழுவதும் 30 நிமிடத்தில் இலவச டோர் டெலிவரி!';

  // Scarcity or volume callout
  let urgencyClause = `📦 ${urgencyHook}`;
  if (m.isScarcity) {
    urgencyClause = `⚡ கடைசி ${m.stockUnits} பேக்குகள் மட்டுமே இருப்பு உள்ளது! உடனே முந்துங்கள்!`;
  }

  // Festival relevance
  let festivalCallout = '';
  if (m.festivalContext && /karthigai|deepam/i.test(m.festivalContext)) {
    festivalCallout = '🪔 கார்த்திகை தீபத்திருநாள் சிறப்பு பாயாசம், அப்பம் மற்றும் பலகாரங்களுக்கு தேவையான போடி மணமணக்கும் ஏலக்காய் & நெய்!';
  } else if (m.festivalContext && /diwali|deepavali/i.test(m.festivalContext)) {
    festivalCallout = '🪔 தீபாவளி பலகாரங்கள் மற்றும் அதிரசம் செய்ய நயமான தரமான மளிகை பொருட்கள்!';
  } else if (m.festivalContext && /pongal/i.test(m.festivalContext)) {
    festivalCallout = '🌾 தைப் பொங்கல் நல்வாழ்த்துகள்! புதுப்பானை பொங்கலுக்கு நயமான புது பச்சரிசி, வெல்லம் & முந்திரி ஏலக்காய் ஆஃபர்!';
  } else if (m.festivalContext) {
    festivalCallout = `🎉 ${m.festivalContext} கொண்டாட்டத்திற்கு ராணி மார்க்கெட்டின் சிறப்பு அதிரடி தள்ளுபடி!`;
  }

  // Format A: 160-Character DLT-Compliant SMS
  let smsLead = tpl.dlt_sms_lead || 'போடி ராணி மார்க்கெட்:';
  let sms_tamil = `${smsLead} ${m.productName.slice(0, 28)} MRP ₹${m.mrp} ஆஃபர் ₹${m.promoPrice}! மிச்சம் ₹${m.savingsAmount}. இலவச டெலிவரி! ஆர்டர்: 7708834547 / rani-hyper-market.vercel.app`;
  sms_tamil = enforceDltLimit(sms_tamil, m);

  // Format B: High-Converting WhatsApp Message
  const whatsapp_tamil = `${whatsappLead}
_${headline}_

வணக்கம் போடி மக்களே! ${openingHook}

✨ *பொருள்:* ${m.productName}
💰 *MRP விலை:* ~₹${m.mrp}~
🔥 *சிறப்பு ஆஃபர் விலை:* *₹${m.promoPrice} மட்டுமே!*
🎉 *கைநிறைய மிச்சம்:* *₹${m.savingsAmount} (${m.discountPct}% அதிரடி தள்ளுபடி!)*

🍳 *சுவையான சமையல் குறிப்பு:*
${culinaryCue}
${festivalCallout ? '🪔 ' + festivalCallout + '\n' : ''}
${urgencyClause}

*ஏன் நம்ம போடி ராணி மார்க்கெட்?*
✅ 100% முதல் தர நயமான தரம் (ஏலக்காய் நகரம் போடியின் நம்பகமான கடை)
✅ கலப்படமில்லாத சுத்தமான வீட்டு மளிகை
✅ போடி நகர் முழுவதும் 30 நிமிடத்தில் இலவச டோர் டெலிவரி! 🚚

👉 *1-டாப்பில் ஆன்லைனில் ஆர்டர் செய்ய:*
${m.storeUrl}

📞 *வாட்ஸ்அப் / போன் ஆர்டருக்கு:* ${m.storePhone}
📍 *நேரில் வர:* ராணி ஹைப்பர் மார்க்கெட், மெயின் ரோடு, போடிநாயக்கனூர்.`;

  // Format C: Instagram Reel / Post Caption
  const instagram_caption = `🌾 போடி மக்களே! ${headline} 🌾

${openingHook} நம்ம ஏலக்காய் நகரம் போடி இல்லத்தரசிகளுக்கு தரமும் முக்கியம், பட்ஜெட் சேமிப்பும் முக்கியம்! அதனாலேயே நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டில் ${m.productName} அதிரடி சலுகை விலையில் கிடைக்கிறது!

💰 வழக்கமான MRP: ₹${m.mrp}
🔥 சிறப்பு ஆஃபர் விலை: ₹${m.promoPrice} மட்டுமே!
🎉 கைநிறைய சேமிப்பு: ₹${m.savingsAmount} (${m.discountPct}% நேரடி தள்ளுபடி)

🍛 ${culinaryCue}
${festivalCallout ? '🪔 ' + festivalCallout + '\n' : ''}
${m.isScarcity ? `⚡ ஸ்டாக் குறைவாக உள்ளது (${m.stockUnits} மீதம்)! உடனே முந்துங்கள்!` : '📦 அதிக அளவில் இருப்பு உள்ளது - குடும்பத்தோடு வந்து அள்ளிச் செல்லுங்கள்!'}

🚚 போடி நகர் முழுவதும் 30 நிமிடங்களில் உங்கள் வீடு தேடி இலவச டோர் டெலிவரி!
📲 ஆன்லைனில் ஆர்டர் செய்ய: பயோவில் உள்ள லிங்கை கிளிக் செய்யுங்கள் (Link in Bio)
📞 வாட்ஸ்அப் / அழைப்புகளுக்கு: ${m.storePhone}
📍 ராணி ஹைப்பர் மார்க்கெட், மெயின் ரோடு, போடிநாயக்கனூர், தேனி மாவட்டம்.

#Bodinayakanur #CardamomCity #TheniRetail #RaniHyperMarket #BodiShopping #TheniDistrict #CumbumValley #ChettinadKuzhambu #SundayNonVeg #FilterCoffee #TamilGrocery #SmartBodiShopper`;

  return { sms_tamil, whatsapp_tamil, instagram_caption, template_used: tplKey };
}

/**
 * Generate responsive HTML preview rendering multi-channel mockups
 */
function buildPreviewRender(copyData, m) {
  const smsLen = copyData.sms_tamil.length;
  const isDltValid = smsLen <= 160;
  const tpl = m.templateContext?.config;

  return `
    <div class="space-y-6 text-gray-100 font-sans">
      <!-- Top Campaign Summary Pill -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-indigo-950/50 border border-emerald-500/30">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Agent 2: Generative Vernacular Copywriter
            </span>
            <span class="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Template: ${m.templateContext?.key || 'monthly_salary_days'}
            </span>
            <span class="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Cardamom City Dialect (போடி ஏலக்காய்)
            </span>
          </div>
          <h4 class="text-base font-black text-white mt-1.5">${m.productName}</h4>
          <p class="text-xs text-gray-400 mt-0.5">
            MRP: <span class="line-through">₹${m.mrp}</span> • Deal: <b class="text-emerald-400">₹${m.promoPrice}</b> • Savings: <b class="text-amber-400">₹${m.savingsAmount} (${m.discountPct}% OFF)</b> • Stock: ${m.stockUnits} units
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-xl text-xs font-bold ${isDltValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'} flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${isDltValid ? 'bg-emerald-400' : 'bg-red-400'}"></span>
            DLT: ${smsLen}/160 chars (${isDltValid ? 'Compliant' : 'Over Limit'})
          </span>
        </div>
      </div>

      <!-- 3 Synchronized Channel Mockups (Tabs / Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- FORMAT A: 160-CHAR DLT SMS PREVIEW -->
        <div class="bg-gray-950/80 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><i class="fa-solid fa-message text-xs"></i></span>
                <span class="text-xs font-black text-white">Format A: DLT SMS</span>
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${isDltValid ? 'bg-sky-500/20 text-sky-300' : 'bg-red-500/20 text-red-300'}">
                ${smsLen} / 160 Chars
              </span>
            </div>

            <!-- Handset Simulation Screen -->
            <div class="bg-gray-900/90 rounded-xl p-3.5 border border-gray-800 text-xs text-gray-200 leading-relaxed font-sans shadow-inner">
              <div class="text-[10px] text-gray-400 font-mono mb-2 flex items-center justify-between">
                <span>Sender: <b>VK-RANIHM</b></span>
                <span>TRAI DLT 160</span>
              </div>
              <p class="whitespace-pre-wrap">${copyData.sms_tamil}</p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Channel: GSM Bulk DLT</span>
            <button onclick="navigator.clipboard.writeText(\`${copyData.sms_tamil.replace(/`/g, '\\`')}\`); alert('Copied SMS!');" class="text-sky-400 hover:text-sky-300 font-bold transition flex items-center gap-1">
              <i class="fa-regular fa-copy"></i> Copy SMS
            </button>
          </div>
        </div>

        <!-- FORMAT B: WHATSAPP HIGH-CONVERTING MESSAGE -->
        <div class="bg-gray-950/80 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><i class="fa-brands fa-whatsapp text-sm"></i></span>
                <span class="text-xs font-black text-white">Format B: WhatsApp Blast</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                1-Tap Deep Link
              </span>
            </div>

            <!-- WhatsApp Chat Bubble Mockup -->
            <div class="bg-[#0b141a] rounded-xl p-4 border border-[#202c33] text-xs text-gray-200 leading-relaxed font-sans shadow-inner">
              <div class="bg-[#005c4b] p-3.5 rounded-2xl rounded-tl-none shadow text-[#e9edef] whitespace-pre-wrap selection:bg-emerald-600">${copyData.whatsapp_tamil}</div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Channel: WhatsApp Cloud API</span>
            <button onclick="navigator.clipboard.writeText(\`${copyData.whatsapp_tamil.replace(/`/g, '\\`')}\`); alert('Copied WhatsApp Message!');" class="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1">
              <i class="fa-regular fa-copy"></i> Copy Message
            </button>
          </div>
        </div>

        <!-- FORMAT C: INSTAGRAM REEL / POST CAPTION -->
        <div class="bg-gray-950/80 border border-pink-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-pink-500/10 text-pink-400"><i class="fa-brands fa-instagram text-sm"></i></span>
                <span class="text-xs font-black text-white">Format C: Instagram Feed / Reel</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300">
                Local Hashtags
              </span>
            </div>

            <!-- Instagram Post Simulation -->
            <div class="bg-gray-900/90 rounded-xl p-3.5 border border-gray-800 text-xs text-gray-200 leading-relaxed font-sans shadow-inner max-h-[360px] overflow-y-auto">
              <div class="flex items-center gap-2 pb-2 mb-2 border-b border-gray-800/80">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
                  <div class="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-black text-white">R</div>
                </div>
                <span class="font-bold text-white text-[11px]">ranihypermarket_bodi</span>
              </div>
              <p class="whitespace-pre-wrap text-gray-300">${copyData.instagram_caption}</p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
            <span>Channel: Instagram Graph API</span>
            <button onclick="navigator.clipboard.writeText(\`${copyData.instagram_caption.replace(/`/g, '\\`')}\`); alert('Copied Instagram Caption!');" class="text-pink-400 hover:text-pink-300 font-bold transition flex items-center gap-1">
              <i class="fa-regular fa-copy"></i> Copy Caption
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Main Pipeline Entrypoint: Agent 2: Generative Vernacular Copywriter
 */
async function generateVernacularCampaign(payload = {}) {
  const m = computeMetrics(payload);
  const voiceConfig = loadRegionalVoiceConfig();
  const sysInst = voiceConfig.gemini_system_prompt_master?.system_instructions || '';
  const tpl = m.templateContext?.config || {};

  // Strict prompt with cultural dictionary guardrails for Google Gemini 2.5 / 3.0
  const geminiPrompt = `${sysInst}

INPUT PRODUCT & PROMO PAYLOAD:
- Product Name: ${m.productName}
- Standard MRP: ₹${m.mrp}
- Special Promo Price: ₹${m.promoPrice} (Direct Savings: ₹${m.savingsAmount}, ${m.discountPct}% OFF)
- Unit Gross Margin: ${m.marginPct}%
- Available Stock Units: ${m.stockUnits} (${m.isScarcity ? 'LOW STOCK URGENCY' : 'ABUNDANT WHOLESALE STOCK'})
- Festival / Campaign Context: ${m.festivalContext}
- Target Daypart / Tone Template: ${m.templateContext?.key}
- Tone Headline Requirement: "${tpl.headline || 'மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா...'}"
- Culinary Tradition Anchors: Chettinad/Madurai Kuzhambu, Filter Coffee Decoction, Sunday Mutton/Chicken Meal Prep, Bodi Cardamom, Cumbum Panneer Grapes
- Store Order URL: ${m.storeUrl}
- Store Phone: ${m.storePhone}

OUTPUT REQUIREMENT:
Output strictly valid JSON with exact keys:
{
  "sms_tamil": "160-char DLT SMS in Tamil (Mention போடி ராணி மார்க்கெட், item, MRP, Offer price, phone 7708834547)",
  "whatsapp_tamil": "High-converting WhatsApp message in Tamil with opening headline '${tpl.headline || 'மாதாந்திர மளிகை பட்ஜெட் சேமிப்பு திருவிழா...'}' and local trade dialect",
  "instagram_caption": "Instagram Reel/Post caption with local hashtags (#Bodinayakanur, #CardamomCity, #TheniRetail, #RaniHyperMarket)"
}`;

  const config = loadAiConfig();
  let generatedData = null;

  if (config.enabled && config.useCloudIfAvailable && (config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
    try {
      generatedData = await callGeminiCloudApi(geminiPrompt, config);
    } catch (e) {
      console.warn('Gemini cloud call fallback triggered:', e.message);
    }
  }

  // If Cloud AI is unavailable or failed, run autonomous regional vernacular synthesis engine
  if (!generatedData || !generatedData.sms_tamil || !generatedData.whatsapp_tamil || !generatedData.instagram_caption) {
    generatedData = synthesizeRegionalTamilCopy(m);
  }

  // Ensure DLT compliance on sms_tamil
  generatedData.sms_tamil = enforceDltLimit(generatedData.sms_tamil, m);

  // Generate multi-channel preview render HTML
  const preview_render = buildPreviewRender(generatedData, m);

  return {
    success: true,
    metadata: {
      agent: 'Agent 2: Generative Vernacular Copywriter & Cultural Linguist',
      version: '2.5.0-RegionalVoice',
      locale: 'Bodinayakanur (Cardamom City), Theni District, Tamil Nadu',
      template_activated: m.templateContext?.key,
      headline_activated: tpl.headline,
      engine: config.geminiApiKey ? 'Google Gemini 2.5/3.0 Cloud Pipeline' : 'Autonomous Regional Vernacular Synthesis Engine',
      generated_at: new Date().toISOString()
    },
    payload_input: {
      productName: m.productName,
      mrp: m.mrp,
      promoPrice: m.promoPrice,
      savingsAmount: m.savingsAmount,
      discountPct: m.discountPct,
      marginPct: m.marginPct,
      stockUnits: m.stockUnits,
      festivalContext: m.festivalContext,
      template: m.templateContext?.key
    },
    template_used: m.templateContext?.key,
    sms_tamil: generatedData.sms_tamil,
    whatsapp_tamil: generatedData.whatsapp_tamil,
    instagram_caption: generatedData.instagram_caption,
    preview_render: preview_render
  };
}

module.exports = {
  generateVernacularCampaign,
  synthesizeRegionalTamilCopy,
  computeMetrics,
  enforceDltLimit,
  loadRegionalVoiceConfig,
  detectRegionalTemplate
};
