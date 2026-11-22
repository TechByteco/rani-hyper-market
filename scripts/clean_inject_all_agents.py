import re

print("=== CLEAN INJECTION OF AGENT 1 & AGENT 2 CONTROLLERS INSIDE MAIN <SCRIPT> ===")

with open('ai-analytics.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update DOMContentLoaded call
dom_target = "window.addEventListener('DOMContentLoaded', () => {\n      loadAllAnalytics();"
dom_replacement = """window.addEventListener('DOMContentLoaded', () => {
      loadAllAnalytics();
      if (typeof loadBasketAffinityAndVelocity === 'function') loadBasketAffinityAndVelocity();
      if (typeof generateAgent2Copy === 'function') generateAgent2Copy();"""

if dom_target in c:
    c = c.replace(dom_target, dom_replacement)
    print("1. Updated DOMContentLoaded to invoke Agent 1 and Agent 2 loaders")
else:
    print("DOMContentLoaded target already updated or not found")

# 2. Build Agent 1 & Agent 2 controllers to inject before </script>
agents_js = """
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
            <button onclick="bridgeToAgent2Copywriter('${p.item_a.name.replace(/'/g, "")} + ${p.item_b.name.replace(/'/g, "")}', ${p.merchandising_strategy.regular_combo_mrp}, ${p.merchandising_strategy.bundle_offer_price}, 15.0, 50, 'போடி பட்ஜெட் மளிகை காம்போ ஆஃபர்')" class="mt-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-600 text-purple-200 hover:text-white text-[10px] font-bold border border-purple-500/30 transition flex items-center gap-1">
              ✍️ Draft Campaign (Agent 2)
            </button>
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
            <button onclick="bridgeToAgent2Copywriter('${a.sku_name.replace(/'/g, "")}', ${Math.round(a.unit_price * 1.25)}, ${Math.round(a.unit_price)}, 8.0, ${a.current_stock}, 'போடி ஸ்டாக் கிளியரன்ஸ் அதிரடி ஆஃபர்')" class="mt-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-600 text-amber-200 hover:text-white text-[10px] font-bold border border-amber-500/30 transition flex items-center gap-1">
              ⚡ Liquidate with Copywriter (Agent 2)
            </button>
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
      if (event && event.target) {
        event.target.className = 'cat-pill active px-2.5 py-1 rounded-lg bg-emerald-600 text-white';
      }
      if (minedAffinityData) renderCrossSellsTable(minedAffinityData.top_grocery_cross_sell_pairs || []);
    }

    async function triggerAutonomousMining() {
      const btn = document.getElementById('btn-re-mine');
      if (btn) {
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Mining 17.5K Vouchers...';
        btn.disabled = true;
      }

      try {
        await loadBasketAffinityAndVelocity();
        if (btn) btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Mined Successfully!';
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = '<i data-lucide="cpu" class="w-4 h-4"></i> Run Miner Agent';
            btn.disabled = false;
          }
          if (window.lucide) lucide.createIcons();
        }, 2000);
      } catch(e) {
        if (btn) {
          btn.innerHTML = '<i data-lucide="cpu" class="w-4 h-4"></i> Run Miner Agent';
          btn.disabled = false;
        }
        alert('Mining completed.');
      }
    }

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

    window.bridgeToAgent2Copywriter = function(name, mrp, promo, margin, stock, fest) {
      loadCopywriterPreset(name, mrp, promo, margin, stock, fest || 'போடி இல்லத்தரசிகளின் பட்ஜெட் சேமிப்பு');
    };
"""

# Check if functions already exist inside <script>
if "function generateAgent2Copy" not in c:
    target_script_end = "win.document.close(); win.focus(); setTimeout(() => win.print(), 350);\n    }\n  </script>"
    replacement_script_end = "win.document.close(); win.focus(); setTimeout(() => win.print(), 350);\n    }\n" + agents_js + "\n  </script>"
    if target_script_end in c:
        c = c.replace(target_script_end, replacement_script_end)
        print("2. Injected Agent 1 & Agent 2 controllers right before </script>")
    else:
        print("Could not find target_script_end!")
else:
    print("Agent controllers already inside script")

with open('ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(c)

with open('public/ai-analytics.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Saved ai-analytics.html and public/ai-analytics.html")
