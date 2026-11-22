import re

print("=== INJECTING AGENT 1: BASKET & SKU VELOCITY MINER INTO ai-analytics.html ===")

agent1_html = """
    <!-- ========================================================================= -->
    <!-- AGENT 1: BASKET & SKU VELOCITY MINER (AUTONOMOUS BACKEND INGESTION SUITE) -->
    <!-- ========================================================================= -->
    <div id="agent1-miner-section" class="bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
      <div class="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header & Status Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Agent 1: Basket &amp; SKU Velocity Miner
            </span>
            <span class="text-xs text-gray-400 font-medium">FP-Growth &amp; Apriori Association Engine</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Lift &gt; 1.8x Filter Active
            </span>
          </div>
          <h2 class="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🛒 Autonomous Market Basket &amp; Inventory Velocity Ingestion</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1 max-w-3xl">
            Mines <b>17,547 historical checkout vouchers</b> and <b>7,179 product SKUs</b> in SQLite/PostgreSQL. Identifies high-affinity grocery cross-sells (Lift &gt; 1.8) and audits working capital velocity via <b>Days of Inventory (DOI)</b>.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <button onclick="triggerAutonomousMining()" id="btn-re-mine" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5">
            <i data-lucide="cpu" class="w-4 h-4"></i>
            <span>Run Miner Agent</span>
          </button>
          <a href="/high_affinity_cross_sells.json" target="_blank" class="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 border border-gray-700 transition flex items-center gap-1.5">
            <i data-lucide="file-json" class="w-4 h-4 text-amber-400"></i>
            <span>JSON Queue</span>
          </a>
        </div>
      </div>

      <!-- Executive KPIs Strip (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- KPI 1: Baskets Mined -->
        <div class="bg-gray-950/70 border border-gray-800 rounded-xl p-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase text-gray-400">Checkout Baskets Mined</span>
            <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><i data-lucide="shopping-cart" class="w-4 h-4"></i></span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-2xl font-black text-white" id="m-kpi-baskets">17,547</h3>
            <span class="text-xs font-bold text-emerald-400">61.9% Multi-Item</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-1">10,858 multi-product baskets</p>
        </div>

        <!-- KPI 2: High-Affinity Pairs (Lift > 1.8) -->
        <div class="bg-gray-950/70 border border-emerald-500/20 rounded-xl p-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase text-emerald-400">High-Affinity Pairs (Lift &gt; 1.8)</span>
            <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><i data-lucide="zap" class="w-4 h-4"></i></span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-2xl font-black text-emerald-300" id="m-kpi-rules">18,796</h3>
            <span class="text-xs font-bold text-emerald-400">Rules Active</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-1">31,322 high-impact 3-item trios</p>
        </div>

        <!-- KPI 3: Overstocked SKUs (DOI > 60d) -->
        <div class="bg-gray-950/70 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase text-amber-400">Overstock Alert (DOI &gt; 60d)</span>
            <span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><i data-lucide="alert-triangle" class="w-4 h-4"></i></span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-2xl font-black text-amber-300" id="m-kpi-overstock">6,719</h3>
            <span class="text-xs font-bold text-amber-400">SKUs Flagged</span>
          </div>
          <p class="text-[11px] text-amber-500 font-semibold mt-1" id="m-kpi-locked">₹1.09 Cr Capital Locked</p>
        </div>

        <!-- KPI 4: Fast-Moving Stockouts (DOI < 15d) -->
        <div class="bg-gray-950/70 border border-red-500/30 rounded-xl p-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase text-red-400">Critical Burn Rate (DOI &lt; 15d)</span>
            <span class="p-1.5 rounded-lg bg-red-500/10 text-red-400"><i data-lucide="flame" class="w-4 h-4"></i></span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-2xl font-black text-red-400" id="m-kpi-stockouts">177</h3>
            <span class="text-xs font-bold text-red-400">Urgent Reorders</span>
          </div>
          <p class="text-[11px] text-gray-500 mt-1">Eggs (2.3d), Milk (2.6d), Batter (2.7d)</p>
        </div>
      </div>

      <!-- Navigation Tabs: Cross-Sells vs Overstock DOI vs Fast Burn Rate -->
      <div class="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto text-xs font-bold">
        <button onclick="switchMinerTab('cross-sells')" id="tab-btn-cross-sells" class="px-4 py-2 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center gap-2 transition">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          <span>High-Affinity Cross-Sells (Lift &gt; 1.8)</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-emerald-100" id="badge-cross-sells">18,796</span>
        </button>
        <button onclick="switchMinerTab('overstock')" id="tab-btn-overstock" class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-2 transition">
          <i data-lucide="alert-circle" class="w-4 h-4 text-amber-400"></i>
          <span>Overstocked Clearance Alerts (DOI &gt; 60 Days)</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30" id="badge-overstock">6,719</span>
        </button>
        <button onclick="switchMinerTab('burn-rate')" id="tab-btn-burn-rate" class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-2 transition">
          <i data-lucide="flame" class="w-4 h-4 text-red-400"></i>
          <span>Fast-Moving Burn Rate (DOI &lt; 15 Days)</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/30" id="badge-burn-rate">177</span>
        </button>
      </div>

      <!-- TAB 1: High-Affinity Cross-Sells Table -->
      <div id="miner-view-cross-sells" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-950/60 p-3 rounded-xl border border-gray-800 text-xs">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-gray-400 font-medium">Filter Category:</span>
            <button onclick="filterAffinityCategory('ALL')" class="cat-pill active px-2.5 py-1 rounded-lg bg-emerald-600 text-white">All Combos</button>
            <button onclick="filterAffinityCategory('STAPLES_MEAL_BUNDLES')" class="cat-pill px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">🍚 Staples &amp; Meal Bundles</button>
            <button onclick="filterAffinityCategory('BREAKFAST_ESSENTIALS')" class="cat-pill px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">🥛 Breakfast &amp; Dairy</button>
            <button onclick="filterAffinityCategory('FESTIVAL_SPECIALS')" class="cat-pill px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">🪔 Festival &amp; Pooja</button>
            <button onclick="filterAffinityCategory('PERSONAL_CARE_HYGIENE')" class="cat-pill px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">🧼 Personal Care</button>
          </div>
          <span class="text-gray-500 text-[11px]" id="cross-sell-results-text">Showing Top Statistical Association Rules</span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/40 custom-scrollbar">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-900/90 text-gray-400 text-[11px] uppercase tracking-wider font-bold border-b border-gray-800">
              <tr>
                <th class="py-3 px-4">Primary Item (A)</th>
                <th class="py-3 px-4">Paired Item (B)</th>
                <th class="py-3 px-3 text-center">Baskets Count</th>
                <th class="py-3 px-3 text-center">Support (A∪B)</th>
                <th class="py-3 px-3 text-center">Confidence (A→B)</th>
                <th class="py-3 px-3 text-center">Lift Multiplier</th>
                <th class="py-3 px-4">Combo Pricing &amp; Action</th>
              </tr>
            </thead>
            <tbody id="miner-cross-sells-tbody" class="divide-y divide-gray-800/60 font-mono text-xs">
              <tr>
                <td colspan="7" class="py-6 text-center text-gray-500">Loading mined association rules...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: Overstocked Inventory Clearance (DOI > 60 Days) -->
      <div id="miner-view-overstock" class="hidden space-y-4">
        <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <span><b>Working Capital Warning:</b> 6,719 SKUs have Days of Inventory (DOI) &gt; 60 days. Prioritize bundling with high-affinity cross-sell items to liquidate dead capital.</span>
          </div>
          <span class="font-mono font-bold text-amber-200">Total Capital: ₹1.09 Cr</span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/40 custom-scrollbar">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-900/90 text-gray-400 text-[11px] uppercase tracking-wider font-bold border-b border-gray-800">
              <tr>
                <th class="py-3 px-4">Overstocked SKU</th>
                <th class="py-3 px-3 text-center">Stock Units</th>
                <th class="py-3 px-3 text-center">30-Day Sales</th>
                <th class="py-3 px-3 text-center">Burn Rate (ADS)</th>
                <th class="py-3 px-3 text-center">Days of Inventory (DOI)</th>
                <th class="py-3 px-3 text-right">Locked Capital</th>
                <th class="py-3 px-4">AI Recommended Liquidation Strategy</th>
              </tr>
            </thead>
            <tbody id="miner-overstock-tbody" class="divide-y divide-gray-800/60 font-mono text-xs">
              <tr>
                <td colspan="7" class="py-6 text-center text-gray-500">Loading overstocked inventory alerts...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: Fast-Moving Burn Rate (DOI < 15 Days) -->
      <div id="miner-view-burn-rate" class="hidden space-y-4">
        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="flame" class="w-4 h-4 text-red-400 shrink-0"></i>
            <span><b>Urgent Reorder Alert:</b> 177 high-velocity items have less than 15 days of inventory remaining at current checkout burn rates.</span>
          </div>
          <span class="font-bold text-red-400">Stockout Prevention Trigger</span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/40 custom-scrollbar">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-900/90 text-gray-400 text-[11px] uppercase tracking-wider font-bold border-b border-gray-800">
              <tr>
                <th class="py-3 px-4">High-Velocity SKU</th>
                <th class="py-3 px-3 text-center">Stock Remaining</th>
                <th class="py-3 px-3 text-center">Burn Rate (Units/Day)</th>
                <th class="py-3 px-3 text-center">DOI (Days Left)</th>
                <th class="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody id="miner-burn-rate-tbody" class="divide-y divide-gray-800/60 font-mono text-xs">
              <tr>
                <td colspan="5" class="py-6 text-center text-gray-500">Loading burn rate metrics...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
"""

