import json, os, subprocess

# 1. Load mined empirical data
with open('mined_festival_empirical_data.json', 'r', encoding='utf-8') as f:
    mined_data = json.load(f)

# 2. Load master festivals
cmd = ['node', '-e', 'const m = require("./festivalMasterData"); console.log(JSON.stringify(m.ALL_YEAR_FESTIVALS));']
out = subprocess.check_output(cmd, encoding='utf-8')
master_festivals = json.loads(out.strip())

master_map = {f['id']: f for f in master_festivals}
copilot_festivals = {}

for fid, m_fest in master_map.items():
    v = mined_data.get(fid, {})
    meta = v.get('meta', {})
    windows = meta.get('windows', {})
    
    d26 = m_fest.get('date2026') or (windows.get('2026', ['2026-11-20', '2026-11-24'])[1])
    c26 = m_fest.get('cutoff2026') or 'Order 7 days ahead'
    
    dates_dict = {}
    for yr in ['2022', '2023', '2024', '2025', '2026', '2027', '2028']:
        m_yr = m_fest.get('datesByYear', {}).get(yr)
        if m_yr:
            dates_dict[yr] = m_yr.get('date') if isinstance(m_yr, dict) else m_yr
        elif yr in windows:
            dates_dict[yr] = windows[yr][1]
        else:
            dates_dict[yr] = '-'
            
    top_prods = []
    for p in v.get('all_time_top_products', [])[:8]:
        top_prods.append({
            'name': p['name'],
            'totalQty': p['total_qty'],
            'totalRev': p['total_rev'],
            'history': {yr: p['years'][yr]['qty'] for yr in p.get('years', {}) if yr in p.get('years', {})}
        })
        
    stock_list = []
    for s in v.get('recommended_stock_needs', [])[:12]:
        stock_list.append({
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
        })
        
    copilot_festivals[fid] = {
        'id': fid,
        'name': m_fest.get('name', fid),
        'tamil': m_fest.get('tamilName', ''),
        'tier': m_fest.get('tier', 'Peak (+75%)'),
        'rule': m_fest.get('calendarRule', ''),
        'category': m_fest.get('category', ''),
        'date2026': d26,
        'cutoff2026': c26,
        'dates': dates_dict,
        'yearly': v.get('yearly_metrics', {}),
        'topProducts': top_prods,
        'stockList': stock_list
    }

copilot_json_str = json.dumps(copilot_festivals, ensure_ascii=False)

