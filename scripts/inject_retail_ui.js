const fs = require('fs');
const path = require('path');

const sectionHtml = `
    <!-- INDIAN RETAIL MARKET: TOP FMCG & SUPPLIER CORPORATE INTELLIGENCE & PRICE PULSE -->
    <div class="bg-gray-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div class="absolute -top-12 -left-12 w-56 h-56 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-12 -right-12 w-56 h-56 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header & UPDATO Action Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <i data-lucide="building-2" class="w-3 h-3"></i> Indian Retail FMCG Pulse
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Weekly Sync Active
            </span>
            <span class="text-xs text-gray-400" id="retail-last-updated-badge">Last Weekly Check: 21 Nov 2026, 19:00 IST</span>
          </div>
          <h3 class="text-lg font-black text-white mt-1.5 flex items-center gap-2">
            <span>🏢 Indian Retail Market: Top FMCG &amp; Supplier Price Pulse</span>
          </h3>
          <p class="text-xs text-gray-400 mt-0.5 max-w-3xl">
            Live tracking of India's retail powerhouses supplying your store shelves (HUL, ITC, Tata, Britannia, Nestlé, Adani Wilmar, Marico, Dabur, GCPL, Varun/Hatsun) • Weekly wholesale price shifts, MRP revisions, and distributor margins.
          </p>
        </div>

        <!-- Action Controls with UPDATO Button -->
        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <!-- The UPDATO Button -->
          <button id="btn-updato" onclick="triggerUpdato()" type="button" title="Execute Live Algorithmic Price &amp; Scheme Update for Indian Retail Leaders" class="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:via-orange-400 hover:to-rose-500 text-gray-950 font-black text-xs shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer border border-amber-300/40">
            <i data-lucide="zap" id="updato-icon" class="w-4 h-4 fill-current text-gray-950 transition-transform group-hover:scale-110"></i>
            <span id="updato-btn-text" class="tracking-wide">UPDATO</span>
            <span class="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black rounded bg-gray-950/20 text-gray-950 uppercase">Live Algo</span>
          </button>

          <button onclick="sendQuickPrompt('Analyze the Indian retail FMCG company price updates and tell me where Rani Market has the highest margin opportunities.')" type="button" class="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 text-xs font-bold text-gray-200 shadow flex items-center gap-1.5 transition">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>Margin Strategy</span>
          </button>
        </div>
      </div>

      <!-- Algorithmic Macro Summary Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FMCG Stock Index</span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-sm font-black text-emerald-400" id="retail-summary-stock">+1.25%</span>
            <span class="text-[10px] text-gray-500">Weekly Avg</span>
          </div>
        </div>

        <div class="flex flex-col border-l border-gray-800/80 pl-3">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wholesale Inflation (WPI)</span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-sm font-black text-rose-400" id="retail-summary-wpi">+1.9%</span>
            <span class="text-[10px] text-gray-500">Input Cost Pressure</span>
          </div>
        </div>

        <div class="flex flex-col border-l border-gray-800/80 pl-3">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Weekly Mover</span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-xs font-black text-white truncate max-w-[150px]" id="retail-summary-mover">Adani Wilmar (+3.8%)</span>
          </div>
        </div>

        <div class="flex flex-col border-l border-gray-800/80 pl-3">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Margin Schemes</span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-sm font-black text-amber-400" id="retail-summary-schemes">7 Schemes</span>
            <span class="text-[10px] text-gray-500">10 Companies Tracked</span>
          </div>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
        <button type="button" onclick="filterRetailCompanies('all', this)" class="retail-filter-btn px-3 py-1.5 rounded-lg bg-amber-500 text-gray-950 font-bold transition">All 10 Companies</button>
        <button type="button" onclick="filterRetailCompanies('staples', this)" class="retail-filter-btn px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition">Staples &amp; Edible Oils</button>
        <button type="button" onclick="filterRetailCompanies('personal', this)" class="retail-filter-btn px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition">Personal Wash &amp; Home Care</button>
        <button type="button" onclick="filterRetailCompanies('foods', this)" class="retail-filter-btn px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition">Bakery, Noodles &amp; Dairy</button>
        <button type="button" onclick="filterRetailCompanies('health', this)" class="retail-filter-btn px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition">Health &amp; Ayurvedic</button>
      </div>

      <!-- Companies Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" id="retail-companies-container">
        <div class="col-span-full py-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
          <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
          <span>Loading Indian retail market companies &amp; weekly updates...</span>
        </div>
      </div>
    </div>
`;

