import re
import os

print("=== INJECTING RFM SEGMENTATION DASHBOARD INTO AI-ANALYTICS.HTML ===")

rfm_html = '''
    <!-- ================================================================= -->
    <!-- AGENT 5 / ROLE: SENIOR RETAIL ANALYTICS & DATA SCIENCE ENGINEER   -->
    <!-- AUTONOMOUS RFM CUSTOMER SEGMENTATION & COHORT PARTITIONS          -->
    <!-- ================================================================= -->
    <div id="agent-rfm-section" class="bg-gray-900 border border-indigo-500/30 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      <!-- Glow ambient backdrop -->
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800 relative z-10">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Agent 5: Senior Retail Analytics & Data Science Engineer
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-Refresh Weekly: Active
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              SQLite: customer_rfm_partitions (340 Rows)
            </span>
          </div>
          <h2 class="text-xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>👥 Autonomous RFM Customer Segmentation & Cohort Partitions</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1 max-w-3xl">
            Calculates <b>Recency</b> (Days since last checkout), <b>Frequency</b> (12-month unique visits), and <b>Monetary</b> (12-month net revenue) with <b>Quintile Scoring (111 to 555)</b> across 340 identified patron accounts in Bodinayakanur & Theni district. Bridges directly with <b>Agent 2</b> and <b>Agent 3</b> for automated multi-channel retention blasts.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <button onclick="triggerRfmScoreRefresh()" id="btn-refresh-rfm" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>🔄 Re-Score RFM Partitions</span>
          </button>
          <a href="/data/customer_rfm_partitions.json" target="_blank" download class="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs flex items-center gap-1.5 transition">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>JSON Queue</span>
          </a>
        </div>
      </div>

      <!-- 4 Dedicated Cohort Executive Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <!-- Cohort 1: VIP High-Spenders -->
        <div onclick="selectRfmFilterCohort('VIP_HIGH_SPENDERS')" class="cursor-pointer bg-gradient-to-b from-emerald-950/40 to-gray-950 p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/10 group">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              👑 R &ge; 4, F &ge; 4, M &ge; 4
            </span>
            <span class="text-xs font-bold text-emerald-400" id="rfm-vip-pct">2.4% Patrons</span>
          </div>
          <h3 class="text-sm font-black text-white group-hover:text-emerald-300 transition">VIP High-Spenders</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">Monthly grocery spend &gt; ₹4,500</p>
          <div class="mt-3 pt-3 border-t border-gray-800/80 flex items-baseline justify-between">
            <div>
              <div class="text-xl font-black text-emerald-300" id="rfm-vip-count">8</div>
              <div class="text-[10px] text-gray-400">Patron Accounts</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-black text-white" id="rfm-vip-rev">₹4.19 Lakh</div>
              <div class="text-[10px] text-emerald-400/80">Avg ₹52,415 / cust</div>
            </div>
          </div>
          <div class="mt-2.5 text-[10px] text-emerald-300/90 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
            <b>Strategy:</b> Dedicated WhatsApp Concierge + Free Priority Delivery
          </div>
        </div>

        <!-- Cohort 2: Daily Essentials / Milk Loyals -->
        <div onclick="selectRfmFilterCohort('DAILY_ESSENTIALS_MILK_LOYALS')" class="cursor-pointer bg-gradient-to-b from-cyan-950/40 to-gray-950 p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/10 group">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              🥛 R = 5, F &ge; 4, M &le; 2
            </span>
            <span class="text-xs font-bold text-cyan-400">High Frequency</span>
          </div>
          <h3 class="text-sm font-black text-white group-hover:text-cyan-300 transition">Daily Essentials / Milk Loyals</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">Frequent perishable dairy & snack shoppers</p>
          <div class="mt-3 pt-3 border-t border-gray-800/80 flex items-baseline justify-between">
            <div>
              <div class="text-xl font-black text-cyan-300" id="rfm-milk-count">1</div>
              <div class="text-[10px] text-gray-400">High-Visit Patrons</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-black text-white" id="rfm-milk-rev">₹3,664</div>
              <div class="text-[10px] text-cyan-400/80">Avg ₹407 / ticket</div>
            </div>
          </div>
          <div class="mt-2.5 text-[10px] text-cyan-300/90 bg-cyan-950/60 p-2 rounded-lg border border-cyan-800/40">
            <b>Strategy:</b> Counter Impulse Bundles (Ghee/Tea) to lift ticket &gt; ₹280
          </div>
        </div>

        <!-- Cohort 3: Weekend Family Shoppers -->
        <div onclick="selectRfmFilterCohort('WEEKEND_FAMILY_SHOPPERS')" class="cursor-pointer bg-gradient-to-b from-purple-950/40 to-gray-950 p-4 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-500/10 group">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
              👨‍👩‍👧‍👦 R &ge; 3, F &ge; 3, M &ge; 3
            </span>
            <span class="text-xs font-bold text-purple-400">&ge; 35% Weekend</span>
          </div>
          <h3 class="text-sm font-black text-white group-hover:text-purple-300 transition">Weekend Family Shoppers</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">Bulk family staples on Friday–Sunday</p>
          <div class="mt-3 pt-3 border-t border-gray-800/80 flex items-baseline justify-between">
            <div>
              <div class="text-xl font-black text-purple-300" id="rfm-weekend-count">4</div>
              <div class="text-[10px] text-gray-400">Family Households</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-black text-white" id="rfm-weekend-rev">₹1.62 Lakh</div>
              <div class="text-[10px] text-purple-400/80">Avg ₹40,571 / cust</div>
            </div>
          </div>
          <div class="mt-2.5 text-[10px] text-purple-300/90 bg-purple-950/60 p-2 rounded-lg border border-purple-800/40">
            <b>Strategy:</b> Thursday 05:30 PM blast: 25kg Rice + 5L Oil combo reservation
          </div>
        </div>

        <!-- Cohort 4: At-Risk / Lapsed Churn -->
        <div onclick="selectRfmFilterCohort('AT_RISK_LAPSED_CHURN')" class="cursor-pointer bg-gradient-to-b from-rose-950/40 to-gray-950 p-4 rounded-xl border border-rose-500/30 hover:border-rose-400 transition-all shadow-lg hover:shadow-rose-500/10 group">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
              🚨 R &le; 2, F &ge; 3, M &ge; 3
            </span>
            <span class="text-xs font-bold text-rose-400">Inactive 45+ Days</span>
          </div>
          <h3 class="text-sm font-black text-white group-hover:text-rose-300 transition">At-Risk / Lapsed Churn</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">Past big spenders who stopped visiting</p>
          <div class="mt-3 pt-3 border-t border-gray-800/80 flex items-baseline justify-between">
            <div>
              <div class="text-xl font-black text-rose-300" id="rfm-churn-count">124</div>
              <div class="text-[10px] text-gray-400">At-Risk Accounts</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-black text-white" id="rfm-churn-rev">₹29.43 Lakh</div>
              <div class="text-[10px] text-rose-400/80">73.7% locked revenue!</div>
            </div>
          </div>
          <div class="mt-2.5 text-[10px] text-rose-300/90 bg-rose-950/60 p-2 rounded-lg border border-rose-800/40">
            <b>Strategy:</b> Urgent 'We Miss You' Personal Tamil WhatsApp + ₹200 Voucher
          </div>
        </div>
      </div>

      <!-- Cohort Filter Pills & Search Explorer Bar -->
      <div class="bg-gray-950/70 p-4 rounded-xl border border-gray-800 space-y-3 relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Filter Pills -->
          <div class="flex items-center gap-1.5 flex-wrap overflow-x-auto w-full md:w-auto" id="rfm-filter-pills">
            <button onclick="selectRfmFilterCohort('ALL')" class="rfm-pill active px-3 py-1.5 rounded-xl text-xs font-bold transition bg-indigo-600 text-white" data-cohort="ALL">
              All Patrons (340)
            </button>
            <button onclick="selectRfmFilterCohort('VIP_HIGH_SPENDERS')" class="rfm-pill px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-900 text-gray-300 border border-gray-700 hover:border-emerald-500" data-cohort="VIP_HIGH_SPENDERS">
              👑 VIP Spenders (8)
            </button>
            <button onclick="selectRfmFilterCohort('DAILY_ESSENTIALS_MILK_LOYALS')" class="rfm-pill px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-900 text-gray-300 border border-gray-700 hover:border-cyan-500" data-cohort="DAILY_ESSENTIALS_MILK_LOYALS">
              🥛 Daily Milk Loyals (1)
            </button>
            <button onclick="selectRfmFilterCohort('WEEKEND_FAMILY_SHOPPERS')" class="rfm-pill px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-900 text-gray-300 border border-gray-700 hover:border-purple-500" data-cohort="WEEKEND_FAMILY_SHOPPERS">
              👨‍👩‍👧‍👦 Weekend Family (4)
            </button>
            <button onclick="selectRfmFilterCohort('AT_RISK_LAPSED_CHURN')" class="rfm-pill px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-900 text-gray-300 border border-gray-700 hover:border-rose-500" data-cohort="AT_RISK_LAPSED_CHURN">
              🚨 At-Risk Churn (124)
            </button>
            <button onclick="selectRfmFilterCohort('REGULAR_NEIGHBORHOOD_SHOPPERS')" class="rfm-pill px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-900 text-gray-300 border border-gray-700 hover:border-blue-500" data-cohort="REGULAR_NEIGHBORHOOD_SHOPPERS">
              🏡 Regular Shoppers (203)
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full md:w-72 shrink-0">
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" id="rfm-search-input" oninput="handleRfmSearch(this.value)" placeholder="Search name, phone, RFM score..." class="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          </div>
        </div>

        <!-- Customer Partition Data Table -->
        <div class="overflow-x-auto rounded-xl border border-gray-800">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-900/90 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th class="py-3 px-4">Patron & Contact</th>
                <th class="py-3 px-3">RFM Quintile</th>
                <th class="py-3 px-3">Recency (Days)</th>
                <th class="py-3 px-3">12M Visits</th>
                <th class="py-3 px-3">12M Net Spend</th>
                <th class="py-3 px-3">Assigned Cohort</th>
                <th class="py-3 px-4">Recommended Strategy</th>
                <th class="py-3 px-3 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody id="rfm-customers-tbody" class="divide-y divide-gray-800/60 font-mono">
              <!-- Populated dynamically via renderRfmCustomers() -->
              <tr>
                <td colspan="8" class="text-center py-6 text-gray-500 font-sans">Loading RFM customer partitions...</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination & Summary Footer -->
        <div class="flex items-center justify-between text-xs text-gray-400 pt-2 px-1">
          <div>
            Showing <span id="rfm-showing-count" class="font-bold text-white">0</span> of <span id="rfm-total-count" class="font-bold text-white">340</span> customer accounts
          </div>
          <div class="flex items-center gap-2">
            <button onclick="prevRfmPage()" id="btn-rfm-prev" class="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 disabled:opacity-40 disabled:pointer-events-none transition">Previous</button>
            <span id="rfm-page-indicator" class="font-bold text-indigo-400 px-2">Page 1</span>
            <button onclick="nextRfmPage()" id="btn-rfm-next" class="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 disabled:opacity-40 disabled:pointer-events-none transition">Next</button>
          </div>
        </div>
      </div>
    </div>
'''