new_block = f"""/* LUNISOLAR FESTIVALS EMPIRICAL DATABASE (144,563 INVOICES MINED ACROSS 5 FISCAL YEARS) */
    const COPILOT_FESTIVALS_DATA = {copilot_json_str};

    AdminDataCopilot.handleFestivalAnalytics = function(rawQuery) {{
      const q = (rawQuery || '').toLowerCase();
      let targetId = 'karthigai_deepam';
      
      const keyMap = [
        {{ keys: ['karthigai', 'deepam', 'agal', 'thiri'], id: 'karthigai_deepam' }},
        {{ keys: ['deepavali', 'diwali', 'patasu', 'crackers'], id: 'deepavali' }},
        {{ keys: ['pongal', 'harvest', 'makar', 'sankranti'], id: 'pongal_harvest' }},
        {{ keys: ['mattu', 'kanum', 'jallikattu'], id: 'mattu_kanum_pongal' }},
        {{ keys: ['bhogi'], id: 'bhogi_festival' }},
        {{ keys: ['poosam', 'thai poosam', 'palani', 'murugan'], id: 'thai_poosam' }},
        {{ keys: ['shivaratri', 'shiva', 'mahadev'], id: 'maha_shivaratri' }},
        {{ keys: ['holi', 'colour'], id: 'holi_festival' }},
        {{ keys: ['ugadi', 'telugu new year'], id: 'ugadi_telugu_new_year' }},
        {{ keys: ['panguni', 'uthiram'], id: 'panguni_uthiram' }},
        {{ keys: ['tamil new year', 'puthandu', 'chithirai 1', 'varusha'], id: 'tamil_new_year' }},
        {{ keys: ['easter', 'good friday'], id: 'easter_good_friday' }},
        {{ keys: ['chithirai', 'madurai', 'azhagar', 'alagar'], id: 'chithirai_thiruvizha' }},
        {{ keys: ['summer', 'beverage', 'cool drink', 'agni'], id: 'summer_cool_beverage_surge' }},
        {{ keys: ['mariamman', 'koozh'], id: 'mariamman_koozh_thiruvizha' }},
        {{ keys: ['school', 'reopening', 'college'], id: 'school_reopening_rush' }},
        {{ keys: ['bakrid', 'eid', 'adha'], id: 'bakrid_eid' }},
        {{ keys: ['aadi 18', 'perukku', 'chithrannam'], id: 'aadi_18_perukku' }},
        {{ keys: ['aadi velli', 'amman'], id: 'aadi_velli_pooja' }},
        {{ keys: ['aadi', 'aadi month'], id: 'aadi_month_kickoff' }},
        {{ keys: ['republic'], id: 'republic_day_sale' }},
        {{ keys: ['independence', 'august 15'], id: 'independence_day_sale' }},
        {{ keys: ['varalakshmi', 'vratham', 'sumangali'], id: 'varalakshmi_vratham' }},
        {{ keys: ['krishna', 'jayanthi', 'gokulashtami'], id: 'krishna_jayanthi' }},
        {{ keys: ['vinayakar', 'chaturthi', 'ganesh', 'pillayar'], id: 'vinayakar_chaturthi' }},
        {{ keys: ['onam', 'sadhya'], id: 'onam_sadhya' }},
        {{ keys: ['navaratri', 'sundal', 'golu'], id: 'navaratri_sundal_days' }},
        {{ keys: ['ayudha', 'pooja', 'saraswathi'], id: 'ayudha_pooja' }},
        {{ keys: ['margazhi', 'thiruppavai'], id: 'margazhi_temple_month' }},
        {{ keys: ['christmas', 'xmas'], id: 'christmas_newyear' }},
        {{ keys: ['new year', 'newyear'], id: 'new_year_day' }},
        {{ keys: ['valentine'], id: 'valentines_snack_week' }},
        {{ keys: ['payday', 'salary'], id: 'payday_cycle' }},
        {{ keys: ['wedding', 'muhurtham'], id: 'thai_masi_weddings' }}
      ];

      for (const entry of keyMap) {{
        if (entry.keys.some(k => q.includes(k))) {{
          targetId = entry.id;
          break;
        }}
      }}

      return this.renderFestivalCard(targetId);
    }};

    AdminDataCopilot.renderFestivalCard = function(activeId) {{
      const data = (typeof COPILOT_FESTIVALS_DATA !== 'undefined' && COPILOT_FESTIVALS_DATA[activeId]) 
        ? COPILOT_FESTIVALS_DATA[activeId] 
        : ((typeof COPILOT_FESTIVALS_DATA !== 'undefined') ? COPILOT_FESTIVALS_DATA['karthigai_deepam'] : null);

      if (!data) {{
        return '<p class="text-xs text-gray-700">Empirical festival data is loading. Total 34 festivals tracked across 144,563 invoices.</p>';
      }}

      const festPills = [
        {{ id: 'karthigai_deepam', label: '🪔 Karthigai' }},
        {{ id: 'deepavali', label: '✨ Deepavali' }},
        {{ id: 'pongal_harvest', label: '🌾 Thai Pongal' }},
        {{ id: 'ayudha_pooja', label: '🛠️ Ayudha' }},
        {{ id: 'vinayakar_chaturthi', label: '🐘 Vinayakar' }},
        {{ id: 'krishna_jayanthi', label: '🦚 Krishna' }},
        {{ id: 'tamil_new_year', label: '🌿 New Year' }},
        {{ id: 'chithirai_thiruvizha', label: '👑 Chithirai' }},
        {{ id: 'maha_shivaratri', label: '🕉️ Shivaratri' }},
        {{ id: 'thai_poosam', label: '🔱 Poosam' }},
        {{ id: 'navaratri_sundal_days', label: '🌺 Navaratri' }},
        {{ id: 'aadi_18_perukku', label: '🌊 Aadi 18' }},
        {{ id: 'christmas_newyear', label: '🎄 Christmas' }}
      ];

      const navPillsHtml = festPills.map(f => {{
        const isAct = f.id === activeId;
        const cls = isAct 
          ? 'bg-amber-500 text-slate-900 font-bold shadow-sm' 
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium';
        return '<button type="button" onclick="AdminDataCopilot.switchFestivalCard(\\'' + f.id + '\\')" class="px-2.5 py-1 text-[11px] rounded-lg transition-all ' + cls + '">' + f.label + '</button>';
      }}).join('');

      let yearlyHtml = '';
      const yrs = Object.keys(data.yearly || {{}}).sort();
      if (yrs.length > 0) {{
        yearlyHtml = yrs.map(y => {{
          const info = data.yearly[y];
          return '<div class="bg-white p-2.5 rounded-lg border border-slate-200 text-center shadow-xs">' +
                 '<div class="text-[10px] font-bold text-slate-500 uppercase">' + y + ' Season</div>' +
                 '<div class="text-xs font-black text-slate-900 mt-0.5">₹' + (info.turnover || 0).toLocaleString('en-IN') + '</div>' +
                 '<div class="text-[10px] text-emerald-600 font-semibold">' + (info.bills || 0) + ' bills (₹' + (info.avg_basket || 0) + '/bkt)</div>' +
                 '</div>';
        }}).join('');
      }} else {{
        yearlyHtml = '<div class="col-span-3 text-center text-xs text-slate-500 py-2">Empirical sales records mapped from historical databases.</div>';
      }}

      let topSkusHtml = (data.stockList || []).slice(0, 6).map(s => {{
        const isCrit = s.priority === 'CRITICAL';
        const badgeCls = isCrit ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-amber-100 text-amber-700 font-semibold';
        return '<tr class="border-b border-slate-100 text-[11px] hover:bg-slate-50/70">' +
               '<td class="py-1.5 px-2 font-medium text-slate-800">' + s.name + '</td>' +
               '<td class="py-1.5 px-2 text-right text-slate-600 font-semibold">₹' + s.price + '</td>' +
               '<td class="py-1.5 px-2 text-right text-slate-500">' + s.avg + '</td>' +
               '<td class="py-1.5 px-2 text-right font-black text-amber-600">' + s.recOrder + ' ' + (s.unit || 'units') + '</td>' +
               '<td class="py-1.5 px-2 text-center"><span class="px-1.5 py-0.5 rounded text-[9px] ' + badgeCls + '">' + s.priority + '</span></td>' +
               '</tr>';
      }}).join('');

      const d = data.dates || {{}};
      const festCelebrationDate = data.date2026 || d['2026'] || '-';
      const orderCutoffDate = data.cutoff2026 || '-';

      return '<div class="festival-intelligence-card space-y-3 p-3 bg-gradient-to-br from-amber-500/10 via-slate-50 to-purple-500/10 rounded-xl border border-amber-300/60 shadow-sm text-slate-800">' +
        '<div class="flex items-center justify-between border-b border-amber-200/60 pb-2">' +
          '<div>' +
            '<div class="text-xs font-black text-amber-900 flex items-center gap-1.5">' +
              '<span>' + data.name + '</span>' +
              '<span class="text-[10px] font-bold text-amber-600">(' + data.tamil + ')</span>' +
            '</div>' +
            '<div class="text-[10px] text-slate-600 mt-0.5">' + data.category + '</div>' +
          '</div>' +
          '<div class="text-right">' +
            '<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-xs">' + data.tier + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">' +
          navPillsHtml +
        '</div>' +

        '<div class="bg-white/80 p-2.5 rounded-lg border border-amber-200/80 shadow-2xs">' +
          '<div class="text-[10px] font-black text-amber-800 uppercase tracking-wider mb-1">📅 Lunisolar Calendar Dates (2022–2028)</div>' +
          '<div class="grid grid-cols-4 md:grid-cols-7 gap-1 text-[10px] text-center">' +
            '<div class="bg-slate-50 p-1 rounded border border-slate-200"><span class="text-slate-600 block font-bold">2022</span><span class="font-bold text-slate-700">' + (d['2022'] || '-') + '</span></div>' +
            '<div class="bg-slate-50 p-1 rounded border border-slate-200"><span class="text-slate-600 block font-bold">2023</span><span class="font-bold text-slate-700">' + (d['2023'] || '-') + '</span></div>' +
            '<div class="bg-slate-50 p-1 rounded border border-slate-200"><span class="text-slate-600 block font-bold">2024</span><span class="font-bold text-slate-700">' + (d['2024'] || '-') + '</span></div>' +
            '<div class="bg-slate-50 p-1 rounded border border-slate-200"><span class="text-slate-600 block font-bold">2025</span><span class="font-bold text-slate-700">' + (d['2025'] || '-') + '</span></div>' +
            '<div class="bg-amber-100 p-1 rounded border border-amber-300"><span class="text-amber-800 block font-black">2026 (Fest)</span><span class="font-black text-amber-900">' + festCelebrationDate + '</span></div>' +
            '<div class="bg-rose-50 p-1 rounded border border-rose-300"><span class="text-rose-800 block font-black">2026 Cutoff</span><span class="font-black text-rose-900">' + orderCutoffDate + '</span></div>' +
            '<div class="bg-slate-50 p-1 rounded border border-slate-200"><span class="text-slate-600 block font-bold">2027</span><span class="font-bold text-slate-700">' + (d['2027'] || '-') + '</span></div>' +
          '</div>' +
          '<div class="text-[9px] text-slate-600 mt-1.5 italic">Rule: ' + data.rule + '</div>' +
        '</div>' +

        '<div class="grid grid-cols-3 gap-2">' +
          yearlyHtml +
        '</div>' +

        '<div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">' +
          '<div class="bg-slate-50 px-2.5 py-1.5 border-b border-slate-200 flex items-center justify-between">' +
            '<span class="text-[10px] font-black text-slate-700 uppercase tracking-wider">📦 High-Movement Product Stock Need List</span>' +
            '<span class="text-[9px] text-amber-600 font-bold">YoY Growth + Safety Buffer</span>' +
          '</div>' +
          '<div class="overflow-x-auto">' +
            '<table class="w-full text-left">' +
              '<thead>' +
                '<tr class="bg-slate-100/60 text-[9px] uppercase font-bold text-slate-500 border-b border-slate-200">' +
                  '<th class="py-1 px-2">Product Name</th>' +
                  '<th class="py-1 px-2 text-right">Price</th>' +
                  '<th class="py-1 px-2 text-right">Hist Avg</th>' +
                  '<th class="py-1 px-2 text-right text-amber-700">Order Qty</th>' +
                  '<th class="py-1 px-2 text-center">Priority</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                topSkusHtml +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +

        '<div class="flex items-center justify-between text-[10px] pt-1 text-slate-500">' +
          '<span>Source: 144,563 Transactions (SQLite Ground Truth)</span>' +
          '<button type="button" onclick="window.location.href=\\'ai-analytics.html\\'" class="text-purple-600 hover:text-purple-700 font-bold underline">Open Full 34-Event Studio →</button>' +
        '</div>' +
      '</div>';
    }};

    AdminDataCopilot.switchFestivalCard = function(festId) {{
      const container = document.getElementById('copilot-messages-container');
      const card = AdminDataCopilot.renderFestivalCard(festId);
      const lastMsg = container ? container.querySelector('.festival-intelligence-card') : null;
      if (lastMsg && lastMsg.parentElement) {{
        lastMsg.parentElement.innerHTML = card;
      }} else if (container) {{
        AdminDataCopilot.appendMessage('copilot', card);
      }}
    }};

    AdminDataCopilot.copyStockList = function(festId) {{
      const data = (typeof COPILOT_FESTIVALS_DATA !== 'undefined' && COPILOT_FESTIVALS_DATA[festId]) 
        ? COPILOT_FESTIVALS_DATA[festId] 
        : null;
      if (!data || !data.stockList) return;

      let tsv = 'Product Name\\t3-Yr Avg Sales\\tRecommended Order Qty\\tEst Purchase Budget (INR)\\tPriority\\n';
      data.stockList.forEach(item => {{
        tsv += `${{item.name}}\\t${{item.avg}}\\t${{item.recOrder}}\\t${{Math.round(item.budget)}}\\t${{item.priority}}\\n`;
      }});

      if (navigator.clipboard && navigator.clipboard.writeText) {{
        navigator.clipboard.writeText(tsv).then(() => {{
          alert('✅ Stock Need List for ' + data.name + ' copied to clipboard! (Ready to paste into Excel or WhatsApp)');
        }}).catch(() => {{
          window.prompt('Copy Stock Need List:', tsv);
        }});
      }} else {{
        window.prompt('Copy Stock Need List:', tsv);
      }}
    }};
"""

for target_file in ['admin.html', 'public/admin.html']:
    if not os.path.exists(target_file):
        print(f"Skipping {target_file}: does not exist")
        continue
    with open(target_file, 'r', encoding='utf-8') as f:
        html = f.read()

    s_idx = html.find('/* LUNISOLAR FESTIVALS EMPIRICAL DATABASE')
    e_needle = '/* ==========================================================================\n       DEDICATED AI STUDIO (ADMIN: RANI) FUNCTIONS'
    e_idx = html.find(e_needle)
    if e_idx == -1:
        # Try alternate whitespace
        e_needle_alt = '/* =========================================================================='
        # find the one after s_idx
        e_idx = html.find(e_needle_alt, s_idx + 100)

    if s_idx == -1 or e_idx == -1:
        print(f"Error finding boundaries in {target_file}: s_idx={s_idx}, e_idx={e_idx}")
        continue

    patched_html = html[:s_idx] + new_block + '\n\n    ' + html[e_idx:]
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(patched_html)

    print(f"Successfully patched {target_file}! ({len(patched_html)} bytes)")

print("\nFinished patching admin.html and public/admin.html!")