const jsFunctions = `
    // ==========================================
    // INDIAN RETAIL MARKET FMCG CORPORATE PULSE & UPDATO
    // ==========================================
    let cachedRetailData = null;
    let currentRetailFilter = 'all';

    function askAiAboutCompany(companyName) {
      sendQuickPrompt('Explain wholesale trade terms, stock order timing, and retailer margins for ' + companyName);
    }

    function renderIndianRetailCompanies(data) {
      if (!data) return;
      cachedRetailData = data;
      const companies = data.companies || [];
      const summary = data.summary || {};

      // Update Summary Strip
      const elStock = document.getElementById('retail-summary-stock');
      if (elStock && summary.avgWeeklyStockChange) {
        elStock.innerText = summary.avgWeeklyStockChange;
        elStock.className = summary.avgWeeklyStockChange.startsWith('-') ? 'text-sm font-black text-rose-400' : 'text-sm font-black text-emerald-400';
      }

      const elWpi = document.getElementById('retail-summary-wpi');
      if (elWpi && summary.avgWholesaleInflation) {
        elWpi.innerText = summary.avgWholesaleInflation;
      }

      const elMover = document.getElementById('retail-summary-mover');
      if (elMover && summary.topMover) {
        elMover.innerText = summary.topMover;
        elMover.title = summary.topMover;
      }

      const elSchemes = document.getElementById('retail-summary-schemes');
      if (elSchemes && summary.marginExpansionCount !== undefined) {
        elSchemes.innerText = summary.marginExpansionCount + ' Margin Schemes';
      }

      const elUpdatedBadge = document.getElementById('retail-last-updated-badge');
      if (elUpdatedBadge && summary.lastUpdatedFormatted) {
        elUpdatedBadge.innerText = 'Updated: ' + summary.lastUpdatedFormatted;
      }

      // Filter and render cards
      renderRetailCardsFiltered(companies, currentRetailFilter);
    }

    function renderRetailCardsFiltered(companies, filter) {
      const container = document.getElementById('retail-companies-container');
      if (!container) return;

      const categoryMap = {
        staples: ['itc', 'tataconsum', 'adani_wilmar'],
        personal: ['hul', 'godrej_consumer'],
        foods: ['britannia', 'nestle', 'vbl_hatsun'],
        health: ['marico', 'dabur']
      };

      const filtered = filter === 'all' 
        ? companies 
        : companies.filter(c => (categoryMap[filter] || []).includes(c.id));

      container.innerHTML = '';

      if (filtered.length === 0) {
        container.innerHTML = '<div class="col-span-full py-8 text-center text-gray-500 text-xs">No companies match this filter category.</div>';
        return;
      }

      filtered.forEach(c => {
        const isBullish = c.trend === 'bullish';
        const isBearish = c.trend === 'bearish';
        const trendClass = isBullish ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : (isBearish ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-blue-400 bg-blue-500/10 border-blue-500/30');
        const arrow = isBullish ? '▲' : (isBearish ? '▼' : '◆');

        const card = document.createElement('div');
        card.className = 'group relative rounded-2xl p-4 bg-gray-950/70 border border-gray-800 flex flex-col justify-between hover:border-amber-500/50 hover:bg-gray-900/90 transition-all duration-200 shadow-sm';
        
        const priceNum = Number(c.stockPrice || 0);
        const formattedPrice = priceNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const safeCompanyName = String(c.name || '').replace(/"/g, '&quot;');
        const updateDate = c.lastUpdatedFormatted ? c.lastUpdatedFormatted.split(',')[0] : 'Weekly';

        card.innerHTML = \`
          <div>
            <!-- Top Ticker & Weekly Stock -->
            <div class="flex items-start justify-between gap-2">
              <span class="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-800 text-amber-300 border border-gray-700 font-mono tracking-wider">\${c.ticker}</span>
              <span class="text-[11px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 \${trendClass}">
                <span>\${arrow}</span> \${c.weeklyStockChange}
              </span>
            </div>

            <!-- Company Name & Sector -->
            <div class="mt-2.5">
              <h4 class="text-xs font-black text-white group-hover:text-amber-300 transition line-clamp-1" title="\${safeCompanyName}">\${safeCompanyName}</h4>
              <p class="text-[10px] text-gray-400 mt-0.5 line-clamp-1">\${c.sector}</p>
            </div>

            <!-- Price & WPI Metrics -->
            <div class="grid grid-cols-2 gap-1.5 mt-3 p-2 rounded-xl bg-gray-900/90 border border-gray-800/80 text-[11px]">
              <div>
                <span class="text-[9px] text-gray-400 uppercase font-bold block">Share Price</span>
                <span class="font-black text-white">₹\${formattedPrice}</span>
              </div>
              <div class="border-l border-gray-800 pl-2">
                <span class="text-[9px] text-gray-400 uppercase font-bold block">Wholesale Index</span>
                <span class="font-black text-amber-400">\${c.wholesalePriceIndex} <span class="text-[9px] font-semibold text-gray-400">(\${c.wholesalePriceChange})</span></span>
              </div>
            </div>

            <!-- Shelf Brands in SKS/Rani Market -->
            <div class="mt-2.5">
              <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Key Shelf Brands:</span>
              <p class="text-[10px] font-medium text-gray-300 line-clamp-2 leading-relaxed bg-gray-900/40 p-1.5 rounded-lg border border-gray-800/50">
                \${c.keyBrandsInStore}
              </p>
            </div>

            <!-- Distributor Margin / Trade Scheme -->
            <div class="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span class="text-[9px] font-black text-amber-300 uppercase tracking-wider block mb-0.5">Distributor Scheme</span>
              <p class="text-[10px] font-medium text-amber-100/90 line-clamp-2 leading-tight">\${c.retailMarginStatus}</p>
            </div>

            <!-- MRP Revision Alert -->
            <div class="mt-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span class="text-[9px] font-black text-rose-300 uppercase tracking-wider block mb-0.5">MRP Revision Alert</span>
              <p class="text-[10px] font-medium text-rose-100/90 line-clamp-2 leading-tight">\${c.mrpRevisionOutlook}</p>
            </div>

            <!-- Retailer Action Advice -->
            <div class="mt-2.5">
              <p class="text-[10px] text-gray-300 leading-snug line-clamp-3">
                <b class="text-white">Store Action:</b> \${c.recommendedRetailerAction}
              </p>
            </div>
          </div>

          <!-- Bottom Timestamp & Quick AI Prompt -->
          <div class="mt-3 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
            <span class="text-gray-400 flex items-center gap-1 font-mono">
              <i data-lucide="clock" class="w-2.5 h-2.5"></i> \${updateDate}
            </span>
            <button type="button" data-cname="\${safeCompanyName}" onclick="askAiAboutCompany(this.getAttribute('data-cname'))" class="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition">
              <span>Ask AI</span>
              <i data-lucide="arrow-right" class="w-2.5 h-2.5"></i>
            </button>
          </div>
        \`;
        container.appendChild(card);
      });

      lucide.createIcons();
    }

    function filterRetailCompanies(category, btn) {
      currentRetailFilter = category;
      document.querySelectorAll('.retail-filter-btn').forEach(b => {
        b.className = 'retail-filter-btn px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition';
      });
      if (btn) {
        btn.className = 'retail-filter-btn px-3 py-1.5 rounded-lg bg-amber-500 text-gray-950 font-bold transition';
      }
      if (cachedRetailData && cachedRetailData.companies) {
        renderRetailCardsFiltered(cachedRetailData.companies, category);
      }
    }

    async function triggerUpdato() {
      const btn = document.getElementById('btn-updato');
      const icon = document.getElementById('updato-icon');
      const txt = document.getElementById('updato-btn-text');

      if (btn) {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-wait');
      }
      if (icon) {
        icon.classList.add('animate-spin');
      }
      if (txt) {
        txt.innerText = 'CALCULATING...';
      }

      showToast('⚡ UPDATO: Executing live Indian FMCG market pricing algorithm...');

      try {
        const res = await fetch('/api/ai-analytics/updato', { method: 'POST' });
        const data = await res.json();
        if (data && data.success) {
          renderIndianRetailCompanies(data);
          const container = document.getElementById('retail-companies-container');
          if (container) {
            container.classList.add('ring-2', 'ring-amber-400', 'transition-all', 'duration-500');
            setTimeout(() => container.classList.remove('ring-2', 'ring-amber-400'), 1500);
          }
          showToast('⚡ UPDATO COMPLETE: Top 10 Indian FMCG Market Leaders Lively Updated!');
        } else {
          showToast('⚠️ Could not complete algorithmic update.');
        }
      } catch (err) {
        console.error('UPDATO error:', err);
        showToast('⚠️ Error executing UPDATO: ' + err.message);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('opacity-75', 'cursor-wait');
        }
        if (icon) {
          icon.classList.remove('animate-spin');
        }
        if (txt) {
          txt.innerText = 'UPDATO';
        }
      }
    }
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already injected
  if (content.includes('INDIAN RETAIL MARKET: TOP FMCG')) {
    console.log(filePath, 'already has retail section.');
    return;
  }

  // 1. Inject HTML before <!-- GLOBAL COMMODITY & WORLD TRADE MARKET BAROMETER -->
  const htmlMarker = '<!-- GLOBAL COMMODITY & WORLD TRADE MARKET BAROMETER -->';
  if (!content.includes(htmlMarker)) {
    console.error('htmlMarker not found in', filePath);
    return;
  }
  content = content.replace(htmlMarker, sectionHtml + '\n    ' + htmlMarker);

  // 2. Add fetch in Promise.all inside loadAllAnalytics
  const fetchTarget = "fetch('/api/ai/world-trade-predictions').then(r => r.json())";
  const fetchReplacement = "fetch('/api/ai/world-trade-predictions').then(r => r.json()),\n          fetch('/api/ai-analytics/indian-retail-companies').then(r => r.json())";
  if (!content.includes(fetchTarget)) {
    console.error('fetchTarget not found in', filePath);
    return;
  }
  content = content.replace(fetchTarget, fetchReplacement);

  // 3. Unpack retailRes in Promise.all
  const unpackTarget = "[overviewRes, dailyRes, monthlyRes, yearlyRes, hourlyRes, forecastRes, deadRes, festivalRes, tradeRes]";
  const unpackReplacement = "[overviewRes, dailyRes, monthlyRes, yearlyRes, hourlyRes, forecastRes, deadRes, festivalRes, tradeRes, retailRes]";
  if (!content.includes(unpackTarget)) {
    console.error('unpackTarget not found in', filePath);
    return;
  }
  content = content.replace(unpackTarget, unpackReplacement);

  // 4. Call renderIndianRetailCompanies
  const renderCallTarget = "renderWorldTradeCards(tradeRes);";
  const renderCallReplacement = "renderWorldTradeCards(tradeRes);\n\n        // Render Indian Retail FMCG Companies & Updates\n        renderIndianRetailCompanies(retailRes);";
  if (!content.includes(renderCallTarget)) {
    console.error('renderCallTarget not found in', filePath);
    return;
  }
  content = content.replace(renderCallTarget, renderCallReplacement);

  // 5. Inject JS functions before renderWorldTradeCards
  const jsMarker = "function renderWorldTradeCards(tradeData) {";
  if (!content.includes(jsMarker)) {
    console.error('jsMarker not found in', filePath);
    return;
  }
  content = content.replace(jsMarker, jsFunctions + '\n    ' + jsMarker);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched', filePath);
}

processFile(path.join(__dirname, '..', 'ai-analytics.html'));
processFile(path.join(__dirname, '..', 'public', 'ai-analytics.html'));
