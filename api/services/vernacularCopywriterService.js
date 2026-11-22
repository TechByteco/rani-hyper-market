/**
 * Agent 2: Generative Vernacular Copywriter
 * Customized for Bodinayakanur & Theni District Consumers
 * Powered by Google Gemini 2.5 / 3.0 API with Autonomous Regional Dialect Synthesis Engine
 *
 * Requirements:
 * 1. Payload: { productName, mrp, promoPrice, marginPct, stockUnits, festivalContext }
 * 2. Guardrails: No literal machine-translated English (e.g. "மகிழ்ச்சியான சேமிப்பு" is strictly prohibited).
 *    Warm colloquial Tamil grocery trade dialect ("நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டில்", "இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு").
 * 3. Synchronized Formats:
 *    - Format A: 160-char DLT-compliant SMS (sms_tamil)
 *    - Format B: High-converting WhatsApp message (whatsapp_tamil)
 *    - Format C: Instagram Reel / Post caption with local hashtags (instagram_caption)
 * 4. Output: JSON { sms_tamil, whatsapp_tamil, instagram_caption, preview_render }
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, '..', 'ai-config.json');

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

  return {
    productName,
    mrp,
    promoPrice,
    savingsAmount,
    discountPct,
    marginPct,
    stockUnits,
    festivalContext,
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

  // Compact fallback format guaranteed to fit within 160 chars
  const compact = `போடி ராணி மார்க்கெட்: ${m.productName.slice(0, 30)} MRP ₹${m.mrp} ஆஃபர் ₹${m.promoPrice}! மிச்சம் ₹${m.savingsAmount}. இலவச டெலிவரி! ஆர்டர்: 7708834547 / rani-hyper-market.vercel.app`;
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
                return;
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
  // Scarcity or volume callout
  let urgencyClause = '📦 புதிய ஸ்டாக் வந்துள்ளது - குடும்பத்தோடு வந்து அள்ளிச் செல்லுங்கள்!';
  if (m.isScarcity) {
    urgencyClause = `⚡ கடைசி ${m.stockUnits} பேக்குகள் மட்டுமே இருப்பு உள்ளது! முந்துங்கள்!`;
  }

  // Festival relevance
  let festivalCallout = '';
  if (m.festivalContext && /karthigai|deepam/i.test(m.festivalContext)) {
    festivalCallout = '🪔 கார்த்திகை தீபத்திருநாள் சிறப்பு பாயாசம், அப்பம் மற்றும் பலகாரங்களுக்கு தேவையான முதல் தர மளிகை!';
  } else if (m.festivalContext && /diwali|deepavali/i.test(m.festivalContext)) {
    festivalCallout = '🪔 தீபாவளி பலகாரங்கள் மற்றும் அதிரசம் செய்ய நயமான தரமான மளிகை பொருட்கள்!';
  } else if (m.festivalContext && /pongal/i.test(m.festivalContext)) {
    festivalCallout = '🌾 தைப் பொங்கல் நல்வாழ்த்துகள்! புதுப்பானை பொங்கலுக்கு நயமான புது பச்சரிசி & வெல்லம் ஆஃபர்!';
  } else if (m.festivalContext) {
    festivalCallout = `🎉 ${m.festivalContext} கொண்டாட்டத்திற்கு ராணி மார்க்கெட்டின் சிறப்பு அதிரடி தள்ளுபடி!`;
  }

  // Format A: 160-Character DLT-Compliant SMS
  // Must be <= 160 chars and strictly adhere to TRAI DLT formats
  let sms_tamil = `போடி ராணி மார்க்கெட்: ${m.productName.slice(0, 32)} MRP ₹${m.mrp} ஆஃபர் ₹${m.promoPrice}! சேமிப்பு ₹${m.savingsAmount}. போடிக்குள் இலவச டெலிவரி! ஆர்டர்: 7708834547 / rani-hyper-market.vercel.app`;
  sms_tamil = enforceDltLimit(sms_tamil, m);

  // Format B: High-Converting WhatsApp Message
  const whatsapp_tamil = `🌾 *நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டின் அதிரடி சலுகை!* 🌾
_இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு திருவிழா!_

வணக்கம் போடி மக்களே! நமது குடும்பங்களுக்கு தேவையான முதல் தர மளிகை பொருட்கள் இப்போது நேரடி விலை குறைப்பில் உங்கள் ராணி மார்க்கெட்டில்!

✨ *பொருள்:* ${m.productName}
💰 *MRP விலை:* ~₹${m.mrp}~
🔥 *சிறப்பு ஆஃபர் விலை:* *₹${m.promoPrice} மட்டுமே!*
🎉 *கைநிறைய மிச்சம்:* *₹${m.savingsAmount} (${m.discountPct}% அதிரடி தள்ளுபடி!)*

${festivalCallout ? festivalCallout + '\n' : ''}${urgencyClause}

*ஏன் நம்ம போடி ராணி மார்க்கெட்?*
✅ 100% முதல் தர நயமான தரம்
✅ கலப்படமில்லாத சுத்தமான வீட்டு மளிகை
✅ போடி நகர் முழுவதும் 30 நிமிடத்தில் இலவச டோர் டெலிவரி! 🚚

👉 *1-டாப்பில் ஆன்லைனில் ஆர்டர் செய்ய:*
${m.storeUrl}

📞 *வாட்ஸ்அப் / போன் ஆர்டருக்கு:* ${m.storePhone}
📍 *நேரில் வர:* ராணி ஹைப்பர் மார்க்கெட், மெயின் ரோடு, போடிநாயக்கனூர்.`;

  // Format C: Instagram Reel / Post Caption
  const instagram_caption = `🌾 போடி மக்களே, உங்க வீட்டு பட்ஜெட்டை மிச்சப்படுத்த ராணி ஹைப்பர் மார்க்கெட்டின் அதிரடி ஆஃபர்! 🌾

நம்ம ஊரு இல்லத்தரசிகளுக்கு தரமும் முக்கியம், பட்ஜெட் சேமிப்பும் முக்கியம்! அதனாலேயே நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டில் ${m.productName} அதிரடி சலுகை விலையில் கிடைக்கிறது!

💰 வழக்கமான MRP: ₹${m.mrp}
🔥 சிறப்பு ஆஃபர் விலை: ₹${m.promoPrice} மட்டுமே!
🎉 கைநிறைய சேமிப்பு: ₹${m.savingsAmount} (${m.discountPct}% நேரடி தள்ளுபடி)

${festivalCallout ? '🪔 ' + festivalCallout : ''}
${m.isScarcity ? `⚡ ஸ்டாக் குறைவாக உள்ளது (${m.stockUnits} மீதம்)! உடனே முந்துங்கள்!` : '📦 அதிக அளவில் இருப்பு உள்ளது - குடும்பத்தோடு வந்து அள்ளிச் செல்லுங்கள்!'}

🚚 போடி நகர் முழுவதும் 30 நிமிடங்களில் உங்கள் வீடு தேடி இலவச டோர் டெலிவரி!
📲 ஆன்லைனில் ஆர்டர் செய்ய: பயோவில் உள்ள லிங்கை கிளிக் செய்யுங்கள் (Link in Bio)
📞 வாட்ஸ்அப் / அழைப்புகளுக்கு: ${m.storePhone}
📍 ராணி ஹைப்பர் மார்க்கெட், மெயின் ரோடு, போடிநாயக்கனூர், தேனி மாவட்டம்.

#Bodinayakanur #TheniRetail #RaniHyperMarket #BodiShopping #TheniDistrict #TheniOffers #TamilGrocery #GroceryDeals #SmartBodiShopper #BodiTown #SavingsOffer #TheniFoodies`;

  return { sms_tamil, whatsapp_tamil, instagram_caption };
}

/**
 * Generate responsive HTML preview rendering multi-channel mockups
 */