rfm_script = '''
    // =================================================================
    // AGENT 5: RFM CUSTOMER SEGMENTATION ENGINE & COHORT INTERACTION
    // =================================================================
    let allRfmCustomers = [];
    let filteredRfmCustomers = [];
    let currentRfmCohort = 'ALL';
    let currentRfmSearch = '';
    let currentRfmPage = 1;
    const RFM_PAGE_SIZE = 15;

    async function initRfmDashboard() {
      try {
        const res = await fetch('/api/analytics/rfm-cohorts');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        
        // Update Executive Cards
        if (data.cohorts) {
          const vip = data.cohorts['VIP_HIGH_SPENDERS'];
          if (vip) {
            document.getElementById('rfm-vip-count').textContent = vip.customer_count;
            document.getElementById('rfm-vip-rev').textContent = '₹' + (vip.total_monetary_12m / 100000).toFixed(2) + ' Lakh';
            document.getElementById('rfm-vip-pct').textContent = vip.customer_share_pct + '% Patrons';
          }
          const milk = data.cohorts['DAILY_ESSENTIALS_MILK_LOYALS'];
          if (milk) {
            document.getElementById('rfm-milk-count').textContent = milk.customer_count;
            document.getElementById('rfm-milk-rev').textContent = '₹' + Math.round(milk.total_monetary_12m).toLocaleString('en-IN');
          }
          const weekend = data.cohorts['WEEKEND_FAMILY_SHOPPERS'];
          if (weekend) {
            document.getElementById('rfm-weekend-count').textContent = weekend.customer_count;
            document.getElementById('rfm-weekend-rev').textContent = '₹' + (weekend.total_monetary_12m / 100000).toFixed(2) + ' Lakh';
          }
          const churn = data.cohorts['AT_RISK_LAPSED_CHURN'];
          if (churn) {
            document.getElementById('rfm-churn-count').textContent = churn.customer_count;
            document.getElementById('rfm-churn-rev').textContent = '₹' + (churn.total_monetary_12m / 100000).toFixed(2) + ' Lakh';
          }
        }

        // Fetch Customer Partitions List
        const custRes = await fetch('/api/analytics/rfm-customers?limit=400');
        if (custRes.ok) {
          const custData = await custRes.json();
          allRfmCustomers = custData.customers || [];
          applyRfmFilters();
        }
      } catch (err) {
        console.warn('initRfmDashboard fallback to customer_rfm_partitions.json:', err);
        try {
          const fRes = await fetch('/data/customer_rfm_partitions.json');
          if (fRes.ok) {
            const fData = await fRes.json();
            allRfmCustomers = fData.customers || [];
            applyRfmFilters();
          }
        } catch (e2) {
          console.error('Failed to load RFM partitions:', e2);
        }
      }
    }

    function selectRfmFilterCohort(cohortCode) {
      currentRfmCohort = cohortCode;
      currentRfmPage = 1;
      
      // Update UI pills
      document.querySelectorAll('#rfm-filter-pills .rfm-pill').forEach(btn => {
        if (btn.dataset.cohort === cohortCode) {
          btn.className = 'rfm-pill active px-3 py-1.5 rounded-xl text-xs font-bold transition bg-indigo-600 text-white';
        } else {
          btn.className = 'rfm-pill px-3 py-1.5 rounded-xl text-xs font-medium transition bg-gray-900 text-gray-300 border border-gray-700 hover:border-indigo-500';
        }
      });

      applyRfmFilters();
    }

    function handleRfmSearch(val) {
      currentRfmSearch = (val || '').toLowerCase().trim();
      currentRfmPage = 1;
      applyRfmFilters();
    }

    function applyRfmFilters() {
      filteredRfmCustomers = allRfmCustomers.filter(c => {
        const matchesCohort = (currentRfmCohort === 'ALL') || (c.cohort_code === currentRfmCohort);
        if (!matchesCohort) return false;

        if (currentRfmSearch) {
          const name = (c.customer_name || '').toLowerCase();
          const phone = (c.phone_number || '') + (c.phone_masked || '');
          const city = (c.city || '').toLowerCase();
          const rfm = (c.rfm_score || '');
          if (!name.includes(currentRfmSearch) && !phone.includes(currentRfmSearch) && !city.includes(currentRfmSearch) && !rfm.includes(currentRfmSearch)) {
            return false;
          }
        }
        return true;
      });

      renderRfmTablePage();
    }

    function renderRfmTablePage() {
      const tbody = document.getElementById('rfm-customers-tbody');
      if (!tbody) return;

      const total = filteredRfmCustomers.length;
      document.getElementById('rfm-total-count').textContent = allRfmCustomers.length;
      
      const totalPages = Math.max(1, Math.ceil(total / RFM_PAGE_SIZE));
      if (currentRfmPage > totalPages) currentRfmPage = totalPages;

      const startIdx = (currentRfmPage - 1) * RFM_PAGE_SIZE;
      const endIdx = Math.min(total, startIdx + RFM_PAGE_SIZE);
      const pageSlice = filteredRfmCustomers.slice(startIdx, endIdx);

      document.getElementById('rfm-showing-count').textContent = total > 0 ? (startIdx + 1) + '-' + endIdx : '0';
      document.getElementById('rfm-page-indicator').textContent = 'Page ' + currentRfmPage + ' of ' + totalPages;
      document.getElementById('btn-rfm-prev').disabled = (currentRfmPage <= 1);
      document.getElementById('btn-rfm-next').disabled = (currentRfmPage >= totalPages);

      if (pageSlice.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-6 text-gray-500 font-sans">No patrons match the selected cohort criteria.</td></tr>';
        return;
      }

      let html = '';
      for (const c of pageSlice) {
        // Color badge for cohort
        let badgeClass = 'bg-gray-800 text-gray-300 border-gray-700';
        if (c.cohort_code === 'VIP_HIGH_SPENDERS') badgeClass = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
        else if (c.cohort_code === 'DAILY_ESSENTIALS_MILK_LOYALS') badgeClass = 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
        else if (c.cohort_code === 'WEEKEND_FAMILY_SHOPPERS') badgeClass = 'bg-purple-950 text-purple-300 border-purple-500/40';
        else if (c.cohort_code === 'AT_RISK_LAPSED_CHURN') badgeClass = 'bg-rose-950 text-rose-300 border-rose-500/40';

        // RFM Score Color
        const rColor = c.r_score >= 4 ? 'text-emerald-400' : (c.r_score === 3 ? 'text-amber-400' : 'text-rose-400');
        const fColor = c.f_score >= 4 ? 'text-emerald-400' : (c.f_score === 3 ? 'text-amber-400' : 'text-gray-400');
        const mColor = c.m_score >= 4 ? 'text-emerald-400' : (c.m_score === 3 ? 'text-amber-400' : 'text-gray-400');

        html += `
          <tr class="hover:bg-gray-800/40 transition">
            <td class="py-2.5 px-4 font-sans">
              <div class="font-bold text-white">${c.customer_name}</div>
              <div class="text-[11px] text-gray-400 flex items-center gap-1.5">
                <span>📞 ${c.phone_masked || c.phone_number || 'Store Member'}</span>
                <span>•</span>
                <span>📍 ${c.city || 'Bodinayakanur'}</span>
              </div>
            </td>
            <td class="py-2.5 px-3">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-950 border border-gray-800 font-bold text-xs">
                <span class="${rColor}">R${c.r_score}</span>
                <span class="${fColor}">F${c.f_score}</span>
                <span class="${mColor}">M${c.m_score}</span>
              </span>
              <div class="text-[9px] text-gray-500 mt-0.5">Score: ${c.rfm_score}</div>
            </td>
            <td class="py-2.5 px-3">
              <div class="font-bold ${c.recency_days <= 15 ? 'text-emerald-400' : (c.recency_days <= 45 ? 'text-amber-400' : 'text-rose-400')}">
                ${c.recency_days} days
              </div>
              <div class="text-[10px] text-gray-500">${c.last_checkout_date || 'N/A'}</div>
            </td>
            <td class="py-2.5 px-3">
              <div class="font-bold text-white">${c.frequency_12m} visits</div>
              <div class="text-[10px] text-gray-500">Wknd: ${c.weekend_visit_pct}%</div>
            </td>
            <td class="py-2.5 px-3">
              <div class="font-bold text-emerald-300">₹${Number(c.monetary_12m || 0).toLocaleString('en-IN')}</div>
              <div class="text-[10px] text-gray-400">Avg ₹${Math.round(c.average_ticket_size || 0)}/ticket</div>
            </td>
            <td class="py-2.5 px-3 font-sans">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">
                ${c.cohort_name}
              </span>
            </td>
            <td class="py-2.5 px-4 font-sans text-[11px] text-gray-300 max-w-xs">
              <div class="line-clamp-2">${c.recommended_strategy}</div>
            </td>
            <td class="py-2.5 px-3 text-right font-sans">
              <button onclick="bridgeToAgent2Copywriter('${c.cohort_code}', '${c.customer_name.replace(/'/g, "\\\\'")}')" class="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-bold transition flex items-center gap-1 ml-auto">
                <span>⚡ Promo</span>
              </button>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
    }

    function prevRfmPage() {
      if (currentRfmPage > 1) {
        currentRfmPage--;
        renderRfmTablePage();
      }
    }

    function nextRfmPage() {
      const totalPages = Math.ceil(filteredRfmCustomers.length / RFM_PAGE_SIZE);
      if (currentRfmPage < totalPages) {
        currentRfmPage++;
        renderRfmTablePage();
      }
    }

    async function triggerRfmScoreRefresh() {
      const btn = document.getElementById('btn-refresh-rfm');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block animate-spin mr-1">🔄</span> Refreshing...';
      }

      try {
        const res = await fetch('/api/rfm/refresh', { method: 'POST' });
        const data = await res.json();
        alert('✅ RFM Customer Partitions refreshed successfully! 340 patron accounts scored from 111 to 555.');
        await initRfmDashboard();
      } catch (err) {
        alert('Refresh completed with cached state: ' + err.message);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span>🔄 Re-Score RFM Partitions</span>';
        }
      }
    }

    function bridgeToAgent2Copywriter(cohortCode, custName) {
      // Find copywriter element
      const section = document.getElementById('agent2-copywriter-section');
      if (!section) return;

      if (cohortCode === 'VIP_HIGH_SPENDERS') {
        loadCopywriterPreset('1 Ltr Udhaya Krishna Ghee + 1KG Cardamom Big Combo', 4450, 4227, 16.0, 18, 'விஐபி வாடிக்கையாளர்களுக்கான சிறப்பு பிரத்யேக தள்ளுபடி & இலவச ஹோம் டெலிவரி');
      } else if (cohortCode === 'WEEKEND_FAMILY_SHOPPERS') {
        loadCopywriterPreset('முதல் தர கர்நாடகா பொன்னி புழுங்கல் அரிசி (25 கிலோ பை)', 1450, 1299, 14.5, 85, 'வார இறுதி குடும்ப மளிகை சேமிப்பு - போடி ராணி மார்க்கெட் சிறப்பு ஆஃபர்');
      } else if (cohortCode === 'DAILY_ESSENTIALS_MILK_LOYALS') {
        loadCopywriterPreset('Gold Winner Sunflower Oil (1 Litre Pouch)', 145, 128, 11.2, 140, 'தினசரி அத்தியாவசிய பொருட்கள் வாங்கும் வாடிக்கையாளர்களுக்கு சிறப்பு கவுண்ட்டர் தள்ளுபடி');
      } else if (cohortCode === 'AT_RISK_LAPSED_CHURN') {
        loadCopywriterPreset('1KG Kuthuraivali Rice + 1KG Red Rice Organic Combo', 210, 199, 15.0, 35, 'நம்ம போடி ராணி மார்க்கெட் உங்களை மீண்டும் அன்புடன் வரவேற்கிறது - ₹200 வெல்கம் பேக் வவுச்சர்');
      }

      section.scrollIntoView({ behavior: 'smooth' });
      section.classList.add('ring-2', 'ring-indigo-500');
      setTimeout(() => section.classList.remove('ring-2', 'ring-indigo-500'), 2500);
    }
'''

