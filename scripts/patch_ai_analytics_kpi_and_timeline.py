import os

for filepath in ['ai-analytics.html', 'public/ai-analytics.html']:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}: not found")
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update KPI Bar if fest-stock-festdate not inside fest-stock-kpi-bar
    old_kpi_bar = '''        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3 bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4" id="fest-stock-kpi-bar">
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Festival Event</p>
            <h5 class="text-sm font-black text-white mt-0.5" id="fest-stock-name">Deepavali Mega Week</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reorder Budget</p>
            <h5 class="text-sm font-black text-amber-400 mt-0.5" id="fest-stock-budget">₹34,661</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Projected Revenue</p>
            <h5 class="text-sm font-black text-emerald-400 mt-0.5" id="fest-stock-revenue">₹41,890</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">⚠️ Order Deadline</p>
            <h5 class="text-sm font-black text-rose-400 mt-0.5" id="fest-stock-cutoff">2026-10-28</h5>
          </div>
        </div>'''

    new_kpi_bar = '''        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3 bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4" id="fest-stock-kpi-bar">
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Festival Event</p>
            <h5 class="text-sm font-black text-white mt-0.5" id="fest-stock-name">Deepavali Mega Week</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">📅 Festival Date</p>
            <h5 class="text-sm font-black text-amber-300 mt-0.5" id="fest-stock-festdate">2026-11-08</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">⚠️ Order Cutoff</p>
            <h5 class="text-sm font-black text-rose-400 mt-0.5" id="fest-stock-cutoff">2026-10-28</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reorder Budget</p>
            <h5 class="text-sm font-black text-amber-400 mt-0.5" id="fest-stock-budget">₹34,661</h5>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Projected Revenue</p>
            <h5 class="text-sm font-black text-emerald-400 mt-0.5" id="fest-stock-revenue">₹41,890</h5>
          </div>
        </div>'''

    if old_kpi_bar in html:
        html = html.replace(old_kpi_bar, new_kpi_bar, 1)
        print(f"Updated KPI bar in {filepath}")
    else:
        print(f"old_kpi_bar not found in {filepath}, checking alternate...")

    # 2. Update Timeline container to include 2022 and 2028
    old_timeline = '''          <div class="flex items-center gap-1.5 flex-wrap font-mono text-[11px]" id="fest-multi-year-dates-container">
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2023: <b class="text-gray-200" id="date-pill-2023">Nov 12</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2024: <b class="text-gray-200" id="date-pill-2024">Oct 31</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2025: <b class="text-gray-200" id="date-pill-2025">Oct 20</b></span>
            <span class="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">2026: <b class="text-white" id="date-pill-2026">Nov 08 (Active)</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2027: <b class="text-gray-200" id="date-pill-2027">Oct 29</b></span>
          </div>'''

    new_timeline = '''          <div class="flex items-center gap-1.5 flex-wrap font-mono text-[11px]" id="fest-multi-year-dates-container">
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2022: <b class="text-gray-200" id="date-pill-2022">-</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2023: <b class="text-gray-200" id="date-pill-2023">-</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2024: <b class="text-gray-200" id="date-pill-2024">-</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2025: <b class="text-gray-200" id="date-pill-2025">-</b></span>
            <span class="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">2026: <b class="text-white" id="date-pill-2026">- (Active)</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2027: <b class="text-gray-200" id="date-pill-2027">-</b></span>
            <span class="px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-400">2028: <b class="text-gray-200" id="date-pill-2028">-</b></span>
          </div>'''

    if old_timeline in html:
        html = html.replace(old_timeline, new_timeline, 1)
        print(f"Updated Timeline in {filepath}")
    else:
        print(f"old_timeline not found in {filepath}")

    # 3. Update loadFestivalStockNeeds logic in JS
    old_load_logic = """        // Update KPI bar
        document.getElementById('fest-stock-name').innerText = data.name + ' (' + data.surgeExpected + ')';
        document.getElementById('fest-stock-budget').innerText = '₹' + (data.totalRecommendedBudget || 0).toLocaleString('en-IN');
        document.getElementById('fest-stock-revenue').innerText = '₹' + (data.totalProjectedRevenue || 0).toLocaleString('en-IN');
        document.getElementById('fest-stock-cutoff').innerText = (data.festivalId === 'karthigai_deepam' || (data.name && data.name.includes('Karthigai'))) ? '2026-11-18' : (data.cutoff2026 || 'Order 7 days ahead');
        const festDateEl = document.getElementById('fest-stock-festdate');
        if (festDateEl) {
          const fd = (typeof data.datesByYear?.['2026'] === 'string' ? data.datesByYear['2026'] : data.datesByYear?.['2026']?.date) || data.date2026 || data.date || data.festivalDate || '';
          festDateEl.innerText = (data.festivalId === 'karthigai_deepam' || (data.name && data.name.includes('Karthigai'))) ? '2026-11-24' : (fd || data.cutoff2026 || 'See calendar');
        }

        // Update Shifting Dates Timeline
        const ruleDesc = document.getElementById('fest-calendar-rule-desc');
        if (ruleDesc) ruleDesc.innerText = data.calendarRule || 'Lunisolar astronomical calendar shift';

        const dByYear = data.datesByYear || {};
        const p23 = document.getElementById('date-pill-2023');
        const p24 = document.getElementById('date-pill-2024');
        const p25 = document.getElementById('date-pill-2025');
        const p26 = document.getElementById('date-pill-2026');
        const p27 = document.getElementById('date-pill-2027');
        if (p23) p23.innerText = dByYear['2023'] || '-';
        if (p24) p24.innerText = dByYear['2024'] || '-';
        if (p25) p25.innerText = dByYear['2025'] || '-';
        if (p26) p26.innerText = (dByYear['2026'] || '-') + ' (Active)';
        if (p27) p27.innerText = dByYear['2027'] || '-';"""

    new_load_logic = """        // Update KPI bar
        document.getElementById('fest-stock-name').innerText = data.name + ' (' + (data.surgeExpected || '+75%') + ')';
        document.getElementById('fest-stock-budget').innerText = '₹' + (data.totalRecommendedBudget || 0).toLocaleString('en-IN');
        document.getElementById('fest-stock-revenue').innerText = '₹' + (data.totalProjectedRevenue || 0).toLocaleString('en-IN');
        document.getElementById('fest-stock-cutoff').innerText = data.cutoff2026 || 'Order 7 days ahead';
        const festDateEl = document.getElementById('fest-stock-festdate');
        if (festDateEl) {
          const fd = data.date2026 || (typeof data.datesByYear?.['2026'] === 'string' ? data.datesByYear['2026'] : data.datesByYear?.['2026']?.date) || 'See calendar';
          festDateEl.innerText = fd;
        }

        // Update Shifting Dates Timeline
        const ruleDesc = document.getElementById('fest-calendar-rule-desc');
        if (ruleDesc) ruleDesc.innerText = data.calendarRule || 'Lunisolar astronomical calendar shift';

        const dByYear = data.datesByYear || {};
        const p22 = document.getElementById('date-pill-2022');
        const p23 = document.getElementById('date-pill-2023');
        const p24 = document.getElementById('date-pill-2024');
        const p25 = document.getElementById('date-pill-2025');
        const p26 = document.getElementById('date-pill-2026');
        const p27 = document.getElementById('date-pill-2027');
        const p28 = document.getElementById('date-pill-2028');
        if (p22) p22.innerText = dByYear['2022'] || '-';
        if (p23) p23.innerText = dByYear['2023'] || '-';
        if (p24) p24.innerText = dByYear['2024'] || '-';
        if (p25) p25.innerText = dByYear['2025'] || '-';
        if (p26) p26.innerText = (dByYear['2026'] || '-') + ' (Active)';
        if (p27) p27.innerText = dByYear['2027'] || '-';
        if (p28) p28.innerText = dByYear['2028'] || '-';"""

    # Normalize CRLF/LF for replacement
    html_norm = html.replace('\r\n', '\n')
    old_logic_norm = old_load_logic.replace('\r\n', '\n')
    new_logic_norm = new_load_logic.replace('\r\n', '\n')

    if old_logic_norm in html_norm:
        html_norm = html_norm.replace(old_logic_norm, new_logic_norm, 1)
        html = html_norm.replace('\n', '\r\n')
        print(f"Updated loadFestivalStockNeeds logic in {filepath}")
    else:
        print(f"old_load_logic not found in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

print("Finished updating ai-analytics.html and public/ai-analytics.html!")
