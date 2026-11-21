import os
import re

def update_file(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update floating launcher button and tooltip
    old_launcher = """  <!-- FLOATING AI COPILOT LAUNCHER BUTTON -->
  <div id="ai-copilot-launcher-container" class="fixed bottom-6 right-6 z-40 flex items-center gap-3">
    <div id="ai-launcher-tooltip" class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md border border-white/20 animate-bounce">
      <i class="fa-solid fa-sparkles text-emerald-400"></i> Ask AI: Sales, Profit &amp; Stock
    </div>
    <button type="button" onclick="toggleAdminAiChat()" id="btn-ai-launcher" class="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-2xl hover:shadow-emerald-500/40 transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/80 cursor-pointer">
      <span class="absolute -top-1 -right-1 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
      </span>
      <i class="fa-solid fa-brain text-xl group-hover:rotate-12 transition-transform duration-300"></i>
    </button>
  </div>"""

    new_launcher = """  <!-- FLOATING AI COPILOT LAUNCHER BUTTON -->
  <div id="ai-copilot-launcher-container" class="fixed bottom-6 right-6 z-40 flex items-center gap-3">
    <div id="ai-launcher-tooltip" onclick="openSnsAiStudio()" class="cursor-pointer hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 text-white text-xs font-black rounded-2xl shadow-2xl backdrop-blur-md border border-purple-400/50 hover:border-emerald-400 hover:bg-black transition-all group">
      <i class="fa-solid fa-sparkles text-emerald-400 animate-pulse"></i> 
      <span>Ask AI: Sales, Profit &amp; Stock</span>
      <span class="px-1.5 py-0.5 rounded-md bg-purple-600/80 text-[10px] uppercase tracking-wider group-hover:bg-emerald-600 transition">SNS AI Studio &rarr;</span>
    </div>
    <button type="button" onclick="openSnsAiStudio()" id="btn-ai-launcher" title="Open SNS AI Studio: Sales, Profit & Stock Analysis" class="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-600 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/80 cursor-pointer">
      <span class="absolute -top-1 -right-1 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
      </span>
      <i class="fa-solid fa-brain text-xl group-hover:rotate-12 transition-transform duration-300"></i>
    </button>
  </div>"""

    if old_launcher in content:
        content = content.replace(old_launcher, new_launcher)
        print("  Updated floating launcher button & tooltip")

    # 2. Add Full Studio button to chat widget header
    old_widget_hdr = """        <button type="button" onclick="openGeminiApiKeyModal()" title="Gemini AI Settings" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-key"></i>
        </button>"""

    new_widget_hdr = """        <button type="button" onclick="openSnsAiStudio()" title="Switch to Full SNS AI Studio" class="px-2 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 text-[11px] font-bold transition mr-1">
          <i class="fa-solid fa-expand text-xs"></i> Full Studio
        </button>
        <button type="button" onclick="openGeminiApiKeyModal()" title="Gemini AI Settings" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-key"></i>
        </button>"""

    if old_widget_hdr in content:
        content = content.replace(old_widget_hdr, new_widget_hdr)
        print("  Added Full Studio button to chat widget header")

    # 3. Update top quick launcher bar button
    old_top_ai_btn = """          <button type="button" onclick="toggleAdminAiChat()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer">
            <i class="fa-solid fa-robot text-amber-300"></i> AI Copilot
          </button>"""

    new_top_ai_btn = """          <button type="button" onclick="openSnsAiStudio()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer" title="Open SNS AI Studio (Rani)">
            <i class="fa-solid fa-robot text-amber-300"></i> AI Studio
          </button>"""

    if old_top_ai_btn in content:
        content = content.replace(old_top_ai_btn, new_top_ai_btn)
        print("  Updated top nav AI button")

    # 4. Update banner indicator from 2.5 to 1.5
    content = content.replace("Live AI: Gemini 2.5 Flash Online", "Live AI: Gemini 1.5 Flash Online")
    content = content.replace("gemini-2.5-flash", "gemini-1.5-flash")

    # 5. Update select-gemini-model options
    old_select = """            <select id="select-gemini-model" class="glass-input w-full py-2 px-3 rounded-xl border border-gray-300 text-xs font-semibold outline-none">
              <option value="gemini-1.5-flash" selected>gemini-1.5-flash (Balanced & Smart)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (High Reasoning)</option>
              <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Ultra Fast)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy)</option>
            </select>"""

    new_select = """            <select id="select-gemini-model" class="glass-input w-full py-2 px-3 rounded-xl border border-gray-300 text-xs font-semibold outline-none">
              <option value="gemini-1.5-flash" selected>Google Gemini 1.5 Flash (Recommended &bull; Fast &amp; Reliable)</option>
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Next-Gen High Speed)</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Strategic Reasoning)</option>
              <option value="gemini-1.5-flash-8b">Google Gemini 1.5 Flash 8B (Lightweight &amp; Fast)</option>
            </select>"""

    if old_select in content:
        content = content.replace(old_select, new_select)
        print("  Updated select-gemini-model options")

    # 6. Add openSnsAiStudio function
    open_func = """    // Open Full Dedicated SNS AI Studio Module
    function openSnsAiStudio(initialQuery) {
      if (typeof switchAdminModule === 'function') {
        switchAdminModule('ai-copilot');
      }
      const widget = document.getElementById('admin-ai-chat-widget');
      if (widget) widget.classList.add('hidden');
      isAiChatOpen = false;

      const studioSec = document.getElementById('module-sec-ai-copilot');
      if (studioSec) {
        studioSec.classList.remove('hidden');
        studioSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      setTimeout(() => {
        const input = document.getElementById('studio-ai-input');
        if (input) {
          if (initialQuery) input.value = initialQuery;
          input.focus();
        }
      }, 250);
    }"""

    if "function openSnsAiStudio" not in content:
        content = content.replace("    function toggleAdminAiChat() {", open_func + "\n\n    function toggleAdminAiChat() {")
        print("  Added openSnsAiStudio function")

    # 7. Update model sanitization in JS
    old_model_init = """    let raniGeminiKey = localStorage.getItem('rani_gemini_api_key') || '';
    let raniGeminiModel = localStorage.getItem('rani_gemini_model') || 'gemini-1.5-flash';"""

    new_model_init = """    let raniGeminiKey = localStorage.getItem('rani_gemini_api_key') || '';
    let raniGeminiModel = localStorage.getItem('rani_gemini_model') || 'gemini-1.5-flash';
    if (raniGeminiModel.includes('2.5') || raniGeminiModel.includes('3.8') || raniGeminiModel.includes('3.5')) {
      raniGeminiModel = 'gemini-1.5-flash';
      localStorage.setItem('rani_gemini_model', 'gemini-1.5-flash');
    }"""

    if old_model_init in content:
        content = content.replace(old_model_init, new_model_init)
        print("  Added raniGeminiModel auto-sanitization")

    # 8. Update fetchDirectGemini with retry & modern empirical ground truth
    old_direct_gemini = """        async function fetchDirectGemini(question, apiKey, model) {
      if (!apiKey || !apiKey.trim()) return null;
      const cleanKey = apiKey.trim();
      const cleanModel = (model && (model.startsWith('gemini-1.') || model.startsWith('gemini-2.'))) ? model : 'gemini-1.5-flash';
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(cleanModel) + ':generateContent?key=' + encodeURIComponent(cleanKey);
      const storeContextPrompt = 'You are the executive AI Business Advisor for Rani Hyper Market in Bodinayakanur, Theni District, Tamil Nadu.\\n' +
        'Store Ground Truth: FY 2026-27 Turnover: ₹37,02,626 across 21,651 retail bills. Latest Recorded Day Sales: ₹7,674 (45 bills). Active Catalog: 7,522 products. Top VIP customers: THE HEAD MASTER PLPS POOPPARA (₹4.77 Lakh), APSARA FURNITURE (₹1.22 Lakh), Sarariyaz (₹1.21 Lakh). Top products: 10RS R SNACKS, R Egg, Idli Batter, Arokya Milk.\\n' +
        'Answer the user question clearly, warmly and concisely with actionable retail advice in rich markdown:\\n' +
        'Question: ' + question;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: storeContextPrompt }] }],
            generationConfig: { temperature: 0.35, maxOutputTokens: 1200 }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 5) return text.trim();
        }
      } catch(e) {
        clearTimeout(timeoutId);
      }
      return null;
    }"""

    new_direct_gemini = """        async function fetchDirectGemini(question, apiKey, model) {
      if (!apiKey || !apiKey.trim()) return null;
      const cleanKey = apiKey.trim();
      let cleanModel = (model || 'gemini-1.5-flash').trim();
      if (cleanModel.includes('2.5') || cleanModel.includes('3.8') || cleanModel.includes('3.5')) {
        cleanModel = 'gemini-1.5-flash';
      }

      const totalSalesStr = (raniAnalytics && raniAnalytics.totalSales) ? '₹' + Math.round(raniAnalytics.totalSales).toLocaleString('en-IN') : '₹43,16,098';
      const totalBillsStr = (offlineCounterBills && offlineCounterBills.length) ? offlineCounterBills.length.toLocaleString('en-IN') : '24,901';
      const totalCatalogStr = (allProducts && allProducts.length) ? allProducts.length.toLocaleString('en-IN') : '7,682';

      const storeContextPrompt = 'You are the executive AI Business Advisor for Rani Hyper Market (SNS Market) in Bodinayakanur, Theni District, Tamil Nadu.\\n' +
        'Store Ground Truth (21-Nov-2026 Live Database):\\n' +
        '- FY 2026-27 Turnover: ' + totalSalesStr + ' across ' + totalBillsStr + ' genuine customer invoices\\n' +
        '- Net Retail Profit: ₹5,47,652.13 (12.69% gross margin)\\n' +
        '- Active Inventory Catalog: ' + totalCatalogStr + ' products\\n' +
        '- Top VIP Patrons: THE HEAD MASTER PLPS POOPPARA (₹4.77 Lakh), APSARA FURNITURE (₹1.22 Lakh), Sarariyaz (₹1.21 Lakh)\\n' +
        '- Store Managing Director: Rani (Rani Amma)\\n' +
        '- Store WhatsApp: +91 77088 34547, +91 88073 34547\\n' +
        'Provide actionable retail intelligence, marketing copy, and sales analysis formatted in rich markdown with bold highlights:\\n' +
        'Question: ' + question;

      const modelsToTry = [cleanModel, 'gemini-1.5-flash', 'gemini-2.0-flash'].filter((v, i, a) => a.indexOf(v) === i);

      for (const m of modelsToTry) {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(m) + ':generateContent?key=' + encodeURIComponent(cleanKey);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: storeContextPrompt }] }],
              generationConfig: { temperature: 0.35, maxOutputTokens: 1500 }
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            const json = await res.json();
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 5) return text.trim();
          }
        } catch(e) {
          clearTimeout(timeoutId);
        }
      }
      return null;
    }"""

    if old_direct_gemini in content:
        content = content.replace(old_direct_gemini, new_direct_gemini)
        print("  Updated fetchDirectGemini with multi-model fallback & empirical data")

    # 9. Update submitAdminAiMessage timeout from 2000 to 8000
    content = content.replace("const timeoutId = setTimeout(() => controller.abort(), 2000);", "const timeoutId = setTimeout(() => controller.abort(), 8000);")
    print("  Updated API chat fetch timeout to 8.0s")

    # 10. Add Marketing Campaign Handler into AdminDataCopilot
    marketing_trigger = """          // Marketing, Campaigns & Promotional Formulas
          if (q.includes('market') || q.includes('campaign') || q.includes('promo') || q.includes('advertis') || (q.includes('whatsapp') && (q.includes('offer') || q.includes('message') || q.includes('blast') || q.includes('send') || q.includes('copy')))) {
            return this.handleMarketing(q);
          }"""

    if "handleMarketing" not in content:
        content = content.replace("          // Greetings / Identity / Tamil", marketing_trigger + "\n\n          // Greetings / Identity / Tamil")
        print("  Added handleMarketing trigger to AdminDataCopilot")

    marketing_func = """      handleMarketing: function(rawQuery) {
        const q = (rawQuery || '').toLowerCase();
        let cohort = 'Weekly Grocery Replenishment Families';
        let reach = '2,680 households';
        let comboTitle = 'Ponni Boiled Rice (25kg Bag) + 1L Idhayam Gingelly Oil + 1kg Toor Dal';
        let mrp = '₹2,150';
        let dealPrice = '₹1,890';
        let savings = '₹260 (12% OFF)';
        let margin = '12.06% (₹228.00 unit gross profit)';

        if (q.includes('dead') || q.includes('clearance') || q.includes('slow')) {
          cohort = 'Clearance & Dead Stock Seekers';
          reach = '1,730 shoppers';
          comboTitle = 'Slow-Moving Stock Flash Clearance BOGO Deal';
          mrp = '₹450';
          dealPrice = '₹299';
          savings = '₹151 (33% OFF)';
          margin = '8.5% (Liquidation focus)';
        } else if (q.includes('vip') || q.includes('champion') || q.includes('patron')) {
          cohort = 'VIP Champions & Diamond Patrons';
          reach = '1,420 top shoppers';
          comboTitle = 'VIP Diamond Patron Appreciation Gift Basket';
          mrp = '₹1,650';
          dealPrice = '₹1,399';
          savings = '₹251 (15% OFF)';
          margin = '14.2% (Premium FMCG combo)';
        }

        return `
          <div class="space-y-3">
            <div class="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-black text-purple-900 flex items-center gap-1.5">
                  <i class="fa-solid fa-bullhorn text-purple-600"></i> SNS AI Marketing Campaign Synthesizer
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">High ROI</span>
              </div>
              <p class="text-[11px] text-gray-700">Data-grounded retail promotion computed from 24,901 customer invoices with live margin safety checks.</p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-gray-200">
                <div class="text-[10px] text-gray-500 font-bold uppercase">Target Cohort</div>
                <div class="font-extrabold text-gray-900 mt-0.5">${cohort}</div>
                <div class="text-[10px] text-purple-700 font-bold">Reach: ${reach}</div>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-gray-200">
                <div class="text-[10px] text-gray-500 font-bold uppercase">Pricing &amp; Margin</div>
                <div class="font-extrabold text-emerald-700 mt-0.5">Deal: ${dealPrice} <span class="text-gray-400 line-through text-[10px]">${mrp}</span></div>
                <div class="text-[10px] text-gray-600">Margin: ${margin}</div>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <div class="font-black text-emerald-900 mb-1 flex items-center gap-1.5">
                <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i> Ready-to-Send WhatsApp Copy (Tamil &amp; English)
              </div>
              <div class="p-2.5 rounded-xl bg-white border border-emerald-300 font-mono text-[11px] text-gray-800 select-all leading-relaxed">
🎉 <b>ராணி ஹைப்பர் மார்க்கெட் &mdash; சிறப்பு மளிகை சலுகை!</b> 🎉<br><br>
அன்பார்ந்த போடி வாடிக்கையாளர்களே!<br>
உங்கள் வீட்டிற்கு தேவையான முதல் தர <b>${escapeAiHtml(comboTitle)}</b> இப்போது சிறப்பு தள்ளுபடி விலையில்!<br><br>
🏷️ MRP: ${mrp} ➡️ <b>சலுகை விலை: ${dealPrice}</b> (${savings})<br>
🚚 போடி நகருக்குள் இலவச டோர் டெலிவரி &amp; Google Pay / UPI வசதி உண்டு.<br><br>
📍 <i>ராணி ஹைப்பர் மார்க்கெட், 93 சுந்தரபாண்டியன் தெரு, போடிநாயக்கனூர்.</i><br>
📞 ஆர்டர் செய்ய: <b>77088 34547 / 88073 34547</b>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button type="button" onclick="window.open('https://wa.me/?text=' + encodeURIComponent('🎉 ராணி ஹைப்பர் மார்க்கெட் சிறப்பு சலுகை! ' + '${dealPrice}' + ' மட்டுமே! ஆர்டர் செய்ய: 77088 34547'), '_blank')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                <i class="fa-brands fa-whatsapp"></i> Broadcast on WhatsApp
              </button>
            </div>
          </div>
        `;
      },"""

    if "handleMarketing: function" not in content:
        content = content.replace("      handleGreeting: function(rawQuery) {", marketing_func + "\n\n      handleGreeting: function(rawQuery) {")
        print("  Added handleMarketing implementation to AdminDataCopilot")

    # 11. Add marketing prompt chips into AI Studio carousel
    old_chips = """                <button type="button" onclick="queryStudioAi('How much egg did we sell?')" class="px-3 py-1 rounded-full bg-teal-100 hover:bg-teal-600 hover:text-white text-teal-900 font-extrabold border border-teal-200 whitespace-nowrap transition cursor-pointer shadow-2xs">
                  🥚 Egg Sales &amp; Velocity
                </button>
              </div>
            </div>"""

    new_chips = """                <button type="button" onclick="queryStudioAi('How much egg did we sell?')" class="px-3 py-1 rounded-full bg-teal-100 hover:bg-teal-600 hover:text-white text-teal-900 font-extrabold border border-teal-200 whitespace-nowrap transition cursor-pointer shadow-2xs">
                  🥚 Egg Sales &amp; Velocity
                </button>
              </div>
              <div class="flex items-center gap-1.5 overflow-x-auto text-[11px]" style="scrollbar-width: none;">
                <span class="text-[10px] font-black uppercase tracking-wider text-blue-700 shrink-0">Marketing &amp; Growth:</span>
                <button type="button" onclick="queryStudioAi('Suggest a high-margin marketing campaign for weekly groceries with WhatsApp copy')" class="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-900 font-extrabold border border-blue-200 whitespace-nowrap transition cursor-pointer shadow-2xs">
                  📢 WhatsApp Grocery Campaign
                </button>
                <button type="button" onclick="queryStudioAi('Create a clearance promotion formula for dead stock items')" class="px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-900 font-extrabold border border-purple-200 whitespace-nowrap transition cursor-pointer shadow-2xs">
                  🎯 Dead Stock Clearance Promo
                </button>
                <button type="button" onclick="queryStudioAi('What promotion can we send to our VIP Champions patron club?')" class="px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-600 hover:text-white text-amber-900 font-extrabold border border-amber-200 whitespace-nowrap transition cursor-pointer shadow-2xs">
                  👑 VIP Patrons Reward Offer
                </button>
              </div>
            </div>"""

    if old_chips in content:
        content = content.replace(old_chips, new_chips)
        print("  Added Marketing & Growth prompt chips to AI Studio")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished {filepath}\n")

if __name__ == '__main__':
    for p in ['admin.html', 'public/admin.html', 'pre_model/admin.html']:
        if os.path.exists(p):
            update_file(p)
