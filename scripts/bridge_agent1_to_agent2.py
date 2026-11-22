import re

print("=== ADDING DIRECT BRIDGE FROM AGENT 1 TO AGENT 2 IN ai-analytics.html ===")

with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update renderCrossSellsTable
old_cs = """<div class="text-[11px] font-bold text-brand-300">Combo: ₹${p.merchandising_strategy.bundle_offer_price} <span class="text-gray-500 line-through text-[10px]">₹${p.merchandising_strategy.regular_combo_mrp}</span></div>
            <p class="text-[10px] text-gray-400 mt-0.5">${p.merchandising_strategy.action}</p>"""

new_cs = """<div class="text-[11px] font-bold text-brand-300">Combo: ₹${p.merchandising_strategy.bundle_offer_price} <span class="text-gray-500 line-through text-[10px]">₹${p.merchandising_strategy.regular_combo_mrp}</span></div>
            <p class="text-[10px] text-gray-400 mt-0.5">${p.merchandising_strategy.action}</p>
            <button onclick="bridgeToAgent2Copywriter('${p.item_a.name.replace(/'/g, "")} + ${p.item_b.name.replace(/'/g, "")}', ${p.merchandising_strategy.regular_combo_mrp}, ${p.merchandising_strategy.bundle_offer_price}, 15.0, 50, 'போடி பட்ஜெட் மளிகை காம்போ ஆஃபர்')" class="mt-1 px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-600 text-purple-200 hover:text-white text-[10px] font-bold border border-purple-500/30 transition flex items-center gap-1">✍️ Draft Campaign (Agent 2)</button>"""

if old_cs in c:
    c = c.replace(old_cs, new_cs)
    print("1. Added Draft Campaign bridge to renderCrossSellsTable")

# 2. Update renderOverstockTable
old_os = """<span class="text-emerald-400 font-bold block">${a.recommended_action}</span>
            ${a.suggested_cross_sell_partner ? `<span class="text-[10px] text-gray-400">Bundle with '${a.suggested_cross_sell_partner}'</span>` : ''}"""

new_os = """<span class="text-emerald-400 font-bold block">${a.recommended_action}</span>
            ${a.suggested_cross_sell_partner ? `<span class="text-[10px] text-gray-400">Bundle with '${a.suggested_cross_sell_partner}'</span>` : ''}
            <button onclick="bridgeToAgent2Copywriter('${a.sku_name.replace(/'/g, "")}', ${Math.round(a.unit_price * 1.25)}, ${Math.round(a.unit_price)}, 8.0, ${a.current_stock}, 'போடி ஸ்டாக் கிளியரன்ஸ் அதிரடி ஆஃபர்')" class="mt-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-600 text-amber-200 hover:text-white text-[10px] font-bold border border-amber-500/30 transition flex items-center gap-1">⚡ Liquidate (Agent 2)</button>"""

if old_os in c:
    c = c.replace(old_os, new_os)
    print("2. Added Liquidate bridge to renderOverstockTable")

with open('ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(c)

with open('public/ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Saved ai-analytics.html and public/ai-analytics.html")
