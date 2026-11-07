const fs = require('fs');
const path = require('path');

const marketingPath = path.join(__dirname, '..', 'marketing.html');
let html = fs.readFileSync(marketingPath, 'utf8');

// 1. Upgrade the #campaign-generator section in marketing.html
const oldGeneratorTarget = `      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Controls Panel (Left) -->
        <div class="lg:col-span-6 glass-light p-6 sm:p-8 rounded-3xl shadow-magnificent space-y-6">`;

const newGeneratorSection = `      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Controls & Live Financial Formulas Panel (Left) -->
        <div class="lg:col-span-6 glass-light p-6 sm:p-8 rounded-3xl shadow-magnificent space-y-5">
          <div class="space-y-4">
            
            <!-- Cohort Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>1. Target Customer Cohort</span>
                <span id="cohort-reach-badge" class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">2,680 Families Reach</span>
              </label>
              <select id="sim-cohort" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-royal-950 focus:outline-none focus:border-gold-500 shadow-sm" onchange="onCohortChange()">
                <option value="weekly_groceries">Weekly Grocery Households (Bodinayakanur)</option>
                <option value="rice_mills">Wholesale Rice Buyers &amp; Mill Direct Sacks</option>
                <option value="festival_families">Tamil Festival Sweet Makers (Deepavali / Pongal)</option>
                <option value="dead_stock">Clearance Deal Hunters (BOGO Bundles)</option>
                <option value="champions">VIP Champions Club (High Basket Families)</option>
              </select>
            </div>

            <!-- Product Selection: Catalog Dropdown + Custom Input -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">2. Authentic Catalog SKU / Product</label>
                <button type="button" onclick="toggleCustomProductInput()" id="custom-prod-toggle" class="text-[10px] text-gold-700 hover:text-gold-900 font-bold underline">
                  + Custom SKU
                </button>
              </div>
              
              <div id="catalog-select-container">
                <select id="sim-product-select" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-royal-950 focus:outline-none focus:border-gold-500 shadow-sm" onchange="onProductSelectChange()">
                  <option value="ponni_rice" data-name="Ponni Boiled Rice (25kg Bag)" data-mrp="1450" data-cost="1215" data-category="Rice & Grains">Ponni Boiled Rice (25kg Bag) — MRP ₹1,450</option>
                  <option value="idhayam_oil" data-name="Idhayam Gingelly / Sesame Oil (1L)" data-mrp="395" data-cost="335" data-category="Edible Oils">Idhayam Sesame Oil (1L Pet) — MRP ₹395</option>
                  <option value="gold_winner" data-name="Gold Winner Refined Sunflower Oil (1L)" data-mrp="155" data-cost="128" data-category="Edible Oils">Gold Winner Sunflower Oil (1L) — MRP ₹155</option>
                  <option value="sugar_pack" data-name="White Crystal Sugar (1kg Pack)" data-mrp="48" data-cost="38" data-category="Staples">White Crystal Sugar (1kg Pack) — MRP ₹48</option>
                  <option value="toor_dhal" data-name="Premium Unpolished Toor Dhal (1kg)" data-mrp="185" data-cost="151" data-category="Dals & Pulses">Premium Toor Dhal (1kg) — MRP ₹185</option>
                  <option value="atta_pack" data-name="Aashirvaad Shudh Chakki Atta (5kg)" data-mrp="295" data-cost="242" data-category="Atta & Flours">Aashirvaad Chakki Atta (5kg) — MRP ₹295</option>
                  <option value="pure_ghee" data-name="GRB Pure Cow Ghee (500ml Jar)" data-mrp="480" data-cost="410" data-category="Dairy & Ghee">GRB Pure Cow Ghee (500ml) — MRP ₹480</option>
                  <option value="tata_salt" data-name="Tata Iodized Salt (1kg Pouch)" data-mrp="28" data-cost="21" data-category="Salt & Spices">Tata Iodized Salt (1kg Pouch) — MRP ₹28</option>
                  <option value="tea_avt" data-name="AVT Premium Tea (500g Jar)" data-mrp="200" data-cost="168" data-category="Beverages">AVT Premium Tea (500g) — MRP ₹200</option>
                  <option value="dheepam_oil" data-name="Dheepam Lamp Pooja Oil (500ml)" data-mrp="111" data-cost="88" data-category="Pooja Staples">Dheepam Lamp Pooja Oil (500ml) — MRP ₹111</option>
                </select>
              </div>

              <!-- Custom SKU Input (Hidden by default) -->
              <div id="custom-product-container" class="hidden mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="sm:col-span-3">
                  <input type="text" id="sim-custom-name" placeholder="Enter Product Name (e.g. Anil Vermicelli 450g)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-royal-950 focus:border-gold-500" oninput="onCustomProductInput()">
                </div>
              </div>

              <!-- Dynamic Price & Cost Inputs -->
              <div class="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase">Standard MRP (₹)</label>
                  <input type="number" id="sim-mrp-input" value="1450" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-royal-950 focus:border-gold-500" oninput="onPriceParamChange()">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase">Est. Wholesale Cost (₹)</label>
                  <input type="number" id="sim-cost-input" value="1215" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-royal-950 focus:border-gold-500" oninput="onPriceParamChange()">
                </div>
              </div>
            </div>

            <!-- Campaign Theme & Tone -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">3. Campaign Theme &amp; Tone</label>
              <div class="grid grid-cols-2 gap-3">
                <button type="button" onclick="setTone('tamil_traditional')" id="tone-btn-ta" class="p-2.5 rounded-xl border-2 border-gold-500 bg-gold-50/50 text-royal-950 text-xs font-bold text-left transition">
                  <div class="font-tamil font-black text-emerald-800">தமிழ் பாரம்பரியம்</div>
                  <div class="text-[10px] text-slate-500 font-normal mt-0.5">Authentic Tamil Vernacular</div>
                </button>
                <button type="button" onclick="setTone('english_modern')" id="tone-btn-en" class="p-2.5 rounded-xl border-2 border-transparent bg-white text-royal-950 text-xs font-bold text-left transition hover:border-slate-300">
                  <div class="font-sans font-black text-royal-900">Modern Express</div>
                  <div class="text-[10px] text-slate-500 font-normal mt-0.5">Quick English Deals</div>
                </button>
              </div>
            </div>

            <!-- Promotional Discount Slider -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">4. Promotional Discount Multiplier</label>
                <span id="discount-val-label" class="px-2.5 py-0.5 bg-gold-500/20 text-gold-900 font-black text-xs rounded-lg min-w-[55px] text-center">15% Off</span>
              </div>
              <input type="range" id="sim-discount" min="5" max="35" value="15" class="w-full accent-gold-600 cursor-pointer" oninput="updateDiscountVal(this.value)">
            </div>

            <!-- Custom AI Prompt Angle -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">5. Custom AI Angle / Special Instruction (Optional)</label>
              <textarea id="sim-prompt-input" rows="2" placeholder="e.g., Emphasize guaranteed 30-min doorstep delivery in Bodi, free home delivery above ₹499, or festive pooja combo..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-royal-950 focus:outline-none focus:border-gold-500 shadow-sm"></textarea>
            </div>

            <!-- LIVE FINANCIAL FORMULA TRANSPARENCY CARD -->
            <div class="p-4 rounded-2xl bg-white border border-gold-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="text-[11px] font-black uppercase text-royal-900 flex items-center gap-1.5">
                  <i class="fa-solid fa-calculator text-gold-600"></i>
                  <span>Live Formula Telemetry</span>
                </span>
                <span id="safe-margin-badge" class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                  ✅ Safe Profit Margin
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[9px] text-slate-500 font-bold block uppercase">Deal Price</span>
                  <b id="formula-deal-price" class="text-royal-950 font-black text-sm">₹1,233</b>
                  <span id="formula-savings" class="text-[9px] text-emerald-700 block">Save ₹217 (15%)</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[9px] text-slate-500 font-bold block uppercase">Unit Margin</span>
                  <b id="formula-margin-pct" class="text-royal-950 font-black text-sm">1.5%</b>
                  <span id="formula-unit-profit" class="text-[9px] text-slate-600 block">₹18 Gross/Unit</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[9px] text-slate-500 font-bold block uppercase">Est. Orders</span>
                  <b id="formula-projected-orders" class="text-emerald-700 font-black text-sm">263 Bills</b>
                  <span id="formula-conv-rate" class="text-[9px] text-slate-600 block">9.8% Conversion</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[9px] text-slate-500 font-bold block uppercase">Projected GMV</span>
                  <b id="formula-projected-gmv" class="text-royal-950 font-black text-sm">₹3.24L</b>
                  <span id="formula-roi" class="text-[9px] text-purple-700 font-bold block">302x Est. ROI</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Synthesize Action Button -->
          <div class="pt-2 border-t border-slate-200">
            <button id="synthesize-btn" onclick="executeAiMarketingGeneration()" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
              <i class="fa-solid fa-wand-magic-sparkles" id="synth-btn-icon"></i>
              <span id="synth-btn-text">Synthesize AI Campaign Draft</span>
            </button>
            <div id="ai-engine-source" class="text-center text-[10px] text-slate-500 mt-2 font-mono">
              Engine: SNS Autonomous Retail Engine (Offline / Local Fallback Ready)
            </div>
          </div>
        </div>

        <!-- Live Multi-Channel Phone & Social Preview Mockup (Right) -->
        <div class="lg:col-span-6 space-y-4">
          
          <!-- Channel Switcher Tabs -->
          <div class="flex items-center justify-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl max-w-sm mx-auto">
            <button type="button" onclick="setChannelTab('whatsapp')" id="ch-tab-whatsapp" class="ch-tab flex-1 py-1.5 rounded-xl text-xs font-bold transition bg-white text-emerald-800 shadow-sm flex items-center justify-center gap-1.5">
              <i class="fa-brands fa-whatsapp text-emerald-600"></i> WhatsApp
            </button>
            <button type="button" onclick="setChannelTab('instagram')" id="ch-tab-instagram" class="ch-tab flex-1 py-1.5 rounded-xl text-xs font-bold transition text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5">
              <i class="fa-brands fa-instagram text-rose-600"></i> Instagram
            </button>
            <button type="button" onclick="setChannelTab('sms')" id="ch-tab-sms" class="ch-tab flex-1 py-1.5 rounded-xl text-xs font-bold transition text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-comment-sms text-blue-600"></i> SMS
            </button>
            <button type="button" onclick="setChannelTab('tamil')" id="ch-tab-tamil" class="ch-tab flex-1 py-1.5 rounded-xl text-xs font-bold transition text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 font-tamil">
              🌾 தமிழ்
            </button>
          </div>

          <!-- Phone Device Container -->
          <div class="flex justify-center">
            <div class="w-full max-w-sm rounded-[40px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
              
              <!-- Screen Header -->
              <div id="phone-screen-header" class="bg-emerald-800 text-white p-3 rounded-t-[30px] flex items-center justify-between transition-colors">
                <div class="flex items-center gap-2">
                  <img src="/images/rani_logo.png" class="w-8 h-8 rounded-full bg-white object-cover" onerror="this.src='/favicon.ico'">
                  <div>
                    <div class="font-bold text-xs" id="phone-header-title">Rani Hyper Market AI</div>
                    <div class="text-[10px] text-emerald-200" id="phone-header-sub">Verified Business · Online</div>
                  </div>
                </div>
                <i class="fa-solid fa-ellipsis-vertical text-xs"></i>
              </div>

              <!-- Phone Content Body -->
              <div id="phone-screen-body" class="bg-[#ECE5DD] p-4 min-h-[360px] flex flex-col justify-end space-y-3 font-sans transition-colors">
                <div class="bg-white rounded-2xl p-3.5 shadow-sm space-y-2 text-slate-800 text-xs leading-relaxed max-w-[95%]">
                  <div class="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span class="font-bold text-emerald-800 text-[11px]" id="preview-headline">👑 போடிநாயக்கனூர் சிறப்பு சலுகை!</span>
                    <span class="text-[9px] text-slate-400" id="preview-timestamp">10:42 AM</span>
                  </div>
                  
                  <p id="preview-body" class="text-slate-700 text-xs whitespace-pre-line">
                    அன்பான வாடிக்கையாளரே! உங்கள் குடும்பத்திற்கான வாராந்திர மளிகைப் பொருட்களில் 15% அதிரடி தள்ளுபடி. நேரடி பார்சல் 30 நிமிடங்களில் உங்கள் வீட்டிற்கு வரும்.
                  </p>
                  
                  <div class="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                    <div class="font-bold text-slate-900" id="preview-sku">📦 Ponni Boiled Rice (25kg Bag)</div>
                    <div class="text-emerald-700 font-bold" id="preview-price">MRP: ₹1,450 | Deal Price: ₹1,233 (Save ₹217)</div>
                  </div>

                  <!-- 1-Click WhatsApp CTA and Copy buttons -->
                  <div class="grid grid-cols-2 gap-2 mt-2">
                    <a id="preview-cta-link" href="https://wa.me/917708834547" target="_blank" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center rounded-lg text-xs no-underline shadow-xs transition flex items-center justify-center gap-1">
                      <i class="fa-brands fa-whatsapp"></i> Test Send
                    </a>
                    <button type="button" onclick="copyCampaignText()" class="py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-center rounded-lg text-xs transition flex items-center justify-center gap-1 cursor-pointer">
                      <i class="fa-solid fa-copy"></i> <span id="copy-btn-text">Copy Text</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Chat Footer -->
              <div class="bg-slate-800 p-2 rounded-b-[30px] text-center">
                <span class="text-[10px] text-slate-400 font-mono" id="phone-footer-label">Agent Node: WhatsApp Cloud Dispatcher v3.2</span>
              </div>
            </div>
          </div>

          <!-- AI Strategic Insight Card -->
          <div class="max-w-sm mx-auto p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <b class="flex items-center gap-1 text-[11px] font-black uppercase text-amber-800">
              <i class="fa-solid fa-brain"></i> AI Merchandising Rationale
            </b>
            <p id="preview-strategy-note" class="text-[11px] leading-relaxed text-amber-900">
              Staple grocery basket driver: Discount maintains a positive gross margin while driving high-frequency customer footfall into the store.
            </p>
          </div>

        </div>

      </div>`;

