import re

print("=== INJECTING AGENT 2: GENERATIVE VERNACULAR COPYWRITER INTO ai-analytics.html ===")

agent2_html = """
    <!-- ========================================================================= -->
    <!-- AGENT 2: GENERATIVE VERNACULAR COPYWRITER (GOOGLE GEMINI 2.5 / 3.0) -->
    <!-- ========================================================================= -->
    <div id="agent2-copywriter-section" class="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
      <div class="absolute -top-16 -right-16 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header & Status Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Agent 2: Generative Vernacular Copywriter
            </span>
            <span class="text-xs text-gray-400 font-medium">Google Gemini 2.5 / 3.0 Regional Pipeline</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Bodinayakanur &amp; Theni Trade Dialect Active
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Strict Ban: No Literal Machine Translations ❌
            </span>
          </div>
          <h2 class="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>✍️ Multi-Channel Vernacular Promotion Studio</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1 max-w-3xl">
            Generates 3 synchronized promotional campaigns per SKU in colloquial Tamil grocery dialect (<i>"நம்ம போடி ராணி ஹைப்பர் மார்க்கெட்டில்", "இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு"</i>): <b>160-char DLT-compliant SMS</b>, <b>High-Converting WhatsApp Blast</b>, and <b>Instagram Reel / Post Caption</b> with local hashtags.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <a href="/api/copywriter/generate?productName=Ponni+Rice+25kg&mrp=1450&promoPrice=1299" target="_blank" class="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 border border-gray-700 transition flex items-center gap-1.5">
            <i data-lucide="code" class="w-4 h-4 text-purple-400"></i>
            <span>REST API Endpoint</span>
          </a>
        </div>
      </div>

      <!-- Quick Preset Selector Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span class="text-gray-400 font-bold shrink-0">Quick SKU Presets:</span>
        <button onclick="loadCopywriterPreset('முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ பை)', 1450, 1299, 14.5, 85, 'கார்த்திகை தீபம் 2026 சிறப்பு ஆஃபர்')" class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shrink-0 font-medium transition">
          🍚 Ponni Boiled Rice 25kg (₹1,299)
        </button>
        <button onclick="loadCopywriterPreset('1 Ltr Udhaya Krishna Ghee + 1KG Cardamom Big Combo', 4450, 4227, 16.0, 18, 'கார்த்திகை தீபத்திருநாள் நெய் தீபம் & பலகார ஆஃபர்')" class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-300 border border-amber-500/30 shrink-0 font-medium transition">
          🪔 Ghee + Cardamom Deepam Combo (₹4,227)
        </button>
        <button onclick="loadCopywriterPreset('Gold Winner Sunflower Oil (1 Litre Pouch)', 145, 128, 11.2, 140, 'வாராந்திர சமையல் பட்ஜெட் அதிரடி ஆஃபர்')" class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shrink-0 font-medium transition">
          🌻 Sunflower Oil 1L (₹128)
        </button>
        <button onclick="loadCopywriterPreset('1KG Kuthuraivali Rice + 1KG Red Rice Organic Combo', 210, 199, 15.0, 35, 'பாரம்பரிய நவதானிய உணவுத் திருவிழா')" class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shrink-0 font-medium transition">
          🌾 Millet & Red Rice (₹199)
        </button>
      </div>

      <!-- Campaign Generator Form Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 bg-gray-950/70 p-4 rounded-xl border border-gray-800">
        <!-- Input 1: Product Name -->
        <div class="lg:col-span-2 space-y-1">
          <label class="text-[11px] font-bold uppercase text-gray-400">Product Name / Combo (Tamil / English)</label>
          <input type="text" id="c-product-name" value="முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ பை)" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none">
        </div>

        <!-- Input 2: MRP -->
        <div class="space-y-1">
          <label class="text-[11px] font-bold uppercase text-gray-400">MRP (₹)</label>
          <input type="number" id="c-mrp" value="1450" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none">
        </div>

        <!-- Input 3: Promo Deal Price -->
        <div class="space-y-1">
          <label class="text-[11px] font-bold uppercase text-emerald-400">Offer Price (₹)</label>
          <input type="number" id="c-promo-price" value="1299" class="w-full bg-gray-900 border border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-emerald-300 font-bold focus:border-emerald-500 focus:outline-none">
        </div>

        <!-- Input 4: Margin % & Stock -->
        <div class="space-y-1">
          <label class="text-[11px] font-bold uppercase text-gray-400">Margin / Stock</label>
          <div class="grid grid-cols-2 gap-1.5">
            <input type="number" id="c-margin" value="14.5" step="0.1" placeholder="Margin %" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-xs text-white focus:border-purple-500 focus:outline-none" title="Gross Margin %">
            <input type="number" id="c-stock" value="85" placeholder="Stock" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-xs text-white focus:border-purple-500 focus:outline-none" title="Current Stock Units">
          </div>
        </div>

        <!-- Input 5: Festival / Context & Action Button -->
        <div class="space-y-1 flex flex-col justify-between">
          <label class="text-[11px] font-bold uppercase text-amber-400">Festival / Campaign Context</label>
          <input type="text" id="c-festival" value="கார்த்திகை தீபம் 2026 சிறப்பு ஆஃபர்" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none">
        </div>

        <div class="lg:col-span-6 flex items-center justify-between pt-2 border-t border-gray-800">
          <div class="text-[11px] text-gray-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Target Locale: <b>Bodinayakanur, Theni District</b> • Delivery: <b>30-Min Door Delivery</b></span>
          </div>
          <button onclick="generateAgent2Copy()" id="btn-generate-copy" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-black text-white shadow-lg shadow-purple-600/30 transition flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span>Generate 3-Channel Campaign (Gemini 2.5/3.0)</span>
          </button>
        </div>
      </div>

      <!-- Live Generated Output Mockup Container -->
      <div id="agent2-output-container">
        <div class="text-center py-10 bg-gray-950/40 rounded-xl border border-gray-800 text-gray-500 text-xs">
          <i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400"></i>
          Loading initial vernacular campaign preview...
        </div>
      </div>

    </div>
"""

