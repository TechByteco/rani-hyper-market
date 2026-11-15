import json

with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

fest_clean = {}
for k, v in raw.items():
    meta = v['meta']
    windows = meta.get('windows', {})
    d26 = windows.get('2026', ['2026-11-05', '2026-11-09'])[1]
    fest_clean[k] = {
        'id': k,
        'name': meta.get('name', k),
        'tamil': meta.get('tamil', ''),
        'tier': meta.get('tier', 'Peak (+95%)'),
        'rule': meta.get('rule', ''),
        'category': meta.get('category', ''),
        'date2026': d26,
        'dates': {yr: (windows[yr][1] if yr in windows else '-') for yr in ['2022', '2023', '2024', '2025', '2026', '2027']},
        'yearly': v.get('yearly_metrics', {}),
        'topProducts': [
            {
                'name': p['name'],
                'totalQty': p['total_qty'],
                'totalRev': p['total_rev'],
                'history': {yr: p['years'][yr]['qty'] for yr in p.get('years', {}) if yr in p.get('years', {})}
            }
            for p in v.get('all_time_top_products', [])[:6]
        ],
        'stockList': [
            {
                'name': s['name'],
                'price': s['price'],
                'cost': s['cost'],
                'unit': 'Unit',
                'currentStock': 0,
                'avg': s['avg_historical_qty'],
                'recOrder': s['recommended_order_qty'],
                'budget': s['est_purchase_budget'],
                'rev': s['est_projected_revenue'],
                'profit': s['est_profit'],
                'priority': s['priority'],
                'history': s.get('sales_history', {})
            }
            for s in v.get('recommended_stock_needs', [])[:10]
        ]
    }

json_str = json.dumps(fest_clean, ensure_ascii=False)