function buildPreviewRender(copyData, m) {
  const smsLen = copyData.sms_tamil.length;
  const isDltValid = smsLen <= 160;

  return `
    <div class="space-y-6 text-gray-100 font-sans">
      <!-- Top Campaign Summary Pill -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-indigo-950/50 border border-emerald-500/30">
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Agent 2: Generative Vernacular Copywriter
          </span>
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

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between">
            <span class="text-[10px] text-gray-400 font-medium">Bodi &amp; Theni GSM Bulk SMS</span>
            <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(copyData.sms_tamil)}')); this.innerText='Copied!'; setTimeout(()=>this.innerText='Copy SMS', 2000);" class="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition">
              Copy SMS
            </button>
          </div>
        </div>

        <!-- FORMAT B: WHATSAPP HIGH-CONVERTING MESSAGE PREVIEW -->
        <div class="bg-gray-950/80 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><i class="fa-brands fa-whatsapp text-sm"></i></span>
                <span class="text-xs font-black text-white">Format B: WhatsApp Blast</span>
              </div>
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                1-Tap Order Active
              </span>
            </div>

            <!-- WhatsApp Chat Bubble Simulation -->
            <div class="bg-[#0b141a] rounded-xl p-3 border border-emerald-900/40 text-xs shadow-inner">
              <div class="bg-[#005c4b] text-[#e9edef] rounded-lg p-3 leading-relaxed shadow space-y-2">
                <div class="whitespace-pre-wrap text-[11px] leading-relaxed font-sans">${copyData.whatsapp_tamil.replace(/\*(.*?)\*/g, '<b>$1</b>').replace(/_(.*?)_/g, '<i>$1</i>').replace(/~(.*?)~/g, '<del class="opacity-60">$1</del>')}</div>
                <div class="text-[9px] text-[#8696a0] text-right">10:45 AM • Delivered ✓✓</div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between">
            <a href="https://wa.me/917708834547?text=${encodeURIComponent(copyData.whatsapp_tamil)}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm">
              <i class="fa-brands fa-whatsapp"></i>
              <span>Send WhatsApp</span>
            </a>
            <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(copyData.whatsapp_tamil)}')); this.innerText='Copied!'; setTimeout(()=>this.innerText='Copy WA', 2000);" class="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition">
              Copy WA
            </button>
          </div>
        </div>

        <!-- FORMAT C: INSTAGRAM REEL / POST CAPTION PREVIEW -->
        <div class="bg-gray-950/80 border border-purple-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400"><i class="fa-brands fa-instagram text-xs"></i></span>
                <span class="text-xs font-black text-white">Format C: Instagram Post</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300">
                #Bodinayakanur
              </span>
            </div>

            <!-- Instagram Feed Post Mockup -->
            <div class="bg-black/90 rounded-xl p-3 border border-gray-800 text-xs text-gray-200 leading-relaxed font-sans shadow-inner space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-[9px] font-bold text-white">R</div>
                </div>
                <span class="text-xs font-bold text-white">rani_hypermarket_bodi</span>
              </div>
              <div class="max-h-48 overflow-y-auto pr-1 text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed custom-scrollbar">
                ${copyData.instagram_caption}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between">
            <span class="text-[10px] text-gray-400">Post / Reel / Story</span>
            <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(copyData.instagram_caption)}')); this.innerText='Copied!'; setTimeout(()=>this.innerText='Copy IG', 2000);" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-bold text-white transition">
              Copy IG Caption
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

  // Strict prompt with guardrails for Google Gemini 2.5 / 3.0
  const geminiPrompt = `You are "Agent 2: Generative Vernacular Copywriter", the master retail advertising copywriter for "Rani Hyper Market" located on Main Road, Bodinayakanur, Theni District, Tamil Nadu.

INPUT PRODUCT & PROMO PAYLOAD:
- Product Name: ${m.productName}
- Standard MRP: ₹${m.mrp}
- Special Promo Price: ₹${m.promoPrice} (Direct Savings: ₹${m.savingsAmount}, ${m.discountPct}% OFF)
- Unit Gross Margin: ${m.marginPct}%
- Available Stock Units: ${m.stockUnits} (${m.isScarcity ? 'LOW STOCK URGENCY' : 'ABUNDANT WHOLESALE STOCK'})
- Festival / Campaign Context: ${m.festivalContext}
- Store Order URL: ${m.storeUrl}
- Store Phone: ${m.storePhone}

STRICT PROMPT GUARDRAILS & WRITING RULES:
1. BAN ON LITERAL MACHINE TRANSLATIONS:
   - NEVER write "மகிழ்ச்சியான சேமிப்பு" (Happy Savings).
   - NEVER write "தயவுசெய்து வாங்கவும்" (Please buy).
   - NEVER write "சூடான சலுகைகள்" (Hot deals).
   - NEVER write "அழுத்தவும் இங்கே" (Click here).
2. AUTHENTIC BODINAYAKANUR & THENI VERNACULAR TRADE DIALECT:
   - Use warm, colloquial, genuine Tamil grocery trade phrases:
     * "நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டில்..."
     * "இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு திருவிழா!"
     * "முதல் தர நயமான பொன்னி அரிசி" / "கலப்படமில்லாத சுத்தமான மளிகை"
     * "கைநிறைய மிச்சம்!", "அதிரடி விலை குறைப்பு!", "அள்ளிச் செல்லுங்கள்!"
     * "போடி நகர் முழுவதும் 30 நிமிடங்களில் உங்கள் வீடு தேடி இலவச டோர் டெலிவரி! 🚚"
3. GENERATE EXACTLY THREE SYNCHRONIZED COPY FORMATS:
   - Format A (sms_tamil): STRICTLY <= 160 characters. Must be DLT-compliant with TRAI India regulations. Mention போடி ராணி மார்க்கெட், product, MRP, Promo price, and order phone 7708834547.
   - Format B (whatsapp_tamil): High-converting WhatsApp blast with bold prices (*₹...*), strikethroughs (~₹...~), bullet points, and 1-tap ordering link: ${m.storeUrl}.
   - Format C (instagram_caption): Engaging social caption with hook, festival context, store location (Main Road, Bodinayakanur), and mandatory hashtags: #Bodinayakanur #TheniRetail #RaniHyperMarket #BodiShopping #TheniDistrict #TamilGrocery.

OUTPUT REQUIREMENT:
Output strictly valid JSON with exact keys:
{
  "sms_tamil": "160-char DLT SMS in Tamil",
  "whatsapp_tamil": "High-converting WhatsApp message in Tamil",
  "instagram_caption": "Instagram Reel/Post caption with hashtags"
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
      agent: 'Agent 2: Generative Vernacular Copywriter',
      version: '2.5.0-Production',
      locale: 'Bodinayakanur, Theni District, Tamil Nadu',
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
      festivalContext: m.festivalContext
    },
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
  enforceDltLimit
};