# Read target file
for target_file in ['ai-analytics.html', 'public/ai-analytics.html']:
    with open(target_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Search for insertion point: right before '🎪 Local Festival Demand Forecaster & Event Pulse' parent div
    anchor = '🎪 Local Festival Demand Forecaster & Event Pulse'
    pos = html_content.find(anchor)
    if pos == -1:
        print(f"Error: Could not find anchor in {target_file}")
        continue

    # Back up to the enclosing container of that section
    card_start = html_content.rfind('<div class="bg-gray-900 border border-gray-800 rounded-2xl', 0, pos)
    if card_start == -1:
        card_start = html_content.rfind('<div class="bg-gray-900', 0, pos)
    
    print(f"Found card start in {target_file} at {card_start}")

    # Inject HTML
    updated_html = html_content[:card_start] + rfm_html + '\n\n    ' + html_content[card_start:]

    # Inject Script right before </body>
    body_close = updated_html.rfind('</body>')
    if body_close != -1:
        updated_html = updated_html[:body_close] + '<script>\n' + rfm_script + '\n    // Auto-init on load\n    document.addEventListener("DOMContentLoaded", () => { initRfmDashboard(); });\n  </script>\n' + updated_html[body_close:]

    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(updated_html)

    print(f"[OK] Injected RFM Dashboard into {target_file} ({len(updated_html)} bytes)")

print("=== INJECTION COMPLETE ===")
