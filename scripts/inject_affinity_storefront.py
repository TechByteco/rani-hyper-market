import re

print("=== INJECTING HIGH-AFFINITY CROSS-SELL INTO store.html & public/store.html ===")

with open('store.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject Combo Box in Quick View Modal
modal_target = '<!-- Delivery & Freshness Trust Badges -->'
combo_html = """<!-- FREQUENTLY BOUGHT TOGETHER COMBO (AI AFFINITY MINER LIFT > 1.8X) -->
            <div id="qv-affinity-combo-box" class="hidden mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 shadow-xs">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-black text-gray-900 flex items-center gap-1.5">
                  <i class="fa-solid fa-sparkles text-amber-500"></i> Frequently Bought Together
                </span>
                <span id="qv-affinity-lift-badge" class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                  Lift 3.5x
                </span>
              </div>
              <div class="flex items-center gap-2.5">
                <img id="qv-affinity-item-img" src="" class="w-12 h-12 rounded-xl object-cover bg-white border border-gray-200 shadow-2xs shrink-0">
                <div class="flex-1 min-w-0">
                  <h5 id="qv-affinity-item-title" class="text-xs font-bold text-gray-900 truncate">Companion Item</h5>
                  <div class="flex items-baseline gap-1.5 mt-0.5">
                    <span id="qv-affinity-bundle-price" class="text-xs font-black text-emerald-700">₹0</span>
                    <del id="qv-affinity-regular-price" class="text-[10px] text-gray-400">₹0</del>
                    <span id="qv-affinity-savings" class="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">Save 5%</span>
                  </div>
                </div>
                <button type="button" id="qv-affinity-add-btn" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm shrink-0 transition flex items-center gap-1">
                  <i class="fa-solid fa-plus text-[10px]"></i> Combo
                </button>
              </div>
            </div>

            """

if 'id="qv-affinity-combo-box"' not in content:
    if modal_target in content:
        content = content.replace(modal_target, combo_html + modal_target)
        print("Injected Quick View Combo Box HTML")
    else:
        print("modal_target not found!")
else:
    print("Quick View Combo Box already injected")

# 2. Add Market Basket Affinity Controller JS
affinity_js = """
    /* ══════════════════════════════════════════════════════════════════
       MARKET BASKET AFFINITY & CROSS-SELL CONTROLLER (AGENT 1)
       ══════════════════════════════════════════════════════════════════ */
    window.affinityData = null;
    window.affinityPairMap = new Map();

    async function loadMarketBasketAffinity() {
      try {
        const sources = [
          '/api/analytics/basket-affinity',
          '/high_affinity_cross_sells.json',
          'high_affinity_cross_sells.json'
        ];
        for (const src of sources) {
          try {
            const res = await fetch(src).then(r => r.json());
            if (res && (res.top_grocery_cross_sell_pairs || res.executive_kpis)) {
              window.affinityData = res;
              break;
            }
          } catch(e) {}
        }

        if (window.affinityData && window.affinityData.top_grocery_cross_sell_pairs) {
          window.affinityPairMap.clear();
          window.affinityData.top_grocery_cross_sell_pairs.forEach(pair => {
            const idA = String(pair.item_a.product_id);
            const idB = String(pair.item_b.product_id);
            const titleA = (pair.item_a.name || '').toLowerCase().trim();
            const titleB = (pair.item_b.name || '').toLowerCase().trim();

            if (!window.affinityPairMap.has(idA)) window.affinityPairMap.set(idA, []);
            if (!window.affinityPairMap.has(idB)) window.affinityPairMap.set(idB, []);
            if (!window.affinityPairMap.has(titleA)) window.affinityPairMap.set(titleA, []);
            if (!window.affinityPairMap.has(titleB)) window.affinityPairMap.set(titleB, []);

            window.affinityPairMap.get(idA).push({ companionId: idB, companionTitle: pair.item_b.name, pair });
            window.affinityPairMap.get(idB).push({ companionId: idA, companionTitle: pair.item_a.name, pair });
            window.affinityPairMap.get(titleA).push({ companionId: idB, companionTitle: pair.item_b.name, pair });
            window.affinityPairMap.get(titleB).push({ companionId: idA, companionTitle: pair.item_a.name, pair });
          });
          console.log('⚡ Loaded Basket Affinity Rules: ' + window.affinityPairMap.size + ' product associations mapped (Lift > 1.8x)');
        }
      } catch(err) {
        console.warn('Affinity loader notice:', err);
      }
    }

    window.hasAffinityPair = function(productId, title) {
      if (!window.affinityPairMap || window.affinityPairMap.size === 0) return false;
      const idStr = String(productId);
      const tStr = (title || '').toLowerCase().trim();
      return (window.affinityPairMap.has(idStr) && window.affinityPairMap.get(idStr).length > 0) ||
             (window.affinityPairMap.has(tStr) && window.affinityPairMap.get(tStr).length > 0);
    };

    window.getAffinityPairsFor = function(productId, title) {
      if (!window.affinityPairMap || window.affinityPairMap.size === 0) return [];
      const idStr = String(productId);
      const tStr = (title || '').toLowerCase().trim();
      const byId = window.affinityPairMap.get(idStr) || [];
      const byTitle = window.affinityPairMap.get(tStr) || [];
      const merged = [...byId, ...byTitle];
      const seen = new Set();
      return merged.filter(item => {
        if (seen.has(item.companionId)) return false;
        seen.add(item.companionId);
        return true;
      });
    };

    window.addComboToCart = function(prodIdA, prodIdB, event) {
      if (event) event.stopPropagation();
      const pA = allProducts.find(x => String(x.id) === String(prodIdA));
      const pB = allProducts.find(x => String(x.id) === String(prodIdB));

      if (pA) {
        const existA = cart.find(x => String(x.id) === String(pA.id));
        if (existA) existA.quantity += 1;
        else cart.push({ ...pA, id: pA.id, image_url: getRelevantProductImage(pA.title, pA.image_url, pA.id), quantity: 1 });
      }

      if (pB) {
        const existB = cart.find(x => String(x.id) === String(pB.id));
        if (existB) existB.quantity += 1;
        else cart.push({ ...pB, id: pB.id, image_url: getRelevantProductImage(pB.title, pB.image_url, pB.id), quantity: 1 });
      }

      try {
        localStorage.setItem('nsn_cart', JSON.stringify(cart));
      } catch(e) {}

      updateCartUI();
      syncAllCardSteppers();
      if (pB) showSideCartToast({ ...pB, title: 'Combo Added: ' + (pA ? pA.title.slice(0, 15) : '') + ' + ' + pB.title.slice(0, 15), image_url: getRelevantProductImage(pB.title, pB.image_url, pB.id), quantity: 2 });
    };
"""

if 'function loadMarketBasketAffinity' not in content:
    content = content.replace("</script>\n</body>", affinity_js + "\n  </script>\n</body>")
    print("Injected loadMarketBasketAffinity and affinity helpers")
else:
    print("Affinity helpers already present")

with open('store.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('public/store.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved store.html & public/store.html successfully.")