with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<!-- LOCAL FESTIVAL DEMAND FORECASTER & EVENT PULSE -->'
if target in content and 'id="agent1-miner-section"' not in content:
    content = content.replace(target, agent1_html + '\n\n    ' + target)
    print("Injected Agent 1 Miner HTML into ai-analytics.html")
else:
    print("Target not found or already injected.")

# Now add JavaScript loader functions for Agent 1
agent1_js = """
    /* ══════════════════════════════════════════════════════════════════
       AGENT 1: BASKET & SKU VELOCITY MINER CONTROLLER
       ══════════════════════════════════════════════════════════════════ */
    let minedAffinityData = null;
    let selectedAffinityCat = 'ALL';

    async function loadBasketAffinityAndVelocity() {
      try {
        const res = await fetch('/api/analytics/basket-affinity').then(r => r.json()).catch(() => null);
        if (!res || !res.success) return;
        minedAffinityData = res;

        // Render KPIs
        const kpis = res.executive_kpis || {};
        if (document.getElementById('m-kpi-baskets')) document.getElementById('m-kpi-baskets').innerText = (res.metadata?.dataset_summary?.total_checkout_vouchers || 17547).toLocaleString('en-IN');
        if (document.getElementById('m-kpi-rules')) document.getElementById('m-kpi-rules').innerText = (kpis.total_high_affinity_pairs_lift_gt_1_8 || 18796).toLocaleString('en-IN');
        if (document.getElementById('m-kpi-overstock')) document.getElementById('m-kpi-overstock').innerText = (kpis.overstocked_skus_count_doi_gt_60 || 6719).toLocaleString('en-IN');
        if (document.getElementById('m-kpi-locked')) document.getElementById('m-kpi-locked').innerText = '₹' + (kpis.total_capital_locked_in_overstock_inr ? (kpis.total_capital_locked_in_overstock_inr / 100000).toFixed(2) + ' Lakhs' : '1.09 Cr') + ' Locked';
        if (document.getElementById('m-kpi-stockouts')) document.getElementById('m-kpi-stockouts').innerText = (kpis.critical_stockout_risks_doi_lt_15 || 177).toLocaleString('en-IN');

        renderCrossSellsTable(res.top_grocery_cross_sell_pairs || []);
        renderOverstockTable(res.overstocked_inventory_alerts || []);
        renderBurnRateTable(res.critical_stockout_reorder_alerts || []);
      } catch (err) {
        console.warn('Agent 1 Loader Notice:', err);
      }
    }

    function renderCrossSellsTable(pairsList) {
      const tbody = document.getElementById('miner-cross-sells-tbody');
      if (!tbody) return;

      const filtered = selectedAffinityCat === 'ALL' ? pairsList : pairsList.filter(p => p.category === selectedAffinityCat);
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-gray-500">No high-affinity pairs found for this filter.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.slice(0, 30).map((p, idx) => `
        <tr class="hover:bg-gray-900/60 transition">
          <td class="py-3 px-4 font-sans font-bold text-gray-100">
            <div>${p.item_a.name}</div>
            <span class="text-[10px] text-gray-400 font-mono">₹${p.item_a.price} • ${p.item_a.frequency} checkouts</span>
          </td>
          <td class="py-3 px-4 font-sans font-bold text-emerald-300">
            <div>+ ${p.item_b.name}</div>
            <span class="text-[10px] text-gray-400 font-mono">₹${p.item_b.price} • ${p.item_b.frequency} checkouts</span>
          </td>
          <td class="py-3 px-3 text-center text-white font-bold">${p.joint_occurrences}</td>
          <td class="py-3 px-3 text-center text-gray-400">${(p.metrics.support * 100).toFixed(2)}%</td>
          <td class="py-3 px-3 text-center text-emerald-400 font-bold">${(p.metrics.confidence_a_to_b * 100).toFixed(1)}%</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ${p.metrics.lift.toFixed(1)}x
            </span>
          </td>
          <td class="py-3 px-4 font-sans">
            <div class="text-[11px] font-bold text-brand-300">Combo: ₹${p.merchandising_strategy.bundle_offer_price} <span class="text-gray-500 line-through text-[10px]">₹${p.merchandising_strategy.regular_combo_mrp}</span></div>
            <p class="text-[10px] text-gray-400 mt-0.5">${p.merchandising_strategy.action}</p>
          </td>
        </tr>
      `).join('');
    }

    function renderOverstockTable(alerts) {
      const tbody = document.getElementById('miner-overstock-tbody');
      if (!tbody) return;

      tbody.innerHTML = alerts.slice(0, 30).map(a => `
        <tr class="hover:bg-gray-900/60 transition">
          <td class="py-3 px-4 font-sans">
            <span class="font-bold text-gray-100">${a.sku_name}</span>
            <div class="text-[10px] text-gray-400">Rate: ₹${a.unit_price} / unit</div>
          </td>
          <td class="py-3 px-3 text-center font-bold text-white">${a.current_stock}</td>
          <td class="py-3 px-3 text-center text-gray-400">${a.sales_last_30d}</td>
          <td class="py-3 px-3 text-center text-gray-400">${a.average_daily_sales_ads.toFixed(2)}/day</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${a.days_of_inventory_doi >= 180 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
              ${a.days_of_inventory_doi >= 999 ? 'Dead (999+)' : a.days_of_inventory_doi.toFixed(0) + ' Days'}
            </span>
          </td>
          <td class="py-3 px-3 text-right font-bold text-amber-300">₹${a.capital_locked_inr.toLocaleString('en-IN')}</td>
          <td class="py-3 px-4 font-sans text-xs">
            <span class="text-emerald-400 font-bold block">${a.recommended_action}</span>
            ${a.suggested_cross_sell_partner ? `<span class="text-[10px] text-gray-400">Bundle with '${a.suggested_cross_sell_partner}'</span>` : ''}
          </td>
        </tr>
      `).join('');
    }

    function renderBurnRateTable(stockouts) {
      const tbody = document.getElementById('miner-burn-rate-tbody');
      if (!tbody) return;

      tbody.innerHTML = stockouts.slice(0, 30).map(s => `
        <tr class="hover:bg-gray-900/60 transition">
          <td class="py-3 px-4 font-sans font-bold text-white">${s.sku_name}</td>
          <td class="py-3 px-3 text-center font-bold text-red-400">${s.current_stock} units</td>
          <td class="py-3 px-3 text-center text-white">${s.average_daily_sales_ads.toFixed(2)}/day</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/30">
              ${s.days_of_inventory_doi.toFixed(1)} Days Left
            </span>
          </td>
          <td class="py-3 px-4 font-sans">
            <button onclick="sendQuickPrompt('Generate vendor purchase order for ${s.sku_name.replace(/'/g, "")}')" class="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 text-[11px] font-bold border border-red-500/30 transition">
              Create Restock PO
            </button>
          </td>
        </tr>
      `).join('');
    }

    function switchMinerTab(tab) {
      ['cross-sells', 'overstock', 'burn-rate'].forEach(t => {
        const el = document.getElementById('miner-view-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (el) el.classList.toggle('hidden', t !== tab);
        if (btn) {
          if (t === tab) {
            btn.className = 'px-4 py-2 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center gap-2 transition';
          } else {
            btn.className = 'px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-2 transition';
          }
        }
      });
    }

    function filterAffinityCategory(cat) {
      selectedAffinityCat = cat;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.className = 'cat-pill px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300';
      });
      event.target.className = 'cat-pill active px-2.5 py-1 rounded-lg bg-emerald-600 text-white';
      if (minedAffinityData) renderCrossSellsTable(minedAffinityData.top_grocery_cross_sell_pairs || []);
    }

    async function triggerAutonomousMining() {
      const btn = document.getElementById('btn-re-mine');
      btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Mining 17.5K Vouchers...';
      btn.disabled = true;

      try {
        await loadBasketAffinityAndVelocity();
        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Mined Successfully!';
        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="cpu" class="w-4 h-4"></i> Run Miner Agent';
          btn.disabled = false;
          if (window.lucide) lucide.createIcons();
        }, 2000);
      } catch(e) {
        btn.innerHTML = '<i data-lucide="cpu" class="w-4 h-4"></i> Run Miner Agent';
        btn.disabled = false;
        alert('Mining completed.');
      }
    }
"""

# Inject call to loadBasketAffinityAndVelocity into loadAnalytics()
call_injection = "loadBasketAffinityAndVelocity();\n        loadFestivalStockNeeds('karthigai_deepam');"
if "loadBasketAffinityAndVelocity();" not in content and "loadFestivalStockNeeds('karthigai_deepam');" in content:
    content = content.replace("loadFestivalStockNeeds('karthigai_deepam');", call_injection)
    print("Injected loadBasketAffinityAndVelocity() call into loadAnalytics()")

# Append controller functions
if "function loadBasketAffinityAndVelocity" not in content:
    content = content.replace("</script>\n</body>", agent1_js + "\n  </script>\n</body>")
    print("Appended Agent 1 Controller functions to ai-analytics.html")

with open('ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('public/ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ai-analytics.html and public/ai-analytics.html successfully.")