methods = """
    /* LUNISOLAR FESTIVALS EMPIRICAL DATABASE (141,312 INVOICES MINED) */
    const COPILOT_FESTIVALS_DATA = """ + json_str + """;

    AdminDataCopilot.handleFestivalAnalytics = function(rawQuery) {
      const q = (rawQuery || '').toLowerCase();
      let targetId = 'deepavali';
      if (q.includes('pongal')) targetId = 'pongal_harvest';
      else if (q.includes('ayudha') || q.includes('pooja') || q.includes('ayutha')) targetId = 'ayudha_pooja';
      else if (q.includes('vinayakar') || q.includes('chaturthi') || q.includes('ganesh')) targetId = 'vinayakar_chaturthi';
      else if (q.includes('karthigai') || q.includes('deepam')) targetId = 'karthigai_deepam';
      else if (q.includes('krishna') || q.includes('jayanthi') || q.includes('gokulashtami')) targetId = 'krishna_jayanthi';
      else if (q.includes('tamil new year') || q.includes('puthandu') || q.includes('varusha')) targetId = 'tamil_new_year';
      else if (q.includes('aadi') || q.includes('perukku')) targetId = 'aadi_18_perukku';
      else if (q.includes('diwali') || q.includes('deepavali')) targetId = 'deepavali';

      return this.renderFestivalCard(targetId);
    };

    AdminDataCopilot.renderFestivalCard = function(activeId) {
      const data = (typeof COPILOT_FESTIVALS_DATA !== 'undefined' && COPILOT_FESTIVALS_DATA[activeId]) 
        ? COPILOT_FESTIVALS_DATA[activeId] 
        : ((typeof COPILOT_FESTIVALS_DATA !== 'undefined') ? COPILOT_FESTIVALS_DATA['deepavali'] : null);

      if (!data) {
        return '<p class=\"text-xs text-gray-700\">Empirical festival data is loading. Total 8 festivals tracked across 141,312 invoices.</p>';
      }

      const festPills = [
        { id: 'deepavali', label: '🪔 Deepavali' },
        { id: 'pongal_harvest', label: '🌾 Thai Pongal' },
        { id: 'ayudha_pooja', label: '🛠️ Ayudha' },
        { id: 'vinayakar_chaturthi', label: '🐘 Vinayakar' },
        { id: 'karthigai_deepam', label: '🪔 Karthigai' },
        { id: 'krishna_jayanthi', label: '🦚 Krishna' },
        { id: 'tamil_new_year', label: '🌿 New Year' },
        { id: 'aadi_18_perukku', label: '🌊 Aadi 18' }
      ];

      const ym = data.yearly || {};
      const ymYears = Object.keys(ym).sort();
      let totalFestTurnover = 0;
      let totalFestBills = 0;
      ymYears.forEach(y => {
        totalFestTurnover += (ym[y].turnover || 0);
        totalFestBills += (ym[y].bills || 0);
      });

      const totalBudget = data.stockList.reduce((acc, c) => acc + (c.budget || 0), 0);
      const totalRev = data.stockList.reduce((acc, c) => acc + (c.rev || 0), 0);

      return `
        <div class=\"space-y-3\" id=\"festival-copilot-card\">
          <div class=\"flex flex-wrap items-center justify-between gap-1 border-b border-amber-200/60 pb-2\">
            <div>
              <h4 class=\"font-black text-amber-950 text-xs flex items-center gap-1.5\">
                <i class=\"fa-solid fa-fire-flame-curved text-amber-500\"></i> ${escapeAiHtml(data.name)}
              </h4>
              <div class=\"text-[10px] text-amber-800 font-medium\">
                ${escapeAiHtml(data.tamil)} &bull; <span class=\"font-bold text-amber-900\">${escapeAiHtml(data.tier)}</span>
              </div>
            </div>
            <span class=\"px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0\">
              141,312 Invoices Mined
            </span>
          </div>

          <!-- Festival Selector Tabs -->
          <div class=\"flex gap-1 overflow-x-auto pb-1 scrollbar-none\">
            ${festPills.map(p => `
              <button type=\"button\" onclick=\"AdminDataCopilot.switchFestivalCard('${p.id}')\" 
                class=\"px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${p.id === activeId ? 'bg-amber-600 text-white shadow-xs' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}\">
                ${p.label}
              </button>
            `).join('')}
          </div>

          <!-- Shifting Lunisolar Calendar Dates -->
          <div class=\"p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px] space-y-1 text-amber-950\">
            <div class=\"font-black flex items-center gap-1 text-[10px]\">
              <i class=\"fa-solid fa-moon text-indigo-600\"></i> Astronomical Panchangam Shift Dates:
            </div>
            <div class=\"grid grid-cols-5 gap-1 text-center font-bold text-[9px]\">
              ${Object.keys(data.dates).filter(y => y !== '2022' && y !== '2027').map(yr => `
                <div class=\"p-1 rounded bg-white border ${yr === '2026' ? 'border-amber-400 bg-amber-50 text-amber-900 font-black' : 'border-gray-200 text-gray-600'}\">
                  <div class=\"text-[8px] text-gray-400\">FY ${yr}</div>
                  <div>${data.dates[yr]}</div>
                </div>
              `).join('')}
            </div>
            <div class=\"text-[9px] text-gray-500 italic\">Rule: ${escapeAiHtml(data.rule || 'Lunisolar')}</div>
          </div>

          <!-- Multi-Year Turnover & Footfall Stats -->
          <div class=\"space-y-1\">
            <div class=\"text-[10px] font-black text-gray-700 flex justify-between\">
              <span>Empirical Multi-Year Turnover (${ymYears.length} Financial Years)</span>
              <span class=\"text-emerald-700 font-black\">Total: ₹${Math.round(totalFestTurnover).toLocaleString('en-IN')} (${totalFestBills.toLocaleString('en-IN')} bills)</span>
            </div>
            <div class=\"grid grid-cols-${Math.max(2, ymYears.length)} gap-1.5 text-[10px]\">
              ${ymYears.map(yr => `
                <div class=\"p-2 rounded-xl bg-white border border-gray-200 shadow-2xs text-center\">
                  <div class=\"text-[9px] font-bold text-gray-400\">FY ${yr} Sales</div>
                  <div class=\"font-black text-emerald-800 text-xs\">₹${Math.round(ym[yr].turnover).toLocaleString('en-IN')}</div>
                  <div class=\"text-[8px] text-gray-500\">${ym[yr].bills} bills &bull; AOV ₹${Math.round(ym[yr].avg_basket)}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Top Moving Items & YoY Trajectory -->
          <div class=\"space-y-1.5\">
            <div class=\"text-[10px] font-black text-gray-800 flex items-center gap-1\">
              <i class=\"fa-solid fa-arrow-trend-up text-emerald-600\"></i> Top Product Velocity &amp; YoY Sales Growth:
            </div>
            <div class=\"space-y-1 max-h-[140px] overflow-y-auto pr-1 text-[10px]\">
              ${data.topProducts.map(tp => {
                const hist = tp.history || {};
                const hKeys = Object.keys(hist).sort();
                const histStr = hKeys.map(k => `${k}: <b>${hist[k]}</b>`).join(' ➔ ');
                return `
                  <div class=\"p-1.5 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center\">
                    <div class=\"truncate max-w-[190px]\">
                      <div class=\"font-bold text-gray-900 truncate\">${escapeAiHtml(tp.name)}</div>
                      <div class=\"text-[8px] text-gray-500\">${histStr || 'Empirical transactions'}</div>
                    </div>
                    <span class=\"font-black text-purple-800 shrink-0 text-[10px]\">${tp.totalQty} sold</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Recommended Stock Need List Table -->
          <div class=\"space-y-1.5\">
            <div class=\"flex justify-between items-center\">
              <div class=\"text-[10px] font-black text-gray-800 flex items-center gap-1\">
                <i class=\"fa-solid fa-boxes-stacked text-amber-600\"></i> Recommended Reorder (Buffer: +10% YoY, +25% Surge):
              </div>
              <button type=\"button\" onclick=\"AdminDataCopilot.copyStockList('${activeId}')\" class=\"px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[9px] cursor-pointer border border-amber-300\">
                <i class=\"fa-regular fa-copy\"></i> Copy List
              </button>
            </div>

            <div class=\"border border-gray-200 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto text-[10px]\">
              <table class=\"w-full text-left border-collapse\">
                <thead class=\"bg-gray-100 text-[9px] text-gray-600 uppercase font-black sticky top-0\">
                  <tr>
                    <th class=\"p-1.5\">Product</th>
                    <th class=\"p-1.5 text-center\">3-Yr Avg</th>
                    <th class=\"p-1.5 text-center font-black text-amber-900\">Order Qty</th>
                    <th class=\"p-1.5 text-right\">Est. Cost</th>
                    <th class=\"p-1.5 text-center\">Priority</th>
                  </tr>
                </thead>
                <tbody class=\"divide-y divide-gray-100 bg-white\">
                  ${data.stockList.map(item => `
                    <tr class=\"hover:bg-amber-50/50 transition\">
                      <td class=\"p-1.5 font-bold text-gray-900 truncate max-w-[130px]\" title=\"${escapeAiHtml(item.name)}\">
                        ${escapeAiHtml(item.name)}
                      </td>
                      <td class=\"p-1.5 text-center text-gray-500 font-medium\">${item.avg}</td>
                      <td class=\"p-1.5 text-center font-black text-amber-700 bg-amber-50/60\">${item.recOrder}</td>
                      <td class=\"p-1.5 text-right font-black text-gray-800\">₹${Math.round(item.budget).toLocaleString('en-IN')}</td>
                      <td class=\"p-1.5 text-center\">
                        <span class=\"px-1.5 py-0.5 rounded text-[8px] font-black ${item.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : (item.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')}\">
                          ${item.priority}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class=\"p-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex justify-between items-center text-[10px]\">
              <div>
                <div class=\"text-[9px] text-gray-500 font-semibold\">Procurement Budget</div>
                <div class=\"font-black text-emerald-900 text-xs\">₹${Math.round(totalBudget).toLocaleString('en-IN')}</div>
              </div>
              <div class=\"text-right\">
                <div class=\"text-[9px] text-gray-500 font-semibold\">Projected Revenue</div>
                <div class=\"font-black text-emerald-700 text-xs\">₹${Math.round(totalRev).toLocaleString('en-IN')} (+₹${Math.round(totalRev - totalBudget).toLocaleString('en-IN')} profit)</div>
              </div>
            </div>
          </div>

          <!-- Footer Action & Advice -->
          <div class=\"p-2 rounded-xl bg-slate-50 border border-slate-200 text-[9px] text-gray-600 space-y-1\">
            <div class=\"font-bold text-gray-800 flex items-center gap-1\">
              <i class=\"fa-solid fa-truck-ramp-box text-blue-600\"></i> Procurement Cutoff: Place mill orders before <b>${data.dates['2026'] || '10 days prior'}</b>
            </div>
            <div>💡 <i>Buffers prevent stockouts during peak 48-hour festive kitchen rush. Mined from 141,312 invoices across 5 financial years.</i></div>
          </div>
        </div>
      `;
    };

    AdminDataCopilot.switchFestivalCard = function(festId) {
      const card = document.getElementById('festival-copilot-card');
      if (card) {
        card.outerHTML = this.renderFestivalCard(festId);
      }
    };

    AdminDataCopilot.copyStockList = function(festId) {
      const data = (typeof COPILOT_FESTIVALS_DATA !== 'undefined' && COPILOT_FESTIVALS_DATA[festId]) 
        ? COPILOT_FESTIVALS_DATA[festId] 
        : null;
      if (!data || !data.stockList) return;

      let tsv = 'Product Name\\t3-Yr Avg Sales\\tRecommended Order Qty\\tEst Purchase Budget (INR)\\tPriority\\n';
      data.stockList.forEach(item => {
        tsv += `${item.name}\\t${item.avg}\\t${item.recOrder}\\t${Math.round(item.budget)}\\t${item.priority}\\n`;
      });

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tsv).then(() => {
          alert('✅ Stock Need List for ' + data.name + ' copied to clipboard! (Ready to paste into Excel or WhatsApp)');
        }).catch(() => {
          window.prompt('Copy Stock Need List:', tsv);
        });
      } else {
        window.prompt('Copy Stock Need List:', tsv);
      }
    };
"""

with open('scripts/generated_festival_copilot.js', 'w', encoding='utf-8') as f:
    f.write(methods)

print('Generated scripts/generated_festival_copilot.js successfully!')