with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<!-- LOCAL FESTIVAL DEMAND FORECASTER & EVENT PULSE -->'
if target in content and 'id="agent2-copywriter-section"' not in content:
    content = content.replace(target, agent2_html + '\n\n    ' + target)
    print("Injected Agent 2 Copywriter HTML into ai-analytics.html")
else:
    print("Target not found or already injected.")

# Add JavaScript controller functions for Agent 2
agent2_js = """
    /* ══════════════════════════════════════════════════════════════════
       AGENT 2: GENERATIVE VERNACULAR COPYWRITER CONTROLLER
       ══════════════════════════════════════════════════════════════════ */
    let lastCopywriterResponse = null;

    async function generateAgent2Copy() {
      const btn = document.getElementById('btn-generate-copy');
      const out = document.getElementById('agent2-output-container');
      if (btn) {
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Generating Campaign...';
        btn.disabled = true;
      }
      if (out) {
        out.innerHTML = '<div class="text-center py-12 bg-gray-950/60 rounded-xl border border-gray-800 text-gray-400 text-xs"><i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400"></i> Generating colloquial Tamil promotional campaign via Gemini 2.5/3.0 regional pipeline...</div>';
        if (window.lucide) lucide.createIcons();
      }

      const payload = {
        productName: document.getElementById('c-product-name')?.value || 'முதல் தர பொன்னி புழுங்கல் அரிசி (25 கிலோ)',
        mrp: Number(document.getElementById('c-mrp')?.value || 1450),
        promoPrice: Number(document.getElementById('c-promo-price')?.value || 1299),
        marginPct: Number(document.getElementById('c-margin')?.value || 14.5),
        stockUnits: Number(document.getElementById('c-stock')?.value || 85),
        festivalContext: document.getElementById('c-festival')?.value || 'கார்த்திகை தீபம் 2026 சிறப்பு ஆஃபர்'
      };

      try {
        const res = await fetch('/api/copywriter/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());

        lastCopywriterResponse = res;
        if (res && res.success && res.preview_render) {
          out.innerHTML = res.preview_render;
        } else {
          out.innerHTML = '<div class="p-4 rounded-xl bg-red-500/20 text-red-300 text-xs">Error generating campaign: ' + (res?.error || 'Unknown error') + '</div>';
        }
      } catch (err) {
        out.innerHTML = '<div class="p-4 rounded-xl bg-red-500/20 text-red-300 text-xs">Network error: ' + err.message + '</div>';
      } finally {
        if (btn) {
          btn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i> Generate 3-Channel Campaign (Gemini 2.5/3.0)';
          btn.disabled = false;
        }
        if (window.lucide) lucide.createIcons();
      }
    }

    function loadCopywriterPreset(name, mrp, promo, margin, stock, fest) {
      if (document.getElementById('c-product-name')) document.getElementById('c-product-name').value = name;
      if (document.getElementById('c-mrp')) document.getElementById('c-mrp').value = mrp;
      if (document.getElementById('c-promo-price')) document.getElementById('c-promo-price').value = promo;
      if (document.getElementById('c-margin')) document.getElementById('c-margin').value = margin;
      if (document.getElementById('c-stock')) document.getElementById('c-stock').value = stock;
      if (document.getElementById('c-festival')) document.getElementById('c-festival').value = fest;

      generateAgent2Copy();
      const sec = document.getElementById('agent2-copywriter-section');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Bridge from Agent 1 (Basket Miner & Overstock table) to Agent 2
    window.bridgeToAgent2Copywriter = function(name, mrp, promo, margin, stock, fest) {
      loadCopywriterPreset(name, mrp, promo, margin, stock, fest || 'போடி இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு');
    };
"""

# Append JS controller to content
if "function generateAgent2Copy" not in content:
    content = content.replace("</script>\n</body>", agent2_js + "\n  </script>\n</body>")
    print("Appended Agent 2 Controller functions to ai-analytics.html")

# Auto-invoke generateAgent2Copy in loadAnalytics()
auto_invoke = "generateAgent2Copy();\n        loadBasketAffinityAndVelocity();"
if "generateAgent2Copy();" not in content and "loadBasketAffinityAndVelocity();" in content:
    content = content.replace("loadBasketAffinityAndVelocity();", auto_invoke)
    print("Injected generateAgent2Copy() into loadAnalytics()")

with open('ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('public/ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ai-analytics.html & public/ai-analytics.html successfully.")