// Replace in html
const genStart = html.indexOf('<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">');
const genEnd = html.indexOf('<!-- ══════════════════════════════════════════════════════════\n       TOPIC 2.5: CUSTOMER RFM AUDIENCE SEGMENTATION STUDIO');

if (genStart !== -1 && genEnd !== -1) {
  html = html.substring(0, genStart) + newGeneratorSection + '\n\n    </div>\n  </section>\n\n  ' + html.substring(genEnd);
  console.log('Successfully replaced generator HTML section');
} else {
  console.error('Could not locate generator section bounds in marketing.html');
}

// 2. Add Festival Action Modal HTML before </body>
const modalHtml = `
  <!-- ══════════════════════════════════════════════════════════
       FESTIVAL PROCUREMENT PURCHASE ORDER (PO) MODAL
  ══════════════════════════════════════════════════════════ -->
  <div id="festival-action-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gold-200 max-h-[90vh] overflow-y-auto space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-3xl" id="fest-modal-icon">🪔</span>
          <div>
            <h3 class="font-serif text-xl sm:text-2xl font-black text-royal-950" id="fest-modal-title">Festival Procurement Plan</h3>
            <span class="text-xs font-bold text-slate-500" id="fest-modal-sub">Calculated via 5-year lunisolar retail surge models</span>
          </div>
        </div>
        <button onclick="closeFestivalModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition">&times;</button>
      </div>

      <!-- Live Multiplier & Demand Formula Banner -->
      <div class="p-4 rounded-2xl bg-gold-50 border border-gold-200 space-y-2">
        <div class="flex items-center justify-between text-xs font-bold">
          <span class="text-gold-900 flex items-center gap-1.5">
            <i class="fa-solid fa-chart-line text-gold-700"></i>
            <span>Forecasting Multiplier Formula</span>
          </span>
          <span id="fest-modal-multiplier" class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">2.35x Surge</span>
        </div>
        <p class="text-xs text-slate-700 leading-relaxed font-mono" id="fest-modal-math">
          Projected Festival Need = Baseline Weekly Velocity (₹58,750) × Multiplier (2.35x) = Projected ₹1,38,062 Requirement.
        </p>
      </div>

      <!-- Itemized Purchase Order Table -->
      <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-royal-950 mb-2">Itemized Vendor Purchase Order (PO Draft)</h4>
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th class="p-2.5">Category / SKU</th>
                <th class="p-2.5">Shelf Stock</th>
                <th class="p-2.5">Forecast Need</th>
                <th class="p-2.5">Reorder PO Qty</th>
                <th class="p-2.5">Est. Budget</th>
              </tr>
            </thead>
            <tbody id="fest-modal-tbody" class="divide-y divide-slate-100 font-medium text-slate-800">
              <!-- Dynamically populated -->
            </tbody>
            <tfoot class="bg-slate-50 font-bold text-royal-950 border-t border-slate-200 text-xs">
              <tr>
                <td class="p-2.5" colspan="3">Total Estimated Procurement Capital:</td>
                <td class="p-2.5 text-emerald-700" colspan="2" id="fest-modal-total-budget">₹46,200</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button onclick="exportFestivalPoCsv()" class="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-file-csv text-emerald-400"></i> Export PO as CSV
        </button>
        <button onclick="window.print()" class="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-print"></i> Print Procurement Slip
        </button>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="festival-action-modal"')) {
  html = html.replace('</body>', modalHtml + '\n</body>');
  console.log('Successfully injected Festival Action Modal HTML');
}

// 3. Replace the client script in marketing.html
const oldScriptStart = html.indexOf('<script>\n    // 1. Agent Tab Switcher');
if (oldScriptStart !== -1) {
  const newScript = `<script>
    // 1. Agent Tab Switcher
    function switchAgentTab(tabName) {
      document.querySelectorAll('.agent-tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-gold-500', 'bg-white', 'shadow-sm');
        btn.classList.add('border-transparent', 'bg-white/70');
      });
      const activeBtn = document.getElementById('tab-btn-' + tabName);
      if (activeBtn) {
        activeBtn.classList.add('active', 'border-gold-500', 'bg-white', 'shadow-sm');
        activeBtn.classList.remove('border-transparent', 'bg-white/70');
      }

      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      const activeContent = document.getElementById('tab-content-' + tabName);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    }

    // 2. Global State for Campaign Generator
    let currentTone = 'tamil_traditional';
    let currentChannel = 'whatsapp';
    let isCustomProduct = false;
    let cachedGeneratedCopies = null;
    let catalogStaplesCache = [];

    // 3. Tone Selector
    function setTone(tone) {
      currentTone = tone;
      const taBtn = document.getElementById('tone-btn-ta');
      const enBtn = document.getElementById('tone-btn-en');
      if (tone === 'tamil_traditional') {
        taBtn.className = 'p-2.5 rounded-xl border-2 border-gold-500 bg-gold-50/50 text-royal-950 text-xs font-bold text-left transition';
        enBtn.className = 'p-2.5 rounded-xl border-2 border-transparent bg-white text-royal-950 text-xs font-bold text-left transition hover:border-slate-300';
      } else {
        enBtn.className = 'p-2.5 rounded-xl border-2 border-gold-500 bg-gold-50/50 text-royal-950 text-xs font-bold text-left transition';
        taBtn.className = 'p-2.5 rounded-xl border-2 border-transparent bg-white text-royal-950 text-xs font-bold text-left transition hover:border-slate-300';
      }
      recalculateFormulasAndRender();
    }

    // 4. Channel Selector
    function setChannelTab(channel) {
      currentChannel = channel;
      document.querySelectorAll('.ch-tab').forEach(b => {
        b.className = 'ch-tab flex-1 py-1.5 rounded-xl text-xs font-bold transition text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5';
      });
      const activeBtn = document.getElementById('ch-tab-' + channel);
      if (activeBtn) {
        activeBtn.className = 'ch-tab flex-1 py-1.5 rounded-xl text-xs font-bold transition bg-white text-emerald-800 shadow-sm flex items-center justify-center gap-1.5';
      }

      // Adjust phone styling per channel
      const screenHdr = document.getElementById('phone-screen-header');
      const screenBody = document.getElementById('phone-screen-body');
      const hdrTitle = document.getElementById('phone-header-title');
      const hdrSub = document.getElementById('phone-header-sub');
      const footerLbl = document.getElementById('phone-footer-label');

      if (channel === 'whatsapp') {
        screenHdr.className = 'bg-emerald-800 text-white p-3 rounded-t-[30px] flex items-center justify-between transition-colors';
        screenBody.className = 'bg-[#ECE5DD] p-4 min-h-[360px] flex flex-col justify-end space-y-3 font-sans transition-colors';
        hdrTitle.textContent = 'Rani Hyper Market AI';
        hdrSub.textContent = 'Verified Business · Online';
        footerLbl.textContent = 'Agent Node: WhatsApp Cloud Dispatcher v3.2';
      } else if (channel === 'instagram') {
        screenHdr.className = 'bg-gradient-to-r from-purple-700 to-pink-600 text-white p-3 rounded-t-[30px] flex items-center justify-between transition-colors';
        screenBody.className = 'bg-slate-100 p-4 min-h-[360px] flex flex-col justify-end space-y-3 font-sans transition-colors';
        hdrTitle.textContent = '@ranihypermarket';
        hdrSub.textContent = 'Sponsored · Bodinayakanur';
        footerLbl.textContent = 'Channel: Meta Graph API & Instagram Reels Ad';
      } else if (channel === 'sms') {
        screenHdr.className = 'bg-blue-700 text-white p-3 rounded-t-[30px] flex items-center justify-between transition-colors';
        screenBody.className = 'bg-slate-50 p-4 min-h-[360px] flex flex-col justify-end space-y-3 font-sans transition-colors';
        hdrTitle.textContent = 'VK-RANIHM';
        hdrSub.textContent = 'DLT Approved Bulk Route';
        footerLbl.textContent = 'Channel: Indian DLT SMS Gateway (160 Chars)';
      } else {
        // Tamil
        screenHdr.className = 'bg-emerald-900 text-white p-3 rounded-t-[30px] flex items-center justify-between transition-colors';
        screenBody.className = 'bg-[#FFF9EE] p-4 min-h-[360px] flex flex-col justify-end space-y-3 font-sans transition-colors';
        hdrTitle.textContent = 'ராணி ஹைப்பர் மார்க்கெட்';
        hdrSub.textContent = 'போடிநாயக்கனூர் நேரடி சேவை';
        footerLbl.textContent = 'மொழி: தமிழ் பாரம்பரியம் (Tamil Vernacular)';
      }

      renderCurrentChannelPreview();
    }

    // 5. Custom Product Toggle
    function toggleCustomProductInput() {
      isCustomProduct = !isCustomProduct;
      const catCont = document.getElementById('catalog-select-container');
      const custCont = document.getElementById('custom-product-container');
      const toggleBtn = document.getElementById('custom-prod-toggle');

      if (isCustomProduct) {
        catCont.classList.add('hidden');
        custCont.classList.remove('hidden');
        toggleBtn.textContent = '← Catalog Staples';
      } else {
        catCont.classList.remove('hidden');
        custCont.classList.add('hidden');
        toggleBtn.textContent = '+ Custom SKU';
        onProductSelectChange();
      }
      recalculateFormulasAndRender();
    }

    function onProductSelectChange() {
      const sel = document.getElementById('sim-product-select');
      const opt = sel.options[sel.selectedIndex];
      if (opt) {
        const mrp = Number(opt.getAttribute('data-mrp')) || 1450;
        const cost = Number(opt.getAttribute('data-cost')) || Math.round(mrp * 0.84);
        document.getElementById('sim-mrp-input').value = mrp;
        document.getElementById('sim-cost-input').value = cost;
      }
      recalculateFormulasAndRender();
    }

    function onCustomProductInput() {
      recalculateFormulasAndRender();
    }

    function onPriceParamChange() {
      recalculateFormulasAndRender();
    }

    function onCohortChange() {
      const cohort = document.getElementById('sim-cohort').value;
      const reachMap = {
        weekly_groceries: '2,680 Families Reach',
        rice_mills: '1,420 Families Reach',
        festival_families: '2,050 Families Reach',
        dead_stock: '1,730 Families Reach',
        champions: '1,420 Families Reach'
      };
      const badge = document.getElementById('cohort-reach-badge');
      if (badge) badge.textContent = reachMap[cohort] || '2,500 Reach';
      recalculateFormulasAndRender();
    }

    function updateDiscountVal(val) {
      document.getElementById('discount-val-label').textContent = val + '% Off';
      recalculateFormulasAndRender();
    }

    // 6. Get Current Product Parameters
    function getProductParams() {
      let name = '';
      if (isCustomProduct) {
        name = (document.getElementById('sim-custom-name').value || '').trim() || 'Custom Grocery Combo';
      } else {
        const sel = document.getElementById('sim-product-select');
        const opt = sel.options[sel.selectedIndex];
        name = opt ? (opt.getAttribute('data-name') || opt.text.split('—')[0].trim()) : 'Ponni Boiled Rice (25kg Bag)';
      }
      const mrp = Math.max(1, Number(document.getElementById('sim-mrp-input').value) || 1450);
      const cost = Math.max(1, Number(document.getElementById('sim-cost-input').value) || Math.round(mrp * 0.84));
      const discount = Math.max(1, Math.min(50, Number(document.getElementById('sim-discount').value) || 15));
      const cohort = document.getElementById('sim-cohort').value;
      const prompt = (document.getElementById('sim-prompt-input')?.value || '').trim();

      return { name, mrp, cost, discount, cohort, prompt };
    }

    // 7. Live Mathematical Retail Formula Calculations
    function computeLiveFormulas(params) {
      const dealPrice = Math.max(1, Math.round(params.mrp * (1 - params.discount / 100)));
      const savingsAmount = params.mrp - dealPrice;
      const unitGrossProfit = dealPrice - params.cost;
      const grossMarginPct = dealPrice > 0 ? Number(((unitGrossProfit / dealPrice) * 100).toFixed(1)) : 0;
      const isSafeMargin = grossMarginPct >= 5.0;

      const cohortReachMap = {
        weekly_groceries: 2680,
        rice_mills: 1420,
        festival_families: 2050,
        dead_stock: 1730,
        champions: 1420
      };
      const audienceReach = cohortReachMap[params.cohort] || 2500;
      const conversionRatePct = Number(Math.min(22.0, 4.5 + (params.discount * 0.35)).toFixed(1));
      const projectedOrders = Math.max(1, Math.round(audienceReach * (conversionRatePct / 100)));
      const projectedGmv = projectedOrders * dealPrice;
      const projectedProfit = projectedOrders * unitGrossProfit;
      const dispatchCost = Math.round(audienceReach * 0.40);
      const roiMultiplier = dispatchCost > 0 ? Number((projectedGmv / dispatchCost).toFixed(1)) : 14.2;

      return {
        dealPrice,
        savingsAmount,
        unitGrossProfit,
        grossMarginPct,
        isSafeMargin,
        audienceReach,
        conversionRatePct,
        projectedOrders,
        projectedGmv,
        projectedProfit,
        dispatchCost,
        roiMultiplier
      };
    }

    // 8. Update Formula Card & Preview
    function recalculateFormulasAndRender() {
      const params = getProductParams();
      const calc = computeLiveFormulas(params);

      // Update Formula Box
      document.getElementById('formula-deal-price').textContent = '₹' + calc.dealPrice.toLocaleString('en-IN');
      document.getElementById('formula-savings').textContent = \`Save ₹\${calc.savingsAmount} (\${params.discount}%)\`;
      
      const marginEl = document.getElementById('formula-margin-pct');
      marginEl.textContent = calc.grossMarginPct + '%';
      marginEl.className = calc.isSafeMargin ? 'text-emerald-700 font-black text-sm' : 'text-rose-600 font-black text-sm';

      document.getElementById('formula-unit-profit').textContent = \`₹\${calc.unitGrossProfit} Gross/Unit\`;
      document.getElementById('formula-projected-orders').textContent = calc.projectedOrders.toLocaleString('en-IN') + ' Bills';
      document.getElementById('formula-conv-rate').textContent = calc.conversionRatePct + '% Conversion';
      document.getElementById('formula-projected-gmv').textContent = '₹' + (calc.projectedGmv / 100000).toFixed(2) + 'L';
      document.getElementById('formula-roi').textContent = calc.roiMultiplier + 'x Est. ROI';

      const safeBadge = document.getElementById('safe-margin-badge');
      if (safeBadge) {
        if (calc.isSafeMargin) {
          safeBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800';
          safeBadge.textContent = '✅ Safe Profit Margin';
        } else {
          safeBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800';
          safeBadge.textContent = '⚠️ Risk: Margin Below 5%';
        }
      }

      // Update Fallback Copy if no AI generation has run yet
      if (!cachedGeneratedCopies) {
        synthesizeLocalPreview(params, calc);
      } else {
        renderCurrentChannelPreview();
      }
    }

    // 9. Synthesize Local Rich Copy (Instant Reactive)
    function synthesizeLocalPreview(params, calc) {
      const p = params;
      const c = calc;
      let headline = '', body = '';

      if (currentTone === 'tamil_traditional') {
        headline = \`👑 போடிநாயக்கனூர் சிறப்பு மளிகை ஆஃபர்! (\${p.discount}% தள்ளுபடி)\`;
        body = \`அன்பான குடும்பங்களே! உங்கள் இல்லத் தேவைக்கான \${p.name} இப்போது சிறப்பு \${p.discount}% நேரடித் தள்ளுபடியில். போடி சுற்றுவட்டாரத்திற்கு 30 நிமிடங்களில் உங்கள் வீட்டிற்கே டோர் டெலிவரி!\`;
      } else {
        headline = \`⚡ Bodinayakanur Flash Grocery Deal! (\${p.discount}% Off)\`;
        body = \`Premium quality grocery essentials at unmatched direct prices! Order \${p.name} with express 30-minute delivery anywhere in Bodinayakanur.\`;
      }

      document.getElementById('preview-headline').textContent = headline;
      document.getElementById('preview-body').textContent = body;
      document.getElementById('preview-sku').textContent = '📦 ' + p.name;
      document.getElementById('preview-price').textContent = \`MRP: ₹\${p.mrp.toLocaleString('en-IN')} | Deal Price: ₹\${c.dealPrice.toLocaleString('en-IN')} (Save ₹\${c.savingsAmount})\`;

      const whatsappText = encodeURIComponent(\`Hi Rani Hyper Market, I want to order: \${p.name} at Deal Price ₹\${c.dealPrice} (\${p.discount}% OFF)\`);
      document.getElementById('preview-cta-link').href = \`https://wa.me/917708834547?text=\${whatsappText}\`;
      
      const stratNote = document.getElementById('preview-strategy-note');
      if (stratNote) {
        stratNote.textContent = \`Formula-backed strategy: Discount of \${p.discount}% protects gross margin at \${c.grossMarginPct}% while projecting ₹\${(c.projectedGmv/100000).toFixed(2)} Lakhs GMV across \${c.audienceReach} families.\`;
      }
    }

    // 10. Real AI Marketing Generation API Invocation
    async function executeAiMarketingGeneration() {
      const btn = document.getElementById('synthesize-btn');
      const btnIcon = document.getElementById('synth-btn-icon');
      const btnText = document.getElementById('synth-btn-text');
      const engineSrc = document.getElementById('ai-engine-source');

      btn.disabled = true;
      btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
      btnText.textContent = 'Synthesizing Retail AI...';

      const params = getProductParams();

      try {
        const res = await fetch('/api/ai-marketing/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cohort: params.cohort,
            tone: currentTone,
            discount: params.discount,
            productName: params.name,
            mrp: params.mrp,
            cost: params.cost,
            prompt: params.prompt
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.copy) {
            cachedGeneratedCopies = data.copy;
            if (data.engine && engineSrc) {
              engineSrc.textContent = 'Active Engine: ' + data.engine;
            }
            renderCurrentChannelPreview();
          } else {
            recalculateFormulasAndRender();
          }
        } else {
          recalculateFormulasAndRender();
        }
      } catch (err) {
        console.warn('API generation fallback to local formula synthesis:', err.message);
        cachedGeneratedCopies = null;
        recalculateFormulasAndRender();
      } finally {
        btn.disabled = false;
        btnIcon.className = 'fa-solid fa-wand-magic-sparkles';
        btnText.textContent = 'Synthesize AI Campaign Draft';
      }
    }

    // 11. Render Copy for Active Channel
    function renderCurrentChannelPreview() {
      const params = getProductParams();
      const calc = computeLiveFormulas(params);

      const headlineEl = document.getElementById('preview-headline');
      const bodyEl = document.getElementById('preview-body');
      const skuEl = document.getElementById('preview-sku');
      const priceEl = document.getElementById('preview-price');
      const ctaEl = document.getElementById('preview-cta-link');
      const stratNote = document.getElementById('preview-strategy-note');

      skuEl.textContent = '📦 ' + params.name;
      priceEl.textContent = \`MRP: ₹\${params.mrp.toLocaleString('en-IN')} | Deal Price: ₹\${calc.dealPrice.toLocaleString('en-IN')} (Save ₹\${calc.savingsAmount})\`;

      if (cachedGeneratedCopies) {
        if (currentChannel === 'whatsapp') {
          headlineEl.textContent = cachedGeneratedCopies.headline || '👑 போடிநாயக்கனூர் சிறப்பு சலுகை!';
          bodyEl.textContent = cachedGeneratedCopies.whatsappCopy || cachedGeneratedCopies.body || '';
        } else if (currentChannel === 'instagram') {
          headlineEl.textContent = '📸 Instagram / Facebook Reel Hook';
          bodyEl.textContent = cachedGeneratedCopies.instagramCopy || cachedGeneratedCopies.whatsappCopy || '';
        } else if (currentChannel === 'sms') {
          headlineEl.textContent = '💬 DLT Verified SMS (160 Chars)';
          bodyEl.textContent = cachedGeneratedCopies.smsCopy || \`Rani Hyper Market: \${params.name} at just Rs.\${calc.dealPrice} (\${params.discount}% OFF). Call 7708834547\`;
        } else {
          // Tamil
          headlineEl.textContent = '🌾 தமிழ் பாரம்பரியம்';
          bodyEl.textContent = cachedGeneratedCopies.tamilCopy || cachedGeneratedCopies.whatsappCopy || '';
        }

        if (stratNote && cachedGeneratedCopies.aiStrategyNote) {
          stratNote.textContent = cachedGeneratedCopies.aiStrategyNote;
        }
      } else {
        synthesizeLocalPreview(params, calc);
      }

      const activeText = bodyEl.textContent;
      const waText = encodeURIComponent(activeText.slice(0, 300));
      ctaEl.href = \`https://wa.me/917708834547?text=\${waText}\`;
    }

    // 12. Copy Campaign Text to Clipboard
    function copyCampaignText() {
      const headline = document.getElementById('preview-headline').textContent;
      const body = document.getElementById('preview-body').textContent;
      const sku = document.getElementById('preview-sku').textContent;
      const price = document.getElementById('preview-price').textContent;
      
      const fullText = \`🛒 *RANI HYPER MARKET — EXCLUSIVE CAMPAIGN*\\n\\n\${headline}\\n\\n\${body}\\n\\n\${sku}\\n💰 *\${price}*\\n\\n⚡ *Order Store Drop:* https://rani-hyper-market.vercel.app/store\\n📞 *WhatsApp/Phone:* +91 77088 34547\\n📍 *Store:* Bodinayakanur, Theni District.\`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
          const btnText = document.getElementById('copy-btn-text');
          if (btnText) {
            btnText.textContent = 'Copied!';
            setTimeout(() => btnText.textContent = 'Copy Text', 2000);
          }
        }).catch(() => {
          alert('Campaign text ready:\\n\\n' + fullText);
        });
      } else {
        alert('Campaign text ready:\\n\\n' + fullText);
      }
    }

    // 13. RFM Customer Segmentation Studio Controller
    const RFM_DATA = {
      champions: {
        badge: 'VIP Champions · 1,420 Families',
        title: 'Exclusive Priority Treatment',
        desc: 'These customers generate over 42% of monthly store profits. The AI never sends them generic blast messages; instead, it provides white-glove VIP treatment.',
        actions: [
          'Auto-unlock permanent <strong>Free Express 30-min Delivery</strong>',
          'Early reservation for festival sweets & pure country ghee',
          'Direct Store Manager WhatsApp connection for custom bulk orders'
        ],
        size: '1,420 Families',
        aov: '₹1,240 / Order',
        gmv: '₹21.1 Lakhs/yr'
      },
      regulars: {
        badge: 'Loyal Regulars · 2,680 Families',
        title: 'Automated Staple Replenishment',
        desc: 'Consistent bi-weekly staples buyers. They rely on Rani Hyper Market for rice, dals, spices, and cooking oils.',
        actions: [
          'Automated Sunday morning <strong>Grocery Restock Reminder</strong>',
          'Personalized rice sack discounts based on previous brand purchase',
          'Express 1-tap WhatsApp re-order button with saved household cart'
        ],
        size: '2,680 Families',
        aov: '₹890 / Order',
        gmv: '₹28.6 Lakhs/yr'
      },
      at_risk: {
        badge: 'Dormant Churners · 1,730 Families',
        title: 'AI Win-Back & Reactivation Loop',
        desc: 'Customers who have not shopped in 45+ days. The AI detects the lapse and deploys targeted reactivation incentives.',
        actions: [
          'Automated <strong>"We Miss You" ₹50 Instant Voucher</strong> trigger',
          'Zero-delivery-fee voucher sent via WhatsApp on day 46',
          'Survey trigger asking if stock availability or service was an issue'
        ],
        size: '1,730 Families',
        aov: '₹680 / Order',
        gmv: '₹14.1 Lakhs/yr'
      },
      festivals: {
        badge: 'Festival Surfers · 2,050 Families',
        title: 'Lunisolar Seasonal Surge Capture',
        desc: 'High-ticket buyers who spend heavily during Deepavali, Pongal, and wedding months for sweets, gifting packs, and cooking oil tins.',
        actions: [
          'Pre-festival <strong>Sweet Master Combo Early Access</strong>',
          'Bulk ghee and cooking oil pre-booking discounts',
          'Festive pooja and sweet gifting catalog broadcast'
        ],
        size: '2,050 Families',
        aov: '₹1,650 / Order',
        gmv: '₹40.5 Lakhs/yr'
      }
    };

    let activeRfmKey = 'champions';

    function selectRfmCohort(key) {
      activeRfmKey = key;
      const data = RFM_DATA[key];
      if (!data) return;

      document.querySelectorAll('.rfm-selector-card').forEach(c => {
        c.className = 'rfm-selector-card p-5 rounded-2xl border-2 border-transparent bg-white shadow-card-soft hover:border-slate-300 cursor-pointer transition';
      });
      const activeEl = document.getElementById('rfm-card-' + key);
      if (activeEl) {
        activeEl.className = 'rfm-selector-card p-5 rounded-2xl border-2 border-gold-500 bg-white shadow-magnificent cursor-pointer transition';
      }

      document.getElementById('rfm-cohort-badge').textContent = data.badge;
      document.getElementById('rfm-cohort-title').textContent = data.title;
      document.getElementById('rfm-cohort-desc').textContent = data.desc;
      document.getElementById('rfm-cohort-size').textContent = data.size;
      document.getElementById('rfm-cohort-aov').textContent = data.aov;
      document.getElementById('rfm-cohort-gmv').textContent = data.gmv;

      const actUl = document.getElementById('rfm-cohort-actions');
      if (actUl) {
        actUl.innerHTML = data.actions.map(a => \`
          <li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[11px] mt-0.5"></i> <span>\${a}</span></li>
        \`).join('');
      }
    }

    function loadCohortIntoGenerator() {
      const mapCohort = {
        champions: 'champions',
        regulars: 'weekly_groceries',
        at_risk: 'dead_stock',
        festivals: 'festival_families'
      };
      const sel = document.getElementById('sim-cohort');
      if (sel) {
        sel.value = mapCohort[activeRfmKey] || 'weekly_groceries';
        onCohortChange();
      }
      const genSec = document.getElementById('campaign-generator');
      if (genSec) genSec.scrollIntoView({ behavior: 'smooth' });
    }

    // 14. Interactive ROI Telemetry Calculator
    function calculateRoi(val) {
      const customers = parseInt(val);
      document.getElementById('slider-customers-count').textContent = customers.toLocaleString() + ' Families';

      const projectedOrders = Math.round(customers * 0.434);
      const addedGmv = Math.round(projectedOrders * 172.78);
      const deadStockRecovery = Math.round(24800 + (customers / 8000) * 35000);
      const hoursSaved = Math.round(15 + (customers / 8000) * 55);

      document.getElementById('roi-orders').textContent = projectedOrders.toLocaleString() + ' Orders';
      document.getElementById('roi-orders').nextElementSibling.textContent = \`~₹\${(addedGmv/100000).toFixed(2)} Lakhs added GMV\`;

      document.getElementById('roi-capital').textContent = '₹' + deadStockRecovery.toLocaleString();
      document.getElementById('roi-hours').textContent = hoursSaved + ' Hours';
    }

    // 15. Rich Interactive Festival Procurement Modal
    const FESTIVAL_PO_DATA = {
      Deepavali: {
        title: 'Deepavali Sweet Making & Gifting Rush',
        icon: '🪔',
        surge: '2.35x Surge',
        math: 'Projected Demand = Baseline Weekly Velocity (₹58,750) × 2.35x = ₹1,38,062 Estimated Festival Turnover.',
        items: [
          { sku: 'GRB / Nandini Pure Ghee (500ml Jar)', cat: 'Dairy & Ghee', stock: '24 tins', need: '144 tins', reorder: '120 tins', cost: '₹410', total: '₹49,200' },
          { sku: 'Maida & Rava Premium Flours (1kg)', cat: 'Flours', stock: '60 kg', need: '410 kg', reorder: '350 kg', cost: '₹38', total: '₹13,300' },
          { sku: 'Gold Winner Refined Sunflower Oil (1L)', cat: 'Edible Oils', stock: '75 pouches', need: '555 pouches', reorder: '480 pouches', cost: '₹128', total: '₹61,440' },
          { sku: 'Cashews, Raisins & Cardamom Gifting Pack', cat: 'Dry Fruits', stock: '15 packs', need: '95 packs', reorder: '80 packs', cost: '₹220', total: '₹17,600' }
        ],
        totalBudget: '₹1,41,540'
      },
      Pongal: {
        title: 'Thai Pongal Harvest Week Procurement',
        icon: '🌾',
        surge: '3.20x Harvest Peak',
        math: 'Projected Demand = Baseline Weekly Velocity (₹58,750) × 3.20x = ₹1,88,000 Estimated Harvest Turnover.',
        items: [
          { sku: 'Raw Rice (முதல் தரம் பச்சரிசி 25kg Sack)', cat: 'Rice & Grains', stock: '8 bags', need: '33 bags', reorder: '25 bags', cost: '₹1,180', total: '₹29,500' },
          { sku: 'Country Jaggery (தூய நாட்டு வெல்லம் 1kg)', cat: 'Sweeteners', stock: '25 kg', need: '205 kg', reorder: '180 kg', cost: '₹55', total: '₹9,900' },
          { sku: 'Cashews & Raisins (முந்திரி, திராட்சை 250g)', cat: 'Dry Fruits', stock: '12 packs', need: '52 packs', reorder: '40 packs', cost: '₹185', total: '₹7,400' },
          { sku: 'Clay Pot Pooja Decoration Sets', cat: 'Pooja', stock: '5 sets', need: '45 sets', reorder: '40 sets', cost: '₹65', total: '₹2,600' }
        ],
        totalBudget: '₹49,400'
      },
      AyudhaPooja: {
        title: 'Ayudha Pooja Commercial Vehicle & Shop Worship',
        icon: '🔨',
        surge: '2.10x Business Surge',
        math: 'Projected Demand = Baseline Weekly Velocity (₹58,750) × 2.10x = ₹1,23,375 Commercial Blitz Turnover.',
        items: [
          { sku: 'Pori & Pottukadalai Bundles (பொரி மூட்டை)', cat: 'Pooja Staples', stock: '30 bags', need: '250 bags', reorder: '220 bags', cost: '₹45', total: '₹9,900' },
          { sku: 'Agarbathi & Camphor Bulk Boxes', cat: 'Pooja', stock: '20 packs', need: '170 packs', reorder: '150 packs', cost: '₹35', total: '₹5,250' },
          { sku: 'Sweets & Biscuit Assorted Gift Boxes', cat: 'Confectionery', stock: '18 tins', need: '113 tins', reorder: '95 tins', cost: '₹165', total: '₹15,675' }
        ],
        totalBudget: '₹30,825'
      }
    };

    let activeFestivalKey = 'Deepavali';

    function triggerFestivalModal(name) {
      activeFestivalKey = name || 'Deepavali';
      const data = FESTIVAL_PO_DATA[name] || FESTIVAL_PO_DATA.Deepavali;
      
      document.getElementById('fest-modal-title').textContent = data.title;
      document.getElementById('fest-modal-icon').textContent = data.icon;
      document.getElementById('fest-modal-multiplier').textContent = data.surge;
      document.getElementById('fest-modal-math').textContent = data.math;
      document.getElementById('fest-modal-total-budget').textContent = data.totalBudget;

      const tbody = document.getElementById('fest-modal-tbody');
      tbody.innerHTML = data.items.map(it => \`
        <tr>
          <td class="p-2.5 font-bold">\${it.sku}<div class="text-[10px] text-slate-400 font-normal">\${it.cat}</div></td>
          <td class="p-2.5 text-slate-500">\${it.stock}</td>
          <td class="p-2.5 font-bold text-royal-950">\${it.need}</td>
          <td class="p-2.5 font-black text-emerald-700">+\${it.reorder}</td>
          <td class="p-2.5 font-mono">\${it.total}</td>
        </tr>
      \`).join('');

      document.getElementById('festival-action-modal').classList.remove('hidden');
    }

    function closeFestivalModal() {
      document.getElementById('festival-action-modal').classList.add('hidden');
    }

    function exportFestivalPoCsv() {
      const data = FESTIVAL_PO_DATA[activeFestivalKey] || FESTIVAL_PO_DATA.Deepavali;
      let csv = 'Category,SKU Name,Current Stock,Forecast Need,Reorder Qty,Est Total Budget\\n';
      data.items.forEach(i => {
        csv += \`"\${i.cat}","\${i.sku}","\${i.stock}","\${i.need}","\${i.reorder}","\${i.total}"\\n\`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`Rani_Hyper_Market_\${activeFestivalKey}_PO_Draft.csv\`;
      a.click();
      URL.revokeObjectURL(url);
    }

    // 16. Load Top Catalog Staples from API on Startup
    async function loadCatalogStaples() {
      try {
        const res = await fetch('/api/ai-marketing/catalog-staples');
        if (res.ok) {
          const json = await res.json();
          if (json.staples && json.staples.length > 0) {
            catalogStaplesCache = json.staples;
            const sel = document.getElementById('sim-product-select');
            if (sel) {
              sel.innerHTML = json.staples.map(s => \`
                <option value="\${s.id}" data-name="\${s.title}" data-mrp="\${s.mrp}" data-cost="\${Math.round(s.price * 0.88)}" data-price="\${s.price}">
                  \${s.title} — MRP ₹\${s.mrp} (Price ₹\${s.price})
                </option>
              \`).join('');
              onProductSelectChange();
            }
          }
        }
      } catch (e) {
        console.warn('Using pre-populated staples:', e.message);
      }
    }

    // Initialize defaults on DOM ready
    window.addEventListener('DOMContentLoaded', () => {
      onProductSelectChange();
      loadCatalogStaples();
    });
  </script>
</body>
</html>`;

  html = html.substring(0, oldScriptStart) + newScript;
  console.log('Successfully injected new client script');
} else {
  console.error('Could not find oldScriptStart in marketing.html');
}

// Write to marketing.html
fs.writeFileSync(marketingPath, html, 'utf8');
console.log('Updated marketing.html');

// Mirror to public/marketing.html
const publicMarketingPath = path.join(__dirname, '..', 'public', 'marketing.html');
fs.writeFileSync(publicMarketingPath, html, 'utf8');
console.log('Updated public/marketing.html');
